<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import request from '@/utils/request'
import { constants } from 'fs';

function myFunction(value, index, array) {
    return Object.assign(
    {"type": "line",
    "smooth": true,
    "symbolSize": 5,
    "showSymbol": false,
    "symbol": "circle",
    }, value)
  }
function compare(value, index, array) {
    return Object.assign(
    {"type": "line",
    "smooth": true,
    "symbolSize": 5,
    "showSymbol": false,
    "symbol": "circle",
    "color":"#48B8E8"
    }, value)
  }

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
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    title: {
      type: String,
      default: "NUll"
    },
    url:{
      type: String,
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
    this.initChart(this.host_id);
    this.timer=setInterval(this.render, 600000)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  destroyed(){
      if(this.timer) {
          clearInterval(this.timer);
      }
  },
  methods: {
    timers() {
          clearInterval(this.timer);
    },
    render() {
      request({
        url: this.url,
        method: 'get',
        params: this.query
      }).then(response => {
        this.option.series = response.data.map(myFunction)
        this.chart.clear();
        this.chart.setOption(this.option);
      }).catch(response => {
         this.$notify.error({
            title: '错误',
            message: '获取数据错误，请联系管理员！'
          })});
    },
    initChart(query) {
      this.chart = echarts.init(document.getElementById(this.id))
      this.option = {
        title: {
          top: 1,
          text: this.host_id.ip,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#1e4856'
          },
            left: '5%'
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
          bottom: 20,
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
        },
        grid:  {
          top: 40,
          left: '10%',
          right: '5%',
          bottom:80
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
        },
        yAxis: [{
          type: 'value',
          splitLine: {
            show: true
          }
        }],
        dataZoom: [{
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          height:32,
          bottom:47,
          backgroundColor:"rgba(47,69,84,0)",
          borderColor:"rgba(47,69,84,0)",
        },{
               type: 'inside',
               show: true,
               backgroundColor:"rgba(47,69,84,0)",
               borderColor:"#f66c64",
           },],
        graphic: [{
            type: 'group',
            bounding: 'raw',
            right: 80,
            bottom: 100,
            children: [
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: '#000',
                        text: '星辰系统',
                    }
                }
            ]
        },
        ],
        series: [],
      };
      this.query=this.host_id;
      this.render()
    }
  }
}
</script>
