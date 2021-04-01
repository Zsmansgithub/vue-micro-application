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
            <el-select v-model.trim="listQuery.ltm_ip" @change="handleFilter" clearable placeholder="管理IP"
                       style="width: 130px;">
              <el-option v-for="item in ipOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
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
<!--        <el-table-column label="Manage IP" prop="ltm_ip"></el-table-column>-->
        <el-table-column label="VS名称/管理IP/分区" prop="name" width="300">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.ltm_ip+'/'+scope.row.partition}}</div>
          </template>
        </el-table-column>
<!--        <el-table-column label="Partition" prop="partition"></el-table-column>-->
        <el-table-column label="收集时间" prop="collectiontime" width="135" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.collectiontime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="流量" align="center">
        <el-table-column label="入向" prop="clientside_bitsin">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '数据量',scope.row.clientside_bitsin)">{{scope.row.clientside_bitsin}}</a>
          </template>
        </el-table-column>
        <el-table-column label="出向" prop="clientside_bitsout">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '数据量',scope.row.clientside_bitsout)">{{scope.row.clientside_bitsout}}</a>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="包数" align="center">
        <el-table-column label="入向" prop="clientside_pktsin">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '数据包数',scope.row.clientside_pktsin)">{{scope.row.clientside_pktsin}}</a>
          </template>
        </el-table-column>
        <el-table-column label="出向" prop="clientside_pktsout">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '数据包数',scope.row.clientside_pktsout)">{{scope.row.clientside_pktsout}}</a>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="连接数" align="center">
        <el-table-column label="当前" prop="clientside_curconns">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '连接数')">{{scope.row.clientside_curconns}}</a>
          </template>
        </el-table-column>
        <el-table-column label="最大" prop="clientside_maxconns">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '连接数')">{{scope.row.clientside_maxconns}}</a>
          </template>
        </el-table-column>
        <el-table-column label="总计" prop="clientside_totconns">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '连接数')">{{scope.row.clientside_totconns}}</a>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="请求数" align="center">
        <el-table-column label="总计" prop="totrequests">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, '请求数',scope.row.totrequests)">{{scope.row.totrequests}}</a>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="CPU平均使用率" align="center">
        <el-table-column label="5秒钟" prop="fivesecavgusageratio">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, 'CPU平均使用率')">{{scope.row.fivesecavgusageratio}}</a>
          </template>
        </el-table-column>
        <el-table-column label="1分钟" prop="oneminavgusageratio">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, 'CPU平均使用率')">{{scope.row.oneminavgusageratio}}</a>
          </template>
        </el-table-column>
        <el-table-column label="5分钟" prop="fiveminavgusageratio">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_bit(scope.row.name, 'CPU平均使用率')">{{scope.row.fiveminavgusageratio}}</a>
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
          <el-select v-model="requestForm.type" placeholder="类型">
            <el-option v-for="item in typeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="requestForm.statistics" placeholder="统计维度" style="width: 100px" :disabled="requestForm.type==='连接数'||requestForm.type==='CPU平均使用率'">
            <el-option label="相差值" value="相差值"></el-option>
            <el-option label="累计值" value="累计值"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="requestForm.unit" placeholder="单位" style="width: 90px" :disabled="requestForm.type==='连接数'||requestForm.type==='CPU平均使用率'">
            <el-option label="B" value="B"></el-option>
            <el-option label="KB" value="KB"></el-option>
            <el-option label="MB" value="MB"></el-option>
            <el-option label="GB" value="GB"></el-option>
            <el-option label="TB" value="TB"></el-option>
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
                 url="/cainiao/request_ltm_monitor"/>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import {monitorLtmVs,mgIps} from '@/api/cainiao/ltm'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "../../components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'
  import Chart from '@/components/Charts/LineHistory_ltm_monitor'

  export default {
    name: "ltm_monitor",
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
          name:undefined,
          ltm_ip:undefined,
        },
        requestForm:{
          type:'',
          statistics:'',
          unit:'',
          time_range:'',
          name:''
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
        request_title:'',
        listLoading: true,
        dialogVisible: false,
        adminrole: false,
        ipOptions: [],
        typeOptions:[{label:'数据量',value:'数据量'},{label:'数据包数',value:'数据包数'},{label:'连接数',value:'连接数'},
          {label:'请求数',value:'请求数'}, {label:'CPU平均使用率',value:'CPU平均使用率'},],
      }
    },
    created() {
      this.getList()
      mgIps().then(res=>{
        this.ipOptions=res
      })
    },
    computed: {
      ...mapGetters(['roles'])
    },
    methods: {
      send_bit(name,type,val){
        if (val) {
          if (val.indexOf('KB')>-1) {
            this.requestForm.unit='B'
          }else if (val.indexOf('MB')>-1) {
            this.requestForm.unit='KB'
          }else if (val.indexOf('GB')>-1) {
            this.requestForm.unit='MB'
          }else if (val.indexOf('TB')>-1) {
            this.requestForm.unit='GB'
          }else {
            this.requestForm.unit='B'
          }
        }else {
          this.requestForm.unit='MB'
        }
        this.request_title=name+'-监控信息'
        this.requestForm.type=type
        this.requestForm.name=name
        if (this.requestForm.type==='连接数'||this.requestForm.type==='CPU平均使用率') {
          this.requestForm.statistics='累计值'
        }else {
          this.requestForm.statistics='相差值'
        }
        const end = new Date()
        const start=new Date(end.getTime() - 6*60*60*1000)
        this.requestForm.time_range=[start,end]
        this.requestForm.time=Math.floor(start/1000)+','+Math.floor(end/1000)
        this.dialogVisible=true
        this.$refs.chartd11.render(this.requestForm);
      },
      domainsearch() {
        if (this.requestForm.time_range) {
          this.requestForm.time = Math.floor(new Date(this.requestForm.time_range[0])/1000)+ ','+ Math.floor(new Date(this.requestForm.time_range[1])/1000)
        }
        this.$refs.chartd11.render(this.requestForm);
      },
      handleClose(){},
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          name:undefined,
          ltm_ip:undefined,
        }
        this.getList()
      },
      getList() {
        this.listLoading = true
        monitorLtmVs(this.listQuery).then(response => {
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
