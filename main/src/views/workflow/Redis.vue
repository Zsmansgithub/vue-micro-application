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
            <el-form-item label="产品线" prop="project_name_list" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">如未找到应用，请提交“新应用申请单”<br />共享型，可选任意一级
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
                          :props="{ checkStrictly: newAppForm.type=='共享型'?true:false }"
                          placeholder="请选择产品线及应用名"
                          @change="projectChange">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.type == '共享型' && newAppForm.project_name_list.length !== 4 && newAppForm.project_name_list.length !== 0">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="应用负责人" prop="appowner">
              <el-select v-model="newAppForm.appowner" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
                <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8" v-if="newAppForm.alreadyhave == 1">
            <el-form-item label="应用别名" prop="app_anothername">
              <el-input v-model.trim="newAppForm.app_anothername" minlength="3" maxlength="100" @change="appnameonly2()"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.project_name_list.length == 4 && newAppForm.alreadyhave == 1">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="应用别名" prop="app_anothername">
              <el-input v-model.trim="newAppForm.app_anothername" minlength="3" maxlength="100" @change="appnameonly2()"></el-input>
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
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="项目编号" prop="project_num">
              <!-- <el-select v-model="newAppForm.project_num" placeholder="请选择项目(如果没有请联系管理员录入)" style="width: 100%;" :disabled="disabledPool"> -->
              <el-select v-model="newAppForm.project_num" placeholder="请选择项目(如果没有请联系管理员录入)" style="width: 100%;">
                <el-option
                  v-for="item in poolOptions"
                  :key="'('+item.key+')'+item.display_name"
                  :label="'('+item.key+')'+item.display_name"
                  :value="'('+item.key+')'+item.display_name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <!-- <el-form-item label="硬件配置" prop="info">
              <el-select v-model.trim="newAppForm.info" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in infooptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="资源类型" prop="type">
              <el-select v-model.trim="newAppForm.type" placeholder="请选择" style="width: 100%" @change="changetype">
                <el-option label="独占型" value="独占型"/>
                <el-option label="共享型" value="共享型"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="环境" prop="env" required>
              <el-select v-model="newAppForm.env" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="生产" value="生产"/>
                <el-option label="UAT" value="UAT"/>
                <el-option label="SIT" value="SIT"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="存储种类" prop="redis" required>
              <el-select v-model="newAppForm.redis" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="Redis-cluster" value="Redis-cluster"/>
                <el-option label="Redis-standalone" value="Redis-standalone"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="Redis类型" prop="redistype">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">
                       1:高可用 - 高性能型<br />
                          <!-- &nbsp;&nbsp;主:不做持久化  从:rdb+aof<br /> -->
                          <!-- &nbsp;&nbsp;适用范围：能容忍极限情况下丢数据，主从自动切换，性能高，业务无需兜底<br /> -->
                          &nbsp;&nbsp;主不做持久化 ，从aof持久化<br />
                          &nbsp;&nbsp;适用范围：能容忍极限情况下丢失部分数据，主从自动切换，性能高<br />
                       2:高可用 - 均衡型<br />
                          <!-- &nbsp;&nbsp;主:rdb       从:rdb+aof<br /> -->
                          <!-- &nbsp;&nbsp;适用范围：能容忍极限情况下丢数据，主从自动切换，主有少量IO消耗，性能高，业务无需兜底<br /> -->
                          &nbsp;&nbsp;主从都进行aof持久化<br />
                          &nbsp;&nbsp;适用范围：能容忍极限情况下丢失少量数据，主从自动切换，性能较高<br />
                       3:高可用 - 高一致型<br />
                          <!-- &nbsp;&nbsp;主:rdb+aof   从:rdb+aof<br /> -->
                          <!-- &nbsp;&nbsp;适用范围：数据要求100%一致，牺牲性能，主从自动切换，主从均有IO消耗，业务无需兜底<br /> -->
                          &nbsp;&nbsp;主:rdb+aof 从:rdb+aof<br />
                          &nbsp;&nbsp;适用范围：最大程度保存数据，宕机后数据保存较完整，牺牲性能，主从自动切换，主从均有IO消耗<br />
                       4:高可用 - 极致性能<br />
                          <!-- &nbsp;&nbsp;主从均无持久化<br /> -->
                          <!-- &nbsp;&nbsp;适用范围：主从切换保障，宕机后无法恢复数据，但性能极高，主从自动切换,无IO消耗，适用于业务自有兜底 -->
                          &nbsp;&nbsp;主从均无持久化<br />
                          &nbsp;&nbsp;适用范围：主从切换保障，主从同时宕机后无法恢复数据，但性能极高，主从自动切换,无IO消耗，适用于业务自有兜底
                  </div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                Redis类型
              </label>
              <el-select v-model="newAppForm.redistype" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="高性能型" value="高性能型"/>
                <el-option label="均衡型" value="均衡型"/>
                <el-option label="高一致型" value="高一致型"/>
                <el-option label="极致性能" value="极致性能"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="内存总量(单位:G)" prop="mem">
              <!-- <el-input v-model.trim="newAppForm.mem" placeholder="请输入内存总量"></el-input> -->
              <!-- <el-input-number v-if="newAppForm.type == '共享型' " v-model.trim="newAppForm.mem" controls-position="right" :min="1" :max="30" :precision="0" :controls="false" style="width:100%"></el-input-number>
              <el-input-number v-else v-model.trim="newAppForm.mem" controls-position="right" :min="1" :max="1500" :precision="0" :controls="false" style="width:100%"></el-input-number> -->
              <el-input-number v-model.trim="newAppForm.mem" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="预估条目数量" prop="number">
              <el-input-number v-model.trim="newAppForm.number" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="预估QPS" prop="qps">
              <!-- <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">QPS = 并发量 / 平均响应时间</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                QPS
              </label> -->
              <el-input-number v-model.trim="newAppForm.qps" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="报警联系人" prop="owner">
              <el-select v-model="newAppForm.owner" filterable clearable multiple :multiple-limit="5" placeholder="请输入工号/姓名" style="width: 100%;">
                <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="影响范围" prop="alarm">
              <el-input v-model="newAppForm.alarm" placeholder="请输入影响范围">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item label="是否需要持久化" prop="persistent">
              <el-select v-model="newAppForm.persistent" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="是" value="是"/>
                <el-option label="否" value="否"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="11">
            <el-form-item label="是否需要热备" prop="hot">
              <el-select v-model="newAppForm.hot" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="是" value="是"/>
                <el-option label="否" value="否"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item label="内存报警阀值" prop="memalarm">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">例如，内存使用率超过90%报警，请填写90</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                内存报警阀值
              </label>
              <el-input-number v-model.trim="newAppForm.memalarm" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="11">
            <el-form-item label="客户端连接数报警阀值" prop="clientalarm">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">例如，客户端连接数报警超过2000报警，请填写2000</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                客户端连接数报警阀值
              </label>
              <el-input-number v-model.trim="newAppForm.clientalarm" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
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
              <!-- <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">为了更容易通过申请，请填写详细的说明信息</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                备注描述
              </label> -->
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 1, maxRows: 8}"/>
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
              <span v-if="isRedisandDZ" style="color:red;">独占型Redis,应用的应用类型不是Redis,不能提交<br /></span>
              <!-- <el-tooltip content="应用的应用类型不是Redis" placement="top" :disabled="!isRedisandDZ"> -->
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="saveDraftsForm('newAppForm')" :disabled="isRedisandDZ" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :disabled="isRedisandDZ" :loading="buttondisabled">保存草稿</el-button>
              <!-- </el-tooltip> -->
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <!-- <el-tooltip content="应用的应用类型不是Redis" placement="top" :disabled="!isRedisandDZ"> -->
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="submitForm('newAppForm')" :disabled="isRedisandDZ" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :disabled="isRedisandDZ" :loading="buttondisabled">提交草稿</el-button>
              <!-- </el-tooltip> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchAppInfo } from '@/api/cmdbs/app_manage';
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,getphysical,getredisappname,get_workflowRedisappname } from '@/api/workflow/app_manage';
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize';
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import { getProductAppCascader} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
import { getPoolProduct } from '@/api/cmdb'
import {getUserInfo} from '@/api/zabbix/user_info'

export default {
  name: 'AppApplyForm',
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    return {
      aDetail:{},
      projectOptions:[],
      poolOptionsA:[],
      poolOptions:[],
      userOptions:[],
      workflowredisarray:[],
      disabledPool: true,
      isRedisandDZ:false,
      buttondisabled:false,
      help_doc_url:'',
      newAppForm: {
        project_name_list:[],
        app_name:'',
        app_cname:'',
        app_type:'',
        app_id:'',
        appowner:'',
        alreadyhave:0,
        app_anothername:'',
        desc: '',
        env: '',
        redis:'Redis-cluster',
        mem:undefined,
        qps:undefined,
        number:undefined,
        // memalarm:undefined,
        // clientalarm:undefined,
        // source:'是',
        // persistent:'是',
        // hot:'是',
        needdesc:'',
        // fileList:[],
        project_num:'',
        type:'共享型',
        expecteddate: '',
        redistype:'',
        routeParams: '',
        owner:[],
        alarm:'',
      },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now() + 86400000 * 2
        }
      },
      rules: {
        project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
        project_num: [{ required: true, message: '请选择项目编号', trigger: 'change' },],
        type:[{ required: true, message: '请选择资源类型', trigger: 'blur' },],
        appowner:[{ required: true, message: '请选择应用负责人', trigger: 'blur' },],
        app_anothername:[
            {required: true,message: '请输入应用别名'},
            {min: 3,max: 100,message: '长度在 3 到 100 个字符'},
          ],
        env:[{ required: true, message: '请选择环境', trigger: 'blur' },],
        mem:[{ required: true, message: '请输入内存总量', trigger: 'blur' },],
        qps:[{ required: true, message: '请输入预估QPS', trigger: 'blur' },],
        number:[{ required: true, message: '请输入预估条目数量', trigger: 'blur' },],
        needdesc:[{ required: true, message: '请输入需求描述', trigger: 'blur' },],
        redistype:[{ required: true, message: '请选择Redis类型', trigger: 'blur' },],
        alarm:[{ required: true, message: '请输入影响范围', trigger: 'blur' },],
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
    getProductAppCascader().then(response => {
      this.projectOptions = response
    })
    getUserInfo().then(response => {
      this.userOptions = response
    });
    //未审批完的Redis申请单的应用名 验证重名
    var formdata = new FormData()
    formdata.append('step_line', this.$route.params.id)
    get_workflowRedisappname(formdata).then(response => {
      this.workflowredisarray = response.msg
    })
    getPoolProduct().then(response => {
      this.poolOptionsA = response
      this.getpooloption()
    })
    this.renderDraftsData()
  },
  methods: {
    changetype(){
      //换了 独占型 共享型 清空应用名 清空项目编号
      this.newAppForm.project_name_list = []
      this.newAppForm.project_num = ''
      this.poolOptions = []
      this.isRedisandDZ = false
      // this.newAppForm.mem = undefined
      this.changeexpecteddate()
    },
    // 独占型day+7 共享型day+3
    changeexpecteddate(){
      // if ( this.newAppForm.type == '独占型' && this.newAppForm.app_type !== 'Redis' && this.newAppForm.app_type !== 'REDIS') {
      //   this.isRedisandDZ = true
      // } else{
      //   this.isRedisandDZ = false
      // }
      if (this.newAppForm.type == '独占型') {
        this.newAppForm.expecteddate = this.initDate(7);
        this.pickerOptions2 = {
          disabledDate(end) {
            return end.getTime() < Date.now() + 86400000 * 6
          }
        }
      } else{
        // this.isRedisandDZ = false     //共享型 不用验证app_type是不是redis
        this.newAppForm.expecteddate = this.initDate(3);
        this.pickerOptions2 = {
          disabledDate(end) {
            return end.getTime() < Date.now() + 86400000 * 2
          }
        }
      }
    },
    renderDraftsData() {
      if(this.$route.params.detailData_edit){
        this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
        this.renderDraftsData1();
      }
    },
    renderDraftsData1() {
      try {
        this.newAppForm.project_name_list = this.aDetail.project_name_list
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        this.newAppForm.app_name = this.aDetail.app_name
        this.newAppForm.app_cname = this.aDetail.app_cname
        this.newAppForm.app_type = this.aDetail.app_type
        this.newAppForm.appowner = this.aDetail.appowner
        this.newAppForm.alreadyhave = this.aDetail.alreadyhave
        this.newAppForm.app_anothername = this.aDetail.app_anothername
        this.newAppForm.env = this.aDetail.env
        this.newAppForm.redis = this.aDetail.redis
        this.newAppForm.mem = this.aDetail.mem
        this.newAppForm.qps = this.aDetail.qps
        this.newAppForm.number = this.aDetail.number
        // this.newAppForm.memalarm = this.aDetail.memalarm
        // this.newAppForm.clientalarm = this.aDetail.clientalarm
        // this.newAppForm.source = this.aDetail.source
        // this.newAppForm.persistent = this.aDetail.persistent
        // this.newAppForm.hot = this.aDetail.hot
        this.newAppForm.desc = this.aDetail.desc
        this.newAppForm.needdesc = this.aDetail.needdesc
        // this.newAppForm.fileList = this.aDetail.fileList
        this.newAppForm.project_num = this.aDetail.project_num
        this.newAppForm.type = this.aDetail.type
        this.newAppForm.expecteddate = this.aDetail.expecteddate
        this.newAppForm.redistype = this.aDetail.redistype
        this.newAppForm.owner = this.aDetail.owner
        this.newAppForm.alarm = this.aDetail.alarm
        if (this.newAppForm.type == '独占型') {
          this.pickerOptions2 = {
            disabledDate(end) {
              return end.getTime() < Date.now() + 86400000 * 6
            }
          }
        } else{
          this.pickerOptions2 = {
            disabledDate(end) {
              return end.getTime() < Date.now() + 86400000 * 2
            }
          }
        }
      } catch (error) {
        // TODO 异常情况如何处理
        console.log(this.$route.params.detailData_edit)
      }
    },
    // 修改草稿提交、或者再次保存草稿，都是update数据
    submitEditForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if(this.newAppForm.fileList.length !==0){
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
          // } else{
          //   this.$message({
          //     message: '请上传附件',
          //     type: 'warning',
          //   })
          //   return false
          // }
        }
        else {
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
          // } else{
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
        this.getpooloption()
        // this.changeexpecteddate()
      }else{
        // this.newAppForm = this.$options.data().newAppForm;
        this.$refs[formName].resetFields()
        // this.newAppForm.fileList = []
        this.poolOptions = [];
        this.newAppForm.expecteddate = this.initDate(3);
        this.pickerOptions2 = {
          disabledDate(end) {
            return end.getTime() < Date.now() + 86400000 * 2
          }
        }
        this.disabledPool = true;
        this.isRedisandDZ = false;
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
      })
    },
    getpooloption(){
      if(this.$route.params.detailData_edit){
        this.projectChange(this.newAppForm.project_name_list)
        this.newAppForm.project_num = this.aDetail.project_num
      }
    },
    projectChange(choose) {
      this.newAppForm.project_num = ''
      if (this.newAppForm.project_name_list.length == 0) {
        this.poolOptions = []
        this.isRedisandDZ = false
        return
      }
      this.disabledPool = false;
      //取产品线大部门
      choose = choose[0].split('-')[0];
      this.poolOptions = this.poolOptionsA[choose]
      if (this.poolOptions) {
        console.log(this.poolOptions)
      } else {
        this.poolOptions = []
        this.disabledPool = true
      }
      if (this.newAppForm.project_name_list.length == 4) { //共享型 是否选择到了应用
        // 应用已关联项目,直接取到
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        fetchAppInfo(this.newAppForm.app_id).then(response => {
          this.newAppForm.app_name = response.app_name
          this.appnameonly(this.newAppForm.app_name)
          this.newAppForm.app_cname = response.app_cname
          this.newAppForm.app_type = response.app_type
          if ( this.newAppForm.type == '独占型' && this.newAppForm.app_type !== 'Redis' && this.newAppForm.app_type !== 'REDIS') {
            this.isRedisandDZ = true
          } else{
            this.isRedisandDZ = false
          }
          var project_num = response.pool_cname
          if ( project_num !== '') {
            for (var i = 0; i < this.poolOptions.length; i++) {
              if ( this.poolOptions[i].display_name == project_num) {
                this.newAppForm.project_num = '('+this.poolOptions[i].key+')'+this.poolOptions[i].display_name
                this.disabledPool = true
                return
              }
            }
          }
        })
      } else{
        this.newAppForm.app_name = String(this.newAppForm.project_name_list).replace(new RegExp( ',' , "g" ) , '/')
        var name = this.newAppForm.project_name_list[this.newAppForm.project_name_list.length-1]
        this.appnameonly(name)
      }
    },
    appnameonly(name){  //验证应用名最后一级是否重名  重名就应用别名
      getredisappname({app_name:name}).then(response => {  //验证 应用名是否重名
        if (response.status == 1) { //重名
          this.newAppForm.alreadyhave = 1
          // this.newAppForm.app_anothername = ''   //会影响草稿修改
        } else if (this.workflowredisarray.indexOf(name)!==-1) { //待审批Redis重名
          this.newAppForm.alreadyhave = 1
          // this.newAppForm.app_anothername = ''   //会影响草稿修改
        } else{
          this.newAppForm.alreadyhave = 0
        }
      })
    },
    appnameonly2(){  //验证别名是否重名  重名就清空
      getredisappname({app_name:this.newAppForm.app_anothername}).then(response => {
        if (response.status == 1) { //重名
          this.$message({
            message: '该应用别名'+this.newAppForm.app_anothername+'已存在',
            type: 'warning',
          })
          this.newAppForm.app_anothername = ''
        } else if(this.workflowredisarray.indexOf(this.newAppForm.app_anothername)!==-1){ //待审批Redis重名
          this.$message({
            message: '该应用别名'+this.newAppForm.app_anothername+'已存在',
            type: 'warning',
          })
          this.newAppForm.app_anothername = ''
        }
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
