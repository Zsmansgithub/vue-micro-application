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
            <el-form-item label="参与人员" prop="todouser" required>
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
            <el-form-item label="测试完成时间" prop="edit_time">
              <el-date-picker
                v-model="newAppForm.edit_time"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="技术简介" prop="introduce">
              <el-input v-model="newAppForm.introduce" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="引进原因" prop="reason">
              <el-input v-model="newAppForm.reason" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="技术优势" prop="advantages">
              <el-input v-model="newAppForm.advantages" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="技术劣势" prop="disadvantages">
              <el-input v-model="newAppForm.disadvantages" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="应用场景" prop="app_touse">
              <el-input v-model="newAppForm.app_touse" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="引进计划" prop="plan">
              <el-input v-model="newAppForm.plan" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="资源投入" prop="resource">
              <el-input v-model="newAppForm.resource" type="textarea" placeholder="请输入资源配置信息,最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
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
                <div slot="tip" class="el-upload__tip"><span style="color: red;">*</span>请上传附件，且单个文件不超过5M</div>
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
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now()
          }
        },
        newAppForm: {
          app_name:'',
          edit_title:'',
          introduce:'',
          reason:'',
          advantages:'',
          disadvantages:'',
          app_touse:'',
          plan:'',
          todouser:[],
          edit_time:'',
          resource:'',
          desc: '',
          fileList: [],
          routeParams: '',
        },
        rules: {
          edit_title:[{ required: true, message: '请输入标题', trigger: 'blur' },],
          introduce:[{ required: true, message: '请输入技术简介', trigger: 'blur' },],
          reason:[{ required: true, message: '请输入引进原因', trigger: 'blur' },],
          advantages:[{ required: true, message: '请输入技术优势', trigger: 'blur' },],
          disadvantages:[{ required: true, message: '请输入技术劣势', trigger: 'blur' },],
          app_touse:[{ required: true, message: '请输入应用场景', trigger: 'blur' },],
          plan:[{ required: true, message: '请输入引进计划', trigger: 'blur' },],
          resource:[{ required: true, message: '请输入资源投入', trigger: 'blur' },],
          todouser:[{ required: true, message: '请选择参与人员', trigger: 'change' },],
          edit_time:[{ required: true, message: '请选择测试完成时间', trigger: 'change' },],
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
          this.newAppForm.introduce = this.aDetail.introduce
          this.newAppForm.app_touse = this.aDetail.app_touse
          this.newAppForm.advantages = this.aDetail.advantages
          this.newAppForm.disadvantages = this.aDetail.disadvantages
          this.newAppForm.edit_title = this.aDetail.edit_title
          this.newAppForm.todouser = this.aDetail.todouser
          this.newAppForm.edit_time = this.aDetail.edit_time
          this.newAppForm.reason = this.aDetail.reason
          this.newAppForm.plan = this.aDetail.plan
          this.newAppForm.resource = this.aDetail.resource
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
            if(this.newAppForm.fileList.length !==0){
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
