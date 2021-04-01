<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
import "echarts-liquidfill";

require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "119px"
    },
    height: {
      type: String,
      default: "119px"
    },
    title: {
      type: String,
      default: "NUll"
    },
    query: {
      type: Object,
      default: "NUll"
    },
    status: {
      type: Number,
      default: 0
    },
    state: {
      type: String,
      default: 'passageway'
    }
  },
  data() {
    return {
      chart: null,
      option: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    this.$once('hook:beforeDestroy', () => {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    })
  },
  methods: {
    initChart() {
      const chartColor = ['rgba(103,194,58,.76)', "rgba(227, 22, 22, 1)", "rgba(230, 162, 60, 1)"]
      let data = [this.query.usePercent / 100];
      this.chart = echarts.init(document.getElementById(this.id));
      let option = {
        series: [
          {
            type: "liquidFill",
            radius: "100%",
            center: ["50%", "50%"],
            shape: "rect",
            amplitude: 2,
            waveLength: "30",
            // phase: 0,
            data: data,
            backgroundStyle: {
              color: "rgba(255, 255, 255, .8)"
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0)",
                shadowBlur: 100
              }
            },
            itemStyle: {
              color: chartColor[this.status],
              shadowBlur: 0
            },
            label: {
              formatter: ""
            }
          }
        ]
      };
      this.chart.on("click", function(params) {
        console.log(params);
      });
      this.chart.setOption(option);
    }
  }
};
</script>
