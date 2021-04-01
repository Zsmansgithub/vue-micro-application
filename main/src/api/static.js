export const renv = [{
  value: 1,
  label: '生产环境'
}, {
  value: 2,
  label: 'SIT环境'
}, {
  value: 4,
  label: 'UAT环境'
}]

export const rsStatus = [
  {
    value: '1',
    label: '使用中'
  },
  {
    value: '2',
    label: '维护中'
  },
  {
    value: '3',
    label: '空闲中'
  },
  {
    value: '4',
    label: '待分配'
  },
  {
    value: '5',
    label: '已报废'
  }
]

export const rsType = [
  {
    value: '1',
    label: '物理机'
  },
  {
    value: '4',
    label: '虚拟机'
  },
  {
    value: '7',
    label: '菜鸟云'
  },
  {
    value: '2',
    label: '网络设备'
  },
  {
    value: '3',
    label: '安全设备'
  },
  {
    value: '6',
    label: '刀片机'
  },
  {
    value: '5',
    label: '未定义'
  }]

export const ip_type = {
  '1': '主IP',
  '2': '管理IP',
  '3': '扩展IP',
  '4': 'IPMI',
  '5': 'VIP'
}

export const ip_type_list = [{
  value: '3',
  label: '扩展IP'
}, {
  value: '2',
  label: '管理IP'
}, {
  value: '4',
  label: 'IPMI'
}, {
  value: '5',
  label: 'VIP'
}]

export const lange = [
  { key: 'java', display_name: 'java' },
  {
    key: 'php',
    display_name: 'php'
  },
  {
    key: 'python',
    display_name: 'python'
  },
  {
    key: 'C++',
    display_name: 'C++'
  },
  {
    key: 'JS',
    display_name: 'JS'
  },
  {
    key: 'go',
    display_name: 'go'
  },
  { key: 'other', display_name: 'other' }
]

export const appType = [
  { key: 'tomcat', display_name: 'tomcat' },
  { key: 'jar', display_name: 'jar' },
  { key: 'nginx', display_name: 'nginx' },
  { key: 'redis', display_name: 'redis' },
  { key: 'MQ', display_name: 'MQ' },
  { key: 'kafka', display_name: 'kafka' },
  { key: 'zk', display_name: 'zk' },
  { key: 'other', display_name: 'other' }
]

export default {
  a: 'hello',
  b: 'world'
}
