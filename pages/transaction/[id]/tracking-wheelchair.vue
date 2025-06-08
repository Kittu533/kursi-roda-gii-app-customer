<template>
  <div class="p-4 space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-2">
      <NuxtLink to="/" class="text-xl">
        <i class="fa-solid fa-chevron-left"></i>
      </NuxtLink>
      <h1 class="text-lg font-semibold">Tracking Kursi Roda</h1>
    </div>

    <!-- Card Detail Transaksi -->
    <div
      class="bg-white rounded-xl p-4 border border-gray-100 space-y-2 text-sm"
    >
      <div class="flex justify-between">
        <span class="text-gray-500">Nomor Seri</span>
        <span class="font-medium">{{ trackingData.noSeri }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Agen</span>
        <span class="font-medium">{{ trackingData.agen }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Tanggal Sewa</span>
        <span class="font-medium">{{ trackingData.tanggalSewa }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Tanggal Pengembalian</span>
        <span class="font-medium">{{ trackingData.tanggalKembali }}</span>
      </div>
    </div>

    <!-- Peta -->
    <div class="overflow-hidden rounded-xl">
      <iframe
        class="w-full h-56"
        src="https://maps.google.com/maps?q=UGM%20Yogyakarta&z=15&output=embed"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Riwayat Penggunaan -->
    <div class="bg-white rounded-xl p-4 border border-gray-100">
      <h2 class="font-semibold text-sm mb-4">Riwayat Penggunaan</h2>
      <div
        v-for="(log, index) in trackingData.logs"
        :key="index"
        class="flex gap-3 items-start mb-3"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-3 h-3 rounded-full"
            :class="index === 0 ? 'bg-orange-500' : 'bg-gray-300'"
          ></div>
          <div
            v-if="index < trackingData.logs.length - 1"
            class="w-0.5 bg-gray-300 flex-1"
          ></div>
        </div>
        <div>
          <p class="text-xs text-gray-400">{{ log.waktu }}</p>
          <p class="text-sm">{{ log.keterangan }}</p>
        </div>
      </div>
    </div>

    <!-- Tombol Aksi -->
    <div class="flex gap-3">
      <button
        class="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold"
      >
        Perpanjang Masa Sewa
      </button>
      <button
        class="flex-1 py-3 border border-orange-500 text-orange-500 rounded-xl font-semibold"
      >
        Pengembalian Kursi Roda
      </button>
    </div>

    <!-- Tombol Refund -->
    <div
      class="flex items-center justify-between px-4 py-3 mt-3 border rounded-xl text-sm"
    >
    <NuxtLink to="/refund-wheelchair">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-money-bill text-xl"></i>
        <span>Ajukan Refund</span>
      </div>
    </NuxtLink>
      <i class="fa-solid fa-chevron-right text-gray-400"></i>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";

interface Log {
    waktu: string;
    keterangan: string;
}

interface TrackingData {
    id: string;
    noSeri: string;
    agen: string;
    tanggalSewa: string;
    tanggalKembali: string;
    logs: Log[];
}

const route = useRoute();
const id: string = route.params.id as string;

// Simulasi data tracking
const trackingData: TrackingData = {
    id,
    noSeri: "KR001",
    agen: "A",
    tanggalSewa: "19 Februari 2025",
    tanggalKembali: "21 Februari 2025",
    logs: [
        { waktu: "14.30", keterangan: "Kursi roda aktif digunakan di Bukit Marwa" },
        { waktu: "14.00", keterangan: "Kursi roda aktif digunakan di Bukit Safa" },
        {
            waktu: "13.40",
            keterangan: "Kursi roda diambil oleh pengguna dari Agen A",
        },
    ],
};
</script>
