<template>
    <button 
      class="w-full bg-orange-500 text-white py-3 rounded-md font-medium"
      @click="$emit('click')"
    >
      <slot>Konfirmasi</slot>
    </button>
  </template>
  
  <script setup lang="ts">
  defineEmits(['click']);
  </script>