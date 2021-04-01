<template>
  <div style="position: relative;">
    <el-progress
      type="circle"
      class="el-progress"
      v-if="ins['ins_error_count']/ins['ins_count']*100<31"
      :stroke-width=8 :percentage="ins['ins_count']!==0 ? ins['ins_error_count']/ins['ins_count']*100 : 0"
      :show-text="false"
      :width="type === 'large' ? 90 : 110"
      color="#F39C12">
    </el-progress>
    <el-progress
      type="circle"
      class="el-progress"
      v-else
      :stroke-width="8"
      :percentage="ins['ins_count']!==0 ? ins['ins_error_count']/ins['ins_count']*100 : 0"
      :show-text="false"
      :width="type === 'large' ? 90 : 110"
      color="#DD4B39">
    </el-progress>
    <!-- color="#DD4B39"> -->
    <div class="el-progress_text">
      <span v-if="ins['ins_error_count']/ins['ins_count']*100<1" style="color:#00FF00;">{{ 100-ins['ins_error_count']/ins['ins_count']*100 | reservedZero }}%</span>
      <span v-else-if="ins['ins_error_count']/ins['ins_count']*100<31" style="color:#F39C12;">{{ 100-ins['ins_error_count']/ins['ins_count']*100 | reservedZero }}%</span>
      <span v-else-if="ins['ins_error_count']/ins['ins_count']*100>30" style="color:#DD4B39;">{{ 100-ins['ins_error_count']/ins['ins_count']*100 | reservedZero }}%</span>
      <!-- color:#DD4B39 -->
      <!-- <span style="color:#00FF00;">{{ ins['ins_error_count']/ins['ins_count']*100 | reservedZero }}%</span> -->
      <br>
      <label style="color: #d9d9d9; font: small-caption;text-align: center;">可用率</label>
    </div>
  </div>
</template>

<script>
  export default {
    filters: {
      reservedZero(num) {
        return num.toFixed(0)
      }
    },
    props: {
      ins: Object,
      type: String,
    }
  }
</script>

<style lang="scss" scoped>
  .el-progress{
    cursor: pointer;
  }
  .el-progress_text label {
    position: absolute;
    top: 50%;
    left: 25%;
    text-align: center;
    width: 50%;
    height: 50%;
    color: #d9d9d9;
    font-size: 20px;
    cursor: pointer;
  }

  .el-progress_text span {
    position: absolute;
    top: 30%;
    left: 25%;
    text-align: center;
    width: 50%;
    height: 50%;
    color: #d9d9d9;
    font-size: 20px;
    cursor: pointer;
  }

  .el-progress /deep/ path:first-child {
    stroke: #17cb7e;
  }
</style>
