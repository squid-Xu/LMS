<template>
  <el-drawer
    v-model="drawer"
    size="600"
    @closed="resetForm"
    :title="isDetail ? '查看会员信息' : formData.reader_id === undefined ? '新增会员' : '修改会员信息'"
  >
    <template #default>
      <el-form ref="formRef" :model="formData" :disabled="isDetail" :rules="formRules" label-width="120px">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="formData.name" maxlength="6" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.phone" maxlength="11" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="formData.sex">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="expire" label="会员到期时间">
          <el-date-picker
            style="width: 100%"
            v-model="formData.expire"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择"
          />
        </el-form-item>
        <!-- <el-form-item prop="birth" label="生日">
          <el-date-picker
            v-model="formData.birth"
            style="width: 100%"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择"
          />
        </el-form-item> -->
        <el-form-item prop="address" label="家庭住址">
          <el-input
            v-model="formData.address"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 6 }"
            maxlength="50"
            show-word-limit
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" :loading="loading" :disabled="isDetail" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { cloneDeep } from "lodash-es"
import { type CreateOrUpdateTableRequestData, type GetTableData } from "@/api/user_management/types/user_management"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { createUserManagementApi, updateUserManagementApi } from "@/api/user_management"

const drawer = ref(false)

const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  reader_id: undefined,
  name: "",
  phone: "",
  sex: 1,
  birth: "",
  address: "",
  expire: ""
}

const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))

const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  name: [{ required: true, trigger: "blur", message: "请输入姓名" }],
  phone: [
    { required: true, trigger: "blur", message: "请输入手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号格式",
      trigger: "blur"
    }
  ],
  sex: [{ required: true, trigger: "blur", message: "请选择性别" }],
  expire: [{ required: true, trigger: "blur", message: "请选择会员到期时间" }]
}

const formRef = ref<FormInstance | null>(null)

const loading = ref<boolean>(false)

const isDetail = ref<boolean>(false)

const open = (row: GetTableData) => {
  drawer.value = true
  if (row) {
    formData.value = cloneDeep(row)
  }
}
const cancelClick = () => {
  drawer.value = false
}
const confirmClick = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.log("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.reader_id === undefined ? createUserManagementApi : updateUserManagementApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        drawer.value = false
        emits("ok")
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}

const emits = defineEmits(["ok"])
defineExpose({
  open,
  isDetail
})
</script>
