<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import { io, Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import { Toast } from 'vant'
import dayjs from 'dayjs'
const userStore = useUserStore()
const route = useRoute()
let socket: Socket
const list = ref<Message[]>([])
const consultOrderItem = ref<ConsultOrderItem>()
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const loadConsultOrderItem = async () => {
  const { data } = await getConsultOrderDetail(route.query.orderId as string)
  consultOrderItem.value = data
}
const initialMsg = ref(true)
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
    list.value = []
  })
  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason)
  })
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // console.log(data)
    const arr: Message[] = []

    data.forEach((item, i) => {
      if (i === 0) time.value = item.createTime
      arr.push({
        createTime: item.createTime,
        id: item.createTime,
        msgType: MsgType.Notify,
        msg: { content: item.createTime }
      })
      arr.push(...item.items)
    })
    list.value.unshift(...arr)
    loading.value = false
    // console.log(data)
    if (!data.length) {
      return Toast('没有历史消息了')
    }
    nextTick(() => {
      if (initialMsg.value) {
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
  })
  socket.on('statusChange', (data) => {
    console.log('statusChange', data)
    loadConsultOrderItem()
  })
  socket.on('receiveChatMsg', async (event) => {
    console.log(event)
    list.value.push(event)
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })
})
onUnmounted(() => {
  socket.disconnect()
})

const store = useUserStore()
const sendText = (text: string) => {
  console.log('儿子传给父亲的', text)
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consultOrderItem.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}

const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consultOrderItem.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

const loading = ref(false)
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室"></cp-nav-bar>
    <room-status
      :status="consultOrderItem?.status"
      :countdown="consultOrderItem?.countdown"
    ></room-status>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list"></room-message>
    </van-pull-refresh>

    <room-action
      @send-text="sendText"
      @send-image="sendImage"
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
