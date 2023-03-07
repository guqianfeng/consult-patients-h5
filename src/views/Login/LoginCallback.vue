<script setup lang="ts">
import { useSendMobileCode } from '@/composable'
import { loginByQQ } from '@/services/user'
import { codeRules, mobileRules } from '@/utils/rules'
import { onMounted, ref } from 'vue'

const openIdRef = ref('')
/**
 * 假设是绑定手机的，扫码后直接登录成功
 *  - 调用登录请求 - 需要openId
 *  - 查看qq互联文档，获取openId
 * 如果没有绑定则填写表单绑定
 */
// 是否绑定手机
const isBind = ref(true)
onMounted(() => {
  const flag = window.QC.Login.check()
  console.log(flag)
  if (flag) {
    // 登录成功
    window.QC.Login.getMe((openId, accessToken) => {
      console.log({ openId, accessToken })
      openIdRef.value = openId
      // 调用请求
      loginByQQ(openId)
        .then((res) => {
          // 登录成功
          console.log(res)
        })
        .catch((err) => {
          // 登录失败
          console.log(err)
          isBind.value = false
        })
    })
  }
})
const mobile = ref('')
const code = ref('')
const bind = () => {}
const { form, send, time } = useSendMobileCode(mobile, 'bindMobile')
</script>

<template>
  <div class="login-page" v-if="!isBind">
    <cp-nav-bar title="绑定手机号"></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="mobile"
        :rules="mobileRules"
      ></van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="code"
        :rules="codeRules"
      >
        <template #button>
          <span class="btn-send" @click="send">{{
            time <= 0 ? '发送验证码' : `${time}s后在发送`
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/login.scss';
</style>
