<template>
  <el-select
    v-model="val"
    filterable
    clearable
    allow-create
    :placeholder="placeholder"
    style="width: 100%;"
  >
    <el-option
      v-for="item in $attrs.selOptions"
      :key="item.ouid"
      :label="item.ou_name"
      :value="item.ouid">
    </el-option>
  </el-select>
</template>

<script>
  import mixins from './mixins/mixin1'

  export default {
    name: 'SAI_select7',
    mixins: [mixins],
    props: {
      value: String,
      placeholder: {
        type: String,
        default: '请输入名称'
      },
      required: true
    },
  }
</script>
