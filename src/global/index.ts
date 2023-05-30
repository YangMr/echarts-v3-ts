import type { App } from 'vue'
import registerEcharts from '@/global/registerEcharts'

export const globalRegister = {
  install(app: App) {
    app.use(registerEcharts)
  }
}
