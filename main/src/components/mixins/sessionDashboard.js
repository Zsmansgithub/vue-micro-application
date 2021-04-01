export default {
  watch: {
    search(newValue) {
      this.setSessionItem({
        [this.$attrs.componentName]: { search: newValue }
      })
    }
  },
  created() {
    this.getSessionItem()
  },
  methods: {
    getSessionItem() {
      const sessionData = sessionStorage.getItem(this.$route.fullPath.replace(/\//g, '_'))
      const sessionDataItem = sessionData ? JSON.parse(sessionData)[this.$attrs.componentName] : null
      if (sessionData && sessionDataItem && this.$attrs.componentName) {
        Object.keys(sessionDataItem).map((key) => {
          if (Object.keys(this.$data).find(dataKey => dataKey === key)) this[key] = sessionDataItem[key]
        })
      } else if (sessionData) {
        this.componentName = JSON.parse(sessionData).componentName
      } else {
        sessionStorage.setItem(this.$route.fullPath.replace(/\//g, '_'), JSON.stringify({
          componentName: this.componentName
        }))
      }
    },
    setSessionItem(itemData = {}) {
      let sessionData = sessionStorage.getItem(this.$route.fullPath.replace(/\//g, '_')) || '{}'
      const componentNameData = JSON.parse(sessionData)[this.$attrs.componentName]
      itemData[this.$attrs.componentName] = componentNameData ? Object.assign({}, componentNameData, itemData[this.$attrs.componentName]) : itemData[this.$attrs.componentName]
      sessionData = sessionData ? Object.assign({}, JSON.parse(sessionData), itemData) : itemData
      sessionStorage.setItem(this.$route.fullPath.replace(/\//g, '_'), JSON.stringify(sessionData))
    }
  }
}
