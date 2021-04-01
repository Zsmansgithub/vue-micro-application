<template>
  <div class="dashboard-editor-container">
    <div style="text-align: right" v-show="fullscreen"><svg-icon icon-class="fullscreen" @click="click" /></div>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row :gutter="40">
      <el-col :span="6">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :span="18">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
    <div style="height: 200px;" />
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

import Chart from '@/components/Charts/LineZabbix'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      // lineChartData: lineChartData.newVisitis
      fullscreen:true
    }
  },
  created() {
    if( this.$route.path.indexOf('fullscreen') != '-1'){
      this.fullscreen=false
    }
  },
  methods: {
    handleSetLineChartData(url) {
      // this.lineChartData = lineChartData[type]
      this.$router.push(url)
    },
    click() {
      this.$router.push({name: 'server_monitor_fullscreen'})
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
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

  /*  .dashboard-editor-container {*/
  /*  !*background-size: cover;*!*/
  /*  color: #f2f2f2;*/
  /*  !*height: 510%;*!*/
  /*  height: 1000px;*/
  /*  width: 100%;*/
  /*  !*position: inherit;*!*/
  /*  background: no-repeat;*/
  /*  background-size: 100% 100%;*/
  /*  background-color: #061536;*/
  /*  background-image: url('../../../assets/dashboard.png');*/
  /*  !*padding-right: 65px;*!*/

  /*}*/
</style>
