<template>
  <div class="container" @dblclick="revertMap">
    <div class="chart" id="map"></div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onBeforeUnmount, onMounted, ref, getCurrentInstance, shallowRef, defineExpose } from 'vue'
import { getProvinceMapInfo } from '@/utils/map_utils.js'
import { getMap } from '@/api/map'
const { proxy } = getCurrentInstance()

// 创建一个变量,保存echarts实例化的对象
const echartsInstance = shallowRef(null)

// 创建一个变量, 保存请求到的商家分布数据
let resultData = ref<any>()

// 1. 初始化echarts实例对象
const initChart = async () => {
  echartsInstance.value = proxy.$echarts.init(document.getElementById('map'), 'chalk')

  try {
    // 请求地图的数据
    const result = await axios.get('/map/china.json')

    // 使用echarts注册地图数据
    proxy.$echarts.registerMap('chinaMap', result.data)

    // 配置并渲染地图数据
    const option = {
      title: {
        text: '▎商家分布',
        left: 20,
        top: 20
      },
      geo: {
        type: 'map',
        map: 'chinaMap',
        top: '5%',
        bottom: '5%',
        itemStyle: {
          areaColor: '#2E72BF',
          borderColor: '#333'
        },
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

  // 给所有的地图模块添加点击事件
  echartsInstance.value.on('click', async function (arg) {
    const provinceInfo = getProvinceMapInfo(arg.name)
    console.log('provinceInfo==>', provinceInfo)
    try {
      const result = await axios({ url: provinceInfo.path })

      // 使用echarts注册地图数据
      proxy.$echarts.registerMap(provinceInfo.key, result.data)

      const dataOption = {
        geo: {
          map: provinceInfo.key
        }
      }

      echartsInstance.value.setOption(dataOption)
    } catch (e) {
      console.log(e)
    }
  })
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
  const titleFontSize = (document.getElementById('map')?.offsetWidth / 100) * 3.6

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    legend: {
      itemWidth: titleFontSize / 2,
      itemHeight: titleFontSize / 2,
      itemGap: titleFontSize / 2,
      textStyle: {
        fontSize: titleFontSize / 2
      }
    }
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
})

// 双击返回上一级地图
const revertMap = () => {
  console.log('123')
  echartsInstance.value.setOption({
    geo: { map: 'chinaMap' }
  })
}

defineExpose({
  screenAdapter
})
</script>

<style scoped></style>
