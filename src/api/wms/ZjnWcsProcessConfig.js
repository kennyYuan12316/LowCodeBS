import request from '@/utils/request'

// 获取流程引擎信息
export function GetInfo(id) {
  return request({
    url: `/api/wms/ZjnWcsProcessConfig/${id}`,
    method: 'get'
  })
}
// 删除流程引擎
export function Delete(id) {
  return request({
    url: `/api/wms/ZjnWcsProcessConfig/${id}`,
    method: 'DELETE'
  })
}
// 新建流程引擎
export function Create(data) {
  return request({
    url: `/api/wms/ZjnWcsProcessConfig`,
    method: 'post',
    data
  })
}
//  更新流程引擎
export function Update(data) {
  return request({
    url: `/api/wms/ZjnWcsProcessConfig/${data.id}`,
    method: 'PUT',
    data
  })
}

