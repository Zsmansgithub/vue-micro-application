<template>
  <el-select
    v-model="val"
    :placeholder="placeholder"
    style="width: 100%;"
    filterable
    clearable
    allow-create
    default-first-option
  >
    <el-option v-for="item in selectOptions.is" :label="item.label" :value="item.label"></el-option>
  </el-select>
</template>

<script>
  import mixins from './mixins/mixin1'

  export default {
    name: 'SAI_select4',
    mixins: [mixins],
    props: {
      value: String,
      placeholder: {
        type: String,
        default: '请选择'
      },
      required: true
    },
    inject: ['selectOptions']
  }
</script>
