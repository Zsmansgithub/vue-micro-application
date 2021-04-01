<template>
  <div class="login-container">
  </div>
</template>

<script>
import { getQueryVariable } from '@/utils/format-function'
import { loginjwt } from '@/api/user'
export default {
  name: 'Loginjwt',
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
      if (!id_token.hasOwnProperty('id_token') ){
        return
      } else {
        loginjwt(id_token).then(response => {
        const { data } = response
        this.$store.dispatch('user/loginjwt',data)
            .then(() => {
              // this.$router.push({ path: this.redirect || '/' })
              location.href = location.origin;
              this.loading = false
            })
      })
      }
    }
  }
}
</script>


