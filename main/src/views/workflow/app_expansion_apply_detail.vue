<template>
  <component :is="comName" @detaildata="detaildatafromchild" @iptotal="iptotalfromchild" ref="child">
    <table border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
      <col width="66%"/>
      <col width="34%"/>
      <tr>
        <td align="left"><b> 产品线：</b> {{aDetail.product_name?aDetail.product_name:aDetail.project_cname}}</td>
        <td align="left"><b>应用名：</b>
          <span style="color: #8492a6; font-size: 10px">EN：</span>
          <a style="color: #1890ff" @click="rowNameFilter(aDetail.app_id)">
            {{ aDetail.app_name }}
          </a>(应用已有IP数量：{{ total }})
          <span style="color: #8492a6; font-size: 10px">CN：</span>{{ aDetail.app_cname }}
        </td>
      </tr>
      <tr>
        <td align="left"><b>项目编号：</b> {{aDetail.project_num}}</td>
        <td align="left"><b>期望时间：</b> {{aDetail.expecteddate}}</td>
      </tr>
      <tr>
        <td colspan="2" >
            <el-table :data="aDetail.configinfo" style="z-index:0">
              <el-table-column prop="env" label="环境类型"  align="center">
                <template slot-scope="scope">
                  {{scope.row.env}}
                </template>
              </el-table-column>
              <el-table-column prop="cpumem" label="cpu/内存"  align="center">
                <template slot-scope="scope">
                  {{scope.row.cpumem[0]}}/{{scope.row.cpumem[1]}}
                </template>
              </el-table-column>
              <el-table-column prop="disk" label="硬盘容量"  align="center">
                <template slot-scope="scope">
                  {{scope.row.disk}}
                </template>
              </el-table-column>
              <el-table-column prop="sys" label="系统版本"  align="center">
                <template slot-scope="scope">
                  {{scope.row.sys_type}} {{scope.row.sys_version}}
                </template>
              </el-table-column>
              <el-table-column prop="sum" label="申请数量"  align="center">
                <template slot-scope="scope">
                  {{scope.row.sum}}
                </template>
              </el-table-column>
            </el-table>
        </td>
      </tr>
      <tr v-if="DiptableData.length !== 0">
        <td colspan="2">
          <fieldset style="padding: 3px;margin-top: 5px;border: 1px solid #dfe6ec;background: #fff;min-width: 100%;">
            <legend align="center"><b>开通内网防火墙权限</b></legend>
            <el-table :data="DiptableData" class="dipstyle" :span-method="cellMerge">
              <el-table-column prop="esmqname" label="名称/集群类型"  align="center" min-width="2">
                <template slot-scope="scope">
                  <div style="line-height: 16px;">
                    <span style="display: block;" v-if="scope.row.cluster_name">{{scope.row.cluster_name}}</span>
                    <span style="display: block;" v-else>
                      <span v-if="scope.row.status==8">{{findRedisAppName(scope.row.esmqname)}}</span>
                      <span v-else>{{scope.row.esmqname}}</span>
                    </span>
                    <div style="color: #8492a6; font-size: 10px">
                      <span v-if="scope.row.cluster_type">{{scope.row.cluster_type}}</span>
                      <span v-else>
                        <span v-if="scope.row.status==3">ES</span>
                        <span v-if="scope.row.status==4">MQ</span>
                        <span v-if="scope.row.status==5">mysql</span>
                        <span v-if="scope.row.status==6">oracle</span>
                        <span v-if="scope.row.status==7">mongodb</span>
                        <span v-if="scope.row.status==8">redis</span>
                        <span v-if="scope.row.apptype">应用类型为
                          <span v-if="scope.row.apptype=='ES'||scope.row.apptype=='RocketMQ'||scope.row.apptype=='MySQL'||
                          scope.row.apptype=='Oracle'||scope.row.apptype=='Redis'||scope.row.apptype=='MongoDB'" style="color:red;">
                          {{scope.row.apptype}} 请通过集群添加</span>
                          <span v-else>{{scope.row.apptype}}</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="ip" label="目的域名或ip"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.ip}}
                </template>
              </el-table-column>
              <el-table-column prop="port" label="port"  align="center" min-width="2">
                <template slot-scope="scope">
                  {{scope.row.port}}
                </template>
              </el-table-column>
            </el-table>
          </fieldset>
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
        DiptableData:[],
        port_list:{},
        listQuery2: {
          page: 1,
          limit: 20,
          ip_list: '',
        },
        total:0,
        spanArr:[],
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
        if (value.project_name_list) {
          this.aDetail.product_name = value.project_name_list[0]+'/'+value.project_name_list[1]+'/'+value.project_name_list[2]
        }
        if ( this.aDetail.Domain && this.aDetail.Domain!=='' ) {
          this.getIPinfo()
        }
        if ( this.aDetail.dtable ) {
          this.aDetail.dtable = this.aDetail.dtable.filter(v => v.ip !== '')
          this.DiptableData = this.aDetail.dtable
          this.getrowspan()  //合并表格
        }
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
      getIPinfo(){
        // 目的ip
        const tableData = []
        tableData.push({
          ip: this.aDetail.Domain,
          port:this.aDetail.port
        })
        // 合并为一个数组
        this.DiptableData = this.DiptableData.concat(tableData)
      },
      //redis产品线+集群名  只显示集群名
      findRedisAppName(redisLineAndApp){
        var index = redisLineAndApp.indexOf('_')
        return redisLineAndApp.slice(index+1)
      },
      //集群名称合并
      getrowspan(){
        //处理数据
        this.spanArr = []
        for (var i = 0; i < this.DiptableData.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0
          } else {
          // 判断当前元素与上一个元素是否相同   存在cluster_name才合并
            if (this.DiptableData[i].cluster_name && this.DiptableData[i].cluster_name === this.DiptableData[i - 1].cluster_name && this.DiptableData[i].cluster_type === this.DiptableData[i - 1].cluster_type) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
      },
      //合并表格
      cellMerge({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
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
