<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="50%"/>
      <col width="50%"/>
      <tr>
        <td align="left" style="word-wrap:break-word;"><b>应用英文名：</b> {{aDetail.app_name}}</td>
        <td align="left" style="word-wrap:break-word;"><b>应用中文名：</b> {{aDetail.app_cname}}</td>
      </tr>
      <tr>
        <td align="left"><b>产品线：</b> {{aDetail.project_cname}}</td>
        <td align="left"><b>所属项目：</b> {{aDetail.pool_name}}</td>
      </tr>
      <tr>
        <td align="left"><b>应用等级：</b> {{aDetail.app_level}}</td>
        <td align="left"><b>开发语言：</b> {{aDetail.app_lang}}</td>
      </tr>
      <tr>
        <td align="left"><b>开发框架：</b> {{aDetail.app_arch}}</td>
        <td align="left"><b>应用类型：</b> {{aDetail.app_type}}</td>
      </tr>
      <tr>
        <td align="left"><b>应用负责人：</b> {{aDetail.owner}}</td>
        <td align="left"><b>运维人员：</b> {{String(aDetail.ops_user)}}</td>
      </tr>
      <tr>
        <td align="left"><b>开发维护人：</b> {{String(aDetail.maintain_user)}}</td>
        <td align="left" v-if="aDetail.is_jicheng == 1"><b>集成发布：</b> 是</td>
        <td align="left" v-else-if="aDetail.is_jicheng == 0"><b>集成发布：</b> 否</td>
      </tr>
      <tr>
        <td align="left" v-if="aDetail.is_xt == 0"><b>不接入星图原因：</b> {{aDetail.xt_reason}}</td>
        <td align="left" v-else><b>星图监控名：</b> {{aDetail.xt_name}}</td>
        <td align="left" v-if="aDetail.is_available == 1"><b>是否高可用：</b> 是</td>
        <td align="left" v-else-if="aDetail.is_available == 0"><b>是否高可用：</b> 否</td>
      </tr>
      <tr>
        <td align="left"><b>健康检查URL：</b> {{aDetail.health_url}}</td>
        <td align="left"><b>代码仓库：</b> {{aDetail.git_addr}}</td>
      </tr>
      <tr >
        <td align="left"><b>包名：</b> {{aDetail.BaoName}}</td>
        <td align="left" v-if="aDetail.git_addr"><b>编译配置路径：</b> {{aDetail.build_path}}</td>
      </tr>
      <tr>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>应用描述：</b></div>
          <div style="float:left;">{{aDetail.app_desc}}</div>
        </td>
        <td align="left" class="text-wrapper">
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
      },
      download(item){
        return this.$refs.child.download(item);
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
