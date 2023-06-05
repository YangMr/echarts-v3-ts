import type { App } from 'vue'
import registerEcharts from '@/global/registerEcharts'
import registerTheme from '@/global/registerTheme'

export const globalRegister = {
  install(app: App) {
    app.use(registerEcharts)
    app.use(registerTheme)
  }
}
