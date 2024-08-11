import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('OnlineExam-User', () => {
  const adminId = ref('')
  const studentId = ref('')
  //后端没有返回token，用的id存储来确认
  const setUser = (userData) => {
    if (userData.adminId) {
      adminId.value = userData.adminId
      return
    }
    else if (userData.studentId) {
      studentId.value = userData.studentId;
      return
    }
  }
  const resetUser = () => {
    adminId.value = ''
    studentId.value = ''
  }

  return { adminId, studentId, setUser, resetUser }
}, { persist: true })
