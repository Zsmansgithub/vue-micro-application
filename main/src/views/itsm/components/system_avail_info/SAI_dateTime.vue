<template>
  <el-date-picker
    v-model="val"
    clearable
    type="datetime"
    value-format="yyyy-MM-dd hh:mm:ss"
    :placeholder="placeholder">
  </el-date-picker>
</template>

<script>
  import mixins from './mixins/mixin1';

  export default {
    name: 'SAI_dateTime',
    mixins: [mixins],
    props: {
      value: String,
      placeholder: {
        type: String,
        default: '选择日期时间'
      },
      required: true
    },
  }
</script>
