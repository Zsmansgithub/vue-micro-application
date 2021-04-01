<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-select v-model="listQuery.name" style="width: 100%" filterable clearable placeholder="组名"
                     @change="handleFilter">
            <el-option v-for="item in groupOptions" :key="item.key" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="email" v-if="false">
          <el-input v-model="listQuery.email" placeholder="部门信息" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" @click="dialogSearchVisible=true" icon="el-icon-plus">新增记录
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
      <el-table-column label="ID" prop="id" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名详情" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.detail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所有用户">
        <template slot-scope="scope">
          <span>{{ String(scope.row.user).replace(/\[|]\"/g,'') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" plain circle @click="handleBatchEdit(scope.row);" icon="el-icon-edit"></el-button>
          <el-button v-if="false" type="danger" plain circle @click="handleBatchDelete(scope.row);"
                     icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="添加记录" :visible.sync="dialogSearchVisible" style="text-align: left;" width="900px"
               @close="handleClose">
      <div style="width:812px;">
        <el-form ref="groupConfig" :model="groupConfig" :rules="rules" label-width="110px"
                 style="margin-right: 20px;margin-left: 20px">
          <el-form-item label="组名" min-width="100" prop="group_id">
            <el-input v-model="groupConfig.group_id" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="组名详情" prop="detail">
            <el-input v-model="groupConfig.detail" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="groupConfig.remark" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="用户名" min-width="100" prop="user_id">
            <el-transfer filterable filter-placeholder="请输入查询条件" v-model="groupConfig.user_id"
                         :data="userOptions" :titles="['待选用户', '已选用户']" class="transfer" style="width: 100%">
            </el-transfer>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('groupConfig')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogFormVisible" style="text-align: left;" width="900px"
               @close="handleClose">
      <div style="width:812px;">
        <el-form ref="groupEditConfig" :model="groupEditConfig" :rules="rules" label-width="110px"
                 style="margin-right: 20px;margin-left: 20px">
          <el-form-item label="组名" min-width="100" prop="group_id">
            <el-input v-model="groupEditConfig.group_id" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="组名详情" prop="detail">
            <el-input v-model="groupEditConfig.detail" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="groupEditConfig.remark" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="用户名" min-width="100" prop="user_id">
            <el-transfer filterable filter-placeholder="请输入查询条件" v-model="groupEditConfig.user_id" class="transfer"
                         :data="userOptions" :titles="['待选用户', '已选用户']">
            </el-transfer>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('groupEditConfig')">取 消</el-button>
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
    addGroup,
    fetchAuthUser,
    fetchAuthGroup,
    addUserGroup,
    editUserGroup,
    deleteUserGroup,
    fetchGroup,
    editGroup
  } from '@/api/manage_monitor/manage'

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
          first_name: undefined,
          email: undefined,
        },
        groupConfig: {
          user_id: [],
          group_id: '',
          detach: '',
          remark: ''
        },
        groupEditConfig: {
          id: '',
          user_id: [],
          group_id: '',
          detail: '',
          remark: '',
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
        dialogFormVisible: false,
        dialogSearchVisible: false,
        adminrole: false,
        rules: {
          user_id: [{required: true, message: '请选择用户名', trigger: 'blur'}],
          group_id: [{required: true, message: '请填写组名', trigger: 'blur'}],
          detail: [{required: true, message: '请填写组名详情', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList()
      this.adminrole = this.roles.includes('admin')
      fetchAuthUser().then(res => {
        const user = []
        for (const j of res) {
          user.push({
            key: j.id, label: j.first_name + '_' + j.email
          })
        }
        this.userOptions = user
      })
      fetchAuthGroup().then(res => {
        const group = []
        for (const i of res) {
          group.push({
            key: i.id, label: i.name
          })
        }
        this.groupOptions = group
      })
      fetchGroup().then(res => {
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteUserGroup({user_id: row.id, group_id: row.groups}).then(response => {
            if (response.status === 'ok') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
          this.getList()
        }, () => {
          return false
        })
      },
      handleBatchEdit(row) {
        this.dialogFormVisible = true
        this.groupEditConfig.user_id = row.users
        this.groupEditConfig.group_id = row.name
        this.groupEditConfig.id = row.id
        this.groupEditConfig.detail = row.detail
        this.groupEditConfig.remark = row.remark
      },
      edit() {
        this.$refs.groupEditConfig.validate(valid => {
          if (valid) {
            editGroup(this.groupEditConfig).then(response => {
              if (response.status === 'ok') {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: '修改失败',
                  type: 'error',
                  duration: 2000
                })
              }
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
        this.$refs.groupConfig.validate(valid => {
          if (valid) {
            addGroup(this.groupConfig).then(response => {
              if (response.status === 'ok') {
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: '添加失败',
                  type: 'error',
                  duration: 2000
                })
              }
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
        fetchGroup(this.listQuery).then(response => {
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
          first_name: undefined,
          email: undefined,
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.dialogSearchVisible = false
      },
      handleClose() {
        this.groupConfig = {
          user_id: [],
          group_id: '',
          detach: '',
          remark: ''
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

  .transfer /deep/ div.el-transfer-panel {
    width: 240px;
  }
  .transfer /deep/ label.el-checkbox {
    display: block;
  }
</style>

