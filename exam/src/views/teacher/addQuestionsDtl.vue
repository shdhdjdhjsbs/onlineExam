<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { addSelectQuestionsService, addFillQuestionsService, addJudgeQuestionsService } from '@/api/teacher'
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

interface SelectQuestion {
  subject: string;
  level: string;
  rightAnswer: string;
  section: string;
  question: string;
  analysis: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  questionId: number;
  content: string;
}

interface FillQuestion {
  subject: string;
  level: string;
  answer: string;
  section: string;
  question: string;
  analysis: string;
  questionId: number;
  content: string;
}

interface JudgeQuestion {
  subject: string;
  level: string;
  answer: string;
  section: string;
  question: string;
  analysis: string;
  questionId: number;
  content: string;
}

const typevalue = ref('选择题')
const selectQue = [
  {
    value: '选择题',
    label: '选择题'
  },
  {
    value: '填空题',
    label: '填空题'
  },
  {
    value: '判断题',
    label: '判断题'
  }
]
const difficulty = [ //试题难度
  {
    value: '简单',
    label: '简单'
  },
  {
    value: '一般',
    label: '一般'
  },
  {
    value: '困难',
    label: '困难'
  }
]
const levels = [ //难度等级
  {
    value: '1',
    label: '1'
  },
  {
    value: '2',
    label: '2'
  },
  {
    value: '3',
    label: '3'
  },
  {
    value: '4',
    label: '4'
  },
  {
    value: '5',
    label: '5'
  },
]
const rights = [ //正确答案
  {
    value: 'A',
    label: 'A'
  },
  {
    value: 'B',
    label: 'B'
  },
  {
    value: 'C',
    label: 'C'
  },
  {
    value: 'D',
    label: 'D'
  },
]

const postSelect = ref<SelectQuestion>({ //选择题提交内容
  subject: '', //试卷名称
  level: '', //难度等级选中值 
  rightAnswer: '', //正确答案选中值
  section: '', //对应章节
  question: '', //题目
  analysis: '', //解析
  answerA: '',
  answerB: '',
  answerC: '',
  answerD: '',
  questionId: 0,
  content: ''
})
const postFill = ref<FillQuestion>({ //填空题提交内容
  subject: '', //试卷名称
  level: '', //难度等级选中值 
  answer: '', //正确答案
  section: '', //对应章节
  question: '', //题目
  analysis: '', //解析
  questionId: 0,
  content: ''
})
const postJudge = ref<JudgeQuestion>({ //判断题提交内容
  subject: '', //试卷名称
  level: '', //难度等级选中值 
  answer: '', //正确答案
  section: '', //对应章节
  question: '', //题目
  analysis: '', //解析
  questionId: 0,
  content: ''
})
const route = useRoute()
onMounted(() => {
  postSelect.value.subject = route.query.subject as string //获取试卷名称
  postFill.value.subject = route.query.subject as string
  postJudge.value.subject = route.query.subject as string
})

const subSelect = async () => {
  console.log(postSelect.value);
  const res = await addSelectQuestionsService(postSelect.value)
  if (res.data.code == 200) {
    postSelect.value = {
      questionId: 0,
      subject: '',
      level: '',
      rightAnswer: '',
      section: '',
      question: '',
      analysis: '',
      answerA: '',
      answerB: '',
      answerC: '',
      answerD: '',
      content: ''
    }
    return ElMessage.success('选择题添加成功')
  }
  ElMessage.error('选择题添加失败')
}
const subFill = async () => {
  const res = await addFillQuestionsService(postFill.value)
  console.log(res);
  if (res.data.code == 200) {
    postJudge.value = {
      subject: '',
      level: '',
      answer: '',
      section: '',
      question: '',
      analysis: '',
      questionId: 0,
      content: ''
    }
    return ElMessage.success('填空题添加成功')
  }
  ElMessage.error('填空题添加失败')
}
const subJudge = async () => {
  const res = await addJudgeQuestionsService(postJudge.value)
  if (res.data.code == 200) {
    postJudge.value = {
      subject: '',
      level: '',
      answer: '',
      section: '',
      question: '',
      analysis: '',
      questionId: 0,
      content: ''
    }
    return ElMessage.success('判断题添加成功')
  }
  ElMessage.error('判断题添加失败')
}
</script>
<template>
  <div class="addQuestionsBox">
    <div class="title center">添加试题
    </div>
    <!-- 选择题 -->
    <div class="questionsBody" v-if="typevalue == '选择题'">
      <div class="Top">
        <div class="center">题目类型：<el-select v-model="typevalue" size="large" style="width: 200px;margin-right: 20px;">
            <el-option v-for="item in selectQue" :key="item.value" size="large" :label="item.label"
              :value="item.value" />
          </el-select></div>
        <div class="center">所属章节：<el-input v-model="postSelect.section" style="width: 200px;margin-right: 20px;"
            placeholder="请输入所属章节" /></div>
        <div class="center">难度等级：<el-select v-model="postSelect.level" placeholder="请选择难度等级" size="large"
            style="width: 200px">
            <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select></div>
        <div class="center" style="margin-left: 20px;">正确选项：<el-select v-model="postSelect.rightAnswer"
            placeholder="请选择正确选项" size="large" style="width: 200px;">
            <el-option v-for="item in rights" :key="item.value" :label="item.label" :value="item.value" />
          </el-select></div>
      </div>
      <div class="body center">
        <el-input v-model="postSelect.question" style="width: 73vw;margin-top: 20px" :rows="4" type="textarea"
          placeholder="请输入题目内容" />
        <div class="select">
          <div class="letter center">A</div>
          <el-input v-model="postSelect.answerA" style="width: 69vw" placeholder="请输入选项A的内容" />
        </div>
        <div class="select">
          <div class="letter center">B</div>
          <el-input v-model="postSelect.answerB" style="width: 69vw" placeholder="请输入选项B的内容" />
        </div>
        <div class="select">
          <div class="letter center">C</div>
          <el-input v-model="postSelect.answerC" style="width: 69vw" placeholder="请输入选项C的内容" />
        </div>
        <div class="select">
          <div class="letter center">D</div>
          <el-input v-model="postSelect.answerD" style="width: 69vw" placeholder="请输入选项D的内容" />
        </div>
        <el-input v-model="postSelect.analysis" style="width: 73vw;margin-top: 20px;" :rows="4" type="textarea"
          placeholder="请输入题目解析" />
        <div class="subBtn center" @click="subSelect">立即添加</div>
      </div>
    </div>
    <!-- 填空题 -->
    <div class="questionsBody" v-if="typevalue == '填空题'">
      <div class="Top">
        <div class="center">题目类型：<el-select v-model="typevalue" size="large" style="width: 200px;margin-right: 20px;">
            <el-option v-for="item in selectQue" :key="item.value" size="large" :label="item.label"
              :value="item.value" />
          </el-select></div>
        <div class="center">所属章节：<el-input v-model="postFill.section" style="width: 200px;margin-right: 20px;"
            placeholder="请输入所属章节" /></div>
        <div class="center">难度等级：<el-select v-model="postFill.level" placeholder="请选择难度等级" size="large"
            style="width: 200px">
            <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select></div>
      </div>
      <div class="body center">
        <el-input v-model="postFill.question" style="width: 73vw;margin-top: 20px" :rows="4" type="textarea"
          placeholder="请输入题目内容" />
        <el-input v-model="postFill.answer" style="width: 73vw;margin-top: 20px;" placeholder="填空题答案" />
        <el-input v-model="postFill.analysis" style="width: 73vw;margin-top: 20px;" :rows="4" type="textarea"
          placeholder="请输入题目解析" />
        <div class="subBtn center" @click="subFill">立即添加</div>
      </div>
    </div>
    <!-- 判断题 -->
    <div class="questionsBody" v-if="typevalue == '判断题'">
      <div class="Top">
        <div class="center">题目类型：<el-select v-model="typevalue" size="large" style="width: 200px;margin-right: 20px;">
            <el-option v-for="item in selectQue" :key="item.value" size="large" :label="item.label"
              :value="item.value" />
          </el-select></div>
        <div class="center">所属章节：<el-input v-model="postJudge.section" style="width: 200px;margin-right: 20px;"
            placeholder="请输入所属章节" /></div>
        <div class="center">难度等级：<el-select v-model="postJudge.level" placeholder="请选择难度等级" size="large"
            style="width: 200px">
            <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select></div>
      </div>
      <div class="body center">
        <el-input v-model="postJudge.question" style="width: 73vw;margin-top: 20px" :rows="4" type="textarea"
          placeholder="请输入题目内容" />
        <el-radio-group v-model="postJudge.answer" style="margin-top: 20px;">
          <el-radio value="1" size="large">正确</el-radio>
          <el-radio value="2" size="large">错误</el-radio>
        </el-radio-group>
        <el-input v-model="postJudge.analysis" style="width: 73vw;margin-top: 20px;" :rows="4" type="textarea"
          placeholder="请输入题目解析" />
        <div class="subBtn center" @click="subJudge">立即添加</div>
      </div>
    </div>

  </div>
</template>
<style scoped>
.Top .el-input {
  height: 40px;
}

.body .el-input {
  height: 40px;
}

.addQuestionsBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  height: 10vh;
  width: 95%;
  justify-content: space-between;
}

.questionsBody {
  height: 65vh;
  width: 96%;
  flex-direction: column;
}

.Top {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.body {
  flex-direction: column;
}

.select {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}

.letter {
  height: 40px;
  width: 40px;
  background-color: rgb(53, 171, 255);
  margin-right: 1vw;
}

.subBtn {
  height: 40px;
  width: 80px;
  border-radius: 10px;
  background-color: rgb(53, 171, 255);
  margin-top: 20px;
}
</style>