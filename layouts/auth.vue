<template>
    <div class="min-h-screen bg-white">
      <Notification />
      <slot />
    </div>
  </template>
  <script setup lang="ts">
  import Notification from "@/components/notification.vue";
  </script>