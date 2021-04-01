<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table v-if="aDetail.array" border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="40%"/>
      <col width="5%"/>
      <col width="55%"/>
      <thead v-if="aDetail.desc">
        <td align="left" colspan="3" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;color:red;">{{aDetail.desc}}</div>
        </td>
      </thead>
      <tbody v-for="(team,tindex) in aDetail.array">
        <tr>
          <td>
            <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
              <legend align="center">源端信息</legend>
              <el-table :data="team.configinfo">
                <el-table-column prop="app" label="源应用/负责人"  align="center" min-width="3">
                  <template slot-scope="scope">
                    <div style="line-height: 16px;">
                      <span style="display: block;">
                        <span v-if="scope.row.status == 3 && typeof(scope.row.project_name_list[3]) == 'string'">{{ scope.row.project_name_list[3] }}</span>
                        <span v-else>
                          {{scope.row.project_name_list[0]}}/{{scope.row.project_name_list[1]}}/{{scope.row.project_name_list[2]}}/
                          <a style="color: #1890ff" @click="rowNameFilter(scope.row.app_id)">{{scope.row.app_name }}</a>
                        </span>
                      </span>
                      <div style="color: #8492a6; font-size: 10px">{{ scope.row.app_owner }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="ip" label="源IP"  align="center" min-width="3">
                  <template slot="header" slot-scope="scope">
                    <label slot="label">源IP
                      <el-button icon="el-icon-info" style="color:hotpink;padding:0;" type="text" @click="getiplist(team.configinfo)"></el-button>
                    </label>
                  </template>
                  <template slot-scope="scope">
                    <span v-for="(item,ipindex) in scope.row.Sip">{{item}}<br v-if="ipindex!==scope.row.Sip.length-1"/></span>
                  </template>
                </el-table-column>
              </el-table>
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
                      <span style="display: block;" v-if="scope.row.cluster_name">{{scope.row.cluster_name}}</span>
                      <span style="display: block;" v-else>
                        <span v-if="scope.row.status==8">{{findRedisAppName(scope.row.esmqname)}}</span>
                        <span v-else>{{scope.row.esmqname}}</span>
                      </span>
                      <div style="color: #8492a6; font-size: 10px">
                        <span v-if="scope.row.cluster_type">{{scope.row.cluster_type}}</span>
                        <span v-else>
                          <span v-if="scope.row.status==3">ES</span>
                          <span v-if="scope.row.status==4">MQ</span>
                          <span v-if="scope.row.status==5">mysql</span>
                          <span v-if="scope.row.status==6">oracle</span>
                          <span v-if="scope.row.status==7">mongodb</span>
                          <span v-if="scope.row.status==8">redis</span>
                          <span v-if="scope.row.apptype">应用类型为
                            <span v-if="scope.row.apptype=='ES'||scope.row.apptype=='RocketMQ'||scope.row.apptype=='MySQL'||
                            scope.row.apptype=='Oracle'||scope.row.apptype=='Redis'||scope.row.apptype=='MongoDB'" style="color:red;">
                            {{scope.row.apptype}} 请通过集群添加</span>
                            <span v-else>{{scope.row.apptype}}</span>
                          </span>
                        </span>
                      </div>
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
        <tr v-if="!aDetail.desc">
          <td align="left"colspan="3" class="text-wrapper">
            <div style="float:left;"><b>备注描述：</b></div>
            <div style="float:left;">{{team.desc}}</div>
          </td>
        </tr>
      </tbody>
      <el-button type="text" @click="dialogVisible = true">防火墙策略</el-button>
    </table>
    <table v-else border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="40%"/>
      <col width="5%"/>
      <col width="55%"/>
      <tr>
        <td>
          <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
            <legend align="center">源端信息</legend>
            <el-table :data="SiptableData">
              <el-table-column prop="ip" label="源IP"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.ip}}
                </template>
              </el-table-column>
              <el-table-column prop="app" label="源应用/负责人"  align="center" min-width="4">
                <template slot-scope="scope">
                  <div style="line-height: 16px;">
                    <span style="display: block;">{{ scope.row.app }}</span>
                    <div style="color: #8492a6; font-size: 10px">{{ scope.row.owner }}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
        </td>
        <td align="center">
          <i class="el-icon-right"></i>
        </td>
        <td>
          <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
            <legend align="center">目标端信息</legend>
            <el-table :data="DiptableData">
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
      <tr>
        <td align="left"colspan="3" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
    </table>
    <el-dialog title="内网防火墙策略" :visible.sync="dialogVisible" :width="dialogwidth" :append-to-body="true">
      <div class="el-dialog-div">
        <!-- 创建内网防火墙策略 -->
        <div v-for="(team,tindex) in aDetail.array" v-if="team.dtable">
          <span v-for="(src,srcindex) in team.configinfo">
            <span>ip address-set fangwen_{{src.app_name}} type object<br /></span><!-- 源端 --><!-- fangwen_源应用名 -->
            <span v-for="(s,i) in src.Sip">address {{i}} {{s}} mask 32<br /></span>
            <span>ip address-set {{src.app_name}} type object<br /></span><!-- 目的端 --><!-- 源应用名 -->
            <span v-for="(d,j) in team.DiptableIp">
              <span v-if="isip(d)">address {{j}} {{d}} mask 32<br /></span><!-- ip x.x.x.x -->
              <span v-else>address {{j}} <span style="color:red;">{{d}}</span> mask 32<br /></span><!-- 找不到ip的域名 -->
            </span>
            <span>ip service-set {{src.app_name}}_port type object 513<br /></span><!-- 目的端 端口 --><!-- 源应用名_port --><!-- 可固定用 513 -->
            <!-- 所有目的端 无port -->
            <span v-if="team.DiptablePort.length==0">service 0 protocol tcp source-port 0 to 65535 destination-port <span style="color:red;">空</span><br /></span>
            <!-- 有的目的端 无port 有的有port -->
            <span v-else v-for="(p,k) in team.DiptablePort">service {{k}} protocol tcp source-port 0 to 65535 destination-port {{p}}<br /></span>
            <span>quit<br /></span>
            <span>security-policy<br /></span><!-- 创建规则 -->
            <!-- 规则生效日期 -->
            <span v-if="$route.params.detailData.status !='3'">rule name {{src.app_name}}{{formatDate(new Date())}}<br /></span><!-- 未审批完成 日期为今天 -->
            <span v-else>rule name {{src.app_name}}{{formatDate(new Date($route.params.detailData.update_time))}}<br /></span><!-- 审批完成 日期为审批完成时间 -->
            <span>policy logging<br /></span>
            <span>source-zone<br /></span>
            <span>destination-zone<br /></span>
            <span>source-address address-set fangwen_{{src.app_name}}<br /></span>
            <span>destination-address address-set  {{src.app_name}}<br /></span>
            <span>service {{src.app_name}}_port<br /></span>
            <span>action permit \n<br /></span>
            <br />
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </component>
</template>

<script>
  import detail from './components/detail'
  import h5detail from '../workflow_h5/h5detail'
  import {fetchIPList} from '@/api/cmdb'
  import {getIpList} from '@/api/workflow/app_manage'
  import {fetchF5WideIp} from '@/api/cainiao/f5_dns'
  export default {
    components: {
      detail,h5detail
    },
    data() {
      return {
        aDetail:{},
        comName:'detail',
        SiptableData:[],
        DiptableData:[],
        port_list:{},
        listQuery: {
          ip_list: '',
        },
        tableData:[],
        total:0,
        DomainObj:{},
        dialogwidth:'30%',
        dialogVisible:false
      }
    },
    created() {
      this.isMobile()
    },
    methods: {
      detaildatafromchild(value){
        this.aDetail = value
        // 兼容不同版本
        if( this.aDetail.array )
        {
          this.getarray()
        } else {
          this.getIPinfo()
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
      sipdata(query){
        getIpList(query).then(response => {
          const tableData = []
          for (const i of response) {
            tableData.push({
              ip: i.ip,app:i.app_name,owner:i.app_owner
            })
          }
          // 合并为一个数组
          this.SiptableData = this.SiptableData.concat(tableData)
        })
      },
      getIPinfo(){
        // 源ip
        this.listQuery.ip_list=''
        var ip_list = []
        for (var i = 0; i < this.aDetail.configinfo.length; i++) {
          ip_list = ip_list.concat(this.aDetail.configinfo[i].Sip)
        }
        this.listQuery.ip_list = String(ip_list)
        this.SiptableData =[]
        if (this.listQuery.ip_list !== '') {
          this.sipdata(this.listQuery)
        }
        // 目的ip
        const tableData = []
        tableData.push({
          ip: this.aDetail.Domain,
          port:this.aDetail.port
        })
        // 合并为一个数组
        this.DiptableData = this.DiptableData.concat(tableData)
      },
      getarray(){
        for (var i = 0; i < this.aDetail.array.length; i++) {
          // 源ip
          this.aDetail.array[i].configinfo = this.aDetail.array[i].configinfo.filter(v => v.Sip.length !== 0)
          // 目的ip 兼容两个版本
          if (!this.aDetail.array[i].dtable) {
            const tableData = []
            tableData.push({
              ip: this.aDetail.array[i].Domain,
              port:this.aDetail.array[i].port
            })
            this.aDetail.array[i].DiptableData = tableData.concat()
            this.getrowspan(this.aDetail.array[i])  //为了兼容版本spanArr
          } else {
            this.aDetail.array[i].DiptableData = this.aDetail.array[i].dtable.filter(v => v.ip !== '')
            this.getrowspan(this.aDetail.array[i])  //合并表格
            //创建内网防火墙策略 port
            this.aDetail.array[i].DiptableIp = []
            this.aDetail.array[i].DiptablePort = []
            for (var j = 0; j < this.aDetail.array[i].dtable.length; j++) {
              var dtableip = this.aDetail.array[i].dtable[j].ip
              if (this.isip(dtableip)) {//ip x.x.x.x
                this.aDetail.array[i].DiptableIp.push(dtableip)
              } else if (this.isip(dtableip.split('/')[0])) {//ip x.x.x.x/y/z
                // 都是oracle，是重复的数据，省略
              } else{//域名
                this.findseverip(dtableip,this.aDetail.array[i].DiptableIp)
              }
              if (this.aDetail.array[i].dtable[j].port) {
                var portlist = this.aDetail.array[i].dtable[j].port.split(',')
                for (var k = 0; k < portlist.length; k++) {
                  if (this.aDetail.array[i].DiptablePort.indexOf(portlist[k])==-1) {
                    this.aDetail.array[i].DiptablePort.push(portlist[k])
                  }
                }
              }
            }
          }
        }
      },
      getiplist(conf){
        var ip_list = []
        for (var i = 0; i < conf.length; i++) {
          ip_list = ip_list.concat(conf[i].Sip)
        }
        // console.log(String(ip_list))
        // this.$alert(String(ip_list).replace( new RegExp( ',' , "g" ) , '\n' ),'源IP列表').then(_ => {}).catch(_ => {});
        // this.$alert(String(ip_list).replace( new RegExp( ',' , "g" ) , '<br/>' ),'源IP列表',{dangerouslyUseHTMLString: true}).then(_ => {}).catch(_ => {});
        this.$alert(String(ip_list).replace( new RegExp( ',' , "g" ) , '<br/>' ),'源IP列表',{dangerouslyUseHTMLString: true,customClass:'firewall_myalert'}).then(_ => {}).catch(_ => {});
      },
      //redis产品线+集群名  只显示集群名
      findRedisAppName(redisLineAndApp){
        var index = redisLineAndApp.indexOf('_')
        return redisLineAndApp.slice(index+1)
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
      // 日期格式化为YYMMDD
      formatDate(date){
        return String(date.getFullYear()).substring(2)+((date.getMonth()+1)<10?'0'+String(date.getMonth()+1):String(date.getMonth()+1))+(date.getDate()<10?'0'+String(date.getDate()):String(date.getDate()))
      },
      isip(val){
        var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        return re.test(val)
      },
      findseverip(Domain,array){
        fetchF5WideIp({name:Domain}).then(response => {
          if (response.count != 0) {
            this.DomainObj[Domain] = response.results[0].srv_ips.split(',')
            for (var i = 0; i < this.DomainObj[Domain].length; i++) {
              array.push(this.DomainObj[Domain][i])
            }
          } else {
            array.push(Domain)
          }
        })
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
