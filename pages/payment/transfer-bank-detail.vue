<template>
    <div class="flex flex-col min-h-screen bg-white">
      <PaymentHeader title="Kode Pembayaran" />
      
      <div class="flex-1 p-4">
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm font-medium">Total Pembayaran</p>
          <p class="text-sm font-medium">Rp {{ formatPrice(totalAmount) }}</p>
        </div>
        
        <div class="flex justify-between items-center mb-4 border-b pb-4">
          <p class="text-sm">Bayar Dalam</p>
          <p class="text-sm">{{ countdown }}</p>
        </div>
        
        <div class="mb-6">
          <div class="flex items-center mb-4">
            <img :src="selectedBank.logo" :alt="selectedBank.name" class="w-12 h-8 mr-3" />
            <p class="text-sm font-medium">{{ selectedBank.name }}</p>
          </div>
          
          <div class="mb-4">
            <p class="text-xs text-gray-500 mb-1">No. Rekening</p>
            <div class="flex justify-between items-center">
              <p class="text-sm font-medium text-orange-500">{{ accountNumber }}</p>
              <button class="text-orange-500 text-xs font-medium" @click="copyAccountNumber">
                Salin
              </button>
            </div>
          </div>
          
          <p class="text-xs text-orange-500 mb-4">
            Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil
          </p>
          
          <p class="text-xs mb-4">
            Bayar pesanan ke Virtual Account di atas sebelum membuat pesanan serupa dengan Virtual Account agar nomor tetap sama.
          </p>
          
          <p class="text-xs mb-4">
            Hanya menerima dari Bank {{ selectedBank.name }}
          </p>
        </div>
        
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2" @click="toggleInstructions('mbanking')">
            <p class="text-sm font-medium">Petunjuk Transfer mBanking</p>
            <NuxtIcon 
              :name="expandedInstructions === 'mbanking' ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-gray-500" 
            />
          </div>
          
          <div v-if="expandedInstructions === 'mbanking'" class="mb-4">
            <ol class="list-decimal pl-6 text-xs space-y-2">
              <li>Masuk ke menu Mobile Banking BRI. Kemudian, pilih Pembayaran > BRIVA</li>
              <li>Masukkan Nomor Briva {{ accountNumber }}</li>
              <li>
                Masukkan PIN Anda kemudian pilih Send. Apabila pesan konfirmasi untuk transaksi menggunakan SMS muncul, pilih OK. Status transaksi akan dikirimkan melalui SMS dan dapat digunakan sebagai bukti pembayaran.
              </li>
            </ol>
          </div>
          
          <div class="flex justify-between items-center mb-2" @click="toggleInstructions('atm')">
            <p class="text-sm font-medium">Petunjuk Transfer Mini ATM/EDC</p>
            <NuxtIcon 
              :name="expandedInstructions === 'atm' ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-gray-500" 
            />
          </div>
          
          <div v-if="expandedInstructions === 'atm'" class="mb-4">
            Instruksi ATM
          </div>
          
          <div class="flex justify-between items-center mb-2" @click="toggleInstructions('tunai')">
            <p class="text-sm font-medium">Petunjuk Transfer Setor Tunai</p>
            <NuxtIcon 
              :name="expandedInstructions === 'tunai' ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-gray-500" 
            />
          </div>
  
          <div v-if="expandedInstructions === 'tunai'" class="mb-4">
            Instruksi Tunai
          </div>
        </div>
      </div>
      
      <div class="p-4">
        <ConfirmButton @click="confirmPayment">
          Oke
        </ConfirmButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const totalAmount = ref(352000);
  const timeLeft = ref(24 * 60 * 60); // 24 hours in seconds
  const countdown = ref('');
  const accountNumber = ref('123 0813 4501 2372');
  const expandedInstructions = ref<string | null>(null);
  
  const selectedBank = ref({
    id: 4,
    name: 'Bank BRI',
    logo: '/assets/images/banks/bri.png'
  });
  
  let timer: any = null;
  
  const updateCountdown = () => {
    if (timeLeft.value <= 0) {
      clearInterval(timer);
      countdown.value = 'Waktu habis';
      return;
    }
    
    const hours = Math.floor(timeLeft.value / 3600);
    const minutes = Math.floor((timeLeft.value % 3600) / 60);
    const seconds = timeLeft.value % 60;
    
    countdown.value = `${hours} jam ${minutes} menit ${seconds} detik`;
    timeLeft.value--;
  };
  
  onMounted(() => {
    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
  });
  
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });
  
  const toggleInstructions = (type: string) => {
    expandedInstructions.value = expandedInstructions.value === type ? null : type;
  };
  
  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber.value.replace(/\s/g, ''));
    alert('Nomor rekening disalin!');
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  const confirmPayment = () => {
    router.push('/payment/confirmation');
  };
  </script>