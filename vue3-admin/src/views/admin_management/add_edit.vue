<template>
  <el-dialog
    v-model="drawer"
    width="600"
    @closed="resetForm"
    :title="isDetail ? '查看管理员信息' : formData.admin_id === undefined ? '新增管理员' : '修改管理员信息'"
  >
    <template #default>
      <el-form ref="formRef" :model="formData" :disabled="isDetail" :rules="formRules" label-width="100px">
        <el-form-item prop="username" label="账号">
          <el-input v-model="formData.username" maxlength="10" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" maxlength="20" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="nickname" label="姓名">
          <el-input v-model="formData.nickname" maxlength="6" show-word-limit placeholder="请输入" />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" :loading="loading" :disabled="isDetail" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { cloneDeep } from "lodash-es"
import { type CreateOrUpdateTableRequestData, type GetTableData } from "@/api/admin_management/types/admin_management"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { createAdminManagementApi, updateAdminManagementApi } from "@/api/admin_management"

const drawer = ref(false)

const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  admin_id: undefined,
  username: "",
  password: "",
  nickname: "",
  status: 1
}

const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))

const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  username: [{ required: true, trigger: "blur", message: "请输入账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  nickname: [{ required: true, trigger: "blur", message: "请输入姓名" }]
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
    const api = formData.value.admin_id === undefined ? createAdminManagementApi : updateAdminManagementApi
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
