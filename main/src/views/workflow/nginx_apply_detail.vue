<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left" colspan="2"><b>Nginx类型：</b>
          <span v-if="aDetail.ntype == '0'">负载均衡型</span>
          <span v-else>静态服务型</span>
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
        <td align="left" colspan="2">
          <div style="float:left;"><b>应用IP：</b></div>
          <div style="float:left;overflow-wrap: break-word;color:darkgray;">{{String(aDetail.tableData)}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>需求描述：</b></div>
          <div style="float:left;">{{aDetail.needdesc}}</div>
        </td>
      </tr>
      <tr>
        <td align="left"><b>项目编号：</b> {{aDetail.project_num}}</td>
        <td align="left"><b>资源类型：</b> {{aDetail.type}}</td>
      </tr>
      <tr>
        <td align="left"><b>环境：</b> {{aDetail.env}}</td>
        <td align="left"><b>类型：</b> {{aDetail.htype}}</td>
      </tr>
      <tr v-if="aDetail.ntype == '0'">
        <td align="left"><b>QPS：</b> {{aDetail.qps}}</td>
        <td align="left"><b>负载策略：</b> {{aDetail.network_rule}}</td>
      </tr>
      <tr>
        <td align="left"><b>域名：</b> {{aDetail.Domain_name}}</td>
        <td align="left"><b>映射端口：</b> {{aDetail.port}}</td>
      </tr>
      <tr v-if="aDetail.ntype == '1'">
        <td align="left"><b>是否走cdn：</b>
          <span v-if="aDetail.is_cdn == '1'">是</span>
          <span v-else>否</span>
        </td>
        <td align="left"><b>location：</b> {{aDetail.location}}</td>
      </tr>
      <tr v-if="aDetail.ntype == '0'">
        <td colspan="2">
          <fieldset v-for="(item,index) in aDetail.slbconfiginfo">
            <legend style="color:darkgray;">策略{{index+1}}</legend>
            <el-row>
              <el-col align="left" :span="12" class="spanpadding"><b>location：</b>{{item.location}}</el-col>
              <el-col align="left" :span="12" class="spanpadding"><b>健康检查URL：</b>{{item.check_url}}</el-col>
            </el-row>
            <el-row>
              <el-col align="left" :span="12" class="spanpadding"><b>应用名：</b>
                {{item.project_name_list[0]}}/{{item.project_name_list[1]}}/{{item.project_name_list[2]}}/
                <span style="color: #8492a6; font-size: 10px">EN：</span>
                <a style="color: #1890ff" @click="rowNameFilter(item.app_id)">{{ item.app_name }}</a>
                <span style="color: #8492a6; font-size: 10px">CN：</span>{{ item.app_cname }}
              </el-col>
              <el-col align="left" :span="12" class="spanpadding"><b>备注描述：</b>{{item.desc}}</el-col>
            </el-row>
            <el-row>
              <el-col align="left" :span="24" class="spanpadding">
                <el-table :data="item.slbconf">
                  <el-table-column prop="ip" label="服务器IP"  align="center"></el-table-column>
                  <el-table-column prop="port" label="端口"  align="center"></el-table-column>
                  <el-table-column prop="weight" label="权重"  align="center"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </fieldset>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>特殊类型说明：</b></div>
          <div style="float:left;">{{aDetail.elsetype}}</div>
        </td>
      </tr>
      <tr>
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
        <td align="left" class="text-wrapper">
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
        this.aDetail.product_name = value.project_name_list[0]+'/'+value.project_name_list[1]+'/'+value.project_name_list[2]
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
  .spanpadding{padding:10px;}
</style>
