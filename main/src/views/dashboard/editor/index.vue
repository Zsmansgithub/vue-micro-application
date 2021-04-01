<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <!-- <el-row :gutter="40">
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
    <div style="height: 200px;" /> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'

// import Chart from '@/components/Charts/LineZabbix'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    // LineChart,
    // RaddarChart,
    // PieChart,
    // BarChart
  },
  data() {
    return {
      // lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(url) {
      // this.lineChartData = lineChartData[type]
      this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  background-color: rgb(240, 242, 245);
  // position: relative;

  // .github-corner {
  //   position: absolute;
  //   top: 0px;
  //   border: 0;
  //   right: 0;
  // }

  // .chart-wrapper {
  //   background: #fff;
  //   padding: 16px 16px 0;
  //   margin-bottom: 32px;
  // }
}

// @media (max-width:1024px) {
//   .chart-wrapper {
//     padding: 8px;
//   }
// }
</style>
