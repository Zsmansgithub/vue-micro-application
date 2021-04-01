export default {
  watch: {
    activeName(newValue) {
      this.setSessionItem({
        activeName: newValue
      })
    },
    listQuery: {
      handler(newValue) {
        this.setSessionItem({
          listQuery: newValue
        })
      },
      deep: true
    },
    listQuery1: {
      handler(newValue) {
        this.setSessionItem({
          listQuery1: newValue
        })
      },
      deep: true
    },
    listQuery2: {
      handler(newValue) {
        this.setSessionItem({
          listQuery2: newValue
        })
      },
      deep: true
    },
    listQuery3: {
      handler(newValue) {
        this.setSessionItem({
          listQuery3: newValue
        })
      },
      deep: true
    },
    listQuery4: {
      handler(newValue) {
        this.setSessionItem({
          listQuery4: newValue
        })
      },
      deep: true
    },
    listQuery5: {
      handler(newValue) {
        this.setSessionItem({
          listQuery5: newValue
        })
      },
      deep: true
    }
  }
}
