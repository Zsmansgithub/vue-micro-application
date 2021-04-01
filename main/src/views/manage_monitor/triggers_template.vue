<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-input v-model.trim="listQuery.title" placeholder="报警名" style="width:150px"/>
        </el-form-item>
        <el-form-item prop="priority">
          <el-select v-model="listQuery.priority" placeholder="请选择优先级" clearable style="width: 150px;" @change="getList">
            <el-option v-for="item in priority_dict" :key="item[0]" :label="item[1]" :value="item[0]">
              <span :style="getPriorityStyle(item[0])">{{ item[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" :cell-style="cellStyleClass">
      <el-table-column label="报警名" prop="title" width="170" align="center" show-overflow-tooltip sortable/>
      <el-table-column label="监控类型" prop="type" width="110" align="center" sortable/>
      <el-table-column label="优先级" width="90" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.priority_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮件模板ID" prop="mail_template" width="100" align="center"/>
      <el-table-column label="报警方式" prop="alarm_type" width="100" align="center"/>
      <el-table-column label="表达式" prop="expression" width="250" align="center" show-overflow-tooltip/>
      <el-table-column label="报警描述" prop="description" width="200" align="center" show-overflow-tooltip/>
      <el-table-column label="备注" prop="comments" min-width="250" align="center" show-overflow-tooltip/>
      <el-table-column label="更新时间" prop="update_time" width="150" align="center"/>
      <el-table-column label="更新人" prop="modify_user" width="70" align="center"/>
      <el-table-column v-if="is_admin_role" label="操作" align="center" width="110">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"/>
          <el-button plain type="danger" icon="el-icon-delete" circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="新增" :visible.sync="show_add_page" width="500px" :close-on-click-modal="false">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="80px">
        <el-form-item label="报警名" min-width="100" prop="title">
          <el-input v-model.trim="detailFormData.title" type="text" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="监控类型" min-width="100" prop="type">
          <el-select v-model.trim="detailFormData.type" placeholder="监控类型" filterable class="filter-item" style="width: 100%">
            <el-option v-for="item in type_dict" :key="item[0]" :label="item[1]" :value="item[0]"/>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" min-width="100" prop="priority">
          <el-select v-model.trim="detailFormData.priority" placeholder="优先级" filterable class="filter-item" style="width: 100%">
            <el-option v-for="item in priority_dict" :key="item[0]" :label="item[1]" :value="item[0]">
              <span :style="getPriorityStyle(item[0])">{{ item[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表达式" min-width="100" prop="expression">
          <el-input v-model.trim="detailFormData.expression" type="text" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="报警描述" min-width="100" prop="description">
          <el-input v-model.trim="detailFormData.description" type="text" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="备注" min-width="100" prop="comments">
          <el-input v-model.trim="detailFormData.comments" type="text" style="width: 100%"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_add_page = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="show_edit_page" width="500px" :close-on-click-modal="false">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="80px">
        <el-form-item label="报警名" min-width="100" prop="title">
          <el-input v-model.trim="detailFormData.title" type="text" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="监控类型" min-width="100" prop="type">
          <el-select v-model.trim="detailFormData.type" placeholder="监控类型" filterable class="filter-item" style="width: 100%">
            <el-option v-for="item in type_dict" :key="item[0]" :label="item[1]" :value="item[0]"/>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" min-width="100" prop="priority">
          <el-select v-model.trim="detailFormData.priority" placeholder="优先级" filterable class="filter-item" style="width: 100%">
            <el-option v-for="item in priority_dict" :key="item[0]" :label="item[1]" :value="item[0]">
              <span :style="getPriorityStyle(item[0])">{{ item[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表达式" min-width="100" prop="expression">
          <el-input v-model.trim="detailFormData.expression" type="text" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="报警描述" min-width="100" prop="description">
          <el-input v-model.trim="detailFormData.description" type="text" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="备注" min-width="100" prop="comments">
          <el-input v-model.trim="detailFormData.comments" type="text" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit_page = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>


<script>
  import {getTriggersTemplate, createTriggersTemplate, editTriggersTemplate, deleteTriggersTemplate} from '@/api/midmonitor/alarm'
  import Pagination from '@/components/Pagination'

  import {parseTime} from "../../utils";
  import {accountGetIpList} from '@/api/cmdb'
  import {validIp, validSpecialChar, validFuncName} from '@/utils/validate'
  import {get_array_dict_value} from '@/utils/time_trans'
  import sessionListQuery from "@/components/mixins/sessionListQuery";

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
        alarm_types: [{value: '钉钉', label: '钉钉'}, {value: '短信', label: '短信'}],
        mobileOptions: [],
        type_dict: [[1, 'es'], [2, 'mq'], [3, 'redis']],
        priority_dict: [[1, '通知'], [2, '警告'], [3, '一般严重'], [4, '严重'], [5, '灾难'], [0, '未定义']],
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
        confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'},
        listQuery: {page: 1, limit: 20},
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
          title: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validateSpecialCharacter}],
          type: [{required: true, message: '必填项', trigger: 'blur'}],
          priority: [{required: true, message: '必填项', trigger: 'blur'}],
        },
        priority_color_dict: [[5, '#E45959'], [4, '#E97659'], [3, '#FFA059'], [2, '#FFC859'], [1, '#7499FF'], [0, '#97AAB3']],
      }
    },
    created() {
      if (this.$route.params.name) {
        this.listQuery.name = this.$route.params.name
      }
      this.getList();
      this.getIpList()
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.is_admin_role = this.roles.includes('sql_monitor_admin')
      console.log(this.$store.getters)
    },
    mounted() {
      // getAlarmPhoneList().then(res => {
      //   this.alarm_phone_list = res
      // })
    },
    filters: {
      formatTime(value) {
        let v = value.replace('T', ' ')
        v = v.substring(0, v.length - 7)
        return v
      },
    },
    methods: {
      getPriorityStyle(priority) {
        let color = get_array_dict_value(this.priority_color_dict, priority, false)
        return "font-weight:bold; color:" + color
      },
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

      cellStyleClass(row, column, rowIndex, columnIndex) {
        let style = 'padding:6px 0;'
        if (row.column.label === "优先级") {
          let color = get_array_dict_value(this.priority_color_dict, row.row.priority, false)
          style = style + 'background-color:' + color + ';color:#f9ebeb;font-weight: bold'
        }
        return style
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
        this.initBatchUpdateForm()
        this.show_batch_edit_page = true
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {
          title: '', type: 1, priority: 1, expression: '', comments: '', description: ''
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

          createTriggersTemplate(this.detailFormData).then(response => {
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
              this.show_add_page = false
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
          editTriggersTemplate(this.detailFormData, this.detailFormData.id).then(response => {
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
              this.show_edit_page = false
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
        this.initForm()
        this.detailFormData.title = row.title;
        this.detailFormData.priority = row.priority;
        this.detailFormData.type = get_array_dict_value(this.type_dict, row.type, true);
        this.detailFormData.expression = row.expression;
        this.detailFormData.description = row.description;
        this.detailFormData.comments = row.comments;
        this.detailFormData.id = row.id;
      },
      editOld(row) {
        this.fillUpForm(row)
        this.show_edit_page = true;
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteTriggersTemplate(row.id).then((response) => {
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
        getTriggersTemplate(this.listQuery).then(response => {
          this.table_data_list = response.results;
          this.total = response.count;

          setTimeout(() => {
            this.listLoading = false
          }, 15)
          for (let i of this.table_data_list) {
            i.priority_name = get_array_dict_value(this.priority_dict, i.priority)
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

