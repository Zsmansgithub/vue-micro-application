<template>
  <div class="app-container container">

    <div>
      <h2 style="text-align: center; margin-top:0px">监控
        <label style="color: #d9d9d9; font: small-caption;text-align: center">&copy; YTOM{{datatime}}</label>
      </h2>

    </div>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="bug" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当前报警数
          </div>
          <count-to :start-val="0" :end-val=panelgroup.alarm_sum :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
    <el-row :gutter="20">
            <el-col :span="12" style="text-align: center">
              <el-card class="box-card">
                <el-table :data="tableData" class="dashboard_class" :show-header="false"  style="width: 100%;margin-top:20px;border-bottom-color:#ff0000" max-height="360">
                  <el-table-column label="来源" width="80px" prop="alarm_source"></el-table-column>
                  <el-table-column label="来源" width="130px" prop="host_name" show-overflow-tooltip></el-table-column>
                  <el-table-column label="来源" min-width="90px" prop="description" show-overflow-tooltip></el-table-column>
                  <el-table-column label="来源" width="90px" prop="ctime" :formatter="formatDate" ></el-table-column>
                  <el-table-column label="操作" width="60px" v-if="tableData.length !=0">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-delete"  circle @click.native.prevent="deleteRow(scope.$index, tableData)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="12" style="text-align: center;border: 1px">
              <el-card class="box-card">
                              <div style="position: relative;" >
ssssss
              </div>
              </el-card>
            </el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  export default {
      components: {
    CountTo
  },
        data() {
            return {
                datatime:'1111',
                 data:0,
                websock: null,
              tableData:[],
              tableHeader:['alarm_source','host_name','time',]
            }
        },
　　　　created(){
            this.initWebSocket()
            // setInterval(this.showMarquee, 5000)
       },
　　　　destroyed: function() {
　　　　　　this.websocketclose();
　　　　},
　　　　methods: {
        formatDate(row, column, cellValue){
              if (row.ctime <60) {
                return '刚刚'
              }else if (60< row.ctime && row.ctime < 3600){
                let h=parseInt(row.ctime/60)
                return h+'分钟'
              }else if (3600< row.ctime && row.ctime < 86400){
                let h=parseInt(row.ctime/3600)
                return h+'小时'
              }else if (row.ctime > 86400){
                let d = parseInt(row.ctime/86400)
                return d+'天'
              }
            },
          showMarquee: function () {
                setTimeout(()=>{
                  this.tableData.unshift(this.tableData.pop());
            },1000)},
　　　　　　initWebSocket(){
　　　　　　　　const wsuri = "ws://127.0.0.1:8899/zabbix/websocketpath";
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

　　　　　　websocketonmessage(e){ //数据接收
                // debugger
　　　　　　　　console.log(e.data);
                console.log(typeof(e.data))
                let xx=JSON.parse(e.data)
                 for( let i of xx) {
                   this.tableData.unshift(i)
                 }
　　　　　　},

　　　　　　websocketsend(agentData){//数据发送
　　　　　　　　this.websock.send(agentData);
　　　　　　},

　　　　　 websocketclose(e){ //关闭
　　　　　　　　console.log("connection closed (" + e.code + ")");
　　　　　},
　　　},
　　}
</script>

<style lang="scss"  rel="stylesheet/scss"  scoped>
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
      border: 0px;
    }


 }
  .dashboard_class /deep/ {
    /*border: 0px solid #006cff;*/
    background-color: rgba(185, 205, 255, 0);
     /deep/  tbody tr:hover>td { background-color: #409eff}
     /deep/  button  { background-color: #778a9c00}
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
      color: #f2f2f2;
      font-size: 15px;
      font-weight: bold;
      height: 32px;
      background-color: rgba(185, 205, 255, 0);
    };

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

  .app-container {
    /*background-size: cover;*/
    color: #f2f2f2;
    /*height: 510%;*/
    height: 100%;
    width: 100%;
    /*position: inherit;*/
    background: no-repeat;
    background-size: 100% 100%;
    /*background-color: #061536;*/
    background-image: url('../../../assets/dashboard1.jpg');
    /*padding-right: 65px;*/

  }

  /*.box-card {*/
  /*  color: #f2f2f2;*/
  /*  background-color: #061536;*/
  /*}*/

</style>
