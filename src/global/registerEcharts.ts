// 全局组册echarts
import * as echarts from 'echarts'
import type { App } from 'vue'
export default function registerEcharts(app: App) {
  app.config.globalProperties.$echarts = echarts
}
