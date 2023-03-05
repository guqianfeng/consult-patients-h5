import { OrderType } from '@/enums'
import {
  cancelOrder,
  deleteOrder,
  followOrUnfollow,
  getPrescriptionPic
} from '@/services/consult'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import { ImagePreview, Toast } from 'vant'
import { ref } from 'vue'

export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followOrUnfollow(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

export function useShowPrescription() {
  const showPrescription = async (id?: string) => {
    if (id) {
      const { data } = await getPrescriptionPic(id)
      ImagePreview([data.url])
    }
  }
  return { showPrescription }
}

export function useCancelOrder() {
  const loading = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    loading.value = true
    try {
      await cancelOrder(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      Toast.success('取消成功')
    } catch (e) {
      Toast.fail('取消失败')
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    cancelConsultOrder
  }
}

export function useDeleteOrder(cb: () => void) {
  const deleteLoading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    deleteLoading.value = true
    try {
      await deleteOrder(item.id)
      cb && cb()
      Toast.success('删除成功')
    } catch (e) {
      Toast.fail('删除失败')
    } finally {
      deleteLoading.value = false
    }
  }
  return {
    deleteLoading,
    deleteConsultOrder
  }
}
