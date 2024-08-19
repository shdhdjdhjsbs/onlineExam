import request from '@/utils/request';

// 定义接口
interface ExamData {
  source: string;
  description: string;
  institute: string;
  major: string;
  grade: string;
  examDate: string;
  totalTime: string;
  totalScore: string;
  type: string;
  tips: string;
  examCode?: number;
  paperId: number | undefined;  // 新增属性
  term?: string;     // 新增属性
}

interface StudentData {
  studentId: number | undefined;
  studentName: string;
}

interface TeacherData {
  teacherId: number | undefined;
  teacherName: string;
  // 其他教师数据字段...
}

interface QuestionData {
  questionId: number;
  content: string;
  // 其他题目数据字段...
}

// 提交修改后的考试信息
export const updateExamListService = (data: ExamData) => request.put('/exam', data);

// 增加考试信息
export const addExamListService = (data: ExamData) => request.post('/exam', data);

// 删除考试信息
export const deleteExamListService = (examCode: string | number) => request.delete(`/exam/${examCode}`);

// 分页查询所有试卷信息
export const getPagingQuestionsService = (currentPage: number, pageSize: number) => request.get(`/answers/${currentPage}/${pageSize}`);

// 增加选择题题库
export const addSelectQuestionsService = (data: QuestionData) => request.post('/MultiQuestion', data);

// 增加填空题题库
export const addFillQuestionsService = (data: QuestionData) => request.post('/fillQuestion', data);

// 增加判断题题库
export const addJudgeQuestionsService = (data: QuestionData) => request.post('/judgeQuestion', data);

// 分页查询学生信息
export const getPagingStudentService = (currentPage: number, pageSize: number) => request.get(`/students/${currentPage}/${pageSize}`);

// 获取单个科目所有人成绩
export const getSubjectAllScoreService = (examCode: string) => request.get(`/scores/${examCode}`);

// 更新学生信息
export const updateStudentInfoService = (data: StudentData) => request.put('/student', data);

// 增加学生信息
export const addStudentInfoService = (data: StudentData) => request.post('/student', data);

// 删除学生信息
export const deleteStudentInfoService = (studentId: number) => request.delete(`/student/${studentId}`);

// 分页获取所有老师信息
export const getPagingTeacherService = (currentPage: number, pageSize: number) => request.get(`/teachers/${currentPage}/${pageSize}`);

// 更新教师信息
export const updateTeacherInfoService = (data: TeacherData) => request.put('/teacher', data);

// 增加老师信息
export const addTeacherInfoService = (data: TeacherData) => request.post('/teacher', data);

// 删除老师信息
export const deleteTeacherInfoService = (teacherId: number) => request.delete(`/teacher/${teacherId}`);
