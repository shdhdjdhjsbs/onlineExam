<script setup>
import { ref } from 'vue';
import router from '@/router';
import { userLogin } from '@/api/user';
import { useUserStore } from '@/stores/index.js'
const formModel = ref({
    username: '',
    password: ''
});

const form = ref()

const rules = ref({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 1, max: 9, message: '请输入1到9位账号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 1, max: 16, message: '请输入1到16位密码', trigger: 'blur' },
    ]
})

const userStore = useUserStore();

const login = async () => {
    await form.value.validate()
    const res = await userLogin(formModel.value)
    console.log(res.data);
    if (res.data.code === 200) {
        userStore.setUser(res.data.data);
        ElMessage.success('登陆成功')
        router.push('/students')
    } else {
        ElMessage.success('登陆失败，请检查账号或密码')
    }
}
</script>
<template>
    <div class="container center">
        <div class="title center" style="color: rgb(64, 158, 255);"><el-icon size="40px"><Reading /></el-icon>在线考试系统</div>
        <el-row class="box center">
            <el-col :lg="8" :xs="16" :md="10" :span="10">
                <div class="title center">账号登陆</div>
                <div class="form center">
                    <el-form ref="form" label-position="left" :hide-required-asterisk="true" :model="formModel"
                        :rules="rules" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="formModel.username" placeholder="请输入账号"
                                style="width: 180px;height: 40px;" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="formModel.password" placeholder="请输入密码"
                                style="width: 180px;height: 40px;" />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn center" @click="login">登陆</div>
            </el-col>
        </el-row> 
        <div class="tip center">
            <div>Tips：</div>
            <!-- <div>管理员账号：9527</div>
            <div>教师账号：20081001</div> -->
            <div>学生账号：20154084</div>
            <div>密码都是：123456 </div>
            <div>真正有题目只有计算机网络</div>
            <div>答题请选择计算机网络</div>
        </div>
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
    background-color: rgb(238,238,238);;
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

.btn {
    margin-top: 25px;
    height: 50px;
    width: 100%;
    background-color: rgb(64, 158, 255);
    border-radius: 8px;
    color: white;
}

.tip {
    border-radius: 5px;
    position: absolute;
    right: 0;
    height: 25vh;
    width: 40vh;
    flex-wrap: wrap;
    background-color: white;
}
.tip div{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>