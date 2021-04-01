<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
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
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>内网源IP：</b></div>
          <!-- <div style="float:left;" v-for="(item,index) in aDetail.Sip">
            <span v-if="index == aDetail.Sip.length-1">{{item}}</span>
            <span v-else>{{item}},</span>
          </div> -->
          <!-- 第一版本内网源IP为字符串 -->
          <div style="float:left;" v-if="typeof(aDetail.Sip) == 'string'">{{aDetail.Sip}}</div>
          <!-- 第一版本内网源IP为数组 -->
          <div style="float:left;" v-else>
            <div style="float:left;" v-for="(item,index) in aDetail.Sip">
              <span v-if="index == aDetail.Sip.length-1">{{item}}</span>
              <span v-else>{{item}},</span>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="left"><b>访问目标：</b> {{aDetail.visitweb}}</td>
        <!-- <td align="left"><b>开通时长：</b> {{aDetail.time}}</td> -->
        <td align="left" v-if="aDetail.time == '永久'"><b>开通时长：</b> {{aDetail.time}}</td>
        <td align="left" v-else><b>开通时长：</b> {{aDetail.time}} 截止至 {{aDetail.enddate}}</td>
      </tr>
      <!-- <tr v-if="aDetail.visitweb == '访问指定目标' || aDetail.time == '临时'">
        <td align="left" class="text-wrapper" v-if="aDetail.visitweb == '访问指定目标'">
          <div style="float:left;"><b>访问指定目标：</b></div>
          <div style="float:left;">{{aDetail.weburl}}</div>
        </td>
        <td v-else></td>
        <td align="left" v-if="aDetail.time == '临时'"><b>截止时间：</b> {{aDetail.enddate}}</td>
      </tr> -->
      <tr v-if="aDetail.visitweb == '访问指定目标'">
        <td align="left" class="text-wrapper" v-if="aDetail.visitweb == '访问指定目标'">
          <div style="float:left;"><b>访问指定目标：</b></div>
          <div style="float:left;">{{aDetail.weburl}}</div>
        </td>
      </tr>
      <tr v-if="aDetail.whitelist=='是'">
        <td colspan="2" >
          <b>对端有白名单：</b><br />
            <el-table :data="aDetail.configinfo" style="z-index:0">
              <el-table-column prop="client" label="客户单位"  align="center" min-width="4">
                <template slot-scope="scope">{{scope.row.client}}</template>
              </el-table-column>
              <el-table-column prop="manage" label="产品经理"  align="center" min-width="2">
                <template slot-scope="scope">{{scope.row.manage}}</template>
              </el-table-column>
              <el-table-column prop="telormail" label="联系方式"  align="center" min-width="3">
                <template slot-scope="scope">{{scope.row.telormail}}</template>
              </el-table-column>
              <el-table-column prop="url" label="对端接口"  align="center" min-width="5">
                <template slot-scope="scope">
                  <span class="text-wrapper">{{scope.row.url}}</span>
                </template>
              </el-table-column>
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
</style>
