<template>
  <el-dialog v-model="drawer" width="600" @closed="resetForm" title="修改密码">
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item prop="old_password" label="原密码">
          <el-input v-model="formData.old_password" maxlength="20" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="new_password" label="新密码">
          <el-input v-model="formData.new_password" maxlength="20" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="confin_password" label="确认密码">
          <el-input v-model="formData.confin_password" maxlength="20" show-word-limit placeholder="请输入" />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" :loading="loading" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { cloneDeep } from "lodash-es"
import { type UpdatePasswordTableRequestData } from "@/api/admin_management/types/admin_management"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { updatePasswordAdminManagementApi } from "@/api/admin_management"
import { encrypt } from "@/utils/rsa"

const drawer = ref(false)

const DEFAULT_FORM_DATA: UpdatePasswordTableRequestData = {
  old_password: "",
  new_password: "",
  confin_password: ""
}

const formData = ref<UpdatePasswordTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))

const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value !== formData.value.new_password) {
    callback(new Error("确认密码与新密码不一致"))
  } else {
    callback()
  }
}

const formRules: FormRules<UpdatePasswordTableRequestData> = {
  old_password: [{ required: true, trigger: "blur", message: "请输入原密码" }],
  new_password: [{ required: true, trigger: "blur", message: "请输入新密码" }],
  confin_password: [
    { required: true, trigger: "blur", message: "请输入确认密码" },
    { validator: validatePassword, trigger: "blur" }
  ]
}

const formRef = ref<FormInstance | null>(null)

const loading = ref<boolean>(false)

const open = () => {
  drawer.value = true
}
const cancelClick = () => {
  drawer.value = false
}
const confirmClick = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.log("表单校验不通过", fields)
    loading.value = true
    updatePasswordAdminManagementApi({
      old_password: encrypt(formData.value.old_password),
      new_password: encrypt(formData.value.new_password)
    })
      .then(() => {
        ElMessage.success("修改成功")
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
  open
})
</script>
