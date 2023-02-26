<script setup lang="ts">
import {
  getPatientList,
  addPatient,
  editPatient,
  delPatient
} from '@/services/user'
import type { Patient, PatientList } from '@/types/user'
import { idCardRules, nameRules } from '@/utils/rules'
import { Dialog, Toast, type FormInstance } from 'vant'
import { computed, ref } from 'vue'

const initalPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
// 1. 页面初始化加载数据
const list = ref<PatientList>([])
const show = ref(false)
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
const showPopup = (item?: Patient) => {
  // console.log(item)
  if (item) {
    // 修改
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, idCard, defaultFlag, name }
  } else {
    patient.value = { ...initalPatient }
  }
  show.value = true
}
loadList()

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
const patient = ref<Patient>({ ...initalPatient })
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    // console.log(value)
    patient.value.defaultFlag = value ? 1 : 0
  }
})

const form = ref<FormInstance>()
const onSubmit = async () => {
  await form.value?.validate()
  // console.log('ok')
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await Dialog.confirm({
      title: '温馨提示',
      message: '你填写的性别和身份证不一致\n是否要提交？'
    })
  }
  console.log('校验通过')
  /**
   * 添加患者
   * 1. 调用请求
   * 2. 关闭弹层
   * 3. 成功提示
   * 4. 刷新列表
   */
  patient.value.id
    ? await editPatient(patient.value)
    : await addPatient(patient.value)
  show.value = false
  Toast.success('操作成功')
  loadList()
}
const showTitle = computed(() => (patient.value.id ? '编辑患者' : '添加患者'))

const remove = async () => {
  if (patient.value.id) {
    await Dialog.confirm({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ？`
    })
    await delPatient(patient.value.id)
    show.value = false
    loadList()
    Toast.success('删除成功')
  }
}
</script>

<template>
  <div class="patient-page">
    <!-- <van-popup v-model:show="show" position="right" /> -->
    <van-popup :show="show" @update:show="show = $event" position="right">
      <cp-nav-bar
        :back="() => (show = false)"
        :title="showTitle"
        right-text="保存"
        @click-right="onSubmit"
      ></cp-nav-bar>
      <van-form autocomplete="off" ref="form">
        <van-field
          label="真实姓名"
          placeholder="请输入真实姓名"
          v-model="patient.name"
          :rules="nameRules"
        />
        <van-field
          label="身份证号"
          placeholder="请输入身份证号"
          v-model="patient.idCard"
          :rules="idCardRules"
        />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              :options="options"
              v-model="patient.gender"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox :icon-size="18" round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showPopup(item)">
          <cp-icon name="user-edit" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
</style>
