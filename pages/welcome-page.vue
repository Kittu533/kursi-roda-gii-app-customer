<template>
  <NuxtLink
    to="/intro"
    class="flex flex-col items-center justify-center min-h-screen bg-white px-4"
  >
    <div class="max-w-md w-full flex flex-col items-center">
      <!-- Wheelchair Image -->
      <img
        src="/public/logo-app.webp"
        alt="Electric Wheelchair"
        class="w-[200px] h-auto mb-8"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const countdown = ref(3);
const isRedirecting = ref(false);

const startApp = () => {
  isRedirecting.value = true;
  router.push("/intro");
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