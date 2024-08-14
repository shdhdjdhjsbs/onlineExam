<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue'
import { getSubjectService, getStudentDtlService } from '@/api/students';
import { useUserStore } from '@/stores/index.js';
const route = useRoute();
const userStore = useUserStore();
const totalScore = route.query.totalScore
// const totalScore = 90
const startTime = route.query.startTime
const endTime = route.query.endTime
const subjectCode = route.query.subjectCode
const isTransition = ref(false)
const subjetData = ref({});
// 使用 computed 解构出最内层的 data
const Subjectdata = computed(() => subjetData.value?.data?.data || []);
const userData = ref({});
const UserData = computed(() => userData.value?.data?.data || []);
onMounted(async () => {
    let timer = setTimeout(() => {
        isTransition.value = true
        clearInterval(timer)
      },1000)
    subjetData.value = await getSubjectService(subjectCode)
    userData.value = await getStudentDtlService(userStore.studentId)
    console.log(Subjectdata.value, UserData.value);
})
</script>
<template>
    <keep-alive>
        <navigation></navigation>
    </keep-alive>
    <div class="answerScoreBox">
        <div class="title center">{{ Subjectdata.source }}-总分{{ Subjectdata.totalScore }}分，限时{{ Subjectdata.totalTime
            }}分钟</div>
        <div class="main">
            <div class="Top center" style="font-size: 2rem;color: rgb(5, 151, 255);">姓名：{{ UserData.studentName }}</div>
            <div class="body">
                <div class="center meme" :class="{'meme1': totalScore < 60,'meme3': totalScore>=60 && totalScore < 80,'meme5': totalScore>=80 && totalScore <= 100}" style="height: 25vh;width: 25vh;background-size: cover; background-position: center;"></div>
                <div class="number" :class="{ 'border': isTransition }">
                    <div>{{ totalScore }}</div>
                    <div>分数</div>
                </div>
                <div class="center meme" :class="{'meme2': totalScore < 60,'meme4': totalScore>=60 && totalScore < 80,'meme6': totalScore>=80 && totalScore <= 100}" style="height: 25vh;width: 25vh;background-size: cover; background-position: center;"></div>
            </div>
            <div class="bottom">
                <div class="start">
                    <div class="start1 center">考试开始时间:</div>
                    <div class="start1 center">{{ startTime }}</div>
                </div>
                <div class="start">
                    <div class="start1 center">考试结束时间:</div>
                    <div class="start1 center">{{ endTime }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.answerScoreBox {
    width: 100%;
    height: 92vh;
    background-color: rgb(238, 238, 238);
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.title {
    width: 100%;
    height: 6vh;
    color: rgb(5, 151, 255);
}

.main {
    border-radius: 10px;
    display: flex;
    height: 81vh;
    width: 65%;
    background-color: rgb(255, 255, 255);
    /* flex-wrap: wrap; */
    margin-bottom: 10vh;
    flex-direction: column;
    /* justify-content: space-between; */
    align-items: center;
}

.Top {
    height: 15vh;
    width: 100%;
}

.body {
    height: 46vh;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.number {
      opacity: 0;
      border: 6px solid #fff;
      transform: rotate(0deg);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 25vh;
      height: 25vh;
      border-radius: 50%;
      transition: all 1s ease;
}
.border {
  border: 6px solid #36aafd !important;
  transition: all 2s ease;
  width: 160px !important;
  height: 160px !important;
  transform: rotate(360deg) !important;
  opacity: 1 !important;
}
.meme {
    animation: fadeInZoom 1s ease-out forwards;
}
@keyframes fadeInZoom {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
.meme1 {
    background-image: url(../../assets/loseFace.jpeg);
}
.meme2 {
    background-image: url(../../assets/accept.jpeg);
}
.meme3 {
    background-image: url(../../assets/praise.jpeg);
}
.meme4 {
    background-image: url(../../assets/emmm.jpeg);
}
.meme5 {
    background-image: url(../../assets/yyds.jpeg);
}
.meme6 {
    background-image: url(../../assets/nb.jpeg);
}

.start {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 7vh;
}
.start1 {
    width: 30vh;
    height: 7vh;
    color: rgb(5, 151, 255);
    font-size: 1.4rem;
}
</style>