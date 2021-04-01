<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="type">
          <el-select v-model="listQuery.type" placeholder="告警类型" style="width: 150px;" clearable @change="handleFilter">
            <el-option label="短信" key="1" value="1"></el-option>
            <el-option label="钉钉" key="2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.user" filterable remote clearable placeholder="请输入用户名"
                     :remote-method="remoteSearchMethod" no-data-text='用户未找到'
                     loading-text="查询中请稍等" :loading="loading">
            <el-option v-for="item in appnameOptionsP" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="msg">
          <el-input v-model="listQuery.msg" placeholder="msg" style="width: 200px;" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="time">
          <el-date-picker class="filter-item" v-model="listQuery.time_value" align="right" type="datetimerange"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" type="success" icon="el-icon-s-data" @click="top10ButtonClick" plain>排行统计</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%;">
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间" width="180px" prop="time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能分类" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息渠道" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息内容">
        <template slot-scope="scope">
          <span>{{ scope.row.msg  }}</span>
        </template>
      </el-table-column>


      <el-table-column label="接收人" width="180px" align="center">
        <template slot-scope="scope">
          <span style="white-space: pre">{{ scope.row.user | changeLine }} </span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :page-sizes="[10, 20]"
                :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-top: 5px;margin-top: 10px;"/>

    <el-dialog :visible.sync="show_top_10_dialog" width="1000px" :center="true" :close-on-click-modal='false' top="20px">
      <div style="margin-left: 10px;margin-bottom: 30px">
        <el-date-picker type="datetimerange" style="width: 380px;margin-left:15px;padding-right: 0" v-model="inner_dialog_time_range"
                        start-placeholder="开始时间" end-placeholder="结束时间" @change="datePickerChanged"
                        :picker-options="pickerOptions1" :clearable="false">
        </el-date-picker>
        <el-button style="margin-left: 10px" plain type="primary" icon="el-icon-search" @click="datePickerChanged">搜索</el-button>
      </div>
      <bar_chart :bar_data="line_data" title="告警接收人TOP10"></bar_chart>
      <bar_chart :bar_data="line_data2" title="告警来源TOP10"></bar_chart>
    </el-dialog>


  </div>
</template>

<script>
  import {alarmSmsLogUsers, alarmSmsLogGetTop10Data} from '@/api/zabbix'
  import {alarmMsgLog,} from '@/api/zabbix'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Chart from '@/components/Charts/LineHistory'
  import ChartL from '@/components/Charts/LineKmg'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import bar_chart from "@/components/WangHuiSelfDefined/echarts_bar_simple"

  export default {
    name: 'ZabbixList',
    mixins: [resize, sessionListQuery],
    components: {Pagination, Chart, ChartL, bar_chart},
    directives: {waves},
    filters: {
      changeLine(data) {
        return data.replace(/,/g, '\n')
      },
    },
    data() {
      return {
        line_data: {},
        line_data2: {},
        pickerOptions1: {},
        datatime_default: '',
        listQuery: {page: 1, limit: 20, time_value: undefined,},
        list: null,
        show_top_10_dialog: false,
        total: 0,
        listLoading: true,
        loading: false,
        appnameOptions: [],
        appnameOptionsP: [],
        inner_dialog_time_range: null,
      }
    },
    created() {
      this.getList();
      this.getUserList();
      this.pickerOptions1 = this.initPickerOptions();
    },
    methods: {
      top10ButtonClick() {
        let now = new Date().getTime();
        now = now - now % 86400000 + 86400000 - 28800000;
        this.inner_dialog_time_range = [now - 86400000, now];
        this.show_top_10_dialog = true;
        alarmSmsLogGetTop10Data({}).then(response => {
          this.$nextTick(() => {
            this.line_data = response.top_10_user;
            this.line_data2 = response.top_10_source;
            console.log('this.line_data', this.line_data2)
          })
        })
      },
      datePickerChanged(value) {
        if (Array.isArray(value)) {
          this.inner_dialog_time_range = [value[0].getTime(), value[1].getTime()];
        }
        let params = {time_range: this.inner_dialog_time_range.toString()};
        console.log('params', params)
        alarmSmsLogGetTop10Data(params).then(response => {
          this.line_data = response.top_10_user;
          this.line_data2 = response.top_10_source;
          console.log('this.line_data', this.line_data2)
        })
      },
      initPickerOptions() {
        return {
          onPick(time) {
            console.log(time)
          },
          shortcuts: [
            {
              text: '最近一天',
              onClick(picker) {
                let now = new Date().getTime();
                now = now - now % 86400000 + 86400000 - 28800000;
                const end = new Date();
                const start = new Date();
                start.setTime(now - 86400000);
                end.setTime(now)
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三天',
              onClick(picker) {
                let now = new Date().getTime();
                now = now - now % 86400000 + 86400000 - 28800000;
                const end = new Date();
                const start = new Date();
                start.setTime(now - 86400000 * 3);
                end.setTime(now)
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                let now = new Date().getTime();
                now = now - now % 86400000 + 86400000 - 28800000;
                const end = new Date();
                const start = new Date();
                start.setTime(now - 86400000 * 7);
                end.setTime(now)
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近两周',
              onClick(picker) {
                let now = new Date().getTime();
                now = now - now % 86400000 + 86400000 - 28800000;
                const end = new Date();
                const start = new Date();
                start.setTime(now - 86400000 * 14);
                end.setTime(now)
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                let now = new Date().getTime();
                now = now - now % 86400000 + 86400000 - 28800000;
                const end = new Date();
                const start = new Date();
                start.setTime(now - 86400000 * 30);
                end.setTime(now)
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                let now = new Date().getTime();
                now = now - now % 86400000 + 86400000 - 28800000;
                const end = new Date();
                const start = new Date();
                start.setTime(now - 86400000 * 90);
                end.setTime(now)
                picker.$emit('pick', [start, end]);
              }
            }],
        }
      },
      handleReset() {
        this.resetlistQuery();
        this.getList()
      },
      remoteSearchMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.appnameOptionsP = this.appnameOptions.filter(item => {
              return item.indexOf(query) > -1
            })
          }, 200)
        } else {
          this.appnameOptionsP = []
        }
      }
      ,
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
        }
      },
      getList() {
        this.listLoading = true;
        alarmMsgLog(this.listQuery).then(response => {
          this.list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getUserList() {
        alarmSmsLogUsers().then(response => {
          this.appnameOptions = response
        })
      },
      handleFilter() {
        if (this.listQuery.time_value) {
          this.listQuery.time_range = Math.floor(this.listQuery.time_value[0] / 1000) + ',' + Math.floor(this.listQuery.time_value[1] / 1000)
        } else {
          this.listQuery.time_range = undefined
        }
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      }
    }
  }
</script>


