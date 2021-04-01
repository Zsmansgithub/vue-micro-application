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
    <div class="search-title">本月重复异常出现多次明细</div>
    <div class="search-table">
      <div class="own-table" v-for="(item, index) in tableData1" :key="index">
        <div class="title">
          <div>
            {{item.project_name || '--'}}
          </div>
        </div>
        <div>
          <el-table v-loading="listLoading" :data="item.data" border size="mini">
            <el-table-column label="序号" prop='number' align="center" width="60">
            </el-table-column>
            <el-table-column label="日期" prop='date' align="center" width="85">
            </el-table-column>
            <el-table-column label="故障编号" prop='code' align="center" width="85">
            </el-table-column>
            <el-table-column label="故障描述" align="center" prop='desc' width="310">
              <template slot-scope="scoped">
                {{scoped.row.desc || '--'}}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <div style="text-align: center">故障原因</div>
              </template>
              <template slot-scope="scoped">
                <div v-if="scoped.row.reason">
                  {{scoped.row.reason}}
                </div>
                <div style="text-align: center" v-else>
                  --
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="search-title">影响较大异常</div>
    <div class="search-table">
      <el-table v-loading="listLoading" :data="tableData2" border stripe highlight-current-row size="mini">
        <el-table-column label="序号" prop='number' align="center" width="60">
        </el-table-column>
        <el-table-column label="日期" prop='date' align="center" width="85">
        </el-table-column>
        <el-table-column prop='name' align="center">
          <template slot="header">
            <div style="text-align: center">系统名称</div>
          </template>
        </el-table-column>
        <el-table-column prop='desc' align="center">
          <template slot="header">
            <div style="text-align: center">异常情况描述</div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="135">
          <template slot="header">
            <div>异常发生时间</div>
            <div>处理完成时间</div>
          </template>
          <template slot-scope="scoped">
            <div class="item-top">{{scoped.row.yc_start_time}}</div>
            <div class="item-bottom">{{scoped.row.yc_end_time}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="135">
          <template slot="header">
            <div>影响时长（分钟）</div>
            <div>影响程度最终等级Gn</div>
          </template>
          <template slot-scope="scoped">
            <div class="item-top">{{scoped.row.yc_continued}}</div>
            <e_rate :star="scoped.row.end_class"></e_rate>
          </template>
        </el-table-column>
        <el-table-column label="故障原因" prop='reason' width="600">
          <template slot="header">
            <div style="text-align: center">故障原因</div>
          </template>
          <template slot-scope="scoped">
            <div v-if="scoped.row.reason">
              {{scoped.row.reason}}
            </div>
            <div style="text-align: center" v-else>
              --
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120">
          <template slot="header">
            <div>处理人</div>
            <div>负责人</div>
          </template>
          <template slot-scope="scoped">
            <div class="item-top" v-if="scoped.row.solve_people.length">
              {{scoped.row.solve_people.join('，')}}
            </div>
            <div class="item-top" v-else>
              --
            </div>
            <div class="item-bottom" v-if="scoped.row.own_people.length">
              {{scoped.row.own_people.join('，')}}
            </div>
            <div class="item-bottom" v-else>
              --
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import e_rate from '@/views/itsm/components/system_avail_info/e_rate'
  import sessionListQuery from '@/components/mixins/sessionListQuery'
  import mixin from './components/mixins'
  import { getlist10, getlist11 } from '@/api/itsm/statistical_report'

  // 系统异常情况汇总字段 tableData2
  const data2 = {
    label: undefined, // 类别
    count_total: undefined, // 总异常次数
    time_total: undefined, // 异常总时间
  }
  export default {
    components: { e_rate },
    mixins: [sessionListQuery, mixin],
    data() {
      return {
        listQuery: {
          time_range_date: undefined
        },
        tableData1: [
          {
            project_name: undefined,
            data: [
              // {
              //   number: undefined,
              //   date: undefined,
              //   code: undefined,
              //   desc: undefined,
              //   reason: undefined,
              // }
            ]
          }
        ],
        tableData2: [
          // {
          //     "number": undefined,
          //     "date": undefined,
          //     "name": undefined,
          //     "desc": undefined,
          //     "yc_start_time": undefined,
          //     "yc_end_time": undefined,
          //     "yc_continued": undefined,
          //     "end_class": undefined,
          //     "reason": undefined,
          //     "solve_people": [],
          //     "own_people": []
          // }
        ],
        listLoading: false,
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        const listQuery = this.rangeTime()
        getlist10(listQuery).then((res) => {
          if (res.data) this.tableData1 = res.data.slice(0, 3)
        })
          .catch((e) => {
            console.error(e)
          })
        getlist11(listQuery).then((res) => {
          try {
            this.tableData2 = res.data
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

  .own-table {
    display: grid;
    grid-template-columns: minmax(100px, 100px) 1fr;

    &:not(:first-child) {
      margin-top: 16px;
    }

    .title {
      border: 1px solid #dfe6ec;
      border-right-width: 0;
      color: #909399;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .item-top {
    color: #606266;
  }

  .item-bottom {
    color: #8492a6;
  }
</style>