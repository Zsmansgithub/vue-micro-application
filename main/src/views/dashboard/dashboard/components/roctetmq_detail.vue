<template>
  <div>
    <el-row>
      <el-row class="detail-row">
        <el-col :span="7" class="dashboard_class">生产量</el-col>
        <el-col :span="9" class="dashboard_class" style="color:#62ff2f">
          <el-tooltip placement="top"
                      :disabled="(project['produce_sum'] && `${project['produce_sum']}`.replace(/[^x00-xff]/g, 'aa').length > 8)? disabled : !disabled"
                      effect="light">
            <div class="tootip" slot="content">{{project['produce_sum']}}</div>
            <div class="text-overflow">{{project['produce_sum']}}</div>
          </el-tooltip>
        </el-col>
        <el-col :span="8" class="dashboard_class">
          <el-col :span="2">
            <div :class="project['up_down_p']"></div>
          </el-col>
          <el-col :span="22" style="color:#62ff2f">
            <el-tooltip placement="top"
                        :disabled="(project['produce_sum_ratio'] && `${project['produce_sum_ratio']}`.replace(/[^x00-xff]/g, 'aa').length > 5)? disabled : !disabled"
                        effect="light">
              <div class="tootip" slot="content">{{project['produce_sum_ratio']}}%</div>
              <div class="text-overflow">{{project['produce_sum_ratio'] | conversion}}%</div>
            </el-tooltip>
          </el-col>
        </el-col>
      </el-row>
      <hr style="border:0;border-bottom:1px  solid #22589B;"/>
    </el-row>
    <el-row>
      <el-row class="detail-row">
        <el-col :span="7" class="dashboard_class">
          消费量
        </el-col>
        <el-col :span="9" class="dashboard_class" style="color:#62ff2f">
          <el-tooltip placement="top"
                      :disabled="(project['consumer_sum'] && `${project['consumer_sum']}`.replace(/[^x00-xff]/g, 'aa').length > 8)? disabled : !disabled"
                      effect="light">
            <div class="tootip" slot="content">{{project['consumer_sum']}}</div>
            <div class="text-overflow">{{project['consumer_sum']}}</div>
          </el-tooltip>
        </el-col>
        <el-col :span="8" class="dashboard_class">
          <el-col :span="2">
            <div :class="project['up_down_c']"></div>
          </el-col>
          <el-col :span="22" style="color:#62ff2f">
            <el-tooltip placement="top"
                        :disabled="(project['consumer_sum_ratio'] && `${project['consumer_sum_ratio']}`.replace(/[^x00-xff]/g, 'aa').length > 5)? disabled : !disabled"
                        effect="light">
              <div class="tootip" slot="content">{{project['consumer_sum_ratio']}}%</div>
              <div class="text-overflow">{{project['consumer_sum_ratio'] | conversion}}%</div>
            </el-tooltip>
          </el-col>
        </el-col>
      </el-row>
      <hr style="border:0;border-bottom:1px  solid #22589B;"/>
    </el-row>
    <el-row>
      <el-row class="detail-row">
        <el-col :span="7" class="dashboard_class">延迟量</el-col>
        <el-col :span="9" class="dashboard_class" style="color:#62ff2f">
          <el-tooltip placement="top"
                      :disabled="(project['diff'] && `${project['diff']}`.replace(/[^x00-xff]/g, 'aa').length > 8)? disabled : !disabled"
                      effect="light">
            <div class="tootip" slot="content">{{project['diff']}}</div>
            <div class="text-overflow">{{project['diff']}}</div>
          </el-tooltip>
        </el-col>
        <el-col :span="8" class="dashboard_class">
          <el-col :span="2">
            <div :class="project['up_down_d']"></div>
          </el-col>
          <el-col :span="22" class="text-overflow" style="color:#62ff2f">
            <el-tooltip placement="top"
                        :disabled="(project['diff_total_ratio'] && `${project['diff_total_ratio']}`.replace(/[^x00-xff]/g, 'aa').length > 5)? disabled : !disabled"
                        effect="light">
              <div class="tootip" slot="content">{{project['diff_total_ratio']}}%</div>
              <div class="text-overflow">{{project['diff_total_ratio'] | conversion}}%</div>
            </el-tooltip>
          </el-col>
        </el-col>
      </el-row>
      <hr style="border:0;border-bottom:1px  solid #22589B;"/>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'roctetmq_detail',
    props: {
      project: Object,
      type: String
    },
    data() {
      return {
        disabled: false
      }
    },
    filters: {
      conversion(val) {
        const unit = ['十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '兆', '十兆', '百兆', '千兆'];
        let restoreValue = val;
        if(/^[\-|0-9]\d{2,}[\万]$/.test(val)) {
            let value = val.substr(0, val.length - 1);
            let valueAbs = Math.abs(value).toString();
            const fixVal = (valueAbs / (Math.pow(10, valueAbs.length - 1))).toFixed();
            const fixValUnit = fixVal * 1 === 10 ? unit[valueAbs.length - 1] : unit[valueAbs.length - 2];
            if (fixValUnit) {
                restoreValue = (value < 0 ? '-' : '') + (fixVal * 1 === 10 ? fixVal/10 : fixVal) + fixValUnit;
            } else {
                restoreValue =  (value < 0 ? '-' : '') + '∞';
            }
        }
        return restoreValue;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard_class {
    border-width: 0;
    /*min-width: 70px;*/
  }

  .square {
    position: relative;
    width: 0;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 16px solid rgba(255, 0, 0, 0);
    top: 2px;
    /*border-bottom: 15px solid red;*/
  }

  .box-card-item-small .detail-row {
    height: 25px;
  }

  .text-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
