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
      scale: {
        type: Boolean,
        default: false
      },
      series: {
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        chart: null,
        option: null,
        selected_line: {}
      }
    },
    watch: {
      series(val) {
        this.option.series = val;
        this.chart.clear();

        let selected_line = {};
        if (val.length > 5) {
          for (let i of val) {
            selected_line[i['name']] = i['name'] === 'Seconds_Behind_Master'
          }
        }
        // console.log(selected_line);
        this.option.legend['selected'] = selected_line;

        this.chart.setOption(this.option)
      },
      scale(val) {
        this.option.yAxis[0].scale = this.scale;
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
      fulsh() {

      },
      initChart() {
        let that = this
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
                res += timestampToTimeStr(params[i].data[0], false) + '</br>'
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
              myTool: {
                show: true,
                title: '比例显示',
                icon: 'path://M0 54.857h54.796v18.286H36.531V128H18.265V73.143H0V54.857zm127.857-36.571H91.935V128H72.456V18.286H36.534V0h91.326l-.003 18.286z',
                onclick: function () {
                  that.$emit('scale_button_click')
                  // that.option.yAxis[0].scale = this.scale;
                  // that.chart.setOption(that.option)
                }
              },
            }
          },
          legend: {
            left: 'center',
            bottom: '0px',
            selected: this.selected_line
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
            },
            scale: this.scale,
            axisLabel: {
              formatter: function (value, index) {
                if (value > 1000000000) {
                  return Math.floor(value / 100000000) + '亿'
                } else if (value > 100000) {
                  return Math.floor(value / 10000) + '万'
                } else {
                  return value
                }
              }
            }
          }],
          series: this.series,
        }
        this.chart.clear()
        this.chart.setOption(this.option)
        console.log(this.scale)
      }
    }
  }
</script>
