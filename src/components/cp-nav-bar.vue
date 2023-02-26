<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const router = useRouter()
const onClickLeft = () => {
  // console.log('left')
  if (props.back) {
    return props.back()
  }
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
  emit('click-right')
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
