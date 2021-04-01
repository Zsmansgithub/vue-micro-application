<template>
  <div class="box_outer" :style="{width:width}">
    <div class="box_head">{{title}}</div>
    <div class="box_body">
      <slot></slot>
    </div>
  </div>
</template>


<script>
  export default {
    components: {},
    props: {
      title: {default: '标题'},
      width:{default: '32%'}
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
  .box_outer {
    margin:0px 10px 20px 10px;
    min-height: 100px;
    background-color: white;
    /*width: 32%;*/
    float:left;
  }


  .box_head  {
    height: 30px;
    background-color: #fafafa;
    text-align: center;
    line-height: 30px;
  }


  .box_body{
    margin-left: 15px;
  }

</style>
