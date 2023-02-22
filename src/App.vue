<script setup lang="ts">
import { Button as VanButton } from 'vant'
</script>

<template>
  <div class="app-page">
    <h1>app</h1>
    <div class="box"></div>
    <van-button>click</van-button>
  </div>
</template>

<style scoped lang="scss">
div.box {
  width: 375px;
  height: 100px;
  background-color: pink;
  border: 1px solid #000;
}
</style>
