import server from '@/utils/http'

/**
 * 获取地区销量趋势数据
 */
export const getTrend = () => {
  return server({
    url: '/trend',
    method: 'GET'
  })
}
