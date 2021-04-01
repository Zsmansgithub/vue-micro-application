<template>
<transition name="el-zoom-in-top">
  <el-form-item v-bind="$attrs" v-on="$listeners" v-show="listQuerySearch">
    <slot></slot>
  </el-form-item>
</transition>
</template>

<script>
  export default {
    props: {
      listQuerySearch: {
        default: false
      }
    },
  }
</script>

<style scoped>

</style>
