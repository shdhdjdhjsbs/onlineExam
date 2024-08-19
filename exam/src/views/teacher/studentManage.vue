<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { deleteStudentInfoService, getPagingStudentService } from '@/api/teacher';
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus';
const examNewData = ref([])
const dialog = ref();
interface Student {
  studentId: number;
  studentName: string;
  sex: string;
  institute: string;
  major: string;
  grade: string;
  clazz: string;
  tel: string;
  cardId: string;
  pwd: string;
  email: string;
}
const params = ref({
  currentPage: 1,
  pageSize: 4,
  total: 1
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
  const getexamNewList = await getPagingStudentService(params.value.currentPage, params.value.pageSize)
  console.log(getexamNewList.data.data);
  params.value.total = getexamNewList.data.data.total
  examNewData.value = getexamNewList.data.data.records
}
//增加
const addExam = () => {
  //调用studentEditAdd的弹窗暴露的方法打开弹窗
  dialog.value.open()
}
//编辑
const onEditExam = (row:Student) => {
  dialog.value.open(row)
  console.log(row);
}
const onDelExam = async (row:Student) => {
  await ElMessageBox.confirm('你确认删除该考试分类吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    console.log(row.studentId);
    await deleteStudentInfoService(row.studentId)
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
      <div>学生管理</div>
      <div class="addBtn center" @click="addExam">增加学生</div>
    </div>
    <div class="body"><el-table :data="examNewData" border>
        <el-table-column fixed="left" prop="studentName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="sex" label="性别" width="80"></el-table-column>
        <el-table-column prop="institute" label="学院" width="120"></el-table-column>
      <el-table-column prop="major" label="专业" width="150"></el-table-column>
      <el-table-column prop="grade" label="年级" width="80"></el-table-column>
      <el-table-column prop="clazz" label="班级" width="80"></el-table-column>
      <el-table-column prop="tel" label="电话号码" width="120"></el-table-column>
      <el-table-column prop="cardId" label="身份证号" width="180"></el-table-column>
      <el-table-column prop="pwd" label="密码" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ row }">
            <el-button :icon="Edit" circle plain type="primary" @click="onEditExam(row)"></el-button>
            <el-button :icon="Delete" circle plain type="danger" @click="onDelExam(row)"></el-button>
          </template>
        </el-table-column>
      </el-table></div>
    <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
        v-model:page-size="params.pageSize" :page-sizes="[2, 4, 6]" layout="total, sizes, prev, pager, next, jumper"
        :total="params.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
  </div>
  <studentEditAdd @success="onSuccess" ref="dialog"></studentEditAdd>
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