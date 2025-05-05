<template>
  <div class="pb-20 ">
    <!-- User Profile Section -->
    <NuxtLink to="/location-selection" class="sticky top-0 z-10">
      <div class="p-4 flex items-center bg-white shadow-sm rounded-lg mb-2">
        <div
          class="bg-white border border-[#FF9732] rounded-full h-[36px] w-[36px] flex items-center justify-center mr-3"
        >
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
      <img
        :src="user.avatarUrl"
        alt="User"
        class="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <h2 class="font-medium">Hello, {{ user.name }}!</h2>
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
      <CardChooseTime></CardChooseTime>
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
        <div
          v-for="i in 3"
          :key="`package-skeleton-${i}`"
          class="p-4 rounded-lg"
        >
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
      <div v-else>
        <PackageCard
          v-for="pkg in packages"
          :key="pkg.id"
          :packageItem="pkg"
          @book="bookPackage"
        />
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { User, Location, Agent, Package } from "~/types";
import { useTransactionStore } from "~/store/transaction";
import SearchBar from "~/components/user/search-bar.vue";
import PackageCard from "~/components/user/package-card.vue";
import AgentCard from "~/components/user/agent-card.vue";
import BottomNavigation from "~/components/user/bottom-navigation.vue";
import Skeleton from "~/components/ui/skeleton.vue";

// Add these interfaces at the top of the script section
interface Coordinates {
  lat: number;
  lng: number;
}

interface StoredLocation {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  lastUsed: number;
  timestamp: number;
}

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();

const loadingLocation = ref(true);
const loadingUser = ref(true);
const loadingPackages = ref(true);
const packagesError = ref(false);

const searchQuery = ref("");

// Mock data
const user = ref<User>({
  id: "1",
  name: "Cahya",
  avatarUrl: "/avatar.webp",
  status: "Selamat kali nada sesuai kebutuhanmu!",
});

// Modify the currentLocation initialization
const currentLocation = ref<Location>({
  id: "",
  name: "",
  address: "",
});

const tanggalSewa = ref("");
const tanggalKembali = ref("");

function cariKursiRoda() {
  alert(`Mencari dari ${tanggalSewa.value} hingga ${tanggalKembali.value}`);
}

// Update onMounted to include location handling
onMounted(async () => {
  try {
    // Get location from query params or localStorage
    const queryLocation = route.query;
    const storedLocation = getStoredLocation();

    if (queryLocation.locationId) {
      // Use location from query parameters
      currentLocation.value = {
        id: queryLocation.locationId as string,
        name: queryLocation.locationName as string,
        address: queryLocation.address as string,
      };
    } else if (storedLocation) {
      // If no query params, use stored location and update route
      router.push({
        name: "home",
        query: {
          locationId: storedLocation.id,
          locationName: storedLocation.name,
          lat: storedLocation.coordinates.lat.toString(),
          lng: storedLocation.coordinates.lng.toString(),
          address: storedLocation.address,
        },
      });

      currentLocation.value = {
        id: storedLocation.id,
        name: storedLocation.name,
        address: storedLocation.address,
      };
    }

    // ...rest of your existing onMounted code...
    await Promise.all([
      new Promise((resolve) =>
        setTimeout(() => {
          loadingLocation.value = false;
          resolve(true);
        }, 800)
      ),
      loadPackages(),
    ]);
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
});
// Add function to get location from localStorage
const getStoredLocation = (): StoredLocation | null => {
  try {
    const recentLocations = localStorage.getItem("recentLocations");
    if (!recentLocations) return null;

    const locations: StoredLocation[] = JSON.parse(recentLocations);
    // Get most recent location by lastUsed timestamp
    return locations.sort((a, b) => b.lastUsed - a.lastUsed)[0];
  } catch (error) {
    console.error("Error getting stored location:", error);
    return null;
  }
};

const packages = ref<Package[]>([]);

const loadPackages = async () => {
  try {
    loadingPackages.value = true;
    packagesError.value = false;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    packages.value = [
      {
        id: "1",
        name: "Paket Tawaf",
        timeRange: "Waktu: 20.00 - 21.00",
        originalPrice: 300000,
        discountedPrice: 150000,
        imageUrl: "/voucher-1.webp",
      },
      {
        id: "2",
        name: "Paket S+1",
        timeRange: "Waktu: 20.00 - 21.00",
        originalPrice: 300000,
        discountedPrice: 150000,
        imageUrl: "/voucher-1.webp",
      },
    ];
  } catch (error) {
    packagesError.value = true;
    console.error("Error loading packages:", error);
  } finally {
    loadingPackages.value = false;
  }
};

onMounted(async () => {
  try {
    // Reset transaction store when landing on home page
    transactionStore.resetTransaction();

    // Simulate loading all data
    await Promise.all([
      new Promise((resolve) =>
        setTimeout(() => {
          loadingLocation.value = false;
          resolve(true);
        }, 800)
      ),
      new Promise((resolve) =>
        setTimeout(() => {
          loadingUser.value = false;
          resolve(true);
        }, 1000)
      ),
      loadPackages(),
    ]);
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
});

// Methods
const bookPackage = (pkg: Package) => {
  console.log("Booking package:", pkg);
  // Store the selected package in the transaction store
  transactionStore.selectPackage(pkg);
  // Navigate to the agent selection page if no agent is selected yet
  if (!transactionStore.hasSelectedAgent) {
    router.push("/search");
  } else {
    // If agent is already selected, go directly to transaction detail
    router.push("/search");
  }
};
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
