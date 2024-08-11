<script setup>
import { onMounted, ref } from 'vue'
import { getStudentScoreService,getPageScoreService } from '@/api/students'
import { useUserStore } from '@/stores/index.js';

const userStore = useUserStore();
//分页分数
const scoreData = ref([])
//学生全部分数
const studentScoreData = ref([])
const dateFilters = ref([])
const params = ref({
  currentPage: 1,
  pageSize: 8,
  total: 1
})
onMounted(async () => {
  await getStudentData()
  await onChangePage()
})

// 表格筛选数据处理
const filterHandler = (value, row) => {
  return row.answerDate === value
}

//获取单个学生全部分数
const getStudentData = async () => {
  const res = await getStudentScoreService(userStore.studentId)
  studentScoreData.value = res.data.data
  console.log(res.data.data);
}
// 分页
const onChangePage = async () => {
  const res = await getPageScoreService(params.value.currentPage,params.value.pageSize,userStore.studentId)
  console.log(res.data.data.records);
  scoreData.value = res.data.data.records
  params.value.total = studentScoreData.value.length
  // 提取唯一的时间选项并去重
  const uniqueDates = [...new Set(scoreData.value.map(item => item.answerDate))]
  dateFilters.value = uniqueDates.map(date => ({
    text: date,
    value: date
  }))
}

const handleSizeChange = (e) => {
  params.pageSize = e
  onChangePage()
}
const handleCurrentChange = (e) => {
  params.currentPage = e
  onChangePage()
}
</script>

<template>
  <keep-alive>
    <navigation></navigation>
  </keep-alive>
  <div class="scoreBox">
    <div class="title center">我的分数</div>
    <div class="main center">
      <el-table :data="scoreData" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
        <el-table-column prop="answerDate" label="考试日期" sortable :filters="dateFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="subject" label="课程名称"/>
        <el-table-column prop="etScore" label="考试分数"/>
        <el-table-column label="是否及格">
          <template #default="{ row }">
            <el-tag :type="row.etScore >= 60 ? 'success' : 'danger'" disable-transitions>
              {{ row.etScore >= 60 ? '及格' : '不及格' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
          v-model:page-size="params.pageSize" :page-sizes="[2, 4, 6,8]" layout="total, sizes, prev, pager, next, jumper"
          :total="params.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
    </div>
  </div>
</template>

<style scoped>
::v-deep .el-table .cell {  
  display: flex;  
  justify-content: center;  
  align-items: center;  
}
::v-deep .el-table__inner-wrapper .el-table__row {
  height: 60px;
}
::v-deep .el-table__inner-wrapper .el-table__header {
  height: 60px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.scoreBox {
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
}

.main {
  border-radius: 10px;
  display: flex;
  height: 81vh;
  width: 65%;
  background-color: rgb(255, 255, 255);
  flex-wrap: wrap;
  margin-bottom: 10vh;
  flex-direction: column;
  justify-content: space-between;
}

.paging {
  margin-bottom: 3vh;
}
.el-table {
  width: 100%;
}
</style>
