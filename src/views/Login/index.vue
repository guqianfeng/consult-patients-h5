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
    <p v-for="item in 100" :key="item">帅峰</p>
  </div>
</template>

<style scoped lang="scss"></style>
