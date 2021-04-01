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
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="标题" prop="edit_title">
              <el-input v-model="newAppForm.edit_title" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="变更类型" prop="edit_type" required>
              <el-select v-model="newAppForm.edit_type" style="width: 100%;">
                <el-option label="主机类" value="主机类"/>
                <el-option label="安全类" value="安全类"/>
                <el-option label="网络类" value="网络类"/>
                <el-option label="数据库类" value="数据库类"/>
                <el-option label="中间件类" value="中间件类"/>
                <el-option label="配置类" value="配置类"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="变更级别" prop="edit_level" required>
              <el-select v-model="newAppForm.edit_level" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="严重" value="严重"/>
                <el-option label="一般" value="一般"/>
                <el-option label="无影响" value="无影响"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="变更时间" prop="edit_time" required>
              <!-- <el-date-picker
                v-model="newAppForm.edit_time"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable=false
                style="width: 100%;"/> -->
              <el-date-picker
                v-model="newAppForm.edit_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="影响范围" prop="alarm">
              <el-input v-model="newAppForm.alarm" placeholder="请输入影响范围"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="实施人员" prop="todouser" required>
              <el-select
                v-model="newAppForm.todouser"
                filterable
                clearable
                multiple
                :multiple-limit="10"
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="通知人员" prop="toknowuser" required>
              <el-select
                v-model="newAppForm.toknowuser"
                filterable
                clearable
                multiple
                :multiple-limit="10"
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
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
            <el-form-item label="风险评估" prop="danger">
              <el-input v-model="newAppForm.danger" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col  :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="实施步骤">
              <el-table :data="newAppForm.configinfo">
                <el-table-column prop="start_time" label="开始时间"  align="center" min-width="2">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.start_time'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.start_time" placeholder="请输入" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="end_time" label="结束时间"  align="center" min-width="2">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.end_time'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.end_time" placeholder="请输入" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="implementer" label="实施人"  align="center" min-width="3">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.implementer'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                      <!-- <el-input v-model="scope.row.implementer" placeholder="请输入" style="width: 100%;"></el-input> -->
                      <el-select v-model="scope.row.implementer" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
                        <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="'('+item.value+')'+item.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="step" label="实施内容或步骤"  align="center" min-width="4">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.step'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.step" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="1">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" icon="el-icon-plus" @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>29"/>
                    <el-button type="text" icon="el-icon-delete" v-if="scope.row.status !== 1" style="color: red;" @click="removeDomain(scope.row)" /> -->
                    <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;" @click="addDomain(scope.row)" :disabled="newAppForm.configinfo.length>29">
                    </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removeDomain(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
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
                <div slot="tip" class="el-upload__tip"><span style="color: red;">*</span>
                <!-- 请上传附件，且单个文件不超过5M -->请上传项目实施相关文档
                </div>
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
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine} from '@/api/workflow/app_manage'
  import {fetchIPList} from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getUserInfo} from '@/api/zabbix/user_info'
  import { getHelpDocContent } from '@/api/management/help_doc'

  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        buttondisabled:false,
        help_doc_url:'',
        aDetail:{},
        userOptions: [],
        // pickerOptions2: {
        //   disabledDate(end) {
        //     return end.getTime() < Date.now()
        //   }
        // },
        listQuery: {
          page: 1,
          limit: 20,
          app_id: undefined,
          resource_env:undefined
        },
        newAppForm: {
          app_name:'',
          edit_type: '',
          edit_level: '',
          edit_time:'',
          alarm:'',
          todouser: [],
          toknowuser: [],
          edit_title:'',
          configinfo:[],
          danger:'',
          desc: '',
          fileList: [],
          routeParams: '',
        },
        configinfodictadd: {
          start_time:'',
          end_time:'',
          implementer:'',
          step:'',
          status:1,
        },
        rules: {
          edit_type:[{ required: true, message: '请选择变更类型', trigger: 'blur' },],
          edit_level:[{ required: true, message: '请选择变更级别', trigger: 'blur' },],
          edit_time:[{ required: true, message: '请选择变更时间', trigger: 'change' },],
          todouser:[{ required: true, message: '请选择实施人员', trigger: 'change' },],
          toknowuser:[{ required: true, message: '请选择通知人员', trigger: 'change' },],
          alarm:[{ required: true, message: '请输入影响范围', trigger: 'blur' },],
          edit_title:[{ required: true, message: '请输入标题', trigger: 'blur' },],
          danger:[{ required: true, message: '请输入风险评估', trigger: 'blur' },],
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
      getUserInfo().then(response => {
        this.userOptions = response
      });
      this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))
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
          this.newAppForm.edit_type = this.aDetail.edit_type
          this.newAppForm.edit_level = this.aDetail.edit_level
          this.newAppForm.edit_time = this.aDetail.edit_time
          this.newAppForm.alarm = this.aDetail.alarm
          this.newAppForm.todouser = this.aDetail.todouser
          this.newAppForm.toknowuser = this.aDetail.toknowuser
          this.newAppForm.edit_title = this.aDetail.edit_title
          this.newAppForm.configinfo = this.aDetail.configinfo
          this.newAppForm.danger = this.aDetail.danger
          this.newAppForm.desc = this.aDetail.desc
          this.newAppForm.fileList = this.aDetail.fileList
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
        }
      },
      addDomain(item) {
        var index = this.newAppForm.configinfo.indexOf(item)
        const configinfo = Object.assign({}, this.configinfodictadd)
        configinfo.status = 2
        this.newAppForm.configinfo.splice(index+1,0,configinfo)
      },
      removeDomain(item) {
        var index = this.newAppForm.configinfo.indexOf(item)
        if (index !== -1) {
          this.newAppForm.configinfo.splice(index, 1)
        }
      },
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if(this.newAppForm.fileList.length !==0){
              // this.newAppForm.app_name = ''
              // for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              //   this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              //   if ( i == 2&&i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name) {
              //     this.newAppForm.app_name = this.newAppForm.app_name + '……'
              //     break;
              //   }
              //   if(i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name){
              //     this.newAppForm.app_name = this.newAppForm.app_name + ','
              //   }
              // }
              this.newAppForm.app_name = this.newAppForm.edit_title
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
            } else{
              this.$message({
                message: '请上传附件',
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
        }else{
          // this.newAppForm = this.$options.data().newAppForm;
          this.$refs[formName].resetFields()
          this.newAppForm.fileList = []
          this.newAppForm.configinfo = []
          this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        });
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.newAppForm.fileList.length !==0){
              // this.newAppForm.app_name = ''
              // for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              //   this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              //   if ( i == 2&&i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name) {
              //     this.newAppForm.app_name = this.newAppForm.app_name + '……'
              //     break;
              //   }
              //   if(i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name){
              //     this.newAppForm.app_name = this.newAppForm.app_name + ','
              //   }
              // }
              this.newAppForm.app_name = this.newAppForm.edit_title
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
            } else{
              this.$message({
                message: '请上传附件',
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

      // 首次保存草稿,为新增数据，只校验英文名是否填写
      saveDraftsForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if(this.newAppForm.fileList.length !==0){
              // this.newAppForm.app_name = ''
              // for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              //   this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              //   if ( i == 2&&i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name) {
              //     this.newAppForm.app_name = this.newAppForm.app_name + '……'
              //     break;
              //   }
              //   if(i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name){
              //     this.newAppForm.app_name = this.newAppForm.app_name + ','
              //   }
              // }
              this.newAppForm.app_name = this.newAppForm.edit_title
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
            } else{
              this.$message({
                message: '请上传附件',
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
