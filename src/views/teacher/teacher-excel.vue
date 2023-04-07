<template>
  <div class="upload" v-if="!tableData.length">
    <input
      type="file"
      ref="file"
      id="file"
      style="display: none"
      accept=".xlsx"
      @change="load"
    />
    <label for="file" class="el-button el-button--primary">
      <i class="el-icon-upload"></i>
      上传文件
    </label>
  </div>
  <div v-if="tableData.length">
    <el-button type="primary" @click="add_score" class="log"
      >录入以下成绩</el-button
    >
    <el-table :data="tableData">
      <el-table-column prop="name" label="学生姓名" width="180">
      </el-table-column>
      <el-table-column prop="stucode" label="学生学号" width="180">
      </el-table-column>
      <el-table-column :label="showScore">
        <template #default="scope">
          <el-input
            placeholder="请输入成绩"
            v-model="scope.row.score"
            clearable
            style="width: 200px"
            :min="0"
            :max="100"
            maxlength="3"
            @focus="save(scope.row.score)"
            @blur="change(scope.row.stucode, scope.row.score, scope.$index)"
          >
          </el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/modules/api'
import axios from 'axios'
import uploadExcel from '@/modules/upload-excel'
import teacherPrint from '@/modules/teacher/teacher-print'
import { useStore } from 'vuex'

let router = useRouter()
let store = useStore()
let showScore = ref('') //表格上面的文字
let subject = ref('')
api(`select * from teacher where id='${localStorage.teacher}';`).then((res) => {
  showScore.value = res.res[0].subject + '成绩'
  switch (res.res[0].subject) {
    case '数学分析':
      subject.value = 'sxfx'
      break
    case '高等代数':
      subject.value = 'gdds'
      break
    case '解析几何':
      subject.value = 'jxjh'
      break
    case 'C++程序语言与设计':
      subject.value = 'cyy'
      break
    case '大学物理':
      subject.value = 'dxwl'
      break
    case '常微分':
      subject.value = 'cwf'
      break
  }
})
let tableData = ref([])
let file = ref(null)
let isShow = ref(false)
function load() {
  let fromD = new FormData()
  fromD.append(subject.value, file.value.files[0])
  uploadExcel(fromD).then((res) => {
    if (res.data.length) {
      tableData.value = res.data
      isShow.value = true
    } else {
      alert('excel格式上传失败或没有数据')
      router.go(0)
    }
  })
}

let score
function save(s) {
  score = +s
  console.log(score)
}
function change(id, s, index) {
  console.log(score)
  if (+s != +score && +s >= 0 && +s <= 100) {
    let sql = `UPDATE achievement SET ${subject.value}='${s}' WHERE stucode='${id}';`
    api(sql).then((res) => {
      // console.log(res);
    })
  } else {
    tableData.value[index].score = score + ''
  }
}
function add_score() {
  tableData.value.forEach((item) => {
    let sql = `UPDATE achievement SET ${subject.value}='${item.score}' WHERE stucode='${item.stucode}';`
    api(sql).then((res) => {
      // console.log(res);
    })
  })
}
</script>
<style scoped lang="less">
.upload {
  margin-top: 100px;
  text-align: center;
}
.log {
  margin-top: 20px;
  margin-left: 30px;
}
.log {
  z-index: 9;
  top: 30px;
  left: 60%;
  position: absolute;
}
</style>
