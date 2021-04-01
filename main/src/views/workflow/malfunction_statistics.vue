<template>
  <div class="dashboard-editor-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true">

        <el-button type="primary" :plain="plain_list !== 1" @click="clickHeadButton('本周')">本周</el-button>
        <el-button type="primary" :plain="plain_list !== 2" @click="clickHeadButton('本月')">本月</el-button>
        <el-button type="primary" :plain="plain_list !== 3" @click="clickHeadButton('本年')">本年</el-button>
        <el-button type="primary" :plain="plain_list !== 4" @click="clickHeadButton('上一周')">上一周</el-button>
        <el-button type="primary" :plain="plain_list !== 5" @click="clickHeadButton('上个月')">上个月</el-button>

        <el-date-picker type="daterange" style="width: 280px;margin-left:15px;padding-right: 0" v-model="time_range"
                        start-placeholder="开始时间" end-placeholder="结束时间" @change="datePickerChanged">
        </el-date-picker>

        <el-select v-model="first_level" placeholder="部门" style="margin-left:10px;width:150px" clearable @change="fillBasicData">
          <el-option v-for="item in first_level_dict" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>

        <el-button :loading="downloadLoading" plain style="float:right;margin-right: 20px"
                   type="primary" icon="el-icon-download" @click="clickExportButton">导出表格
        </el-button>
      </el-form>
    </div>

    <el-row :gutter="20">
      <panel_card :title="selected_duration+' 故障总数'" :value="all_count"
                  :url="panel_card_url" icon="bug"></panel_card>
      <panel_card :title="selected_duration+' 故障时长'" :value="all_error_time" tip="未结束、无影响记录不做统计"
                  :url="panel_card_url" format_value="分" icon="history1"></panel_card>
      <panel_card :title="selected_duration+' 稳定率'" :value="no_error_rate" tip="未结束、无影响记录不做统计"
                  :url="panel_card_url" format_value="%" :decimals="2" icon="tools"></panel_card>
      <panel_card :title="'当月故障总数'" :value="this_month_count"
                  :url="panel_card_url_this_month" icon="detail_form"></panel_card>
    </el-row>


    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :lg="6">
        <nested_pie class="chart-wrapper" title_name="故障类型" :option="pie_option_subdivision"
                    @show_detail="show_dialog_subdivision=true"></nested_pie>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <nested_pie class="chart-wrapper" title_name="设备型号" :option="pie_option_brand" :show_maintenance_button="true"
                    @show_detail="show_dialog_divice_model=true" @show_maintenance_detail="show_dialog_maintenance=true"></nested_pie>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6">
        <pie_chart class="chart-wrapper" title_name="故障级别" :option="pie_option_level"></pie_chart>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <bar_chart class="chart-wrapper" title_name="故障统计" :stack_line_data="stack_line_data"></bar_chart>
      </el-col>
    </el-row>


    <el-dialog :visible.sync="show_dialog_subdivision" style="text-align: left" top="80px">
      <nested_pie class="chart-wrapper" title_name="故障类型" :option="pie_option_subdivision" :show_bigger_button="false"
                  @show_detail="show_dialog_subdivision=true" height="500px" :show_download="true"></nested_pie>
    </el-dialog>
    <el-dialog :visible.sync="show_dialog_maintenance" style="text-align: left" top="80px">
      <pie_chart class="chart-wrapper" title_name="维保商" :option="pie_option_maintenance" height="500px"></pie_chart>
    </el-dialog>
    <el-dialog :visible.sync="show_dialog_divice_model" style="text-align: left" top="80px">
      <nested_pie class="chart-wrapper" title_name="设备型号" :option="pie_option_brand" :show_bigger_button="false"
                  @show_detail="show_dialog_divice_model=true" height="500px" :show_download="true"></nested_pie>
    </el-dialog>


    <div style="padding: 10px;border:1px solid #e3f4ff;background-color:white;margin-bottom: 15px">
      <stat_table2 :table_data="table_data2" :time_range="time_range"></stat_table2>
    </div>

    <div style="padding: 10px;border:1px solid #e3f4ff;background-color:white;margin-bottom: 15px">
      <stat_table :table_data="table_data" :time_range="time_range"></stat_table>
    </div>
  </div>
</template>


<script>
  import panel_card from "./components/malfuncton_statistics/panel_card"
  import stat_table from "./components/malfuncton_statistics/stat_table"
  import stat_table2 from "./components/malfuncton_statistics/stat_table2"
  import pie_chart from "./components/malfuncton_statistics/PieChart"
  import nested_pie from "./components/malfuncton_statistics/NestedPie"
  import bar_chart from "./components/malfuncton_statistics/stack_line"
  import {getBasicData, getMaintenancePieData, getStackLineData, getTableDataDivideByProject, getBrandPieData}
    from '@/api/workflow/malfunction_statistics'
  import {getFirstLevelDict} from '@/api/workflow/malfunction_subdivision'

  export default {
    components: {panel_card, stat_table, stat_table2, pie_chart, bar_chart, nested_pie},
    data() {
      return {
        panel_card_url: "",
        panel_card_url_this_month: "",
        selected_duration: '前一月',
        pie_option_subdivision: {},
        pie_option_level: {},
        pie_option_maintenance: {},
        pie_option_brand: {},
        plain_list: 2,
        time_range: [],
        downloadLoading: false,
        first_level: '',
        first_level_dict: [],
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
      this.clickHeadButton('本月');
      getFirstLevelDict().then(response => {
        this.first_level_dict = response
      });
    },
    methods: {
      fillBasicData() {
        let _time_range = [parseInt(this.time_range[0] / 1000), parseInt(this.time_range[1] / 1000) + 86400];
        let pie_option_base = {
          series: [{
            legend: {data: []},
            data: [],
          }]
        };
        let nested_pie_option_base = {
          series: [{
            legend: {data: []},
            data: [],
          }, {
            legend: {data: []},
            data: [],
          }]
        };
        let line_stack_option_base = {
          series: [],
          yAxis: {data: []},
          color: this.color_list,
          legend: {data: this.level_list},
        };
        getBasicData({'time_range': _time_range.toString(), 'first_level': this.first_level}).then(response => {
          this.all_count = response.all_count;
          this.all_error_time = parseInt(response.all_error_time / 60);
          this.no_error_rate = response.no_error_rate * 100;
          this.this_month_count = response.this_month_count;
          this.table_data = response.table_data;

          this.pie_option_subdivision = JSON.parse(JSON.stringify(nested_pie_option_base)); //深拷贝;
          this.pie_option_subdivision.series[0].data = response.pie_option_first_level;
          this.pie_option_subdivision.series[1].data = response.pie_option_subdivision;

          this.pie_option_level = JSON.parse(JSON.stringify(pie_option_base));  //深拷贝
          this.pie_option_level.series[0].data = response.pie_option_level;
        });

        getBrandPieData({'time_range': _time_range.toString(), 'first_level': this.first_level}).then(response => {
          this.pie_option_brand = JSON.parse(JSON.stringify(nested_pie_option_base)); //深拷贝
          this.pie_option_brand.series[0].data = response.brands;
          this.pie_option_brand.series[1].data = response.device_models
        });

        getMaintenancePieData({'time_range': _time_range.toString(), 'first_level': this.first_level}).then(response => {
          this.pie_option_maintenance = JSON.parse(JSON.stringify(pie_option_base)); //深拷贝
          this.pie_option_maintenance.series[0].data = response
        });
        getStackLineData({'time_range': _time_range.toString(), 'first_level': this.first_level}).then(response => {
          // this.stack_line_data = response
          this.stack_line_data = JSON.parse(JSON.stringify(line_stack_option_base)); //深拷贝
          this.stack_line_data.series = response.series;
          this.stack_line_data.yAxis = {data: response.day_list}
        });
        getTableDataDivideByProject({'time_range': _time_range.toString(), 'first_level': this.first_level}).then(response => {
          this.table_data2 = response
        });

        this.panel_card_url = "/workflow/malfunction_record?time_range=" + this.time_range.toString();
        this.panel_card_url_this_month = "/workflow/malfunction_record?time_range=" + this.getMonthFirstDay() + ',' + new Date().getTime()
      },
      clickHeadButton(param) {
        let now = new Date().getTime();
        now = now - now % 86400000 + 86400000 - 28800000 - 1;
        this.selected_duration = param;
        if (param === '前一周') {
          this.time_range = [now - now % 86400000 - 86400000 * 7 - 28800000, now]
        } else if (param === '前一月') {
          this.time_range = [now - now % 86400000 - 86400000 * 30 - 28800000, now]
        } else if (param === '前三月') {
          this.time_range = [now - now % 86400000 - 86400000 * 90 - 28800000, now]
        } else if (param === '前一年') {
          this.time_range = [now - now % 86400000 - 86400000 * 365 - 28800000, now]
        } else if (param === '本周') {
          let first_day = this.getWeekFirstDay();
          this.time_range = [first_day - first_day % 86400000, now];
          this.plain_list = 1
        } else if (param === '本月') {
          let first_day = this.getMonthFirstDay();
          this.time_range = [first_day - first_day % 86400000, now];
          this.plain_list = 2
        } else if (param === '本年') {
          let first_day = this.getYearFirstDay();
          this.time_range = [first_day - first_day % 86400000, now];
          this.plain_list = 3
        } else if (param === '上一周') {
          let end = this.getWeekFirstDay();
          this.time_range = [end - 86400000 * 7, end - 1];
          this.plain_list = 4
        } else if (param === '上个月') {
          let end = this.getMonthFirstDay();
          let start = this.getPreviousMonthFirstDay();
          this.time_range = [start, end - 1];
          this.plain_list = 5
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
