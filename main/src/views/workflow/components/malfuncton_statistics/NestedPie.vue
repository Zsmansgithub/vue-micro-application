<template>
  <div :class="className" :style="{height:height,width:width}" :title_name="title_name" :option="option"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'

  export default {
    props: {
      title_name: {type: String, default: '饼图'},
      option: {
        type: Object, default: () => {
          return {}
        }
      },
      className: {type: String, default: 'chart'},
      width: {type: String, default: '100%'},
      height: {type: String, default: '350px'},
      show_bigger_button:{type: Boolean, default: true},
      show_maintenance_button:{type: Boolean, default: false},
      show_download:{type: Boolean, default: false},
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      option(val) {
        this.chart.setOption(val)
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
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
      biggerButtonClick() {
        this.$emit('show_detail');
      },
      maintenanceButtonClick(){
        this.$emit('show_maintenance_detail');
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          title: {
            text: this.title_name
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            itemSize: 17,
            itemGap: 10,
            right: 0,
            feature: {
              myTool1: {
                show: this.show_maintenance_button,
                title: '维保商饼图',
                icon: 'path://M96.258 57.462h31.421C124.794 27.323 100.426 2.956 70.287.07v31.422a32.856 32.856 0 0 1 25.971 25.97zm-38.796-25.97V.07C27.323 2.956 2.956 27.323.07 57.462h31.422a32.856 32.856 0 0 1 25.97-25.97zm12.825 64.766v31.421c30.46-2.885 54.507-27.253 57.713-57.712H96.579c-2.886 13.466-13.146 23.726-26.292 26.291zM31.492 70.287H.07c2.886 30.46 27.253 54.507 57.713 57.713V96.579c-13.466-2.886-23.726-13.146-26.291-26.292z',
                onclick: this.maintenanceButtonClick
              },
              myTool2: {
                show: this.show_bigger_button,
                title: '放大',
                icon: 'path://M38.47 52L52 38.462l-23.648-23.67L43.209 0H.035L0 43.137l14.757-14.865L38.47 52zm74.773 47.726L89.526 76 76 89.536l23.648 23.672L84.795 128h43.174L128 84.863l-14.757 14.863zM89.538 52l23.668-23.648L128 43.207V.038L84.866 0 99.73 14.76 76 38.472 89.538 52zM38.46 76L14.792 99.651 0 84.794v43.173l43.137.033-14.865-14.757L52 89.53 38.46 76z',
                onclick: this.biggerButtonClick
              },
              saveAsImage: {
                pixelRatio: 2,
                show: this.show_download,
                title: '下载',
              },
            },

          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              selectedMode: 'single',
              radius: ['10%', '30%'],

              label: {
                position: 'inner'
              },
              labelLine: {
                show: false
              },
              data: []
            },
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                formatter: '{b} : {c} ({d}%)',
              },
              data: []
            }
          ]
        })
        this.chart.setOption(this.option)
      }
    }
  }
</script>
