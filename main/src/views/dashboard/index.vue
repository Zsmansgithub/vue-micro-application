<template>
  <div class="dashboard-container">
    <PanelGroup @handleSetLineChartData="handleSetLineChartData"></PanelGroup>
    <el-row>
      <el-col style="padding:20px;padding-top:0;width:70%;">
        <div class="card-panel">
          <BarChart :id="'mybarchart'" :chart-data="barchartData"></BarChart>
        </div>
      </el-col>
      <el-col style="padding:20px;padding-top:0;padding-left:0;width:30%;">
        <div class="card-panel">
          <!-- <PieChart :id="'mypiechart'" :chart-data="chartData"></PieChart> -->
          <div style="height: 300px;" class="scrollstyle">
            <span class="card-panel-title">常用链接</span>
            <div style="margin-top:10px;">
              <el-tag v-for="item in links" class="mytag">
                <a :href="item.url" target="_blank"><div style="width:100%;height:100%;" class="ellipsis_style">{{item.name}}</div></a>   <!-- 加div，使空白处可以点击 -->
              </el-tag>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="padding:20px;padding-top:0;width:40%;">
        <div class="card-panel">
          <span class="card-panel-title">运维值班表</span>
          <div class="clear">
            <el-button-group style="float:left;position:relative;left:50%;">
              <el-button type="text" icon="el-icon-arrow-left" @click="daybefore" style="float:left;position:relative;right:50%;">前一天</el-button>
              <el-date-picker v-model="date" type="date" :clearable="false" :editable="false" class="noborder" style="float:left;position:relative;right:50%;width:120px;"></el-date-picker>
              <el-button type="text" @click="dayafter" style="float:left;position:relative;right:50%;">后一天<i class="el-icon-arrow-right" style="margin-left:5px;"></i></el-button>
            </el-button-group>
          </div>
          <div style="width:100%;" class="scrollstyle">
            <el-table :data="tableData" style="color:#262626;" class="mytable">
              <el-table-column label="时间" width="100px"><template slot-scope="scope">{{scope.row.time}}</template></el-table-column>
              <el-table-column label="方式" width="50px"><template slot-scope="scope">{{scope.row.type}}</template></el-table-column>
              <el-table-column label="分组" width="100px"><template slot-scope="scope">{{scope.row.zu}}</template></el-table-column>
              <el-table-column label="成员" show-overflow-tooltip><template slot-scope="scope">{{String(scope.row.people)}}</template></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col style="padding:20px;padding-top:0;padding-left:0;width:30%;">
        <div class="card-panel">
          <span class="card-panel-title">使用须知</span>
          <div v-html="content" style="height: 550px;color:#262626;" class="scrollstyle"></div>
        </div>
      </el-col>
      <el-col style="padding:20px;padding-top:0;padding-left:0;width:30%;">
        <div class="card-panel">
          <span class="card-panel-title">系统更新公告</span>
          <div v-html="content_new" style="height: 550px;color:#262626;" class="scrollstyle"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieChart from './editor/components/PieChart'
import BarChart from './editor/components/BarChart'
import PanelGroup from './editor/components/PanelGroup'
import { getHelpDocContent } from '@/api/management/help_doc'
import { getRow } from '@/api/management/help_doc'
import {get_duty_table} from '@/api/workflow/zhibantable'
import { fetchAlarmPie } from '@/api/zabbix/db'
import { fetchAlarmList } from '@/api/db'
import {get_links_all} from '@/api/workflow/dashboard_links'

export default {
  name: 'Dashboard',
  components: {PieChart,BarChart,PanelGroup},
  data() {
    return {
      chartData: [],
      barchartData: [],
      date:'',
      listQuery: {
        page: 1,
        limit: 15,
        // board: undefined,
        board: 4,
      },
      contentarray:[],
      content: '',
      content_new:'',
      tableData:[],
      links:[],
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.initdate()
  },
  activated() {
    this.initdate()
  },
  watch:{
    "date": function(newValue, oldValue) {
      var today =new Date(this.date)
      this.date = today.getFullYear()+'-'+((today.getMonth()+1)<10?'0'+(today.getMonth()+1):(today.getMonth()+1))+'-'+(today.getDate()<10?'0'+today.getDate():today.getDate())
      this.gettableData(this.date)
    },
  },
  methods:{
    handleSetLineChartData(url) {
      this.$router.push(url)
    },
    initdate(){
      // fetchAlarmPie().then(response => {
      //   this.chartData = response
      // })
      get_links_all().then(response => {
        this.links = response
      })
      fetchAlarmList().then(response => {
        this.barchartData = response
      })
      var today =new Date()
      this.date = today.getFullYear()+'-'+((today.getMonth()+1)<10?'0'+(today.getMonth()+1):(today.getMonth()+1))+'-'+(today.getDate()<10?'0'+today.getDate():today.getDate())
      this.gettableData(this.date)
      getRow(this.listQuery).then(response => {
        this.contentarray = response.results

        // 使用须知
        getHelpDocContent({id:this.contentarray[0].id}).then(response => {
          this.content = response.content
        })
        // 更新公告
        getHelpDocContent({id:this.contentarray[1].id}).then(response => {
          this.content_new = response.content
        })
      })
    },
    gettableData(date){
      get_duty_table({date:date}).then(response => {
        this.tableData = eval(response.duty_content)
      })
    },
    daybefore(){
      var nowTime = new Date(this.date).getTime();
      var oneDayTime = 24*60*60*1000 ;
      var today = new Date(nowTime - oneDayTime);
      this.date = today.getFullYear()+'-'+((today.getMonth()+1)<10?'0'+(today.getMonth()+1):(today.getMonth()+1))+'-'+(today.getDate()<10?'0'+today.getDate():today.getDate())
      this.gettableData(this.date)
    },
    dayafter(){
      var nowTime = new Date(this.date).getTime();
      var oneDayTime = 24*60*60*1000 ;
      var today = new Date(nowTime + oneDayTime);
      this.date = today.getFullYear()+'-'+((today.getMonth()+1)<10?'0'+(today.getMonth()+1):(today.getMonth()+1))+'-'+(today.getDate()<10?'0'+today.getDate():today.getDate())
      this.gettableData(this.date)
    },
  }
}
</script>
<style lang="scss" scoped>
  .dashboard-container {
    background-color: rgb(240, 242, 245);
  }
  .card-panel {
    position: relative;
    overflow: hidden;
    background: #fff;
    padding: 20px;
    border-radius:10px;
  }
  .card-panel-title{
    color:#1590FF;
    font-size:18px;
  }
  .noborder{
    /deep/.el-input__icon {
      color:#262626;
    }
    /deep/.el-input__inner{
      border: 0;
      padding-right: 0;
      color:#262626;
    }
  }
  .el-table::before {
    background-color: #FFFFFF;
  }
  .mytable{
    /deep/  td, th.is-leaf {
      border:none;
    }
    /deep/ th{
      background-color:#F5F6F8;
      font-weight:normal;
      color:#888888;
      border:none;
    }
    /deep/ tr:nth-of-type(even){
      background-color:#F5F6F8;
    }
    /deep/ td{
      white-space: nowrap;
    }
  }
  .mytag{
    text-align:center;
    padding:0;
    background-color: #ffffff;
    border-color: #d1e9ff;
  }
  .mytag:hover{
    background-color: #e8f4ff;
  }
  .ellipsis_style{
    // 省略号
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  // 清浮动
  .clear:after{
    content: '';
    display: block;
    clear: both;
  }
  .scrollstyle{
    overflow:auto;
    -ms-overflow-style: none;//IE
    scrollbar-width: none;//火狐
    scrollbar-color: transparent transparent;
  }
  .scrollstyle::-webkit-scrollbar{width: 0;height:0;}//chrome 和Safari
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {width: 0;height: 0;}
  // @media (max-width: 1920px){
    .mytag{
      margin:0 1%;
      width:48%;
    }
  // }
  @media (max-width: 1279px){
    .mytag{
      margin:0;
      width:100%;
    }
  }
</style>
