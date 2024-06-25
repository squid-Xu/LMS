export interface CreateOrUpdateTableRequestData {
  book_id?: number
  book_name: string
  author: string
  publish: string
  ISBN: string
  introduction: string
  language: string
  price: number
  pub_date: string
  class_id: number
  number: number
}

export interface GetTableRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数：用户名 */
  book_name?: string

  author?: string

  publish?: string

  class_name?: string

  ISBN?: string
}

export interface GetTableData {
  book_id: number
  book_name: string
  author: string
  publish: string
  ISBN: string
  introduction: string
  language: string
  price: number
  pub_date: string
  class_id: number
  number: number
  create_time: string
  update_time: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
