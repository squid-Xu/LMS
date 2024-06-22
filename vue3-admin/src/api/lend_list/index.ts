import { request } from "@/utils/service"
import type * as lendList from "./types/lend_list"
/** 增 */
export function createLendListApi(data: lendList.CreateOrUpdateTableRequestData) {
  return request({
    url: "/lend_list/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteLendListApi(id: number) {
  return request({
    url: `/lend_list/delete/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateLendListApi(data: lendList.CreateOrUpdateTableRequestData) {
  return request({
    url: "/lend_list/edit",
    method: "put",
    data
  })
}

/** 查 */
export function getLendListApi(params: lendList.GetTableRequestData) {
  return request<lendList.GetTableResponseData>({
    url: "/lend_list/list",
    method: "get",
    params
  })
}
