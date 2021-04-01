<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model.trim="listQuery.name" placeholder="维保商名称" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="dialogInsertVisible=true">新增维保商</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      stripe
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" sortable align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维保商名称" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维保联系人员" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.maintainer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维保联系人电话" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.maintainer_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维保级别" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维保项目" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.maintain_pro }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维保到期时间" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.expire_time }}</span>
        </template>
      </el-table-column>
       <el-table-column label="对接人" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleBatchEdit(scope.row);" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDeleteSupplierManage(scope.row);" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getSupplierManageDetail"
    />
    <el-dialog
      title="新增维保商信息"
      :visible.sync="dialogInsertVisible"
      width="500px"
      @close="handleClose"
    >
      <el-form ref="dataForm" :model="SupplierManageInsert" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item
          label="维保商名称"
          min-width="100"
          prop="name"
        >
          <el-input v-model.trim="SupplierManageInsert.name" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item
          label="维保联系人"
          min-width="100"
          prop="maintainer"
        >
          <el-input v-model.trim="SupplierManageInsert.maintainer" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item
          label="维保电话"
          min-width="100"
          prop="maintainer_phone"
        >
          <el-input v-model.trim="SupplierManageInsert.maintainer_phone" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item
          label="维保级别"
          prop="level"
        >
          <el-select v-model="SupplierManageInsert.level" style="width:330px">
            <el-option v-for="level in levels" :key="level.value" :label="level.label" :value="level.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="维保项目"
          min-width="100"
          prop="maintain_pro"
        >
          <el-input v-model.trim="SupplierManageInsert.maintain_pro" type="text" auto-complete="off" />
        </el-form-item>
         <el-form-item label="到期时间" prop="expire_time" >
           <el-date-picker
              v-model.trim="SupplierManageInsert.expire_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item
          label="对接人"
          prop="contact"
        >
          <el-select v-model="SupplierManageInsert.contact" filterable style="width:330px">
            <el-option v-for="contact in contacts" :key="contact.label+contact.value" :label="contact.label+contact.value" :value="contact.label+contact.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" min-width="100">
          <el-input v-model.trim="SupplierManageInsert.comments" type="text" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="AddSupplierManageInf('dataForm', SupplierManageInsert)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改维保商信息"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleCloseEdit"
    >
      <el-form ref="editForm" :model="supplierManageEdit" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item v-if="false" label="ID" min-width="100">
          <el-input v-model.trim="supplierManageEdit.id" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="供应商名称" min-width="100" prop="name">
          <el-input v-model.trim="supplierManageEdit.name" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="维保联系人" min-width="100" prop="maintainer">
          <el-input v-model.trim="supplierManageEdit.maintainer" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="维保电话" min-width="100" prop="maintainer_phone">
          <el-input v-model.trim="supplierManageEdit.maintainer_phone" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="维保级别" prop="level">
          <el-select
            v-model.trim="supplierManageEdit.level"
            style="width:330px"
          >
            <el-option v-for="level in levels" :key="level.value" :label="level.label" :value="level.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="维保项目" min-width="100" prop="maintain_pro">
          <el-input v-model.trim="supplierManageEdit.maintain_pro" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="到期时间" min-width="100" prop="expire_time">
          <el-date-picker
              v-model.trim="supplierManageEdit.expire_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="对接人"
          prop="contacts"
        >
          <el-select v-model="supplierManageEdit.contact" filterable style="width:330px">
            <el-option v-for="contact in contacts" :key="contact.label+contact.value" :label="contact.label+contact.value" :value="contact.label+contact.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" min-width="100">
          <el-input v-model.trim="supplierManageEdit.comments" type="text" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSupplierManageInf('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editSupplierManage, AddSupplierManage, getSupplierManage, deleteSupplierManage } from '@/api/cmdbs/supplier_manage'
import Pagination from '@/components/Pagination'
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import { constants } from 'crypto'
import { getUserInfo } from '@/api/zabbix/user_info'
import { RSA_PKCS1_PADDING } from 'constants';

var validPhone = (rule, value, callback) => {
  if (!(/^1[345789]\d{9}$/.test(value))&!(/^4[0-9-]*$/.test(value))) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

var formatDate = function (date) {
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '-' + m + '-' + d
  }

export default {
  components: { Pagination },
  mixins: [resize, sessionListQuery],
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        maintainer: [
          { required: true, message: '请输入维保联系人', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        maintainer_phone: [
          { required: true, message: '请输入维保联系电话', trigger: 'blur' },
          { validator: validPhone, trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择维保级别', trigger: 'blur' }
        ],
        maintain_pro:[
          { required: true, message: '请输入维保项目', trigger: 'blur' }
        ],
        expire_time:[
          { required: true, message: '请输入维保过期时间', trigger: 'blur' }
        ]
      },
      dialogInsertVisible: false,
      dialogVisible: false,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      tableData: [],
      total: 0,
      SupplierManageInsert: {
        name: '',
        maintainer_phone: '',
        maintainer: '',
        comments: '',
        level: '7*24小时',
        maintain_pro: '',
        expire_time: '',
        contact: ''
      },
      supplierManageEdit: {
        id: '',
        name: '',
        maintainer_phone: '',
        maintainer: '',
        comments: '',
        level: '',
        maintain_pro: '',
        expire_time: '',
        contact: ''
      },
      levels: [{
        value: '7*24小时',
        label: '7*24小时'
      }, {
        value: '5*8小时',
        label: '5*8小时'
      }, {
        value: '电话支持',
        label: '电话支持'
      }],
      contacts: [],
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      }
    }
  },
  created() {
    // get url param: name
    if (this.$route.query.name) {
        this.listQuery.name = this.$route.query.name
      }
    this.getSupplierManageDetail()
    getUserInfo().then(response => {
      this.contacts=response
    })

  },
  methods: {
    handleReset() {
      this.resetlistQuery()
      this.getSupplierManageDetail()
    },
    handleFilter() {
      this.getSupplierManageDetail()
    },
    getSupplierManageDetail() {
      this.listLoading = true
      getSupplierManage(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
    AddSupplierManageInf(formName, SupplierManageInsert) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var SupplierManageAdd = {
            name: '',
            maintainer: '',
            maintainer_phone: '',
            level: '',
            comments: '',
            maintain_pro: '',
            expire_time: '',
            contact:''
          }
          SupplierManageAdd.name = SupplierManageInsert.name
          SupplierManageAdd.maintainer = SupplierManageInsert.maintainer
          SupplierManageAdd.maintainer_phone = SupplierManageInsert.maintainer_phone
          SupplierManageAdd.level = SupplierManageInsert.level
          SupplierManageAdd.comments = SupplierManageInsert.comments
          SupplierManageAdd.maintain_pro = SupplierManageInsert.maintain_pro
          SupplierManageAdd.expire_time = SupplierManageInsert.expire_time
          SupplierManageAdd.contact = SupplierManageInsert.contact
          AddSupplierManage(SupplierManageAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加供应商信息成功',
              type: 'success',
              duration: 3000
            })
            this.dialogInsertVisible = false
            this.getSupplierManageDetail()
          }).catch(error => {
            this.dialogInsertVisible = false
            if (error.response.data.name == 'supplier manage with this 维保商名字 already exists.') {
              this.$notify({
                title: '添加失败',
                message: '该维保商信息已存在，请勿重复添加',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.$refs[formName].resetFields()
        }
      })
    },
    handleClose() {
      this.dialogInsertVisible = false
      this.$refs['dataForm'].resetFields()
    },
    handleCloseEdit() {
       this.dialogVisible = false
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: undefined
      }
    },
    handleDeleteSupplierManage(row) {
      var msg = '确认删除该维保商信息吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteSupplierManage(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getSupplierManageDetail()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
          console.log(error)
        })
      }, () => {
        return false
      })
    },
    handleBatchEdit(row) {
      this.dialogVisible = true
      this.supplierManageEdit.id = row.id
      this.supplierManageEdit.name = row.name
      this.supplierManageEdit.maintainer = row.maintainer
      this.supplierManageEdit.maintainer_phone = row.maintainer_phone
      this.supplierManageEdit.level = row.level
      this.supplierManageEdit.comments = row.comments
      this.supplierManageEdit.maintain_pro = row.maintain_pro
      this.supplierManageEdit.expire_time = row.expire_time
      this.supplierManageEdit.contact = row.contact
    },
    editSupplierManageInf(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editSupplierManage(this.supplierManageEdit.id, this.supplierManageEdit).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getSupplierManageDetail()
          }).catch(error => {
            if (error.response.data.name == 'supplier manage with this 维保商名字 already exists.') {
              this.$notify({
                title: '修改失败',
                message: '该维保商信息已存在，请勿重复添加',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.dialogVisible = false
        }
      })
    },
    resetSupplierManageInsert() {
      this.SupplierManageInsert = {
        name: '',
        maintainer_phone: '',
        maintainer: '',
        comments: '',
        level: '7*24小时',
        expire_time: ''
      }
    }
  }
}
</script>

<style scoped>
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width:330px!important
  }
</style>

