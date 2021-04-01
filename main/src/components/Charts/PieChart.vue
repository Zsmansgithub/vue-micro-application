<template>
   <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
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
    title: {
      type: String,
      default: "NUll"
    },
    data:{
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
      data_pie:undefined,
      timer: '',
      query:{},
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.data_pie=this.data
      this.option.series=this.data_pie
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
   render(ss) {
        this.option.series =ss
        this.chart.clear();
        this.chart.setOption(this.option);
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.option = {
        title: {
          text: this.title
        },
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
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: []
      }
    }
  }
}
</script>
