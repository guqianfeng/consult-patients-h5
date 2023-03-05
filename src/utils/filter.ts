import type { IllnessTime } from '@/enums'
import { timeOptions, flagOptions } from '@/services/constants'

const getIllnessTimeText = (val: IllnessTime) => {
  return timeOptions.find((item) => item.value === val)?.label
}
const getConsultFlagText = (val: 0 | 1) => {
  return flagOptions.find((item) => item.value === val)?.label
}

export { getIllnessTimeText, getConsultFlagText }
