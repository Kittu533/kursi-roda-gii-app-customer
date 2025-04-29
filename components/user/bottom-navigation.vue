<template>
  <div class="fixed bottom-0 left-0 right-0 flex justify-center z-10 ">
    <div class="bg-white border-t border-gray-200 flex justify-around items-center h-[87px] w-full ">
      <NuxtLink
        to="/home"
        class="flex flex-col items-center justify-center w-1/3 h-full"
        :class="{ 'text-orange-500': currentRoute === '/' }"
      >
        <NuxtIcon name="material-symbols-light:home" class="h-5 w-5" />
        <span class="text-xs">Beranda</span>
      </NuxtLink>

      <NuxtLink
        to="/transaction"
        class="flex flex-col items-center justify-center w-1/3 h-full"
        :class="{ 'text-orange-500': currentRoute === '/transaction' }"
      >
        <NuxtIcon name="material-symbols-light:description-outline-sharp" class="h-5 w-5" />
        <span class="text-xs">Transaksi</span>
      </NuxtLink>

      <NuxtLink
        to="/account"
        class="flex flex-col items-center justify-center w-1/3 h-full"
        :class="{ 'text-orange-500': currentRoute === '/account' }"
      >
        <NuxtIcon name="material-symbols-light:person" class="h-5 w-5" />
        <span class="text-xs">Akun</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const currentRoute = computed(() => route.path);
</script>