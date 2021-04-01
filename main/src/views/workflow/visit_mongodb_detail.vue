<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td colspan="2">
          <p><b>客户端IP：</b></p>
          <el-table :data="aDetail.siptable" style="z-index:0">
            </el-table-column>
            <el-table-column prop="app" label="应用名"  align="center" min-width="2">
              <template slot-scope="scope">
                {{scope.row.project_name_list[0]}}/{{scope.row.project_name_list[1]}}/{{scope.row.project_name_list[2]}}/
                <a style="color: #1890ff" @click="rowNameFilter(scope.row.app_id)">{{ scope.row.app_name }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="env" label="环境"  align="center" min-width="2">
              <template slot-scope="scope">{{scope.row.env}}</template>
            </el-table-column>
            <el-table-column prop="Sip" label="客户端IP"  align="center" min-width="2">
              <template slot-scope="scope">
                {{String(scope.row.Sip)}}
              </template>
            </el-table-column>
            <el-table-column prop="windows" label="windows机器"  align="center" min-width="2">
              <template slot="header" slot-scope="scope">
                <label slot="label" style="color:red;">windows机器</label>
              </template>
              <template slot-scope="scope">
                <span style="color:red;">{{String(scope.row.windows)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>申请原因：</b></div>
          <div style="float:left;">{{aDetail.needdesc}}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="float:left;color:red;"><b>windows说明：</b></div>
          <div style="float:left;color:red;">{{aDetail.sipreason}}</div>
        </td>
        <td align="left" v-if="aDetail.time == '永久'"><b>开通时长：</b> {{aDetail.time}}</td>
        <td align="left" v-else><b>开通时长：</b> {{aDetail.time}} 截止至 {{aDetail.enddate}}</td>
      </tr>
      <tr>
        <td colspan="2" >
          <p><b>数据库信息：</b></p>
            <el-table :data="aDetail.configinfo" style="z-index:0">
              <el-table-column prop="db" label="数据库"  align="center" min-width="5">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.db">
                    <span>{{item[0]}} {{item[1].split('(')[0]}}</span>
                    <br v-if="index !== scope.row.db.length-1" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="db_name" label="库名/Schema"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.db_name}}
                </template>
              </el-table-column>
              <el-table-column prop="table_name" label="表名"  align="center" min-width="2">
                <template slot-scope="scope">
                  <span v-if="scope.row.table_name!==''">{{scope.row.table_name}}</span>
                  <span v-else>all</span>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="用户名"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.user_name}}
                </template>
              </el-table-column>
              <el-table-column prop="permissions" label="权限"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.permissions}}
                </template>
              </el-table-column>
            </el-table>
        </td>
      </tr>
      <tr v-if="DiptableData.length !== 0">
        <td colspan="2">
          <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
            <legend align="center"><b>开通内网防火墙权限</b></legend>
            <el-table :data="DiptableData" class="dipstyle" :span-method="cellMerge">
              <el-table-column prop="cluster_name" label="名称/集群类型"  align="center" min-width="2">
                <template slot-scope="scope">
                  <div style="line-height: 16px;">
                    <span style="display: block;">{{scope.row.cluster_name}}</span>
                    <div style="color: #8492a6; font-size: 10px">{{scope.row.cluster_type}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="ip" label="目的域名或ip"  align="center" min-width="2">
                <template slot-scope="scope">{{scope.row.ip}}</template>
              </el-table-column>
              <el-table-column prop="port" label="port"  align="center" min-width="2">
                <template slot-scope="scope">{{scope.row.port}}</template>
              </el-table-column>
            </el-table>
          </fieldset>
        </td>
      </tr>
      <tr>
        <td colspan="2" align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
    </table>
  </component>
</template>

<script>
  import detail from './components/detail'
  import h5detail from '../workflow_h5/h5detail'
  import {getwindowslist} from '@/api/zabbix'
  export default {
    components: {
      detail,h5detail
    },
    data() {
      return {
        aDetail:{},
        DiptableData:[],
        comName:'detail',
        windowslist:[],
      }
    },
    created() {
      this.isMobile()
      getwindowslist().then(response => {
        this.windowslist = response.windows_list
      });
    },
    methods: {
      detaildatafromchild(value){
        // console.log(value)
        this.aDetail = value
        this.aDetail.siptable = this.aDetail.siptable.filter(v => v.Sip.length !== 0)
        if ( this.aDetail.dtable ) {
          this.aDetail.dtable = this.aDetail.dtable.filter(v => v.ip !== '')
          this.DiptableData = this.aDetail.dtable
          this.getrowspan()  //合并表格
        }
      },
      download(item){
        return this.$refs.child.download(item);
      },
      rowNameFilter(id) {
        this.$refs.child.rowNameAPPFilter(id);
      },
      //集群名称合并
      getrowspan(){
        //处理数据
        this.spanArr = []
        for (var i = 0; i < this.DiptableData.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0
          } else {
          // 判断当前元素与上一个元素是否相同   存在cluster_name才合并
            if (this.DiptableData[i].cluster_name && this.DiptableData[i].cluster_name === this.DiptableData[i - 1].cluster_name && this.DiptableData[i].cluster_type === this.DiptableData[i - 1].cluster_type) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
      },
      //合并表格
      cellMerge({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
      },
      isMobile(){
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
          this.comName = 'h5detail'
        } else {
          this.comName = 'detail'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dipstyle::before {
    background-color: #FFFFFF;
  }
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>
