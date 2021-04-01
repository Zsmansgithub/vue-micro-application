<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left"><b>标题：</b> {{aDetail.edit_title}}</td>
        <td align="left" v-if="aDetail.is_fupan == 1"><b>是否复盘：</b> 是</td>
        <td align="left" v-else-if="aDetail.is_fupan == 0"><b>是否复盘：</b> 否</td>
      </tr>
      <tr>
        <td align="left"><b>部门：</b> {{aDetail.edit_type}}</td>
        <td align="left"><b>项目类型：</b> {{aDetail.pool_type}}</td>
      </tr>
      <tr>
        <td align="left"><b>项目编号：</b> {{aDetail.project_num}}</td>
        <td align="left" v-if="aDetail.is_fabu == 1"><b>是否发布导致：</b> 是</td>
        <td align="left" v-else-if="aDetail.is_fabu == 0"><b>是否发布导致：</b> 否</td>
      </tr>
      <tr>
        <td align="left"><b>措施执行方：</b> {{String(aDetail.improvement_user)}}</td>
        <td align="left"><b>完成时间：</b> {{aDetail.edit_time}}</td>
      </tr>
      <tr>
        <td align="left"><b>验收人：</b> {{String(aDetail.check_user)}}</td>
        <td align="left"><b>验收时间：</b> {{aDetail.check_time}}</td>
      </tr>
      <tr>
        <td align="left" colspan="2"><b>责任人：</b>
          <span v-for="(item,index) in aDetail.responsibility">{{item.person}}
            <span style="font-size:12px;color:#8492a6">(权重{{item.weight}})</span>
            <span v-if="index !== aDetail.responsibility.length-1">,</span>
          </span>
        </td>
        <!-- <td>
          <p><b>责任人：</b></p>
          <el-table :data="aDetail.responsibility" style="z-index:0">
            <el-table-column prop="person" label="责任人"  align="center" min-width="5">
              <template slot-scope="scope">{{scope.row.person}}</template>
            </el-table-column>
            <el-table-column prop="weight" label="权重"  align="center" min-width="5">
              <template slot-scope="scope">{{scope.row.weight}}</template>
            </el-table-column>
          </el-table>
        </td> -->
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>事件描述：</b></div>
          <div style="float:left;">{{aDetail.event}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>原因分析：</b></div>
          <div style="float:left;">{{aDetail.reason}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>解决方法：</b></div>
          <div style="float:left;">{{aDetail.way}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>改进措施：</b></div>
          <div style="float:left;">{{aDetail.improvement}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
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
      // rowNameFilter(id) {
      //   this.$refs.child.rowNameAPPFilter(id);
      // },
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
