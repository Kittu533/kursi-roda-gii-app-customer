<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div class="max-w-md w-full flex flex-col items-center">
        <!-- Wheelchair Image -->
        <img 
          src="/public/kursi-roda.webp" 
          alt="Electric Wheelchair" 
          class="w-48 h-auto mb-8"
        />
        
        <!-- Title -->
        <h1 class="text-2xl font-bold text-center text-gray-900 mb-2">
          Aplikasi Rental Kursi Roda Elektrik
        </h1>
        
        <!-- Subtitle -->
        <p class="text-gray-600 text-center mb-10">
          Hadir untuk memberikan solusi modern, praktis, dan transparan
        </p>
        
        <!-- Start Button -->
        <button 
          @click="startApp" 
          class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors duration-200"
        >
          Mulai Sekarang
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
//   import { useAppStore } from '~/store/app';
  
  const router = useRouter();
//   const appStore = useAppStore();
  
  const startApp = () => {
    // appStore.setOnboarded(true);
    router.push('/auth/login');
  };
  </script>
  
  <style scoped>
  /* Additional custom styles can be added here if needed */
  </style>