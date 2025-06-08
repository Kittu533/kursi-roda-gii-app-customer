import { defineStore } from 'pinia'

interface User {
  id: string
  full_name: string
  email: string
  phone: string
  timezone: string
  utcOffset: string
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
