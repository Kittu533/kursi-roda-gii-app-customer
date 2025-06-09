<template>
  <NuxtLink :to="`/paket/${packageItem.id}`" class="block">
    <div class="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
      <div class="flex">
        <div class="w-24 h-24 flex-shrink-0">
          <img :src="packageItem.imageUrl" alt="Package" class="w-full h-full object-cover" />
        </div>
        <div class="p-3 flex-1">
          <h3 class="font-medium text-sm">{{ packageItem.name }}</h3>
          <p class="text-xs text-gray-500">{{ packageItem.timeRange }}</p>
          <div class="mt-1">
            <span
              v-if="packageItem.originalPrice && packageItem.discountedPrice && packageItem.originalPrice !== packageItem.discountedPrice"
              class="text-xs line-through text-gray-400">Rp.{{ formatPrice(packageItem.originalPrice) }}</span>
            <div class="font-bold text-sm text-orange-500">
              Rp.{{ formatPrice(packageItem.discountedPrice || packageItem.originalPrice) }}
            </div>
          </div>
        </div>
        <div class="p-3 flex items-end">
          <button class="px-4 py-1 bg-orange-500 text-white text-xs rounded-full"
            @click.stop="$emit('book', packageItem)">
            Pesan
          </button>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Package } from "~/types";

defineProps<{
  packageItem: Package;
}>();

defineEmits<{
  (e: "book", packageItem: Package): void;
}>();

const formatPrice = (price: string | number | undefined | null): string => {
  if (!price) return '-'
  const num = typeof price === 'string' ? Number(price) : price
  if (isNaN(num as number)) return '-'
  return (num as number).toLocaleString('id-ID', { minimumFractionDigits: 0 })
};
</script>
