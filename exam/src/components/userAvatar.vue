<script setup>
import router from '@/router';
import { ref,onMounted } from 'vue'
import { useUserStore } from '@/stores/index.js'
import { useRoute } from 'vue-router';
const route = useRoute()
const flag1 =ref(false)
const changeflag1 = () => {
  if (route.path.startsWith('/teacher')) return flag1.value = false
  else return flag1.value = true
}
const flag = ref(false)
const userStore = useUserStore();
const reset = () => {
  userStore.resetUser()
  router.push('/login')
}
onMounted(() => {
  changeflag1()
})
</script>
<template>
  <div @mouseenter="flag = true" @mouseleave="flag = false" class="title2 center"
    style="width: 25%; position: relative;">
    <el-icon style="font-size: 25px;">
      <Avatar />
    </el-icon>
    大咸鱼
    <div v-if="flag" class="user center">
      <div @click="router.push('/manager')" v-if="flag1">修改密码</div>
      <div @click="reset()">退出</div>
    </div>
  </div>
</template>

<style scoped>
.title2 {
  height: 8vh;
  width: 25%;
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