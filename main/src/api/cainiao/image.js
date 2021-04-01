import request from '@/utils/request2'

export function getImageList(query) {
  return request({
    url: '/cainiao/get_image',
    method: 'get',
    params: query
  })
}
