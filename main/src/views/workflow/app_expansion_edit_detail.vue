<template>
  <component :is="comName" @detaildata="detaildatafromchild" @iptotal="iptotalfromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="66%"/>
      <col width="34%"/>
      <tr>
        <td align="left"><b> 产品线：</b> {{aDetail.product_name}}</td>
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
      </tr>
      <tr>
        <td align="left"><b>应用名：</b>
          <span style="color: #8492a6; font-size: 10px">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>(应用已有IP数量：{{ total }})
          <span style="color: #8492a6; font-size: 10px">CN：</span>{{ aDetail.app_cname }}
        </td>
      </tr>
      <tr>
        <td colspan="6" >
            <el-table :data="aDetail.configinfo" style="z-index:0">
              <el-table-column prop="ip" label="服务器IP"  align="center">
                <template slot-scope="scope">
                  {{scope.row.ip}}
                </template>
              </el-table-column>
              <el-table-column prop="old" label="原配置"  align="center">
                <template slot-scope="scope">
                  {{scope.row.old}}
                </template>
              </el-table-column>
              <el-table-column prop="newcpumem" label="新CPU / 新内存"  align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.newcpumem.length == 0"></span>
                  <span v-else>
                    {{scope.row.newcpumem[0]}} / {{scope.row.newcpumem[1]}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="newdisk" label="新磁盘容量(扩容后容量)"  align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.newdisk !== undefined">{{scope.row.newdisk}}G</span>
                  <span v-else></span>
                </template>
              </el-table-column>
            </el-table>
        </td>
      </tr>
      <tr>
        <td align="left"colspan="2" class="text-wrapper">
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
        total:0,
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
      iptotalfromchild(value){
        this.total = value
      },
      download(item){
        return this.$refs.child.download(item);
      },
      rowNameFilter(id) {
        this.$refs.child.rowNameFilter(id);
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
