<script setup lang="ts">
import { Button as VanButton } from 'vant'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const handleClick = () => {
  console.log('click', userStore.user)
  userStore.setUser({
    id: '1',
    refreshToken: '1',
    token: '1'
  })
}
</script>

<template>
  <div class="app-page">
    <h1>app</h1>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <!-- <van-button type="primary">click</van-button> -->
    <van-button @click="handleClick">login</van-button>
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
