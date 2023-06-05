<template>
  <div class="container">
    <div id="hot" class="chart"></div>
    <span :style="customStyle" class="iconfont arr_left" @click="handleToLeft">&#xe6ef;</span>
    <span :style="customStyle" class="iconfont arr_right" @click="handleToRight">&#xe6ed;</span>
    <span :style="customStyle" class="category-name">{{ catName }}</span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, getCurrentInstance, ref, computed, shallowRef } from 'vue'
import { getHot } from '@/api/hot'

// 获取proxy
const { proxy } = getCurrentInstance()

// 创建一个变量,保存echarts实例化的对象
const echartsInstance = shallowRef(null)

// 创建一个变量, 保存请求到的数据
const resultAllData = ref<any>()

// 创建一个变量,用来控制切换加载的数据
const currentIndex = ref(0)

// 创建一个变量,保存动态的字体大小
const titleFontSize = ref(0)

// 1. 初始化echarts实例对象
const initChart = () => {
  echartsInstance.value = proxy.$echarts.init(document.getElementById('hot'), 'chalk')

  const option = {
    title: {
      text: '▎热销商品占比',
      left: 20,
      top: 20
    },
    legend: {
      top: '15%',
      icon: 'circle'
    },
    series: [
      {
        type: 'pie',
        label: {
          show: true,
          formatter: '{b} {d}%'
        },
        labelLine: {
          show: true
        }
      }
    ]
  }

  echartsInstance.value.setOption(option)
}

// 2. 获取后台返回的数据
const getData = async () => {
  try {
    const result = await getHot()
    resultAllData.value = result
  } catch (e) {
    console.log(e)
  }
  updateChart()
}

// 3. 更新图表的配置项以及渲染
const updateChart = () => {
  const seriesArr = resultAllData.value[currentIndex.value].children.map((item) => {
    return {
      name: item.name,
      value: item.value,
      children: item.children
    }
  })

  const legendData = resultAllData.value[currentIndex.value].children.map((item) => item.name)
  console.log('legendData', legendData)

  const dataOption = {
    legend: {
      data: legendData
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        console.log('params', params)
        const arr = []
        params.data.children.map((item) => {
          let childStr = `${item.name}&nbsp;&nbsp;&nbsp; ${(
            (item.value / params.value) *
            100
          ).toFixed(2)}%`
          console.log('childStr', childStr)
          arr.push(childStr)
        })
        return arr.join('<br/>')
      }
    },
    series: [
      {
        data: seriesArr
      }
    ]
  }

  echartsInstance.value.setOption(dataOption)
}

// 4. 图表进行自适应
const screenAdapter = () => {
  titleFontSize.value = (document.getElementById('hot')?.offsetWidth / 100) * 3.6

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    series: [
      {
        radius: titleFontSize.value * 4.5,
        center: ['50%', '60%']
      }
    ],
    legend: {
      itemWidth: titleFontSize.value / 2,
      itemHeight: titleFontSize.value / 2,
      itemGap: titleFontSize.value / 2,
      textStyle: {
        fontSize: titleFontSize.value / 2
      }
    }
  }
  echartsInstance.value.setOption(adapterOption)

  echartsInstance.value.resize()
}

const customStyle = computed(() => {
  return { fontSize: titleFontSize.value + 'px' }
})

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

// 点击左箭头
const handleToLeft = () => {
  currentIndex.value--
  if (currentIndex.value < 0) {
    currentIndex.value = resultAllData.value.length - 1
  }
  updateChart()
}
// 点击右箭头
const handleToRight = () => {
  currentIndex.value++
  if (currentIndex.value > resultAllData.value.length - 1) {
    currentIndex.value = 0
  }
  updateChart()
}

const catName = computed(() => {
  if (!resultAllData.value) {
    return ''
  } else {
    return resultAllData.value[currentIndex.value].name
  }
})
</script>

<style scoped>
.container {
  position: relative;
}
.arr_left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.arr_right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.category-name {
  position: absolute;
  left: 80%;
  bottom: 5%;
  font-weight: bold;
  color: #fff;
}
</style>
