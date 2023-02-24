import router from '@/router'
import { useUserStore } from '@/stores'
import axios, { AxiosError, type Method } from 'axios'
import { Toast } from 'vant'

const baseURL = 'https://consult-api.itheima.net/'
// 创建实例
const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const userStore = useUserStore()
    const token = userStore.user?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const data = response.data
    const { code, message } = data
    // console.log(code, message)
    if (code !== 10000) {
      Toast(message || '业务失败')
      return Promise.reject(data)
    }
    return data
  },
  function (error: AxiosError) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const status = error.response?.status
    if (status === 401) {
      const userStore = useUserStore()
      userStore.delUser()
      router.push({
        path: '/login',
        query: {
          returnUrl: router.currentRoute.value.fullPath
        }
      })
    }
    return Promise.reject(error)
  }
)

export type Data<T = any> = {
  /**
   * 正常返回10000，其他表示错误
   */
  code: number
  data: T
  /**
   * 接口信息
   */
  message: string
}

const request = <T>(
  url: string,
  method: Method = 'get',
  submitData?: object
) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
// async function fn() {
//   const res = await request<{ a: number }>('', 'GET', { a: 1, b: 2 })
//   res.data.a
// }

export { baseURL, instance, request }
