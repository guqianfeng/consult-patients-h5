<script setup lang="ts">
import { PaymentMethod } from '@/enums'
import { getConsultOrderPayUrl } from '@/services/consult'
import { Toast } from 'vant'
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
  onClose?: () => void
  orderId: string
  actualPayment: number
  payCallback: string
}>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()
const paymentMethod = ref<PaymentMethod>()
const pay = async () => {
  if (paymentMethod.value === undefined) return Toast.fail('请选择支付方式')
  Toast.loading({
    message: '跳转支付',
    duration: 0
  })
  // 调用支付接口
  const { data } = await getConsultOrderPayUrl({
    orderId: props.orderId,
    paymentMethod: paymentMethod.value,
    payCallback: import.meta.env.VITE_APP_CALLBACK + props.payCallback
  })
  window.location.href = data.payUrl
}
</script>

<template>
  <van-action-sheet
    :show="show"
    @update:show="emit('update:show', $event)"
    title="选择支付方式"
    :close-on-popstate="false"
    :closeable="false"
    :before-close="onClose"
  >
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment }}</p>
      <van-cell-group>
        <van-cell
          title="微信支付"
          @click="paymentMethod = PaymentMethod.WeChatPay"
        >
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra
            ><van-checkbox :checked="paymentMethod === PaymentMethod.WeChatPay"
          /></template>
        </van-cell>
        <van-cell
          title="支付宝支付"
          @click="paymentMethod = PaymentMethod.AliPay"
        >
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra
            ><van-checkbox :checked="paymentMethod === PaymentMethod.AliPay"
          /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button type="primary" round block @click="pay"
          >立即支付</van-button
        >
      </div>
    </div>
  </van-action-sheet>
</template>

<style scoped lang="scss">
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
