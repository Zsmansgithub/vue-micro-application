import { createNamespacedHelpers } from 'vuex'

const { mapGetters, mapActions } = createNamespacedHelpers('flowchart')
export default {
  computed: {
    ...mapGetters(['activeType', 'activeNode', 'activeLine'])
  },
  methods: {
    ...mapActions(['setActiveNode', 'setActiveLine', 'setActiveType'])
  }
}
