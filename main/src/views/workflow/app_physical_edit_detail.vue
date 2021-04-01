<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
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
          </a>
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
              <el-table-column prop="sys" label="系统版本"  align="center">
                <template slot-scope="scope">
                  {{scope.row.sys_type}} {{scope.row.sys_version}}
                </template>
              </el-table-column>
              <el-table-column prop="raid" label="raid"  align="center">
                <template slot-scope="scope">
                  {{scope.row.raid}}
                </template>
              </el-table-column>
              <el-table-column prop="edit" label="配置变更"  align="center">
                <template slot-scope="scope">
                  {{String(scope.row.edit)}}
                </template>
              </el-table-column>
              <el-table-column prop="desc" label="备注"  align="center">
                <template slot-scope="scope">
                  <span class="text-wrapper">{{scope.row.desc}}</span>
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
