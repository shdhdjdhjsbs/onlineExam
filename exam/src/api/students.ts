import request from '@/utils/request'

// 定义单个考试信息的类型
interface Exam {
  description: string;
  examCode: string;
  examDate: string;
  grade: string;
  institute: string;
  major: string;
  paperId: string;
  source: string;
  term: string;
  tips: string;
  totalScore: number;
  totalTime: number;
  type: string;
}

// 定义 获取所有考试数据API 返回的数据结构类型
interface ExamListResponse {
  code: number;
  data: Exam[];
}


interface Score {
  examCode: string;
  studentId: string;
  subject: string;
  etScore: number;
  answerDate: string;
}

//获取所有考试数据
export const getExamListService = () => request.get<ExamListResponse>('/exams')

// 获取分页课程考试数据
export const getPageExamListService = (currentPage: number, pageSize:number) => request.get(`/exams/${currentPage}/${pageSize}`)

// 通过examCode获取当个科目数据
export const getSubjectService = (examCode: string) => request.get(`/exam/${examCode}`)

interface QuestionsData {
  [key: number]: any[];
}
// 通过pagerId获取当前科目题目信息
// export const getQuestionsService = (paperId) => request.get(`/paper/${paperId}`)
export const getQuestionsService = (paperId: string): Promise<QuestionsData> => {
  return new Promise((resolve, reject) => {
    request.get(`/paper/${paperId}`)
      .then(response => {
        // 假设你对 response 进行了一些处理
        resolve(response.data); // 成功时调用 resolve
      })
      .catch(error => {
        reject(error); // 失败时调用 reject
      });
  });
};

// 查询所有学生成绩
export const getAllScoreService = () => request.get<Score[]>('/scores')

//不分页查询单个学生成绩
export const getStudentScoreService = (studentId: string) => request.get(`/score/${studentId}`)

//分页查询学生成绩
export const getPageScoreService = (currentPage: number, pageSize: number, studentId: string) => request.get(`/score/${currentPage}/${pageSize}/${studentId}`)

//分页查询留言
export const getPageMsgService = (currentPage: number, pageSize: number) => request.get(`/messages/${currentPage}/${pageSize}`)

// 提交留言
export const subMsgService = (title: string,content: string,time:string) => request.post('/message', {title,content,time})

// 提交评论
export const subCommentService = (replay:string,replayTime:string,messageId:string) => request.post('/replay', {replay,replayTime,messageId})

//学生密码更新
export const updateStudentPWDService = (pwd:string,studentId:string) => request.put('/studentPWD', {pwd,studentId})

//提交考试成绩
export const subExamScoreService = (examCode:string,studentId:string,subject:string,etScore:number,answerDate:string) => request.post('/score', {examCode,studentId,subject,etScore,answerDate})

//查询学生信息
export const getStudentDtlService = (studentId:string) => request.get(`/student/${studentId}`)