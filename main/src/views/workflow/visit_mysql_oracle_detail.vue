<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr v-if="aDetail.siptable">
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
      <tr v-else>
        <td align="left"><b>产品线：</b> {{aDetail.product_name}}</td>
        <td align="left"><b>应用名：</b>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>申请原因：</b></div>
          <div style="float:left;">{{aDetail.needdesc}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper" v-if="aDetail.Cip">
          <div style="float:left;"><b>客户端IP：</b>(标红为windows)</div>
          <div style="float:left;" v-for="(item,index) in aDetail.Cip">
            <span v-if="windowslist.indexOf(item)!== -1" style="color:red;">{{item}}</span>
            <span v-else>{{item}}</span>
            <span v-if="index !== aDetail.Cip.length-1">,</span>
          </div>
        </td>
        <td v-else>
          <div style="float:left;color:red;"><b>windows说明：</b></div>
          <div style="float:left;color:red;">{{aDetail.sipreason}}</div>
        </td>
        <!-- <td align="left"><b>开通时长：</b> {{aDetail.time}}</td> -->
        <td align="left" v-if="aDetail.time == '永久'"><b>开通时长：</b> {{aDetail.time}}</td>
        <td align="left" v-else><b>开通时长：</b> {{aDetail.time}} 截止至 {{aDetail.enddate}}</td>
      </tr>
      <tr v-if="aDetail.windows_Cip && aDetail.windows_Cip!==''">
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>windows说明：</b></div>
          <div style="float:left;">{{aDetail.Cipreason}}</div>
        </td>
      </tr>
      <!-- <tr v-if="aDetail.time == '临时'">
        <td></td>
        <td align="left" v-if="aDetail.time == '临时'"><b>截止时间：</b> {{aDetail.enddate}}</td>
      </tr> -->
      <tr>
        <td colspan="2" >
          <p><b>数据库信息：</b></p>
            <el-table :data="aDetail.configinfo" style="z-index:0">
              <el-table-column prop="db" label="数据库"  align="center" min-width="5">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.db">
                    <span>{{item[0]}}</span>
                    &nbsp;
                    <span v-if="item[1].split('/').length !==1">{{item[1].split('/')[0]}}</span> <!-- 第一个版本 -->
                    <span v-else>{{item[1].split('(')[0]}}</span> <!-- 第二个版本 -->
                    &nbsp;
                    <span>{{item[1].split('(')[1].split(')')[0]}}</span>
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
              <el-table-column prop="permissions" label="基础权限"  align="center" min-width="2">
                <template slot-scope="scope">
                  <!-- <div v-for="(item,index) in scope.row.permissions">
                    <span v-if="index == scope.row.db.length-1 ">{{item}}</span>
                    <span v-else>{{item}},</span>
                  </div> -->
                  {{String(scope.row.SIUD)}}
                </template>
              </el-table-column>
              <el-table-column prop="permissions" label="其他权限"  align="center" min-width="2">
                <template slot-scope="scope">
                  <!-- <div v-for="(item,index) in scope.row.permissions">
                    <span v-if="index == scope.row.db.length-1 ">{{item}}</span>
                    <span v-else>{{item}},</span>
                  </div> -->
                  {{String(scope.row.OTHER)}}
                </template>
              </el-table-column>
            </el-table>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2">
          <div style="float:left;"><b>mysql语句：</b></div>
          <div style="float:left;">
            <span v-for="item in tableData">
              <!-- <span v-for="itemdb in item.db" v-if="itemdb[1].split('(')[1].split(')')[0] == 'MySQL'">
                <span>{{itemdb[0]}}</span>
                &nbsp;
                <span>{{itemdb[1].split('/')[0]}}</span>
                &nbsp;
                <span>{{itemdb[1].split('(')[1].split(')')[0]}}</span>
                <br />
                <span v-for="itemtable in item.table_name.split(',')">
                  <span v-for="cip in aDetail.Cip">
                    grant {{String(item.permissions)}} on {{item.db_name}}.{{itemtable || '*'}} to '{{item.user_name}}'@'{{cip}}' identified by 'password';<br />
                  </span>
                </span>
              </span> -->
              <span v-for="itemdb in item.db" v-if="item.MorO=='Mysql'||itemdb[1].split('(')[1].split(')')[0] == 'MySQL'||itemdb[1].split('(')[1].split(')')[0] == 'Mysql'">
                <span>{{itemdb[0]}}</span>
                &nbsp;
                <span v-if="itemdb[1].split('/').length!==1">{{itemdb[1].split('/')[0]}}</span> <!-- 第一个版本 -->
                <span v-else>{{itemdb[1].split('(')[0]}}</span> <!-- 第二个版本 -->
                &nbsp;
                <span>{{itemdb[1].split('(')[1].split(')')[0]}}</span>
                <br />
              </span>
              <span v-if="item.MorO=='Mysql'||item.mysql">
                <span v-for="itemtable in item.table_name.split(',')">
                  <span v-for="cip in aDetail.Cip || iplist">
                    <!-- 基础权限 select、insert、update、delete         db.tb  或 db.* -->
                    <span v-if="item.SIUD.length !== 0">
                      grant {{String(item.SIUD)}} on {{item.db_name}}.{{itemtable || '*'}} to '{{item.user_name}}'@'{{cip}}' identified by 'password';<br />
                    </span>
                    <!-- 其他权限 -->
                    <!-- alter、create、drop、truncate        db.tb  或 db.* -->
                    <span v-if="item.OTHER_table.length !== 0">
                      grant {{String(item.OTHER_table)}} on {{item.db_name}}.{{itemtable || '*'}} to '{{item.user_name}}'@'{{cip}}' identified by 'password';<br />
                    </span>
                    <!-- execute    db.* -->
                    <span v-if="item.OTHER_db.length !== 0">
                      grant {{String(item.OTHER_db)}} on {{item.db_name}}.* to '{{item.user_name}}'@'{{cip}}' identified by 'password';<br />
                    </span>
                    <!-- replication slave、replication client     *.* -->
                    <span v-if="item.OTHER_all.length !== 0">
                      grant {{String(item.OTHER_all)}} on *.* to '{{item.user_name}}'@'{{cip}}' identified by 'password';<br />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </div>
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
        tableData:[],
        windowslist:[],
        iplist:[],
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
        if (this.aDetail.siptable) {
          this.aDetail.siptable = this.aDetail.siptable.filter(v => v.Sip.length !== 0)
          this.iplist = []
          var ip_list = []
          for (var i = 0; i < this.aDetail.siptable.length; i++) {
            ip_list.push(this.aDetail.siptable[i].Sip)
          }
          this.iplist = String(ip_list).split(',')
        } else {
          this.aDetail.product_name = value.project_name_list[0]+'/'+value.project_name_list[1]+'/'+value.project_name_list[2]
        }
        this.tableData = this.aDetail.configinfo
        for (var i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].MorO) {
            for (var j = 0; j < this.tableData[i].db.length; j++) {
              if(this.tableData[i].db[j][1].split('(')[1].split(')')[0] == 'MySQL'||this.tableData[i].db[j][1].split('(')[1].split(')')[0] == 'Mysql')
              {
                this.tableData[i].mysql=true
                break
              }
            }
          }
          this.tableData[i].SIUD = []
          this.tableData[i].OTHER = []
          this.tableData[i].OTHER_table = []
          this.tableData[i].OTHER_db = []
          this.tableData[i].OTHER_all = []
          for (var k = 0; k < this.tableData[i].permissions.length; k++) {
            // 基础权限 其他权限 分类
            if (this.tableData[i].permissions[k] =='SELECT'||this.tableData[i].permissions[k] =='INSERT'||this.tableData[i].permissions[k] =='UPDATE'||this.tableData[i].permissions[k] =='DELETE') {
              this.tableData[i].SIUD.push(this.tableData[i].permissions[k])
            } else{
              this.tableData[i].OTHER.push(this.tableData[i].permissions[k])
              // mysql语句分类
              if (this.tableData[i].permissions[k] =='ALTER'||this.tableData[i].permissions[k] =='CREATE'||this.tableData[i].permissions[k] =='DROP'||this.tableData[i].permissions[k] =='TRUNCATE') {
                // truncate是drop和create
                if (this.tableData[i].permissions[k] =='ALTER' || this.tableData[i].permissions[k] == 'CREATE' && this.tableData[i].OTHER_table.indexOf('CREATE') == -1 || this.tableData[i].permissions[k] == 'DROP' && this.tableData[i].OTHER_table.indexOf('DROP') == -1 ) {
                  this.tableData[i].OTHER_table.push(this.tableData[i].permissions[k])
                } else if (this.tableData[i].permissions[k] == 'TRUNCATE') {
                  if (this.tableData[i].OTHER_table.indexOf('CREATE') == -1) {
                    this.tableData[i].OTHER_table.push('CREATE')
                  }
                  if (this.tableData[i].OTHER_table.indexOf('DROP') == -1) {
                    this.tableData[i].OTHER_table.push('DROP')
                  }
                }
                // this.tableData[i].OTHER_table.push(this.tableData[i].permissions[k])
              } else if (this.tableData[i].permissions[k] =='EXECUTE') {
                this.tableData[i].OTHER_db.push(this.tableData[i].permissions[k])
              } else if (this.tableData[i].permissions[k] =='REPLICATION CLIENT'||this.tableData[i].permissions[k] =='REPLICATION SLAVE') {
                this.tableData[i].OTHER_all.push(this.tableData[i].permissions[k])
              }
            }
          }
        }
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
