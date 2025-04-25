<template>
    <div class="border rounded-lg overflow-hidden">
      <div 
        class="flex items-center justify-between p-4 cursor-pointer"
        @click="$emit('click')"
      >
        <div class="flex items-center">
          <div v-if="icon" class="mr-3">
            <NuxtIcon :name="icon" class="w-6 h-6 text-gray-700" />
          </div>
          <div v-else-if="logoSrc" class="mr-3">
            <img :src="logoSrc" :alt="title" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ title }}</p>
            <p v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</p>
          </div>
        </div>
        <div>
          <NuxtIcon 
            :name="isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
            v-if="!chevron"
            class="w-5 h-5 text-gray-500" 
          />
          <NuxtIcon 
            name="mdi:chevron-right" 
            v-else
            class="w-5 h-5 text-gray-500" 
          />
        </div>
      </div>
      <slot v-if="isExpanded"></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    icon: {
      type: String,
      default: null
    },
    logoSrc: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    chevron: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['click']);
  </script>