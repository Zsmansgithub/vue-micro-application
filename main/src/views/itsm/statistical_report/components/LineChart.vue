<template>
   <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/Charts/mixins/resize'
import { debounce } from '@/utils'
import { fetchAlarmPie } from '@/api/zabbix/db'

export default {
 mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '400px'
    },
    height: {
      type: String,
      default: '400px'
    },
    line_option:{
      default: "NUll"
    },
    host_id:{
      default: "NUll"
    }
  },
  data() {
    return {
      chart: null,
      option: null,
      timer: '',
      query:{},
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      if(this.line_option) {
        this.option = Object.assign({}, this.option, this.line_option)
      }
      this.chart.clear();
      this.chart.setOption(this.option)
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
      this.chart = echarts.init(document.getElementById(this.id))
      this.option = {
        title: {
          text: '',
          textStyle: {
            color: '#909399',
          },
          left: 'center',
        },
        grid: {
          top: 50,
          left: '5%',
          right: '5%',
          bottom: 70,
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: [],
        },
         xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
        },
        series: []
      }
    }
  }
}
</script>
