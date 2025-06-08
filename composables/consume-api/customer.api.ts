import { useApi } from '@/composables/use-fetch-api'

export const fetchCustomerByPhone = async (phone: string) => {
    return await useApi<any[]>('/customers', {
        method: 'GET',
        query: { phone },
        service: 'auth'
    })
}
