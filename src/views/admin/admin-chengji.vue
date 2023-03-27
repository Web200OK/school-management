<template>
  <el-table :data="tableData">
    <el-table-column prop="name" label="学生姓名" width="180">
    </el-table-column>
    <el-table-column prop="stucode" label="学号" width="180"> </el-table-column>
    <el-table-column prop="vue" label="数学分析"> </el-table-column>
    <el-table-column prop="node" label="高等代数"> </el-table-column>
    <el-table-column prop="marx" label="解析几何"> </el-table-column>
    <el-table-column prop="innovate" label="C++程序语言与设计">
    </el-table-column>
    <el-table-column prop="mysql" label="大学物理"> </el-table-column>
    <el-table-column prop="math" label="常微分"> </el-table-column>
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
</template>
<script setup>
import { ref } from 'vue'
import api from '@/modules/api'
import deleteUser from '@/modules/common/delete-user'
import { useRouter } from 'vue-router'
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
</script>
<style scoped lang="less"></style>
