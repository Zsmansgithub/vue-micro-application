<template>
  <div class="login-container">
  </div>
</template>

<script>
import { getQueryVariable } from '@/utils/format-function'
import { loginDD } from '@/api/user'
export default {
  name: 'Logindd',
  created() {
    // window.addEventListener('storage', this.afterQRScan)
        this.handleLogin2()
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogin2() {
          // console.log(this.$store)
      let id_token = getQueryVariable()
      if (!id_token.hasOwnProperty('code') ){
        return
      } else {
        loginDD(id_token).then(response => {
          const { data } = response;
          store.dispatch('user/loginjwt', data).then(() => {
            next({ path: '/' })
          })
        })
      }
    }
  }
}
</script>


