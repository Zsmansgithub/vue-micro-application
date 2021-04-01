<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
        <br>
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
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="申请原因" prop="needdesc" required>
              <el-input v-model="newAppForm.needdesc" type="textarea" placeholder="请填写申请原因" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="客户端IP" prop="Cip" required>
              <el-select
                v-model="newAppForm.Cip"
                filterable
                clearable
                multiple
                placeholder="请输入客户端IP"
                style="width: 100%;">
                <el-option
                  v-for="item in tableData"
                  :key="item.ip"
                  :label="item.ip"
                  :value="item.ip">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="开通时长" prop="time" required>
              <el-select v-model="newAppForm.time" popper-class="app-search-class" placeholder="请选择开通时长"
                         style="width: 100%;">
                <el-option label="永久" value="永久"/>
                <el-option label="临时" value="临时"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="redis" prop="redis">
              <!-- <el-select v-model="newAppForm.redis" filterable clearable multiple style="width: 100%;">
                <el-option v-for="item in redisoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-cascader expand-trigger="hover"
                          :options="redisoptions"
                          :props="{ multiple: true }"
                          v-model="newAppForm.redis"
                          filterable
                          clearable
                          style="width:100%;">
              </el-cascader>
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
import { fetchAppInfo } from '@/api/cmdbs/app_manage'
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,getphysical } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import { getProductAppCascader} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
import {fetchIPList} from '@/api/cmdb'
import {getredis} from '@/api/zabbix'

export default {
  name: 'AppApplyForm',
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    return {
      aDetail:{},
      projectOptions:[],
      redisoptions:[],
      tableData:[],
      buttondisabled:false,
      help_doc_url:'',
      newAppForm: {
        project_name_list:[],
        app_name:'',
        app_cname:'',
        app_id:'',
        Cip:[],
        redis:[],
        time:'永久',
        enddate:'',
        needdesc:'',
        desc: '',
        routeParams: '',
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
        // desc:[
        //   { required: true, message: '请输入备注描述', trigger: 'blur' },
        // ],
        Cip:[
          { required: true, message: '请添加客户端IP', trigger: 'blur' },
        ],
        redis:[
          { required: true, message: '请输入数据库', trigger: 'blur' },
        ],
        time:[
          { required: true, message: '请输入开通时长', trigger: 'blur' },
        ],
        needdesc:[
          { required: true, message: '请输入申请原因', trigger: 'blur' },
        ],
        redis:[
          { type: 'array',required: true, message: '请添加redis', trigger: 'change' },
        ]
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
    this.newAppForm.enddate = this.initDate(7);
    getProductAppCascader().then(response => {
      this.projectOptions = response
    })
    getredis().then(response => {
      this.redisoptions = response
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
        if (this.newAppForm.project_name_list[3]) this.vmIpList()
        this.newAppForm.app_name = this.aDetail.app_name
        this.newAppForm.app_cname = this.aDetail.app_cname
        this.newAppForm.time = this.aDetail.time
        this.newAppForm.enddate = this.aDetail.enddate
        this.newAppForm.needdesc = this.aDetail.needdesc
        this.newAppForm.redis = this.aDetail.redis
        this.newAppForm.Cip = this.aDetail.Cip
        this.newAppForm.desc = this.aDetail.desc
      } catch (error) {
        // TODO 异常情况如何处理
        console.log(this.$route.params.detailData_edit)
      }
    },
    // 修改草稿提交、或者再次保存草稿，都是update数据
    submitEditForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
            this.$notify({
              message: '提交异常！'
            })
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
        this.newAppForm = this.$options.data().newAppForm;
        this.newAppForm.enddate = this.initDate(7);
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
      }
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
      this.newAppForm.Cip = []
      this.data(this.listQuery)
    },
    getHelpDoc() {
      this.$router.push('/'+this.help_doc_url.split('/')[2])
    },
    filterMethod(node, keyword){
      keyword = keyword.toLowerCase() // 搜索关键字转为小写
      const { text, path } = node;
      // return text.includes(keyword) || path.includes(keyword);
      return text.toLowerCase().includes(keyword)
    },
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
