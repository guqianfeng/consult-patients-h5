<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import { io, Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
const userStore = useUserStore()
const route = useRoute()
let socket: Socket
const list = ref<Message[]>([])
const consultOrderItem = ref<ConsultOrderItem>()
const loadConsultOrderItem = async () => {
  const { data } = await getConsultOrderDetail(route.query.orderId as string)
  consultOrderItem.value = data
}
onMounted(() => {
  loadConsultOrderItem()
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${userStore.user?.token}`
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
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // console.log(data)
    const arr: Message[] = []

    data.forEach((item) => {
      // console.log(tm.items)
      arr.push({
        createTime: item.createTime,
        id: item.createTime,
        msgType: MsgType.Notify,
        msg: { content: item.createTime }
      })
      arr.push(...item.items)
    })
    list.value.unshift(...arr)
  })
  socket.on('statusChange', (data) => {
    console.log('statusChange', data)
    loadConsultOrderItem()
  })
})
onUnmounted(() => {
  socket.disconnect()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室"></cp-nav-bar>
    <room-status
      :status="consultOrderItem?.status"
      :countdown="consultOrderItem?.countdown"
    ></room-status>
    <room-message :list="list"></room-message>
    <room-action
      :disabled="OrderType.ConsultChat !== consultOrderItem?.status"
    />
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
