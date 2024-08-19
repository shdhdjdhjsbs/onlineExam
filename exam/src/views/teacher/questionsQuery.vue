<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getPagingQuestionsService } from '@/api/teacher';

interface Question {
  subject: string;
  question: string;
  section: string;
  type: string;
  score: number;
  level: string;
}

interface PagingData {
  data: {
    data: {
      records: Question[];
      total: number;
    };
    code: number;
  };
}

const pagingData = ref<PagingData | null>(null)
const PagingData = computed(() => pagingData.value?.data.data || { records: [], total: 0 })
const params = ref({
  currentPage: 1,
  pageSize: 8,
  total: 0
})
const handleSizeChange = (e:number) => {
  params.value.pageSize = e
  onChangePage()
}
const handleCurrentChange = (e:number) => {
  params.value.currentPage = e
  onChangePage()
}
const onChangePage = async () => {
    pagingData.value = await getPagingQuestionsService(params.value.currentPage,params.value.pageSize)
    params.value.total = pagingData.value.data.data.total
    console.log(PagingData.value,params.value.total);
}
const onSuccess = () => {
  onChangePage()
}
onMounted(async () => {
    onChangePage()
})

</script>
<template>
    <div class="questionsQueryBox">
      <div class="title center">题库管理
      </div>
      <div class="body">
        <el-table :data="PagingData.records" border>
      <el-table-column fixed="left" prop="subject" label="试卷名称" width="180"></el-table-column>
      <el-table-column show-overflow-tooltip prop="question" label="题目信息" width="490"></el-table-column>
      <el-table-column prop="section" label="所属章节" width="150"></el-table-column>
      <el-table-column prop="type" label="题目类型" width="150"></el-table-column>
      <el-table-column prop="score" label="试题分数" width="120"></el-table-column>
      <el-table-column prop="level" label="难度等级" width="120"></el-table-column>
    </el-table>
      </div>
      <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
        v-model:page-size="params.pageSize" :page-sizes="[4, 6, 8,10]" layout="total, sizes, prev, pager, next, jumper"
        :total="params.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
    </div>
    <examEditAdd @success="onSuccess" ref="dialog"></examEditAdd>
  </template>
  <style scoped>
.questionsQueryBox {
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

.body {
  height: 65vh;
  width: 96%;
  flex-direction: column;
}
</style>