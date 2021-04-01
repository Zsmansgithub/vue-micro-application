import { getWFLine } from '@/api/workflow/app_manage'
export default {
  data() {
    return {
      help_doc_url: undefined,
      aDetail: {}
    }
  },
  mounted() {
    if (!this.newAppForm.routeParams || !this.newAppForm.routeParams.id || !this.newAppForm.routeParams.name) {
      this.routeLeave('/workflow/app_manage')
    }
    this.init()
    this.$nextTick(() => {
      this.$refs['newAppForm'].clearValidate()
    })
    this.renderDraftsData()
  },
  methods: {
    init() {
      // 获取帮助文档
      getWFLine(this.newAppForm.routeParams.id)
        .then(response => {
          if (response.status === 1) {
            this.$router.push('/404')
          }
          this.help_doc_url = response.help_url
        })
        .catch(e => {
          console.error(e)
        })
    },
    renderDraftsData() {
      if (this.$route.params.detailData_edit) {
        this.aDetail = JSON.parse(this.$route.params.detailData_edit.values)
        this.renderDraftsData1()
      }
    },
    routeLeave(fullPath) {
      this.$store
        .dispatch('tagsView/delView', this.$route)
        .then(({ visitedViews }) => {
          this.$router.push(fullPath)
        })
    },
    notify(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success',
        duration: 3000
      })
      this.buttondisabled = false
    },
    validateFalse() {
      this.$message({
        message: '请填写必要的标题和内容',
        type: 'warning'
      })
    }
  }
}
