<template>
    <div class="flex flex-col min-h-screen bg-white">
      <PaymentHeader title="Kode Pembayaran" />
      
      <div class="flex-1 p-4 flex flex-col items-center justify-center">
        <div class="border border-orange-300 rounded-lg p-6 w-full max-w-md">
          <p class="text-center mb-4">Kode QR berakhir dalam {{ formatTime(timeLeft) }}</p>
          
          <div class="flex justify-center mb-6">
            <img src="public/kursi-roda.webp" alt="QR Code" class="w-64 h-64" />
          </div>
          
          <p class="text-center text-sm mb-2">Total Pembayaran</p>
          <p class="text-center text-orange-500 font-medium mb-4">Rp {{ formatPrice(totalAmount) }}</p>
          
          <p class="text-center text-xs text-gray-600">
            Silahkan scan kode QR menggunakan aplikasi M-Banking atau E-Wallet
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const totalAmount = ref(780000);
  const timeLeft = ref(5 * 60); // 5 minutes in seconds
  let timer: any = null;
  
  onMounted(() => {
    timer = setInterval(updateTimer, 1000);
  });
  
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });
  
  const updateTimer = () => {
    if (timeLeft.value <= 0) {
      clearInterval(timer);
      alert('QR Code expired. Please generate a new one.');
      return;
    }
    
    timeLeft.value--;
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  </script>