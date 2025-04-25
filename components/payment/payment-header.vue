<template>
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center">
      <button @click="$router.back()" class="mr-3">
        <NuxtIcon name="mdi:chevron-left" class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-medium">{{ title }}</h1>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: true
    }
  });
  </script>