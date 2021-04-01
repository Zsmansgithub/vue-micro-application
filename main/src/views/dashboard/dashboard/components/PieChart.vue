<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { fetchAlarmPie } from '@/api/zabbix/db'

export default {
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
      colors : ['#EEEC0D', '#E55125', '#5EA6FE', '#F94ED2', '#67D670', '#2ec7c9']
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      fetchAlarmPie().then(response => {
        const option = {
          series: [
            {
              name: '报警等级',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '56%'],
              data: response,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        }
        console.log(response)
        this.chart.setOption(option)
      })
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
    render() {
        fetchAlarmPie().then(response => {
        const option = {
          series: [
            {
              name: '报警等级',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '56%'],
              data: response,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        }
        this.chart.setOption(option)
      })
      },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '报警等级分布图'
        },
        color: ['#e40e09', '#e94821', '#ffc300', 'rgba(76,213,206,0.69)', '#7499FF', '#97AAB3'],
        grid: {
          top: 50
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: []
        },
        series: [
          {
            name: '报警等级',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['20%', '10%'],
            data: [],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
