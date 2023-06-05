<template>
  <div class="screen-container">
    {{ name }} -- {{ age }}
    <button @click="changeName">change</button>
    <button @click="resetName">reset</button>
    <div class="screen-header">
      <div class="header-bg">
        <img
          src="https://www.bookbook.cc/vue2/data-view/img/header_border_dark.60ff0f66.png"
          alt="header-bg"
        />
      </div>
      <span class="logo">
        <a href="https://www.baidu.com">bookbook.cc</a>
      </span>
      <span class="title"> 电商平台实时监控系统 </span>
      <div class="tools">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAcCAYAAAAJKR1YAAAE5ElEQVRYR92Xf0zUdRjHX5+7E8oU0JNLCbE0YikmW3+Ym0j90chBC6qVPwriR5u5lVqJP6BSG6jlkl9z4Bxt2RpkdX+x1i81XaJoG3VqAc6fc07/EAXuOLg7P+35ckeId+oBrq3Pxj/H83m+r+f5PM/7+XwUIZbWeizwOlAETBli5gJ+A5qBNuCq//8TgSRgLjAPEB+Dlwf4BihVSp0O9mkV7Eet9X3AC8AmIBEIZtcLCJgb8Pr9WADZ+wAQESLWTqAe2KKUOjPU5pYPaa3F2StACfBICJhQib3b3yUQuz/gdqWUDmy8CUhrHQ3kAKuBqXfrfZh2fcBPwHrguFLqhvgZANJay/kXACuBuGF+JNxtctT7gI+AIwJlAGmtbcAyYDnwYLheR2gvUE3+EmlSWuuHgHf82bGO0Plwt/uAP4EPBegzf938VzCBIARqnwCJHkg3hbV8vhv4fF45bpQy0d3dRWtrO7NnJzNunDTqsNYfArQbyPZrxx29eDwezp45z8GDh2hta6fX3UtkZCSnT5/lUNMBlixeSklJEdEx0rBhrbPANgGaBawBXgqirDd5dLlcVFbUsHNnLZevXMLT5wNlxmwy4/F68PmcxMfPwG7fQ0rKbC5cuEhERARxcZNRKqgGGz0FiECWAnsESCwTgLXAEiAqWFwej5ey0m188ulmQyvmzHmSOSkpjB8/HrPZxLlzkrUD5OflsXr1Ck6cbKWgoACbbQr19V8QGzspmFuBafULpF0p5R6sQ9Jt7wJ5wITBu6VOmo/8TlZ2Np2d11m/7gPeWl7IhAkxhpkE393tpK3tFElJjzF27P00Nv5Ibu4b9PR0s317JYWFOZjN5sFupYj/BoqB75VSIpQ3zyit9WTgbeBNIDaw2+12s3LFWnbt2kFGZhZ1dTVYraKjodf1651s2LCZ6uoKUucv4Dt7AzH9dSVZkfl3zJ+Z/UqpwCy8dWhqrSW3kiWBmiZDsqPjGpmZ2TgcDqqrKln62qtDow1K1tJynPT0hdhsNvb+8gOxNuPY5GbwNbALaFFKSaYGVqhpL337FCAa9cTVqx1kZmThcBynsqqC3NwlmEymO7ZQS4uD9PQMJlknsm//z9j6geTaIgGfGjxUA85Cl37/8X0FPNPT4+b994qpqa3k6bRnqfu8hoSEqbfrHJxOF8XFH1NdvZ3U1DTsxpEZNbdXmkcpdTlYRLcDkkuZ3FsWSFEfbjpG9otZXLvWwcaNZaxatRwRR4fjJNOmxRv1oVBGgTidThoa7BQXr8Pr7aO8vIqcnEVYLHJdYr8f6FK4QDLxBShVNkoXrVlTQnNzM1u3ljFv3lxqa+oorygnMTGJ5ORkxljG4Opx0db2F0ePHsXl6iI/fxlbt2wkKnpATX4FFiulRgYkWerq6jb+bLZYzp+/wMLnnqf91AmUGoPJFGlcHLUGi9mC1WolLz+foqKVRP8LI7GNDtDQ9Hq9Xr7cXc+mTWU8PnMmycmz6OvrM45lxvSHSUubz6OJ0wPHNLje7g2QAIp6OxwniI+PIyoqCo02dMRstmCxmA0IyWy/eA6U670DumPfBzf4fwE1APOHmYlQ2w4Ai4bTZTJsv/U/+kaT6TDwslLqYrg6JJd9mTcZo/g2k6dOI1ColLoSLpC8POXBuGEUn0WSFXkNNwSuG0Oh/gGZwdluiGcpbAAAAABJRU5ErkJggg=="
          alt="hf"
        />
        <span class="datetime">2023/6/5 09:01:57</span>
      </div>
    </div>
    <div class="screen-body">
      <div class="screen-left">
        <div class="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!--地区销量趋势图表-->
          <Trend ref="trendRef"></Trend>

          <!--  全屏箭头  -->
          <div class="resize" @click="handleToggleScreen('trend')">
            <span class="iconfont">{{ fullScreenStatus.trend ? '&#xe825;' : '&#xe826;' }}</span>
          </div>
        </div>
        <div class="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!--商家销售统计图表-->
          <Seller ref="sellerRef"></Seller>

          <!--  全屏箭头  -->
          <div class="resize" @click="handleToggleScreen('seller')">
            <span class="iconfont">{{ fullScreenStatus.trend ? '&#xe825;' : '&#xe826;' }}</span>
          </div>
        </div>
      </div>
      <div class="screen-middle">
        <div class="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <IMap ref="mapRef"></IMap>

          <!--  全屏箭头  -->
          <div class="resize" @click="handleToggleScreen('map')">
            <span class="iconfont">{{ fullScreenStatus.trend ? '&#xe825;' : '&#xe826;' }}</span>
          </div>
        </div>
        <div class="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <Rank ref="rankRef"></Rank>

          <!--  全屏箭头  -->
          <div class="resize" @click="handleToggleScreen('rank')">
            <span class="iconfont">{{ fullScreenStatus.trend ? '&#xe825;' : '&#xe826;' }}</span>
          </div>
        </div>
      </div>
      <div class="screen-right">
        <div class="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!--热销商品占比-->
          <Hot ref="hotRef"></Hot>

          <!--  全屏箭头  -->
          <div class="resize" @click="handleToggleScreen('hot')">
            <span class="iconfont">{{ fullScreenStatus.trend ? '&#xe825;' : '&#xe826;' }}</span>
          </div>
        </div>
        <div class="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存和销量分析-->
          <Stock ref="stockRef"></Stock>

          <!--  全屏箭头  -->
          <div class="resize" @click="handleToggleScreen('stock')">
            <span class="iconfont">{{ fullScreenStatus.trend ? '&#xe825;' : '&#xe826;' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Trend from '@/components/Trend.vue'
import Seller from '@/components/Seller.vue'
import IMap from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Hot from '@/components/Hot.vue'
import Stock from '@/components/stock.vue'
import { reactive, ref, nextTick, getCurrentInstance } from 'vue'

import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
const store = useUsersStore()
const { name, age } = storeToRefs(useUsersStore())

// const name = ref<string>(store.name)
// const age = ref<number>(store.age)

console.log('aaa=>', store.getName)

const changeName = () => {
  store.saveName('hahah')
  //   store.$state ={}
  // store.age = 200
  // store.name = 'rose'

  console.log(' store.age', store.age)
}

const resetName = () => {
  store.$reset()
}

// console.log('store name => ', store.name)
// console.log('store age => ', store.age)
// const name = ref<string>(store.name)
// const age = ref<number>(store.age)

const { proxy }: any = getCurrentInstance()

const fullScreenStatus = reactive({
  trend: false,
  seller: false,
  map: false,
  rank: false,
  hot: false,
  stock: false
})

const handleToggleScreen = (arg: string) => {
  fullScreenStatus[arg] = !fullScreenStatus[arg]
  nextTick(() => {
    proxy.$refs[arg + 'Ref'].screenAdapter()
  })
}
</script>

<style scoped>
.fullscreen {
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1000 !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
}

.screen-container {
  width: 100%;
  height: 100%;
  background-color: #161522;
  color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
.screen-header {
  position: relative;
  font-size: 20px;
}
.screen-header .header-bg img {
  width: 100%;
}
.screen-header .logo {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-80%);
}
.screen-header .logo a {
  text-decoration: none;
  color: #fff;
}
.screen-header .title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -40%);
}
.screen-header .tools {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-80%);
  display: flex;
  align-items: center;
}
.screen-header .tools img {
  width: 28px;
  height: 21px;
  cursor: pointer;
}
.screen-header .tools .datetime {
  font-size: 15px;
  margin-left: 10px;
}
.screen-body {
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 10px;
}
.screen-left {
  /*flex : 1;*/
  width: 27.6%;
  height: 100%;
}
.screen-middle {
  /*flex : 2;*/
  width: 41.5%;
  height: 100%;
  margin-left: 1.6%;
  margin-right: 1.6%;
}
.screen-right {
  /*flex : 1;*/
  width: 27.6%;
  height: 100%;
}
.left-top {
  width: 100%;
  height: 53%;
  position: relative;
}
.left-bottom {
  height: 31%;
  width: 100%;
  margin-top: 25px;
  position: relative;
}
.middle-top {
  width: 100%;
  height: 56%;
  position: relative;
}
.middle-bottom {
  width: 100%;
  height: 28%;
  margin-top: 25px;
  position: relative;
}
.right-top {
  width: 100%;
  height: 46%;
  position: relative;
}
.right-bottom {
  width: 100%;
  height: 38%;
  margin-top: 25px;
  position: relative;
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
