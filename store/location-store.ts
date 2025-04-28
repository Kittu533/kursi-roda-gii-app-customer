import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  detailedAddress?: string;
  phoneNumber?: string;
  coordinates: Coordinates;
  isDefault?: boolean;
  createdAt: number;
}

export const useLocationStore = defineStore('location', () => {
  // State
  const locations = ref<Location[]>([]);
  const selectedLocation = ref<Location | null>(null);

  // Initialize from localStorage
  const initializeStore = () => {
    try {
      const savedLocations = localStorage.getItem('savedLocations');
      if (savedLocations) {
        locations.value = JSON.parse(savedLocations);
      }

      const lastSelected = localStorage.getItem('lastSelectedLocation');
      if (lastSelected) {
        selectedLocation.value = JSON.parse(lastSelected);
      }
    } catch (error) {
      console.error('Error initializing location store:', error);
    }
  };

  // Call initialize on store creation
  initializeStore();

  // Actions
  const addLocation = async (location: Location) => {
    try {
      // Add new location
      locations.value.push(location);
      
      // If marked as default, update other locations
      if (location.isDefault) {
        locations.value = locations.value.map(loc => {
          if (loc.id !== location.id) {
            return { ...loc, isDefault: false };
          }
          return loc;
        });
      }
      
      // Save to localStorage
      saveToLocalStorage();
      
      return location;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  const updateLocation = async (location: Location) => {
    try {
      const index = locations.value.findIndex(loc => loc.id === location.id);
      if (index !== -1) {
        // Update location
        locations.value[index] = location;
        
        // If marked as default, update other locations
        if (location.isDefault) {
          locations.value = locations.value.map(loc => {
            if (loc.id !== location.id) {
              return { ...loc, isDefault: false };
            }
            return loc;
          });
        }
        
        // Save to localStorage
        saveToLocalStorage();
        
        return location;
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  };

  const deleteLocation = async (locationId: string) => {
    try {
      locations.value = locations.value.filter(loc => loc.id !== locationId);
      
      // Save to localStorage
      saveToLocalStorage();
      
      return true;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  };

  const selectLocation = (location: Location) => {
    selectedLocation.value = location;
    localStorage.setItem('lastSelectedLocation', JSON.stringify(location));
  };

  // Helper function to save to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('savedLocations', JSON.stringify(locations.value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return {
    locations,
    selectedLocation,
    addLocation,
    updateLocation,
    deleteLocation,
    selectLocation
  };
});