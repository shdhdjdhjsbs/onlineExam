<script setup lang="ts">
import { RouterView } from 'vue-router';
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'

</script>

<template>
    <el-config-provider :locale="zh">
        <RouterView></RouterView>
  </el-config-provider>

</template>

<style scoped>

</style>