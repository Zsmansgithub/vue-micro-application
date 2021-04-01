<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-input v-model.trim="listQuery.name" placeholder="任务名称" style="width:130px"/>
        </el-form-item>
        <el-form-item prop="ip">
          <el-select v-model="listQuery.enabled" placeholder="是否启用" filterable clearable
                     @change="searchClick" style="width: 120px">
            <el-option key="1" label="启用" value="1"/>
            <el-option key="2" label="禁用" value="0"/>
          </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button  type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>

      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" :cell-style="cellStyleClass">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column label="名称" align="center" prop="name" show-overflow-tooltip width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表达式" align="center" prop="expression" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.expression }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关键变量" align="center" prop="variates" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.variates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表达式描述" align="center" prop="description" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column label="告警等级" align="center" prop="level" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level===1" type="info">通知</el-tag>
          <el-tag v-if="scope.row.level===2" type="info">警告</el-tag>
          <el-tag v-if="scope.row.level===3" type="primary">一般严重</el-tag>
          <el-tag v-if="scope.row.level===4" type="warning">严重</el-tag>
          <el-tag v-if="scope.row.level===5" type="danger">灾难</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" prop="enabled" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enabled===1" size="medium">启用</el-tag>
          <el-tag v-if="scope.row.enabled===0" type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" align="center" show-overflow-tooltip sortable width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" show-overflow-tooltip width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="is_admin_role" label="操作" align="center" width="110">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"/>
          <el-button plain type="danger" icon="el-icon-delete" circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="新增" :visible.sync="show_add_page" width="800px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="90px">

        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="detailFormData.name" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" min-width="100" prop="enabled">
            <el-select v-model="detailFormData.enabled" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="表达式" min-width="100" prop="expression">
            <el-input v-model="detailFormData.expression" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <div style="margin:10px 11px">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content" v-html="triggerHelp()"></div>
              <i class="el-icon-question" style="color:dodgerblue"></i>
            </el-tooltip>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" min-width="100" prop="description">
            <el-input v-model="detailFormData.description" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="告警级别" min-width="100" prop="level">
            <el-radio-group v-model="detailFormData.level">
              <el-radio :label="1">通知</el-radio>
              <el-radio :label="2">警告</el-radio>
              <el-radio :label="3">一般严重</el-radio>
              <el-radio :label="4">严重</el-radio>
              <el-radio :label="5">灾难</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_add_page = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="show_edit_page" style="text-align: left;" width="800px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="90px">

        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="detailFormData.name" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" min-width="100" prop="enabled">
            <el-select v-model="detailFormData.enabled" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="表达式" min-width="100" prop="expression">
            <el-input v-model="detailFormData.expression" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <div style="margin:10px 11px">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content" v-html="triggerHelp()"></div>
              <i class="el-icon-question" style="color:dodgerblue"></i>
            </el-tooltip>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" min-width="100" prop="description">
            <el-input v-model="detailFormData.description" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="告警级别" min-width="100" prop="level">
            <el-radio-group v-model="detailFormData.level">
              <el-radio :label="1">通知</el-radio>
              <el-radio :label="2">警告</el-radio>
              <el-radio :label="3">一般严重</el-radio>
              <el-radio :label="4">严重</el-radio>
              <el-radio :label="5">灾难</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit_page = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>


<script>
  import {getTriggerList, createTrigger, editTrigger, deleteTrigger, testExpression} from '@/api/zabbix/sql_monitor_triggers'
  import Pagination from '@/components/Pagination'
  import {parseTime} from "../../utils";
  import {accountGetIpList} from '@/api/cmdb'
  import {validIp, validSpecialChar, validFuncName} from '@/utils/validate'
  import sessionListQuery from "@/components/mixins/sessionListQuery";

  export default {
    components: {Pagination},
    mixins: [sessionListQuery],
    data() {
      return {
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
          name: null,
          active: null,
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
          name: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validateSpecialCharacter}, {validator: this.validateFunctionName}],
          expression: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validateExpression}],
          description: [{required: true, message: '必填项', trigger: 'blur'}],
          enabled: [{required: true, message: '必填项', trigger: 'blur'}],

        },
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
    },
    mounted() {

    },
    filters: {
      formatTime(value) {
        let v = value.replace('T', ' ')
        v = v.substring(0, v.length - 7)
        return v
      },
      unescape: function (html) {
        return html
          .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, "\"")
          .replace(/&#39;/g, "\'");
      }
    },
    methods: {
      triggerHelp() {
        let content = '使用提示<br/>'
          + '"{{abc}}>1" : 当变量abc大于1时<br/>'
          + '"{{ abc }} == 1 && {{ cba }} != 1" : 当变量abc等于1，且cba不等于1时<br/>'
          + '"{{ abc }} * 2 <= {{ bca }} - 1" : 当变量abc乘以2小于bca减1时<br/>'
          + '"{{ count(*) }} > 0 " : 当行数大于0时<br/>'
          + '"{{ sum(abc) }} ==100" : 当abc的总和为100时<br/>'
          + '<br/>'
          + '比较运算符: ==, !=, >, <, >=, <=, &&, || <br/>'
          + '算术运算符: +, -, *, /, (, ) <br/>'
          + '函数: count, sum, avg, max, min<br/>'
        return content
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
      validateExpression(rule, value, callback) {
        if (value) {
          testExpression({expression: this.detailFormData.expression}).then(response => {
            if (response['error']) {
              callback(new Error('表达式错误'))
            } else {
              callback()
            }
          })
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
        this.initBatchUpdateForm()
        this.show_batch_edit_page = true
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {name: '', enabled: 1, expression: '', description: '', level: 3,};
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
          testExpression({expression: this.detailFormData.expression}).then(response => {
            if (response['error']) {
              this.$notify({
                title: '表达式格式错误',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });
            } else {
              createTrigger(this.detailFormData).then(response => {
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
          testExpression({expression: this.detailFormData.expression}).then(response => {
            if (response['error']) {
              this.$notify({
                title: '表达式格式错误',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });
            } else {
              editTrigger(this.detailFormData, this.detailFormData.id).then(response => {
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
        this.detailFormData.name = row.name;
        this.detailFormData.enabled = row.enabled;
        this.detailFormData.description = row.description;
        this.detailFormData.expression = row.expression;
        this.detailFormData.level = row.level;
        this.detailFormData.id = row.id;
      },
      editOld(row) {
        this.fillUpForm(row)
        this.show_edit_page = true;
        this.password_type = 'password';
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteTrigger(row.id).then((response) => {
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
        getTriggerList(this.listQuery).then(response => {
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

