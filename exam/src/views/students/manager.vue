<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router';
import { useUserStore } from '@/stores/index.js'
import { updateStudentPWDService } from '@/api/students';
const formModel = ref({
    password: '',
    confirm: ''
});

const form = ref()

const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== formModel.value.password) {
        callback(new Error("两次密码不一致！"))
    } else {
        callback()
    }
}
const rules = ref({
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 1, max: 16, message: '请输入1到16位密码', trigger: 'blur' },
    ],
    confirm: [
        { validator: validatePass, trigger: 'blur' }
    ]
})

// 调用el-form 的 resetFields方法，连验证状态和值一起清空
const reset = () => {
    if (form.value) {
        form.value.resetFields();
    }
}
//提交更改密码
const sub = async () => {
  await form.value.validate()
  const res = await updateStudentPWDService(formModel.value.password,userStore.studentId)
  if (res.data.code === 200) {
      ElMessage.success('修改成功')
      router.push('/students')
    } else {
        ElMessage.success('修改密码失败，请检查账号或密码')
    }
}
const userStore = useUserStore();

onMounted(() => {
    console.log(userStore.studentId);
})
</script>
<template>
    <keep-alive>
    <navigation></navigation>
  </keep-alive>
    <div class="container center">
        <el-row class="box center">
            <el-col :lg="8" :xs="16" :md="10" :span="10">
                <div class="title center">修改密码</div>
                <div class="form center">
                    <el-form ref="form" label-position="left" :hide-required-asterisk="true" :model="formModel"
                        :rules="rules" label-width="80px">
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="formModel.password" placeholder="请输入密码"
                                style="width: 180px;height: 40px;" />
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirm">
                            <el-input v-model="formModel.confirm" placeholder="请再次输入密码"
                                style="width: 180px;height: 40px;" />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btnBox">
                    <div class="btn center" @click="sub">提交</div>
                    <div class="btn center" @click="reset">重置</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style>
body {
    margin: 0;
}
</style>
<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    height: 100vh;
    flex-direction: column;
    background-color: rgb(238,238,238);
    overflow: hidden;
}

.box {
    height: 370px;
    border-radius: 10px;
    background-color: rgb(255, 255, 255);
    width: 35%;
    min-width: 300px;
    flex-wrap: wrap;
    margin-bottom: 50px;
}

.title {
    margin-bottom: 30px;
    height: 30px;
    font-size: 30px;
    width: 100%;
}

.form {
    width: 100%;
}

.btnBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

.btn {
    margin: 25px 5px 0 5px;
    height: 50px;
    width: 100%;
    background-color: rgb(64, 158, 255);
    border-radius: 8px;
    color: white;
}
</style>