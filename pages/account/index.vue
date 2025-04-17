<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <h1 class="text-xl font-bold mb-4">Profil</h1>

    <!-- Profile Card with Skeleton Loading -->
    <div class="bg-orange-400 text-white rounded-xl p-4 mb-6" v-if="!isLoading">
      <h2 class="text-lg font-semibold">{{ user.name }}</h2>
      <p class="text-sm">{{ user.email }}</p>
    </div>
    <div class="bg-orange-400 rounded-xl p-4 mb-6" v-else>
      <Skeleton height="24px" width="120px" class="mb-2" />
      <Skeleton height="16px" width="180px" />
    </div>

    <!-- Menu Items with Skeleton Loading -->
    <div class="bg-white rounded-xl shadow-sm">
      <template v-if="!isLoading">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="flex items-center justify-between p-4 border-b last:border-b-0 pulse-on-hover"
          @click="navigateTo(item.route)"
        >
          <div class="flex items-center gap-3">
            <div class="w-[40px] h-[40px] flex items-center justify-center text-gray-500 bg-gray-200 rounded-full">
              <NuxtIcon :name="item.icon" class="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h3 class="font-medium">{{ item.title }}</h3>
              <p class="text-xs text-gray-500">{{ item.description }}</p>
            </div>
          </div>
          <NuxtIcon name="material-symbols-light:arrow-forward-ios-rounded" class="w-5 h-5 text-gray-400" />
        </div>
      </template>
      <template v-else>
        <div 
          v-for="i in 4" 
          :key="i" 
          class="flex items-center justify-between p-4 border-b last:border-b-0"
        >
          <div class="flex items-center gap-3">
            <Skeleton height="40px" width="40px" class="rounded-full" />
            <div>
              <Skeleton height="18px" width="100px" class="mb-1" />
              <Skeleton height="14px" width="150px" />
            </div>
          </div>
          <Skeleton height="20px" width="20px" />
        </div>
      </template>
    </div>
    
    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BottomNavigation from "~/components/user/bottom-navigation.vue";
import Skeleton from "~/components/ui/skeleton.vue";

interface MenuItem {
  title: string;
  description: string;
  icon: string;
  route: string;
}

const user = ref({
  name: "Cahya",
  email: "cahya@gmail.com",
});

const menuItems = ref<MenuItem[]>([
  {
    title: "Akun saya",
    description: "Kelola informasi akun Anda",
    icon: "material-symbols-light:person",
    route: "/account/edit-account",
  },
  {
    title: "FAQ",
    description: "Lihat pertanyaan umum",
    icon: "material-symbols-light:question-mark",
    route: "/account/faq",
  },
  {
    title: "Bantuan",
    description: "Dapatkan panduan penggunaan",
    icon: "material-symbols-light:help-center-outline-rounded",
    route: "/account/help",
  },
  {
    title: "Keluar",
    description: "Akhiri sesi dan keluar dari akun Anda",
    icon: "material-symbols-light:exit-to-app",
    route: "/account/logout",
  },
]);

const isLoading = ref(true);
const router = useRouter();

const navigateTo = async (route: string) => {
  if (route === router.currentRoute.value.path) return;
  
  try {
    await router.push(route);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

// Simulate data loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style scoped>
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>