<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item prop="type">
        <el-select v-model="listQuery.type" placeholder="项目类型" style="width: 100%" @change="handleFilter" clearable>
          <el-option v-for="item in appOptions" :label="item.type" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model.trim="listQuery.nodeconf" placeholder="请选择分组名" filterable
                   @change="handleFilter" clearable class="filter-item" style="width: 250px">
          <el-option v-for="item in nodeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model.trim="listQuery.triggersconf" placeholder="请选择报警名"
                   @change="handleFilter" filterable clearable class="filter-item" style="width: 250px">
          <el-option v-for="item in select1" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model.trim="listQuery.phone_num" placeholder="告警联系人" filterable clearable class="filter-item"
                   style="width: 250px">
          <el-option v-for="item in all_user_list" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      <el-button class="filter-item" type="primary" @click="dialogInsertVisible=true" v-if="adminrole" icon="el-icon-plus">新增</el-button>
      <el-button-group style="margin-left: 20px">
        <el-button v-if="true" :disabled="selected_rows.length===0"
                   class="filter-item" type="success" @click="addContactsClick">添加联系人
        </el-button>
        <el-button v-if="true" :disabled="selected_rows.length===0"
                   class="filter-item" type="warning" @click="deleteContactsClick">去除联系人
        </el-button>
      </el-button-group>
    </el-form>


    <el-table v-loading="listLoading" :data="cardData" @selection-change="handleSelectionChange"
              border stripe highlight-current-row>
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column label="项目类型" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分组名" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.node_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警类型" min-width="100" prop="alarm_type" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarm_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警名" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trigger }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮件列表" min-width="100" v-if="false">
        <template slot-scope="scope">
          <span>{{ scope.row.mail_list }}</span>
        </template>
      </el-table-column>
      <el-table-column label="短信列表" min-width="130" align="center">
        <template slot-scope="scope">
          <span v-html="scope.row.sms_name.replace(/,/g, '<br/>')"></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">启用</span>
          <span v-if="scope.row.status === 1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" min-width="120" prop="modfiy_time" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.modfiy_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" align="center" v-if="adminrole">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="复制新增" placement="top">
            <el-button type="success" icon="el-icon-plus" circle @click="copyAddClick(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getClustersInf"/>


    <el-dialog title="新增信息" :visible.sync="dialogInsertVisible" width="500px">
      <el-form ref="dataForm" :model="clusterInsert" :rules="rules" label-width="90px">
        <!-- <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="分组名" prop="nodeconf">
          <el-select v-model.trim="clusterInsert.nodeconf" placeholder="请选择分组名" filterable clearable class="filter-item" style="width: 100%"
                     @change="search">
            <el-option v-for="item in nodeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警名" prop="triggersconf">
          <el-select v-model.trim="clusterInsert.triggersconf" placeholder="请选择报警名" filterable clearable class="filter-item" style="width: 100%">
            <el-option v-for="item in select1" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
         <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="告警方式" prop="alarm_type">
          <el-select v-model.trim="clusterInsert.alarm_type" placeholder="请选择报警类型" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->

        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="短信列表" prop="sms_list">
          <el-select v-model.trim="clusterInsert.sms_list" placeholder="请选择联系人电话" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.display_name"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="显示名字" prop="cname">
            <el-input v-model.trim="clusterInsert.cname" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="状态" prop="status">
          <el-select v-model.trim="clusterInsert.status" placeholder="请选择状态" filterable clearable class="filter-item" style="width: 100%">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
         <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="钉钉URL" prop="dingding_url" v-if="clusterInsert.alarm_type.indexOf('dingding') !== -1">
          <!-- <el-input v-model.trim="clusterInsert.dingding_url" type="text" style="width: 100%"/> -->
          <el-select v-model.trim="clusterInsert.dingding_url" placeholder="请选择钉钉联系人" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in dingOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
         <el-col :md="24" :lg="12" :xl="12">
           <el-form-item label="电话列表" prop="phone_list">
             <el-input v-model.trim="clusterInsert.phone_list" type="text" auto-complete="off" style="width: 100%"/>
           </el-form-item>
         </el-col>
         <el-col :md="24" :lg="24" :xl="24"> -->
        <el-form-item label="备注" prop="comments">
          <el-input type="text" v-model.trim="clusterInsert.comments" style="width: 100%"></el-input>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="邮件列表" min-width="100" prop="mail_list">
            <el-input v-model.trim="clusterInsert.mail_list" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInsertVisible=false">取 消</el-button>
        <el-button type="primary" @click="addConfirm()">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="修改信息" :visible.sync="dialogVisible" width="500px">
      <el-form ref="editForm" :model="clusterEdit" :rules="rules" label-width="90px">
        <!-- <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="分组名" prop="nodeconf">
          <el-select v-model.trim="clusterEdit.nodeconf" placeholder="请选择分组名" filterable clearable class="filter-item" style="width: 100%"
                     @change="search">
            <el-option v-for="item in nodeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警名" prop="triggersconf">
          <el-select v-model.trim="clusterEdit.triggersconf" placeholder="请选择报警名" filterable clearable class="filter-item" style="width: 100%">
            <el-option v-for="item in select1" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="告警方式" prop="alarm_type">
          <el-select v-model.trim="clusterEdit.alarm_type" placeholder="请选择报警类型" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->

        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="短信列表" prop="sms_list">
          <el-select v-model.trim="clusterEdit.sms_list" placeholder="请选择联系人电话" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.display_name"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="显示名字" prop="cname">
          <el-input v-model.trim="clusterEdit.cname" type="text" style="width: 100%"/>
            </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="状态" prop="status">
          <el-select v-model.trim="clusterEdit.status" placeholder="请选择状态" filterable clearable class="filter-item" style="width: 100%">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="钉钉URL" prop="dingding_url" v-if="clusterEdit.alarm_type.indexOf('dingding') !== -1">
          <!-- <el-input v-model.trim="clusterEdit.dingding_url" type="text" style="width: 100%"/> -->
          <el-select v-model.trim="clusterInsert.dingding_url" placeholder="请选择钉钉联系人" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in dingOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="电话列表" prop="phone_list">
            <el-input v-model.trim="clusterEdit.phone_list" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="24" :xl="24"> -->
        <el-form-item label="备注" prop="comments">
          <el-input type="text" v-model.trim="clusterEdit.comments" style="width: 100%"></el-input>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="邮件列表" min-width="100" prop="mail_list">
            <el-input v-model.trim="clusterEdit.mail_list" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editUserConf()">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="复制新增" :visible.sync="show_copy_add_dialog" width="500px">
      <el-form ref="editForm" :model="clusterEdit" :rules="rules" label-width="90px">
        <!-- <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="分组名" prop="nodeconf">
          <el-select v-model.trim="clusterEdit.nodeconf" placeholder="请选择分组名" filterable clearable class="filter-item" style="width: 100%"
                     @change="search">
            <el-option v-for="item in nodeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警名" prop="triggersconf">
          <el-select v-model.trim="clusterEdit.triggersconf" placeholder="请选择报警名" filterable clearable class="filter-item" style="width: 100%">
            <el-option v-for="item in select1" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="告警方式" prop="alarm_type">
          <el-select v-model.trim="clusterEdit.alarm_type" placeholder="请选择报警类型" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->

        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="短信列表" prop="sms_list">
          <el-select v-model.trim="clusterEdit.sms_list" placeholder="请选择联系人电话" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.display_name"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="显示名字" prop="cname">
          <el-input v-model.trim="clusterEdit.cname" type="text" style="width: 100%"/>
            </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="状态" prop="status">
          <el-select v-model.trim="clusterEdit.status" placeholder="请选择状态" filterable clearable class="filter-item" style="width: 100%">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12"> -->
        <el-form-item label="钉钉URL" prop="dingding_url" v-if="clusterEdit.alarm_type.indexOf('dingding') !== -1">
          <!-- <el-input v-model.trim="clusterEdit.dingding_url" type="text" style="width: 100%"/> -->
          <el-select v-model.trim="clusterInsert.dingding_url" placeholder="请选择钉钉联系人" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in dingOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="电话列表" prop="phone_list">
            <el-input v-model.trim="clusterEdit.phone_list" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="24" :xl="24"> -->
        <el-form-item label="备注" prop="comments">
          <el-input type="text" v-model.trim="clusterEdit.comments" style="width: 100%"></el-input>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="邮件列表" min-width="100" prop="mail_list">
            <el-input v-model.trim="clusterEdit.mail_list" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <!--        <el-button type="primary" @click="editUserConf()">确 定</el-button>-->
        <el-button type="primary" @click="copyAddConfirm">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="添加联系人" :visible.sync="show_add_contact_dialog" width="500px">
      <el-form ref="addContactForm" :model="clusterEdit" :rules="rules" label-width="90px">

        <el-form-item label="短信列表" prop="sms_list">
          <el-select v-model.trim="add_contact_list" placeholder="请选择联系人电话" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.display_name"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show_add_contact_dialog=false">取 消</el-button>
        <el-button type="primary" @click="addContactsConfirm">确 定</el-button>
      </span>

    </el-dialog>


    <el-dialog title="去除联系人" :visible.sync="show_delete_contact_dialog" width="500px">
      <el-form ref="deleteContactForm" :model="clusterEdit" :rules="rules" label-width="90px">

        <el-form-item label="短信列表" prop="sms_list">
          <el-select v-model.trim="delete_contact_list" placeholder="请选择联系人电话" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in exist_sms_list" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.display_name"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show_delete_contact_dialog=false">取 消</el-button>
        <el-button type="primary" @click="deleteContactsConfirm">确 定</el-button>
      </span>

    </el-dialog>


  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {fetchAppTable} from '@/api/manage_monitor/manage'
  import {
    getAlarmUserConf, getNodeConf, getTriggersConf, addUserConf, editUserConf,
    deleteUserConf, aucAddContacts, aucDeleteContacts, getAllAlarmUsers
  } from '@/api/midmonitor/alarm'
  import {getUserConf} from '@/api/cmdb'
  import Pagination from '@/components/Pagination'
  import {mapGetters} from 'vuex'
  import axios from 'axios'
  import Qs from 'qs'

  export default {
    name: 'MqClusterConfig',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionListQuery],

    data() {
      return {
        all_user_list: [],
        exist_sms_list: [],
        add_contact_list: [],
        delete_contact_list: [],
        show_delete_contact_dialog: false,
        show_add_contact_dialog: false,
        selected_rows: [],
        appOptions: [],
        show_copy_add_dialog: false,
        listQuery: {page: 1, limit: 20,},
        dialogInsertVisible: false,
        dialogVisible: false,
        dialogVisibleConsole: false,
        consoleStatus: {},
        listLoading: false,
        adminrole: false,
        cardData: [],
        nodeOptions: [],
        triggerOptions: [],
        mobileOptions: [],
        dingOptions: [],
        select1: [],
        select2: [],
        total: 0,
        clusterInsert: {
          cname: '',
          nodeconf: '',
          triggersconf: '',
          alarm_type: ['sms'],
          mail_list: 'all',
          sms_list: '',
          phone_list: 'all',
          dingding_url: '',
          comments: '',
          status: 0,
          modify_user: ''
        },
        clusterEdit: {
          id: '',
          cname: '',
          nodeconf: '',
          triggersconf: '',
          alarm_type: '',
          mail_list: 'all',
          sms_list: '',
          phone_list: 'all',
          dingding_url: '',
          comments: '',
          status: '',
          modify_user: ''
        },
        types: [{value: 'dingding', label: '钉钉报警'}, {value: 'sms', label: '短信报警'}],
        status: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        rules: {
          nodeconf: [
            {required: true, message: '请选择分组名', trigger: 'blur'},
          ],
          alarm_type: [
            {required: true, message: '请输入报警类型', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'},
          ],
          sms_list: [
            {required: true, message: '请选择联系人电话', trigger: 'blur'}
          ],
        },
        checkbutton: true,
        multipleSelection: [],
        bulkHandleURLResult: []
      }
    },

    created() {
      this.getClustersInf();
      this.getNodeConfList();
      this.getTriggersConfList();
      this.getUserConfList();
      this.adminrole = this.roles.includes('admin')
      fetchAppTable().then(res => {
        this.appOptions = res
      });
      getAllAlarmUsers().then(res => {
        this.all_user_list = res
      });
    },

    computed: {
      ...mapGetters(['roles'])
    },

    filters: {
      row2MultipleRow(data) {
        let res = '';
        if (data) {
          for (let item of data.split(',')) {
            item += '\n';
            res += item
          }
        }
        return res
      }
    },

    methods: {
      addContactsClick() {
        this.add_contact_list = []
        this.show_add_contact_dialog = true;
      },
      deleteContactsClick() {
        this.delete_contact_list = []
        this.show_delete_contact_dialog = true;
        let sms_list = []
        this.selected_rows.forEach(item => sms_list = [...sms_list, ...item.sms_list.split(',')])
        let tmp = [...new Set(sms_list)]

        this.exist_sms_list = []
        this.mobileOptions.forEach(item => {
          // console.log(item.display_name.toString(),tmp)
          if (tmp.indexOf(item.display_name) !== -1) {
            this.exist_sms_list.push(item)
          }
        })
        console.log(this.exist_sms_list)
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      addContactsConfirm() {
        let selected_rows = []
        this.selected_rows.forEach(item => selected_rows.push(item.id))
        aucAddContacts({sms_list: this.add_contact_list, selected_rows: selected_rows}).then(res => {
          if (res.success) {
            this.$message({message: 'success', type: 'success'});
            this.show_add_contact_dialog = false;
            this.getClustersInf()
          }
        });
      },
      deleteContactsConfirm() {
        let selected_rows = []
        this.selected_rows.forEach(item => selected_rows.push(item.id))
        aucDeleteContacts({sms_list: this.delete_contact_list, selected_rows: selected_rows}).then(res => {
          if (res.success) {
            this.$message({message: 'success', type: 'success'});
            this.show_delete_contact_dialog = false;
            this.getClustersInf()
          }
        });
      },
      search(pro) {
        this.select1 = [];
        for (let i of this.triggerOptions) {
          if (pro === i.nodeconf) {
            this.select1.push(i)
          }
        }
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate(valid => {
          if (valid) {
            this.getClustersInf()
          }
        })
      },
      handleReset() {
        this.resetlistQuery();
        this.getClustersInf()
      },
      getClustersInf() {
        this.listLoading = true;
        getAlarmUserConf(this.listQuery).then(response => {
          this.cardData = response.results;
          this.total = response.count;
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getNodeConfList() {
        getNodeConf().then(response => {
          let nodeOption = [];
          for (let i of response) {
            nodeOption.push({
              display_name: i.node_name, key: i.id
            })
          }
          this.nodeOptions = nodeOption
        })
      },
      getTriggersConfList() {
        getTriggersConf().then(response => {
          this.triggerOptions = response.results;
          this.select1 = response.results
        })
      },
      getUserConfList() {
        getUserConf().then(response => {
          let mobileOption = [];
          let dingOption = [];
          for (let i of response) {
            mobileOption.push({
              display_name: i.mobile, key: i.user_name + i.uuid,
            });
            dingOption.push({
              display_name: i.user_name, key: i.uuid,
            })
          }
          this.mobileOptions = mobileOption;
          this.dingOptions = dingOption
        })
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          cname: undefined,
          nodeconf: undefined,
          triggersconf: undefined
        }
      },
      addConfirm() {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.clusterInsert.sms_list = String(this.clusterInsert.sms_list);
            this.clusterInsert.alarm_type = String(this.clusterInsert.alarm_type);
            addUserConf(this.clusterInsert).then(response => {
              this.$notify({
                title: '成功',
                message: '添加告警联系人信息成功',
                type: 'success',
                duration: 3000
              });
              this.getClustersInf()
            }).catch(error => {
              this.dialogInsertVisible = false;
              if (error.response.data.cluster_name == 'cluster config with this 集群名字 already exists.') {
                this.$notify({
                  title: '添加失败',
                  message: '该集群信息已存在，请勿重复添加',
                  type: 'error',
                  duration: 3000
                })
              }
            });
            this.dialogInsertVisible = false
          }
        })
      },

      copyAddConfirm() {
        this.$refs['editForm'].validate(valid => {
          if (valid) {
            this.clusterEdit.sms_list = String(this.clusterEdit.sms_list);
            this.clusterEdit.alarm_type = String(this.clusterEdit.alarm_type);
            addUserConf(this.clusterEdit).then(response => {
              this.$notify({
                title: '成功',
                message: '添加告警联系人信息成功',
                type: 'success',
                duration: 3000
              });
              this.getClustersInf()
            }).catch(error => {
              this.show_copy_add_dialog = false;
              if (error.response.data.cluster_name == 'cluster config with this 集群名字 already exists.') {
                this.$notify({
                  title: '添加失败',
                  message: '该集群信息已存在，请勿重复添加',
                  type: 'error',
                  duration: 3000
                })
              }
            });
            this.show_copy_add_dialog = false
          }
        })
      },

      fillUpForm(row) {
        this.clusterEdit.id = row.id;
        this.clusterEdit.alarm_type = row.alarm_type.split(',').map(x => String(x));
        this.clusterEdit.cname = row.cname;
        this.clusterEdit.comments = row.comments;
        this.clusterEdit.dingding_url = row.dingding_url;
        this.clusterEdit.mail_list = row.mail_list;
        this.clusterEdit.sms_list = row.sms_list.split(',').map(x => String(x));
        this.clusterEdit.phone_list = row.phone_list;
        this.clusterEdit.modify_user = row.modify_user;
        this.clusterEdit.status = row.status;
        this.clusterEdit.nodeconf = row.nodeconf;
        this.clusterEdit.triggersconf = row.triggersconf
      },
      copyAddClick(row) {
        this.show_copy_add_dialog = true;
        this.fillUpForm(row)
      },
      editOld(row) {
        this.dialogVisible = true;
        this.fillUpForm(row)
      },
      editUserConf() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.clusterEdit.sms_list = String(this.clusterEdit.sms_list);
            this.clusterEdit.alarm_type = String(this.clusterEdit.alarm_type);
            editUserConf(this.clusterEdit.id, this.clusterEdit).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              });
              this.getClustersInf()
            });
            this.dialogVisible = false
          } else {
            this.$message({
              message: '请填写必填项',
              type: 'warning'
            });
            return false
          }
        })
      },
      handleDelete(row) {
        let msg = '确定删除该应用详情吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteUserConf(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            });
            this.getClustersInf()
          })
        }, () => {
          return false
        })
      },
    }

  }
</script>

<style lang="scss" scoped>
  .pre_class {
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }

</style>
