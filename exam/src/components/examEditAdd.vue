<script setup lang="ts">
import { ref } from 'vue'
import { updateExamListService, addExamListService } from '@/api/teacher';
import { ElMessage } from 'element-plus';
const dialogVisible = ref<boolean>(false);
interface FormModel {
  source: string;
  description: string;
  institute: string;
  major: string;
  grade: string;
  examDate: string;
  totalTime: string;
  totalScore: string;
  type: string;
  tips: string;
  examCode?: number; // 可选字段
  paperId: number;  
  term?: string; 
}
const formModel = ref<FormModel>({
  source: '',
  description: '',
  institute: '',
  major: '',
  grade: '',
  examDate: '',
  totalTime: '',
  totalScore: '',
  type: '',
  tips: '',
  paperId: 0,  
  term: '',  
});
//日期格式化
const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const open = async (row: FormModel) => {
  dialogVisible.value = true
  console.log(row)
  formModel.value = { ...row }
  console.log(formModel.value);
}

//暴露open方法给父组件来打开弹窗
defineExpose({
  open
})

const emit = defineEmits(['success']);

const submit = async () => {
  if (formModel.value.examCode) {
    // 编辑试卷
    formModel.value.examDate = formatDate(formModel.value.examDate)
    await updateExamListService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加试卷
    console.log(formModel.value);
    formModel.value.examDate = formatDate(formModel.value.examDate)
    await addExamListService(formModel.value);
    ElMessage.success('添加成功');
  }
  dialogVisible.value = false;
  emit('success');
}
</script>
<template>
  <el-dialog :title="formModel.examCode ? '编辑试卷信息' : '增加试卷'" v-model="dialogVisible" width="30%">
    <section>
      <el-form :model="formModel" label-width="80px">
        <el-form-item label="试卷名称">
          <el-input v-model="formModel.source"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="formModel.description"></el-input>
        </el-form-item>
        <el-form-item label="所属学院">
          <el-input v-model="formModel.institute"></el-input>
        </el-form-item>
        <el-form-item label="所属专业">
          <el-input v-model="formModel.major"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="formModel.grade"></el-input>
        </el-form-item>
        <el-form-item label="考试日期">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="formModel.examDate"
              style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="持续时间">
          <el-input v-model="formModel.totalTime"></el-input>
        </el-form-item>
        <el-form-item label="总分">
          <el-input v-model="formModel.totalScore"></el-input>
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-input v-model="formModel.type"></el-input>
        </el-form-item>
        <el-form-item label="考生提示">
          <el-input type="textarea" v-model="formModel.tips"></el-input>
        </el-form-item>
      </el-form>
    </section>
    <div class="bottom"><el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style scoped>
.bottom {
  display: flex;
  justify-content: space-around;
}
</style>