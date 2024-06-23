<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { deleteAdminManagementApi, getAdminManagementApi, updateAdminManagementApi } from "@/api/admin_management"
import { type GetTableData } from "@/api/admin_management/types/admin_management"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils"
import AddEdit from "./add_edit.vue"

defineOptions({
  // 命名当前组件
  name: "AdminManagement"
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
  ElMessageBox.confirm(`正在删除管理员：${row.nickname}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAdminManagementApi(row.admin_id).then(() => {
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
  username: "",
  nickname: ""
})
const getTableData = () => {
  loading.value = true
  getAdminManagementApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    username: searchData.username || undefined,
    nickname: searchData.nickname || undefined
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
//#endregion

//#region 禁用、解除
const handleForbidden = (row: GetTableData, status: number) => {
  updateAdminManagementApi({
    ...row,
    status
  }).then(() => {
    ElMessage.success("操作成功")
    getTableData()
  })
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="账号">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="nickname" label="姓名">
          <el-input v-model="searchData.nickname" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="addBook">添加管理员</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="username" fixed label="账号" width="150" />
          <el-table-column prop="nickname" label="姓名" width="150" />
          <el-table-column prop="expire" label="状态" width="150">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 1" type="success" effect="dark"> 正常 </el-tag>
              <el-tag v-else type="danger" effect="dark"> 已禁用 </el-tag>
            </template>
          </el-table-column>
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
              <!-- <el-button type="info" text bg size="small" @click="handleDetail(scope.row)">详情</el-button> -->
              <el-popconfirm title="确定禁用?" @confirm="handleForbidden(scope.row, 2)">
                <template #reference>
                  <el-button type="warning" text bg size="small" v-if="scope.row.status === 1">禁用</el-button>
                </template>
              </el-popconfirm>

              <el-popconfirm title="确定解除?" @confirm="handleForbidden(scope.row, 1)">
                <template #reference>
                  <el-button type="success" text bg size="small" v-if="scope.row.status !== 1">解除</el-button>
                </template>
              </el-popconfirm>

              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
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

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
