import { saveAs } from 'file-saver'
import { Message } from 'element-ui'
const down = (response) => {
    let fileName = ''
    const disposition = response.headers['content-disposition']
    if (disposition && disposition.indexOf('filename') !== -1) {
        fileName = decodeURI(disposition.slice(disposition.indexOf('filename') + 9))
        fileName = fileName.replace('=UTF-8\'\'','')
    }
    const res = response.data
    const blob = new Blob([res], {
        type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    })
    if (fileName) {
        saveAs(blob, fileName)
        return
    }
    const fileReader = new FileReader()
    fileReader.onload = (content) => {
        try {
            const msg = JSON.parse(content.target.result)
            Message.error(msg.msg || '出错了')
        } catch (e) {
            console.error(e)
            Message.error('出错了')
        }
    }
    fileReader.readAsText(blob)
}

export default down
