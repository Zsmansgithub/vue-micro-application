<template>
  <div class="card-panel" :style="{height:height}">
    <div style="margin:-10px -20px 10px -20px; padding: 10px 10px 0 10px; border-color:white">
      <div class="el-card-header" :style="{backgroundColor:head_color,color:title_color,}"><label>{{title}}</label></div>
      <div class="el-card-body" >
        <slot></slot>
      </div>
    </div>
  </div>

</template>

<script>
  import CountTo from 'vue-count-to'

  export default {
    name: 'panel_card',
    components: {
      CountTo
    },
    props: {
      title: {type: String, default: 'title'},
      head_color:{type: String, default: '#fafafa'},
      title_color:{type: String, default: '#606266'},
      height:{type: String, default: ''}
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>


  .card-panel {
    min-height: 100px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    margin: 10px 5px;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

  }

  .el-card-header {
    text-align: center;
    padding: 13px 10px 5px 10px;
    /*color: #606266;*/
    line-height: 26px;
    border: solid 1px rgb(209, 233, 255);
    min-height: 30px;
    max-height: 120px;
    /*background-color: #fafafa;*/
    border-radius: 4px;
    width: 100%;
    overflow: auto;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
    margin: -10px 0 20px 0;
  }

  .el-card-body {
    padding: 0px 25px 10px 25px;
  }

</style>
