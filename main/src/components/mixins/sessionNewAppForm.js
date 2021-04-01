export default {
  data() {
    return {
      sessionKey: null
    }
  },
  watch: {
    newAppForm: {
      handler(val) {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(val))
      },
      deep: true
    }
  },
  created() {
    this.sessionKey = this.$route.fullPath.replace(/\//g, '_')
    if (Object.keys(this.$route.params).length !== 0) {
      sessionStorage.removeItem(this.sessionKey)
      this.newAppForm.routeParams = this.$route.params
    }
    const sessionData = sessionStorage.getItem(this.sessionKey)
    if (sessionData && JSON.parse(sessionData).routeParams) {
      this.newAppForm.routeParams = JSON.parse(sessionData).routeParams
    }
  },
  mounted() {
    const sessionData = sessionStorage.getItem(this.sessionKey)
    this.$nextTick(() => {
      if (sessionData) {
        this.aDetail = JSON.parse(sessionData)
        this.renderDraftsData1()
      }
    })
  },
  methods: {
    initDate(num = 1) {
      const nowDate = new Date()
      let initDate = ''
      nowDate.setDate(nowDate.getDate() + num)
      const nowMonth = ((nowDate.getMonth() + 1) < 10) ? '0' + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1)
      const nowDay = (nowDate.getDate() < 10) ? '0' + nowDate.getDate() : nowDate.getDate()
      initDate = nowDate.getFullYear() + '-' + nowMonth + '-' + nowDay
      return initDate
    }
  }
}
