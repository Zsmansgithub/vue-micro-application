export default {
  created() {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const dateStart = new Date(y, m - 1)
    const dateEnd = new Date(new Date(y, m) - 1000 * 60 * 60 * 24)
    this.listQuery.time_range_date = [dateStart, dateEnd]
  },
  methods: {
    rangeTime() {
      let listQuery
      if (this.listQuery.time_range_date) {
        const startTime = this.listQuery.time_range_date[0]
        const endTime = new Date(this.listQuery.time_range_date[1]).getTime() + 1000 * 60 * 60 * 24 - 1
        const startTimeStr = this.$utils.index.parseTime(startTime)
        const endTimeStr = this.$utils.index.parseTime(endTime)
        listQuery = `time_range_date=${startTimeStr}&time_range_date=${endTimeStr}`
      }
      return listQuery
    }
  }
}
