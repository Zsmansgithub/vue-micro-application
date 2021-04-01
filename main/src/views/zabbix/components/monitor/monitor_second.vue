<template>
  <div style="height: 100%">
    <transition name="fade-transform">
      <div v-show="pattern === 'large'" class="box-card-content">
        <div v-for="(ins, index) in dataNext" :key="index"
             class="box-card-item">
          <el-card class="box-card" :body-style="{ padding: 0}">
            <el-popover
              placement="bottom"
              width="300"
              popper-class='url-popper-content'
              trigger="hover">
              <monitor-detail :ins="ins" :type="pattern" :level="level"></monitor-detail>
              <div slot="reference">
                <div class="card-header"
                >{{ ins['app_name'] }}
                  <!-- <label style="color: #d9d9d9; font: small-caption;text-align: center"
                  > Topic:{{project['topic_sum'] }} Consumer:{{ project['consume_sum']}}</label> -->
                </div>
                <div @dblclick="toURLCheck(ins.id)">
                  <div style="text-align: center; margin-top: 10px;">
                    <monitor-slot :ins="ins" :type="pattern" ></monitor-slot>
                  </div>
                </div>
              </div>
            </el-popover>
          </el-card>
        </div>
      </div>
    </transition>
    <transition name="fade-transform">
      <el-row v-show="pattern === 'small'" :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" v-for="(ins,index) in dataNext" :key="index"
                style="margin-bottom:25px">
          <div>
            <el-card class="box-card" :class="{'box-card1': fetchType === 'server'}" :body-style="{ padding: 0}">
              <div class="card-header">
                {{ins['app_name'] }}
                <!-- <label style="color: #d9d9d9; font: small-caption;text-align: center"> Topic:{{project['topic_sum'] }} Consumer:{{ project['consume_sum']}}</label> -->
              </div>
              <div @dblclick="toURLCheck(ins.id)"
                   class="card-content">
                <el-col :span="8" class="progress">
                  <monitor-slot :ins="ins" :type="pattern"></monitor-slot>
                </el-col>
                <el-col :span="16" style="height: 100%">
                  <monitor-detail :ins="ins" :type="pattern" :level="level"></monitor-detail>
                </el-col>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </transition>
  </div>
</template>

<script>
  import monitorDetail from './monitor_detail'
  import monitorSlot from './monitor_slot'

  import {getSecondLevel} from '@/api/zabbix/urlmonitor'

  export default {
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      level: {
        type: String,
        default: 'first'
      },
      pattern: {
        type: String,
        default: 'large'
      },
      roles: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      toURLCheck(id) {
        if (this.roles) {
          this.$router.push(this.linkDetail({id: id}))
        }
      },
      loadData() {
        if(this.data.length > this.dataNext.length) {
          const st = this.dataNext.length
          this.dataNext = this.dataNext.concat(this.data.slice(st, st + 60))
          window.requestAnimationFrame(this.loadData)
        }
      }
    },
    data() {
      return {
        dataNext: [],
      }
    },
    watch: {
      data: {
        handler(newVal) {
          this.dataNext = []
          window.requestAnimationFrame(this.loadData)
        },
        deep: true,
      }
    },
    components: {
      monitorDetail,
      monitorSlot
    },
    inject: ['linkDetail', 'fetchType']
  }
</script>

<style lang="scss"  rel="stylesheet/scss"  scoped>

  .box-card-content {
    &:after {
      content: ' ';
      clear: both;
      display: block;
    }

    .box-card-item {
      width: 8.3333%;
      padding-right: 10px;
      float: left;
      margin-bottom: 10px;

      .box-card {
        height: 155px;
      }
    }
  }

  @media only screen and (max-width: 1650px) {
    .box-card-content {
      .box-card-item {
        width: 12.5%;
      }
    }
  }

  @media only screen and (max-width: 1200px) {
    .box-card-content {
      .box-card-item {
        width: 25%;
      }
    }
  }

  @media only screen and (min-width: 1200px) {
    /deep/ .el-col-lg-6 {
      width: 50% !important;
    }
  }

  @media only screen and (min-width: 1400px) {
    /deep/ .el-col-lg-6 {
      width: 33.3333% !important;
    }
  }

  @media only screen and (min-width: 1700px) {
    /deep/ .el-col-lg-6 {
      width: 25% !important;
    }
  }

  .box-card /deep/ {
    height: 210px;
    color: #ffffff;
    border: 1px solid #24747C;
    background-color: #242830;
    // box-shadow: darkgrey 0px 0px 8px 5px;//边框内阴影
    .card-header {
      margin: 0;
      padding: 0 8px;
      color: #f2f2f2;
      font-size: 15px;
      font-weight: bold;
      height: 38px;
      line-height: 38px;
      background-color: #1D2128;
      border: 0px;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .card-content {
      width: 100%;
      height: 120px;
      margin-top:16px;
      margin-bottom:10px;
      .progress {
          text-align: center;
          margin-top:11px;
      }
    }
  }

  .box-card1 {
    height: 175px;
    .card-content {
      height: 110px;
      margin-top: 8px;
      .progress {
        margin-top: 0;
      }
    }
  }
</style>
