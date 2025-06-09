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
      <div class="text-center mb-8">
        <h2 class="text-xl font-bold uppercase">{{ form.full_name || '-' }}</h2>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-5">
        <div>
          <label for="fullName" class="block text-sm mb-2">Nama Lengkap</label>
          <input id="fullName" v-model="form.full_name" type="text"
            class="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Masukkan nama lengkap" />
        </div>
        <div>
          <label for="phoneNumber" class="block text-sm mb-2">Nomor Hp</label>
          <input id="phoneNumber" v-model="form.phone" type="tel"
            class="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Masukkan nomor handphone" />
        </div>
        <div>
          <label for="email" class="block text-sm mb-2">Alamat Email</label>
          <input id="email" v-model="form.email" type="email"
            class="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Masukkan alamat email" />
        </div>
        <!-- Gender field jika ada, tambahkan sendiri -->

        <button type="submit"
          class="w-full bg-orange-500 text-white py-3.5 rounded-[10px] font-medium mt-8 hover:bg-orange-600 transition-colors duration-200"
          :class="{ 'opacity-70': isSaving }" :disabled="isSaving">
          {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </form>
    </div>

    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const isLoading = ref(true)
const isSaving = ref(false)

const form = reactive({
  full_name: '',
  phone: '',
  email: '',
  // gender: '',
})

onMounted(() => {
  if (userStore.user) {
    form.full_name = userStore.user.full_name
    form.phone = userStore.user.phone
    form.email = userStore.user.email
    // form.gender = userStore.user.gender || ''
  }
  isLoading.value = false
})

const navigateBack = () => router.push('/account')

const saveProfile = async () => {
  isSaving.value = true
  try {
    if (!userStore.user?.id) throw new Error('User tidak ditemukan.')
    const res = await fetch(`${import.meta.env.VITE_AUTH_LOCAL}/customers/${userStore.user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (!res.ok) throw new Error('Gagal menyimpan profil')
    const updated = await res.json()
    // Update Pinia user
    userStore.setUser(updated.response || updated)
    alert('Profil berhasil diperbarui!')
    router.push('/account')
  } catch (e: any) {
    alert(e?.message || 'Gagal menyimpan perubahan')
  } finally {
    isSaving.value = false
  }
}
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.97);
  }

  100% {
    transform: scale(1);
  }
}
</style>
