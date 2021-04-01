<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left"><b> 产品线：</b> {{aDetail.product_name}}</td>
        <td align="left"><b>应用名：</b>
          <span style="color: #8492a6; font-size: 10px" v-if="aDetail.app_name">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>
          <span style="color: #8492a6; font-size: 10px" v-if="aDetail.app_cname">CN：</span>{{ aDetail.app_cname }}
        </td>
      </tr>
      <tr v-if="aDetail.app_name == ''">
        <td align="left"><b> 应用负责人：</b> {{aDetail.appowner}}</td>
        <td align="left" v-if="aDetail.alreadyhave == 1"><b> 应用别名：</b> {{aDetail.app_anothername}}</td>
      </tr>
      <tr v-else>
        <td align="left" v-if="aDetail.alreadyhave == 1"><b> 应用别名：</b> {{aDetail.app_anothername}}</td>
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
        <td align="left"><b> 环境：</b> {{aDetail.env}}</td>
        <td align="left"><b> 存储种类：</b> {{aDetail.redis}}</td>
      </tr>
      <tr>
        <td align="left"><b> Redis类型：</b> {{aDetail.redistype}}</td>
        <td align="left"><b> 内存总量：</b> {{aDetail.mem}}G</td>
      </tr>
      <tr>
        <td align="left"><b> 预估条目数量：</b> {{aDetail.number}}</td>
        <td align="left"><b> 预估QPS：</b> {{aDetail.qps}}</td>
      </tr>
      <tr>
        <td align="left"><b> 报警联系人：</b>
          <span v-for="(item,index) in aDetail.owner">
            <span v-if="index !== aDetail.owner.length-1 ">{{item}}&nbsp;</span>
            <span v-else>{{item}}</span>
          </span>
        </td>
        <td align="left"><b> 影响范围：</b> {{aDetail.alarm}}</td>
      </tr>
      <tr>
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
      <!-- <tr>
        <td align="left"><b> 是否需要持久化：</b> {{aDetail.persistent}}</td>
        <td align="left"><b> 是否需要热备：</b> {{aDetail.hot}}</td>
      </tr> -->
      <!-- <tr>
        <td align="left"><b> 内存报警阀值：</b> {{aDetail.memalarm}}</td>
        <td align="left"><b> 客户端连接数报警阀值：</b> {{aDetail.clientalarm}}</td>
      </tr> -->
      <!-- <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr> -->
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
        if (this.aDetail.project_name_list.length !== 4) {
          this.aDetail.product_name = String(this.aDetail.project_name_list).replace(new RegExp( ',' , "g" ) , '/')
          this.aDetail.app_name = ''
        } else {
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
