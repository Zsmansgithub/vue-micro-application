<template>
  <div class="app-container">
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-date-picker v-model="listQuery.time_range_date" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button class="filter-item" type="primary" @click="getList" icon="el-icon-search">搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
          @click="handleReset">重置
        </el-button>
      </el-form>
    </div>
    <div class="search-title">各系统异常情况</div>
    <div class="search-table">
      <el-table v-loading="listLoading" :data="tableData1" border stripe highlight-current-row size="mini">
        <el-table-column label="类别" prop='label' align="center">
        </el-table-column>
        <el-table-column label="次数" prop='count' align="center">
        </el-table-column>
        <el-table-column label="次数占比" align="center">
          <template slot-scope="scope">
            {{scope.row.count_rate}}%
          </template>
        </el-table-column>
        <el-table-column label="时间（分钟）" prop='time' align="center">
        </el-table-column>
        <el-table-column label="时间占比" align="center">
          <template slot-scope="scope">
            {{scope.row.time_rate}}%
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-title">异常情况汇总</div>
    <div class="search-table">
      <el-table v-loading="listLoading" :data="tableData2" border stripe highlight-current-row size="mini">
        <el-table-column label="部门" prop='label' align="center">
        </el-table-column>
        <el-table-column label="总异常次数" prop='count_total' align="center">
        </el-table-column>
        <el-table-column label="总异常时间" prop='time_total' align="center">
        </el-table-column>
        <el-table-column label="系统故障次数" prop='count_system' align="center">
        </el-table-column>
        <el-table-column label="系统故障时间" prop='time_system' align="center">
        </el-table-column>
        <el-table-column label="计划性维护次数" prop='count_plan' align="center">
        </el-table-column>
        <el-table-column label="计划性维护时间" prop='time_plan' align="center">
        </el-table-column>
        <!-- <el-table-column label="待判责异常次数" prop='count_Untreated' align="center">
        </el-table-column> -->
        <el-table-column label="月系统稳定率" align="center">
          <template slot-scope="scope">
            {{scope.row.month_rate}}%
          </template>
        </el-table-column>
        <el-table-column label="月系统可用率" align="center">
          <template slot-scope="scope">
            {{scope.row.month_useful}}%
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import sessionListQuery from '@/components/mixins/sessionListQuery'
  import mixin from './components/mixins'
  import { getlist1, getlist2 } from '@/api/itsm/statistical_report'

  // 系统异常情况字段 tableData1
  const data1 = {
    label: undefined, // 类别
    count: undefined, // 次数
    count_rate: undefined, // 次数占比
    time: undefined, // 时间
    time_rate: undefined, // 时间占比
  }
  const data1Label = ['计划性维护', '系统故障', '科技公司']
  // 系统异常情况汇总字段 tableData2
  const data2 = {
    label: undefined, // 类别
    count_total: undefined, // 总异常次数
    time_total: undefined, // 总异常时间
    count_system: undefined, // 系统故障次数
    time_system: undefined, // 系统故障时间
    count_plan: undefined, // 计划性维护次数
    time_plan: undefined, // 计划性维护时间
    // count_Untreated: undefined, // 待判责异常次数
    month_rate: undefined, // 月系统稳定率
    month_useful: undefined, // 月系统可用率
  }
  export default {
    mixins: [sessionListQuery, mixin],
    data() {
      return {
        listQuery: {
          time_range_date: undefined
        },
        tableData1: [],
        tableData2: [],
        listLoading: false,
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        const listQuery = this.rangeTime()
        getlist1(listQuery).then((res) => {
          try {
            this.tableData1 = data1Label.reduce((list, v, idx) => {
              const val = {
                label: v,
              }
              Object.keys(data1).slice(1,).map((key) => {
                val[key] = res.data[key][idx]
              })
              list.push(val)
              return list
            }, [])
          }
          catch (e) {
            console.error(e)
            this.tableData2 = []
          }
        })
          .catch((e) => {
            console.error(e)
          })
        getlist2(listQuery).then((res) => {
          try {
            this.tableData2 = res.data.reduce((list, v) => {
              const val = { label: v.department_name }
              Object.keys(data2).slice(1,).map((key, idx) => {
                val[key] = v.data[idx]
              })
              list.push(val)
              return list
            }, [])
          }
          catch (e) {
            console.error(e)
            this.tableData2 = []
          }
        })
          .catch((e) => {
            console.error(e)
          })
      },
      handleReset() {
        this.listQuery = this.$options.data().listQuery
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/borderLightBlue.scss';

  .search-title {
    padding: 10px;
    color: #606266;
  }

  .search-table {
    @extend .border-light-blue;
  }
</style>