<template>
  <div class="w_collapse">
    <el-collapse v-model="activeName">
      <el-collapse-item :title="title" :name="default_expand ? '1' : '0'">
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>


<script>
  export default {
    components: {},
    props: {
      title: {default: '标题'},
      default_expand: {default: true}
    },
    data() {
      return {
        activeName: ['1',]
      }
    },
    created() {

    },
    methods: {}
  }
</script>

<style>
  .w_collapse .el-collapse-item__header {
    height: 37px;
    background-color: aliceblue;
    border: solid 1px rgb(209, 233, 255) !important;
    margin: 0 0 20px 0;
    border-radius: 4px;
    font-weight: bold;
    color: #606266;
    padding: 0 15px
  }

  .w_collapse .el-collapse-item__header:hover {
    background-color: aliceblue;
  }

  .w_collapse .el-collapse-item__header:hover i {
    color: blue;
  }

  .w_collapse .el-collapse-item__wrap {
    /*background-color: #fafafa;*/
    padding: 0 10px;
    border-bottom: 0;
  }

  .w_collapse .el-collapse-item {
    display: block;
    margin-left: -10px;
    margin-right: -10px;
  }

  .w_collapse .el-collapse {
    border: 0;
  }
</style>
