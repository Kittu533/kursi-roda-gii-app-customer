// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossorigin: ''
        },
      ],
      script: [
        {
          src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
          crossorigin: ''
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/image'
  ],
  icon: {
    componentName: 'NuxtIcon'
  },
  ssr: false, // Set to false for SPA mode
  typescript: {
    strict: true
  },
  experimental: {
    payloadExtraction: false
  },
  // Enable lazy loading of pages
  routeRules: {
    '/account/faq': { prerender: false },
    '/account/help': { prerender: false }
  }
})