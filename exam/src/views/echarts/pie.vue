<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getSubjectAllScoreService } from '@/api/teacher'
// // 按需引入 ECharts 模块
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// // 注册 ECharts 需要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, PieChart, CanvasRenderer]);
// // 使用 ref 创建一个响应式引用来绑定 DOM 元素
const echart = ref(null);

// // 图表配置项
const option = ref({
  title: {
    text: '',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
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

const route = useRoute()
const examCode = ref('')
const source = ref('')
// // 在组件挂载时初始化图表
onMounted(async () => {
    examCode.value = route.query.examCode
    source.value = route.query.source
    option.value.title.text = source.value + '分数分段图'
    const res = await getSubjectAllScoreService(examCode.value)
    const resData = res.data.data
    console.log(res);
    // 分类分数
  const scoreRanges = {
    '60以下': 0,
    '60-80': 0,
    '80-90': 0,
    '90以上': 0
  };

  resData.forEach(item => {
    const score = item.etScore;
    if (score < 60) {
      scoreRanges['60以下']++;
    } else if (score >= 60 && score < 80) {
      scoreRanges['60-80']++;
    } else if (score >= 80 && score < 90) {
      scoreRanges['80-90']++;
    } else {
      scoreRanges['90以上']++;
    }
  });

  // 更新图表数据
  option.value.series[0].data = Object.keys(scoreRanges).map(key => ({
    name: key,
    value: scoreRanges[key]
  }));
    // 更新图表数据
    initChart();
});
</script>

<template>
    <div class="columnBox">
        <div class="title center">{{ source}}：
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