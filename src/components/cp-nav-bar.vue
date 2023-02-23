<script setup lang="ts">
const onClickLeft = () => {
  console.log('left')
}
const onClickRight = () => {
  console.log('right')
}
</script>

<template>
  <van-nav-bar
    title="标题"
    right-text="按钮"
    fixed
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
</template>

<style scoped lang="scss">
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
