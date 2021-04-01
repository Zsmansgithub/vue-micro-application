export default {
  created() {
    this.getSessionItem()
  },
  methods: {
    getSessionItem() {
      let sessionData = sessionStorage.getItem(this.$route.fullPath.replace(/\//g, '_'))
      if (sessionData) {
        sessionData = JSON.parse(sessionData)
        Object.keys(sessionData).map((key) => {
          if (Object.keys(this.$data).find(dataKey => dataKey === key)) this[key] = sessionData[key]
        })
      }
    },
    setSessionItem(itemData = {}) {
      let sessionData = sessionStorage.getItem(this.$route.fullPath.replace(/\//g, '_')) || '{}'
      sessionData = sessionData ? Object.assign({}, JSON.parse(sessionData), itemData) : itemData
      sessionStorage.setItem(this.$route.fullPath.replace(/\//g, '_'), JSON.stringify(sessionData))
    }
  }
}
