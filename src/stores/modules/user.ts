import type { User } from '../../types/user'
import { ref } from 'vue'
import { defineStore } from 'pinia'
/**
 * defineStore(模块名, () => {
 *   ref reactive => state 推荐用ref
 *   computed => getters
 *   function => mutations actions
 * })
 */
export const useUserStore = defineStore(
  'cp-user',
  () => {
    const user = ref<User>()
    const returnUrl = ref('')
    const setUser = (value: User) => {
      user.value = value
    }
    const delUser = () => {
      user.value = undefined
    }
    const setReturnUrl = (value: string) => {
      returnUrl.value = value
    }
    return {
      user,
      setUser,
      delUser,
      returnUrl,
      setReturnUrl
    }
  },
  {
    persist: true
  }
)
