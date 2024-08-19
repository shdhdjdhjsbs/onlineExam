<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { getSubjectService, getQuestionsService } from '@/api/students'
import router from '@/router'

const route = useRoute()
const subjectCode = route.query.subjectCode as string | undefined
const paperId = route.query.paperId as string | undefined

interface SubjectData {
  source?: string
  examDate?: string
  institute?: string
  type?: string
  totalTime?: number
}

interface Question {
  question: string
  score: number
}

const subjectDtl = ref<{ data?: { data?: SubjectData } }>({})
const Subjectdata = computed(() => subjectDtl.value?.data?.data || {})
const questionsData = ref<Record<number, Question[]>>({})
const selectQue = ref<Question[]>([])
const fillQue = ref<Question[]>([])
const judgeQue = ref<Question[]>([])

const SelectTotalScore = ref(0)
const fillTotalScore = ref(0)
const judgeTotalScore = ref(0)

onMounted(async () => {
  if (subjectCode && paperId) {
    subjectDtl.value = await getSubjectService(subjectCode)
    questionsData.value = await getQuestionsService(paperId) as Record<number, Question[]>

    selectQue.value = questionsData.value[1] || []
    fillQue.value = questionsData.value[2] || []
    judgeQue.value = questionsData.value[3] || []

    SelectTotalScore.value = selectQue.value.reduce((sum, item) => sum + item.score, 0)
    fillTotalScore.value = fillQue.value.reduce((sum, item) => sum + item.score, 0)
    judgeTotalScore.value = judgeQue.value.reduce((sum, item) => sum + item.score, 0)
  }
})

const activeNames = ref<string[]>(['1'])
const handleChange = (val: string[]) => {
  console.log(val)
}

const toAnswer = () => {
  console.log(subjectCode)
  router.push({
    path: '/answer',
    query: {
      subjectCode: subjectCode,
      paperId: paperId
    }
  })
}
</script>

<template>
  <keep-alive>
    <navigation></navigation>
  </keep-alive>
  <div class="examMsgBox center">
    <div class="top center">试卷列表/{{ Subjectdata.source }}</div>
    <div class="body">
      <div class="bodyTop">
        <div class="bodyTitle center" style="font-size: 1.7rem">{{ Subjectdata.source }}</div>
        <div class="bodyScore center">
          <div class="bodyScoreTitle center" style="border-radius: 5px;border-radius: 5px  0 0 5px">总分</div>
          <div class="bodyScoreTitle center"
            style="border: 1px solid rgb(53, 171, 255);box-sizing: border-box ;background-color: white;color: rgb(53, 171, 255);border-radius: 5px;border-radius: 0 5px 5px 0">
            {{
              SelectTotalScore + fillTotalScore + judgeTotalScore }}</div>
        </div>
      </div>
      <div class="bodyMid">
        <div class="midDtl">
          <div style="color: rgb(153, 153, 153);font-size: 0.9rem">更新于{{ Subjectdata.examDate }}</div>
          <div style="color: rgb(153, 153, 153);font-size: 0.9rem">来自 {{ Subjectdata.institute }}</div>
          <div
            style="color: rgb(153, 153, 153);border: 1px solid rgb(153, 153, 153);font-size: 0.9rem;border-radius: 5px ;padding: 7px">
            {{ subjectDtl.data?.data?.type }}</div>
        </div>
        <div class="midBtn center" @click="toAnswer()">开始答题</div>
      </div>
      <div class="bodyBot center">
        <div style="margin-left: 40px">考生需知</div>
      </div>
    </div>
    <div class="bottom ">
      <el-collapse v-model="activeNames" @change="handleChange">

        <el-collapse-item :title="Subjectdata.source" name="1">
          <template #title>
            {{ Subjectdata.source }}<el-icon class="header-icon">
              <info-filled />
            </el-icon>
            <div style="width: 45%;display: flex; justify-content: flex-end;color: rgb(64, 158, 255);font-weight: 600">
              {{
                SelectTotalScore + fillTotalScore + judgeTotalScore }}分/{{ subjectDtl.data?.data?.totalTime }}分钟</div>
          </template>
          <el-collapse-item :title="`选择题(共${selectQue.length}题,共${SelectTotalScore}计分)`" name="2">
            <div v-for="(item, index) in selectQue" key="item">
              {{ index + 1 }} 、 {{ item.question }}
            </div>
          </el-collapse-item>
          <el-collapse-item :title="`填空题(共${fillQue.length}题,共${fillTotalScore}计分)`" name="3">
            <div v-for="(item, index) in fillQue" key="item">
              {{ index + 1 }} 、 {{ item.question }}
            </div>
          </el-collapse-item>
          <el-collapse-item :title="`判断题(共${judgeQue.length}题,共${judgeTotalScore}计分)`" name="4">
            <div v-for="(item, index) in judgeQue" key="item">
              {{ index + 1 }} 、 {{ item.question }}
            </div>
          </el-collapse-item>
        </el-collapse-item>

      </el-collapse>
    </div>
  </div>
</template>
<style scoped>
::v-deep .el-collapse .el-collapse-item .el-collapse-item__header {
  margin-left: 40px;
  width: 92%;
  font-size: 1.2rem;
}

::v-deep .el-collapse-item__content div {
  margin-left: 20px;
  color: rgb(136, 148, 155);
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.examMsgBox {
  /* height: 82vh; */
  width: 100%;
  flex-wrap: wrap;
  background-color: rgb(238, 238, 238);
}

.top {
  height: 10vh;
  width: 45%;
}

.body {
  height: 39vh;
  width: 65%;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-wrap: wrap;
  border-radius: 10px;
}

.bodyTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bodyTitle {
  height: 10vh;
  width: 20%;
  justify-content: flex-start;
  margin-left: 40px;
}

.bodyScore {
  height: 10vh;
  width: 20%;
  display: flex;
  margin-right: 40px;
}

.bodyScoreTitle {
  height: 5vh;
  width: 50%;
  background-color: rgb(53, 171, 255);
  color: white;
}

.bodyMid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.midDtl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  width: 35%;
  margin-left: 40px;
}

.midBtn {
  height: 6vh;
  width: 12vh;
  background-color: rgb(53, 171, 255);
  border-radius: 5px;
  margin-right: 40px;
  color: white;
}

.bodyBot {
  height: 10vh;
  width: 100%;
  justify-content: flex-start;
  box-sizing: border-box;
  border-top: 1px solid rgb(238, 238, 238);
  box-shadow: 0 -4px 5px -2px rgba(217, 222, 234, 0.3);
}

.bottom {
  /* height: 30vh; */
  margin-top: 50px;
  margin-bottom: 50px;
  width: 65%;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
}
</style>