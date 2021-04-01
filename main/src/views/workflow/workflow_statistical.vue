<template>
  <div class="dashboard-editor-container">
    <div class="filter-container">
      <el-button type="primary" :plain="!plain_list[0]" @click="clickHeadButton('本周')">本周</el-button>
      <el-button type="primary" :plain="!plain_list[1]" @click="clickHeadButton('本月')">本月</el-button>
      <!-- <el-button type="primary" :plain="!plain_list[2]" @click="clickHeadButton('本年')">本年</el-button> -->
      <el-button type="primary" :plain="!plain_list[3]" @click="clickHeadButton('上一周')">上一周</el-button>
      <el-button type="primary" :plain="!plain_list[4]" @click="clickHeadButton('上个月')">上个月</el-button>
      <el-date-picker type="daterange" style="width: 280px;margin-left:15px;padding-right: 0" v-model="time_range"
                      :picker-options="pickerOptions" :clearable="false"
                      start-placeholder="开始时间" end-placeholder="结束时间" @change="datePickerChanged">
      </el-date-picker>
      <!-- <div style="float:right;margin-right: 20px">
        <el-button :loading="downloadLoading" plain style="margin-left: 10px"
                   type="primary" icon="el-icon-download" @click="clickExportButton">导出表格
        </el-button>
      </div> -->
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="12">
        <linechart class="chart-wrapper" :id="'mylinechart'"  title_name="工单总量" :chart-data="chartData"></linechart>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <barstackchart class="chart-wrapper" :id="'mybarchart1'"  title_name="工单状态" :chart-data="barchartData"
        :table_button="false" @show_detail="barnodechart = true"></barstackchart>
      </el-col>
      <!-- <el-col :xs="12" :sm="12" :lg="6">
        <barstackchart class="chart-wrapper" :id="'mybarchart2'"  title_name="工单未完成节点" :chart-data="barnodechartData"></barstackchart>
      </el-col> -->
      <!-- <el-col :xs="16" :sm="16" :lg="8">
        <barstackchart class="chart-wrapper" :id="'mybarchart3'"  title_name="工单时长" :chart-data="barnodetimechartData"
        :link_button="false" @show_table_detail="barnodetable = true"></barstackchart>
      </el-col> -->
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="12">
        <barstackchart class="chart-wrapper" :id="'mybarchart3'"  title_name="工单时长(单位:分)" :chart-data="barnodetimechartData"
        :link_button="false" @show_table_detail="barnodetable = true"></barstackchart>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <barstackchart class="chart-wrapper" :id="'mybarchart4'"  title_name="参与节点Top10" :chart-data="bartop10chartData"
        :table_button="false" :link_button="false"></barstackchart>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="barnodechart" style="text-align: left" top="80px">
      <barstackchart2 class="chart-wrapper" :id="'mybarchart2'"  title_name="工单未完成节点" :chart-data="barnodechartData"
      :table_button="false" :link_button="false" :height="'500px'"></barstackchart2>
    </el-dialog>
    <el-dialog :visible.sync="tabledownload" style="text-align: left" top="80px">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedworkflow" @change="handleCheckedChange">
        <el-checkbox v-for="workflow in step_line" :label="workflow.name" :key="workflow.name" style="width: 20%;">{{workflow.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tabledownload = false">取 消</el-button>
        <el-button type="primary" @click="clickExportButton">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="barnodetable" style="text-align: left" top="80px" title="工单节点时长:">
      <el-table :data="nodetime" border stripe highlight-current-row max-height="500" style="width: 100%" :span-method="cellMerge">
        <el-table-column label="申请单" align="center" min-width="2">
          <template slot-scope="scope">{{ scope.row.step_line_name }}</template>
        </el-table-column>
        <el-table-column label="节点" align="center" min-width="2">
          <template slot-scope="scope">{{ scope.row.node_name }}</template>
        </el-table-column>
        <el-table-column label="耗时-最大值" align="center" min-width="1">
          <template slot-scope="scope">{{timeComputed(scope.row.max_c_time) }}</template>
        </el-table-column>
        <el-table-column label="耗时-最小值" align="center" min-width="1">
          <template slot-scope="scope">{{timeComputed(scope.row.min_c_time) }}</template>
        </el-table-column>
        <el-table-column label="耗时-平均值" align="center" min-width="1">
          <template slot-scope="scope">{{timeComputed(scope.row.avg_c_time) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <div style="padding: 10px;border:1px solid #e3f4ff;background-color:white;margin-bottom: 15px">
      <el-tabs v-model="activeNametab" @tab-click="tabSwitching">
        <el-tab-pane label="按部门" name="first">
      <el-select v-model="owner" placeholder="请输入工号/姓名" style="width:180px" clearable  filterable @change="showtable">
        <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-table :data="tabledata" border stripe highlight-current-row style="width: 100%;margin-top: 10px;">
        <el-table-column type="expand">
          <template slot-scope="scope">
              <el-table :data="scope.row.middle" border stripe highlight-current-row style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table :data="scope.row.inner" border stripe highlight-current-row style="width: 100%,padding-left:48px">
                      <el-table-column label="序号" align="center" min-width="1">
                        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                      </el-table-column>
                      <el-table-column label="工单类型" align="center" min-width="3">
                        <template slot-scope="scope">{{ scope.row.step_line }}</template>
                      </el-table-column>
                      <el-table-column label="流程单号" align="center" min-width="3">
                        <template slot-scope="scope">{{ scope.row.uuid }}</template>
                      </el-table-column>
                      <el-table-column label="参与节点" align="center" min-width="3">
                        <template slot-scope="scope">{{ scope.row.node_name }}</template>
                      </el-table-column>
                      <el-table-column label="耗时" align="center" min-width="2">
                        <template slot-scope="scope">{{timeComputed(scope.row.c_time) }}</template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="序号" align="center" min-width="1">
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column label="部门成员" align="center" min-width="5">
                  <template slot-scope="scope">{{ scope.row.member_cname }} &nbsp; {{ scope.row.member }}</template>
                </el-table-column>
                <el-table-column label="参与工单数" align="center" min-width="2">
                  <template slot-scope="scope">{{ scope.row.count }}</template>
                </el-table-column>
                <el-table-column label="总耗时" align="center" min-width="2">
                  <template slot-scope="scope">{{timeComputed(scope.row.c_time) }}</template>
                </el-table-column>
                <el-table-column label="耗时-最大值" align="center" min-width="2">
                  <template slot-scope="scope">{{timeComputed(scope.row.max) }}</template>
                </el-table-column>
                <el-table-column label="耗时-最小值" align="center" min-width="2">
                  <template slot-scope="scope">{{timeComputed(scope.row.min) }}</template>
                </el-table-column>
                <el-table-column label="耗时-平均值" align="center" min-width="2">
                  <template slot-scope="scope">{{timeComputed(scope.row.avg) }}</template>
                </el-table-column>
              </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" min-width="1">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="部门" align="center" min-width="5">
          <template slot-scope="scope">{{ scope.row.group_cname }}</template>
        </el-table-column>
        <el-table-column label="参与工单数" align="center" min-width="2">
          <template slot-scope="scope">{{ scope.row.count }}</template>
        </el-table-column>
        <el-table-column label="总耗时" align="center" min-width="2">
          <template slot-scope="scope">{{timeComputed(scope.row.c_time) }}</template>
        </el-table-column>
        <el-table-column label="耗时-最大值" align="center" min-width="2">
          <template slot-scope="scope">{{timeComputed(scope.row.max) }}</template>
        </el-table-column>
        <el-table-column label="耗时-最小值" align="center" min-width="2">
          <template slot-scope="scope">{{timeComputed(scope.row.min) }}</template>
        </el-table-column>
        <el-table-column label="耗时-平均值" align="center" min-width="2">
          <template slot-scope="scope">{{timeComputed(scope.row.avg) }}</template>
        </el-table-column>
      </el-table>
        </el-tab-pane>
        <el-tab-pane label="按工单类型" name="second">
          <el-select v-model="steplinename" placeholder="请选择工单类型" filterable
            class="filter-item" style="width:180px" @change="showsteplinetable">
          <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
          <el-select v-model="people" placeholder="申请人工号/姓名" style="width:180px" clearable  filterable @change="showsteplinetable">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.label">
            </el-option>
          </el-select>
          <el-input v-model="uuid" placeholder="请输入申请单号" style="width: 180px;" clearable @blur="showsteplinetable" @clear="showsteplinetable" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="showsteplinetable" style="margin-left:10px;height:36px;">搜索</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" plain style="margin-left:10px;height:36px;"
            @click="uuid = '',people = '',showsteplinetable()">重置</el-button>
          <!-- <el-button :loading="downloadLoading" plain style="margin-left:10px;height:36px;"
                     type="primary" icon="el-icon-download" @click="tabledownload=true">导出表格
          </el-button> -->
          <div style="float:right;margin-right: 20px">
            <el-button :loading="downloadLoading" plain style="margin-left:10px;height:36px;"
                       type="primary" icon="el-icon-download" @click="tabledownload=true">导出表格
            </el-button>
          </div>
          <el-table :data="workflowtabledata" border stripe highlight-current-row style="width: 100%;margin-top: 10px;">
            <!-- <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table :data="scope.row.detail" border stripe highlight-current-row style="width: 100%">
                  <el-table-column label="节点名称" align="center" min-width="1">
                    <template slot-scope="scope">{{ scope.row.node_name }}</template>
                  </el-table-column>
                  <el-table-column label="处理人" align="center" min-width="1">
                    <template slot-scope="scope">{{ scope.row.处理人 }}</template>
                  </el-table-column>
                  <el-table-column label="耗时" align="center" min-width="1">
                    <template slot-scope="scope">{{timeComputed(scope.row.耗时)}}</template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column> -->
            <el-table-column label="序号" align="center" min-width="1">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="申请单类型" align="center" min-width="2">
              <template slot-scope="scope">{{ scope.row.申请单类型 }}</template>
            </el-table-column>
            <el-table-column label="申请单号" align="center" min-width="2">
              <template slot-scope="scope">{{ scope.row.申请单号 }}</template>
            </el-table-column>
            <el-table-column label="申请人" align="center" min-width="2">
              <template slot-scope="scope">{{ scope.row.申请人 }}</template>
            </el-table-column>
            <el-table-column label="总耗时" align="center" min-width="2">
              <template slot-scope="scope">{{timeComputed(scope.row.总耗时) }}</template>
            </el-table-column>
            <el-table-column label="节点" align="center" min-width="3">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.detail">
                  <span style="float: left;">{{item.node_name}} : {{item.处理人}} {{timeComputed(item.耗时)}}</span>
                <!-- {{item.node_name}} {{item.处理人}} {{timeComputed(item.耗时)}} -->
                <br v-if="index !== scope.row.detail.length-1" />
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
  import {getUserInfo} from '@/api/zabbix/user_info'
  import {getdayworkflownumData,getstatusworkflownumData,getnodeworkflownumData,getworkflowtableData,gettopData,
          getnodeworkflowtimeData,getworkflowtimetableData,getworkflownodetimetableData} from '@/api/workflow/workflow_statistical'
  import {getWorkFlowLine} from '@/api/workflow/app_line'
  import linechart from './components/workflow_statistical/linechart'
  import barstackchart from './components/workflow_statistical/barstackchart'
  import barstackchart2 from './components/workflow_statistical/barstackchart2'

  export default {
    components: {
      linechart,barstackchart,barstackchart2
    },
    data() {
      return {
        pickerMinDate:'',//获取开始选择时间
        pickerMaxDate:'',//获取结束选择时间
        pickerOptions: { //时间范围选择控制
          onPick: ({ maxDate, minDate }) => {
            if (minDate) {
              this.pickerMinDate = minDate.getTime()
            }
            if (maxDate) {
              this.pickerMinDate = ''
              this.pickerMaxDate =  maxDate.getTime()
            }
          },
          disabledDate: (time) => {
            const day30 = 30 * 24 * 60 * 60 * 1000
            if (this.pickerMinDate !== '') {
              let maxTime = this.pickerMinDate + day30
              return time.getTime() > maxTime || time.getTime() > Date.now()
            }
            if (this.pickerMaxDate !== '' && this.pickerMinDate == '') {
              let minTime = this.pickerMaxDate - day30
              return time.getTime() < minTime || time.getTime() > Date.now()
            }
            return time.getTime() > Date.now()
          }
        },
        activeNametab: 'first',
        plain_list: [0, 0, 0, 0, 0],
        downloadLoading: false,
        barnodechart:false,
        barnodetable:false,
        tabledownload:false,
        checkAll: false,
        checkedworkflow: ['新应用申请', '虚拟机申请'],
        isIndeterminate: true,
        userOptions: [],
        step_line:[],
        step_line_options:[],
        owner:'',
        people:'',
        uuid:'',
        steplinename:'新应用申请',
        time_range: [],
        chartData: {
          xAxis: {
            data: [],
            axisLabel: {
              interval:0,
              rotate:40,
            }
          },
          legend: {
            data: ['驳回','已完成','未完成']
          },
          color:['#F56C6C','#67C23A','#1890ff'],//红、绿、蓝  对应  驳回、已完成、未完成
          series: []
        },
        barchartData: {
          xAxis: {
            data: [],
            axisLabel: {
              interval:0,
              rotate:40
            }
          },
          legend: {
            data: ['驳回','已完成','未完成']
          },
          color:['#F56C6C','#67C23A','#1890ff'],//红、绿、蓝  对应  驳回、已完成、未完成
          series: [],
        },
        barnodechartData: {
          xAxis: {
            data: [],
            axisLabel: {
              interval:0,
              rotate:40
            }
          },
          legend: {
            data: []
          },
          color:[],
          series: [],
        },
        barnodetimechartData: {
          xAxis: {
            data: [],
            axisLabel: {
              interval:0,
              rotate:40
            }
          },
          legend: {
            data: []
          },
          color:['#E6A23C'],
          series: [{
            data:[],
            type:'bar'
          }],
        },
        bartop10chartData: {
          xAxis: {
            data: [],
            axisLabel: {
              interval:0,
              rotate:40
            }
          },
          legend: {
            data: []
          },
          color:['#E6A23C'],
          series: [{
            data:[],
            type:'bar'
          }],
        },
        linestack:{
          name:'',
          type:'line',
          smooth: false,
          data:[]
        },
        barstack:{
          name:'',
          type:'bar',
          stack:'工单',
          data:[]
        },
        bar:{
          name:'',
          type:'bar',
          data:[]
        },
        tabledata:[],
        workflowtabledata:[],
        nodetime:[],
        // labelList:[],
        spanArr:[],
      }
    },
    created() {
      this.clickHeadButton('本月')
      getUserInfo().then(response => {
        this.userOptions = response
      });
      getWorkFlowLine().then(response => {
        this.step_line = response
      })
    },
    beforeUpdate(){
      this.activeNametab = sessionStorage.getItem('activeNametab')
      if(!this.activeNametab) {
        this.activeNametab='first'
      }
    },
    methods: {
      tabSwitching(){
        sessionStorage.setItem("activeNametab", this.activeNametab);
      },
      fillBasicData() {
        let time_range = [parseInt(this.time_range[0] / 1000), parseInt(this.time_range[1] / 1000) + 86400];
        getdayworkflownumData({'time_range': time_range.toString()}).then(response => {
          this.chartData.xAxis.data = response.day_list
          this.chartData.series = []
          for (var i = 0; i < this.chartData.legend.data.length; i++) {
            const configinfo = Object.assign({}, this.linestack)
            configinfo.name = this.chartData.legend.data[i]
            this.chartData.series.push(configinfo)
          }
          this.chartData.series[0].data = response.reject_list
          this.chartData.series[1].data = response.end_list
          this.chartData.series[2].data = response.not_end_list
        })
        getstatusworkflownumData({'time_range': time_range.toString()}).then(response => {
          this.barchartData.xAxis.data = response.step_line_list
          this.barchartData.series = []
          for (var i = 0; i < this.barchartData.legend.data.length; i++) {
            const configinfo = Object.assign({}, this.barstack)
            configinfo.name = this.barchartData.legend.data[i]
            this.barchartData.series.push(configinfo)
          }
          this.barchartData.series[0].data = response.reject_list
          this.barchartData.series[1].data = response.end_list
          this.barchartData.series[2].data = response.not_end_list
        })
        getnodeworkflownumData({'time_range': time_range.toString()}).then(response => {
          this.barnodechartData.xAxis.data = response.step_line_list
          this.barnodechartData.legend.data = Object.keys(response)
          this.barnodechartData.legend.data.splice(this.barnodechartData.legend.data.indexOf('step_line_list'),1) //去掉step_line_list
          this.barnodechartData.series = []
          for (var i = 0; i < this.barnodechartData.legend.data.length; i++) {
            this.barnodechartData.color[i] = '#'+Math.floor(Math.random()*0xffffff).toString(16) //随机颜色
            const configinfo = Object.assign({}, this.barstack)
            configinfo.name = this.barnodechartData.legend.data[i]
            configinfo.data = response[this.barnodechartData.legend.data[i]]
            this.barnodechartData.series.push(configinfo)
          }
        })
        getnodeworkflowtimeData({'time_range': time_range.toString()}).then(response => {
          this.barnodetimechartData.xAxis.data = response.step_line_list
          this.barnodetimechartData.series[0].data = response.sum_list
        })
        gettopData({'time_range': time_range.toString()}).then(response => {
          this.bartop10chartData.xAxis.data = response.user_name
          this.bartop10chartData.series[0].data = response.count
        })
        getworkflownodetimetableData({'time_range': time_range.toString()}).then(response => {
          this.nodetime = response
          //处理数据
          this.spanArr = []
          for (var i = 0; i < this.nodetime.length; i++) {
            if (i === 0) {
              this.spanArr.push(1);
              this.pos = 0
            } else {
            // 判断当前元素与上一个元素是否相同
              if (this.nodetime[i].step_line_name === this.nodetime[i - 1].step_line_name) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
            }
          }
        })
        this.showtable()
        this.showsteplinetable()
      },
      showtable(){
        let time_range = [parseInt(this.time_range[0] / 1000), parseInt(this.time_range[1] / 1000) + 86400];
        getworkflowtimetableData({'time_range': time_range.toString(),'user_uuid':this.owner}).then(response => {
          this.tabledata = response
        })
      },
      showsteplinetable(){
        let time_range = [parseInt(this.time_range[0] / 1000), parseInt(this.time_range[1] / 1000) + 86400];
        getworkflowtableData({'time_range': time_range.toString(),'step_line_name':this.steplinename,'proposer':this.people,'uuid':this.uuid}).then(response => {
          this.workflowtabledata = response
          // this.labelList = Object.keys(this.workflowtabledata[0])
          // console.log(this.labelList)
        })
      },
      clickHeadButton(param) {
        let now = new Date().getTime()
        now = now - now % 86400000 + 86400000 - 28800000 - 1
        // this.selected_duration = param;
        if (param === '本周') {
          let first_day = this.getWeekFirstDay();
          this.time_range = [first_day - first_day % 86400000, now]
          this.plain_list = [1, 0, 0, 0, 0]
        } else if (param === '本月') {
          let first_day = this.getMonthFirstDay();
          this.time_range = [first_day - first_day % 86400000, now]
          this.plain_list = [0, 1, 0, 0, 0]
        } else if (param === '本年') {
          let first_day = this.getYearFirstDay();
          this.time_range = [first_day - first_day % 86400000, now]
          this.plain_list = [0, 0, 1, 0, 0]
        } else if (param === '上一周') {
          let end = this.getWeekFirstDay();
          this.time_range = [end - 86400000 * 7, end - 1]
          this.plain_list = [0, 0, 0, 1, 0]
        } else if (param === '上个月') {
          let end = this.getMonthFirstDay();
          let start = this.getPreviousMonthFirstDay()
          this.time_range = [start, end - 1]
          this.plain_list = [0, 0, 0, 0, 1]
        }
        this.fillBasicData()
      },
      getYearFirstDay() {
        let date = new Date();
        date.setMonth(0);
        date.setDate(1);
        return date.getTime() - date.getTime() % 86400000;
      },
      getMonthFirstDay() {
        let date = new Date();
        date.setDate(1);
        return date.getTime() - date.getTime() % 86400000;
      },
      getWeekFirstDay() {
        let date = new Date();
        let weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
        date.setDate(date.getDate() - weekday + 1);//往前算（weekday-1）天，年份、月份会自动变化
        return date.getTime() - date.getTime() % 86400000;
      },
      getPreviousMonthFirstDay() {
        let date = new Date();
        date.setDate(1);
        let [previous_month, previous_year] = date.getMonth() !== 1 ? [date.getMonth() - 1, date.getFullYear()] : [12, date.getFullYear() - 1];
        date.setFullYear(previous_year)
        date.setMonth(previous_month)
        return date.getTime() - date.getTime() % 86400000;
      },
      datePickerChanged(value) {
        this.time_range = [value[0].getTime(), value[1].getTime()]
        this.fillBasicData()
      },
      timeComputed: function (minute) {
        let day = parseInt(minute/60/24)
        let hour = parseInt(minute/60%24)
        minute = parseInt(minute - day*24*60 - hour*60 )
        let process_time = ''
        if ( day == 0 && hour == 0 && minute == 0 ) {
          process_time = '0'
          return process_time
        } else{
          if ( day !== 0 ) {
            process_time = process_time + day + '天'
          }
          if ( hour !== 0 ) {
            process_time = process_time + hour + '时'
          }
          if ( minute !== 0 ) {
            process_time = process_time + minute +'分'
          }
          // let process_time = day + '天' + hour + '时'+ minute +'分'
          return process_time
        }
      },
      //合并表格
      cellMerge({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
      },
      getNow() {
        let now = new Date();
        let year = now.getFullYear(); //得到年份
        let month = now.getMonth();//得到月份
        let date = now.getDate();//得到日期
        // let hour = now.getHours();//得到小时
        // let minu = now.getMinutes();//得到分钟
        // let sec = now.getSeconds();
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        // if (hour < 10) hour = "0" + hour;
        // if (minu < 10) minu = "0" + minu;
        // if (sec < 10) sec = "0" + sec;
        // let time = year + "-" + month + "-" + date + "-" + " " + hour + ":" + minu + ":" + sec;
        return year + "年" + month + "月" + date + "日"
      },
      // 导出表格
      handleCheckAllChange(val) {
        this.step_line_options = []
        for (var i = 0; i < this.step_line.length; i++) {
          this.step_line_options[i] = this.step_line[i].name
        }
        console.log(this.step_line_options)
        this.checkedworkflow = val ? this.step_line_options : [];
        this.isIndeterminate = false;
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.step_line.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.step_line.length;
      },
      clickExportButton() {
        this.tabledownload = false
        this.downloadLoading = true
        import('./components/workflow_statistical/exportexcelforsheets').then(excel => {
          //嵌套 多表
          let time_range = [parseInt(this.time_range[0] / 1000), parseInt(this.time_range[1] / 1000) + 86400];
          var workflowtabledata = []
          var workflownum = this.checkedworkflow.length
          var ws_list = []
          var sheetsname = []
          for (var i = 0; i < this.checkedworkflow.length; i++) {
            getworkflowtableData({'time_range': time_range.toString(),'step_line_name':this.checkedworkflow[i]}).then(response => {
              workflowtabledata = response
              if (workflowtabledata.length !== 0) {
               const tHeader = ['申请单类型', '申请单号', '申请人', '总耗时','节点'];
               let data = []
               workflowtabledata.forEach((item,index) => {
                 let tbody = []
                 tbody.push(item['申请单类型'])
                 tbody.push(item['申请单号'])
                 tbody.push(item['申请人'])
                 tbody.push(this.timeComputed(item['总耗时']))
                 if(item.detail){
                   item.detail.forEach((child,ind) => {
                     tbody.push(child.node_name)
                     tbody.push(child['处理人'])
                     tbody.push(this.timeComputed(child['耗时']))
                   })
                 }
                 data.push(tbody)
               })
               let ws = excel.export_json_to_excel({header: tHeader, data: data,})
               ws_list.push(ws)
               sheetsname.push(data[0][0])
              }
              workflownum = workflownum - 1
              if (workflownum == 0) {
                excel.save_excel('工单统计-' + this.getNow(), ws_list,sheetsname)
                this.downloadLoading = false
              }
            })
          }
        })
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

  /deep/ .el-table__expanded-cell[class*="cell"] {
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 0;
    padding-left: 48px;
  }
</style>
