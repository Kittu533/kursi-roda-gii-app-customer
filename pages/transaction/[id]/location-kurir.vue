<template>
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="flex items-center px-4 py-3 border-b border-gray-300">
        <button @click="navigateBack" class="mr-3 pulse-on-hover">
            <NuxtIcon name="material-symbols:chevron-left" class="w-5 h-5 text-gray-400" />
        </button>
        <h1 class="text-lg font-medium">Posisi Kurir</h1>
      </div>
  
      <!-- Map Container -->
    <div class="h-[60vh] bg-gray-100 relative">
      <!-- Maps Component Placeholder -->
      <ClientOnly>
        <GMaps
        :center="{ lat: -6.2088, lng: 106.8456 }" 
        :zoom="13"
        :markers="[
          { position: { lat: -6.2088, lng: 106.8456 }, title: 'Lokasi Agen' },
          { position: { lat: -6.2100, lng: 106.8400 }, title: 'Lokasi Anda' }
        ]"
        class="w-full h-full"
        />
      </ClientOnly>
    </div>
  
      <!-- Location Timeline -->
      <div class="p-4">
        <h3 class="font-medium mb-4">Perjalanan Kurir</h3>
        
        <div class="space-y-4">
          <div class="flex">
            <div class="mr-3 flex flex-col items-center">
              <div class="w-4 h-4 rounded-full bg-green-500"></div>
              <div class="w-0.5 h-full bg-gray-300 mt-1"></div>
            </div>
            <div>
              <div class="text-sm font-medium">14:30</div>
              <div class="text-xs text-gray-500">Pesananmu sedang dibawa kurir menu lokasi</div>
            </div>
          </div>
          
          <div class="flex">
            <div class="mr-3 flex flex-col items-center">
              <div class="w-4 h-4 rounded-full bg-green-500"></div>
              <div class="w-0.5 h-full bg-gray-300 mt-1"></div>
            </div>
            <div>
              <div class="text-sm font-medium">14:00</div>
              <div class="text-xs text-gray-500">Pesanan diambil</div>
            </div>
          </div>
          
          <div class="flex">
            <div class="mr-3 flex flex-col items-center">
              <div class="w-4 h-4 rounded-full bg-green-500"></div>
            </div>
            <div>
              <div class="text-sm font-medium">13:40</div>
              <div class="text-xs text-gray-500">Pesanan dikonfirmasi</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Contact Courier Button -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button class="w-full py-3 bg-orange-500 text-white rounded-lg font-medium">
          <i class="i-lucide-phone w-5 h-5 mr-2"></i>
          Hubungi Kurir
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { useTransactionStore } from '@/store/transaction'
  import { onMounted } from 'vue';
  
  // Router and store
  const route = useRoute()
  const router = useRouter()
  const transactionStore = useTransactionStore()
  
  const transactionId = route.params.id as string
  
  // Methods
  const navigateBack = () => {
    router.push(`/transaction/${transactionId}`)
  }
  
  onMounted(() => {
    // You can add any initialization logic here if needed
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