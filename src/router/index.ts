import { createRouter, createWebHistory } from 'vue-router'
// import SellerPage from '@/views/SellerPage.vue'
import TrendPage from '@/views/TrendPage.vue'
// import MapPage from '@/views/MapPage.vue'
// import RankPage from '@/views/RankPage.vue'
// import HotPage from '@/views/HotPage.vue'
// import StockPage from '@/views/StockPage.vue'
import ScreenPage from '@/views/ScreenPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/screenpage'
    },
    {
      path: '/screenpage',
      name: 'screenpage',
      component: ScreenPage
    },
    // {
    //   path: '/sellerpage',
    //   name: 'sellerpage',
    //   component: SellerPage
    // },
    {
      path: '/trendpage',
      name: 'trendpage',
      component: TrendPage
    }
    // {
    //   path: '/mappage',
    //   name: 'mappage',
    //   component: MapPage
    // },
    // {
    //   path: '/rankpage',
    //   name: 'rankpage',
    //   component: RankPage
    // },
    // {
    //   path: '/hotpage',
    //   name: 'hotpage',
    //   component: HotPage
    // },
    // {
    //   path: '/stockpage',
    //   name: 'stockpage',
    //   component: StockPage
    // }
  ]
})

export default router
