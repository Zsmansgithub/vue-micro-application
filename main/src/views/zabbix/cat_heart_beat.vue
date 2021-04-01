<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item label="服务器"  required>
          <el-cascader 
            expand-trigger="hover"
            ref="cascaderHandler"
            :options="projectOptions"
            v-model="query_server_id"
            :props="{ checkStrictly: true }"
            style="width:100%;"
            placeholder="请选择应用和IP"
            filterable clearable 
            @change="findServer">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table v-loading="listLoading" :data="CatUrList" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="应用名" prop="server_name" align="left" width="240">
      </el-table-column>
      <el-table-column label="IP地址" prop="ip" align="left" width="120">
      </el-table-column>
      <el-table-column label="数量" prop="OldGcCount" align="center">
      </el-table-column>
      <el-table-column label="清理数量" prop="PS_ScavengeCount" align="center">
      </el-table-column>
      <el-table-column label="清理时间" prop="PS_ScavengeTime" align="center">
      </el-table-column>
      <el-table-column label="扫描时间" prop="PS_MarkSweepTime" align="center">
      </el-table-column>
      <el-table-column label="代码缓存区" prop="Code_Cache" align="center">
      </el-table-column>
      <el-table-column label="元空间" prop="Metaspace" align="center">
      </el-table-column>
      <el-table-column label="压缩区" prop="Compressed_Class_Space" align="center" width="100">
      </el-table-column>
      <el-table-column label="Eden区" prop="PS_Eden_Space" align="center" width="110">
      </el-table-column>
      <el-table-column label="Survivor区" prop="PS_Survivor_Space" align="center">
      </el-table-column>
      <el-table-column label="老年代" prop="PS_Old_Gen" align="center">
      </el-table-column>
      <el-table-column label="时间" prop="new_date" align="center" width="140">
      </el-table-column>
      <el-table-column label="查看" align="center" width="75">
        <template slot-scope="scope">
          <el-tooltip content="详情" placement="top">
            <el-button type="primary" icon="el-icon-more" circle @click="get_heartbeat(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getCatUrlDetail"
      />
    <el-dialog  :visible.sync="handleHeartBeat" width="1400px">
      <div id='heart_info' style="height:1200px; width:1200px;"></div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { validIp } from '@/utils/validate'
import { getServerIp, getHeartBeat, getJvmMonitor } from '@/api/zabbix/catmonitor'

export default {
  components: { Pagination },
  mixins: [resize],
  data(){
    return{
        listQuery: {
          page: 1,
          limit: 10,
          app_name:null,
          ip:null
        },
        CatUrList:null,
        total:0,
        query_server_id:[],
        projectOptions:[],
        handleHeartBeat:false,
        heartbeatClose:true,
        heartBeats:{
          dates:[],
          OldGcCount:[],
          PS_ScavengeCount:[],
          PS_ScavengeTime:[],
          PS_MarkSweepTime:[],
          Code_Cache:[],
          Metaspace:[],
          Compressed_Class_Space:[],
          PS_Eden_Space:[],
          PS_Survivor_Space:[],
          PS_Old_Gen:[]
        }
    }
  },
  created(){
      this.getCatUrlDetail()
      this.getServer()
  },
  watch:{
    query_server_id:{
      handler(){
        this.listQuery.ip = null
        this.listQuery.app_name = this.query_server_id[0]
        if(this.query_server_id[1]){
          this.listQuery.ip = this.query_server_id[1]
        }
        this.$refs.cascaderHandler.dropDownVisible = false
      }
    }
  },
  mounted(){
    //点击文本就让它自动点击前面的input就可以触发选择。但是因组件阻止了冒泡，暂时想不到好方法来触发。
    setInterval(function(){
      document.querySelectorAll('.el-cascader-node__label').forEach(el=>{
        el.onclick = function () {
          this.previousElementSibling.click()
        }
      })
    },500)
  },
  methods: {
    diagram(){
      let echarts = require('echarts/lib/echarts');
      require('echarts/lib/chart/bar');
      require('echarts/lib/component/tooltip');
      require('echarts/lib/component/title');
      let myChart = echarts.init(document.getElementById('heart_info'));
      myChart.setOption({
        title:[
            {text: 'OldGcCount', top:'2%', left:'20%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'PS ScavengeCount', top:'2%', left:'53%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'PS ScavengeTime', top:'2%', left:'87%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'PS MarkSweepTime', top:'27%', left:'20%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'Code Cache', top:'27%', left:'53%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'Metaspace', top:'27%', left:'87%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'Compressed Class Space', top:'52%', left:'20%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'PS Eden Space', top:'52%', left:'53%',textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'PS Survivor Space', top:'52%', left:'87%', textAlign: 'center', textStyle: {color: '#E45959'}},
            {text: 'PS Old Gen', top:'77%', left:'20%', textAlign: 'center', textStyle: {color: '#E45959'}}
        ],
        tooltip: {},
        dataset: {
          source: [
            this.heartBeats.dates,
            this.heartBeats.OldGcCount,
            this.heartBeats.PS_ScavengeCount,
            this.heartBeats.PS_ScavengeTime,
            this.heartBeats.PS_MarkSweepTime,
            this.heartBeats.Code_Cache,
            this.heartBeats.Metaspace,
            this.heartBeats.Compressed_Class_Space,
            this.heartBeats.PS_Eden_Space,
            this.heartBeats.PS_Survivor_Space,
            this.heartBeats.PS_Old_Gen,
          ]
        },
        xAxis: [
          {type: 'category', gridIndex: 0},
          {type: 'category', gridIndex: 1},
          {type: 'category', gridIndex: 2},
          {type: 'category', gridIndex: 3},
          {type: 'category', gridIndex: 4},
          {type: 'category', gridIndex: 5},
          {type: 'category', gridIndex: 6},
          {type: 'category', gridIndex: 7},
          {type: 'category', gridIndex: 8},
          {type: 'category', gridIndex: 9}
        ],
        yAxis: [
          {gridIndex: 0},
          {gridIndex: 1},
          {gridIndex: 2},
          {gridIndex: 3},
          {gridIndex: 4},
          {gridIndex: 5},
          {gridIndex: 6},
          {gridIndex: 7},
          {gridIndex: 8},
          {gridIndex: 9}
        ],
        grid: [
          {left: '8%', top:"5%", width:300, height:200},
          {left: '42%', top:"5%", width:300, height:200},
          {left: '75%', top:"5%", width:300, height:200},
          {left: '8%', top:"30%", width:300, height:200},
          {left: '42%', top:"30%", width:300, height:200},
          {left: '75%', top:"30%", width:300, height:200},
          {left: '8%', top:"55%", width:300, height:200},
          {left: '42%', top:"55%", width:300, height:200},
          {left: '75%', top:"55%", width:300, height:200},
          {left: '8%', top:"80%", width:300, height:200}
        ],
        series: [
          // These series are in the first grid.
          {type: 'bar', name:'OldGcCount', seriesLayoutBy: 'row', xAxisIndex: 0, yAxisIndex: 0},
          {type: 'bar', name:'PS ScavengeCount', seriesLayoutBy: 'row', xAxisIndex: 1, yAxisIndex: 1},
          {type: 'bar', name:'PS ScavengeTime', seriesLayoutBy: 'row', xAxisIndex: 2, yAxisIndex: 2},
          {type: 'bar', name:'PS MarkSweepTime', seriesLayoutBy: 'row', xAxisIndex: 3, yAxisIndex: 3},
          {type: 'bar', name:'Code Cache', seriesLayoutBy: 'row', xAxisIndex: 4, yAxisIndex: 4},
          {type: 'bar', name:'Metaspace', seriesLayoutBy: 'row', xAxisIndex: 5, yAxisIndex: 5},
          {type: 'bar', name:'Compressed Class Space', seriesLayoutBy: 'row', xAxisIndex: 6, yAxisIndex: 6},
          {type: 'bar', name:'PS Eden Space', seriesLayoutBy: 'row', xAxisIndex: 7, yAxisIndex: 7},
          {type: 'bar', name:'PS Survivor Space', seriesLayoutBy: 'row', xAxisIndex: 8, yAxisIndex: 8},
          {type: 'bar', name:'PS Old Gen', seriesLayoutBy: 'row', xAxisIndex: 9, yAxisIndex: 9}
        ]
      })
    },
    get_heartbeat(row){
      getHeartBeat(row.server_name, row.ip).then(response => {
        this.heartBeats = response
        this.handleHeartBeat=true
        this.$nextTick(function() {
          this.diagram()
        })
      })
    },
    findServer(){
      this.listLoading = true
      getJvmMonitor(this.listQuery).then(response => {
        this.CatUrList = response.results
        this.total = response.count
      })
      this.listLoading = false
    },
    getRowsInf(){
        getJvmMonitor().then(response => {
            this.CatUrList = response.results
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate(valid => {
        if (valid) {
          this.findServer()
        }
      })
    },
    getCatUrlDetail() {
      this.listLoading = true
      getJvmMonitor(this.listQuery).then(response => {
        this.CatUrList = response.results
        this.total = response.count
      })
      this.listLoading = false
    },
    getServer(){
      getServerIp().then(response => {
        this.projectOptions = response.data
      })
    },
    handleReset(){
      this.listQuery.page = 1
      this.$refs['listQuery'].validate(valid => {
        if (valid) {
          this.getRowsInf()
        }
      })
    }
  },
}
</script>

<style>

</style>