<template>
  <div>
    <div class="head_box">
      {{head_content}}
    </div>
    <div :class="{'body_box':true,'show_body_box':show_body_content}">
      {{body_content}}
    </div>
    <div class="pull_down_it" @click="expandClick">
      <div style="width: 100px;margin:auto;position: relative;left: 35px">
        <i v-if="!show_body_content" class="el-icon-caret-bottom i_class"></i>
        <i v-if="show_body_content" class="el-icon-caret-top i_class"></i>
        <span class="i_content">{{button_text}}</span>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    components: {},
    props: {
      head_content: {default: '这里是展示内容'},
      body_content: {default: '这里是隐藏内容'},
    },
    data() {
      return {
        show_body_content: false,
        button_text: '点击展开'
      }
    },
    created() {

    },
    methods: {
      expandClick() {
        this.show_body_content = !this.show_body_content
        this.button_text = this.button_text === '点击展开' ? '点击收起' : '点击展开'
      },
    }
  }
</script>

<style>
  .head_box {
    border: 1px solid rgb(234, 238, 251);
    border-bottom: none;
    height: 30px;
    padding: 3px 6px
  }

  .pull_down_it {
    text-align: center;
    border: 1px solid rgb(234, 238, 251);
    cursor: pointer;
    height: 30px;
    line-height: 30px;
  }

  .pull_down_it:hover {
    color: #409eff;
    background-color: #f9fafc;
  }

  .pull_down_it:hover .i_class {
    color: #409eff;
    transform: translateX(-35px);
  }

  .pull_down_it:hover .i_content {
    color: #409eff;
    display: inline-block;
    opacity: 100%;
    transform: translateX(-30px);
  }

  .i_class {
    color: rgb(211, 220, 230);
    display: inline-block;
    font-size: 16px;
    text-align: center;
    transition: transform 0.4s, opacity 0.4s;
  }

  .i_content {
    opacity: 0;
    display: inline-block;
    transform: translateX(20px);
    transition: transform 0.4s, opacity 0.4s;
  }

  .body_box {
    max-height: 0;
    min-height: 0;
    overflow: hidden;
    padding: 0 6px;
    transition: max-height 0.4s, min-height 0.4s;
    border-left: 1px solid rgb(234, 238, 251);
    border-right: 1px solid rgb(234, 238, 251);
  }

  .show_body_box {
    max-height: 100px;
    min-height: 100px;
  }
</style>
