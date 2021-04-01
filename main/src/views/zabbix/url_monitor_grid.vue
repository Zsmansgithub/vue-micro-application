<template>
  <monitor_grid :title='`星辰URL监控`' :dataList=dataList :dataSet.sync=dataList />
</template>

<script>
import monitor_grid from './monitor_grid'
const formatter = function(item) {
      return `<div style="padding: 10px;"><div style="text-align: center;padding-bottom: 10px">${item.app_name}</div>
                <div style="padding-bottom: 5px;display: flex"><div style="flex: 0 0 50px;padding-right: 10px">可用率: </div><div style="flex: 1;text-align: center">${(((item.ins_count - item.ins_error_count)/item.ins_count) * 100 || 0).toFixed(2) * 1}</div></div>
                <div style="padding-bottom: 5px;display: flex"><div style="flex: 0 0 50px;padding-right: 10px">总实例: </div><div style="flex: 1;text-align: center">${item.ins_count}</div></div>
                <div style="padding-bottom: 5px;display: flex"><div style="flex: 0 0 50px;padding-right: 10px">异常数: </div><div style="flex: 1;text-align: center">${item.ins_error_count}</div></div>
                <div style="padding-bottom: 5px;display: flex"><div style="flex: 0 0 50px;padding-right: 10px">联系人: </div><div style="flex: 1;text-align: center;white-space:pre-wrap;word-break: break-word">${item.sms_list}</div></div>
                <div style="padding-bottom: 5px;display: flex"><div style="flex: 0 0 50px;padding-right: 10px">异常IP: </div><div style="flex: 1;text-align: center;white-space:pre-wrap;word-break: break-word">${item.error_ips || '--'}</div></div></div>`
    }
  export default {
    data() {
      const HEAPMAP_XAXIS_L = 14;
      const HEAPMAP_YAXIS_L1 = 8;
      const dataList = [
        {"app_name":["公网"],"title":["公网"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L},
        {"app_name":["运营"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["运营"]},
        {"app_name":["结算"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["结算"]},
        {"app_name":["url监控"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["url监控"]},
        {"app_name":["订单"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["订单"]},
        {"app_name":["子系统"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["子系统"]},
        {"app_name":["基础服务"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["基础服务"]},
        {"app_name":["驿站"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["驿站"]},
        {"app_name":["基础平台","BI","大数据应用"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["基础平台","BI","大数据应用"]},
        {"app_name":["系统运营组"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["系统运营组"]},
        {"app_name":["走件-路由-问题件-超区件"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["走件-路由-问题件-超区件"]},
        {"app_name":["经营","主数据","OA","网点管家"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["经营","主数据","OA","网点管家"]}
      ];
      return {
        dataList: Object.freeze(dataList),
        dataSet: [...dataList]
      }
    },
    components: {
      monitor_grid
    },
    provide: {
      linkDetail: (params) => {
          return {name: 'url_check', params: {
                        id: params.id
                    }}
        },
      formatter: formatter,
      fetchType: 'url',
      fullScreenRoute: (level) => { return {name: 'url_fullscreen_grid', query: { level: level }} },
    }
  }
</script>

<style lang="scss"  rel="stylesheet/scss"  scoped>
</style>
