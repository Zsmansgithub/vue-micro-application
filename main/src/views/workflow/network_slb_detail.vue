<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table v-if="aDetail.steplinestatus" border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left"><b>申请类型：</b>
          <span v-if="aDetail.steplinestatus =='0'">内网-新增负载</span>
          <span v-if="aDetail.steplinestatus =='1'">内网-变更已有负载</span>
        </td>
      </tr>
      <tr>
        <td align="left"><b>产品线：</b> {{aDetail.product_name}}</td>
        <td align="left"><b>应用名：</b>
          <span style="color: #8492a6; font-size: 10px">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>
          <span style="color: #8492a6; font-size: 10px">CN：</span>{{ aDetail.app_cname }}
        </td>
      </tr>
      <tr>
        <td align="left"><b>环境：</b> {{aDetail.env}}</td>
        <td align="left" v-if="aDetail.steplinestatus == '0'"><b>负载策略：</b> {{aDetail.network_rule}}</td>
        <td align="left" v-if="aDetail.steplinestatus == '1'" class="text-wrapper">
          <div style="float:left;"><b>负载信息：</b></div>
          <div style="float:left;">{{aDetail.slbinfo}}</div>
        </td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '0'">
        <td align="left"><b>类型：</b> {{aDetail.type}}</td>
        <td align="left"><b>会话保持：</b> {{aDetail.session}}</td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '0' && aDetail.type!=='TCP'">
        <td align="left" v-if="aDetail.is_Sip == 1"><b>透传源地址：</b> 是</td>
        <td align="left" v-else-if="aDetail.is_Sip == 0"><b>透传源地址：</b> 否</td>
        <td align="left"><b>健康检查URL：</b> {{aDetail.check_httpurl}}</td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '0'">
        <td align="left" v-if="aDetail.is_forever == 1"><b>开通时长：</b> 永久</td>
        <td align="left" v-else-if="aDetail.is_forever == 0"><b>开通时长：</b> 临时 截止至 {{aDetail.enddate}}</td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '0'">
        <td align="left"><b>域名：</b> {{aDetail.Domain_name}}</td>
        <td align="left"><b>端口：</b> {{aDetail.port}}</td>
      </tr>
      <tr>
        <td colspan="2" >
            <el-table :data="aDetail.configinfo">
              <el-table-column prop="ip" label="服务器IP"  align="center"></el-table-column>
              <el-table-column prop="port" label="端口"  align="center"></el-table-column>
              <el-table-column prop="weight" label="权重"  align="center"></el-table-column>
            </el-table>
        </td>
      </tr>
      <tr>
        <td colspan="2" align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
    </table>
    <table v-else border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left"><b>产品线：</b> {{aDetail.product_name?aDetail.product_name:aDetail.project_cname}}</td>
        <td align="left"><b>应用名：</b>
          <span style="color: #8492a6; font-size: 10px">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>
          <span style="color: #8492a6; font-size: 10px">CN：</span>{{ aDetail.app_cname }}
        </td>
      </tr>
      <tr>
        <td align="left"><b>环境：</b> {{aDetail.env}}</td>
        <td align="left" v-if="aDetail.network == '公网'">
          <div style="float:left;"><b>网络类型：</b></div>
          <div style="float:left;color: red;">{{aDetail.network}}</div>
        </td>
        <td align="left" v-else><b>网络类型：</b> {{aDetail.network}}</td>
      </tr>
      <tr>
        <td align="left"><b>负载策略：</b> {{aDetail.network_rule}}</td>
        <td align="left"><b>会话保持：</b> {{aDetail.session}}</td>
      </tr>
      <tr>
        <td align="left"><b>是否是web应用：</b> {{aDetail.web}}</td>
        <td align="left" style="word-wrap:break-word;"><b>应用访问路径：</b> {{aDetail.url}}</td>
      </tr>
      <tr v-if="aDetail.web == '是'">
        <td align="left"><b>客户端源地址：</b> {{aDetail.Source_Address}}</td>
        <td align="left"></td>
      </tr>
      <tr>
        <td align="left"><b>健康检查策略：</b> {{aDetail.health}}</td>
        <!-- <td align="left"><b>开通时长：</b> {{aDetail.time}}</td> -->
        <td align="left" v-if="aDetail.time == '永久'"><b>开通时长：</b> {{aDetail.time}}</td>
        <td align="left" v-else><b>开通时长：</b> {{aDetail.time}} 截止至 {{aDetail.enddate}}</td>
      </tr>
      <!-- <tr v-if="aDetail.health == '7层' || aDetail.time == '临时'">
        <td align="left" v-if="aDetail.health == '7层'" style="word-wrap:break-word;"><b>检查url：</b> {{aDetail.check_name}}</td>
        <td align="left" v-else></td>
        <td align="left" v-if="aDetail.time == '临时'"><b>截止时间：</b> {{aDetail.enddate}}</td>
      </tr> -->
      <tr v-if="aDetail.health == '7层'">
        <td align="left" v-if="aDetail.health == '7层'" style="word-wrap:break-word;"><b>检查url：</b> {{aDetail.check_name}}</td>
      </tr>
      <tr>
        <td align="left"><b>域名：</b> {{aDetail.Domain_name}}</td>
        <td align="left"><b>端口：</b> {{aDetail.port}}</td>
      </tr>
      <tr>
        <td colspan="2" >
            <el-table :data="aDetail.configinfo">
              <el-table-column prop="ip" label="服务器IP"  align="center"></el-table-column>
              <el-table-column prop="port" label="端口"  align="center"></el-table-column>
              <el-table-column prop="weight" label="权重"  align="center"></el-table-column>
            </el-table>
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
  export default {
    components: {
      detail,h5detail
    },
    data() {
      return {
        aDetail:{},
        comName:'detail',
      }
    },
    created() {
      this.isMobile()
    },
    methods: {
      detaildatafromchild(value){
        // console.log(value)
        this.aDetail = value
        if (value.project_name_list) {
          this.aDetail.product_name = value.project_name_list[0]+'/'+value.project_name_list[1]+'/'+value.project_name_list[2]
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>
