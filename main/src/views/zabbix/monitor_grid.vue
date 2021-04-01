<template>
  <div class="url-container container" id="gridWrapper" ref="gridWrapper" :class="{fullscreen: 'fullscreen'}">
    <div style="padding: 15px 18px 0 17px;position: relative;height: 100%;">
      <i class="el-icon-back icon-back" @click="backToFirst" v-show="level === 'second'"></i>
      <div style="text-align: right"><span @click="changeType" v-show="level === 'second'" style="padding-right: 10px"><el-button
        type="info" size="mini" round>切换</el-button></span>
        <svg-icon v-show="fullscreen" icon-class="fullscreen" @click="goFullscreen"/>
      </div>
      <div class="mq_title">
        <h2 style="text-align: center; margin-top: 0;"> {{ title }}
        </h2>
      </div>
      <br>
      <br>
      <transition name="fade-transform">
        <div v-show="level === 'first'" ref="first" class="box-card-content" style="padding-left: 20px;">
          <div v-for="(ins, index) in dataSet" :key="index"
               :style="{width: widthItem1 + 'px',height: heightItem1 + 'px'}"
               style="float: left;">
              <monitor_chart
                :id="ins.app_name[0]"
                :width="`${widthItem1 - 20}`"
                :data="ins.data" :height="`${heightItem1 - 20}`"
                :HEAPMAP_YAXIS_L="ins.HEAPMAP_YAXIS_L"
                :HEAPMAP_XAXIS_L="ins.HEAPMAP_XAXIS_L"
                :title="ins.title"
                :app_name="ins.app_name"
                :level="level"
                :roles="roles"
                :gridWrapper="gridWrapper"
                @goSecondLevel="goSecondLevel"
              />
          </div>
        </div>
      </transition>
      <transition name="fade-transform">
        <monitor_second :roles="roles" v-show="level === 'second'" :data="dataSecond[0].data" :pattern="pattern" :level="level"/>
      </transition>
    </div>
  </div>
</template>

<script>
  import monitor_second from './components/monitor/monitor_second';
  import monitor_chart from './components/monitor/monitor_chart';

  import { getRow } from '@/api/zabbix/urlmonitor'
  import { zaGetBaseData } from '@/api/zabbix/zabbix_alarm_dashboard'
  const HEAPMAP_XAXIS_L = 14;
  const HEAPMAP_YAXIS_L1 = 8;
  const HEAPMAP_YAXIS_L2 = 8;
  const dataList = [
    {app_name: ["公网"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L1, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["运营"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L1, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["结算"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L1, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["url监控"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L1, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["订单"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["子系统"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["基础服务"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["驿站"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["基础平台", "BI", "大数据应用"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["系统运营组"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["走件-路由-问题件-超区件"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
    {app_name: ["经营", "主数据", "OA", "网点管家"], HEAPMAP_YAXIS_L: HEAPMAP_YAXIS_L2, HEAPMAP_XAXIS_L: HEAPMAP_XAXIS_L},
  ];
  export default {
    props: {
      title: String,
      dataList: Array,
      // dataSet: Array,
    },
    data() {
      return {
        dataSet: this.dataList,
        timerFirst: '',
        fullscreen: true,
        listLoading: true,
        datatime: true,
        pattern: 'large',
        level: 'first',
        app_name: [],
        dataSecond: [{}],
        queryAppName: false,
        results: [],
        timeResizeCharts: null,
        widthItem1: 386,
        heightItem1: 320,
        roles: false,
        gridWrapper: []
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar.opened
      },
    },
    watch: {
      dataSet() {
        if (this.level === 'second') {
          this.getSecondData()
        }
      },
      sidebar(val) {
        setTimeout(() => {
          this.getChartSize()
        }, 300)
      },
    },
    created() {
      this.roles = (this.$store.getters.roles).includes('zabbix_admin') || (this.$store.getters.roles).includes('admin')
      if (this.$route.path.indexOf('fullscreen') !== -1) {
        this.fullscreen = false
        if(this.$route.query.level === 'second') {
          this.level = 'second';
          if (this.$route.query.app_name) {
            this.app_name.push(this.$route.query.app_name);
            this.queryAppName = true;
          }
        }
      }
    },
    mounted() {
      window.addEventListener('resize', this.resizeCharts)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.timerFirst)
        clearTimeout(this.timeResizeCharts)
        window.removeEventListener('resize', this.resizeCharts)
      })
      this.getRowsInf()
      this.getChartSize()
      this.timerFirst = setInterval(this.getRowsInf, 60 * 1000)
      this.$nextTick(() => {
        const wrapper = this.$refs['gridWrapper'];
        const width = wrapper.offsetWidth;
        const height = wrapper.offsetHeight;
        const bgctx = document.createElement('canvas');
        bgctx.width = width;
        bgctx.height = height;
        const bgctx2d = bgctx.getContext('2d');
        bgctx2d.fillStyle = '#2F3541';
        bgctx2d.fillRect(0, 0, width, height);
        const watermarkText = `${this.$store.getters.name} ${this.$store.getters.uuid}`;
        // const bgimg = bgctx.toDataURL('image/jpeg')
        // this.$utils.index.addWaterMarkImage(bgimg, wrapper, watermarkText);
        this.$utils.index.addWaterMarkImage(bgctx, wrapper, watermarkText);
      })
    },
    methods: {
      resizeCharts() {
          if(this.timeResizeCharts) clearTimeout(this.timeResizeCharts)
          this.timeResizeCharts = setTimeout(() => {
            this.getChartSize()
          }, 300)
      },
      getGridSize () {
          const gridWrapper = document.getElementById('gridWrapper');
          this.gridWrapper = [
              gridWrapper.getBoundingClientRect().left + window.pageXOffset,
              gridWrapper.getBoundingClientRect().right + window.pageXOffset,
              gridWrapper.getBoundingClientRect().top + window.pageYOffset,
              gridWrapper.getBoundingClientRect().bottom + window.pageYOffset
          ];
      },
      getChartSize() {
        const clientWidth = this.$refs.first.clientWidth - 20;
        if (clientWidth > 1600) {
          this.widthItem1 = Math.floor(clientWidth / 4)
        } else if (clientWidth > 1200) {
          this.widthItem1 = Math.floor(clientWidth / 3)
        } else if (clientWidth > 900) {
          this.widthItem1 = Math.floor(clientWidth / 2)
        } else if (clientWidth < 500) {
          this.widthItem1 = Math.floor(clientWidth)
        }
        this.getGridSize()
      },
      changeType() {
        this.pattern = this.pattern === 'large' ? 'small' : 'large'
      },
      goFullscreen() {
        this.$router.push(this.fullScreenRoute(this.level))
      },
      goSecondLevel(app_name) {
        this.level = 'second'
        this.app_name = app_name
        this.scrollToTop();
        this.getSecondData()
      },
      getSecondData() {
        if (this.queryAppName) {
          const item = this.results.filter(v => this.app_name.includes(v.app_name.split('_')[0]))
          const val = this.dataList.filter(v => v.app_name.includes(this.app_name[0]))
          if (item && val) {
            this.dataSecond = [
              Object.assign({}, val, {data: item}, this.fullscreen ? size1 : size2, {app_name: this.app_name})
            ]
          }
        } else {
          this.dataSecond = this.dataSet.filter((val) => {
            let isAppName = true
            this.app_name.map((v) => {
              if(!val.app_name.includes(v)) isAppName = false;
            })
            return isAppName;
          })
        }
      },
      getRowsInf(type) {
        const fetch = this.fetchType === 'url' ? getRow : zaGetBaseData
        fetch().then(response => {
          this.results = response.results;
          this.dataSet = this.dataList.reduce((list, val) => {
            const item = response.results.filter(v => val.app_name.includes(v.app_name.split('_')[0]))
            list.push(Object.assign({}, val, {data: item}, ))
            return list
          }, [])
        })
      },
      backToFirst() {
        this.level = 'first';
        this.getRowsInf();
        this.queryAppName = false;
        this.scrollToTop();
        this.$nextTick(() => {
          this.getChartSize()
        })
      },
      scrollToTop() {
        this.$utils["scroll-to"].scrollTo(0, 300);
      },
    },
    components: {
      monitor_second,
      monitor_chart,
    },
    inject: ['fetchType', 'fullScreenRoute']
  }
</script>

<style lang="scss"  rel="stylesheet/scss"  scoped>
  .icon-back {
    position: absolute;
    left: 15px;
    top: 15px;
    font-size: 18px;
  }

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

  .url-container {
    color: #f2f2f2;
    height: 100%;
    min-height: calc(100vh - 84px);
    width: 100%;
    background: no-repeat;
    background-size: 100% 100%;
    /*background-image: url('../../assets/dashboard2.png');*/
    background-color: #2F3541;
  }

  .fullscreen {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .mq_title {
    height: 45px;
    background: no-repeat;
    background-size: 100% 100%;
    background-image: url('../../assets/url_title.png');
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

  .fade-transform-leave-to {
    transition: none;
  }
</style>
