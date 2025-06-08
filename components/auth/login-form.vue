<script setup lang="ts">
import { useLoginStore } from '@/store/login'

const login = useLoginStore()

const handleKeyEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    login.sendOtpAndNavigate('/auth/verify-otp')
  }
}
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-md mx-auto px-4">
    <h1 class="text-3xl font-bold mb-8">MASUK</h1>

    <div class="w-full space-y-6">
      <div class="space-y-1 p-4 border border-gray-100 rounded-md overflow-hidden">
        <label class="text-sm text-orange-500">Masukkan No. Whatsapp atau Alamat Email Aktif</label>
        <div class="flex border border-gray-100 rounded-md overflow-hidden">
          <input
            v-model="login.phoneNumber"
            type="text"
            placeholder="Nomor WhatsApp/Email"
            class="flex-1 px-3 py-2 border-none focus:outline-none focus:ring-0"
            :class="{ 'border-red-500 ': login.phoneError }"
            @keyup="handleKeyEnter"
          />
        </div>
        <p v-if="login.phoneError" class="text-[12px] text-red-500">{{ login.phoneError }}</p>
      </div>

      <div class="flex items-start space-x-2">
        <input v-model="login.agreeToTerms" type="checkbox" id="terms"
          class="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
        <label for="terms" class="text-xs text-gray-600">
          Saya menyetujui syarat & ketentuan serta kebijakan yang berlaku
        </label>
      </div>

      <button @click="login.sendOtpAndNavigate('/auth/verify-otp')" :disabled="!login.isFormValid || login.isLoading"
        class="w-full py-3 bg-orange-500 text-white rounded-md font-medium transition-colors"
        :class="{ 'opacity-70 cursor-not-allowed': !login.isFormValid || login.isLoading }">
        <span v-if="login.isLoading">Memproses...</span>
        <span v-else>Masuk</span>
      </button>

      <p v-if="login.apiError" class="text-red-500 text-sm text-center">
        {{ login.apiError }}
      </p>

      <div class="text-center">
        <p class="text-sm">
          Belum punya akun?
          <NuxtLink to="/auth/register" class="text-orange-500 font-medium">Daftar</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
