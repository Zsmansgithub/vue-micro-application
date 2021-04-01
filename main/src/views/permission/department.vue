<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model="listQuery.ou_name" style="width: 100%" clearable placeholder="部门名称"
                    @input="handleFilter">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.owner_name" placeholder="部门领导" style="width: 200px;" clearable filterable
                    @change="handleFilter" class="filter-item">
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.ou_path" placeholder="部门架构" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.parentouid" placeholder="上级部门" style="width: 200px;" clearable filterable
                     @change="handleFilter" class="filter-item">
            <el-option v-for="item in groupOptions" :key="item.ou_name" :label="item.ou_name" :value="item.ouid"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" plain @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" @click="dialogSearchVisible=true" plain icon="el-icon-plus">新增
        </el-button>
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
      <el-table-column label="部门ID" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ouid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ou_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门领导" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门架构">
        <template slot-scope="scope">
          <span>{{ scope.row.ou_path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级部门" width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.depart_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级领导" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.depart_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" plain circle @click="handleBatchEdit(scope.row);" icon="el-icon-edit"/>
          <el-button type="danger" plain circle @click="handleBatchDelete(scope.row);" icon="el-icon-delete"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="添加记录" :visible.sync="dialogSearchVisible" style="text-align: left;" width="900px"
               @close="handleClose">
        <el-form ref="addForm" :model="addForm" :rules="rules" label-width="110px"
                 style="margin-right: 20px;margin-left: 20px">
          <el-form-item label="部门ID" min-width="100" prop="ouid">
            <el-input v-model.trim="addForm.ouid" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" min-width="100" prop="ou_name">
            <el-input v-model.trim="addForm.ou_name" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="部门架构" prop="ou_path">
            <el-input v-model.trim="addForm.ou_path" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="部门领导" prop="owner_name">
            <el-select v-model.trim="addForm.owner_name" style="width: 100%" filterable>
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="上级部门ID">
            <el-select v-model.trim="addForm.parentouid" style="width: 100%" filterable>
              <el-option v-for="item in groupOptions" :key="item.ouid" :label="item.ou_name" :value="item.ouid"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogFormVisible" style="text-align: left;" width="900px"
               @close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-form-item label="部门ID" min-width="100" prop="ou_id">
          <el-input v-model.trim="editForm.ou_id" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" min-width="100" prop="ou_name">
          <el-input v-model.trim="editForm.ou_name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="部门架构" prop="ou_path">
          <el-input v-model.trim="editForm.ou_path" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="部门领导" prop="owner_name">
          <el-select v-model.trim="editForm.owner_name" style="width: 100%" filterable>
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门ID">
          <el-select v-model.trim="editForm.parentouid" style="width: 100%">
              <el-option v-for="item in groupOptions" :key="item.ou_name" :label="item.ou_name" :value="item.ouid"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'
  import {
    fetchDepartmentInfo,
    addDepartmentInfo,
    editDepartmentInfo,
    deleteDepartmentInfo,
    getUserGroup,
    getDepart
  } from '@/api/manage_monitor/user_department'

  export default {
    name: 'DirectivePermission',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        userOptions: [],
        groupOptions: [],
        listQuery: {
          page: 1,
          limit: 20,
          ou_name: undefined,
          owner_name: undefined,
          ou_path: undefined,
          parentouid: undefined,
        },
        addForm: {
          ouid: '',
          ou_name: '',
          ou_path: '',
          owner_name: '',
          parentouid: '',
        },
        editForm: {
          ou_id:'',
          ouid: '',
          ou_name: '',
          ou_path: '',
          owner_name: '',
          parentouid: '',
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
        dialogFormVisible: false,
        dialogSearchVisible: false,
        adminrole: false,
        rules: {
          ou_name: [{required: true, message: '请选择用户名', trigger: 'blur'}],
          ouid: [{required: true, message: '请填写部门ID', trigger: 'blur'},
                    { max:25,required:true,message: '不能超过25个字符', trigger: 'blur' }],
          ou_id: [{required: true, message: '请填写部门ID', trigger: 'blur'},
                    { max:25,required:true,message: '不能超过25个字符', trigger: 'blur' }],
          ou_path: [{required: true, message: '请填写组名', trigger: 'blur'}],
          owner_name: [{required: true, message: '请填写组名详情', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList()
      this.adminrole = this.roles.includes('admin')
      getUserGroup().then(res=>{
        this.userOptions=res
      })
      getDepart().then(res=>{
        this.groupOptions=res
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteDepartmentInfo(row.ouid).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleBatchEdit(row) {
        this.dialogFormVisible = true
        this.editForm.ou_path = row.ou_path
        this.editForm.ouid = row.ouid
        this.editForm.owner_name = row.owner_name
        this.editForm.ou_name = row.ou_name
        this.editForm.parentouid = row.parentouid
        this.editForm.ou_id = row.ouid
      },
      edit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            editDepartmentInfo(this.editForm.ouid, this.editForm).then(response => {
              if (response.status==='ok') {
                this.$notify({
                title: '成功',
                message: response.mes,
                type: 'success',
                duration: 2000
              })
              this.getList()
              }else {
                this.$notify({
                title: '失败',
                message: response.mes,
                type: 'error',
                duration: 2000
              })
                this.getList()
              }
            }).catch(response => {
              this.$msgbox({
                title: '消息',
                message: response.re.message,
              })
            })
            this.dialogFormVisible = false
          }
        })
      },
      confirm() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            addDepartmentInfo(this.addForm).then(response => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(response => {
              this.$msgbox({
                title: '消息',
                message: response.re.message,
              })
            })
            this.dialogSearchVisible = false
          }
        })
      },
      getList() {
        this.listLoading = true
        fetchDepartmentInfo(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          ou_name: undefined,
          owner_name: undefined,
          ou_path: undefined,
          parentouid: undefined,
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.dialogSearchVisible = false
      },
      handleClose() {
        this.addForm = {
          ouid: '',
          ou_name: '',
          ou_path: '',
          owner_name: '',
          parentouid: '',
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    /deep/ .permission-alert {
      width: 320px;
      margin-top: 15px;
      background-color: #f0f9eb;
      color: #67c23a;
      padding: 8px 16px;
      border-radius: 4px;
      display: inline-block;
    }

    /deep/ .permission-sourceCode {
      margin-left: 15px;
    }

    /deep/ .permission-tag {
      background-color: #ecf5ff;
    }
  }

</style>

