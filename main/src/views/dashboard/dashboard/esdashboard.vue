<template>
  <div class="dashboard-zabbix-container" ref="esdashboard">
    <div style="padding: 15px 18px 19px 17px">
      <div style="text-align: right" v-show="fullscreen"><svg-icon icon-class="fullscreen" @click="click" /></div>
      <div>
        <h2 style="text-align: center; margin-top:0px">
          星辰运维监控大屏
          <!--        <label style="color: #d9d9d9; font: small-caption;text-align: center">&copy; YTOM{{datatime}}</label>-->
        </h2>

      </div>

      <el-row :gutter="30" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel data-box1">
            <i class="topL">
              <div class="content-trigon-zhijiao"></div>
            </i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR">
              <div class="content-trigon-zhijiaox"></div>
            </i>

            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="bug" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                ZABBIX报警数：{{ panelgroup.alarm_sum }}
              </div>

            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel  data-box1">
            <i class="topL">
              <div class="content-trigon-zhijiao"></div>
            </i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR">
              <div class="content-trigon-zhijiaox"></div>
            </i>
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="excel" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                中间件报警数：{{ panelgroup.mid_sum }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel  data-box1">
            <i class="topL">
              <div class="content-trigon-zhijiao"></div>
            </i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR">
              <div class="content-trigon-zhijiaox"></div>
            </i>
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="component" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                Redis总数: {{panelgroup.redis_sum}}
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel  data-box1">
            <i class="topL">
              <div class="content-trigon-zhijiao"></div>
            </i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR">
              <div class="content-trigon-zhijiaox"></div>
            </i>
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="tree" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
               <div class="card-panel-text">
                MQ集群总数: {{panelgroup.mq_sum}}
              </div>
              <div class="card-panel-text">
                ES实例总数: {{panelgroup.es_sum}}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="chart-wrapper data-box1">
            <i class="topL"></i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR"></i>
            <pie-chart ref="chart1"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper data-box1 bar-chart">
            <i class="topL"></i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR"></i>
            <bar-chart ref="chart4"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="chart-wrapper  data-box1">
            <i class="topL"></i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR"></i>
            <pie-chart2 ref="chart2"/>
          </div>
        </el-col>
      </el-row>
      <br>
      <br>
      <el-row :gutter="30">
        <el-col :span="12" style="text-align: center">
          <div class="data-box1 table_zabbix">
            <i class="topL"></i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR"></i>
            <div class="data-title"><b class="data-title-left">[</b><span>ZABBIX报警</span><b
              class="data-title-right">]</b></div>
            <div class="test hideScrollbarTest">
              <div class="hideScrollbar">
                <el-table :data="tableData" class="dashboard_class" :show-header="false" empty-text="暂无报警信息"
                          style="width: 100%;margin-top:20px;border-bottom-color:#ff0000" height="400">
                  <el-table-column label="来源" width="80px" prop="alarm_source"></el-table-column>
                  <el-table-column label="来源" width="130px" prop="host_name" show-overflow-tooltip></el-table-column>
                  <el-table-column label="来源" min-width="90px" prop="description" show-overflow-tooltip></el-table-column>
                  <el-table-column label="来源" width="110px" prop="start_time"></el-table-column>
                  <el-table-column label="操作" width="60px" v-if="tableData.length !=0">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-delete" circle size="small"
                                @click.native.prevent="deleteRow(scope.$index, tableData)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" style="text-align: center">
          <div class="data-box1 table_zabbix">
            <i class="topL"></i>
            <i class="topR"></i>
            <i class="bottomL"></i>
            <i class="bottomR"></i>
            <div class="data-title"><b class="data-title-left">[</b><span>中间件报警</span><b
              class="data-title-right">]</b></div>
            <div class="test hideScrollbarTest">
              <div class="hideScrollbar">
                <el-table :data="tableDataMid" class="dashboard_class" :show-header="false" empty-text="暂无报警信息"
                          style="width: 100%;margin-top:20px;border-bottom-color:#ff0000" height="400">
                  <el-table-column label="来源" min-width="90px" prop="description" show-overflow-tooltip></el-table-column>
                  <el-table-column label="来源" width="110px" prop="start_time"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import RaddarChart from './components/RaddarChart'
  import PieChart from './components/PieChart'
  import PieChart2 from './components/PieChart2'
  import BarChart from './components/BarChart'

  import Chart from '@/components/Charts/LineZabbix'
  import {fetchList} from '@/api/db'

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      PieChart2,
      BarChart
    },
    data() {
      return {
        datatime: null,
        fullscreen:true,
        data: 0,
        websock: null,
        tableData: [],
        tableDataMid: [],
        panelgroup: {},
        tableHeader: ['alarm_source', 'host_name', 'time',]
      }
    },

    mounted() {
      if( this.$route.path.indexOf('fullscreen') != '-1'){
        this.fullscreen=false
      }
      this.initWebSocket()
      this.getList();
      this.datatime = setInterval(this.showMarquee, 50000)
      const bgImage = require('@/assets/dashboard2.jpg');
      const watermarkText = `${this.$store.getters.name} ${this.$store.getters.uuid}`;
      this.$utils.index.addWaterMarkImage(bgImage, this.$refs['esdashboard'], watermarkText);
    },
    destroyed: function () {
      this.websocketclose();
      clearInterval(this.datatime);
    },

    methods: {
      click() {
          this.$router.push({name: 'devops_fullscreen'})
      },
      getList() {
        fetchList().then(response => {
          this.panelgroup = response.data
        })
      },
      deleteRow(index, rows) {
      rows.splice(index, 1)
    },
      handleSetLineChartData(url) {
        // this.lineChartData = lineChartData[type]
        this.$router.push(url)
      },
      showMarquee: function () {
        this.$refs.chart1.render();
        this.$refs.chart2.render();
        this.$refs.chart4.flush();
      },
      initWebSocket() {
        const wsuri = "ws://xc.yto.net.cn/zabbix/websocketpath";
        this.websock = new WebSocket(wsuri);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;

        this.websock.onclose = this.websocketclose;
      },

      websocketonopen() {
        console.log("WebSocket连接成功");
      },

      websocketonerror(e) { //错误
        console.log("WebSocket连接发生错误");
      },

      websocketonmessage(e) { //数据接收
        // debugger

        if (this.tableData.length >0 ){
          this.tableData.unshift(this.tableData.pop());
        }
        if (this.tableDataMid.length >0 ){
          this.tableDataMid.unshift(this.tableDataMid.pop());
        }
        let xx = JSON.parse(e.data)
        for (let i of xx['add_zabbix']) {
          this.tableData.unshift(i)
        }
        this.panelgroup = Object.keys(xx['sum_data']).length !== 0 ?xx['sum_data'] : this.panelgroup
        let del=[]
        for (let i=0; i < this.tableData.length; i++) {
          if (xx['delete_zabbix'].indexOf(this.tableData[i].id) !=-1) {
            del.push(i)
          }
        }
        for (let i of del){
          console.log(this.tableData.splice(i,1))
        }

        for (let i of xx['mid_list']) {
          this.tableDataMid.unshift(i)
        }
        let del_mid=[]
        for (let i=0; i < this.tableDataMid.length; i++) {
          if (xx['delete_mid'].indexOf(this.tableDataMid[i].id) !=-1) {
            del_mid.push(i)
          }
        }
        for (let i of del_mid){
          console.log(this.tableDataMid.splice(i,1))
        }

      },

      websocketsend(agentData) {//数据发送
        this.websock.send(agentData);
      },

      websocketclose(e) { //关闭
        console.log("connection closed (" + e + ")");
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-zabbix-container {
    /*padding: 10px;*/
    color: rgba(55, 255, 249, 1);
    background: no-repeat;
    background-size: 100% 100%;
    background-image: url('../../../assets/dashboard2.jpg');
  }

  .box-card /deep/ {
    color: #f2f2f2;
    border: 1px solid #006cff;
    background-color: rgba(185, 205, 255, 0);
    /*box-shadow: darkgrey 0px 0px 8px 5px;//边框内阴影*/
    .card-header {
      margin: 0;
      padding: 8px;
      color: #f2f2f2;
      font-size: 15px;
      font-weight: bold;
      height: 32px;
      background-color: #67c23a;
      border: 1px;
    }


  }

  .content-trigon-zhijiao {
    margin: 3px;
    width: 0px;
    height: 0px;
    border-color: transparent #26c6f0;
    border-width: 0px 0px 12px 12px;
    border-style: solid;
  }

  .content-trigon-zhijiaox {
    margin: 3px;
    width: 0px;
    height: 0px;
    border-color: #26c6f0 transparent;
    border-width: 0px 0px 12px 12px;
    border-style: solid;
  }

  .dashboard_class /deep/ {
    /*border: 0px solid #006cff;*/
    background-color: rgba(185, 205, 255, 0);

    /deep/ tbody tr:hover > td {
      background-color: rgba(176, 222, 255, 0.13)
    }

    /deep/ button {
      background-color: #778a9c00
    }

    ::before {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0px;
    }

    border: 0px solid #758a99;
    border-bottom: 0px;

    .el-table__row {
      margin: 0;
      padding: 8px;
      color: #C7353A;
      font-size: 15px;
      font-weight: bold;
      height: 32px;
      background-color: rgba(185, 205, 255, 0);
    }
  ;

    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background-color: rgba(185, 205, 255, 0);
    }

    ::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
      background-color: rgba(0, 0, 0, .1)
    }
  }

  .data-box1 {
    border: 2px solid #0D233E;
    -webkit-box-shadow: #102B4B 0px 0px 10px;
    -moz-box-shadow: #102B4B 0px 0px 10px;
    box-shadow: inset 0 0 30px #102B4B;
    position: relative;
  }

  .topL {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #22589B;
    border-top-style: solid;
    border-left-width: 2px;
    border-left-color: #22589B;
    border-left-style: solid;
    position: absolute;
    top: -2px;
    left: -2px;
  }

  .topR {
    width: 20px;
    height: 20px;
    border-top-width: 2px;
    border-top-color: #22589B;
    border-top-style: solid;
    border-right-width: 2px;
    border-right-color: #22589B;
    border-right-style: solid;
    position: absolute;
    top: -2px;
    right: -2px;
  }

  .bottomL {
    width: 20px;
    height: 20px;
    border-bottom-width: 2px;
    border-bottom-color: #22589B;
    border-bottom-style: solid;
    border-left-width: 2px;
    border-left-color: #22589B;
    border-left-style: solid;
    position: absolute;
    bottom: -2px;
    left: -2px;
  }

  .bottomR {
    width: 20px;
    height: 20px;
    border-bottom-width: 2px;
    border-bottom-color: #22589B;
    border-bottom-style: solid;
    border-right-width: 2px;
    border-right-color: #22589B;
    border-right-style: solid;
    position: absolute;
    bottom: -2px;
    right: -2px;
  }

  .data-title-left, .data-title-right {
    color: #22589B;
    font-family: "微软雅黑";
    font-size: 20px;
  }

  .data-title {
    width: 178px;
    margin: -18px auto 0 auto;
    color: #3980D5;
    font-size: 20px;
  }

  .data-title span {
    margin: 0 15px;
  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;

      position: relative;

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgb(43, 231, 255);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }

  .table_zabbix {
    padding: 8px;
  }
  .bar-chart {
    background-color: rgba(91,133,126,0);
  }

.hideScrollbarTest{
  overflow: hidden;
}

.hideScrollbar {
  margin-right: -17px;
}
</style>

<style>
  .test .el-table::before {
    height: 0px;
  }

  .test .el-table tr td {
    border-bottom: 1px solid #666666;

  }

</style>
