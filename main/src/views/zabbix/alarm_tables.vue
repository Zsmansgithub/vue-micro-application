<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <el-form-item>
          <el-cascader expand-trigger="hover" :options="projectOptions" v-model="listQuery.project_name_list"
                       clearable filterable style="width:300px;" placeholder="请选择产品线或应用名"
                       @change="handleFilter"></el-cascader>
        </el-form-item>
        <el-form-item prop="alarm_source">
          <el-select v-model="listQuery.alarm_source" placeholder="报警来源" clearable style="width: 140px"
                     class="filter-item" @change="handleFilter">
            <el-option v-for="item in alarmsourceOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="priority">
          <el-select v-model="listQuery.priority" placeholder="级别" clearable style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in priority_dict" :key="item[0]" :label="item[1]" :value="item[0]">
              <span :style="getPriorityStyle(item[0])">{{ item[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.is_ack" placeholder="是否确认" clearable style="width:140px"
                     class="filter-item" @change="handleFilter">
            <el-option v-for="item in isAckOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="host_name">
          <el-input v-model.trim="listQuery.host_name" clearable
                    placeholder="IP地址" style="width: 200px;" class="filter-item" @input="handleFilter"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable style="width:130px" class="filter-item"></el-input>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">
          重置
        </el-button>
        <el-button class="filter-item" type="primary" @click="batchAckClick" :disabled="selected_rows.length===0">批量确认</el-button>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%;"
              :cell-style="descLine" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" class="select_class"></el-table-column>
      <el-table-column label="数据源" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.alarm_source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" min-width="150px">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" width="200" class="popver_user">
            <p>联系人: {{ scope.row.maintain_user }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium"><span>{{ scope.row.host_name }}</span></el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="应用名" min-width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.app_name!==''">{{ scope.row.subsystem_name+'_'+scope.row.app_name  }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.project_name}}</div>
        </template>
      </el-table-column>

      <el-table-column label="报警信息" min-width="520px" align="center">
        <template slot-scope="scope">
          <span type="success">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" min-width="70px" align="center">
        <template slot-scope="scope">
          <span type="success">{{ list_dic_get(priority_dict, scope.row.priority) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否确认" class-name="status-col" width="77">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" width="200">
            <p>信息: {{ scope.row.comments }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.is_ack==1" size="medium">是</el-tag>
              <el-tag v-else size="medium" type='danger'>否</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否报警" class-name="status-col" width="77" :formatter="isornot">
        <template slot-scope="scope">

          <el-tag v-if="scope.row.is_mail==0" size="medium">否</el-tag>
          <el-tag v-else-if="scope.row.is_mail==1" size="medium">是</el-tag>
          <el-tag v-else size="medium" type='danger'>异常</el-tag>

        </template>
      </el-table-column>
      <el-table-column label="持续时间" prop="ctime" class-name="status-col" width="110" sortable :formatter="formatDate">
      </el-table-column>
      <el-table-column label="操作" align="center" width="85" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleShowHistory(row)">
            确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog title="确认框" :visible.sync="dialogFormVisible" @open="dialogOpen" @close="handleClose" width="30%"
               top="60px" style=" height: 400px;">
      <el-form ref="dataForm" :model="ackForm">
        <el-form-item label="确认描述信息">
          <el-input type="textarea" v-model="ackForm.comments"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCommon()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量确认" :visible.sync="show_batch_ack_dialog" width="30%" top="60px" style=" height: 400px;">
      <el-form>
        <el-form-item label="确认描述信息">
          <el-input type="textarea" v-model="batch_ack_comments"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_batch_ack_dialog = false">取 消</el-button>
        <el-button type="primary" @click="batchAckConfirm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchList, update, uacBatchAck} from '@/api/zabbix'
  import {getAppList} from '@/api/cmdb'
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import tabPane from '../tab/components/TabPane'
  import Chart from '@/components/Charts/LineZabbix'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'
  import {isORnot} from "../../utils/format-function";
  import {get_array_dict_value} from '@/utils/time_trans'

  export default {
    name: 'AlarmTables',
    mixins: [resize, sessionListQuery],
    components: {Pagination, Chart},
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
      return {
        batch_ack_comments: '确认',
        show_batch_ack_dialog: false,
        selected_rows: [],
        priority_color_dict: [[5, '#E45959'], [4, '#E97659'], [3, '#FFA059'], [2, '#FFC859'], [1, '#7499FF'], [0, '#97AAB3']],
        priority_dict: [[1, '通知'], [2, '警告'], [3, '一般严重'], [4, '严重'], [5, '灾难'], [0, '未定义']],
        isAckOptions: [{label: '是', key: 1}, {label: '否', key: 0}],
        listQuery: {
          page: 1,
          limit: 20,
          alarm_source: undefined,
          project_name_list: undefined,
          host_name: undefined,
          priority: undefined,
          is_ack: undefined,
          search: undefined
        },
        ackForm: {comments: '确认'},
        historySearch: {id: undefined, timestamp: '',},
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
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
          }]
        },
        activeName: 'first',
        projectOptions: [],
        list: null,
        total: 0,
        listLoading: true,
        loading: false,
        appnameOptionsP: [],
        alarmsourceOptions: [{label: '主机组', key: 1}, {label: '集成组', key: 2}, {label: 'DB组', key: 3}, {label: '网络组', key: 5}],
        appnameOptions: [
          {display_name: "退回件查询、上传、单据上传exp_2/揽派签操作expUploadInfoWeb", key: 1}],
        priorityOptions: [{label: 'information', key: 1}, {label: 'warning', key: 2}, {label: 'average', key: 3},
          {label: 'high', key: 4}, {label: 'disaster', key: 5}, {label: 'not_classified', key: 0},
        ],
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          ip: [{message: '请输入正确的IP地址', trigger: 'blur', validator: validateIpaddress}],
        },
      }
    },
    watch: {
      // 利用watch方法检测路由变化：
      '$route': function (to, from) {
        if (this.$route.params.ip) {
          this.listQuery.host_name = this.$route.params.ip;
          this.getList();
        }
      }
    },
    created() {
      if (this.$route.params.ip) {
        this.listQuery.host_name = this.$route.params.ip
      }
      this.getList();
      this.appnameOptions = getAppList();
      getProductAppCascader().then(response => {
        this.projectOptions = response
      })
    },
    methods: {
      list_dic_get(li,k){
        return get_array_dict_value(li, k, false);
      },
      batchAckConfirm() {
        let ids = [];
        this.selected_rows.forEach(i => ids.push(i.id));
        // console.log(ids)
        // console.log(this.batch_ack_comments)
        uacBatchAck({ids: ids.toString(), comments: this.batch_ack_comments}).then(res => {
          if (res.success) {
            this.$message({
              message: '确认成功',
              type: 'success'
            });
            this.getList();
            this.show_batch_ack_dialog = false;
          } else if (res.error) {
            this.$message({
              message: res.error,
              type: 'error'
            });
          }
        })
      },
      batchAckClick() {
        // console.log(this.selected_rows);
        this.show_batch_ack_dialog = true;
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      getPriorityStyle(priority) {
        let color = get_array_dict_value(this.priority_color_dict, priority, false);
        return "font-weight:bold; color:" + color
      },
      isornot(row, column, cellValue) {
        if (column.label == '是否报警') {
          return isORnot(row.is_mail)
        } else if (column.label == '是否确认') {
          return isORnot(row.is_ack)
        }
      },
      handleReset() {
        this.resetlistQuery();
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          alarm_source: undefined,
          project_name_list: undefined,
          host_name: undefined,
          priority: undefined,
          is_ack: undefined,
          search: undefined
        }
      },
      remoteSearchMethod(query) {
        console.log(query);
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
      descLine(row, column, rowIndex, columnIndex) {
        if (row.column.label == "报警信息") {
          if (row.row.priority == 5) {
            return 'background:#E45959;color:#f9ebeb;font-weight: bold;'
          } else if (row.row.priority == 4) {
            return 'background:#E97659;color:#f9ebeb;font-weight: bold'
          } else if (row.row.priority == 3) {
            return 'background:#FFA059;color:#f9ebeb;font-weight: bold'
          } else if (row.row.priority == 2) {
            return 'background:#FFC859;color:#f9ebeb;font-weight: bold'
          } else if (row.row.priority == 1) {
            return 'background:#7499FF;color:#f9ebeb;font-weight: bold'
          } else if (row.row.priority == 0) {
            return 'background:#97AAB3;color:#f9ebeb;font-weight: bold'
          } else {
            return 'background:#97AAB3;color:#f9ebeb;font-weight: bold'
          }
        }
      },
      formatDate(row, column, cellValue) {
        if (row.ctime < 60) {
          return row.ctime + '秒'
        } else if (60 < row.ctime && row.ctime < 3600) {
          let h = parseInt(row.ctime / 60);
          return h + '分钟'
        } else if (3600 < row.ctime && row.ctime < 86400) {
          let h = parseInt(row.ctime / 3600);
          return h + '小时'
        } else if (row.ctime > 86400) {
          let d = parseInt(row.ctime / 86400);
          return d + '天'
        }
      },
      renderline() {
        this.$refs.mychild.render(this.historySearch);
      },
      handleClose() {

      },
      updateCommon() {
        update(this.ackForm['id'], this.ackForm).then(response => {
          this.getList()
        });
        this.dialogFormVisible = false

      },
      handleClick(tab, event) {
        console.info('sfsf')
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter(listQuery) {
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
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
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
        this.ackForm['id'] = row['id']; // copy obj
        this.ackForm['comments'] = row['comments']; // copy obj

        this.dialogFormVisible = true
      },
      dialogOpen() {
        this.activeName = 'first'
      }
    }
  }
</script>
<style>
  .popver_user {
    background: #f0f9eb;
    opacity: 0.8;
  }

  .app-search-class {
    max-width: 300px;
  }
</style>
