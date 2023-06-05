// 全局组册echarts
import * as echarts from 'echarts'
import chalkJson from '@/theme/chalk.json'
import macaronsJson from '@/theme/macarons.json'
export default function registerTheme() {
  echarts.registerTheme('chalk', chalkJson)
  echarts.registerTheme('macarons', macaronsJson)
}
