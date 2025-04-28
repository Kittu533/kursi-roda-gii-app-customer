<template>
    <div class="pb-20 bg-white min-h-screen">
      <!-- Header -->
      <div class="p-4 flex items-center sticky top-0 bg-white z-50 border-b border-gray-100">
        <button @click="goBack" class="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 class="text-base font-medium">Tambah Alamat Baru</h1>
      </div>
  
      <!-- Map Section -->
      <div class="relative h-[250px] bg-gray-100">
        <div class="h-full" id="map-add-location"></div>
        
        <!-- Map Instructions -->
        <div class="absolute top-4 left-4 right-4 bg-white p-3 rounded-md shadow-sm z-10">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500 mr-2 mt-0.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p class="text-xs text-gray-600">
              Geser peta atau tekan lokasi untuk menentukan titik alamat baru Anda
            </p>
          </div>
        </div>
        
        <!-- Current Location Button -->
        <button 
          @click="locateUser"
          class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 0 0-10 10c0 5.5 10 10 10 10s10-4.5 10-10a10 10 0 0 0-10-10z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
  
      <!-- Form Section -->
      <div class="p-4">
        <form @submit.prevent="saveAddress">
          <!-- Address Details from Map -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <div class="flex items-start py-3 px-3 bg-orange-50 rounded-lg">
              <div class="bg-orange-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500">{{ addressFromMap }}</p>
                <button 
                  type="button" 
                  @click="adjustLocation" 
                  class="text-xs text-orange-500 font-medium mt-1"
                >
                  Sesuaikan Lokasi
                </button>
              </div>
            </div>
          </div>
  
          <!-- Location Name -->
          <div class="mb-4">
            <label for="locationName" class="block text-sm font-medium text-gray-700 mb-1">Nama Lokasi</label>
            <input
              id="locationName"
              v-model="locationName"
              type="text"
              placeholder="Contoh: Rumah, Kantor, dll."
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
  
          <!-- Detailed Address -->
          <div class="mb-4">
            <label for="detailedAddress" class="block text-sm font-medium text-gray-700 mb-1">Detail Alamat</label>
            <textarea
              id="detailedAddress"
              v-model="detailedAddress"
              placeholder="Masukkan detail alamat (lantai, patokan, dll.)"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            ></textarea>
          </div>
  
          <!-- Contact Information -->
          <div class="mb-4">
            <label for="contactName" class="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
            <input
              id="contactName"
              v-model="contactName"
              type="text"
              placeholder="Nama penerima"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
            />
            
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input
              id="phoneNumber"
              v-model="phoneNumber"
              type="tel"
              placeholder="Nomor telepon penerima"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
  
          <!-- Set as Default -->
          <div class="mb-6">
            <div class="flex items-center">
              <input
                id="defaultLocation"
                v-model="isDefault"
                type="checkbox"
                class="h-4 w-4 text-orange-500 border-gray-300 rounded"
              />
              <label for="defaultLocation" class="ml-2 block text-sm text-gray-700">
                Jadikan sebagai alamat utama
              </label>
            </div>
          </div>
  
          <!-- Save Button -->
          <button
            type="submit"
            class="w-full bg-orange-500 text-white py-3 px-4 rounded-md shadow-md text-sm font-medium"
            :disabled="!isFormValid || isSaving"
          >
            {{ isSaving ? 'Menyimpan...' : 'Simpan Alamat' }}
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { useLocationStore } from '@/store/location-store';
  
  // Router
  const router = useRouter();
  
  // Store
  const locationStore = useLocationStore();
  
  // Form state
  const locationName = ref('');
  const detailedAddress = ref('');
  const contactName = ref('');
  const phoneNumber = ref('');
  const isDefault = ref(false);
  const isSaving = ref(false);
  
  // Map state
  const map = ref<L.Map | null>(null);
  const currentMarker = ref<L.Marker | null>(null);
  const coordinates = ref({ lat: -7.75422, lng: 110.38534 }); // Default to Yogyakarta
  const addressFromMap = ref('Mencari alamat...');
  
  // Computed
  const isFormValid = computed(() => {
    return locationName.value.trim() !== '' && addressFromMap.value !== 'Mencari alamat...';
  });
  
  let mapInitialized = false;
  
  // Initialize map
  onMounted(() => {
    initMap();
    locateUser();
  });
  
  // Clean up
  onUnmounted(() => {
    if (map.value) {
      map.value.remove();
    }
    mapInitialized = false;
  });
  
  // Initialize map
  const initMap = () => {
    if (mapInitialized) return;
    try {
      map.value = L.map('map-add-location').setView([coordinates.value.lat, coordinates.value.lng], 15);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        minZoom: 8,
        maxZoom: 18
      }).addTo(map.value);
  
      // Add click event to map
      map.value.on('click', (e: L.LeafletMouseEvent) => {
        updateMarkerPosition(e.latlng.lat, e.latlng.lng);
      });
  
      // Add drag end event
      map.value.on('moveend', () => {
        if (map.value) {
          const center = map.value.getCenter();
          updateMarkerPosition(center.lat, center.lng);
        }
      });
      mapInitialized = true;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };
  
  // Get user's current location
  const locateUser = () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateMarkerPosition(latitude, longitude);
            
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
  
  // Update marker position and get address
  const updateMarkerPosition = async (lat: number, lng: number) => {
    try {
      if (!map.value) return;
  
      // Update coordinates
      coordinates.value = { lat, lng };
  
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
        .addTo(map.value);
  
      // Get address from coordinates (reverse geocoding)
      addressFromMap.value = 'Mencari alamat...';
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        addressFromMap.value = data.display_name || "Alamat tidak ditemukan";
      } catch (error) {
        console.error('Error getting address:', error);
        addressFromMap.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Error updating marker position:', error);
    }
  };
  
  // Adjust location (center map on marker)
  const adjustLocation = () => {
    if (map.value && coordinates.value) {
      map.value.setView([coordinates.value.lat, coordinates.value.lng], 17);
    }
  };
  
  // Save address
  const saveAddress = async () => {
    try {
      isSaving.value = true;
      
      // Create new location object
      const newLocation = {
        id: `loc-${Date.now()}`,
        name: locationName.value,
        address: addressFromMap.value,
        detailedAddress: detailedAddress.value,
        phoneNumber: contactName.value ? `${contactName.value} ${phoneNumber.value}` : phoneNumber.value,
        coordinates: coordinates.value,
        isDefault: isDefault.value,
        createdAt: Date.now()
      };
      
      // Save to store
      await locationStore.addLocation(newLocation);
      
      // Navigate back to location selection
      router.push({ name: 'location-selection' });
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Gagal menyimpan alamat. Silakan coba lagi.');
    } finally {
      isSaving.value = false;
    }
  };
  
  // Go back
  const goBack = () => {
    router.back();
  };
  </script>
  
  <style scoped>
  .custom-marker {
    background: transparent;
    border: none;
  }
  </style>