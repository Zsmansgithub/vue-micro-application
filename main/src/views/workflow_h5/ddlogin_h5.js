import * as dd from 'dingtalk-jsapi'
import { loginDD_h5 } from '@/api/user'

export function getCode(callback) {
  const corpId = 'ding5be5ec1ba001ae6735c2f4657eb6378f'
  if (dd.env.platform !== 'notInDingTalk') {
    dd.ready(() => {
      // 使用SDK 获取免登授权码
      dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        onSuccess: (info) => {
          // 根据钉钉提供的api 获得code后,再次调用这个callback方法
          // 由于是钉钉获取code是异步操作,不知道什么时候执行完毕
          // callback 函数会等他执行完毕后在自己调用自己
          loginDD_h5(this.code).then(response => {
            window.location.href = '/#/workflow_h5list'
          })
          callback(info.code)
        },
        onFail: (err) => {
          alert('fail')
          alert(JSON.stringify(err))
        }
      })
    })
  }
}
