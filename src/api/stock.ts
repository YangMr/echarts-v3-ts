import server from '@/utils/http'

/**
 * 获取库存与销量分析数据
 */
export const getStock = () => {
  return server({
    url: '/stock',
    method: 'GET'
  })
}
