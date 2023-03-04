<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <svg aria-hidden="true" class="cp-icon">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<style scoped lang="scss">
.cp-icon {
  width: 1em;
  height: 1em;
}
</style>
