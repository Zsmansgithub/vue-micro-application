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
                          @change="vmIpList">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
          <!-- </el-col>
          <el-col :span="8" :xs="11"> -->
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
            <el-form-item size="small" style="text-align: right" class="config_os" label-width="30px">
              <div v-if="newAppForm.app_id == '' || total ==0">
                <el-tooltip content="未选择应用或应用已有ip为0" placement="top">
                  <el-button type="primary"  @click="dialogVisible = true" disabled>添加应用IP</el-button>
                </el-tooltip>
              </div>
              <div v-else>
                <el-button type="primary"  @click="dialogVisible = true" :disabled="disabledbuttonPool">添加应用IP</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col  :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="配置信息">
              <div>
                <el-table :data="newAppForm.configinfo">
                  <el-table-column prop="ip" label="服务器IP"  align="center" min-width="4">
                    <template slot-scope="scope">
                      {{scope.row.ip}}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="old" label="原配置"  align="center">
                    <template slot-scope="scope">
                      {{scope.row.old}}
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="sys" label="系统版本"  align="center" min-width="4">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.sys'">
                        <system-version :selectedOptions="[parseInt(Object.keys(os_type)[Object.values(os_type).indexOf(scope.row.sys_type)]),scope.row.sys_version]"
                                    @sendValueToParent="getValueFromChild($event, scope.$index)" :key="versionkey"></system-version>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="raid" label="raid"  align="center" min-width="4">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.raid'" :rules="scope.row.sys_type == ''&&scope.row.sys_version == ''?scope.row.edit.length == 0?{required:true}:{required:false}:{required:false}">
                        <el-select v-model="scope.row.raid" popper-class="app-search-class" placeholder="请选择" style="width: 100%;">
                          <el-option label="无raid" value="无raid"/>
                          <el-option label="raid 0" value="raid 0"/>
                          <el-option label="raid 5" value="raid 5"/>
                          <el-option label="raid 10" value="raid 10"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="edit" label="配置变更"  align="center" min-width="4">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.edit'" :rules="scope.row.sys_type == ''&&scope.row.sys_version == ''?scope.row.raid == ''?{required:true}:{required:false}:{required:false}">
                        <el-select v-model="scope.row.edit" popper-class="app-search-class" placeholder="请选择" multiple style="width: 100%;">
                          <el-option label="更换CPU" value="更换CPU"/>
                          <el-option label="更换内存" value="更换内存"/>
                          <el-option label="更换磁盘" value="更换磁盘"/>
                          <el-option label="更换主板" value="更换主板"/>
                          <el-option label="更换网卡" value="更换网卡"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="desc" label="备注"  align="center" min-width="6">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.desc'">
                        <el-input v-model="scope.row.desc" placeholder="请输入" type="textarea" :autosize="{ minRows: 1, maxRows: 8}"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <!-- <el-button type="primary" icon="el-icon-plus" v-if="scope.row.status == 1" circle @click="addDomain(scope.row);" :disabled="newAppForm.configinfo.length>4"/> -->
                      <el-button type="danger" icon="el-icon-delete" circle @click="removeDomain(scope.row)" />
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
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <el-button v-if="this.$route.params.uuid == null && newAppForm.configinfo.length !== 0" type="primary" @click="saveDraftsForm('newAppForm')" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else-if="newAppForm.configinfo.length == 0" type="primary" @click="saveDraftsForm('newAppForm')" disabled>保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :loading="buttondisabled">保存草稿</el-button>
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <el-button v-if="this.$route.params.uuid == null && newAppForm.configinfo.length !== 0" type="primary" @click="submitForm('newAppForm')" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else-if="this.$route.params.uuid == null && newAppForm.configinfo.length == 0" type="primary" @click="submitForm('newAppForm')" disabled>立即提交</el-button>
              <el-button v-else-if="newAppForm.configinfo.length == 0" type="primary" @click="submitEditForm('newAppForm',0)" disabled>提交草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :loading="buttondisabled">提交草稿</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <div style="text-align:center;padding-top:2%;padding-bottom:2%;">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="ipList"
          filterable
          :titles="['未选服务器', '已选服务器']"
          :props="{
            key: 'ip',
            label: 'ip'
          }"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="handleChange"
          :data="tableData">
          <!-- <span slot-scope="{ option }">{{ option.ip.split('-')[0] }}</span> -->
          <span slot-scope="{ option }">{{ option.ip }}</span>
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="ipList.length == 0" @click="addvmip" disabled>确定</el-button>
        <el-button size="small" type="primary" v-else @click="addvmip">确定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {fetchIPList} from '@/api/cmdb'
import { fetchAppInfo } from '@/api/cmdbs/app_manage'
import SystemVersion from '@/components/Tools/SystemVersion_physical'
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import { getProductAppCascader} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
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
  components: {SystemVersion},
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    return {
      aDetail:{},
      help_doc_url:'',
      os_type: os_type,
      tableData:[],
      ipList:[],
      projectOptions:[],
	  versionkey:1,
      disabledbuttonPool:true,
      dialogVisible: false,
      buttondisabled:false,
      newAppForm: {
        project_name_list:[],
        app_name:'',
        app_cname:'',
        app_id:'',
        expecteddate: '',
        desc: '',
        configinfo: [],
        routeParams: '',
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        app_id: undefined,
        resource_type:1,
      },
      props: {
        value: 'label',
        children: 'app'
      },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now()
        }
      },
      configinfodict: {
        'ip':'',
        'sys_type':'',
        'sys_version':'',
        'raid':'',
        'edit':[],
        'desc':'',
      },
      rules: {
        project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
        // desc:[{ required: true, message: '请输入备注描述', trigger: 'change' },],
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
    this.newAppForm.expecteddate = this.initDate(1);
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
    renderDraftsData1() {
      try {
        this.newAppForm.project_name_list = this.aDetail.project_name_list
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        if(this.newAppForm.project_name_list[3]) this.vmIpList()
        this.newAppForm.app_name = this.aDetail.app_name
        this.newAppForm.app_cname = this.aDetail.app_cname
        this.newAppForm.expecteddate = this.aDetail.expecteddate
        this.newAppForm.desc = this.aDetail.desc
        this.newAppForm.configinfo = this.aDetail.configinfo
        this.ipList = []
        for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
          // this.ipList.push(this.newAppForm.configinfo[i].ip+'-'+this.newAppForm.configinfo[i].old)
          this.ipList.push(this.newAppForm.configinfo[i].ip)
        }
      } catch (error) {
        // TODO 异常情况如何处理
        console.log(this.$route.params.detailData_edit)
      }
    },
    removeDomain(item) {
      var index = this.newAppForm.configinfo.indexOf(item)
      if (index !== -1) {
        this.newAppForm.configinfo.splice(index, 1)
        this.ipList.splice(index, 1)
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

    // 保存草稿,只校验英文名是否填写
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
            console.log(err)
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
    getValueFromChild(value1,index) {
      this.newAppForm.configinfo[index].sys_type =  this.os_type[value1[0]];
      this.newAppForm.configinfo[index].sys_version = value1[1]
    },
    resetForm(formName) {
      const sessionData = sessionStorage.getItem(this.sessionKey)
      if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
        this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
        this.renderDraftsData1()
      }else{
        this.disabledbuttonPool = true
        this.total = 0
        this.tableData = []
        this.$refs[formName].resetFields()
        this.newAppForm.expecteddate = this.initDate(1);
        this.newAppForm.configinfo = []
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
    data(query){
      fetchIPList(query).then(response => {
        this.total=response.count
        const tableData = []
        for (const i of response.results) {
          // tableData.push({
          //   ip: i.ip+'-'+i.cpu+'C / '+i.memory+'G / '+i.disk+'G'
          // })
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
      this.tableData = []
      this.ipList = []
      this.newAppForm.configinfo = []
      if (this.newAppForm.project_name_list.length == 0) {
        this.disabledbuttonPool = true
        return
      }
      this.newAppForm.app_id = this.newAppForm.project_name_list[3]
      this.disabledbuttonPool = false
      this.listQuery.app_id = this.newAppForm.app_id
      fetchAppInfo(this.newAppForm.app_id).then(response => {
        this.newAppForm.app_name = response.app_name
        this.newAppForm.app_cname = response.app_cname
      })
      this.data(this.listQuery)
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    addvmip(){
      this.newAppForm.configinfo = []
      for (var i = 0; i < this.ipList.length; i++) {
        const configinfo = Object.assign({}, this.configinfodict)
        configinfo.ip = this.ipList[i]
        // configinfo.ip = this.ipList[i].split('-')[0]
        // configinfo.old = this.ipList[i].split('-')[1]
        this.newAppForm.configinfo.push(configinfo)
      }
      this.dialogVisible = false
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
