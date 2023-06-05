<template>
  <div class="container">
    <div class="chart" id="rank"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { getRank } from '@/api/rank'
const { proxy } = getCurrentInstance()

// 创建一个变量,保存echarts实例化的对象
const echartsInstance = shallowRef(null)

// 创建一个变量, 保存请求到的数据
let resultAllData = ref<any>()

const startValue = ref(0)
const endValue = ref(9)
const timerId = ref<any>()

// 1. 初始化echarts实例对象
const initChart = () => {
  echartsInstance.value = proxy.$echarts.init(document.getElementById('rank'), 'chalk')

  const option = {
    title: {
      text: '▎地区销售排行',
      left: 20,
      top: 20
    },
    tooltip: {
      show: true
    },
    grid: {
      top: '40%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          rotate: 45
        }
      }
    ]
  }

  echartsInstance.value.setOption(option)

  echartsInstance.value.on('mouseover', () => {
    clearInterval(timerId.value)
  })

  echartsInstance.value.on('mouseout', () => {
    startInterval()
  })
}

// 2. 获取后台返回的数据
const getData = async () => {
  try {
    const result = await getRank()
    resultAllData.value = result

    // 将数据从大到小进行排序
    resultAllData.value.sort((a, b) => {
      return b.value - a.value
    })
  } catch (e) {
    console.log(e)
  }

  updateChart()
  startInterval()
}

// 3. 更新图表的配置项以及渲染
const updateChart = () => {
  // 获取x轴的数据
  const provinceArr = resultAllData.value.map((item) => item.name)

  // 获取y轴的数据
  const valueArr = resultAllData.value.map((item) => item.value)

  const colorArr = [
    ['#0BA82C', '#4FF778'], // 300 柱子的颜色
    ['#2E72BF', '#23E5E5'], // 200  柱子的颜色
    ['#5052EE', '#AB6EE5'] // 柱子的颜色
  ]
  const dataOption = {
    xAxis: {
      data: provinceArr
    },
    dataZoom: {
      show: false,
      startValue: startValue.value,
      endValue: endValue.value
    },
    series: [
      {
        data: valueArr,
        itemStyle: {
          color: (arg) => {
            let targetColor = colorArr[0]
            console.log('arg=>', arg)
            if (arg.value >= 300) {
              targetColor = colorArr[0]
            } else if (arg.value >= 200) {
              targetColor = colorArr[1]
            } else {
              targetColor = colorArr[2]
            }

            return new proxy.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: targetColor[0] },
              { offset: 1, color: targetColor[1] }
            ])
          }
        }
      }
    ]
  }
  echartsInstance.value.setOption(dataOption)
}

// 4. 图表进行自适应
const screenAdapter = () => {
  const titleFontSize = (document.getElementById('rank')?.offsetWidth / 100) * 3.6

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        barWidth: titleFontSize,
        itemStyle: {
          barBorderRadius: [0.5 * titleFontSize, 0.5 * titleFontSize, 0, 0]
        }
      }
    ]
  }
  echartsInstance.value.setOption(adapterOption)
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
  clearInterval(timerId.value)
})

// 7. 创建定时器,实现柱状图切换
const startInterval = () => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }

  timerId.value = setInterval(() => {
    startValue.value++
    endValue.value++
    if (endValue.value > resultAllData.value.length - 1) {
      startValue.value = 0
      endValue.value = 9
    }
    updateChart()
  }, 1000)
}
</script>

<style scoped></style>
