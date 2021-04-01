<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
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
        <td align="left"><b>项目编号：</b> {{aDetail.project_num}}</td>
        <td align="left"><b>资源类型：</b> {{aDetail.type}}</td>
      </tr>
      <!-- <tr>
        <td align="left"><b>ES版本：</b> {{aDetail.es}}</td>
        <td align="left"><b>申请数量：</b> {{aDetail.sum}}</td>
      </tr> -->
      <tr>
        <td align="left"><b>QPS：</b> {{aDetail.qps}}</td>
        <td align="left"><b>TPS：</b> {{aDetail.tps}}</td>
      </tr>
      <tr>
        <td align="left"><b>数据保留周期：</b> {{aDetail.datadate}}</td>
        <td align="left"><b>报文大小：</b> {{aDetail.message}}</td>
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
</style>
