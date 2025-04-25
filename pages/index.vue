<template>
  <div class="pb-20">
    <!-- User Profile Section -->
    <NuxtLink to="/location-selection" class="sticky top-0 z-10">
      <div class="p-4 flex items-center bg-white shadow-sm rounded-lg mb-2">
        <div
          class="bg-white border border-[#FF9732] rounded-full h-[36px] w-[36px] flex items-center justify-center mr-3"
        >
          <NuxtIcon name="mdi:map-marker" class="text-gray-500 h-5 w-5" />
        </div>
        <div class="flex-1 bg-white">
          <h3 class="text-xs text-gray-500">Alamat</h3>
          <p class="text-sm font-medium line-clamp-1">
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

    <!-- Search Bar -->
    <div class="px-4 py-2">
      <SearchBar v-model="searchQuery" placeholder="Cari lokasi terdekat" />
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

    <!-- Agents Section -->
    <div class="px-4 py-2">
      <h2 class="font-medium mb-2">Agen Kami</h2>

      <!-- Skeleton loading for agents -->
      <div
        v-if="loadingAgents"
        class="bg-white rounded-lg overflow-hidden space-y-3"
      >
        <div
          v-for="i in 3"
          :key="`agent-skeleton-${i}`"
          class="p-4 last:border-b-0"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Skeleton height="48px" width="48px" class="rounded-full" />
              <div class="space-y-2">
                <Skeleton height="18px" width="120px" />
                <Skeleton height="14px" width="160px" />
              </div>
            </div>
            <Skeleton height="32px" width="80px" class="rounded" />
          </div>
        </div>
      </div>

      <!-- Actual agent content -->
      <div v-else class="bg-white rounded-lg overflow-hidden shadow-sm">
        <AgentCard
          v-for="agent in agents"
          :key="agent.id"
          :agent="agent"
          showActionButton
          @action="viewAgent"
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

const router = useRouter();
const transactionStore = useTransactionStore();

const loadingLocation = ref(true);
const loadingUser = ref(true);
const loadingPackages = ref(true);
const loadingAgents = ref(true);
const packagesError = ref(false);
const agentsError = ref(false);

const searchQuery = ref("");

// Mock data
const user = ref<User>({
  id: "1",
  name: "Cahya",
  avatarUrl: "/avatar.webp",
  status: "Selamat kali nada sesuai kebutuhanmu!",
});

const currentLocation = ref<Location>({
  id: "1",
  name: "MAKKAH TOWER",
  address: "MAKKAH TOWER, Al Haram, Makkah, Arab Saudi",
});

const packages = ref<Package[]>([]);
const agents = ref<Agent[]>([]);

const loadPackages = async () => {
  try {
    loadingPackages.value = true;
    packagesError.value = false;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.error('Error loading packages:', error);
  } finally {
    loadingPackages.value = false;
  }
};

const loadAgents = async () => {
  try {
    loadingAgents.value = true;
    agentsError.value = false;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    agents.value = [
      {
        id: "1",
        name: "Agen A",
        address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
        distance: 1.0,
        distanceUnit: "km",
        rating: 4.5,
        isAvailable: true,
      },
      {
        id: "2",
        name: "Agen B",
        address: "Jl. Ibrahim No. 15, Al-Haram, Makkah, Arab Saudi",
        distance: 1.1,
        distanceUnit: "km",
        rating: 4.2,
        isAvailable: true,
      },
    ];
  } catch (error) {
    agentsError.value = true;
    console.error('Error loading agents:', error);
  } finally {
    loadingAgents.value = false;
  }
};

onMounted(async () => {
  try {
    // Reset transaction store when landing on home page
    transactionStore.resetTransaction();
    
    // Simulate loading all data
    await Promise.all([
      new Promise(resolve => setTimeout(() => {
        loadingLocation.value = false;
        resolve(true);
      }, 800)),
      new Promise(resolve => setTimeout(() => {
        loadingUser.value = false;
        resolve(true);
      }, 1000)),
      loadPackages(),
      loadAgents(),
    ]);
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
});

// Methods
const bookPackage = (pkg: Package) => {
  console.log("Booking package:", pkg);
  // Store the selected package in the transaction store
  transactionStore.selectPackage(pkg);
  // Navigate to the agent selection page if no agent is selected yet
  if (!transactionStore.hasSelectedAgent) {
    router.push('/search');
  } else {
    // If agent is already selected, go directly to transaction detail
    router.push('/search');
  }
};

const viewAgent = (agent: Agent) => {
  console.log("Viewing agent:", agent);
  // Store the selected agent in the transaction store
  transactionStore.selectAgent(agent);
  // If a package is already selected, go to transaction detail
  if (transactionStore.isPackageBooking) {
    router.push('/transaction-detail');
  } else {
    // If no package is selected, go to custom booking page
    router.push('/custom-booking');
  }
};
</script>

<style>
@keyframes pulse {
  0%, 100% {
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