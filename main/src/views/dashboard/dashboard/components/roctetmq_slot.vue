<template>
  <div style="position: relative;" class="mq_q">
    <el-progress
      type="circle"
      class="el-progress"
      v-if="project['diff_time_ratio']<31"
      :stroke-width=10
      :percentage="project['diff_time_ratio']"
      :show-text="false"
      :width="type === 'large' ? 90 : 110"
      color="#F39C12"
    ></el-progress>
    <el-progress
      type="circle"
      class="el-progress"
      v-else
      :stroke-width=10
      :percentage="project['diff_time_ratio']"
      :show-text="false"
      :width="type === 'large' ? 90 : 110"
      color="#DD4B39"
    ></el-progress>
    <el-progress
      type="circle"
      class="el-progress"
      v-else
      :stroke-width=12
      :percentage="project['diff_time_ratio']"
      :show-text="false"
      :width="type === 'large' ? 90 : 110"
      status="exception"
    ></el-progress>
    <div class="el-progress_text"><span
      style="color:#FFFFFF">{{project['diff_time']}}</span><br><label
      style="color: #d9d9d9; font: small-caption;text-align: center;">延迟/分</label></div>
  </div>
</template>

<script>
  export default {
    name: 'roctetmq_slot',
    props: {
      project: Object,
      type: String
    }
  }
</script>

<style lang="scss" scoped>
  .el-progress {
    position: relative;
    cursor: pointer;
  }

  .el-progress_text {
    position: absolute;
    top: 38%;
    left: 25%;
    text-align: center;
    width: 50%;
    height: 50%;
    color: #d9d9d9;
    font-size:20px;
    cursor: pointer;
  }

  .box-card-item .el-progress_text {
    top: 23%;
  }

  .el-progress /deep/ path:first-child {
    stroke: rgba(103, 194, 58, 0.76);
  }
</style>
