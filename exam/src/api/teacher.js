import request from '@/utils/request'

//提交修改后的考试信息
export const updateExamListService = (data) => request.put('/exam',data)

//增加考试信息
export const addExamListService = (data) => request.post('/exam',data)

//删除考试信息
export const deleteExamListService = (examCode) => request.delete(`/exam/${examCode}`)

//分页查询所有试卷信息
export const getPagingQuestionsService = (currentPage, pageSize) => request.get(`/answers/${currentPage}/${pageSize}`)

//增加选择题题库
export const addSelectQuestionsService = (data) => request.post('/MultiQuestion',data)

//增加填空题题库
export const addFillQuestionsService = (data) => request.post('/fillQuestion',data)

//增加判断题题库
export const addJudgeQuestionsService = (data) => request.post('/judgeQuestion',data)

//分页查询学生信息
export const getPagingStudentService = (currentPage, pageSize) => request.get(`/students/${currentPage}/${pageSize}`)

//获取单个科目所有人成绩
export const getSubjectAllScoreService = (examCode) => request.get(`/scores/${examCode}`)

//更新学生信息
export const updateStudentInfoService = (data) => request.put('/student',data)

//增加学生信息
export const addStudentInfoService = (data) => request.post('/student',data)

//删除学生信息
export const deleteStudentInfoService = (studentId) => request.delete(`/student/${studentId}`)

//分页获取所有老师信息
export const getPagingTeacherService = (currentPage, pageSize) => request.get(`/teachers/${currentPage}/${pageSize}`)

//更新教师信息
export const updateTeacherInfoService = (data) => request.put('/teacher',data)

//增加老师信息
export const addTeacherInfoService = (data) => request.post('/teacher',data)

//删除老师信息
export const deleteTeacherInfoService = (teacherId) => request.delete(`/teacher/${teacherId}`)