<template>
  <div >
    <el-cascader
      :options="options"
      separator=""
      v-model="selectedOptionsA"
      @change="handleChange" style="width: 100%;">
    </el-cascader>
  </div>
</template>

<script>
import { getSystemVersionList2 } from '@/api/cmdbs/tools'

export default {
  name: 'SystemVersion',
  props: {
    selectedOptions: {}
  },
  data() {
    return {
      options:[],
      selectedOptionsA:undefined
    }
  },
  created() {
    this.selectedOptionsA=this.selectedOptions
    getSystemVersionList2().then(response => {
      this.options = response
    }).catch((error) => {
      this.$message({
        message: error.toString()
      })
    })
  },
  methods: {
      handleChange(value) {
        this.$emit('sendValueToParent',value);
      }
  }
}
</script>

<style>
</style>
