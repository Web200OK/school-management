<template>
  <component :is="nav"></component>
  <div class="title">
    {{ title }}
    <el-avatar @click="showUserInfo" class="avatar" shape="square" :size="40" :src="'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"/>
    <div v-show="userInfo" class="box2">
      <span @click="personMessage">个人信息</span>
      <span @click="back">退出系统</span>
    </div> 
  </div>
  <router-view></router-view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import admin from "../components/nav-admin.vue";
import teacher from "../components/nav-teacher.vue";
import student from "../components/nav-student.vue";

import { useRouter } from "vue-router";

function back() {
  localStorage.clear();
  router.replace("logn");
}
function showUserInfo(){
  userInfo.value = !userInfo.value
}
function personMessage(){
  
}
let userInfo = ref(false)
let nav =
  localStorage.id == "admin"
    ? admin
    : localStorage.id == "teacher"
    ? teacher
    : student;
let router = useRouter()
let title =
  localStorage.id == "admin"
    ? "管理员"
    : localStorage.id == "student"
    ? "学生"
    : "教师";
let name = localStorage.user;
if (name == undefined) {
  router.replace("/logn");
}
document.body.style.paddingLeft = "200px";
onMounted(() => {
  document.body.style.paddingLeft = "0px";
  document.body.classList.remove("logn");
});
</script>
<style scoped lang="less">
.title {
  width: 100%;
  height: 44px;
  line-height: 44px;
  position: relative;
  /* margin-left: -20px;
  margin-top: -10px; */
  text-align: center;
  /* background-color: #304156;
  color: #bfcbd9; */
}
.box2{
  position: absolute;
  top: 50px;
  right: 0px;
  border: 1px solid #ccc;
  width: 100px;
  height: 65px;
  background-color: #fff;
  box-sizing: border-box;
  span{
      display: block;
      margin-bottom: 15px;
      height: 10px;
      text-align: center;
      font-size: 1px;
      &:hover{
          cursor: pointer;
      }
  }
}
.avatar{
  float: right;
}
.avatar:active {
  cursor: pointer;
}
.avatar:hover {
  cursor: pointer;
}

</style>
