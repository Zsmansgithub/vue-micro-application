<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">

        <el-form-item prop="agent_ping">
          <el-select v-model="listQuery.agent_ping" placeholder="监控状态" style="width: 100px;" clearable @change="handleFilter">
            <el-option label="监控中" key="1" value="1"></el-option>
            <el-option label="未监控" key="0" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ip">
          <el-input v-model="listQuery.ip" placeholder="IP地址" style="width: 150px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item>
          <el-cascader expand-trigger="hover" :options="projectOptions" v-model="listQuery.project_name_list"
                       change-on-select clearable filterable style="width:400px;" placeholder="请选择产品线或应用名"
                       @change="handleFilter"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="比较值" v-model="listQuery.compare_right" class="input_with_select" clearable>
            <div slot="prepend">
              <el-select v-model="listQuery.compare_left" placeholder="比较字段" style="width: 150px;margin-right: 0;" clearable>
                <el-option label="CPU使用率" value="cpu_utilization"></el-option>
                <el-option label="内存使用率" value="mem_pavailable"></el-option>
                <el-option label="交换分区空闲率" value="swap_pfree"></el-option>
                <el-option label="根目录使用率" value="root_used"></el-option>
                <el-option label="/data目录使用率" value="data_used"></el-option>
                <el-option label="sda磁盘IO使用率" value="io_sda"></el-option>
                <el-option label="sdb磁盘IO使用率" value="io_sdb"></el-option>
                <el-option label="进程数" value="proc_num"></el-option>
                <el-option label="总内存" value="mem_total"></el-option>
                <el-option label="可用内存" value="mem_available"></el-option>
                <el-option label="总交换分区大小" value="swap_total"></el-option>
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
          <el-select v-model="listQuery.is_integration" clearable placeholder="部门" style="width: 120px;">
            <el-option label="集成发布" value="integration"></el-option>
            <el-option label="mysql" value="mysql"></el-option>
            <el-option label="oracle" value="oracle"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.fuzzy_search" placeholder="模糊搜索" style="width: 150px;" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置
          </el-button>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleBatchSearch">批量查询</el-button>

        <el-button class="filter-item" type="primary" @click="diffButtonClick" :disabled="selected_rows.length===0">性能比较</el-button>

        <el_button_wait :interval="2" class="filter-item" :loading="downloadLoading" plain type="primary" icon="el-icon-download"
                        @click="exportIpButtonClick">导出全部
        </el_button_wait>
        <el_button_wait class="filter-item" :loading="downloadLoading" plain type="primary" icon="el-icon-download"
                        @click="exportCurrentPageButtonClick">导出当前页
        </el_button_wait>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%;"
              @cell-click="cellClick" ref="multipleTableAll" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" class="select_class"></el-table-column>
      <el-table-column type="expand" width="1px" fixed="right">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <div v-for="key in ['cpu_json_new','fs_json_new','net_json_new','disk_json_new','other_json_new']">
              <div v-if="['cpu_json_new','other_json_new'].indexOf(key) === -1">
                <w_collapse v-if="props.row[key]" :title="key.substring(0,key.length-9)" :default_expand="true">
                  <div v-for="json_key in Object.keys(props.row[key])">
                    <w_short_notes :title="json_key">
                      <el-form-item label="label" v-for="inner_key in Object.keys(props.row[key][json_key])"
                                    :label-width="inner_key.length >32?'415px':'300px'">
                        <template slot-scope="scope" slot="label">
                          <a @click="clickShowLineChartButton(inner_key, props.row.items_json_new[inner_key],props.row.ip)">
                            <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
                          </a>&nbsp&nbsp&nbsp&nbsp
                          <el-tooltip class="item" :disabled="comments_trans[inner_key].length === 0"
                                      effect="light" :content="comments_trans[inner_key]" placement="top">
                            <div class="inner_key_banner">{{inner_key}}</div>
                          </el-tooltip>
                        </template>
                        <span>{{ props.row[key][json_key][inner_key] }}</span>
                      </el-form-item>
                    </w_short_notes>
                  </div>
                </w_collapse>
              </div>
              <div v-if="['cpu_json_new','other_json_new'].indexOf(key) !== -1">
                <w_collapse v-if="props.row[key]" :title="key.substring(0,key.length-9)" :default_expand="true">
                  <el-form-item label="label" v-for="inner_key in Object.keys(props.row[key])" style="width:32%;margin-left: 20px"
                                :label-width="inner_key.length >32?'415px':'300px'">
                    <template slot-scope="scope" slot="label">
                      <a @click="clickShowLineChartButton(inner_key, props.row.items_json_new[inner_key],props.row.ip)">
                        <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
                      </a>&nbsp&nbsp&nbsp&nbsp
                      <el-tooltip class="item" :disabled="comments_trans[inner_key].length === 0"
                                  effect="light" :content="comments_trans[inner_key]" placement="top">
                        <div class="inner_key_banner">{{inner_key}}</div>
                      </el-tooltip>
                    </template>
                    <span>{{ props.row[key][inner_key] }}</span>
                  </el-form-item>
                </w_collapse>
              </div>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监控状态" width="100px" align="center">
        <template slot-scope="scope">
          <div style="height: 40px;padding-top: 8px ;margin-right: 7px">
            <el-tooltip class="item" effect="dark" placement="top-start" :disabled="scope.row.error_count===0">
              <div slot="content">
                <span v-for="i of scope.row.error_msg" style="display: block">{{i}}</span>
              </div>
              <el-badge :value="scope.row.error_count" :max="99" :hidden="scope.row.error_count===0">
                <el-button v-if="scope.row.agent_ping===1" size="mini" type="success" @click="alarmStatusClick(scope.row)">监控中</el-button>
                <el-button v-else size="mini" type="warning">未监控</el-button>
              </el-badge>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
          <div v-if="scope.row.maintainer" style="color: #8492a6; font-size: 10px">{{scope.row.maintainer ? scope.row.maintainer.toString():''}}</div>
        </template>
      </el-table-column>
      <el-table-column label="应用名" min-width="240px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.subsystem_name+'_'+scope.row.app_name  }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.project_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率" width="120px" align="center" sortable sort-by="cpu_utilization">
        <template slot-scope="scope">
          <span :style="getCellFontColor(scope.row.cpu_utilization,'default')">{{ scope.row.cpu_utilization}}%</span>
          <div v-if="scope.row.cpu_json && scope.row.cpu_json['system.cpu.util[,user]']" style="color: #8492a6; font-size: 10px">
            user: {{scope.row.cpu_json['system.cpu.util[,user]']}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="CPU负载" class-name="status-col" width="110" sortable sort-by="average">
        <template slot-scope="scope">
          <span>{{ scope.row.average }}</span>
          <div v-if="scope.row.cpu_json && scope.row.cpu_json['system.cpu.num']" style="color: #8492a6; font-size: 10px">
            CPU数: {{scope.row.cpu_json['system.cpu.num']}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="内存使用率" class-name="status-col" width="120px" sortable sort-by="mem_pavailable">
        <template slot-scope="scope">
          <span :style="getCellFontColor(scope.row.mem_pavailable,'default')">{{ scope.row.mem_pavailable}}%</span>
          <div v-if="scope.row.other_json && scope.row.other_json['vm.memory.size[total]']" style="color: #8492a6; font-size: 10px">
            总: {{scope.row.other_json['vm.memory.size[total]']}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="SWAP空闲率" class-name="status-col" width="130px" sortable sort-by="swap_pfree">
        <template slot-scope="scope">
          <span :style="getCellFontColor(scope.row.swap_pfree,'reverse')">{{ scope.row.swap_pfree}}%</span>
          <div v-if="scope.row.other_json && scope.row.other_json['system.swap.size[,total]']" style="color: #8492a6; font-size: 10px">
            总: {{scope.row.other_json['system.swap.size[,total]']}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="流量" class-name="status-col" width="100px" :formatter="format10242" sortable sort-by="net_out">
        <template slot-scope="scope">
          <span>出: {{format10243(scope.row.net_out)}}</span>
          <div style="color: #8492a6; font-size: 10px">入: {{format10243(scope.row.net_in)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="根目录使用率" class-name="status-col" width="130px" :formatter="format10242" sortable sort-by="root_used">
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
      <el-table-column label="磁盘IO" class-name="status-col" width="100" sortable sort-by="io_sda">
        <template slot-scope="scope">
          <span v-if="scope.row.io_sda">
            sda:{{ scope.row.io_sda.toFixed(2) }}%
          </span>
          <div v-if="scope.row.io_sdb && scope.row.io_sdb !== -1" style="color: #8492a6; font-size: 10px">
            sdb: {{scope.row.io_sdb.toFixed(2)}}%
          </div>
        </template>
      </el-table-column>
      <el-table-column label="进程数" class-name="status-col" width="100" sortable sort-by="proc_num">
        <template slot-scope="scope">
          <span>{{ scope.row.proc_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启动时长" class-name="status-col" width="145">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.uptime) }}</span>
          <div style="color: #8492a6; font-size: 10px">更新:{{scope.row.update_time_h}}</div>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" width="55" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el_button_wait type="text" @click="handleShowHistory({'ip':row.ip,'id':row.hostid})">
            <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
          </el_button_wait>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :page-sizes="[10, 20,50,100]"
                :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-top: 5px;margin-top: 10px;"/>

    <el-dialog sub_t="大历史曲线" :title="his_dialog_title" custom-class="server_history_dialog" :visible.sync="dialogFormVisible"
               @open="dialogOpen" @close="handleClose" width="70%" top="50px" style="height:100%;">
      <el-form :model="historySearch" :inline="true">
        <el-form-item prop="time_range">
          <el-date-picker type="daterange" style="width: 380px;margin-left:15px;padding-right: 0" v-model="outer_dialog_time_range"
                          start-placeholder="开始时间" end-placeholder="结束时间" @change="renderline"
                          :picker-options="pickerOptions1" :clearable="false">
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
          <el_button_wait type="primary" @click="renderline() " icon="el-icon-search">搜索</el_button_wait>
        </el-form-item>

        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="resetHistorySearch">重置
          </el-button>
        </el-form-item>
        <el-form-item style="float:right">
          显示历史对比曲线
          <el-switch v-model="historySearch.show_compare_line" active-color="#13ce66" inactive-color="grey" @change="switchChanged(switch_value)"
                     :active-value="1" :inactive-value="0" :disabled="!enable_show_compare_line">
          </el-switch>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleTabClick" :model="historySearch"
               style="height:80%;" id="gggg">

        <el-tab-pane ref="parent" v-for="label in detail_line_dic_keys" :label="detail_line_dic_trans[label] || label" :name="label">
          <el-row>
            <el-col :span="12" v-for="(value,key,index) in detail_line_dic[label]">
              <chart :ref="'chart'+(index+1).toString()" :id="getRandomStr(32)" style="width:100%;height:300px;" v-bind:host_id="historySearch"
                     :url="'zabbix/get_history_list/'+key" :title="value" v-if="label === activeName"/>
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

    <el-dialog sub_t="小历史曲线" :title="inner_his_dialog_title" :visible.sync="show_line_chart" width="1000px">
      <div style="margin-left: 10px">

        <el-date-picker type="daterange" style="width: 380px;margin-left:15px;padding-right: 0" v-model="inner_dialog_time_range"
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
        <el-form-item label="IP地址" prop='enable_monitor_ip'>
          <el-input :value="enable_monitor_ip" placeholder="IP地址" style="width:100%" class="filter-item" :disabled="true" clearable/>
        </el-form-item>
        <el-form-item label="proxy地址" prop='zabbix_proxy'>
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
  import {fetchServerList, fetchServerListAllIp, fetchServerListAll, getZabbixHistoryData, hostsViewsEnableZabbixMonitor} from '@/api/zabbix'
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import waves from '@/directive/waves' // waves directive
  import {format1024} from '@/utils/format-function'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Chart from '@/components/Charts/LineHistory'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'
  import line_chart from "./components/zabbix_list/lineChart"
  import w_collapse from "@/components/WangHuiSelfDefined/w_collapse";
  import w_short_notes from "@/components/WangHuiSelfDefined/w_short_notes";
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";
  import {getGroupsProxiesTemplates} from '@/api/zabbix/zabbix_curd'
  import {getRandomStr} from '@/utils/wanghui_tools'
  import echarts from 'echarts'

  function getPureDate() {
    let end = new Date();
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    end.setTime(end.getTime() + 86400 * 1000);
    return end
  }

  export default {
    name: 'ZabbixList',
    mixins: [resize, sessionListQuery],
    components: {Pagination, Chart, line_chart, w_collapse, w_short_notes, el_button_wait},
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
        for (let item of value.split(/[,;\/\-|\s]+/).wh_drop_null()) {
          if (validIp(item.wh_strip())) {
            // callback()
          } else {
            return callback(new Error('输入的IP或格式不合法!请输入IP列表,以英文逗号,空格,换行符,制表符,|等分隔符分隔：10.1.1.1,10.2.3.2'))
          }
        }
        callback()
      };

      return {
        switch_value: 0,
        enable_show_compare_line: true,
        clicked_row: null,
        detail_line_dic_keys: ['基础信息', 'cpu', 'fs', 'net', 'disk', 'other'],
        detail_line_dic_trans: {'cpu': 'CPU', 'fs': '文件系统', 'net': '网络', 'disk': '磁盘', 'other': '其他'},
        detail_line_dic: {
          '基础信息': {
            'system.cpu.util': 'cpu使用率',
            'system.cpu.load[all,avg1]': 'CPU负载',
            'vm.memory.size[pavailable]': '内存使用率',
            'net': '网络流量',
          },
          'cpu': {
            'system.cpu.util[,user]': 'cpu使用率[,user]',
            'system.cpu.util[,system]': 'cpu使用率[,system]',
            'system.cpu.util[,iowait]': 'cpu使用率[,iowait]',
            'system.cpu.util[,interrupt]': 'cpu使用率[,interrupt]',
          },
          'other': {
            'vm.memory.size[pavailable]': '内存使用率',
            'system.swap.size[,pfree]': '交换分区空闲率',
          },
        },
        enable_monitor_ip: '',
        all_proxies: [],
        zabbix_proxy: '',
        show_enable_monitor_dialog: false,
        comments_trans: {},
        key_name: null,
        key_id: null,
        inner_dialog_time_range: null,
        outer_dialog_time_range: null,
        downloadLoading: false,
        his_dialog_title: '曲线图',
        inner_his_dialog_title: '曲线图',
        show_diff_dialog: false,
        selected_rows: [],
        dialog_diff_data: [],
        dialog_diff_cols: [],
        listQuery: {
          page: 1, limit: 20, project: undefined, project_name_list: undefined, ip: undefined,
          network: undefined, ip_list: '', compare_symbol: '', agent_ping: '1',
        },
        show_line_chart: false,
        all_keys: [],
        line_data: [],
        level_dict: [[1, '是'], [0, '否'],],
        historySearch: {id: undefined, monitor_time: undefined, days: '', compare_time: undefined, show_compare_line: 0},
        activeName: '基础信息',
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
        // rules: {
        //   ip: [{message: '请输入正确的IP地址', trigger: 'blur', validator: validateIpaddress}],
        // },
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
      this.getAppList();
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
      switchChanged(a, b) {
        console.log(this.historySearch.show_compare_line)
        // console.log(this.switch_value)
        this.renderline()
      },
      handleTabClick(tab, event) {
        // console.log(tab.label)
        this.enable_show_compare_line = true
        let detail_line_dic_trans = {}
        for (let k of Object.keys(this.detail_line_dic_trans)) {
          detail_line_dic_trans[this.detail_line_dic_trans[k]] = k; //将原来的value赋值给一个变量
        }
        let label = detail_line_dic_trans[tab.label] || tab.label
        console.log(label)

        if (label === 'fs') {
          let keys = Object.keys(this.clicked_row[label + '_json_new'])
          this.detail_line_dic[label] = {}
          for (let key of keys) {
            this.detail_line_dic[label]['vfs.fs.size[' + key + ',pused]'] = '已使用磁盘占比[' + key + ',pused]'
          }
        } else if (label === 'net') {
          this.historySearch.show_compare_line = 0
          this.enable_show_compare_line = false
          let keys = Object.keys(this.clicked_row[label + '_json_new'])
          this.detail_line_dic[label] = {}
          for (let key of keys) {
            this.detail_line_dic[label]['net.if.in[' + key + ']'] = '流量[' + key + ']'
            // this.detail_line_dic[label]['net.if.in[' + key + ',errors]'] = '错误流量[' + key + ']'
          }
        } else if (label === 'disk') {
          let keys = Object.keys(this.clicked_row[label + '_json_new'])
          this.detail_line_dic[label] = {}
          for (let key of keys) {
            this.detail_line_dic[label]['vfs.dev.util[' + key + ']'] = '磁盘IO使用率[' + key + ']'
          }
        }
        this.renderline()
      },
      getRandomStr(len) {
        return getRandomStr(len)
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
                const end = getPureDate();
                const start = new Date();
                start.setTime(end.getTime() - 86400 * 1000);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三天',
              onClick(picker) {
                const end = getPureDate();
                const start = new Date();
                start.setTime(end.getTime() - 86400 * 3 * 1000);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = getPureDate();
                const start = new Date();
                start.setTime(end.getTime() - 86400 * 7 * 1000);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近两周',
              onClick(picker) {
                const end = getPureDate();
                const start = new Date();
                start.setTime(end.getTime() - 86400 * 14 * 1000);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = getPureDate();
                const start = new Date();
                start.setTime(end.getTime() - 86400 * 30 * 1000);
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
      exportIpButtonClick() {
        window.location.href = process.env.VUE_APP_BASE_API + "/zabbix/get_server_list_all_ip";
      },
      exportButtonClick() {
        this.downloadLoading = true;
        fetchServerListAll(this.listQuery).then(res => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['IP地址', 'CPU使用率', '内存使用率', 'swap空闲率', 'io进', 'io出'];
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
      exportCurrentPageButtonClick() {
        this.downloadLoading = true;
        let item_keys = [];
        for (let row of this.list) {
          item_keys = [...item_keys, ...Object.keys(row.cpu_json_new), ...Object.keys(row.other_json_new)]
        }
        item_keys = new Set(item_keys);

        let dialog_diff_data = [];
        for (let row of this.list) {
          let cpu_other = Object.assign({}, row.cpu_json_new, row.other_json_new);
          let tmp = {'ip': row.ip, '应用名': row.project_name};
          for (let key of item_keys) {
            tmp[key] = cpu_other[key]
          }
          dialog_diff_data.push(tmp)
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ip', '应用名', ...item_keys];
          const filterVal = ['ip', '应用名', ...item_keys];
          const data = this.formatJson(filterVal, dialog_diff_data);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '服务器监控-' + this.getNow(),
          });
          this.downloadLoading = false
        })
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      diffButtonClick() {
        let item_keys = [];
        for (let row of this.selected_rows) {
          item_keys = [...item_keys, ...Object.keys(row.cpu_json_new), ...Object.keys(row.other_json_new)]
        }
        item_keys = new Set(item_keys);
        let dialog_diff_data = [];
        for (let key of item_keys) {
          let tmp = {'指标': key};
          for (let row of this.selected_rows) {
            let cpu_other = Object.assign({}, row.cpu_json_new, row.other_json_new);
            tmp[row.ip] = cpu_other[key]
          }
          dialog_diff_data.push(tmp)
        }
        this.dialog_diff_data = dialog_diff_data;
        // console.log('dialog_diff_data', dialog_diff_data);
        this.dialog_diff_cols = Object.keys(dialog_diff_data[0]);
        this.show_diff_dialog = true
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
          if (type === 'default') {
            if (value > 80) {
              style = {color: 'red', fontWeight: 'bolder'}
            } else if (value > 50) {
              style = {color: 'darkorange', fontWeight: 'bolder'}
            }
          }
          if (type === 'reverse') {
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
        this.clicked_row = row
      },
      clickShowLineChartButton(key_name, key_id, ip) {
        let now = getPureDate().getTime();
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
        this.historySearch.show_compare_line = 0;
        delete this.historySearch.monitor_time;
        delete this.historySearch.compare_time;
        this.outer_dialog_time_range = [new Date(getPureDate().getTime() - 86400000), getPureDate()];
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
          ip_list: '',
          hostname_list: undefined,
          is_integration: undefined,
          agent_ping: '1',
        }
      },
      renderline(days) {
        // console.log('this.historySearch', this.historySearch);
        let value = this.outer_dialog_time_range;
        if (value) {
          this.historySearch.time_range = [value[0].getTime(), value[1].getTime()];
          this.historySearch.time_range = this.historySearch.time_range.toString();
        } else {
          this.historySearch.time_range = [getPureDate().getTime() - 86400000, getPureDate().getTime()]
        }
        let charts_group = [];
        this.$nextTick(() => {
          for (let key of Object.keys(this.$refs)) {
            if (key.startsWith('chart')) {
              if (Array.isArray(this.$refs[key]) && this.$refs[key].length > 0) {
                this.$refs[key][0].render(this.historySearch);
                charts_group.push(this.$refs[key][0].chart)
              }
            }
          }
          echarts.connect(charts_group);
        })
      },
      handleClose() {
        this.activeName = null;
        this.resetTemp();
      },
      getList() {
        this.listLoading = true;
        fetchServerList(this.listQuery).then(response => {
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
        this.outer_dialog_time_range = [new Date(getPureDate().getTime() - 86400000), getPureDate()];
        this.dialogFormVisible = true;
        this.enable_show_compare_line = true
        this.renderline()
      },
      dialogOpen() {
        this.activeName = '基础信息'
      },

      handleBatchSearch() {
        // 打开批量搜索框
        this.clearBatchTextSearch();
        this.dialogSearchVisible = true
        console.log(this.listQuery)
      },
      clearBatchTextSearch() {
        // 清空批量搜索textarea内容
        this.listQuery.ip_list = ''
        // this.listQuery.hostname_list = undefined
      },
      onSubmitDialogButton(formName) {
        console.log(this.listQuery)
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
        this.listQuery.ip_list = '';
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
