import { request } from "@/utils/service"
import type * as userManagement from "./types/user_management"
/** 增 */
export function createUserManagementApi(data: userManagement.CreateOrUpdateTableRequestData) {
  return request({
    url: "/reader_info/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteUserManagementApi(id: number) {
  return request({
    url: `/reader_info/delete/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateUserManagementApi(data: userManagement.CreateOrUpdateTableRequestData) {
  return request({
    url: "/reader_info/edit",
    method: "put",
    data
  })
}

/** 查 */
export function getUserManagementApi(params: userManagement.GetTableRequestData) {
  return request<userManagement.GetTableResponseData>({
    url: "/reader_info/list",
    method: "get",
    params
  })
}
