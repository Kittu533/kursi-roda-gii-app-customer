<template>
  <div class="px-4 py-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-2">
      <NuxtLink to="/home" class="text-xl">
        <i class="fa-solid fa-chevron-left"></i>
      </NuxtLink>
      <h1 class="text-xl font-semibold">Detail Paket</h1>
    </div>

    <!-- Banner Paket -->
    <div class="rounded-xl overflow-hidden">
      <img
        :src="paket.image"
        alt="Gambar Paket"
        class="w-full object-contain h-48"
      />
    </div>

    <!-- Judul & Tag -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-[500px]">{{ paket.nama }}</h2>
      <span
        class="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full"
      >
        Promo Terbatas
      </span>
    </div>

    <!-- Rincian Paket -->
    <div
      class="bg-white rounded-xl shadow-sm p-4 space-y-3 border border-gray-100"
    >
      <h3 class="font-semibold">Rincian Paket</h3>
      <ul class="space-y-2 text-sm text-gray-700">
        <li
          v-for="(fitur, index) in paket.fitur"
          :key="index"
          class="flex items-start gap-2"
        >
          <i class="fa-solid fa-check text-orange-500 mt-1"></i>
          <span>{{ fitur }}</span>
        </li>
      </ul>

      <div class="pt-3 border-t border-gray-200 space-y-1 text-sm">
        <div class="flex items-center justify-between">
          <p>Nikmati paket dengan harga</p>
          <p class="text-orange-500 font-bold text-xl">
            Rp{{ paket.hargaPromo.toLocaleString("id-ID") }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <p>Dari harga normal</p>
          <p class="text-gray-400 line-through">
            Rp{{ paket.hargaNormal.toLocaleString("id-ID") }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <p>Anda hemat</p>
          <p class="text-right font-bold text-orange-500">
            {{ paket.diskon }}%
          </p>
        </div>
      </div>
    </div>

    <!-- Tombol CTA -->
    <button
      class="w-full py-4 bg-orange-500 text-white text-center font-semibold rounded-xl hover:bg-orange-600"
    >
      Pesan Sekarang
    </button>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

// Simulasi fetch detail paket berdasarkan ID
const route = useRoute();
const id = route.params.id;

// Contoh data dummy
const semuaPaket = [
  {
    id: "1",
    nama: "Paket Tawaf",
    tagline:
      "Bebas pilih paket dengan atau tanpa pendamping sesuai kebutuhan anda",
    image: "/detail-paket.webp",
    fitur: [
      "Kursi Roda dapat disesuaikan dengan kebutuhan",
      "Pilihan pendampingan profesional",
      "Masa sewa fleksibel",
      "Pengantaran gratis ke lokasi",
      "Akses bantuan tersedia 24 Jam",
    ],
    hargaNormal: 300000,
    hargaPromo: 150000,
    diskon: 50,
  },
];

// Ambil data sesuai ID
const paket = semuaPaket.find((p) => p.id === id) || semuaPaket[0]; // fallback
</script>
