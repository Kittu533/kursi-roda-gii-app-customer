<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-white px-4"
  >
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
      <!-- Countdown Timer -->
      <div class="text-lg text-gray-600 mb-4">
        Redirect dalam {{ countdown }} detik
      </div>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const countdown = ref(3);
const isRedirecting = ref(false);

const startApp = () => {
  isRedirecting.value = true;
  router.push("/auth/login");
};

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(timer);
      if (!isRedirecting.value) {
        startApp();
      }
    }
  }, 1000);
});
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>
