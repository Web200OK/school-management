<template>
  <div class="chengji-header">
    <el-select
      v-model="stuClass"
      placeholder="请选择"
      style="margin-top: 20px; margin-left: 230px; float: left"
      @change="classSelect"
    >
      <el-option
        v-for="item in setClass"
        :key="item.label"
        :label="item.label"
        :value="item.label"
      >
      </el-option>
    </el-select>
    <el-button type="primary" class="sort" @click="setSort">
      成绩排序
      <i class="el-icon-arrow-up" v-show="isSort != 'true' && isSort"></i>
      <i class="el-icon-arrow-down" v-show="isSort != 'true' && !isSort"></i>
    </el-button>
    <el-button @click="log" type="primary" class="log">打印成绩</el-button>
    <el-button type="primary" class="log" @click="isEchart">成绩分析</el-button>
  </div>
  <el-table :data="tableData">
    <el-table-column prop="stucode" label="学号" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column :label="label">
      <template #default="scope">
        <el-button :disabled="isDisabled" @click="setNum(scope)">
          {{ scope.row.score || '未输入' }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-card class="box-card" v-show="excelShow">
    <template #header>
      <div class="card-header">
        <span>点击下载Excel</span>
        <el-button class="button" type="text" @click="excelShow = false"
          >关闭</el-button
        >
      </div>
    </template>
    <div class="text-item">
      <a @click="download" target="_blank">点击下载</a>
    </div>
  </el-card>
  <el-drawer v-model="isShow" title="成绩可视化" direction="rtl" size="80%">
    <echarts_shanxing
      :option="option"
      @notShow="hide(value)"
    ></echarts_shanxing>
  </el-drawer>
  <el-button type="primary" round class="shenqing" @click="showApply = true"
    >申请开放</el-button
  >
  <div class="alert" v-show="showApply" @click="showApply = false">
    <div class="box" @click.stop="">
      <el-date-picker v-model="time" type="date" placeholder="选择日期">
      </el-date-picker>
      <el-input placeholder="输入说明" v-model="mes" clearable> </el-input>
      <el-button type="primary" @click="apply">申请</el-button>
    </div>
  </div>

  <!-- 修改成绩弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="`修改学号为: ${showDataOption.user_id} 的学生${label}？`"
    :before-close="beforClose"
  >
    <table>
      <tr>
        <td></td>
        <td>占比</td>
        <td>分数</td>
      </tr>
      <tr>
        <td>平时成绩</td>
        <td>
          <el-input-number
            v-model="showDataOption.cumulative"
            :min="0"
            :max="100"
            @change="
              (value) => {
                showDataOption.end = 100 - value
              }
            "
          />
        </td>
        <td>
          <el-input-number
            v-model="showDataOption.cumulative_count"
            :min="0"
            :max="100"
          />
        </td>
      </tr>
      <tr>
        <td>期末成绩</td>
        <td>
          <el-input-number
            v-model="showDataOption.end"
            :min="0"
            :max="100"
            @change="
              (value) => {
                showDataOption.cumulative = 100 - value
              }
            "
          />
        </td>
        <td>
          <el-input-number
            v-model="showDataOption.end_count"
            :min="0"
            :max="100"
          />
        </td>
      </tr>
    </table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="setChengji">确认录入</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import api from '@/modules/api'
import readUser from '@/modules/common/read-user'
import updataScore from '@/modules/common/updata-score'
import teacherPrint from '@/modules/teacher/teacher-print'
import { v4 } from 'uuid'
import echarts_shanxing from '@/components/echarts-shanxing.vue'
import echarts_tiaoxing from '@/components/echarts-tiaoxing.vue'

let store = useStore()

let isDisabled = ref(true)
api(`select * from time where id='settime';`).then((res) => {
  let times = res.res[0]
  let start = +times.start
  let end = +times.end
  let time = new Date().getTime()
  if (time > start && time < end) {
    isDisabled.value = false
  }
})

let tableData = ref('')
let allData
let subject = ref('')
let label = ref('')
readUser({ col: 'teacher', id: localStorage.teacher }).then((res) => {
  label.value = res.res[0].subject + '成绩'
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
  api(`select * from achievement`).then((res) => {
    tableData.value = res.res
    allData = res.res
    // 将授课科目的成绩单独处理为score
    tableData.value.forEach((el, i) => {
      tableData.value[i].score = tableData.value[i][subject.value]
    })
  })
})

let stuClass = ref('')
let setClass = ref([
  {
    label: '应用统计学1班'
  },
  {
    label: '应用统计学2班'
  },
  {
    label: '应用统计学3班'
  },
  {
    label: '应用统计学4班'
  },
  {
    label: '应用统计学5班'
  },
  {
    label: '应用统计学6班'
  }
])
// 查询对应班级的学生的学号，将成绩总数据的表进行遍历，如果学号对得上，说明是这个班级的，就push到tableData里面
function classSelect() {
  api(`select * from student where class='${stuClass.value}';`).then((res) => {
    let isClass = []
    res.res.forEach((item, i) => {
      isClass.push(item.id)
    })
    tableData.value = []
    allData.forEach((item, i) => {
      if (isClass.includes(item.stucode)) {
        tableData.value.push(item)
      }
    })
  })
}
// 获得焦点时候获取成绩存为变量，失去焦点时对比成绩是否有变化
let dialogVisible = ref(false)
let showDataOption = ref({
  user_id: '',
  //平时分、占比/期末分数、占比
  cumulative: 40,
  cumulative_count: 0,
  end: 60,
  end_count: 0
})
const beforClose = () => {
  dialogVisible.value = false
  showDataOption.value = {
    user_id: '',
    cumulative: 40,
    cumulative_count: 0,
    end: 60,
    end_count: 0
  }
}
function setNum(scope) {
  showDataOption.value.user_id = scope.row.stucode
  dialogVisible.value = true
}

// 文本框失去焦点之后设置成绩
function setChengji() {
  //   判断成绩是否修改
  let id = showDataOption.value.user_id //ID
  let score = (
    (showDataOption.value.cumulative_count / 100) *
      showDataOption.value.cumulative +
    (showDataOption.value.end_count / 100) * showDataOption.value.end
  ).toFixed(0) //成绩计算
  updataScore({ id: id, score: score, subject: subject.value }).then((res) => {
    if (res.res) {
      ElMessage({
        message: `成功修改ID: ${id} 同学的${label.value}成绩为${score}`,
        type: 'success',
        duration: 1000
      })
      tableData.value.find((item) => item.stucode == id).score = score
    } else {
      ElMessage({
        message: '修改失败',
        type: 'error'
      })
    }
    dialogVisible.value = false
  })
}
// 打印表格
let excel = ref('')
let excelShow = ref(false)
function log() {
  excelShow.value = true
}
function download() {
  let data = {
    name: (stuClass.value || '全部同学') + '成绩单',
    data: []
  }
  excel.value = (stuClass.value || '全部同学') + '成绩单.xlsx'
  data.data.push(['姓名', '学号', '成绩'])
  tableData.value.forEach((item, index) => {
    data.data.push([
      item.name,
      item.stucode,
      item.score == '' ? '未录入' : item.score
    ])
  })
  teacherPrint({ data: data }).then((res) => {
    excelShow.value = false
  })
}
// 生成表单
let option = ref({
  title: {
    text: '成绩展示',
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
let isShow = ref(false)
function isEchart() {
  // 每次设置数量时候先清空
  option.value.series[0].data.forEach((item, index) => {
    item.value = 0
  })
  // 设置标题
  option.value.title.text = `${
    stuClass.value == '' ? '全部同学的' : stuClass.value
  }${label.value}`
  // 遍历数组设置个数
  tableData.value.forEach((item, index) => {
    let i
    if (+item.score < 60 && item.score != '') {
      i = 0
    } else if (+item.score > 60 && +item.score < 81) {
      i = 1
    } else if (+item.score > 80 && +item.score < 90) {
      i = 2
    } else if (+item.score > 89 && +item.score < 101) {
      i = 3
    } else {
      i = 4
    }
    option.value.series[0].data[i].value++
  })
  isShow.value = true
}
function hide1(value) {
  isShow.value = false
}

let isSort = ref('true')
function setSort() {
  function compare(sort) {
    return function (obj1, obj2) {
      var value1 = +obj1['score']
      var value2 = +obj2['score']
      return sort ? value1 - value2 : value2 - value1 // 升序
    }
  }
  var sortObj = tableData.value.sort(compare(isSort.value))
  tableData.value = sortObj
  isSort.value = !!!isSort.value
}

let showApply = ref(false)
let time = ref('')
let mes = ref('')
function apply() {
  let now = new Date(time.value).getTime()
  let sql = `INSERT INTO apply ( id, settime,mes,state,teacher,time )
                       VALUES
                       ( '${v4()}', '${now}','${mes.value}','待处理','${
    localStorage.teacher
  }',NOW() );`
  api(sql).then((res) => {
    showApply.value = false
  })
}
</script>
<style scoped lang="less">
.chengji-header {
  height: 70px;
}
.log {
  float: right;
  margin-right: 30px;
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  position: fixed;
  top: 100px;
  left: calc((100vw - 480px) / 2);
}
.sort {
  float: left;
  margin-top: 20px;
  margin-left: 20px;
}
.shenqing {
  position: fixed;
  bottom: 80px;
  right: 50px;
}

.alert {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.3);
  .box {
    width: 300px;
    height: 250px;
    background: rgb(248, 248, 248);
    text-align: center;
    border-radius: 10px;
    margin: 0px auto;
    margin-top: 100px;
  }
  .el-input {
    width: 200px;
    margin-top: 30px;
  }
  .el-date-picker {
    margin-top: 20px;
  }
  .el-button {
    display: block !important;
    width: 200px;
    margin: 0px auto;
    margin-top: 20px;
  }
}
.text-item > a {
  text-decoration: underline purple;
  cursor: pointer;
}
</style>
