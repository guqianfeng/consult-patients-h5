<script setup lang="ts">
import { Button as VanButton } from 'vant'
import { useUserStore } from '@/stores'
import { instance } from './utils/request'
const userStore = useUserStore()
const handleClick = async () => {
  // console.log('click', userStore.user)
  const { data } = await instance.post(`/login/password`, {
    password: 'abc12345',
    mobile: '13211112222'
  })
  userStore.setUser(data)
}
const handleGetUserInfo = async () => {
  const { data } = await instance.get('/patient/myUser')
  console.log(data)
}
</script>

<template>
  <div class="app-page">
    <h1>app</h1>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <van-button @click="handleClick">login</van-button>
    <van-button type="primary" @click="handleGetUserInfo"
      >获取个人信息</van-button
    >
  </div>
</template>

<style scoped lang="scss">
div.box {
  --box-size: 100px;
  height: 30px;
  background-color: pink;
  border: 1px solid #000;
}
div.box:nth-of-type(1) {
  width: var(--box-size);
}
div.box:nth-of-type(2) {
  width: calc(var(--box-size) * 2);
}
div.box:nth-of-type(3) {
  width: calc(var(--box-size) * 3);
}
</style>
