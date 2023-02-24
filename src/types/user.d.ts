export type User = {
  /**
   * 用户名
   */
  account?: string
  /**
   * 头像
   */
  avatar?: string
  /**
   * 用户id
   */
  id: string
  /**
   * 脱敏手机号，带星号的手机号
   */
  mobile?: string
  /**
   * refreshToken
   */
  refreshToken: string
  /**
   * token
   */
  token: string
}

// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

// 个人信息
type OmitUser = Omit<User, 'token'>

export type UserInfo = OmitUser & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}
