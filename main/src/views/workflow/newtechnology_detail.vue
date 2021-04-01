<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left" colspan="2"><b>标题：</b> {{aDetail.edit_title}}</td>
      </tr>
      <tr>
        <td align="left"><b>参与人员：</b> {{String(aDetail.todouser)}}</td>
        <td align="left"><b>测试完成时间：</b> {{aDetail.edit_time}}</td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>技术简介：</b></div>
          <div style="float:left;">{{aDetail.introduce}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>引进原因：</b></div>
          <div style="float:left;">{{aDetail.reason}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>技术优势：</b></div>
          <div style="float:left;">{{aDetail.advantages}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>技术劣势：</b></div>
          <div style="float:left;">{{aDetail.disadvantages}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>应用场景：</b></div>
          <div style="float:left;">{{aDetail.app_touse}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>引进计划：</b></div>
          <div style="float:left;">{{aDetail.plan}}</div>
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" class="text-wrapper">
          <div style="float:left;"><b>资源投入：</b></div>
          <div style="float:left;">{{aDetail.resource}}</div>
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
