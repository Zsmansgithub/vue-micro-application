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
    <el-option
      v-for="item1 in selectOptions[item.key]"
      :key="item1.label"
      :label="item1.label"
      :value="item1.label"
    ></el-option>
  </el-select>
</template>

<script>
  import mixins from './mixins/mixin1'

  export default {
    name: 'SAI_select5',
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
