export interface CreateOrUpdateTableRequestData {
  admin_id?: number
  username: string
  password: string
  status: number
  nickname: string
  roles: string
}
export interface UpdatePasswordTableRequestData {
  old_password: string
  new_password: string
  confin_password?: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数：用户名 */
  username?: string

  nickname?: string
}

export interface GetTableData {
  admin_id: number
  username: string
  status: number
  nickname: string
  roles: string
  password: string
  create_time: string
  update_time: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
