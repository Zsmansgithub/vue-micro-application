<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table v-if="aDetail.array" border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="40%"/>
      <col width="5%"/>
      <col width="55%"/>
      <tbody v-for="(team,tindex) in aDetail.array">
        <tr>
          <td align="left" colspan="3">
            <div class="text-wrapper">
              <div style="float:left;"><b>访问原因：</b></div>
              <div style="float:left;">{{team.reason}}</div>
            </div>
          </td>
        </tr>
        <tr>
          <!-- <td align="left"colspan="3" class="text-wrapper">
            <div style="float:left;"><b>备注描述：</b></div>
            <div style="float:left;">{{team.desc}}</div>
          </td> -->
          <td align="left" colspan="3">
            <div style="width:50%;float:left;" align="left"><b>开通时长：</b> {{team.day}} 天 截止至 {{add_days(team.day)}}</div>
            <div style="width:50%;float:left;" class="text-wrapper">
              <div style="float:left;"><b>备注描述：</b></div>
              <div style="float:left;color:red;">{{team.desc}}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
              <legend align="center">源端信息</legend>
              <div class="text-wrapper" align="center" style="color: #606266;padding:10px 0;">{{team.officeIP}}</div>
            </fieldset>
          </td>
          <td align="center">
            <i class="el-icon-right"></i>
          </td>
          <td>
            <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
              <legend align="center">目标端信息</legend>
              <el-table :data="team.DiptableData" :span-method="(...arg)=>cellMerge(...arg,team)">
                <el-table-column prop="esmqname" label="名称/集群类型"  align="center" min-width="2">
                  <template slot-scope="scope">
                    <div style="line-height: 16px;">
                      <span style="display: block;">{{scope.row.cluster_name}}</span>
                      <div style="color: #8492a6; font-size: 10px">{{scope.row.cluster_type}}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="ip" label="目的域名或IP"  align="center" min-width="2">
                  <template slot-scope="scope">
                    {{scope.row.ip}}
                  </template>
                </el-table-column>
                <el-table-column prop="port" label="目的端口"  align="center" min-width="2">
                  <template slot-scope="scope">
                    {{scope.row.port}}
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </td>
        </tr>
      </tbody>
    </table>
  </component>
</template>

<script>
  import detail from './components/detail'
  import h5detail from '../workflow_h5/h5detail'
  export default {
    components: {
      detail,h5detail
    },
    data() {
      return {
        aDetail:{},
        comName:'detail',
        DiptableData:[],
        dialogwidth:'30%',
      }
    },
    created() {
      this.isMobile()
    },
    methods: {
      detaildatafromchild(value){
        this.aDetail = value
        if( this.aDetail.array ) {
          this.getarray()
        }
      },
      download(item){
        return this.$refs.child.download(item);
      },
      rowNameFilter(id) {
        this.$refs.child.rowNameAPPFilter(id);
      },
      isMobile(){
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
          this.comName = 'h5detail'
          this.dialogwidth = '100%'
        } else {
          this.comName = 'detail'
          this.dialogwidth = '30%'
        }
      },
      getarray(){
        for (var i = 0; i < this.aDetail.array.length; i++) {
          this.aDetail.array[i].officeIP = this.aDetail.array[i].officeIP.replace( new RegExp( ',' , "g" ) , '\n' )
          if (this.aDetail.array[i].dtable) {
            this.aDetail.array[i].DiptableData = this.aDetail.array[i].dtable.filter(v => v.ip !== '')
            this.getrowspan(this.aDetail.array[i])  //合并表格
          }
        }
      },
      //集群名称合并
      getrowspan(team){
        //处理数据
        team.spanArr = []
        for (var i = 0; i < team.DiptableData.length; i++) {
          if (i === 0) {
            team.spanArr.push(1);
            team.pos = 0
          } else {
          // 判断当前元素与上一个元素是否相同   存在cluster_name才合并
            if (team.DiptableData[i].cluster_name && team.DiptableData[i].cluster_name === team.DiptableData[i - 1].cluster_name && team.DiptableData[i].cluster_type === team.DiptableData[i - 1].cluster_type) {
              team.spanArr[team.pos] += 1;
              team.spanArr.push(0);
            } else {
              team.spanArr.push(1);
              team.pos = i;
            }
          }
        }
      },
      //合并表格
      cellMerge({ row, column, rowIndex, columnIndex },team) {
        if (columnIndex === 0) {
          const _row = team.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
      },
      add_days(days){
        var date = ''
        if (this.$route.params.detailData.status !='3') {
          date = new Date() //未审批完成 日期为今天 +day
        } else{
          date = new Date(this.$route.params.detailData.update_time) //审批完成 日期为审批完成时间 +day
        }
        date.setDate(date.getDate()+days-1)
        return String(date.getFullYear())+'-'+((date.getMonth()+1)<10?'0'+String(date.getMonth()+1):String(date.getMonth()+1))+'-'+(date.getDate()<10?'0'+String(date.getDate()):String(date.getDate()))
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-table::before {
    background-color: #FFFFFF;
  }
  .text-wrapper {
    white-space: pre-wrap;
  }
  .el-dialog-div{
    height: 60vh;
    overflow: auto;
  }
</style>
<style>
  /* 不能用scoped */
  @media (max-width: 420px){
    .firewall_myalert{
      width: 100%; /* h5 */
    }
  }
  .firewall_myalert p {
    max-height: 300px;
    overflow: auto;
  }
</style>
