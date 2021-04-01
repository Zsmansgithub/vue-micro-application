<template>
  <div class="app-container">
    <div><h3 style="margin-left: 40%;color:#48096b">MySQL访问接入申请单</h3> <br></div>
    <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="110px" class="newAppForm" style="width: 60%;margin-left: 13%">
      <el-row>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="数据库用户名" prop="db_user" required>
          <el-input v-model="newAppForm.db_user" style="width: 100%" />
            </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="登录IP" prop="login_ip" required>
            <el-cascader-multi expand-trigger="hover" :data="loginOptions" v-model="newAppForm.login_ip"
                         filterable :collapse-tags=true placeholder="请选择" :only-last=true clearable></el-cascader-multi>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="申请人工号" prop="apply_user" required>
            <el-select v-model.trim="newAppForm.apply_user" placeholder="请选择工号" filterable clearable class="filter-item" style="width: 100%">
              <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="到期时间" prop="expire_time" required>
                <el-date-picker
                  v-model="newAppForm.expire_time"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions2"
                  style="width: 100%"
                />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="相关信息">
        <el-form-item />
        <el-form-item v-for="(domain, index) in newAppForm.configinfo" :key="index" class="instant_role">
          <fieldset class="filed">
          <el-col :md="24" :lg="11" :xl="11">
            <el-form-item label="数据库项目名" prop="instant_name">
              <el-select v-model="domain.instant_name" placeholder="数据库项目名" filterable clearable class="filter-item" style="width: 100%">
                <el-option v-for="item in dbOptions" :key="item.key" :label="'('+item.key+')'+item.display_name" :value="item.display_name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="11" :xl="11">
            <el-form-item label="权限类型" prop="role_type">
              <el-select v-model="domain.role_type" clearable multiple placeholder="权限类型" style="width: 100%">
                <el-option label="SELECT" value="SELECT" />
                <el-option label="UPDATE" value="UPDATE" />
                <el-option label="INSERT" value="INSERT" />
                <el-option label="DELETE" value="DELETE" />
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :md="24" :lg="2" :xl="2">
            <div style="float: right;">
              <el-button-group>
              <el-button v-if="index==0" type="primary" size="mini" icon="el-icon-plus"  @click="addDomain" />
              <el-button v-if="index !=0" type="primary" size="mini" icon="el-icon-minus" @click.prevent="removeDomain(domain)" />
            </el-button-group>
            </div>
          </el-col>
          <el-col :md="24" :lg="22" :xl="22">
            <el-form-item label="库名$表名" prop="db_table" >
             <el-cascader-multi expand-trigger="hover" :data="dbtableOptions" v-model="domain.db_table"
                         filterable clearable placeholder="请选择" style="width: 100%"></el-cascader-multi>
            </el-form-item>
          </el-col>
          </fieldset>
        </el-form-item>
      </el-form-item>
      <div style="float: right">
        <el-button type="primary" @click="submitForm()">立即提交</el-button>
        <el-button @click="resetForm('newAppForm')">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { fetchDbList, fetchAppListP,getUserConf,fetchAppCascader } from '@/api/cmdb'
import { fetchDb,fetchTableName,fetchDbName,fetchDbTable } from '@/api/db'
import { addWorkFlow } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";

export default {
  name: 'ComplexTable',
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    return {
      dbOptions: [],
      mobileOptions: [],
      loginOptions: [],
      dbtableOptions: [],
      newAppForm: {
        db_user: '',
        login_ip: [],
        apply_user: '',
        expire_time: '',
        configinfo: [],
        routeParams: '',
      },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now() + 86400000 * 1
        }
      },
      configinfodict: {
        'instant_name': '',
        'role_type': [],
        'db_table': []
      },
      rules: {
        db_user: [
          { required: true, message: '请输入数据库用户名', trigger: 'blur' },
          { message: '长度不要超过50个字符', trigger: 'blur', max: 50 }
        ],
        login_ip: [{ required: true, message: '请选择登录ip', trigger: 'blur' }],
        apply_user: [{ required: true, message: '请选择工号', trigger: 'blur' }],
        expire_time: [{ required: true, message: '请选择到期时间', trigger: 'blur' }],
        instant_name: [{ required: true, message: '请选择数据库项目名', trigger: 'blur' }],
        role_type: [{ required: true, message: '请选择权限类型', trigger: 'blur' }],
        db_table: [{ required: true, message: '请选择库名$表名', trigger: 'blur' }]
      },
      aDetail: {},
    }
  },
  created() {
    this.getAppList()
    this.getUserConfList()
    fetchAppCascader().then(response=>{
      this.loginOptions=response
    })
    fetchDbTable().then(response=>{
      this.dbtableOptions=response
    })
    this.newAppForm.configinfo.push(this.configinfodict);
  },
  mounted() {
  },
  methods: {
    renderDraftsData1() {
      this.newAppForm = this.aDetail;
    },
    addDomain() {
      const configinfo = Object.assign({}, this.$options.data().configinfodict)
      this.newAppForm.configinfo.push(configinfo)
    },
    removeDomain(item) {
      var index = this.newAppForm.configinfo.indexOf(item)
      if (index !== -1) {
        this.newAppForm.configinfo.splice(index, 1)
      }
    },
    submitForm() {
      addWorkFlow(2, this.newAppForm).then(response => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resetForm(formName) {
      this.newAppForm = this.$options.data().newAppForm;
      this.newAppForm.configinfo.push(this.$options.data().configinfodict);
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
      })
    },
    getAppList() {
      fetchDb().then(response => {
        const dbOptions = []
        for (const i of response) {
          dbOptions.push({
            display_name: i.instant_name, key: i.id
          })
        }
        this.dbOptions = dbOptions
      })
    },
    getUserConfList() {
      getUserConf().then(response=>{
        let mobileOption=[]
        for (let i of response) {
          mobileOption.push({
            display_name:i.user_name,key:i.uuid
          })
        }
        this.mobileOptions=mobileOption
      })
    }
  }
}
</script>
<style lang="css" scoped>
.filed {
  padding-top: 11px;
  border: 1px solid #1890ff;
  margin-bottom: 5px;
}
  .instant_role .el-form-item__content >div{
    margin-bottom: 3px;
  }
</style>
