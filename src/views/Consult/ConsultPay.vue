<script setup lang="ts">
import router from '@/router'
import { getConsultOrderPre, createConsultOrder } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { Dialog, Toast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const consultStore = useConsultStore()

// 获取预订单信息
const payInfo = ref<ConsultOrderPreData>()
const loadPayInfo = async () => {
  const { data } = await getConsultOrderPre({
    illnessType: consultStore.consult.illnessType!,
    type: consultStore.consult.type!
  })
  payInfo.value = data
  consultStore.setCoupon(data.couponId)
}
// 获取患者信息
const patient = ref<Patient>()
const loadPatient = async () => {
  const { data } = await getPatientDetail(consultStore.consult.patientId!)
  patient.value = data
}
// mounted生命周期发送请求
onMounted(() => {
  type Key = keyof typeof consultStore.consult
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  const valid = validKeys.every(
    (key) => consultStore.consult[key] !== undefined
  )
  if (!valid) {
    return Dialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }

  loadPayInfo()
  loadPatient()
})

const agree = ref(false)
const show = ref(false)
const orderId = ref('')
const loading = ref(false)
const paymentMethod = ref<0 | 1>()
const onSubmit = async () => {
  if (!agree.value) return Toast.fail('请先同意支付协议')
  loading.value = true
  // 调用支付接口
  const { data } = await createConsultOrder(consultStore.consult)
  orderId.value = data.id
  loading.value = false
  // 清空store中的consult
  consultStore.clear()
  // 打开抽屉
  show.value = true
}

onBeforeRouteLeave(() => {
  // console.log(orderId.value)
  if (orderId.value) return false
})

const handleBeforeClose = () => {
  return Dialog.confirm({
    title: '提示',
    message: '您还未支付，是否确认离开？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付'
  })
    .then(() => {
      // 继续支付 - 不关闭
      return false
    })
    .catch(() => {
      // 关闭
      orderId.value = ''
      router.push('user/consult')
      return true
    })
}
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell
        title="病情描述"
        :label="consultStore.consult.illnessDesc"
      ></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="2900"
      button-text="立即支付"
      text-align="left"
      @submit="onSubmit"
      :loading="loading"
    />

    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      :before-close="handleBeforeClose"
    >
      <div class="pay-type">
        <p class="amount">￥20.00</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 0"
            /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 1"
            /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block>立即支付</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
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
