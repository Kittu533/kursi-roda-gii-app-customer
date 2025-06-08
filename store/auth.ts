import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        key: '',
        isAuthenticated: false
    }),
    actions: {
        setSession(token: string, key: string) {
            this.token = token
            this.key = key
            this.isAuthenticated = true

            useCookie('access_token').value = token
            localStorage.setItem('key', key)

            // ✅ Tambahkan ini
            localStorage.setItem('customer_token', token)
            localStorage.setItem('customer_key', key)
        },
        logout() {
            this.token = ''
            this.key = ''
            this.isAuthenticated = false

            useCookie('access_token').value = null
            localStorage.removeItem('key')

            // ✅ Tambahkan ini
            localStorage.removeItem('customer_token')
            localStorage.removeItem('customer_key')
        },
        // ✅ Tambahkan ini
        hydrateFromStorage() {
            const cookieToken = useCookie('access_token').value
            const key = localStorage.getItem('key')
            if (cookieToken && key) {
                this.token = cookieToken
                this.key = key
                this.isAuthenticated = true
            }
        }
    }
})
