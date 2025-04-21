<template>
  <div
    class="animate-pulse bg-gray-100 rounded"
    :style="{ width, height }"
  ></div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "20px",
  },
});
</script>
