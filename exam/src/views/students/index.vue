<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getExamListService, getPageExamListService } from '@/api/students';
import router from '@/router';

interface ExamItem {
  source: string;
  description: string;
  examDate: string;
  totalTime: number;
  totalScore: number;
  examCode: string;
  paperId: string;
  term: string;
}

interface Params {
  currentPage: number;
  pageSize: number;
  total: number;
}

const state = ref<string>('');

const links = ref<{ value: string }[]>([]);
// 所有科目数据
const examData = ref<ExamItem[]>([]);
// 当前页面数据
const examNewList = ref<ExamItem[]>([]);

let timeout: ReturnType<typeof setTimeout>;

const querySearchAsync = (queryString: string, cb: (results: { value: string }[]) => void) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value;

  clearTimeout(timeout);
  timeout = setTimeout(() => cb(results), 3000 * Math.random());
};

const createFilter = (queryString: string) => (exam: { value: string }) =>
  exam.value.toLowerCase().includes(queryString.toLowerCase());

const handleSelect = (item: { value: string }) => {
  // 根据总数据筛选选择的科目
  const selectedExam = examData.value.find(exam => exam.source === item.value);
  if (selectedExam) {
    // 替换当前页面渲染的数据
    examNewList.value = [selectedExam];
  }
};

// 搜索按钮
const search = async () => {
  if (state.value.trim() === '') {
    // 为空时默认显示前四个
    examNewList.value = examData.value.slice(0, 4);
  } else {
    // 查询和更新页面
    const filteredExams = examData.value.filter(exam =>
      exam.source.toLowerCase().includes(state.value.toLowerCase())
    );
    examNewList.value = filteredExams;
  }
};

const params = ref<Params>({
  currentPage: 1,
  pageSize: 4,
  total: 1,
});

// 分页
const onChangePage = async () => {
  const getexamNewList = await getPageExamListService(params.value.currentPage, params.value.pageSize);
  examNewList.value = getexamNewList.data.data.records as ExamItem[];
};

const handleSizeChange = (e: number) => {
  params.value.pageSize = e;
  onChangePage();
};

const handleCurrentChange = (e: number) => {
  params.value.currentPage = e;
  onChangePage();
};

// 获取全部科目数据(分页有需要)
const getAllExamList = async () => {
  const ExamList = await getExamListService();
  console.log(ExamList);

  params.value.total = ExamList.data.data.length;
  ExamList.data.data.forEach((item: ExamItem) => {
    links.value.push({ value: item.source });
  });
  examData.value = ExamList.data.data;
};

// 科目跳转
const toExamMsg = (item: ExamItem) => {
  console.log(item.examCode, item.paperId);
  router.push({
    path: '/examMsg',
    query: {
      subjectCode: item.examCode,
      paperId: item.paperId,
    },
  });
};

onMounted(async () => {
  await getAllExamList();
  await onChangePage();
});
</script>
<template>
  <keep-alive>
    <navigation></navigation>
  </keep-alive>
  <div class="examBox center">
    <div class="title center">我的试卷</div>
    <div class="exam">
      <div class="examTop">
        <div class="title" style="height: 10vh;">试卷列表</div>
        <div class="search center"><el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync"
            suffix-icon="Search" placeholder="搜索试卷" @select="handleSelect" />
          <div class="btn center" @click="search">搜索试卷</div>
        </div>
      </div>
      <div class="examMain">
        <div class="subject" @click="toExamMsg(item)" v-for="(item, index) in examNewList" :key="item.source">
          <div class="subName">{{ item.source }}</div>
          <div class="description">{{ item.source }}-{{ item.description }}</div>
          <div class="detail">
            <div class="detailTime">{{ item.examDate }}</div>
            <div class="detailTime">限时{{ item.totalTime }}分钟</div>
            <div class="detailTime">满分{{ item.totalScore }}分</div>
          </div>
        </div>
      </div>
      <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
          v-model:page-size="params.pageSize" :page-sizes="[2, 3, 4]" layout="total, sizes, prev, pager, next, jumper"
          :total="params.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
    </div>
  </div>
</template>
<style scoped>
::v-deep .el-input .el-input__wrapper .el-input__inner {
  height: 5vh;
  /* 控制输入框的高度 */
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.examBox {
  height: 92vh;
  flex-wrap: wrap;
  background-color: rgb(238, 238, 238);
}

.title {
  width: 45%;
  height: 6vh;
  display: flex;
  /* justify-content: flex-start; */
  align-items: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.exam {
  border-radius: 10px;
  display: flex;
  height: 81vh;
  width: 65%;
  background-color: rgb(255, 255, 255);
  flex-wrap: wrap;
  margin-bottom: 10vh;
}

.examTop {
  height: 10vh;
  width: 100%;
  display: flex;
  justify-content: space-around;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(238, 238, 238);
  box-shadow: 0 0 4px 2px rgba(217, 222, 234, 0.3);
}

.search {
  height: 10vh;
  width: 40%;
}

.examMain {
  height: 57vh;
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
}

.subject {
  border-radius: 5px;
  height: 25vh;
  width: 40%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  border: 1px solid rgb(238, 238, 238);
  box-shadow: 0 0 4px 2px rgba(217, 222, 234, 0.3);
}

.subject:hover {
  border: 2px solid rgb(218, 235, 253);
}

.subName {
  color: black;
  width: 100%;
  margin-left: 30px;
}

.description {
  color: rgb(136, 148, 155);
  width: 100%;
  margin-left: 30px;
}

.detail {
  color: rgb(136, 148, 155);
  width: 100%;
  margin-left: 10px;
  display: flex;
}

.detailTime {
  margin-left: 20px;
}

.btn {
  background-color: rgb(102, 177, 255);
  height: 5vh;
  width: 25vh;
  margin-left: 20px;
  border-radius: 5px;
  margin-right: 20px;
  color: white;
}

.paging {
  height: 10vh;
  width: 100%;
}
</style>
