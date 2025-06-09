import { defineStore } from 'pinia'
import { fetchPackages, getPackageById } from '@/composables/consume-api/packages.api'
import type { PackageItem } from '~/types/packages'

interface PackageStoreState {
    packages: PackageItem[]
    selectedPackage: PackageItem | null
    isLoading: boolean
    error: string | null
}

export const usePackageStore = defineStore('package', {
    state: (): PackageStoreState => ({
        packages: [],
        selectedPackage: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async loadPackages(): Promise<void> {
            try {
                this.isLoading = true
                this.error = null
                const res = await fetchPackages()
                this.packages = res.response // langsung array
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to load packages'
                console.error('Error loading packages:', error)
            } finally {
                this.isLoading = false
            }
        },

        async getPackageDetail(id: string): Promise<PackageItem | null> {
            try {
                this.isLoading = true
                this.error = null
                const res = await getPackageById(id)
                this.selectedPackage = res.response
                return this.selectedPackage
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to load package detail'
                console.error('Error loading package detail:', error)
                return null
            } finally {
                this.isLoading = false
            }
        },

        clearSelectedPackage() {
            this.selectedPackage = null
        }
    }
})
