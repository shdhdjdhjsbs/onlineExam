import Login from '@/views/login/login.vue'
import Answer from '@/views/students/answer.vue'
import AnswerScore from '@/views/students/answerScore.vue'
import ExamMsg from '@/views/students/examMsg.vue'
import Students from '@/views/students/index.vue'
import Manager from '@/views/students/manager.vue'
import MsgBoard from '@/views/students/msgBoard.vue'
import MyScore from '@/views/students/myScore.vue'
import { useUserStore } from '@/stores/index.js'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Login },
    { path: '/students', component: Students},
    { path: '/examMsg', component: ExamMsg},
    { path: '/myScore', component: MyScore},
    { path: '/msgBoard', component: MsgBoard},
    { path: '/manager', component: Manager},
    { path: '/answer', component: Answer},
    { path: '/answerScore', component: AnswerScore}
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  console.log(userStore.studentId);
  if ((!userStore.studentId) && to.path !== '/') return '/'
})
export default router
