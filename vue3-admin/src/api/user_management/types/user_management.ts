export interface CreateOrUpdateTableRequestData {
  reader_id?: number
  name: string
  phone: string
  sex: number
  birth?: string
  address?: string
  expire: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数：用户名 */
  name?: string

  phone?: string
}

export interface GetTableData {
  reader_id: number
  name: string
  phone: string
  sex: number
  birth: string
  address: string
  expire: string
  create_time: string
  update_time: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
