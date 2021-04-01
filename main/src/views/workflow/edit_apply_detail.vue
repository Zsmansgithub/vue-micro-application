<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left" colspan="2"><b>标题：</b> {{aDetail.edit_title}}</td>
      </tr>
      <tr>
        <td align="left"><b>变更类型：</b> {{aDetail.edit_type}}</td>
        <td align="left"><b>变更级别：</b> {{aDetail.edit_level}}</td>
      </tr>
      <tr>
        <td align="left"><b>变更时间：</b> {{edit_time[0]}} 至 {{edit_time[1]}}</td>
        <td align="left"><b>影响范围：</b> {{aDetail.alarm}}</td>
      </tr>
      <tr>
        <td align="left"><b>实施人员：</b> {{String(aDetail.todouser)}}</td>
        <td align="left"><b>通知人员：</b> {{String(aDetail.toknowuser)}}</td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>变更原因：</b></div>
          <div style="float:left;">{{aDetail.edit_reason}}</div>
        </td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>变更内容：</b></div>
          <div style="float:left;">{{aDetail.edit_event}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>变更步骤：</b></div>
          <div style="float:left;">{{aDetail.edit_step}}</div>
        </td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>回退方案：</b></div>
          <div style="float:left;">{{aDetail.backplan}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>验证方案：</b></div>
          <div style="float:left;">{{aDetail.testplan}}</div>
        </td>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <p><b>变更应用：</b></p>
          <el-table :data="aDetail.configinfo" style="z-index:0">
            <el-table-column prop="app" label="应用名"  align="center" min-width="4">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="rowNameFilter(scope.row.app_id)">{{ scope.row.app_name }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="env" label="环境"  align="center" min-width="2">
              <template slot-scope="scope">{{scope.row.env}}</template>
            </el-table-column>
            <el-table-column prop="Sip" label="IP地址"  align="center" min-width="4">
              <template slot-scope="scope">
                {{String(scope.row.Sip)}}
              </template>
            </el-table-column>
          </el-table>
        </td>
      </tr>
      <tr v-if="aDetail.fileList && aDetail.fileList.length !== 0">
        <td align="left" colspan="2">
          <!-- <el-button type="primary" plain @click="download">下载全部</el-button> -->
          <div style="float:left;"><b>附件(点击下载)：</b></div>
          <div style="float:left;">
          <el-button-group v-for="item in aDetail.fileList">
            <!-- <el-button type="text"@click="download(item)" style="padding-bottom: 0;">{{ item.name }}</el-button> -->
            <a class="el-dropdown-link" :href="download(item)">
              <el-button type="text" style="padding: 0;">{{ item.name }} &nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </a>
          </el-button-group>
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
        edit_time:[],
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
        this.edit_time[0] = this.changedate(this.aDetail.edit_time[0])
        this.edit_time[1] = this.changedate(this.aDetail.edit_time[1])
      },
      download(item){
        return this.$refs.child.download(item);
      },
      rowNameFilter(id) {
        this.$refs.child.rowNameAPPFilter(id);
      },
      changedate(date){
        var day = new Date(date)
        var newday = day.getFullYear()+'-'+((day.getMonth()+1)<10?'0'+(day.getMonth()+1):(day.getMonth()+1))+'-'+(day.getDate()<10?'0'+day.getDate():day.getDate())
        var newtime = (day.getHours()<10?'0'+day.getHours():day.getHours())+':'+(day.getMinutes()<10?'0'+day.getMinutes():day.getMinutes())+':'+(day.getSeconds()<10?'0'+day.getSeconds():day.getSeconds())
        var newdaytime = newday + ' ' + newtime
        // console.log(newdaytime)
        return newdaytime
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
