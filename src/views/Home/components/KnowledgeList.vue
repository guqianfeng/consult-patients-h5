<script setup lang="ts">
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/consult'
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgePage } from '@/services/consult'

const props = defineProps<{
  type: KnowledgeType
}>()

const list = ref<KnowledgeList>([])
const params = ref<KnowledgeParams>({
  current: 1,
  pageSize: 10,
  type: props.type
})
const loading = ref(false)
const finished = ref(false)

const onLoad = async () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  //   setTimeout(() => {
  //     for (let i = 0; i < 5; i++) {
  //       list.value.push(list.value.length + 1)
  //     }
  //     // 加载状态结束
  //     loading.value = false
  //     // 数据全部加载完成
  //     if (list.value.length >= 15) {
  //       finished.value = true
  //     }
  //   }, 1000)
  const { data } = await getKnowledgePage(params.value)
  list.value.push(...data.rows)
  loading.value = false
  if (params.value.current >= data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
