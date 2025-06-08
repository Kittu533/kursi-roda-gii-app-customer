import { defineStore } from 'pinia'
import { loginCustomerWithOtp, sendOtp } from '@/composables/consume-api/auth.api'
import { useAuthStore } from './auth'
import { useUserStore } from './user'

export const useOtpStore = defineStore('otp', {
    state: () => ({
        digits: ['', '', '', '', '', ''],
        error: '',
        loading: false,
        verified: false,
        timer: 180,
        intervalId: null as number | null
    }),
    actions: {
        clear() {
            this.digits = ['', '', '', '', '', '']
            this.error = ''
            this.verified = false
            this.timer = 180
            if (this.intervalId) clearInterval(this.intervalId)
        },
        startTimer() {
            this.timer = 180
            if (this.intervalId) clearInterval(this.intervalId)
            this.intervalId = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--
                } else {
                    this.error = 'Waktu OTP habis. Silakan kirim ulang.'
                    clearInterval(this.intervalId!)
                }
            }, 1000) as unknown as number
        },
        async resendOtp() {
            const raw = localStorage.getItem('login_identity')
            if (!raw) {
                this.error = 'Data tidak ditemukan. Silakan login ulang.'
                return
            }

            const identity = JSON.parse(raw)
            const payload = identity.phone
                ? { phone: identity.phone, phone_code: '+62' }
                : { email: identity.email }

            try {
                await sendOtp(payload)
                this.clear()
                this.startTimer()
            } catch {
                this.error = 'Gagal mengirim ulang OTP.'
            }
        },
        async verifyOtp() {
            if (this.timer <= 0) {
                this.error = 'Waktu habis. Silakan kirim ulang OTP.'
                return
            }

            if (this.digits.some(d => !d)) {
                this.error = 'Kode OTP tidak lengkap.'
                return
            }

            const raw = localStorage.getItem('login_identity')
            if (!raw) {
                this.error = 'Identitas login tidak ditemukan.'
                return
            }

            const identity = JSON.parse(raw)
            const code = this.digits.join('')
            this.loading = true

            try {
                const res = await loginCustomerWithOtp({ phone: identity.phone, code })
                const customer = res.response

                const auth = useAuthStore()
                auth.setSession(customer.token, customer.key)

                const user = useUserStore()
                user.setUser({
                    id: customer.id,
                    full_name: customer.full_name,
                    email: customer.email,
                    phone: customer.phone,
                    timezone: customer.timezone,
                    utcOffset: customer.utcOffset
                })

                this.verified = true
            } catch (err: any) {
                this.error = 'Kode OTP tidak valid atau server error.'
            } finally {
                this.loading = false
            }
        }
    }
})
