
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
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