<template>
  <div class="divstyle scrollstyle">
    正在跳转。。
  </div>
</template>

<script>
  import {loginDD_h5} from '@/api/user'
  import {getCode} from './dd-login'
  import * as dd from 'dingtalk-jsapi'

  export default {
    data() {
      return {

      }
    },
    created() {
      let is_phone = this.isMobile()
      // this.$alert('is_phone:' + is_phone);

      this.mian_deng_code = this.$route.query.mian_deng_code || this.$route.params.mian_deng_code;
      this.mian_deng_path = this.$route.query.redirect || this.$route.params.redirect;

      if (is_phone && this.mian_deng_path === '/workflow/workflow_list'){
        this.mian_deng_path='/workflow_h5list'
      }

      if (!this.mian_deng_code) {
        getCode(mian_deng_code => {
          // 登录处理
          this.mian_deng_code = mian_deng_code;
          // this.$alert('getCode:' + this.mian_deng_code);
          //http://xc.yto.net.cn/prod-api/user/dd_web_mian_deng?mian_deng_path=' + this.mian_deng_path
          let tmp_url = 'http://' + window.location.host + '/' + process.env.VUE_APP_BASE_API + '/user/dd_web_mian_deng?mian_deng_path=' + this.mian_deng_path + '&mian_deng_code=' + this.mian_deng_code
          window.open(tmp_url, '_blank');
          dd.biz.navigation.quit()
        })
      } else {
        // this.$alert('query.mian_deng_code' + this.mian_deng_code);
        loginDD_h5(this.mian_deng_code).then(response => {
          this.$router.push({path: this.mian_deng_path, query: {}});
        })
      }

    },
    methods: {
      isMobile() {
        return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      }
    }

  };
</script>

