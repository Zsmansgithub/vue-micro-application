<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
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
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <!-- <el-form-item label="项目编号" prop="project_num">
              <el-input v-model.trim="newAppForm.project_num" placeholder="请输入项目编号"></el-input>
            </el-form-item> -->
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
              <span style="color: red;">若应用的应用类型不是mysql/oracle/mongodb,配置里的DB不可选；若应用的应用类型不是HOTDB,配置里的HOTDB不可选</span>
              <div>
                <el-table :data="newAppForm.configinfo">
                  <el-table-column prop="env" label="环境类型"  align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.env'">
                        <el-select v-model="scope.row.env" placeholder="请选择" style="width: 100%">
                          <el-option v-for="item in envoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sys" label="系统版本"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.sys'">
                        <system-version :selectedOptions="[parseInt(Object.keys(os_type)[Object.values(os_type).indexOf(scope.row.sys_type)]),scope.row.sys_version]"
                                    @sendValueToParent="getValueFromChild($event, scope.$index)" :key="versionkey"></system-version>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="应用"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.type'" :rules="{required:true,message:'类型-应用不能为空',trigger:'change'}">
                        <el-select v-model="scope.row.type" placeholder="请选择" style="width: 100%" @change="getinfo(scope.row)">
                          <el-option v-for="item in typeoptions" :key="item" :label="item" :value="item"
                          :disabled="newAppForm.app_type !== 'MySql' && newAppForm.app_type !== 'MySQL' && newAppForm.app_type !== 'Oracle' && newAppForm.app_type !== 'MongoDB' && item=='DB' ||
                          newAppForm.app_type !== 'HotDB' && item=='HOTDB'?true:false"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="info" label="配置"  align="center" min-width="7">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.info'" :rules="{required:true,message:'配置不能为空',trigger:'change'}">
                        <el-select v-model="scope.row.info" placeholder="请选择" style="width: 100%" @change="getmoney(scope.row)">
                          <el-option v-for="item in infooptions" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sum" label="申请数量"  align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.sum'" :rules="{type:'number',required:true,message:'数量不能为空',trigger:'blur'}">
                        <el-input-number v-model="scope.row.sum" controls-position="right" :min="1" :precision="0" :controls="false" style="width:100%"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="money" label="价格(元)"  align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.money'">
                        {{scope.row.money*scope.row.sum}}
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
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">为了更容易通过申请，请填写详细的说明信息</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                备注描述
              </label>
              <el-input v-model="newAppForm.desc" type="textarea" placeholder="如需其他配置,请写在备注描述" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
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
                <div slot="tip" class="el-upload__tip"><span style="color: red;">*</span>
                为了提高主机组申请通过率，请上传项目立项和评审材料，包含资源评估表
                <!-- 请上传附件，且单个文件不超过5M -->
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
import { fetchAppInfo } from '@/api/cmdbs/app_manage'
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,getphysical } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import { getProductAppCascader} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
import { getPoolProduct } from '@/api/cmdb'
import SystemVersion from '@/components/Tools/SystemVersion_physical'
const os_type={
     1:'CentOS',
     2:'RedHat',
     3:'ESXi',
     4:'Oracle_linux',
     5:'Windows',
     6:'Ubuntu',
     10:'AIX',
  };

export default {
  name: 'AppApplyForm',
  directives: { waves },
  components: {SystemVersion},
  mixins: [resize, sessionNewAppForm],
  data() {
    return {
      aDetail:{},
      help_doc_url:'',
      os_type: os_type,
      projectOptions:[],
      poolOptionsA:[],
      poolOptions:[],
      versionkey:1,
      disabledPool: true,
      buttondisabled:false,
      envoptions: [{ value:'UAT', label:'UAT' }, { value:'SIT', label:'SIT' },{ value:'生产', label:'生产' }],
      physicalOptions:[],
      typeoptions:[],
      infooptions:[],
      newAppForm: {
        // rules:{
        //   type:{
        //     required:true,
        //     message:"类型-应用不能为空",
        //     trigger:"change"
        //   },
        //   info:{
        //     required:true,
        //     message:"配置不能为空",
        //     trigger:"change"
        //   },
        //   sum:{
        //     type:"number",
        //     required:true,
        //     message:"数量不能为空",
        //     trigger:"blur"
        //   },
        // },
        project_name_list:[],
        app_name:'',
        app_cname:'',
        app_type:'',
        app_id:'',
        project_num:'',
        expecteddate: '',
        desc: '',
        configinfo: [],
        fileList:[],
        routeParams: '',
      },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now() + 86400000 * 6
        }
      },
      configinfodictadd: {
        'sys_type': "CentOS",
        'sys_version': "6.9_W",
        'env': '生产',
        'type':'',
        'info':'',
        'money':0,
        'sum': 1,
        'status':1,
      },
      rules: {
        project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
        project_num: [{ required: true, message: '请选择项目编号', trigger: 'change' },],
        desc:[{ required: true, message: '请输入备注描述', trigger: 'change' },],
      }
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
    this.newAppForm.expecteddate = this.initDate(7);
    this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
    getProductAppCascader().then(response => {
      this.projectOptions = response
    })
    getphysical().then(response => {
      this.physicalOptions = response
      this.typeoptions = Object.keys(this.physicalOptions)
      // console.log(this.typeoptions)
    })
    getPoolProduct().then(response => {
      this.poolOptionsA = response
      this.getpooloption()
    })
    this.renderDraftsData()
  },
  methods: {
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
        this.newAppForm.app_name = this.aDetail.app_name
        this.newAppForm.app_cname = this.aDetail.app_cname
        this.newAppForm.app_type = this.aDetail.app_type
        this.newAppForm.project_num = this.aDetail.project_num
        this.newAppForm.expecteddate = this.aDetail.expecteddate
        this.newAppForm.desc = this.aDetail.desc
        this.newAppForm.configinfo = this.aDetail.configinfo
        this.newAppForm.fileList = this.aDetail.fileList
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
    // 修改草稿提交、或者再次保存草稿，都是update数据
    submitEditForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.newAppForm.fileList.length !==0){
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

    // 保存草稿,只校验英文名是否填写
    saveDraftsForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.newAppForm.fileList.length !==0){
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.newAppForm.fileList.length !==0){
            this.buttondisabled = true
            addWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              })
              this.buttondisabled = false
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push('/workflow/workflow_list');
              })
            }).catch(err => {
              console.log(err)
              this.$notify({
                message: '提交异常！'
              })
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
    getValueFromChild(value1,index) {
      this.newAppForm.configinfo[index].sys_type =  this.os_type[value1[0]];
      this.newAppForm.configinfo[index].sys_version = value1[1]
    },
    resetForm(formName) {
      const sessionData = sessionStorage.getItem(this.sessionKey)
      if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
        this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
        this.renderDraftsData1()
        this.getpooloption()
      }else{
        this.infooptions = []
        this.poolOptions = []
        this.newAppForm.fileList = []
        this.$refs[formName].resetFields()
        this.newAppForm.expecteddate = this.initDate(7);
        this.newAppForm.configinfo = []
        this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
        this.dateNow = new Date().getTime();
        this.disabledPool = true;
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
    getpooloption(){
      if(this.$route.params.detailData_edit){
        this.projectChange(this.newAppForm.project_name_list)
        this.newAppForm.project_num = this.aDetail.project_num
      }
    },
    projectChange(choose) {
      this.newAppForm.project_num = ''
      if (this.newAppForm.project_name_list.length == 0) {
        this.poolOptions = []
        return
      }
      this.disabledPool = false;
      //取产品线大部门
      choose = choose[0].split('-')[0];
      this.poolOptions = this.poolOptionsA[choose]
      if (this.poolOptions) {
        console.log(this.poolOptions)
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
        var project_num = response.pool_cname
        if ( project_num !== '') {
          for (var i = 0; i < this.poolOptions.length; i++) {
            if ( this.poolOptions[i].display_name == project_num) {
              this.newAppForm.project_num = '('+this.poolOptions[i].key+')'+this.poolOptions[i].display_name
              this.disabledPool = true
              return
            }
          }
        }
      })
    },
    getinfo(row){
      row.info = ''
      row.money = 0
      for (var k in this.physicalOptions) {
        if (k == row.type) {
          // console.log(this.physicalOptions[k])
          this.infooptions = []
          for (var i = 0; i < this.physicalOptions[k].length; i++) {
            // console.log(this.physicalOptions[k][i].conf)
            this.infooptions.push(this.physicalOptions[k][i].conf)
          }
          return
        }
      }
    },
    getmoney(row){
      row.money = 0
      for (var k in this.physicalOptions) {
        if (k == row.type) {
          for (var i = 0; i < this.physicalOptions[k].length; i++) {
            if (this.physicalOptions[k][i].conf == row.info) {
              row.money = this.physicalOptions[k][i].budget
            }
          }
        }
      }
    },
    getHelpDoc() {
      // getHelpDocContent({board:'workflow',title:'新建申请单-'+this.$route.params.name}).then(response => {
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.newAppForm.fileList = []
      this.newAppForm.fileList = fileList
      console.log(this.newAppForm.fileList)
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
      console.log(file, fileList);
      this.newAppForm.fileList = []
      this.newAppForm.fileList = fileList
      console.log(this.newAppForm.fileList)
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
  a{
    color: #1890ff;
  }
</style>
