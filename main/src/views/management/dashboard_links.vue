<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item><el-input v-model.trim="listQuery.name" placeholder="模糊搜索"/></el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getlinks">搜索</el-button>
        <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogInsertVisible=true">新增</el-button>
      </el-form>
    </div>
    <el-table :data="tableData" border stripe highlight-current-row>
      <el-table-column label="名称" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDeletelinks(scope.row);" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;" @pagination="getlinks"/>
    <el-dialog title="新增" :visible.sync="dialogInsertVisible" width="500px" @close="handleClose" @open="handleOpen">
      <el-form ref="linksInsert" :model="linksInsert" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="名称" min-width="100" prop="name">
          <el-input v-model.trim="linksInsert.name" type="text" placeholder="请输入名称" auto-complete="off" style="width: 100%" />
        </el-form-item>
        <el-form-item label="链接" min-width="100" prop="url">
          <el-input v-model.trim="linksInsert.url" type="text" placeholder="请输入链接" auto-complete="off" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="AddlinksInf('linksInsert')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {get_links,add_links,delete_links} from '@/api/workflow/dashboard_links'
import Pagination from '@/components/Pagination'
import resize from '@/components/Charts/mixins/resize'

export default {
  components: { Pagination },
  mixins: [resize],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
      },
      dialogInsertVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
      },
      tableData: [],
      total: 0,
      linksInsert: {
        name: '',
        url:'',
      },
    }
  },
  created() {
    this.getlinks()
  },
  methods: {
    getlinks() {
      get_links(this.listQuery).then(response => {
        this.total = response.count
        this.tableData = response.results
      })
    },
    handleReset(){
      this.listQuery.name = ''
      this.getlinks()
    },
    handleClose(){
      this.dialogInsertVisible = false
    },
    handleOpen(){
      this.linksInsert.name = ''
      this.linksInsert.url = ''
    },
    AddlinksInf(formdata) {
      this.$refs[formdata].validate(valid => {
        if (valid) {
          add_links(this.linksInsert).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 3000
            })
            this.getlinks()
          }).catch(error => {
            this.$notify({
              title: '失败',
              message: '添加失败',
              type: 'error',
              duration: 3000
            })
          })
          this.handleClose()
        }
      })
    },
    handleDeletelinks(row) {
      delete_links(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 3000
        })
        this.getlinks()
      }).catch(error => {
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error',
          duration: 3000
        })
      })
    },
  }
}
</script>
