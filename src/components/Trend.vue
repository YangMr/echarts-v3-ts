<template>
  <div class="container">
    <div class="title">
      <span @click="selectStatus = !selectStatus">
        {{ selectArrs[0]?.text }}
      </span>
      <span>^</span>
      <div class="select" v-if="selectStatus">
        <div class="select-item" v-for="(item, index) in selectArrs" :key="index">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="chart" id="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, getCurrentInstance } from 'vue'
import { getTrend } from '@/api/trend'
const { proxy } = getCurrentInstance()

// 创建一个变量,用来保存echarts实例对象
const echartsInstance = ref(null)

// 创建一个变量, 用来保存获取到的图表数据
const resultAllData = ref<any>()

// 创建一个变量,用来控制下拉选择的显示与隐藏
const selectStatus = ref(false)

// 创建一个变量,保存下拉框的数据
const selectArrs = ref([])

// 1. 初始化echarts实例对象
const initChart = () => {
  echartsInstance.value = proxy.$echarts.init(document.getElementById('chart'), 'dark')

  const option = {
    title: {
      text: ''
    },
    legend: {
      top: '15%',
      icon: 'circle'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: '35%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      }
    }
  }

  echartsInstance.value.setOption(option)
}

// 2. 获取后台返回的数据
const getData = async () => {
  try {
    const result = await getTrend()
    resultAllData.value = result
    updateChart()
  } catch (e) {
    console.log(e)
  }
}

// 3. 更新图表的配置项以及渲染
const updateChart = () => {
  console.log('resultAllData.value', resultAllData.value)
  // 获取下拉框的数据
  selectArrs.value = resultAllData.value.type

  // 获取到x轴的数据
  const timeArrs = resultAllData.value.common.month

  // 获取y轴的数据
  const valueArrs = resultAllData.value.map.data

  // 获取legend的数据
  const legendArrs = valueArrs.map((item) => item.name)

  // 半透明的颜色值
  const colorArr1 = [
    'rgba(11, 168, 44, 0.5)',
    'rgba(44, 110, 255, 0.5)',
    'rgba(22, 242, 217, 0.5)',
    'rgba(254, 33, 30, 0.5)',
    'rgba(250, 105, 0, 0.5)'
  ]
  // 全透明的颜色值
  const colorArr2 = [
    'rgba(11, 168, 44, 0)',
    'rgba(44, 110, 255, 0)',
    'rgba(22, 242, 217, 0)',
    'rgba(254, 33, 30, 0)',
    'rgba(250, 105, 0, 0)'
  ]

  // 构造y轴要渲染的数据
  const seriesArrs = valueArrs.map((item, index) => {
    return {
      name: item.name,
      type: 'line',
      data: item.data,
      stack: 'map',
      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: colorArr1[index] // 0% 处的颜色
            },
            {
              offset: 1,
              color: colorArr2[index] // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        }
      }
    }
  })
  console.log('seriesArrs', seriesArrs)

  const dataOption = {
    xAxis: {
      data: timeArrs
    },
    legend: {
      data: legendArrs
    },
    series: seriesArrs
  }
  echartsInstance.value.setOption(dataOption)
}

// 4. 图表进行自适应
const screenAdapter = () => {
  echartsInstance.value.resize()
}

// 5. 当dom加载完毕之后(初始化echarts实例对象, 获取后台返回的数据, 图表进行自适应)
onMounted(() => {
  initChart()
  getData()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})

// 6. 当组件销毁之前(移除监听事件)
onBeforeUnmount(() => {
  window.removeEventListener('resize', screenAdapter)
})
</script>

<style scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 100;
  color: #fff;
  cursor: pointer;
}
</style>
