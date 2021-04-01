<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="16">

      <el-col :xs="8" :sm="8" :lg="8">
        <div style="padding:10px;border:1px solid #e3f4ff;background-color:white;margin:-10px 0 25px 0;">
          <div style="margin: 0 3px 7px 10px;color:#409EFF">根目录危险排行top10</div>
          <el-table :data="table_data_list_root" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark"
                    :header-cell-style="deviceHeaderClass" @cell-click="cellClick" :cell-style="cellStyleClass">
            <el-table-column label="ip" align="center" show-overflow-tooltip min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名" align="center" show-overflow-tooltip min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.app_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余空间" align="center" show-overflow-tooltip min-width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8">
        <div style="padding:10px;border:1px solid #e3f4ff;background-color:white;margin:-10px 0 25px 0;">
          <div style="margin: 0 3px 7px 10px;color:#409EFF">/data目录危险排行top10</div>
          <el-table :data="table_data_list_data" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark"
                    :header-cell-style="deviceHeaderClass" @cell-click="cellClick" :cell-style="cellStyleClass">
            <el-table-column label="ip" align="center" show-overflow-tooltip min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名" align="center" show-overflow-tooltip min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.app_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余空间" align="center" show-overflow-tooltip min-width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8">
        <div style="padding:10px;border:1px solid #e3f4ff;background-color:white;margin:-10px 0 25px 0;">
          <div style="margin: 0 3px 7px 10px;color:#409EFF">CPU排行top10</div>
          <el-table :data="table_data_list_cpu" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark"
                    :header-cell-style="deviceHeaderClass" @cell-click="cellClick" :cell-style="cellStyleClass">
            <el-table-column label="ip" align="center" show-overflow-tooltip min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名" align="center" show-overflow-tooltip min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.app_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="使用率" align="center" show-overflow-tooltip min-width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.value }} %</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="16">
      <el-col :xs="8" :sm="8" :lg="8">
        <div style="padding:10px;border:1px solid #e3f4ff;background-color:white;margin:-10px 0 25px 0;">
          <div style="margin: 0 3px 7px 10px;color:#409EFF">内存排行top10</div>
          <el-table :data="table_data_list_mem" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark"
                    @cell-click="cellClick" :cell-style="cellStyleClass" :header-cell-style="deviceHeaderClass">
            <el-table-column label="ip" align="center" show-overflow-tooltip min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名" align="center" show-overflow-tooltip min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.app_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="使用率" align="center" show-overflow-tooltip min-width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.value }} %</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8">
        <div style="padding:10px;border:1px solid #e3f4ff;background-color:white;margin:-10px 0 25px 0;">
          <div style="margin: 0 3px 7px 10px;color:#409EFF">网络流入排行top10</div>
          <el-table :data="table_data_list_net_in" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark"
                    :header-cell-style="deviceHeaderClass" @cell-click="cellClick" :cell-style="cellStyleClass">
            <el-table-column label="ip" align="center" show-overflow-tooltip min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名" align="center" show-overflow-tooltip min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.app_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="流量" align="center" show-overflow-tooltip min-width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8">
        <div style="padding:10px;border:1px solid #e3f4ff;background-color:white;margin:-10px 0 25px 0;">
          <div style="margin: 0 3px 7px 10px;color:#409EFF">网络流出排行top10</div>
          <el-table :data="table_data_list_net_out" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark"
                    @cell-click="cellClick" :cell-style="cellStyleClass" :header-cell-style="deviceHeaderClass">
            <el-table-column label="ip" align="center" show-overflow-tooltip min-width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名" align="center" show-overflow-tooltip min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.app_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="流量" align="center" show-overflow-tooltip min-width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

    </el-row>

  </div>
</template>


<script>
  import panel_card from "@/views/workflow/components/malfuncton_statistics/panel_card"
  import stat_table from "@/views/workflow/components/malfuncton_statistics/stat_table"
  import stat_table2 from "@/views/workflow/components/malfuncton_statistics/stat_table2"
  import pie_chart from "@/views/workflow/components/malfuncton_statistics/PieChart"
  import nested_pie from "@/views/workflow/components/malfuncton_statistics/NestedPie"
  import bar_chart from "@/views/workflow/components/malfuncton_statistics/stack_line"
  import line_chart from "./components/zabbix_list_statistics/lineChart"
  import {
    zsGetBaseData, zsGetCpuTop10, zsGetMemTop10, zsGetRootTop10, zsGetDataTop10, zsGetNetInTop10, zsGetNetOutTop10
  } from '@/api/zabbix/zabbix_list_statistics'
  import w_short_notes from "@/components/WangHuiSelfDefined/w_short_notes";

  export default {
    components: {panel_card, stat_table, stat_table2, pie_chart, bar_chart, nested_pie, line_chart, w_short_notes},
    data() {
      return {
        interview_param: {},
        table_data_list_cpu: [],
        table_data_list_mem: [],
        table_data_list_root: [],
        table_data_list_data: [],
        table_data_list_net_in: [],
        table_data_list_net_out: [],
        level_trans_dict: [],
        line_data: [],
        pie_option_source: {},
        pie_option_level: {},
        panel_card_url: "",
        panel_card_url_this_month: "",
        pie_option_subdivision: {},
        pie_option_maintenance: {},
        pie_option_brand: {},
        plain_list: 3,
        time_range: [],
        downloadLoading: false,
        alarm_source: '全部',
        alarm_source_list: ['全部', '集成组'],
        all_count: null,
        all_error_time: null,
        no_error_rate: null,
        this_month_count: null,
        table_data: null,
        table_data2: null,
        stack_line_data: null,
        show_dialog_subdivision: false,
        show_dialog_maintenance: false,
        show_dialog_divice_model: false,
        level_list: ['无影响', '轻微', '一般', '严重', '灾难'],
        color_list: ['grey', 'lightgreen', 'lightblue', 'orange', 'red'],
      }
    },
    created() {
      this.clickHeadButton('本周')
    },
    methods: {
      deviceHeaderClass() {
        return 'text-align: center;background:#f5f7fa;color:#56585c;padding:6px 0 5px 0'
      },
      cellStyleClass({row, column, rowIndex, columnIndex}) {
        let base = 'padding:6px 0;'
        if (rowIndex === 0) {
          return base + 'background:papayawhip'
        }else if (rowIndex === 1) {
          return base + 'background:oldlace'
        }else if (rowIndex === 2) {
          return base + 'background:floralwhite'
        }else if (rowIndex === 3) {
          return base + 'background:snow'
        }
        // else if (rowIndex === 4) {
        //   return base + 'background:snow'
        // }
        // else if (rowIndex === 5) {
        //   return base + 'background:bisque'
        // }
      },
      cellClick(row, column, cell, event) {
        this.$refs['multipleTable'].toggleRowExpansion(row)
      },
      fillBasicData() {
        let _time_range = [parseInt(this.time_range[0] / 1000), parseInt(this.time_range[1] / 1000) + 86400];
        let pie_option_base = {
          series: [{
            legend: {data: []},
            data: [],
          }]
        };
        zsGetBaseData({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          this.pie_option_level = JSON.parse(JSON.stringify(pie_option_base));  //深拷贝
          this.pie_option_level.series[0].data = res.level_data;
          this.pie_option_source = JSON.parse(JSON.stringify(pie_option_base));  //深拷贝
          this.pie_option_source.series[0].data = res.source_data;
        });
        zsGetCpuTop10({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          this.table_data_list_cpu = res ? res.success : []
        });
        zsGetMemTop10({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          this.table_data_list_mem = res ? res.success : []
        });
        zsGetRootTop10({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          this.table_data_list_root = res ? res.success : []
        });
        zsGetDataTop10({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          this.table_data_list_data = res ? res.success : []
        });
        zsGetNetInTop10({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          this.table_data_list_net_in = res ? res.success : []
        });
        zsGetNetOutTop10({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          this.table_data_list_net_out = res ? res.success : []
        });
        this.interview_param = {time_range: this.time_range.toString(), alarm_source: this.alarm_source};

      },
      clickHeadButton(param) {
        let now = new Date().getTime();
        // now = now - now % 86400000 + 86400000 - 28800000 - 1;
        if (param === '1小时') {
          this.time_range = [now - 86400000 / 24, now];
          this.plain_list = 1
        } else if (param === '24小时') {
          this.time_range = [now - 86400000, now];
          this.plain_list = 2
        } else if (param === '本周') {
          let first_day = this.getWeekFirstDay();
          let start_time = first_day - first_day % 86400000 - 28800000;
          let end_time = start_time + 86400000 * 7 - 1;
          this.time_range = [start_time, end_time];
          this.plain_list = 3
        } else if (param === '本月') {
          let first_day = this.getMonthFirstDay();
          let last_day = this.getMonthLastDay();
          this.time_range = [first_day - first_day % 86400000 - 28800000, last_day - last_day % 86400000 - 28800000 - 1];
          this.plain_list = 4
        }
        this.fillBasicData()

      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'sum_duration') {
            return this.formatDate(v[j] || 0)
          } else if (j === 'avg_duration') {
            return this.formatDate(v[j] || 0)
          } else if (['无影响', '轻微', '一般', '严重', '灾难'].indexOf(j) !== -1) {
            return v[j] || 0
          } else {
            return v[j]
          }
        }))
      },
      getNow() {
        let now = new Date();
        let year = now.getFullYear(); //得到年份
        let month = now.getMonth();//得到月份
        let date = now.getDate();//得到日期
        let hour = now.getHours();//得到小时
        let minu = now.getMinutes();//得到分钟
        let sec = now.getSeconds();
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        let time = year + "-" + month + "-" + date + "-" + " " + hour + ":" + minu + ":" + sec;
        return year + "年" + month + "月" + date + "日"
      },
      formatDate(cellValue) {
        let time_long = cellValue;
        let res;
        if (time_long < 60) {
          res = parseInt(time_long) + '秒'
        } else if (60 < time_long && time_long < 3600) {
          res = parseInt(time_long / 60) + '分' + parseInt(time_long % 60) + '秒'
        } else if (3600 < time_long && time_long < 86400) {
          res = parseInt(time_long / 3600) + '时' + parseInt(time_long % 3600 / 60) + '分'
        } else if (time_long > 86400) {
          let h = parseInt(time_long % 86400);
          res = parseInt(time_long / 86400) + '天' + parseInt(h / 3600) + '时' + parseInt(h % 3600 / 60) + '分'
        }
        return res
      },
      clickExportButton() {
        this.downloadLoading = true;
        import('@/vendor/ExportExcelForMultiSheet').then(excel => {
          const tHeader = ['影响项目', '故障次数', '已完成', '未完成', '总时长', '平均时长', '无影响', '轻微', '一般', '严重', '灾难'];
          const filterVal = ['project', 'all_count', 'finished_count', 'unfinished_count', 'sum_duration', 'avg_duration', '无影响', '轻微', '一般', '严重', '灾难'];
          const list = this.table_data2;
          const data = this.formatJson(filterVal, list);
          let ws = excel.export_json_to_excel({header: tHeader, data: data,});

          const tHeader2 = ['故障分类', '故障次数', '已完成', '未完成', '总时长', '平均时长', '无影响', '轻微', '一般', '严重', '灾难'];
          const filterVal2 = ['subdivision', 'all_count', 'finished_count', 'unfinished_count', 'sum_duration', 'avg_duration', '无影响', '轻微', '一般', '严重', '灾难'];
          const list2 = this.table_data;
          const data2 = this.formatJson(filterVal2, list2);
          let ws2 = excel.export_json_to_excel({header: tHeader2, data: data2,});

          excel.save_excel('故障统计-' + this.getNow(), [ws, ws2]);
          this.downloadLoading = false
        })
      },
      getMonthFirstDay() {
        let date = new Date();
        date.setDate(1);
        return date.getTime() - date.getTime() % 86400000;
      },
      getMonthLastDay() {
        let date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() + 1);
        return date.getTime() - date.getTime() % 86400000;
      },
      getPreviousMonthFirstDay() {
        let date = new Date();
        date.setDate(1);
        let [previous_month, previous_year] = date.getMonth() !== 1 ? [date.getMonth() - 1, date.getFullYear()] : [12, date.getFullYear() - 1];
        date.setFullYear(previous_year);
        date.setMonth(previous_month);
        return date.getTime() - date.getTime() % 86400000;
      },
      getYearFirstDay() {
        let date = new Date();
        date.setMonth(0);
        date.setDate(1);
        return date.getTime() - date.getTime() % 86400000;
      },
      getWeekFirstDay() {
        let date = new Date();
        let weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
        date.setDate(date.getDate() - weekday + 1);//往前算（weekday-1）天，年份、月份会自动变化
        return date.getTime() - date.getTime() % 86400000;
      },
      datePickerChanged(value) {
        this.time_range = [value[0].getTime(), value[1].getTime()];
        this.fillBasicData()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 27px 15px 15px 15px;
    background-color: #f0f2f5;
    position: relative;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 15px;
  }

  .filter-container {
    background-color: white;
    padding: 10px 0 10px 20px;
    margin: -13px 0 15px 0;
  }
</style>
