export interface CreateOrUpdateTableRequestData {
  class_id?: string
  class_name: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数：用户名 */
  class_name?: string
}

export interface GetTableData {
  class_id: string
  class_name: string
  create_time: string
  update_time: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
