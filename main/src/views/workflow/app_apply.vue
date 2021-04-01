<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
      </el-col>
    </div>
    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm" style="width:100%">
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="应用英文名" prop="app_name" required>
              <el-input v-model.trim="newAppForm.app_name" minlength="3" maxlength="100" @change="appnameonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="应用中文名" prop="app_cname" required>
              <el-input v-model.trim="newAppForm.app_cname" minlength="3" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="产品线" prop="project_name" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">如未找到，请联系管理员</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>产品线
              </label>
              <el-cascader expand-trigger="hover" :options="projectOptions" v-model="newAppForm.project_name"
                           filterable style="width: 100%;" @change="projectChange"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="所属项目" prop="pool_name">
              <el-select
                v-model="newAppForm.pool_name"
                placeholder="项目名(如果没有请联系管理员录入)"
                filterable
                clearable
                class="filter-item"
                :disabled="disabledPool"
                style="width: 100%;">
                <el-option v-for="item in poolOptions"
                  :key="'('+item.key+')'+item.display_name"
                  :label="'('+item.key+')'+item.display_name"
                  :value="'('+item.key+')'+item.display_name"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="应用等级" prop="app_level" required>
              <el-select v-model="newAppForm.app_level" popper-class="app-search-class" style="width: 100%;">
                <el-option label="A(影响核心系统应用)" value="A"/>
                <el-option label="B(影响用户体验应用）" value="B"/>
                <el-option label="C(不影响用户使用应用)" value="C"/>
                <el-option label="D(内部应用)" value="D"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="开发语言" prop="app_lang" required>
              <el-select v-model="newAppForm.app_lang" style="width: 100%;">
                <el-option v-for="item in langOption"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="开发架构" prop="app_arch" required>
              <el-select v-model="newAppForm.app_arch" style="width: 100%;">
                <el-option label="Struts" value="Struts" />
                <el-option label="springboot" value="springboot" />
                <el-option label="springmvc" value="springmvc" />
                <el-option label="jdbc" value="jdbc" />
                <el-option label="vue" value="vue" />
                <el-option label="other" value="other" />
                <el-option label="null" value="null" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="应用类型" prop="app_type" required>
              <el-select v-model="newAppForm.app_type" style="width: 100%;">
                <el-option v-for="item in appTypeOption"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="应用负责人" prop="owner" required>
              <el-select
                v-model="newAppForm.owner"
                filterable
                clearable
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="运维人员" prop="ops_user" required>
              <el-select
                v-model="newAppForm.ops_user"
                filterable
                clearable
                multiple
                :multiple-limit="2"
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="开发维护人" prop="maintain_user" required>
              <el-select
                v-model="newAppForm.maintain_user"
                filterable
                multiple
                :multiple-limit="3"
                clearable
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="集成发布" prop="is_jicheng">
              <el-switch v-model="newAppForm.is_jicheng"
                active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <!-- <el-form-item label="星图监控名" prop="xt_name"
            :rules="newAppForm.is_xt==1?[{required: true,message: '请输入星图监控名'},{min: 3,max: 100,message: '长度在 3 到 100 个字符'}]:{required: false}">
              <el-input v-model.trim="newAppForm.xt_name" minlength="3" maxlength="100" :disabled="newAppForm.is_xt==0?true:false">
                <el-switch v-model="newAppForm.is_xt" slot="prepend"
                  active-text="是" inactive-text="否" active-value="1" inactive-value="0" @change="newAppForm.xt_name = ''">
                </el-switch>
              </el-input>
            </el-form-item> -->
            <el-form-item label="是否接入星图" prop="xt_name" v-if="newAppForm.is_xt==1"
            :rules="[{required: true,message: '请输入星图监控名'},{min: 3,max: 100,message: '长度在 3 到 100 个字符'}]">
              <el-input v-model.trim="newAppForm.xt_name" minlength="3" maxlength="100" placeholder="请输入星图监控名">
                <el-switch v-model="newAppForm.is_xt" slot="prepend"
                  active-text="是" inactive-text="否" active-value="1" inactive-value="0" @change="newAppForm.xt_name = ''">
                </el-switch>
              </el-input>
            </el-form-item>
            <el-form-item label="是否接入星图" prop="xt_reason" v-else :rules="{required: true,message: '请输入不接入原因'}">
              <el-input v-model.trim="newAppForm.xt_reason" placeholder="请输入不接入原因">
                <el-switch v-model="newAppForm.is_xt" slot="prepend"
                  active-text="是" inactive-text="否" active-value="1" inactive-value="0" @change="newAppForm.xt_reason = ''">
                </el-switch>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="是否高可用" prop="is_available">
              <el-switch v-model="newAppForm.is_available"
                active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="健康检查URL" prop="health_url">
              <el-input v-model.trim="newAppForm.health_url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <!-- <el-form-item label="应用描述" prop="app_desc">
              <el-input v-model="newAppForm.app_desc" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
            </el-form-item> -->
            <el-form-item label="代码仓库" prop="git_addr">
              <!-- <el-input v-model.trim="newAppForm.git_addr"></el-input> -->
              <el-autocomplete class="inline-input" v-model.trim="newAppForm.git_addr" :fetch-suggestions="((queryString,cb)=>{querySearchGit(queryString,cb)})"
                placeholder="请输入或选择代码仓库" style="width:100%" :disabled="gitaddrdisabled">
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="包名" prop="BaoName" :rules="{required:true,message:'请输入包名',trigger:'change'}">
              <el-input v-model.trim="newAppForm.BaoName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="编译配置路径" prop="build_path" v-if="newAppForm.git_addr">
              <el-input v-model.trim="newAppForm.build_path"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="应用描述" prop="app_desc">
              <el-input v-model="newAppForm.app_desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
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
                <div slot="tip" class="el-upload__tip">可上传附件，且单个文件不超过5M</div>
              </el-upload>
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
  import {fetchProjectCList,fetchAppListP} from '@/api/cmdb'
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,get_gitaddr} from '@/api/workflow/app_manage'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {fetchUserInfo,appValidation} from '@/api/cmdbs/app_manage'
  import { getPoolProduct } from '@/api/cmdb'
  import {getUserInfo} from '@/api/zabbix/user_info'
  import { getProductCascader,getProjectGitaddr,getFieldsAlias,getProjectname } from '@/api/cmdbs/product_line'
  import { getHelpDocContent } from '@/api/management/help_doc'

  const lange = [
    {key: 'java', display_name: 'java'},
    {key: 'php',display_name: 'php'},
    {key: 'python',display_name: 'python'},
    {key: 'C++',display_name: 'C++'},
    {key: 'JS',display_name: 'JS'},
    {key: 'go',display_name: 'go'},
    {key: '.net',display_name: '.net'},
    {key: 'other', display_name: 'other'},
  ]
  const appType = [
    {key: 'APPWEB',display_name: 'APPWEB'},
    {key: 'APPWAS',display_name: 'APPWAS'},
    {key: 'tomcat',display_name: 'tomcat'},
    {key: 'jar',display_name: 'jar'},
    {key: 'was',display_name: 'was'},
    {key: 'Job',display_name: 'Job'},
    {key: 'Nginx',display_name: 'Nginx'},
    {key: '.NET',display_name: '.NET'},
    {key: 'RocketMQ',display_name: 'RocketMQ'},
    {key: 'Kafka',display_name: 'Kafka'},
    {key: 'ZK',display_name: 'ZK'},
    {key: 'Dubbo',display_name: 'Dubbo'},
    {key: 'ES',display_name: 'ES'},
    {key: 'File',display_name: 'File'},
    {key: 'MongoDB',display_name: 'MongoDB'},
    {key: 'MySQL',display_name: 'MySQL'},
    {key: 'Oracle',display_name: 'Oracle'},
    {key: 'HotDB',display_name: 'HotDB'},
    {key: 'Redis',display_name: 'Redis'},
    {key: 'other',display_name: 'other'},
  ]
  //TODO 这个需要对表进行重新设计，因为存在一次申请多个应用的服务器的情况，系统版本可能也需要拉下来，这个针对windows 需要有特殊设置
  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      const validateNoChinese=(rule, value, callback) => {
        if (value) {
          //不能有中文字符
          if (/[\u4E00-\u9FA5]/g.test(value)) {
            callback(new Error('不能有中文字符!'))
          } else {
            // callback()
            //应用名唯一
            appValidation({app_name: value}).then(response => {
              if (response.status == 400) {
                callback(new Error(response.msg))
              } else if (response.status == 200) {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      }
      return {
        langOption: lange,
        appTypeOption: appType,
        disabledPool: true,
        buttondisabled:false,
        gitaddrdisabled:false,
        help_doc_url:'',
        projectOptions: [],
        aDetail:{},
        poolOptionsA: [],
        poolOptions: [],
        userOptions: [],
        fields_alias:[],
        newAppForm: {
          project_name: [],
          project_cname: '',
          pool_name: '',
          app_name: '',
          app_cname: '',
          app_desc: '',
          app_level: '',
          app_arch: '',
          app_lang: '',
          app_type: '',
          maintain_user: [],
          is_available: "1",
          is_xt:"1",
          xt_name:'',
          xt_reason:'',
          health_url:'',
          BaoName:'',
          git_addr:'',
          build_path:'',
          is_jicheng:"0",
          owner: '',
          ops_user: [],
          desc: '',
          fileList: [],
          routeParams: '',
        },
        rules: {
          app_name: [{required: true,message: '请输入应用英文名'},{min: 3,max: 100,message: '长度在 3 到 100 个字符'},{validator: validateNoChinese}],
          app_cname: [{required: true,message: '请输入应用中文名'},{min: 3,max: 100,message: '长度在 3 到 100 个字符'},],
          project_name: [{ type: 'array', required: true, message: '请选择产品线', trigger: 'change' }],
          app_level:[{ required: true, message: '请选择应用等级', trigger: 'blur' },],
          app_lang:[{ required: true, message: '请选择开发语言', trigger: 'blur' },],
          app_arch:[{ required: true, message: '请选择开发架构', trigger: 'blur' },],
          app_type:[{ required: true, message: '请选择应用类型', trigger: 'blur' },],
          owner:[{ required: true, message: '请选择应用负责人', trigger: 'change' },],
          maintain_user:[{ required: true, message: '请选择开发维护人', trigger: 'change' },],
          ops_user:[{ required: true, message: '请选择运维人员', trigger: 'change' },],
          // xt_name: [{required: true,message: '请输入星图监控名'},{min: 3,max: 100,message: '长度在 3 到 100 个字符'},],
        },
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
      getPoolProduct().then(response => {
        this.poolOptionsA = response
        this.getpooloption()
      });
      getUserInfo().then(response => {
        this.userOptions = response
      });
      getProductCascader().then(response => {
        this.projectOptions = response
      });
      get_gitaddr().then(response => {
        this.gitarray = response
      });
      getFieldsAlias().then(response => {
        this.fields_alias = response
      })
      this.renderDraftsData()
    },
    methods: {
      // 渲染草稿数
      renderDraftsData() {
        if(this.$route.params.detailData_edit){
          this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
          this.renderDraftsData1();
        }
      },
      renderDraftsData1() {
        try {
          this.newAppForm.project_name = this.aDetail.project_name
          this.newAppForm.project_cname = this.aDetail.project_cname
          this.disabledPool = true
          this.newAppForm.pool_name = this.aDetail.pool_name
          this.newAppForm.app_name = this.aDetail.app_name
          this.newAppForm.app_cname = this.aDetail.app_cname
          this.newAppForm.app_desc = this.aDetail.app_desc
          this.newAppForm.app_level = this.aDetail.app_level
          this.newAppForm.app_arch = this.aDetail.app_arch
          this.newAppForm.app_lang = this.aDetail.app_lang
          this.newAppForm.maintain_user = this.aDetail.maintain_user
          this.newAppForm.app_type = this.aDetail.app_type
          this.newAppForm.owner = this.aDetail.owner
          this.newAppForm.ops_user = this.aDetail.ops_user
          this.newAppForm.is_available = this.aDetail.is_available
          this.newAppForm.is_xt = this.aDetail.is_xt
          this.newAppForm.xt_name = this.aDetail.xt_name
          this.newAppForm.xt_reason = this.aDetail.xt_reason
          this.newAppForm.health_url = this.aDetail.health_url
          this.newAppForm.BaoName = this.aDetail.BaoName
          this.newAppForm.git_addr = this.aDetail.git_addr
          this.newAppForm.build_path = this.aDetail.build_path
          this.newAppForm.is_jicheng = this.aDetail.is_jicheng
          this.newAppForm.desc = this.aDetail.desc
          this.newAppForm.fileList = this.aDetail.fileList
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
        }
      },
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.buttondisabled = true
            addWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
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
              message: '请填写必要的字段和内容',
              type: 'warning',
            })
            return false
          }
        })
      },
      getpooloption(){
        if(this.$route.params.detailData_edit){
          this.projectChange(this.newAppForm.project_name)
          this.newAppForm.pool_name = this.aDetail.pool_name
        }
      },
      resetForm(formName) {
        const sessionData = sessionStorage.getItem(this.sessionKey)
        if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
          this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
          this.renderDraftsData1()
          this.getpooloption()
        }else{
          this.newAppForm.fileList = []
          this.$refs[formName].resetFields()
          this.disabledPool = true;
          this.newAppForm.is_xt = '1'
        }
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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

      // 首次保存草稿,为新增数据，只校验英文名是否填写
      saveDraftsForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
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
          }else {
            this.$message({
              message: '请填写必要的标题和内容',
              type: 'warning',
            })
            return false
          }
        })
      },
      appnameonly(){
        if (this.newAppForm.app_name !== '' && this.newAppForm.project_name.length !== 0) {
          // console.log(this.newAppForm.app_name)
          // console.log(this.newAppForm.project_name)
          //产品线id+应用中文名查询
          fetchAppListP({app_name:this.newAppForm.app_name,project_name:this.newAppForm.project_name[2]}).then(response => {
            if (response.count == 0) {
              return
            } else{
              //已存在的话，清空应用名
              this.$message({
                message: '该产品线下已有应用'+this.newAppForm.app_name,
                type: 'warning',
              })
              this.newAppForm.app_name = ''
            }
          })
        }
      },
      projectChange(choose) {
        this.disabledPool = false;
        this.newAppForm.pool_name = undefined;
        this.newAppForm.project_cname = choose[2];
        //取产品线大部门
        choose = choose[0].split('-')[0];
        this.poolOptions = this.poolOptionsA[choose]
        if (this.poolOptions) {
        } else {
          this.poolOptions = []
          this.disabledPool = true
        }
        this.appnameonly()
        getProjectGitaddr(this.newAppForm.project_cname).then(response => {
          this.newAppForm.git_addr = response.git_addr || ''
          if (response.git_addr) {
            this.gitaddrdisabled = true
          } else{
            this.gitaddrdisabled = false
            getProjectname(this.newAppForm.project_cname).then(response => {
              var levelone = response.project.split('/')[0].split('-')[0]
              var leveltwo = response.project.split('/')[0].split('-')[1]
              var levelthree = response.project.split('/')[1]
              var levelfour = response.project.split('/')[2]
              if (this.fields_alias[1][levelone]&&this.fields_alias[2][leveltwo]&&this.fields_alias[3][levelthree]&&this.fields_alias[4][levelfour]) {
                this.newAppForm.git_addr = 'https://git.yto.net.cn/'+this.fields_alias[1][levelone]+'/'+this.fields_alias[2][leveltwo]+'/'+this.fields_alias[3][levelthree]+'/'+this.fields_alias[4][levelfour]+'.git'
              } else{
                this.newAppForm.git_addr = ''
              }
            })
          }
        });
      },
      querySearchGit(queryString, cb) {
        var gitarray = [];
        for (var i = 0; i < this.gitarray.length; i++) {
          gitarray.push({'value': this.gitarray[i]})
        }
        var results = queryString ? gitarray.filter(this.createFilter(queryString)) : gitarray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) { //模糊匹配
        return (data) => {
          return data.value.toLowerCase().match(queryString.toLowerCase());
        };
      },
      getHelpDoc() {
        // getHelpDocContent(({board:'workflow',title:'新建申请单-'+this.$route.params.name})).then(response => {
        //   this.$router.push({name:"help_doc_preview", params: {content: response.content}})
        // })
        this.$router.push('/'+this.help_doc_url.split('/')[2])
      },
      handleRemove(file, fileList) {
        this.newAppForm.fileList = []
        this.newAppForm.fileList = fileList
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (file.status == 'ready') {
          return
        }
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleChange(response, file, fileList) {
        this.newAppForm.fileList = []
        this.newAppForm.fileList = fileList
      },
      beforeUpload(file){
        const isLt5M = file.size / 1024 / 1024 < 5
        if(!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      }
    },
  }
</script>
<style lang="scss" scoped>
  .app-search-class {
    max-width: 300px;
  }

  .config_os > label {
    padding-right: 1px;
  }

  .help-svg-pointer:hover {
    cursor: pointer;
  }
  a{
    color: #1890ff;
  }
</style>
