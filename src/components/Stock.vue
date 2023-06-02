<template>
  <div class="container">
    <div class="chart" id="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, getCurrentInstance } from 'vue'
import { getStock } from '@/api/stock'

// 获取proxy
const { proxy } = getCurrentInstance()

// 创建一个变量,保存echarts实例化的对象
const echartsInstance = ref(null)

// 创建一个变量, 保存请求到的数据
const resultAllData = ref<any>()

const currentPage = ref(1)
const timerId = ref<any>()
const titleFontSize = ref(0)
// const showData = ref([])

// 1. 初始化echarts实例对象
const initChart = () => {
  echartsInstance.value = proxy.$echarts.init(document.getElementById('chart'), 'dark')

  const option = {
    title: {
      text: '▎库存销售量',
      left: 20,
      top: 20
    },
    label: {
      show: true,
      position: 'center'
    }
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
    const result = await getStock()
    console.log('result', result)
    resultAllData.value = result
  } catch (e) {
    console.log(e)
  }

  updateChart()
  startInterval()
}

// 3. 更新图表的配置项以及渲染
const updateChart = () => {
  const centerPointers = [
    ['18%', '40%'],
    ['50%', '40%'],
    ['82%', '40%'],
    ['34%', '75%'],
    ['66%', '75%']
  ]

  const colorArrs = [
    ['#4FF778', '#0BA82C'],
    ['#E5DD45', '#E8B11C'],
    ['#E8821C', '#E55445'],
    ['#5052EE', '#AB6EE5'],
    ['#23E5E5', '#2E72BF']
  ]

  const startValue = (currentPage.value - 1) * 5
  const endValue = currentPage.value * 5

  const showData = resultAllData.value.slice(startValue, endValue)

  const seriesArr = showData.map((item, index) => {
    return {
      type: 'pie',
      radius: [110, 100],

      labelLine: { show: false },
      hoverAnimation: false,
      center: [centerPointers[index][0], centerPointers[index][1]],
      data: [
        {
          name: `${item.name} \n\n ${item.sales}`,
          label: {
            show: true,
            position: 'center',
            color: colorArrs[index][0],
            fontSize: titleFontSize.value / 2
          },
          value: item.sales,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: colorArrs[index][0] // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: colorArrs[index][1] // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          value: item.stock,
          itemStyle: {
            color: '#333'
          }
        }
      ]
    }
  })

  const dataOption = {
    series: seriesArr
  }
  echartsInstance.value.setOption(dataOption)
}

// 4. 图表进行自适应
const screenAdapter = () => {
  titleFontSize.value = (document.getElementById('chart')?.offsetWidth / 100) * 3.6
  console.log('size', titleFontSize.value)

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    series: [
      {
        radius: [titleFontSize.value * 2, titleFontSize.value * 2 * 1.125],
        label: { fontSize: titleFontSize.value / 2 }
      },
      {
        radius: [titleFontSize.value * 2, titleFontSize.value * 2 * 1.125],
        label: { fontSize: titleFontSize.value / 2 }
      },
      {
        radius: [titleFontSize.value * 2, titleFontSize.value * 2 * 1.125],
        label: { fontSize: titleFontSize.value / 2 }
      },
      {
        radius: [titleFontSize.value * 2, titleFontSize.value * 2 * 1.125],
        label: { fontSize: titleFontSize.value / 2 }
      },
      {
        radius: [titleFontSize.value * 2, titleFontSize.value * 2 * 1.125],
        label: { fontSize: titleFontSize.value / 2 }
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

// 7. 创建定时器,实现图表的切换
const startInterval = () => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
  timerId.value = setInterval(() => {
    currentPage.value++
    if (currentPage.value > 2) {
      currentPage.value = 1
    }
    updateChart()
  }, 2000)
}
</script>

<style scoped></style>
