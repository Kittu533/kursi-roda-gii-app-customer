<script setup lang="ts">
import { useLocationStore } from '@/store/location'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const locationStore = useLocationStore()
const router = useRouter()
const auth = useAuthStore()
auth.hydrateFromStorage()
const getLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung oleh browser Anda')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      locationStore.setLocation(lat, lng)

      // ✅ Arahkan ke home setelah berhasil
      router.push('/home')
    },
    (err) => {
      alert('Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.')
      console.error(err)
    }
  )
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
    <img src="/public/search-location.webp" alt="Lokasi" class="w-60 mb-6" />
    <h2 class="text-xl font-bold mb-2">Izinkan Akses Lokasi</h2>
    <p class="text-sm text-gray-600 mb-4">
      Aplikasi memerlukan izin lokasi untuk memberikan layanan yang sesuai dengan kebutuhan Anda.
    </p>
    <button @click="getLocation" class="bg-orange-500 text-white py-2 px-6 rounded-md">
      Izinkan Lokasi
    </button>
  </div>
</template>
