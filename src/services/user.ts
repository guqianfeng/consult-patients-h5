import type { User } from './../types/user.d'
import { request } from '@/utils/request'

/**
 * 用户登录
 * @param mobile 手机号
 * @param password 密码
 */
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('/login/password', 'POST', {
    mobile,
    password
  })
