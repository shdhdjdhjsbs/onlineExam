<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { deleteTeacherInfoService, getPagingTeacherService } from '@/api/teacher';
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus';
const examNewData = ref([])
const dialog = ref();

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
  const getexamNewList = await getPagingTeacherService(params.value.currentPage, params.value.pageSize)
  console.log(getexamNewList.data.data);
  params.value.total = getexamNewList.data.data.total
  examNewData.value = getexamNewList.data.data.records
}
interface Teacher {
  teacherId: number;
  teacherName: string;
  institute: string;
  sex: string;
  tel: string;
  email: string;
  cardId: string;
  type: string;
}

//增加
const addExam = () => {
  //调用teacherEditAdd的弹窗暴露的方法打开弹窗
  dialog.value.open()
}
//编辑
const onEditExam = (row:Teacher) => {
  dialog.value.open(row)
  console.log(row);
}
const onDelExam = async (row:Teacher) => {
  await ElMessageBox.confirm('你确认删除该考试分类吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    console.log(row.teacherId);
    await deleteTeacherInfoService(row.teacherId)
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
      <div>教师管理</div>
      <div class="addBtn center" @click="addExam">增加教师</div>
    </div>
    <div class="body"><el-table :data="examNewData" border>
        <el-table-column fixed="left" prop="teacherName" label="姓名" width="180"></el-table-column>
      <el-table-column prop="institute" label="学院" width="200"></el-table-column>
      <el-table-column prop="sex" label="性别" width="120"></el-table-column>
      <el-table-column prop="tel" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="email" label="密码" width="120"></el-table-column>
      <el-table-column prop="cardId" label="身份证号" width="180"></el-table-column>
      <el-table-column prop="type" label="职称" width="120"></el-table-column>
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
  <teacherEditAdd @success="onSuccess" ref="dialog"></teacherEditAdd>
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