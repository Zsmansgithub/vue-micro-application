<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td colspan="2">
          <p><b>应用IP：</b></p>
          <el-table :data="aDetail.siptable" style="z-index:0">
            </el-table-column>
            <el-table-column prop="app" label="应用名"  align="center" min-width="4">
              <template slot-scope="scope">
                {{scope.row.project_name_list[0]}}/{{scope.row.project_name_list[1]}}/{{scope.row.project_name_list[2]}}/
                <a style="color: #1890ff" @click="rowNameFilter(scope.row.app_id)">{{ scope.row.app_name }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="env" label="环境"  align="center" min-width="2">
              <template slot-scope="scope">{{scope.row.env}}</template>
            </el-table-column>
            <el-table-column prop="Sip" label="应用IP"  align="center" min-width="4">
              <template slot-scope="scope">
                {{String(scope.row.Sip)}}
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
        this.aDetail.siptable = this.aDetail.siptable.filter(v => v.Sip.length !== 0)
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
  .dipstyle::before {
    background-color: #FFFFFF;
  }
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>
