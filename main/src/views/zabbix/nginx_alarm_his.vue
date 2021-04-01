<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="http_host">
          <el-input v-model="listQuery.http_host" clearable placeholder="域名" style="width: 250px;"/>
        </el-form-item>
        <el-form-item prop="url">
          <el-input v-model="listQuery.url" clearable placeholder="URL地址模糊查询" style="width: 300px;"/>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" :cell-style="{padding:'4px 0'}">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column label="URL地址" align="left" show-overflow-tooltip min-width="350px">
        <template slot-scope="scope">
          <span>{{ scope.row.request_uri }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.http_host}}</div>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" show-overflow-tooltip min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.connects }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常内容" align="center" show-overflow-tooltip min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.error_count_json }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList" :page-sizes="[20,50,100]"/>

  </div>

</template>


<script>
  import {createNewNginxConfig, deleteNginxConfig, editNginxConfig, nginxLogBatchUpdate} from '@/api/zabbix/nginx_log_config'
  import {getNginxAlarmHis} from '@/api/zabbix/nginx_alarm_his'
  import Pagination from '@/components/Pagination'
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";
  import line_chart from "./components/nginx_log/lineChart"
  import {AccGetUserList} from '@/api/cmdb'
  import w_collapse from "@/components/WangHuiSelfDefined/w_collapse";

  function getPureDate() {
    let end = new Date();
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    end.setTime(end.getTime() + 86400 * 1000);
    return end
  }

  export default {
    components: {Pagination, el_button_wait, line_chart, w_collapse},
    data() {
      return {
        user_list: [],
        now_row: {},
        scale: false,
        pickerOptions1: {},
        // discover_dict: new Map([[0, '自动发现'], [1, '自动生成'], [2, '正则匹配']]),
        discover_dict: new Map([[0, '自动发现'], [2, '正则匹配']]),
        enabled_dict: new Map([[1, "启用"], [0, "禁用"]]),
        line_chart_series: {'status': [], 'all_count': [], 'resp_time': [], 'avg_resp_time': []},
        inner_dialog_time_range: null,
        inner_his_dialog_title: '',
        show_line_chart: false,
        selected_rows: [],
        total: 0,
        table_data_list: null,
        detailFormData: {},
        batchUpdateForm: {},
        show_add_page: false,
        show_edit_page: false,
        show_batch_edit_page: false,
        is_admin_role: false,
        people: '',
        roles: [],
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        listQuery: {page: 1, limit: 20},
        first_level_dict: [],
        listLoading: true,
        rules_add: {
          discover: [{required: true, message: '必填项', trigger: 'blur'}],
          notes: [{required: true, message: '必填项', trigger: 'blur'}],
          request_uri: [{required: true, message: '必填项', trigger: 'blur'}],
          enabled: [{required: true, message: '必填项', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList();
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.is_admin_role = true;
      this.pickerOptions1 = this.initPickerOptions();
      AccGetUserList().then(response => {
        this.user_list = response
      });
    },
    filters: {
      formatTime(value) {
        let v = value.replace('T', ' ');
        v = v.substring(0, v.length - 7);
        return v
      },
    },
    methods: {
      fillUpForm(row) {
        this.initForm();
        this.detailFormData.http_host = row.http_host;
        this.detailFormData.enabled = row.enabled ? 1 : 0;
        this.detailFormData.request_uri = row.request_uri;
        this.detailFormData.discover = row.discover;
        this.detailFormData.notes = row.notes;
        this.detailFormData.func_module = row.func_module;
        this.detailFormData.change_user = this.people;
        this.detailFormData.id = row.id;
        this.detailFormData.avg_time_gt = row.avg_time_gt;
        this.detailFormData.code_5xx_gt = row.code_5xx_gt;
        this.detailFormData.connects = row.connects ? row.connects.split(',') : '';
      },
      editOld(row) {
        this.fillUpForm(row);
        this.now_row = row;
        this.show_edit_page = true;
      },
      getEnabledStyle(k) {
        let enabled_color_dic = {1: 'limegreen', 0: 'red'};
        let color = enabled_color_dic[k];
        return "font-weight:bold; color:" + color
      },
      addNew() {
        this.initForm();
        this.show_add_page = true;
      },
      batchUpdateClick(row) {
        this.initForm();
        this.show_batch_edit_page = true;
      },
      datePickerReset() {
        let now = new Date().getTime();
        this.inner_dialog_time_range = [getPureDate().getTime() - 86400000, getPureDate().getTime()];
        this.datePickerChanged()
      },
      initPickerOptions() {
        return {
          onPick(time) {
            console.log(time)
          },
          shortcuts: [
            {
              text: '最近一天',
              onClick(picker) {
                const end = getPureDate();
                const start = new Date();
                start.setTime(end.getTime() - 86400 * 1000);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三天',
              onClick(picker) {
                const end = getPureDate();
                const start = new Date();
                start.setTime(end.getTime() - 86400 * 3 * 1000);
                picker.$emit('pick', [start, end]);
              }
            },],
        }
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {connects: '', notes: '', enabled: 1, request_uri: '', http_host: '', func_module: ''};
        this.batchUpdateForm = {connects: '', notes: '', enabled: 1, request_uri: '', http_host: '', func_module: ''};
      },
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      resetClick() {
        this.resetListQuery();
        this.getList()
      },
      addSubmitConfirm() {
        this.detailFormData.change_user = this.people;
        this.$refs.detailFormData.validate((valid) => {
          if (valid) {
            createNewNginxConfig(this.detailFormData).then(response => {
              if (response['error']) {
                this.$notify({
                  title: '失败',
                  message: response['error'],
                  type: 'warning',
                  duration: 3000
                });
              } else {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 3000
                });
                this.show_add_page = false;
                this.getList()
              }
            });
          } else {
            this.$message({
              message: '表单填写有误',
              type: 'warning'
            });
            return false
          }
        })

      },
      editSubmitConfirm() {
        this.detailFormData.change_user = this.people;
        this.$refs.detailFormData.validate((valid) => {
          if (valid) {
            let connects = this.detailFormData.connects.toString();
            let selected_rows_ids = this.selected_rows.map(x => x.id);
            editNginxConfig(this.detailFormData, this.detailFormData.id).then(response => {
              console.log('response', response);
              if (response['error']) {
                this.$notify({
                  title: '失败',
                  message: response['error'],
                  type: 'warning',
                  duration: 3000
                });
              } else {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 3000
                });
                this.show_edit_page = false;
                this.getList()
              }

            })
          } else {
            this.$message({
              message: '表单填写有误',
              type: 'warning'
            });
            return false
          }
        })

      },
      batchEditSubmitConfirm() {
        this.batchUpdateForm.change_user = this.people;
        this.$refs.batchUpdateForm.validate((valid) => {
          if (valid) {
            let connects = this.batchUpdateForm.connects.toString();
            let selected_rows_ids = this.selected_rows.map(x => x.id);
            nginxLogBatchUpdate({selected_rows: selected_rows_ids, ...this.batchUpdateForm}).then(response => {
              if (response['error']) {
                this.$notify({
                  title: '失败',
                  message: response['error'],
                  type: 'warning',
                  duration: 3000
                });
              } else {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 3000
                });
                this.getList();
                this.show_batch_edit_page = false;
              }
            });
          } else {
            this.$message({
              message: '表单填写有误',
              type: 'warning'
            });
            return false
          }
        })

      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteNginxConfig(row.id).then((response) => {
              this.$message({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 3000
              });
            }
          );
        }).then(() => {
          setTimeout(this.getList, 200)
        })
      },
      getList() {
        this.listLoading = true;
        getNginxAlarmHis(this.listQuery).then(response => {
          this.table_data_list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 15)
        })
      },
      searchClick() {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        });
      },
      resetListQuery() {
        this.listQuery = {page: 1, limit: 20}
      },
    }
  }
</script>
