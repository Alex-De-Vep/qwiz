export default defineEventHandler(() => {
  return {
    status: 'ok',
    service: 'nuxt-backend',
    timestamp: new Date().toISOString()
  }
})
