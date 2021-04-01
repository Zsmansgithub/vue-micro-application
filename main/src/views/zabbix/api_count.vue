<template>
  <div class="dashboard-editor-container">
    <div class="box_container">
      <el-button type="primary" plain @click="clickHeadButton('7天')">7天</el-button>
      <el-button type="primary" plain @click="clickHeadButton('30天')">30天</el-button>
    </div>
    <br>
    <div class="box_container">
      <line_chart :line_data="line_data"></line_chart>
    </div>
  </div>
</template>


<script>
  import line_chart from "./components/api_count/lineChart"
  import {getLoginApiTrendData} from '@/api/zabbix/zabbix_curd'

  export default {
    components: {line_chart},
    data() {
      return {
        line_data: {}
      }
    },
    created() {
      getLoginApiTrendData().then((res) => {
        this.line_data = res
      })
    },
    methods: {
      clickHeadButton(days) {
        let time_range = null;
        let now = Math.floor(new Date().getTime() / 1000)
        let start_time = now - 86400 * 7
        if (days === '30天') {
          start_time = now - 86400 * 30
        }
        getLoginApiTrendData({time_range: start_time.toString() + ',' + now.toString()}).then((res) => {
          this.line_data = res
        })
      }
    }
  }
</script>

<style scoped>
  .dashboard-editor-container {
    padding: 27px 15px 15px 15px;
    background-color: #f0f2f5;
    position: relative;
  }

  .box_container {
    background-color: white;
    padding: 10px 0 10px 20px;
    margin: -13px 0 15px 0;
  }
</style>
