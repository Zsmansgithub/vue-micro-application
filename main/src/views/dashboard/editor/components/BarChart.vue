<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  import resize from '@/components/Charts/mixins/resize'

  export default {
    mixins: [resize],
    props: {
      className: {type: String, default: 'chart'},
      width: {type: String, default: '100%'},
      height: {type: String, default: '300px'},
      id: {type: String, default: 'chart'},
      chartData: {type: Array},
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    watch: {
      chartData: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (this.chart) {
            if (newVal) {
              this.setOption(newVal)
            } else {
              this.setOption(oldVal)
            }
          }
        }
      }
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id), 'macarons')
        this.setOption(this.chartData)
      },
      setOption(option) {
        this.chart.setOption({
          color: ['#B74B2F', '#E97659', '#FFBD8B', '#FAD954'],
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
            text: '报警时间分布图',
            textStyle: {
              color: '#1590FF',
              fontWeight: 'normal',
            }
          },
          legend: {
            type: 'scroll',
            left: 0,
            top: '10%',
            icon: "circle",
            temWidth: 10,  // 设置宽度
            itemHeight: 10, // 设置高度
          },
          grid: {
            top: '20%',
            left: '2%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          dataZoom: (this.chartData[0] && this.chartData[0].data.length > 1) ? [{
            type: 'inside',
            show: true
          }] : undefined,
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              saveAsImage: {}
            },
            iconStyle: {
              borderColor: '#1590FF',//设置颜色
            }
          },
          xAxis: [{
            type: 'time',
            scale: true,
            splitLine: {
              show: false
            },
            // 默认有横坐标
            min: function (value) {
              return value.min === Infinity ? new Date().getTime() - 86400000 : value.min
            },
            max: function (value) {
              return value.max === -Infinity ? new Date().getTime() : value.max
            }
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              show: true
            },
            min: 0,
            max: function (value) {
              return value.max === -Infinity ? 4 : value.max
            }
          }],
          series: this.chartData,
        })
      }
    }
  }
</script>
