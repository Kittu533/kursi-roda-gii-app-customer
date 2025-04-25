<template>
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="flex items-center px-4 py-3 border-b border-gray-100 mx-8">
        <button @click="navigateBack" class="mr-3 pulse-on-hover">
          <NuxtIcon name="mdi:chevron-left" class="w-6" />
        </button>
        <h1 class="text-lg font-medium">FAQ</h1>
      </div>
  
      <!-- FAQ Content -->
      <div class="px-4 py-5">
        <h2 class="text-center font-bold text-lg mb-6">SEPUTAR WHEEL CARE</h2>
  
        <!-- FAQ Accordion with Skeleton Loading -->
        <div class="space-y-3">
          <template v-if="!isLoading">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index" 
              class="border rounded-[10px] border-gray-100 shadow-sm"
            >
              <button 
                @click="toggleFaq(index)"
                class="flex justify-between items-center w-full px-4 py-3.5 text-left pulse-on-hover"
              >
                <span class="text-[14px] font-medium pr-2">{{ faq.question }}</span>
                <NuxtIcon
                  name="mdi:chevron-down"
                  class="w-6 h-6 flex-shrink-0 transition-transform duration-200"
                  :class="{ 'transform rotate-180': faq.isOpen }"
                />
              </button>
              <div 
                v-if="faq.isOpen" 
                class="px-4 pb-4 pt-1 text-gray-600 text-[12px] leading-relaxed overflow-hidden transition-all duration-300"
                :style="{ maxHeight: faq.isOpen ? '500px' : '0px' }"
              >
                {{ faq.answer }}
              </div>
            </div>
          </template>
          <template v-else>
            <div 
              v-for="i in 5" 
              :key="i" 
              class="border rounded-[10px] bg-white shadow-sm p-4"
            >
              <div class="flex justify-between items-center w-full">
                <Skeleton height="18px" width="80%" class="mb-1" />
                <Skeleton height="24px" width="24px" class="rounded" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Skeleton from "~/components/ui/skeleton.vue";
  
  interface FAQ {
    question: string;
    answer: string;
    isOpen: boolean;
  }
  
  const faqs = ref<FAQ[]>([
    {
      question: 'Bagaimana kerja aplikasi ini?',
      answer: 'Aplikasi Wheel Care memungkinkan Anda untuk menyewa kursi roda dengan mudah melalui smartphone. Anda dapat memilih jenis kursi roda, durasi penyewaan, dan lokasi pengantaran sesuai kebutuhan Anda.',
      isOpen: false
    },
    {
      question: 'Apakah saya perlu membuat akun untuk menyewa kursi roda',
      answer: 'Ya, Anda perlu membuat akun untuk menyewa kursi roda. Hal ini untuk memastikan keamanan transaksi dan memudahkan proses penyewaan berikutnya.',
      isOpen: false
    },
    {
      question: 'Bagaimana cara menyewa kursi roda?',
      answer: 'Untuk menyewa kursi roda, pilih jenis kursi roda yang diinginkan, tentukan durasi penyewaan, masukkan alamat pengantaran, dan lakukan pembayaran. Kursi roda akan diantar ke lokasi Anda sesuai jadwal.',
      isOpen: false
    },
    {
      question: 'Apakah saya bisa memesan untuk orang lain?',
      answer: 'Ya, Anda bisa memesan kursi roda untuk orang lain. Pastikan untuk memasukkan informasi kontak dan alamat pengantaran yang benar untuk penerima.',
      isOpen: false
    },
    {
      question: 'Apakah saya bisa memperpanjang penyewaan?',
      answer: 'Ya, Anda dapat memperpanjang masa penyewaan melalui aplikasi. Pilih pesanan yang sedang aktif dan pilih opsi "Perpanjang Penyewaan". Biaya tambahan akan disesuaikan dengan durasi perpanjangan.',
      isOpen: false
    },
    {
      question: 'Apakah ada biaya tambahan?',
      answer: 'Biaya tambahan mungkin dikenakan untuk pengantaran ke lokasi tertentu, perpanjangan mendadak, atau kerusakan pada kursi roda. Semua biaya tambahan akan diinformasikan secara transparan sebelum konfirmasi.',
      isOpen: false
    },
    {
      question: 'Bagaimana jika saya mengalami kendala saat menggunakan aplikasi?',
      answer: 'Jika Anda mengalami kendala, silakan hubungi tim dukungan kami melalui fitur "Bantuan" di aplikasi. Tim kami siap membantu Anda 24/7 melalui chat atau telepon.',
      isOpen: false
    }
  ]);
  
  const isLoading = ref(true);
  const router = useRouter();
  
  const toggleFaq = (index: number) => {
    faqs.value[index].isOpen = !faqs.value[index].isOpen;
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