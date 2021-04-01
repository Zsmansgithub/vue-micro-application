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
            <el-form-item label="下线原因" prop="reason">
              <el-input v-model="newAppForm.reason" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="应用停止时间" prop="appstopdate" required>
              <el-date-picker
                v-model="newAppForm.appstopdate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable='false'
                style="width: 100%;"
                @change="changeappstopdate"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="机器停机时间" prop="shutdowndate" required>
              <el-date-picker
                v-model="newAppForm.shutdowndate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions3"
                :clearable='false'
                style="width: 100%;"
              />
            </el-form-item>
            <!-- <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 1, maxRows: 8}"/>
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col  :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="下线信息">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">最大支持5条信息</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                下线信息
              </label>
              <div>
                <el-table :data="newAppForm.configinfo">
                  <el-table-column prop="project_name_list" label="应用名"  align="center" min-width="5">
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
                      <el-form-item :prop="'configinfo.' + scope.$index + '.project_name_list'" :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                        <el-cascader expand-trigger="hover"
                                    :options="projectOptions"
                                    v-model="scope.row.project_name_list"
                                    filterable
                                    :filter-method="filterMethod"
                                    :show-all-levels="false"
                                    style="width:100%;"
                                    placeholder="请选择产品线及应用名"
                                    @change="vmIpList(scope.row)">
                        </el-cascader>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="project_num" label="项目编号"  align="center" min-width="5">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.project_num'">
                        <el-select v-model="scope.row.project_num" placeholder="请选择项目" style="width: 100%;">
                          <el-option
                            v-for="item in scope.row.poolOptions"
                            :key="'('+item.key+')'+item.display_name"
                            :label="'('+item.key+')'+item.display_name"
                            :value="'('+item.key+')'+item.display_name"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="env" label="环境"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.env'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                        <el-select v-model="scope.row.env" style="width: 100%;" @change="vmIpList(scope.row)">
                          <el-option label="生产" value="生产"/>
                          <el-option label="UAT" value="UAT"/>
                          <el-option label="SIT" value="SIT"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Sip" label="IP地址"  align="center" min-width="9">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.Sip'" :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
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
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-plus" v-if="scope.row.status == 1" circle @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>4"/>
                      <el-button type="danger" icon="el-icon-delete" v-else circle @click="removeDomain(scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="数据库信息" prop="dbinfo">
              <el-cascader expand-trigger="hover"
                          :options="dboptions"
                          :props="{ multiple: true }"
                          v-model="newAppForm.dbinfo"
                          filterable
                          clearable
                          style="width:100%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
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
  import {fetchIPList,getPoolProduct} from '@/api/cmdb'
  import {getHelpDocContent} from '@/api/management/help_doc'
  import {getmysqloracle} from '@/api/zabbix'
  //TODO 这个需要对表进行重新设计，因为存在一次申请多个应用的服务器的情况，系统版本可能也需要拉下来，这个针对windows 需要有特殊设置
  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        value:'',
        help_doc_url:'',
        projectOptions: [],
        dboptions:[],
        buttondisabled:false,
        newAppForm: {
          // rules: {
          //   project_name_list:{type:"array",required:true,message:"不能为空",trigger:"change"},
          //   env:{type:"string",required:true,message:"不能为空",trigger:"change"},
          //   Sip:{type:"array",required:true,message:"不能为空",trigger:"change"},
          // },
          app_name:'',
          reason:'',
          configinfo:[],
          dbinfo:[],
          appstopdate: '',
          shutdowndate:'',
          desc: '',
          routeParams: '',
        },
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now() - 8.64e7 || end.getTime() > Date.now() + 8.64e7*13; //两周
          }
        },
        pickerOptions3: {
          disabledDate(end) {
            return end.getTime() < Date.now() || end.getTime() > Date.now() + 8.64e7*14; //两周
          }
        },
        configinfodictadd: {
          project_name_list: [],
          app_id: '',
          app_cname:'',
          app_name:'',
          env: '生产',
          Sip:[],
          status:1,
          total:0,
          tableData:[],
          poolOptions:[],
          project_num:'',
          checked: false,
        },
        listQuery: {
          page: 1,
          limit: 20,
          app_id: undefined,
          resource_env:undefined
        },
        rules: {
          reason:[{ required: true, message: '请输入下线原因', trigger: 'blur' },],
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
      this.newAppForm.appstopdate = this.initDate(1);
      // this.newAppForm.shutdowndate = this.initDate(8);
      this.changeappstopdate()
      getProductAppCascader().then(response => {
        this.projectOptions = response
      });
      getPoolProduct().then(response => {
        this.poolOptionsA = response
      })
      getmysqloracle().then(response => {
        var dboptions_mysql = response.mysql
        var dboptions_oracle = response.oracle
        this.dboptions = dboptions_oracle.concat(dboptions_mysql)
      })
      this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
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
          this.newAppForm.reason = this.aDetail.reason
          this.newAppForm.configinfo = this.aDetail.configinfo
          this.newAppForm.appstopdate = this.aDetail.appstopdate
          this.newAppForm.shutdowndate = this.aDetail.shutdowndate
          this.newAppForm.desc = this.aDetail.desc
          this.newAppForm.dbinfo = this.aDetail.dbinfo
          this.changeappstopdate()
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
      changeappstopdate(){
        var current = new Date(this.newAppForm.appstopdate).getTime()
        var nexttime = new Date(current+8.64e7*7)
        this.newAppForm.shutdowndate = nexttime.getFullYear()+'-'+((nexttime.getMonth()+1)<10?'0'+(nexttime.getMonth()+1):(nexttime.getMonth()+1))+'-'+(nexttime.getDate()<10?'0'+nexttime.getDate():nexttime.getDate())
        this.pickerOptions3 = {
          disabledDate(end) {
            return end.getTime() < current - 8.64e7 || end.getTime() > current + 8.64e7*13; //两周
          }
        }
      },
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.newAppForm.app_name = ''
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              if(i !== this.newAppForm.configinfo.length-1){
                this.newAppForm.app_name = this.newAppForm.app_name + ','
              }
            }
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
          this.$refs[formName].resetFields()
          this.newAppForm.configinfo = []
          this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))
          this.newAppForm.appstopdate = this.initDate(1);
          this.changeappstopdate()
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate()
        })
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newAppForm.app_name = ''
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              if(i !== this.newAppForm.configinfo.length-1){
                this.newAppForm.app_name = this.newAppForm.app_name + ','
              }
            }
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
            this.newAppForm.app_name = ''
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              if(i !== this.newAppForm.configinfo.length-1){
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
      projectChange(row) {
        row.project_num = ''
        //取产品线大部门
        var choose = row.project_name_list
        choose = choose[0].split('-')[0];
        row.poolOptions = this.poolOptionsA[choose]
        if (row.poolOptions) {
        } else {
          row.poolOptions = []
        }
        // 应用已关联项目,直接取到
        fetchAppInfo(row.app_id).then(response => {
          row.app_name = response.app_name
          row.app_cname = response.app_cname
          var project_num = response.pool_cname
          if (project_num !== '') {
            for (var i = 0; i < row.poolOptions.length; i++) {
              if (row.poolOptions[i].display_name == project_num) {
                row.project_num = '(' + row.poolOptions[i].key + ')' + row.poolOptions[i].display_name
                return
              }
            }
          }
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
          if( this.listQuery.page < row.total/20 ){
            this.listQuery.page++
            this.data(this.listQuery,row)
          } else{
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
        this.projectChange(row)
        row.tableData = []
        row.Sip = []
        row.checked = false
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
        this.data(this.listQuery,row)
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
