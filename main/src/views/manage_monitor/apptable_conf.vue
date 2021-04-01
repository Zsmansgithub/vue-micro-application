<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" inline>
        <el-form-item prop="type">
          <el-input v-model="listQuery.type" placeholder="类型" clearable class="filter-item"
                    @input="handleFilter"></el-input>
        </el-form-item>
        <el-form-item prop="app_name">
          <el-input v-model="listQuery.app_name" placeholder="项目名" clearable class="filter-item"
                    @input="handleFilter"></el-input>
        </el-form-item>
        <el-form-item prop="table_name">
          <el-input v-model="listQuery.table_name" placeholder="组名|表名" clearable class="filter-item"
                    @input="handleFilter"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="type">
          <el-select v-model="listQuery.type" @change="handleFilter" placeholder="类型" clearable>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
                   @click="dialogAdd=true">新增</el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%;">
      <el-table-column prop="id" label="ID" sortable align="center" width="120">
        <template slot-scope="scope">
          <span> {{ scope.row.id }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center" sortable>
        <template slot-scope="scope">
          <span> {{ scope.row.type }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="app_name" label="项目名" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.app_name }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="table_name" label="组名|表名" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.table_name }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="pk_field" label="字段名" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.pk_field }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"/>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
    <el-dialog title="新增信息" :visible.sync="dialogAdd" width="25%" @close="dialogAdd = false">
      <el-form ref="AppTableConfAdd" :model="AppTableConfAdd" :rules="rules" label-width="100px">
        <el-form-item label="类型" prop="type">
          <el-input v-model.trim="AppTableConfAdd.type" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="项目名" prop="app_name">
          <el-input v-model.trim="AppTableConfAdd.app_name" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="组名|表名" prop="table_name">
          <el-input v-model.trim="AppTableConfAdd.table_name" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="字段名" prop="pk_field">
          <el-input v-model.trim="AppTableConfAdd.pk_field" type="text" auto-complete="off"/>
        </el-form-item>
        <!-- <el-form-item label="类型" min-width="100" prop="type">
          <el-select v-model.trim="AppTableConfAdd.type" auto-complete="off" style="width: 100%">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('AppTableConfAdd')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editATCDialog" width="25%" @close="editATCDialog = false">
      <el-form ref="AppTableConfEdit" :model="AppTableConfEdit" :rules="rules" label-width="100px">
        <!-- <el-form-item v-if="false" label="ID" min-width="100">
          <el-input v-model.trim="AppTableConfEdit.id" type="text" auto-complete="off"/>
        </el-form-item> -->
        <el-form-item label="类型" prop="type">
          <el-input v-model.trim="AppTableConfEdit.type" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="项目名" prop="app_name">
          <el-input v-model.trim="AppTableConfEdit.app_name" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="组名|表名" prop="table_name">
          <el-input v-model.trim="AppTableConfEdit.table_name" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="字段名" prop="pk_field">
          <el-input v-model.trim="AppTableConfEdit.pk_field" type="text" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editATCDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAppTableConfList('AppTableConfEdit')">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  import {getAppTableConf, editAppTableConf,addAppTable,deleteAppTable} from '@/api/manage_monitor/manage'
  import Pagination from '@/components/Pagination'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import waves from '@/directive/waves'

  export default {
    name: 'AppTable',
    mixins: [resize, sessionListQuery],
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          app_name: undefined,
          table_name: undefined,
          type: undefined
        },
        list: null,
        total: 0,
        listLoading: true,
        loading: false,
        editATCDialog: false,
        dialogAdd: false,
        AppTableConfAdd: {
          type: '',
          app_name: '',
          table_name: '',
          pk_field: '',
        },
        AppTableConfEdit: {
          type: '',
          app_name: '',
          table_name: '',
          pk_field: '',
        },
        rules: {
          type: [{required: true, message: '请输入类型', trigger: 'blur'}],
          app_name: [{required: true, message: '请输入项目名', trigger: 'blur'}],
          table_name: [{required: true, message: '请输入组名|表名', trigger: 'blur'}],
          pk_field: [{required: true, message: '请输入字段名', trigger: 'blur'}],
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getAppTableConf(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      editAppTableConfList(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editAppTableConf(this.AppTableConfEdit.id, this.AppTableConfEdit).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            }).catch(error => {
              this.$notify({
                title: '修改失败',
                message: '请联系管理员',
                type: 'error',
                duration: 2000
              })
            })
            this.editATCDialog = false
          }
        })
      },
      handleEdit(row) {
        this.editATCDialog = true
        this.AppTableConfEdit.id = row.id
        this.AppTableConfEdit.app_name = row.app_name
        this.AppTableConfEdit.table_name = row.table_name
        this.AppTableConfEdit.pk_field = row.pk_field
        this.AppTableConfEdit.type = row.type
      },
      confirm(){
        this.$refs.AppTableConfAdd.validate(valid => {
          if (valid) {
            addAppTable(this.AppTableConfAdd).then(res=>{
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(error => {
              this.$notify({
                title: '修改失败',
                message: '请联系管理员',
                type: 'error',
                duration: 2000
              })
            })
            this.dialogAdd=false
          }
        })
      },
      handleDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteAppTable(row.id).then(response => {
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
          app_name: undefined,
          table_name: undefined,
          type: undefined
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogAdd = false
      },
    }
  }
</script>
