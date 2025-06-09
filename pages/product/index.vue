<template>
  <div class="flex flex-col h-full bg-white relative">
    <!-- Header -->
    <div class="p-4 flex items-center gap-3">
      <button class="p-1" @click="goBack">
        <NuxtIcon name="ic:baseline-arrow-back-ios" class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <NuxtIcon name="mdi:map-marker" class="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <h1 class="font-medium text-base truncate">Agen A</h1>
          <p class="text-xs text-orange-500 truncate">
            Jl. Ibrahim Al-Khalil No. 12, Al-Haram, Makkah...
          </p>
        </div>
      </div>
    </div>

    <!-- Date Selection -->
    <div class="px-4 py-2 space-y-2">
      <div class="flex items-center justify-between border border-gray-200 rounded-[10px] px-3 py-3">
        <span class="text-gray-500">Tanggal Sewa</span>
        <DatePicker v-model="dateRange.startDate" placeholder="Pilih tanggal" :min-date="new Date()" />
      </div>
      <div class="flex items-center justify-between border rounded-[10px] px-3 border-gray-200 py-3">
        <span class="text-gray-500">Tanggal Kembali</span>
        <DatePicker v-model="dateRange.endDate" placeholder="Pilih tanggal"
          :min-date="dateRange.startDate || new Date()" />
      </div>
    </div>

    <!-- Product List -->
    <div class="px-4 py-3 flex-1 overflow-y-auto">
      <h2 class="font-bold text-lg mb-3">Produk Tersedia</h2>
      <div v-if="store.isLoading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
      <div v-else-if="store.error" class="text-red-500 text-center py-4">
        {{ store.error }}
      </div>
      <div v-else-if="availableProducts.length === 0" class="text-center py-4 text-gray-500">
        Tidak ada kursi roda tersedia untuk tanggal yang dipilih
      </div>
      <div v-else class="space-y-4">
        <div v-for="product in availableProducts" :key="product.id"
          class="flex gap-3 border border-gray-200 rounded-xl p-3 bg-white items-center cursor-pointer hover:shadow transition"
          @click.self="openProductDetail(product)">
          <img :src="product.model?.picture || '/kursi-roda.webp'" :alt="product.name"
            class="w-20 h-20 object-contain rounded-lg bg-gray-50 border" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-medium truncate">{{ product.name }}</h3>
              <div class="flex items-center gap-1 text-orange-500 text-xs">
                <NuxtIcon name="mdi:star" class="w-4 h-4" />
                <span>5.0</span>
              </div>
            </div>
            <div class="text-orange-500 font-semibold mb-1">
              Rp {{ formatPrice(product.model?.price ?? 0) }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              Model: {{ product.model?.model || '-' }} | Serial: {{ product.serial_number }}
            </div>
          </div>
          <div class="flex flex-col items-center justify-center gap-1">
            <!-- Quantity Control -->
            <div class="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
              <button @click.stop="decrementQuantity(product.id)"
                class="w-7 h-7 rounded-full flex items-center justify-center bg-orange-500 text-white">
                <NuxtIcon name="ic:baseline-minus" class="w-4 h-4" />
              </button>
              <span class="w-6 text-center">{{ quantities[product.id] || 0 }}</span>
              <button @click.stop="incrementQuantity(product.id)"
                class="w-7 h-7 rounded-full flex items-center justify-center bg-orange-500 text-white">
                <NuxtIcon name="ic:baseline-plus" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order button (aktif jika qty > 0) -->
    <div class="mt-auto p-4">
      <button class="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg text-lg"
        :disabled="!hasSelectedProduct" :class="{ 'opacity-70 cursor-not-allowed': !hasSelectedProduct }"
        @click="orderNow">
        Pesan Sekarang
      </button>
    </div>

    <!-- Slide-up Product Detail Panel -->
    <Transition name="slide-up">
      <div v-if="activeProduct" class="product-detail-panel" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
        @touchend="handleTouchEnd">
        <div class="handle-bar">
          <div class="handle"></div>
        </div>
        <div class="bg-white rounded-lg shadow-sm mx-auto max-w-lg overflow-hidden">
          <!-- Main Image -->
          <div class="relative bg-white p-4">
            <img :src="currentImage" :alt="activeProduct?.name || ''"
              class="w-full h-64 object-contain mx-auto rounded-xl" />
          </div>
          <!-- Thumbnails -->
          <div class="flex justify-center gap-2 px-4 pb-4">
            <button v-for="(image, index) in productImages" :key="index" @click="selectImage(index)"
              class="w-12 h-12 border rounded-md overflow-hidden"
              :class="{ 'border-orange-500': currentImageIndex === index }">
              <img :src="image" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
          <div class="px-4 pb-4">
            <div class="flex items-center justify-between mb-2">
              <h1 class="text-lg font-medium">
                {{ activeProduct?.name || '' }}
              </h1>
              <div class="flex items-center text-sm text-orange-500 gap-1">
                <NuxtIcon name="mdi:star" class="w-4 h-4" />
                <span class="font-semibold">5.0</span>
              </div>
            </div>
            <div class="text-orange-500 font-semibold mb-2">
              Rp {{ formatPrice(activeProduct?.model?.price ?? 0) }}
            </div>
            <p class="text-sm text-gray-700 mb-3">
              {{ activeProduct?.description || "Kursi roda berkualitas dan nyaman." }}
            </p>
            <!-- Quantity Control in Detail -->
            <div class="flex items-center gap-3 justify-end mt-3">
              <button @click="decrementQuantity(activeProduct?.id)"
                class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <NuxtIcon name="ic:baseline-minus" class="w-4 h-4" />
              </button>
              <span class="w-8 text-center">{{ quantities[activeProduct?.id || ''] || 0 }}</span>
              <button @click="incrementQuantity(activeProduct?.id)"
                class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <NuxtIcon name="ic:baseline-plus" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="activeProduct" class="backdrop" @click="closeProductDetail"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DatePicker from "@/components/ui/date-picker.vue";
import { useWheelchairStore } from "~/store/wheelchairs";
import type { WheelchairItem } from "~/types/wheelchairs";

// Store & router
const store = useWheelchairStore();
const route = useRoute();
const router = useRouter();

// State tanggal
const dateRange = ref<{ startDate: Date | null; endDate: Date | null }>({
  startDate: null,
  endDate: null,
});

// Kuantitas per product
const quantities = ref<{ [id: string]: number }>({});

// Untuk slide up panel
const activeProduct = ref<WheelchairItem | null>(null);

// Untuk galeri gambar produk
const productImages = ref<string[]>([
  "/kursi-roda.webp",
  "/kursi-roda.webp",
  "/kursi-roda.webp",
  "/kursi-roda.webp"
]);
const currentImageIndex = ref(0);
const currentImage = computed(() => productImages.value[currentImageIndex.value]);

function selectImage(idx: number) {
  currentImageIndex.value = idx;
}

// Panel slide up touch events
const touchStartY = ref(0);
const touchMoveY = ref(0);
const minSwipeDistance = 100;
function handleTouchStart(e: TouchEvent) { touchStartY.value = e.touches[0].clientY }
function handleTouchMove(e: TouchEvent) {
  touchMoveY.value = e.touches[0].clientY;
  const distance = touchMoveY.value - touchStartY.value;
  if (distance > 0) {
    e.preventDefault();
    const panel = e.currentTarget as HTMLElement;
    panel.style.transform = `translateY(${Math.min(distance, 300)}px)`;
  }
}
function handleTouchEnd(e: TouchEvent) {
  const distance = touchMoveY.value - touchStartY.value;
  if (distance > minSwipeDistance) closeProductDetail();
  else {
    const panel = e.currentTarget as HTMLElement;
    panel.style.transform = "translateY(0)";
  }
  touchStartY.value = 0;
  touchMoveY.value = 0;
}

function openProductDetail(product: WheelchairItem) {
  activeProduct.value = product;
  currentImageIndex.value = 0;
}
function closeProductDetail() {
  activeProduct.value = null;
}

// Back button
function goBack() { router.back() }

// Format harga
function formatPrice(val: number) { return val ? val.toLocaleString("id-ID") : "0" }

// Hitung jika ada produk yang qty > 0
const hasSelectedProduct = computed(() =>
  Object.values(quantities.value).some(q => q && q > 0)
);

// Kuantitas handler
function incrementQuantity(id?: string) {
  if (!id) return;
  quantities.value[id] = (quantities.value[id] || 0) + 1;
}
function decrementQuantity(id?: string) {
  if (!id) return;
  if ((quantities.value[id] || 0) > 0) quantities.value[id]--;
}

// Produk tersedia (status available)
const availableProducts = computed(() =>
  store.wheelchairs.filter((item: WheelchairItem) => item.wheelchair_status?.status === "available")
);

// On mount, ambil data dari store & isi tanggal dari query
onMounted(async () => {
  // Tanggal dari query string, jika ada
  const startDateStr = route.query.startDate as string | undefined;
  const endDateStr = route.query.endDate as string | undefined;
  if (startDateStr) dateRange.value.startDate = new Date(startDateStr);
  if (endDateStr) dateRange.value.endDate = new Date(endDateStr);

  await store.loadWheelchairs();
});

// Order Now
function orderNow() {
  if (!hasSelectedProduct.value) return;
  // Kirim data ke store, lalu navigate
  // store.setSelectedProducts(quantities.value)
  router.push({ name: "transaction-confirmation" }); // Ganti dengan rute yg sesuai
}
</script>

<style scoped>
.product-detail-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90vh;
  background-color: white;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.12);
  z-index: 50;
  overflow-y: auto;
  touch-action: pan-y;
  animation: slideUp .2s;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.handle-bar {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0;
}

.handle {
  width: 4rem;
  height: 0.25rem;
  background-color: #cbd5e0;
  border-radius: 1rem;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 40;
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
