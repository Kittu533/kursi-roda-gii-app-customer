<template>
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="flex items-center px-4 py-3 border-b">
        <button @click="navigateBack" class="mr-3 pulse-on-hover">
          <NuxtIcon name="mdi:chevron-left" class="w-6" />
        </button>
        <h1 class="text-lg font-medium">Transaksi</h1>
      </div>
  
      <!-- Tab Navigation -->
      <div class="flex gap-2 mt-4 mb-4 px-8">
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
  
      <!-- Transaction List -->
      <div class="p-4 pb-32">
        <div v-if="isLoading">
          <div
            v-for="i in 2"
            :key="i"
            class="mb-4 border rounded-lg p-4 animate-pulse"
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
                <div class="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
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
            v-for="(transaction, index) in transactions"
            :key="index"
            class="mb-4 border rounded-[10px] p-4"
          >
            <!-- Transaction Header -->
            <div class="flex justify-between mb-3">
              <span class="text-gray-500 font-medium">TODO!</span>
              <span class="text-orange-500 font-medium">KRDO!</span>
            </div>
  
            <!-- Transaction Content -->
            <div class="flex gap-3">
              <div class="rounded-[10px] flex items-center justify-center">
                <img
                  src="/public/kursi-roda.webp"
                  alt="Wheelchair"
                  class="w-[108px] h-[100px]"
                />
              </div>
              <div>
                <h3 class="font-medium">{{ transaction.productName }}</h3>
                <p class="text-sm text-gray-500">{{ transaction.addon }}</p>
                <p class="text-sm text-gray-500">{{ transaction.period }}</p>
                <p class="text-sm font-medium">{{ transaction.price }}</p>
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex justify-end gap-2 mt-3">
              <button
                @click="chatGuide(transaction.id)"
                class="px-4 py-1.5 border rounded-[10px] text-sm"
              >
                Chat Guide
              </button>
              <button
                @click="extendRental(transaction.id)"
                class="px-4 py-1.5 border rounded-[10px] text-sm text-orange-500 border-orange-500"
              >
                Perpanjang
              </button>
            </div>
          </div>
        </div>
  
        <!-- Empty State -->
        <div
          v-if="!isLoading && transactions.length === 0"
          class="flex flex-col items-center justify-center py-10"
        >
          <NuxtIcon
            name="mdi:cart-outline"
            class="w-16 h-16 text-gray-300 mb-4"
          />
          <p class="text-gray-500 text-center">
            Tidak ada transaksi
            {{ activeTab === "ongoing" ? "yang sedang berjalan" : "riwayat" }}
          </p>
        </div>
      </div>
  
      <!-- Footer - Cancellation Button -->
    <div class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white border-t shadow-sm max-w-[425px] w-full">
        <button
          @click="showCancellationModal = true"
          class="flex items-center justify-between w-full px-6 py-3 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-3"
            >
              <NuxtIcon
                name="mdi:close-circle-outline"
                class="w-5 h-5 text-red-500"
              />
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-800">Ajukan Pembatalan</p>
              <p class="text-xs text-gray-500">
                Batalkan transaksi yang sedang berjalan
              </p>
            </div>
          </div>
          <NuxtIcon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
        </button>
      </div>
  
      <BottomNavigation class="fixed bottom-0 left-0 right-0" />
  
      <!-- Cancellation Modal -->
      <Transition name="slide-up">
        <div v-if="showCancellationModal" class="fixed inset-0 z-50">
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-black bg-opacity-50"
            @click="showCancellationModal = false"
          ></div>
          
          <!-- Modal Content -->
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[90vh] overflow-auto">
            <div class="flex justify-between items-center p-4 border-b">
              <h2 class="text-lg font-medium">Pilih Alasan</h2>
              <button @click="showCancellationModal = false" class="text-gray-500">
                <NuxtIcon name="mdi:close" class="w-6 h-6" />
              </button>
            </div>
            
            <div class="p-4">
              <div class="space-y-4">
                <div 
                  v-for="(reason, index) in cancellationReasons" 
                  :key="index"
                  class="flex items-center"
                >
                  <input 
                    type="radio" 
                    :id="`reason-${index}`" 
                    :value="reason" 
                    v-model="selectedReason"
                    class="w-5 h-5 text-orange-500 focus:ring-orange-500"
                  />
                  <label :for="`reason-${index}`" class="ml-3 text-gray-700">
                    {{ reason }}
                  </label>
                </div>
              </div>
              
              <button 
                @click="confirmCancellation"
                class="w-full bg-orange-500 text-white py-3.5 rounded-lg font-medium mt-8 hover:bg-orange-600 transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import BottomNavigation from "~/components/user/bottom-navigation.vue";
  
  interface Transaction {
    id: string;
    productName: string;
    addon: string;
    period: string;
    price: string;
    status: "ongoing" | "completed";
  }
  
  const router = useRouter();
  const isLoading = ref(true);
  const activeTab = ref<"ongoing" | "history">("ongoing");
  const transactions = ref<Transaction[]>([]);
  const showCancellationModal = ref(false);
  const selectedReason = ref('');
  
  // Cancellation reasons
  const cancellationReasons = [
    "Produk rusak saat diterima",
    "Produk tidak sesuai dengan pesanan",
    "Produk tidak layak pakai",
    "Keterlambatan pengiriman atau penerimaan",
    "Kesalahan dalam pemesanan",
    "Lainnya"
  ];
  
  // Sample transaction data
  const ongoingTransactions: Transaction[] = [
    {
      id: "1",
      productName: "Kursi Roda Breezy BasiX²",
      addon: "Add On: Guide",
      period: "19 Feb - 21 Feb",
      price: "Rp 100.000",
      status: "ongoing",
    },
    {
      id: "2",
      productName: "Kursi Roda Breezy BasiX²",
      addon: "Add On: Guide",
      period: "19 Feb - 21 Feb",
      price: "Rp 100.000",
      status: "ongoing",
    },
  ];
  
  const historyTransactions: Transaction[] = [
    {
      id: "3",
      productName: "Kursi Roda Breezy BasiX²",
      addon: "Add On: Guide",
      period: "10 Feb - 12 Feb",
      price: "Rp 100.000",
      status: "completed",
    },
  ];
  
  // Watch for tab changes
  watch(activeTab, (newTab) => {
    isLoading.value = true;
  
    // Simulate API call delay
    setTimeout(() => {
      transactions.value =
        newTab === "ongoing" ? ongoingTransactions : historyTransactions;
      isLoading.value = false;
    }, 500);
  });
  
  // Navigate back
  const navigateBack = () => {
    router.push("/account");
  };
  
  // Chat with guide
  const chatGuide = (transactionId: string) => {
    console.log(`Opening chat for transaction: ${transactionId}`);
    // In a real app, you would navigate to a chat page or open a chat modal
  };
  
  // Extend rental
  const extendRental = (transactionId: string) => {
    console.log(`Extending rental for transaction: ${transactionId}`);
    // In a real app, you would navigate to an extension page or open a modal
  };
  
  // Request cancellation
  const requestCancellation = () => {
    showCancellationModal.value = true;
  };
  
  // Confirm cancellation
  const confirmCancellation = () => {
    if (!selectedReason.value) {
      alert('Silakan pilih alasan pembatalan');
      return;
    }
    
    console.log(`Cancellation confirmed with reason: ${selectedReason.value}`);
    // In a real app, you would send this to your API
    
    // Close modal and show success message
    showCancellationModal.value = false;
    selectedReason.value = '';
    
    // Show success message (in a real app, you would use a toast notification)
    alert('Permintaan pembatalan berhasil diajukan');
  };
  
  // Load initial data
  onMounted(() => {
    // Simulate API call
    setTimeout(() => {
      transactions.value = ongoingTransactions;
      isLoading.value = false;
    }, 800);
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
  
  /* Slide up animation for modal */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-up-enter-from {
    transform: translateY(100%);
  }
  
  .slide-up-leave-to {
    transform: translateY(100%);
  }
  </style>