<script setup>
import { onMounted, ref } from 'vue';
import { getPageExamListService } from '@/api/students';
import { deleteExamListService } from '@/api/teacher';
import { Edit, Delete } from '@element-plus/icons-vue'
const examNewData = ref([])
const dialog = ref();

const params = ref({
  currentPage: 1,
  pageSize: 8,
  total: 1
})
const handleSizeChange = (e) => {
  params.pageSize = e
  onChangePage()
}
const handleCurrentChange = (e) => {
  params.currentPage = e
  onChangePage()
}
const onChangePage = async () => {
  const getexamNewList = await getPageExamListService(params.value.currentPage, params.value.pageSize)
  console.log(getexamNewList.data.data);
  params.value.total = getexamNewList.data.data.total
  examNewData.value = getexamNewList.data.data.records
}
//增加试卷
const addExam = () => {
  //调用examEditAdd的弹窗暴露的方法打开弹窗
  dialog.value.open()
}
//编辑试卷
const onEditExam = (row) => {
  dialog.value.open(row)
  console.log(row);
}
const onDelExam = async (row) => {
  await ElMessageBox.confirm('你确认删除该考试分类吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    console.log(row.examCode);
    await deleteExamListService(row.examCode)
  onChangePage()
  })
}
onMounted(async () => {
  onChangePage()
})

//监听子组件弹窗，成功后刷新页面
const onSuccess = () => {
  onChangePage()
}
</script>
<template>
  <div class="examQueryBox">
    <div class="title center">
      <div>考试管理</div>
      <div class="addBtn center" @click="addExam">增加考试</div>
    </div>
    <div class="body"><el-table :data="examNewData" border>
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
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ row }">
            <el-button :icon="Edit" circle plain type="primary" @click="onEditExam(row)"></el-button>
            <el-button :icon="Delete" circle plain type="danger" @click="onDelExam(row)"></el-button>
          </template>
        </el-table-column>
      </el-table></div>
    <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
        v-model:page-size="params.pageSize" :page-sizes="[4, 6, 8]" layout="total, sizes, prev, pager, next, jumper"
        :total="params.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
  </div>
  <examEditAdd @success="onSuccess" ref="dialog"></examEditAdd>
</template>
<style scoped>
.examQueryBox {
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

.addBtn {
  padding: 0 1vh 0 1.5vh;
  border-radius: 5px;
  height: 5.5vh;
  background-color: rgb(53, 171, 255);
}
</style>