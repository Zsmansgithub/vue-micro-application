import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import Docxtemplater from 'docxtemplater'
import getfile from './index'
import { getUsersInfo } from '@/api/manage_monitor/user_department'

function exportDocx(data) {
  return new Promise((resolve, reject) => {
    getfile('./template.docx', function(error, content) {
      if (error) {
        throw error
      }
      const zip = new JSZip(content)
      const doc = new Docxtemplater().loadZip(zip)
      doc.setData(data)

      try {
        doc.render()
      } catch (error) {
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties
        }
        throw e
      }

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
      saveAs(out, '公司数据库接入申请.docx')
      resolve()
    })
  })
}
export function outDocx(res, appForm) {
  return new Promise((resolve, reject) => {
    const configinfo = appForm.configinfo[0]
    let ip1, port
    if (['Mysql', 'Oracle'].includes(configinfo.MorO)) {
      const dbs = configinfo.db.reduce((obj, item) => {
        const ipitem = item[1].split('/').length !== 1 ? item[1].split('/')[0] : item[1].split('(')[0]
        obj.ip = obj.ip + ipitem.split(':')[0] + ','
        obj.port = obj.port + ipitem.split(':')[1] + ','
        return obj
      }, { ip: '', port: '' })
      ip1 = dbs.ip.slice(0, -1)
      port = dbs.port.slice(0, -1)
    } else {
      ip1 = configinfo.db.reduce((str, i) => {
        str += i + ','
        return str
      }, '').slice(0, -1)
      port = ''
    }
    const department = res.create_user_department.split('/')
    const data = {
      userName: res.create_user_name,
      department: department.slice(-2, -1) + '/' + department.slice(-1,),
      entryTime: appForm.entryTime,
      create_time: res.create_time,
      accessTimeRange: `${appForm.timeRange[0]}/${appForm.timeRange[1]}`,
      t1: appForm.databaseType1 === '测试数据库' ? '☑' : '口',
      t2: appForm.databaseType1 === '生产数据库' ? '☑' : '口',
      Phone: '',
      Email: '',
      ips: appForm.Cip.reduce((str, v) => { str += v + ','; return str }, '').slice(0, -1),
      dt1: configinfo.MorO === 'Oracle' ? '☑' : '口',
      dt2: configinfo.MorO === 'Mysql' ? '☑' : '口',
      dto: ['Mysql', 'Oracle'].includes(configinfo.MorO) ? '' : configinfo.MorO,
      ip1: ip1,
      port: port,
      schema: configinfo.db_name,
      tableName: configinfo.table_name || 'all',
      p1: configinfo.permissions.includes('SELECT') ? '☑' : '口',
      p2: configinfo.permissions.includes('INSERT') ? '☑' : '口',
      p3: configinfo.permissions.includes('UPDATE') ? '☑' : '口',
      p4: configinfo.permissions.includes('DELETE') ? '☑' : '口',
      p5: configinfo.permissions.reduce((str, v) => {
        if (!['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(v)) str += v + ','
        return str
      }, '').slice(0, -1),
      reason: appForm.reason || '',
      demand: appForm.accessRequirements || ''
    }
    getUsersInfo({
      page: 1,
      limit: 20,
      uuid: res.modify_user,
      user_name: undefined,
      ou: undefined
    }).then(res => {
      data.Phone = res.results[0].mobile
      data.Email = res.results[0].email || ''
      exportDocx(data).then(() => {
        resolve()
      })
    })
  })
}
