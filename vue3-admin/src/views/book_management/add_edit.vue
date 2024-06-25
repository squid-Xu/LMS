<template>
  <el-drawer
    v-model="drawer"
    size="600"
    @closed="resetForm"
    :title="isDetail ? '查看图书' : formData.book_id === undefined ? '新增图书' : '修改图书'"
  >
    <template #default>
      <el-form ref="formRef" :model="formData" :disabled="isDetail" :rules="formRules" label-width="100px">
        <el-form-item prop="ISBN" label="图书ISBN">
          <el-input v-model="formData.ISBN" maxlength="20" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="book_name" label="图书名称">
          <el-input
            v-model="formData.book_name"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 6 }"
            maxlength="100"
            show-word-limit
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item prop="author" label="图书作者">
          <el-input v-model="formData.author" maxlength="50" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="publish" label="图书出版社">
          <el-input v-model="formData.publish" maxlength="50" show-word-limit placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="class_id" label="图书分类">
          <el-select v-model="formData.class_id" placeholder="请选择">
            <el-option v-for="item in classDate" :key="item.class_id" :label="item.class_name" :value="item.class_id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="price" label="图书价格">
          <el-input-number v-model="formData.price" :precision="2" :min="0" :max="10000" />
        </el-form-item>
        <el-form-item prop="number" label="图书数量">
          <el-input-number v-model="formData.number" :min="0" :max="10000" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item prop="language" label="图书语言">
          <el-input v-model="formData.language" maxlength="10" show-word-limit placeholder="请输入" />
        </el-form-item> -->
        <!-- <el-form-item prop="pub_date" label="图书出版时间">
          <el-date-picker
            style="width: 100%"
            v-model="formData.pub_date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择"
          />
        </el-form-item> -->
        <el-form-item prop="introduction" label="图书介绍">
          <el-input
            type="textarea"
            resize="none"
            maxlength="500"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-model="formData.introduction"
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
import { type CreateOrUpdateTableRequestData, type GetTableData } from "@/api/book_management/types/book_management"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { createBookManagementApi, updateBookManagementApi } from "@/api/book_management"
import { getAllBookClassApi } from "@/api/book_class"
import { type GetTableData as GetClassTableData } from "@/api/book_class/types/book_class"

const classDate = ref<GetClassTableData[]>([])
const getAllClass = () => {
  getAllBookClassApi().then(({ data }) => {
    classDate.value = data
  })
}

const drawer = ref(false)

const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  book_id: undefined,
  book_name: "",
  author: "",
  publish: "",
  ISBN: "",
  introduction: "",
  language: "",
  price: 0,
  pub_date: "",
  class_id: 1,
  number: 0
}

const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))

const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  book_name: [{ required: true, trigger: "blur", message: "请输入图书名称" }],
  author: [{ required: true, trigger: "blur", message: "请输入图书作者" }],
  publish: [{ required: true, trigger: "blur", message: "请输入图书出版社" }],
  ISBN: [{ required: true, trigger: "blur", message: "请输入图书ISBN" }],
  price: [{ required: true, trigger: "blur", message: "请输入图书价格" }],
  class_id: [{ required: true, trigger: "blur", message: "请输入图书分类" }],
  language: [{ required: false, trigger: "blur", message: "请输入图书语言" }],
  pub_date: [{ required: false, trigger: "blur", message: "请输入图书出版时间" }],
  number: [{ required: true, trigger: "blur", message: "请输入图书数量" }]
}

const formRef = ref<FormInstance | null>(null)

const loading = ref<boolean>(false)

const isDetail = ref<boolean>(false)

const open = (row: GetTableData) => {
  getAllClass()
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
    const api = formData.value.book_id === undefined ? createBookManagementApi : updateBookManagementApi
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
