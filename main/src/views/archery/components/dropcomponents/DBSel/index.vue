<template>
  <el-select
    v-model="val"
    v-bind="$attrs"
    v-on="$listeners"
    placeholder="请选择DB/schema名称"
    filterable
    clearable
  >
    <el-option
      v-for="item in dbOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: "db_select",
  props: {
    value: String,
    dbOptions: {
      type: Array,
      default: () => []
    },
    required: true
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      }
    }
  }
};
</script>
