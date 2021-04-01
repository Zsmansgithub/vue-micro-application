<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-row>
          <el-form-item>
            <el-input v-model.trim="listQuery.name" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                      clearable
                      style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model.trim="listQuery.type" @change="handleFilter" clearable placeholder="类型"
                       style="width: 130px;">
              <el-option label="A" value="A"></el-option>
              <el-option label="CNAME" value="CNAME"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model.trim="listQuery.partition" @change="handleFilter" clearable placeholder="分区"
                       style="width: 130px;">
              <el-option label="Server_DNS" value="Server_DNS"></el-option>
              <el-option label="ltm_DNS" value="ltm_DNS"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">重置
          </el-button>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="基础信息" align="center">
        <el-table-column label="WideIP名称/类型/分区" width="300">
          <template slot-scope="scope">
            <span>{{scope.row.wide_name}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.type+'/'+scope.row.partition}}</div>
          </template>
        </el-table-column>
        <el-table-column label="收集时间" prop="collectiontime" width="135" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.collectiontime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="请求数" align="center">
        <el-table-column label="总计" prop="req_total">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'req_total')">{{scope.row.req_total}}</a>
          </template>
        </el-table-column>
        <el-table-column label="正常" prop="req_resolved">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'req_resolved')">{{scope.row.req_resolved}}</a>
          </template>
        </el-table-column>
        <el-table-column label="丢弃" prop="req_dropped">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'req_dropped')">{{scope.row.req_dropped}}</a>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Load Balancing" align="center">
        <el-table-column label="Preferred" prop="lb_preferred">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'lb_preferred')">{{scope.row.lb_preferred}}</a>
          </template>
        </el-table-column>
        <el-table-column label="Alternate" prop="lb_alternate">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'lb_alternate')">{{scope.row.lb_alternate}}</a>
          </template>
        </el-table-column>
        <el-table-column label="Fallback" prop="lb_fallback">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'lb_fallback')">{{scope.row.lb_fallback}}</a>
          </template>
        </el-table-column>
        <el-table-column label="CNAME Resolutions" prop="lb_cname_resolutions" width="160">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'lb_cname_resolutions')">{{scope.row.lb_cname_resolutions}}</a>
          </template>
        </el-table-column>
        <el-table-column label="Returned to DNS" prop="lb_returnedtodns" min-width="90">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'lb_returnedtodns')">{{scope.row.lb_returnedtodns}}</a>
          </template>
        </el-table-column>
        <el-table-column label="Returned from DNS" prop="lb_returnedfromdns" width="160">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.wide_name, 'lb_returnedfromdns')">{{scope.row.lb_returnedfromdns}}</a>
          </template>
        </el-table-column>
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
    <el-dialog :title="request_title" :visible.sync="dialogVisible" @close="handleClose" width="80%">
      <el-form :model="requestForm" inline>
        <el-form-item>
          <el-select v-model="requestForm.statistics" placeholder="统计维度" style="width: 100px">
            <el-option label="相差值" value="相差值"></el-option>
            <el-option label="累计值" value="累计值"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="requestForm.unit" placeholder="单位" style="width: 90px">
            <el-option label="B" value="B"></el-option>
            <el-option label="KB" value="KB"></el-option>
            <el-option label="MB" value="MB"></el-option>
            <el-option label="GB" value="GB"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="requestForm.time_range"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="domainsearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24">
          <chart ref="chartd11" id="dchart1" title="" style="width:100%;height:400px;" v-bind:host_id="requestForm"
                 url="/cainiao/request_f5_monitor"/>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import {getWideIpMonitor} from '@/api/cainiao/f5_dns'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "../../components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'
  import Chart from '@/components/Charts/LineHistory'

  export default {
    name: "f5_dns_monitor",
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
      Chart
    },
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          type: undefined,
          partition: undefined,
          deleted: 0,
        },
        requestForm: {
          unit: '',
          time_range: '',
          type: '',
          statistics: '',
          name: ''
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一小时',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三小时',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近六小时',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 6);
              picker.$emit('pick', [start, end]);
            }
          }, {
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
          },],
          disabledDate: (time) => {
          return time.getTime() > new Date() * 1 + 600 * 1000||time.getTime()<new Date().getTime() - 3600 * 1000 * 24 * 10;
        }
        },
        list: null,
        total: 0,
        request_title: '',
        listLoading: true,
        dialogVisible: false,
        adminrole: false,
        ipOptions: [],
      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapGetters(['roles'])
    },
    methods: {
      send_bit(name, type) {
        this.request_title = name + '-监控信息'
        this.requestForm.name = name
        this.requestForm.unit = 'B'
        this.requestForm.statistics = '相差值'
        this.requestForm.type = type
        const end = new Date()
        const start = new Date(end.getTime() - 24 * 60 * 60 * 1000)
        this.requestForm.time_range = [start, end]
        this.requestForm.time = Math.floor(start / 1000) + ',' + Math.floor(end / 1000)
        this.dialogVisible = true
        this.$refs.chartd11.render(this.requestForm);
      },
      sendRequest(row) {
        this.request_title = row.name + '-监控信息'
        this.dialogVisible = true
        setTimeout(() => {
          this.$refs.chartd11.render(this.requestForm);
        }, 1.5 * 2)
      },
      domainsearch() {
        if (this.requestForm.time_range) {
          this.requestForm.time = Math.floor(new Date(this.requestForm.time_range[0]) / 1000) + ',' + Math.floor(new Date(this.requestForm.time_range[1]) / 1000)
        }
        this.$refs.chartd11.render(this.requestForm);
      },
      handleClose() {
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          name: undefined,
          type: undefined,
          partition: undefined,
          deleted: 0,
        }
        this.getList()
      },
      getList() {
        this.listLoading = true
        // if (this.listQuery.opr_time_s) {
        //   this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        // } else {
        //   this.listQuery.rtime = undefined
        // }
        getWideIpMonitor(this.listQuery).then(response => {
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
    }
  }
</script>

<style scoped>

</style>
