export default {
  data() {
    return {
      sessionKey: null
    }
  },
  watch: {
    listQuery: {
      handler(newVal) {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(newVal))
      },
      deep: true
    }
  },
  created() {
    this.sessionKey = this.$route.fullPath.replace(/\//g, '_')
    const sessionData = sessionStorage.getItem(this.sessionKey)
    this.listQuery = sessionData ? JSON.parse(sessionData) : this.listQuery
  }
}
