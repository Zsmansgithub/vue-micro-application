<template>

      <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { fetchAlarmList } from '@/api/db'
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
    }
  },
  data() {
    return {
      chart: null,
      option: null
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
  mounted() {
    this.initChart()
    this.chart.setOption(this.option)
    this.flush()
  },
  methods: {
    flush() {
      const color = [
        ['#e40e09', '#EE726F'],
        ['#FF0500', '#F87A3B'],
        ['#ffc300', '#F9DE84'],
        ['rgba(76,213,206,0.69)', '#C5F8F6'],
        ['#7499FF', '#C4D2F9'],
        ['#97AAB3', '#D1D3D5'],
      ];
      fetchAlarmList().then(response => {
        try {
          response.map((v, i) => {
            v = Object.assign(v, {
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: color[i][0]
                }, {
                  offset: 1,
                  color: color[i][1]
                }])
              },
              itemStyle: {
                color: color[i][0]
              },
              smooth: true,
              smoothMonotone: 'x',
            })
            return v;
          })
        } catch (e) {
          console.error(e)
        }
        this.option.series = response
        this.chart.setOption(this.option)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      const that = this
      this.option = {
        // color: ['#e40e09', '#e94821', '#ffc300', 'rgba(76,213,206,0.69)', '#7499FF', '#97AAB3'],
        backgroundColor:'rgba(128, 128, 128, 0.0)',
        title: {
          top: 1,
          text: '报警历史信息',
          left: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          type: 'scroll',
          top: 2,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          right: '8%',
          textStyle:{
            color:'#008acd'
          }
        },
        grid: {
          left: '5%',
          right: '3%',
          top:'10%',
          bottom: '12%',
          borderWidth: 0,
        },
        xAxis: {
          type: 'time',
          splitLine: {show: false},
          boundaryGap : false,
          offset:1,
          minInterval:3600 * 24,
          maxInterval:3600 * 24 * 20,
          axisLine: {
            lineStyle:{
              color: '#008acd'
            }
          }
        },
        yAxis: [{
          type: 'value',
          splitArea:{
            show:false,
          },
          splitLine: {
            show: true,
            lineStyle:{
              type:'dashed',
              color:'#666666',

            }
          },
        }],
        dataZoom: [{
               type: 'inside',
               show: true,
               xAxisIndex: [0],
               start: 86,//默认为1
               end:100
           },],
        series: [],
      };
    }
  }
}
</script>
<style lang="scss"  rel="stylesheet/scss"  scoped>

</style>
