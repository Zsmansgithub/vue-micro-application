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
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>申请原因：</b></div>
          <div style="float:left;">{{aDetail.needdesc}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>客户端IP：</b></div>
          <div style="float:left;" v-for="(item,index) in aDetail.Cip">
            <span v-if="windowslist.indexOf(item)!== -1" style="color:red;">{{item}}</span>
            <span v-else>{{item}}</span>
            <span v-if="index !== aDetail.Cip.length-1">,</span>
          </div>
        </td>
        <td align="left" v-if="aDetail.time == '永久'"><b>开通时长：</b> {{aDetail.time}}</td>
        <td align="left" v-else><b>开通时长：</b> {{aDetail.time}} 截止至 {{aDetail.enddate}}</td>
      </tr>
      <tr>
        <td colspan="2" align="left">
        <div style="float:left;">
          <div style="float:left;"><b>redis：</b></div>
          <div style="float:left;">
            <span v-for="(item,index) in aDetail.redis">
              <span>{{item[0]}}</span>
              &nbsp;
              <span>{{item[1].split('(')[1].split(')')[0]}}</span>
              &nbsp;
              <span>{{item[1].split('/')[0]}}</span>
              <br v-if="index !== aDetail.redis.length-1" />
            </span>
          </div>
        </div>
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
  import {getwindowslist} from '@/api/zabbix'
  export default {
    components: {
      detail
    },
    data() {
      return {
        aDetail:{},
        windowslist:[],
      }
    },
    created() {
      getwindowslist().then(response => {
        this.windowslist = response.windows_list
      });
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
