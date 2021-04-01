<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {zsGetAlarmHisLine} from '@/api/zabbix/zabbix_list_statistics'

  const animationDuration = 600
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
      interview_param: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {
        chart: null,
        option: null
      }
    },
    mounted() {
      this.initChart()
      this.flush()
    },
    methods: {
      flush() {
        zsGetAlarmHisLine(this.interview_param).then(response => {
          // let option = JSON.parse(JSON.stringify(this.option));  //深拷贝
          this.option.series = response
          this.chart.clear()
          console.log(this.option.series)
          this.chart.setOption(this.option)
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        const that = this
        this.option = {
          color: ['#E45959', '#E97659', '#FFA059', '#FFC859', '#7499FF', '#97AAB3'],
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
                if (params[i].seriesName.indexOf('series') != -1) {
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
          title: {
            text: '报警时间分布图'
          },
          legend: {
            // left: '50%',
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
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              saveAsImage: {}

            }
          },
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
          series: []
        }
      }
    }
  }
</script>
