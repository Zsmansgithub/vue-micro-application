<template>
  <div id="rocketmq" ref="rocketmq" v-bind:class="[fullScreenClass]">
    <div class="mq_title">
      <div style="text-align: right" v-show="fullscreen">
        <span @click="changeType" style="padding-right: 10px">
          <el-button type="info" size="mini" round>切换</el-button>
        </span>
        <span>
          <svg-icon icon-class="fullscreen" @click="click"/>
        </span>
      </div>
      <h2 style="text-align: center; margin-top:0px">
        星辰RocketMQ监控
        <!--        <label style="color: #d9d9d9; font: small-caption;text-align: center">&copy; YTOM{{datatime}}</label>-->
      </h2>
    </div>
    <br/>
    <br/>
    <br/>
    <transition name="fade-transform">
      <div v-show="pattern === 'large'" class="box-card-content">
        <div v-for="(project,index) in data" :key="index" class="box-card-item">
          <div class="box-card data-box1" :body-style="{ padding: 0 }">
            <i class="topL">
              <div class="content-trigon-zhijiao"></div>
            </i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR">
              <div class="content-trigon-zhijiaox"></div>
            </i>
            <div class="card-header" :style="{'background-color':'rgba(44,35,255,0)'}">
              {{project['cluster_name'] }}
              <label
                style="color: #d9d9d9; font: small-caption;text-align: center"
              >Topic:{{project['topic_sum'] }} Consumer:{{ project['consume_sum']}}</label>
            </div>
            <div
              @dblclick="toRocketMqMonitor(project['cid'],project['cluster_name'])"
              class="clear content-data"
            >
              <el-col :span="8" style="text-align: center">
                <roctetmq-slot :project="project" :type="pattern"></roctetmq-slot>
              </el-col>
              <el-col :span="16">
                <roctetmq-detail :project="project" :type="pattern"></roctetmq-detail>
              </el-col>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade-transform">
      <el-row v-show="pattern === 'small'" :gutter="20">
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="6"
          :xl="6"
          v-for="(project,index) in data"
          :key="index"
          style="margin-bottom:25px"
        >
          <div class="box-card data-box1" :body-style="{ padding: 0 }">
            <i class="topL">
              <div class="content-trigon-zhijiao"></div>
            </i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR">
              <div class="content-trigon-zhijiaox"></div>
            </i>
            <div class="card-header" :style="{'background-color':'rgba(44,35,255,0)'}">
              {{project['cluster_name'] }}
              <label
                style="color: #d9d9d9; font: small-caption;text-align: center"
              >Topic:{{project['topic_sum'] }} Consumer:{{ project['consume_sum']}}</label>
            </div>
            <div
              @dblclick="toRocketMqMonitor(project['cid'],project['cluster_name'])"
              style="width: 100%;height: 150px"
            >
              <el-col :span="8" style="text-align: center">
                <roctetmq-slot :project="project" :type="pattern"></roctetmq-slot>
              </el-col>
              <el-col :span="16">
                <roctetmq-detail :project="project" :type="pattern" class="box-card-item-small"></roctetmq-detail>
              </el-col>
            </div>
          </div>
        </el-col>
      </el-row>
    </transition>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import resize from '@/components/Charts/mixins/resize'
  import roctetmqSlot from './components/roctetmq_slot'
  import roctetmqDetail from './components/roctetmq_detail'
  import { fetchRocketList } from '@/api/midmonitor/base'

  export default {
    name: 'ComplexTable',
    directives: { waves },
    mixins: [resize],
    data() {
      return {
        data: [],
        timer: '',
        listLoading: true,
        fullscreen: true,
        fullScreenClass: 'app-container',
        datatime: true,
        pattern: 'large'
      }
    },
    created() {
      if (this.$route.path.indexOf('fullscreen') !== -1) {
        this.fullscreen = false
        this.pattern = this.$route.query.pattern || 'large'
        this.fullScreenClass = 'fullclass'
      }
    },
    mounted() {
      this.getList()
      const bgImage = require('@/assets/dashboard1.jpg');
      const watermarkText = `${this.$store.getters.name} ${this.$store.getters.uuid}`;
      this.$utils.index.addWaterMarkImage(bgImage, this.$refs['rocketmq'], watermarkText);
      this.timer = setInterval(this.getList, 60000)
    },
    methods: {
      changeType() {
        this.pattern = this.pattern === 'large' ? 'small' : 'large';
      },
      click() {
        this.$router.push({
          name: 'rockmqs_fullscreen',
          query: { pattern: this.pattern }
        })
      },
      getList() {
        fetchRocketList().then(response => {
          this.data = response.data.results
          this.datatime = response.data.time
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      beforeDestroy() {
        clearInterval(this.timer)
      },
      toRocketMqMonitor(id) {
        this.$router.push({
          name: 'rocketmq_monitor',
          query: {
            cid: id
          }
        })
      }
    },
    components: {
      roctetmqSlot,
      roctetmqDetail
    }
  }
</script>

<style lang="scss"  rel="stylesheet/scss"  scoped>
  .box-card-content {
    &:after {
      content: " ";
      clear: both;
      display: block;
    }

    .box-card-item {
      width: 20%;
      padding-right: 16px;
      float: left;
      margin-bottom: 16px;

      .content-data {
        height: 115px;
        overflow: hidden;
      }
    }
  }

  @media only screen and (max-width: 1700px) {
    .box-card-content {
      .box-card-item {
        width: 33.3333%;
      }
    }
  }

  @media only screen and (max-width: 1200px) {
    .box-card-content {
      .box-card-item {
        width: 50%;
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
    /*color: #f2f2f2;*/
    /*border: 0px solid #006cff;*/
    background-color: rgba(185, 205, 255, 0);
    /*background: no-repeat;*/
    /*background-size: 100% 100%;*/
    /*background-image: url('../../../assets/mq_d.png');*/
    box-shadow: darkgrey 0px 0px 8px 5px; //边框内阴影
    .card-header {
      margin: 0;
      padding: 8px 20px;
      color: #f2f2f2;
      font-size: 15px;
      font-weight: bold;
      height: 50px;
      background-color: #67c23a;
      border: 0px;
    }
  }

  .fullclass {
    color: #f2f2f2;
    height: 100%;
    width: 100%;
    position: inherit;
    overflow-y: auto;
    overflow-x: hidden;
    /*background: no-repeat;*/
    /*background-size: 100% 100%;*/
    /*background-size: cover;*/
    background-attachment: fixed;
    background-color: #061536;
    background: url("../../../assets/dashboard1.jpg");
    padding-right: 65px;
    padding-left: 65px;

    .content-data {
      height: 130px !important;
    }

    .box-card-item {
      padding-right: 24px;
      margin-bottom: 24px;
    }
  }

  .app-container {
    color: #f2f2f2;
    /*height: calc(100vh - 100px);*/
    min-height: calc(100vh - 84px);
    width: 100%;
    position: inherit;
    /*background: no-repeat;*/
    /*background-size: 100% 100%;*/
    /*background-size: cover;*/
    background-attachment: fixed;
    background-color: #061536;
    background: url("../../../assets/dashboard1.jpg");
  }

  .mq_title {
    height: 45px;
    background: no-repeat;
    background-size: 100% 100%;
    background-image: url("../../../assets/mq_t.png");
    /*padding-right: 65px;*/
  }

  .mq_div {
    height: 200px;
    background: no-repeat;
    background-size: 100% 100%;
    background-image: url("../../../assets/mq_d.png");
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
    border-top: 16px solid green;
    top: 2px;
    /*border-bottom: 15px solid red;*/
  }

  .data-box1 {
    border: 2px solid #0d233e;
    -webkit-box-shadow: #102b4b 0px 0px 10px;
    -moz-box-shadow: #102b4b 0px 0px 10px;
    box-shadow: inset 0 0 30px #102b4b;
    position: relative;
  }

  .topL {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #22589b;
    border-top-style: solid;
    border-left-width: 2px;
    border-left-color: #22589b;
    border-left-style: solid;
    position: absolute;
    top: -2px;
    left: -2px;
  }

  .topR {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #22589b;
    border-top-style: solid;
    border-right-width: 2px;
    border-right-color: #22589b;
    border-right-style: solid;
    position: absolute;
    top: -2px;
    right: -2px;
  }

  .bottomL {
    width: 20px;
    height: 20px;
    border-bottom-width: 2px;
    border-bottom-color: #22589b;
    border-bottom-style: solid;
    border-left-width: 2px;
    border-left-color: #22589b;
    border-left-style: solid;
    position: absolute;
    bottom: -2px;
    left: -2px;
  }

  .bottomR {
    width: 20px;
    height: 20px;
    border-bottom-width: 2px;
    border-bottom-color: #22589b;
    border-bottom-style: solid;
    border-right-width: 2px;
    border-right-color: #22589b;
    border-right-style: solid;
    position: absolute;
    bottom: -2px;
    right: -2px;
  }

  .content-trigon-zhijiao {
    margin: 3px;
    width: 0px;
    height: 0px;
    border-color: transparent #26c6f0;
    border-width: 0px 0px 12px 12px;
    border-style: solid;
  }

  .content-trigon-zhijiaox {
    margin: 3px;
    width: 0px;
    height: 0px;
    border-color: #26c6f0 transparent;
    border-width: 0px 0px 12px 12px;
    border-style: solid;
  }

  .clear {
    &::after {
      content: " ";
      clear: both;
      display: block;
    }
  }

  .fade-transform-leave-to {
    transition: none;
  }
</style>
