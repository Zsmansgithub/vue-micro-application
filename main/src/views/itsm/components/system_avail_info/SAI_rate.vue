<template>
  <el-select
    v-model="val"
    :placeholder="placeholder"
    style="width: 100%;"
  >
    <el-option v-for="(item, index) in 5" :key="index + 1" :label="index + 1" :value="index + 1"></el-option>
  </el-select>
</template>

<script>
  import mixins from './mixins/mixin1'

  export default {
    name: 'SAI_rate',
    mixins: [mixins],
    props: {
      value: Number,
      placeholder: {
        type: String,
        default: '请选择'
      },
      required: true
    },
  }
</script>
