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
      default: "140px"
    },
    height: {
      type: String,
      default: "140px"
    },
    title: {
      type: String,
      default: "NUll"
    },
    url: {
      type: String,
      default: "NUll"
    },
    query: {
      type: Object,
      default: "NUll"
    }
  },
  data() {
    return {
      chart: null,
      option: null,
      svgFile:
        "path://M1262.070579 395.007181 1193.818522 338.972672c-127.104614-104.349696-258.541978-212.255539-387.842458-318.323917-4.000154-3.284582-8.448-5.825331-12.857344-7.348634-3.357491-1.166131-6.762086-1.755546-10.122445-1.755546-10.377216 0-18.567578 5.579571-25.214157 11.03913-108.892979 89.458688-219.655373 180.376371-326.773146 268.300288L352.912998 354.99008c-4.539597 3.724493-9.085338 7.446528-13.630669 11.165286l-0.136397 0.111002c-12.030771 9.843507-24.467456 20.023296-36.625613 30.185472-10.235085 8.554496-20.096614 20.666368-5.316198 38.525338 3.938304 4.770611 9.354854 7.394509 15.248589 7.394509 10.149069 0 18.51433-7.354368 26.606797-14.470349 1.946829-1.712538 3.787162-3.330458 5.467341-4.668621 1.641677-1.302118 3.253453-2.637005 4.859904-3.971891l23.356211-19.162726 0 71.827866c0 129.952973 0 259.905536 0.017613 389.871616 0.011878 7.274496 0.02089 15.520973 0.5632 23.722803 2.231501 33.883341 17.026662 62.071603 43.98039 83.778355 20.917453 16.827597 46.345011 25.362842 75.580211 25.362842 24.671846-0.016384 49.361306-0.02089 74.033152-0.02089l113.420698 0.011878 232.821146-0.014746c53.249229 0 106.486579 0.005734 159.735808 0.026624l0.115507 0c31.17015 0 57.95799-9.559245 79.630746-28.409037 27.116339-23.585178 40.85719-54.438707 40.839168-91.703296-0.056115-116.328448-0.047514-236.37975-0.035635-342.298624l0.005734-132.197171c8.942797 7.363379 18.952602 15.597978 28.719514 23.444275 1.380762 1.112474 2.874573 2.383872 4.468736 3.742515 8.451277 7.215104 17.19255 14.676378 27.498906 14.676378 6.368051 0 12.057395-2.965914 16.02519-8.354611C1284.804198 413.652582 1271.123149 402.431181 1262.070579 395.007181z"
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
      let success = this.query.host_normal || 0;
      let warning = this.query.host_alarm || 0;
      let error = this.query.host_down || 0;
      let total = this.query.host_total || 0;
      // 计算各颜色占比 处理数值为0情况 (error红色)默认值缩小0.1
      let offsetSuccess = total * 1 === 0 ? 1 : success * 1 === 0 ? 0 : (success / total) === 1 ? 1 : ((success / total) - 0.1) > 0 ? ((success / total) - 0.1) : 0
      let offsetWarning = total * 1 === 0 ? 1 : (success + warning) * 1 === 0 ? 0 : ((success + warning) / total) === 1 ? 1 : (((success + warning) / total) - 0.1) > 0 ? (((success + warning) / total) - 0.1) : 0
      let data = [error / total, error / total, error / total];
      this.chart = echarts.init(document.getElementById(this.id));
      let option = {
        //  backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
        //     offset: 0,
        //     color: '#431ab8'
        // }, {
        //     offset: 1,
        //     color: '#471bba'
        // }]),
        //  title: {
        //      text: (value * 100).toFixed(0) + '{a|%}',
        //      textStyle: {
        //          fontSize: 50,
        //          fontFamily: 'Microsoft Yahei',
        //          fontWeight: 'normal',
        //          color: '#bcb8fb',
        //          rich: {
        //              a: {
        //                  fontSize: 28,
        //              }
        //          }
        //      },
        //      x: 'center',
        //      y: '35%'
        //  },
        graphic: [
          {
            type: "group",
            left: "center",
            top: "60",
            children: [
              {
                type: "image",
                z: 100,
                left: "10",
                top: "16",
                style: {
                  image: require("./../../../assets/server_room/light-success.png")
                }
              },
              {
                type: "text",
                z: 100,
                left: "30",
                top: "20",
                style: {
                  fontSize: "14",
                  // fill: '#303133',
                  fill: "#fff",
                  text: `正常: ${success}`,
                  font: "20px Microsoft YaHei"
                }
              },
              {
                type: "image",
                z: 100,
                left: "10",
                top: "35",
                style: {
                  image: require("./../../../assets/server_room/light-warning.png")
                }
              },
              {
                type: "text",
                z: 100,
                left: "30",
                top: "40",
                style: {
                  fontSize: "12",
                  // fill: '#303133',
                  fill: "#fff",
                  text: `报警: ${warning}`,
                  font: "20px Microsoft YaHei"
                }
              },
              {
                type: "image",
                z: 100,
                left: "10",
                top: "55",
                style: {
                  image: require("./../../../assets/server_room/light-error.png")
                }
              },
              {
                type: "text",
                z: 100,
                left: "30",
                top: "60",
                style: {
                  fontSize: "12",
                  // fill: '#303133',
                  fill: "#fff",
                  text: `异常: ${error}`,
                  font: "20px Microsoft YaHei"
                }
              }
            ]
          }
        ],
        series: [
          {
            type: "liquidFill",
            radius: "90%",
            center: ["50%", "50%"],
            shape: this.svgFile,
            amplitude: 5,
            phase: 0,
            // wavelLength: 60,
            data: data,
            backgroundStyle: {
              color: "rgba(255, 255, 255, 0)"
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 10,
                borderColor: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: offsetSuccess,
                      color: "rgba(103, 194, 58, 1)"
                    },
                    {
                      offset: offsetWarning,
                      color: "rgba(230, 162, 60, 1)"
                    },
                    {
                      // offset: total * 1 === 0 ? 0 : 1,
                      offset: 1,
                      color: "rgba(227, 22, 22, 1)"
                    }
                  ],
                  globalCoord: false
                },
                shadowBlur: 10
              }
            },
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "rgba(227, 22, 22, .4)"
                  },
                  {
                    offset: 0.5,
                    color: "rgba(227, 22, 22, .6)"
                  },
                  {
                    offset: 0,
                    color: "rgba(227, 22, 22, 1)"
                  }
                ],
                globalCoord: false
              },
              shadowBlur: 0
            },
            label: {
              // fontSize: 16,
              // fontWeight: 100,
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
