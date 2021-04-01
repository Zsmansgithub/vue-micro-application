<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table v-if="aDetail.steplinestatus" border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left"><b> 申请类型：</b>
          <span v-if="aDetail.steplinestatus =='0'">新增Topic</span>
          <span v-if="aDetail.steplinestatus =='1'">已有Topic新增consumer</span>
        </td>
      </tr>
      <tr>
        <td align="left"><b> 产品线：</b> {{aDetail.product_name}}</td>
        <td align="left"><b>应用名：</b>
          <span style="color: #8492a6; font-size: 10px">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>
          <span style="color: #8492a6; font-size: 10px">CN：</span>{{ aDetail.app_cname }}
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>需求描述：</b></div>
          <div style="float:left;">{{aDetail.needdesc}}</div>
        </td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='0'">
        <td align="left"><b> 平均消息大小：</b> {{aDetail.messagekb}} /kb</td>
        <td align="left" v-if="aDetail.message>10000 || aDetail.message==10000"><b> 消息量：</b> {{aDetail.message/10000}}万 条/天</td>
        <td align="left" v-else><b> 消息量：</b> {{aDetail.message}} 条/天</td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='0'">
        <td align="left"><b> 高峰消息量：</b> {{aDetail.high}} 条/秒</td>
        <td align="left" v-if="aDetail.is_mqcloud == 1"><b>是否使用mqcloud：</b> 是</td>
        <td align="left" v-else-if="aDetail.is_mqcloud == 0"><b>是否使用mqcloud：</b> 否</td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='0'">
        <td align="left"><b> 主题名称：</b>{{aDetail.topicname}}-topic</td>
        <td align="left"><b> 生产者名称：</b> {{aDetail.topicnamep}}-topic-producer</td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='1'">
        <td align="left"><b> 主题名称：</b>{{aDetail.topicname1}}</td>
        <td align="left"><b> 消费者名称：</b> {{aDetail.topicnamec1}}-topic-consumer</td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='0'">
        <td align="left"><b> 消费者名称：</b> {{aDetail.topicnamec}}-topic-consumer</td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>用途说明：</b></div>
          <div style="float:left;">{{aDetail.usedesc}}</div>
        </td>
      </tr>
      <tr>
        <td align="left"><b> 告警阈值：</b>
        <span v-if="aDetail.alarm !==''">{{aDetail.alarm}} {{aDetail.alarm_type}}</span></td>
        <td align="left"><b> 告警联系人：</b>
          <span v-for="(item,index) in aDetail.owner">
            <span v-if="index !== aDetail.owner.length-1 ">{{item}}&nbsp;</span>
            <span v-else>{{item}}</span>
          </span>
        </td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='0'">
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='1'">
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>用途说明：</b></div>
          <div style="float:left;">{{aDetail.usedesc}}</div>
        </td>
      </tr>
      <tr v-if="aDetail.steplinestatus =='1'">
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
      <tr v-if="DiptableData.length !== 0">
        <td colspan="2">
          <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
            <legend align="center">开通内网防火墙权限 目的IP</legend>
            <el-table :data="DiptableData" class="dipstyle">
              <el-table-column prop="ip" label="目的ip"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.ip}}
                </template>
              </el-table-column>
              <el-table-column prop="port" label="port"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.port}}
                </template>
              </el-table-column>
              <el-table-column prop="app" label="目的应用/负责人"  align="center" min-width="4">
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
      </tr>
    </table>
    <table v-else border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left"><b> 产品线：</b> {{aDetail.product_name}}</td>
        <td align="left"><b>应用名：</b>
          <span style="color: #8492a6; font-size: 10px">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>
          <span style="color: #8492a6; font-size: 10px">CN：</span>{{ aDetail.app_cname }}
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>需求描述：</b></div>
          <div style="float:left;">{{aDetail.needdesc}}</div>
        </td>
      </tr>
      <tr>
        <td align="left"><b> 平均消息大小：</b> {{aDetail.messagekb}} /kb</td>
        <td align="left" v-if="aDetail.message>10000 || aDetail.message==10000"><b> 消息量：</b> {{aDetail.message/10000}}万 条/天</td>
        <td align="left" v-else><b> 消息量：</b> {{aDetail.message}} 条/天</td>
      </tr>
      <tr>
        <td align="left"><b> 高峰消息量：</b> {{aDetail.high}} 条/秒</td>
        <td align="left" v-if="aDetail.is_mqcloud == 1"><b>是否使用mqcloud：</b> 是</td>
        <td align="left" v-else-if="aDetail.is_mqcloud == 0"><b>是否使用mqcloud：</b> 否</td>
      </tr>
      <tr>
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
      <tr>
        <td align="left"><b> 主题名称：</b>
          <span v-if="aDetail.topicnames">{{aDetail.topicname}}</span>
          <span v-else>{{aDetail.topicname}}-topic</span>
        </td>
        <td align="left"><b> 生产者名称：</b> {{aDetail.topicnamep || aDetail.topicname}}-topic-producer</td>
      </tr>
      <tr>
        <td align="left"><b> 消费者名称：</b> {{aDetail.topicnamec || aDetail.topicname}}-topic-consumer</td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>用途说明：</b></div>
          <div style="float:left;">{{aDetail.usedesc}}</div>
        </td>
      </tr>
      <tr>
        <td align="left"><b> 告警阈值：</b>
        <span v-if="aDetail.alarm !==''">{{aDetail.alarm}} {{aDetail.alarm_type}}</span></td>
        <td align="left"><b> 告警联系人：</b>
          <span v-for="(item,index) in aDetail.owner">
            <span v-if="index !== aDetail.owner.length-1 ">{{item}}&nbsp;</span>
            <span v-else>{{item}}</span>
          </span>
        </td>
      </tr>
      <tr v-if="DiptableData.length !== 0">
        <td colspan="2">
          <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
            <legend align="center">开通内网防火墙权限 目的IP</legend>
            <el-table :data="DiptableData" class="dipstyle">
              <el-table-column prop="ip" label="目的ip"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.ip}}
                </template>
              </el-table-column>
              <el-table-column prop="port" label="port"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.port}}
                </template>
              </el-table-column>
              <el-table-column prop="app" label="目的应用/负责人"  align="center" min-width="4">
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
      </tr>
    </table>
  </component>
</template>

<script>
  import detail from './components/detail'
  import h5detail from '../workflow_h5/h5detail'
  import {getfirewalldip} from '@/api/workflow/app_manage'
  export default {
    components: {
      detail,h5detail
    },
    data() {
      return {
        aDetail:{},
        comName:'detail',
        DiptableData:[],
        port_list:{},
        listQuery2: {
          page: 1,
          limit: 20,
          ip_list: '',
        },
      }
    },
    created() {
      this.isMobile()
    },
    methods: {
      detaildatafromchild(value){
        // console.log(value)
        this.aDetail = value
        this.aDetail.product_name = value.project_name_list[0]+'/'+value.project_name_list[1]+'/'+value.project_name_list[2]
        if ( this.aDetail.Dip ) {
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
        } else {
          this.comName = 'detail'
        }
      },
      getIPinfo(){
        // 目的ip
        this.listQuery2.ip_list=''
        var ip_list2 = []
        this.port_list = {}
        for (var i = 0; i < this.aDetail.Dip.length; i++) {
          // this.listQuery2.ip_list = this.listQuery2.ip_list + this.aDetail.Dip[i].ip
          // if (i !== this.aDetail.Dip.length-1) {
          //   this.listQuery2.ip_list = this.listQuery2.ip_list + ','
          // }
          for (let ip of this.aDetail.Dip[i].dip) {
            if (this.port_list[ip] == undefined) {
              this.port_list[ip] = this.aDetail.Dip[i].port
            } else{
              this.port_list[ip] = this.port_list[ip]+','+this.aDetail.Dip[i].port
            }
          }
          ip_list2 = ip_list2.concat(this.aDetail.Dip[i].dip)
        }
        this.listQuery2.ip_list = String(ip_list2)
        this.DiptableData =[]
        if (this.listQuery2.ip_list !== '') {
          getfirewalldip(this.listQuery2).then(response => {
            const tableData = []
            for (var i = 0; i < response.length; i++) {
              tableData.push({
                ip: response[i].ip,
                app:response[i].app.split('/')[3],
                owner:response[i].app__maintain_user,
                port:this.port_list[response[i].ip]
              })
            }
            // 合并为一个数组
            this.DiptableData = this.DiptableData.concat(tableData)
          })
        }
      },
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
