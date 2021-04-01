<template>
  <div class="dashboard-editor-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true">

        <el-button type="primary" :plain="plain_list !== 1" @click="clickHeadButton('1小时')">1小时</el-button>
        <el-button type="primary" :plain="plain_list !== 2" @click="clickHeadButton('24小时')">24小时</el-button>
        <el-button type="primary" :plain="plain_list !== 3" @click="clickHeadButton('本周')">本周</el-button>
        <el-button type="primary" :plain="plain_list !== 4" @click="clickHeadButton('本月')">本月</el-button>

        <el-date-picker type="datetimerange" style="width: 380px;margin-left:15px;padding-right: 0" v-model="time_range"
                        start-placeholder="开始时间" end-placeholder="结束时间" @change="datePickerChanged">
        </el-date-picker>
        <el-select v-model="alarm_source" placeholder="部门" style="margin-left:10px;width:150px" clearable @change="fillBasicData">
          <el-option v-for="item in alarm_source_list" :key="item" :label="item" :value="item">
            <span style="float: left">{{ item }}</span>
          </el-option>
        </el-select>
      </el-form>
    </div>

    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :lg="6">
        <pie_chart class="chart-wrapper" title_name="告警级别" :option="pie_option_level"></pie_chart>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <pie_chart class="chart-wrapper" title_name="告警来源" :option="pie_option_source"></pie_chart>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <line_chart class="chart-wrapper" :line_data="line_data" :interview_param="interview_param" ref="line_chart"></line_chart>
      </el-col>
    </el-row>

    <div style="padding:10px;border:1px solid #e3f4ff;background-color:white;margin-bottom: 15px;min-height: 560px">
      <div style="margin: 0 0 7px 10px;color:grey">最经常告警的触发器top20</div>
      <el-table :data="table_data_list" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark">
<!--      <el-table :data="table_data_list" border stripe highlight-current-row ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick">-->
<!--        <el-table-column type="expand">-->
<!--          <template slot-scope="scope">-->
<!--            <div class="inner_table_class">-->
<!--              <el-table :data="scope.row.inner_table_data" border stripe highlight-current-row ref="multipleTableInner" tooltip-effect="dark">-->
<!--                <el-table-column label="排序" align="center" show-overflow-tooltip width="100px">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span>{{ scope.row.index }}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="告警描述" align="center" show-overflow-tooltip>-->
<!--                  <template slot-scope="scope">-->
<!--                    <span>{{ scope.row.description }}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="告警级别" align="center" show-overflow-tooltip width="200px">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span>{{ scope.row.priority }}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="告警数量" align="center" show-overflow-tooltip width="200px">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span>{{ scope.row.count }}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--              </el-table>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column label="主机名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.host_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="trigger_id" align="center" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.triggerid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="触发器描述" align="center" show-overflow-tooltip min-width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column label="触发器告警数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP总告警数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.all_error_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据源" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.alarm_source }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应用名" align="center" show-overflow-tooltip width="300px">
          <template slot-scope="scope">
            <span>{{ scope.row.app_name }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>


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
  import {zsGetBaseData, zsGetTableData} from '@/api/zabbix/zabbix_list_statistics'
  import w_short_notes from "@/components/WangHuiSelfDefined/w_short_notes";

  export default {
    components: {panel_card, stat_table, stat_table2, pie_chart, bar_chart, nested_pie, line_chart, w_short_notes},
    data() {
      return {
        interview_param: {},
        table_data_list: [],
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
        zsGetTableData({'time_range': _time_range.toString(), 'alarm_source': this.alarm_source}).then(res => {
          if (res) {
            this.table_data_list = res.success
          }
        });
        this.interview_param = {time_range: this.time_range.toString(), alarm_source: this.alarm_source};
        this.$nextTick(() => {
          this.$refs.line_chart.flush();
        })
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
