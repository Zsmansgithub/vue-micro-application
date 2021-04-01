<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model.trim="listQuery.message" placeholder="日志详情" class="filter-item" @input="handleFilter"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.domain_name" placeholder="域名" class="filter-item" @input="handleFilter"
                     clearable filterable>
            <el-option v-for="item in nameOptions" :key="item.id" :label="item.domainname" :value="item.domainname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.action" placeholder="操作类型" class="filter-item" @input="handleFilter"
                     clearable filterable>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-picture"
                   @click="send_request">图表
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="域名" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.domain_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.action }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志详情">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time_stamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
    <el-dialog title="统计信息" :visible.sync="dialogVisible" @close="handleClose" width="80%">
      <el-form :model="requestForm" inline>
        <el-form-item>
        <el-select v-model="requestForm.name" placeholder="域名" filterable clearable>
          <el-option v-for="item in nameOptions" :key="item.id" :label="item.domainname" :value="item.domainname"></el-option>
        </el-select>
<!--          <el-input v-model="requestForm.name"></el-input>-->
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="requestForm.time_range"
            type="datetimerange"
            :picker-options="pickerRequestOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          @change="domainsearch">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="domainsearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24">
          <!--          <chart ref="chartd11" id="dchart1" title="" style="width:100%;height:400px;" v-bind:host_id="requestForm"-->
          <!--                 url="/cainiao/request_domain_log"/>-->
          <bar :monitor_data="series" :x_axis="x_axis"></bar>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {domainLog, domainName, domainType,domainRequestLog} from '@/api/cainiao/domain'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import Chart from '@/components/Charts/LineHistory'
  import Bar from './components/statistics_bar'
  import {mapGetters} from 'vuex'

  export default {
    name: "domain_log",
    mixins: [resize, sessionListQuery],
    components: {
      Pagination, Chart, Bar
    },
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          message: undefined,
          domain_name: undefined,
          action: undefined,
          opr_time_s: undefined,
        },
        requestForm: {
          time_range: '',
          name: ''
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
        pickerRequestOptions: {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
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
        dialogVisible: false,
        nameOptions: [],
        typeOptions: [],
        series: {},
        x_axis: [],
      }
    },
    created() {
      this.getList()
      domainName().then(res => {
        this.nameOptions = res
      })
      domainType().then(res => {
        this.typeOptions = res
      })
    },
    methods: {
      handleClose() {
        this.requestForm.name=''
      },
      send_request() {
        const end = new Date()
        const start = new Date(end.getTime() - 3600 * 1000 * 24 * 7)
        this.requestForm.time_range = [start, end]
        this.requestForm.time = Math.floor(start / 1000) + ',' + Math.floor(end / 1000)
        this.dialogVisible = true
        domainRequestLog(this.requestForm).then(res=>{
          this.x_axis=res.times
          this.series=res.data
        })
      },
      domainsearch() {
        if (this.requestForm.time_range) {
          this.requestForm.time = Math.floor(new Date(this.requestForm.time_range[0]) / 1000) + ',' + Math.floor(new Date(this.requestForm.time_range[1]) / 1000)
        }
        domainRequestLog(this.requestForm).then(res=>{
          this.x_axis=res.times
          this.series=res.data
        })
      },
      getList() {
        this.listLoading = true
        if (this.listQuery.opr_time_s) {
          this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        } else {
          this.listQuery.rtime = undefined
        }
        domainLog(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          message: undefined,
          domain_name: undefined,
          action: undefined,
          opr_time_s: undefined,
        }
      },
    }
  }
</script>

<style scoped>

</style>
