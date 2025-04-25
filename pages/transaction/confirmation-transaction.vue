<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <div
      class="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center"
    >
      <button @click="$router.back()" class="mr-3">
        <NuxtIcon name="mdi:chevron-left" class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-medium">Konfirmasi Pesanan</h1>
    </div>

    <div class="flex-1 pt-6">
      <!-- Address Section -->
      <div class="bg-white p-4 mb-2 rounded-lg border-2 border-gray-200">
        <div class="flex items-start">
          <div class="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
            <NuxtIcon name="mdi:map-marker" class="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p class="text-sm">Alamat</p>
            <p class="text-xs text-orange-500">
              MAKKAH TOWER, Al Haram, Makkah, Arab Saudi...
            </p>
          </div>
        </div>
      </div>

      <!-- Delivery Options -->
      <div class="bg-white p-4 mb-2 rounded-lg border-2 border-gray-200">
        <div class="flex items-start justify-between mb-4 items-center">
          <div class="flex items-center">
            <div
              class="bg-white border-orange-400 border rounded-full p-2 mr-3 flex-shrink-0 w-9 h-9 flex items-center justify-center"
            >
              <NuxtIcon
                name="mdi:truck-delivery-outline"
                class="w-5 h-5 text-gray-500"
              />
            </div>
            <p class="text-sm font-medium">Opsi Pengiriman</p>
          </div>
          <p class="text-xs text-gray-500">Jarak 10 km</p>
        </div>

        <!-- Delivery Methods -->
        <div class="space-y-2">
          <div
            class="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
            :class="{ 'border-orange-400': selectedDelivery === 'delivery', 'border-gray-200': selectedDelivery !== 'delivery' }"
            @click="selectedDelivery = 'delivery'"
          >
            <div>
              <p class="text-sm" :class="{ 'text-orange-500': selectedDelivery === 'delivery' }">
          Pesan - Antar < 20 Menit
              </p>
            </div>
            <p class="text-sm font-medium" :class="{ 'text-orange-500': selectedDelivery === 'delivery' }">
              Rp13.000
            </p>
          </div>
          <div
            class="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
            :class="{ 'border-orange-400': selectedDelivery === 'pickup', 'border-gray-200': selectedDelivery !== 'pickup' }"
            @click="selectedDelivery = 'pickup'"
          >
            <div>
              <p class="text-sm" :class="{ 'text-orange-500': selectedDelivery === 'pickup' }">
          Pesan - Ambil
              </p>
            </div>
            <p class="text-sm font-medium" :class="{ 'text-orange-500': selectedDelivery === 'pickup' }">
              Gratis
            </p>
          </div>
        </div>
      </div>

      <!-- Agent and Items -->
      <div class="bg-white p-4 mb-2 rounded-lg border-2 border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
              <NuxtIcon name="mdi:account" class="w-5 h-5 text-blue-500" />
            </div>
            <p class="text-sm font-medium">Agen A</p>
          </div>
          <button class="text-xs text-gray-500">Tambah Pesanan</button>
        </div>

        <!-- Items List -->
        <div class="space-y-4">
          <!-- Item 1 -->
          <div class="flex items-start border-b pb-4">
            <div
              class="w-16 h-16 bg-gray-200 rounded-md mr-3 flex-shrink-0 overflow-hidden"
            >
              <img
                src="/public/kursi-roda.webp"
                alt="Wheelchair"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="text-sm font-medium">Kursi Roda Breezy Basix®</p>
                <div
                  class="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded"
                >
                  1
                </div>
              </div>
              <p class="text-sm text-orange-500">Rp130.000/hari</p>
              <div class="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="guide1"
                  class="mr-2 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label for="guide1" class="text-sm">Guide</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white p-4 rounded-lg">
        <!-- Voucher Section -->
        <div class="bg-white p-4 mb-2 rounded-lg">
          <div class="flex items-center justify-between" @click="showVoucherModal = true">
            <div class="flex items-center">
              <div class="bg-yellow-100 rounded-full p-2 mr-3 flex-shrink-0">
                <NuxtIcon
                  name="mdi:ticket-percent"
                  class="w-5 h-5 text-yellow-500"
                />
              </div>
              <p class="text-sm font-medium">Voucher</p>
            </div>
            <div class="flex items-center">
              <span v-if="!selectedVoucher" class="text-xs text-gray-500 mr-2">2 Voucher Tersedia</span>
              <span v-else class="text-xs text-orange-500 mr-2">{{ selectedVoucher.name }}</span>
              <NuxtIcon
                name="mdi:chevron-right"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white p-4 mb-2 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                <NuxtIcon name="mdi:cash" class="w-5 h-5 text-green-500" />
              </div>
              <p class="text-sm font-medium">Metode Pembayaran</p>
            </div>
            <div class="flex items-center">
              <span class="text-xs text-gray-500 mr-2">Pilihan</span>
              <NuxtIcon
                name="mdi:chevron-right"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </div>
        </div>
        <p class="text-sm font-medium mb-3">Total Pesanan</p>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <p class="text-gray-500">Total Pesanan</p>
            <p>Rp390.000</p>
          </div>
          <div class="flex justify-between text-sm">
            <p class="text-gray-500">Total Biaya Pengiriman</p>
            <p>{{ selectedDelivery === 'delivery' ? 'Rp13.000' : 'Gratis' }}</p>
          </div>
          <div class="flex justify-between text-sm">
            <p class="text-gray-500">Biaya Layanan</p>
            <p>-</p>
          </div>
          <div v-if="selectedVoucher" class="flex justify-between text-sm">
            <p class="text-gray-500">Diskon Voucher</p>
            <p class="text-green-500">-Rp{{ discountAmount }}</p>
          </div>
          <div class="border-t pt-2 mt-2">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium">Total</p>
                <p class="text-xs text-gray-500">Sudah termasuk pajak</p>
              </div>
              <p class="text-lg font-medium text-orange-500">Rp{{ totalPrice }}</p>
            </div>
            <button
              class="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium mt-4 w-full"
            >
              Bayar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Voucher Modal -->
    <div v-if="showVoucherModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-medium">Voucher</h2>
          <button @click="showVoucherModal = false" class="text-gray-500">
            <span class="text-xl">×</span>
          </button>
        </div>
        
        <div class="p-4">
          <!-- Voucher Input -->
          <div class="flex mb-4">
            <input 
              v-model="voucherCode" 
              type="text" 
              placeholder="Masukkan Kode Voucher" 
              class="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button 
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-r-md text-sm"
              @click="applyCustomVoucher"
            >
              Pakai
            </button>
          </div>
          
          <!-- Available Vouchers -->
          <div class="space-y-3">
            <div v-for="voucher in availableVouchers" :key="voucher.id" class="border rounded-md overflow-hidden">
              <div class="flex items-center p-3">
                <div class="flex-shrink-0 mr-3">
                  <NuxtIcon name="mdi:ticket-percent" class="w-6 h-6 text-orange-500" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ voucher.name }}</p>
                  <p class="text-xs text-gray-500">{{ voucher.description }}</p>
                </div>
                <button 
                  @click="selectVoucher(voucher)" 
                  class="bg-orange-500 text-white px-4 py-1.5 rounded text-sm"
                >
                  Pakai
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type DeliveryType = 'delivery' | 'pickup';

// Initialize selectedDelivery with a default value
const selectedDelivery = ref<DeliveryType>('delivery');

// Voucher modal state
const showVoucherModal = ref(false);
const voucherCode = ref('');

// Voucher data
interface Voucher {
  id: number;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

const availableVouchers = ref<Voucher[]>([
  {
    id: 1,
    name: 'Diskon 10%',
    description: 'Min. Belanja 3 Item',
    discountType: 'percentage',
    discountValue: 10
  },
  {
    id: 2,
    name: 'Diskon 15%',
    description: 'Min. Belanja 5 Item',
    discountType: 'percentage',
    discountValue: 15
  }
]);

// Selected voucher
const selectedVoucher = ref<Voucher | null>(null);

// Base price calculation
const basePrice = 390000; // Rp390.000
const deliveryPrice = computed(() => selectedDelivery.value === 'delivery' ? 13000 : 0);

// Calculate discount amount
const discountAmount = computed(() => {
  if (!selectedVoucher.value) return 0;
  
  if (selectedVoucher.value.discountType === 'percentage') {
    return Math.round((basePrice * selectedVoucher.value.discountValue) / 100);
  } else {
    return selectedVoucher.value.discountValue;
  }
});

// Calculate total price
const totalPrice = computed(() => {
  const total = basePrice + deliveryPrice.value - discountAmount.value;
  return total.toLocaleString('id-ID');
});

// Function to select a voucher
const selectVoucher = (voucher: Voucher) => {
  selectedVoucher.value = voucher;
  showVoucherModal.value = false;
};

// Function to apply a custom voucher code
const applyCustomVoucher = () => {
  if (!voucherCode.value) return;
  
  // Here you would typically validate the voucher code against your backend
  // For this example, we'll just add a mock voucher
  const customVoucher: Voucher = {
    id: 3,
    name: `Voucher ${voucherCode.value}`,
    description: 'Kode Voucher Kustom',
    discountType: 'fixed',
    discountValue: 25000 // Example: Rp25.000 discount
  };
  
  selectedVoucher.value = customVoucher;
  showVoucherModal.value = false;
  voucherCode.value = '';
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>