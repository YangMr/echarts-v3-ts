import server from '@/utils/http'

/**
 * 获取热销商品占比数据
 */
export const getHot = () => {
  return server({
    url: '/hotproduct',
    method: 'GET'
  })
}
