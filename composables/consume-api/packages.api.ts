import { useApi } from '@/composables/use-fetch-api'
import type { PackageListResponse, PackageDetailResponse } from '~/types/packages'

// List packages
export const fetchPackages = async (params: Record<string, any> = {}) => {
  return await useApi<PackageListResponse>('/customer/packages', {
    method: 'GET',
    service: 'core',
    query: params,
  })
}

// Get package detail by ID
export const getPackageById = async (id: string) => {
  return await useApi<PackageDetailResponse>(`/customer/packages/${id}`, {
    method: 'GET',
    service: 'core',
  })
}
