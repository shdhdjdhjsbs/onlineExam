<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import {getPagingStudentService} from '@/api/teacher'
import { Search } from '@element-plus/icons-vue'
import router from '@/router';

interface StudentScore {
  studentId: number;
  studentName: string;
  institute: string;
  major: string;
  grade: string;
  clazz: string;
  sex: string;
  tel: string;
}

interface PagingData {
  data: {
    data: {
      records: StudentScore[];
      total: number;
    };
    code: number;
  };
}

const pagingData = ref<PagingData | null>(null)
const PagingData = computed(() => pagingData.value?.data.data || { records: [], total: 0 })
const params = ref({
  currentPage: 1,
  pageSize: 4,
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
    pagingData.value = await getPagingStudentService(params.value.currentPage,params.value.pageSize)
    params.value.total = pagingData.value.data.data.total
    console.log(PagingData.value,params.value.total);
}

const searchScore = (row:StudentScore) => {
  router.push({path:'/teacher/studentScore',query:{
    studentId: row.studentId,
    studentName: row.studentName
  }})
}
onMounted(async () => {
    onChangePage()
})
</script>
<template>
    <div class="scoreColumnQueryBox">
      <div class="title center">学生成绩查询
      </div>
      <div class="body">
        <el-table :data="PagingData.records"  border>
      <el-table-column fixed="left" prop="studentName" label="姓名" width="180"></el-table-column>
      <el-table-column prop="institute" label="学院" width="200"></el-table-column>
      <el-table-column prop="major" label="专业" width="200"></el-table-column>
      <el-table-column prop="grade" label="年级" width="200"></el-table-column>
      <el-table-column prop="clazz" label="班级" width="100"></el-table-column>
      <el-table-column prop="sex" label="性别" width="120"></el-table-column>
      <el-table-column prop="tel" label="联系方式" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <el-button :icon="Search" circle plain type="primary" @click="searchScore(row)"></el-button>
            查询成绩
          </template>
        </el-table-column>
    </el-table>
      </div>
      <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
        v-model:page-size="params.pageSize" :page-sizes="[2, 3, 4,5]" layout="total, sizes, prev, pager, next, jumper"
        :total="params.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
    </div>
  </template>
  <style scoped>
.scoreColumnQueryBox {
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