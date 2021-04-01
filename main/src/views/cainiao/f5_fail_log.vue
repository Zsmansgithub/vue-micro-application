<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model.trim="listQuery.operate_obj" placeholder="操作类型" class="filter-item" @input="handleFilter"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="listQuery.opr_time_s"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="handleFilter"/>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="操作类型" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_obj }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败原因">
        <template slot-scope="scope">
          <span>{{ scope.row.failreason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" width="77">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes="[20,50,100,200,500]"
      @pagination="getList"
      style="padding-top: 5px;margin-top: 10px;"
    />
  </div>

</template>

<script>
  import {getFailLog,} from '@/api/cainiao/f5_dns'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'

  export default {
    name: 'ComplexTable',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
    },
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          operate_obj: undefined,
          deleted: 0,
          opr_time_s: undefined,
        },
        pickerOptions: {
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
        list: null,
        total: 0,
        listLoading: true,

      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      getList() {
        this.listLoading = true
        if (this.listQuery.opr_time_s) {
          this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        } else {
          this.listQuery.rtime = undefined
        }
        getFailLog(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          operate_obj: undefined,
          opr_time_s: undefined,
        }
      },
    },
  }
</script>
<style scoped>

</style>
