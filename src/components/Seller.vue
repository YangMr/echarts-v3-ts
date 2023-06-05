<template>
  <div class="container">
    <div class="chart" id="seller"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { getSeller } from '@/api/seller'
// import chalkJson from '@/theme/chalk.json'

// 结构出proxy, 通过proxy可以获取全局定义的属性与方法
const { proxy } = getCurrentInstance()
// 创建一个变量,用来保存echarts的实例对象
const echartsInstance = shallowRef(null)
// 创建一个变量,保存获取到的商品销售数据
const resultAllData = ref<any>()
// 页码
const currentPage = ref(1)
// 条数
const pageSize = ref(5)
// 总页码
const totalPage = ref(0)
// 每页保存的数据
const showData = ref([])
// 创建一个变量,用来保存定时器
let timerId = ref<any>()

// dom加载完毕之后在触发
onMounted(() => {
  initCharts()
  getData()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})

// 1. 初始化echarts实例对象
const initCharts = () => {
  // echartsInstance.value = proxy.$echarts.init(document.getElementById('seller'), 'dark')
  // proxy.$echarts.registerTheme('chalk', chalkJson)
  echartsInstance.value = proxy.$echarts.init(document.getElementById('seller'), 'chalk')

  const option = {
    title: {
      text: '▎ 商家销量排行',
      left: 20,
      top: 20,
      textStyle: {
        fontSize: 66
      }
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '6',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: 66,
        itemStyle: {
          barBorderRadius: [0, 33, 33, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#5052EE' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#AB6EE5' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        label: {
          show: true,
          position: 'right',
          textStyle: {
            color: '#fff'
          }
        }
      }
    ]
  }

  echartsInstance.value.setOption(option)

  // 鼠标移入事件
  echartsInstance.value.on('mouseover', () => {
    clearInterval(timerId.value)
  })
  // 鼠标移出事件
  echartsInstance.value.on('mouseout', () => {
    startInterval()
  })
}

// 2. 获取后台返回的图表数据
const getData = async () => {
  try {
    const result = await getSeller()
    resultAllData.value = result

    // 从小到大排序
    resultAllData.value.sort((a, b) => {
      return b.value - a.value
    })

    // 计算总页码
    totalPage.value =
      resultAllData.value.length % 5 === 0
        ? resultAllData.value.length / 5
        : resultAllData.value.length / 5 + 1

    updateChart()

    startInterval()
  } catch (e) {
    console.log(e)
  }
}

// 3. 配置图表并进行渲染
const updateChart = () => {
  // 分页获取数据
  const start = (currentPage.value - 1) * pageSize.value
  const end = pageSize.value * currentPage.value
  showData.value = resultAllData.value.slice(start, end)

  // 获取所有name的数据
  const selleNames = showData.value.map((item) => item.name)
  // 获取所有value的数据
  const selleValues = showData.value.map((item) => item.value)

  // 图表配置项
  const option = {
    yAxis: {
      data: selleNames
    },
    series: [
      {
        data: selleValues
      }
    ]
  }

  // 渲染图表
  echartsInstance.value.setOption(option)
}

// 动态加载分页数据
const startInterval = () => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
  timerId.value = setInterval(() => {
    currentPage.value++

    // 如果当前的页面等于总页面,说明数据已经加载完必, 这个时候就重新加载第一页的数据
    if (totalPage.value === currentPage.value) {
      currentPage.value = 1
    }

    updateChart()
  }, 3000)
}

// 当浏览器窗口发生变化会触发的方法的
const screenAdapter = () => {
  const titleFontSize = (document.getElementById('seller')?.offsetWidth / 100) * 3.6
  const dataOptions = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    series: [
      {
        barWidth: titleFontSize,
        itemStyle: {
          barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
        }
      }
    ]
  }
  echartsInstance.value.setOption(dataOptions)
  echartsInstance.value.resize()
}

// 组件销毁触发的钩子函数
onBeforeUnmount(() => {
  clearInterval(timerId.value)
  window.removeEventListener('resize', screenAdapter)
})
</script>

<style scoped></style>
