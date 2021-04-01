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
                          :filter-method="filterMethod"
                          style="width:100%;"
                          placeholder="请选择产品线及应用名"
                          @change="vmIpList">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="环境" prop="env" required>
              <el-select v-model="newAppForm.env" popper-class="app-search-class"
                         style="width: 100%;" @change="vmIpList">
                <el-option label="生产" value="生产"/>
                <el-option label="UAT" value="UAT"/>
                <el-option label="SIT" value="SIT"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="开通时长" prop="time" required>
              <el-select v-model="newAppForm.time" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="永久" value="永久"/>
                <el-option label="临时" value="临时"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="源地址" prop="visitweb" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">即调用方地址
                  </div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                源地址
              </label>
              <el-select v-model="newAppForm.visitweb" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="任意" value="任意"/>
                <el-option label="指定" value="指定"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="newAppForm.visitweb == '指定'" label="指定源地址" prop="weburl" required>
              <el-input v-model="newAppForm.weburl" type="textarea" placeholder="请输入源地址" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
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
            <el-form-item size="small" style="text-align: right" class="config_os" label-width="30px">
              <div v-if="newAppForm.app_id == '' || total ==0">
                <el-tooltip content="未选择应用或应用已有ip为0" placement="top">
                  <el-button type="primary"  @click="dialogVisible = true" disabled>添加应用IP</el-button>
                </el-tooltip>
              </div>
              <div v-else>
                <el-button type="primary"  @click="dialogVisible = true" :disabled="disabledbuttonPool">添加应用IP</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item prop="configinfo">
              <div>
                <el-table :data="newAppForm.configinfo">
                  <el-table-column prop="Domain_name" label="域名"  align="center">
                    <!-- 后加的端口，不显示ip -->
                    <template slot="header" slot-scope="scope">
                      <label slot="label">域名
                        <el-tooltip class="item" effect="dark" content="" placement="top-end">
                          <div slot="content">例如XXX.yto.net.cn 只需要填写XXX字段，此字段为申请部门自定义，一般为接口、应用缩写；<br/>
                                              首位为字母，不允许为数字或特殊字符。</div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.Domain_name'" :rules='newAppForm.rules.Domain_name'>
                        <el-input v-model.trim="scope.row.Domain_name" ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Domain_port" label="域名端口"  align="center">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">域名端口
                        <el-tooltip class="item" effect="dark" content="" placement="top-end">
                          <div slot="content">映射后使用的公网端口，一般情况和内网服务器端口保持一致，80端口资源有限，使用需要上级领导批准</div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <!-- <el-form-item :prop="'configinfo.' + scope.$index + '.Domain_port'"> -->
                        <el-input-number v-model.trim="scope.row.Domain_port" controls-position="right" :min="0" :max="65535" :precision="0" :controls="false" style="width: 50%;"></el-input-number>
                      <!-- </el-form-item> -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="ip" label="服务器IP"  align="center">
                    <!-- 后加的端口，不显示ip -->
                    <template slot-scope="scope">
                      {{scope.row.ip}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="port" label="服务器端口"  align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.port'" :rules='newAppForm.rules.port'>
                        <el-input-number v-model.trim="scope.row.port" controls-position="right" :min="0" :max="65535" :precision="0" :controls="false" style="width: 50%;"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                      <el-button type="danger" icon="el-icon-delete" circle @click="removeport(scope.row,newAppForm.configinfo)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc" :rules="total > 5?rules.desc:[{ required: false, message: '请输入备注描述', trigger: 'blur' }]">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <el-button v-if="this.$route.params.uuid == null && newAppForm.configinfo.length !== 0" type="primary" @click="saveDraftsForm('newAppForm')" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else-if="newAppForm.configinfo.length == 0" type="primary" @click="saveDraftsForm('newAppForm')" disabled>保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :loading="buttondisabled">保存草稿</el-button>
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <el-button v-if="this.$route.params.uuid == null && newAppForm.configinfo.length !== 0" type="primary" @click="submitForm('newAppForm')" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else-if="this.$route.params.uuid == null && newAppForm.configinfo.length == 0" type="primary" @click="submitForm('newAppForm')" disabled>立即提交</el-button>
              <el-button v-else-if="newAppForm.configinfo.length == 0" type="primary" @click="submitEditForm('newAppForm',0)" disabled>提交草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :loading="buttondisabled">提交草稿</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <div style="text-align:center;padding-top:2%;padding-bottom:2%;">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="ipList"
          filterable
          :titles="['未选服务器', '已选服务器']"
          :props="{
            key: 'ip',
            label: 'ip'
          }"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="handleChange"
          :data="tableData">
          <span slot-scope="{ option }">{{ option.ip }}</span>
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="ipList.length == 0" @click="addvmip" disabled>确定</el-button>
        <el-button size="small" type="primary" v-else @click="addvmip">确定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine} from '@/api/workflow/app_manage'
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
        disabledbuttonPool:true,
        total:0,
        dialogVisible:false,
        buttondisabled:false,
        help_doc_url:'',
        projectOptions: [],
        tableData:[],
        ipList:[],
        newAppForm: {
          rules:{
            port:{
              type:"number",
              required:true,
              message:"端口不能为空",
              trigger:"blur"
            },
            Domain_name:{
              type:"string",
              required:true,
              message:"域名不能为空",
              trigger:"blur"
            },
          },
          project_name_list: [],
          app_id: '',
          app_cname:'',
          app_name:'',
          env:'',
          time:'',
          enddate: '',
          visitweb:'',
          weburl:'',
          configinfo: [],
          desc:'',
          routeParams: '',
        },
        configinfodict: {
          'ip': '',
          'port': undefined,
          'Domain_name':'',
          'Domain_port':undefined,
        },
        listQuery: {
          page: 1,
          limit: 20,
          app_id: undefined,
          resource_env:undefined
        },
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now()
          }
        },
        rules: {
          project_name_list: [
            { type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'blur' },
          ],
          env:[
            { required: true, message: '请选择环境', trigger: 'blur' },
          ],
          time:[
            { required: true, message: '请选择开通时长', trigger: 'blur' },
          ],
          visitweb:[
            { required: true, message: '请选择源地址', trigger: 'blur' },
          ],
          weburl:[
            { required: true, message: '请输入指定源地址', trigger: 'blur' },
          ],
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
      this.newAppForm.enddate = this.initDate(1);
      getProductAppCascader().then(response => {
        this.projectOptions = response
      });
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
          this.newAppForm.project_name_list = this.aDetail.project_name_list
          this.newAppForm.app_id = this.newAppForm.project_name_list[3]
          this.newAppForm.env = this.aDetail.env
          if (this.newAppForm.project_name_list[3]) this.vmIpList()
          this.newAppForm.time = this.aDetail.time
          this.newAppForm.enddate = this.aDetail.enddate
          this.newAppForm.visitweb = this.aDetail.visitweb
          this.newAppForm.weburl = this.aDetail.weburl
          this.newAppForm.configinfo = this.aDetail.configinfo
          this.newAppForm.desc = this.aDetail.desc
          this.ipList = []
          for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
            this.ipList.push(this.newAppForm.configinfo[i].ip)
          }
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
        }
      },
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
      },
      removeport(row,arr){
        var index = arr.indexOf(row)
        if (index !== -1) {
          arr.splice(index, 1)
          this.ipList.splice(index, 1)
        }
      },
      addvmip(){
        this.newAppForm.configinfo = []
        for (var i = 0; i < this.ipList.length; i++) {
          const configinfo = Object.assign({}, this.configinfodict)
          configinfo.ip = this.ipList[i]
          this.newAppForm.configinfo.push(configinfo)
        }
        this.dialogVisible = false
      },
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.buttondisabled = true
            addWorkFlow(this.$route.params.id, this.newAppForm)
              .then(response => {
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
              })
              .catch(err => {
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
          this.disabledbuttonPool = true;
          this.newAppForm = this.$options.data().newAppForm;
          this.newAppForm.enddate = this.initDate(1);
          this.$nextTick(() => {
            this.$refs[formName].clearValidate();
          })
        }
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
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
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.buttondisabled = true
          saveDraftsWorkFlow(this.$route.params.id, this.newAppForm)
            .then(response => {
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
            })
            .catch(err => {
              // this.$message({
              //   message: err.errError,
              // })
              console.log(err)
            })
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
      data(query){
        fetchIPList(query).then(response => {
          this.total=response.count
          const tableData = []
          for (const i of response.results) {
            tableData.push({
              ip: i.ip
            })
          }
          // 合并为一个数组
          this.tableData = this.tableData.concat(tableData)
          // console.log(this.tableData.length)
          if( this.listQuery.page < this.total/20 )
          {
            this.listQuery.page++
            this.data(this.listQuery)
          }
          else
          {
            this.listQuery.page = 1
          }
        })
      },
      vmIpList(){
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        this.disabledbuttonPool = false
        this.listQuery.app_id = this.newAppForm.app_id
        if ( this.listQuery.app_id == undefined) {
          return
        }
        fetchAppInfo(this.newAppForm.app_id).then(response => {
          this.newAppForm.app_name = response.app_name
          this.newAppForm.app_cname = response.app_cname
        })
        console.log(this.newAppForm)
        this.tableData = []
        this.ipList = []
        this.newAppForm.configinfo = []
        //环境
        if ( this.newAppForm.env == '生产') {
          this.listQuery.resource_env = 1
        } else if ( this.newAppForm.env == 'SIT') {
          this.listQuery.resource_env = 2
        } else if ( this.newAppForm.env == 'UAT') {
          this.listQuery.resource_env = 4
        } else{
          this.listQuery.resource_env = undefined
        }
        this.data(this.listQuery)
      },
      getHelpDoc() {
      //   getHelpDocContent(({board:'workflow',title:'新建申请单-'+this.$route.params.name})).then(response => {
      //     this.$router.push({name:"help_doc_preview", params: {content: response.content}})
      // })
        this.$router.push('/'+this.help_doc_url.split('/')[2])
      },
      filterMethod(node, keyword){
        keyword = keyword.toLowerCase() // 搜索关键字转为小写
        const { text, path } = node;
        // return text.includes(keyword) || path.includes(keyword);
        return text.toLowerCase().includes(keyword)
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

  .el-step__description {
    padding-top: 10px;
    font-size: 15px;
  }

  .help-svg-pointer:hover {
    cursor: pointer;
  }
  a{
    color: #1890ff;
  }
</style>
