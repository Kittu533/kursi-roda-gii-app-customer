import { defineStore } from 'pinia'
import { getCustomerLocations, createCustomerLocation, updateCustomerLocation, deleteCustomerLocation } from '@/composables/consume-api/location.api'

interface LocationData {
  id?: string
  full_name?: string
  latitude: number
  longitude: number
  address?: string
  phone?: string
  // Tambah field lain sesuai kebutuhan
}

export const useLocationStore = defineStore('location', {
  state: () => ({
    location: null as LocationData | null,       // Lokasi aktif user (current/selected)
    locations: [] as LocationData[],             // Daftar lokasi customer (dari API BE)
    loading: false,                              // Untuk indikator loading
    error: null as string | null                 // Untuk error message
  }),
  actions: {
    // Set lokasi aktif (misal dari peta/manual)
    setLocation(lat: number, lng: number, address?: string) {
      this.location = { latitude: lat, longitude: lng, address }
      localStorage.setItem('user_location', JSON.stringify(this.location))
    },

    // Load lokasi aktif dari localStorage (untuk default saat page reload)
    loadFromStorage() {
      const raw = localStorage.getItem('user_location')
      if (raw) {
        this.location = JSON.parse(raw)
      }
    },

    // Fetch daftar lokasi customer dari API BE
    async fetchLocations() {
      this.loading = true
      this.error = null
      try {
        const res = await getCustomerLocations()
        this.locations = (res.response.records || []).map(item => ({
          id: item.id,
          full_name: item.full_name,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          address: item.customer?.email || '', // Bisa ganti jadi address jika di response ada
          phone: item.phone
        }))
      } catch (err: any) {
        this.error = err?.message || 'Gagal mengambil data lokasi'
        this.locations = []
      } finally {
        this.loading = false
      }
    },

    // Tambah lokasi baru via API
    async addLocation(payload: { latitude: number, longitude: number, full_name?: string, phone?: string, address?: string }) {
      this.loading = true
      this.error = null
      try {
        await createCustomerLocation({
          latitude: String(payload.latitude),
          longitude: String(payload.longitude),
          full_name: payload.full_name,
          phone: payload.phone,
          address: payload.address
        })
        await this.fetchLocations() // Refresh data setelah tambah
      } catch (err: any) {
        this.error = err?.message || 'Gagal menambah lokasi'
      } finally {
        this.loading = false
      }
    },

    // Update lokasi
    async updateLocation(id: string, payload: Partial<LocationData>) {
      this.loading = true
      this.error = null
      try {
        await updateCustomerLocation(id, {
          latitude: payload.latitude ? String(payload.latitude) : undefined,
          longitude: payload.longitude ? String(payload.longitude) : undefined,
          full_name: payload.full_name,
          phone: payload.phone,
          address: payload.address
        })
        await this.fetchLocations() // Refresh
      } catch (err: any) {
        this.error = err?.message || 'Gagal update lokasi'
      } finally {
        this.loading = false
      }
    },

    // Hapus lokasi
    async removeLocation(id: string) {
      this.loading = true
      this.error = null
      try {
        await deleteCustomerLocation(id)
        await this.fetchLocations() // Refresh
      } catch (err: any) {
        this.error = err?.message || 'Gagal menghapus lokasi'
      } finally {
        this.loading = false
      }
    },

    // Set lokasi aktif dari salah satu lokasi tersimpan (misal user klik dari daftar)
    setActiveLocation(location: LocationData) {
      this.location = location
      localStorage.setItem('user_location', JSON.stringify(this.location))
    }
  }
})
