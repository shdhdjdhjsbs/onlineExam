<script setup lang="ts">
import userAvatar from '@/components/userAvatar.vue';
import { RouterView } from 'vue-router';
</script>
<template>
  <div class="layoutBox">
    <el-row class="left center"
      style="height: 600px;width: 200px;min-width: 200px; ;background-color: rgb(53, 171, 255);">
      <div class="title1 center"><el-icon size="40px">
          <Reading />
        </el-icon>Exam-Online</div>
      <el-menu router default-active="/teacher/examQuery" class="el-menu-vertical-demo">
        <el-menu-item index="/teacher/examQuery"><el-icon>
            <Tickets />
          </el-icon>考试管理</el-menu-item>
        <el-menu-item index="/teacher/studentManage"><el-icon>
            <User />
          </el-icon>学生管理</el-menu-item>
          <el-menu-item index="/teacher/teacherManage"><el-icon>
              <Avatar />
            </el-icon>教师管理</el-menu-item>
        <el-sub-menu index="/teacher/questionsQuery">
          <template #title>
            <el-icon>
              <Document />
            </el-icon>
            <span>题库管理</span>
          </template>
          <el-menu-item index="/teacher/questionsQuery">所有题库</el-menu-item>
          <el-menu-item index="/teacher/addquestions">增加题库</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/teacher/scoreColumnQuery">
          <template #title>
            <el-icon>
              <Reading />
            </el-icon>
            <span>成绩查询</span>
          </template>
          <el-menu-item index="/teacher/scoreColumnQuery">学生成绩查询</el-menu-item>
          <el-menu-item index="/teacher/scorePieQuery">课程成绩查询</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-row>
    <div class="right">
      <div class="rightTop">
        <div style="width: 50%;display: flex;margin-right: 5%;justify-content: end;">
          <userAvatar></userAvatar>
        </div>
      </div>
      <div class="rightBody center">
        <div class="body">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.el-menu {
  width: 100%;
  height: 100vh;
  --el-menu-bg-color: rgb(53, 171, 255);
  --el-menu-text-color: white;
  --el-menu-active-color: #98FB98;
  border-right: 1px solid rgb(53, 171, 255);
}

::v-deep.el-sub-menu .el-sub-menu__title:hover {
  background-color: rgb(43, 108, 211);
  --el-menu-active-color: black;
}

::v-deep.el-sub-menu .el-menu-item:hover {
  background-color: rgb(43, 108, 211);
}

::v-deep .is-opened {
  background-color: rgb(43, 108, 211);
}

.layoutBox {
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

.title1 {
  height: 10vh;

  width: 100%;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right {
  /* 确保 right 部分总是占用剩余的宽度 */
  width: calc(100% - 200px);
}

.rightTop {
  width: 100%;
  background-color: rgb(53, 171, 255);
  display: flex;
  justify-content: flex-end;
  height: 8vh;
}

.rightBody {
  background-color: rgb(238, 238, 238);
  height: 92vh;
}

.body {
  height: 85vh;
  width: 95%;
  border-radius: 10px;
  background-color: white;
}
</style>