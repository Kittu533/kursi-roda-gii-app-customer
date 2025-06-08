<template>
  <div class="p-4 space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-2">
      <NuxtLink to="/" class="text-xl">
        <i class="fa-solid fa-chevron-left"></i>
      </NuxtLink>
      <h1 class="text-lg font-semibold">Refund</h1>
    </div>

    <h2 class="text-base font-semibold">Ajukan Komplain</h2>

    <!-- Info Produk & Agen -->
    <div class="border rounded-xl p-4 flex items-center gap-3">
      <img
        src="https://cdn.pixabay.com/photo/2020/08/14/14/27/wheelchair-5489837_1280.png"
        alt="Kursi Roda"
        class="w-20 h-20 object-contain rounded"
      />
      <div class="flex-1 text-sm">
        <p class="font-semibold">Agen A</p>
        <p class="text-gray-700">Kursi Roda Breezy Basix² ×2</p>
        <p class="text-gray-500">19 Feb – 21 Feb</p>
        <p class="font-medium text-orange-500 mt-1">Rp 780.000</p>
      </div>
    </div>

    <!-- Pilih Alasan -->
    <div class="space-y-3">
      <p class="text-sm font-medium">Pilih alasan refund</p>
      <div
        v-for="(reason, index) in alasanList"
        :key="index"
        class="flex items-center gap-3"
      >
        <input
          type="radio"
          :value="reason"
          v-model="selectedReason"
          class="accent-orange-500"
        />
        <label class="text-sm text-gray-700">{{ reason }}</label>
      </div>
    </div>

    <!-- Upload Bukti -->
    <div>
      <p class="text-sm font-medium mb-2">
        Upload bukti<span class="text-red-500">*</span>
      </p>
      <input
        type="file"
        accept="image/*,video/*"
        @change="handleFileUpload"
        class="mb-2"
      />

      <!-- Preview jika gambar -->
      <div v-if="previewImage" class="mt-2">
        <p class="text-xs text-gray-500 mb-1">Preview Gambar:</p>
        <img :src="previewImage" class="w-40 h-auto rounded border" />
      </div>

      <!-- Preview jika video -->
      <div v-if="previewVideo" class="mt-2">
        <p class="text-xs text-gray-500 mb-1">Preview Video:</p>
        <video
          controls
          :src="previewVideo"
          class="w-40 h-auto rounded border"
        />
      </div>
    </div>

    <!-- Keterangan -->
    <textarea
      v-model="keterangan"
      rows="4"
      class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none"
      placeholder="Berikan alasan terkait permasalahan yang dihadapi..."
    ></textarea>

    <!-- Info Dana -->
    <div class="border rounded-xl p-4 text-sm space-y-2">
      <div class="flex justify-between">
        <span>Jumlah Pengembalian</span>
        <span class="font-medium text-orange-500">Rp 780.000</span>
      </div>
      <div class="flex justify-between">
        <span>Pengembalian Dana ke</span>
        <span class="font-medium">Kartu Debit</span>
      </div>
      <div class="flex justify-between">
        <span>Email</span>
        <span class="font-medium">email@gmail.com</span>
      </div>
    </div>

    <!-- Tombol Kirim -->
    <button
      @click="kirimRefund"
      class="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
    >
      Kirim
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id as string;

// Tipe enum atau union untuk alasan
type AlasanRefund =
  | "Produk rusak saat diterima"
  | "produk tidak sesuai dengan pesanan"
  | "Produk tidak layak pakai"
  | "Keterlambatan pengiriman atau penerimaan"
  | "kesalahan dalam pemesanan"
  | "Lainnya";

const alasanList: AlasanRefund[] = [
  "Produk rusak saat diterima",
  "produk tidak sesuai dengan pesanan",
  "Produk tidak layak pakai",
  "Keterlambatan pengiriman atau penerimaan",
  "kesalahan dalam pemesanan",
  "Lainnya",
];

const selectedReason = ref<AlasanRefund | "">("");
const keterangan = ref<string>("");

const kirimRefund = () => {
  if (!selectedReason.value) {
    alert("Silakan pilih alasan refund.");
    return;
  }

  if (!base64File.value) {
    alert("Silakan upload bukti terlebih dahulu.");
    return;
  }

  console.log("Data refund terkirim:");
  console.log("ID:", id);
  console.log("Alasan:", selectedReason.value);
  console.log("Keterangan:", keterangan.value);
  console.log("File Base64:", base64File.value);

  alert(
    `Refund dikirim!\nID: ${id}\nAlasan: ${selectedReason.value}\nKeterangan: ${keterangan.value}`
  );
};

const base64File = ref<string>(""); // untuk menyimpan hasil base64
const previewImage = ref<string>(""); // jika file berupa gambar
const previewVideo = ref<string>(""); // jika file berupa video

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    base64File.value = reader.result as string;

    // Preview tergantung jenis file
    if (file.type.startsWith("image/")) {
      previewImage.value = base64File.value;
      previewVideo.value = "";
    } else if (file.type.startsWith("video/")) {
      previewVideo.value = base64File.value;
      previewImage.value = "";
    }
  };

  reader.readAsDataURL(file);
}
</script>
