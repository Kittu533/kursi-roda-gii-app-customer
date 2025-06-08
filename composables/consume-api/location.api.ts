import { useApi } from '@/composables/use-fetch-api'
import { z } from 'zod'

// --- Zod Schemas ---
const locationItemSchema = z.object({
    id: z.string(),
    customer_id: z.string(),
    full_name: z.string(),
    phone: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    customer: z.object({
        id: z.string(),
        full_name: z.string(),
        email: z.string().email(),
        phone: z.string()
    }).optional() // kadang bisa null/tidak ada
})

const getLocationsResponseSchema = z.object({
    response: z.object({
        page: z.object({
            total_record_count: z.number(),
            batch_number: z.number(),
            batch_size: z.number(),
            max_batch_size: z.number()
        }),
        records: z.array(locationItemSchema)
    }),
    metaData: z.object({
        message: z.string(),
        code: z.number(),
        response_code: z.string()
    })
})

const locationMessageSchema = z.object({
    response: z.object({
        message: z.string()
    }),
    metaData: z.object({
        message: z.string(),
        code: z.number(),
        response_code: z.string()
    })
})

// --- Service ID ---
const service = 'core' as const

// --- API Functions ---

/**
 * Ambil semua lokasi customer
 */
export const getCustomerLocations = async () => {
    const raw = await useApi('/location/customer', { service })
    return getLocationsResponseSchema.parse(raw)
}

/**
 * Ambil lokasi customer by id
 */
export const getCustomerLocationById = async (id: string) => {
    const raw = await useApi(`/location/customer/${id}`, { service })
    return locationItemSchema.parse(raw.response.records?.[0] || raw.response)
}

/**
 * Tambah lokasi customer baru
 */
export const createCustomerLocation = async (data: {
    latitude: string
    longitude: string
    full_name?: string
    phone?: string
    address?: string
}) => {
    const raw = await useApi('/location/customer', {
        method: 'POST',
        body: data,
        service
    })
    return locationMessageSchema.parse(raw)
}

/**
 * Update lokasi customer
 */
export const updateCustomerLocation = async (
    id: string,
    data: Partial<{
        latitude: string
        longitude: string
        full_name: string
        phone: string
        address: string
    }>
) => {
    const raw = await useApi(`/location/customer/${id}`, {
        method: 'PATCH',
        body: data,
        service
    })
    return locationMessageSchema.parse(raw)
}

/**
 * Hapus lokasi customer
 */
export const deleteCustomerLocation = async (id: string) => {
    const raw = await useApi(`/location/customer/${id}`, {
        method: 'DELETE',
        service
    })
    return locationMessageSchema.parse(raw)
}
