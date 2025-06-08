<script setup lang="ts">
import { useOtpStore } from '@/store/otp'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const router = useRouter()
const otp = useOtpStore()
const inputRefs = ref<HTMLInputElement[]>([])

onMounted(() => {
  otp.startTimer()
  inputRefs.value[0]?.focus()
})

const formatTime = computed(() => {
  const m = Math.floor(otp.timer / 60).toString().padStart(2, '0')
  const s = (otp.timer % 60).toString().padStart(2, '0')
  return `${m}.${s}`
})

const isOtpComplete = computed(() => otp.digits.every(d => d))

const onDigitInput = (i: number) => {
  otp.digits[i] = otp.digits[i].slice(0, 1)
  if (otp.digits[i] && i < 5) inputRefs.value[i + 1]?.focus()
  otp.error = ''
}

const onKeyDown = (e: KeyboardEvent, i: number) => {
  if (e.key === 'Backspace' && !otp.digits[i] && i > 0) {
    otp.digits[i - 1] = ''
    inputRefs.value[i - 1]?.focus()
  }
}

const goToLocation = () => {
  otp.clear()
  router.push('/auth/location-access')
}
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-md mx-auto px-4">
    <h1 class="text-3xl font-bold mb-4">Verifikasi OTP</h1>
    <div class="text-orange-500 font-medium mb-8">{{ formatTime }}</div>

    <div class="w-full space-y-6">
      <div class="grid grid-cols-6 gap-2">
        <input v-for="(_, i) in 6" :key="i" v-model="otp.digits[i]" maxlength="1"
          class="w-full aspect-square text-center text-xl font-medium border border-gray-300 rounded-md outline-none"
          :class="{ 'border-red-500': otp.error }" @input="onDigitInput(i)" @keydown="onKeyDown($event, i)"
          ref="inputRefs" />
      </div>

      <p v-if="otp.error" class="text-sm text-red-500">{{ otp.error }}</p>

      <div class="text-center">
        <p class="text-sm">
          Tidak mendapatkan OTP?
          <button @click="otp.resendOtp" class="text-orange-500 font-medium">Kirim Ulang</button>
        </p>
      </div>

      <button @click="otp.verifyOtp" :disabled="!isOtpComplete || otp.loading"
        class="w-full py-3 bg-orange-500 text-white rounded-md font-medium transition-colors"
        :class="{ 'opacity-70': !isOtpComplete || otp.loading }">
        {{ otp.loading ? 'Loading...' : 'Verifikasi' }}
      </button>
    </div>

    <div v-if="otp.verified" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="text-xl font-bold mb-2">Verifikasi berhasil!</h2>
          <p class="text-gray-600 mb-6">Anda kini dapat mengakses semua fitur aplikasi Wheel Care.</p>
          <button @click="goToLocation"
            class="w-full py-3 bg-orange-500 text-white rounded-md font-medium">Lanjut</button>
        </div>
      </div>
    </div>
  </div>
</template>
