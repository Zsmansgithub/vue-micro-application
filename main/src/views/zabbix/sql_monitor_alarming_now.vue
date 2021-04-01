<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">

        <el-form-item prop="ip">
          <el-input v-model="listQuery.ip" clearable placeholder="IP" style="width: 170px;"/>
        </el-form-item>
        <el-form-item prop="category">
          <el-select v-model="listQuery.category" placeholder="数据库类别" style="width:130px" @change="searchClick" clearable>
            <el-option v-for="item in DbCategoryDict" :key="item.value" :label="item.label" :value="item.label">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="level">
          <el-select v-model="listQuery.level" placeholder="告警级别" style="width:130px" @change="searchClick" clearable>
            <el-option v-for="item in level_dict" :key="item.label" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" :cell-style="descLine">
      <el-table-column label="数据库名称" align="center" prop="task_name" min-width="160px">
        <template slot-scope="scope">
          <a style="color:dodgerblue;text-decoration:underline" @click="dbNameClick(scope.row.db_name)">{{ scope.row.db_name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名" align="center" prop="task_name" min-width="160px">
        <template slot-scope="scope">
          <a style="color:dodgerblue;text-decoration:underline" @click="taskNameClick(scope.row.task_name)">{{ scope.row.task_name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="告警等级" align="center" prop="task_name" min-width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" prop="roles" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.roles }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center" prop="ip" show-overflow-tooltip width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.ip + ':' + scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行结果" align="center" prop="result" min-width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column label="触发器" align="center" prop="trigger" min-width="120">
        <template slot-scope="scope">
          <a style="color:dodgerblue;text-decoration:underline" @click="triggerNameClick(scope.row.trigger)">{{ scope.row.trigger }}</a>
        </template>
      </el-table-column>
      <el-table-column label="触发时间" align="center" prop="last_execute_time" min-width="170px">
                <template slot-scope="scope">
                  <span>{{ scope.row.trigger_time}}</span>
                </template>
              </el-table-column>
      <el-table-column label="告警接收人" align="center" prop="alarm_user" min-width="220" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.alarm_user.toString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="趋势图" align="center" width="70">
        <template slot-scope="scope">
          <a @click="clickShowLineChartButtom(scope.row)">
            <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
          </a>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="曲线图" :visible.sync="show_line_chart" width="1000px">
      <line_chart :series="line_chart_series" :scale="scale" @scale_button_click="scaleButtonClick"></line_chart>
    </el-dialog>

  </div>
</template>


<script>
  import {
    getDatabaseInfoList, createNewDatabaseInfo, editDatabaseInfo, deleteDatabaseInfo,
    batchUpdateDatabaseInfo, testSqlConnect, getLevelCascade, getDbType, batchBindFromDbInfo
  } from '@/api/zabbix/sql_monitor_database_info'
  import {getInnerLineChart, changeActive, InnerUnbind, getTaskNameTransferLeft} from '@/api/zabbix/sql_monitor_tasks'
  import {getAlarmingList} from '@/api/zabbix/sql_monitor_alarming_now'
  import Pagination from '@/components/Pagination'
  import {parseTime} from "../../utils";
  import {validIp} from '@/utils/validate'
  import {accountGetIpList} from '@/api/cmdb'
  import line_chart from "./components/sql_monitor/lineChart"
  import sessionListQuery from "@/components/mixins/sessionListQuery";

  export default {
    components: {Pagination, line_chart},
    mixins: [sessionListQuery],
    data() {
      return {
        transfer_left_all: {mysql_list: [], oracle_list: []},
        transfer: {transfer_right: [], transfer_left: [], transfer_right_selected: [], row_id: null},
        show_bind_db_page: false,
        scale: false,
        line_chart_series: [],
        show_line_chart: false,
        db_type: '',
        level_cascade: [],
        test_connect_icon: 'el-icon-phone',
        disable_test_connect: false,
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
        level_dict: [{value: 1, label: '通知'}, {value: 2, label: '警告'}, {value: 3, label: '一般严重'},
          {value: 4, label: '严重'}, {value: 5, label: '灾难'}],
        RolesDict: [{value: 'master', label: 'master', key: 'master'}, {value: 'slave', label: 'slave', key: 'slave'}],
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        listQuery: {
          page: 1,
          limit: 20,
          ip: null,
          category: null,
          level: null,
        },
        active_dict: [{value: 1, label: '启用'}, {value: 2, label: '禁用'}],
        first_level_dict: [
          {value: '默认', label: '默认'},
          {value: '系统运营组', label: '系统运营组'},
          {value: '数据库管理组', label: '数据库管理组'},
          {value: '信息化安全组', label: '信息化安全组'},
          {value: '主机存储系统组', label: '主机存储系统组'},
        ],
        listLoading: true,
        rules_add: {
          ip: [{message: '请输入正确的IP地址', required: true, trigger: 'blur'}, {validator: this.validateIpaddress}],
          user: [{required: true, message: '必填项', trigger: 'blur'}],
          port: [{required: true, message: '必填项', trigger: 'blur'}],
          password: [{required: true, message: '必填项', trigger: 'blur'}],
          db: [{required: true, message: '必填项', trigger: 'blur'}],
          database: [{required: true, message: '必填项', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList();
      this.getIpList()
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.is_admin_role = this.roles.includes('sql_monitor_admin')
    },
    filters: {
      formatTimeIn(value) {
        if (!value) {
          return value
        }
        let v = value.replace('T', ' ')
        v = v.substring(0, v.length - 7)
        return v
      },
    },
    mounted() {
      getLevelCascade().then(response => {
        this.level_cascade = response
      });
      getTaskNameTransferLeft().then(response => {
        this.transfer_left_all = response
      });
    },
    methods: {
      descLine(row, column, rowIndex, columnIndex) {
      if (row.column.label === "告警等级") {
        if (row.row.level === this.level_dict[4].label) {
          return 'background:#E45959;color:#f9ebeb;font-weight: bold;'
        } else if (row.row.level === this.level_dict[3].label) {
          return 'background:#E97659;color:#f9ebeb;font-weight: bold'
        } else if (row.row.level === this.level_dict[2].label) {
          return 'background:#FFA059;color:#f9ebeb;font-weight: bold'
        } else if (row.row.level === this.level_dict[1].label) {
          return 'background:#FFC859;color:#f9ebeb;font-weight: bold'
        } else if (row.row.level === this.level_dict[0].label) {
          return 'background:#7499FF;color:#f9ebeb;font-weight: bold'
        } else {
          return 'background:#97AAB3;color:#f9ebeb;font-weight: bold'
        }
      }
    },
      triggerNameClick(name) {
        this.$router.push({name: "sql_monitor_triggers", params: {name: name}})
      },
      alarmNameClick(name) {
        this.$router.push({name: "sql_monitor_alarm", params: {name: name}})
      },
      taskNameClick(name){
        this.$router.push({name: "sql_monitor_tasks", params: {name: name}})
      },
      dbNameClick(name){
        this.$router.push({name: "db_cluster", params: {name: name}})
      },
      bindButtonClick(row) {
        this.show_bind_db_page = true
        this.transfer.row_id = row.id
        this.transfer.transfer_right = row.transfer_right
        this.transfer.transfer_left = row.category.toLocaleLowerCase() === 'mysql' ?
          this.transfer_left_all['mysql_list'] : this.transfer_left_all['oracle_list']
        console.log(this.transfer_left_all)
      },
      bindConfirm() {
        this.test_connect_icon = 'el-icon-loading'
        batchBindFromDbInfo({row_id: this.transfer.row_id, transfer_right: this.transfer.transfer_right}).then(res => {
          if (res.success) {
            this.$message({message: res.success, type: 'success'});
          } else if (res.error) {
            this.$alert(res.error, '出错', {dangerouslyUseHTMLString: true}).catch(reason => ({}));
          }
          this.getList();
          this.show_bind_db_page = false
        })
      },
      unbindClick(row) {
        this.$confirm('确定要解绑吗?', '提示', this.confirmOptions).then(() => {
          InnerUnbind({inner_id: row.id}).then(res => {
            if (res.success) {
              this.$message({message: 'success', type: 'success'});
            } else {
              this.$message({message: 'error', type: 'error'});
            }
          })
        }).then(() => {
          setTimeout(this.getList, 200)
        })
      },
      activeClick(row, active) {
        changeActive({row_id: row.id, active: active}).then(res => {
          if (res.success) {
            row.active = active
            row.active_disabled = active === 1
            if (active === 1) {
              this.$message({message: '已启用', type: 'success'});
            } else if (active === 2) {
              this.$message({message: '已禁用', type: 'warning'});
            }
          }
        })
      },
      scaleButtonClick() {
        this.scale = !this.scale
      },
      clickShowLineChartButtom(row) {
        this.scale = false
        this.show_line_chart = true
        getInnerLineChart({inner_id: row.inner_id}).then(response => {
          console.log(row.id)
          this.line_chart_series = response
        })
      },
      dbSelectChanged(val) {
        getDbType({db: val}).then(response => {
          if (response.success) {
            this.db_type = response.success
          }
        });
      },
      testConnectClick(data) {
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          this.test_connect_icon = 'el-icon-loading'
          this.disable_test_connect = true
          testSqlConnect(data).then(res => {
            if (res.success) {
              this.$message({message: res.success, type: 'success'});
            } else if (res.warning) {
              this.$message({message: res.warning, type: 'warning'});
            } else if (res.error) {
              this.$message({message: res.error, type: 'error'});
              console.log(res.msg)
            }
            this.test_connect_icon = 'el-icon-phone'
            this.disable_test_connect = false
          })
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
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
      categoryChanged(val) {
        console.log(val)
        for (let i of this.DbCategoryDict) {
          if (i.value === val) {
            this.detailFormData.port = i.port
            break
          }
        }
      },
      bacthUpdateClick() {
        this.batchUpdateForm = {ip: '', password: ''}
        this.show_batch_edit_page = true
        this.password_type = 'password'
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {category: '', ip: '', port: '', user: '', password: '', database: '', name: '', db: ''};
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
        for (let key of ['category', 'ip', 'port', 'user', 'password', 'database'])
          this.$refs.detailFormData.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        return error_message.toString()
      },
      addSubmitConfirm() {
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          createNewDatabaseInfo(this.detailFormData).then(response => {
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });
              this.getList()
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.getList()
            }
          })
          this.show_add_page = false
          this.getList()
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
          editDatabaseInfo(this.detailFormData, this.detailFormData.id).then(response => {
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });
              this.getList()
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.getList()
            }
          })
          this.show_edit_page = false
          this.getList()
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },
      batchEditSubmitConfirm() {
        this.$refs.batchUpdateForm.validate((valid) => {
          if (valid) {
            let id_list = [];
            for (let i of this.selected_rows) {
              id_list.push(i.id)
            }
            this.batchUpdateForm.id_list = id_list;
            this.batchUpdateForm.change_user = this.people
            batchUpdateDatabaseInfo(this.batchUpdateForm).then(response => {
              let failed_count = this.selected_rows.length - response.success_count
              this.$message({
                title: '成功',
                message: '成功修改' + response.success_count + '条，失败' + failed_count + '条',
                type: 'success',
                duration: 5000
              });
              this.getList();
              console.log(response.error_log)
            });
            this.show_batch_edit_page = false
          } else {
            this.$message({
              message: '表单填写有误',
              type: 'error'
            });
            return false
          }
        })
      },
      addNew() {
        this.initForm();
        this.show_add_page = true;
      },
      fillUpForm(row) {
        this.initForm()
        this.detailFormData.id = row.id;
        this.detailFormData.ip = row.ip;
        this.detailFormData.port = row.port;
        this.detailFormData.user = row.user;
        this.detailFormData.password = row.password;
        this.detailFormData.category = row.category;
        this.detailFormData.database = row.database;
        this.detailFormData.name = row.name;
        this.detailFormData.db = row.db;
        this.test_connect_icon = 'el-icon-phone'
      },
      editOld(row) {
        this.fillUpForm(row)
        this.show_edit_page = true;
        this.password_type = 'password';
        this.dbSelectChanged(row.db)
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteDatabaseInfo(row.id).then((response) => {
              this.$message({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 3000
              });
            }
          );
        }).then(() => {
          setTimeout(this.getList, 200)
        })
      },
      getList() {
        this.listLoading = true;
        getAlarmingList(this.listQuery).then(response => {
          this.table_data_list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 15)
          for (let item of this.table_data_list) {
            item.plaintext = 'eye'
            item.exposed_pwd = this.ciphertext
          }
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
<style>

  a.disabled {
    pointer-events: none;
    filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
    -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
    opacity: 0.5; /*其他，透明度50%*/
  }

  .my_transfer .el-transfer-panel {
    width: 282px;
    height: 400px;
  }

  .my_transfer .el-checkbox-group {
    height: 300px;
  }

  .el-table--border .xxxwwww {
    border-color: #A3D3FF;
  }

  .el-table--border .xxxwwww:after,
  .el-table .xxxwwww:before {
    background-color: #A3D3FF;
  }

  .xxxwwww .el-table__header-wrapper th {
    background: #ecf0f5;
  }
</style>
