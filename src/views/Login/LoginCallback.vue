<script setup lang="ts">
import { loginByQQ } from '@/services/user'
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
</script>

<template>
  <div class="login-page" v-if="!isBind">
    <cp-nav-bar placeholder title="绑定手机号"></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form">
      <van-field name="mobile" placeholder="请输入手机号"></van-field>
      <van-field name="code" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send">发送验证码</span>
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

<style scoped lang="scss"></style>
