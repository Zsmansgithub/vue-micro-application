<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">

        <el-form-item prop="ip">
          <el-input v-model.trim="listQuery.ip" placeholder="ip" style="width:150px" clearable/>
        </el-form-item>
        <el-form-item prop="task_name">
          <el-input v-model.trim="listQuery.task_name" placeholder="任务名称" style="width:150px" clearable/>
        </el-form-item>
        <el-form-item prop="trigger_name">
          <el-input v-model.trim="listQuery.trigger" placeholder="触发器名称" style="width:150px" clearable/>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>

      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" :cell-style="cellStyleClass">
      <el-table-column label="告警时间" width="160" prop="change_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名" width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="触发器" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trigger_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警内容" min-width="250" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警数据" min-width="250" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.json_data }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警联系人" min-width="300" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sms_list }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

  </div>

</template>

<script>
  import {getAlarmList, createAlarm, editAlarm, deleteAlarm, getAlarmPhoneList,} from '@/api/zabbix/sql_monitor_alarm'
  import {getAlarmHistory,} from '@/api/zabbix/sql_monitor_alarm_history'
  import Pagination from '@/components/Pagination'
  import sessionListQuery from "@/components/mixins/sessionListQuery";

  import {parseTime} from "../../utils";
  import {accountGetIpList} from '@/api/cmdb'
  import {validIp, validSpecialChar, validFuncName, validPhoneList} from '@/utils/validate'

  export default {
    components: {Pagination},
    mixins: [sessionListQuery],
    data() {
      return {
        alarm_phone_list: [],
        show_dingding_template: false,
        show_sms_template: true,
        show_mail_template: false,
        status: [{value: 1, label: '启用'}, {value: 0, label: '禁用'}],
        // alarm_types: [{value: '钉钉', label: '钉钉'}, {value: '短信', label: '短信'}, {value: '邮件', label: '邮件'}],
        alarm_types: [{value: '钉钉', label: '钉钉'}, {value: '短信', label: '短信'}],
        mobileOptions: [],
        level_list_all: [[1, '通知'], [2, '警告'], [3, '一般严重'], [4, '严重'], [5, '灾难']],
        checkboxGroup: ['一般严重', '严重', '灾难',],
        radio: 3,
        sql_table_data_columns: [],
        sql_table_data: [],
        show_sql_data_table: false,
        test_connect_icon: 'el-icon-phone',
        database_list: [],
        ciphertext: "********",
        open_eye_in_header: false,
        password_type: 'password',
        selected_rows: [],
        total: 0,
        ipList: [],
        table_data_list: null,
        detailFormData: {},
        batchUpdateForm: {},
        show_add_page: false,
        show_edit_page: false,
        show_batch_edit_page: false,
        is_admin_role: false,
        people: '',
        roles: [],
        DbCategoryDict: [{value: 'Oracle', label: 'Oracle', port: 1521}, {value: 'Mysql', label: 'Mysql', port: 3306}],
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        listQuery: {
          page: 1,
          limit: 20,
        },
        active_dict: [{value: 1, label: '启用'}, {value: 0, label: '禁用'}],
        first_level_dict: [
          {value: '默认', label: '默认'},
          {value: '系统运营组', label: '系统运营组'},
          {value: '数据库管理组', label: '数据库管理组'},
          {value: '信息化安全组', label: '信息化安全组'},
          {value: '主机存储系统组', label: '主机存储系统组'},
        ],
        listLoading: true,
        rules_add: {
          name: [{
            required: true,
            message: '必填项',
            trigger: 'blur'
          }, {validator: this.validateSpecialCharacter}, {validator: this.validateFunctionName}],
          sms_template: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validateExpression}],
          sms_list: [{required: true, message: '必填项', trigger: 'blur'}],
          external_phone_list: [{validator: this.validatePhoneNumber}],
          enabled: [{required: true, message: '必填项', trigger: 'blur'}],
          alarm_type: [{required: true, message: '必填项', trigger: 'blur'}],
          interval: [{required: true, message: '必填项', trigger: 'blur'}],
          trigger_times: [{required: true, message: '必填项', trigger: 'blur'}],

        },
      }
    },
    created() {
      this.getList();
      this.getIpList();
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.is_admin_role = this.roles.includes('sql_monitor_admin')
    },
    mounted() {
      getAlarmPhoneList().then(res => {
        this.alarm_phone_list = res
      })
    },
    filters: {
      formatTime(value) {
        let v = value.replace('T', ' ');
        v = v.substring(0, v.length - 7);
        return v
      },
    },
    methods: {
      alarmTypeChanged(val) {
        this.show_dingding_template = false;
        this.show_sms_template = false;
        this.show_mail_template = false;
        if (val.indexOf('钉钉') !== -1) {
          this.show_dingding_template = true;
        }
        if (val.indexOf('短信') !== -1) {
          this.show_sms_template = true;
        }
        if (val.indexOf('邮件') !== -1) {
          this.show_mail_template = true;
        }

      },
      validateFunctionName(rule, value, callback) {
        if (value) {
          if (validFuncName(value)) {
            callback()
          } else {
            callback(new Error('名称请以字母或汉字开头'))
          }
        } else {
          callback()
        }
      },
      validateSpecialCharacter(rule, value, callback) {
        if (value) {
          if (validSpecialChar(value)) {
            callback(new Error('不允许特殊字符'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      validatePhoneNumber(rule, value, callback) {
        if (value) {
          if (validPhoneList(value)) {
            callback()
          } else {
            callback(new Error('请输入正确手机号'))
          }
        } else {
          callback()
        }
      },
      cellStyleClass() {
        return 'padding:6px 0'
      },
      cellClick(row, column, cell, event) {
        if (column.label === '明文显示') {
          if (row.plaintext === 'eye') {
            row.plaintext = 'eye-open';
            row.exposed_pwd = row.password
          } else {
            row.plaintext = 'eye';
            row.exposed_pwd = this.ciphertext
          }
        }
        this.$set(this.table_data_list, row.index, row)
      },
      plaintextPassword() {
        if (!this.open_eye_in_header) {
          for (let item of this.table_data_list) {
            item.plaintext = 'eye-open';
            item.exposed_pwd = item.password
          }
        } else {
          for (let item of this.table_data_list) {
            item.plaintext = 'eye';
            item.exposed_pwd = this.ciphertext
          }
        }
        for (let item of this.table_data_list) {
          this.$set(this.table_data_list, item.index, item)
        }
        this.open_eye_in_header = !this.open_eye_in_header
      },
      getIpList() {
        accountGetIpList().then(response => {
          this.ipList = response
        })
      },
      validateIpaddress(rule, value, callback) {
        if (value) {
          if (validIp(value)) {
            if (this.ipList.indexOf(value) !== -1) {
              callback()
            } else {
              callback('此ip不在资源管理中')
            }
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      },
      clickShowPwd() {
        this.password_type = this.password_type === 'password' ? 'text' : 'password'
      },
      bacthUpdateClick() {
        this.initBatchUpdateForm();
        this.show_batch_edit_page = true
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {
          name: '', enabled: 1, alarm_type: ['短信', '钉钉'], mail_list: '', sms_list: [], level_list: [3, 4, 5,],
          dingding_list: [], mail_template: '', sms_template: '', dingding_template: '', description: '',
          interval: '60', during: '', trigger_times: '3', external_phone_list: ''
        };
      },
      initBatchUpdateForm() {
        this.batchUpdateForm = {ip: '', password: ''}
      },
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      resetClick() {
        this.resetListQuery();
        this.getList()
      },
      validateForm() {
        let error_message = [];
        for (let key of Object.keys(this.rules_add))
          this.$refs.detailFormData.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        return error_message.toString();
      },
      addSubmitConfirm() {
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {

          createAlarm(this.detailFormData).then(response => {
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.show_add_page = false;
              this.resetClick()
            }
          })
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }

      },
      editSubmitConfirm() {
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {

          editAlarm(this.detailFormData, this.detailFormData.id).then(response => {
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });

            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.show_edit_page = false;
              this.resetClick()
            }

          })
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },

      addNew() {
        this.initForm();
        this.show_add_page = true;
      },
      fillUpForm(row) {
        this.initForm();
        console.log(row);
        this.detailFormData.name = row.name;
        this.detailFormData.enabled = row.enabled;
        this.detailFormData.alarm_type = row.alarm_type;
        this.detailFormData.mail_list = row.mail_list;
        this.detailFormData.sms_list = row.sms_list;
        this.detailFormData.level_list = row.level_list;
        this.detailFormData.dingding_list = row.dingding_list;
        this.detailFormData.mail_template = row.mail_template;
        this.detailFormData.sms_template = row.sms_template;
        this.detailFormData.dingding_template = row.dingding_template;
        this.detailFormData.description = row.description;
        this.detailFormData.interval = row.interval;
        this.detailFormData.during = row.during;
        this.detailFormData.trigger_times = row.trigger_times;
        this.detailFormData.id = row.id;
        this.detailFormData.external_phone_list = row.external_phone_list;
      },
      editOld(row) {
        this.fillUpForm(row);
        this.alarmTypeChanged(row.alarm_type);
        this.show_edit_page = true;
        this.password_type = 'password';
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteAlarm(row.id).then((response) => {
              this.$message({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 3000
              });
            }
          );
        }).then(() => {
          setTimeout(this.resetClick, 200)
        })
      },
      getList() {
        this.listLoading = true;
        getAlarmHistory(this.listQuery).then(response => {
          this.table_data_list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 15)
        })
      },
      searchClick() {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        });
      },
      resetListQuery() {
        this.listQuery = {page: 1, limit: 20}
      },
    }
  }
</script>

