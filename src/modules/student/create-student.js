import axios from 'axios'
import { v4 } from 'uuid'
//生成一个四个随机数的函数
function generateRandomNumbers() {
  let randomNumber = ''
  for (let i = 0; i < 4; i++) {
    randomNumber += Math.floor(Math.random() * 10)
  }
  return randomNumber
}
async function createStudent(getData) {
  let data
  let id = '311900' + generateRandomNumbers()
  await axios({
    method: 'post',
    url: '/create-student',
    data: {
      id,
      name: getData.name,
      sex: getData.sex,
      class: getData.class,
      tel: getData.tel
    }
  }).then((res) => {
    data = res.data
  })
  return data
}
export default createStudent
