export default {
  watch: {
    'searchText': function(newVal) {
      sessionStorage.setItem(`${this.$route.fullPath.replace(/\//g, '_')}`, newVal || '')
    }
  },
  created() {
    const sessionSearchText = sessionStorage.getItem(`${this.$route.fullPath.replace(/\//g, '_')}`)
    this.searchText = sessionSearchText || this.searchText
  }
}
