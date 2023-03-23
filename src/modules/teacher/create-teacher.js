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
async function createTeacher(getData) {
  let id = 't' + generateRandomNumbers()
  let data
  await axios({
    method: 'post',
    url: '/create-teacher',
    data: {
      id,
      name: getData.name,
      sex: getData.sex,
      subject: getData.subject,
      tel: getData.tel
    }
  }).then((res) => {
    data = res.data
  })
  return data
}
export default createTeacher
