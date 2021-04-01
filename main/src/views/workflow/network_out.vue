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
                          clearable
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
            <el-form-item label="内网源IP" prop="Sip" required>
              <el-select
                v-model="newAppForm.Sip"
                filterable
                clearable
                multiple
                placeholder="请输入内网源IP"
                style="width: 100%;"
                @change='changeSelect'>
                <el-checkbox v-model="checked" @change='selectAll' style="text-align: right; width: 100%;padding-right: 20px;">全选</el-checkbox>
                <el-option
                  v-for="item in tableData"
                  :key="item.ip"
                  :label="item.ip"
                  :value="item.ip">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="访问目标" prop="visitweb" required>
              <el-select v-model="newAppForm.visitweb" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="访问任意目标" value="访问任意目标"/>
                <el-option label="访问指定目标" value="访问指定目标"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="newAppForm.visitweb == '访问指定目标'" label="访问指定目标" prop="weburl" required>
              <el-input v-model="newAppForm.weburl" type="textarea" placeholder="请输入访问网址或IP地址" maxlength="500" :autosize="{ minRows: 1, maxRows: 8}"></el-input>
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
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="对端是否有白名单" prop="whitelist">
              <el-select v-model="newAppForm.whitelist" popper-class="app-search-class" style="width: 100%;">
                <el-option label="是" value="是"/>
                <el-option label="否" value="否"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.whitelist=='是'">
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="对端相关信息">
              <a class="el-dropdown-link" href="/vue/cmdb/网络白名单.xls">
                <el-button type="text">白名单(模板下载)</el-button>
              </a>
              <el-table :data="newAppForm.configinfo">
                <el-table-column prop="client" label="客户单位"  align="center" min-width="7">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.client'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                      <el-input v-model="scope.row.client" placeholder="请输入客户单位" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="manage" label="产品经理"  align="center" min-width="3">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.manage'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                      <el-input v-model="scope.row.manage" placeholder="请输入" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="telormail" label="联系方式"  align="center" min-width="5">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.telormail'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                      <el-input v-model="scope.row.telormail" placeholder="请输入电话或邮箱" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="url" label="对端接口"  align="center" min-width="7">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.url'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                      <el-input v-model="scope.row.url" placeholder="请输入URL或IP:PORT" type="textarea" :autosize="{ minRows: 1, maxRows: 8}"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="2">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" icon="el-icon-plus" @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>4">
                    </el-button><el-button type="text" icon="el-icon-delete" v-if="scope.row.status !== 1" style="color: red;" @click="removeDomain(scope.row)" /> -->
                    <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;" @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>4">
                    </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removeDomain(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
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
        // dialogVisible:false,
        buttondisabled:false,
        checked: false,
        value:'',
        total:0,
        help_doc_url:'',
        tableData:[],
        projectOptions: [],
        newAppForm: {
          project_name_list: [],
          app_id: '',
          app_cname:'',
          app_name:'',
          env: '',
          Sip:[],
          visitweb:'访问指定目标',
          weburl:'',
          time:'',
          enddate:'',
          whitelist:'是',
          configinfo:[],
          desc:'',
          routeParams: '',
        },
        configinfodictadd: {
          client:'',
          manage:'',
          telormail:'',
          url:'',
          status:1,
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
          project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
          env:[{ required: true, message: '请选择环境', trigger: 'blur' },],
          Sip:[{ required: true, message: '请添加内网源ip', trigger: 'change' },],
          visitweb:[{ required: true, message: '请选择访问目标', trigger: 'blur' },],
          weburl:[{ required: true, message: '请输入访问网址或IP地址', trigger: 'blur' },],
          time:[{ required: true, message: '请输入访问网址', trigger: 'blur' },],
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
      this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))
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
          this.newAppForm.Sip = this.aDetail.Sip
          this.newAppForm.visitweb = this.aDetail.visitweb
          this.newAppForm.weburl = this.aDetail.weburl
          this.newAppForm.time = this.aDetail.time
          this.newAppForm.enddate = this.aDetail.enddate
          this.newAppForm.whitelist = this.aDetail.whitelist
          this.newAppForm.configinfo = this.aDetail.configinfo
          this.newAppForm.desc = this.aDetail.desc
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
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
      selectAll() {
        this.newAppForm.Sip = []
        if (this.checked) {
          this.tableData.map((item) => {
            this.newAppForm.Sip.push(item.ip)
          })
        } else {
          this.newAppForm.Sip = []
        }
      },
      changeSelect() {
        if (this.newAppForm.Sip.length === this.tableData.length) {
          this.checked = true
        } else {
          this.checked = false
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
      resetForm(formName) {
        const sessionData = sessionStorage.getItem(this.sessionKey)
        if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
          this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
          this.renderDraftsData1()
        }else{
          this.tableData = []
          // this.newAppForm = this.$options.data().newAppForm;
          this.$refs[formName].resetFields()
          this.newAppForm.enddate = this.initDate(1);
          this.newAppForm.configinfo = []
          this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
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
          if( this.listQuery.page < this.total/20 ){
            this.listQuery.page++
            this.data(this.listQuery)
          } else{
            this.listQuery.page = 1
          }
        })
      },
      vmIpList(){
        this.tableData = []
        // this.newAppForm.configinfo = []
        this.newAppForm.Sip = []
        this.checked = false
        if (this.newAppForm.project_name_list.length == 0) {
          return
        }
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        this.listQuery.app_id = this.newAppForm.app_id
        fetchAppInfo(this.newAppForm.app_id).then(response => {
          this.newAppForm.app_name = response.app_name
          this.newAppForm.app_cname = response.app_cname
        })
        console.log(this.newAppForm)
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
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
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
