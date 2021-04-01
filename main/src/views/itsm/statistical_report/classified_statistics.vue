<template>
  <div class="app-container">
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-date-picker v-model="listQuery.time_range_date" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" @change="getList">
          </el-date-picker>
        </el-form-item>
        <el-button class="filter-item" type="primary" @click="getList" icon="el-icon-search">搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
          @click="handleReset">重置
        </el-button>
      </el-form>
    </div>
    <div class="content">
      <div class="content-item">
        <div class="search-title">按业务线分类</div>
        <div class="search-table">
          <el-table v-loading="listLoading" :data="tableData1" border stripe highlight-current-row size="mini">
            <el-table-column label="系统名称" prop='label' align="center">
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
          </el-table>
        </div>
      </div>
      <div class="content-item">
        <div class="search-title">按产品线分类</div>
        <div class="search-table">
          <el-table v-loading="listLoading" :data="tableData2" border stripe highlight-current-row size="mini">
            <el-table-column label="部门" prop='label' align="center">
            </el-table-column>
            <el-table-column label="总异常次数" prop='count_total' align="center">
            </el-table-column>
            <el-table-column label="总异常时间" prop='time_total' align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- </div>
    <div class="content"> -->
      <div class="content-item">
        <div class="search-title">按异常星级分类</div>
        <div class="search-table">
          <el-table v-loading="listLoading" :data="tableData4" border stripe highlight-current-row size="mini">
            <el-table-column label="星级" prop='level' align="center">
              <template slot-scope="scoped">
                <span v-if="scoped.row.level > 5">科技公司</span>
                <e_rate v-else :star="scoped.row.level"></e_rate>
              </template>
            </el-table-column>
            <el-table-column label="异常次数" prop='count_total' align="center">
            </el-table-column>
            <el-table-column label="异常总时间（分钟）" prop='time_total' align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="content-item">
        <div class="search-title">按异常原因分类</div>
        <div class=" chart-content">
          <pie-chart v-if="pie_data.length" :id="chartId" width='600px' :key="chartId" height="350px" title="故障分类原因"
            :data="pie_data" :legend_data="legend_data"></pie-chart>
          <div v-else style="padding-top: 100px;color: #606266;">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PieChart from './components/PieChart'
  import e_rate from '@/views/itsm/components/system_avail_info/e_rate'
  import sessionListQuery from '@/components/mixins/sessionListQuery'
  import mixin from './components/mixins'
  import { getlist3, getlist4, getlist5, getlist6 } from '@/api/itsm/statistical_report'

  // 按业务分类 tableData1
  const data1 = {
    label: undefined, // 系统名称
    count_total: undefined, // 总异常次数
    time_total: undefined, // 异常总时间
    count_system: undefined, // 系统故障次数
    time_system: undefined, // 系统故障时间
    count_plan: undefined, // 计划性维护次数
    time_plan: undefined, // 计划性维护时间
  }

  // 系统异常情况汇总字段 tableData2
  const data2 = {
    label: undefined, // 类别
    count_total: undefined, // 总异常次数
    time_total: undefined, // 异常总时间
  }

  // 按异常星级 tableData4
  const data4 = {
    level: undefined, // 类别
    count_total: undefined, // 总异常次数
    time_total: undefined, // 异常总时间
  }
  export default {
    mixins: [sessionListQuery, mixin],
    components: { e_rate, PieChart },
    data() {
      return {
        listQuery: {
          time_range_date: undefined
        },
        tableData1: [],
        tableData2: [],
        pie_data: [],
        chartId: Date.now().toString(),
        legend_data: [],
        tableData4: [],
        listLoading: false,
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        const listQuery = this.rangeTime()
        getlist3(listQuery).then((res) => {
          try {
            this.tableData1 = res.data.reduce((list, v) => {
              const val = { label: v.app_name }
              Object.keys(data1).slice(1,).map((key, idx) => {
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
        getlist4(listQuery).then((res) => {
          try {
            this.tableData2 = res.data.reduce((list, v) => {
              const val = { label: v.product_name }
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
        getlist5(listQuery).then((res) => {
          this.pie_data = []
          this.legend_data = []
          if (res.data.length) {
            try {
              this.chartId = Date.now().toString()
              let legend_data = []
              const data = res.data.reduce((list, v) => {
                legend_data.push(v.reason_name)
                const val = {
                  name: v.reason_name,
                  value: v.data,
                  // itemStyle: {
                  //   color: 'rgba(94, 155, 213, 1)',
                  // }
                }
                list.push(val)
                return list
              }, [])
              this.pie_data.push({
                type: 'pie',
                radius: '55%',
                center: ['50%', '45%'],
                label: {
                  formatter: (params) => {
                    return `${params.data.name} ${params.data.value}`
                  }
                },
                labelLine: {
                  // show: false
                },
                data: data,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              })
              this.legend_data = legend_data
            }
            catch (e) {
              console.error(e)
              this.pie_data = []
            }
          }
        })
          .catch((e) => {
            console.error(e)
          })
        getlist6(listQuery).then((res) => {
          try {
            this.tableData4 = res.data.reduce((list, v) => {
              const val = { level: v.level }
              Object.keys(data4).slice(1,).map((key, idx) => {
                val[key] = v.data[idx]
              })
              list.push(val)
              return list
            }, [])
          }
          catch (e) {
            console.error(e)
            this.tableData4 = []
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

  .content {
    display: flex;
    flex-wrap: wrap;

    .content-item {
      width: 50%;
      padding: 0 20px 20px 0;

      .chart-content {
        display: flex;
        justify-content: center;
        width: 100%;
        min-width: 620px;
        height: 420px;
      }
    }
  }
</style>