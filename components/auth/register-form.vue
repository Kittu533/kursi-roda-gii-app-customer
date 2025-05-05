<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen px-4 bg-white"
  >
    <h1 class="text-3xl font-bold mb-8">MASUK</h1>
    <form class="w-full max-w-md space-y-4" @submit.prevent="handleLogin">
      <!-- Nama Lengkap -->
      <input
        v-model="fullName"
        type="text"
        placeholder="Nama Lengkap"
        class="w-full px-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <!-- Nomor Telepon -->
      <input
        v-model="phoneNumber"
        type="tel"
        placeholder="+62 89673647187"
        class="w-full px-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <!-- Email -->
      <input
        v-model="email"
        type="email"
        placeholder="Alamat Email"
        class="w-full px-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <!-- Jenis Kelamin -->
      <select
        v-model="gender"
        class="w-full px-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option disabled value="">Jenis Kelamin</option>
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>
    </form>
    <!-- Tombol -->
    <NuxtLink
      to="/auth/login"
      class="w-full py-3 mt-4 text-center text-white bg-orange-500 rounded-xl font-medium transition-colors"
      :class="{
        'opacity-70 cursor-not-allowed': !isFormValid || isLoading,
        'hover:bg-orange-600': isFormValid && !isLoading,
      }"
    >
      Login
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const fullName = ref("");
const phoneNumber = ref("");
const email = ref("");
const gender = ref("");
const isLoading = ref(false);

const isFormValid = computed(
  () => fullName.value && phoneNumber.value && email.value && gender.value
);

function handleLogin() {
  isLoading.value = true;
  setTimeout(() => {
    alert("Form disubmit!");
    isLoading.value = false;
  }, 1000);
}
</script>
