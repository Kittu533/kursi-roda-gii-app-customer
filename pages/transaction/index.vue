<template>
  <div class="min-h-screen bg-white">
    <div class="sticky top-0 bg-white z-10 ">
      <!-- Header -->
    <div class="flex items-center px-4 py-3 border-b border-gray-200 mx-6">
      <h1 class="text-lg font-medium">Transaksi</h1>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-2 mt-4 mb-4 px-4 ">
      <button
        @click="activeTab = 'ongoing'"
        class="flex-1 py-2 px-4 text-center font-medium text-sm rounded-[10px]"
        :class="
          activeTab === 'ongoing'
            ? 'bg-orange-500 text-white'
            : 'bg-white border border-orange-500 text-orange-500'
        "
      >
        Sedang Berjalan
      </button>
      <button
        @click="activeTab = 'history'"
        class="flex-1 py-2 px-4 text-center font-medium text-sm rounded-[10px]"
        :class="
          activeTab === 'history'
            ? 'bg-orange-500 text-white'
            : 'bg-white border border-orange-500 text-orange-500'
        "
      >
        Riwayat
      </button>
    </div>
    </div>

    <!-- Empty States -->
    <div
      v-if="!isLoading && filteredTransactions.length === 0"
      class="p-4 pb-32"
    >
      <div class="flex flex-col items-center justify-center py-10">
        <div class="w-32 h-32 mb-6 flex items-center justify-center">
          <img
            src="/public/no-data-transaction.webp"
            alt="Empty transactions"
            class="w-full h-full"
          />
        </div>
        <p class="text-center text-gray-600">
          Anda belum memiliki
          {{ activeTab === "ongoing" ? "transaksi" : "riwayat transaksi" }}
        </p>
      </div>
    </div>

    <!-- Transaction List -->
    <div v-else class="p-4 pb-32">
      <div v-if="isLoading">
        <div
          v-for="i in 2"
          :key="i"
          class="mb-4 border border-gray-200 rounded-lg p-4 animate-pulse"
        >
          <div class="flex justify-between mb-3">
            <div class="h-4 bg-gray-200 rounded w-16"></div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div class="flex gap-3">
            <div class="w-16 h-16 bg-gray-200 rounded"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-3">
            <div class="h-8 bg-gray-200 rounded w-24"></div>
            <div class="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="mb-4 border border-gray-200 rounded-[10px] p-4 cursor-pointer"
          @click="navigateToDetail(transaction.id)"
        >
          <!-- Transaction ID and Status -->
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-500 font-medium">
              {{ transaction.id }}
            </span>
            <span
              class="text-xs font-semibold"
              :class="getStatusClass(transaction.status)"
            >
              {{ getStatusLabel(transaction) }}
            </span>
          </div>

          <!-- Transaction Content -->
          <div class="flex gap-3">
            <div class="w-20 h-20">
              <img
                src="/public/kursi-roda.webp"
                alt="Kursi Roda"
                class="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 class="font-medium text-sm">{{ transaction.productName }}</h3>
              <p v-if="transaction.addon" class="text-xs text-gray-500">
                {{ transaction.addon }}
              </p>
              <p class="text-xs text-gray-500">{{ transaction.period }}</p>
              <p class="text-sm font-medium mt-1">{{ transaction.price }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 mt-3">
            <button
              v-if="transaction.status === 'pending'"
              @click.stop="showCancelConfirmation(transaction.id)"
              class="px-4 py-1.5 border border-gray-300 rounded-[10px] text-sm"
            >
              Batalkan
            </button>
            <button
              v-if="transaction.status === 'pending'"
              @click.stop="navigateToPayment(transaction.id)"
              class="px-4 py-1.5 bg-orange-500 text-white rounded-[10px] text-sm"
            >
              Bayar
            </button>
            <button
              v-if="transaction.status === 'ongoing' && transaction.hasGuide"
              @click.stop="navigateToChat(transaction.id)"
              class="px-4 py-1.5 border border-orange-500 text-orange-500 rounded-[10px] text-sm"
            >
              Chat Guide
            </button>
            <button
              v-if="transaction.status !== 'pending'"
              @click.stop="navigateToDetail(transaction.id)"
              class="px-4 py-1.5 bg-orange-500 text-white rounded-[10px] text-sm"
            >
              {{
                transaction.status === "completed"
                  ? "Lihat Detail"
                  : "Ambil Produk"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancellation Confirmation Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Konfirmasi Pembatalan</h3>
          <button @click="showCancelModal = false" class="text-gray-500">
            <i class="i-lucide-x w-5 h-5"></i>
          </button>
        </div>

        <p class="mb-4">Apakah Anda yakin ingin membatalkan transaksi ini?</p>

        <div class="flex justify-end gap-2">
          <button
            @click="showCancelModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Tidak
          </button>
          <button
            @click="confirmCancellation"
            class="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>

       <!-- Bottom Navigation -->
       <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTransactionStore } from "@/store/transaction";
import BottomNavigation from "~/components/user/bottom-navigation.vue";

// Router and store
const router = useRouter();
const transactionStore = useTransactionStore();

// State
const isLoading = ref(true);
const activeTab = ref("ongoing");
const showCancelModal = ref(false);
const transactionToCancel = ref<string | null>(null);

// Computed
const filteredTransactions = computed(() => {
  if (activeTab.value === "ongoing") {
    return transactionStore.transactions.filter(
      (t) => t.status === "pending" || t.status === "ongoing"
    );
  } else {
    return transactionStore.transactions.filter(
      (t) => t.status === "completed" || t.status === "returned"
    );
  }
});

// Methods
const navigateBack = () => {
  router.push("/account");
};

const navigateToDetail = (id: string) => {
  router.push(`/transaction/${id}`);
};

const navigateToChat = (id: string) => {
  router.push(`/transaction/${id}/chat`);
};

const navigateToPayment = (id: string) => {
  router.push(`/transaction/${id}/payment`);
};

const getStatusLabel = (transaction: any) => {
  switch (transaction.status) {
    case "pending":
      return "Belum bayar";
    case "ongoing":
      return transaction.wheelchairId;
    case "completed":
      return "Selesai";
    case "returned":
      return "Pengembalian Berhasil";
    default:
      return transaction.status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "pending":
      return "text-orange-500";
    case "ongoing":
      return "text-orange-500";
    case "completed":
      return "text-green-500";
    case "returned":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

const showCancelConfirmation = (id: string) => {
  transactionToCancel.value = id;
  showCancelModal.value = true;
};

const confirmCancellation = () => {
  if (transactionToCancel.value) {
    transactionStore.cancelTransaction(transactionToCancel.value);
    showCancelModal.value = false;
    transactionToCancel.value = null;
  }
};

// Load data
onMounted(async () => {
  try {
    await transactionStore.fetchTransactions();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.pulse-on-hover {
  transition: transform 0.3s;
}

.pulse-on-hover:active {
  transform: scale(0.95);
}
</style>
