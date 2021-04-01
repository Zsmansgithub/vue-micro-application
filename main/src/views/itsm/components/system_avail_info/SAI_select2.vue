<template>
    <el-select
      v-model="val"
      clearable
      filterable
      allow-create
      :multiple="multiple"
      style="width:100%;"
      :placeholder="placeholder">
      <el-option
        v-for="item in $attrs.selOptions"
        :key="item.uuid"
        :label="item.uuid"
        :value="item.uuid">
      </el-option>
    </el-select>
</template>

<script>
  export default {
    name: 'SAI_select2',
    props: {
      value: String,
      item: Object,
      placeholder: {
        type: String,
        default: '请选择'
      },
      required: true
    },
    computed: {
      multiple() {
        return this.item.noMultiple ? false : 'multiple';
      },
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
          return this.item.noMultiple ? this.value : this.value && this.value.split(symbol)
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
