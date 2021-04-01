<template>
  <div :class="className" :style="{height:height,width:width}" :title_name="title_name" :option="option"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'

  export default {
    props: {
      title_name: {type: String, default: '饼图'},
      show_download: {type: Boolean, default: true},
      option: {
        type: Object, default: () => {
          return {}
        }
      },
      className: {type: String, default: 'chart'},
      width: {type: String, default: '100%'},
      height: {type: String, default: '350px'}
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      option(val) {
        this.chart.setOption(val)
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
        this.chart.setOption({
          title: {
            text: this.title_name
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            itemSize: 17,
            itemGap: 10,
            right: 0,
            feature: {
              saveAsImage: {
                pixelRatio: 2,
                show: this.show_download,
                title: '下载',
              },
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['10%', '55%'],
              data: [],
              label: {
                formatter: '{b}: {c}'
              },
            }
          ]
        })
        this.chart.setOption(this.option)
      }
    }
  }
</script>
