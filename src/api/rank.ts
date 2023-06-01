import server from '@/utils/http'

/**
 * 获取商家排行数据
 */
export const getRank = () => {
  return server({
    url: '/rank',
    method: 'GET'
  })
}
