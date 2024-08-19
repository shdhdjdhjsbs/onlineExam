import request from '@/utils/request'
// 用户登录
export const userLogin = ({username,password}:{username:string,password:string}) => request.post('/login',{username, password})