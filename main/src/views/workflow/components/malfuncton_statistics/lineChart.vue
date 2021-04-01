<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'
  import {getSubdivisionDetail} from '@/api/workflow/malfunction_statistics'

  const animationDuration = 600;
  import resize from '@/components/Charts/mixins/resize'

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
      series: {
        default: () => {
          return [{
            "name": "disaster",
            "type": "line",
            "symbol": "none",
            "stack": "vistors",
            "areaStyle": {},
            "data": []
          }]
        }
      }
    },
    data() {
      return {
        chart: null,
        option: null
      }
    },
    watch: {
      series(val) {
        this.option.series = val
        this.chart.setOption(this.option)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()

      })
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
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.option = {
          color: ['#E45959'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            },
            formatter: function (params) {
              let res = ''
              for (let i = 0; i < params.length; i++) {
                if (params[i].seriesName.indexOf('series') !== -1) {
                  continue
                }
                res += params[i].axisValueLabel + '</br>'

                const value = params[i].data[1]
                res += params[i].seriesName + ':&nbsp;&nbsp;' + value
                res += '</br>'
              }
              return res
            }
          },
          toolbox: {
            show: true,
            itemSize: 17,
            itemGap: 10,
            right: 10,
            feature: {
              saveAsImage: {
                pixelRatio: 2
              },

            }
          },
          legend: {
            left: '50%',
            bottom: '0px'
          },
          grid: {
            top: 50,
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
          },
          dataZoom: [{
            type: 'inside',
            show: true
          }],
          xAxis: [{
            type: 'time',
            scale: true,
            splitLine: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              show: true
            }
          }],
          series: this.series,
        }
        this.chart.setOption(this.option)
      }
    }
  }
</script>
