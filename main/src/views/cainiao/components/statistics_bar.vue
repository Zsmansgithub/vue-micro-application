<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'

  const animationDuration = 600
  import resize from '@/components/Charts/mixins/resize'

  var posList = [
    'left', 'right', 'top', 'bottom',
    'inside',
    'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
    'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
  ];

  app.configParameters = {
    rotate: {
      min: -90,
      max: 90
    },
    align: {
      options: {
        left: 'left',
        center: 'center',
        right: 'right'
      }
    },
    verticalAlign: {
      options: {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom'
      }
    },
    position: {
      options: echarts.util.reduce(posList, function (map, pos) {
        map[pos] = pos;
        return map;
      }, {})
    },
    distance: {
      min: 0,
      max: 100
    }
  };

  app.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,
    onChange: function () {
      var labelOption = {
        normal: {
          rotate: app.config.rotate,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          position: app.config.position,
          distance: app.config.distance
        }
      };
      myChart.setOption({
        series: [{
          label: labelOption
        }, {
          label: labelOption
        }, {
          label: labelOption
        }, {
          label: labelOption
        }]
      });
    }
  };

  let labelOption = {
    show: true,
    position: app.config.position,
    distance: app.config.distance,
    align: app.config.align,
    verticalAlign: app.config.verticalAlign,
    rotate: app.config.rotate,
    formatter: '{a}: {c}',
    fontSize: 14,
    textBorderWidth: 0,
    textBorderColor: 'white',
    color: 'black',
  };

  export default {
    name: "statistics_bar",
    mixins: [resize],
    props: {
      title: {type: String, default: '线图'},
      className: {type: String, default: 'chart'},
      width: {type: String, default: '100%'},
      height: {type: String, default: '350px'},
      x_axis: {type: Array, default: []},
      monitor_data: {
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {
        chart: null,
        option: {
          color: ['lightblue', 'orange', 'pink', 'lightgreen', 'tomato'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['Forest', 'Steppe', 'Desert', 'Wetland']
          },
          dataZoom: [
            {
              type: 'slider',
              startValue: 1,
              endValue: 7,
            }
          ],
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: []
        },
      }
    },
    watch: {
      monitor_data(val) {
        this.get_series()
        this.chart.setOption(this.option)
      },
      // x_axis(val) {
      //   this.option.xAxis.setOption(this.option)
      // },
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
      this.get_series()
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
      get_series() {
        let resp = []
        for (let key of Object.keys(this.monitor_data)) {
          let dic = {
            name: key,
            type: 'bar',
            barGap: 0,
            label: labelOption,
            data: this.monitor_data[key]
          }
          resp.push(dic)
        }
        this.option.legend = {data: Object.keys(this.monitor_data)}
        this.option.series = resp
        this.option.xAxis[0].data = this.x_axis
      },
      initChart() {
        this.chart = echarts.init(this.$el)
        this.chart.setOption(this.option)
      }
    }
  }

</script>

<style scoped>

</style>
