// composables/use-fetch-api.ts

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  query?: Record<string, unknown>
  body?: unknown
  headers?: HeadersInit
  service?: 'core' | 'masterdata' | 'auth' | 'log'
}

export const useApi = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const config = useRuntimeConfig()

  // Mapping base URL dari runtimeConfig
  const baseUrls: Record<string, string> = {
    core: config.public.coreServiceBaseUrl as string,
    masterdata: config.public.masterdataServiceBaseUrl as string,
    auth: config.public.authenticationServiceBaseUrl as string,
    log: config.public.logServiceBaseUrl as string
  }

  // Default ke 'core' jika service tidak ditentukan
  const selectedBaseUrl = baseUrls[options.service ?? 'core']

  // Gunakan useCookie agar kompatibel SSR
  const accessToken = useCookie('access_token')
  const apiKey = process.client ? localStorage.getItem('key') : null

  let body = options.body ?? null
  let headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: accessToken.value ? `Bearer ${accessToken.value}` : '',
    'x-api-key': apiKey ?? ''
  }

  // Serialisasi body jika berupa object (bukan FormData/URLSearchParams)
  if (
    body &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams)
  ) {
    body = JSON.stringify(body)
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await $fetch<T>(`${selectedBaseUrl}${url}`, {
      method: options.method ?? 'GET',
      query: options.query,
      body,
      headers
    })

    return response
  } catch (error: any) {
    // Basic logging
    console.error(`[API Error] ${options.method ?? 'GET'} ${url}`, error)

    // Bisa dikembangkan: handle error spesifik (401, 403, timeout, dll)
    throw error
  }
}