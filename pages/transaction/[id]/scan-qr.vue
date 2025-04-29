<template>
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="flex items-center px-4 py-3 border-b border-gray-300">
        <button @click="navigateBack" class="mr-3 pulse-on-hover">
            <NuxtIcon name="material-symbols:chevron-left" class="w-5 h-5 text-gray-400" />
        </button>
        <h1 class="text-lg font-medium">Scan Kursi Roda</h1>
      </div>
  
      <div class="p-4 flex flex-col items-center justify-center h-[80vh]">
        <!-- QR Scanner Frame -->
        <div class="relative w-full max-w-xs aspect-square mb-8">
          <div class="absolute inset-0 border-2 border-orange-500 rounded-lg"></div>
          
          <!-- Corner Markers -->
          <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500 rounded-tl-lg"></div>
          <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500 rounded-tr-lg"></div>
          <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500 rounded-bl-lg"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500 rounded-br-lg"></div>
          
          <!-- Scanner Line Animation -->
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-orange-500 animate-scan"></div>
        </div>
        
        <p class="text-center text-gray-600 mb-4">
          Mohon arahkan pada kode QR kursi roda
        </p>
        
        <button 
          @click="scanSuccess" 
          class="px-6 py-2 bg-orange-500 text-white rounded-lg mt-4"
        >
          Simulasi Scan Berhasil
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { useTransactionStore } from '@/store/transaction'
  import { ref } from 'vue'
  
  // Router and store
  const route = useRoute()
  const router = useRouter()
  const transactionStore = useTransactionStore()
  
  const transactionId = route.params.id as string
  
  // Methods
  const navigateBack = () => {
    router.push(`/transaction/${transactionId}`)
  }
  
  const scanSuccess = async () => {
    try {
      await transactionStore.confirmWheelchairPickup(transactionId)
      // Show success message
      alert('Kursi roda berhasil discan! Anda dapat menggunakan kursi roda sekarang.')
      router.push(`/transaction/${transactionId}`)
    } catch (error) {
      console.error('Failed to confirm pickup:', error)
      alert('Gagal memproses scan. Silakan coba lagi.')
    }
  }
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
  
  @keyframes scan {
    0% {
      top: 0;
    }
    50% {
      top: 100%;
    }
    100% {
      top: 0;
    }
  }
  
  .animate-scan {
    animation: scan 2s linear infinite;
  }
  </style>