import request from '@/utils/request'

//获取所以考试数据
export const getExamListService = () => request.get('/exams')

// 获取分页考试数据
export const getPageExamListService = (currentPage, pageSize) => request.get(`/exams/${currentPage}/${pageSize}`)

// 通过examCode获取当个科目数据
export const getSubjectService = (examCode) => request.get(`/exam/${examCode}`)

// 通过pagerId获取当前科目题目信息
// export const getQuestionsService = (paperId) => request.get(`/paper/${paperId}`)
export const getQuestionsService = (paperId) => {
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
export const getAllScoreService = () => request.get('/scores')

//不分页查询单个学生成绩
export const getStudentScoreService = (studentId) => request.get(`/score/${studentId}`)

//分页查询学生成绩
export const getPageScoreService = (currentPage, pageSize, studentId) => request.get(`/score/${currentPage}/${pageSize}/${studentId}`)

//分页查询留言
export const getPageMsgService = (currentPage, pageSize) => request.get(`/messages/${currentPage}/${pageSize}`)

// 提交留言
export const subMsgService = (title,content,time) => request.post('/message', {title,content,time})

// 提交评论
export const subCommentService = (replay,replayTime,messageId) => request.post('/replay', {replay,replayTime,messageId})

//学生密码更新
export const updateStudentPWDService = (pwd,studentId) => request.put('/studentPWD', {pwd,studentId})

//提交考试成绩
export const subExamScoreService = (examCode,studentId,subject,etScore,answerDate) => request.post('/score', {examCode,studentId,subject,etScore,answerDate})

//查询学生信息
export const getStudentDtlService = (studentId) => request.get(`/student/${studentId}`)