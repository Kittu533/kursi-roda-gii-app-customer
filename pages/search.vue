<template>
  <div class="pb-20">
    <!-- Header -->
    <div class="py-4 px-5 flex items-center gap-3">
  <button @click="$router.back()" class="shrink-0">
    <NuxtIcon name="material-symbols-light:chevron-left" class="h-8 w-8 text-center justify-start flex" />
  </button>
  
  <div class="flex-1 min-w-0 flex items-center gap-3">
    <div class="shrink-0 bg-white border border-orange-400 rounded-full h-9 w-9 flex items-center justify-center">
      <NuxtIcon name="mdi:map-marker" class="text-gray-500 h-5 w-5" />
    </div>
    
    <div class="min-w-0">
      <p class="text-sm font-normal truncate">
        {{ selectedLocation?.name || "Select Location" }}
      </p>
      <p class="text-xs font-normal text-orange-500 truncate">
        {{ selectedLocation?.address || "No address selected" }}
      </p>
    </div>
  </div>
</div>

    <!-- Search Bar -->
    <div class="py-[16px] px-[20px]">
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <!-- Search icon -->
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <NuxtIcon name="ic:twotone-search" class="text-gray-500 h-5 w-5" />
          </div>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari lokasi terdekat"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-[10px] text-sm"
        />
      </div>
    </div>

    <!-- Search Results -->
    <div class="mt-2 py-[16px] px-[20px]">
      <div
        class="border border-gray-200 rounded-[10px]"
        v-if="filteredLocations.length > 0"
      >
        <div
          v-for="location in filteredLocations"
          :key="location.id"
          class="flex items-center p-3 border-b border-gray-100"
          @click="selectLocation(location)"
        >
          <div class="flex flex-col items-center justify-center mr-3">
            <div
              class="bg-[#FF5F00] rounded-full h-[40px] w-[40px] flex items-center justify-center mr-3"
            >
              <NuxtIcon
                name="mdi:map-marker"
                class="text-white"
                style="width: 20px; height: 20px"
              />
            </div>
            <div class="text-xs text-center mr-3 text-gray-400">
              {{ location.distance }} km
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-sm">{{ location.name }}</h3>
            <p class="text-xs text-gray-500 line-clamp-1">
              {{ location.address }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="p-4 text-center text-gray-500">No locations found</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Coordinates {
  lat: number;
  lng: number;
}

interface RecentLocation {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  lastUsed: number;
  timestamp: number;
  distance?: number; // Added for compatibility with the locations list
}

const searchQuery = ref("");
const selectedLocation = ref<RecentLocation | null>(null);
const router = useRouter();

// Function to get the most recent location from localStorage
const getMostRecentLocation = (): RecentLocation | null => {
  try {
    const recentLocations = localStorage.getItem("recentLocations");
    if (!recentLocations) return null;
    
    const locations: RecentLocation[] = JSON.parse(recentLocations);
    if (locations.length === 0) return null;
    
    // Sort by lastUsed timestamp in descending order
    locations.sort((a, b) => b.lastUsed - a.lastUsed);
    return locations[0];
  } catch (error) {
    console.error("Error reading recent locations:", error);
    return null;
  }
};

// Sample locations data with distance
const locations = ref<RecentLocation[]>([
  {
    id: "1",
    name: "Agen A",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
    coordinates: { lat: 0, lng: 0 },
    lastUsed: Date.now(),
    timestamp: Date.now(),
  },
  {
    id: "2",
    name: "Agen B",
    address: "Jl. Ibrahim No. 12, Al-Haram, Makkah, Arab Saudi",
    distance: 10,
    coordinates: { lat: 0, lng: 0 },
    lastUsed: Date.now(),
    timestamp: Date.now(),
  },
  // Add more locations as needed
]);

const filteredLocations = computed(() => {
  if (!searchQuery.value) return locations.value;

  const query = searchQuery.value.toLowerCase();
  return locations.value.filter(
    (location) =>
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query)
  );
});

const selectLocation = (location: RecentLocation) => {
  console.log("Selected location:", location);
  selectedLocation.value = location;

  // Update lastUsed timestamp
  location.lastUsed = Date.now();

  // Update in localStorage
  try {
    const recentLocations = localStorage.getItem("recentLocations");
    let locations: RecentLocation[] = recentLocations
      ? JSON.parse(recentLocations)
      : [];

    // Update or add the location
    const index = locations.findIndex((loc) => loc.id === location.id);
    if (index !== -1) {
      locations[index] = location;
    } else {
      locations.push(location);
    }

    localStorage.setItem("recentLocations", JSON.stringify(locations));
  } catch (error) {
    console.error("Error updating recent locations:", error);
  }

  router.push({
    name: "date-selection",
    query: {
      locationId: location.id,
      locationName: encodeURIComponent(location.name),
      from: "search",
    },
  });
};

onMounted(() => {
  // Set page meta
  definePageMeta({
    title: "Search Location",
  });

  // Load most recent location
  const mostRecentLocation = getMostRecentLocation();
  if (mostRecentLocation) {
    selectedLocation.value = mostRecentLocation;
  } else {
    // Fallback default location if no recent locations exist
    selectedLocation.value = {
      id: "default",
      name: "Default Location",
      address: "Please select a location",
      coordinates: { lat: 0, lng: 0 },
      lastUsed: Date.now(),
      timestamp: Date.now(),
    };
  }
});
</script>