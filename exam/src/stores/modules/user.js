import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('OnlineExam-User', () => {
  const teacherId = ref('')
  const studentId = ref('')
  //后端没有返回token，用的id存储来确认
  const setUser = (userData) => {
    if (userData.teacherId) {
      teacherId.value = userData.teacherId
      return
    }
    else if (userData.studentId) {
      studentId.value = userData.studentId;
      return
    }
  }
  const resetUser = () => {
    teacherId.value = ''
    studentId.value = ''
  }

  return { teacherId, studentId, setUser, resetUser }
}, { persist: true })
