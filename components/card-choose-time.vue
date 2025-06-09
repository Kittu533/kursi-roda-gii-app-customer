<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 w-full max-w-md mx-auto">
    <!-- Tab Header -->
    <div class="flex justify-between mb-4">
      <button @click="activeTab = 'perhari'" :class="[
        'w-1/2 text-center font-semibold text-lg',
        activeTab === 'perhari' ? 'text-orange-500' : 'text-gray-500'
      ]">
        Perhari
        <div v-if="activeTab === 'perhari'" class="w-10 mx-auto mt-1 border-b-2 border-orange-500"></div>
      </button>
      <button @click="activeTab = 'perjam'" :class="[
        'w-1/2 text-center font-semibold text-lg',
        activeTab === 'perjam' ? 'text-orange-500' : 'text-gray-500'
      ]">
        Perjam
        <div v-if="activeTab === 'perjam'" class="w-10 mx-auto mt-1 border-b-2 border-orange-500"></div>
      </button>
    </div>

    <!-- Form Perhari -->
    <div v-if="activeTab === 'perhari'" class="space-y-4">
      <div class="relative">
        <input type="date" v-model="tanggalSewa"
          class="hide-default-icon w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:outline-none" />
        <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <NuxtIcon name="mdi:calendar" class="text-[18px] text-orange-500" />
        </div>
      </div>

      <div class="relative">
        <input type="date" v-model="tanggalKembali"
          class="hide-default-icon w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:outline-none" />
        <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <NuxtIcon name="mdi:calendar" class="text-[18px] text-orange-500" />
        </div>
      </div>
    </div>


    <!-- Form Perjam -->
    <div v-if="activeTab === 'perjam'" class="space-y-4">
      <div class="relative">
        <input type="date" v-model="tanggalJam"
          class="hide-default-icon w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:outline-none" />
        <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <NuxtIcon name="mdi:calendar" class="text-[18px] text-orange-500" />
        </div>
      </div>

      <div class="flex gap-3">
        <div class="relative w-1/2">
          <input type="time" v-model="jamSewa"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:outline-none" />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
            <i class="fa-solid fa-clock"></i>
          </div>
        </div>
        <div class="relative w-1/2">
          <input type="time" v-model="jamKembali"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:outline-none" />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
            <i class="fa-solid fa-clock"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Tombol Cari -->
    <button
      class="mt-5 w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
      @click="cari">
      Cari
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type PerHariPayload = { mode: 'perhari', tanggalSewa: string, tanggalKembali: string }
type PerJamPayload = { mode: 'perjam', tanggal: string, jamSewa: string, jamKembali: string }
type SearchPayload = PerHariPayload | PerJamPayload

const emit = defineEmits < {
  (e: 'search', payload: SearchPayload): void
}> ()

const activeTab = ref < 'perhari' | 'perjam' > ('perhari')
const tanggalSewa = ref('')
const tanggalKembali = ref('')
const tanggalJam = ref('')
const jamSewa = ref('')
const jamKembali = ref('')

function cari() {
  console.log('Function cari() clicked')
  if (activeTab.value === 'perhari') {
    console.log('Mode: perhari', { tanggalSewa: tanggalSewa.value, tanggalKembali: tanggalKembali.value })
    if (!tanggalSewa.value || !tanggalKembali.value) {
      alert('Mohon lengkapi tanggal sewa dan tanggal kembali.')
      return
    }
    emit('search', {
      mode: 'perhari',
      tanggalSewa: tanggalSewa.value,
      tanggalKembali: tanggalKembali.value
    })
  } else {
    console.log('Mode: perjam', { tanggal: tanggalJam.value, jamSewa: jamSewa.value, jamKembali: jamKembali.value })
    if (!tanggalJam.value || !jamSewa.value || !jamKembali.value) {
      alert('Mohon lengkapi tanggal dan jam sewa serta jam kembali.')
      return
    }
    emit('search', {
      mode: 'perjam',
      tanggal: tanggalJam.value,
      jamSewa: jamSewa.value,
      jamKembali: jamKembali.value
    })
  }
  console.log('Search event emitted')
}
</script>
