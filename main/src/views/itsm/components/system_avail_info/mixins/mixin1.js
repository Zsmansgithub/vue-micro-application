export default {
  props: {
    item: Object,
    required: true
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  }
}
