<template>
  <div :class="className" :style="{height:height,width:width}" :title_name="title_name"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'

  export default {
    props: {
      title_name: {type: String, default: '饼图'},
      show_download: {type: Boolean, default: true},
      className: {type: String, default: 'chart'},
      width: {type: String, default: '100%'},
      height: {type: String, default: '400px'},
      success_count: {type: Number, default: 0},
      failed_count: {type: Number, default: 0}
    },
    data() {
      return {
        chart: null,
        option: null,
      }
    },
    watch: {
      success_count(val) {
        this.option.series[0].data = [
          {value: this.success_count, name: '成功', label: {show: this.success_count !== 0}},
          {value: this.failed_count, name: '失败', label: {show: this.failed_count !== 0}},
        ]
        this.chart.setOption(this.option)
      },
      failed_count(val) {
        this.option.series[0].data = [
          {value: this.success_count, name: '成功', label: {show: this.success_count !== 0}},
          {value: this.failed_count, name: '失败', label: {show: this.failed_count !== 0}},
        ]
        this.chart.setOption(this.option)
      },
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
          color: ['lightgreen', 'lightsalmon'],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['成功', '失败',]
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '80%',
              center: ['50%', '50%'],
              data: [
                {value: this.success_count, name: '成功', label: {show: this.success_count !== 0}},
                {value: this.failed_count, name: '失败', label: {show: this.failed_count !== 0}},
              ],
              label: {
                formatter: '{b} : {c} ({d}%)',
                position: 'inside',
                fontSize: 16,
                color:'black'
              },
            }
          ]
        };
        this.chart.setOption(this.option)

        // this.chart.setOption(this.option)
      }
    }
  }
</script>
