<template>
  <monitor_grid :title='`星辰服务器告警`' :type='`server`' :dataList=dataList :dataSet.sync=dataList />
</template>

<script>
  import monitor_grid from '@/views/zabbix/monitor_grid';
  const formatter = function(item) {
            let errorDetail = ''
            const error_data = item.error_data || []
            const sty = {
                over: `overflow: hidden;white-space: nowrap;text-overflow: ellipsis;`,
                item: `padding-bottom: 5px;display: flex;`,
                item_title: `flex: 0 0 110px;padding-right: 10px;`,
                item_content: `flex: 1;text-align: center;`,
                title: `text-align: center;padding-bottom: 10px;`,
                detailItem: `display: grid;grid-template-columns: minmax(100px, 100px) minmax(70px, 70px) 1fr`
              }
            try {
              if(error_data.length === 0) {
                  errorDetail = `--`
                } else {
                  errorDetail += `<div style="flex: 1;">`
                  errorDetail += `<div style="${sty.detailItem}">`
                  errorDetail += `<div>IP</div>`
                  errorDetail += `<div>等级</div>`
                  errorDetail += `<div>描述</div>`
                  errorDetail += `</div>`
                  const vnode = error_data.reduce((vnode, i) => {
                    vnode += `<div style="${sty.detailItem}">`
                    vnode += `<div>${i.host_name}</div>`
                    vnode += `<div>${i.priority}</div>`
                    // vnode += `<div style="overflow: hidden;word-break: break-all;white-space:pre-wrap">${i.description}</div>`
                    vnode += `<div style="${sty.over}">${i.description}</div>`
                    vnode += '</div>'
                    return vnode
                  }, '')
                  errorDetail += vnode
                  errorDetail += `</div>`
                }
            } catch {
              errorDetail = '--'
            }
            return `<div style="${sty.title}${sty.over}">${item.app_name}</div>
                      <div style="${sty.item}${sty.over}">
                        <div style="${sty.item_title}">异常数/总实例: </div>
                        <div style="${sty.item_content}">${item.ins_error_count}/${item.ins_count}</div>
                      </div>
                      <div style="${sty.item}${sty.over}">
                        <div style="${sty.item_title}">负责人</div>
                        <div style="${sty.item_content}">${(item.owner && item.owner.length && item.owner.join(',')) || '--'}</div>
                      </div>
                      <div style="${sty.over}">
                        <div>异常信息:</div>
                        ${errorDetail}
                      </div>
                      </div>`
          }
  export default {
    data() {
      const HEAPMAP_XAXIS_L = 22;
      const HEAPMAP_YAXIS_L1 = 13;
      const dataList = [
        {"app_name":["网点管家"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["网点管家"]},
        {"app_name":["基础服务"],"title":["基础服务"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L},
        {"app_name":["应用中台"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["应用中台"]},
        {"app_name":["结算"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["结算"]},
        {"app_name":["技术运营组"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["技术运营组"]},
        {"app_name":["订单"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["订单"]},
        {"app_name":["运营"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["运营"]},
        {"app_name":["网点操作开发组"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["网点操作开发组"]},
        {"app_name":["行者", "驿站"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["行者", "驿站"]},
        {"app_name":["大数据应用", "网点操作", "研发支持"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["大数据应用", "网点操作", "研发支持"]},
        {"app_name":["信息安全组", "企业应用组", "技术架构组"],"HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,"title":["信息安全组", "企业应用组", "技术架构组"]},
        {"app_name":
        [
          "基础平台",
          "pc端系统",
          "数据平台组",
          "西安速递",
          "财务管理中心",
          "所有开发组",
          "应用运维组",
          "接口平台",
          "官网",
          "数据仓库组",
          "新数据分发平台",
          "技术服务组",
          "新门户",
          "关务",
          "会员",
          "测试组",
          "仓配一体管理平台",
          "项目管理部",
          "广目系统",
          "爬虫系统",
          "新零售开发",
          "项目管理工具",
          "创新研发",
          "中心操作组",
          "数据库管理组",
          "DevOps平台",
          "安全开发组",
          "同步平台",
          "主机存储系统组",
          "运营平台开发组",
        ],
        "HEAPMAP_YAXIS_L":HEAPMAP_YAXIS_L1,"HEAPMAP_XAXIS_L":HEAPMAP_XAXIS_L,
        "title":["其他"]}
      ];
      return {
        dataList: Object.freeze(dataList)
      }
    },
    components: {
      monitor_grid
    },
    provide: {
      linkDetail: (params) => {
        let product_line = params.product_line
        try {
          product_line = product_line.split(' / ')
          const last = product_line.splice(-1, 1)[0] * 1
          product_line = product_line.concat([last])
        } catch (e) {
          product_line  = []
        }
        return {name: 'KeyboardChart', params: {
                    product_line: product_line
                  }}
        },
      formatter: formatter,
      fetchType: 'server',
      fullScreenRoute: (level) => { return {name: 'server_fullscreen_grid', query: { level: level }} },
    }
  }
</script>

<style lang="scss"  rel="stylesheet/scss"  scoped>
</style>
