<script setup lang="ts">
import { useRegisterStore } from '@/store/register'

const register = useRegisterStore()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
    <h1 class="text-3xl font-bold mb-8">DAFTAR</h1>

    <form class="w-full max-w-md space-y-4" @submit.prevent="register.registerCustomerAndRedirect">
      <input v-model="register.registerFullName" type="text" placeholder="Nama Lengkap"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />

      <input v-model="register.registerPhoneNumber" type="tel" placeholder="Contoh: 82241908389"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />

      <input v-model="register.registerEmail" type="email" placeholder="Alamat Email"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400" />

      <select v-model="register.registerGender"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400">
        <option disabled value="">Jenis Kelamin</option>
        <option value="male">Laki-laki</option>
        <option value="female">Perempuan</option>
      </select>

      <button type="submit" :disabled="!register.isRegisterFormValid || register.registerLoading"
        class="w-full py-3 text-white bg-orange-500 rounded-xl font-medium transition-colors"
        :class="{ 'opacity-70': !register.isRegisterFormValid || register.registerLoading }">
        {{ register.registerLoading ? 'Mendaftar...' : 'Daftar' }}
      </button>

      <p v-if="register.registerError" class="text-center text-sm text-red-500">
        {{ register.registerError }}
      </p>

      <div class="text-center text-sm mt-4">
        Sudah punya akun?
        <NuxtLink to="/auth/login" class="text-orange-500 font-medium">Login</NuxtLink>
      </div>
    </form>
  </div>
</template>
