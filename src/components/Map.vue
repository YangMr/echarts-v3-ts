<template>
  <div class="container">
    <div class="chart" id="chart"></div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onBeforeUnmount, onMounted, ref, getCurrentInstance } from 'vue'
import { getMap } from '@/api/map'
const { proxy } = getCurrentInstance()

// 创建一个变量,保存echarts实例化的对象
const echartsInstance = ref(null)

// 创建一个变量, 保存请求到的商家分布数据
let resultData = ref<any>()

// 1. 初始化echarts实例对象
const initChart = async () => {
  echartsInstance.value = proxy.$echarts.init(document.getElementById('chart'), 'dark')

  try {
    // 请求地图的数据
    const result = await axios.get('http://localhost:4001/map/china.json')

    // 使用echarts注册地图数据
    proxy.$echarts.registerMap('chinaMap', result.data)

    // 配置并渲染地图数据
    const option = {
      geo: {
        type: 'map',
        map: 'chinaMap',
        roam: true,
        label: {
          show: true
        }
      }
    }
    echartsInstance.value.setOption(option)
  } catch (e) {
    console.log(e)
  }
}

// 2. 获取后台返回的数据
const getData = async () => {
  try {
    const result = await getMap()
    resultData.value = result
  } catch (e) {
    console.log(e)
  }
  updateChart()
}

// 3. 更新图表的配置项以及渲染
const updateChart = () => {
  const legendData = resultData.value.map((item) => item.name)

  const seriesArr = resultData.value.map((item) => {
    return {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      name: item.name,
      data: item.children,
      rippleEffect: { scale: 10, brushType: 'stroke' }
    }
  })

  const dataOption = {
    legend: {
      data: legendData,
      left: '5%',
      bottom: '5%',
      orient: 'vertical'
    },
    series: seriesArr
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

<style scoped></style>
