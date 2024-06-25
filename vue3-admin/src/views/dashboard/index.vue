<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>分类数量</span>
            </div>
          </template>
          <div class="item">{{ statisticsTotal.class_info_total }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>图书数量</span>
            </div>
          </template>
          <div class="item">{{ statisticsTotal.book_info_total }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>会员数量</span>
            </div>
          </template>
          <div class="item">{{ statisticsTotal.reader_info_total }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>管理员数量</span>
            </div>
          </template>
          <div class="item">{{ statisticsTotal.admin_total }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="zoom" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card> <div id="user_box" class="box" /> </el-card
      ></el-col>
      <el-col :span="12">
        <el-card> <div id="lend_box" class="box" /> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getCommontStatisticsApi, getCommontEchartsApi, getCommontPieApi } from "@/api/common"
import * as echarts from "echarts"
import { onUnmounted, ref } from "vue"

//数量
const statisticsTotal = ref({})
const queryCommontStatisticsApi = () => {
  getCommontStatisticsApi().then((res) => {
    statisticsTotal.value = res.data
  })
}
queryCommontStatisticsApi()

//折线图
const echartsTotal = ref({})
const myChart = ref(null)
const queryCommontEchartsApi = () => {
  getCommontEchartsApi().then((res) => {
    echartsTotal.value = res.data

    // 基于准备好的dom，初始化echarts实例
    myChart.value = echarts.init(document.getElementById("zoom"))

    // 指定图表的配置项和数据
    const option = {
      title: {
        text: "最近七天的日新增数量"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      legend: {
        data: ["新增分类", "新增图书", "新增会员", "新增借阅", "新增归还"]
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: echartsTotal.value.class_info.map((v) => v.click_date).reverse()
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "新增分类",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series"
          },
          data: echartsTotal.value.class_info.map((v) => v.count).reverse()
        },
        {
          name: "新增图书",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series"
          },
          data: echartsTotal.value.book_info.map((v) => v.count).reverse()
        },
        {
          name: "新增会员",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series"
          },
          data: echartsTotal.value.reader_info.map((v) => v.count).reverse()
        },
        {
          name: "新增借阅",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series"
          },
          data: echartsTotal.value.borrow.map((v) => v.count).reverse()
        },
        {
          name: "新增归还",
          type: "line",
          stack: "总量",
          label: {
            show: true,
            position: "top"
          },
          areaStyle: {},
          emphasis: {
            focus: "series"
          },
          data: echartsTotal.value.give_back.map((v) => v.count).reverse()
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.value.setOption(option)
  })
}
queryCommontEchartsApi()

//饼状图
const pieTotal = ref({})

const user_Chart = ref(null)
const lend_Chart = ref(null)
const queryCommontPieApi = () => {
  getCommontPieApi().then((res) => {
    pieTotal.value = res.data
    // 基于准备好的dom，初始化echarts实例
    user_Chart.value = echarts.init(document.getElementById("user_box"))

    // 指定图表的配置项和数据
    const user_option = {
      title: {
        text: "会员续费情况"
      },
      tooltip: {
        trigger: "item"
      },
      legend: {
        left: "center"
      },
      series: [
        {
          name: "会员续费情况",
          type: "pie",
          radius: "50%",
          data: [
            { value: pieTotal.value.reader_total, name: "会员总量", itemStyle: { color: "#1e90ff" } },
            { value: pieTotal.value.was_due_total, name: "已到期", itemStyle: { color: "#ff4500" } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    user_Chart.value.setOption(user_option)

    // 基于准备好的dom，初始化echarts实例
    lend_Chart.value = echarts.init(document.getElementById("lend_box"))

    // 指定图表的配置项和数据
    const lend_option = {
      title: {
        text: "图书借阅情况"
      },
      tooltip: {
        trigger: "item"
      },
      legend: {
        left: "center"
      },
      series: [
        {
          name: "图书借阅情况",
          type: "pie",
          radius: "50%",
          data: [
            { value: pieTotal.value.lend_total, name: "借阅总量" },
            { value: pieTotal.value.no_return_total, name: "未归还", itemStyle: { color: "#ff4500" } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    lend_Chart.value.setOption(lend_option)
  })
}
queryCommontPieApi()

//销毁
onUnmounted(() => {
  myChart.value.dispose()
})
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
#zoom {
  min-height: 300px;
}
.box {
  min-height: 300px;
}
</style>
