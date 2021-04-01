<template>
  <div class="help-svg">
    <el-popover
      placement="bottom-start"
      title="帮助"
      width="310"
      trigger="click"
      content="如有疑问请联系刘印：19908466282">
      <el-button slot="reference" type="text">
        <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      helpDialogVisible: false
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
