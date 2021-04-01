<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-select v-model="listQuery.ip" placeholder="IP" filterable clearable style="width:180px" @change="handleFilter">
            <el-option v-for="item in ip_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增记录</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table v-loading="listLoading" :data="tableData" border stripe highlight-current-row fit>
      <el-table-column label="ID" prop="id" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP">
        <template slot-scope="scope">
          <!-- <el-tooltip class="item" effect="dark" content="公网IP" placement="top" v-if="scope.row.public_ip==null">
            <i v-if="scope.row.public_ip==null" class="el-icon-star-on" style="color:red"></i>
          </el-tooltip> -->
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否公网IP">
        <template slot-scope="scope">
          <span>{{ scope.row.is_public_ip_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户端类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.client_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更人">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更时间">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getRowsInf"
    />
<!-- 
    <el-dialog :title="addTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="650px">
      <el-form ref="rowAdd" :model="rowAdd" :rules="rules" label-width="100px">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="rowAdd.ip" v-if="addFlag" type="textarea" :rows="10" placeholder="请输入IP列表,以逗号分隔" style="width:500px;"/>
          <el-input v-model="rowAdd.ip" v-else placeholder="请输入IP" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="客户端类型" style="width:100%;">
          <el-input v-model="rowAdd.client_type" placeholder="请输入客户端类型" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="描述信息" style="width:100%;">
          <el-input v-model="rowAdd.description" placeholder="请输入描述信息" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="备注" style="width:100%;">
          <el-input v-model="rowAdd.comments" placeholder="请输入备注" style="width:500px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="addFlag" @click="submitForm('rowAdd', 1)">确定</el-button>
        <el-button type="primary" v-else @click="submitForm('rowAdd', 2)">确定</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="新增记录" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="650px">
      <el-form ref="rowAdd" :model="rowAdd" :rules="rules" label-width="100px">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="rowAdd.ip" type="textarea" :rows="10" placeholder="请输入IP列表,以逗号分隔" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="是否公网IP" prop="is_public_ip">
          <el-select v-model="rowAdd.is_public_ip" placeholder="" filterable clearable style="width:500px">
            <el-option v-for="item in is_public_ip_options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户端类型" style="width:100%;">
          <el-input v-model="rowAdd.client_type" placeholder="请输入客户端类型" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="描述信息" style="width:100%;">
          <el-input v-model="rowAdd.description" placeholder="请输入描述信息" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="备注" style="width:100%;">
          <el-input v-model="rowAdd.comments" placeholder="请输入备注" style="width:500px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onAdd('rowAdd')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改记录" :visible.sync="dialogEditVisible" :before-close="handleEditClose" :close-on-click-modal="false" width="650px">
      <el-form ref="rowEdit" :model="rowEdit" :rules="rules1" label-width="100px">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="rowEdit.ip" disabled placeholder="请输入IP" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="是否公网IP" prop="is_public_ip">
          <el-select v-model="rowEdit.is_public_ip" placeholder="" filterable clearable style="width:500px">
            <el-option v-for="item in is_public_ip_options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户端类型" style="width:100%;">
          <el-input v-model="rowEdit.client_type" placeholder="请输入客户端类型" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="描述信息" style="width:100%;">
          <el-input v-model="rowEdit.description" placeholder="请输入描述信息" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="备注" style="width:100%;">
          <el-input v-model="rowEdit.comments" placeholder="请输入备注" style="width:500px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditClose">取 消</el-button>
        <el-button type="primary" @click="onEdit('rowEdit')">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRow, addRow, editRow, deleteRow, getQueryOptions, getPublicIPOptions, bastionAddValidation } from '@/api/cmdbs/bastion_host'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { validIp } from '@/utils/validate'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  name: 'BastionHost',
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
      bastionAddValidation({ip: value.trim().split(/[,;\/\-|\s]+/).join(',')}).then(response => {
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
        ip: undefined
      },
      ip_options: [],
      // public_ip_options: [],
      is_public_ip_options: [{label: '是', value: 1}, {label: '否', value: 0}],

      tableData: [],
      total: 0,
      listLoading: false,

      adminrole: false,

      // addTitle: '新增记录',
      dialogVisible: false,
      // addFlag: false,
      rowAdd: {
        ip: undefined,
        is_public_ip: undefined,
        client_type: undefined,
        description: undefined,
        comments: undefined,
        change_user: this.name
      },

      dialogEditVisible: false,
      rowEdit: {
        ip: undefined,
        is_public_ip: undefined,
        client_type: undefined,
        description: undefined,
        comments: undefined,
        change_user: this.name
      },

      rules: {
        ip: [{required: true, validator: validateIpaddress, trigger: 'blur'}],
        is_public_ip: [{required: true}]
      },
      rules1: {
        is_public_ip: [{required: true}]
      },

    }
  },

  created() {
    getQueryOptions().then(response => {
      this.ip_options = response
    })

    // this.getPublicIP()

    this.getRowsInf()

    this.adminrole = this.roles.includes('host_manager')

  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  methods: {
    // getPublicIP() {
    //   getPublicIPOptions().then(response => {
    //     this.public_ip_options = response
    //   })
    // },

    handleFilter() {
      this.listQuery.page = 1
      this.getRowsInf()
    },

    handleReset() {
      this.listQuery = this.$options.data().listQuery
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

    handleAdd() {
      // this.addTitle = '新增记录'
      this.rowAdd = this.$options.data().rowAdd
      this.dialogVisible = true
      // this.addFlag = true
    },

    handleClose() {
      this.rowAdd = this.$options.data().rowAdd
      this.dialogVisible = false
      // this.addFlag = false
    },
    handleEditClose() {
      this.dialogEditVisible = false
    },

    handleEdit(row) {
      // this.addTitle = '修改记录'
      this.dialogEditVisible = true
      this.rowEdit = deepClone(row)
      delete this.rowEdit['update_time']
    },

    onAdd(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          this.rowAdd.change_user = this.name
          this.rowAdd.ip = this.rowAdd.ip.trim().split(/[,;\/\-|\s]+/).join(',')
          addRow(this.rowAdd).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
              });
              this.getRowsInf();
              this.resetForm(formName)
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
          this.handleClose()
          // this.getPublicIP()
        } else {
          this.$message({
            message: '请填写必要的字段和内容',
            type: 'warning',
          });
          return false
        }
      });
    },
    onEdit(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          this.rowEdit.change_user = this.name
          editRow(this.rowEdit.id, this.rowEdit).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
              });
              this.getRowsInf();
              this.resetForm(formName)
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
          this.handleEditClose()
          // this.getPublicIP()
        } else {
          this.$message({
            message: '请填写必要的字段和内容',
            type: 'warning',
          });
          return false
        }
      });
    },
    // submitForm(formName, status) {
    //   this.$refs[formName].validate(valid => {
    //     if(valid) {
    //       this.rowAdd.change_user = this.name
    //       let func = undefined
    //       if(status == 2) {
    //         func = editRow(this.rowAdd.id, this.rowAdd)
    //       } else {
    //         func = addRow(this.rowAdd)
    //         this.rowAdd.ip = this.rowAdd.ip.trim().split(/[,;\/\-|\s]+/).join(',')
    //       }
    //       func.then(response => {
    //           this.$notify({
    //             title: '成功',
    //             message: '提交成功',
    //             type: 'success',
    //           });
    //           this.getRowsInf();
    //           this.resetForm(formName)
    //         }).catch(err => {
    //           this.$message({
    //             message: err,
    //           });
    //         });
    //       this.handleClose()
    //     } else {
    //       this.$message({
    //         message: '请填写必要的字段和内容',
    //         type: 'warning',
    //       });
    //       return false
    //     }
    //   });
    // },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleDelete(row) {
      var msg = '确认删除该记录吗?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteRow(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getRowsInf()
          // this.getPublicIP()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
          // console.log(error)
        })
      })
    },

  }

}
</script>

<style lang="scss" scoped>
  a {
    color: #1890ff;
  }
</style>
