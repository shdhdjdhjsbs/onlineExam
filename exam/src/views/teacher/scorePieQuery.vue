<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getPageExamListService } from '@/api/students';
import { Search } from '@element-plus/icons-vue'
import router from '@/router';

interface Exam {
  source: string;
  description: string;
  institute: string;
  major: string;
  grade: string;
  examDate: string;
  totalTime: number;
  totalScore: number;
  type: string;
  tips: string;
  examCode: number;
}
interface PagingData {
  data: {
    data: {
      records: Exam[];
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
    pagingData.value = await getPageExamListService(params.value.currentPage, params.value.pageSize)
    params.value.total = pagingData.value.data.data.total
    console.log(PagingData.value, params.value.total);
}

const searchSubject = (row:Exam) => {
    router.push({path: '/teacher/subjectScore', query:{examCode: row.examCode, source: row.source}})
}

onMounted(async () => {
    onChangePage()
})
</script>
<template>
    <div class="columnBox">
        <div class="title center">课程详情
        </div>
        <div class="body">
            <el-table :data="PagingData.records" border>
                <el-table-column fixed="left" prop="source" label="试卷名称" width="180"></el-table-column>
                <el-table-column prop="description" label="介绍" width="200"></el-table-column>
                <el-table-column prop="institute" label="所属学院" width="120"></el-table-column>
                <el-table-column prop="major" label="所属专业" width="200"></el-table-column>
                <el-table-column prop="grade" label="年级" width="100"></el-table-column>
                <el-table-column prop="examDate" label="考试日期" width="120"></el-table-column>
                <el-table-column prop="totalTime" label="持续时间" width="120"></el-table-column>
                <el-table-column prop="totalScore" label="总分" width="120"></el-table-column>
                <el-table-column prop="type" label="试卷类型" width="120"></el-table-column>
                <el-table-column prop="tips" label="考生提示" width="400"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="{ row }">
                        <el-button :icon="Search" circle plain type="primary" @click="searchSubject(row)"></el-button>
                        分段查询
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
                v-model:page-size="params.pageSize" :page-sizes="[2, 4, 6, 8]"
                layout="total, sizes, prev, pager, next, jumper" :total="params.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" /></div>
    </div>
</template>
<style scoped>
.columnBox {
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