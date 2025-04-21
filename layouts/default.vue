<template>
    <div class="min-h-screen bg-gray-50 font-poppins max-w-[412pxp]">
      <div class="max-w-md mx-auto bg-white min-h-screen relative">
        <!-- Main Content -->
        <slot />
        
      </div>
     
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue";
  
  const currentTime = ref("9:41");
  
  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    currentTime.value = `${hours}:${minutes.toString().padStart(2, "0")}`;
  };
  
  let timeInterval: number | null = null;
  
  onMounted(() => {
    updateTime();
    timeInterval = window.setInterval(updateTime, 60000);
  });
  
  onBeforeUnmount(() => {
    if (timeInterval !== null) {
      clearInterval(timeInterval);
    }
  });
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
  
  
  </style>