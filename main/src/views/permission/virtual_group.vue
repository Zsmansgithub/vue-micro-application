<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model="listQuery.department" style="width: 100%" clearable placeholder="部门"
                    @change="handleFilter">
            <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.user_name" placeholder="姓名" style="width: 200px;" clearable
                     @change="handleFilter" class="filter-item">
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.is_master" placeholder="是否主组" style="width: 200px;" clearable
                     @change="handleFilter" class="filter-item">
            <el-option v-for="item in masterOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" plain @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" v-if="adminrole" @click="dialogSearchVisible=true" plain icon="el-icon-plus">新增
        </el-button>
        <el-button class="filter-item" type="danger" v-if="adminrole" @click="batchDelete" plain icon="el-icon-delete" :disabled="f1">删除
        </el-button>
        <el-button class="filter-item" type="primary" v-if="adminrole" @click="dialogEdit=true" plain icon="el-icon-edit" :disabled="f1">修改
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="35"/>
      <el-table-column label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.depart }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否主组">
        <template slot-scope="scope">
          <span v-if="scope.row.is_master===true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" plain circle @click="handleBatchEdit(scope.row)" icon="el-icon-edit"/>
          <el-button type="danger" plain circle @click="handleBatchDelete(scope.row)" icon="el-icon-delete"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="添加记录" :visible.sync="dialogSearchVisible" style="text-align: left;" width="30%"
               @close="handleClose">
        <el-form ref="addForm" :model="addForm" :rules="rules" label-width="110px"
                 style="margin-right: 20px;margin-left: 20px">
          <el-form-item label="部门" prop="department">
            <el-select v-model.trim="addForm.department" style="width: 100%" filterable>
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="用户" prop="user_name">
            <el-select v-model.trim="addForm.user_name" style="width: 100%" filterable multiple>
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否主组" prop="is_master">
            <el-select v-model.trim="addForm.is_master" style="width: 100%">
              <el-option v-for="item in masterOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="addForm.comments" style="width: 100%"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogFormVisible" style="text-align: left;" width="30%"
               @close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-form-item label="部门" prop="department">
            <el-select v-model.trim="editForm.department" style="width: 100%" filterable>
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="用户" prop="user_name">
            <el-select v-model.trim="editForm.user_name" style="width: 100%" filterable>
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否主组" prop="is_master">
            <el-select v-model.trim="editForm.is_master" style="width: 100%">
              <el-option v-for="item in masterOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="editForm.comments" style="width: 100%"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量修改" :visible.sync="dialogEdit" style="text-align: left;" width="30%"
               @close="handleClose">
      <el-form ref="batachForm" :model="batachForm" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-form-item label="部门">
            <el-select v-model.trim="batachForm.ba_department" style="width: 100%" filterable>
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否主组">
            <el-select v-model.trim="batachForm.ba_master" style="width: 100%">
              <el-option v-for="item in masterOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="batachForm.ba_comments" style="width: 100%"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('batachForm')">取 消</el-button>
        <el-button type="primary" @click="editBatach()">确 定</el-button>
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
  import {getVirtualGroup, addVirtualGroup, editVirtualGroup, deleteVirtualGroup,getUserGroup} from '@/api/manage_monitor/user_department'
  import {getdepartmentInfo2} from '@/api/zabbix/user_info'

  export default {
    name: 'DirectivePermission',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        departmentOptions: [],
        userOptions: [],
        multipleSelection: [],
        masterOptions:[{label:'是',value:'true'},{label:'否',value:'false'}],
        listQuery: {
          page: 1,
          limit: 20,
          department: undefined,
          user_name: undefined,
          is_master: undefined,
        },
        addForm: {
          department: '',
          user_name:[],
          is_master: 'false',
          comments: '',
        },
        editForm: {
          department: '',
          user_name:'',
          is_master: '',
          comments: '',
          id: '',
        },
        batachForm:{
          ba_department: '',
          ba_master: '',
          ba_comments: '',
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
        dialogEdit: false,
        f1:true,
        adminrole: false,
        rules: {
          user_name: [{required: true, message: '请选择用户', trigger: 'blur'}],
          is_master: [{required: true, message: '请选择组状态', trigger: 'blur'}],
          department: [{required: true, message: '请选择部门名称', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList()
      this.adminrole = this.roles.includes('admin')
      getdepartmentInfo2().then(res=>{
        this.departmentOptions=res
      })
      getUserGroup().then(res=>{
        this.userOptions=res
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      editBatach(){
        const tmp = this.multipleSelection
        for (const i of tmp) {
          if (this.batachForm.ba_department) {
            i.department=this.batachForm.ba_department
          }
          if (this.batachForm.ba_master) {
            i.is_master=this.batachForm.ba_master
          }
          if (this.batachForm.ba_comments) {
            i.comments=this.batachForm.ba_comments
          }
          editVirtualGroup(i.id, i).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
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
            this.dialogEdit = false
        }
      },
      batchDelete(){
        let msg = '确定删除该'+this.multipleSelection.length+'条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          for (const i of this.multipleSelection) {
            deleteVirtualGroup(i.id).then(response => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        }, () => {
          return false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length>0) {
          this.f1=false
        }else {
          this.f1=true
        }
      },
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteVirtualGroup(row.id).then(response => {
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
        this.editForm.department = row.department
        this.editForm.user_name = row.user_name
        this.editForm.is_master = row.is_master.toString()
        this.editForm.comments = row.comments
        this.editForm.id = row.id
      },
      edit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            editVirtualGroup(this.editForm.id, this.editForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
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
            this.dialogFormVisible = false
          }
        })
      },
      confirm() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            const x = this.addForm.user_name
            // for (const i in x) {
            for (var i = 0; i < x.length; i++) {
              const tmp = {}
              tmp.user_name=x[i]
              tmp.department=this.addForm.department
              tmp.is_master=this.addForm.is_master
              tmp.comments=this.addForm.comments
              addVirtualGroup(tmp).then(response => {
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
            }
            this.dialogSearchVisible = false
          }
        })
      },
      getList() {
        this.listLoading = true
        getVirtualGroup(this.listQuery).then(response => {
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
          is_master: undefined,
          user_name: undefined,
          department: undefined,
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.dialogSearchVisible = false
        this.dialogEdit = false
      },
      handleClose() {
        this.addForm = {
          department: '',
          user_name:[],
          is_master: 'false',
          comments: '',
        }
        this.batachForm={
          ba_department: '',
          ba_master: '',
          ba_comments: '',
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
