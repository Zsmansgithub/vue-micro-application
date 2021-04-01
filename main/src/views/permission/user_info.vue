<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model="listQuery.uuid" style="width: 100%" clearable placeholder="工号"
                    @input="handleFilter">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.user_name" placeholder="姓名" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.ou" placeholder="部门" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" plain @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" @click="dialogSearchVisible=true" plain icon="el-icon-plus">新增
        </el-button>
<!--        <el-button class="filter-item" type="primary" @click="dialogAddVisible=true" plain icon="el-icon-plus">自动新增-->
<!--        </el-button>-->
        <el-form-item style="margin-left: 10px">
          <el-input placeholder="请输入工号" v-model="new_uuid" class="input-with-select">
            <el-button slot="append" icon="el-icon-plus" @click="add_uuid"></el-button>
          </el-input>
        </el-form-item>
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
      <el-table-column label="工号" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.job_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门/部门ID">
        <template slot-scope="scope">
          <span>{{ scope.row.ou }}</span>
          <div style="font-size: 10px;color: #a8a9a9">{{scope.row.ouid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email}}</span>
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
          <el-form-item label="工号" prop="uuid">
            <el-input type="number" v-model.trim="addForm.uuid" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="user_name">
            <el-input v-model.trim="addForm.user_name" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="职称" prop="job_name">
            <el-input v-model.trim="addForm.job_name" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="ou">
            <el-select v-model.trim="addForm.ou" style="width: 100%" filterable placeholder="请选择部门，如果没有，请先新增部门信息">
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.ou_path+'-'+item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model.trim="addForm.mobile" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model.trim="addForm.email" style="width: 100%"></el-input>
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
        <el-form-item label="姓名" prop="user_name">
          <el-input v-model.trim="editForm.user_name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="job_name">
          <el-input v-model.trim="editForm.job_name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="ou">
          <el-select v-model.trim="editForm.ou" style="width: 100%" filterable placeholder="请选择部门，如果没有，请先新增部门信息">
            <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.ou_path+'-'+item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model.trim="editForm.mobile" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model.trim="editForm.email" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="工号新增" :visible.sync="dialogAddVisible" width="400px" @close="handleClose">
      <el-form ref="uuidForm" :model="uuidForm" :rules="rules" label-width="110px" style="margin-right: 20px">
        <el-form-item label="工号" prop="uuid">
          <el-input v-model.trim="uuidForm.uuid" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('uuidForm')">取 消</el-button>
        <el-button type="primary" @click="add_uuid1('uuidForm')">确 定</el-button>
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
    addUserInfo,
    addUuidInfo,
    deleteUserInfo,
    editUserInfo,
    getUsersInfo
  } from '@/api/manage_monitor/user_department'
  import {getdepartmentInfo2} from '@/api/zabbix/user_info'
  import {validEmail} from '@/utils/validate'

  export default {
    name: 'DirectivePermission',
    components: {Pagination,validEmail},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      const checkPhone = (rule, value, callback) => {
        setTimeout(() => {
          if (!(/^1[3456789]\d{9}$/.test(value))) {
            callback(new Error('请输入正确的手机号'));
          } else {
            callback();
          }
        }, 1000);
      };
      const checkEmail = (rule, value, callback) => {
        setTimeout(() => {
          if (!validEmail(value)) {
            callback(new Error('请输入正确的邮箱地址'));
          } else {
            callback();
          }
        }, 1000);
      };
      return {
        departmentOptions: [],
        groupOptions: [],
        listQuery: {
          page: 1,
          limit: 20,
          uuid: undefined,
          user_name: undefined,
          ou: undefined,
        },
        addForm: {
          job_name: '',
          mobile: '',
          ou: '',
          ouid: '',
          user_name: '',
          uuid: '',
          email: '',
        },
        editForm: {
          job_name: '',
          mobile: '',
          ou: '',
          ouid: '',
          user_name: '',
          uuid: '',
          email: '',
        },
        uuidForm:{
          uuid:''
        },
        new_uuid:'',
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
        dialogAddVisible: false,
        adminrole: false,
        rules: {
          user_name: [{required: true, message: '请填写姓名', trigger: 'blur'}],
          job_name: [{required: true, message: '请填写职称', trigger: 'blur'}],
          ou: [{required: true, message: '请填写部门名称', trigger: 'blur'}],
          ouid: [{required: true, message: '请填写ouid', trigger: 'blur'}],
          uuid: [{required: true, message: '请填写工号', trigger: 'blur'},
            {max:8,message: '最多填写8位', trigger: 'blur'}],
          mobile: [{required: true, message: '请填写手机号', trigger: 'blur'},
          { type: 'number', validator: checkPhone, message: '请输入11位有效手机号号码', trigger: ['blur', 'change'] }],
        },
      }
    },
    created() {
      this.getList()
      this.adminrole = this.roles.includes('admin')
      getdepartmentInfo2().then(res=>{
        this.departmentOptions=res
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      add_uuid() {
        if (this.new_uuid) {
          addUuidInfo({id: this.new_uuid}).then(res => {
            this.$message({
              title: '执行完成',
              message: '总共'+res.total+'条,成功'+res.success.length+'条,失败'+res.error.length+'条',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(error => {
            this.$message({
              message: error
            })
          })
        }
      },
      // add_uuid(formName){
      //   this.$refs[formName].validate(valid=>{
      //     if (valid) {}
      //   })
      // },
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteUserInfo(row.uuid).then(response => {
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
        this.editForm.ou = row.ou+'-'+row.ouid
        this.editForm.user_name = row.user_name
        this.editForm.ouid = row.ouid
        this.editForm.uuid = row.uuid
        this.editForm.mobile = row.mobile
        this.editForm.job_name = row.job_name
        this.editForm.email = row.email
      },
      edit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            const tmp = this.editForm.ou.split('-')
            this.editForm.ou = tmp[0]
            this.editForm.ouid = tmp[1]
            if (this.editForm.email) {
              if (!validEmail(this.editForm.email)) {
                return this.$message({
                  title: '警告',
                  message: '请输入正确的邮箱地址',
                  type: 'warning',
                  duration: 2000
                })
              }
            }
            editUserInfo(this.editForm.uuid, this.editForm).then(response => {
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
            const tmp = this.addForm.ou.split('-')
            this.addForm.ou=tmp[0]
            this.addForm.ouid=tmp[1]
            if (this.addForm.email) {
              if (!validEmail(this.addForm.email)) {
                return this.$message({
                  title: '警告',
                  message: '请输入正确的邮箱地址',
                  type: 'warning',
                  duration: 2000
                })
              }
            }
            addUserInfo(this.addForm).then(response => {
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
        getUsersInfo(this.listQuery).then(response => {
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
          uuid: undefined,
          user_name: undefined,
          ou: undefined,
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.dialogSearchVisible = false
        this.dialogAddVisible=false
      },
      handleClose() {
        this.addForm = {
          job_name: '',
          mobile: '',
          ou: '',
          ouid: '',
          user_name: '',
          uuid: '',
          email: '',
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

