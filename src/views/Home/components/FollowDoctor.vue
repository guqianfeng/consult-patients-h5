<script setup lang="ts">
// import { onMounted, onUnmounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import DoctorCard from './DoctorCard.vue'
// 设备宽度
// const width = ref(0)
// const setWidth = () => (width.value = window.innerWidth)
// onMounted(() => {
//   window.addEventListener('resize', setWidth)
//   setWidth()
// })
// onUnmounted(() => {
//   window.removeEventListener('resize', setWidth)
// })
// setWidth()
const { width } = useWindowSize()
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe
        class="my-swipe"
        indicator-color="white"
        :loop="false"
        :showIndicators="false"
        :width="(150 / 375) * width"
      >
        <van-swipe-item v-for="item in 5" :key="item">
          <doctor-card :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
