<template>
  <el-dialog
    v-model="dialogVisible"
    title="借阅书籍"
    width="70%"
    :close-on-click-modal="false"
    class="custom-dialog-background"
    @closed="handleClose"
  >
    <el-card shadow="never" class="search-wrapper">
      <el-descriptions :column="4">
        <el-descriptions-item label="姓名：">{{ formData.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号：">{{ formData.phone }}</el-descriptions-item>
        <el-descriptions-item label="会员到期日期：">{{ formData.expire }}</el-descriptions-item>
        <el-descriptions-item label="会员状态：">
          <el-tag v-if="remainingDays(formData.expire) >= 0" type="success" effect="dark">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="`剩余 ${remainingDays(formData.expire)} 天`"
              placement="top"
            >
              正常
            </el-tooltip>
          </el-tag>
          <el-tag v-else type="danger" effect="dark">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="`已过期 ${Math.abs(remainingDays(formData.expire))} 天`"
              placement="top"
            >
              过期
            </el-tooltip>
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card shadow="never" class="search-wrapper">
      <el-input v-model="searchData.book_name" placeholder="请输入书名、作者、出版社、ISBN" :prefix-icon="Search" />
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="book_name" fixed label="名称" show-overflow-tooltip width="250" />
          <el-table-column prop="ISBN" label="ISBN" show-overflow-tooltip width="200" />
          <el-table-column prop="author" label="作者" show-overflow-tooltip width="250" />
          <el-table-column prop="publish" label="出版社" show-overflow-tooltip min-width="250" />
          <el-table-column prop="price" label="价格" width="150" />
          <el-table-column prop="number" label="数量" width="150" />
          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template #default="scope">
              <el-popconfirm title="确定借阅?" @confirm="handleBorrow(scope.row)">
                <template #reference>
                  <el-button type="success" plain size="small">借阅</el-button>
                </template>
              </el-popconfirm>
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
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, watch, reactive } from "vue"
import {
  type CreateOrUpdateTableRequestData,
  type GetTableData as UserGetTableData
} from "@/api/user_management/types/user_management"
import { cloneDeep } from "lodash-es"
import dayjs from "dayjs"
import { usePagination } from "@/hooks/usePagination"
import { searchBookManagementApi } from "@/api/book_management"
import { type GetTableData } from "@/api/book_management/types/book_management"
import { Search } from "@element-plus/icons-vue"
import { createLendListApi } from "@/api/lend_list"
import { ElMessage } from "element-plus"

//#region 弹窗信息
const dialogVisible = ref(false)

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

const open = (row: UserGetTableData) => {
  dialogVisible.value = true
  if (row) {
    formData.value = cloneDeep(row)
  }
  getTableData()
}

//剩余天数
const remainingDays = computed(() => {
  return (endDate: string) => {
    return endDate ? dayjs(endDate).diff(dayjs(), "days") : 0
  }
})
//#endregion

//#region 图书列表
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#endregion

//#region 查
const tableData = ref<GetTableData[]>([])
const searchData = reactive({
  book_name: ""
})
const getTableData = () => {
  loading.value = true
  searchBookManagementApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    book_name: searchData.book_name || undefined
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
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData)

watch(() => searchData.book_name, handleSearch)

const handleClose = () => {
  dialogVisible.value = false
}

//借阅
const handleBorrow = (row: GetTableData) => {
  createLendListApi({
    book_id: row.book_id,
    reader_id: formData.value.reader_id,
    status: 1
  }).then(() => {
    ElMessage.success("借阅成功")
  })
}

defineExpose({
  open
})
</script>
<style>
.custom-dialog-background {
  background-color: #f2f3f5;
}
</style>
<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 10px;
  // :deep(.el-card__body) {
  //   padding-bottom: 2px;
  // }
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
