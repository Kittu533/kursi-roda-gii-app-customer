<template>
  <div class="flex flex-col h-screen bg-white">
    <!-- Header -->
    <div class="py-[16px] px-[20px] flex items-center">
      <button @click="$router.back()" class="mr-3">
        <!-- Back icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="flex-1 flex items-center">
        <div
          class="bg-white border border-[#FF9732] rounded-full h-[36px] w-[36px] flex items-center justify-center mr-3"
        >
          <NuxtIcon name="mdi:map-marker" class="text-orange-500 h-5 w-5" />
        </div>
        <div>
          <p class="text-[14px] font-[400px]">
            {{ selectedLocation?.name || "Select Location" }}
          </p>
          <p class="text-[12px] font-[400px] text-[#FF5F00]">
            {{ selectedLocation?.address || "No address selected" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Rental Type Tabs -->
    <div class="flex">
      <button
        @click="activeTab = 'daily'"
        class="flex-1 py-3 text-center font-medium text-sm relative"
        :class="activeTab === 'daily' ? 'text-orange-500' : 'text-gray-500'"
      >
        Perhari
        <div
          v-if="activeTab === 'daily'"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
        ></div>
      </button>
      <button
        @click="activeTab = 'hourly'"
        class="flex-1 py-3 text-center font-medium text-sm relative"
        :class="activeTab === 'hourly' ? 'text-orange-500' : 'text-gray-500'"
      >
        Perjam
        <div
          v-if="activeTab === 'hourly'"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
        ></div>
      </button>
    </div>

    <!-- Date Selection Form -->
    <div class="p-4 flex-1">
      <div class="space-y-4">
        <!-- Daily Rental Form -->
        <div v-if="activeTab === 'daily'" class="space-y-2">
          <!-- Rental Date -->
          <div
            class="flex items-center justify-between border border-gray-200 rounded-[10px] px-3 py-3"
          >
            <span class="text-gray-500">Tanggal Sewa</span>
            <DatePicker
              v-model="dateRange.startDate"
              placeholder="Pilih tanggal"
              :min-date="new Date()"
            />
          </div>

          <!-- Return Date -->
          <div
            class="flex items-center justify-between border rounded-[10px] px-3 border-gray-200 py-3"
          >
            <span class="text-gray-500">Tanggal Kembali</span>
            <DatePicker
              v-model="dateRange.endDate"
              placeholder="Pilih tanggal"
              :min-date="dateRange.startDate || new Date()"
              :disabled-dates="isBeforeStartDate"
            />
          </div>
        </div>

        <!-- Hourly Rental Form -->
        <div v-else>
          <!-- Rental Date -->
          <div
            class="flex items-center justify-between border-b border-gray-200 py-3"
          >
            <span class="text-gray-500">Tanggal Sewa</span>
            <DatePicker
              v-model="dateRange.startDate"
              placeholder="Pilih tanggal"
              :min-date="new Date()"
            />
          </div>

          <!-- Rental Time -->
          <div
            class="flex items-center justify-between border-b border-gray-200 py-3"
          >
            <span class="text-gray-500">Jam Sewa</span>
            <TimePicker
              v-model="timeRange.startTime"
              placeholder="Pilih jam"
              title="Pilih Jam Sewa"
              description="Pilih jam mulai sewa Anda"
              :quick-time-options="quickTimeOptions"
              @update:model-value="handleStartTimeChange"
            />
          </div>

          <!-- Return Time -->
          <div
            class="flex items-center justify-between border-b border-gray-200 py-3"
          >
            <span class="text-gray-500">Jam Kembali</span>
            <TimePicker
              v-model="timeRange.endTime"
              placeholder="Pilih jam"
              title="Pilih Jam Kembali"
              description="Pilih jam pengembalian Anda"
              :quick-time-options="quickTimeOptions"
              :min-time="getMinEndTime()"
              @update:model-value="validateEndTime"
            />
          </div>
        </div>
      </div>

      <!-- Search Button -->
      <div class="mt-8">
        <button
          @click="search"
          :disabled="!isSelectionValid"
          class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
          :class="{ 'opacity-70 cursor-not-allowed': !isSelectionValid }"
        >
          Cari
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useRentalStore } from "~/store/rental";
import DatePicker from "~/components/ui/date-picker.vue";
import TimePicker from "~/components/ui/time-picker.vue";
import BottomNavigation from "~/components/user/bottom-navigation.vue";

// Define interfaces
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface TimeRange {
  startTime: Date | null;
  endTime: Date | null;
}

interface Location {
  name: string;
  address: string;
}

interface TimeOption {
  label: string;
  hour: number;
  minute: number;
}

const router = useRouter();
const rentalStore = useRentalStore();

// Location data (in a real app, this would come from props or store)
const location = ref<Location>({
  name: "Agen A",
  address: "Jl. Ibrahim Al-Khalil No. 12, Al-Haram, Makkah",
});

// Tab state
const activeTab = ref<"daily" | "hourly">("daily");

// Date state
const dateRange = ref<DateRange>({
  startDate: null,
  endDate: null,
});

// Time state
const timeRange = ref<TimeRange>({
  startTime: null,
  endTime: null,
});

// Quick time options
const quickTimeOptions: TimeOption[] = [
  { label: "08:00", hour: 8, minute: 0 },
  { label: "10:00", hour: 10, minute: 0 },
  { label: "12:00", hour: 12, minute: 0 },
  { label: "14:00", hour: 14, minute: 0 },
  { label: "16:00", hour: 16, minute: 0 },
  { label: "18:00", hour: 18, minute: 0 },
  { label: "20:00", hour: 20, minute: 0 },
  { label: "22:00", hour: 22, minute: 0 },
];

// Helper function to check if a date is before the start date
const isBeforeStartDate = (date: Date): boolean => {
  if (!dateRange.value.startDate) return false;
  return date < dateRange.value.startDate;
};

// Get minimum end time based on start time
const getMinEndTime = (): Date | undefined => {
  if (!timeRange.value.startTime) return undefined;

  // Return a time that's 1 hour after the start time
  const minEndTime = new Date(timeRange.value.startTime);
  minEndTime.setHours(minEndTime.getHours() + 1);
  return minEndTime;
};

// Handle start time change
const handleStartTimeChange = (newTime: Date) => {
  // If end time exists and is before the new start time, update it
  if (timeRange.value.endTime && timeRange.value.endTime <= newTime) {
    const newEndTime = new Date(newTime);
    newEndTime.setHours(newEndTime.getHours() + 2);
    timeRange.value.endTime = newEndTime;
  }
};

// Validate end time
const validateEndTime = (newTime: Date) => {
  if (!timeRange.value.startTime) return;

  // If on same date, ensure end time is after start time
  if (
    dateRange.value.startDate &&
    (!dateRange.value.endDate ||
      dateRange.value.startDate.toDateString() ===
        dateRange.value.endDate?.toDateString())
  ) {
    if (newTime <= timeRange.value.startTime) {
      alert("Jam kembali harus setelah jam sewa");
      // Reset to a valid time
      const validEndTime = new Date(timeRange.value.startTime);
      validEndTime.setHours(validEndTime.getHours() + 2);
      timeRange.value.endTime = validEndTime;
    }
  }
};

// Check if selection is valid
const isSelectionValid = computed(() => {
  if (activeTab.value === "daily") {
    return (
      dateRange.value.startDate !== null && dateRange.value.endDate !== null
    );
  } else {
    return (
      dateRange.value.startDate !== null &&
      timeRange.value.startTime !== null &&
      timeRange.value.endTime !== null
    );
  }
});

// Format date for display
const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Format time for display
const formatTime = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Search function - UPDATED to navigate to location-selection page
const search = () => {
  if (!isSelectionValid.value) return;

  if (activeTab.value === "daily") {
    rentalStore.setRentalDetails({
      type: "daily",
      startDate: dateRange.value.startDate,
      endDate: dateRange.value.endDate,
      location: location.value,
    });

    const formattedStartDate = dateRange.value.startDate?.toISOString();
    const formattedEndDate = dateRange.value.endDate?.toISOString();

    router.push({
      name: "product-selection",
      query: {
        type: "daily",
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
    });
  } else {
    // Save to store
    rentalStore.setRentalDetails({
      type: "hourly",
      date: dateRange.value.startDate,
      startTime: timeRange.value.startTime,
      endTime: timeRange.value.endTime,
      location: location.value,
    });

    // Format for query parameters
    const formattedDate = formatDate(dateRange.value.startDate);
    const formattedStartTime = formatTime(timeRange.value.startTime);
    const formattedEndTime = formatTime(timeRange.value.endTime);

    // Navigate to product-selection instead of search-results
    router.push({
      name: "product-selection",
      query: {
        type: "hourly",
        date: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      },
    });
  }
};

// Watch for tab changes to reset form if needed
watch(activeTab, (newTab) => {
  // Reset time-related fields when switching to daily mode
  if (newTab === "daily") {
    timeRange.value.startTime = null;
    timeRange.value.endTime = null;
  }

  // When switching to hourly mode, initialize times if dates are already selected
  if (newTab === "hourly" && dateRange.value.startDate) {
    if (!timeRange.value.startTime) {
      const defaultStartTime = new Date(dateRange.value.startDate);
      defaultStartTime.setHours(8);
      defaultStartTime.setMinutes(0);
      timeRange.value.startTime = defaultStartTime;
    }

    if (!timeRange.value.endTime) {
      const defaultEndTime = new Date(dateRange.value.startDate);
      defaultEndTime.setHours(10);
      defaultEndTime.setMinutes(0);
      timeRange.value.endTime = defaultEndTime;
    }
  }
});
</script>

<style scoped>
/* Add any custom styles here if needed */
.date-picker-container,
.time-picker-container {
  z-index: 50;
}
</style>
