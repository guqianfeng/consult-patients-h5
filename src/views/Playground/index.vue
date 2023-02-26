<script setup lang="ts">
import { ref } from 'vue'

const options = [
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 0
  }
]
const gender = ref(0)
</script>

<template>
  <div class="playground-page">
    <h1>playground</h1>
    <!-- <cp-radio-btn
      :modelValue="gender"
      @update:modelValue=";(gender as string | number) = $event"
      :options="options"
    ></cp-radio-btn> -->
    <cp-radio-btn v-model="gender" :options="options"></cp-radio-btn>
  </div>
</template>

<style scoped lang="scss"></style>
