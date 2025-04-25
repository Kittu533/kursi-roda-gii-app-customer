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
          @click="navigateTo('/payment/qr-code')"
        />

        <!-- Transfer Bank Option -->
        <PaymentOption
          icon="mdi:bank"
          title="Transfer Bank"
          :is-expanded="expandedOption === 'bank'"
          @click="toggleOption('bank')"
        >
          <div v-if="expandedOption === 'bank'" class="mt-2 space-y-2">
            <BankOption
              v-for="bank in banks"
              :key="bank.id"
              :bank="bank"
              @click="selectBank(bank)"
            />
          </div>
        </PaymentOption>

        <!-- Credit/Debit Card Option -->
        <PaymentOption
          icon="mdi:credit-card"
          title="Kartu Kredit/Debit"
          :is-expanded="expandedOption === 'card'"
          @click="toggleOption('card')"
        >
          <div v-if="expandedOption === 'card'" class="mt-2">
            <div class="flex items-center justify-between p-2 border-b">
              <div class="flex items-center">
                <img
                  src="public/kursi-roda.webp"
                  alt="Mastercard"
                  class="w-8 h-5 mr-2"
                />
                <span class="text-sm">Tambahkan Kartu Kredit/Debit Baru</span>
              </div>
              <NuxtIcon name="mdi:plus" class="text-gray-500" />
            </div>
          </div>
        </PaymentOption>
      </div>
    </div>

    <div class="p-4">
      <ConfirmButton @click="confirmPayment"> Konfirmasi </ConfirmButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const expandedOption = ref<string | null>(null);

const banks = ref([
  { id: 1, name: "Bank Mandiri", logo: "public/kursi-roda.webp" },
  { id: 2, name: "Bank Central Asia", logo: "public/kursi-roda.webp" },
  {
    id: 3,
    name: "Bank Negara Indonesia",
    logo: "public/kursi-roda.webp",
  },
  {
    id: 4,
    name: "Bank Rakyat Indonesia",
    logo: "public/kursi-roda.webp",
  },
  { id: 5, name: "Bank Lainnya", icon: "mdi:bank" },
]);

const navigateTo = (path: string) => {
  router.push(path);
};

const toggleOption = (option: string) => {
  expandedOption.value = expandedOption.value === option ? null : option;
};

const selectBank = (bank: any) => {
  navigateTo("/payment/transfer-bank?bank=" + bank.id);
};

const confirmPayment = () => {
  if (expandedOption.value === "bank") {
    navigateTo("/payment/transfer-bank");
  } else if (expandedOption.value === "card") {
    navigateTo("/payment/add-credit-card");
  }
};
</script>
