<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  title?: string
  rightText?: string
}>()
const router = useRouter()
const onClickLeft = () => {
  console.log('left')
  console.log(history.state)
  const back = history.state.back
  if (back) {
    router.back()
  } else {
    router.push('/')
  }
}
const onClickRight = () => {
  console.log('right')
}
</script>

<template>
  <van-nav-bar
    :title="title"
    :right-text="rightText"
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
