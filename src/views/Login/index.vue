<script setup lang="ts">
import { ref } from 'vue'
import { codeRules, mobileRules, passwordRules } from '@/utils/rules'
import { Toast } from 'vant'
import { loginByMobile, loginByPassword } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { useSendMobileCode } from '@/composable'

const isPass = ref(true)
const show = ref(false)
const password = ref('abc12345')
const mobile = ref('13211112222')
const code = ref('')
const agree = ref(true)

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const onSubmit = async () => {
  if (!agree.value) {
    return Toast('请先勾选已同意')
  }
  // console.log('submit', mobile.value, password.value)
  const { data } = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  userStore.setUser(data)
  const returnUrl = route.query.returnUrl
  router.replace((returnUrl as string) || '/user')
  Toast.success('登录成功')
}

const { time, form, send } = useSendMobileCode(mobile)
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ !isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="onSubmit" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon
            :name="`login-eye-${show ? 'on' : 'off'}`"
            @click="show = !show"
          ></cp-icon>
        </template>
      </van-field>
      <van-field
        v-else
        placeholder="短信验证码"
        v-model="code"
        :rules="codeRules"
      >
        <template #button>
          <span class="btn-send" @click="send">{{
            time > 0 ? `${time}s后再发送` : '请发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <a
          @click="
            userStore.setReturnUrl(
              ($route.query.returnUrl as string) || '/user'
            )
          "
          href="https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
        >
          <img src="@/assets/qq.svg" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
