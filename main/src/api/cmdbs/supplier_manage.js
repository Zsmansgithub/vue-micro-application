import request from '@/utils/request2'

export function getSupplierManage(query) {
  return request({
    url: '/cmdb/get_supplier_manage',
    method: 'get',
    params: query
  })
}

export function AddSupplierManage(data) {
  return request({
    url: '/cmdb/add_supplier_manage',
    method: 'post',
    data
  })
}

export function deleteSupplierManage(row_id) {
  return request({
    url: '/cmdb/delete_supplier_manage/' + row_id,
    method: 'delete'
  })
}

export function editSupplierManage(row_id, data) {
  return request({
    url: 'cmdb/edit_supplier_manage/' + row_id,
    method: 'put',
    data
  })
}
