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
    link_button:{type: Boolean, default: true},
    table_button:{type: Boolean, default: true},
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
    linkButtonClick() {
      this.$emit('show_detail');
    },
    tableButtonClick(){
      this.$emit('show_table_detail');
    },
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
            type: 'shadow'
          },
          formatter: function (params){
            console.log(params)
            var allparams = ''
            for (var i = 0; i < params.length; i++) {
              if ( params[i].value !== 0) {
                allparams = allparams + '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value
              }
            }
            return  params[0].name + allparams
          }
        },
        yAxis: {
          type: 'value',
          splitLine:{show: false},
          axisLine: {//这是y轴文字颜色
            lineStyle: {
              color: "#000",
            }
          }
        },
        legend: {
          top:'5%',
          type: 'scroll',
          data: this.chartData.legend.data
        },
        toolbox: {
          show: true,
          itemSize: 17,
          itemGap: 10,
          right: 0,
          feature: {
            mylink: {
              show: this.link_button,
              title: '未完成节点',
              icon: 'path://M64 448h256v512H64V448z m640-192h256v704H704V256zM384 64h256v896H384V64z',
              onclick: this.linkButtonClick,
              iconStyle: {
                normal: {
                  borderColor: 'grey'
                }
              }
            },
            mytable: {
              show: this.table_button,
              title: '节点时长',
              icon: 'path://M811.659 127.06H212.34c-26.524 0-50.156 12.558-65.31 32.025h-0.734v0.933c-10.479 13.865-16.707 31.113-16.707 49.791v604.38c0 45.629 37.122 82.75 82.751 82.75h599.32c45.63 0 82.75-37.121 82.75-82.75V209.81c0-45.63-37.12-82.751-82.75-82.751z m-431.33 749.414H212.341c-34.344 0-62.284-27.941-62.284-62.285V665.16H380.33v211.315z m0-225.642H150.057V437.615H380.33v213.217z m0-227.543H150.057V210.25H380.33v213.038z m249.792 453.185H394.655V665.158h235.466v211.316z m0-225.642H394.655V437.615h235.466v213.217z m0-227.543H394.655V210.25h235.466v213.038z m243.822 390.9c0 34.345-27.941 62.285-62.284 62.285H644.448V665.158h229.495V814.19z m0-163.357H644.448V437.615h229.495v213.217z m0-227.543H644.448V210.25h229.495v213.038z',
              onclick: this.tableButtonClick,
              iconStyle: {
                normal: {
                  borderColor: 'grey'
                }
              }
            },
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
