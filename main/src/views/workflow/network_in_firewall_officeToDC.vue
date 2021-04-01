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
        <el-row v-for="(team,tindex) in newAppForm.array" style="padding: 0px" :key="tindex">
          <el-row>
            <el-col  :span="12" class="col-1400-8 col-1400-offset-2">
              <el-form-item label="办公IP" :prop="`array[${tindex}]` + '.officeIP'" :rules="[{required:true,message:'请输入访问原因',trigger:'blur'},{validator:validateIpList}]">
                <el-input v-model="team.officeIP" type="textarea" :autosize="{ minRows: 2, maxRows: 8}" placeholder="请输入IP列表,以英文逗号或回车分隔"/>
              </el-form-item>
            </el-col>
            <el-col  :span="12" class="col-1400-8">
              <el-form-item label="访问原因" :prop="`array[${tindex}]` + '.reason'" :rules="{required:true,message:'请输入访问原因',trigger:'blur'}">
                <el-input v-model="team.reason" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}" placeholder="请输入访问原因"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="col-1400-16 col-1400-offset-2">
              <el-form-item label="目的端集群">
                <span style="color:red;">
                  ES、MQ、mysql、oracle、mongodb、redis，请通过集群添加目的端信息
                  （若选择 mysql、oracle、mongodb、redis 集群，请与dba确认）
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="col-1400-8 col-1400-offset-2">
              <el-form-item label="ES" prop="eslist">
                <el-select v-model="team.eslist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(team,team.eslist,esOptions,3)"
                @visible-change="esOptions2 = esOptions" :filter-method="((val)=>{clusterSearch(val,esOptions,3)})">
                  <el-option v-for="item in Object.keys(esOptions2)" :label="item" :value="item" :key="item"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="col-1400-8">
              <el-form-item label="MQ" prop="mqlist">
                <el-select v-model="team.mqlist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(team,team.mqlist,mqOptions,4)"
                @visible-change="mqOptions2 = mqOptions" :filter-method="((val)=>{clusterSearch(val,mqOptions,4)})">
                  <el-option v-for="item in Object.keys(mqOptions2)" :label="item" :value="item" :key="item"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="col-1400-8 col-1400-offset-2">
              <el-form-item label="mysql" prop="mysqllist">
                <el-select v-model="team.mysqllist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(team,team.mysqllist,mysqlOptions,5)"
                @visible-change="mysqlOptions2 = mysqlOptions" :filter-method="((val)=>{clusterSearch(val,mysqlOptions,5)})">
                  <el-option v-for="item in Object.keys(mysqlOptions2)" :label="item" :value="item" :key="item"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="col-1400-8">
              <el-form-item label="oracle" prop="oraclelist">
                <el-select v-model="team.oraclelist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(team,team.oraclelist,oracleOptions,6)"
                @visible-change="oracleOptions2 = oracleOptions" :filter-method="((val)=>{clusterSearch(val,oracleOptions,6)})">
                  <el-option v-for="item in Object.keys(oracleOptions2)" :label="item" :value="item" :key="item"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="col-1400-8 col-1400-offset-2">
              <el-form-item label="mongodb" prop="mongodblist">
                <el-select v-model="team.mongodblist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(team,team.mongodblist,mongodbOptions,7)"
                @visible-change="mongodbOptions2 = mongodbOptions" :filter-method="((val)=>{clusterSearch(val,mongodbOptions,7)})">
                  <el-option v-for="item in Object.keys(mongodbOptions2)" :label="item" :value="item" :key="item"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="col-1400-8">
              <el-form-item label="redis" prop="redislist">
                <el-select v-model="team.redislist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtable(team,team.redislist,redisOptions,8)"
                @visible-change="redisOptions2 = redisOptions" :filter-method="((val)=>{clusterSearch(val,redisOptions,8)})">
                  <el-option v-for="item in Object.keys(redisOptions2)" :label="item" :value="item" :key="item"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="col-1400-8 col-1400-offset-2">
              <el-form-item label="其他集群" prop="elselist">
                <el-select v-model="team.elselist" style="width: 100%;" multiple filterable clearable placeholder="可快速添加目的端信息" @change="changedtableelse(team,team.elselist,9)"
                @visible-change="elseOptions2 = elseOptions":filter-method="((val)=>{elseclusterSearch(val,elseOptions)})">
                  <el-option-group v-for="group in Object.keys(elseOptions2)" :key="group" :label="group">
                    <el-option v-for="item in Object.keys(elseOptions2[group])" :label="item" :value="group+'+'+item" :key="item"/>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col  :span="24" class="col-1400-16 col-1400-offset-2">
              <el-form-item label="目的端信息">
                <el-table :data="team.dtable">
                  <el-table-column prop="cluster_name" label="名称/集群类型"  align="center" min-width="6">
                    <template slot-scope="scope">
                      <div style="line-height: 16px;">
                        <!-- <span style="display: block;" v-if="scope.row.status==8">{{findRedisAppName(scope.row.esmqname)}}</span>
                        <span style="display: block;" v-else-if="scope.row.status==9">{{scope.row.cluster_name}}</span>
                        <span style="display: block;" v-else>{{scope.row.esmqname}}</span> -->
                        <span style="display: block;">{{scope.row.cluster_name}}</span>
                        <div style="color: #8492a6; font-size: 10px">
                          <!-- <span v-if="scope.row.status==3">ES</span>
                          <span v-if="scope.row.status==4">MQ</span>
                          <span v-if="scope.row.status==5">mysql</span>
                          <span v-if="scope.row.status==6">oracle</span>
                          <span v-if="scope.row.status==7">mongodb</span>
                          <span v-if="scope.row.status==8">redis</span>
                          <span v-if="scope.row.status==9">{{scope.row.cluster_type}}</span> -->
                          <span>{{scope.row.cluster_type}}</span>
                          <!-- <span v-if="scope.row.apptype">应用类型为
                            <span v-if="scope.row.apptype=='ES'||scope.row.apptype=='RocketMQ'||scope.row.apptype=='MySQL'||
                            scope.row.apptype=='Oracle'||scope.row.apptype=='Redis'||scope.row.apptype=='MongoDB'" style="color:red;">
                            {{scope.row.apptype}} 请通过集群添加</span>
                            <span v-else>{{scope.row.apptype}}</span>
                          </span> -->
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ip" label="目的域名或IP"  align="center" min-width="8">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status !== 1&&scope.row.status !== 2">{{scope.row.ip}}</span>
                      <span v-else>
                        <el-form-item :prop="`array[${tindex}].dtable.` + scope.$index + '.ip'" :rules="team.dtable[0].status !== 1?{required:false}:{required:true,message:'请输入目的域名或IP',trigger:'change'}">
                          <!-- <el-input v-model.trim="scope.row.ip" placeholder="ip为10.5或10.6网段" @change="getesmqname(scope.row)"></el-input> -->
                          <el-input v-model.trim="scope.row.ip" placeholder="请输入目的域名或IP" @change="getappname(scope.row)"></el-input>
                        </el-form-item>
                      </span>
                    </template>
                    <!-- <template slot-scope="scope">{{scope.row.ip}}</template> -->
                  </el-table-column>
                  <el-table-column prop="port" label="目的端口"  align="center" min-width="8">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">目的端口
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">
                            多端口以英文逗号分隔<br />可用 - 表示端口范围,例:80-90
                          </div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <span v-if="scope.row.status !== 1&&scope.row.status !== 2">{{scope.row.port}}</span>
                      <span v-else>
                        <el-form-item :prop="`array[${tindex}].dtable.` + scope.$index + '.port'" :rules="scope.row.ip?[{required:true,message: '请输入目的端口'},{message: '多端口以英文逗号分隔',trigger: 'change',validator: validatePort,}]:{required:false}">
                          <el-input v-model.trim="scope.row.port" placeholder="多端口以英文逗号分隔,可用 - 表示端口范围"></el-input>
                        </el-form-item>
                      </span>
                    </template>
                    <!-- <template slot-scope="scope">{{scope.row.port}}</template> -->
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <!-- <el-button type="text" icon="el-icon-plus" v-if="scope.row.status == 1||scope.row.status == 2" @click="addDomain2(team,scope.row)" :disabled="team.dtable.length>19">
                      </el-button><el-button type="text" icon="el-icon-delete" v-if="scope.row.status !== 1" style="color: red;" @click="removeDomain2(team,scope.row)" /> -->
                      <el-button type="primary" icon="el-icon-plus" v-if="scope.row.status == 1||scope.row.status == 2" circle style="padding:2px;" @click="addDomain2(team,scope.row)" :disabled="team.dtable.length>19">
                      </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status == 2" circle style="padding:2px;" @click="removeDomain2(team,scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24" class="col-1400-16 col-1400-offset-2">
              <el-form-item label="备注描述" prop="desc">
                <el-input v-model="team.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="12" class="col-1400-8 col-1400-offset-2">
              <el-form-item label="开通时长(天)" :prop="`array[${tindex}]` + '.day'" :rules="{required:true,message:'请输入开通时长',trigger:'blur'}">
                <el-input-number v-model.trim="team.day" controls-position="right" :min="1" :max="365" :precision="0" :controls="false" style="width: 100%;" placeholder="审批完成时为第一天"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="col-1400-8">
              <el-form-item label="备注描述" prop="desc">
                <el-input v-model="team.desc" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <!-- <el-row>
          <el-col style="text-align: center" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-button type="primary" plain icon="el-icon-plus" @click="addteam()" :disabled="newAppForm.array.length>4">新增一组</el-button>
            <el-button type="danger" plain icon="el-icon-minus" @click="removeteam()">移除最后一组</el-button>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-button v-if="this.$route.params.uuid == null" type="primary" @click="saveDraftsForm('newAppForm')" :disabled="newAppForm.array.length==0?true:false" :loading="buttondisabled">保存草稿</el-button>
            <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :disabled="newAppForm.array.length==0?true:false" :loading="buttondisabled">保存草稿</el-button>
            <el-button @click="resetForm('newAppForm')">重置</el-button>
            <el-button v-if="this.$route.params.uuid == null" type="primary" @click="submitForm('newAppForm')" :disabled="newAppForm.array.length==0?true:false" :loading="buttondisabled">立即提交</el-button>
            <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :disabled="newAppForm.array.length==0?true:false" :loading="buttondisabled">提交草稿</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,get_all_ipport,getIpList,getfirewalldip} from '@/api/workflow/app_manage'
  import {fetchAppInfo} from '@/api/cmdbs/app_manage'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import {fetchIPList} from '@/api/cmdb'
  import {getHelpDocContent} from '@/api/management/help_doc'
  //TODO 这个需要对表进行重新设计，因为存在一次申请多个应用的服务器的情况，系统版本可能也需要拉下来，这个针对windows 需要有特殊设置
  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        validatePort :(rule, value, callback) => {
          if (value) {
            if (/^(([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])[-,])*([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value)) {
              callback()
            } else {
              callback(new Error('port填写不正确'))
            }
          } else {
            callback()
          }
        },
        validateIpList :(rule, value, callback) => {
          if (value) {
            if (/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])[\n,])*(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value)) {
              callback()
            } else {
              callback(new Error('ip填写不正确'))
            }
          } else {
            callback()
          }
        },
        value:'',
        buttondisabled:false,
        help_doc_url:'',
        projectOptions: [],
        esOptions:[],
        mqOptions:[],
        mysqlOptions:[],
        oracleOptions:[],
        mongodbOptions:[],
        redisOptions:[],
        elseOptions:{},
        // DipOptions:[],
        esOptions2:[],
        mqOptions2:[],
        mysqlOptions2:[],
        oracleOptions2:[],
        mongodbOptions2:[],
        redisOptions2:[],
        elseOptions2:{},
        teamindex:undefined,
        isIp:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        newAppForm: {
          app_name:'',
          array:[],
          routeParams: '',
        },
        teamconf:{
          officeIP:'',
          reason:'',
          eslist:[],
          mqlist:[],
          mysqllist:[],
          oraclelist:[],
          mongodblist:[],
          redislist:[],
          elselist:[],
          dtable:[],
          desc:'',
          day:undefined,
        },
        dtableadd: {
          cluster_name:'',
          ip:'',
          port:undefined,
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
        rules: {},
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
      getProductAppCascader().then(response => {
        this.projectOptions = response
      });
      // getfirewalldip().then(response => {
      //   this.DipOptions = response
      // });
      get_all_ipport().then(response => {
        this.esOptions = response.ES
        this.mqOptions = response.MQ
        this.mysqlOptions = response.mysql
        this.oracleOptions = response.oracle
        this.mongodbOptions = response.mongodb || []
        this.redisOptions = response.Redis
        this.elseOptions = {}
        for (let key in response) {
          if (key !== 'ES' && key !== 'MQ' && key !== 'mysql' && key !== 'oracle' && key !== 'mongodb' && key !== 'Redis') {
            this.elseOptions[key] = response[key]
          }
        }
      });
      this.addteam()
      this.renderDraftsData()
    },
    methods: {
      // 渲染草稿数据
      renderDraftsData() {
        if(this.$route.params.detailData_edit){
          this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
          this.renderDraftsData1();
        }
      },
      renderDraftsData1() {
        try {
          this.newAppForm.array = this.aDetail.array
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
        }
      },
      addteam(){
        const team = Object.assign({}, this.teamconf)
        const dtable = Object.assign({}, this.dtableadd)
        team.dtable = []
        team.dtable.push(dtable)
        this.newAppForm.array.push(team)
      },
      removeteam(){
        this.newAppForm.array.splice(this.newAppForm.array.length-1,1)
      },
      addDomain2(team) {
        const dtable = Object.assign({}, this.dtableadd)
        dtable.status = 2
        team.dtable.push(dtable)
      },
      removeDomain2(team,item) {
        var index = team.dtable.indexOf(item)
        if (index !== -1) {
          team.dtable.splice(index, 1)
        }
      },
      selectAll(row) {
        row.Sip = []
        if (row.checked) {
          row.tableData.map((item) => {
            row.Sip.push(item.ip)
          })
        } else {
          row.Sip = []
        }
      },
      changeSelect(row) {
        if (row.Sip.length === row.tableData.length) {
          row.checked = true
        } else {
          row.checked = false
        }
      },
      dtablerules(){
        for (var i = 0; i < this.newAppForm.array.length; i++) {
          if (this.newAppForm.array[i].dtable.length == 0) {
            this.$message({
              message: '请选择目的端集群',
              type: 'warning',
            })
            return false
          }
        }
      },
      // 新建流程单提交
      submitForm(formName) {
        if (this.dtablerules()==false) {
          return false
        }
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
      resetForm(formName) {
        const sessionData = sessionStorage.getItem(this.sessionKey)
        if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
          this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
          this.renderDraftsData1()
        }else{
          // this.newAppForm = this.$options.data().newAppForm;
          this.$refs[formName].resetFields()
          this.newAppForm.array = [];
          this.addteam()
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        if (this.dtablerules()==false) {
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //提交草稿时，需要传入的6为该类型的申请单对应的node表中的node_id=start对应的id值
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
              // console.log(error)
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

      // 首次保存草稿,为新增数据
      saveDraftsForm(formName) {
        if (this.dtablerules()==false) {
          return false
        }
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
          } else {
            this.$message({
              message: '请填写必要的标题和内容',
              type: 'warning',
            })
            return false
          }
        })
      },
      //redis产品线_集群名  只显示集群名
      // findRedisAppName(redisLineAndApp){
      //   var index = redisLineAndApp.indexOf('_')
      //   return redisLineAndApp.slice(index+1)
      // },
      changedtable(team,list,options,status){
        //dtable中状态不为3 先存table里，清空dtable后再还原回去 (即删除dtable中status为3的数据)
        var table = []
        for (var i = 0; i < team.dtable.length; i++) {
          if(team.dtable[i].status !== status){
            table.push(team.dtable[i])
          }
        }
        team.dtable = []
        team.dtable = team.dtable.concat(table)
        //添加目的端信息
        if(list.length!==0){
          //合并端口
          for (var i = 0; i < list.length; i++) {
            var object = {}
            for (var j = 0; j < options[list[i]].length; j++) {
              var ip = options[list[i]][j].split(':')[0]
              var port = options[list[i]][j].split(':')[1]
              if (object[ip] == undefined) {
                object[ip] = port
              } else{
                object[ip] = object[ip]+','+port
              }
            }
            // 添加的ip port
            for (var key in object) {
              // team.dtable.unshift({esmqname:list[i],ip:key,port:object[key],status:status})
              if (status == 3) {var cluster_type = 'ES'}
              if (status == 4) {var cluster_type = 'MQ'}
              if (status == 5) {var cluster_type = 'mysql'}
              if (status == 6) {var cluster_type = 'oracle'}
              if (status == 7) {var cluster_type = 'mongodb'}
              if (status == 8) {var cluster_type = 'redis'}
              team.dtable.unshift({cluster_type:cluster_type,cluster_name:list[i],ip:key,port:object[key],status:status})
              // if (status == 8) {
              //   team.dtable.unshift({cluster_type:'redis',cluster_name:this.findRedisAppName(list[i]),ip:key,port:object[key],status:status})
              // } else{
              //   team.dtable.unshift({cluster_type:cluster_type,cluster_name:list[i],ip:key,port:object[key],status:status})
              // }
            }
          }
        }
      },
      changedtableelse(team,list,status){
        // console.log(list) // 集群类型+集群名
        //dtable中状态不为9 先存table里，清空dtable后再还原回去 (即删除dtable中status为9的数据)
        var table = []
        for (var i = 0; i < team.dtable.length; i++) {
          if(team.dtable[i].status !== status){
            table.push(team.dtable[i])
          }
        }
        team.dtable = []
        team.dtable = team.dtable.concat(table)
        //添加目的端信息
        if(list.length!==0){
          //合并端口
          for (var i = 0; i < list.length; i++) {
            var object = {}
            var cluster_type = list[i].split('+')[0]
            var cluster_name = list[i].split('+')[1]
            for (var j = 0; j < this.elseOptions[cluster_type][cluster_name].length; j++) {
              var ip = this.elseOptions[cluster_type][cluster_name][j].split(':')[0]
              var port = this.elseOptions[cluster_type][cluster_name][j].split(':')[1]
              if (object[ip] == undefined) {
                object[ip] = port
              } else{
                object[ip] = object[ip]+','+port
              }
            }
            // 添加的ip port
            for (var key in object) {
              team.dtable.unshift({cluster_type:cluster_type,cluster_name:cluster_name,ip:key,port:object[key],status:status})
            }
          }
        }
      },
      // getesmqname(row){
      //   if (row.ip !== '' && this.DipOptions.findIndex( (value)=>value.ip == row.ip)!==-1) {
      //     var index = this.DipOptions.findIndex( (value)=>value.ip == row.ip)
      //     row.esmqname=this.DipOptions[index].app
      //     row.apptype=this.DipOptions[index].app_type || '未知'
      //   } else{
      //     row.esmqname=''
      //     row.apptype=''
      //   }
      // },
      getappname(row){
        if (this.isIp.test(row.ip)) {
          getIpList({ip_list:row.ip}).then(response => {
            if (response) {
              var productline = response[0].pd_fullname2.split('^')
              var app = response[0].app_name
              row.cluster_name = productline[0] + '-' + productline[1] + '/' + productline[2] + '/' + productline[3] + '/' + app
            }
          })
        }
      },
      getHelpDoc() {
        // getHelpDocContent(({board:'workflow',title:'新建申请单-'+this.$route.params.name})).then(response => {
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
      clusterSearch(input,options,status){
        var options2 = []
        if (input) {
          for (let key in options) {
            //集群名称
            if (key.indexOf(input)!==-1) {
              options2[key] = options[key]
            } else{
              for (var i = 0; i < options[key].length; i++) {
                //ip:port1
                if (input.indexOf(':')!==-1 && options[key][i].split(':')[0].indexOf(input.split(':')[0])!==-1 && options[key][i].split(':')[1].indexOf(input.split(':')[1])!==-1) {
                  options2[key] = options[key]
                  break
                } else if (options[key][i].indexOf(input)!==-1) {
                  options2[key] = options[key]
                  break
                }
              }
            }
          }
        } else{ options2 = options }
        if (status == 3) {this.esOptions2 = options2}
        if (status == 4) {this.mqOptions2 = options2}
        if (status == 5) {this.mysqlOptions2 = options2}
        if (status == 6) {this.oracleOptions2 = options2}
        if (status == 7) {this.mongodbOptions2 = options2}
        if (status == 8) {this.redisOptions2 = options2}
      },
      elseclusterSearch(input,options){
        var options2 = {}
        if (input) {
          for (let type in options) {
            for (let key in options[type]) {
              //集群名称
              if (key.indexOf(input)!==-1) {
                if (!options2[type]) { options2[type] = {} }
                options2[type][key] = options[type][key]
              } else{
                for (var i = 0; i < options[type][key].length; i++) {
                  //ip:port1
                  if (input.indexOf(':')!==-1 && options[type][key][i].split(':')[0].indexOf(input.split(':')[0])!==-1 && options[type][key][i].split(':')[1].indexOf(input.split(':')[1])!==-1) {
                    if (!options2[type]) { options2[type] = {} }
                    options2[type][key] = options[type][key]
                    break
                  } else if (options[type][key][i].indexOf(input)!==-1) {
                    if (!options2[type]) { options2[type] = {} }
                    options2[type][key] = options[type][key]
                    break
                  }
                }
              }
            }
          }
        } else{options2 = options}
        this.elseOptions2 = options2
      },
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
<style>
  /* 不能用scoped */
  .firewall_myalert p {
    max-height: 300px;
    overflow: auto;
  }
</style>
