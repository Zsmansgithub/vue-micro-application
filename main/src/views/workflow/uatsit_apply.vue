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
                          placeholder="请选择产品线及应用名">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="UAT_IP" prop="uatip" :rules="{message: '请输入IP列表,以英文逗号或回车分隔',trigger: 'blur',validator: validateSipaddress}">
              <el-input v-model="newAppForm.uatip" type="textarea" :autosize="{ minRows: 2, maxRows: 15}" placeholder="请输入IP列表,以英文逗号或回车分隔" @change="inputuatip"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="SIT_IP" prop="sitip" :rules="{message: '请输入IP列表,以英文逗号或回车分隔',trigger: 'blur',validator: validateSipaddress}">
              <el-input v-model="newAppForm.sitip" type="textarea" :autosize="{ minRows: 2, maxRows: 15}" placeholder="请输入IP列表,以英文逗号或回车分隔" @change="inputsitip"/>
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
  import {fetchIPList,getuatsitlist} from '@/api/cmdb'
  import {getHelpDocContent} from '@/api/management/help_doc'
  //TODO 这个需要对表进行重新设计，因为存在一次申请多个应用的服务器的情况，系统版本可能也需要拉下来，这个针对windows 需要有特殊设置
  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        validateSipaddress:(rule, value, callback) => {
          if (value) {
            if (/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])[\n,])*(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value)) {
              callback()
            } else {
              callback(new Error('IP填写不正确'))
            }
          } else {
            callback()
          }
        },
        buttondisabled:false,
        value:'',
        help_doc_url:'',
        uat_list:[],
        sit_list:[],
        notuat:[],
        notsit:[],
        projectOptions: [],
        newAppForm: {
          project_name_list: [],
          app_id: '',
          app_cname:'',
          app_name:'',
          uatip:'',
          sitip:'',
          desc:'',
          routeParams: '',
        },
        rules: {
          project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
        },
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
      getProductAppCascader().then(response => {
        this.projectOptions = response
      });
      getuatsitlist().then(response => {
        this.uat_list = response.uat_list
        this.sit_list = response.sit_list
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
          this.newAppForm.uatip = this.aDetail.uatip
          this.newAppForm.sitip = this.aDetail.sitip
          this.newAppForm.desc = this.aDetail.desc
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
        }
      },
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.newAppForm.uatip!==''||this.newAppForm.sitip!=='') {
              fetchAppInfo(this.newAppForm.app_id).then(response => {
                this.newAppForm.app_name = response.app_name
                this.newAppForm.app_cname = response.app_cname
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
              })
            } else{
              this.$message({
                message: '请填写ip',
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
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.newAppForm.uatip!==''||this.newAppForm.sitip!=='') {
              //提交草稿时，需要传入的6为该类型的申请单对应的node表中的node_id=start对应的id值
              fetchAppInfo(this.newAppForm.app_id).then(response => {
                this.newAppForm.app_name = response.app_name
                this.newAppForm.app_cname = response.app_cname
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
              })
            } else{
              this.$message({
                message: '请填写ip',
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
      // 首次保存草稿,为新增数据
      saveDraftsForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.newAppForm.uatip!==''||this.newAppForm.sitip!=='') {
              fetchAppInfo(this.newAppForm.app_id).then(response => {
                this.newAppForm.app_name = response.app_name
                this.newAppForm.app_cname = response.app_cname
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
              })
            } else{
              this.$message({
                message: '请填写ip',
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
      inputuatip(){
        if (this.newAppForm.uatip!=='') {
          // 全部\n替换为英文逗号
          var reg = new RegExp( '\n' , "g" )
          var uat_array = this.newAppForm.uatip.replace( reg , ',' ).split(',')
          this.notuat = []
          var uat = []
          for (var i = 0; i < uat_array.length; i++) {
            if (this.uat_list.indexOf(uat_array[i])==-1) {
              this.notuat.push(uat_array[i])
            } else {
              uat.push(uat_array[i])
            }
          }
          if (this.notuat.length !== 0) {
            this.$alert('以下不是UAT_IP:\n'+String(this.notuat)).then(_ => {}).catch(_ => {});
          }
          this.newAppForm.uatip = String(uat)
        }
      },
      inputsitip(){
        if (this.newAppForm.sitip!=='') {
          // 全部\n替换为英文逗号
          var reg = new RegExp( '\n' , "g" )
          var sit_array = this.newAppForm.sitip.replace( reg , ',' ).split(',')
          this.notsit = []
          var sit = []
          for (var i = 0; i < sit_array.length; i++) {
            if (this.sit_list.indexOf(sit_array[i])==-1) {
              this.notsit.push(sit_array[i])
            } else {
              sit.push(sit_array[i])
            }
          }
          if (this.notsit.length !== 0) {
            this.$alert('以下不是SIT_IP:\n'+String(this.notsit)).then(_ => {}).catch(_ => {});
          }
          this.newAppForm.sitip = String(sit)
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
