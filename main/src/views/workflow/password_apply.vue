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
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm" style="width:100%">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="应用IP" required>
              <el-button type="primary" @click="dialogVisiblesip = true,Siplist = ''">批量添加应用IP</el-button>
              <el-dialog title="批量添加应用IP" :visible.sync="dialogVisiblesip" width="30%" :before-close="siplistclose">
                <el-input v-model="Siplist" type="textarea" :autosize="{ minRows: 2, maxRows: 15}" placeholder="请输入IP列表,以英文逗号或回车分隔"/>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="siplistclose">取 消</el-button>
                  <el-button type="primary" @click="handleClosesip">确 定</el-button>
                </span>
              </el-dialog>
              <div>
                <el-table :data="newAppForm.siptable">
                  <el-table-column prop="project_name_list" label="应用名"  align="center" min-width="10">
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
                      <span v-if="scope.row.status == 3">
                        {{scope.row.project_name_list[0]}}/{{scope.row.project_name_list[1]}}/{{scope.row.project_name_list[2]}}/{{scope.row.app_name}}
                        <!-- {{scope.row.app_name}} -->
                      </span>
                      <span v-else>
                        <el-form-item :prop="'siptable.' + scope.$index + '.project_name_list'"
                        :rules="newAppForm.siptable[0].status == 3?{required:false}:{type:'array',required:true,message:'不能为空',trigger:'change'}">
                          <el-cascader expand-trigger="hover"
                                      :options="projectOptions"
                                      v-model="scope.row.project_name_list"
                                      filterable
                                      :filter-method="filterMethod"
                                      style="width:100%;"
                                      placeholder="请选择产品线及应用名"
                                      @change="vmIpList(scope.row)">
                          </el-cascader>
                        </el-form-item>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="env" label="环境"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 3">
                        {{scope.row.env}}
                      </span>
                      <span v-else>
                        <el-form-item :prop="'siptable.' + scope.$index + '.env'" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                          <el-select v-model="scope.row.env" style="width: 100%;" @change="vmIpList(scope.row)">
                            <el-option label="生产" value="生产"/>
                            <el-option label="UAT" value="UAT"/>
                            <el-option label="SIT" value="SIT"/>
                          </el-select>
                        </el-form-item>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Sip" label="应用IP"  align="center" min-width="9">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 3">
                        {{scope.row.Sip[0]}}
                      </span>
                      <span v-else>
                        <el-form-item :prop="'siptable.' + scope.$index + '.Sip'"
                        :rules="newAppForm.siptable[0].status == 3?scope.row.project_name_list.length==0?{required:false}:{type:'array',required:true,message:'不能为空',trigger:'change'}:{type:'array',required:true,message:'不能为空',trigger:'change'}">
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
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-plus" v-if="scope.row.status == 1||scope.row.status == 2" circle style="padding:2px;" @click="addsip(scope.row)" :disabled="newAppForm.siptable.length>99">
                      </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removesip(scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
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
          <el-col :span="24" class="col-1400-16 col-1400-offset-2" style="color:red;font-weight: bold;padding-left:130px;">
            管理员账号密码使用须知（重要）：
            <br />&nbsp;&nbsp;&nbsp;&nbsp;
            1.用户使用特权账户不得随意修改系统内核参数、不得随意添加其他特权用户（如sudo权限，管理员组等）、不得私自安装非公司许可的软件或工具、不得发布非必要端口到互联网；
            <br />&nbsp;&nbsp;&nbsp;&nbsp;
            2.用户使用特权账户时不得随意安装teamviewer、花生壳等远程管理工具，由此带来的安全风险由使用人承担；
            <br />&nbsp;&nbsp;&nbsp;&nbsp;
            3.不得擅自修改密码。
            <br />&nbsp;&nbsp;&nbsp;&nbsp;
            4.上述一经发现立即回收权限并在科技公司范围内通报批评。
            <br /><br />
            <el-checkbox v-model="makesure">已阅读<<管理员账号密码使用须知>>并承担相应责任</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-button v-if="this.$route.params.uuid == null" type="primary" @click="saveDraftsForm('newAppForm')" :loading="buttondisabled" :disabled="!makesure">保存草稿</el-button>
            <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :loading="buttondisabled" :disabled="!makesure">保存草稿</el-button>
            <el-button @click="resetForm('newAppForm')">重置</el-button>
            <el-button v-if="this.$route.params.uuid == null" type="primary" @click="submitForm('newAppForm')" :loading="buttondisabled" :disabled="!makesure">立即提交</el-button>
            <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :loading="buttondisabled" :disabled="!makesure">提交草稿</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchAppInfo } from '@/api/cmdbs/app_manage'
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,getIpList } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import { getProductAppCascader} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
import {fetchIPList} from '@/api/cmdb'

export default {
  name: 'AppApplyForm',
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    return {
      dialogVisiblesip:false,
      aDetail:{},
      projectOptions:[],
      buttondisabled:false,
      makesure:false,
      help_doc_url:'',
      Siplist:'',
      isIpList:/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])[\n,])*(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      newAppForm: {
        app_name:'',
        siptable:[],
        desc: '',
        routeParams: '',
      },
      siptableadd: {
        project_name_list: [],
        app_id: '',
        app_cname:'',
        app_name:'',
        env: '生产',
        Sip:[],
        status:1,
        total:0,
        tableData:[],
        checked: false,
      },
      listQuery: {
        page: 1,
        limit: 20,
        app_id: undefined,
        resource_env:undefined
      },
      listQuery2: {
        ip_list: '',
      },
      rules: {
        // desc:[{ required: true, message: '请输入备注描述', trigger: 'blur' },],
      }
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
    this.newAppForm.siptable.push(Object.assign({}, this.siptableadd))
    getProductAppCascader().then(response => {
      this.projectOptions = response
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
    renderDraftsData1(){
      try {
        this.newAppForm.siptable = this.aDetail.siptable
        this.newAppForm.desc = this.aDetail.desc
      } catch (error) {
        // TODO 异常情况如何处理
        console.log(this.$route.params.detailData_edit)
      }
    },
    addsip() {
      const siptable = Object.assign({}, this.siptableadd)
      siptable.status = 2
      this.newAppForm.siptable.push(siptable)
    },
    removesip(item) {
      var index = this.newAppForm.siptable.indexOf(item)
      if (index !== -1) {
        this.newAppForm.siptable.splice(index, 1)
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
    // 修改草稿提交、或者再次保存草稿，都是update数据
    submitEditForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newAppForm.app_name = ''
          for (var i = 0; i < this.newAppForm.siptable.length; i++) {
            this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.siptable[i].app_name
            if ( i == 2&&i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name) {
              this.newAppForm.app_name = this.newAppForm.app_name + '……'
              break;
            }
            if(i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name){
              this.newAppForm.app_name = this.newAppForm.app_name + ','
            }
          }
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
          this.newAppForm.app_name = ''
          for (var i = 0; i < this.newAppForm.siptable.length; i++) {
            this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.siptable[i].app_name
            if ( i == 2&&i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name) {
              this.newAppForm.app_name = this.newAppForm.app_name + '……'
              break;
            }
            if(i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name){
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newAppForm.app_name = ''
          for (var i = 0; i < this.newAppForm.siptable.length; i++) {
            this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.siptable[i].app_name
            if ( i == 2&&i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name) {
              this.newAppForm.app_name = this.newAppForm.app_name + '……'
              break;
            }
            if(i !== this.newAppForm.siptable.length-1&&this.newAppForm.siptable[i+1].app_name){
              this.newAppForm.app_name = this.newAppForm.app_name + ','
            }
          }
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
        this.$refs[formName].resetFields()
        this.makesure = false
        this.newAppForm.siptable = [];
        this.newAppForm.siptable.push(Object.assign({}, this.siptableadd))
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
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
        if( this.listQuery.page < row.total/20 )
        {
          this.listQuery.page++
          this.data(this.listQuery,row)
        }
        else
        {
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
      fetchAppInfo(row.app_id).then(response => {
        row.app_name = response.app_name
        row.app_cname = response.app_cname
      })
      // console.log(row)
      row.tableData = []
      row.Sip = []
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
      row.checked = false
      this.data(this.listQuery,row)
    },
    arrdiff(all,ip_list){
      var have = []
      for (const i of ip_list) {
        have.push(i.ip)
      }
      // 比较两数组不同
      return all.concat(have).filter(function(v, i, arr) {        return arr.indexOf(v) === arr.lastIndexOf(v);    });
    },
    getSip(results){
      for (const i of results) {
        this.newAppForm.siptable.unshift({
          project_name_list:[i.project_name.split('_')[0]+'-'+i.project_name.split('_')[1],i.project_name.split('_')[2],i.subsystem_name,i.app_id],
          env:i.resource_env_name.split('环')[0],
          Sip:[i.ip],
          app_owner:i.app_owner,
          status:3,
          app_name:i.app_name,
          app_id:i.app_id,
        })
      }
      this.siplistclose()
    },
    checkip(array){
      var app = []
      var noapp = []
      for (const i of array) {
        if (i.project_name) {
          app.push(i)
        } else{
          noapp.push(i.ip)
        }
      }
      return {app:app,noapp:noapp}
    },
    handleClosesip() {
      if(this.Siplist !== ''){
        if (this.isIpList.test(this.Siplist)) {
          // 全部\n替换为英文逗号
          var reg = new RegExp( '\n' , "g" )
          this.listQuery2.ip_list = this.Siplist.replace( reg , ',' );
          var length = this.listQuery2.ip_list.split(',').length
          var bailen = 100 - this.newAppForm.siptable.length
          if(length>bailen) {
            this.$message({
              message: '本次添加不能超过' + bailen + '个 !  当前已经 ' + length + '个 !',
              type: 'warning',
            })
            return false
          }
          var ipnoapp = []
          var ipdict = {}
          getIpList(this.listQuery2).then(response => {
            ipnoapp = this.arrdiff(this.listQuery2.ip_list.split(','),response)
            ipdict = this.checkip(response)
            ipnoapp = ipnoapp.concat(ipdict.noapp)
            if (ipnoapp.length !== 0) {
              this.$alert('以下ip没有关联应用,将无法匹配信息,请联系管理员:<br>'+String(ipnoapp).replace( new RegExp( ',' , "g" ) , '<br/>' ),
              {dangerouslyUseHTMLString: true,customClass:'firewall_myalert'}).then(_ => {}).catch(_ => {});
            }
            this.getSip(ipdict.app)
          })
        } else{
          this.$message({
            message: '请输入IP列表,以英文逗号或回车分隔',
            type: 'warning',
          })
          return false
        }
      } else {
        this.siplistclose()
      }
    },
    siplistclose(){
      this.dialogVisiblesip = false
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
  .myselect2{
    /deep/.el-input__inner {
      padding-left:5px;
      padding-right:25px;
    }
  }
  .myinput{
    /deep/.el-input__inner {
      padding-left:5px;
      padding-right:5px;
    }
  }
</style>
<style>
  /* 不能用scoped */
  .firewall_myalert p {
    max-height: 300px;
    overflow: auto;
  }
</style>
