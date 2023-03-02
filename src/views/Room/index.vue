<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import { io, Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
const userStore = useUserStore()
const route = useRoute()
let socket: Socket
onMounted(() => {
  socket = io(baseURL, {
    auth: {
      token: userStore.user?.token
    },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('connect')
  })
  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason)
  })
  socket.on('connect_error', (error) => {
    console.log('connect_error', error)
  })
})
onUnmounted(() => {
  socket.disconnect()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室"></cp-nav-bar>
    <room-status></room-status>
    <room-message></room-message>
    <room-action />
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
