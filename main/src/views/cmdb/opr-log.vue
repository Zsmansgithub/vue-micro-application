<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <el-form-item><el-input v-model="listQuery.content" @input="handleFilter" clearable placeholder="请输入查询条件"/></el-form-item>
        <el-form-item prop="user">
          <el-select
            v-model="listQuery.user"
            placeholder="操作用户"
            filterable
            clearable
            class="filter-item"
            style="width: 200px"
            @change="handleFilter"
          >
            <el-option
              v-for="item in logOptions"
              :key="item.key"
              :label="'('+item.display_user+')'+item.key"
              :value="item.display_user+'('+item.key+')'"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.mon_type"
            placeholder="类型"
            filterable
            clearable
            class="filter-item"
            style="width: 120px"
            @change="handleFilter"
          >
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="listQuery.opr_time_s"
            class="filter-item"
            :picker-options="pickerOptions2"
            align="right"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFilter"
          />
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
          <span>{{ scope.row.opr_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作内容" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作用户" align="center" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作对象" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.opr_obj }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.mon_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作记录说明" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="create_time"  width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
  </div>
</template>

<script>
import { fetchOprLogList, fetchUserList } from '@/api/cmdb'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";

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
  mixins: [resize, sessionListQuery],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        opr_time_s: undefined,
        user: undefined,
        content: undefined,
        mon_type: undefined
      },
      list: null,
      total: 0,
      listLoading: true,
      activeName: 'ip',
      typeOptions: [{ label: '新增', key: 'insert' }, { label: '修改', key: 'update' }, { label: '删除', key: 'delete' }],
      logOptions: [],
      timestamp: '',
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() > Date.now()
        },
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      rules: {}
    }
  },
  created() {
    this.getList()
    this.getAppList()
  },
  methods: {
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    handleClose() {
      this.activeName = null
      this.$refs.mychild.timers()
      this.resetTemp()
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.opr_time_s){
        this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0])/1000)+ ','+ Math.floor(new Date(this.listQuery.opr_time_s[1])/1000)
      } else {
        this.listQuery.rtime=undefined
      }

      fetchOprLogList(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    getAppList() {
      fetchUserList().then(response => {
        const logOptions = []
        for (const i of response) {
          logOptions.push({
            display_user: i.first_name, key: i.username
          })
        }
        this.logOptions = logOptions
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
        opr_time_s: undefined,
        user: undefined,
        content: undefined,
        mon_type: undefined
      }
    }
  }
}
</script>
<style>

</style>
