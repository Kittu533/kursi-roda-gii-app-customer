<template>
  <div class="pb-20 bg-white h-screen">
   <div class="flex flex-col bg-white sticky top-0 z-[100000]">
     <!-- Header -->
     <div class="p-4 flex items-center">
      <button @click="goBack" class="mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 class="text-base font-medium">Lokasi</h1>
    </div>

    <!-- Search Bar -->
    <div class="px-4 pb-2">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari titik lokasi"
          class="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-sm"
        />
      </div>
    </div>
   </div>

    <!-- Map -->
    <div class="relative h-380 bg-gray-100">
      <!-- Map Instructions -->
      <div class="absolute top-4 left-12 bg-white p-3 rounded-md shadow-sm z-[1000]">
        <div class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500 mr-2 mt-0.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p class="text-xs text-gray-600">
            Mohon pastikan titik anda sesuai dengan lokasi anda saat ini untuk memudahkan kurir anda
          </p>
        </div>
      </div>
      <div class="h-[380px]" id="map-standard"></div>
      
      <!-- Current Location Button -->
      <button 
        @click="locateUser"
        class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md z-[1000]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 0 0-10 10c0 5.5 10 10 10 10s10-4.5 10-10a10 10 0 0 0-10-10z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
    </div>

    <!-- Selected Location Section -->
    <div v-if="selectedLocation" class="p-4 border-t border-gray-200">
      <h2 class="font-medium text-sm mb-3">Lokasi Dipilih</h2>
      <div class="flex items-start py-3 bg-orange-50 rounded-lg px-3">
        <div class="bg-orange-100 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-sm">{{ selectedLocation.name }}</h3>
          <p class="text-xs text-gray-500 mb-1">{{ selectedLocation.address }}</p>
          <p v-if="selectedLocation.phoneNumber" class="text-xs text-gray-500">
            {{ selectedLocation.phoneNumber }}
          </p>
        </div>
      </div>
    </div>

    <!-- Current Location Section -->
    <div v-if="currentLocation" class="p-4 border-t border-gray-200">
      <h2 class="font-medium text-sm mb-3">Lokasi Saat Ini</h2>
      <div class="flex items-start py-3" @click="selectCurrentLocation">
        <div class="bg-orange-100 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-sm">{{ currentLocation.name }}</h3>
          <p class="text-xs text-gray-500">{{ currentLocation.address }}</p>
        </div>
      </div>
    </div>

    <!-- Saved Locations Section -->
    <div class="p-4 border-t border-gray-200">
      <h2 class="font-medium text-sm mb-3">Lokasi Tersimpan</h2>
      <div class="space-y-4">
        <div
          v-for="location in savedLocations"
          :key="location.id"
          class="flex items-start py-3"
          @click="selectSavedLocation(location)"
        >
          <div class="bg-orange-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-sm">{{ location.name }}</h3>
            <p class="text-xs text-gray-500 mb-1">{{ location.address }}</p>
            <p v-if="location.phoneNumber" class="text-xs text-gray-500">
              {{ location.phoneNumber }}
            </p>
          </div>
        </div>
      </div>

      <!-- Add New Location Button -->
      <div class="mt-4">
        <button
          @click="addNewLocation"
          class="w-full flex items-center justify-between py-3 px-3 border border-gray-200 rounded-md text-sm"
        >
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Tambahkan Titik Alamat Baru</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Confirmation Button (Fixed at bottom) -->
    <div v-if="selectedLocation" class=" bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <button
        @click="confirmLocation"
        class="w-full bg-orange-500 text-white py-2 px-4 rounded-md shadow-md text-sm font-medium"
      >
        Gunakan Lokasi Ini
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import BottomNavigation from "~/components/user/bottom-navigation.vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const router = useRouter();
const searchQuery = ref("");
const currentLocation = ref<Location | null>(null);
const selectedLocation = ref<Location | null>(null);
const currentMarker = ref<L.Marker | null>(null);
const map = ref<L.Map | null>(null);

// Sample data for saved locations
const savedLocations = ref<Location[]>([
  {
    id: "1",
    name: "Lokasi Saat Ini",
    address: "Sedang mendeteksi lokasi...",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
  {
    id: "2",
    name: "Universitas Teknologi Yogyakarta",
    address: "Jl. Ringroad Utara, Jombor, Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55285",
    coordinates: {
      lat: -7.747033,
      lng: 110.355398,
    },
  },
  {
    id: "3",
    name: "Rumah",
    address: "Dusun Tiga Trihanggo, RT. 8/ RW. 18, Trihanggo, Mlati, Kab. Sleman",
    phoneNumber: "Cahya (+62) 821-4680-4915",
    coordinates: {
      lat: -7.747033,
      lng: 110.355398,
    },
  },
]);

// Save locations to localStorage
const saveLocationsToStorage = () => {
  try {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations.value));
    console.log('Locations saved to localStorage');
  } catch (error) {
    console.error('Error saving locations to localStorage:', error);
  }
};

// Initialize map
onMounted(() => {
  try {
    map.value = L.map('map-standard').setView([-7.75422, 110.38534], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      minZoom: 8,
      maxZoom: 18
    }).addTo(map.value);

    // Add click event to map
    map.value.on('click', (e: L.LeafletMouseEvent) => {
      updateCurrentLocation(e.latlng.lat, e.latlng.lng);
    });

    // Load last selected location if available
    const lastSelected = localStorage.getItem('lastSelectedLocation');
    if (lastSelected) {
      selectedLocation.value = JSON.parse(lastSelected);
      console.log('Loaded last selected location from localStorage:', selectedLocation.value);
    }
  } catch (error) {
    console.error('Error initializing map:', error);
  }
});


// Clean up map
onUnmounted(() => {
  try {
    if (map.value) {
      map.value.remove();
    }
  } catch (error) {
    console.error('Error cleaning up map:', error);
  }
});

// Get user's current location
const locateUser = () => {
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateCurrentLocation(latitude, longitude);
          
          if (map.value) {
            map.value.setView([latitude, longitude], 17);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Gagal mendapatkan lokasi. Pastikan izin lokasi telah diberikan.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Browser tidak mendukung geolokasi.");
    }
  } catch (error) {
    console.error('Error in locateUser:', error);
  }
};
// Update current location marker
const updateCurrentLocation = async (lat: number, lng: number) => {
  try {
    if (!map.value) return;

    // Remove existing marker
    if (currentMarker.value) {
      map.value.removeLayer(currentMarker.value);
    }

    // Create new marker
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="relative">
               <div class="w-6 h-6 bg-orange-500 rounded-full animate-ping opacity-75"></div>
               <div class="absolute top-1 left-1 w-4 h-4 bg-orange-600 rounded-full"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    currentMarker.value = L.marker([lat, lng], { icon: customIcon })
      .addTo(map.value)
      .bindPopup("Lokasi Anda Saat Ini");

    // Reverse geocoding to get address
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    
    const address = data.display_name || "Alamat tidak ditemukan";
    const newLocation = {
      id: `loc-${Date.now()}`,
      name: "Lokasi Peta",
      address: address,
      coordinates: { lat, lng },
      timestamp: Date.now()
    };

    console.log('Location data from map selection:', {
      coordinates: { lat, lng },
      addressData: data,
      processedLocation: newLocation
    });

    currentLocation.value = newLocation;
    selectedLocation.value = newLocation;

    // Save to localStorage
    try {
      localStorage.setItem('lastSelectedLocation', JSON.stringify(newLocation));
      console.log('Saved selected location to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

  } catch (error) {
    console.error('Error in updateCurrentLocation:', error);
    
    // Fallback if geocoding fails
    const newLocation = {
      id: `loc-${Date.now()}`,
      name: "Lokasi Peta",
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      coordinates: { lat, lng },
      timestamp: Date.now()
    };
    
    currentLocation.value = newLocation;
    selectedLocation.value = newLocation;
  }
};

const selectCurrentLocation = () => {
  if (currentLocation.value) {
    selectedLocation.value = currentLocation.value;
    if (map.value) {
      map.value.setView(
        [currentLocation.value.coordinates.lat, currentLocation.value.coordinates.lng], 
        17
      );
    }
  }
};

// Select location from saved locations or map
const selectLocation = (location: Location) => {
  try {
    selectedLocation.value = location;
    
    // Center map on selected location
    if (map.value) {
      map.value.setView([location.coordinates.lat, location.coordinates.lng], 17);
      
      // Update marker
      if (currentMarker.value) {
        map.value.removeLayer(currentMarker.value);
      }
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="relative">
                 <div class="w-6 h-6 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                 <div class="absolute top-1 left-1 w-4 h-4 bg-orange-600 rounded-full"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      currentMarker.value = L.marker(
        [location.coordinates.lat, location.coordinates.lng], 
        { icon: customIcon }
      ).addTo(map.value);
    }

    // Save to localStorage
    localStorage.setItem('lastSelectedLocation', JSON.stringify(location));
    console.log('Selected location:', location);
  } catch (error) {
    console.error('Error in selectLocation:', error);
  }
};

// Confirm selected location
const confirmLocation = () => {
  try {
    if (selectedLocation.value) {
      console.log("Confirmed location data:", selectedLocation.value);
      
      // Save to recent locations
      const recentLocations = JSON.parse(localStorage.getItem('recentLocations') || '[]');
      recentLocations.unshift({
        ...selectedLocation.value,
        lastUsed: Date.now()
      });
      
      // Keep only last 5 locations
      const updatedRecentLocations = recentLocations.slice(0, 5);
      localStorage.setItem('recentLocations', JSON.stringify(updatedRecentLocations));

      router.push({
        name: 'index',
        query: {
          locationId: selectedLocation.value.id,
          locationName: selectedLocation.value.name,
          lat: selectedLocation.value.coordinates.lat.toString(),
          lng: selectedLocation.value.coordinates.lng.toString(),
          address: selectedLocation.value.address
        }
      });
    }
  } catch (error) {
    console.error('Error in confirmLocation:', error);
  }
};


const addNewLocation = () => {
  try {
    console.log("Adding new location");
    // Implement logic to add a new location
  } catch (error) {
    console.error('Error in addNewLocation:', error);
  }
};

const goBack = () => {
  try {
    router.back();
  } catch (error) {
    console.error('Error in goBack:', error);
  }
};
</script>

<style>
.custom-marker {
  background: transparent;
  border: none;
}
</style>