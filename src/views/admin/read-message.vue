<template>
  <el-table :data="tableData">
    <el-table-column fixed prop="id" label="id" width="150" />
    <el-table-column prop="title" label="标题" width="150" />
    <el-table-column prop="text" label="内容" width="700" />
    <el-table-column label="操作" width="150" class="table-button">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="handleReadMessage(scope)"
        >点击查看详情</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="30%"
    :before-close="handleClose"
  >
    <span>{{ text }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import api from '@/modules/api'
let tableData = ref('')
let student = ref([])
let isStudent = ref(localStorage.id == 'student')
let studentName = ref(localStorage.student)
let isWatch = ref('')
let dialogVisible = ref(false)
let text = ref('')
let title = ref('')
api(`select * from isshow`).then((res) => {
  isWatch.value = res.res[0].watch
})
if (localStorage.id == 'student') {
  api(
    `select * from achievement where stucode='${localStorage.student}';`
  ).then((res) => {
    studentName.value = res.res[0].name
    tableData.value = res.res
    let data = res.res[0]
    if (+data.vue < 60) {
      student.value.push({
        key: 'VUE',
        value: data.vue
      })
    }
    if (+data.node < 60) {
      student.value.push({
        key: 'Node',
        value: data.node
      })
    }
    if (+data.marx < 60) {
      student.value.push({
        key: '马克思主义思想',
        value: data.marx
      })
    }
    if (+data.innovate < 60) {
      student.value.push({
        key: '创新与实践',
        value: data.innovate
      })
    }
    if (+data.mysql < 60) {
      student.value.push({
        key: 'MySql',
        value: data.mysql
      })
    }
    if (+data.math < 60) {
      student.value.push({
        key: '高等数学',
        value: data.math
      })
    }
  })
}
api(`select * from message`).then((res) => {
  tableData.value = res.res
})
function handleReadMessage(scope) {
  console.log('scope', scope)
  dialogVisible.value = true
  text.value = scope.row.text
  title.value = scope.row.title
}
</script>
<style scoped lang="less">
.mes-box {
  padding: 20px 0px;
  border-bottom: 1px solid black;
}
.mes-title {
  font-weight: 700;
}
.table-button {
  display: flex;
  justify-content: center;
}
</style>
