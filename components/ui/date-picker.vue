<template>
    <div class="relative">
      <button 
        type="button"
        @click="toggleDatePicker" 
        class="flex items-center justify-between px-3 py-2 border rounded-md w-[180px] text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <span class="text-sm">
          {{ modelValue ? formatDate(modelValue) : placeholder }}
        </span>
        <NuxtIcon name="mdi:calendar" class="w-5 h-5 text-gray-400 ml-2" />
      </button>
      
      <!-- Date Picker Dropdown -->
      <div 
        v-if="showDatePicker" 
        class="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-10 p-2 border date-picker-container"
        style="width: 300px;"
      >
        <div class="flex justify-between items-center mb-4">
          <button 
            type="button"
            @click.stop="prevMonth" 
            class="p-1 hover:bg-gray-100 rounded-full"
          >
            <NuxtIcon name="mdi:chevron-left" class="w-5 h-5" />
          </button>
          <h3 class="text-md font-medium">{{ currentMonthName }} {{ currentYear }}</h3>
          <button 
            type="button"
            @click.stop="nextMonth" 
            class="p-1 hover:bg-gray-100 rounded-full"
          >
            <NuxtIcon name="mdi:chevron-right" class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Days of Week -->
        <div class="grid grid-cols-7 gap-1 text-center mb-2">
          <div v-for="day in daysOfWeek" :key="day" class="text-xs text-gray-500 font-medium">
            {{ day }}
          </div>
        </div>
        
        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Empty cells for days before the first day of the month -->
          <div 
            v-for="_ in firstDayOfMonth" 
            :key="'empty-' + _" 
            class="h-8 rounded-md"
          ></div>
          
          <!-- Days of the month -->
          <div 
            v-for="day in daysInMonth" 
            :key="day" 
            @click.stop="selectDate(day)"
            class="h-8 flex items-center justify-center rounded-md cursor-pointer text-sm"
            :class="getDayClass(day)"
          >
            {{ day }}
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            type="button"
            @click.stop="confirmDateSelection" 
            class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Pilih
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  
  interface Props {
    modelValue: Date | null;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    disabledDates?: (date: Date) => boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    minDate: undefined,
    maxDate: undefined,
    placeholder: 'Pilih tanggal',
    disabledDates: undefined
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Date picker state
  const showDatePicker = ref(false);
  const currentDate = ref(new Date());
  const selectedDay = ref<number | null>(null);
  const daysOfWeek = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
  
  // Initialize with current selection if available
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      const selectedDate = new Date(newValue);
      currentDate.value = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      selectedDay.value = selectedDate.getDate();
    }
  }, { immediate: true });
  
  // Computed properties for calendar
  const currentYear = computed(() => currentDate.value.getFullYear());
  const currentMonth = computed(() => currentDate.value.getMonth());
  const currentMonthName = computed(() => {
    const options = { month: 'long' } as Intl.DateTimeFormatOptions;
    return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString('id-ID', options);
  });
  
  const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  });
  
  const firstDayOfMonth = computed(() => {
    // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
    const day = new Date(currentYear.value, currentMonth.value, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, and shift others by -1
  });
  
  // Calendar navigation
  const nextMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
  };
  
  const prevMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
  };
  
  // Toggle date picker
  const toggleDatePicker = () => {
    showDatePicker.value = !showDatePicker.value;
    
    if (showDatePicker.value) {
      // Initialize with current selection if available
      if (props.modelValue) {
        const selectedDate = new Date(props.modelValue);
        currentDate.value = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        selectedDay.value = selectedDate.getDate();
      } else {
        currentDate.value = new Date();
        selectedDay.value = null;
      }
    }
  };
  
  // Date selection logic
  const selectDate = (day: number) => {
    const selectedDate = new Date(currentYear.value, currentMonth.value, day);
    
    // Don't allow selecting dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check min date
    if (props.minDate && selectedDate < props.minDate) {
      return;
    }
    
    // Check max date
    if (props.maxDate && selectedDate > props.maxDate) {
      return;
    }
    
    // Check custom disabled dates
    if (props.disabledDates && props.disabledDates(selectedDate)) {
      return;
    }
    
    selectedDay.value = day;
    
    // Immediately emit the selected date (optional - can also wait for confirmation)
    // const newDate = new Date(currentYear.value, currentMonth.value, day);
    // emit('update:modelValue', newDate);
  };
  
  // Confirm selection
  const confirmDateSelection = () => {
    if (selectedDay.value) {
      const selectedDate = new Date(currentYear.value, currentMonth.value, selectedDay.value);
      emit('update:modelValue', selectedDate);
    }
    
    showDatePicker.value = false;
  };
  
  // Helper to determine the class for each day
  const getDayClass = (day: number) => {
    const date = new Date(currentYear.value, currentMonth.value, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if this date is today
    const isToday = date.getTime() === today.getTime();
    
    // Check if this date is the selected day in the picker
    const isSelected = selectedDay.value === day;
    
    // Check if this date is the currently selected date
    const isCurrentlySelected = props.modelValue && 
      date.getTime() === new Date(props.modelValue).setHours(0, 0, 0, 0);
    
    // Check if this date is in the past or disabled
    const isPast = date < today;
    const isDisabledByMin = props.minDate && date < props.minDate;
    const isDisabledByMax = props.maxDate && date > props.maxDate;
    const isDisabledByCustom = props.disabledDates && props.disabledDates(date);
    const isDisabled = isPast || isDisabledByMin || isDisabledByMax || isDisabledByCustom;
    
    return {
      'bg-orange-500 text-white': isSelected || isCurrentlySelected,
      'border border-orange-500': isToday && !isSelected && !isCurrentlySelected,
      'text-gray-300 cursor-not-allowed': isDisabled,
      'hover:bg-orange-100': !isDisabled && !isSelected && !isCurrentlySelected
    };
  };
  
  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  // Close picker when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (showDatePicker.value) {
      const target = event.target as HTMLElement;
      if (!target.closest('.date-picker-container') && !target.closest('button')) {
        showDatePicker.value = false;
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