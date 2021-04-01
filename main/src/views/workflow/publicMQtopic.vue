<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
        <h5 style="text-align:center;color:#606266">所有的资源成本将计入项目或团队成本</h5> <br>
      </el-col>
    </div>

    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="180px" class="newAppForm"
               style="width:100%">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="申请类型" prop="steplinestatus" required>
              <el-radio v-model="newAppForm.steplinestatus" label="0">新增Topic</el-radio>
              <el-radio v-model="newAppForm.steplinestatus" label="1">已有Topic新增consumer</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="产品线" prop="project_name_list" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">如未找到应用，请提交“新应用申请单”
                  </div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                应用名
              </label>
              <el-cascader expand-trigger="hover"
                          :options="projectOptions"
                          v-model="newAppForm.project_name_list"
                          filterable
                          clearable
                          :filter-method="filterMethod"
                          style="width:100%;"
                          placeholder="请选择产品线及应用名">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="需求描述" prop="needdesc" required>
              <el-input v-model="newAppForm.needdesc" type="textarea" placeholder="请填写需求描述" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="平均消息大小(单位:/kb)" prop="messagekb">
              <!-- <el-input v-model.trim="newAppForm.messagekb" placeholder="请输入平均消息大小"></el-input> -->
              <el-input-number v-model.trim="newAppForm.messagekb" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="消息量(单位:条/天)" prop="message">
              <!-- <el-input v-model.trim="newAppForm.message" placeholder="请输入消息量"></el-input> -->
              <el-input-number v-model.trim="newAppForm.message" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="高峰消息量(单位:条/秒)" prop="high">
              <!-- <el-input v-model.trim="newAppForm.high" placeholder="请输入高峰消息量"></el-input> -->
              <el-input-number v-model.trim="newAppForm.high" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="是否使用mqcloud" prop="is_mqcloud">
              <el-switch v-model="newAppForm.is_mqcloud"
                active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="主题名称" prop="topicname">
              <el-input v-model="newAppForm.topicname" placeholder="请输入 组名-业务名" @blur="topicnameinput"><span slot="append">-topic</span></el-input>
              <!-- <el-autocomplete v-model="newAppForm.topicname" :fetch-suggestions="querySearch"
                               placeholder="请输入 组名-业务名" @select="topicnameselect" @blur="topicnameinput" style="width:100%">
                <span slot="append" v-if="newAppForm.topicnames==''">-topic</span>
                <template slot-scope="{ item }">
                  <div>{{ item.value }}</div>
                </template>
              </el-autocomplete> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="生产者名称" prop="topicnamep">
              <el-input v-model="newAppForm.topicnamep" placeholder="请输入 组名-业务名"><span slot="append">-topic-producer</span></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='1'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="主题名称" prop="topicname1">
              <el-select v-model="newAppForm.topicname1" filterable clearable placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in mqtopicnameOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="消费者名称" prop="topicnamec1">
              <el-input v-model="newAppForm.topicnamec1" placeholder="请输入 组名-业务名"><span slot="append">-topic-consumer</span></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="消费者名称" prop="topicnamec">
              <el-input v-model="newAppForm.topicnamec" placeholder="请输入 组名-业务名"><span slot="append">-topic-consumer</span></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="用途说明" prop="usedesc" required>
              <el-input v-model="newAppForm.usedesc" type="textarea" maxlength="200" placeholder="请输入用途说明"
                        :autosize="{ minRows: 1, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="告警阈值" prop="alarm">
              <el-input v-model="newAppForm.alarm" placeholder="默认延迟5分钟统一告警">
                <el-select v-model="newAppForm.alarm_type" slot="append" style="width: 90px;">
                  <el-option label="条" value="条"/>
                  <el-option label="分钟" value="分钟"/>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="告警联系人" prop="owner">
              <el-select v-model="newAppForm.owner" filterable clearable multiple :multiple-limit="5" placeholder="请输入工号/姓名" style="width: 100%;">
                <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="期望时间" prop="expecteddate" required>
              <el-date-picker
                v-model="newAppForm.expecteddate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable=false
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 1, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='1'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="期望时间" prop="expecteddate" required>
              <el-date-picker
                v-model="newAppForm.expecteddate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable=false
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="用途说明" prop="usedesc" required>
              <el-input v-model="newAppForm.usedesc" type="textarea" maxlength="200" placeholder="请输入用途说明"
                        :autosize="{ minRows: 1, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus =='1'">
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="目的IP">
              <el-button type="primary" @click="dialogVisibledip = true,Diplist = ''">批量添加目的IP</el-button>
              <span style="color: red;">如需访问ip为10.5或10.6网段的机器，需开通内网防火墙，请填写该区域</span>
              <el-dialog title="批量添加目的ip" :visible.sync="dialogVisibledip" width="30%" :before-close="diplistclose">
                <el-input v-model="Diplist" type="textarea" :autosize="{ minRows: 2, maxRows: 15}" placeholder="请输入IP列表,以英文逗号或回车分隔"/>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="diplistclose">取 消</el-button>
                  <el-button type="primary" @click="handleClosedip">确 定</el-button>
                </span>
              </el-dialog>
              <el-table :data="newAppForm.Dip">
                <el-table-column prop="project_name_list" label="应用名" align="center" min-width="7">
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
                    <span v-if="scope.row.status == 3||scope.row.status == 4">
                      {{scope.row.project_name_list[3]}}
                    </span>
                    <span v-else>
                      <el-form-item :prop="'Dip.' + scope.$index + '.project_name_list'">
                        <el-cascader expand-trigger="hover"
                                     :options="dipprojectOptions"
                                     v-model="scope.row.project_name_list"
                                     filterable
                                     :show-all-levels="false"
                                     style="width:100%;"
                                     placeholder="请选择产品线及应用名"
                                     @change="vmDipList(scope.row)">
                        </el-cascader>
                      </el-form-item>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="env" label="环境" align="center" min-width="3">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 3||scope.row.status == 4">
                      {{scope.row.env}}
                    </span>
                    <span v-else>
                      <el-form-item :prop="'Dip.' + scope.$index + '.env'">
                        <el-select v-model="scope.row.env" style="width: 100%;" @change="vmDipList(scope.row)">
                          <el-option label="生产" value="生产"/>
                          <el-option label="UAT" value="UAT"/>
                          <el-option label="SIT" value="SIT"/>
                        </el-select>
                      </el-form-item>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="Dip" label="IP地址" align="center" min-width="7">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 3||scope.row.status == 4">
                      {{scope.row.dip[0]}}
                    </span>
                    <span v-else>
                      <el-form-item :prop="'Dip.' + scope.$index + '.dip'">
                        <el-select
                          v-model="scope.row.dip"
                          filterable
                          clearable
                          multiple
                          placeholder="请输入IP地址"
                          style="width: 100%;">
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
                <!-- <el-table-column prop="ip" label="IP地址"  align="center" min-width="4">
                  <template slot-scope="scope">
                    <el-form-item :prop="'Dip.' + scope.$index + '.ip'" :rules="{message: '请输入正确的IP地址',trigger: 'blur',validator: validateIpaddress,}" required>
                      <el-input v-model.trim="scope.row.ip" placeholder="请输入目的ip"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column> -->
                <el-table-column prop="port" label="端口" align="center" min-width="7">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 4">
                      {{scope.row.port}}
                    </span>
                    <span v-else>
                      <el-form-item :prop="'Dip.' + scope.$index + '.port'"
                                    :rules="{message: '多端口以英文逗号分隔',trigger: 'blur',validator: validatePort,}">
                        <el-input v-model.trim="scope.row.port" placeholder="多端口以英文逗号分隔"></el-input>
                      </el-form-item>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="2">
                  <template slot-scope="scope">
                    <!-- <el-button type="primary" icon="el-icon-plus" v-if="scope.row.status == 1" circle
                               @click="addDip(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" v-else circle
                               @click="removeDip(scope.row)"></el-button> -->
                    <el-button type="danger" icon="el-icon-delete" circle v-if="scope.row.status !== 4"
                               @click="removeDip(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item>
              <el-upload
                class="upload-demo"
                action="/dev-api/workflow/workflow_upload_file_first"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleChange"
                :before-upload="beforeUpload"
                multiple
                :limit="10"
                :on-exceed="handleExceed"
                :file-list="newAppForm.fileList">
                <el-button size="small" type="primary">上传附件</el-button>
                <div slot="tip" class="el-upload__tip"><span style="color: red;">*</span> 请上传附件，且单个文件不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row> -->
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
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,getfirewalldip,getdipProductAppCascader,get_mqtopicname} from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import { getProductAppCascader} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
import {validIp} from '@/utils/validate'
import {getUserInfo} from '@/api/zabbix/user_info'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";

export default {
  name: 'AppApplyForm',
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    const validatenumer = (rule, value, callback) => {
      if (value) {
        if (/^[0-9]+$/.test(value)) {
          callback()
        } else {
          this.newAppForm.alarm = ''
          callback(new Error('请输入数字'))
        }
      } else {
        callback()
      }
    }
    return {
      validatePort: (rule, value, callback) => {
        if (value) {
          if (/^(([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]),)*([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value)) {
            callback()
          } else {
            callback(new Error('port填写不正确'))
          }
        } else {
          callback()
        }
      },
      aDetail:{},
      projectOptions:[],
      dipprojectOptions:[],
      // infooptions:[],
      userOptions:[],
      mqtopicnameOptions:[],
      dialogVisibledip: false,
      buttondisabled:false,
      help_doc_url:'',
      Diplist: '',
      isIpList:/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])[\n,])*(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      newAppForm: {
        steplinestatus:'0',
        project_name_list:[],
        app_name:'',
        app_cname:'',
        app_id:'',
        expecteddate: '',
        needdesc:'',
        desc: '',
        message:undefined,
        messagekb:undefined,
        high:undefined,
        // fileList:[],
        is_mqcloud: "0",
        topicname:'',
        // topicnames:'',
        topicnamep:'',
        topicnamec:'',
        topicname1:'',
        topicnamec1:'',
        usedesc:'',
        owner:[],
        alarm:'',
        alarm_type:'分钟',
        // Diplist: '',
        Dip: [],
        routeParams: '',
      },
      listQuerydip: {
        ip_list: '',
        app_id: undefined,
        resource_env:undefined
      },
      dippubilc:['10.6.110.194','10.6.110.206','10.6.110.207','10.6.110.208','10.6.110.192','10.6.110.189','10.6.110.190','10.6.110.191'],
      dipconf: {
        project_name_list: [],
        app_id: '',
        app_cname: '',
        app_name: '',
        env: '生产',
        dip: [],
        port: '',
        status: 1,
        total: 0,
        tableData: [],
      },
      // dipconfadd: {
      //   project_name_list: [],
      //   app_id: '',
      //   app_cname: '',
      //   app_name: '',
      //   env: '生产',
      //   dip: [],
      //   port: '',
      //   status: 1,
      //   total: 0,
      //   tableData: [],
      // },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now() + 86400000 * 2
        }
      },
      rules: {
        steplinestatus:[{ required: true, message: '请选择申请类型', trigger: 'change' },],
        project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
        needdesc:[{ required: true, message: '请输入需求描述', trigger: 'change' },],
        messagekb:[{ required: true, message: '请输入平均消息大小', trigger: 'blur' },],
        message:[{ required: true, message: '请输入消息量', trigger: 'blur' },],
        high:[{ required: true, message: '请输入高峰消息量', trigger: 'blur' },],
        topicname:[{ required: true, message: '请输入 组名-业务名', trigger: 'change' },],
        topicnamep:[{ required: true, message: '请输入 组名-业务名', trigger: 'change' },],
        topicnamec:[{ required: true, message: '请输入 组名-业务名', trigger: 'change' },],
        topicname1:[{ required: true, message: '请选择', trigger: 'change' },],
        topicnamec1:[{ required: true, message: '请输入 组名-业务名', trigger: 'change' },],
        usedesc:[{ required: true, message: '请输入用途说明', trigger: 'blur' },],
        alarm:[{ message: '请输入数字', trigger: 'blur', validator:validatenumer},],
        owner:[{ required: true, message: '请添加告警联系人', trigger: 'change' },],
        // desc:[{ required: true, message: '请输入备注描述', trigger: 'blur' },],
      }
    }
  },
  watch:{
    "newAppForm.project_name_list": function(newValue, oldValue) {
      this.newAppForm.app_id = this.newAppForm.project_name_list[3]
    },
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
    this.newAppForm.expecteddate = this.initDate(3);
    this.newAppForm.Dip.push(this.dipconf);
    getProductAppCascader().then(response => {
      this.projectOptions = response
    })
    getdipProductAppCascader().then(response => {
      this.dipprojectOptions = response
    });
    getUserInfo().then(response => {
      this.userOptions = response
    });
    get_mqtopicname().then(response => {
      this.mqtopicnameOptions = response
    });
    if(this.$route.params.detailData_edit){
      this.renderDraftsData()
    }else{
      this.adddippubilc()
    }
  },
  methods: {
    renderDraftsData() {
      if(this.$route.params.detailData_edit){
        this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
        this.renderDraftsData1();
      }
    },
    renderDraftsData1() {
      try {
        this.newAppForm.steplinestatus = this.aDetail.steplinestatus
        this.newAppForm.project_name_list = this.aDetail.project_name_list
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        this.newAppForm.app_name = this.aDetail.app_name
        this.newAppForm.app_cname = this.aDetail.app_cname
        this.newAppForm.expecteddate = this.aDetail.expecteddate
        this.newAppForm.needdesc = this.aDetail.needdesc
        this.newAppForm.desc = this.aDetail.desc
        this.newAppForm.message = this.aDetail.message
        this.newAppForm.messagekb = this.aDetail.messagekb
        this.newAppForm.high = this.aDetail.high
        this.newAppForm.is_mqcloud = this.aDetail.is_mqcloud
        this.newAppForm.topicname = this.aDetail.topicname
        // this.newAppForm.topicnames = this.aDetail.topicnames
        this.newAppForm.topicnamep = this.aDetail.topicnamep
        this.newAppForm.topicnamec = this.aDetail.topicnamec
        this.newAppForm.topicname1 = this.aDetail.topicname1
        this.newAppForm.topicnamec1 = this.aDetail.topicnamec1
        this.newAppForm.usedesc = this.aDetail.usedesc
        this.newAppForm.alarm = this.aDetail.alarm
        this.newAppForm.alarm_type = this.aDetail.alarm_type
        this.newAppForm.owner = this.aDetail.owner
        this.newAppForm.Dip = this.aDetail.Dip
        // this.newAppForm.fileList = this.aDetail.fileList
      } catch (error) {
        // TODO 异常情况如何处理
        console.log(this.$route.params.detailData_edit)
      }
    },
    // MQ主题
    // querySearch(queryString, cb) {
    //   var restaurants = this.mqtopicnameOptions;
    //   var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
    //   // 调用 callback 返回建议列表的数据
    //   cb(results);
    // },
    // createFilter(queryString) {
    //   return (restaurant) => {
    //     return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    //   };
    // },
    // topicnameselect(){
    //   this.newAppForm.topicnames = this.newAppForm.topicname
    //   this.newAppForm.topicnamep = ''
    //   this.newAppForm.topicnamec = ''
    // },
    topicnameinput(){
      // this.newAppForm.topicnames = ''
      this.newAppForm.topicnamep = this.newAppForm.topicname
      this.newAppForm.topicnamec = this.newAppForm.topicname
    },
    // 修改草稿提交、或者再次保存草稿，都是update数据
    submitEditForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if(this.newAppForm.fileList.length !==0){
          fetchAppInfo(this.newAppForm.app_id).then(response => {
            this.newAppForm.app_name = response.app_name
            this.newAppForm.app_cname = response.app_cname
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
          // }
          // else{
          //   this.$message({
          //     message: '请上传附件',
          //     type: 'warning',
          //   })
          //   return false
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if(this.newAppForm.fileList.length !==0){
            fetchAppInfo(this.newAppForm.app_id).then(response => {
              this.newAppForm.app_name = response.app_name
              this.newAppForm.app_cname = response.app_cname
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
            })
          // }
          // else{
          //   this.$message({
          //     message: '请上传附件',
          //     type: 'warning',
          //   })
          //   return false
          // }
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if(this.newAppForm.fileList.length !==0){
            fetchAppInfo(this.newAppForm.app_id).then(response => {
              this.newAppForm.app_name = response.app_name
              this.newAppForm.app_cname = response.app_cname
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
            })
          // }
          // else{
          //   this.$message({
          //     message: '请上传附件',
          //     type: 'warning',
          //   })
          //   return false
          // }
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
        // this.newAppForm.fileList = []
        this.newAppForm = this.$options.data().newAppForm;
        var object={}
        object.id = this.$route.params.id
        object.name = this.$route.params.name
        this.newAppForm.routeParams = object
        this.newAppForm.expecteddate = this.initDate(3);
        this.newAppForm.Dip = [];
        this.adddippubilc()
        // this.newAppForm.Dip.push(this.$options.data().dipconfadd);
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
      })
    },
    // addDip() {
    //   const dipconf = Object.assign({}, this.dipconfadd)
    //   dipconf.status = 2
    //   this.newAppForm.Dip.push(dipconf)
    // },
    removeDip(item) {
      var index = this.newAppForm.Dip.indexOf(item)
      if (index !== -1) {
        this.newAppForm.Dip.splice(index, 1)
      }
    },
    getDip(results){
      // this.newAppForm.Dip = []
      // const dipconf = Object.assign({}, this.dipconfadd)
      // this.newAppForm.Dip.push(dipconf)
      for (const i of results) {
        this.newAppForm.Dip.push({
          project_name_list:[i.app.split('/')[0],i.app.split('/')[1],i.app.split('/')[2],i.app.split('/')[3]],
          env:i.resource_env.split('环')[0],
          dip:[i.ip],
          status:3,
          tableData:[],
        })
      }
      this.diplistclose()
    },
    arrdiff(all,ip_list){
      var have = []
      for (const i of ip_list) {
        have.push(i.ip)
      }
      // 比较两数组不同
      return all.concat(have).filter(function(v, i, arr) {        return arr.indexOf(v) === arr.lastIndexOf(v);    });
    },
    handleClosedip(done) {
      if (this.Diplist !== '') {
        if (this.isIpList.test(this.Diplist)) {
          this.resetlistQuerydip()
          // this.$confirm('若ip没有关联应用,将无法匹配信息,请联系管理员').then(_ => {
            // done();
            // 全部\n替换为英文逗号
            var reg = new RegExp( '\n' , "g" )
            this.listQuerydip.ip_list = this.Diplist.replace( reg , ',' );
            var ipnoapp = []
            getfirewalldip(this.listQuerydip).then(response => {
              ipnoapp = this.arrdiff(this.listQuerydip.ip_list.split(','),response)
              if (ipnoapp.length !== 0) {
                this.$alert('以下ip没有关联应用,将无法匹配信息,请联系管理员:<br>'+String(ipnoapp).replace( new RegExp( ',' , "g" ) , '<br/>' ),
                {dangerouslyUseHTMLString: true,customClass:'firewall_myalert'}).then(_ => {}).catch(_ => {});
              }
              this.getDip(response)
            })
          // })
          // .catch(_ => {});
        } else{
          this.$message({
            message: '请输入IP列表,以英文逗号或回车分隔',
            type: 'warning',
          })
          return false
        }
      } else{
        this.diplistclose()
      }
    },
    adddippubilc(){
      this.resetlistQuerydip()
      this.listQuerydip.ip_list = String(this.dippubilc)
      getfirewalldip(this.listQuerydip).then(response => {
        this.newAppForm.Dip = []
        // const dipconf = Object.assign({}, this.dipconfadd)
        // this.newAppForm.Dip.push(dipconf)
        for (const i of response) {
          if (i.ip == '10.6.110.207'||i.ip == '10.6.110.208') {
            this.newAppForm.Dip.unshift({
              project_name_list:[i.app.split('/')[0],i.app.split('/')[1],i.app.split('/')[2],i.app.split('/')[3]],
              env:i.resource_env.split('环')[0],
              dip:[i.ip],
              status:4,
              tableData:[],
              port:'10985,10935,10933,10983,9876'
            })
          } else{
            this.newAppForm.Dip.unshift({
              project_name_list:[i.app.split('/')[0],i.app.split('/')[1],i.app.split('/')[2],i.app.split('/')[3]],
              env:i.resource_env.split('环')[0],
              dip:[i.ip],
              status:4,
              tableData:[],
              port:'10985,10935,10933,10983'
            })
          }

        }
        // this.dialogVisibledip = false
      })
    },
    resetlistQuerydip(){
      this.listQuerydip =  {
        ip_list: '',
        app_id: undefined,
        resource_env:undefined
      }
    },
    diplistclose(){
      this.dialogVisibledip = false
    },
    vmDipList(row){
      this.resetlistQuerydip()
      row.app_id = row.project_name_list[3]
      this.listQuerydip.app_id = row.app_id
      if ( this.listQuerydip.app_id == undefined) {
        return
      }
      row.tableData = []
      row.dip = []
      //环境
      if ( row.env == '生产') {
        this.listQuerydip.resource_env = '生产环境'
      } else if ( row.env == 'SIT') {
        this.listQuerydip.resource_env = 'SIT环境'
      } else if ( row.env == 'UAT') {
        this.listQuerydip.resource_env = 'UAT环境'
      } else{
        this.listQuerydip.resource_env = ''
      }
      getfirewalldip(this.listQuerydip).then(response => {
        const tableData = []
        for (const i of response) {
          tableData.push({
            ip: i.ip
          })
        }
        // 合并为一个数组
        row.tableData = row.tableData.concat(tableData)
      })
    },
    getHelpDoc() {
      // getHelpDocContent({board:'workflow',title:'新建申请单-'+ this.$route.params.name}).then(response => {
      //   this.$router.push({name:"help_doc_preview", params: {content: response.content}})
      // })
      this.$router.push('/'+this.help_doc_url.split('/')[2])
    },
    filterMethod(node, keyword){
      keyword = keyword.toLowerCase() // 搜索关键字转为小写
      const { text, path } = node;
      // return text.includes(keyword) || path.includes(keyword);
      return text.toLowerCase().includes(keyword)
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    //   this.newAppForm.fileList = []
    //   this.newAppForm.fileList = fileList
    //   console.log(this.newAppForm.fileList)
    // },
    // handlePreview(file) {
    //   console.log(file);
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    // },
    // beforeRemove(file, fileList) {
    //   if (file.status == 'ready') {
    //     return
    //   }
    //   return this.$confirm(`确定移除 ${ file.name }？`);
    // },
    // handleChange(response, file, fileList) {
    //   console.log(file, fileList);
    //   this.newAppForm.fileList = []
    //   this.newAppForm.fileList = fileList
    //   console.log(this.newAppForm.fileList)
    // },
    // beforeUpload(file){
    //   const isLt5M = file.size / 1024 / 1024 < 5
    //   if(!isLt5M) {
    //     this.$message({
    //       message: '上传文件大小不能超过 5MB!',
    //       type: 'error'
    //     });
    //     return false;
    //   }
    //   return isLt5M
    // }
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
</style>
<style>
  /* 不能用scoped */
  .firewall_myalert p {
    max-height: 300px;
    overflow: auto;
  }
</style>
