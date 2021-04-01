<template>
  <div>
    <component :is="comName" @detaildata="detaildatafromchild" ref="child">
      <table v-if="aDetail" border="0" cellspacing="0" cellpadding="10px" width="100%" style="font-size: 15px; padding: 5px;table-layout:fixed">
        <col width="50%"/>
        <col width="50%"/>
        <tr>
          <td align="left"><b>访问时间范围：</b> {{aDetail.timeRange}}</td>
          <td align="left"><b>限制行数：</b> <span>{{aDetail.limit_num}}</span></td>
        </tr>
        <tr>
          <td align="left" colspan="2"><b>数据库：</b>
            <el-table :data="aDetail.dbs">
              <el-table-column label="数据库" align="center" min-width="10">
                <template slot-scope="prop">
                  {{`${prop.row.db[0]}/${prop.row.db[1]}`}}
                </template>
              </el-table-column>
              <el-table-column label="表名" align="center" min-width="10">
                <template slot-scope="prop">
                  {{prop.row.table}}
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
      </table>
    </component>
  </div>
</template>
<script>
  import detail from './components/detail';
  import h5detail from '../workflow_h5/h5detail';
  export default {
    components: {
      detail,
      h5detail
    },
    computed: {
      node_handle() {
        return this.$route.params.detailData && this.$route.params.detailData.node_handle
      }
    },
    data () {
      return {
        aDetail: undefined,
        comName:'detail',
        defText: '-'
      }
    },
    created() {
      this.isMobile()
    },
    methods:{
      detaildatafromchild(value){
        this.aDetail = value;
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
</style>
