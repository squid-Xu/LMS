import { request } from "@/utils/service"
import type * as bookClass from "./types/book_class"
/** 增 */
export function createBookClassApi(data: bookClass.CreateOrUpdateTableRequestData) {
  return request({
    url: "/class_info/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteBookClassApi(id: string) {
  return request({
    url: `/class_info/delete/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateBookClassApi(data: bookClass.CreateOrUpdateTableRequestData) {
  return request({
    url: "/class_info/edit",
    method: "put",
    data
  })
}

/** 查 */
export function getBookClassApi(params: bookClass.GetTableRequestData) {
  return request<bookClass.GetTableResponseData>({
    url: "/class_info/list",
    method: "get",
    params
  })
}

/** 查全部分类 */
export function getAllBookClassApi() {
  // return request({
  return request<bookClass.GetClassResponse>({
    url: "/class_info/page",
    method: "get"
  })
}
