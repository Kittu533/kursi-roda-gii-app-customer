import { defineStore } from 'pinia'
import { registerCustomer } from '@/composables/consume-api/auth.api'

export const useRegisterStore = defineStore('register', {
    state: () => ({
        registerFullName: '',
        registerPhoneNumber: '',
        registerEmail: '',
        registerGender: '',
        registerLoading: false,
        registerError: null as string | null
    }),
    getters: {
        isRegisterFormValid(state): boolean {
            return !!state.registerFullName && !!state.registerPhoneNumber && !!state.registerEmail && !!state.registerGender
        }
    },
    actions: {
        async registerCustomerAndRedirect() {
            if (!this.isRegisterFormValid) {
                this.registerError = 'Harap lengkapi semua field.'
                return
            }

            this.registerLoading = true
            this.registerError = null

            try {
                const response = await registerCustomer({
                    full_name: this.registerFullName,
                    email: this.registerEmail,
                    phone_code: '+62',
                    phone: this.registerPhoneNumber.replace(/\D/g, '').replace(/^0+/, ''),
                    gender: this.registerGender as 'male' | 'female'
                })

                const msg = response?.response?.message?.toLowerCase() || ''
                if (msg.includes('pendaftaran berhasil')) {
                    localStorage.setItem('login_identity', JSON.stringify({
                        phone: this.registerPhoneNumber.replace(/\D/g, '').replace(/^0+/, '')
                    }))
                    navigateTo('/auth/verify-otp')
                } else {
                    this.registerError = response?.response?.message || 'Pendaftaran gagal. Coba lagi.'
                }
            } catch (err: any) {
                this.registerError = err?.data?.message || err.message || 'Terjadi kesalahan saat registrasi.'
            } finally {
                this.registerLoading = false
            }
        }
    }
})
