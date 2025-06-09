import { defineStore } from 'pinia'
import { fetchWheelchairs, getWheelchairById } from '@/composables/consume-api/wheelchairs.api'
import type { WheelchairItem, WheelchairListResponse } from '~/types/wheelchairs'

interface WheelchairStoreState {
    wheelchairs: WheelchairItem[]
    selectedWheelchair: WheelchairItem | null
    isLoading: boolean
    error: string | null
}

export const useWheelchairStore = defineStore('wheelchair', {
    state: (): WheelchairStoreState => ({
        wheelchairs: [] as WheelchairItem[],
        selectedWheelchair: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async loadWheelchairs(params = {}) {
            this.isLoading = true
            this.error = null
            try {
                const res = await fetchWheelchairs(params)
                this.wheelchairs = Array.isArray(res.response.records) ? res.response.records : []
            } catch (error: any) {
                this.error = error?.message || 'Gagal memuat data'
                this.wheelchairs = []
            } finally {
                this.isLoading = false
            }
        },
        async loadAvailableWheelchairs() {
            this.isLoading = true
            this.error = null
            try {
                // GANTI id di bawah dengan status_id 'available'
                const statusId = 'b4f8c958-1f80-11f0-beb4-bceca0027c54'
                const res = await fetchWheelchairs({ search: statusId })
                this.wheelchairs = Array.isArray(res.response.records) ? res.response.records : []
            } catch (e: any) {
                this.error = e?.message || 'Failed to fetch wheelchairs'
                this.wheelchairs = []
            } finally {
                this.isLoading = false
            }
        },

        async getWheelchairDetail(id: string): Promise<WheelchairItem | null> {
            try {
                this.isLoading = true
                this.error = null
                const res = await getWheelchairById(id)
                this.selectedWheelchair = res.response
                return this.selectedWheelchair
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to load wheelchair detail'
                console.error('Error loading wheelchair detail:', error)
                return null
            } finally {
                this.isLoading = false
            }
        },

        clearSelectedWheelchair() {
            this.selectedWheelchair = null
        }
    }
})
