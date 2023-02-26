import type {
  CodeType,
  Patient,
  PatientList,
  User,
  UserInfo
} from './../types/user.d'
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

// 短信登录
export const loginByMobile = (mobile: string, code: string) =>
  request<User>('/login', 'POST', { mobile, code })

// 获取个人信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')

export const getPatientList = () => request<PatientList>('/patient/mylist')

// 添加患者信息
export const addPatient = (patient: Patient) =>
  request('/patient/add', 'POST', patient)

// 编辑患者信息
export const editPatient = (patient: Patient) =>
  request('/patient/update', 'PUT', patient)

// 删除患者信息
export const delPatient = (id: string) =>
  request(`/patient/del/${id}`, 'DELETE')
