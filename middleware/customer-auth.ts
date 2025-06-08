export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const token = localStorage.getItem('customer_token')
    const key = localStorage.getItem('customer_key')

    if (!token || !key) {
      return navigateTo('/auth/login')
    }
  }
})
  