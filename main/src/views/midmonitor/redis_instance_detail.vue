<template>
  <div class="app-container">
    <div>实例信息：{{ ip }}</div>
    <br>
    <el-tabs v-model="activeName" :model="historySearch" @tab-click="tabClick" style="height:80%;" id="gggg">
      <el-tab-pane ref="parent" label="折线图" name="first">
        <el-form :model="historySearch" :inline="true">
          <el-form-item prop="startime">
            <el-date-picker
              v-model="historySearch.startime"
              type="date"
              placeholder="监控时间"
              align="right"
              value-format="timestamp"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endtime">
            <el-date-picker
              v-model="historySearch.endtime"
              type="date"
              placeholder="对比时间"
              align="right"
              value-format="timestamp"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="renderline(0)">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="renderline(3)">三天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  plain @click="renderline(5)">五天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="renderline(7)">七天</el-button>
          </el-form-item>
        </el-form>

        <el-row >
          <el-col :span="12">
            <chart ref="chart1" id="id1" style="width:100%;height:300px;" title="连接数" v-bind:host_id="historySearch"
                    url="midmonitor/redis/get_history1" v-if="'first' === activeName"/>
          </el-col>
          <el-col :span="12">
            <chart ref="chart2" id="id2" style="width:100%;height:300px;" title="流量" v-bind:host_id="historySearch"
                    url="midmonitor/redis/get_history2" v-if="'first' === activeName"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <chart ref="chart3" id="id3" style="width:100%;height:300px;" title="CPU使用率" v-bind:host_id="historySearch"
                    url="midmonitor/redis/get_history3" v-if="'first' === activeName"/>
          </el-col>
          <el-col :span="12">
            <chart ref="chart4" id="id4" style="width:100%;height:300px;" title="执行命令数" v-bind:host_id="historySearch"
                    url="midmonitor/redis/get_history4" v-if="'first' === activeName"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <chart-line-kmg ref="chart5" id="id5" style="width:100%;height:300px;" title="使用内存" v-bind:host_id="historySearch"
                  url="midmonitor/redis/get_history5" v-if="'first' === activeName"/>
          </el-col>
          <el-col :span="12">
            <chart ref="chart6" id="id6" style="width:100%;height:300px;" title="KEY数量" v-bind:host_id="historySearch"
                  url="midmonitor/redis/get_history6" v-if="'first' === activeName"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <chart ref="chart7" id="id7" style="width:100%;height:300px;" title="OPS每秒处理请求数" v-bind:host_id="historySearch"
                  url="midmonitor/redis/get_history7" v-if="'first' === activeName"/>
          </el-col>
          <!-- <el-col :span="12">
            <chart ref="chart8" id="id8" style="width:100%;height:300px;" title="拒绝连接数" v-bind:host_id="historySearch"
                  url="midmonitor/redis/get_history8" v-if="'first' === activeName"/>
          </el-col> -->
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="命令详情" name="second">
        <el-form :model="historySearch" :inline="true">
          <el-form-item prop="startime">
            <el-date-picker
              v-model="redisInfo.time"
              type="datetime"
              placeholder="监控时间"
              align="right"
              format="yyyy-MM-dd HH:mm"
              value-format="timestamp"
              :clearable="false"
              :pickerOptions="pickerOptions4"
              @change="getInfo"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain  icon="el-icon-d-arrow-left" @click="getInfo(-1)">上一分钟</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain  @click="getInfo(1)">下一分钟<i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-col :span="8" :offset="1">
            <pie-chart ref="chart21" style="width:500px;height:300px;" id="pie" title="执行命令数分布" v-bind:data="infoCommPie"/>
          </el-col>
          <el-col :span="12">
            <el-table :data="infoComm" :default-sort = "{prop: 'calls', order: 'descending'}" style="width: 100%">
              <el-table-column prop="name" label="命令名" sortable width="180"></el-table-column>
              <el-table-column prop="calls" label="调用次数" sortable width="180"></el-table-column>
              <el-table-column prop="usec" label="整体耗时" sortable width="180"></el-table-column>
              <el-table-column prop="usec_per_call" label="平均耗时" sortable>
                <template slot-scope="scope">
                  {{ scope.row.usec_per_call }}微秒
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </div>
      </el-tab-pane>

      <el-tab-pane label="客户端详情" name="third">
        <el-form :model="historySearch" :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="redisInfo.time"
              type="date"
              placeholder="监控时间"
              align="right"
              format="yyyy-MM-dd"
              value-format="timestamp"
              :clearable="false"
              :pickerOptions="pickerOptions2"
              @change="getThirdInfo"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain icon="el-icon-d-arrow-left" @click="getThirdInfo(-1)">前一天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="getThirdInfo(1)">后一天<i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
          </el-form-item>
          <el-form-item class="fr" style="margin-right:-2px;">
            <el-button class="filter-item" :loading="downloadLoading" plain type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="clientLoading" :data="thirdData" border stripe highlight-current-row style="width:100%">
          <el-table-column label="ID" prop="id" sortable align="center" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品线名称" min-width="135px" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                {{ scope.row.subsystem_name}}
                <div  style="color: #8492a6; font-size: 10px">{{scope.row.project_name}}</div>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="应用/用途" min-width="170px" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <!-- <a style="color: #1890ff" @click="appFilter(scope.row.project_name, scope.row.subsystem_name, scope.row.app)">{{ scope.row.app_name }}</a> -->
              <span>{{ scope.row.app_name }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.app_type}}</div>
            </template>
          </el-table-column>
          <el-table-column label="IP/主机名" width="125px" prop="ip" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.ip }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.host_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="系统版本" width="110px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.os_version }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.os_type_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="CPU" width="75px" prop="cpu" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.cpu }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内存" width="75px" prop="memory" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.memory }}G</span>
            </template>
          </el-table-column>
          <el-table-column label="可用容量" width="80px">
            <template slot-scope="scope">
              <span v-if="scope.row.disk<=1000">{{ scope.row.disk }}G</span>
              <span v-else>{{ (scope.row.disk/1000).toFixed(2) }}T</span>
            </template>
          </el-table-column>
          <el-table-column label="环境/资源类型" width="110px">
            <template slot-scope="scope">
              <span>{{ scope.row.resource_env_name }}</span>
              <div style="color: #8492a6; font-size: 10px">{{ scope.row.resource_type_name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">{{ scope.row.status_name }}</el-tag>
              <el-tag v-else-if="scope.row.status==2" type="warning">{{ scope.row.status_name }}</el-tag>
              <el-tag v-else-if="scope.row.status==5" type="info">{{ scope.row.status_name }}</el-tag>
              <el-tag v-else>{{ scope.row.status_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="负责/维护人" width="130px">
            <template slot-scope="scope">
              <span>{{ scope.row.app_owner }}</span>
              <div style="color: #8492a6; font-size: 10px"><span v-for="(site,index) in scope.row.maintain_user_name" :key="index">{{ site }} </span></div>
              <!-- <div style="color: #8492a6; font-size: 10px"><span v-for="(site,index) in scope.row.ops_user_name" :key="index">{{ site }} </span></div> -->
            </template>
          </el-table-column>
          <el-table-column label="更新时间/备注" width="135px" :show-overflow-tooltip="true" prop="update_time" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.update_time }}</span>
              <div style="color: #8492a6; font-size: 10px">{{ scope.row.comments }}</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getThirdInfo"
          style="padding-top: 5px;margin-top: 10px;"
        /> -->
        <!-- <div v-if="thirdData.length!=0">
          <el-tag v-for="(item,index) in thirdData" :key="index" style="margin-right:10px;margin-bottom:10px;">{{ item.client_info }}</el-tag>
        </div>
        <div v-else style="color:#8492a6;font-size:15px;text-align:center;">未查询到数据</div> -->
        <!-- <div v-if="thirdData.length!=0" v-loading="clientLoading" :data="thirdData">
          <div style="margin-bottom:10px;color:#8492a6;font-size:15px;">客户端数共: {{ thirdData.length }} 个.</div>
          <el-tag v-for="(item,index) in thirdData" :key="index" style="margin-right:10px;margin-bottom:10px;">{{ item.client_info }}</el-tag>
        </div>
        <div v-else style="color:#8492a6;font-size:15px;text-align:center;">未查询到数据</div> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import Chart from '@/components/Charts/LineHistory'
import ChartLineKmg from '@/components/Charts/LineKmg'
import { fetchRedisInfo, fetchRedisClient } from '@/api/midmonitor/redis'
import PieChart from '@/components/Charts/PieChart'

const pickerOptions2={
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        }

export default {
  components: { Chart, PieChart, ChartLineKmg },
  directives: { waves },
  mixins: [resize],

  data() {
    return {
      pickerOptions2:pickerOptions2,
      pickerOptions4:{
          disabledDate(time) {
            if (time.getTime() > Date.now() ) {
              return true
            } else if ( time.getTime() < Date.now()-86400000*7 ) {
              return true
            }
            else{
              return false
            }
          },
      },
      listQuery: {
        page: 1,
        limit: 20,
        row_id: undefined
      },
      id:undefined,
      ip:undefined,
      info:{},
      infoComm:[],
      infoCommPie:[],
      historySearch:{
        rid: undefined,
        endtime: undefined,
        startime: undefined,
        days: ''
       },
      redisInfo: {
        rid: undefined,
        time: Date.parse(new Date()),
      },
      activeName:'first',

      thirdData: [],
      clientLoading: false,
      downloadLoading: false,

    }
  },

  created() {
    if (this.$route.params.id){
      localStorage.setItem("redis_id", this.$route.params.id);
      localStorage.setItem("redis_ipinfo", this.$route.params.ip);
    }
    this.historySearch.rid=localStorage.getItem("redis_id");
    this.info.rid =localStorage.getItem("redis_id");
    this.ip=localStorage.getItem("redis_ipinfo")
  },

  mounted() {
    this.getInfo()
  },

  methods: {
    renderline(days){
      // debugger
      this.historySearch.days = days
      // console.log(this.historySearch)
      if (this.activeName=='first') {
        this.$refs.chart1.render( this.historySearch );
        this.$refs.chart2.render( this.historySearch );
        this.$refs.chart3.render( this.historySearch );
        this.$refs.chart4.render( this.historySearch );
        this.$refs.chart5.render( this.historySearch );
        this.$refs.chart6.render( this.historySearch );
        this.$refs.chart7.render( this.historySearch );
      } else {

      }
    },

    getInfo(time){
      if(time == -1){
        this.redisInfo.time=this.redisInfo.time - 60*1000
      }else if (time == 1) {
        this.redisInfo.time=this.redisInfo.time + 60*1000
      }
      this.redisInfo.rid=this.historySearch.rid;
      this.infoComm=[]
      let infoCommPie=[]
      fetchRedisInfo(this.redisInfo).then(response => {
        this.info = response.data
        for(const i in response.data.info) {
          if (i.indexOf('cmdstat') != -1) {
            response.data.info[i]['name']=i
            this.infoComm.push(response.data.info[i])
            infoCommPie.push({name:i, value:response.data.info[i]['calls']})
          }

        }
        this.infoCommPie=infoCommPie
        this.$refs.chart21.render([
            {
              name: '命令数',
              type: 'pie',
              radius: [15, 95],
              center: ['50%', '56%'],
              data: this.infoCommPie,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ] );
      })
    },

    tabClick(sss){
      if (sss.name =='second') {
        this.getInfo()
      } else if (sss.name == 'third') {
        this.getThirdInfo()
      }
    },

    getThirdInfo(time) {
      this.clientLoading = true

      if(time == -1){
        this.redisInfo.time=this.redisInfo.time - 86400*1000
      } else if(time == 1) {
        this.redisInfo.time=this.redisInfo.time + 86400*1000
      }
      this.redisInfo.rid=this.historySearch.rid

      fetchRedisClient(this.redisInfo).then(response => {
        this.thirdData = response.data
        setTimeout(() => {
          this.clientLoading = false;
        }, 2000);
      })

    },

    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '产品线', '产品线(子模块)', '应用', '应用用途', 'IP', '主机名', '系统版本', 'CPU', '内存', '磁盘', '环境', '状态', '资源类型', '负责人', '维护人', '更新时间', '备注']
          const filterVal = ['id', 'project_name', 'subsystem_name', 'app_name', 'app_descrip', 'ip', 'host_name', 'os_version', 'cpu', 'memory', 'disk', 'resource_env_name', 'status_name', 'resource_type_name', 'app_owner', 'maintain_user_name', 'update_time', 'comments']
          const list = this.thirdData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'redis_client导出',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

  }

}
</script>

<style>

</style>
