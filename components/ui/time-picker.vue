<template>
    <div class="relative">
      <button 
        type="button"
        @click="toggleTimePicker" 
        class="flex items-center justify-between px-3 py-2 border rounded-md w-[180px] text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <span class="text-sm">
          {{ modelValue ? formatTime(modelValue) : placeholder }}
        </span>
        <NuxtIcon name="mdi:clock-outline" class="w-5 h-5 text-gray-400 ml-2" />
      </button>
      
      <!-- Time Picker Dropdown -->
      <div 
        v-if="showTimePicker" 
        class="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-10 p-4 border time-picker-container"
        style="width: 300px;"
      >
        <div class="mb-4">
          <h3 class="text-md font-medium mb-1">{{ title }}</h3>
          <p class="text-sm text-gray-500">{{ description }}</p>
        </div>
        
        <div class="flex justify-center mb-4">
          <div class="flex items-center">
            <!-- Hours -->
            <div class="flex flex-col items-center mx-2">
              <button 
                type="button"
                @click.stop="incrementHour" 
                class="p-2 hover:bg-gray-100 rounded-full"
              >
                <NuxtIcon name="mdi:chevron-up" class="w-5 h-5" />
              </button>
              <div class="w-16 h-12 flex items-center justify-center text-xl font-bold border rounded-md">
                {{ selectedHour.toString().padStart(2, '0') }}
              </div>
              <button 
                type="button"
                @click.stop="decrementHour" 
                class="p-2 hover:bg-gray-100 rounded-full"
              >
                <NuxtIcon name="mdi:chevron-down" class="w-5 h-5" />
              </button>
            </div>
            
            <div class="text-xl font-bold mx-1">:</div>
            
            <!-- Minutes -->
            <div class="flex flex-col items-center mx-2">
              <button 
                type="button"
                @click.stop="incrementMinute" 
                class="p-2 hover:bg-gray-100 rounded-full"
              >
                <NuxtIcon name="mdi:chevron-up" class="w-5 h-5" />
              </button>
              <div class="w-16 h-12 flex items-center justify-center text-xl font-bold border rounded-md">
                {{ selectedMinute.toString().padStart(2, '0') }}
              </div>
              <button 
                type="button"
                @click.stop="decrementMinute" 
                class="p-2 hover:bg-gray-100 rounded-full"
              >
                <NuxtIcon name="mdi:chevron-down" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Quick Time Selection -->
        <div class="mb-4" v-if="quickTimeOptions.length > 0">
          <p class="text-sm font-medium mb-2">Waktu Cepat</p>
          <div class="grid grid-cols-4 gap-2">
            <button 
              type="button"
              v-for="time in quickTimeOptions" 
              :key="time.label"
              @click.stop="selectQuickTime(time.hour, time.minute)"
              class="py-2 px-3 text-sm border rounded-md hover:bg-orange-50 transition-colors"
              :class="{'bg-orange-100 text-orange-600 border-orange-300': 
                selectedHour === time.hour && selectedMinute === time.minute}"
            >
              {{ time.label }}
            </button>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="button"
            @click.stop="confirmTimeSelection" 
            class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Pilih
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  
  interface TimeOption {
    label: string;
    hour: number;
    minute: number;
  }
  
  interface Props {
    modelValue: Date | null;
    placeholder?: string;
    title?: string;
    description?: string;
    minuteStep?: number;
    quickTimeOptions?: TimeOption[];
    minTime?: Date;
    maxTime?: Date;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    placeholder: 'Pilih jam',
    title: 'Pilih Jam',
    description: 'Pilih jam yang diinginkan',
    minuteStep: 15,
    quickTimeOptions: () => [],
    minTime: undefined,
    maxTime: undefined
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Time picker state
  const showTimePicker = ref(false);
  const selectedHour = ref(8);
  const selectedMinute = ref(0);
  
  // Initialize with current selection if available
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      selectedHour.value = newValue.getHours();
      selectedMinute.value = newValue.getMinutes();
    }
  }, { immediate: true });
  
  // Toggle time picker
  const toggleTimePicker = () => {
    showTimePicker.value = !showTimePicker.value;
    
    if (showTimePicker.value) {
      // Initialize with current selection if available
      if (props.modelValue) {
        selectedHour.value = props.modelValue.getHours();
        selectedMinute.value = props.modelValue.getMinutes();
      } else {
        // Default to 8:00 AM
        selectedHour.value = 8;
        selectedMinute.value = 0;
      }
    }
  };
  
  // Time selection logic
  const incrementHour = () => {
    selectedHour.value = (selectedHour.value + 1) % 24;
    validateTimeSelection();
  };
  
  const decrementHour = () => {
    selectedHour.value = (selectedHour.value - 1 + 24) % 24;
    validateTimeSelection();
  };
  
  const incrementMinute = () => {
    selectedMinute.value = (selectedMinute.value + props.minuteStep) % 60;
    validateTimeSelection();
  };
  
  const decrementMinute = () => {
    selectedMinute.value = (selectedMinute.value - props.minuteStep + 60) % 60;
    validateTimeSelection();
  };
  
  const selectQuickTime = (hour: number, minute: number) => {
    selectedHour.value = hour;
    selectedMinute.value = minute;
    validateTimeSelection();
  };
  
  // Validate time selection against min/max times
  const validateTimeSelection = () => {
    if (!props.minTime && !props.maxTime) return;
    
    const currentDate = new Date();
    const selectedTime = new Date(currentDate);
    selectedTime.setHours(selectedHour.value, selectedMinute.value, 0, 0);
    
    if (props.minTime) {
      const minTime = new Date(currentDate);
      minTime.setHours(props.minTime.getHours(), props.minTime.getMinutes(), 0, 0);
      
      if (selectedTime < minTime) {
        selectedHour.value = props.minTime.getHours();
        selectedMinute.value = props.minTime.getMinutes();
      }
    }
    
    if (props.maxTime) {
      const maxTime = new Date(currentDate);
      maxTime.setHours(props.maxTime.getHours(), props.maxTime.getMinutes(), 0, 0);
      
      if (selectedTime > maxTime) {
        selectedHour.value = props.maxTime.getHours();
        selectedMinute.value = props.maxTime.getMinutes();
      }
    }
  };
  
  // Confirm time selection
  const confirmTimeSelection = () => {
    // Create a new date object with the selected time
    const date = props.modelValue ? new Date(props.modelValue) : new Date();
    date.setHours(selectedHour.value);
    date.setMinutes(selectedMinute.value);
    
    emit('update:modelValue', date);
    showTimePicker.value = false;
  };
  
  // Format time for display
  const formatTime = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };
  
  // Close picker when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (showTimePicker.value) {
      const target = event.target as HTMLElement;
      if (!target.closest('.time-picker-container') && !target.closest('button')) {
        showTimePicker.value = false;
      }
    }
  };
  
  // Add event listener for click outside
  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });
  </script>