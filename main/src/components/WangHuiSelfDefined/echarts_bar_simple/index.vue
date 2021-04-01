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
      bar_data: {
        default: () => {
          return {}
        }
      },
      title: {
        type: String,
        default: '柱状图'
      },
    },
    data() {
      return {
        chart: null,
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          title: {
            text: this.title
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
              interval: 0
            }
          },
          yAxis: {type: 'value'},
          series: [{data: [], type: 'bar'}]
        },
      }
    },
    watch: {
      bar_data(val) {
        // console.log('bar_data_changed')
        this.option.xAxis.data = Object.keys(this.bar_data)
        this.option.series[0].data = Object.values(this.bar_data),
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
        this.chart.clear()
        this.chart.setOption(this.option)
      }
    }
  }
</script>
