<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'

  const animationDuration = 600
  import resize from '@/components/Charts/mixins/resize'

  export default {
    mixins: [resize],
    props: {
      title: {type: String, default: '线图'},
      className: {type: String, default: 'chart'},
      width: {type: String, default: '100%'},
      height: {type: String, default: '350px'},
      stack_line_data: {default: {'day_list': [], 'series': []}},
    },
    data() {
      return {
        chart: null,
        option: null
      }
    },
    watch: {
      stack_line_data(val) {
        this.chart.setOption(val)
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      });
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100);
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.chart.dispose();
      this.chart = null
    },

    methods: {
      initChart() {
        this.chart = echarts.init(this.$el)
        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            left: 0,
            icon: "circle",
            data: []
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: []
          },
          toolbox: {
            show: true,
            itemSize: 17,
            itemGap: 10,
            right: 0,
            feature: {
              saveAsImage: {
                pixelRatio: 2
              },

            },
          },
          series: []
        };
        this.chart.setOption(this.option)
      }
    }
  }
</script>
<style lang="scss"  rel="stylesheet/scss"  scoped>

</style>
