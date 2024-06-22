export interface CreateOrUpdateTableRequestData {
  ser_num?: number
  book_id?: number
  reader_id?: number | undefined
  status: number
  back_date?: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数：用户名 */
  name?: string

  phone?: string

  book_name?: string

  status?: string

  ISBN?: string
}

export interface GetTableData {
  ser_num: number
  book_id: number
  name: string
  reader_id: number
  lend_date: string
  status: number
  back_date: string
  create_time: string
  update_time: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
