<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="login_ip">
          <el-input v-model="listQuery.login_ip" placeholder="登录IP" style="width: 150px;" class="filter-item" />
        </el-form-item>
        <el-form-item prop="instant_name">
          <el-select v-model="listQuery.instant_name" placeholder="数据库项目名" filterable clearable class="filter-item" style="width: 150px">
            <el-option v-for="item in dbOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="db_user">
          <el-input v-model="listQuery.db_user" placeholder="数据库用户名" style="width: 120px" class="filter-item" />
        </el-form-item>
        <el-form-item prop="db_name_s">
          <el-select v-model="listQuery.db_name_s" placeholder="库名" multiple style="width: 150px">
            <el-option v-for="item in dbNameOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" @click="handleBatchSearch()">新增数据库用户信息</el-button>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.db_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.login_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库项目名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.instance_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dbName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roles===1" size="medium">管理员</el-tag>
          <el-tag v-if="scope.row.roles===2" size="medium">开发人员</el-tag>
          <el-tag v-if="scope.row.roles===3" size="medium">应用</el-tag>
          <el-tag v-if="scope.row.roles===4" size="medium">大数据</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否过期" align="center">
        <template slot-scope="scope">
          <el-tag v-if="new Date(scope.row.expire_time)<Date.now()" type="danger" size="medium">是</el-tag>
          <el-tag v-if="new Date(scope.row.expire_time)>Date.now()" size="medium">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleBatchEditTable(scope.row);" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleBatchDelete(scope.row);" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />

    <el-dialog title="添加信息" :visible.sync="dialogSearchVisible" style="text-align: left;" width="55%" @open="dialogOpen" @close="handleClose">
      <el-form ref="dbForm" :model="newAppForm" :rules="rules" label-width="110px" >
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库用户名" required prop="db_user">
              <el-input v-model.trim="newAppForm.db_user"/>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="登录IP" prop="login_ip">
              <el-input v-model.trim="newAppForm.login_ip" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="到期时间" required prop="expire_time">
            <el-date-picker
              v-model="newAppForm.expire_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions2"
              style="width: 100%"
            />
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="用户角色" required prop="roles">
              <el-select v-model="newAppForm.roles" placeholder="角色" style="width: 100%">
                <el-option v-for="item in rolesList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row>
        <el-col :md="24" :lg="24" :xl="24">
          <el-form-item label="备注">
          <el-input v-model.trim="newAppForm.comments" type="textarea" />
        </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="相关信息">
          <el-form-item />
          <el-form-item v-for="(domain, index) in configinfo" :key="index" class="db_information">
            <fieldset class="filed">
            <el-row>
            <el-col :md="24" :lg="11" :xl="11">
              <el-form-item label="数据库项目名"  required >
                <el-select v-model="domain.instant_name" placeholder="数据库项目名" filterable clearable class="filter-item" style="width: 100%">
                  <el-option v-for="item in dbOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="11" :xl="11">
              <el-form-item label="库名" class="shujuku"  filterable clearable  required >
                <el-select v-model="domain.db_name" placeholder="库名" multiple  @change="handleChange" style="width: 100%">
                  <el-option v-for="item in dbNameOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="24" :lg="2" :xl="2">
              <el-button-group style="float: right">
                <el-button v-if="index==0" type="primary" size="mini" icon="el-icon-plus"  @click="addDomain" />
                <el-button v-if="index !=0" type="primary" size="mini" icon="el-icon-minus" @click.prevent="removeDomain(domain)" />
              </el-button-group>
            </el-col>
            </el-row>
            <el-row>
            <el-col :md="24" :lg="11" :xl="11">
              <el-form-item label="权限类型" class="shujuku"  required >
                <el-select v-model="domain.role_type" multiple placeholder="权限类型" style="width: 100%">
                  <el-option label="SELECT" value="SELECT" />
                  <el-option label="UPDATE" value="UPDATE" />
                  <el-option label="INSERT" value="INSERT" />
                  <el-option label="DELETE" value="DELETE" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="11" :xl="11">
              <el-form-item label="表名"  class="shujuku" required >
                <el-select v-model="domain.table_name" :disabled="disabled" multiple placeholder="表名" style="width: 100%">
                  <el-option-group v-for="group in tableNameOptions" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.option" :key="item.key" :label="item.display_name" :value="item.key" />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
              </el-row>
                </fieldset>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" style="text-align: left;" width="60%" @open="dialogOpen" @close="handleClose">
      <el-form ref="appForm" :model="editForm" :rules="rules" label-width="100px" >
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="登录IP" prop="login_ip">
          <el-input v-model.trim="editForm.login_ip"  style="width: 100%" />
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="权限类型" prop="role_type">
          <el-select v-model="editForm.role_type" multiple placeholder="权限类型" style="width: 100%">
            <el-option label="SELECT" value="SELECT" />
            <el-option label="UPDATE" value="UPDATE" />
            <el-option label="INSERT" value="INSERT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="用户角色" prop="roles">
          <el-select v-model="editForm.roles" placeholder="角色" style="width: 100%">
            <el-option v-for="item in rolesList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="到期时间" prop="expire_time">
          <el-date-picker
            v-model="editForm.expire_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions2"
            :clearable=false
            style="width: 100%"
          />
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="库名" prop="db_name">
          <el-select v-model="editForm.db_name" placeholder="库名" multiple style="width: 100%" filterable clearable @change="handleChangeDb">
            <el-option v-for="item in dbNameOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="表名" prop="table_name">
          <el-select v-model="editForm.table_name" multiple placeholder="表名" style="width: 100%">
            <el-option-group v-for="group in tableNameOptionsA" :key="group.label" :label="group.label">
              <el-option v-for="item in group.option" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-option-group>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="24" :xl="24">
          <el-form-item label="备注" prop="comments">
          <el-input v-model.trim="editForm.comments" type="textarea" style="width: 100%" />
        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchMysql, addMysql, editMysql, deleteMysql, fetchDb, fetchDbName, fetchTableName } from '@/api/db'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import { validIp } from '@/utils/validate'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  mixins: [resize],
  data() {
    const validateIpaddress = (rule, value, callback) => {
      if (value) {
        if (validIp(value)) {
          callback()
        } else {
          callback(new Error('IP填写不正确'))
        }
      } else {
        callback()
      }
    }

    return {
      listQuery: {
        page: 1,
        limit: 20,
        instant_name: undefined,
        login_ip: undefined,
        db_user: undefined,
        db_name_s: []
      },
      rolesList: [{ value: 1, label: '管理员' }, { value: 2, label: '开发人员' }, { value: 3, label: '应用' }, { value: 4, label: '大数据' }],
      newAppForm: {
        expire_time: new Date(),
        roles: 1
      },
      editForm: {
        id: '',
        instant_name: '',
        db_user: '',
        login_ip: '',
        expire_time: '',
        role_type: '',
        db_name: '',
        table_name: '',
        col_name: '',
        comments: '',
        roles: ''
      },
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },
      disabled: true,
      list: [],
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogSearchVisible: false,
      timestamp: '',
      dialogStatus: '',
      dbOptions: [],
      dbNameOptions: [],
      tableNameOptions: [],
      tableNameOptionsA: [],
      tableNameDict: {},
      tableEditRow: undefined,
      information: '',
      configinfo: [{
        'instant_name': 1,
        'role_type': ['SELECT'],
        'db_name': '',
        'table_name': ''
      }],
      configinfodict: {
        'instant_name': 1,
        'role_type': ['SELECT'],
        'db_name': '',
        'table_name': ''
      },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now() + 86400000 * 1
        }
      },
      rules: {
        login_ip: [{ message: '请输入正确的IP地址', required: true, trigger: 'blur' },
          { validator: validateIpaddress }],
        db_user: [{ message: '请输入数据库用户名', trigger: 'blur', required: true },
        { max: 30, message: '长度不超过30 个字符', trigger: 'blur' }],
        db_name: [{ message: '请选择库名', trigger: 'blur', required: true }],
        role_type: [{ message: '请选择权限类型', trigger: 'blur', required: true }],
        instant_name: [{ message: '请选择数据库项目名', trigger: 'blur', required: true }],
        table_name: [{ message: '请选择表名', trigger: 'blur', required: true }],
        expire_time: [{ message: '请选择到期时间', type: 'date', trigger: 'blur', required: true }],
        roles: [{ message: '请选择角色', trigger: 'blur', required: true }],
        comments: [{ max: 150, message: '长度不超过150个字符', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getAppList()
    this.getDbNameList()
    this.getTableNameList()
  },
  methods: {
    handleChange(row) {
      this.disabled = false
      this.tableNameOptions = []
      for (const i in this.tableNameOptionsA) {
        if (row.indexOf(this.tableNameOptionsA[i].id) !== -1) {
          this.tableNameOptions.push(this.tableNameOptionsA[i])
        }
      }
    },
    handleChangeDb(row) {
//       Array.prototype.remove = function(obj) {
//       var i = this.length;
//       while (i--) {
//         if (this[i] === obj) {
//           return i; // 返回的这个 i 就是元素的索引下标，
//       }
//  }
//  return false;
// }
      this.tableNameOptions = []
      for (const i in this.tableNameOptionsA) {
        // for (const j in this.tableNameDict){
        // }
        if (row.indexOf(this.tableNameOptionsA[i].id) !== -1) {
          this.tableNameOptions.push(this.tableNameOptionsA[i])
        }
        // for (const j in row) {
        //   let tmp=[]
        //   if (row[j]===this.tableNameOptionsA[i].id) {
        //     tmp = this.tableNameOptionsA[row[j]].option
        //     for (const k in tmp) {
        //       if (this.editForm.table_name[k]!==tmp[k]) {
        //         this.editForm.table_name.splice(this.editForm.table_name.remove(k),1)
        //       }
        //     }
        //   }
        // }
      }
      // let tableEditRow=[]
      // for (const i in this.tableEditRow){
      //   if (row.indexOf(this.tableEditRow[i])==-1){
      //       tableEditRow.push(this.tableEditRow[i])
      //     }
      // }
      // let list=[]
      // for (const ii in tableEditRow ){
      //   for (const table_id in this.editForm.table_name) {
      //     if (this.tableNameDict[tableEditRow[ii]].indexOf(this.editForm.table_name[table_id])==-1){
      //       list.push(this.editForm.table_name[table_id])
      //     }
      //   }
      // }
      // this.editForm.table_name=list
      // this.tableEditRow=row
    },
    addDomain() {
      const configinfo = Object.assign({}, this.configinfodict)
      this.configinfo.push(configinfo)
    },
    removeDomain(item) {
      var index = this.configinfo.indexOf(item)
      if (index !== -1) {
        this.configinfo.splice(index, 1)
      }
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    handleBatchSearch() {
      this.dialogSearchVisible = true
    },
    confirm() {
      this.$refs.dbForm.validate(valid => {
        if (valid) {
          for (const i in this.configinfo) {
            const db_form = {}
            db_form.instant_name = this.configinfo[i].instant_name
            db_form.role_type = String(this.configinfo[i].role_type)
            db_form.db_name = String(this.configinfo[i].db_name)
            db_form.table_name = String(this.configinfo[i].table_name)
            db_form.db_user = this.newAppForm.db_user
            db_form.login_ip = this.newAppForm.login_ip
            db_form.expire_time = this.newAppForm.expire_time
            db_form.comments = this.newAppForm.comments
            db_form.roles = this.newAppForm.roles
            addMysql(db_form).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            })
          }
          this.dialogSearchVisible = false
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleBatchEditTable(row) {
      this.dialogFormVisible = true
      this.editForm.id = row.id
      this.editForm.db_name = row.db_name.split(',').map(x => parseInt(x))
      this.editForm.db_user = row.db_user
      this.editForm.expire_time = new Date(row.expire_time)
      this.editForm.instant_name = row.instant_name
      this.editForm.login_ip = row.login_ip
      this.editForm.role_type = [row.role_type]
      this.editForm.comments = row.comments
      this.editForm.table_name = row.table_name.split(',').map(x => parseInt(x))
      this.editForm.col_name = row.col_name
      this.editForm.roles = row.roles
      this.tableEditRow=this.editForm.db_name
    },
    edit() {
      this.$refs.appForm.validate(valid => {
        if (valid) {
          this.editForm.role_type = String(this.editForm.role_type)
          this.editForm.table_name = String(this.editForm.table_name)
          this.editForm.db_name = String(this.editForm.db_name)
          editMysql(this.editForm.id, this.editForm).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          })
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleBatchDelete(row) {
      var msg = '确定删除该数据库用户信息吗?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteMysql(row.id).then(response => {
          this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
          this.getList()
        })
      }, () => {
        return false
      })
    },
    handleClose() {
    },
    getList() {
      this.listLoading = true
      this.listQuery.db_name=String(this.listQuery.db_name_s)
      fetchMysql(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
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
    getDbNameList() {
      fetchDbName().then(response => {
        const dbNameOptions = []
        for (const i of response) {
          dbNameOptions.push({
            display_name: i.db_name, key: i.id
          })
        }
        this.dbNameOptions = dbNameOptions
      })
    },
    getTableNameList() {
      fetchTableName().then(response => {
        this.tableNameOptionsA = response
        for(const i in response){
          this.tableNameDict[response[i].id]=[]
          for (const j in response[i]['option']){
            this.tableNameDict[response[i].id].push(response[i]['option'][j].key)
          }
        }
      })
    },
    handleFilter(listQuery) {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate((valid) => {
        if (valid) {
          this.getList()
        }
      })
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        instant_name: '',
        login_ip: '',
        db_user: '',
        db_name_s: []
      }
    },
    dialogOpen() {
      this.newAppForm = {
        db_user: '',
        login_ip: '',
        expire_time: new Date(),
        roles: 1
      }
    }
  }
}
</script>
<style scoped>
.db_information .el-form-item__content >div{
  margin-bottom: 3px;
}
.filed {
  padding-top: 11px;
  border: 1px solid #1890ff;
  margin-bottom: 5px;
}
</style>
