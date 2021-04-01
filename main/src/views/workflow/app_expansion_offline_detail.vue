<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left" class="text-wrapper" colspan="2">
          <div style="float:left;"><b>下线原因：</b></div>
          <div style="float:left;">{{aDetail.reason}}</div>
        </td>
      </tr>
      <tr>
        <td align="left"><b>应用停止时间：</b> {{aDetail.expecteddate?aDetail.expecteddate:aDetail.appstopdate}}</td>
        <td align="left"><b>机器停机时间：</b> {{aDetail.expecteddate?sevendate:aDetail.shutdowndate}}</td>
      </tr>
      <tr>
        <td colspan="2">
          <div style="float:left;"><b>下线信息：</b></div>
          <el-table :data="aDetail.configinfo" style="z-index:0">
            <el-table-column prop="project_name_list" label="产品线/项目编号"  align="center" min-width="8">
              <template slot-scope="scope">
                <div style="line-height: 16px;">
                  <span style="display: block;">{{scope.row.project_name_list[0]}}/{{scope.row.project_name_list[1]}}/{{scope.row.project_name_list[2]}}</span>
                  <div style="color: #8492a6; font-size: 10px">{{ scope.row.project_num }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="app_name" label="应用名"  align="center" min-width="4">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="rowNameFilter(scope.row.app_id)">
                  {{ scope.row.app_name }}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="env" label="环境"  align="center" min-width="2">
              <template slot-scope="scope">
                {{scope.row.env}}
              </template>
            </el-table-column>
            <el-table-column prop="Sip" label="IP地址"  align="center" min-width="4">
              <template slot-scope="scope">
                <div style="float:left;" v-for="(item,index) in scope.row.Sip">
                  <span v-if="index == scope.row.Sip.length-1">{{item}}</span>
                  <span v-else>{{item}},</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </td>
      </tr>
      <tr v-if="aDetail.dbinfo">
        <td align="left"><b>数据库信息：</b>
          <div v-for="(item,index) in aDetail.dbinfo">
            <span>{{item[0]}}</span>
            &nbsp;
            <span>{{item[1].split('(')[0]}}</span>
            &nbsp;
            <span>{{item[1].split('(')[1].split(')')[0]}}</span>
            <br v-if="index !== aDetail.dbinfo.length-1" />
          </div>
        </td>
        <td align="left" class="text-wrapper" v-if="!aDetail.expecteddate">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
      <tr v-if="aDetail.expecteddate">
        <td align="left" class="text-wrapper" colspan="2">
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
        sevendate:'',
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
        if (this.aDetail.expecteddate) {
          var nexttime = new Date(new Date(this.aDetail.expecteddate).getTime()+8.64e7*7)
          this.sevendate = nexttime.getFullYear()+'-'+((nexttime.getMonth()+1)<10?'0'+(nexttime.getMonth()+1):(nexttime.getMonth()+1))+'-'+(nexttime.getDate()<10?'0'+nexttime.getDate():nexttime.getDate())
        }
      },
      download(item){
        return this.$refs.child.download(item);
      },
      rowNameFilter(id) {
        this.$refs.child.rowNameFilter2(id);
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
