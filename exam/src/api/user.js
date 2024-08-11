import request from '@/utils/request'

// 用户登录
export const userLogin = ({username, password}) => request.post('/login',{username, password})