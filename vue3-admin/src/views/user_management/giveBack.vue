<template>
  <el-dialog
    v-model="dialogVisible"
    title="归还书籍"
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
          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template #default="scope">
              <el-popconfirm title="确定归还?" @confirm="handleReturn(scope.row)">
                <template #reference>
                  <el-button type="primary" :disabled="scope.row.status === 2" text bg size="small">归还</el-button>
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
import { ref, computed, watch } from "vue"
import {
  type CreateOrUpdateTableRequestData,
  type GetTableData as UserGetTableData
} from "@/api/user_management/types/user_management"
import { cloneDeep } from "lodash-es"
import dayjs from "dayjs"
import { usePagination } from "@/hooks/usePagination"
import { getLendListApi, updateLendListApi } from "@/api/lend_list"
import { type GetTableData } from "@/api/lend_list/types/lend_list"
import { ElMessage } from "element-plus"
import { formatDateTime } from "@/utils"

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
    getTableData()
  }
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
const getTableData = () => {
  loading.value = true
  getLendListApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    phone: formData.value.phone,
    status: "1"
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

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData)

const handleClose = () => {
  dialogVisible.value = false
}

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
  margin-bottom: 20px;
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
