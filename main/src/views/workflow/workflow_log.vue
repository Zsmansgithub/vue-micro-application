<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <el-form-item prop="user">
          <el-select
            v-model="listQuery.mon_type"
            placeholder="工作流类别"
            filterable
            clearable
            class="filter-item"
            style="width: 300px"
          >
            <el-option
              v-for="item in logOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.node"
            placeholder="状态"
            filterable
            clearable
            class="filter-item"
            style="width: 200px"
          >
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">
          重置
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
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作流类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workflow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作流状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.node }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="create_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
  </div>
</template>

<script>
import { getWorkFlowLine } from '@/api/workflow/app_line'
import { getWorkFlowLog } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  mixins: [resize],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        opr_time_s: undefined,
        user: undefined,
        mon_type: undefined
      },
      list: null,
      total: 0,
      listLoading: true,
      activeName: 'ip',
      typeOptions: [
        { label: '部门领导审批', key: '1' },
        { label: '主机组审批', key: '2' },
        { label: '审批完成', key: '3' },
        { label: '驳回申请', key: '4' },
        { label: '撤回申请', key: '11111' }
      ],
      logOptions: [],
      timestamp: '',
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() > Date.now()
        }
      },
      datatime_default: '',
      rules: {}
    }
  },
  created() {
    this.getList()
    this.getAppList()
  },
  methods: {
    getdata() {
      const date = new Date()
      return date.getFullYear() + '-' + date.getMonth() // 2019-05-1
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    renderline() {
      this.$refs.mychild.render(this.historySearch)
    },
    handleClose() {
      this.activeName = null
      this.$refs.mychild.timers()
      this.resetTemp()
    },
    handleClick(tab, event) {
      console.info('sfsf')
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.opr_time_s){
        this.listQuery.rtime = Math.floor(this.listQuery.opr_time_s[0]/1000)+ ','+ Math.floor(this.listQuery.opr_time_s[1]/1000)
      } else {
        this.listQuery.rtime=undefined
      }
      getWorkFlowLog(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    getAppList() {
      getWorkFlowLine().then(response => {
        this.logOptions = response
      })
    },
    handleFilter(listQuery) {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate((valid) => {
        if (valid) {
          this.getList()
        }
      })
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        app: undefined,
        server_ip: undefined,
        ip_list: undefined,
        hostname_list: undefined
      }
    }
  }
}
</script>
<style>

</style>
