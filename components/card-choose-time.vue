<template>
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 w-full max-w-md mx-auto">
      <!-- Tab Header -->
      <div class="flex justify-between mb-4">
        <button
          @click="activeTab = 'perhari'"
          :class="[
            'w-1/2 text-center font-semibold text-lg',
            activeTab === 'perhari' ? 'text-orange-500' : 'text-gray-500'
          ]"
        >
          Perhari
          <div
            v-if="activeTab === 'perhari'"
            class="w-10 mx-auto mt-1 border-b-2 border-orange-500"
          ></div>
        </button>
        <button
          @click="activeTab = 'perjam'"
          :class="[
            'w-1/2 text-center font-semibold text-lg',
            activeTab === 'perjam' ? 'text-orange-500' : 'text-gray-500'
          ]"
        >
          Perjam
          <div
            v-if="activeTab === 'perjam'"
            class="w-10 mx-auto mt-1 border-b-2 border-orange-500"
          ></div>
        </button>
      </div>
  
      <!-- Perhari Form -->
      <div v-if="activeTab === 'perhari'" class="space-y-4">
        <div class="relative">
          <input
            type="date"
            v-model="tanggalSewa"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 text-gray-700 focus:outline-none"
            placeholder="Tanggal Sewa"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
            <i class="fa-solid fa-calendar-days"></i>
          </div>
        </div>
        <div class="relative">
          <input
            type="date"
            v-model="tanggalKembali"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 text-gray-700 focus:outline-none"
            placeholder="Tanggal Kembali"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
            <i class="fa-solid fa-calendar-days"></i>
          </div>
        </div>
      </div>
  
      <!-- Perjam Form -->
      <div v-if="activeTab === 'perjam'" class="space-y-4">
        <div class="relative">
          <input
            type="date"
            v-model="tanggalJam"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 text-gray-700 focus:outline-none"
            placeholder="Tanggal Sewa"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
            <i class="fa-solid fa-calendar-days"></i>
          </div>
        </div>
  
        <div class="flex gap-3">
          <div class="relative w-1/2">
            <input
              type="time"
              v-model="jamSewa"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 text-gray-700 focus:outline-none"
              placeholder="Jam Sewa"
            />
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
              <i class="fa-solid fa-clock"></i>
            </div>
          </div>
          <div class="relative w-1/2">
            <input
              type="time"
              v-model="jamKembali"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 placeholder-gray-400 text-gray-700 focus:outline-none"
              placeholder="Jam Kembali"
            />
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
              <i class="fa-solid fa-clock"></i>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Tombol Cari -->
      <button
        class="mt-5 w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        @click="cari"
      >
        Cari
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const activeTab = ref('perhari')
  
  const tanggalSewa = ref('')
  const tanggalKembali = ref('')
  
  const tanggalJam = ref('')
  const jamSewa = ref('')
  const jamKembali = ref('')
  
  function cari() {
    if (activeTab.value === 'perhari') {
      alert(`Perhari:\nDari ${tanggalSewa.value} hingga ${tanggalKembali.value}`)
    } else {
      alert(`Perjam:\nTanggal ${tanggalJam.value}\nDari ${jamSewa.value} sampai ${jamKembali.value}`)
    }
  }
  </script>
  