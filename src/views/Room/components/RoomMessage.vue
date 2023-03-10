<script setup lang="ts">
import { MsgType, PrescriptionStatus } from '@/enums'
import { useUserStore } from '@/stores'
import type { Image } from '@/types/consult'
import type { Message, Prescription } from '@/types/room'
import { ImagePreview, Toast } from 'vant'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import EvaluateCard from './EvaluateCard.vue'
import { useShowPrescription } from '@/composable'
import { getConsultFlagText, getIllnessTimeText } from '@/utils/filter'

defineProps<{
  list: Message[]
}>()

const previewImg = (pictures?: Image[]) => {
  if (pictures && pictures.length) {
    ImagePreview(pictures.map((item) => item.url))
  }
}

const formatTime = (time: string) => {
  return dayjs(time).format('HH:mm')
}

const userStore = useUserStore()

const { showPrescription } = useShowPrescription()

const router = useRouter()
const buy = (prescription?: Prescription) => {
  if (prescription) {
    if (prescription.status === PrescriptionStatus.Invalid)
      return Toast('处方失效')
    if (
      prescription.status === PrescriptionStatus.NotPayment &&
      !prescription.orderId
    ) {
      // 没有订单id 去预支付页面 （拼接处方id）
      return router.push('/order/pay?id=' + prescription.id)
    }
    // 有订单id，去订单详情页付款
    return router.push(`/order/${prescription.orderId}`)
  }
}
</script>

<template>
  <template
    v-for="{ msgType, msg, id, from, createTime, fromAvatar, toAvatar } in list"
    :key="id"
  >
    <!-- 患者卡片 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord?.illnessTime!) }} |
          {{ getConsultFlagText(msg.consultRecord?.consultFlag!) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)"
          >点击查看</van-col
        >
      </van-row>
    </div>
    <!-- 通知-通用 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通知-温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通知-结束 -->
    <div
      v-if="msgType === MsgType.NotifyCancel"
      class="msg msg-tip msg-tip-cancel"
    >
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 发送文字 -->
    <div
      class="msg msg-to"
      v-if="msgType === MsgType.MsgText && from === userStore.user?.id"
    >
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="toAvatar" />
    </div>
    <!-- 发送图片 -->
    <div
      class="msg msg-to"
      v-if="msgType === MsgType.MsgImage && from === userStore.user?.id"
    >
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="userStore.user?.avatar" />
    </div>
    <!-- 接收文字 -->
    <div
      class="msg msg-from"
      v-if="msgType === MsgType.MsgText && from !== userStore.user?.id"
    >
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 接收图片 -->
    <div
      class="msg msg-from"
      v-if="msgType === MsgType.MsgImage && from !== userStore.user?.id"
    >
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
    </div>
    <!-- 处方卡片 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="showPrescription(msg.prescription?.id)">
              原始处方 <van-icon name="arrow"></van-icon>
            </p>
          </div>
          <p>
            {{ msg.prescription?.name }} {{ msg.prescription?.genderValue }}
            {{ msg.prescription?.age }}岁 {{ msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div
            class="body-item"
            v-for="item in msg.prescription?.medicines"
            :key="item.id"
          >
            <div class="durg">
              <p>{{ item.name }} {{ item.specs }}</p>
              <p>{{ item.usageDosag }}</p>
            </div>
            <div class="num">x{{ item.quantity }}</div>
          </div>
        </div>
        <div class="foot">
          <span @click="buy(msg.prescription)">购买药品</span>
        </div>
      </div>
    </div>
    <!-- 评价卡片，后期实现 -->
    <div
      class="msg msg-comment"
      v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm"
    >
      <evaluate-card :evaluateDoc="msg.evaluateDoc" />
    </div>
  </template>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
