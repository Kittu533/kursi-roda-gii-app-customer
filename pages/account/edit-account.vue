<template>
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <div class="flex items-center px-4 py-3 border-b">
        <button @click="navigateBack" class="mr-3 pulse-on-hover">
          <NuxtIcon name="mdi:chevron-left" class="w-6" />
        </button>
        <h1 class="text-lg font-medium">Edit Profil</h1>
      </div>
  
      <!-- Profile Content -->
      <div class="p-5">
        <!-- User Name Display -->
        <div class="text-center mb-8">
          <h2 class="text-xl font-bold uppercase">{{ form.fullName || 'CAHYA' }}</h2>
        </div>
  
        <!-- Form Fields -->
        <form @submit.prevent="saveProfile" class="space-y-5">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm mb-2">Nama Lengkap</label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              class="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Masukkan nama lengkap"
            />
          </div>
  
          <!-- Phone Number -->
          <div>
            <label for="phoneNumber" class="block text-sm mb-2">Nomor Hp</label>
            <input
              id="phoneNumber"
              v-model="form.phoneNumber"
              type="tel"
              class="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Masukkan nomor handphone"
            />
          </div>
  
          <!-- Email Address -->
          <div>
            <label for="email" class="block text-sm mb-2">Alamat Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Masukkan alamat email"
            />
          </div>
  
          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm mb-2">Jenis Kelamin</label>
            <div class="relative">
              <select
                id="gender"
                v-model="form.gender"
                class="w-full p-3 border rounded-[10px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="" disabled>Jenis Kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <NuxtIcon name="mdi:chevron-down" class="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
  
          <!-- Save Button -->
          <button
            type="submit"
            class="w-full bg-orange-500 text-white py-3.5 rounded-[10px] font-medium mt-8 hover:bg-orange-600 transition-colors duration-200"
            :class="{ 'opacity-70': isSaving }"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>
      </div>
  
      <!-- Loading Overlay -->
      <Transition name="fade">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  
  interface ProfileForm {
    fullName: string;
    phoneNumber: string;
    email: string;
    gender: string;
  }
  
  const router = useRouter();
  const isLoading = ref(true);
  const isSaving = ref(false);
  
  // Form data
  const form = reactive<ProfileForm>({
    fullName: 'Cahya',
    phoneNumber: '',
    email: 'cahya@gmail.com',
    gender: ''
  });
  
  // Navigate back to profile page
  const navigateBack = () => {
    router.push('/account');
  };
  
  // Save profile changes
  const saveProfile = async () => {
    isSaving.value = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (in a real app, you would use a toast notification)
      alert('Profil berhasil diperbarui');
      
      // Navigate back to profile
      router.push('/account');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      isSaving.value = false;
    }
  };
  
  // Simulate loading user data
  onMounted(() => {
    setTimeout(() => {
      // In a real app, you would fetch user data from an API
      isLoading.value = false;
    }, 800);
  });
  </script>
  
  <style scoped>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(249, 115, 22, 0.2);
    border-top-color: #f97316;
    animation: spin 1s infinite linear;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .pulse-on-hover:active {
    animation: pulse 0.3s;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.97); }
    100% { transform: scale(1); }
  }
  </style>