import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const server: AxiosInstance = axios.create({
  baseURL: 'https://www.bookbook.cc/api/data-view',
  timeout: 5000
})

server.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

server.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data
  },
  function (error) {
    return error.response
  }
)

export default server
