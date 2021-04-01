<template>
      <el-select
        v-model="val"
        filterable
        clearable
        multiple
        :multiple-limit="item.limit"
        :placeholder="placeholder"
        style="width: 100%;"
      >
        <el-option
          v-for="item in $attrs.selOptions"
          :key="item.value"
          :label="'('+item.value+')'+item.label"
          :value="item.value">
        </el-option>
      </el-select>
</template>

<script>
  export default {
    name: 'SAI_select1',
    props: {
      value: String,
      item: Object,
      placeholder: {
        type: String,
        default: '请输入姓名/工号'
      },
      required: true
    },
    computed: {
      val: {
        get() {
          let symbol = '、';
          if (this.value && this.value.indexOf('，') > -1) {
            symbol = '，'
          }
          if (this.value && this.value.indexOf(',') > -1) {
            symbol = ','
          }
          if (this.value && this.value.indexOf('、') > -1) {
            symbol = '、'
          }
          return this.value && this.value.split(symbol)
        },
        set(v) {
          if (v && v instanceof Array) {
            v = v.join(',')
          }
          this.$emit('input', v)
        }
      }
    }
  }
</script>
