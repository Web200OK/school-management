<template>
  <div v-if="isWatch == 'true'">
    <el-table :data="data">
      <el-table-column prop="key" label="说明" width="200"> </el-table-column>
      <el-table-column prop="value" label="结果" width="200"> </el-table-column>
    </el-table>
    <el-button type="primary" icon="el-icon-download" @click="log"
    >打印成绩</el-button
    >
    <el-card class="box-card" v-if="isShow">
      <template #header>
        <div class="card-header">
          <span>下载成绩</span>
          <el-button class="button-close" type="text" @click="isShow = false"
          >关闭</el-button
          >
        </div>
      </template>
      <div class="text-item">
        <a @click="download" target="_blank">点击下载成绩</a>
      </div>
    </el-card>
    <div class="alert" v-if="isShow"></div>
  </div>
  <h1 v-else>目前禁止察看成绩</h1>
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import api from '@/modules/api'
import teacherPrint from '@/modules/teacher/teacher-print'

let store = useStore()
let url = ref('')
let tableData = ref([])
let all = ref(0)
let gpa = ref(0)
let num = ref(0)

let data = ref([])
api(`select * from achievement where stucode='${localStorage.student}'`).then(
  (res) => {
    tableData.value = res.res
    let value = Object.values(res.res[0]).slice(2, 8)
    value.forEach((item, index) => {
      if (+item) {
        all.value += +item
        num.value++
      }
      if (+item > 90) {
        gpa.value += 4
      } else if (+item > 80) {
        gpa.value += 3
      } else if (+item > 70) {
        gpa.value += 2
      } else if (+item > 60) {
        gpa.value += 1
      }
    })
    let key = [
      '学号',
      '姓名',
      '数学分析',
      '高等代数',
      '解析几何',
      '大学物理',
      'C++程序语言与设计',
      '常微分',
      '平均绩点',
      '平均分',
      '总分'
    ]
    let values = Object.values(tableData.value[0]).slice(0, 8)
    values.push((gpa.value / num.value).toFixed(2))
    values.push((all.value / num.value).toFixed(2))
    values.push(all.value)
    key.forEach((item, index) => {
      data.value.push({
        key: item,
        value: values[index]
      })
    })
  }
)

let isShow = ref(false)
function log() {
  isShow.value = true
}
function download() {
  let data = []
  data.push([
    '姓名',
    '学号',
    '数学分析',
    '高等代数',
    '解析几何',
    '大学物理',
    'C++程序语言与设计',
    '常微分',
    '总分'
  ])
  let newData = Object.values(tableData.value[0])
  newData[8] = all.value
  data.push(newData)
  let print = {
    name: localStorage.student + '同学的成绩单',
    data: data
  }
  teacherPrint({ data: print }).then((res) => {
    isShow.value = false
    url.value = print.name
  })
}

let isWatch = ref('')
api(`select * from isshow`).then((res) => {
  isWatch.value = res.res[0].watch
})
</script>
<style scoped lang="less">
.el-button {
  top: 50px;
  left: 80%;
  position: absolute;
}
.box-card {
  width: 400px !important;
  height: 300px !important;
  position: fixed;
  top: 200px;
  left: calc((100vw - 500px) / 2);
  z-index: 99999;
}
.button-close {
  position: absolute;
  top: 10px;
}
.alert {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}
.text-item > a {
  text-decoration: underline purple;
  cursor: pointer;
}
</style>
