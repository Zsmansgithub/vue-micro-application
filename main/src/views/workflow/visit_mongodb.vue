<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
        <br>
      </el-col>
    </div>

    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm"
               style="width:100%">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="客户端IP" required>
              <el-button type="primary" @click="dialogVisiblesip = true,Siplist = ''">批量添加客户端IP</el-button>
              <el-dialog title="批量添加客户端IP" :visible.sync="dialogVisiblesip" width="30%" :before-close="siplistclose">
                <el-input v-model="Siplist" type="textarea" :autosize="{ minRows: 2, maxRows: 15}" placeholder="请输入IP列表,以英文逗号或回车分隔"/>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="siplistclose">取 消</el-button>
                  <el-button type="primary" @click="handleClosesip">确 定</el-button>
                </span>
              </el-dialog>
              <div>
                <el-table :data="newAppForm.siptable">
                  <el-table-column prop="project_name_list" label="应用名"  align="center" min-width="7">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">应用名
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">
                            如未找到应用，请提交“新应用申请单”
                          </div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 3">
                        {{scope.row.project_name_list[0]}}/{{scope.row.project_name_list[1]}}/{{scope.row.project_name_list[2]}}/{{scope.row.app_name}}
                        <!-- {{scope.row.app_name}} -->
                      </span>
                      <span v-else>
                        <el-form-item :prop="'siptable.' + scope.$index + '.project_name_list'"
                        :rules="newAppForm.siptable[0].status == 3?{required:false}:{type:'array',required:true,message:'不能为空',trigger:'change'}">
                          <el-cascader expand-trigger="hover"
                                      :options="projectOptions"
                                      v-model="scope.row.project_name_list"
                                      filterable
                                      :filter-method="filterMethod"
                                      style="width:100%;"
                                      placeholder="请选择产品线及应用名"
                                      @change="vmIpList(scope.row)">
                          </el-cascader>
                        </el-form-item>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="env" label="环境"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 3">
                        {{scope.row.env}}
                      </span>
                      <span v-else>
                        <el-form-item :prop="'siptable.' + scope.$index + '.env'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                          <el-select v-model="scope.row.env" style="width: 100%;" @change="vmIpList(scope.row)">
                            <el-option label="生产" value="生产"/>
                            <el-option label="UAT" value="UAT"/>
                            <el-option label="SIT" value="SIT"/>
                          </el-select>
                        </el-form-item>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Sip" label="客户端IP"  align="center" min-width="9">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 3">
                        {{scope.row.Sip[0]}}
                      </span>
                      <span v-else>
                        <el-form-item :prop="'siptable.' + scope.$index + '.Sip'"
                        :rules="newAppForm.siptable[0].status == 3?scope.row.project_name_list.length==0?{required:false}:{type:'array',required:true,message:'不能为空',trigger:'change'}:{type:'array',required:true,message:'不能为空',trigger:'change'}">
                          <el-select
                            v-model="scope.row.Sip"
                            filterable
                            clearable
                            multiple
                            placeholder="请选择应用后,再选择IP地址"
                            style="width: 100%;"
                            @change='changeSelect(scope.row)'>
                            <el-checkbox v-model="scope.row.checked" @change='selectAll(scope.row)' style="text-align: right; width: 100%;padding-right: 20px;">全选</el-checkbox>
                            <el-option
                              v-for="item in scope.row.tableData"
                              :key="item.ip"
                              :label="item.ip"
                              :value="item.ip">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="windows机器" align="center" min-width="3">
                    <template slot-scope="scope">
                      {{String(scope.row.windows)}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <!-- <el-button type="text" icon="el-icon-plus" v-if="scope.row.status == 1||scope.row.status == 2" @click="addsip(scope.row)" :disabled="newAppForm.siptable.length>99">
                      </el-button><el-button type="text" icon="el-icon-delete" v-if="scope.row.status !== 1" style="color: red;" @click="removesip(scope.row)" /> -->
                      <el-button type="primary" icon="el-icon-plus" v-if="scope.row.status == 1||scope.row.status == 2" circle style="padding:2px;" @click="addsip(scope.row)" :disabled="newAppForm.siptable.length>99">
                      </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removesip(scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="申请原因" prop="needdesc" required>
              <el-input v-model="newAppForm.needdesc" type="textarea" placeholder="请填写申请原因" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="windows说明" prop="sipreason">
              <el-input v-model="newAppForm.sipreason" type="textarea" placeholder="若客户端IP有windows机器,请填写访问原因" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="开通时长" prop="time" required>
              <el-select v-model="newAppForm.time" popper-class="app-search-class" placeholder="请选择开通时长"
                         style="width: 100%;">
                <el-option label="永久" value="永久"/>
                <el-option label="临时" value="临时"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="newAppForm.time == '临时'" label="截止时间" prop="enddate" required>
              <el-date-picker
                v-model="newAppForm.enddate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable=false
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="数据库信息">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">最大支持15个数据库</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                数据库信息
              </label>
              <span style="color:red;">可勾选 表格中防火墙 "开通" 复选框，快速添加数据库集群</span>
              <div>
                <el-table :data="newAppForm.configinfo">
                  <el-table-column prop="db" label="数据库" align="center" min-width="7">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.db'" :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                        <el-cascader expand-trigger="hover"
                                    :options="dboptions"
                                    :props="{ multiple: true }"
                                    v-model="scope.row.db"
                                    filterable
                                    clearable
                                    style="width:100%;"
                                    @change="changemongodb(scope.row)">
                        </el-cascader>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="db_name" label="库名/Schema"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.db_name'"
                      :rules="[{type:'string',required:true,message:'不能为空',trigger:'blur'},{message: '输入错误',trigger: 'blur',validator: validatedb}]">
                        <el-input v-model="scope.row.db_name" placeholder="请输入库名/Schema" style="width: 100%;"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="table_name" label="表名"  align="center" min-width="4">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">表名
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">先选择all 或 other<br/>
                          默认为all，为所有表<br/>
                          选择other，需输入表名，多表名用英文逗号分隔
                          </div>
                        <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.table_name'"
                      :rules="scope.row.table == 'other'?[{type:'string',required:true,message:'不能为空',trigger:'blur'},{message: '多表名以英文逗号分隔',trigger: 'blur',validator: validatetable}]:{required:false}">
                        <el-input v-model="scope.row.table_name" placeholder="多表名,分隔" style="width: 100%;" class="myinput" :disabled="scope.row.table == 'other'?false:true">
                          <el-select v-model="scope.row.table" slot="prepend" style="width: 70px;" class="myselect2" @change="scope.row.table_name=''">
                            <el-option label="all" value="all"/>
                            <el-option label="other" value="other"/>
                          </el-select>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="user_name" label="用户名"  align="center" min-width="3">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">用户名
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">只能填一个用户名<br/>
                          可使用 英文小写a-z 数字0-9 下划线_<br/>
                          以英文小写字母开头，不能有空格
                          </div>
                        <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <!-- <el-form-item :prop="'configinfo.' + scope.$index + '.user_name'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}"> -->
                      <el-form-item :prop="'configinfo.' + scope.$index + '.user_name'"
                      :rules="[{type:'string',required:true,message:'不能为空',trigger:'blur'},{message: '输入错误',trigger: 'blur',validator: validateuser}]">
                        <el-input v-model="scope.row.user_name" placeholder="请输入用户名" style="width: 100%;"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="permissions" label="权限"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.permissions'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                        <el-select v-model="scope.row.permissions" clearable style="width: 100%;">
                          <el-option label="ReadOnly" value="ReadOnly"/>
                          <el-option label="ReadWrite" value="ReadWrite"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="网络" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-button type="success" style="padding:2px;" :disabled="scope.row.db.length==0?true:false" @click="$refs.childMethod.setdbcluster('mongodb',scope.row.db)">
                        <div>开通<br />防火墙</div>
                      </el-button>
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="firewall_Open" label="防火墙"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.firewall_Open'">
                        <el-checkbox v-model="scope.row.firewall_Open" style="width: 100%;" :disabled="scope.row.db.length==0?true:false"
                        @change="$refs.childMethod.setdbcluster('mongodb',scope.row.db,scope.row.firewall_Open)">开通</el-checkbox>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <!-- <el-button type="primary" icon="el-icon-plus" v-if="scope.row.status == 1" circle @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>4"/>
                      <el-button type="danger" icon="el-icon-delete" v-else circle @click="removeDomain(scope.row)" /> -->
                      <!-- <el-button type="text" icon="el-icon-plus" @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>14">
                      </el-button><el-button type="text" icon="el-icon-delete" v-if="scope.row.status !== 1" style="color: red;" @click="removeDomain(scope.row)" /> -->
                      <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;" @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>14">
                      </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removeDomain(scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <firewallForm ref="childMethod" @FormData="getnewAppForm" @fatherMethod="fatherMethod"></firewallForm>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="saveDraftsForm('newAppForm')" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :loading="buttondisabled">保存草稿</el-button>
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="submitForm('newAppForm')" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :loading="buttondisabled">提交草稿</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchAppInfo } from '@/api/cmdbs/app_manage'
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,getphysical,getIpList } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import { getProductAppCascader} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
import {fetchIPList} from '@/api/cmdb'
import {getmongodb,getwindowslist} from '@/api/zabbix'
import firewallForm from './components/firewallForm' //内网防火墙目的端 表单 子组件

export default {
  name: 'AppApplyForm',
  components: {firewallForm},
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    // const validatedb=(rule, value, callback) => {
    //   if (value) {
    //     if (/^[0-9A-Za-z_]+$/.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('库名填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    // const validatetable=(rule, value, callback) => {
    //   if (value) {
    //     if (/^([0-9A-Za-z_]+[,])*([0-9A-Za-z_]+)$/.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('表名填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    // const validateuser=(rule, value, callback) => {
    //   if (value) {
    //     if (/^[a-z][a-z0-9_]+$/.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('用户名填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    return {
      validatedb:(rule, value, callback) => {
        if (value) {
          if (/^[0-9A-Za-z_]+$/.test(value)) {
            callback()
          } else {
            callback(new Error('库名填写不正确'))
          }
        } else {
          callback()
        }
      },
      validatetable:(rule, value, callback) => {
        if (value) {
          if (/^([0-9A-Za-z_]+[,])*([0-9A-Za-z_]+)$/.test(value)) {
            callback()
          } else {
            callback(new Error('表名填写不正确'))
          }
        } else {
          callback()
        }
      },
      validateuser:(rule, value, callback) => {
        if (value) {
          if (/^[a-z][a-z0-9_]+$/.test(value)) {
            callback()
          } else {
            callback(new Error('用户名填写不正确'))
          }
        } else {
          callback()
        }
      },
      dialogVisiblesip:false,
      aDetail:{},
      projectOptions:[],
      dboptions:[],
      tableData:[],
      windowslist:[],
      buttondisabled:false,
      help_doc_url:'',
      Siplist:'',
      isIpList:/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])[\n,])*(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      newAppForm: {
        onORoff:'',
        steplinestatus:'',
        eslist:[],
        mqlist:[],
        mysqllist:[],
        oraclelist:[],
        mongodblist:[],
        redislist:[],
        elselist:[],
        dtable:[],

        app_name:'',
        // Siplist:'',
        siptable:[],
        time:'临时',
        enddate:'',
        sipreason:'',
        needdesc:'',
        desc: '',
        configinfo:[],
        routeParams: '',
      },
      siptableadd: {
        project_name_list: [],
        app_id: '',
        app_cname:'',
        app_name:'',
        env: '生产',
        Sip:[],
        windows:[],
        status:1,
        total:0,
        tableData:[],
        checked: false,
      },
      configinfodictadd: {
        db:[],
        // type:'',
        firewall_Open:false,
        db_name:'',
        table:'other',
        table_name:'',
        user_name:'',
        permissions:'',
        status:1,
      },
      listQuery: {
        page: 1,
        limit: 20,
        app_id: undefined,
        resource_env:undefined
      },
      listQuery2: {
        ip_list: '',
      },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now()
        }
      },
      rules: {
        // desc:[{ required: true, message: '请输入备注描述', trigger: 'blur' },],
        time:[{ required: true, message: '请输入开通时长', trigger: 'blur' },],
        needdesc:[{ required: true, message: '请输入申请原因', trigger: 'blur' },],
      }
    }
  },
  created() {
    if(!this.newAppForm.routeParams || !this.newAppForm.routeParams.id || !this.newAppForm.routeParams.name) {
      this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
        this.$router.push('/workflow/app_manage');
      })
    }
    this.$route.params.id = this.$route.params.id || this.newAppForm.routeParams.id
    this.$route.params.name = this.$route.params.name || this.newAppForm.routeParams.name
    this.$route.params.uuid = this.$route.params.uuid || this.newAppForm.routeParams.uuid
    // 判断跳转时获取的ID，在根据id渲染
    if (this.$route.params.id) {
      getWFLine(this.$route.params.id).then(response => {
        if(response.status==1){
          this.$router.push('/404')
        }
        this.help_doc_url = response.help_url
      })
    }
    this.newAppForm.enddate = this.initDate(30);
    this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
    this.newAppForm.siptable.push(Object.assign({}, this.siptableadd))
    getProductAppCascader().then(response => {
      this.projectOptions = response
    })
    getmongodb().then(response => {
      this.dboptions = response
    })
    getwindowslist().then(response => {
      this.windowslist = response.windows_list
    });
    this.renderDraftsData()
  },
  methods: {
    renderDraftsData() {
      if(this.$route.params.detailData_edit){
        this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
        this.renderDraftsData1();
      }
    },
    renderDraftsData1(){
      try {
        this.newAppForm.siptable = this.aDetail.siptable
        this.newAppForm.time = this.aDetail.time
        this.newAppForm.enddate = this.aDetail.enddate
        this.newAppForm.needdesc = this.aDetail.needdesc
        this.newAppForm.configinfo = this.aDetail.configinfo
        this.newAppForm.sipreason = this.aDetail.sipreason
        this.newAppForm.desc = this.aDetail.desc
        this.$nextTick(() => {
          this.$refs.childMethod.setnewAppForm(this.aDetail)
        })
      } catch (error) {
        // TODO 异常情况如何处理
        console.log(this.$route.params.detailData_edit)
      }
    },
    addsip() {
      const siptable = Object.assign({}, this.siptableadd)
      siptable.status = 2
      this.newAppForm.siptable.push(siptable)
    },
    removesip(item) {
      var index = this.newAppForm.siptable.indexOf(item)
      if (index !== -1) {
        this.newAppForm.siptable.splice(index, 1)
      }
    },
    selectAll(row) {
      row.Sip = []
      if (row.checked) {
        row.tableData.map((item) => {
          row.Sip.push(item.ip)
        })
        row.windows = []
        for (var i = 0; i < row.Sip.length; i++) {
          if (this.windowslist.indexOf(row.Sip[i])!==-1) {
            row.windows.push(row.Sip[i])
          }
        }
      } else {
        row.Sip = []
        row.windows = []
      }
    },
    changeSelect(row) {
      row.windows = []
      for (var i = 0; i < row.Sip.length; i++) {
        if (this.windowslist.indexOf(row.Sip[i])!==-1) {
          row.windows.push(row.Sip[i])
        }
      }
      if (row.Sip.length === row.tableData.length) {
        row.checked = true
      } else {
        row.checked = false
      }
    },
    addDomain() {
      const configinfo = Object.assign({}, this.configinfodictadd)
      configinfo.status = 2
      this.newAppForm.configinfo.push(configinfo)
    },
    removeDomain(item) {
      var index = this.newAppForm.configinfo.indexOf(item)
      if (index !== -1) {
        this.newAppForm.configinfo.splice(index, 1)
      }
    },
    changemongodb(row){
      if (row.db.length !== 0) {
        // 找到第一级
        var firstarray = []
        for (var i = 0; i < row.db.length; i++) {
          if (firstarray.indexOf(row.db[i][0]) == -1) {
            firstarray.push(row.db[i][0])
          }
        }
        // 全选
        row.db = []
        for (var i = 0; i < this.dboptions.length; i++) {
          if (firstarray.indexOf(this.dboptions[i].label) !== -1) {
            for (var j = 0; j < this.dboptions[i].children.length; j++) {
              var array = []
              array[0] = this.dboptions[i].label
              array[1] = this.dboptions[i].children[j].label
              row.db.push(array)
            }
          }
        }
      } else{
        row.firewall_Open=false
      }
    },
    fatherMethod(){
      for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
        this.newAppForm.configinfo[i].firewall_Open = false
      }
    },
    windows(){
      if (this.newAppForm.sipreason == '') {
        var windows_ip = []
        for (var i = 0; i < this.newAppForm.siptable.length; i++) {
          windows_ip = windows_ip.concat(this.newAppForm.siptable[i].windows)
        }
        if (windows_ip.length !== 0) {
          this.$message({
            message: '请填写windows说明',
            type: 'warning',
          })
          return false
        }
      }
    },
    // 修改草稿提交、或者再次保存草稿，都是update数据
    submitEditForm(formName, status) {
      if (this.windows()==false) {
        return false
      }
      if (this.$refs.childMethod.dtablerules()==false) {
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newAppForm.app_name = ''
          for (var i = 0; i < this.newAppForm.siptable.length; i++) {
            this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.siptable[i].app_name
            if ( i == 2&&i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name) {
              this.newAppForm.app_name = this.newAppForm.app_name + '……'
              break;
            }
            if(i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name){
              this.newAppForm.app_name = this.newAppForm.app_name + ','
            }
          }
          this.buttondisabled = true
          editWorkFlowConfRow(this.$route.params.uuid, this.newAppForm, status).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.buttondisabled = false
            // 修改完跳转至我的草稿页面
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
              this.$router.push('/workflow/workflow_list');
            })
          }).catch(error => {
            // if (error.response.data.path == 'url_check with this record already exists.') {
            //   this.$notify({
            //     title: '修改失败',
            //     message: '该记录已存在，请勿重复添加',
            //     type: 'error',
            //     duration: 3000
            //   })
            // }
          })
        } else {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning',
          })
          return false
        }
      })
    },

    // 保存草稿
    saveDraftsForm(formName) {
      if (this.windows()==false) {
        return false
      }
      if (this.$refs.childMethod.dtablerules()==false) {
        return false
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.newAppForm.app_name = ''
          for (var i = 0; i < this.newAppForm.siptable.length; i++) {
            this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.siptable[i].app_name
            if ( i == 2&&i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name) {
              this.newAppForm.app_name = this.newAppForm.app_name + '……'
              break;
            }
            if(i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name){
              this.newAppForm.app_name = this.newAppForm.app_name + ','
            }
          }
          this.buttondisabled = true
          saveDraftsWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
            this.$notify({
              title: '成功',
              message: '草稿保存成功',
              type: 'success',
              duration: 3000,
            })
            this.buttondisabled = false
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
              this.$router.push('/workflow/workflow_list');
            })
          }).catch(err => {
            // this.$message({
            //   message: err.errError,
            // })
            console.log(err)
          })
        } else {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning',
          })
          return false
        }
      })
    },
    submitForm(formName) {
      if (this.windows()==false) {
        return false
      }
      if (this.$refs.childMethod.dtablerules()==false) {
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newAppForm.app_name = ''
          for (var i = 0; i < this.newAppForm.siptable.length; i++) {
            this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.siptable[i].app_name
            if ( i == 2&&i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name) {
              this.newAppForm.app_name = this.newAppForm.app_name + '……'
              break;
            }
            if(i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name){
              this.newAppForm.app_name = this.newAppForm.app_name + ','
            }
          }
          this.buttondisabled = true
          addWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 3000
            })
            this.buttondisabled = false
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push('/workflow/workflow_list');
              })
          }).catch(err => {
            this.$notify({
              message: '提交异常！'
            })
          })
        } else {
          this.$message({
            message: '请填写必要的字段和内容',
            type: 'warning',
          })
          return false
        }
      })
    },
    resetForm(formName) {
      const sessionData = sessionStorage.getItem(this.sessionKey)
      if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
        this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
        this.renderDraftsData1()
      }else{
        this.$refs[formName].resetFields()
        this.newAppForm.siptable = [];
        this.newAppForm.siptable.push(Object.assign({}, this.siptableadd))
        this.tableData = [];
        this.newAppForm.enddate = this.initDate(30);
        this.newAppForm.configinfo = []
        this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))
        this.$refs.childMethod.resetForm()
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
      })
    },
    data(query,row){
      fetchIPList(query).then(response => {
        row.total=response.count
        const tableData = []
        for (const i of response.results) {
          tableData.push({
            ip: i.ip
          })
        }
        // 合并为一个数组
        row.tableData = row.tableData.concat(tableData)
        if( this.listQuery.page < row.total/20 )
        {
          this.listQuery.page++
          this.data(this.listQuery,row)
        }
        else
        {
          this.listQuery.page = 1
        }
      })
    },
    vmIpList(row){
      row.app_id = row.project_name_list[3]
      this.listQuery.app_id = row.app_id
      if ( this.listQuery.app_id == undefined) {
        return
      }
      fetchAppInfo(row.app_id).then(response => {
        row.app_name = response.app_name
        row.app_cname = response.app_cname
      })
      // console.log(row)
      row.tableData = []
      row.Sip = []
      //环境
      if ( row.env == '生产') {
        this.listQuery.resource_env = 1
      } else if ( row.env == 'SIT') {
        this.listQuery.resource_env = 2
      } else if ( row.env == 'UAT') {
        this.listQuery.resource_env = 4
      } else{
        this.listQuery.resource_env = undefined
      }
      row.checked = false
      this.data(this.listQuery,row)
    },
    arrdiff(all,ip_list){
      var have = []
      for (const i of ip_list) {
        have.push(i.ip)
      }
      // 比较两数组不同
      return all.concat(have).filter(function(v, i, arr) {        return arr.indexOf(v) === arr.lastIndexOf(v);    });
    },
    getSip(results){
      for (const i of results) {
        this.newAppForm.siptable.unshift({
          project_name_list:[i.project_name.split('_')[0]+'-'+i.project_name.split('_')[1],i.project_name.split('_')[2],i.subsystem_name,i.app_id],
          env:i.resource_env_name.split('环')[0],
          Sip:[i.ip],
          windows:this.windowslist.indexOf(i.ip)==-1?[]:[i.ip],
          app_owner:i.app_owner,
          status:3,
          app_name:i.app_name,
          app_id:i.app_id,
        })
      }
      this.siplistclose()
    },
    checkip(array){
      var app = []
      var noapp = []
      for (const i of array) {
        if (i.project_name) {
          app.push(i)
        } else{
          noapp.push(i.ip)
        }
      }
      return {app:app,noapp:noapp}
    },
    handleClosesip() {
      if(this.Siplist !== ''){
        if (this.isIpList.test(this.Siplist)) {
          // 全部\n替换为英文逗号
          var reg = new RegExp( '\n' , "g" )
          this.listQuery2.ip_list = this.Siplist.replace( reg , ',' );
          var length = this.listQuery2.ip_list.split(',').length
          var bailen = 100 - this.newAppForm.siptable.length
          if(length>bailen) {
            this.$message({
              message: '本次添加不能超过' + bailen + '个 !  当前已经 ' + length + '个 !',
              type: 'warning',
            })
            return false
          }
          var ipnoapp = []
          var ipdict = {}
          getIpList(this.listQuery2).then(response => {
            ipnoapp = this.arrdiff(this.listQuery2.ip_list.split(','),response)
            ipdict = this.checkip(response)
            ipnoapp = ipnoapp.concat(ipdict.noapp)
            if (ipnoapp.length !== 0) {
              this.$alert('以下ip没有关联应用,将无法匹配信息,请联系管理员:<br>'+String(ipnoapp).replace( new RegExp( ',' , "g" ) , '<br/>' ),
              {dangerouslyUseHTMLString: true,customClass:'firewall_myalert'}).then(_ => {}).catch(_ => {});
            }
            this.getSip(ipdict.app)
          })
        } else{
          this.$message({
            message: '请输入IP列表,以英文逗号或回车分隔',
            type: 'warning',
          })
          return false
        }
      } else {
        this.siplistclose()
      }
    },
    siplistclose(){
      this.dialogVisiblesip = false
    },
    getnewAppForm(data){
      this.newAppForm.steplinestatus = data.steplinestatus
      this.newAppForm.onORoff = data.onORoff
      this.newAppForm.eslist = data.eslist
      this.newAppForm.mqlist = data.mqlist
      this.newAppForm.mysqllist = data.mysqllist
      this.newAppForm.oraclelist = data.oraclelist
      this.newAppForm.mongodblist = data.mongodblist
      this.newAppForm.redislist = data.redislist
      this.newAppForm.elselist = data.elselist
      this.newAppForm.dtable = data.dtable
    },
    getHelpDoc() {
      this.$router.push('/'+this.help_doc_url.split('/')[2])
    },
    filterMethod(node, keyword){
      keyword = keyword.toLowerCase() // 搜索关键字转为小写
      const { text, path } = node;
      // return text.includes(keyword) || path.includes(keyword);
      return text.toLowerCase().includes(keyword)
    },
  }
}
</script>
<style lang="scss" scoped>
  .app-search-class {
    max-width: 500px;
  }
  .help-svg-pointer:hover {
    cursor: pointer;
  }
  a{
    color: #1890ff;
  }
  .myselect2{
    /deep/.el-input__inner {
      padding-left:5px;
      padding-right:25px;
    }
  }
  .myinput{
    /deep/.el-input__inner {
      padding-left:5px;
      padding-right:5px;
    }
  }
</style>
<style>
  /* 不能用scoped */
  .firewall_myalert p {
    max-height: 300px;
    overflow: auto;
  }
</style>
