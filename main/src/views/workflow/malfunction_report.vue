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
          <!-- <el-col :span="24" class="col-1400-16 col-1400-offset-2"> -->
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="标题" prop="edit_title">
              <!-- <el-input v-model="newAppForm.edit_title" placeholder="请输入标题"></el-input> -->
              <el-select v-model="newAppForm.edit_title" placeholder="请选择标题" filterable style="width: 100%;">
                <el-option v-for="item in titleOptions"
                  :key="'('+item.number+')'+item.break_title"
                  :label="'('+item.number+')'+item.break_title"
                  :value="'('+item.number+')'+item.break_title"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="是否复盘" prop="is_fupan">
              <el-switch v-model="newAppForm.is_fupan" active-text="是" inactive-text="否" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="部门" prop="edit_type" required>
              <el-select v-model="newAppForm.edit_type" style="width: 100%;" @change="getpool">
                <el-option v-for="item in appOptions" :key="item.key" :label="item.display_name" :value="item.display_name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="项目类型" prop="pool_type" required>
              <el-select v-model="newAppForm.pool_type" style="width: 100%;">
                <el-option label="标准类" value="标准类"/>
                <el-option label="维护类" value="维护类"/>
                <el-option label="重构类" value="重构类"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="项目编号" prop="project_num" required>
              <!-- <el-select v-model="newAppForm.project_num" placeholder="请选择项目(如果没有请联系管理员录入)" style="width: 100%;" :disabled="disabledPool"> -->
              <el-select v-model="newAppForm.project_num" placeholder="请选择项目(如果没有请联系管理员录入)" filterable style="width: 100%;">
                <el-option v-for="item in poolOptions"
                  :key="'('+item.key+')'+item.display_name"
                  :label="'('+item.key+')'+item.display_name"
                  :value="'('+item.key+')'+item.display_name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="是否发布导致" prop="is_fabu">
              <el-switch v-model="newAppForm.is_fabu" active-text="是" inactive-text="否" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="措施执行方" prop="improvement_user">
              <!-- <el-input v-model="newAppForm.improvement_user" placeholder="请输入"/> -->
              <el-select
                v-model="newAppForm.improvement_user"
                filterable
                clearable
                style="width: 100%;">
                <el-option
                  v-for="item in departOptions"
                  :key="item.ouid"
                  :label="item.ou_name"
                  :value="item.ou_name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="完成时间" prop="edit_time">
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
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="验收人" prop="check_user">
              <!-- <el-input v-model="newAppForm.check_user" placeholder="请输入"/> -->
              <el-select
                v-model="newAppForm.check_user"
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
            <el-form-item label="验收时间" prop="check_time">
              <el-date-picker
                v-model="newAppForm.check_time"
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
            <el-form-item label="责任人">
              <span style="color:red;">所有责任人权重相加应为100,即合计为100</span>
              <!-- <el-input v-model="newAppForm.responsibility" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/> -->
              <el-table :data="newAppForm.responsibility" show-summary>
                <el-table-column prop="person" label="责任人"  align="center" min-width="11">
                  <template slot-scope="scope">
                    <el-form-item :prop="`responsibility.` + scope.$index + '.person'" :rules="{message: '请选择',required:true,trigger: 'change'}">
                      <el-select v-model="scope.row.person" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
                        <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="'('+item.value+')'+item.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="weight" label="权重"  align="center" min-width="11">
                  <template slot-scope="scope">
                    <el-form-item :prop="`responsibility.` + scope.$index + '.weight'" :rules="{message: '请输入1-100',required:true,trigger: 'blur'}">
                      <el-input-number v-model.trim="scope.row.weight" controls-position="right" :min="1" :max="100" :precision="0" :controls="false" style="width: 100%;"></el-input-number>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="2">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;" @click="addDomain2()" :disabled="newAppForm.responsibility.length>4">
                    </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removeDomain2(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="事件描述" prop="event">
              <el-input v-model="newAppForm.event" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="原因分析" prop="reason">
              <el-input v-model="newAppForm.reason" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="解决方法" prop="way">
              <el-input v-model="newAppForm.way" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="改进措施" prop="improvement">
              <el-input v-model="newAppForm.improvement" type="textarea" placeholder="最多1000字符" maxlength="1000" :autosize="{ minRows: 2, maxRows: 8}"/>
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
                <div slot="tip" class="el-upload__tip"><!-- <span style="color: red;">*</span> -->请上传附件，且单个文件不超过5M</div>
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
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,getnoreporttitle} from '@/api/workflow/app_manage'
  import {fetchIPList,fetchProjectList,getPoolProduct} from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getUserInfo} from '@/api/zabbix/user_info'
  import { getHelpDocContent } from '@/api/management/help_doc'
  import { getDepart } from '@/api/manage_monitor/user_department'

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
        appOptions:[],
        userOptions: [],
        poolOptionsA:[],
        poolOptions:[],
        titleOptions:[],
        departOptions:[],
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now()
          }
        },
        newAppForm: {
          app_name:'',
          edit_title:'',
          edit_type:'',
          pool_type:'',
          project_num:'',
          is_fupan:'0',
          is_fabu:'0',
          event:'',
          reason:'',
          way:'',
          improvement:'',
          improvement_user:'',
          edit_time:'',
          check_user:[],
          check_time:'',
          responsibility:[],
          desc: '',
          fileList: [],
          routeParams: '',
        },
        tableadd:{
          person:'',
          weight:undefined,
          status:1,
        },
        rules: {
          edit_title:[{ required: true, message: '请选择标题', trigger: 'change' },],
          edit_type:[{ required: true, message: '请选择部门', trigger: 'change' },],
          pool_type:[{ required: true, message: '请选择项目类型', trigger: 'change' },],
          project_num:[{ required: true, message: '请选择项目编号', trigger: 'change' },],
          is_fabu:[{ required: true, message: '请选择', trigger: 'blur' },],
          is_fupan:[{ required: true, message: '请选择', trigger: 'blur' },],
          event:[{ required: true, message: '请输入事件过程描述', trigger: 'blur' },],
          reason:[{ required: true, message: '请输入原因分析', trigger: 'blur' },],
          way:[{ required: true, message: '请输入解决方法', trigger: 'blur' },],
          improvement:[{ required: true, message: '请输入后续改进措施', trigger: 'blur' },],
          improvement_user:[{ required: true, message: '请选择措施执行方', trigger: 'change' },],
          edit_time:[{ required: true, message: '请选择完成时间', trigger: 'change' },],
          check_user:[{ required: true, message: '请选择验收人', trigger: 'change' },],
          check_time:[{ required: true, message: '请选择验收时间', trigger: 'change' },],
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
      //项目里 部门
      this.getProjectList()
      //按部门分类的项目
      getPoolProduct().then(response => {
        this.poolOptionsA = response
        if (this.$route.params.detailData_edit) {
          this.poolOptions = this.poolOptionsA[this.newAppForm.edit_type]
        }
      })
      //一级部门+二级部门
      getDepart().then(response => {
        this.departOptions = response
      })
      //标题
      getnoreporttitle().then(response => {
        this.titleOptions = response.data
      })
      this.newAppForm.responsibility.push(Object.assign({}, this.tableadd));
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
          this.newAppForm.edit_title = this.aDetail.edit_title
          this.newAppForm.edit_type = this.aDetail.edit_type
          this.newAppForm.pool_type = this.aDetail.pool_type
          this.newAppForm.project_num = this.aDetail.project_num
          this.newAppForm.is_fabu = this.aDetail.is_fabu
          this.newAppForm.is_fupan = this.aDetail.is_fupan
          this.newAppForm.event = this.aDetail.event
          this.newAppForm.reason = this.aDetail.reason
          this.newAppForm.way = this.aDetail.way
          this.newAppForm.improvement = this.aDetail.improvement
          this.newAppForm.improvement_user = this.aDetail.improvement_user
          this.newAppForm.edit_time = this.aDetail.edit_time
          this.newAppForm.check_user = this.aDetail.check_user
          this.newAppForm.check_time = this.aDetail.check_time
          this.newAppForm.responsibility = this.aDetail.responsibility
          this.newAppForm.desc = this.aDetail.desc
          this.newAppForm.fileList = this.aDetail.fileList
          this.poolOptions = this.poolOptionsA[this.newAppForm.edit_type]
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
        }
      },
      addDomain2() {
        console.log(this.newAppForm.responsibility)
        const respon = Object.assign({}, this.tableadd)
        respon.status = 2
        this.newAppForm.responsibility.push(respon)
      },
      removeDomain2(item) {
        var index = this.newAppForm.responsibility.indexOf(item)
        if (index !== -1) {
          this.newAppForm.responsibility.splice(index, 1)
        }
      },
      getProjectList() {
        fetchProjectList().then(response => {
          const appnameOptions = []
          for (const i of response) {
            appnameOptions.push({
              display_name: i.unit, key: i.id
            })
          }
          // this.appnameOptions = appnameOptions
          this.appOptions = appnameOptions
          let temp = [{display_name: '承诺达产品部', key: 201}]
          this.appOptions = this.appOptions.concat(temp)
        })
      },
      getpool(){
        // console.log(this.newAppForm.edit_type)
        this.newAppForm.project_num = ''
        this.poolOptions = this.poolOptionsA[this.newAppForm.edit_type]
      },
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            var sum = 0
            for (var i = 0; i < this.newAppForm.responsibility.length; i++) {
              sum=sum+this.newAppForm.responsibility[i].weight
            }
            if (sum == 100) {
            // if(this.newAppForm.fileList.length !==0){
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
                message: '责任人合计应为100',
                type: 'warning',
              })
              return false
            }
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
        }else{
          // this.newAppForm = this.$options.data().newAppForm;
          this.$refs[formName].resetFields()
          this.newAppForm.responsibility = []
          this.newAppForm.responsibility.push(Object.assign({}, this.tableadd));
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
            var sum = 0
            for (var i = 0; i < this.newAppForm.responsibility.length; i++) {
              sum=sum+this.newAppForm.responsibility[i].weight
            }
            if (sum == 100) {
            // if(this.newAppForm.fileList.length !==0){
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
                message: '责任人合计应为100',
                type: 'warning',
              })
              return false
            }
            // } else{
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

      // 首次保存草稿,为新增数据，只校验英文名是否填写
      saveDraftsForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            var sum = 0
            for (var i = 0; i < this.newAppForm.responsibility.length; i++) {
              sum=sum+this.newAppForm.responsibility[i].weight
            }
            if (sum == 100) {
            // if(this.newAppForm.fileList.length !==0){
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
                message: '责任人合计应为100',
                type: 'warning',
              })
              return false
            }
            // } else{
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
