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
                           style="width:100%;"
                           placeholder="请选择产品线及应用名"
                           @change="projectChange">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="需求描述" prop="needdesc" required>
              <el-input v-model="newAppForm.needdesc" type="textarea" placeholder="请填写需求描述" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
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
            <!-- <el-form-item label="硬件配置" prop="info">
              <el-select v-model.trim="newAppForm.info" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in infooptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="资源类型" prop="type">
              <!-- <el-select v-model.trim="newAppForm.type" placeholder="请选择" style="width: 100%" @change="changeexpecteddate"> -->
              <el-select v-model.trim="newAppForm.type" placeholder="请选择" style="width: 100%" disabled>
                <el-option label="独占型" value="独占型"/>
                <!-- <el-option label="共享型" value="共享型"/> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item label="ES版本" prop="es">
              <el-select v-model.trim="newAppForm.es" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in esoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="11">
            <el-form-item label="申请数量" prop="sum">
              <el-input-number v-model.trim="newAppForm.sum" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="QPS" prop="qps">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">QPS = 并发量 / 平均响应时间</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                QPS
              </label>
              <el-input-number v-model.trim="newAppForm.qps" controls-position="right" :min="1" :precision="0"
                               :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="TPS" prop="tps">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">TPS 即Transactions Per Second的缩写，每秒处理的事务数目</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                TPS
              </label>
              <el-input-number v-model.trim="newAppForm.tps" controls-position="right" :min="1" :precision="0"
                               :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="数据保留周期" prop="datadate">
              <el-input v-model.trim="newAppForm.datadate" placeholder="请输入数据保留周期"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="报文大小" prop="message">
              <el-input v-model.trim="newAppForm.message" placeholder="请输入报文大小"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
              <span v-if="isESandDZ" style="color:red;">应用的应用类型不是ES,不能提交<br /></span>
              <!-- <el-tooltip content="应用的应用类型不是ES" placement="top" :disabled="!isESandDZ"> -->
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="saveDraftsForm('newAppForm')" :disabled="isESandDZ" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :disabled="isESandDZ" :loading="buttondisabled">保存草稿</el-button>
              <!-- </el-tooltip> -->
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <!-- <el-tooltip content="应用的应用类型不是ES" placement="top" :disabled="!isESandDZ"> -->
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="submitForm('newAppForm')" :disabled="isESandDZ" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :disabled="isESandDZ" :loading="buttondisabled">提交草稿</el-button>
              <!-- </el-tooltip> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {fetchAppInfo} from '@/api/cmdbs/app_manage'
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow, getWFLine} from '@/api/workflow/app_manage'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import {getHelpDocContent} from '@/api/management/help_doc'
  import {getPoolProduct} from '@/api/cmdb'

  export default {
    name: 'AppApplyForm',
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        aDetail: {},
        help_doc_url: '',
        projectOptions: [],
        // infooptions:[],
        poolOptionsA: [],
        poolOptions: [],
        disabledPool: true,
        isESandDZ:false,
        buttondisabled:false,
        esoptions: [{value: '6.4', label: '6.4'}, {value: '6.7', label: '6.7'}, {value: '7.4', label: '7.4'}],
        newAppForm: {
          project_name_list: [],
          app_name: '',
          app_cname: '',
          app_type:'',
          app_id: '',
          project_num: '',
          expecteddate: '',
          desc: '',
          needdesc: '',
          // info:'',
          // es:'',
          // sum: 1,
          type: '独占型',
          message: '',
          datadate: '',
          qps: undefined,
          tps: undefined,
          // fileList:[],
          routeParams: '',
        },
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now() + 86400000 * 6
          }
        },
        rules: {
          project_name_list: [{type: 'array', required: true, message: '请选择产品线及应用名', trigger: 'change'},],
          project_num: [{required: true, message: '请选择项目编号', trigger: 'change'},],
          message: [{required: true, message: '请输入报文大小', trigger: 'blur'},],
          qps: [{required: true, message: '请输入QPS', trigger: 'blur'},],
          tps: [{required: true, message: '请输入TPS', trigger: 'blur'},],
          datadate: [{required: true, message: '请输入数据保留周期', trigger: 'blur'},],
          type: [{required: true, message: '请选择资源类型', trigger: 'blur'},],
          needdesc: [{required: true, message: '请输入需求描述', trigger: 'blur'},],
          // info: [{ required: true, message: '请选择配置', trigger: 'blur' },],
          // es: [{ required: true, message: '请选择ES版本', trigger: 'blur' },],
          // desc:[{ required: true, message: '请输入备注描述', trigger: 'blur' },],
          // sum:[{type:"number",required:true,message:"数量不能为空",trigger:"blur"},],
        },
      }
    },
    watch: {
      "newAppForm.project_name_list": function (newValue, oldValue) {
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
      this.newAppForm.expecteddate = this.initDate(7);
      getProductAppCascader().then(response => {
        this.projectOptions = response
      })
      getPoolProduct().then(response => {
        this.poolOptionsA = response
        this.getpooloption()
      })
      this.renderDraftsData()
    },
    methods: {
      // 独占型day+7 共享型day+3
      // changeexpecteddate() {
      //   if ( this.newAppForm.type == '独占型' && this.newAppForm.app_type !== 'ES') {
      //     this.isESandDZ = true
      //   } else{
      //     this.isESandDZ = false
      //   }
      //   if (this.newAppForm.type == '独占型') {
      //     this.newAppForm.expecteddate = this.initDate(7);
      //     this.pickerOptions2 = {
      //       disabledDate(end) {
      //         return end.getTime() < Date.now() + 86400000 * 6
      //       }
      //     }
      //   } else {
      //     this.newAppForm.expecteddate = this.initDate(3);
      //     this.pickerOptions2 = {
      //       disabledDate(end) {
      //         return end.getTime() < Date.now() + 86400000 * 2
      //       }
      //     }
      //   }
      // },
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
          this.newAppForm.app_name = this.aDetail.app_name
          this.newAppForm.app_cname = this.aDetail.app_cname
          this.newAppForm.app_type = this.aDetail.app_type
          this.newAppForm.project_num = this.aDetail.project_num
          this.newAppForm.expecteddate = this.aDetail.expecteddate
          this.newAppForm.desc = this.aDetail.desc
          this.newAppForm.needdesc = this.aDetail.needdesc
          // this.newAppForm.info = this.aDetail.info
          // this.newAppForm.es = this.aDetail.es
          // this.newAppForm.sum = this.aDetail.sum
          this.newAppForm.type = this.aDetail.type
          this.newAppForm.message = this.aDetail.message
          this.newAppForm.datadate = this.aDetail.datadate
          this.newAppForm.qps = this.aDetail.qps
          this.newAppForm.tps = this.aDetail.tps
          // this.newAppForm.fileList = this.aDetail.fileList
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
              this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
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
              this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
                this.$router.push('/workflow/workflow_list');
              })
            }).catch(err => {
              console.log(err)
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
        } else {
          // this.newAppForm.fileList = []
          this.poolOptions = []
          // this.newAppForm = this.$options.data().newAppForm;
          this.$refs[formName].resetFields()
          this.newAppForm.expecteddate = this.initDate(7);
          this.isESandDZ = false;
          this.disabledPool = true;
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        });
      },
      getpooloption() {
        if (this.$route.params.detailData_edit) {
          this.projectChange(this.newAppForm.project_name_list)
          this.newAppForm.project_num = this.aDetail.project_num
        }
      },
      projectChange(choose) {
        this.newAppForm.project_num = ''
        if (this.newAppForm.project_name_list.length == 0) {
          this.poolOptions = []
          this.isESandDZ = false
          return
        }
        this.disabledPool = false;
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
          this.newAppForm.app_type = response.app_type
          if ( this.newAppForm.type == '独占型' && this.newAppForm.app_type !== 'ES') {
            this.isESandDZ = true
          } else{
            this.isESandDZ = false
          }
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
      getHelpDoc() {
        // getHelpDocContent({board:'workflow',title:'新建申请单-'+this.$route.params.name }).then(response => {
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
      // handleRemove(file, fileList) {
      //   this.newAppForm.fileList = []
      //   this.newAppForm.fileList = fileList
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
      //   this.newAppForm.fileList = []
      //   this.newAppForm.fileList = fileList
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

  a {
    color: #1890ff;
  }
</style>
