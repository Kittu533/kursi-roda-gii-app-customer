<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePackageStore } from '@/store/packages'

const route = useRoute()
const router = useRouter()
const packageStore = usePackageStore()
const id = route.params.id as string

const isLoading = computed(() => packageStore.isLoading)
const error = computed(() => packageStore.error)

// Ambil detail package dari store saat halaman dibuka
onMounted(async () => {
  await packageStore.getPackageDetail(id)
})

// Mapping untuk display di template
const paket = computed(() => {
  const raw = packageStore.selectedPackage
  if (!raw) return null
  return {
    id: raw.id,
    name: raw.name,
    imageUrl: raw.picture || '/detail-paket.webp',
    description: raw.description || '',
    features: [], // isi jika BE support
    price: raw.price ? Number(raw.price) : 0,
    pricePromo: null,     // tambahkan jika BE support
    priceNormal: raw.price ? Number(raw.price) : 0,
    discount: null,       // tambahkan jika BE support
    isPromo: false,       // logic promo jika ada
  }
})

// Format harga
const formatPrice = (price: number | string | null | undefined) => {
  if (!price) return '-'
  const num = typeof price === 'string' ? Number(price) : price
  if (isNaN(num)) return '-'
  return num.toLocaleString('id-ID', { minimumFractionDigits: 0 })
}
</script>

<template>
  <div class="px-4 py-6 space-y-5">
    <div class="flex items-center gap-2 mb-2">
      <NuxtLink to="/home" class="text-xl">
        <i class="fa-solid fa-chevron-left"></i>
      </NuxtLink>
      <h1 class="text-xl font-semibold">Detail Paket</h1>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-gray-400">Memuat data paket...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="paket" class="space-y-5">
      <div class="rounded-xl overflow-hidden">
        <img :src="paket.imageUrl" alt="Gambar Paket" class="w-full object-contain h-48" />
      </div>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ paket.name }}</h2>
        <span v-if="paket.isPromo" class="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full">
          Promo Terbatas
        </span>
      </div>
      <p class="text-sm text-gray-600" v-if="paket.description">{{ paket.description }}</p>

      <div class="bg-white rounded-xl shadow-sm p-4 space-y-3 border border-gray-100">
        <h3 class="font-semibold">Rincian Paket</h3>
        <ul v-if="paket.features && paket.features.length" class="space-y-2 text-sm text-gray-700">
          <li v-for="(fitur, index) in paket.features" :key="index" class="flex items-start gap-2">
            <i class="fa-solid fa-check text-orange-500 mt-1"></i>
            <span>{{ fitur }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-400 text-sm">Tidak ada fitur khusus.</p>
        <div class="pt-3 border-t border-gray-200 space-y-1 text-sm">
          <div class="flex items-center justify-between">
            <p>Harga paket</p>
            <p class="text-orange-500 font-bold text-xl">
              Rp{{ formatPrice(paket.price) }}
            </p>
          </div>
        </div>
      </div>
      <button class="w-full py-4 bg-orange-500 text-white text-center font-semibold rounded-xl hover:bg-orange-600">
        Pesan Sekarang
      </button>
    </div>
    <div v-else class="text-gray-400 text-center">Paket tidak ditemukan.</div>
  </div>
</template>
