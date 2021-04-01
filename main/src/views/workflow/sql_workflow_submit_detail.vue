<template>
  <div>
    <component :is="comName" @detaildata="detaildatafromchild" ref="child">
      <table border="0" cellspacing="0" cellpadding="10px" width="100%"
        style="font-size: 15px; padding: 5px;table-layout:fixed">
        <col width="50%" />
        <col width="50%" />
        <tr>
          <td align="left"><b>目标实例：</b> {{aDetail.instance_name}}</td>
          <td align="left"><b>数据库：</b> {{aDetail.db_name}}</td>
        </tr>
        <tr>
          <td align="left"><b>组：</b> {{aDetail.group_name}}</td>
          <td align="left"><b>可执行时间范围：</b>
            <template v-if="workflow_detail && workflow_detail.run_date_start && workflow_detail.run_date_end">
              {{ workflow_detail.run_date_start | parseTime('{y}-{m}-{d} {h}:{i}')}} - {{ workflow_detail.run_date_end |
              parseTime('{y}-{m}-{d} {h}:{i}')}}
            </template>
            <template v-else>{{textDef}}</template>
          </td>
        </tr>
        <tr>
          <td align="left"><b>结束时间：</b> {{workflow_detail.finish_time || textDef}}</td>
          <td align="left"><b>备份：</b> {{aDetail.is_backup ? '是' : '否'}}</td>
        </tr>
        <tr>
          <td align="left">
            <b>sql审核id：</b>
            <span>{{workflow_detail.pk}}</span>
            <el-link v-show="workflow_detail.pk" :underline="false" @click="showDetail" type="primary"
              style="padding-left: 8px;">详情</el-link>
          </td>
          <td align="left">
            <b>当前状态：</b>
            <span
              :style="{ color: ['workflow_finish', 'workflow_finish_manual'].includes(workflow_detail.status) ? '#67C23A' : '#F56C6C' }">{{workflow_detail.get_status_display}}</span>
            <el-link :underline="false" @click="getSqlWorkflow" type="primary" style="padding-left: 8px;">刷新<i
                v-show="isGetDetail" class="el-icon-loading
              "></i></el-link>
          </td>
        </tr>
        <tr>
          <td align="left"><b>类型：</b> {{workflow_detail.get_syntax_type_display}}</td>
        </tr>
        <tr>
          <td align="left"><b>研发风险自评：</b> {{aDetail.remarks}}</td>
        </tr>
      </table>
    </component>
    <el-dialog title="sql审核详情" width="80%" :visible.sync="dialog">
      <sqlsha1 :detail_list="detail_list"></sqlsha1>
      <div style="margin-top: 20px;text-align: right;">
        <el-button @click="copySQL" type='primary'>复制SQL</el-button>
        <el-button @click="dialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import detail from './components/detail';
  import h5detail from '../workflow_h5/h5detail';
  import { getDetailWorkflow, getDetailContent } from '@/api/archery/sql_workflow';
  import sqlsha1 from "@/views/archery/components/sqlsha1.vue";
  import handleClipboard from '@/utils/clipboard';
  export default {
    components: {
      detail,
      h5detail,
      sqlsha1
    },
    data() {
      return {
        aDetail: {},
        comName: 'detail',
        sql_workflow_detail: {},
        workflow_detail: {},
        detail_list: [],
        textDef: '--',
        isGetDetail: false,
        dialog: false
      }
    },
    created() {
      this.isMobile()
    },
    methods: {
      detaildatafromchild(value) {
        this.aDetail = value;
        this.getSqlWorkflow();
      },
      getSqlWorkflow() {
        if (this.$route.params.detailData) {
          this.isGetDetail = true;
          getDetailWorkflow({ uuid: this.$route.params.detailData.uuid })
            .then(res => {
              this.sql_workflow_detail = res;
              this.workflow_detail = res.workflow_detail;
              this.isGetDetail = false;
            })
        }
      },
      showDetail() {
        getDetailContent({ workflow_id: this.workflow_detail.pk })
          .then(res => {
            this.dialog = true;
            this.detail_list = res.rows;
          })
      },
      isMobile() {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
          this.comName = 'h5detail'
        } else {
          this.comName = 'detail'
        }
      },
      copySQL($evt) {
        const text = this.detail_list.reduce((str, item) => {
          str += /[\s\S];$/.test(item.sql)
            ? `${item.sql}\r\n`
            : `${item.sql};\r\n`;
          return str;
        }, '')
        handleClipboard(text, $evt);
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>