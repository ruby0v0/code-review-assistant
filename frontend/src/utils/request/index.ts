import type { AxiosResponse } from 'axios'
import type { ResponseData } from './types'
import axios from 'axios'

const API_PORT = import.meta.env.VITE_API_PORT ? `:${import.meta.env.VITE_API_PORT}` : ''

const BASE_URL = `${import.meta.env.VITE_API_URL}${API_PORT}${import.meta.env.VITE_API_PREFIX}`

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000,
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const res = response.data
    switch (res.code) {
      case 200:
        return res.data
      default:
        return Promise.reject(res.message)
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
