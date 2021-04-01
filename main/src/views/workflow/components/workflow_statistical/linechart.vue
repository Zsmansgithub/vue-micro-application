<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    title_name: {type: String, default: '工单'},
    className: {type: String, default: 'chart'},
    width: {type: String, default: '100%'},
    height: {type: String, default: '300px'},
    id: {type: String, default: 'chart'},
    chartData: {type: Object},
    show_download:{type: Boolean, default: true},
    show_bigger_button:{type: Boolean, default: true},
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.setOption(newVal)
          } else {
            this.setOption(oldVal)
          }
        }
      }
    }
  },
  methods: {
    // biggerButtonClick() {
    //   this.$emit('show_detail');
    // },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id), 'macarons')
      this.setOption(this.chartData)
      //自适应宽度
      // window.onresize = function () {
      //   this.chart.resize();
      // }
    },
    setOption(option) {
      this.chart.setOption({
        title: {
          text: this.title_name,
          textStyle: {//标题颜色
            fontWeight:'bolder',
            color: "#000"
          }
        },
        xAxis: {
          type: 'category',
          data: this.chartData.xAxis.data,
          axisLabel: this.chartData.xAxis.axisLabel,
          axisLine: {//这是x轴文字颜色
            lineStyle: {
              color: "#000",
            }
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          // padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          axisLine: {//这是y轴文字颜色
            lineStyle: {
              color: "#000",
            }
          }
        },
        legend: {
          top:'5%',
          data: this.chartData.legend.data
        },
        toolbox: {
          show: true,
          itemSize: 17,
          itemGap: 10,
          right: 0,
          feature: {
            // myTool2: {
            //   show: this.show_bigger_button,
            //   title: '放大',
            //   icon: 'path://M38.47 52L52 38.462l-23.648-23.67L43.209 0H.035L0 43.137l14.757-14.865L38.47 52zm74.773 47.726L89.526 76 76 89.536l23.648 23.672L84.795 128h43.174L128 84.863l-14.757 14.863zM89.538 52l23.668-23.648L128 43.207V.038L84.866 0 99.73 14.76 76 38.472 89.538 52zM38.46 76L14.792 99.651 0 84.794v43.173l43.137.033-14.865-14.757L52 89.53 38.46 76z',
            //   onclick: this.biggerButtonClick
            // },
            saveAsImage: {
              pixelRatio: 2,
              show: this.show_download,
              title: '下载',
              iconStyle: {
                normal: {
                  borderColor: 'grey'
                }
              }
            },
          },
        },
        color:this.chartData.color,
        series: this.chartData.series
      })
    }
  }
}
</script>
