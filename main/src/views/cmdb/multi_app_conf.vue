<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.app" clearable filterable placeholder="应用名" @change="handleFilter">
          <el-option v-for="item in app_local_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.resourcemanage" clearable filterable placeholder="IP" @change="handleFilter">
          <el-option v-for="item in ip_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="adminrole" type="primary" @click="dialogVisibleAdd=true" icon="el-icon-plus">新增记录</el-button>
        <el-button v-if="sitrole" type="primary" @click="dialogVisibleSitAdd=true" icon="el-icon-plus">SIT记录</el-button>
        <el-button v-if="uatrole" type="primary" @click="dialogVisibleUatAdd=true" icon="el-icon-plus">UAT记录</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="tableData" border stripe highlight-current-row style="width:100%" ref="table">
      <el-table-column label="ID" prop="id" sortable align="center" width="80">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.change_user" placement="top">
            <span>{{ scope.row.app_rm2 }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品线名称" min-width="135px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>
            {{ scope.row.subsystem_name }}
            <div  style="color: #8492a6; font-size: 10px">{{ scope.row.project_name }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="应用/类型" min-width="135px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="appFilter(scope.row.app)">{{ scope.row.app_name }}</a>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.app_type }}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP/主机名" min-width="125px" prop="ip" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.host_name }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="包名" min-width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.package_name }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="系统版本" width="110px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.os_version }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.os_type_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="CPU" width="75px" prop="cpu" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存" width="75px" prop="memory" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}G</span>
        </template>
      </el-table-column>
      <el-table-column label="可用容量" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.disk }}G</span>
        </template>
      </el-table-column> -->
      <el-table-column label="环境/资源类型" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.resource_env_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.resource_type_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">{{ scope.row.status_name }}</el-tag>
          <el-tag v-else-if="scope.row.status==2" type="warning">{{ scope.row.status_name }}</el-tag>
          <el-tag v-else-if="scope.row.status==5" type="info">{{ scope.row.status_name }}</el-tag>
          <el-tag v-else>{{ scope.row.status_name }}</el-tag>
        </template>
      </el-table-column>
       <el-table-column label="负责/维护人" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.app_owner }}</span>
          <div style="color:#8492a6; font-size:10px"><span v-for="(site,index) in scope.row.maintain_user_name" :key="index">{{ site }} </span></div>
          <div style="color:#8492a6; font-size:10px"><span v-for="(site,index) in scope.row.ops_user_name" :key="index">{{ site }} </span></div>
        </template>
      </el-table-column>
      <el-table-column label="变更人" width="135px">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间/备注" width="135px" :show-overflow-tooltip="true" prop="update_time">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
          <div style="color:#8492a6; font-size:10px">{{ scope.row.comments }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center" v-if="sitrole || uatrole || adminrole">
        <template slot-scope="props">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(props.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(props.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRowsInf"
      style="padding-top:5px;margin-top:10px;"
    />

    <el-dialog title="新增记录" :visible.sync="dialogVisibleAdd" width="600px" @close="handleCloseDialogAdd" :close-on-click-modal="false">
      <el-form ref="addForm" :model="rowAdd" :rules="rules" label-width="60px">
        <el-form-item label="应用" prop="app">
          <el-cascader :props="{ expandTrigger: 'hover' }"
                      :options="projectOptions"
                      v-model="rowAdd.app"
                      filterable
                      clearable
                      style="width:90%;"
                      placeholder="请选择应用"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="rowAdd.ip" type="textarea" :rows="15" placeholder="请输入IP列表,以逗号分隔" style="width:90%"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="rowAdd.comments" type="text" placeholder="请输入备注" auto-complete="off" style="width:90%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogAdd">取 消</el-button>
        <el-button type="primary" @click="addRowInf('addForm', rowAdd)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增SIT记录" :visible.sync="dialogVisibleSitAdd" width="600px" @close="handleCloseDialogSitAdd" :close-on-click-modal="false">
      <el-form ref="sitAddForm" :model="rowSitAdd" :rules="rules1" label-width="60px">
        <el-form-item label="应用" prop="app">
          <!-- <el-select v-model="rowAdd.app" placeholder="请选择应用" clearable filterable style="width:428px">
            <el-option v-for="(item,index) in app_list" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-cascader :props="{ expandTrigger: 'hover' }"
                      :options="projectOptions"
                      v-model="rowSitAdd.app"
                      filterable
                      clearable
                      style="width:90%;"
                      placeholder="请选择应用"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="rowSitAdd.ip" type="textarea" :rows="15" placeholder="请输入IP列表,以逗号分隔,该输入框仅支持输入SIT环境的IP." style="width:90%"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="rowSitAdd.comments" type="text" placeholder="请输入备注" auto-complete="off" style="width:90%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogSitAdd">取 消</el-button>
        <el-button type="primary" @click="addRowInf('sitAddForm', rowSitAdd)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增UAT记录" :visible.sync="dialogVisibleUatAdd" width="600px" @close="handleCloseDialogUatAdd" :close-on-click-modal="false">
      <el-form ref="uatAddForm" :model="rowUatAdd" :rules="rules2" label-width="60px">
        <el-form-item label="应用" prop="app">
          <!-- <el-select v-model="rowAdd.app" placeholder="请选择应用" clearable filterable style="width:428px">
            <el-option v-for="(item,index) in app_list" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-cascader :props="{ expandTrigger: 'hover' }"
                      :options="projectOptions"
                      v-model="rowUatAdd.app"
                      filterable
                      clearable
                      style="width:90%;"
                      placeholder="请选择应用"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="rowUatAdd.ip" type="textarea" :rows="15" placeholder="请输入IP列表,以逗号分隔,,该输入框仅支持输入UAT环境的IP." style="width:90%"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="rowUatAdd.comments" type="text" placeholder="请输入备注" auto-complete="off" style="width:90%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogUatAdd">取 消</el-button>
        <el-button type="primary" @click="addRowInf('uatAddForm', rowUatAdd)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改记录" :visible.sync="dialogVisibleEdit" width="600px" @close="handleCloseDialogEdit" :close-on-click-modal="false">
      <el-form ref="editForm" :model="rowEdit" label-width="100px">
        <el-form-item label="备注">
          <el-input v-model.trim="rowEdit.comments" type="text" placeholder="请输入备注" auto-complete="off" style="width:428px"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogEdit">取 消</el-button>
        <el-button type="primary" @click="editRowInf('editForm', rowEdit)">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getRow, addRow, editRow, deleteRow, getMultiAppLocal, getMultiApp, getMultiAppIP, addValidation, addValidationSit, addValidationUat } from '@/api/cmdbs/multi_app_conf'
import { getProductAppCascader } from '@/api/cmdbs/product_line'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { validIp } from '@/utils/validate'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  name: 'MultiAppConf',
  components: { Pagination },
  mixins: [sessionListQuery],

  data() {
    const validateIpaddress = (rule, value, callback) => {
      if(value) {
        for(let ip of value.trim().split(/[,;\/\-|\s]+/)) {
          if(validIp(ip)) {
            // callback()
          } else {
            return callback(new Error(ip + '--此IP填写不正确!'))
          }
        }
      } else {
        return callback(new Error('请输入IP!'))
      }
      addValidation({ip: value.trim().split(/[,;\/\-|\s]+/).join(','), app: this.rowAdd.app[3]}).then(response => {
        if (response.status == 400) {
          callback(new Error(response.msg))
        } else if (response.status == 200) {
          callback()
        }
      })
    }

    const validateIpaddress1 = (rule, value, callback) => {
      if(value) {
        for(let ip of value.trim().split(/[,;\/\-|\s]+/)) {
          if(validIp(ip)) {
            // callback()
          } else {
            return callback(new Error(ip + '--此IP填写不正确!'))
          }
        }
      } else {
        return callback(new Error('请输入IP!'))
      }
      addValidationSit({ip: value.trim().split(/[,;\/\-|\s]+/).join(','), app: this.rowSitAdd.app[3]}).then(response => {
        if (response.status == 400) {
          callback(new Error(response.msg))
        } else if (response.status == 200) {
          callback()
        }
      })
    }

    const validateIpaddress2 = (rule, value, callback) => {
      if(value) {
        for(let ip of value.trim().split(/[,;\/\-|\s]+/)) {
          if(validIp(ip)) {
            // callback()
          } else {
            return callback(new Error(ip + '--此IP填写不正确!'))
          }
        }
      } else {
        return callback(new Error('请输入IP!'))
      }
      addValidationUat({ip: value.trim().split(/[,;\/\-|\s]+/).join(','), app: this.rowUatAdd.app[3]}).then(response => {
        if (response.status == 400) {
          callback(new Error(response.msg))
        } else if (response.status == 200) {
          callback()
        }
      })
    }

    return {
      listQuery: {
        page: 1,
        limit: 20,
        app: undefined,
        resourcemanage: undefined
      },
      app_local_list: [],
      projectOptions: [],
      ip_list: [],

      adminrole: false,
      sitrole: false,
      uatrole: false,

      listLoading: false,
      tableData: [],
      total: 0,

      dialogVisibleAdd: false,
      rowAdd: {
        app: undefined,
        ip: undefined,
        comments: undefined,
      },
      rules: {
        app: [{ required: true, message: '请选择应用!', trigger: 'change' }],
        ip: [{ required: true, validator: validateIpaddress, trigger: 'blur' }],
      },

      dialogVisibleSitAdd: false,
      rowSitAdd: {
        app: undefined,
        ip: undefined,
        comments: undefined,
      },
      rules1: {
        app: [{ required: true, message: '请选择应用!', trigger: 'change' }],
        ip: [{ required: true, validator: validateIpaddress1, trigger: 'blur' }],
      },

      dialogVisibleUatAdd: false,
      rowUatAdd: {
        app: undefined,
        ip: undefined,
        comments: undefined,
      },
      rules2: {
        app: [{ required: true, message: '请选择应用!', trigger: 'change' }],
        ip: [{ required: true, validator: validateIpaddress2, trigger: 'blur' }],
      },

      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },

      dialogVisibleEdit: false,
      rowEdit: {
        comments: undefined,
      },

    }
  },

  created() {
    this.adminrole = this.roles.includes('resource_admin')
    this.sitrole = this.roles.includes('cmdb_sit')
    this.uatrole = this.roles.includes('cmdb_uat')

    this.getRowsInf()

    getMultiAppLocal().then(response => {
      this.app_local_list = response
    })

    // getMultiApp().then(response => {
    //   this.app_list = response
    // })

    getMultiAppIP().then(response => {
      this.ip_list = response
    })

    getProductAppCascader().then(response => {
      this.projectOptions = response
    })

  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getRowsInf()
    },

    handleReset() {
      this.resetlistQuery()
      this.getRowsInf()
    },

    getRowsInf() {
      this.listLoading = true
      getRow(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },

    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        app: undefined,
        resourcemanage: undefined
      }
    },

    appFilter(app) {
      this.listQuery.page = 1
      this.listQuery.limit = 20
      this.listQuery.app=app
      this.listQuery.resourcemanage=undefined
      this.getRowsInf()
    },

    addRowInf(formName, rowAdd) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let rowInsertAdd = {
            app: undefined,
            ip: undefined,
            comments: undefined
          }
          rowInsertAdd.app = rowAdd.app[3]
          rowInsertAdd.ip = rowAdd.ip.trim().split(/[,;\/\-|\s]+/).join(',')
          rowInsertAdd.comments = rowAdd.comments
          addRow(rowInsertAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加记录成功',
              type: 'success',
              duration: 3000
            })
            this.getRowsInf()
          }).catch(error => {
            this.$notify({
              title: '添加失败',
              message: '该记录已存在',
              type: 'error',
              duration: 3000
            })
          })
          this.dialogVisibleAdd = false
          this.dialogVisibleSitAdd = false
          this.dialogVisibleUatAdd = false
          this.$refs[formName].resetFields()
        }
      })
    },

    handleCloseDialogAdd() {
      this.dialogVisibleAdd = false
      this.$refs['addForm'].resetFields()
      this.rowAdd = {
        app: undefined,
        ip: undefined,
        comments: undefined,
      }
    },
    handleCloseDialogSitAdd() {
      this.dialogVisibleSitAdd = false
      this.$refs['sitAddForm'].resetFields()
      this.rowSitAdd = {
        app: undefined,
        ip: undefined,
        comments: undefined
      }
    },
    handleCloseDialogUatAdd() {
      this.dialogVisibleUatAdd = false
      this.$refs['uatAddForm'].resetFields()
      this.rowUatAdd = {
        app: undefined,
        ip: undefined,
        comments: undefined
      }
    },

    handleCloseDialogEdit() {
      this.dialogVisibleEdit = false
      this.$refs['editForm'].resetFields()
      this.rowEdit = {
        comments: undefined,
        change_user: undefined
      }
    },

    handleDelete(row) {
      var msg = '确认删除该记录吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteRow(row.app_rm2).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getRowsInf()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
        })
      })
    },

    handleEdit(row) {
      this.dialogVisibleEdit = true
      this.rowEdit.id = row.app_rm2
      this.rowEdit.comments = row.comments
    },
    editRowInf(formName, rowEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let rowEditNew = {
            id: undefined,
            comments: ''
          }
          rowEditNew.id = rowEdit.id
          rowEditNew.comments = rowEdit.comments
          editRow(rowEditNew.id, rowEditNew).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getRowsInf()
          }).catch(error => {
              this.$notify({
                title: '修改失败',
                message: '该记录修改失败',
                type: 'error',
                duration: 3000
              })
          })
          this.$refs[formName].resetFields()
          this.dialogVisibleEdit = false
        }
      })
    },

  }

}
</script>
