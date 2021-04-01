<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { debounce } from '@/utils'

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
      default: '300px'
    },
    title: {
      type: String,
      default: ''
    },
    piedata: {
      type: Array
    }
  },

  data() {
    return {
      chart: null,
      names: [],
      chartData: [],
    }
  },

  watch: {
    piedata: {
      handler(newValue, oldValue) {
      this.piedata = newValue
      // this.chartData = []
      this.initChart()
      },
    deep: true
    }
  },

  created() {},

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

      this.chart.setOption({
        title: {
          // text: '板块-主机数量分布图',
          text: this.title,
          left: '20',
          top: '15',
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
          formatter: ' {b}: {c} ({d}%) '
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: []
          // orient: 'vertical',
          // x: 'left',
        },
        series: [
          // {
          //   name: '组织板块-主机数量分布图',
          //   type: 'pie',
          //   // roseType: 'area',
          //   radius: [15, 95],
          //   center: ['50%', '52%'],
          //   data: this.chartData,
          //   animationEasing: 'cubicInOut',
          //   animationDuration: 2600
          // }
          {
            // name: '访问来源',
            type: 'pie',
            // radius: ['40%', '55%'],
            radius: [25, 125],
            center: ['50%', '52%'],
            // data: this.chartData,
            animationEasing: 'cubicInOut',
            animationDuration: 600,
            label: {
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              formatter: '  {b|{b}: }{c} {per|{d}%}',
              // backgroundColor: '#eee',
              // borderColor: '#aaa',
              // borderWidth: 1,
              // borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                  // a: {
                  //     color: '#999',
                  //     lineHeight: 22,
                  //     align: 'center'
                  // },
                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },
                  hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                  },
                  b: {
                      fontSize: 13,
                      lineHeight: 20
                  },
                  per: {
                      // color: '#eee',
                      color: '#334455',
                      // backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                  }
                }
            },
            data: this.piedata,
            labelLine:{
                normal:{
                    length:15
                }
            },

          }
        ]
      })
    }
  }
}
</script>
