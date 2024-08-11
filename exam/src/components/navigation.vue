<script setup>
import router from '@/router';
import { ref } from 'vue'
import { useUserStore } from '@/stores/index.js'
const flag = ref(false)

const userStore = useUserStore();
const reset = () => {
    router.push('/')
    userStore.resetUser()
}
</script>
<template>
    <div class="navBox">
        <div class="titleBox1 center">
            <div class="title1 center"><el-icon size="40px"><Reading /></el-icon>Exam-Online</div>
            <div class="title2 center" @click="router.push('/students')">我的试卷</div>
            <div class="title2 center" @click="router.push('/myScore')">我的分数
            </div>
            <div class="title2 center" @click="router.push('/msgBoard')">给我留言</div>
        </div>
        <div class="titleBox2">
            <div @mouseenter="flag = !flag" @mouseleave="flag = !flag" class="title2 center"
                style="width: 25%;position: relative;"><el-icon style="font-size: 25px;">
                    <Avatar />
                </el-icon>大咸鱼<div v-if="flag" class="user center">
                    <div @click="router.push('/manager')">修改密码</div>
                    <div @click="reset">退出</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
body {
    margin: 0;
    padding: 0;
}
</style>
<style scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.navBox {
    height: 8vh;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(222, 232, 239);
    box-shadow: 0 0 4px 2px rgba(217, 222, 234, 0.3);
}

.titleBox1 {
    display: flex;
    width: 40%;
}

.titleBox2 {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
    width: 40%;
}

.title1 {
    height: 8vh;
    font-weight: 600;
    color: rgb(47, 108, 159);
    width: 28%;
    font-size: 1.2rem;
}

.title2 {
    height: 8vh;
    width: 18%;
}

.title1:hover {
    color: rgb(47, 108, 159);
    background-color: rgb(5, 151, 255);
    transition: 1s;
}

.title2:hover {
    background-color: rgb(5, 151, 255);
    color: white;
    transition: 1s;
}

.user {
    height: 12vh;
    width: 100%;
    background-color: white;
    color: black;
    position: absolute;
    top: 8vh;
    /* left: 0; */
    flex-wrap: wrap;
}

.user div {
    height: 6vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user div:hover {
    background-color: rgb(5, 151, 255);
    color: white;
    transition: 0.7s;
    width: 100%;
}
</style>