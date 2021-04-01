<template>
  <div class="app-container container">

    <div>
      <h2 style="text-align: center; margin-top:0px"> RocketMq 监控
        <label style="color: #d9d9d9; font: small-caption;text-align: center">&copy; YTOM{{datatime}}</label>
      </h2>

    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" v-for="(project,index) in data" :key="index"
              style="margin-bottom:20px">
        <el-card class="box-card" :body-style="{ padding: 0 }">
          <div class="card-header"  :style="{'background-color':'rgba(44,35,255,0)'}">
            {{project['cluster_name'] }}  <label style="color: #d9d9d9; font: small-caption;text-align: center"> Topic:{{project['topic_sum'] }} Consumer:{{ project['consume_sum']}}</label>
          </div>
          <div @dblclick="toRocketMqMonitor(project['cid'],project['cluster_name'])" style="width: 100%; height: 120px ">
            <el-col :span="8" style="text-align: center">
              <div style="position: relative;" >
                <el-progress type="circle" class="el-progress" v-if="project['diff_time_ratio']<31" :stroke-width=12 :percentage="project['diff_time_ratio']" :show-text="false" :width=110></el-progress>
                <el-progress type="circle" class="el-progress" v-else :stroke-width=12 :percentage="project['diff_time_ratio']" :show-text="false" :width=110 status="exception"></el-progress>
                <div class="el-progress_text"><span style="color:#FFFFFF">{{project['diff_time']}}</span><br><label style="color: #d9d9d9; font: small-caption;text-align: center;">延迟/分</label></div>
              </div>
            </el-col>
            <el-col :span="16">
              <el-row>
                <el-row>
                  <el-col :span="8" class="dashboard_class">生产量</el-col>
                  <el-col :span="10" class="dashboard_class">
                    <span style="color:#62ff2f">{{project['produce_sum']}}</span></el-col>
                  <el-col :span="6" class="dashboard_class">
                    <el-col :span="6">
                      <div :class="project['up_down_p']"></div>
                    </el-col>
                    <el-col :span="18"><span style="color:#62ff2f">{{project['produce_sum_ratio']}}%</span></el-col>
                  </el-col>
                </el-row>
                <hr color=#00FFF/>
              </el-row>
              <el-row>
                <el-row>
                  <el-col :span="8" class="dashboard_class">
                    消费量
                  </el-col>
                  <el-col :span="10" class="dashboard_class">
                    <span style="color:#62ff2f">{{project['consumer_sum']}}</span>
                  </el-col>
                  <el-col :span="6" class="dashboard_class">
                    <el-col :span="6">
                      <div :class="project['up_down_c']"></div>
                    </el-col>
                    <el-col :span="18"><span style="color:#62ff2f">{{project['consumer_sum_ratio']}}%</span></el-col>
                  </el-col>
                </el-row>
                <hr color=#00FFF/>
              </el-row>
                            <el-row>
                  <el-row>
                    <el-col :span="8" class="dashboard_class">延迟量</el-col>
                    <el-col :span="10" class="dashboard_class" ><span style="color:#62ff2f">{{project['diff']}}</span></el-col>
                    <el-col :span="6" class="dashboard_class">
                                          <el-col :span="6">
                      <div :class="project['up_down_d']"></div>
                    </el-col>
                    <el-col :span="18"><span style="color:#62ff2f">{{project['diff_total_ratio']}}%</span></el-col>

                    </el-col>
                  </el-row>
                <hr color=#00FFF />
              </el-row>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import resize from '@/components/Charts/mixins/resize'
  import {fetchRocketList} from '@/api/midmonitor/base'

  export default {
    name: 'ComplexTable',
    directives: {waves},
    mixins: [resize],
    data() {
      return {
        data: [],
        timer: '',
        listLoading: true,
        datatime: true
      }
    },
    created() {

    },
    mounted() {
      this.getList();
      this.timer = setInterval(this.getList, 60000);
    },
    methods: {
      handleShow(type) {
        if (type === 'new') {
          this.$router.push({name: 'rocketmq_monitor'})
        } else if (type === 'old') {
          this.$router.push(`/midmonitor/app_expansion_apply`)
        }
      },
      handleShowDb() {
        this.$router.push('/workflow/mysql_apply')
      },
      getList() {
        fetchRocketList().then(response => {
          this.data = response.data.results
          this.datatime = response.data.time
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1)
        })
      },
      beforeDestroy() {
        clearInterval(this.timer);
      },
      toRocketMqMonitor(id){
        this.$router.push({
          name: 'rocketmq_monitor',
          query: {
            cid: id
          }
        })
      },
    }
  }
</script>

<style lang="scss"  rel="stylesheet/scss"  scoped>
  .box-card /deep/ {
    color: #f2f2f2;
    border: 0px solid #006cff;
    background-color: rgba(185, 205, 255, 0);
    box-shadow: darkgrey 0px 0px 8px 5px;//边框内阴影
    .card-header {
      margin: 0;
      padding: 8px;
      color: #f2f2f2;
      font-size: 15px;
      font-weight: bold;
      height: 32px;
      background-color: #67c23a;
      border: 0px;
    }

  }

  .dashboard_class {
    border: 0px solid #006cff
  }

  .app-container {
    /*background-size: cover;*/
    color: #f2f2f2;
    /*height: 510%;*/
    height: 1000px;
    width: 100%;
    /*position: inherit;*/
    background: no-repeat;
    background-size: 100% 100%;
    background-color: #061536;
    background-image: url('../../assets/dashboard1.jpg');
    /*padding-right: 65px;*/

  }

  /*.box-card {*/
  /*  color: #f2f2f2;*/
  /*  background-color: #061536;*/
  /*}*/

  .uptriangle {
    width: 0;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    /*border-top: 15px solid red;*/
  border-bottom: 16px solid red;
}
  .downtriangle {
     position: relative;
    width: 0;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 16px solid red;
    top: 2px;
  /*border-bottom: 15px solid red;*/
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

  .el-progress {
    position: relative;

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
  }
</style>
