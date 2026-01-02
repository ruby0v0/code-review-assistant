import type { AxiosResponse } from 'axios'
import axios from 'axios'

interface ResponseData<T = any> {
  /** 状态码 */
  code: number
  /** 消息 */
  message: string
  /** 数据 */
  data: T
}

const API_PORT = import.meta.env.VITE_API_PORT ? `:${import.meta.env.VITE_API_PORT}` : ''

const BASE_URL = `${import.meta.env.VITE_API_URL}${API_PORT}${import.meta.env.VITE_API_PREFIX}`

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
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
