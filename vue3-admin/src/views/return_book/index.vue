<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { deleteLendListApi, getLendListApi, updateLendListApi } from "@/api/lend_list"
import { type GetTableData } from "@/api/lend_list/types/lend_list"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils"
import dayjs from "dayjs"

defineOptions({
  // 命名当前组件
  name: "UserManagement"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 删
const handleDelete = (row: GetTableData) => {
  ElMessageBox.confirm(`正在删除归还记录：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteLendListApi(row.ser_num).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 查
const tableData = ref<GetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  phone: "",
  book_name: "",
  status: "",
  ISBN: ""
})
const getTableData = () => {
  loading.value = true
  getLendListApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    name: searchData.name || undefined,
    phone: searchData.phone || undefined,
    book_name: searchData.book_name || undefined,
    ISBN: searchData.ISBN || undefined,
    status: searchData.status || undefined
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

//#region归还
const handleReturn = (row: GetTableData) => {
  updateLendListApi({
    ser_num: row.ser_num,
    back_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    status: 2
  }).then(() => {
    ElMessage.success("归还成功")
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
        <el-form-item prop="name" label="借阅人姓名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="借阅人手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="book_name" label="书名">
          <el-input v-model="searchData.book_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="ISBN" label="ISBN">
          <el-input v-model="searchData.ISBN" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="searchData.status" style="width: 220px" placeholder="请选择" clearable>
            <el-option label="未还" :value="1" />
            <el-option label="已还" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="name" fixed label="借阅人姓名" width="150" />
          <el-table-column prop="phone" label="借阅人手机号" width="150" />
          <el-table-column prop="book_name" show-overflow-tooltip label="书名" width="150" />
          <el-table-column prop="ISBN" label="ISBN" width="200" />
          <el-table-column prop="expire" label="状态" width="150">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 1" type="danger" effect="dark"> 未还 </el-tag>
              <el-tag v-else type="success" effect="dark"> 已还 </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lend_date" label="借出时间" min-width="200">
            <template #default="scope">
              {{ formatDateTime(scope.row.lend_date) }}
            </template>
          </el-table-column>
          <el-table-column prop="borrower" label="借阅操作人" width="150" />
          <el-table-column prop="back_date" label="归还时间" min-width="200">
            <template #default="scope">
              {{ scope.row.back_date ? formatDateTime(scope.row.back_date) : "" }}
            </template>
          </el-table-column>
          <el-table-column prop="reverter" label="归还操作人" width="150" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-popconfirm title="确定归还?" @confirm="handleReturn(scope.row)">
                <template #reference>
                  <el-button type="primary" :disabled="scope.row.status === 2" text bg size="small">归还</el-button>
                </template>
              </el-popconfirm>
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
