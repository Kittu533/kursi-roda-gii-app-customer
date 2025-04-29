<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center px-4 py-3 border-b border-gray-200">
      <button @click="navigateBack" class="mr-3 pulse-on-hover">
        <NuxtIcon name="material-symbols:chevron-left" class="w-5 h-5 text-gray-400" />
      </button>
      <h1 class="text-lg font-medium">Detail Transaksi</h1>
    </div>
    <!-- Animasi loading skeleton untuk memuat detail  -->
    <div v-if="isLoading" class="p-4">
      <div class="animate-pulse">
        <div class="h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

        <div class="space-y-2">
          <div class="flex justify-between">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div class="flex justify-between">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div class="flex justify-between">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="transaction" class="p-4 pb-24 ">
      <div class="px-[25px] py-4 border border-gray-200 rounded-[10px]">
        <!-- Product Image -->
      <div class="mb-4">
        <img
          src="/public/kursi-roda.webp"
          alt="Kursi Roda"
          class="w-full h-[264px] object-contain rounded-lg"
        />
      </div>

      <!-- Product Info -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-medium">{{ transaction.productName }}</h2>
          <p class="text-[12px] bg-orange-100 p-[3px]  rounded-[10px] text-orange-500">Sedang Di proses</p>
        </div>
        <div class="flex justify-between mt-2">
          <span class="text-sm text-gray-500">{{ transaction.agentName }}</span>
          <span class="text-sm text-orange-500">{{
            transaction.wheelchairId
          }}</span>
        </div>
      </div>

      <!-- Transaction Details -->
      <div class="space-y-8">
        <div class="flex justify-between">
          <span class="text-sm">Tanggal Sewa</span>
          <span class="text-sm text-orange-500">{{
            transaction.startDate
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Tanggal Kembali</span>
          <span class="text-sm text-orange-500">{{ transaction.endDate }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Add-on Guide</span>
            <span
            class="text-sm px-2 py-1 rounded"
            :class="transaction.hasGuide ? 'text-green-500 bg-green-100 rounded-[10px] p-[10px]' : 'text-gray-500'"
            >
            {{ transaction.hasGuide ? "Aktif" : "Tidak Aktif" }}
            </span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Total Transaksi</span>
          <span class="text-sm text-orange-500">{{ transaction.price }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Lokasi Antar</span>
          <span class="text-sm text-orange-500">{{
            transaction.deliveryLocation
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Pesan - Ambil</span>
          <button
            @click="navigateToLocationKurir"
            class="text-sm text-orange-500 underline"
          >
            Lihat Alamat Agen
          </button>
        </div>
      </div>

      </div>
      <!-- Action Buttons -->
      <div class="mt-8 space-y-3">
        <button
          v-if="transaction.status === 'ongoing'"
          @click="navigateToScanQR"
          class="w-full py-3 bg-orange-500 text-white rounded-lg font-medium"
        >
          Scan Kursi Roda
        </button>
      </div>
    </div>

    <div v-else class="p-4 flex flex-col items-center justify-center h-[80vh]">
      <p class="text-gray-500">Transaksi tidak ditemukan</p>
      <button
        @click="navigateBack"
        class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
      >
        Kembali
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTransactionStore } from "@/store/transaction";

// Router and store
const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();

// State
const isLoading = ref(true);
const transaction = ref<any>(null);
const transactionId = route.params.id as string;

// Methods
const navigateBack = () => {
  router.push("/transaction");
};

const navigateToScanQR = () => {
  router.push(`/transaction/${transactionId}/scan-qr`);
};

const navigateToLocationKurir = () => {
  router.push(`/transaction/${transactionId}/location-kurir`);
};

// Load transaction data
onMounted(async () => {
  try {
    await transactionStore.fetchTransactions(); // pastikan semua transaksi di-load dulu
    transaction.value = transactionStore.getTransactionById(transactionId);
  } catch (error) {
    console.error("Failed to load transaction:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.pulse-on-hover:active {
  animation: pulse 0.3s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.97);
  }
  100% {
    transform: scale(1);
  }
}
</style>
