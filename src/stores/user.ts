import type { User } from './../types/user.d'
import { ref } from 'vue'
import { defineStore } from 'pinia'
/**
 * defineStore(模块名, () => {
 *   ref reactive => state 推荐用ref
 *   computed => getters
 *   function => mutations actions
 * })
 */
export const useUserStore = defineStore('cp-user', () => {
  const user = ref<User>()
  const setUser = (value: User) => {
    user.value = value
  }
  const delUser = () => {
    user.value = undefined
  }
  return {
    user,
    setUser,
    delUser
  }
})
