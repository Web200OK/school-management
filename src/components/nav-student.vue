<template>
  <el-row>
    <el-col>
      <el-menu
        :router="true"
        default-active="/create-teacher"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item> 学生端菜单栏 </el-menu-item>
        <el-menu-item index="/student-score">
          <i class="el-icon-s-data"></i>
          <template #title>察看成绩</template>
        </el-menu-item>
        <el-menu-item :index="updataTeacherUrl">
          <i class="el-icon-edit"></i>
          <template #title>修改信息</template>
        </el-menu-item>
        <el-menu-item index="/read-message">
          <i class="el-icon-s-order"></i>
          <template #title>查看公告</template>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref } from 'vue'
let updataTeacherUrl = '/updata-student?id=' + localStorage.student
</script>
<style scoped lang="less">
.el-row {
  user-select: none;
  width: 200px;
  height: 100vh;
  background: #304156;
  position: fixed;
  top: 0px;
  left: 0px;
}
.el-menu {
  border: 0px;
}
</style>
