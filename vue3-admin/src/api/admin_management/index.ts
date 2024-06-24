import { request } from "@/utils/service"
import type * as adminManagement from "./types/admin_management"
/** 增 */
export function createAdminManagementApi(data: adminManagement.CreateOrUpdateTableRequestData) {
  return request({
    url: "/admin/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteAdminManagementApi(id: number) {
  return request({
    url: `/admin/delete/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateAdminManagementApi(data: adminManagement.CreateOrUpdateTableRequestData) {
  return request({
    url: "/admin/edit",
    method: "put",
    data
  })
}

/** 查 */
export function getAdminManagementApi(params: adminManagement.GetTableRequestData) {
  return request<adminManagement.GetTableResponseData>({
    url: "/admin/list",
    method: "get",
    params
  })
}

/**修改密码 */
export function updatePasswordAdminManagementApi(data: adminManagement.UpdatePasswordTableRequestData) {
  return request({
    url: "/admin/password",
    method: "put",
    data
  })
}
