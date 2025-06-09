import { useApi } from '@/composables/use-fetch-api'
import type { WheelchairListResponse, WheelchairDetailResponse } from '~/types/wheelchairs'

// GET /wheelchair/customer (list)
export const fetchWheelchairs = async (params: Record<string, any> = {}) => {
    return await useApi<WheelchairListResponse>('/wheelchair/customer', {
        method: 'GET',
        service: 'core',
        query: params,
    })
}

// GET /wheelchair/customer/:id (detail)
export const getWheelchairById = async (id: string) => {
    return await useApi<WheelchairDetailResponse>(`/wheelchair/customer/${id}`, {
        method: 'GET',
        service: 'core',
    })
}
