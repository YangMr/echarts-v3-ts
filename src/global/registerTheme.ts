// 全局组册echarts
import * as echarts from 'echarts'
import chalkJson from '@/theme/chalk.json'
export default function registerTheme() {
  echarts.registerTheme('chalk', chalkJson)
}
