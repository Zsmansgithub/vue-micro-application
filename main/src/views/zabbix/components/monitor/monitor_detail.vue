<template>
  <div style="height: 100%;display: grid;align-items: center;">
    <el-row v-if="type === 'large'">
      <el-row>
        <el-col :span="24" style="text-align: center">{{ ins['app_name'] }}</el-col>
      </el-row>
      <hr style="border:0;border-bottom:1px solid #999999;" />
    </el-row>
    <el-row>
      <el-row>
        <el-col :span="7" class="dashboard_class">总实例</el-col>
        <el-col :span="17" class="dashboard_class">
          <span style="color:#79DE17;">{{ins['ins_count']}}</span></el-col>
        <!-- <el-col :span="6" class="dashboard_class">
          <el-col :span="6">
            <div :class="project['up_down_p']"></div>
          </el-col>
          <el-col :span="18"><span style="color:#62ff2f">{{project['produce_sum_ratio']}}%</span></el-col>
        </el-col> -->
      </el-row>
      <hr style="border:0;border-bottom:1px solid #999999;" />
    </el-row>
    <el-row>
      <el-row>
        <el-col :span="7" class="dashboard_class">异常数</el-col>
        <el-col :span="17" class="dashboard_class">
          <el-tooltip v-if="ins['ins_ips']!==''" class="item" effect="dark" :content="ins['ins_ips']" placement="top">
            <span style="color:#DD4B39;font-size:15.5px;"><b>{{ins['ins_error_count']}}</b></span>
          </el-tooltip>
          <span v-if="ins['ins_ips']===''" style="color:#79DE17">{{ins['ins_error_count']}}</span>
        </el-col>
        <!-- <el-col :span="6" class="dashboard_class">
          <el-col :span="6">
            <div :class="project['up_down_c']"></div>
          </el-col>
          <el-col :span="18"><span style="color:#62ff2f">{{project['consumer_sum_ratio']}}%</span></el-col>
        </el-col> -->
      </el-row>
      <hr style="border:0;border-bottom:1px solid #999999;" />
    </el-row>
    <el-row v-show="level === 'second' && fetchType === 'url'">
      <el-row>
        <el-col :span="7" class="dashboard_class">联系人</el-col>
        <el-col :span="17" class="dashboard_class2" >
          <span style="color:#79DE17;display:inline-block;font-size:8px;">{{ins['sms_list'] | openArr}}</span>
        </el-col>
        <!-- <el-col :span="6" class="dashboard_class">
                              <el-col :span="6">
          <div :class="project['up_down_d']"></div>
        </el-col>
        <el-col :span="18"><span style="color:#62ff2f">{{project['diff_total_ratio']}}%</span></el-col>
        </el-col> -->
      </el-row>
      <hr style="border:0;border-bottom:1px solid #999999;" />
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      ins: Object,
      type: String,
      level: String,
    },
    filters: {
      openArr(arr) {
        if(typeof arr === 'object' && arr instanceof Array) {
          return arr.join(', ');
        }
        return arr;
      }
    },
    inject: ['fetchType']
  }
</script>

<style lang="scss" scoped>
  .dashboard_class {
    border: 0px solid #006cff;
    font-size: 14PX;
    height: 26px;
    line-height: 22px;
    text-align: center;
  }
  .dashboard_class2 {
    border: 0px solid #006cff;
    font-size: 14PX;
    display:inline-block;
    text-align: center;
  }
</style>
