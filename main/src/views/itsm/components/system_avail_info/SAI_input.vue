<template>
  <el-input :type="item.type" :placeholder="placeholder" v-model="val"></el-input>
</template>

<script>
  import mixins from './mixins/mixin1';

  export default {
    name: 'SAI_input',
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
