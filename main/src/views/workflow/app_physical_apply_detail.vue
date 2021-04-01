<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="66%"/>
      <col width="34%"/>
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
        <td align="left"><b>项目编号：</b> {{aDetail.project_num}}</td>
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
      </tr>
      <tr>
        <td colspan="6" >
          <el-table :data="aDetail.configinfo" style="z-index:0">
            <el-table-column prop="env" label="环境类型"  align="center" min-width="1">
              <template slot-scope="scope">
                {{scope.row.env}}
              </template>
            </el-table-column>
            <el-table-column prop="sys" label="系统版本"  align="center" min-width="1">
              <template slot-scope="scope">
                {{scope.row.sys_type}} {{scope.row.sys_version}}
              </template>
            </el-table-column>
            <el-table-column prop="type" label="应用"  align="center" min-width="1">
              <template slot-scope="scope">
                {{scope.row.type}}
              </template>
            </el-table-column>
            <el-table-column prop="info" label="配置"  align="center" min-width="3">
              <template slot-scope="scope">
                {{scope.row.info}}
              </template>
            </el-table-column>
            <el-table-column prop="sum" label="申请数量"  align="center" min-width="1">
              <template slot-scope="scope">
                {{scope.row.sum}}
              </template>
            </el-table-column>
            <el-table-column prop="money" label="价格(元)"  align="center" min-width="1">
              <template slot-scope="scope">
                {{scope.row.money*scope.row.sum}}
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
      <tr v-if="aDetail.fileList && aDetail.fileList.length !== 0">
        <td align="left" colspan="2">
          <!-- <el-button type="primary" plain @click="download">下载全部</el-button> -->
          <div style="float:left;"><b>附件(点击下载)：</b></div>
          <div style="float:left;">
          <!-- <el-button-group v-for="item in aDetail.fileList">
            <a class="el-dropdown-link" :href="download(item)">
              <el-button type="text" style="padding: 0;">{{ item.name }} &nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </a>
          </el-button-group> -->
            <span v-for="item in aDetail.fileList">
              <a :href="download(item)" style="color:#1890FF;">{{ item.name }}&nbsp;</a>
              <!-- <el-button type="text" @click="$refs.child.showFile(item)" style="color:#909399;padding:0;">预览&nbsp;&nbsp;&nbsp;</el-button> -->
              <el-button type="text" @click="$refs.child.showFile(item)" style="color:#FFFFFF;padding:0;">预览&nbsp;&nbsp;&nbsp;</el-button>
            </span>
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
