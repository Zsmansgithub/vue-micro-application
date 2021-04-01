<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-select v-model="listQuery.board" placeholder="板块" filterable clearable>
            <el-option v-for="item in boards" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="请输入标题" style="width:280px;"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="handleAdd" v-if="adminrole">新增记录</el-button> -->
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增记录</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table v-loading="listLoading" :data="tableData" border stripe highlight-current-row fit>
      <el-table-column label="ID" prop="id" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="板块" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.board_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="250px">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="URL">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content.slice(0,50) }} ...</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建用户" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="170px" align="center" v-if="adminrole"> -->
      <el-table-column label="操作" width="170px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" circle @click="handlePreview(scope.row.id)" />
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

  </div>
</template>

<script>
import { getRow, addRow, editRow, deleteRow, getBoardNames } from '@/api/management/help_doc'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  name: 'HelpDoc',
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        board: undefined,
        search: undefined
      },
      boards: [],

      tableData: [],
      total: 0,
      listLoading: false,

      adminrole: false,

      rowAdd: {
        board: '',
        title: '',
        content: '',
        change_user: this.name,
      },
      rowEdit: {
        id: '',
        board: '',
        title: '',
        content: '',
        change_user: this.name,
      },

      rules: {
        unit: [
          { required: true, message: '请输入组织', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        plate: [
          { required: true, message: '请输入板块', trigger: 'change'},
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        project_name: [
          { required: true, message: '请输入模块', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
      },

      host: undefined,
    }
  },

  created() {
    this.getRowsInf()

    getBoardNames().then(response => {
      this.boards = response
    })

    this.adminrole = this.roles.includes('admin')

    // this.host = window.location.protocol + '//' + window.location.host
  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate(valid => {
        if (valid) {
          this.getRowsInf()
        }
      })
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        board: undefined,
        search: undefined
      }
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
      }).catch(error => {
        this.$message({ message: '调用后端接口getRow出错!'})
        this.listLoading = false
      })
    },

    handleAdd() {
      this.$router.push({ name: 'help_doc_edit', params: { flag: 'add' } })
    },

    handleEdit(row) {
      this.$router.push({ name: 'help_doc_edit', params: { row: row, flag: 'edit' } })
    },

    handlePreview(id) {
      this.$router.push({ name: 'help_doc_preview', query: { id: id } })
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

  }

}
</script>

<style lang="scss" scoped>
  a {
    color: #1890ff;
  }
</style>
