<template>
  <!-- <div class="dashboard-editor-container"> -->
  <div class="app-container">
    <el-row :gutter="30" class="panel-group">
      <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col"> -->
      <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click='componentName="statistics-project"'>
          <!-- <div class="card-panel-icon-wrapper icon-shopping"> -->
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-project'}">
            <svg-icon icon-class="drag" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              产品线
            </div>
            <count-to :start-val="0" :end-val="data_sum.product_sum" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click='componentName="statistics-owner"'>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-owner'}">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              负责人
            </div>
            <count-to :start-val="0" :end-val="data_sum.owner_sum" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click='componentName="statistics-vcenter"'>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-vcenter'}">
            <svg-icon icon-class="component"  class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              VCenter
            </div>
            <count-to :start-val="0" :end-val="data_sum.vcenter_sum" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>

      <!-- <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click=''>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-vm'}">
            <svg-icon icon-class="list" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              虚拟机
            </div>
            <count-to :start-val="0" :end-val="data_sum.vm_sum" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col> -->
      <!-- <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click=''>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-pd'}">
            <svg-icon icon-class="list" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              物理机
            </div>
            <count-to :start-val="0" :end-val="data_sum.pd_sum" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col> -->
      <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click='componentName="statistics-mr"'>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-mr'}">
            <svg-icon icon-class="documentation"  class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              机房
            </div>
            <count-to :start-val="0" :end-val="data_sum.machineroom_sum" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click='componentName="statistics-supplier"'>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-supplier'}">
            <svg-icon icon-class="peoples"  class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              维保商
            </div>
            <count-to :start-val="0" :end-val="data_sum.supplier_sum" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click='componentName="statistics-brand"'>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-brand'}">
            <svg-icon icon-class="user" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              品牌
            </div>
            <count-to :start-val="0" :end-val="data_sum.brand_sum" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :lg="4" :xl="3" class="card-panel-col">
        <div class="card-panel" @click='componentName="statistics-os"'>
          <div :class="{'card-panel-icon-wrapper':true,'icon-shopping':true,active:componentName==='statistics-os'}">
            <svg-icon icon-class="education"  class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              操作系统
            </div>
            <count-to :start-val="0" :end-val="data_sum.os_sum" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span class="card-panel-text" >报警历史</span>
      <div class="chart-wrapper">
          <bar-chart />
        </div>
    </el-row> -->
    <keep-alive>
      <component :is="componentName" :componentName="componentName"></component>
    </keep-alive>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getSummary } from '@/api/cmdbs/statistics'

import StatisticsProject from './components/statistics_project'
import StatisticsOwner from './components/statistics_owner'
import StatisticsMR from './components/statistics_mr'
import StatisticsSupplier from './components/statistics_supplier'
import StatisticsBrand from './components/statistics_brand'
import StatisticsOS from './components/statistics_os'
import StatisticsVcenter from './components/statistics_vcenter'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'

// import Chart from '@/components/Charts/LineZabbix'

import sessionDashboard from "@/components/mixins/sessionDashboard";

export default {
  name: 'StatisticsDashboard',
  components: {
    CountTo,
    'statistics-project': StatisticsProject,
    'statistics-owner': StatisticsOwner,
    'statistics-mr': StatisticsMR,
    'statistics-supplier': StatisticsSupplier,
    'statistics-brand': StatisticsBrand,
    'statistics-os': StatisticsOS,
    'statistics-vcenter': StatisticsVcenter,

    // LineChart,
    // RaddarChart,
    // PieChart,
    // BarChart,
  },
  mixins: [sessionDashboard],
  data() {
    return {
      data_sum: '',
      componentName: 'statistics-project',
      // lineChartData: lineChartData.newVisitis
    }
  },
  watch: {
    componentName(newVal) {
      this.setSessionItem({
        componentName: newVal
      });
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getSummary().then(response => {
        this.data_sum=response
      })
    },
    handleComp(type) {
      // this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.active{
  transition: all 0.38s ease-out;
  background: #36a3f7;
  color: #fff!important;
}

.dashboard-editor-container {
  /* padding: 32px; */
  padding: 10px 32px 50px 32px;    //top|left|bottom|right
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.panel-group {
  /* margin-top: 18px; */
  margin-top: 0px;
  padding: 0px 20px 0px 20px;
  .card-panel-col {
    // margin-bottom: 32px;
    margin-bottom: 20px;
  }

  .card-panel {
    // height: 108px;
    height: 70px;
    cursor: pointer;    //鼠标放在元素上的光标形状
    font-size: 12px;
    position: relative;
    overflow: hidden;    //内容溢出后如何处理
    color: #666;
    /* background: #fff; */
    background-color: #e3f4ff;
    // background-image: linear-gradient(to right,#eeececa8,#e3f4ff);
    // box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    box-shadow: 4px 4px 0px rgba(8, 108, 167, 0.05);    //div阴影
    border-color: rgba(0, 0, 0, .05);    //边框颜色
    border-radius: 12px;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        // background: #40c9c6;
        background: #36a3f7;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        // background: #f4516c;
        background: #36a3f7;
      }
      .icon-shopping {
        // background: #34bfa3;
        background: #36a3f7;
      }
    }

    .icon-people {
      // color: #40c9c6;
      color: #36a3f7;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      // color: #f4516c;
      color: #36a3f7;
    }
    .icon-shopping {
      // color: #34bfa3
      color: #36a3f7;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 6px 0 0 10px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      // font-size: 48px;
      font-size: 28px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      // margin: 26px;
      margin: 14px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        // line-height: 6px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
        // margin-bottom: 1px;
      }

      .card-panel-num {
        font-size: 18px;
      }
    }
  }
}

@media (max-width:550px) {
// @media (max-width:0px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
