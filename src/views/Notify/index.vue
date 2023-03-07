<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  fetch('/patient/message/list').then(async (response) => {
    console.log(await response.json())
  })
})
</script>

<template>
  <div class="notify-page">
    <h1>notify</h1>
  </div>
</template>

<style scoped lang="scss"></style>
