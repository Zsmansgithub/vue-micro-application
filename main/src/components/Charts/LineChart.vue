<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import request from '@/utils/request2'

function myFunction(value, index, array) {
  return Object.assign(
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 2,
          opacity: 1.5
        }
      },
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
        this.$nextTick(() => {
        this.initChart(this.host_id);
    this.timer=setInterval(this.render, 600000)
    })

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
        this.option.series =response.data.map(myFunction);
        this.chart.clear();
        this.chart.setOption(this.option);
      }).catch(response => {
         this.$notify.error({
            title: '错误',
            message: '获取数据错误，请联系管理员！'
          });
        })
    },
    initChart(query) {
      this.chart = echarts.init(document.getElementById(this.id))
      this.option = {
        color: ['#91c7ae', '#d48265', '#61a0a8', '#c43b38'],
        // backgroundColor: '#d48265',
        title: {
          top: 1,
          text: this.title,
          textStyle: {
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
          y: 'bottom',
          top: 2,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          right: '20%',
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,

          textStyle: {
            color: '#fff'
          }
        },
        toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
        xAxis: {
          type: 'time',
          scale:true,
          splitLine: {show: false},
          boundaryGap : false,
        },
        yAxis: [{
          type: 'value',
          scale: true,
          splitNumber: 2,
          max:function(value) {
              return value.max + 20;
            },
          splitLine: {
            show: true
          }
        }],
        dataZoom: [{
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          handleSize: 8,
          filterMode: 'empty'
        },{
               type: 'inside',
               show: true,
               xAxisIndex: [0],
               start: 0,//默认为1
               end: 100-1500/31,//默认为100
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
      this.chart.on('click', function (params) {
        console.log(params)
      });

      this.query=this.host_id;
      this.render()
    }
  }
}
</script>
