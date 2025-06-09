import { useApi } from '@/composables/use-fetch-api'

export const getProfile = async (customerId: string) => {
    return await useApi(`/customers/${customerId}`, {
        method: 'GET',
        service: 'auth', // pastikan sesuai alias kamu
    })
}

export const updateProfile = async (customerId: string, payload: Record<string, any>) => {
    return await useApi(`/customers/${customerId}`, {
        method: 'PATCH',
        service: 'auth',
        body: payload,
    })
}
