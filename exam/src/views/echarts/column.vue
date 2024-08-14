<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentScoreService } from '@/api/students';
// 按需引入 ECharts 模块
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 需要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]);
const route = useRoute()
// 使用 ref 创建一个响应式引用来绑定 DOM 元素
const echart = ref(null);

// 图表配置项
const option = ref({
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [],
            type: 'line'
        }
    ]
})
const initChart = () => {
    // 初始化图表实例
    const chart = echarts.init(echart.value);
    option.value
    // 设置图表选项
    chart.setOption(option.value);

    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', chart.resize);
};

const studentId = ref('')
const studentName = ref('')
// 在组件挂载时初始化图表
onMounted(async () => {
    studentId.value = route.query.studentId
    studentName.value = route.query.studentName
    const res = await getStudentScoreService(studentId.value)
    const resData = res.data.data
    const dates = resData.map(item => item.answerDate);
    const scores = resData.map(item => item.etScore);

    // 更新图表数据
    option.value.xAxis.data = dates;
    option.value.series[0].data = scores;
    console.log(resData,option.value.xAxis.data);
    initChart();
});
</script>

<template>
    <div class="columnBox">
        <div class="title center">学生：{{studentName}}
        </div>
        <div class="body">
            <div ref="echart" style="width: 100%; height: 400px;"></div>
        </div>
    </div>
</template>
<style scoped>
.columnBox {
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
</style>