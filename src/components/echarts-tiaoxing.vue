<template>
  <div class="box" v-show="echartsShow">
    <div class="tiaoxing" @click="notShow"></div>
    <div id="tiaoxing"></div>
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
  var myChart = echarts.init(document.getElementById('tiaoxing'))
  myChart.setOption(prop.option)
})
</script>
<style scoped lang="less">
#tiaoxing {
  float: left;
  width: 400px;
  height: 400px;
  margin-left: 20px;
}
</style>
