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

    <div class="flex-1 pt-2">
      <!-- Address Section -->
      <div class="bg-white p-4 mb-2 rounded-lg border-2 border-gray-200">
        <div class="flex items-center gap-3">
          <div
            class="rounded-full border border-orange-500 p-2 flex items-center justify-center flex-shrink-0"
          >
            <NuxtIcon name="mdi:map-marker" class="w-5 h-5 text-orange-500" />
          </div>
          <div class="flex flex-col">
            <p class="text-sm font-medium text-gray-800">Alamat</p>
            <p class="text-xs text-orange-500 leading-tight">
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
                class="w-5 h-5 text-orange-500"
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
            :class="{
              'border-orange-400': selectedDelivery === 'delivery',
              'border-gray-200': selectedDelivery !== 'delivery',
            }"
            @click="selectedDelivery = 'delivery'"
          >
            <div>
              <p
                class="text-sm"
                :class="{ 'text-orange-500': selectedDelivery === 'delivery' }"
              >
                Pesan - Antar < 20 Menit
              </p>
            </div>
            <p
              class="text-sm font-medium"
              :class="{ 'text-orange-500': selectedDelivery === 'delivery' }"
            >
              Rp13.000
            </p>
          </div>
          <div
            class="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
            :class="{
              'border-orange-400': selectedDelivery === 'pickup',
              'border-gray-200': selectedDelivery !== 'pickup',
            }"
            @click="selectedDelivery = 'pickup'"
          >
            <div>
              <p
                class="text-sm"
                :class="{ 'text-orange-500': selectedDelivery === 'pickup' }"
              >
                Pesan - Ambil
              </p>
            </div>
            <p
              class="text-sm font-medium"
              :class="{ 'text-orange-500': selectedDelivery === 'pickup' }"
            >
              Gratis
            </p>
          </div>
        </div>
      </div>

      <!-- Agent and Items -->
      <div class="bg-white p-4 mb-2 rounded-lg border-2 border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div
              class="rounded-full border mr-4 border-orange-500 p-2 flex items-center justify-center flex-shrink-0"
            >
              <NuxtIcon name="mdi:account" class="w-5 h-5 text-orange-500" />
            </div>
            <p class="text-sm font-medium">Agen A</p>
          </div>
          <button class="text-xs text-gray-500">Tambah Pesanan</button>
        </div>

        <!-- Items List -->
        <div class="space-y-4">
          <!-- Items List -->
          <div class="space-y-4">
            <div
              v-for="(item, index) in rentedProducts"
              :key="item.id"
              class="flex items-center border border-gray-200 rounded-lg p-3 relative"
            >
              <!-- Gambar Produk -->
              <div
                class="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 mr-4"
              >
                <img
                  src="/kursi-roda.webp"
                  alt="Wheelchair"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Info Produk -->
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-800">
                  {{ item.name }}
                </p>
                <p class="text-sm text-orange-500 font-semibold">
                  Rp {{ formatPrice(item.basePrice) }}
                </p>

                <div class="flex items-center mt-2 justify-between">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      :id="`guide-${index}`"
                      v-model="item.guideSelected"
                      class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 mr-2"
                    />
                    <label
                      :for="`guide-${index}`"
                      class="text-sm font-medium text-gray-700 flex items-center justify-end"
                    >
                      Guide
                    </label>
                  </div>
                  <span class="text-xs text-gray-400">+ Rp30.000</span>
                </div>
              </div>

              <!-- Tombol Hapus -->
              <button
                @click="removeProduct(index)"
                class="absolute flex items-center top-2 right-2 bg-orange-500 rounded-[6px] p-1"
              >
                <NuxtIcon
                  name="ic:baseline-delete"
                  class="text-white w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white p-4 rounded-lg">
        <!-- Voucher Section -->
        <div class="bg-white p-4 mb-2 rounded-lg">
          <div
            class="flex items-center justify-between"
            @click="showVoucherModal = true"
          >
            <div class="flex items-center">
              <div
                class="rounded-full border border-orange-500 p-2 mr-3 flex-shrink-0 flex items-center justify-center"
              >
                <NuxtIcon
                  name="mdi:ticket-percent"
                  class="w-5 h-5 text-orange-500"
                />
              </div>
              <p class="text-sm font-medium">Voucher</p>
            </div>
            <div class="flex items-center">
              <span v-if="!selectedVoucher" class="text-xs text-gray-500 mr-2"
                >2 Voucher Tersedia</span
              >
              <span v-else class="text-xs text-orange-500 mr-2">{{
                selectedVoucher.name
              }}</span>
              <NuxtIcon
                name="mdi:chevron-right"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        <p class="text-sm font-medium mb-3">Total Pesanan</p>
        <div class="space-y-2">
          <!-- Total Pesanan -->
          <div class="flex justify-between text-sm">
            <p class="text-gray-500">
              Total Pesanan
              <span
                v-if="guidePrice > 0"
                class="block text-xs text-orange-500 mt-1"
              >
                Termasuk tambahan Guide Rp{{
                  guidePrice.toLocaleString("id-ID")
                }}
              </span>
            </p>
            <p>Rp{{ (basePrice ?? 0).toLocaleString("id-ID") }}</p>
          </div>

          <!-- Biaya Pengiriman -->
          <div class="flex justify-between text-sm">
            <p class="text-gray-500">Total Biaya Pengiriman</p>
            <p>{{ selectedDelivery === "delivery" ? "Rp13.000" : "Gratis" }}</p>
          </div>

          <!-- Biaya Layanan -->
          <div class="flex justify-between text-sm">
            <p class="text-gray-500">Biaya Layanan</p>
            <p>-</p>
          </div>

          <!-- Diskon Voucher -->
          <div v-if="selectedVoucher" class="flex justify-between text-sm">
            <p class="text-gray-500">Diskon Voucher</p>
            <p class="text-green-500">-Rp{{ discountAmount }}</p>
          </div>

          <!-- Total Keseluruhan -->
          <div class="border-t pt-2 mt-2">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium">Total</p>
                <p class="text-xs text-gray-500">Sudah termasuk pajak</p>
              </div>
              <p class="text-lg font-medium text-orange-500">
                Rp{{ totalPrice }}
              </p>
            </div>
            <NuxtLink to="payment-flow">
              <button
                class="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium mt-4 w-full"
              >
                Bayar
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Voucher Modal -->
    <div
      v-if="showVoucherModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-md">
        <div class="flex justify-between items-center p-4">
          <h2 class="text-lg font-medium">Voucher</h2>
          <button @click="showVoucherModal = false" class="text-gray-500">
            <span class="text-xl"> x </span>
          </button>
        </div>

        <div class="p-4">
          <!-- Voucher Input -->
          <div class="flex mb-4">
            <input
              v-model="voucherCode"
              type="text"
              placeholder="Masukkan Kode Voucher"
              class="flex-1 border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              class="bg-gray-300 text-gray-700 px-4 py-2 text-sm"
              @click="applyCustomVoucher"
            >
              Pakai
            </button>
          </div>

          <!-- Available Vouchers -->
          <div class="space-y-3">
            <div
              v-for="voucher in availableVouchers"
              :key="voucher.id"
              class="border border-gray-200 overflow-hidden flex justify-between"
            >
              <div class="flex items-center p-3">
                <div class="flex-shrink-0 mr-3">
                  <NuxtIcon
                    name="mdi:ticket-percent"
                    class="w-6 h-6 text-orange-500"
                  />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ voucher.name }}</p>
                  <p class="text-xs text-gray-500">{{ voucher.description }}</p>
                </div>
              </div>
              <button
                @click="selectVoucher(voucher)"
                class="bg-orange-500 text-white px-6 py-1.5 text-sm"
              >
                Pakai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

type DeliveryType = "delivery" | "pickup";

// Initialize selectedDelivery with a default value
const selectedDelivery = ref<DeliveryType>("delivery");

// Voucher modal state
const showVoucherModal = ref(false);
const voucherCode = ref("");

// Produk disewa
interface ProductItem {
  id: number;
  name: string;
  basePrice: number;
  quantity: number;
  guideSelected: boolean;
}

const rentedProducts = ref<ProductItem[]>([
  {
    id: 1,
    name: "Kursi Roda Breezy BasiX²",
    basePrice: 130000,
    quantity: 1,
    guideSelected: false,
  },
]);

// Voucher data
interface Voucher {
  id: number;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

const availableVouchers = ref<Voucher[]>([
  {
    id: 1,
    name: "Diskon 10%",
    description: "Min. Belanja 3 Item",
    discountType: "percentage",
    discountValue: 10,
  },
  {
    id: 2,
    name: "Diskon 15%",
    description: "Min. Belanja 5 Item",
    discountType: "percentage",
    discountValue: 15,
  },
]);

// Selected voucher
const selectedVoucher = ref<Voucher | null>(null);

// Hitung harga produk dasar (tanpa guide)
const baseProductPrice = computed(() => {
  return rentedProducts.value.reduce((total, item) => {
    return total + item.basePrice * item.quantity;
  }, 0);
});

// Hitung total tambahan harga guide
const guidePrice = computed(() => {
  return rentedProducts.value.reduce((total, item) => {
    return total + (item.guideSelected ? 30000 * item.quantity : 0);
  }, 0);
});

// Hitung delivery price
const deliveryPrice = computed(() =>
  selectedDelivery.value === "delivery" ? 13000 : 0
);

// Hitung harga dasar + guide
const basePrice = computed(() => {
  if (!rentedProducts.value.length) return 0; // tambahkan pengecekan supaya tidak error

  return baseProductPrice.value + guidePrice.value;
});

// Calculate discount amount
const discountAmount = computed(() => {
  if (!selectedVoucher.value) return 0;

  if (selectedVoucher.value.discountType === "percentage") {
    return Math.round(
      (basePrice.value * selectedVoucher.value.discountValue) / 100
    );
  } else {
    return selectedVoucher.value.discountValue;
  }
});

// Calculate total price (FINAL)
const totalPrice = computed(() => {
  const total = basePrice.value + deliveryPrice.value - discountAmount.value;
  return total.toLocaleString("id-ID");
});

// Function to select a voucher
const selectVoucher = (voucher: Voucher) => {
  selectedVoucher.value = voucher;
  showVoucherModal.value = false;
};

// Function to apply a custom voucher code
const applyCustomVoucher = () => {
  if (!voucherCode.value) return;

  const customVoucher: Voucher = {
    id: 3,
    name: `Voucher ${voucherCode.value}`,
    description: "Kode Voucher Kustom",
    discountType: "fixed",
    discountValue: 25000,
  };

  selectedVoucher.value = customVoucher;
  showVoucherModal.value = false;
  voucherCode.value = "";
};

// Fungsi format angka ke rupiah
const formatPrice = (price: number) => {
  return price.toLocaleString("id-ID");
};

// Fungsi hitung harga item (hanya base price, tidak nambah guide di tampilan card)
const calculateItemPrice = (item: ProductItem) => {
  return item.basePrice; // tetap harga dasar saja
};

// Fungsi hapus produk
const removeProduct = (index: number) => {
  rentedProducts.value.splice(index, 1);
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
