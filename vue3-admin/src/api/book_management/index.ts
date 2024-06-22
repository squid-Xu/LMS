import { request } from "@/utils/service"
import type * as bookManagement from "./types/book_management"
/** 增 */
export function createBookManagementApi(data: bookManagement.CreateOrUpdateTableRequestData) {
  return request({
    url: "/book_info/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteBookManagementApi(id: string) {
  return request({
    url: `/book_info/delete/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateBookManagementApi(data: bookManagement.CreateOrUpdateTableRequestData) {
  return request({
    url: "/book_info/edit",
    method: "put",
    data
  })
}

/** 查 */
export function getBookManagementApi(params: bookManagement.GetTableRequestData) {
  return request<bookManagement.GetTableResponseData>({
    url: "/book_info/list",
    method: "get",
    params
  })
}

/** 搜索 */
export function searchBookManagementApi(params: bookManagement.GetTableRequestData) {
  return request<bookManagement.GetTableResponseData>({
    url: "/book_info/search",
    method: "get",
    params
  })
}
