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
            :is-expanded="true"
          >
            <div class="mt-2 space-y-0">
              <BankOption 
                v-for="bank in banks" 
                :key="bank.id" 
                :bank="{...bank, selected: selectedBankId === bank.id}"
                @click="selectBank(bank.id)"
              />
            </div>
          </PaymentOption>
          
          <!-- Credit/Debit Card Option -->
          <PaymentOption 
            icon="mdi:credit-card" 
            title="Kartu Kredit/Debit" 
            :is-expanded="false"
          />
        </div>
      </div>
      
      <div class="p-4">
        <ConfirmButton @click="confirmPayment" :disabled="!selectedBankId">
          Konfirmasi
        </ConfirmButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { navigateTo } from '#app';
  
  const selectedBankId = ref<number | null>(null);
  
  const banks = ref([
    { id: 1, name: 'Bank Mandiri', logo: 'public/kursi-roda.webp' },
    { id: 2, name: 'Bank Central Asia', logo: 'public/kursi-roda.webp' },
    { id: 3, name: 'Bank Negara Indonesia', logo: 'public/kursi-roda.webp' },
    { id: 4, name: 'Bank Rakyat Indonesia', logo: 'public/kursi-roda.webp', selected: true },
    { id: 5, name: 'Bank Lainnya', icon: 'mdi:bank' }
  ]);
  
  const selectBank = (bankId: number) => {
    selectedBankId.value = bankId;
  };
  
  const confirmPayment = () => {
    if (selectedBankId.value) {
      navigateTo(`/payment/transfer-bank-detail?bank=${selectedBankId.value}`);
    }
  };
  </script>