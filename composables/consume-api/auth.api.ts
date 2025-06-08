import { useApi } from '@/composables/use-fetch-api'
import { z } from 'zod'

// --- Zod Schemas ---

const loginResponseSchema = z.object({
  response: z.object({
    full_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    key: z.string(),
    token: z.string(),
    timezone: z.string(),
    utcOffset: z.string()
  }),
  metaData: z.object({
    message: z.string(),
    code: z.number(),
    response_code: z.string()
  })
})

const otpSentSchema = z.object({
  response: z.object({
    message: z.string()
  }),
  metaData: z.object({
    message: z.string(),
    code: z.number(),
    response_code: z.string()
  })
})

const registerResponseSchema = z.object({
  response: z.object({
    message: z.string()
  }),
  metaData: z.object({
    message: z.string(),
    code: z.number(),
    response_code: z.string()
  })
})

// --- Service ID for dynamic base URL ---
const service = 'auth' as const

// --- API Functions ---

export const sendOtp = async (data: { phone_code: string; phone: string }) => {
  const raw = await useApi('/auth/send-otp', {
    method: 'POST',
    body: data,
    service
  })

  return otpSentSchema.parse(raw)
}

export const loginCustomerWithOtp = async (data: { phone: string; code: string }) => {
  const raw = await useApi('/auth/login/customer', {
    method: 'POST',
    body: data,
    service
  })

  return loginResponseSchema.parse(raw)
}

export const registerCustomer = async (data: {
  full_name: string
  email: string
  phone_code: string
  phone: string
  gender: 'male' | 'female'
}) => {
  const raw = await useApi('/auth/register/customer', {
    method: 'POST',
    body: data,
    service
  })

  return registerResponseSchema.parse(raw)
}
