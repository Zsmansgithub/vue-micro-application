<template>
  <detail @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left"><b>产品线：</b> {{aDetail.product_name}}</td>
        <td align="left"><b>应用名：</b>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>
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
  </detail>
</template>

<script>
  import detail from './components/detail'
  export default {
    components: {
      detail
    },
    data() {
      return {
        aDetail:{},
      }
    },
    created() {
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
    }
  }
</script>

<style lang="scss" scoped>
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>
