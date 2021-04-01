<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <el-form-item prop="agent_ping">
          <el-select v-model="listQuery.agent_ping" placeholder="监控状态" style="width: 120px;" clearable @change="handleFilter">
            <el-option label="监控中" key="1" value="1"></el-option>
            <el-option label="未监控" key="0" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ip">
          <el-input v-model="listQuery.ip" placeholder="IP地址" style="width: 150px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item prop="roles">
          <el-select v-model="listQuery.roles" placeholder="角色" style="width:130px" clearable @change="handleFilter">
            <el-option v-for="item in ['master','slave','vip',]" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="比较值" v-model="listQuery.compare_right" class="input_with_select" clearable>
            <div slot="prepend">
              <el-select v-model="listQuery.compare_left" placeholder="比较字段" style="width: 150px;margin-right: 0;" clearable>
                <el-option label="连接数" value="connections"></el-option>
                <el-option label="slave延迟" value="slave_lag"></el-option>
                <el-option label="查询延迟" value="questions"></el-option>
                <el-option label="CPU使用率" value="zc__cpu_utilization"></el-option>
                <el-option label="内存使用率" value="zc__mem_pavailable"></el-option>
                <el-option label="交换分区空闲率" value="zc__swap_pfree"></el-option>
                <el-option label="根目录使用率" value="zc__root_used"></el-option>
                <el-option label="/data目录使用率" value="zc__data_used"></el-option>
                <el-option label="sda磁盘IO使用率" value="zc__io_sda"></el-option>
                <el-option label="sdb磁盘IO使用率" value="zc__io_sdb"></el-option>
                <el-option label="进程数" value="zc__proc_num"></el-option>
                <el-option label="总内存" value="zc__mem_total"></el-option>
                <el-option label="可用内存" value="zc__mem_available"></el-option>
                <el-option label="总交换分区大小" value="zc__swap_total"></el-option>
              </el-select>
              <el-select v-model="listQuery.compare_symbol" clearable placeholder="运算符"
                         style="width: 100px;margin-left: 0;border-left: 1px solid #DCDFE6">
                <el-option label=">" value="__gt"></el-option>
                <el-option label="<" value="__lt"></el-option>
                <el-option label=">=" value="__gte"></el-option>
                <el-option label="<=" value="__lte"></el-option>
                <el-option label="=" value="="></el-option>
              </el-select>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.fuzzy_search" placeholder="模糊搜索" style="width: 150px;" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleBatchSearch">批量查询</el-button>
          <el-button class="filter-item" type="success" plain icon="el-icon-download" @click="exportAll">全部导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%;"
              @cell-click="cellClick" ref="multipleTableAll" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="40" align="center" class="select_class"></el-table-column>-->
      <el-table-column label="监控状态" width="100px" align="center">
        <template slot-scope="scope">
          <div style="height: 40px;padding-top: 8px ;margin-right: 7px">
            <el-tooltip class="item" effect="dark" placement="top-start" :disabled="scope.row.error_count===0"
                        :content="scope.row.error_msg.toString()">
              <el-badge :value="scope.row.error_count" :max="99" :hidden="scope.row.error_count===0">
                <el-button v-if="scope.row.agent_ping==1" size="mini" type="success" @click="alarmStatusClick(scope.row)">监控中</el-button>
                <el-button v-else size="mini" type="warning" @click="clickEnableMonitorButton(scope.row)">未监控</el-button>
              </el-badge>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1px" fixed="right">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <div v-for="key of Object.keys(props.row)">
              <div v-if="key.endsWith('json_new')">
                <div v-for="json_key of ['innodb','com','state',  'handler','pending',  'ibuf', 'table','cache',  'qcache', 'other',]">
                  <w_collapse v-if="props.row[key][json_key]" :title="json_key" :default_expand="true">
                    <el-form-item label="label" v-for="inner_key in Object.keys(props.row[key][json_key])" style="width:32%;margin-left: 20px"
                                  :label-width="inner_key.length >32?'415px':'300px'">
                      <template slot-scope="scope" slot="label">
                        <a
                          @click="clickShowLineChartButton(inner_key+'['+props.row.port+']', props.row.items_json_new[inner_key+'['+props.row.port+']'], props.row.ip)">
                          <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
                        </a>&nbsp&nbsp&nbsp&nbsp
                        <el-tooltip class="item" :disabled="true"
                                    effect="light" :content="comments_trans[inner_key]" placement="top">
                          <div class="inner_key_banner">{{inner_key}}</div>
                        </el-tooltip>
                      </template>
                      <span>{{ props.row[key][json_key][inner_key] }}</span>
                    </el-form-item>
                  </w_collapse>
                </div>
              </div>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip + ':' + scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roles==='master'" type="danger">master</el-tag>
          <el-tag v-if="scope.row.roles==='slave'" type="success">slave</el-tag>
          <el-tag v-if="scope.row.roles==='vip'" type="info">vip</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="应用名" min-width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.subsystem_name+'_'+scope.row.app_name  }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.project_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="存活" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.alive==1" type="success">是</el-tag>
          <el-tag v-else-if="scope.row.alive==-1 || scope.row.alive==''" type="info">未知</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="连接数" width="110px" align="center">
        <template slot-scope="scope">
          <span :style="getCellFontColor(scope.row.connections ,'default')">{{ scope.row.connections }}</span>
          <div style="color: #8492a6; font-size: 10px">
            最大: {{scope.row.max_connections }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="slave存活" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.slave_running==0" type="danger">否</el-tag>
          <el-tag v-else-if="scope.row.slave_running==1" type="success">是</el-tag>
          <el-tag v-else type="info">未知</el-tag>
          <div style="color: #8492a6; font-size: 10px">
            复制延迟: {{scope.row.slave_lag}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="查询数(秒)" width="110px" align="center">
        <template slot-scope="scope">
          <span :style="getCellFontColor(scope.row.questions ,'default')">
            {{ scope.row.questions == -1?'':scope.row.questions}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率" width="110px" align="center">
        <template slot-scope="scope">
          <span :style="getCellFontColor(scope.row.cpu_utilization,'default')">{{ scope.row.cpu_utilization}}%</span>
          <div v-if="scope.row.cpu_json && scope.row.cpu_json['system.cpu.util[,user]']" style="color: #8492a6; font-size: 10px">
            user: {{scope.row.cpu_json['system.cpu.util[,user]']}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="CPU负载" class-name="status-col" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.average }}</span>
          <div v-if="scope.row.cpu_json && scope.row.cpu_json['system.cpu.num']" style="color: #8492a6; font-size: 10px">
            CPU数: {{scope.row.cpu_json['system.cpu.num']}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="内存使用率" class-name="status-col" width="110px" prop="memory_p">
        <template slot-scope="scope">
          <span :style="getCellFontColor(scope.row.mem_pavailable,'default')">{{ scope.row.mem_pavailable}}%</span>
          <div v-if="scope.row.other_json && scope.row.other_json['vm.memory.size[total]']" style="color: #8492a6; font-size: 10px">
            总: {{scope.row.other_json['vm.memory.size[total]']}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="流量" class-name="status-col" width="100px" :formatter="format10242">
        <template slot-scope="scope">
          <span>出: {{format10243(scope.row.net_out)}}</span>
          <div style="color: #8492a6; font-size: 10px">入: {{format10243(scope.row.net_in)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="根目录使用率" class-name="status-col" width="110px" :formatter="format10242">
        <template slot-scope="scope">
          <span
            :style="getCellFontColor(scope.row.fs_json['vfs.fs.size[/,pused]'],'default')">
            {{scope.row.fs_json['vfs.fs.size[/,pused]']}}
          </span>
          <div v-if="scope.row.fs_json && scope.row.fs_json['vfs.fs.size[/,total]']" style="color: #8492a6; font-size: 10px">
            总: {{scope.row.fs_json['vfs.fs.size[/,total]']}}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="运行时长" class-name="status-col" min-width="130">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.uptime) }}</span>
          <div style="color: #8492a6; font-size: 10px">更新: {{scope.row.update_time_h}}</div>
        </template>
      </el-table-column>
      <!--      <el-table-column label="详情" align="center" min-width="55" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <el-button type="text" @click="handleShowHistory({'ip':row.ip,'id':row.hostid})">-->
      <!--            <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :page-sizes="[10, 20,50,100]"
                :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-top: 5px;margin-top: 10px;"/>

    <el-dialog :title="his_dialog_title" custom-class="server_history_dialog" :visible.sync="dialogFormVisible" @open="dialogOpen"
               @close="handleClose" width="70%" top="50px" style="height:100%;">
      <el-form :model="historySearch" :inline="true">
        <el-form-item prop="monitor_time">
          <el-date-picker
            v-model="historySearch.monitor_time"
            type="date"
            placeholder="监控时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="compare_time">
          <el-date-picker
            v-model="historySearch.compare_time"
            type="date"
            placeholder="监控对比时间"
            align="right"
            value-format="timestamp"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="renderline()"
                     :disabled="!(loading_finished_1 && loading_finished_2 && loading_finished_3 && loading_finished_4)">搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="renderline(3)"
                     :disabled="!(loading_finished_1 && loading_finished_2 && loading_finished_3 && loading_finished_4)">三天
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="renderline(5)"
                     :disabled="!(loading_finished_1 && loading_finished_2 && loading_finished_3 && loading_finished_4)">五天
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="renderline(7)"
                     :disabled="!(loading_finished_1 && loading_finished_2 && loading_finished_3 && loading_finished_4)">七天
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="resetHistorySearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick" :model="historySearch"
               style="height:80%;" id="gggg">
        <el-tab-pane ref="parent" label="基础信息" name="first">
          <el-row>
            <el-col :span="12">
              <chart ref="chart1" id="id1" style="width:100%;height:300px;" v-bind:host_id="historySearch"
                     @loading_finished="loading_finished_1 = true"
                     url="zabbix/get_history_list/system.cpu.util" title="CPU使用率" v-if="'first' === activeName"/>
            </el-col>
            <el-col :span="12">
              <chart ref="chart2" id="id3" style="width:100%;height:300px;" v-bind:host_id="historySearch"
                     @loading_finished="loading_finished_2 = true"
                     url="zabbix/get_history_list/system.cpu.load[all,avg1]" title="CPU负载" v-if="'first' === activeName"/>
            </el-col>
            <el-col :span="24"></el-col>
            <el-col :span="12">
              <chart ref="chart3" id="id2" style="width:100%;height:300px;" v-bind:host_id="historySearch"
                     @loading_finished="loading_finished_3 = true"
                     url="zabbix/get_history_list/vm.memory.size[pavailable]" title="内存使用率" v-if="'first' === activeName"/>
            </el-col>
            <el-col :span="12">
              <chart-l ref="chart4" id="id4" style="width:100%;height:300px;" v-bind:host_id="historySearch"
                       @loading_finished="loading_finished_4 = true"
                       url="zabbix/get_history_list/net" title="网络流量" v-if="'first' === activeName"/>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" :close-on-click-modal="false" width="45%">
      <el-form ref="dialogSearch" :rules="rules2" :model="listQuery">
        <el-form-item label="IP列表" prop='ip_list'>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入IP列表,以英文逗号,空格,换行符,制表符,|等分隔符分隔：10.1.1.1,10.2.3.2"
            v-model="listQuery.ip_list">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogSearchResetForm('dialogSearch')">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton('dialogSearch')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="inner_his_dialog_title" :visible.sync="show_line_chart" width="1000px">
      <div style="margin-left: 10px">

        <el-date-picker type="datetimerange" style="width: 380px;margin-left:15px;padding-right: 0" v-model="inner_dialog_time_range"
                        start-placeholder="开始时间" end-placeholder="结束时间" @change="datePickerChanged"
                        :picker-options="pickerOptions1" :clearable="false">
        </el-date-picker>
        <el-button style="margin-left: 10px" plain type="primary" icon="el-icon-search" @click="datePickerChanged">搜索</el-button>
      </div>
      <line_chart :line_data="line_data"></line_chart>
    </el-dialog>

    <el-dialog title="性能比较" :visible.sync="show_diff_dialog" width="1000px" :center="true" top="0">
      <el-table v-loading="listLoading" :data="dialog_diff_data" border stripe highlight-current-row ref="dialogDiffTable">
        <el-table-column v-for="col in dialog_diff_cols" :label="col" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[col] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" :width="950-dialog_diff_cols.length * 180" align="center">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="输入信息启用监控" :visible.sync="show_enable_monitor_dialog" width="600px" :center="true" top="100px">
      <el-form>
        <el-form-item label="IP地址" prop='ip_list'>
          <el-input :value="enable_monitor_ip" placeholder="IP地址" style="width:100%" class="filter-item" :disabled="true" clearable/>
        </el-form-item>
        <el-form-item label="proxy地址" prop='ip_list'>
          <el-select clearable v-model="zabbix_proxy" filterable class="filter-item" style="width:100%"
                     placeholder="选择zabbix_proxy地址">
            <el-option v-for="item in all_proxies" :key="item.host" :label="item.host" :value="item.proxyid">
              <span style="float: left">{{ item.host }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" plain plain type="primary" @click="show_enable_monitor_dialog=false">取消</el-button>
      <el-button class="filter-item" type="primary" @click="enableMonitorConfirm">启用监控</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchList, fetchAppList} from '@/api/cmdb'
  import {
    zabbixListMysqlGetList,
    fetchServerListAll,
    getZabbixHistoryData,
    hostsViewsEnableZabbixMonitor
  } from '@/api/zabbix'
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import waves from '@/directive/waves' // waves directive
  import {format1024} from '@/utils/format-function'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import tabPane from '../tab/components/TabPane'
  import Chart from '@/components/Charts/LineHistory'
  import ChartL from '@/components/Charts/LineKmg'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'
  import line_chart from "./components/zabbix_list/lineChart"
  import w_collapse from "@/components/WangHuiSelfDefined/w_collapse";
  import w_short_notes from "@/components/WangHuiSelfDefined/w_short_notes";
  import {getGroupsProxiesTemplates} from '@/api/zabbix/zabbix_curd'

  export default {
    name: 'ZabbixList',
    mixins: [resize, sessionListQuery],
    components: {Pagination, Chart, ChartL, line_chart, w_collapse, w_short_notes},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        };
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      const validateIpaddress = (rule, value, callback) => {
        if (value) {
          if (validIp(value)) {
            callback()
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      };
      const validIPList = (rule, value, callback) => {
        for (let item of value.split(/[,;\/\-|\s]+/)) {
          if (validIp(item)) {
            // callback()
          } else {
            return callback(new Error('输入的IP或格式不合法!请输入IP列表,以英文逗号,空格,换行符,制表符,|等分隔符分隔：10.1.1.1,10.2.3.2'))
          }
        }
        callback()
      };
      return {
        enable_monitor_ip: '',
        all_proxies: [],
        zabbix_proxy: '',
        show_enable_monitor_dialog: false,
        comments_trans: {},
        key_name: null,
        key_id: null,
        inner_dialog_time_range: null,
        downloadLoading: false,
        his_dialog_title: '曲线图',
        inner_his_dialog_title: '曲线图',
        loading_finished_1: false,
        loading_finished_2: false,
        loading_finished_3: false,
        loading_finished_4: false,
        show_diff_dialog: false,
        selected_rows: [],
        dialog_diff_data: [],
        dialog_diff_cols: [],
        listQuery: {
          page: 1, limit: 20, project: undefined, project_name_list: undefined, ip: undefined,
          network: undefined, ip_list: undefined, compare_symbol: '', agent_ping: '1',
        },
        show_line_chart: false,
        all_keys: [],
        line_data: [],
        level_dict: [[1, '是'], [0, '否'],],
        historySearch: {id: undefined, monitor_time: undefined, days: '', compare_time: undefined},
        activeName: 'first',
        list: null,
        total: 0,
        listLoading: true,
        loading: false,
        appnameOptions: [],
        appnameOptionsP: [],
        projectOptions: [],
        networkOptions: [{label: 'A网', key: 'a'}, {label: 'B网', key: 'b'}, {label: 'G网', key: 'g'}],
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          ip: [{message: '请输入正确的IP地址', trigger: 'blur', validator: validateIpaddress}],
        },
        rules2: {
          ip_list: [
            {required: true, message: '输入的IP或格式不正确!请输入IP列表,以英文逗号,空格,换行符,制表符,|等分隔符分隔：10.1.1.1,10.2.3.2', trigger: 'blur'},
            {validator: validIPList, trigger: 'blur'}
          ],
        },
        dialogSearchVisible: false,
        pickerOptions1: {},
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    created() {
      this.getList();
      // this.getAppList();
      this.pickerOptions1 = this.initPickerOptions();
      getProductAppCascader().then(response => {
        this.projectOptions = response
      });
      if (this.$route.query.ip) {
        this.listQuery.ip = this.$route.query.ip
      }
      if (this.$route.params.product_line) {
        this.listQuery.project_name_list = this.$route.params.product_line
      }
      getGroupsProxiesTemplates().then(res => {
        this.all_proxies = res['proxies'];
        this.all_proxies.push({host: "空", proxyid: "0"})
      });
    },
    watch: {
      // 利用watch方法检测路由变化：
      '$route': function (to, from) {
        if (this.$route.params.product_line) {
          this.listQuery.project_name_list = this.$route.params.product_line;
          this.getList();
        }
        if (this.$route.params.ip) {
          this.listQuery.ip = this.$route.params.ip;
          this.getList();
        }
      }
    },
    methods: {
      exportAll(){
        window.location.href = process.env.VUE_APP_BASE_API + "/zabbix/zabbix_list_mysql_export_all_mysql";
      },
      enableMonitorConfirm() {
        console.log(this.enable_monitor_ip, this.zabbix_proxy)
        hostsViewsEnableZabbixMonitor({enable_monitor_ip: this.enable_monitor_ip, zabbix_proxy: this.zabbix_proxy}).then(res => {
          if (res.error) {
            this.$message({message: res.error, type: 'error'})
          } else {
            this.$message({message: '成功', type: 'success'})
          }
          this.show_enable_monitor_dialog = false;
        })
      },
      clickEnableMonitorButton(row) {
        this.zabbix_proxy = '';
        this.enable_monitor_ip = row.ip;
        this.show_enable_monitor_dialog = true
      },
      datePickerChanged(value) {
        if (Array.isArray(value)) {
          this.inner_dialog_time_range = [value[0].getTime(), value[1].getTime()];
        }
        let params = {key_name: this.key_name, key_id: this.key_id, time_range: this.inner_dialog_time_range.toString()};
        getZabbixHistoryData(params).then(response => {
          this.line_data = response;
          console.log('this.line_data')
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
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近两周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }],
        }
      },
      keyToValue(key, dict) {
        let new_dict = {};
        for (let i of dict) {
          new_dict[i['value']] = i['label']
        }
        return new_dict[key]
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'expire_time') {
            return this.$options.filters['parseTime'](v[j])
          } else if (j === 'is_not') {
            return this.keyToValue(v[j], this.status)
          } else if (j === 'roles') {
            return this.keyToValue(v[j], this.rolesList)
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

      exportButtonClick() {
        this.downloadLoading = true;
        fetchServerListAll(this.listQuery).then(res => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['IP地址', 'CPU使用率', '内存空闲率', 'swap空闲率', 'io进', 'io出'];
            const filterVal = ['ip', 'cpu_utilization', 'swap_pfree', 'mem_pavailable', 'net_in', 'net_out',];
            const data = this.formatJson(filterVal, res);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '服务器监控-' + this.getNow(),
            });
            this.downloadLoading = false
          })
        })
      },

      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },

      alarmStatusClick(row) {
        if (row.error_count) {
          this.$router.push({name: "AlarmTables", params: {ip: row.ip}})
        }
      },
      getCellFontColor(value, type) {
        if (value || value === 0) {
          if (value.toString().endsWith(' %')) {
            value = value.substring(0, value.length - 2)
          }

          let style = {};
          if (type === 'cpu') {
            if (value > 80) {
              style = {color: 'red', fontWeight: 'bolder'}
            } else if (value > 50) {
              style = {color: 'darkorange', fontWeight: 'bolder'}
            }
          }
          if (type === 'mem') {
            if (value < 20) {
              style = {color: 'red', fontWeight: 'bolder'}
            } else if (value < 50) {
              style = {color: 'darkorange', fontWeight: 'bolder'}
            }
          }
          return style

        }
      },
      formatDate(time_long) {
        let res;
        if (time_long < 60) {
          res = parseInt(time_long) + '秒'
        } else if (60 <= time_long && time_long < 3600) {
          res = parseInt(time_long / 60) + '分' + parseInt(time_long % 60) + '秒'
        } else if (3600 <= time_long && time_long < 86400) {
          res = parseInt(time_long / 3600) + '时' + parseInt(time_long % 3600 / 60) + '分'
        } else if (time_long >= 86400) {
          let h = parseInt(time_long % 86400);
          res = parseInt(time_long / 86400) + '天' + parseInt(h / 3600) + '时' + parseInt(h % 3600 / 60) + '分'
        }

        return res
      },
      cellClick(row, column, cell, event) {
        this.his_dialog_title = 'IP: ' + row.ip;
        if (column.label !== '详情') {
          this.$refs['multipleTableAll'].toggleRowExpansion(row)
          // this.list = JSON.parse(JSON.stringify(this.list)); //深拷贝
        }
      },
      clickShowLineChartButton(key_name, key_id, ip) {
        let now = new Date().getTime();
        this.inner_dialog_time_range = [now - 86400000 * 3, now];
        this.inner_his_dialog_title = 'IP: ' + ip + ' / ' + '监控项: ' + key_name;
        this.key_name = key_name;
        this.key_id = key_id;
        this.show_line_chart = true;
        getZabbixHistoryData({key_name: key_name, key_id: key_id, time_range: this.inner_dialog_time_range}).then(response => {
          this.line_data = response;
        })
      },
      handleReset() {
        this.resetlistQuery();
        this.getList()
      },
      resetHistorySearch() {
        this.historySearch.days = '';
        this.historySearch.id = undefined;
        this.historySearch.monitor_time = undefined;
        this.historySearch.compare_time = undefined;
        delete this.historySearch.monitor_time;
        delete this.historySearch.compare_time;
        this.renderline()
      },
      format10242(row, column, cellValue) {
        if (column.label === '入流量') {

          return format1024(row.net_in)
        } else if (column.label === '总内存') {
          return format1024(row.mem_total)
        } else if (column.label === '出流量') {

          return format1024(row.net_out)
        } else if (column.label === '内存使用') {
          return format1024(row.mused)
        }

      },
      format10243(value) {
        return format1024(value)
      },
      remoteSearchMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.appnameOptionsP = this.appnameOptions.filter(item => {
              return item.display_name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.appnameOptionsP = []
        }
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          project_name_list: undefined,
          ip: undefined,
          ip_list: undefined,
          hostname_list: undefined,
          is_integration: false,
          agent_ping: '1',
        }
      },
      renderline(days) {
        this.loading_finished_1 = false;
        this.loading_finished_2 = false;
        this.loading_finished_3 = false;
        this.loading_finished_4 = false;
        if (days) {
          this.historySearch.days = days
        } else {
          this.historySearch.days = ''
        }
        // console.log(this.historySearch)
        if (this.activeName === 'first') {
          this.$refs.chart1.render(this.historySearch);
          this.$refs.chart2.render(this.historySearch);
          this.$refs.chart3.render(this.historySearch);
          this.$refs.chart4.render(this.historySearch);
        } else {
          this.$refs.mychild.render(this.historySearch);
        }

      },
      handleClose() {
        this.activeName = null;
        this.resetTemp();

      },
      handleClick(tab, event) {

        console.info('sfsf')
      },
      getList() {
        this.listLoading = true;

        zabbixListMysqlGetList(this.listQuery).then(response => {
          this.list = response.results;
          this.comments_trans = response.comments_trans
          let all_keys = new Set();
          for (let row of this.list) {
            for (let key of Object.keys(row)) {
              if (key.substring(key.length - 5, key.length) === '_json' || key === 'items_json') {
                for (let inner_key in row[key]) {
                  all_keys.add(inner_key)
                }
              } else {
                // all_keys.add(key)
              }
            }
          }
          this.all_keys = [...all_keys];
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getAppList() {
        fetchAppList().then(response => {
          let appnameOptions = [];
          for (let i of response) {
            appnameOptions.push({
              display_name: i.app_cname, key: i.id
            })
          }
          this.appnameOptions = appnameOptions
        })
      },
      handleFilter(listQuery) {
        this.clearBatchTextSearch();
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          monitor_time: '',
          compare_time: '',
          title: '',
          status: 'published',
          type: '',
          day: ''
        }
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleShowHistory(row) {
        this.historySearch = Object.assign({}, row); // copy obj
        this.dialogFormVisible = true
      },
      dialogOpen() {
        this.activeName = 'first'
      },

      handleBatchSearch() {
        // 打开批量搜索框
        this.clearBatchTextSearch();
        this.dialogSearchVisible = true
      },
      clearBatchTextSearch() {
        // 清空批量搜索textarea内容
        this.listQuery.ip_list = undefined
        // this.listQuery.hostname_list = undefined
      },
      onSubmitDialogButton(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.listQuery.ip_list) {
              // this.listQuery.ip_list = this.listQuery.ip_list.split('\n').join()
              // this.listQuery.ip_list = this.listQuery.ip_list.replace(/[\r\n]/g, '').replace(/\s/g, '')
              this.listQuery.ip_list = this.listQuery.ip_list.split(/[,;\/\-|\s]+/).join(',');
              this.getList();
              this.dialogSearchVisible = false;
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      dialogSearchResetForm(formName) {
        this.dialogSearchVisible = false;
        this.listQuery.ip_list = undefined;
        this.$refs[formName].resetFields()
      },

    }
  }
</script>

<style>
  .app-search-class {
    max-width: 500px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }

  .input_with_select .el-input-group__prepend {
    background-color: #fff;
  }

  .input_with_select {
    width: 400px;
  }

  .json_banner {
    height: 26px;
    padding: 0 10px 0 30px;
    color: #606266;
    line-height: 26px;
    border: solid 1px rgb(209, 233, 255);
    background-color: #fafafa;
    border-radius: 4px;
    width: 100%;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 16px;
    margin: 20px 0 10px -20px;
  }

  .el-table-column--selection .cell {
    padding: 0 10px;
  }

  .inner_key_banner {
    color: #666666;
    display: inline-block
  }
</style>
