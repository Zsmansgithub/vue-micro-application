<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="category">
          <el-select v-model="listQuery.category" placeholder="数据库类别" style="width:130px" @change="searchClick" clearable>
            <el-option v-for="item in DbCategoryDict" :key="item.value" :label="item.label" :value="item.label">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cluster_name">
          <el-input v-model="listQuery.cluster_name" clearable placeholder="实例名" style="width: 130px;"/>
        </el-form-item>
        <el-form-item prop="roles">
          <el-select v-model="listQuery.roles" placeholder="角色" style="width:130px" @change="searchClick" clearable>
            <el-option v-for="item in RolesDict" :key="item.value" :label="item.label" :value="item.label">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="active">
          <el-select v-model="listQuery.active" placeholder="是否启用" filterable clearable @change="searchClick" style="width: 120px">
            <el-option key="1" label="启用" value="1"/>
            <el-option key="0" label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="ip">
          <el-input v-model="listQuery.ip" clearable placeholder="IP" style="width: 170px;"/>
        </el-form-item>
        <el-form-item prop="user">
          <el-input v-model="listQuery.user" clearable placeholder="用户" style="width: 130px;"/>
        </el-form-item>
         <el-form-item prop="task_count">
          <el-input v-model="listQuery.task_count" clearable placeholder="任务数量" style="width: 130px;"
          oninput = "value = value.replace(/[^0-9]/g,'')"/>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>

        <el-button type="primary" icon="el-icon-edit-outline" plain @click="batchUpdateClick"
                   :disabled="selected_rows.length===0">批量修改
        </el-button>
        <el-button type="primary" icon="el-icon-edit-outline" plain @click="batchBindClick"
                   :disabled="selected_rows.length===0">批量绑定
        </el-button>
      </el-form>
    </div>

    <el-table @selection-change="selectRowChanged" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTableAll" tooltip-effect="dark"
              @cell-click="cellClick" :cell-style="cellStyleClass">

      <el-table-column type="expand" width="1px" fixed="right">
        <template slot-scope="scope">
          <el-table :data="scope.row.expand_table_data" highlight-current-row tooltip-effect="dark"
                    v-loading="listLoading" border stripe :cell-style="cellStyleClass" class="xxxwwww">
            <el-table-column label="任务名" align="center" prop="task_name" min-width="220px">
              <template slot-scope="scope">
                <span>{{ scope.row.task_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最后执行时间" align="center" prop="last_execute_time" sortable width="160px">
              <template slot-scope="scope">
                <span>{{ scope.row.last_execute_time | formatTimeIn }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行状态" align="center" prop="execute_status" width="80px">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.execute_status===1" size="medium">成功</el-tag>
                <el-tag v-if="scope.row.execute_status===2" size="medium" type="danger">失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="执行结果" align="center" prop="result" min-width="200px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.result }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行失败原因" align="center" prop="result" min-width="200px" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.error_log }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最后触发时间" align="center" prop="last_trigger_time" sortable width="160px">
              <template slot-scope="scope">
                <span>{{ scope.row.last_trigger_time | formatTimeIn }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最后告警时间" align="center" prop="last_alarm_time" sortable width="160px">
              <template slot-scope="scope">
                <span>{{ scope.row.last_alarm_time | formatTimeIn }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否启用" align="center" prop="active" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.active===1" size="medium">启用</el-tag>
                <el-tag v-if="scope.row.active!==1" type="danger" size="medium">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="趋势图" align="center" width="70">
              <template slot-scope="scope">
                <a @click="clickShowLineChartButtom(scope.row)">
                  <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
                </a>
              </template>
            </el-table-column>
            <el-table-column v-if="is_admin_role" label="操作" align="center" width="130px">
              <template slot-scope="scope">
                <a :class="{disabled:scope.row.active===1}" style="color:dodgerblue;text-decoration:underline" @click="activeClick(scope.row,1)">启用</a>
                |
                <a :class="{disabled:scope.row.active !== 1}" style="color:dodgerblue;text-decoration:underline"
                   @click="activeClick(scope.row,2)">禁用</a>|
                <a style="color:dodgerblue;text-decoration:underline" @click="unbindClick(scope.row)">解绑</a>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center" width="45"></el-table-column>
      <el-table-column label="ID" align="center" prop="id" width="60"/>
      <el-table-column label="类别" align="center" prop="category" show-overflow-tooltip min-width="80"/>
      <el-table-column label="实例名" align="center" prop="name" show-overflow-tooltip min-width="140px">
        <template slot-scope="scope">
          <a style="color:dodgerblue;text-decoration:underline" @click="dbNameClick(scope.row.name)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" prop="roles" show-overflow-tooltip min-width="80"/>
      <el-table-column label="IP" align="center" prop="ip" show-overflow-tooltip width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.ip + ':' + scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center" prop="user" min-width="120px"/>
      <el-table-column v-if="is_admin_role" label="密码" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.exposed_pwd }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin_role" label="明文显示" align="center" width="65px">
        <template slot-scope="scope" slot="header">
          <el-button v-if="open_eye_in_header" type="primary" @click="plaintextPassword" circle>
            <svg-icon icon-class="eye-open"/>
          </el-button>
          <el-button v-if="!open_eye_in_header" type="primary" @click="plaintextPassword" circle>
            <svg-icon icon-class="eye"/>
          </el-button>
        </template>
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.plaintext"/>
        </template>
      </el-table-column>
      <el-table-column label="库名/服务名" align="center" prop="database" min-width="150px"/>
      <el-table-column label="任务数" align="center" prop="task_count" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.task_count }}</span>
          <div style="color: #8492a6; font-size: 10px">禁用数: {{ scope.row.task_count_disabled }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" prop="active" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.active===1" type="success" size="medium">启用</el-tag>
          <el-tag v-if="scope.row.active===0" type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" align="center" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | formatTimeIn }}</span>
          <div style="color: #8492a6; font-size: 10px">更新人: {{ scope.row.change_user }}</div>
        </template>
      </el-table-column>

      <el-table-column v-if="is_admin_role" label="操作" align="center" width="170">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">绑定任务</div>
            <el-button plain type="success" @click="bindButtonClick(scope.row)" circle>
              <svg-icon style="color:green" icon-class="paperclip"/>
            </el-button>
          </el-tooltip>
          <el-button plain type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"/>
          <el-button plain type="danger" icon="el-icon-delete" circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog  :close-on-click-modal='false' title="新增" :visible.sync="show_add_page" width="450px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="100px">
        <el-col :span="24">
          <el-form-item prop="category" label="类别">
            <el-select v-model="detailFormData.category" placeholder="数据库类别" style="width:100%" @change="categoryChanged">
              <el-option v-for="item in DbCategoryDict" :key="item.value" :label="item.label" :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
        <el-col :span="24">
          <el-form-item label="数据库" prop="db_list">
            <el-col :span="24">
              <el-select v-model="detailFormData.db_list" placeholder="数据库" multiple filterable clearable style="width:100%">
                <el-option v-for="item in level_cascade" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账号" min-width="100" prop="user">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="detailFormData.user" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" min-width="100" prop="password">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="detailFormData.password" :type="password_type" style="width:100%">
              <el-button slot="append" icon="el-icon-view" @click="clickShowPwd"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="库名/服务名" prop="database">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="detailFormData.database" type="text" placeholder="oracle必填" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="启用" prop="database">
            <el-select v-model="detailFormData.active" filterable clearable style="width:100%">
              <el-option v-for="item in active_dict" :key="item.label" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="float:left" plain :icon="test_connect_icon" @click="testConnectClick(detailFormData)">连接测试</el-button>
        <el-button @click="show_add_page = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog  :close-on-click-modal='false' title="修改" :visible.sync="show_edit_page" style="text-align: left;" width="450px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="100px">
        <el-col :span="24">
          <el-form-item prop="category" label="类别">
            <el-select v-model="detailFormData.category" placeholder="数据库类别" style="width:100%" @change="categoryChanged">
              <el-option v-for="item in DbCategoryDict" :key="item.value" :label="item.label" :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
        <el-col :span="24">
          <el-form-item label="数据库" prop="db">
            <el-col :span="24">
              <el-select v-model="detailFormData.db" placeholder="数据库" filterable clearable style="width:100%">
                <el-option v-for="item in level_cascade" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账号" min-width="100" prop="user">
            <el-input v-model.trim="detailFormData.user" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" min-width="100" prop="password">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="detailFormData.password" :type="password_type" style="width:100%">
              <el-button slot="append" icon="el-icon-view" @click="clickShowPwd"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="库名/服务名" prop="database">
            <el-input v-model.trim="detailFormData.database" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="启用" prop="database">
            <el-select v-model="detailFormData.active" filterable clearable style="width:100%">
              <el-option v-for="item in active_dict" :key="item.label" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="float:left" plain :icon="test_connect_icon" :disabled="disable_test_connect"
                   @click="testConnectClick(detailFormData)">连接测试
        </el-button>
        <el-button @click="show_edit_page = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitConfirm">确 定</el-button>
      </div>


    </el-dialog>

    <el-dialog  :close-on-click-modal='false' title="批量修改" :visible.sync="show_batch_edit_page" style="text-align: left;" width="450px">
      <el-form ref="batchUpdateForm" :model="batchUpdateForm" label-width="100px">
        <el-col :span="24">
          <el-form-item label="账号" min-width="100" prop="account">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="batchUpdateForm.account" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" min-width="100" prop="password">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="batchUpdateForm.password" :type="password_type" style="width:100%">
              <el-button slot="append" icon="el-icon-view" @click="clickShowPwd"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="库名/服务名" min-width="100" prop="database">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="batchUpdateForm.database" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="启用" min-width="100" prop="active">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-select v-model="batchUpdateForm.active" filterable clearable style="width:100%">
              <el-option v-for="item in active_dict" :key="item.label" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_batch_edit_page = false">取 消</el-button>
        <el-button type="primary" @click="batchEditSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog  :close-on-click-modal='false' title="曲线图" :visible.sync="show_line_chart" width="1000px">
      <line_chart :series="line_chart_series" :scale="scale" @scale_button_click="scaleButtonClick"></line_chart>
    </el-dialog>

    <el-dialog  :close-on-click-modal='false' title="绑定任务" :visible.sync="show_bind_db_page" style="text-align: left;" width="850px">
      <div class="my_transfer">
        <el-transfer filterable v-model="transfer.transfer_right" :data="transfer.transfer_left"
                     :titles="['未绑定', '已绑定']" :button-texts="['去除', '添加']"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_bind_db_page=false">取消</el-button>
        <el-button type="primary" @click="bindConfirm">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog  :close-on-click-modal='false' title="批量绑定" :visible.sync="show_batch_bind_db_page" style="text-align: left;" width="850px">
      <div class="my_transfer">
        <el-transfer filterable v-model="transfer.transfer_right" :data="transfer.transfer_left"
                     :titles="['未绑定', '已绑定']" :button-texts="['去除', '添加']"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_batch_bind_db_page=false">取消</el-button>
        <el-button type="primary" @click="batchBindConfirm">提交</el-button>
      </div>
    </el-dialog>

  </div>

</template>


<script>
  import {
    getDatabaseInfoList, createNewDatabaseInfo, editDatabaseInfo, deleteDatabaseInfo,
    batchUpdateDatabaseInfo, testSqlConnect, getLevelCascade, getDbType, batchBindFromDbInfo, batchBindTask
  } from '@/api/zabbix/sql_monitor_database_info'
  import {getInnerLineChart, changeActive, InnerUnbind, getTaskNameTransferLeft} from '@/api/zabbix/sql_monitor_tasks'
  import Pagination from '@/components/Pagination'
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
        show_batch_bind_db_page: false,
        scale: false,
        line_chart_series: [],
        show_line_chart: false,
        db_type: '',
        level_cascade: [],
        level_cascade_dict: {},
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
        RolesDict: [{value: 'master', label: 'master'}, {value: 'slave', label: 'slave'},{value: 'vip', label: 'vip'}],
        confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'},
        listQuery: {page: 1, limit: 20,},
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
          ip: [{message: '请输入正确的IP地址', required: true, trigger: 'blur'}, {validator: this.validateIpaddress}],
          user: [{required: true, message: '必填项', trigger: 'blur'}],
          port: [{required: true, message: '必填项', trigger: 'blur'}],
          password: [{required: true, message: '必填项', trigger: 'blur'}],
          db: [{required: true, message: '必填项', trigger: 'blur'}],
          db_list: [{validator: this.validateDbList}],
          database: [{validator: this.validateDatabase}],
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
    filters: {
      formatTimeIn(value) {
        if (!value) {
          return value
        }
        let v = value.replace('T', ' ');
        v = v.substring(0, v.length - 7);
        return v
      },
    },
    mounted() {
      getLevelCascade().then(response => {
        this.level_cascade_dict = response
      });
      getTaskNameTransferLeft().then(response => {
        console.log(this.transfer_left_all);
        this.transfer_left_all = response;
        console.log(this.transfer_left_all)
      });
    },
    methods: {
      batchBindConfirm() {
        let row_id_list = [];
        this.selected_rows.forEach((item) => row_id_list.push(item.id));
        batchBindTask({row_id_list: row_id_list, transfer_right: this.transfer.transfer_right}).then(res => {
          if (res.success) {
            this.$message({message: res.success, type: 'success'});
            this.getList();
            this.show_batch_bind_db_page = false
          } else if (res.error) {
            this.$alert(res.error, '出错', {dangerouslyUseHTMLString: true}).catch(reason => ({}));
          }
        })
      },
      batchUpdateClick() {
        this.show_batch_edit_page = true;
        this.batchUpdateForm = {db_type: '', department: '', jingli: '', manager: '', alarm_sms: '', copy_type: ''}
      },
      batchBindClick() {
        let set = new Set();
        this.selected_rows.forEach((item) => set.add(item.category.toLocaleLowerCase()));
        let li = Array.from(set);
        if (li.length !== 1) {
          this.$notify({title: '失败', message: '批量绑定时必须全部Mysql或全部是Oracle', type: 'warning', duration: 5000});
          return
        }
        this.transfer.transfer_left = li[0] === 'mysql' ? this.transfer_left_all['mysql_list'] : this.transfer_left_all['oracle_list'];
        this.transfer.transfer_right = [];
        this.show_batch_bind_db_page = true;
      },
      dbNameClick(name) {
        this.$router.push({name: "db_cluster", params: {name: name}})
      },
      bindButtonClick(row) {
        this.show_bind_db_page = true;
        this.transfer.row_id = row.id;
        this.transfer.transfer_right = row.transfer_right;
        this.transfer.transfer_left = row.category.toLocaleLowerCase() === 'mysql' ?
          this.transfer_left_all['mysql_list'] : this.transfer_left_all['oracle_list'];
        console.log(this.transfer_left_all)
      },
      bindConfirm() {
        this.test_connect_icon = 'el-icon-loading';
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
            row.active = active;
            row.active_disabled = active === 1;
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
        this.scale = false;
        this.show_line_chart = true;
        getInnerLineChart({inner_id: row.id}).then(response => {
          console.log(row.id);
          this.line_chart_series = response
        })
      },
      testConnectClick(data) {
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          this.test_connect_icon = 'el-icon-loading';
          this.disable_test_connect = true;
          testSqlConnect(data).then(res => {
            if (res.success) {
              this.$message({message: res.success, type: 'success'});
            } else if (res.warning) {
              this.$message({message: res.warning, type: 'warning'});
            } else if (res.error) {
              this.$message({message: res.error, type: 'error'});
              console.log(res.msg)
            }
            this.test_connect_icon = 'el-icon-phone';
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
        return 'padding:4px 0'
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
          this.$set(this.table_data_list, row.index, row)
        } else {
          // debugger
          if (row.transfer_right.length !== 0) {
            this.$refs['multipleTableAll'].toggleRowExpansion(row)
          }
        }
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
      validateDatabase(rule, value, callback) {
        if (!value && this.db_type === 'oracle') {
          callback(new Error('oracle必填'))
        }
      },
      validateDbList(rule, value, callback) {
        getDbType({db_list: this.detailFormData.db_list.join(',')}).then(response => {
          if (response.success) {
            this.db_type = response.success
          } else if (response.error) {
            callback(new Error(response.error))
          }
        });
      },
      clickShowPwd() {
        this.password_type = this.password_type === 'password' ? 'text' : 'password'
      },
      categoryChanged(val) {
        this.level_cascade = this.level_cascade_dict[val.toLocaleLowerCase()];
        this.detailFormData.db_list = [];
        this.detailFormData.db = ''
      },
      selectRowChanged(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {
          category: 'Mysql', ip: '', port: '', user: 'prism_monitor', password: 'fjzyHYvmn3',
          database: 'information_schema', name: '', db: '', active: 1, db_list: []
        };
        this.level_cascade = this.level_cascade_dict[this.detailFormData.category.toLocaleLowerCase()]
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
                message: response['success'],
                type: 'success',
                duration: 3000
              });
              this.getList()
            }
          });
          this.show_add_page = false;
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
          });
          this.show_edit_page = false;
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
            this.batchUpdateForm.change_user = this.people;
            batchUpdateDatabaseInfo(this.batchUpdateForm).then(response => {
              this.$message({
                title: '成功',
                message: response.success,
                type: 'success',
                duration: 5000
              });
              this.getList();
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
        this.initForm();
        this.detailFormData.id = row.id;
        this.detailFormData.ip = row.ip;
        this.detailFormData.port = row.port;
        this.detailFormData.user = row.user;
        this.detailFormData.password = row.password;
        this.detailFormData.category = row.category;
        this.detailFormData.database = row.database;
        this.detailFormData.name = row.name;
        this.detailFormData.db = row.db;
        this.detailFormData.active = row.active;
        this.test_connect_icon = 'el-icon-phone';
        this.level_cascade = this.level_cascade_dict[this.detailFormData.category.toLocaleLowerCase()]
      },
      editOld(row) {
        this.fillUpForm(row);
        this.show_edit_page = true;
        this.password_type = 'password';
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
        getDatabaseInfoList(this.listQuery).then(response => {
          this.table_data_list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 15);
          for (let item of this.table_data_list) {
            item.plaintext = 'eye';
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
    border-color: lightskyblue;
  }

  .el-table--border .xxxwwww:after,
  .el-table .xxxwwww:before {
    background-color: lightskyblue;
  }

  .xxxwwww .el-table__header-wrapper th {
    background: #ecf0f5;
  }
</style>
