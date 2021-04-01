<template>
  <el-date-picker
    v-model="val"
    clearable
    type="datetimerange"
    value-format="yyyy-MM-dd hh:mm:ss"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :default-time="['12:00:00']">
  </el-date-picker>
</template>

<script>
  import mixins from './mixins/mixin1'

  export default {
    name: 'SAI_dateTime1',
    mixins: [mixins],
    props: {
      value: Array,
      required: true
    },
  }
</script>

<style scoped>

</style>
