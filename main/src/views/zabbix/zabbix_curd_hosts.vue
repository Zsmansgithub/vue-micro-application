<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="hostid">
          <el-input clearable v-model.trim="listQuery.hostid" placeholder="主机ID" style="width:100px"/>
        </el-form-item>
        <el-form-item prop="name">
          <el-input clearable v-model.trim="listQuery.host_name" placeholder="主机名" style="width:140px"/>
        </el-form-item>
        <el-form-item prop="visible_name">
          <el-input clearable v-model.trim="listQuery.visible_name" placeholder="显示名" style="width:140px"/>
        </el-form-item>
        <el-form-item prop="group_name">
          <el-input clearable v-model.trim="listQuery.group_name" placeholder="组名" style="width:140px"/>
        </el-form-item>
        <el-form-item prop="ip">
          <el-input clearable v-model.trim="listQuery.ip" placeholder="IP" style="width:140px"/>
        </el-form-item>
        <el-form-item prop="proxy">
          <el-select clearable v-model="listQuery.proxy" filterable class="filter-item" style="width:140px"
                     placeholder="proxy" @change="searchClick">
            <el-option v-for="item in all_proxies" :key="item.host" :label="item.host" :value="item.proxyid">
              <span style="float: left">{{ item.host }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="template">
          <el-select clearable v-model="listQuery.template" filterable class="filter-item" style="width:180px"
                     placeholder="template" @change="searchClick">
            <el-option v-for="item in all_templates" :key="item.name" :label="item.name" :value="item.templateid">
              <span style="float: left">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="Status" clearable @change="searchClick" style="width: 110px">
            <el-option key="1" label="启用" value="0"/>
            <el-option key="2" label="禁用" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="available">
          <el-select v-model="listQuery.available" placeholder="是否可用" clearable @change="searchClick" style="width: 110px">
            <el-option key="1" label="可用" value="1"/>
            <el-option key="2" label="不可用" value="2"/>
            <el-option key="0" label="Unknown" value="0"/>
          </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleBatchSearch">批量查询</el-button>
        <el-button plain :disabled="selected_rows.length === 0 " type="danger" @click="batchDelete">批量删除</el-button>
        <el-button plain :disabled="selected_rows.length === 0 " type="primary" @click="batchChangeStatus(0)">批量启用</el-button>
        <el-button plain :disabled="selected_rows.length === 0 " type="danger" @click="batchChangeStatus(1)">批量禁用</el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list"
              border stripe highlight-current-row :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark"
              @cell-click="cellClick" :cell-style="cellStyleClass">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column label="主机ID" align="center" prop="hostid" show-overflow-tooltip width="90" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.hostid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源ID" align="center" prop="hostid" show-overflow-tooltip width="80">
        <template slot-scope="scope">
          <span style="color:dodgerblue"><a @click="resourceIdClick(scope.row.resource_id)">{{ scope.row.resource_id }}</a></span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" align="center" prop="host" show-overflow-tooltip width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Visible Name" align="center" prop="name" show-overflow-tooltip width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Groups" align="center" prop="groups" width="180">
        <template slot-scope="scope">
          <span v-html="scope.row.groups.replace(/,/g,'<br/>')"></span>
        </template>
      </el-table-column>
      <el-table-column label="Agent Interfaces" align="center" prop="interfaces" show-overflow-tooltip width="190">
        <template slot-scope="scope">
          <span v-html="scope.row.interfaces.replace(/,/g,'<br/>')"></span>
        </template>
      </el-table-column>
      <el-table-column label="Parent Templates" align="center" prop="parentTemplates" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="scope.row.parentTemplates.replace(/,/g,'<br/>')"></span>
        </template>
      </el-table-column>
      <el-table-column label="Proxy" align="center" show-overflow-tooltip width="140">
        <template slot-scope="scope">
          <span v-html="scope.row.proxy"></span>
        </template>
      </el-table-column>
      <el-table-column label="Tags" align="center" show-overflow-tooltip width="130">
        <template slot-scope="scope">
          <span v-html="scope.row.tags.replace(/,/g,'<br/>')"></span>
        </template>
      </el-table-column>
      <el-table-column label="Available" align="center" prop="status" width="95">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.available==='1'" type="success" size="medium">可用</el-tag>
          <el-tag v-if="scope.row.available==='0'" type="danger" size="medium">Unknown</el-tag>
          <el-tag v-if="scope.row.available==='2'" type="danger" size="medium">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" prop="status" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='0'" type="success" size="medium">启用</el-tag>
          <el-tag v-else type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"/>
          <el-button plain type="danger" icon="el-icon-delete" circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <br/>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList" :page-sizes="[20,50,100,200]"/>

    <el-dialog title="新增" :visible.sync="show_add_page" width="500px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="90px">
        <el-col :span="24">
          <el-form-item label="IP" min-width="100" prop="ip">
            <el-input v-model="detailFormData.ip" type="textarea" placeholder="小写逗号分隔" style="width:100%"
                      :autosize="{ minRows:2, maxRows: 10 }"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="端口" min-width="100" prop="port">
            <el-input v-model.trim="detailFormData.port" type="text" placeholder="端口" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Template" min-width="100" prop="template">
            <el-select multiple v-model="detailFormData.template" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in all_templates" :key="item.name" :label="item.name" :value="item.templateid">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Proxy" min-width="100">
            <el-select v-model="detailFormData.proxy" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in all_proxies" :key="item.host" :label="item.host" :value="item.proxyid">
                <span style="float: left">{{ item.host }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Tag" min-width="100">
            <el-select v-model="detailFormData.need_tag" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in need_tag_dict" :key="item.label" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_add_page = false">取 消</el-button>
        <el_button_wait type="primary" @click="addSubmitConfirm()">确 定</el_button_wait>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="show_edit_page" style="text-align: left;" width="500px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="90px">
        <el-col :span="24">
          <el-form-item label="IP" min-width="100" prop="ip">
            <el-input v-model.trim="detailFormData.ip" type="text" placeholder="必填项" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="端口" min-width="100" prop="port">
            <el-input v-model.trim="detailFormData.port" type="text" placeholder="必填项" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主机名" prop="host_name">
            <el-input v-model.trim="detailFormData.host_name" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="显示名" prop="visible_name">
            <el-input v-model.trim="detailFormData.visible_name" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主机组">
            <el-select v-model="detailFormData.host_group" filterable multiple class="filter-item" style="width:100%">
              <el-option v-for="item in all_groups" :key="item.name" :label="item.name" :value="item.groupid">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Template" min-width="100" prop="template">
            <el-select multiple v-model="detailFormData.template" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in all_templates" :key="item.name" :label="item.name" :value="item.templateid">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Proxy" min-width="100">
            <el-select v-model="detailFormData.proxy" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in all_proxies" :key="item.host" :label="item.host" :value="item.proxyid">
                <span style="float: left">{{ item.host }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="启用" min-width="100">
            <el-select v-model="detailFormData.status" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.label" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Tags" min-width="100">
            <el-select v-model="detailFormData.need_tag" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in need_tag_dict" :key="item.label" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit_page = false">取 消</el-button>
        <el_button_wait type="primary" @click="editSubmitConfirm()">确 定</el_button_wait>
      </div>
    </el-dialog>

    <el-dialog title="批量查询" :visible.sync="show_batch_search_page" :close-on-click-modal="false" width="45%">
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
        <el-button type="info" @click="show_batch_search_page=false">取 消</el-button>
        <el-button type="primary" @click="batchSearchConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>


<script>
  import {
    getZabbixHostList, getGroupsProxiesTemplates, deleteZabbixHost, batchDeleteZabbixHost,
    createZabbixHost, updateZabbixHost, testExpression, zabbixCurdBatchChangeStatus
  } from '@/api/zabbix/zabbix_curd'
  import Pagination from '@/components/Pagination'
  import {parseTime} from "../../utils";
  import {accountGetIpList} from '@/api/cmdb'
  import {validIp, validSpecialChar, validFuncName} from '@/utils/validate'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";

  export default {
    components: {Pagination, el_button_wait},
    mixins: [sessionListQuery],
    data() {
      return {
        show_batch_search_page: false,
        page: 1,
        limit: 20,
        all_groups: [],
        all_proxies: [],
        all_templates: [],
        password_type: 'password',
        selected_rows: [],
        total: 0,
        ipList: [],
        table_data_list: [],
        detailFormData: {},
        batchUpdateForm: {},
        show_add_page: false,
        show_edit_page: false,
        show_batch_edit_page: false,

        people: '',
        roles: [],
        DbCategoryDict: [{value: 'Oracle', label: 'Oracle', port: 1521}, {value: 'Mysql', label: 'Mysql', port: 3306}],
        confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'},
        listQuery: {page: 1, limit: 20, name: null, status: null, ip_list: null},
        active_dict: [{value: '0', label: '启用'}, {value: '1', label: '禁用'}],
        need_tag_dict: [{value: true, label: '是'}, {value: false, label: '否'}],
        listLoading: true,
        rules_add: {
          ip: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validIPList, trigger: 'blur'}],
          port: [{required: true, message: '必填项', trigger: 'blur'}],
          template: [{required: true, message: '必填项', trigger: 'blur'}],
        },
        rules2: {
          ip_list: [
            {required: true, message: '必填项', trigger: 'blur'},
            {validator: this.validIPList, trigger: 'blur'}
          ],
        },
      }
    },
    created() {
      if (this.$route.params.name) {
        this.listQuery.name = this.$route.params.name
      }
      getGroupsProxiesTemplates().then(res => {
        this.all_groups = res['groups'];
        this.all_templates = res['templates'];
        this.all_proxies = res['proxies'];
        this.all_proxies.push({host: "空", proxyid: "0"})
      });
      this.getList();
      this.getIpList();
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;

    },
    mounted() {

    },
    filters: {
      formatTime(value) {
        let v = value.replace('T', ' ');
        v = v.substring(0, v.length - 7);
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
      batchSearchConfirm() {
        console.log(this.listQuery.ip_list)
        this.$refs['dialogSearch'].validate((valid) => {
          if (valid) {
            this.getList()
            this.show_batch_search_page = false
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      },
      validIPList(rule, value, callback) {
        for (let item of value.split(/[,\s]+/).wh_drop_null()) {
          if (validIp(item.wh_strip())) {
            // callback()
          } else {
            return callback(new Error('格式错误。多ip以回车，空格，或逗号分隔'))
          }
        }
        callback()
      },
      handleBatchSearch() {
        // 打开批量搜索框
        this.listQuery.ip_list = null
        this.show_batch_search_page = true
      },
      resourceIdClick(resource_id) {
        this.$router.push({name: "ResourceManage", params: {id: resource_id}})
      },
      batchChangeStatus(status) {
        let msg = status === 0 ? '确定启用吗?' : '确定禁用吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          let row_list = this.selected_rows.map(x => x.hostid)
          row_list = row_list.toString();
          console.log(row_list);
          zabbixCurdBatchChangeStatus({status: status, pks: row_list}).then((response) => {
              if (response.success) {
                this.$message({title: '成功', message: response.success, type: 'success', duration: 3000});
              } else {
                this.$message({title: '失败', message: response.error, type: 'error', duration: 3000})
              }
              this.getList()
            }
          );
        })
      },
      handleSizeChange(val) {
        this.limit = val
      },
      handleCurrentChange(val) {
        this.page = val
      },
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
          + '函数: count, sum, avg, max, min<br/>';
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
        this.initBatchUpdateForm();
        this.show_batch_edit_page = true
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;

      },
      initForm() {
        this.detailFormData = {
          host_name: '', visible_name: '', ip: '', port: '20063', status: '0',
          template: ["10284"], host_group: [], proxy: "10319", need_tag: true
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
          createZabbixHost(this.detailFormData).then(response => {
            if (response['error']) {
              this.$notify({title: '失败', message: response['error'], type: 'warning', duration: 5000});
            } else if (response['success']) {
              this.$notify({title: '成功', message: response['success'], type: 'success', duration: 5000});
              this.show_add_page = false;
              this.getList()
            } else if (response['warning']) {
              this.$notify({title: '成功', message: response['warning'], type: 'warning', duration: 5000});
              this.show_add_page = false;
              this.getList()
            }
          })
        } else {
          this.$message({message: '表单填写有误', type: 'warning'});
          return false
        }
      },
      editSubmitConfirm() {
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          updateZabbixHost(this.detailFormData, this.detailFormData.hostid).then(response => {
            if (response['error']) {
              this.$notify({title: '失败', message: response['error'], type: 'warning', duration: 5000});
            } else {
              this.$notify({title: '成功', message: '提交成功', type: 'success', duration: 3000});
              this.show_edit_page = false;
              this.getList()
            }
          })
        } else {
          this.$message({message: '表单填写有误', type: 'warning'});
          return false
        }
      },
      addNew() {
        this.initForm();
        this.show_add_page = true;
      },
      fillUpForm(row) {
        this.initForm();
        this.detailFormData.hostid = row.hostid;
        this.detailFormData.visible_name = row.name;
        this.detailFormData.host_name = row.host;
        this.detailFormData.ip = row.ip;
        this.detailFormData.port = row.port;
        this.detailFormData.status = row.status;
        this.detailFormData.host_group = row.group_ids;
        this.detailFormData.template = row.template_ids;
        this.detailFormData.proxy = row.proxy_hostid;
        this.detailFormData.need_tag = row.tags !== '';
        this.detailFormData.interface_ids = row.interface_ids;
      },
      editOld(row) {
        this.fillUpForm(row);
        this.show_edit_page = true;
        this.password_type = 'password';
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteZabbixHost(row.hostid).then((response) => {
              if (response.success) {
                this.$message({title: '成功', message: response.success, type: 'success', duration: 3000});
              } else {
                this.$message({title: '失败', message: response.error, type: 'error', duration: 3000})
              }
              this.getList()
            }
          );
        })
      },
      batchDelete() {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          let row_list = this.selected_rows.map(x => x.hostid)
          row_list = row_list.toString();
          console.log(row_list);
          batchDeleteZabbixHost({pks: row_list}).then((response) => {
              if (response.success) {
                this.$message({title: '成功', message: response.success, type: 'success', duration: 3000});
              } else {
                this.$message({title: '失败', message: response.error, type: 'error', duration: 3000})
              }
              this.getList()
            }
          );
        })
      },
      getList() {
        this.listLoading = true;
        getZabbixHostList(this.listQuery).then(response => {
          this.table_data_list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 15)
          this.listQuery.ip_list = null
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
        this.listQuery = {page: 1, limit: 20, ip_list: null}
      },
    }
  }
</script>

