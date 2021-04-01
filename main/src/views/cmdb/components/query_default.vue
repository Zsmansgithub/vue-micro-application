<template>
  <div class="app-container">
  <!-- <div> -->
    <el-card shadow="never" class="elCard">
      <div slot="header" class="clearfix">
        <div style="margin:-10px;">
          <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
          <label style="font-size:15px;">工具简介</label>
        </div>
      </div>

      <span>综合查询页</span>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'QueryDefault',

  props: [],

  data() {
    return {

    }
  },

  created() {

  },

  methods: {

  }

}
</script>

<style lang="scss" scoped>
  .elCard {
    border-top: 3px #409EFF solid;
    border-radius: 0px;
    margin-bottom: 20px;
  }
</style>