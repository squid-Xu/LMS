<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue"
import { deleteUserManagementApi, getUserManagementApi } from "@/api/user_management"
import { type GetTableData } from "@/api/user_management/types/user_management"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils"
import AddEdit from "./add_edit.vue"
import dayjs from "dayjs"

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
  ElMessageBox.confirm(`正在删除用户：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUserManagementApi(row.reader_id).then(() => {
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
  name: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  getUserManagementApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    name: searchData.name || undefined,
    phone: searchData.phone || undefined
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
//剩余天数
const remainingDays = computed(() => {
  return (endDate: string) => {
    return endDate ? dayjs(endDate).diff(dayjs(), "days") : 0
  }
})
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="addBook">新增会员</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="name" fixed label="姓名" width="150" />
          <el-table-column prop="phone" label="手机号" width="150" />
          <el-table-column prop="sex" label="性别" width="150">
            <template #default="scope">
              <el-tag v-if="scope.row.sex === 1" type="success" effect="plain">男</el-tag>
              <el-tag v-else type="danger" effect="plain">女</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="expire" label="会员到期日期" width="150" />
          <el-table-column prop="expire" label="会员状态" width="150">
            <template #default="scope">
              <el-tag v-if="remainingDays(scope.row.expire) >= 0" type="success" effect="dark">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="`剩余${remainingDays(scope.row.expire)}天`"
                  placement="top"
                >
                  正常
                </el-tooltip>
              </el-tag>
              <el-tag v-else type="danger" effect="dark">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="`已过期${Math.abs(remainingDays(scope.row.expire))}天`"
                  placement="top"
                >
                  过期
                </el-tooltip>
              </el-tag>
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
              <el-button type="primary" text bg size="small" @click="handleDetail(scope.row)">详情</el-button>
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
