<script setup lang="ts">
import { ref } from 'vue'
import type { Image } from '@/types/consult'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { uploadImage } from '@/services/consult'
import { Toast } from 'vant'

const { disabled = true } = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', img: Image): void
}>()

const text = ref('')

const sendText = () => {
  console.log('sendText', text.value)
  emit('send-text', text.value)
  text.value = ''
}

const sendImage: UploaderAfterRead = async (data) => {
  if (Array.isArray(data)) return
  if (!data.file) return
  const t = Toast.loading('正在上传')
  const res = await uploadImage(data.file)
  t.clear()
  emit('send-image', res.data)
}
</script>

<template>
  <div class="room-action">
    <van-field
      type="text"
      v-model="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      :disabled="disabled"
      @keyup.enter="sendText"
    ></van-field>
    <van-uploader
      :preview-image="false"
      :disabled="disabled"
      :after-read="sendImage"
    >
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
