<script setup lang="ts">
import { ref } from 'vue'
import { updateStudentInfoService, addStudentInfoService } from '@/api/teacher';
import { ElMessage } from 'element-plus';

const dialogVisible = ref(false);
interface StudentFormModel {
  studentId: number;
  studentName: string;
  grade: string;
  major: string;
  clazz: string;
  institute: string;
  tel: string;
  email: string;
  pwd: string;
  cardId: string;
  sex: string;
  role: number;
  examCode?: number;
}
const formModel = ref<StudentFormModel>({
    studentId: 0,
    studentName: '',
    grade: '',
    major: '',
    clazz: '',
    institute: '',
    tel: '',
    email: '',
    pwd: '',
    cardId: '',
    sex: '',
    role: 2,
});
const open = async (row: StudentFormModel) => {
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
    if (formModel.value.studentId !== undefined) {
        // 编辑试卷
       await updateStudentInfoService(formModel.value)
        ElMessage.success('编辑成功')
    } else {
        // 添加试卷
        await addStudentInfoService(formModel.value);
        ElMessage.success('添加成功');
    }
    dialogVisible.value = false;
    emit('success');
}
</script>
<template>
    <el-dialog :title="formModel.examCode ? '编辑试卷信息' : '增加试卷'" v-model="dialogVisible" width="30%">
        <section>
            <el-form ref="form" :model="formModel" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="formModel.studentName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="formModel.sex"></el-input>
                </el-form-item>
                <el-form-item label="学院">
                    <el-input v-model="formModel.institute"></el-input>
                </el-form-item>
                <el-form-item label="专业">
                    <el-input v-model="formModel.major"></el-input>
                </el-form-item>
                <el-form-item label="年级">
                    <el-input v-model="formModel.grade"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="formModel.clazz"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input v-model="formModel.tel"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="formModel.cardId"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="formModel.email"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formModel.pwd"></el-input>
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