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
import Layout from '@/views/layout/layout.vue'
import ExamQuery from '@/views/teacher/examQuery.vue'
import QuestionsQuery from '@/views/teacher/questionsQuery.vue'
import AddQuestions from '@/views/teacher/addQuestions.vue'
import ScoreColumnQuery from '@/views/teacher/scoreColumnQuery.vue'
import ScorePieQuery from '@/views/teacher/scorePieQuery.vue'
import StudentManage from '@/views/teacher/studentManage.vue'
import TeacherManage from '@/views/teacher/teacherManage.vue'
import AddQuestionsDtl from '@/views/teacher/addQuestionsDtl.vue'
import Column from '@/views/echarts/column.vue'
import Pie from '@/views/echarts/pie.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: Login },
    { path: '/students', component: Students },
    { path: '/examMsg', component: ExamMsg },
    { path: '/myScore', component: MyScore },
    { path: '/msgBoard', component: MsgBoard },
    { path: '/manager', component: Manager },
    { path: '/answer', component: Answer },
    { path: '/answerScore', component: AnswerScore },
    {
      path: '/', component: Layout, redirect: '/teacher/examQuery', children: [
        { path: '/teacher/examQuery', component: ExamQuery },
        { path: '/teacher/questionsQuery', component: QuestionsQuery },
        { path: '/teacher/addquestions', component: AddQuestions },
        { path: '/teacher/addquestionsDtl', component: AddQuestionsDtl },
        { path: '/teacher/scoreColumnQuery', component: ScoreColumnQuery },
        { path: '/teacher/studentScore', component: Column },
        { path: '/teacher/subjectScore', component: Pie },
        { path: '/teacher/scorePieQuery', component: ScorePieQuery },
        { path: '/teacher/studentManage', component: StudentManage },
        { path: '/teacher/teacherManage', component: TeacherManage },
      ]
    }
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  // 学生端路由判断
  const studentRoutes = ['/students', '/examMsg', '/myScore', '/msgBoard', '/manager', '/answer', '/answerScore']
  if (studentRoutes.includes(to.path) && !userStore.studentId) {
    return '/login'
  }

  // 教师端路由判断
  const teacherRoutes = to.path.startsWith('/teacher')
  if (teacherRoutes && !userStore.teacherId) {
    return '/login'
  }

  return true
})
export default router
