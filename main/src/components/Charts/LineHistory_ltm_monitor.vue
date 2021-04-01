<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'
  import request from '@/utils/request_response'

  function myFunction(value, index, array) {
    return Object.assign(
      {
        "type": "line",
        "smooth": true,
        "symbolSize": 5,
        "showSymbol": false,
        "symbol": "circle",
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
        default: '100%'
      },
      height: {
        type: String,
        default: '200px'
      },
      title: {
        type: String,
        default: "NUll"
      },
      url: {
        type: String,
        default: "NUll"
      },
      host_id: {
        default: "NUll"
      }
    },
    data() {
      return {
        chart: null,
        option: null,
        clicktime: undefined,
        timer: '',
        query: {},
      }
    },
    mounted() {
      this.initChart(this.host_id);
      this.timer = setInterval(this.render, 1200000)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    destroyed() {
      if (this.timer) {
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
          this.option.series=[];
          this.option.series = response.data.map(myFunction);
          this.chart.clear();
          this.chart.setOption(this.option,true);
        }).catch(response => {
          this.$notify.error({
            title: '错误',
            message: '获取数据错误，请联系管理员！'
          });
        });
      },
      initChart(query) {
        this.chart = echarts.init(document.getElementById(this.id))
        this.option = {
          title: {
            text: this.title,
            textStyle: {
              fontWeight: 'lighter',
              fontSize: 18,
              color: '#1e4856'
            },
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          toolbox: {
            right: 15,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          legend: {
            bottom: 'bottom',
            left: 'center',
            right: 25,
            selected:{
              '总计连接数':false
            }
          },
          grid: {
            top: 40,
            left: 'auto',
            right: 30,
            bottom: 40,
            containLabel:true,
            // height:this.height
          },
          xAxis: [{
            type: 'time',
            splitLine: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            scale: true,
            boundaryGap: true,
            splitLine: {
              show: true
            },
            axisLabel: {
              interval: 4,
            }
          }],
          dataZoom: [{
            type: 'slider',
            show: true,
            start: 0,
            end: 100,
            height: 32,
            bottom: 40,
            right: 32,
            handleSize: 20,
            backgroundColor: "rgba(47,69,84,0)",
            borderColor: "rgba(47,69,84,0)",
          }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
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
        let _this = this
        this.chart.on('click', function (params) {
          _this.$emit('func', params.data)
        });
        this.query = this.host_id;
        this.render()
      }
    }
  }
</script>
