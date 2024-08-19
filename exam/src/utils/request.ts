import axios from 'axios'
import { ElMessage } from 'element-plus'
const baseURL = 'http://localhost:8080'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // console.log(res);
    //这里后端传递一个code字段，当200时才是正常，其余都报
    //后端传少了code导致报错,直接返回值，所以加了空也返回res
    if (res.data.code === 200 || res.data.code == null) {
      return res
    }
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
