import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 问诊记录状态
    const consult = ref<PartialConsult>({})
    // 修改问诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 修改极速问诊类型
    const setIllnessType = (illnessType: 0 | 1) =>
      (consult.value.illnessType = illnessType)
    // 修改科室
    const setDeptId = (deptId: string) => (consult.value.depId = deptId)
    // 修改病情描述相关信息
    const setIllness = (
      illness: Pick<
        PartialConsult,
        'consultFlag' | 'illnessDesc' | 'illnessTime' | 'pictures'
      >
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 修改患者
    const setPatientId = (patientId: string) =>
      (consult.value.patientId = patientId)
    // 设置优惠券
    const setCoupon = (id?: string) => (consult.value.couponId = id)
    // 清空记录
    const remove = () => (consult.value = {})
    return {
      consult,
      setType,
      setIllnessType,
      setDeptId,
      setIllness,
      setPatientId,
      setCoupon,
      remove
    }
  },
  {
    persist: true
  }
)
