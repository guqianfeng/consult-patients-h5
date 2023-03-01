<script setup lang="ts">
import { IllnessTime } from '@/enums'
import { uploadImage } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { ConsultIllness, Image } from '@/types/consult'
import { Dialog, Toast } from 'vant'
import type {
  UploaderAfterRead,
  UploaderFileListItem
} from 'vant/lib/uploader/types'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const timeOptions = [
  {
    label: '一周内',
    value: IllnessTime.Week
  },
  {
    label: '一月内',
    value: IllnessTime.Month
  },
  {
    label: '半年内',
    value: IllnessTime.HalfYear
  },
  {
    label: '大于半年',
    value: IllnessTime.More
  }
]
const flagOptions = [
  {
    label: '就诊过',
    value: 1
  },
  {
    label: '没就诊过',
    value: 0
  }
]
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})
const fileList = ref<Image[]>([])
const afterRead: UploaderAfterRead = async (file) => {
  // 此时可以自行将文件上传至服务器
  if (Array.isArray(file)) return
  if (!file.file) return
  console.log(file.file)
  file.status = 'uploading'
  file.message = '上传中...'
  try {
    const { data } = await uploadImage(file.file)
    file.status = 'done'
    file.message = '上传成功'
    file.url = data.url
    form.value.pictures?.push(data)
  } catch (error) {
    file.status = 'failed'
    file.message = '上传失败'
  }
}
const onDelete = (file: UploaderFileListItem) => {
  // 此时可以自行将文件从服务器删除
  console.log(file)
  form.value.pictures = form.value.pictures?.filter(
    (item) => item.url !== file.url
  )
}

const disabled = computed(() => {
  return (
    !form.value.illnessDesc ||
    form.value.consultFlag === undefined ||
    form.value.illnessTime === undefined
  )
})

const consultStore = useConsultStore()
const router = useRouter()
const next = () => {
  // 校验提示
  if (!form.value.illnessDesc) return Toast.fail('病情描述不能为空')
  if (form.value.consultFlag === undefined)
    return Toast.fail('请选择是否就诊过')
  if (form.value.illnessTime === undefined) return Toast.fail('请选择患病时间')
  // 数据存入pinia
  consultStore.setIllness(form.value)
  // 跳转
  router.push('/user/patient?isChange=1')
}

onMounted(async () => {
  // 从pinia中获取数据
  const illnessDesc = consultStore.consult.illnessDesc
  if (illnessDesc) {
    await Dialog.confirm({
      title: '温馨提示',
      message: '是否恢复你之前填写的病情信息，是否继续？',
      closeOnPopstate: false
    })
    const { illnessDesc, illnessTime, consultFlag, pictures } =
      consultStore.consult
    form.value = { illnessDesc, illnessTime, consultFlag, pictures }
    fileList.value = pictures || []
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">
          请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助
        </p>
        <p class="safe">
          <cp-icon name="consult-safe" /><span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <!-- 收集信息 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn
          v-model="form.illnessTime"
          :options="timeOptions"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn
          v-model="form.consultFlag"
          :options="flagOptions"
        ></cp-radio-btn>
      </div>
      <div class="illness-img">
        <!-- 

         -->
        <van-uploader
          upload-text="上传图片"
          upload-icon="photo-o"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          :after-read="afterRead"
          v-model="fileList"
          @delete="onDelete"
        ></van-uploader>
        <p class="tip" v-if="fileList.length >= 9">
          上传内容仅医生可见,最多9张图,最大5MB
        </p>
      </div>
      <van-button :class="{ disabled }" @click="next" type="primary" block round
        >下一步</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}

.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
  .illness-img {
    padding-top: 16px;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    .tip {
      font-size: 12px;
      color: var(--cp-tip);
    }
    ::v-deep() {
      .van-uploader {
        &__preview {
          &-delete {
            left: -6px;
            top: -6px;
            border-radius: 50%;
            background-color: var(--cp-primary);
            width: 20px;
            height: 20px;
            &-icon {
              transform: scale(0.9) translate(-22%, 22%);
            }
          }
          &-image {
            border-radius: 8px;
            overflow: hidden;
          }
        }
        &__upload {
          border-radius: 8px;
        }
        &__upload-icon {
          color: var(--cp-text3);
        }
      }
    }
  }
}
</style>
