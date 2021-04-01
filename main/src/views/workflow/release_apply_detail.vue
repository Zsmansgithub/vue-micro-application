<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td colspan="2" align="left"><b>申请类型：</b>
          <span v-if="aDetail.steplinestatus == '0'">应用发布</span>
          <span v-if="aDetail.steplinestatus == '1'">静态发布</span>
        </td>
      </tr>
      <tr>
        <td align="left"><b>发布类型：</b> {{aDetail.release_type}}</td>
        <td align="left"><b>版本名称：</b> {{aDetail.version}}</td>
      </tr>
      <tr v-for="(item,index) in aDetail.configinfo">
        <td colspan="2" align="left"><b>应用名{{index+1}}：</b>
          {{item.project_name_list[0]+'/'+item.project_name_list[1]+'/'+item.project_name_list[2]+'/'}}
          <span style="color: #8492a6; font-size: 10px">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(item.app_id)">
            {{ item.app_name }}
          </a>
          <span style="color: #8492a6; font-size: 10px">CN：</span>{{ item.app_cname }}
          <span v-if="aDetail.steplinestatus == '0' && item.app_type"><span style="color: #8492a6; font-size: 10px">AppType：</span>{{item.app_type}}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" align="left" class="text-wrapper">
          <div style="float:left;"><b>需求描述：</b></div>
          <div style="float:left;">{{aDetail.needdesc}}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" align="left" class="text-wrapper">
          <div style="float:left;"><b>风险说明：</b></div>
          <div style="float:left;">{{aDetail.dangerdesc}}</div>
        </td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '1'">
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '0'">
        <td align="left"><b>是否分批：</b>
          <span v-if="aDetail.is_fenpi == '1'">是</span>
          <span v-else>否</span>
        </td>
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '0' && aDetail.is_fenpi == '1'">
        <td align="left"><b>分批时间：</b>{{aDetail.fenpidate}}</td>
        <td align="left"><b>分批比例：</b> {{aDetail.fenpipercent + '%'}}</td>
      </tr>
      <tr v-if="aDetail.steplinestatus == '0'">
        <td align="left"><b>是否配置变更：</b>
          <span v-if="aDetail.conf_edit == '1'">是</span>
          <span v-else>否</span>
        </td>
        <td align="left"><b>是否sql变更：</b>
          <span v-if="aDetail.sql_edit == '1'">是</span>
          <span v-else>否</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
      <!-- 上传包(应该不需要，会直接上传到机器) 选择包(日期 包名) -->
      <tr>
        <td colspan="2" align="left">
          <div style="float:left;"><b>选择包名称：</b></div>
          <div style="float:left;">{{aDetail.BaoDate}}&nbsp;<i class="el-icon-right"></i>&nbsp;</div>
          <div style="float:left;" >
            <span v-for="(BN,Bindex) in aDetail.BaoName">{{BN}}<br v-if="Bindex != aDetail.BaoName.length - 1" /></span>
          </div>
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
