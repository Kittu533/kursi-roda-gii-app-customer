<template>
    <div class="flex flex-col min-h-screen bg-white">
      <PaymentHeader title="Metode Pembayaran" />
      
      <div class="flex-1 p-4">
        <p class="text-sm font-medium mb-4">Pilihan Pembayaran</p>
        
        <div class="space-y-4">
          <!-- QRIS Option -->
          <PaymentOption 
            icon="mdi:qrcode" 
            title="QRIS" 
            subtitle="QR Code Standar Pembayaran Nasional"
            :chevron="true"
          />
          
          <!-- Transfer Bank Option -->
          <PaymentOption 
            icon="mdi:bank" 
            title="Transfer Bank" 
            :is-expanded="false"
          />
          
          <!-- Credit/Debit Card Option -->
          <PaymentOption 
            icon="mdi:credit-card" 
            title="Kartu Kredit/Debit" 
            :is-expanded="true"
          >
            <div class="mt-2">
              <div 
                class="flex items-center justify-between p-3 border-b"
                v-for="card in savedCards"
                :key="card.id"
                @click="selectCard(card.id)"
                :class="{ 'bg-gray-100': selectedCardId === card.id }"
              >
                <div class="flex items-center">
                  <img :src="card.logo" :alt="card.type" class="w-8 h-5 mr-2" />
                  <span class="text-sm">{{ card.name }}</span>
                </div>
                <div v-if="selectedCardId === card.id">
                  <NuxtIcon name="mdi:check" class="w-5 h-5 text-orange-500" />
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 border-b cursor-pointer" @click="navigateTo('/payment/add-credit-card')">
                <div class="flex items-center">
                  <img src="/assets/images/cards/mastercard.png" alt="Add Card" class="w-8 h-5 mr-2" />
                  <span class="text-sm">Tambahkan Kartu Kredit/Debit Baru</span>
                </div>
                <NuxtIcon name="mdi:plus" class="text-gray-500" />
              </div>
            </div>
          </PaymentOption>
        </div>
      </div>
      
      <div class="p-4">
        <ConfirmButton @click="confirmPayment" :disabled="!selectedCardId">
          Konfirmasi
        </ConfirmButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  const selectedCardId = ref<number | null>(null);
  
  const savedCards = ref([
    { 
      id: 1, 
      type: 'mastercard', 
      name: 'CIMB', 
      logo: '/assets/images/cards/mastercard.png',
      last4: '4321'
    },
    { 
      id: 2, 
      type: 'visa', 
      name: 'Mandiri', 
      logo: '/assets/images/cards/visa.png',
      last4: '1234'
    }
  ]);
  
  const confirmPayment = () => {
    if (selectedCardId.value) {
      navigateTo('/payment/confirmation');
    }
  };
  
  const selectCard = (cardId: number) => {
    selectedCardId.value = cardId;
  };
  
  onMounted(() => {
    if (savedCards.value.length > 0) {
      selectedCardId.value = savedCards.value[0].id;
    }
  });
  </script>