<template>
  <div class="pb-20 ">
    <!-- User Profile Section -->
    <NuxtLink to="/location-selection" class="sticky top-0 z-10">
      <div class="p-4 flex items-center bg-white shadow-sm rounded-lg mb-2">
        <div
          class="bg-white border border-[#FF9732] rounded-full h-[36px] w-[36px] flex items-center justify-center mr-3">
          <NuxtIcon name="mdi:map-marker" class="text-orange-500 h-5 w-5" />
        </div>
        <div class="flex-1 bg-white">
          <h3 class="text-xs text-gray-500">Alamat</h3>
          <p class="text-sm text-orange-500 line-clamp-1">
            {{ currentLocation.address }}
          </p>
        </div>
      </div>
    </NuxtLink>

    <!-- User Greeting -->
    <div class="px-4 py-2 flex items-center">
      <img :src="user.avatarUrl" alt="User" class="w-10 h-10 rounded-full mr-3" />
      <div>
        <h2 class="font-medium">Hello, {{ user.name || 'Pengguna' }}!</h2>

        <p class="text-xs text-gray-500">{{ user.status }}</p>
      </div>
    </div>

    <div class="px-4 py-6 max-w-md mx-auto">
      <!-- Judul -->
      <h2 class="text-[16px] font-bold text-gray-900 mb-1">
        Temukan kursi roda terdekatmu!
      </h2>
      <p class="text-[#FF5F00] font-[12px] mb-1">Jelajahi sekarang →</p>
      <p class="text-[12px] text-gray-500 mb-5">
        Atau pilih tanggal dan waktu yang sesuai untuk memastikan ketersediaan
        kursi roda
      </p>

      <!-- Card Pilihan Per Hari / Per Jam -->
      <CardChooseTime @search="handleCariWheelchair"></CardChooseTime>
    </div>
    <!-- Voucher Section -->
    <div class="px-4 py-2">
      <img src="/public/package-1.webp" alt="" />
    </div>

    <!-- Packages Section -->
    <div class="px-4 py-2">
      <h2 class="font-medium mb-2">Paket Kami</h2>

      <!-- Skeleton loading for packages -->
      <div v-if="loadingPackages" class="space-y-3">
        <div v-for="i in 3" :key="`package-skeleton-${i}`" class="p-4 rounded-lg">
          <div class="flex items-center gap-3">
            <Skeleton height="80px" width="80px" class="rounded" />
            <div class="flex-1 space-y-2">
              <Skeleton height="20px" width="70%" />
              <Skeleton height="16px" width="90%" />
              <Skeleton height="16px" width="50%" />
            </div>
          </div>
        </div>
      </div>

      <!-- Actual package content -->
      <div v-else-if="packagesError" class="text-red-500">Gagal memuat paket.</div>
      <div v-else>
        <PackageCard v-for="pkg in mappedPackages" :key="pkg.id" :packageItem="pkg" @book="bookPackage" />

        <div v-if="packages.length === 0" class="text-gray-400">Tidak ada paket tersedia.</div>
      </div>
    </div>
    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { User, Location, Agent, Package } from "~/types";
import { useTransactionStore } from "~/store/transaction";
import PackageCard from "~/components/user/package-card.vue";
import BottomNavigation from "~/components/user/bottom-navigation.vue";
import Skeleton from "~/components/ui/skeleton.vue";
import { useUserStore } from '@/store/user'
import { usePackageStore } from '~/store/packages'
import CardChooseTime from '~/components/card-choose-time.vue'
import type { WheelchairItem } from '~/types/wheelchairs'
import { useWheelchairStore } from '~/store/wheelchairs'



const userStore = useUserStore()
const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();
const packageStore = usePackageStore();
const packages = computed(() => packageStore.packages);

// Loading & error state
const loadingLocation = ref(true);
const loadingUser = ref(true);
const loadingPackages = ref(true);
const packagesError = ref(false);

// User mock
const user = computed(() => ({
  name: userStore.user?.full_name || 'User',
  avatarUrl: '/avatar.webp',
  status: 'Selamat datang kembali!'
}));

// Location logic (sama seperti sebelumnya)
interface Coordinates { latitude: number; longitude: number; }
interface StoredLocation {
  id: string; name: string; address: string; coordinates: Coordinates;
  lastUsed: number; timestamp: number;
}
const currentLocation = ref<Location>({ id: "", name: "", address: "" });
const tanggalSewa = ref(""); const tanggalKembali = ref("");
const searchQuery = ref("");
const getStoredLocation = (): StoredLocation | null => {
  try {
    const recentLocations = localStorage.getItem("recentLocations");
    if (!recentLocations) return null;
    const locations: StoredLocation[] = JSON.parse(recentLocations);
    return locations.sort((a, b) => b.lastUsed - a.lastUsed)[0];
  } catch (error) {
    console.error("Error getting stored location:", error);
    return null;
  }
};
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    if (!res.ok) throw new Error('Failed to reverse geocode');
    const data = await res.json()
    return data.display_name || 'Tidak ditemukan'
  } catch (e) {
    console.error('Reverse geocode failed:', e)
    return 'Alamat tidak ditemukan'
  }
}


const mappedPackages = computed(() =>
  packages.value.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    imageUrl: pkg.picture, // mapping picture -> imageUrl
    originalPrice: pkg.price, // price dari backend (string), bisa pakai dua-duanya kalau ada diskon
    discountedPrice: pkg.price,
    timeRange: '', // kosong kalau backend tidak ada info waktu, atau isi sesuai kebutuhan
  }))
)


//  Search Payload Type
function handleCariWheelchair(payload: { mode: string, tanggalSewa?: string, tanggalKembali?: string, tanggal?: string, jamSewa?: string, jamKembali?: string }) {
  // --- Untuk pencarian perhari ---
  if (payload.mode === 'perhari') {
    router.push({
      path: '/product',
      query: {
        startDate: payload.tanggalSewa,
        endDate: payload.tanggalKembali
      }
    })
  } else if (payload.mode === 'perjam') {
    // --- Untuk pencarian perjam, jika ingin dikirim ---
    router.push({
      path: '/product',
      query: {
        date: payload.tanggal,
        startTime: payload.jamSewa,
        endTime: payload.jamKembali
      }
    })
  }
  // Load Packages function
  const loadPackages = async () => {
    loadingPackages.value = true;
    packagesError.value = false;
    try {
      await packageStore.loadPackages();
    } catch (e) {
      packagesError.value = true;
    } finally {
      loadingPackages.value = false;
    }
  };

  onMounted(async () => {
    try {
      const queryLocation = route.query;
      const storedLocation = getStoredLocation();

      if (queryLocation.locationId) {
        const lat = parseFloat(queryLocation.lat as string)
        const lng = parseFloat(queryLocation.lng as string)
        const address = await reverseGeocode(lat, lng)
        currentLocation.value.address = address
        currentLocation.value = {
          id: queryLocation.locationId as string,
          name: queryLocation.locationName as string,
          address
        }
      } else if (storedLocation) {
        const lat = storedLocation.coordinates.latitude
        const lng = storedLocation.coordinates.longitude
        const address = await reverseGeocode(lat, lng)
        router.push({
          name: "home",
          query: {
            locationId: storedLocation.id,
            locationName: storedLocation.name,
            lat: lat.toString(),
            lng: lng.toString(),
            address
          },
        })
        currentLocation.value = {
          id: storedLocation.id,
          name: storedLocation.name,
          address
        }
      }

      await Promise.all([
        new Promise(resolve => setTimeout(() => { loadingLocation.value = false; resolve(true) }, 800)),
        loadPackages()
      ])
    } catch (error) {
      console.error("Error loading initial data:", error)
    }
  });

  // Reset transaction and load packages/user on mount
  onMounted(async () => {
    try {
      transactionStore.resetTransaction();
      await Promise.all([
        new Promise(resolve => setTimeout(() => { loadingLocation.value = false; resolve(true); }, 800)),
        new Promise(resolve => setTimeout(() => { loadingUser.value = false; resolve(true); }, 1000)),
        loadPackages(),
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  });

  // Book package method
  const bookPackage = (pkg: Package) => {
    transactionStore.selectPackage(pkg);
    router.push("/search");
  };
  // Watch for route changes to update location
  watch(() => route.query, async (newQuery) => {
    const lat = parseFloat(newQuery.lat as string);
    const lng = parseFloat(newQuery.lng as string);
    const address = await reverseGeocode(lat, lng);
    currentLocation.value = {
      id: newQuery.locationId as string,
      name: newQuery.locationName as string,
      address
    };
  });
}
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>