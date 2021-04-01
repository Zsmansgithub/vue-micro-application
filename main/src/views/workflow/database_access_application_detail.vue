 <template>
    <div>
      <component :is="comName" @detaildata="detaildatafromchild" ref="child">
        <table v-if="aDetail" border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
          <col width="50%"/>
          <col width="50%"/>
          <tr>
            <td align="left"><b>入职时间：</b> {{aDetail.entryTime}}</td>
            <td align="left"><b>访问时间范围：</b> {{aDetail.timeRange[0]}} <span style="padding: 0 10px">-</span> {{aDetail.timeRange[1]}}</td>
          </tr>
          <tr>
            <td align="left"><b>申请访问数据库：</b>
              <label class="el-checkbox" :class="{'is-checked':aDetail.databaseType1 === '测试数据库'}">
                <span class="el-checkbox__input" :class="{'is-checked':aDetail.databaseType1 === '测试数据库'}">
                  <span class="el-checkbox__inner"></span>
                </span><span class="el-checkbox__label">测试数据库</span>
              </label>
              <label class="el-checkbox" :class="{'is-checked':aDetail.databaseType1 === '生产数据库'}">
                <span class="el-checkbox__input" :class="{'is-checked':aDetail.databaseType1 === '生产数据库'}">
                  <span class="el-checkbox__inner"></span>
                  <input type="checkbox" aria-hidden="false" disabled="disabled" class="el-checkbox__original" value="">
                </span>
                <span class="el-checkbox__label">生产数据库</span>
              </label>
            </td>
            <td align="left"><b>联系电话：</b> <span v-if="userInfo">{{userInfo.mobile}}</span></td>
          </tr>
          <tr>
            <td align="left"><b>邮箱：</b><span v-if="userInfo">{{userInfo.email || defText}}</span></td>
            <td align="left"><b>客户端ip地址：</b> {{aDetail.Cip | textIps}}</td>
          </tr>
          <tr>
            <td colspan="2" >
              <p><b>数据库信息：</b></p>
              <el-table :data="aDetail.configinfo" style="z-index:0">
                <el-table-column prop="db" label="数据库"  align="center" min-width="5">
                  <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.db" :key="index">
                      <span v-if="['Mysql', 'Oracle'].includes(scope.row.MorO)">
                        <span>{{item[0]}}</span>
                        <span v-if="item[1].split('/').length !==1">{{item[1].split('/')[0]}}</span> <!-- 第一个版本 -->
                        <span v-else>{{item[1].split('(')[0]}}</span> <!-- 第二个版本 -->
                        <span>{{item[1].split('(')[1].split(')')[0]}}</span>
                        <br v-if="index !== scope.row.db.length-1" />
                      </span>
                      <span v-else>
                        <span>{{scope.row.MorO}}</span>
                        <span>{{item}}</span>
                        <br v-if="index !== scope.row.db.length-1" />
                      </span>
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

                <el-table-column prop="permissions" label="基础权限"  align="center" min-width="2">
                  <template slot-scope="scope">
                    {{scope.row.permissions | textSIUD}}
                  </template>
                </el-table-column>
                <el-table-column prop="permissions" label="其他权限"  align="center" min-width="2">
                  <template slot-scope="scope">
                    {{scope.row.permissions | textOTHER}}
                  </template>
                </el-table-column>
              </el-table>
            </td>
          </tr>
          <tr>
            <td align="left" colspan="2">
              <div style="float:left;"><b>mysql语句：</b></div>
              <div style="float:left;">
                <span v-for="(item, index) in tableData" :key="index">
                  <template v-for="(itemdb, index1) in item.db">
                    <span  :key="index1" v-if="item.MorO === 'Mysql' || itemdb[1].split('(')[1].split(')')[0] === 'MySQL' || itemdb[1].split('(')[1].split(')')[0] === 'Mysql'">
                      <span>{{itemdb[0]}}</span>
                      &nbsp;
                      <span v-if="itemdb[1].split('/').length!==1">{{itemdb[1].split('/')[0]}}</span> <!-- 第一个版本 -->
                      <span v-else>{{itemdb[1].split('(')[0]}}</span> <!-- 第二个版本 -->
                      &nbsp;
                      <span>{{itemdb[1].split('(')[1].split(')')[0]}}</span>
                      <br />
                    </span>
                  </template>
                  <span v-if="item.MorO==='Mysql'||item.mysql">
                    <span v-for="(itemtable, index2) in item.table_name.split(',')" :key="index2">
                      <span v-for="(cip, index3) in aDetail.Cip || iplist" :key="index3">
                        <!-- 基础权限 select、insert、update、delete         db.tb  或 db.* -->
                        <span v-if="item.SIUD.length !== 0">
                          grant {{String(item.SIUD)}} on {{item.db_name}}.{{itemtable || '*'}} to '{{$route.params.detailData.create_user_id}}'@'{{cip}}' identified by 'password';<br />
                        </span>
                        <!-- 其他权限 -->
                        <!-- alter、create、drop、truncate        db.tb  或 db.* -->
                        <span v-if="item.OTHER_table.length !== 0">
                          grant {{String(item.OTHER_table)}} on {{item.db_name}}.{{itemtable || '*'}} to '{{$route.params.detailData.create_user_id}}'@'{{cip}}' identified by 'password';<br />
                        </span>
                        <!-- execute    db.* -->
                        <span v-if="item.OTHER_db.length !== 0">
                          grant {{String(item.OTHER_db)}} on {{item.db_name}}.* to '{{$route.params.detailData.create_user_id}}'@'{{cip}}' identified by 'password';<br />
                        </span>
                        <!-- replication slave、replication client     *.* -->
                        <span v-if="item.OTHER_all.length !== 0">
                          grant {{String(item.OTHER_all)}} on *.* to '{{$route.params.detailData.create_user_id}}'@'{{cip}}' identified by 'password';<br />
                        </span>
                      </span>
                    </span>
                    <br /><!-- 访问时间范围 -->
                    <span v-for="(cip, index) in aDetail.Cip || iplist" :key="`cip_${index}`">
                      alter user '{{$route.params.detailData.create_user_id}}'@'{{cip}}' PASSWORD EXPIRE INTERVAL {{days}} DAY;<br />
                    </span>
                  </span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2"><b>接入数据库原因：</b>{{aDetail.reason|| defText}}</td>
          </tr>
          <tr>
            <td colspan="2"><b>特殊访问需求：</b>{{aDetail.accessRequirements || defText}}</td>
          </tr>
          <tr>
            <td>
             <b>word文档(点击下载)：</b><el-button @click="downFile" type="text">数据库接入申请</el-button>
            </td>
          </tr>
        </table>
      </component>
    </div>
  </template>

  <script>
    import detail from './components/detail';
    import h5detail from '../workflow_h5/h5detail'
    import {getUsersInfo} from '@/api/manage_monitor/user_department'
    import { outDocx } from './components/database_access_application/exportDocx'
    export default {
      components: {
        detail,h5detail
      },
      computed: {
        node_handle() {
          return this.$route.params.detailData && this.$route.params.detailData.node_handle
        }
      },
      data() {
        return {
          aDetail: undefined,
          userInfo: undefined,
          tableData: [],
          comName:'detail',
          days:undefined,
          defText: '-'
        }
      },
      created() {
        this.isMobile()
      },
      methods: {
        detaildatafromchild(value){
          this.aDetail = value;
          var startDate = Date.parse(this.aDetail.timeRange[0]);
          var endDate = Date.parse(this.aDetail.timeRange[1]);
          this.days=(endDate - startDate)/(1*24*60*60*1000);
          this.getUsersInfo(this.$route.params.detailData.create_user_id)
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
        },
        downFile() {
          try{
            const detailData = this.$route.params.detailData
            const appForm = JSON.parse(detailData.values)
            outDocx(detailData, appForm).catch((e) => {
              console.error(e)
              this.$message.error('下载失败!')
            })
          } catch (e) {
            console.error(e)
            this.$message.error('下载失败!')
          }
        },
        getUsersInfo(userId) {
          getUsersInfo({
            page: 1,
            limit: 20,
            uuid: userId,
            user_name: undefined,
            ou: undefined,
          }).then(res => {
            this.userInfo = res.results[0];
          })
          .catch((e) => {
            console.log(e);
          })
        },
        rowNameFilter(id) {
          this.$refs.child.rowNameAPPFilter(id);
        },
        isMobile(){
          if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            this.comName = 'h5detail'
          } else {
            this.comName = 'detail'
          }
        }
      },
      filters: {
        textIps(ips) {
          return ips.reduce((str, v)=>{str+=v + ',';return str;}, '').slice(0, -1) || '-';
        },
        textSIUD(permissions) {
          return permissions.reduce((str, v) => {
            if(['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(v)) str+=v + ',';
            return str;
          }, '').slice(0, -1) || '-';
        },
        textOTHER(permissions) {
          return permissions.reduce((str, v) => {
            if(!['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(v)) str+=v + ',';
            return str;
          }, '').slice(0, -1) || '-';
        },
      }
    }
</script>

<style lang="scss" scoped>
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #DCDFE6;
    border-color: #DCDFE6;
  }
  .el-checkbox__inner:hover {
    border-color: #DCDFE6;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #606266;
  }
</style>
