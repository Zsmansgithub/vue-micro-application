<template>
  <el-select
    v-model="val"
    v-bind="$attrs"
    v-on="$listeners"
    placeholder="请选择实例"
    remote
    filterable
    clearable
  >
    <el-option-group
      v-for="group in instanceOptions"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  name: "instance_select",
  props: {
    value: String,
    instanceOptions: {
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
