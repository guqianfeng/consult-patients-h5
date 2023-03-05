<script setup lang="ts">
import { ref } from 'vue'

const { disabled } = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'on-delete'): void
  (e: 'on-preview'): void
}>()

const showPopover = ref(false)

// 通过 actions 属性来定义菜单选项
const actions = [{ text: '查看处方', disabled }, { text: '删除订单' }]
const onSelect = (action: { text: string }, index: number) => {
  if (index === 0) {
    emit('on-preview')
  }
  // console.log(index)
  if (index === 1) {
    emit('on-delete')
  }
}
</script>

<template>
  <div class="cp-consult-more">
    <van-popover
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
      placement="top-start"
    >
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>

<style scoped lang="scss">
.cp-consult-more {
  flex: 1;
  color: var(--cp-tag);
}
</style>
