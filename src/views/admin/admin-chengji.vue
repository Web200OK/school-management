<template>
  <el-button type="primary" class="log" @click="isEchart">成绩分析</el-button>
  <el-table :data="tableData">
    <el-table-column prop="name" label="学生姓名" width="180">
    </el-table-column>
    <el-table-column prop="stucode" label="学号" width="180"> </el-table-column>
    <el-table-column prop="sxfx" label="数学分析"> </el-table-column>
    <el-table-column prop="gdds" label="高等代数"> </el-table-column>
    <el-table-column prop="jxjh" label="解析几何"> </el-table-column>
    <el-table-column prop="cyy" label="C++程序语言与设计"> </el-table-column>
    <el-table-column prop="dxwl" label="大学物理"> </el-table-column>
    <el-table-column prop="cwf" label="常微分"> </el-table-column>
    <el-table-column label="删除">
      <template #default="scope">
        <el-button
          type="danger"
          @click="remove(scope.row.id)"
          icon="el-icon-delete"
          circle
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer
    v-model="isShow"
    title="成绩可视化"
    direction="rtl"
    size="80%"
    class="drawer"
  >
    <echarts_shanxing
      :option="option"
      @notShow="hide(value)"
    ></echarts_shanxing>
    <echarts_tiaoxing
      :option="option2"
      @notShow="hide2(value)"
    ></echarts_tiaoxing>
  </el-drawer>
</template>
<script setup>
import { ref } from 'vue'
import api from '@/modules/api'
import deleteUser from '@/modules/common/delete-user'
import { useRouter } from 'vue-router'
import echarts_shanxing from '@/components/echarts-shanxing.vue'
import echarts_tiaoxing from '@/components/echarts-tiaoxing.vue'

let router = useRouter()
let tableData = ref('')
api(`select * from achievement`).then((res) => {
  tableData.value = res.res
})
function remove(id, index) {
  deleteUser({ col: 'student', id: '3119007129' }).then((res) => {
    if (res.res) {
      api(`DELETE FROM achievement WHERE stucode='${id}';`).then((res) => {
        router.go(0)
      })
    }
  })
}
let subs = ['sxfx', 'gdds', 'jxjh', 'dxwl', 'cyy', 'cwf']
// 生成表单
let option = ref({
  title: {
    text: '全部科目成绩',
    left: 'center'
  },
  color: ['red', 'green', 'yellow', 'blueviolet', 'gray'],
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 0, name: '不及格' },
        { value: 0, name: '中等' },
        { value: 0, name: '良好' },
        { value: 0, name: '优秀' },
        { value: 0, name: '未登记' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
let option2 = ref({
  title: {
    text: '科目平均分展示',
    left: 'center'
  },
  color: ['red', 'green', 'yellow', 'blueviolet', 'gray'],
  xAxis: {
    axisLabel: {
      interval: 0, //坐标轴刻度标签的显示间隔(在类目轴中有效) 0:显示所有  1：隔一个显示一个 :3：隔三个显示一个...
      formatter: function (value) {
        return value.split('').join('\n')
      }
    },
    data: [
      '数据分析',
      '高等代数',
      '解析几何',
      '大学物理',
      'C++程序语言与设计',
      '常微分'
    ]
  },
  yAxis: {},
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'bar',
      data: [
        {
          value: 0,
          // 设置单个柱子的样式
          itemStyle: {
            color: 'red'
          }
        },
        {
          value: 0,
          // 设置单个柱子的样式
          itemStyle: {
            color: 'green'
          }
        },
        {
          value: 0,
          // 设置单个柱子的样式
          itemStyle: {
            color: 'yellow'
          }
        },
        {
          value: 0,
          // 设置单个柱子的样式
          itemStyle: {
            color: 'blueviolet'
          }
        },
        {
          value: 0,
          // 设置单个柱子的样式
          itemStyle: {
            color: 'gray'
          }
        },
        {
          value: 0,
          // 设置单个柱子的样式
          itemStyle: {
            color: 'pink'
          }
        }
      ],
      itemStyle: {
        borderType: 'dashed',
        opacity: 0.5
      }
    }
  ]
})
let isShow = ref(false)
function isEchart() {
  // 设置标题
  subs.forEach((item, index) => {
    let sub = item
    let num = index
    // 遍历数组设置个数
    tableData.value.forEach((item) => {
      let i
      if (+item[sub] < 60 && item[sub] != '') {
        i = 0
      } else if (+item[sub] > 60 && +item[sub] < 81) {
        i = 1
      } else if (+item[sub] > 80 && +item[sub] < 90) {
        i = 2
      } else if (+item[sub] > 89 && +item[sub] < 101) {
        i = 3
      } else {
        i = 4
      }
      option.value.series[0].data[i].value++
      option2.value.series[0].data[0].value += +item.sxfx
      option2.value.series[0].data[1].value += +item.gdds
      option2.value.series[0].data[2].value += +item.jxjh
      option2.value.series[0].data[3].value += +item.dxwl
      option2.value.series[0].data[4].value += +item.cyy
      option2.value.series[0].data[5].value += +item.cwf
    })
    option2.value.series[0].data.map((item) => {
      item.value = Math.round(item.value / tableData.value.length)
    })
  })
  isShow.value = true
}
function hide(value) {
  isShow.value = false
}
</script>
<style scoped lang="less">
.log {
  margin-left: 220px;
}
</style>
