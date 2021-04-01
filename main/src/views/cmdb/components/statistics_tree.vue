<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { debounce } from '@/utils'

import { getProjectTree } from '@/api/cmdbs/statistics'

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
      default: '450px'
    },
    treedata: {
      type: Array,
    }
  },

  data() {
    return {
      chart: undefined,
      data: [],
    }
  },

  watch: {
    treedata: {
      handler(newValue, oldValue) {
      this.unit = newValue
      this.chart = undefined
      this.initChart()
      },
    deep: true
    }
  },

  created() {
  },

  mounted() {
    this.$nextTick(() => {
      try {
      this.initChart()
      } catch(error) {}

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
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.showLoading();
      let series1 = this.treedata[0]
      // let series2 = response[1]
      this.chart.hideLoading();

      echarts.util.each(series1.children, function (datum, index) {
        index % 2 !== 0 && (datum.collapsed = true);
      });

      let option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        // legend: {
        //   top: '2%',
        //   left: '3%',
        //   orient: 'vertical',
        //   data: [{
        //       name: series1.name,
        //       icon: 'rectangle'
        //     },
        //     {
        //       name: series2.name,
        //       icon: 'rectangle'
        //   }],
        //   borderColor: '#c23531',
        //   selected: {
        //     // 选中'系列1'
        //     // '系列1': true,
        //     // 不选中'系列2'
        //     // '系列2': false
        //     // "国内速递产品部": true,
        //     // "技术中台": false,
        //   }
        // },
        series: [
          {
            type: 'tree',
            name: series1.name,
            data: [series1],
            top: '1%',
            // top: '5%',
            left: '25%',
            // left: '10%',
            bottom: '1%',
            // bottom: '2%',
            right: '40%',
            // right: '60%',
            // symbolSize: 7,
            symbolSize: 9,
            label: {
                normal: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    // fontSize: 9
                    fontSize: 15
                }
            },
            leaves: {
                label: {
                    normal: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                }
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          },
          // {
          //   type: 'tree',
          //   name: series2.name,
          //   data: [series2],
          //   // top: '20%',
          //   // left: '60%',
          //   // bottom: '22%',
          //   // right: '18%',
          //   top: '1%',
          //   // top: '5%',
          //   left: '18%',
          //   // left: '10%',
          //   bottom: '1%',
          //   // bottom: '2%',
          //   right: '20%',
          //   // right: '60%',
          //   symbolSize: 9,
          //   label: {
          //       normal: {
          //           position: 'left',
          //           verticalAlign: 'middle',
          //           align: 'right',
          //           // fontSize: 9
          //           fontSize: 15
          //       }
          //   },
          //   leaves: {
          //       label: {
          //           normal: {
          //               position: 'right',
          //               verticalAlign: 'middle',
          //               align: 'left'
          //           }
          //       }
          //   },
          //   expandAndCollapse: true,
          //   animationDuration: 550,
          //   animationDurationUpdate: 750
          // }
        ]
        // series: [
        //   {
        //     type: 'tree',
        //     data: [series1],
        //     top: '18%',
        //     bottom: '14%',
        //     layout: 'radial',
        //     symbol: 'emptyCircle',
        //     symbolSize: 7,
        //     initialTreeDepth: 3,
        //     animationDurationUpdate: 750
        //   }
        // ]
      }

      // let selected_item = {}
      // for(let i=0;i<response.length;i++) {
      //   let key = response[i].name
      //   if(i==0) {
      //     selected_item[key] = true
      //   } else {
      //     selected_item[key] = false
      //   }
      // }
      // option.legend.selected = selected_item

      this.chart.setOption(option)

    }
  }
}
</script>
