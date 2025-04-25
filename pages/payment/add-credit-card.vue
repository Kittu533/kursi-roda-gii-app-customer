<template>
    <div class="flex flex-col min-h-screen bg-white">
      <PaymentHeader title="Tambah Kartu Kredit/Debit" />
      
      <div class="flex-1 p-4">
        <!-- Security Notice -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
          <div class="flex">
            <NuxtIcon name="mdi:shield-check" class="text-orange-500 w-5 h-5 mr-2 flex-shrink-0" />
            <p class="text-xs text-orange-800">
              Informasi kartu anda terlindungi!
              Kami hanya menyimpan PCI untuk verifikasi bahwa informasi kartu anda tetap terlindungi. Kami tidak akan mengakses infor kartu anda.
            </p>
          </div>
        </div>
        
        <!-- Card Information Form -->
        <div class="mb-6">
          <h2 class="text-base font-medium mb-4">Informasi Kartu Kredit/Debit</h2>
          
          <div class="mb-4">
            <label class="block text-sm mb-1">Rincian Kartu</label>
            <div class="flex items-center border rounded-md p-2">
              <input 
                type="text" 
                placeholder="Nomor Kartu" 
                class="flex-1 outline-none text-sm"
                v-model="cardNumber"
              />
              <div class="flex space-x-1">
                <img src="/assets/images/cards/visa.png" alt="Visa" class="h-5 w-8" />
                <img src="/assets/images/cards/mastercard.png" alt="Mastercard" class="h-5 w-8" />
                <img src="/assets/images/cards/amex.png" alt="Amex" class="h-5 w-8" />
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm mb-1">Tanggal Kedaluwarsa (BB/TT)</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                class="w-full border rounded-md p-2 text-sm outline-none"
                v-model="expiryDate"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">CVV</label>
              <input 
                type="password" 
                placeholder="***" 
                class="w-full border rounded-md p-2 text-sm outline-none"
                v-model="cvv"
                maxlength="4"
              />
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm mb-1">Nama di Kartu</label>
            <input 
              type="text" 
              placeholder="Nama sesuai kartu" 
              class="w-full border rounded-md p-2 text-sm outline-none"
              v-model="cardholderName"
            />
          </div>
        </div>
        
        <!-- Billing Address -->
        <div class="mb-6">
          <h2 class="text-base font-medium mb-4">Alamat Tagihan</h2>
          
          <div class="mb-4">
            <label class="block text-sm mb-1">Alamat</label>
            <input 
              type="text" 
              placeholder="Alamat lengkap" 
              class="w-full border rounded-md p-2 text-sm outline-none"
              v-model="address"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm mb-1">Kode Pos</label>
            <input 
              type="text" 
              placeholder="Kode pos" 
              class="w-full border rounded-md p-2 text-sm outline-none"
              v-model="postalCode"
            />
          </div>
        </div>
        
        <!-- Terms and Conditions -->
        <div class="mb-6">
          <div class="flex items-start">
            <input 
              type="checkbox" 
              id="terms" 
              class="mt-1 mr-2"
              v-model="acceptTerms"
            />
            <label for="terms" class="text-xs">
              Saya menyetujui syarat & ketentuan serta kebijakan yang berlaku
            </label>
          </div>
        </div>
      </div>
      
      <div class="p-4">
        <ConfirmButton 
          @click="saveCard" 
          :disabled="!isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
        >
          Kirim
        </ConfirmButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { navigateTo } from '#app'
  
  const cardNumber = ref('');
  const expiryDate = ref('');
  const cvv = ref('');
  const cardholderName = ref('');
  const address = ref('');
  const postalCode = ref('');
  const acceptTerms = ref(false);
  
  const isFormValid = computed(() => {
    return (
      cardNumber.value.length >= 15 &&
      expiryDate.value.length === 5 &&
      cvv.value.length >= 3 &&
      cardholderName.value.length > 0 &&
      address.value.length > 0 &&
      postalCode.value.length > 0 &&
      acceptTerms.value
    );
  });
  
  const saveCard = () => {
    if (!isFormValid.value) return;
    
    // Here you would typically send the card data to your payment processor
    // For this example, we'll just navigate back to the payment page
    navigateTo('/payment');
  };
  </script>