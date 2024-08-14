<script setup>
import userAvatar from './userAvatar.vue'
import router from '@/router';
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
            <userAvatar></userAvatar>
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

</style>