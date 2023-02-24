import type { CodeType, User } from './../types/user.d'
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

/**
 *  发送短信验证码
 * @param mobile 手机号
 * @param type 验证码类型
 */
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request('/code', 'GET', {
    mobile,
    type
  })
