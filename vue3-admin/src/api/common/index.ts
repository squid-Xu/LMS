import { request } from "@/utils/service"

//统计
export function getCommontStatisticsApi() {
  return request({
    url: "/common/statistics",
    method: "get"
  })
}

// 折线图
export function getCommontEchartsApi() {
  return request({
    url: "/common/echarts",
    method: "get"
  })
}
