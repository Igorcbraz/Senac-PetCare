import { defineBoot } from '#q-app/wrappers'
import { LocalStorage } from 'quasar'
import axios from 'axios'

const api = axios.create({ baseURL: process.env.API_URL })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  api.interceptors.request.use(config => {
    const token = LocalStorage.getItem('@petcare-token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
})

export { api }
