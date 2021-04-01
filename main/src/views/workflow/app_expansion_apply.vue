<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
          帮助指引</a>
        <h5 style="text-align:center;color:#606266">所有的资源成本将计入项目或团队成本</h5> <br>
      </el-col>
    </div>

    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm"
               style="width:100%">
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
                           style="width:80%;"
                           placeholder="请选择产品线及应用名"
                           @change="vmIpList">
              </el-cascader>
              <el-popover
                placement="right"
                width="200"
                trigger="click">
                <span>已有虚拟机数量 : {{ total }}</span>
                <el-table :data="tableData" height="300">
                  <el-table-column width="170" prop="ip" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.ip }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="text" v-if="newAppForm.app_id == '' || total ==0" slot="reference" disabled>&nbsp;&nbsp;应用已有ip：{{total}}</el-button>
                <el-button type="text" v-else slot="reference">&nbsp;&nbsp;应用已有ip：{{total}}</el-button>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="项目编号" prop="project_num" required>
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
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="配置信息">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">最大支持5种配置</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                配置信息
              </label>
              <div>
                <el-table :data="newAppForm.configinfo">
                  <el-table-column prop="env" label="环境类型" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.env'">
                        <el-select v-model="scope.row.env" placeholder="请选择" style="width: 100%">
                          <el-option v-for="item in envoptions" :key="item.value" :label="item.label"
                                     :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cpumem" label="cpu/内存" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.cpumem'">
                        <el-cascader expand-trigger="hover"
                                     :options="cpumemoptions"
                                     v-model="scope.row.cpumem"
                                     style="width:100%;"
                                     @change="cputotal(scope.row)">
                        </el-cascader>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="disk" label="磁盘容量" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.disk'">
                        <el-select v-model="scope.row.disk" placeholder="请选择" style="width: 100%">
                          <el-option v-for="item in diskoptions" :key="item.value" :label="item.label"
                                     :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sys" label="系统版本" align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.sys'">
                        <system-version :selectedOptions="[parseInt(Object.keys(os_type)[Object.values(os_type).indexOf(scope.row.sys_type)]),scope.row.sys_version]"
                                    @sendValueToParent="getValueFromChild($event, scope.$index)" :key="versionkey"></system-version>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sum" label="申请数量" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.sum'" :rules="{type: 'number', required: true, message: '数量不能为空', trigger: 'blur'}">
                        <el-input-number v-model="scope.row.sum" controls-position="right" :min="1" :precision="0"
                                         :controls="false" style="width:100%"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="1">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;"
                                 @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>4"/>
                      <el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removeDomain(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <firewallForm ref="childMethod" @FormData="getnewAppForm"></firewallForm> -->
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc"
                          :rules="ctotal>0?rules.desc:[{ required: false, message: '请输入备注描述', trigger: 'blur' }]">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">为了更容易通过申请，请填写详细的说明信息</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                备注描述
              </label>
              <el-input v-model="newAppForm.desc" type="textarea" placeholder="如需其他配置,请写在备注描述" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
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
                <div slot="tip" class="el-upload__tip">为了提高主机组申请通过率，请上传项目立项和评审材料，包含资源评估表</div>
                <!-- 可上传附件，且单个文件不超过5M -->
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
  import {fetchIPList} from '@/api/cmdb'
  import {fetchAppInfo} from '@/api/cmdbs/app_manage'
  import SystemVersion from '@/components/Tools/SystemVersion_workflow'
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow, getWFLine} from '@/api/workflow/app_manage'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import {getHelpDocContent} from '@/api/management/help_doc'
  import {getPoolProduct} from '@/api/cmdb'
  // import firewallForm from './components/firewallForm' //内网防火墙目的端 表单 子组件

  const os_type = {
    1: 'CentOS',
    2: 'RedHat',
    3: 'ESXi',
    4: 'Oracle_linux',
    5: 'Windows',
    6: 'Ubuntu',
    10: 'AIX',
  };

  export default {
    name: 'AppApplyForm',
    components: {SystemVersion},
    // components: {SystemVersion,firewallForm},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        aDetail: {},
        help_doc_url: '',
        os_type: os_type,
        tableData: [],
        projectOptions: [],
        poolOptionsA: [],
        poolOptions: [],
        versionkey:1,
        disabledPool: true,
        buttondisabled:false,
        // selectedOptions: [1,'6.5'],
        envoptions: [{value: 'UAT', label: 'UAT'}, {value: 'SIT', label: 'SIT'}, {value: '生产', label: '生产'}],
        // cpuoptions:[{ value:'2', label:'2' },{ value:'4', label:'4' },{ value:'6', label:'6' },{ value:'8', label:'8' },{ value:'10', label:'10' },
        // { value:'12', label:'12' },{ value:'16', label:'16' },],
        // memoptions: [{ value:'4G', label:'4G' },{ value:'6G', label:'6G' },{ value:'8G', label:'8G' },{ value:'12G', label:'12G' },
        // { value:'16G', label:'16G' },{ value:'32G', label:'32G' },],
        cpumemoptions: [
          {
            value: '2C', label: '2C',
            children: [{value: '4G', label: '4G'}, {value: '6G', label: '6G'}, {value: '8G', label: '8G'}]
          },
          {
            value: '4C', label: '4C',
            children: [{value: '4G', label: '4G'}, {value: '6G', label: '6G'}, {value: '8G', label: '8G'}]
          },
          {
            value: '6C', label: '6C',
            children: [{value: '4G', label: '4G'}, {value: '6G', label: '6G'}, {
              value: '8G',
              label: '8G'
            }, {value: '12G', label: '12G'}, {value: '16G', label: '16G'}]
          },
          {
            value: '8C', label: '8C',
            children: [{value: '4G', label: '4G'}, {value: '6G', label: '6G'}, {
              value: '8G',
              label: '8G'
            }, {value: '12G', label: '12G'}, {value: '16G', label: '16G'}]
          },
          {
            value: '10C', label: '10C',
            children: [{value: '4G', label: '4G'}, {value: '6G', label: '6G'}, {
              value: '8G',
              label: '8G'
            }, {value: '12G', label: '12G'}, {value: '16G', label: '16G'}, {value: '32G', label: '32G'}]
          },
          {
            value: '12C', label: '12C',
            children: [{value: '4G', label: '4G'}, {value: '6G', label: '6G'}, {
              value: '8G',
              label: '8G'
            }, {value: '12G', label: '12G'}, {value: '16G', label: '16G'}, {value: '32G', label: '32G'}]
          },
          {
            value: '16C', label: '16C',
            children: [{value: '4G', label: '4G'}, {value: '6G', label: '6G'}, {
              value: '8G',
              label: '8G'
            }, {value: '12G', label: '12G'}, {value: '16G', label: '16G'}, {value: '32G', label: '32G'}]
          },
        ],
        diskoptions: [{value: '30G', label: '30G'}, {value: '40G', label: '40G'}, {value: '50G', label: '50G'},],
        newAppForm: {
          // onORoff:'',
          // steplinestatus:'',
          steplinestatus:'0',
          project_name_list: [],
          app_name: '',
          app_cname: '',
          app_id: '',
          project_num: '',
          expecteddate: '',
          desc: '',
          configinfo: [],
          // eslist:[],
          // mqlist:[],
          // mysqllist:[],
          // oraclelist:[],
          // mongodblist:[],
          // redislist:[],
          // elselist:[],
          // dtable:[],
          fileList: [],
          routeParams: '',
        },
        total: 0,
        ctotal: 0,
        sumtotal: 0,
        listQuery: {
          page: 1,
          limit: 20,
          app_id: undefined,
        },
        props: {
          value: 'label',
          children: 'app'
        },
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now()
          }
        },
        configinfodictadd: {
          'sys_type': "CentOS",
          'sys_version': "7.4",
          'env': '生产',
          // 'cpu': '',
          // 'mem': '',
          'cpumem': ['4C', '6G'],
          'disk': '40G',
          'sum': 1,
          'sys': '',
          'status': 1,
          'cpustatus': 0,
        },
        rules: {
          project_name_list: [{type: 'array', required: true, message: '请选择产品线及应用名', trigger: 'change'},],
          project_num: [{required: true, message: '请输入项目编号', trigger: 'change'},],
          desc: [{required: true, message: '请输入备注描述', trigger: 'change'},],
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
      this.newAppForm.expecteddate = this.initDate(1);
      this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
      getProductAppCascader().then(response => {
        this.projectOptions = response;
      })
      getPoolProduct().then(response => {
        this.poolOptionsA = response
        this.getpooloption()
      })
      this.renderDraftsData()
    },
    methods: {
      renderDraftsData() {
        if (this.$route.params.detailData_edit) {
          this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
          this.renderDraftsData1();
        }
      },
      renderDraftsData1() {
        try {
          this.newAppForm.project_name_list = this.aDetail.project_name_list
          this.newAppForm.app_id = this.newAppForm.project_name_list[3]
          if(this.aDetail.project_name_list[3]) this.vmIpList()
          this.newAppForm.app_name = this.aDetail.app_name
          this.newAppForm.app_cname = this.aDetail.app_cname
          this.newAppForm.project_num = this.aDetail.project_num
          this.newAppForm.expecteddate = this.aDetail.expecteddate
          this.newAppForm.desc = this.aDetail.desc
          this.newAppForm.configinfo = this.aDetail.configinfo
          // this.$nextTick(() => {
          //   this.$refs.childMethod.setnewAppForm(this.aDetail)
          // })
          this.newAppForm.fileList = this.aDetail.fileList
          var editcputotal = 0
          for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
            if (this.newAppForm.configinfo[i].cpumem[0] == '10C' || this.newAppForm.configinfo[i].cpumem[0] == '12C' || this.newAppForm.configinfo[i].cpumem[0] == '16C') {
              editcputotal = editcputotal + 1
            }
          }
          this.ctotal = editcputotal
        } catch (error) {
          // TODO 异常情况如何处理
          // console.log(this.$route.params.detailData_edit);
          console.log(error);
        }
      },
      addDomain() {
        const configinfo = Object.assign({}, this.configinfodictadd)
        configinfo.status = 2
        this.newAppForm.configinfo.push(configinfo)
      },
      removeDomain(item) {
        var index = this.newAppForm.configinfo.indexOf(item)
        if (item.cpustatus == 1 && (item.cpumem[0] == '10C' || item.cpumem[0] == '12C' || item.cpumem[0] == '16C')) {
          this.ctotal = this.ctotal - 1
        }
        if (index !== -1) {
          this.newAppForm.configinfo.splice(index, 1)
        }
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        // if (this.$refs.childMethod.dtablerules()==false) {
        //   return false
        // }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var sit = 0
            this.sumtotal = 0
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.sumtotal = this.sumtotal + this.newAppForm.configinfo[i].sum
              if (this.newAppForm.configinfo[i].env == 'SIT') {
                sit = 1
              }
            }
            if (this.sumtotal < 5) {  //虚机数量小于5 部门总监节点跳过
              this.newAppForm.steplinestatus='2'
            } else{
              this.newAppForm.steplinestatus='0'
            }
            if (this.sumtotal < 11 || this.newAppForm.desc !== '') {
              if (this.total !== 0 || this.sumtotal > 1 || sit == 1) {
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
                  this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
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
                  message: '虚拟机总数不得小于2台',
                  type: 'warning',
                })
                return false
              }
            } else {
              this.$message({
                message: '请填写备注描述',
                type: 'warning',
              })
              return false
            }
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
        // if (this.$refs.childMethod.dtablerules()==false) {
        //   return false
        // }
        this.$refs[formName].validate(valid => {
          if (valid) {
            var sit = 0
            this.sumtotal = 0
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.sumtotal = this.sumtotal + this.newAppForm.configinfo[i].sum
              if (this.newAppForm.configinfo[i].env == 'SIT') {
                sit = 1
              }
            }
            if (this.sumtotal < 5) {  //虚机数量小于5 部门总监节点跳过
              this.newAppForm.steplinestatus='2'
            } else{
              this.newAppForm.steplinestatus='0'
            }
            if (this.sumtotal < 11 || this.newAppForm.desc !== '') {
              if (this.total !== 0 || this.sumtotal > 1 || sit == 1) {
                this.buttondisabled = true
                saveDraftsWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
                  this.$notify({
                    title: '成功',
                    message: '草稿保存成功',
                    type: 'success',
                    duration: 3000,
                  })
                  this.buttondisabled = false
                  this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
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
                  message: '虚拟机总数不得小于2台',
                  type: 'warning',
                })
                return false
              }
            } else {
              this.$message({
                message: '请填写备注描述',
                type: 'warning',
              })
              return false
            }
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
        // if (this.$refs.childMethod.dtablerules()==false) {
        //   return false
        // }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var sit = 0
            this.sumtotal = 0
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.sumtotal = this.sumtotal + this.newAppForm.configinfo[i].sum
              if (this.newAppForm.configinfo[i].env == 'SIT') {
                sit = 1
              }
            }
            if (this.sumtotal < 5) {  //虚机数量小于5 部门总监节点跳过
              this.newAppForm.steplinestatus='2'
            } else{
              this.newAppForm.steplinestatus='0'
            }
            if (this.sumtotal < 11 || this.newAppForm.desc !== '') {
              if (this.total !== 0 || this.sumtotal > 1 || sit == 1) {
                this.buttondisabled = true
                addWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
                  this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success',
                    duration: 3000
                  })
                  this.buttondisabled = false
                  this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
                    this.$router.push('/workflow/workflow_list');
                  })
                }).catch(err => {
                  console.log(err)
                  this.$notify({
                    message: '提交异常！'
                  })
                })
              } else {
                this.$message({
                  message: '虚拟机总数不得小于2台',
                  type: 'warning',
                })
                return false
              }
            } else {
              this.$message({
                message: '请填写备注描述',
                type: 'warning',
              })
              return false
            }
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
        } else {
          this.total = 0
          this.ctotal = 0
          this.sumtotal = 0
          this.poolOptions = []
          this.tableData = []
          this.newAppForm.fileList = []
          this.$refs[formName].resetFields()
          this.newAppForm.expecteddate = this.initDate(1);
          this.newAppForm.configinfo = [];
          this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
          this.disabledPool = true
          // this.$refs.childMethod.resetForm()
        }
        // 重置时系统版本
        if (this.versionkey == 1) {
          this.versionkey = 0
        } else{
          this.versionkey = 1
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
      },
      getpooloption() {
        if (this.$route.params.detailData_edit) {
          this.projectChange(this.newAppForm.project_name_list)
          this.newAppForm.project_num = this.aDetail.project_num
        }
      },
      projectChange(choose) {
        this.disabledPool = false
        this.newAppForm.project_num = ''
        //取产品线大部门
        choose = choose[0].split('-')[0];
        this.poolOptions = this.poolOptionsA[choose]
        if (this.poolOptions) {
        } else {
          this.poolOptions = []
          this.disabledPool = true
        }
        // 应用已关联项目,直接取到
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        fetchAppInfo(this.newAppForm.app_id).then(response => {
          this.newAppForm.app_name = response.app_name
          this.newAppForm.app_cname = response.app_cname
          var project_num = response.pool_cname
          if (project_num !== '') {
            for (var i = 0; i < this.poolOptions.length; i++) {
              if (this.poolOptions[i].display_name == project_num) {
                this.newAppForm.project_num = '(' + this.poolOptions[i].key + ')' + this.poolOptions[i].display_name
                this.disabledPool = true
                return
              }
            }
          }
        })
      },
      data(query) {
        fetchIPList(query).then(response => {
          this.total = response.count
          const tableData = []
          for (const i of response.results) {
            tableData.push({
              ip: i.ip
            })
          }
          // 合并为一个数组
          this.tableData = this.tableData.concat(tableData)
          if (query.app_id == 1549) {
            return
          } else {
            if (this.listQuery.page < this.total / 20) {
              this.listQuery.page++
              this.data(this.listQuery)
            } else {
              this.listQuery.page = 1
            }
          }
        })
      },
      vmIpList() {
        // 当clearable应用的输入框
        if (this.newAppForm.project_name_list.length == 0) {
          this.tableData = []
          this.total = 0
          this.newAppForm.project_num = ''
          this.poolOptions = []
          return
        }
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        this.projectChange(this.newAppForm.project_name_list)
        this.listQuery.app_id = this.newAppForm.app_id
        this.tableData = []
        this.data(this.listQuery)
      },
      getValueFromChild(value1, index) {
        this.newAppForm.configinfo[index].sys_type = this.os_type[value1[0]];
        this.newAppForm.configinfo[index].sys_version = value1[1]
      },
      cputotal(row) {
        if (row.cpustatus == 0 && (row.cpumem[0] == '10C' || row.cpumem[0] == '12C' || row.cpumem[0] == '16C')) {
          row.cpustatus = 1
          this.ctotal = this.ctotal + 1
        } else if (row.cpustatus == 1 && (row.cpumem[0] !== '10C' || row.cpumem[0] !== '12C' || row.cpumem[0] !== '16C')) {
          row.cpustatus = 0
          this.ctotal = this.ctotal - 1
        }
      },
      // getnewAppForm(data){
      //   this.newAppForm.steplinestatus = data.steplinestatus
      //   this.newAppForm.onORoff = data.onORoff
      //   this.newAppForm.eslist = data.eslist
      //   this.newAppForm.mqlist = data.mqlist
      //   this.newAppForm.mysqllist = data.mysqllist
      //   this.newAppForm.oraclelist = data.oraclelist
      //   this.newAppForm.mongodblist = data.mongodblist
      //   this.newAppForm.redislist = data.redislist
      //   this.newAppForm.elselist = data.elselist
      //   this.newAppForm.dtable = data.dtable
      // },
      getHelpDoc() {
        // getHelpDocContent({board:'workflow',title:'新建申请单-'+this.$route.params.name}).then(response => {
        //   this.$router.push({name:"help_doc_preview", params: {content: response.content}})
        // })
        this.$router.push('/' + this.help_doc_url.split('/')[2])
      },
      filterMethod(node, keyword){
        keyword = keyword.toLowerCase() // 搜索关键字转为小写
        const { text, path } = node;
        // return text.includes(keyword) || path.includes(keyword);
        return text.toLowerCase().includes(keyword)
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
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleChange(response, file, fileList) {
        this.newAppForm.fileList = []
        this.newAppForm.fileList = fileList
      },
      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      }
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

  a {
    color: #1890ff;
  }
</style>
