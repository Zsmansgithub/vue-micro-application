<template>
  <div class="tablesize" style="margin:auto;padding:10px;border-radius:5px;min-height:100vh">
    <div style="text-align:center;height:30px;line-height:30px;font-size:20px;">运维值班表</div>
    <div class="clear" style="height:50px;line-height:50px;padding:0 20px;">
      <div style="float:left;">{{date}}</div>
      <div style="float:right;">
        <el-button-group>
          <el-button size="mini" @click="daybefore">前一天</el-button>
          <el-button size="mini" @click="dayistoday">今天</el-button>
          <el-button size="mini" @click="dayafter">后一天</el-button>
        </el-button-group>
      </div>
    </div>
    <div>
      <el-table :data="tableData" style="width:100%;color:#262626;" class="mytable">
        <el-table-column label="时间" width="100px"><template slot-scope="scope">{{scope.row.time}}</template></el-table-column>
        <el-table-column label="分组" width="100px"><template slot-scope="scope">{{scope.row.zu}}</template></el-table-column>
        <el-table-column label="成员"><template slot-scope="scope">{{String(scope.row.people)}}</template></el-table-column>
        <el-table-column label="方式" width="50px"><template slot-scope="scope">{{scope.row.type}}</template></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {get_duty_table} from '@/api/workflow/zhibantable'
  export default {
    name: 'zhibanhtml',
    data() {
      return {
        date:'',
        tableData:[],
      }
    },
    created() {
      this.dayistoday()
    },
    methods:{
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
      dayistoday(){
        var today =new Date()
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
  .clear:after{
    content: '';
    display: block;
    clear: both;
  }
  .el-table::before {
    background-color: #FFFFFF;
  }
  .mytable{
    /deep/ td{
      border:none;
      padding:5px 0;
    }
    /deep/ th{
     display:none;
    }
    /deep/ tr:nth-of-type(even){
     background-color:#F5F6F8;
    }
  }
  @media (max-width: 1920px){
    .tablesize {
      width:500px;
      background-color: #f0f0fc;
    }
  }
  @media (max-width: 500px){
    .tablesize {
      width:100%;
      background-color: #f0f0fc;
    }
  }
</style>
