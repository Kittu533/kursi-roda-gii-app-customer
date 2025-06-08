import { defineStore } from 'pinia'
import { sendOtp } from '@/composables/consume-api/auth.api'

export const useLoginStore = defineStore('login', {
    state: () => ({
        phoneNumber: '',
        phoneError: '',
        agreeToTerms: false,
        isLoading: false,
        apiError: null as string | null
    }),
    getters: {
        isFormValid(state): boolean {
            return (
                (state.phoneNumber.includes('@') || /^[0-9]{10,14}$/.test(state.phoneNumber)) &&
                state.agreeToTerms
            )
        }
    },
    actions: {
        validatePhoneNumber(): boolean {
            const cleaned = this.phoneNumber.replace(/\D/g, '')
            return cleaned.length >= 10 && cleaned.length <= 14
        },
        validateForm(): boolean {
            this.phoneError = ''
            this.apiError = null

            const isEmail = this.phoneNumber.includes('@')
            const isValidPhone = this.validatePhoneNumber()

            if (!this.phoneNumber) {
                this.phoneError = 'Nomor WhatsApp atau email harus diisi'
                return false
            }
            if (!isEmail && !isValidPhone) {
                this.phoneError = 'Format nomor tidak valid'
                return false
            }
            if (!this.agreeToTerms) {
                this.apiError = 'Anda harus menyetujui syarat & ketentuan'
                return false
            }

            return true
        },
        async sendOtpAndNavigate(redirectPath: string) {
            if (!this.validateForm()) return
            this.isLoading = true
            this.apiError = null

            try {
                const cleaned = this.phoneNumber.trim()
                const isEmail = cleaned.includes('@')

                const payload = isEmail
                    ? { email: cleaned }
                    : {
                        phone: cleaned.replace(/\D/g, '').replace(/^0+/, ''),
                        phone_code: '+62'
                    }

                const res = await sendOtp(payload)
                const msg = res?.response?.message?.toLowerCase() || ''

                if (msg.includes('otp sent') || msg.includes('kode otp')) {
                    localStorage.setItem('login_identity', JSON.stringify(payload))
                    navigateTo(redirectPath)
                } else {
                    this.apiError = 'Gagal mengirim kode OTP'
                }
            } catch (err: any) {
                this.apiError = err?.data?.message || err.message || 'Terjadi kesalahan saat mengirim OTP'
            } finally {
                this.isLoading = false
            }
        }
    }
})
