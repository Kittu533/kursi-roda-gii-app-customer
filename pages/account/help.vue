<template>
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="flex items-center px-4 py-3 border-b">
        <button @click="navigateBack" class="mr-3 pulse-on-hover">
          <NuxtIcon name="mdi:chevron-left" class="w-6" />
        </button>
        <h1 class="text-lg font-medium">Bantuan</h1>
      </div>
  
      <!-- Help Content -->
      <div class="p-5">
        <div class="bg-white rounded-xl border p-5 shadow-sm">
          <h2 class="text-center font-medium text-lg mb-6">Ada yang Bisa Kami Bantu?</h2>
          
          <!-- Contact Options with Skeleton Loading -->
          <div class="space-y-4">
            <template v-if="!isLoading">
              <button 
                @click="contactViaChat"
                class="flex items-center justify-between w-full py-3.5 border-b pulse-on-hover"
              >
                <span class="font-medium text-[14px]">Chat Agen</span>
                <div class="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <NuxtIcon name="mdi:whatsapp" class="w-4 h-4" />
                </div>
              </button>
              
              <button 
                @click="contactViaPhone"
                class="flex items-center justify-between w-full py-3.5 pulse-on-hover"
              >
                <span class="font-medium text-[14px]">Telepon Agen</span>
                <div class="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <NuxtIcon name="mdi:phone" class="w-4 h-4" />
                </div>
              </button>
            </template>
            <template v-else>
              <div class="flex items-center justify-between w-full py-3.5 border-b">
                <Skeleton height="18px" width="100px" />
                <Skeleton height="28px" width="28px" class="rounded-full" />
              </div>
              <div class="flex items-center justify-between w-full py-3.5">
                <Skeleton height="18px" width="120px" />
                <Skeleton height="28px" width="28px" class="rounded-full" />
              </div>
            </template>
          </div>
        </div>
  
        <!-- Additional Help Resources with Skeleton Loading -->
        <div class="mt-8 space-y-4">
          <h3 class="font-medium text-gray-700 px-1 mb-3">Panduan Penggunaan</h3>
          <div class="space-y-3">
            <template v-if="!isLoading">
              <button 
                v-for="(guide, index) in guides" 
                :key="guide.id"
                @click="openGuide(guide.id)"
                class="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl pulse-on-hover"
              >
                <div class="flex items-center">
                  <NuxtIcon name="mdi:file-document-outline" class="w-5 h-5 mr-3 text-gray-500" />
                  <span class="text-[14px]">{{ guide.title }}</span>
                </div>
                <NuxtIcon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
              </button>
            </template>
            <template v-else>
              <div 
                v-for="i in 3" 
                :key="i"
                class="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl"
              >
                <div class="flex items-center">
                  <Skeleton height="20px" width="20px" class="mr-3" />
                  <Skeleton height="16px" width="150px" />
                </div>
                <Skeleton height="20px" width="20px" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Skeleton from "~/components/ui/skeleton.vue";
  
  interface Guide {
    id: number;
    title: string;
  }
  
  const guides = ref<Guide[]>([
    { id: 1, title: 'Cara Menyewa Kursi Roda' },
    { id: 2, title: 'Cara Melakukan Pembayaran' },
    { id: 3, title: 'Cara Memperpanjang Penyewaan' }
  ]);
  
  const isLoading = ref(true);
  const router = useRouter();
  
  const contactViaChat = () => {
    console.log('Opening chat with agent');
    // In a real app, you would implement WhatsApp integration
    // window.open('https://wa.me/6281234567890', '_blank');
  };
  
  const contactViaPhone = () => {
    console.log('Calling agent');
    // In a real app, you would implement phone call functionality
    // window.location.href = 'tel:+6281234567890';
  };
  
  const openGuide = (guideId: number) => {
    console.log(`Opening guide with ID: ${guideId}`);
    // In a real app, you would navigate to the specific guide page
  };
  
  const navigateBack = () => {
    router.push('/account');
  };
  
  // Simulate data loading
  onMounted(() => {
    // Simulate network request
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  });
  </script>