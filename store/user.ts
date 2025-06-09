// store/user.ts (sudah OK dari kamu, tambahkan field jika perlu)
import { defineStore } from 'pinia'

interface User {
  id: string
  full_name: string
  email: string
  phone: string
  timezone: string
  utcOffset: string
  // gender, dll jika ada
}

export const useUserStore = defineStore('user', {
  state: (): { user: User | null } => ({
    user: null
  }),
  actions: {
    setUser(payload: User) {
      this.user = payload
    }
  }
})
