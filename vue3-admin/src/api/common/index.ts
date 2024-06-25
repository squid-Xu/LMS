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

// 饼状图
export function getCommontPieApi() {
  return request({
    url: "/common/pie",
    method: "get"
  })
}
