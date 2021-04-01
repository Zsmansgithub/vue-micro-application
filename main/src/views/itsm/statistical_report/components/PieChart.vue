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
    title: {
      type: String,
      default: "NUll"
    },
    data:{
      default: "NUll"
    },
    legend_data:{
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
      this.option.legend.data=this.legend_data
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
          text: this.title,
          textStyle: {
            color: '#909399',
          },
          left: 'center',
        },
        grid: {
          top: 50,
          left: 50,
          right: 50,
          bottom: 50,
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return `${params.marker} ${params.name} ${params.value}（${params.percent}%）`
          }
        },
        legend: {
          left: 'center',
          bottom: '20',
          data: [],
        },
        series: []
      }
    }
  }
}
</script>
