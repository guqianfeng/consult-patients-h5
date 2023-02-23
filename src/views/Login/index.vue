<script setup lang="ts">
const handleClickRight = () => {
  console.log('子传父 儿子通知父亲点击右侧')
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      title="帅峰标题"
      rightText="帅峰按钮"
      @click-right="handleClickRight"
    ></cp-nav-bar>
    <van-button type="primary"></van-button>
  </div>
</template>

<style scoped lang="scss"></style>
