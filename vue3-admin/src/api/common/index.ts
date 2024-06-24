import { request } from "@/utils/service"

//统计
export function getCommontStatisticsApi() {
  return request({
    url: "/common/statistics",
    method: "get"
  })
}
