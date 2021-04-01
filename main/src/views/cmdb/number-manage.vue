<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="number_name">
          <el-input v-model="listQuery.number_name" placeholder="账号名" style="width: 200px;" class="filter-item" />
        </el-form-item>
        <el-form-item prop="number_type">
          <el-select v-model="listQuery.number_type" placeholder="账号类型" filterable clearable class="filter-item" style="width: 177px">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" @click="handleBatchSearch()">新增账号</el-button>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_people }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" prop="roles" sortable>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roles===1" size="medium">管理员</el-tag>
          <el-tag v-if="scope.row.roles===2" size="medium">普通用户</el-tag>
          <el-tag v-if="scope.row.roles===3" size="medium">只读用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center" prop="is_not" sortable>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_not===1" size="medium">可用</el-tag>
          <el-tag v-if="scope.row.is_not===2" size="medium">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="密码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pwd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否过期" align="center" prop="expire_time" sortable>
        <template slot-scope="scope">
          <el-tag v-if="new Date(scope.row.expire_time*1000)<Date.now()" type="danger" size="medium">是</el-tag>
          <el-tag v-if="new Date(scope.row.expire_time*1000)>Date.now()" size="medium">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" align="center" prop="expire_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.expire_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updates_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.updates_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleBatchEdit(scope.row);" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleBatchDelete(scope.row);" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getList"
    />

    <el-dialog title="添加账号信息" :visible.sync="dialogSearchVisible" style="text-align: left;" width="50%" @open="dialogOpen" @close="handleClose">
      <el-form ref="numForm" :model="numberForm" :rules="rules" label-width="100px">
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="账号名" min-width="100" prop="number_name">
          <el-input v-model.trim="numberForm.number_name" type="text" auto-complete="off" style="width:100%"/>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="账号类型" min-width="100" prop="number_type">
          <el-select v-model="numberForm.number_type" placeholder="请选择" style="width:100%">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.label">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="是否可用" min-width="100" prop="is_not">
          <el-select v-model="numberForm.is_not" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="密码" min-width="100" prop="pwd">
          <el-input v-model.trim="numberForm.pwd" type="password" auto-complete="off" style="width:100%" />
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="过期时间" min-width="100" prop="expire_time">
          <el-date-picker v-model="numberForm.expire_time" type="datetime" value-format="timestamp" placeholder="选择日期时间" style="width:100%" />
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item v-if="false" label="添加人" min-width="100">
          <el-input v-model.trim="numberForm.add_people" :disabled="false" type="text" auto-complete="off" style="width:100%" />
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="角色" min-width="100" prop="roles">
          <el-select v-model="numberForm.roles" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in rolesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改账号信息" :visible.sync="dialogFormVisible" style="text-align: left;" width="50%" @open="dialogOpen" @close="handleClose">
      <el-form ref="dataForm" :model="numberEdit" :rules="rules" label-width="100px" >
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item v-if="false" label="ID" min-width="100">
          <el-input v-model="numberEdit.id" type="text" auto-complete="off" style="width:100%"/>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="账号名" min-width="100" prop="number_name">
          <el-input v-model.trim="numberEdit.number_name" type="text" auto-complete="off" style="width:100%"/>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="账号类型" min-width="100" prop="number_type">
          <el-select v-model="numberEdit.number_type" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="是否可用" min-width="100" prop="is_not">
          <el-select v-model="numberEdit.is_not" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="密码" min-width="100" prop="pwd">
          <el-input v-model.trim="numberEdit.pwd" type="password" auto-complete="off" style="width:100%"/>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="过期时间" min-width="100" prop="expire_time">
          <el-date-picker
            v-model="numberEdit.expire_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
            :clearable=false
            style="width:100%"
          />
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item v-if="false" label="添加人" min-width="100">
          <el-input v-model.trim="numberEdit.add_people" :disabled="true" type="text" auto-complete="off" style="width:100%"/>
        </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="角色" min-width="100" prop="roles">
          <el-select v-model="numberEdit.roles" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in rolesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNumberManage()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchNumberList, addNumber, editNumber, deleteNumber, getLoginUser } from '@/api/cmdb'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  mixins: [resize],
  data() {
    return {
      status: [{ value: 1, label: '可用' }, { value: 2, label: '不可用' }],
      rolesList: [{ value: 1, label: '管理员' }, { value: 2, label: '普通用户' }, { value: 3, label: '只读用户' }],
      typeList: [{ value: 1, label: '虚拟机' }, { value: 2, label: '物理机' }, { value: 3, label: '管理IP' }, { value: 4, label: '数据库' }],
      listQuery: {
        page: 1,
        limit: 20,
        number_name: undefined,
        number_type: undefined
      },
      numberForm: {
        number_name: '',
        number_type: '',
        is_not: '',
        pwd: '',
        expire_time: (new Date()).getTime() + 86400 * 7 * 1000,
        add_people: '',
        roles: ''
      },
      numberEdit: {
        id: '',
        number_name: '',
        number_type: '',
        is_not: '',
        pwd: '',
        expire_time: '',
        add_people: '',
        roles: ''
      },
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },
      list: null,
      total: 0,
      listLoading: true,
      activeName: 'ip',
      people: '',
      dialogFormVisible: false,
      dialogSearchVisible: false,
      timestamp: '',
      logOptions: [],
      rules: {
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        number_name: [{ required: true, message: '请输入账号名', trigger: 'blur' },
        { max: 20, message: '长度不超过20个字符', trigger: 'blur' }],
        number_type: [{ required: true, message: '请选择账号类型', trigger: 'blur' }],
        is_not: [{ required: true, message: '请选择是否可用', trigger: 'blur' }],
        expire_time: [{ required: true, type: 'date', message: '请选择过期时间', trigger: 'blur' }],
        roles: [{ required: true, message: '请选择角色类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getUser()
  },
  methods: {
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    handleBatchSearch() {
      this.dialogSearchVisible = true
    },
    confirm() {
      this.$refs.numForm.validate(valid => {
        if (valid) {
          this.numberForm.expire_time = parseInt(this.numberForm.expire_time / 1000)
          addNumber(this.numberForm).then(response => {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          })
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
    handleBatchEdit(row) {
      this.dialogFormVisible = true
      this.numberEdit.id = row.id
      this.numberEdit.number_name = row.number_name
      this.numberEdit.number_type = row.number_type
      this.numberEdit.pwd = row.pwd
      this.numberEdit.expire_time = row.expire_time * 1000
      this.numberEdit.add_people = row.add_people
      this.numberEdit.roles = row.roles
      this.numberEdit.is_not = row.is_not
    },
    editNumberManage() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.numberEdit.expire_time = this.numberEdit.expire_time / 1000
          editNumber(this.numberEdit.id, this.numberEdit).then(response => {
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
      var msg = '确定删除该账号信息吗?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteNumber(row.id).then(response => {
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
      this.activeName = null
    },
    getList() {
      this.listLoading = true
      fetchNumberList(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    getUser() {
      getLoginUser().then(response => {
        this.people = response.username
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
        pool_cname: undefined
      }
    },
    dialogOpen() {
      this.resetlistQuery()
      this.activeName = 'ip'
      // this.$refs['numForm'].resetFields()
      this.numberForm = {
        number_name: '',
        number_type: '',
        is_not: '',
        pwd: '',
        expire_time: (new Date()).getTime() + 86400 * 7 * 1000,
        add_people: this.people,
        roles: ''
      }
    }
  }
}
</script>
<style>

</style>
