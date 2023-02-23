export const passwordRules = [
  { required: true, message: '请输入密码' },
  {
    pattern: /^\w{8,24}$/,
    message: '请输入8-24位密码'
  }
]
export const mobileRules = [
  { required: true, message: '请输入手机号' },
  {
    pattern: /^1[3-9]\d{9}$/,
    message: '请填写正确的手机号'
  }
]
