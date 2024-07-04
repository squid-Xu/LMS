<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { deleteBookManagementApi, getBookManagementApi } from "@/api/book_management"
import { type GetTableData } from "@/api/book_management/types/book_management"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, RefreshRight, UploadFilled } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils"
import AddEdit from "./add_edit.vue"
// import { getAllBookClassApi } from "@/api/book_class"
// import { type GetTableData as GetClassTableData } from "@/api/book_class/types/book_class"
import { getToken } from "@/utils/cache/cookies"
import type { UploadProps } from "element-plus"
import { ElLoading } from "element-plus"

defineOptions({
  // 命名当前组件
  name: "BookManagement"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增

const addEdit = ref()

const addBook = () => {
  addEdit.value.open()
  addEdit.value.isDetail = false
}
//#endregion

//#region 删
const handleDelete = (row: GetTableData) => {
  ElMessageBox.confirm(`正在删除图书：${row.book_name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteBookManagementApi(row.book_id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: GetTableData) => {
  addEdit.value.open(row)
  addEdit.value.isDetail = false
}
const handleDetail = (row: GetTableData) => {
  addEdit.value.open(row)
  addEdit.value.isDetail = true
}
//#endregion

//#region 查
const tableData = ref<GetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  book_name: "",
  author: "",
  publish: "",
  class_name: "",
  ISBN: ""
})
const getTableData = () => {
  loading.value = true
  getBookManagementApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    book_name: searchData.book_name || undefined,
    author: searchData.author || undefined,
    publish: searchData.publish || undefined,
    class_name: searchData.class_name || undefined,
    ISBN: searchData.ISBN || undefined
  })
    .then(({ data }) => {
      paginationData.total = data.total
      tableData.value = data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
// const classDate = ref<GetClassTableData[]>([])
// const getAllClass = () => {
//   getAllBookClassApi().then(({ data }) => {
//     classDate.value = data
//   })
// }
// getAllClass()
//#endregion
const actionURL = ref(`${import.meta.env.VITE_BASE_API}/upload/importExcel`)
const token = getToken()
const headers = ref({
  Authorization: token ? `Bearer ${token}` : undefined
})

const uploadLoading = ref({ close: () => {} })
const handleBeforeUpload = () => {
  // 设置上传loading状态
  uploadLoading.value = ElLoading.service({
    lock: true,
    text: "导入中",
    background: "rgba(255, 255, 255, .7)"
  })
  // 这里简单返回true继续上传
  return true
}

const handleSuccess: UploadProps["onSuccess"] = (response) => {
  uploadLoading.value.close()
  if (response.code !== 200) {
    ElMessageBox.alert(response.message, "提示", {
      type: "error",
      showClose: false,
      confirmButtonText: "我知道了",
      callback: () => {
        getTableData()
      }
    })
  } else {
    getTableData()
    ElMessage({
      message: "批量导入成功",
      type: "success"
    })
  }
}
//#region 批量导入

//#endregion
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="book_name" label="名称">
          <el-input v-model="searchData.book_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="ISBN" label="ISBN">
          <el-input v-model="searchData.ISBN" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="author" label="作者">
          <el-input v-model="searchData.author" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="publish" label="出版社">
          <el-input v-model="searchData.publish" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item prop="class_name" label="分类">
          <el-select v-model="searchData.class_name" style="width: 220px" clearable placeholder="请选择">
            <el-option
              v-for="item in classDate"
              :key="item.class_id"
              :label="item.class_name"
              :value="item.class_name"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div class="box-btn">
          <div>
            <el-button type="primary" :icon="CirclePlus" @click="addBook">添加新书</el-button>
          </div>
          <div style="margin-left: 20px" v-permission="['admin']">
            <el-upload
              :action="actionURL"
              :show-file-list="false"
              :headers="headers"
              :on-success="handleSuccess"
              :before-upload="handleBeforeUpload"
              accept=".xls,.xlsx"
            >
              <el-button type="primary" :icon="UploadFilled">批量导入</el-button>
            </el-upload>
          </div>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="book_name" fixed label="名称" show-overflow-tooltip width="250" />
          <el-table-column prop="ISBN" label="ISBN" show-overflow-tooltip width="200" />
          <el-table-column prop="author" label="作者" show-overflow-tooltip width="250" />
          <el-table-column prop="publish" label="出版社" show-overflow-tooltip width="250" />
          <el-table-column prop="class_name" label="分类" show-overflow-tooltip width="250" />
          <el-table-column prop="price" label="价格" width="150" />
          <el-table-column prop="number" label="数量" width="150" />
          <el-table-column prop="create_time" label="创建时间" min-width="200">
            <template #default="scope">
              {{ formatDateTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间" min-width="200">
            <template #default="scope">
              {{ formatDateTime(scope.row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="info" text bg size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" v-permission="['admin']" text bg size="small" @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <AddEdit ref="addEdit" @ok="getTableData" />
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.box-btn {
  display: flex;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
