<template>
  <div class="box" v-show="echartsShow">
    <div class="ceng" @click="notShow"></div>
    <div id="main"></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let prop = defineProps({ option: Object, isShow: Boolean })
let echartsShow = ref(true)
let emit = defineEmits()
let showValue = ref(false)
function notShow() {
  emit('notShow', showValue)
}
onMounted(() => {
  var myChart = echarts.init(document.getElementById('main'))
  myChart.setOption(prop.option)
})
</script>
<style scoped lang="less">
#main {
  float: left;
  width: 300px;
  height: 400px;
  margin-left: 20px;
}
</style>
