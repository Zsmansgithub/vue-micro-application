<template>
  <el-input
    maxlength="30"
    show-word-limit
    :type="item.type"
    :placeholder="placeholder"
    v-model="val"></el-input>
</template>

<script>
  import mixins from './mixins/mixin1';

  export default {
    name: 'SAI_input1',
    mixins: [mixins],
    props: {
      value: String,
      placeholder: {
        type: String,
        default: '请输入'
      },
      required: true,
    },
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-input__count {
    line-height: 1;
  }
</style>
