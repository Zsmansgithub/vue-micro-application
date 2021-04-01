<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'

  const animationDuration = 600;
  import resize from '@/components/Charts/mixins/resize'
  import {timestampToTimeStr} from '@/utils/time_trans'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      line_data: {
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        chart: null,
        option: {},
      }
    },
    watch: {
      line_data(val) {
        // console.log('line_data_changed')
        this.option.xAxis.data = Object.keys(this.line_data)
        this.option.series = [{
          data: Object.values(this.line_data),
          type: 'line',
          areaStyle: {}
        }]
        this.chart.clear()
        console.log(this.option)
        this.chart.setOption(this.option)
      },
    },
    mounted() {
      this.initChart();
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.chart.dispose()
      this.chart = null
    },

    methods: {
      fulsh() {

      },
      initChart() {
        let that = this
        this.chart = echarts.init(this.$el, 'macarons')
        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (value, index) {
                if (value > 1024 * 1024 * 1024) {
                  return (value / 1024 / 1024 / 1024).toFixed(2) + 'G'
                } else if (value > 1024 * 1024) {
                  return (value / 1024 / 1024).toFixed(2) + 'M'
                } else if (value > 1024) {
                  return (value / 1024).toFixed(2) + 'K'
                }
                return parseInt(value) === parseFloat(value) ? value : value.toFixed(2)
              }
            },
          },
          dataZoom: [
            {
              type: 'slider',
              start: 0,
              end: 100,
            },
            {
              type: 'inside',
            },
          ],
          series: [{
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            data: [],
            type: 'line',
            areaStyle: {}
          }]
        }
        this.chart.clear()
        this.chart.setOption(this.option)
      }
    }
  }
</script>
