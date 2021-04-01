<template>
  <div :class="className" :style="{height:height,width:width,display:'inline-block'}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons');
  import {debounce} from '@/utils'

  const animationDuration = 600;
  import resize from '@/components/Charts/mixins/resize'

  export default {
    mixins: [resize],
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
      },
      scale: {
        type: Boolean,
        default: false
      },
      series: {
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        chart: null,
        option: null,
        selected_line: {}
      }
    },
    watch: {
      series(val) {
        this.option.series = val;
        this.chart.clear();
        this.chart.setOption(this.option)
      },
      scale(val) {
        this.option.yAxis[0].scale = this.scale;
        this.chart.setOption(this.option)
      }
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
      window.removeEventListener('resize', this.__resizeHandler);
      this.chart.dispose();
      this.chart = null
    },

    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.option = {
          color: ['#66CDAA', '#00BFFF', '#FF8C00', '#E45959', '#FF0000', '#9400D3'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            }
          },
          toolbox: {
            show: true,
            itemSize: 17,
            itemGap: 10,
            right: 10,
            feature: {
              saveAsImage: {pixelRatio: 2},
            }
          },
          legend: {
            left: 'center',
            bottom: '0px',

          },
          grid: {
            top: 50,
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
          },
          dataZoom: [{
            type: 'inside',
            show: true
          }],
          xAxis: [{
            type: 'time',
            scale: true,
            splitLine: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              show: true
            },
            axisLabel: {
              formatter: function (value, index) {
                if (value > 1000000000) {
                  return Math.floor(value / 100000000) + '亿'
                } else if (value > 100000) {
                  return Math.floor(value / 10000) + '万'
                } else {
                  return value
                }
              }
            }
          }],
          series: this.series,
        };
        this.chart.clear();
        this.chart.setOption(this.option);
        console.log(this.scale)
      }
    }
  }
</script>
