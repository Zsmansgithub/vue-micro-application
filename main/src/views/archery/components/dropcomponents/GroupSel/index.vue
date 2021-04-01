<template>
  <el-select
    v-model="val"
    v-bind="$attrs"
    v-on="$listeners"
    placeholder="请选择项目"
    filterable
    clearable
  >
    <el-option
      v-for="item in groupOptions"
      :key="item.value"
      :label="item.label"
      :value="item.label"
    ></el-option>
  </el-select>
</template>

<script>
import { getSqlWorkflow } from "@/api/archery/sql_workflow";
export default {
  name: "group_select",
  props: {
    value: String,
    required: true
  },
  data() {
    return {
      groupOptions: []
    };
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
  },
  mounted() {
    // 获取项目
    getSqlWorkflow({ query_all: 1 }).then(res => {
      this.groupOptions = res.data;
    });
  }
};
</script>
