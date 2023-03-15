<template>
  <component :is="nav"></component>
  <div class="title">
    {{ title }}端
    <el-dropdown :hide-on-click="false">
      <span class="el-dropdown-link">
        <el-avatar
          @click="showUserInfo"
          class="avatar"
          shape="square"
          :size="40"
          :src="'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"
        />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="personMessage">个人信息</el-dropdown-item>
          <el-dropdown-item @click="back">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <router-view></router-view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import admin from '../components/nav-admin.vue'
import teacher from '../components/nav-teacher.vue'
import student from '../components/nav-student.vue'

import { useRouter } from 'vue-router'

function back() {
  localStorage.clear()
  router.replace('logn')
}
function showUserInfo() {
  userInfo.value = !userInfo.value
}
function personMessage() {}
let userInfo = ref(false)
let nav =
  localStorage.id == 'admin'
    ? admin
    : localStorage.id == 'teacher'
    ? teacher
    : student
let router = useRouter()
let title =
  localStorage.id == 'admin'
    ? '管理员'
    : localStorage.id == 'student'
    ? '学生'
    : '教师'
let name = localStorage.user
if (name == undefined) {
  router.replace('/logn')
}
document.body.style.paddingLeft = '200px'
onMounted(() => {
  document.body.style.paddingLeft = '0px'
  document.body.classList.remove('logn')
})
</script>
<style scoped lang="less">
.title {
  width: 100%;
  height: 44px;
  line-height: 44px;
  position: relative;
  text-align: center;
}
.avatar {
  float: right;
}
.avatar:active {
  cursor: pointer;
}
.avatar:hover {
  cursor: pointer;
}
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
