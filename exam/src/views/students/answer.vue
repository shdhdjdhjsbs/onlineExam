<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref, computed, watch } from 'vue';
import { getSubjectService, getQuestionsService, subExamScoreService } from '@/api/students';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/index.js';
import router from '@/router';

const userStore = useUserStore();
const route = useRoute();
const subjectCode = route.query.subjectCode;
const paperId = route.query.paperId
const radio = ref(0)

const matches = ref([])
const flag = ref(true)
const subjetData = ref({}); // 确保 subjetData 初始为一个对象
// 使用 computed 解构出最内层的 data
const Subjectdata = computed(() => subjetData.value?.data?.data || []);
// 当前做的题
const currentQuestionIndex = ref(0)
// 选择题
const selectQue = ref([])
//填空题
const fillQue = ref([])
//判断题
const judgeQue = ref([])
//考试题库数据
const questionsData = ref({});
// 存储作答记录的对象
const answers = ref({});
const fillAnswer = ref([]); // 初始化为空数组

let timer = setInterval(() => {
    Subjectdata.value.totalTime = Subjectdata.value.totalTime - 1
    console.log(Subjectdata.value.totalTime);
    if (Subjectdata.value.totalTime == 10) {
        ElMessage({
            showClose: true,
            type: 'error',
            message: '考生注意,考试时间还剩10分钟！！！'
        })
    }
    else if (Subjectdata.value.totalTime == 0) {
        ElMessage.warning('考试时间已到,强制交卷。')
        subExamSevice()
        clearInterval(timer)
    }
}, 60 * 1000)

//选择判断题单选更新
const updateAnswer = (index, selectedOption) => {
    // const currentQuestion = selectQue.value[index];
    // console.log(currentQuestion);
    answers.value[index] = selectedOption;
    console.log(answers.value); // 输出作答记录
}
// 动态题目,区别选择填空判断
const title = computed(() => {
    const index = currentQuestionIndex.value;
    const selectLength = questionsData.value[1]?.length || 0;
    const fillLength = questionsData.value[2]?.length || 0;
    const judgeLength = questionsData.value[3]?.length || 0;
    if (index < selectLength) return '请选择正确的选项';
    else if (index >= selectLength && index < selectLength + fillLength) return '请在横线处填写答案';
    else if (index >= selectLength + fillLength && index < selectLength + fillLength + judgeLength) return '请作出正确判断';
});

const prev = () => {
    if (currentQuestionIndex.value < 0) return

    console.log(currentQuestionIndex.value);
    currentQuestionIndex.value = currentQuestionIndex.value - 1
}
const next = () => {
    console.log(questionsData.value[1]);
    if (currentQuestionIndex.value >= questionsData.value[1]?.length + questionsData.value[2]?.length + questionsData.value[3]?.length) return
    currentQuestionIndex.value = currentQuestionIndex.value + 1
}

// 填空题更新
const updateFillAnswer = () => {
    //填空题当前索引
    const currentIndex = currentQuestionIndex.value - selectQue.value.length;
    if (!fillAnswer.value[currentIndex]) {
        fillAnswer.value[currentIndex] = [];
    }
    //让数组的长度匹配括号的数量
    if (matches.value.length > fillAnswer.value[currentIndex].length) {
        fillAnswer.value[currentIndex] = [...fillAnswer.value[currentIndex], ...new Array(matches.value.length - fillAnswer.value[currentIndex].length)];
    }
};
//判断有几个填空题来进行渲染
function countBlanks(questionText) {
    const regex = /\(\)/g; // 匹配 () 的正则表达式
    matches.value = questionText.match(regex);
    console.log(matches.value);
    return matches ? matches.length : 0;
}
// 使用 watch 监听 currentQuestionIndex 的变化
watch(currentQuestionIndex, (newIndex) => {
    matches.value = []
    if (newIndex >= selectQue.value?.length && newIndex < selectQue.value?.length + fillQue.value?.length) {
        countBlanks(fillQue.value[newIndex - selectQue.value?.length]?.question)
        updateFillAnswer();
    }
});


watch(fillAnswer, () => {
    const currentIndex = currentQuestionIndex.value - selectQue.value.length;

    if (currentIndex >= 0 && fillAnswer.value[currentIndex]) {
        // 判断是否所有输入框都有值
        if (fillAnswer.value[currentIndex].every(answer => answer !== undefined && answer !== '')) {
            // 标记为已答
            fillAnswer.value[currentIndex].answered = true;
        } else {
            // 取消已答标记
            fillAnswer.value[currentIndex].answered = false;
        }
    }
}, { deep: true });

// 计算成绩
const totalScore = () => {
    // 计算选择题的成绩
    let totalScore = 0;
    selectQue.value.forEach((question, index) => {
        const selectedOption = answers.value[index]; //获取用户选择的选项1,2,3,4
        const correctAnswer = question.rightAnswer;  //获取题目的正确答案。
        if (selectedOption && correctAnswer) {  //检查用户选择和正确答案是否存在
            if (['A', 'B', 'C', 'D'][selectedOption - 1] === correctAnswer) {
                totalScore += parseInt(question.score, 10);
            }
        }
    });
    // // // 计算填空题的成绩
    fillQue.value.forEach((question, index) => {
        const userAnswers = fillAnswer.value[index];  //获取用户的填空答案
        const correctAnswer = question.answer.split(' '); //将正确答案按空格分隔成数组
        let isCorrect = true;
        // 检查 userAnswers 是否为 undefined,若为undefined可能导致直接判断正确得分
        if (userAnswers === undefined) {
            isCorrect = false;
        } else {
            // 遍历所有填空项，判断是否全部正确
            if (Array.isArray(correctAnswer) && Array.isArray(userAnswers)) { //检查正确答案和用户答案是否都是数组。
                correctAnswer.forEach((answer, idx) => {
                    console.log(`Checking answer ${idx}:`, { userAnswer: userAnswers[idx], correctAnswer: answer });
                    if (userAnswers[idx] !== undefined && userAnswers[idx] !== answer) {
                        isCorrect = false;
                    }
                });
            }
        }
        if (isCorrect) {
            totalScore += parseInt(question.score, 10);
        }
    });
    // 计算判断题的成绩
    judgeQue.value.forEach((question, index) => {
        const questionIndex = selectQue.value.length + fillQue.value.length + index;
        const selectedOption = answers.value[questionIndex];
        const correctAnswer = question.answer;
        if (selectedOption && correctAnswer) {
            const isCorrect = (selectedOption === 1 && correctAnswer === 'T') || (selectedOption === 2 && correctAnswer === 'F');
            if (isCorrect) {
                totalScore += parseInt(question.score, 10);
            }
        }
    });
    console.log(totalScore);
    return totalScore;
}

//日期格式化
const getCurrentAllDate = () => {
    const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以需要加 1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// 截取前面的 YYYY-MM-DD 部分
const getCurrentDate = () => {
    const dateTime = getCurrentAllDate();
  return dateTime.split(' ')[0]; 
}

//提交试卷
const subExamSevice = async () => {
    const totalScore1 = totalScore()
        const res = await subExamScoreService(subjectCode,userStore.studentId,Subjectdata.value.source,totalScore1,getCurrentDate())
        if (res.data.code === 200) {
            router.push({path:'/answerScore',query:{
            totalScore:totalScore1,
            startTime:startTime.value,
            endTime: getCurrentAllDate(),
            subjectCode
        }})
        }
         ElMessage.error(res.data.message)
}

const startTime =ref('')
const subExam = () => {
    ElMessageBox.confirm(
        '您确定要提交试卷吗?',
        'Warning',
        {
            confirmButtonText: '确定交卷',
            cancelButtonText: '再检查一下',
            type: 'warning',
        }
    ).then(() => {
        subExamSevice()
    })
}

onMounted(async () => {
    subjetData.value = await getSubjectService(subjectCode);
    questionsData.value = await getQuestionsService(paperId)
    startTime.value = getCurrentAllDate()
    getCurrentDate()
    console.log(getCurrentAllDate(),getCurrentDate());
    selectQue.value = questionsData.value[1]
    fillQue.value = questionsData.value[2]
    judgeQue.value = questionsData.value[3]
    countBlanks(fillQue.value[0].question)
    console.log(Subjectdata.value, selectQue.value, userStore.studentId, fillQue.value, judgeQue.value);
});
</script>
<template>
    <div class="ansBox center">
        <div class="title center"><el-icon @click="flag = !flag">
                <Fold />
            </el-icon>{{ Subjectdata.type }}-{{ Subjectdata.source }}</div>
        <div class="body center">
            <transition name="left">
                <div class="left center" v-if="flag">
                    <div class="leftTop center">
                        <div class="sign">
                            <div class="signShape" style="border-color: rgb(255, 149, 174);"></div>
                            <div class="signTitle center">当前</div>
                        </div>
                        <div class="sign">
                            <div class="signShape"></div>
                            <div class="signTitle center">未答</div>
                        </div>
                        <div class="sign">
                            <div class="signShape" style="background-color: rgb(53, 171, 255);"></div>
                            <div class="signTitle center">已答</div>
                        </div>
                    </div>
                    <div class="leftBody center">
                        <div class="questionsTitle">选择题</div>
                        <div class="questions">
                            <div class="signShape center" @click="currentQuestionIndex = index"
                                :class="{ 'signShape1': currentQuestionIndex === index, 'signShape2': answers[index] }"
                                v-for="(item, index) in questionsData[1]" key="item">{{ index + 1 }}</div>
                        </div>
                        <div class="questionsTitle">填空题</div>
                        <div class="questions">
                            <div class="signShape center"
                                @click="currentQuestionIndex = questionsData[1]?.length + index"
                                :class="{ 'signShape1': currentQuestionIndex === questionsData[1]?.length + index, 'signShape2': fillAnswer[index]?.answered }"
                                v-for="(item, index) in questionsData[2]" key="item">{{ index + 1 }}</div>
                        </div>
                        <div class="questionsTitle">判断题</div>
                        <div class="questions">
                            <div class="signShape center"
                                @click="currentQuestionIndex = questionsData[1]?.length + questionsData[2]?.length + index"
                                :class="{ 'signShape1': currentQuestionIndex === questionsData[1]?.length + questionsData[2]?.length + index, 'signShape2': answers[questionsData[1]?.length + questionsData[2]?.length + index] }"
                                v-for="(item, index) in questionsData[3]" key="item">{{ index + 1 }}</div>
                        </div>
                        <div class="endExamBtn center" @click="subExam">结束考试</div>
                    </div>
                </div>
            </transition>

            <div class="right center">
                <div class="rightTop">
                    <div style="width: 20%;color: rgb(53, 171, 255);">{{ title }}</div>
                    <div style="width: 30%;display: flex;">
                        <div class="center" style="width: 50%;color: rgb(53, 171, 255);"><el-icon>
                                <Tickets />
                            </el-icon>全卷共{{ questionsData[1]?.length + questionsData[2]?.length
                                + questionsData[3]?.length }}题</div>
                        <div class="center" style="color: rgb(53, 171, 255);"><el-icon>
                                <Timer />
                            </el-icon>倒计时:{{ Subjectdata.totalTime !== undefined ? Subjectdata.totalTime : '加载中...' }}分钟
                        </div>
                    </div>
                </div>
                <div class="rightBody">
                    <div class="selectQue center" v-if="currentQuestionIndex < questionsData[1]?.length ? true : false">
                        <div style="width: 100%;margin: 30px 0 12px 60px;">{{ currentQuestionIndex + 1 }}：{{
                            selectQue[currentQuestionIndex]?.question }}</div>
                        <div style="width: 100%;display: flex;justify-content: start;padding-left: 60px;">
                            <el-radio-group v-model="radio" @change="updateAnswer(currentQuestionIndex, radio)">
                                <el-radio :value="1">{{ selectQue[currentQuestionIndex]?.answerA }}</el-radio>
                                <el-radio :value="2">{{ selectQue[currentQuestionIndex]?.answerB }}</el-radio>
                                <el-radio :value="3">{{ selectQue[currentQuestionIndex]?.answerB }}</el-radio>
                                <el-radio :value="4">{{ selectQue[currentQuestionIndex]?.answerB }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="fillQue center"
                        v-if="currentQuestionIndex >= questionsData[1]?.length && currentQuestionIndex < questionsData[1]?.length + questionsData[2]?.length ? true : false">
                        <div style="width: 100%;margin: 30px 0 12px 60px;">{{ currentQuestionIndex + 1 }}：{{
                            fillQue[currentQuestionIndex - selectQue?.length]?.question }}</div>
                        <div v-for="(item, index) in matches"
                            style="width: 100%;display: flex;align-items: center;justify-content: start;padding-left: 60px;">
                            {{ index + 1 }}:<el-input
                                v-model="fillAnswer[currentQuestionIndex - selectQue?.length][index]"
                                style="width: 200px;height: 40px;margin: 10px 0 5px 8px;" placeholder="请填在此处">
                            </el-input>
                        </div>
                    </div>
                    <div class="selectQue center"
                        v-if="currentQuestionIndex >= questionsData[1]?.length + questionsData[2]?.length ? true : false">
                        <div style="width: 100%;margin: 30px 0 12px 60px;">{{ currentQuestionIndex + 1 }}：{{
                            judgeQue[currentQuestionIndex - selectQue?.length - fillQue?.length]?.question }}</div>
                        <div style="width: 100%;display: flex;justify-content: start;padding-left: 60px;">
                            <el-radio-group v-model="radio" @change="updateAnswer(currentQuestionIndex, radio)">
                                <el-radio :value="1">正确</el-radio>
                                <el-radio :value="2">错误</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
                <div class="rightBOttom">
                    <div style="width: 17%;height: 100%;" class="center" @click="prev"><el-icon>
                            <ArrowLeft />
                        </el-icon>上一题</div>
                    <div style="width: 17%;height: 100%;" class="center" @click="next"><el-icon>
                            <ArrowRight />
                        </el-icon>下一题</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
::v-deep .el-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

::v-deep .el-radio-group .el-radio {
    margin: 0;
}

::v-deep .el-radio-group .el-radio .el-radio__label {
    width: 100%;
}

.left-enter-active,
.left-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.left-enter,
.left-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.ansBox {
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
}

.title {
    height: 62px;
    width: 100%;
    background-color: rgb(53, 171, 255);
    justify-content: flex-start;
    padding-left: 60px;
    color: white;
    font-size: 1.5rem;
}

.body {
    height: 670px;
    width: 100%;
    background-color: rgb(238, 238, 238);
    justify-content: space-around;
}

.left {
    height: 650px;
    background-color: rgb(238, 238, 238);
    width: 18%;
    flex-wrap: wrap;
    min-width: 273px;
    flex-direction: column;
    justify-content: space-around;
}

.right {
    height: 650px;
    background-color: rgb(238, 238, 238);
    width: 80%;
    border-radius: 10px;
    flex-direction: column;
    justify-content: space-around;
}

.leftTop {
    height: 75px;
    width: 93%;
    background-color: white;
    border-radius: 5px;
    justify-content: space-around;
}

.questions {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
}

.leftBody {
    height: 550px;
    width: 93%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 8px;
}

.signShape {
    height: 33px;
    width: 33px;
    border: 1px solid rgb(238, 238, 238);
    box-sizing: border-box;
    border-radius: 5px;
    margin: 0.9vh;
}

.signShape1 {
    height: 33px;
    width: 33px;
    border: 1px solid rgb(255, 149, 174);
    box-sizing: border-box;
    border-radius: 5px;
    margin: 0.9vh;
}

.signShape2 {
    height: 33px;
    width: 33px;
    background-color: rgb(53, 171, 255);
    box-sizing: border-box;
    border-radius: 5px;
    margin: 0.9vh;
}

.questionsTitle {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px 0 0 10px;
    box-sizing: border-box;
    height: 40px;
}

.signTitle {
    width: 100%;
}

.endExamBtn {
    width: 100px;
    height: 38px;
    border-radius: 10px;
    margin-bottom: 10px;
    color: white;
    background-color: rgb(53, 171, 255);
}

.rightTop {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    width: 100%;
    border-radius: 6px;
    background-color: white;
}

.rightBody {
    height: 480px;
    width: 100%;
    background-color: white;
    border-radius: 5px;
}

.rightBOttom {
    height: 70px;
    width: 100%;
    background-color: white;
    border-radius: 5px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: rgb(53, 171, 255);
}

.selectQue {
    flex-wrap: wrap;
}

.fillQue {
    flex-wrap: wrap;
}
</style>