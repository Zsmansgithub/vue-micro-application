<template>
  <div class="app-container">
    <!-- <div class="search-title">核心系统/模块系统稳定率（最近12个月）</div>
    <div class="search-table">
      <el-table
        v-loading="listLoading"
        :data="tableData1"
        border
        stripe
        highlight-current-row
        size="mini"
      >
        <el-table-column label="产品" prop='label' align="center">
        </el-table-column>
        <el-table-column v-for="(item, index) in months" :key="index" :label="item" align="center">
          <template slot-scope="scoped">
            {{scoped.row[`past_time${index + 1}`]}}%
          </template>
        </el-table-column>
      </el-table>
    </div> -->
    <div class="search-table chart-content">
      <line-chart v-if="line_data.length" :id="chartId" :line_option="line_options" width='3000px' height="400px"
        :key="chartId"></line-chart>
      <div v-else style="padding-top: 20px;color: #606266;">暂无数据</div>
    </div>
    <div class="search-table chart-content">
      <line-chart v-if="line_data2.length" :id="chartId2" :line_option="line_options2" width='3000px' height="400px"
        :key="chartId2"></line-chart>
      <div v-else style="padding-top: 20px;color: #606266;">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import LineChart from './components/LineChart'
  import sessionListQuery from '@/components/mixins/sessionListQuery'
  import { getlist7, getlist8 } from '@/api/itsm/statistical_report'

  // 按业务分类 tableData1
  const data1 = {
    label: undefined, // 系统名称
  }
  const month = new Date().getMonth() + 1
  const months = Array.from({ length: 13 }).reduce((list, v, i) => {
    data1[`past_time${i + 1}`] = undefined
    const j = month - i > 0 ? month - i : month - i + 12
    list.push(j + '月')
    return list
  }, [])
  const symbolType = ['rect', 'diamond', 'triangle', 'roundRect', 'pin', 'circle', 'arrow']

  const line_options = {
    title: {
      text: '核心系统/模块系统稳定率（最近12个月）',
      textStyle: {
        color: '#909399',
      },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.marker} ${params.name} ${params.seriesName} ${params.value}%`
      }
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: [],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
      max: 100,
      minInterval: 1,
      maxInterval: 1,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
    },
    series: []
  }
  const line_options2 = {
    title: {
      text: '异常情况统计',
      textStyle: {
        color: '#909399',
      },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.marker} ${params.name} ${params.seriesName} ${params.value}`
      }
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: [],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
    },
    series: []
  }
  export default {
    components: { LineChart },
    mixins: [sessionListQuery],
    data() {
      return {
        tableData1: [],
        line_data2: [],
        line_data: [],
        line_options: {},
        line_options2: {},
        chartId: Date.now().toString(),
        chartId2: Date.now().toString(),
        listLoading: false,
        months: Object.freeze(months)
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        getlist7().then((res) => {
          this.line_data = []
          try {
            let line_data = []
            let legend_data = []
            let minValue = 95
            this.chartId = Date.now().toString()
            this.tableData1 = res.data[0].datas.reduce((list, v, idx) => {
              let val = { label: v.name }
              let line_chart_item = {
                name: v.name,
                stack: v.name,
                symbol: symbolType[idx],
                symbolSize: 12,
                type: 'line',
                data: [],
              }
              legend_data.push(v.name)
              Object.keys(data1).slice(1,).map((key, index) => {
                const value = res.data[index].datas[idx].stability_rate
                minValue = minValue < value ? minValue : value
                val[key] = value
                line_chart_item.data.push(value)
              })
              list.push(val)
              line_data.push(line_chart_item)
              return list
            }, [])
            line_options.series = line_data
            line_options.legend.data = legend_data
            line_options.yAxis.min = Math.floor(minValue)
            this.line_options = line_options
            this.line_data = line_data
          }
          catch (e) {
            console.error(e)
            this.tableData1 = []
            this.line_data = []
          }
        })
          .catch((e) => {
            console.error(e)
          })
        getlist8().then((res) => {
          this.line_data2 = []
          try {
            let line_data2 = []
            let legend_data2 = []
            this.chartId2 = Date.now().toString()
            res.data[0].datas.reduce((list, v, idx) => {
              let val = { label: v.except_name }
              let line_chart_item = {
                name: v.except_name,
                stack: v.except_name,
                symbol: symbolType[idx],
                symbolSize: 12,
                type: 'line',
                data: [],
              }
              legend_data2.push(v.except_name)
              Object.keys(data1).slice(1,).map((key, index) => {
                const value = res.data[index].datas[idx].num
                val[key] = value
                line_chart_item.data.push(value)
              })
              list.push(val)
              line_data2.push(line_chart_item)
              return list
            }, [])
            line_options2.series = line_data2
            line_options2.legend.data = legend_data2
            this.line_options2 = line_options2
            this.line_data2 = line_data2
          }
          catch (e) {
            console.error(e)
          }
        })
          .catch((e) => {
            console.error(e)
          })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/borderLightBlue.scss';

  .search-title {
    padding: 10px;
    color: #606266;
  }

  .search-table {
    @extend .border-light-blue;
  }

  .app-container {
    min-width: 800px;
  }

  .chart-content {
    display: flex;
    justify-content: center;
    min-height: 80px;
    margin-top: 20px;
  }
</style>