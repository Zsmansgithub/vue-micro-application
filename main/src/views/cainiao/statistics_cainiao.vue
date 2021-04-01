<template>
  <div>
    <el-row :gutter="20">
<!--      <el-col :xs="24" :sm="24" :lg="12">-->
<!--          <chart :piedata="cnData" title="国内数据统计" height="450px" class="chart-wrapper"></chart>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="12">-->
<!--          <chart :piedata="hwData" title="海外数据统计" height="450px" class="chart-wrapper"></chart>-->
<!--      </el-col>-->
      <chart :piedata="cnData" title="国内数据统计" height="450px" class="chart-wrapper"></chart>
      <chart :piedata="hwData" title="海外数据统计" height="450px" class="chart-wrapper"></chart>
    </el-row>
  </div>
</template>

<script>
  import {getStatisticsCainiao} from '@/api/cainiao/ecs'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import Chart from '@/views/cmdb/components/statistics_pie_2'

  export default {
    name: "statistics_cainiao",
    mixins: [resize, sessionListQuery],
    components: {
      Pagination, Chart
    },
    directives: {
      waves,
    },
    data() {
      return {
        hwData: [],
        cnData: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        getStatisticsCainiao().then(res => {
          this.hwData = res.hw
          this.cnData = res.cn
        })
      }
    }
  }
</script>

<style scoped>
.chart-wrapper {
    /*margin:10px;*/
    /*background: #fff;*/
    /*padding: 16px 5px 0;*/
    /*margin-bottom: 15px;*/
    border: 1px solid cadetblue;
    /*box-shadow: 2px 2px 2px 2px #888888*/
  }
</style>
