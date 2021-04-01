<template>
  <component :is="comName" @detaildata="detaildatafromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="100%" />
      <fieldset v-for="(item,index) in aDetail.configinfo">
        <legend style="color:darkgray;">产品线{{index+1}}</legend>
        <el-row>
          <el-col align="left" :span="6" class="spanpadding"><b>组织CN：</b>{{item.levelone}}</el-col>
          <el-col align="left" :span="6" class="spanpadding"><b>板块CN：</b>{{item.leveltwo}}</el-col>
          <el-col align="left" :span="6" class="spanpadding"><b>模块CN：</b>{{item.levelthree}}</el-col>
          <el-col align="left" :span="6" class="spanpadding"><b>子模块CN：</b>{{item.levelfour}}</el-col>
        </el-row>
        <el-row>
          <el-col align="left" :span="6" class="spanpadding"><b>组织EN：</b>{{item.levelone_EN}}</el-col>
          <el-col align="left" :span="6" class="spanpadding"><b>板块EN：</b>{{item.leveltwo_EN}}</el-col>
          <el-col align="left" :span="6" class="spanpadding"><b>模块EN：</b>{{item.levelthree_EN}}</el-col>
          <el-col align="left" :span="6" class="spanpadding"><b>子模块EN：</b>{{item.levelfour_EN}}</el-col>
        </el-row>
        <el-row>
          <el-col align="left" :span="6" class="spanpadding"><b>仓库名称：</b>{{item.git_name}}</el-col>
          <el-col align="left" :span="12" class="spanpadding" style="overflow-wrap:break-word;"><b>仓库地址：</b>{{item.git_addr}}</el-col>
          <el-col align="left" :span="6" class="spanpadding"><b>仓库描述：</b>{{item.git_desc}}</el-col>
        </el-row>
        <el-row>
          <el-col align="left" :span="6" class="spanpadding"><b>负责人：</b>{{item.user}}</el-col>
          <el-col align="left" :span="18" class="spanpadding"><b>备注描述：</b>{{item.desc}}</el-col>
        </el-row>
      </fieldset>
      <tr>
        <td align="left" class="text-wrapper">
          <div style="float:left;"><b>备注描述：</b></div>
          <div style="float:left;">{{aDetail.desc}}</div>
        </td>
      </tr>
    </table>
    </div>
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
        this.aDetail = value
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
  fieldset {
    padding: 3px;
    margin-bottom: 10px;
    border: 1px solid #e6ebf5;
    background: #fff;
  }
  .spanpadding{padding:10px;}
</style>
