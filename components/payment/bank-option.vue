<template>
    <div 
      class="flex items-center justify-between p-3 border-b cursor-pointer"
      @click="$emit('click')"
    >
      <div class="flex items-center">
        <div v-if="bank.logo" class="w-8 h-8 mr-3">
          <img :src="bank.logo" :alt="bank.name" class="w-full h-full object-contain" />
        </div>
        <div v-else-if="bank.icon" class="w-8 h-8 mr-3 flex items-center justify-center">
          <NuxtIcon :name="bank.icon" class="w-6 h-6 text-gray-700" />
        </div>
        <span class="text-sm">{{ bank.name }}</span>
      </div>
      <div v-if="bank.selected">
        <NuxtIcon name="mdi:check" class="w-5 h-5 text-orange-500" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    bank: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['click']);
  </script>