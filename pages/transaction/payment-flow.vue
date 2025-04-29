<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center">
        <button @click="goBack" class="mr-3">
          <NuxtIcon name="mdi:chevron-left" class="w-6 h-6" />
        </button>
        <h1 class="text-lg font-medium">Pembayaran</h1>
      </div>
  
      <!-- Payment Steps -->
      <div class="bg-white p-4 mb-2">
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm mb-1">
              1
            </div>
            <span class="text-xs text-orange-500 font-medium">Pesanan</span>
          </div>
          <div class="flex-1 h-1 bg-orange-500 mx-2"></div>
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm mb-1">
              2
            </div>
            <span class="text-xs text-orange-500 font-medium">Pembayaran</span>
          </div>
          <div class="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm mb-1">
              3
            </div>
            <span class="text-xs text-gray-400">Selesai</span>
          </div>
        </div>
      </div>
  
      <!-- Order Summary -->
      <div class="bg-white p-4 mb-2 rounded-lg">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-sm font-medium">Ringkasan Pesanan</h2>
          <button class="text-xs text-orange-500">Lihat Detail</button>
        </div>
        
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-500">Total Pesanan (1 item)</span>
          <span>Rp130.000</span>
        </div>
        
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-500">Biaya Pengiriman</span>
          <span>Rp13.000</span>
        </div>
        
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-500">Diskon Voucher</span>
          <span class="text-green-500">-Rp25.000</span>
        </div>
        
        <div class="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
          <span class="text-sm font-medium">Total Pembayaran</span>
          <span class="text-orange-500 font-medium">Rp118.000</span>
        </div>
      </div>
  
      <!-- Payment Methods -->
      <div class="bg-white p-4 mb-2 rounded-lg">
        <h2 class="text-sm font-medium mb-3">Metode Pembayaran</h2>
        
        <!-- Payment Method Tabs -->
        <div class="flex border-b border-gray-200 mb-4">
          <button 
            v-for="tab in paymentTabs" 
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            class="py-2 px-4 text-sm relative"
            :class="activeTab === tab.id ? 'text-orange-500' : 'text-gray-500'"
          >
            {{ tab.name }}
            <div 
              v-if="activeTab === tab.id" 
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
            ></div>
          </button>
        </div>
        
        <!-- E-Wallet Methods -->
        <div v-if="activeTab === 'ewallet'" class="space-y-3">
          <div 
            v-for="method in eWalletMethods" 
            :key="method.id"
            @click="selectPaymentMethod(method)"
            class="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
            :class="{'border-orange-500 bg-orange-50': selectedMethod?.id === method.id, 'border-gray-200': selectedMethod?.id !== method.id}"
          >
            <div class="flex items-center">
              <img :src="method.icon" :alt="method.name" class="w-8 h-8 mr-3" />
              <span class="text-sm">{{ method.name }}</span>
            </div>
            <div class="w-5 h-5 rounded-full border flex items-center justify-center"
                 :class="{'border-orange-500': selectedMethod?.id === method.id, 'border-gray-300': selectedMethod?.id !== method.id}">
              <div v-if="selectedMethod?.id === method.id" class="w-3 h-3 rounded-full bg-orange-500"></div>
            </div>
          </div>
        </div>
        
        <!-- Bank Transfer Methods -->
        <div v-if="activeTab === 'bank'" class="space-y-3">
          <div 
            v-for="method in bankMethods" 
            :key="method.id"
            @click="selectPaymentMethod(method)"
            class="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
            :class="{'border-orange-500 bg-orange-50': selectedMethod?.id === method.id, 'border-gray-200': selectedMethod?.id !== method.id}"
          >
            <div class="flex items-center">
              <img :src="method.icon" :alt="method.name" class="w-8 h-8 mr-3" />
              <span class="text-sm">{{ method.name }}</span>
            </div>
            <div class="w-5 h-5 rounded-full border flex items-center justify-center"
                 :class="{'border-orange-500': selectedMethod?.id === method.id, 'border-gray-300': selectedMethod?.id !== method.id}">
              <div v-if="selectedMethod?.id === method.id" class="w-3 h-3 rounded-full bg-orange-500"></div>
            </div>
          </div>
        </div>
        
        <!-- Credit Card Methods -->
        <div v-if="activeTab === 'card'" class="space-y-3">
          <div 
            v-for="method in cardMethods" 
            :key="method.id"
            @click="selectPaymentMethod(method)"
            class="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
            :class="{'border-orange-500 bg-orange-50': selectedMethod?.id === method.id, 'border-gray-200': selectedMethod?.id !== method.id}"
          >
            <div class="flex items-center">
              <img :src="method.icon" :alt="method.name" class="w-8 h-8 mr-3" />
              <span class="text-sm">{{ method.name }}</span>
            </div>
            <div class="w-5 h-5 rounded-full border flex items-center justify-center"
                 :class="{'border-orange-500': selectedMethod?.id === method.id, 'border-gray-300': selectedMethod?.id !== method.id}">
              <div v-if="selectedMethod?.id === method.id" class="w-3 h-3 rounded-full bg-orange-500"></div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Payment Button -->
      <div class="sticky bottom-0 bg-white p-4 border-t border-gray-200">
        <button 
          @click="processPayment" 
          class="w-full py-3 bg-orange-500 text-white rounded-lg font-medium"
          :disabled="!selectedMethod"
          :class="{'opacity-50': !selectedMethod}"
        >
          Bayar Sekarang
        </button>
      </div>
  
      <!-- Payment Processing Modal -->
      <div v-if="showProcessingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-md p-6 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 class="text-lg font-medium mb-2">Memproses Pembayaran</h3>
          <p class="text-sm text-gray-500 mb-4">Mohon tunggu sebentar, Anda akan diarahkan ke halaman pembayaran...</p>
        </div>
      </div>
  
      <!-- Payment Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <NuxtIcon name="mdi:check" class="w-8 h-8 text-green-500" />
          </div>
          <h3 class="text-lg font-medium text-center mb-2">Pembayaran Berhasil!</h3>
          <p class="text-sm text-gray-500 text-center mb-6">Pesanan Anda telah dikonfirmasi dan sedang diproses</p>
          
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-500">ID Transaksi</span>
              <span class="text-sm font-medium">TRX-12345678</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-500">Metode Pembayaran</span>
              <span class="text-sm font-medium">{{ selectedMethod?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Total Pembayaran</span>
              <span class="text-sm font-medium">Rp118.000</span>
            </div>
          </div>
          
          <button @click="goToOrderStatus" class="w-full py-3 bg-orange-500 text-white rounded-lg font-medium mb-3">
            Lihat Status Pesanan
          </button>
          <button @click="goToHome" class="w-full py-3 border border-orange-500 text-orange-500 rounded-lg font-medium">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  
  const router = useRouter();
  
  // Payment tabs
  const paymentTabs = [
    { id: 'ewallet', name: 'E-Wallet' },
    { id: 'bank', name: 'Transfer Bank' },
    { id: 'card', name: 'Kartu Kredit' }
  ];
  
  const activeTab = ref('');
  
  // Payment methods
  interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
    type: string;
  }
  
  const eWalletMethods = [
    { id: 'gopay', name: 'GoPay', icon: '/placeholder.svg?height=32&width=32', type: 'ewallet' },
    { id: 'ovo', name: 'OVO', icon: '/placeholder.svg?height=32&width=32', type: 'ewallet' },
    { id: 'dana', name: 'DANA', icon: '/placeholder.svg?height=32&width=32', type: 'ewallet' },
    { id: 'shopeepay', name: 'ShopeePay', icon: '/placeholder.svg?height=32&width=32', type: 'ewallet' }
  ];
  
  const bankMethods = [
    { id: 'bca', name: 'Bank BCA', icon: '/placeholder.svg?height=32&width=32', type: 'bank' },
    { id: 'bni', name: 'Bank BNI', icon: '/placeholder.svg?height=32&width=32', type: 'bank' },
    { id: 'bri', name: 'Bank BRI', icon: '/placeholder.svg?height=32&width=32', type: 'bank' },
    { id: 'mandiri', name: 'Bank Mandiri', icon: '/placeholder.svg?height=32&width=32', type: 'bank' }
  ];
  
  const cardMethods = [
    { id: 'visa', name: 'Visa', icon: '/placeholder.svg?height=32&width=32', type: 'card' },
    { id: 'mastercard', name: 'Mastercard', icon: '/placeholder.svg?height=32&width=32', type: 'card' }
  ];
  
  // Selected payment method
  const selectedMethod = ref<PaymentMethod | null>(null);
  
  // Modal states
  const showProcessingModal = ref(false);
  const showSuccessModal = ref(false);
  
  // Set initial tab on mount to avoid hook call conditionally
  onMounted(() => {
    activeTab.value = 'ewallet';
  });
  
  // Select payment method
  const selectPaymentMethod = (method: PaymentMethod) => {
    selectedMethod.value = method;
  };
  
  // Process payment
  const processPayment = () => {
    if (!selectedMethod.value) return;
    
    showProcessingModal.value = true;
    
    // Simulate payment processing
    setTimeout(() => {
      showProcessingModal.value = false;
      showSuccessModal.value = true;
    }, 2000);
  };
  
  // Navigation functions
  const goBack = () => {
    router.back();
  };
  
  const goToOrderStatus = () => {
    showSuccessModal.value = false;
    router.push('/transaction');
  };
  
  const goToHome = () => {
    showSuccessModal.value = false;
    router.push('/home');
  };
  
  const setActiveTab = (tabId: string) => {
    activeTab.value = tabId;
  };
  </script>
  
  <style scoped>
  /* Animation for spinner */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  </style>