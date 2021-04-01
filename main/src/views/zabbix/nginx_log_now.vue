<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="second_level">
          <el-input v-model="listQuery.http_host" clearable placeholder="域名" style="width: 250px;"/>
        </el-form-item>
        <el-form-item prop="second_level">
          <el-input v-model="listQuery.url" clearable placeholder="URL地址" style="width: 350px;"/>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="比较值" v-model="listQuery.compare_right" class="input_with_select" clearable>
            <div slot="prepend">
              <el-select v-model="listQuery.compare_left" placeholder="比较字段" style="width: 150px;margin-right: 0;" clearable>
                <el-option label="状态码2xx" value="status_2xx"></el-option>
                <el-option label="状态码5xx" value="status_5xx"></el-option>
                <el-option label="其他状态码" value="status_else"></el-option>
                <el-option label="耗时<100ms" value="resp_100"></el-option>
                <el-option label="耗时<300ms" value="resp_300"></el-option>
                <el-option label="耗时<500ms" value="resp_500"></el-option>
                <el-option label="耗时<1000ms" value="resp_1000"></el-option>
                <el-option label="耗时<6000ms" value="resp_6000"></el-option>
                <el-option label="耗时>=6000ms" value="resp_gte_6000"></el-option>
                <el-option label="总访问数量" value="all_count"></el-option>
                <el-option label="平均访问耗时" value="avg_resp_time"></el-option>
              </el-select>
              <el-select v-model="listQuery.compare_symbol" clearable placeholder="运算符"
                         style="width: 100px;margin-left: 0;border-left: 1px solid #DCDFE6">
                <el-option label=">" value="__gt"></el-option>
                <el-option label="<" value="__lt"></el-option>
                <el-option label=">=" value="__gte"></el-option>
                <el-option label="<=" value="__lte"></el-option>
                <el-option label="=" value="="></el-option>
              </el-select>
            </div>
          </el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button v-if="false" :disabled="selected_rows.length <= 0" plain type="warning" icon="el-icon-edit"
                   @click="batchUpdateClick">批量修改
        </el-button>
      </el-form>
    </div>


    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" :cell-style="{padding:'4px 0'}">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <!--      <el-table-column label="ID" property="request_uri" align="center" show-overflow-tooltip width="60px"/>-->
      <el-table-column label="URL地址" align="left" show-overflow-tooltip min-width="350px">
        <template slot-scope="scope">
          <span style="color:dodgerblue"><a @click="urlClick(scope.row.url)">{{ scope.row.url }}</a></span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.http_host}}</div>
          <div v-if="scope.row.connects" style="color: #8492a6; font-size: 10px">{{scope.row.connects}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态码" align="center">
        <el-table-column label="2xx" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status_2xx }}</span>
          </template>
        </el-table-column>
        <el-table-column label="5xx" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
          <span :style=" scope.row.status_5xx > scope.row.all_count*0.2 || scope.row.status_5xx > 50 ? {color: 'red', fontWeight: 'bolder'}:{} ">
            {{ scope.row.status_5xx }}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="其他" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.status_else }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="接口耗时" align="center">
        <el-table-column label="<100ms" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.resp_100 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="<300ms" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.resp_300 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="<500ms" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.resp_500 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="<1s" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.resp_1000 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="<6s" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
          <span :style=" scope.row.resp_6000 >  scope.row.all_count*0.2 ? {color: 'red', fontWeight: 'bolder'}:{} ">
            {{ scope.row.resp_6000 }}
          </span>
          </template>
        </el-table-column>
        <el-table-column label=">=6s" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
          <span :style=" scope.row.resp_gte_6000 >  scope.row.all_count*0.2 ? {color: 'red', fontWeight: 'bolder'}:{} ">
            {{ scope.row.resp_gte_6000}}
          </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="总计数" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.all_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平均耗时" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style=" scope.row.avg_resp_time > 500 ? {color: 'red', fontWeight: 'bolder'}:{} ">
            {{scope.row.avg_resp_time}}ms</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.time">{{scope.row.time}}</span>
        </template>
      </el-table-column>

      <el-table-column label="详情" align="center" width="55" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el_button_wait type="text" @click="handleShowHistory(scope.row)">
            <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
          </el_button_wait>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>


    <el-dialog sub_t="小历史曲线" :title="'URL: '+ inner_his_dialog_title" :visible.sync="show_line_chart" width="1300px" top="30px">
      <div style="margin-left: 10px">

        <el-date-picker type="daterange" style="width: 380px;margin-left:15px;padding-right: 0" v-model="inner_dialog_time_range"
                        start-placeholder="开始时间" end-placeholder="结束时间" @change="datePickerChanged"
                        :picker-options="pickerOptions1" :clearable="false">
        </el-date-picker>
        <el-button style="margin-left: 10px" plain type="primary" icon="el-icon-search" @click="datePickerChanged">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="datePickerReset">重置</el-button>
      </div>
      <!--      <line_chart :line_data="line_data"></line_chart>-->
      <el-row>
        <el-col :span="12">
          <line_chart ref="chart1" :series="line_chart_series['status']" :scale="scale" @scale_button_click="scale=!scale"></line_chart>
        </el-col>
        <el-col :span="12">
          <line_chart ref="chart2" :series="line_chart_series['resp_time']" :scale="scale" @scale_button_click="scale=!scale"></line_chart>
        </el-col>
        <el-col :span="12">
          <line_chart ref="chart3" :series="line_chart_series['all_count']" :scale="scale" @scale_button_click="scale=!scale"></line_chart>
        </el-col>
        <el-col :span="12">
          <line_chart ref="chart4" :series="line_chart_series['avg_resp_time']" :scale="scale" @scale_button_click="scale=!scale"></line_chart>
        </el-col>
      </el-row>
    </el-dialog>


    <el-dialog title="批量修改" :visible.sync="show_edit_page" style="text-align: left;" width="600px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="90px">
        <el-col :span="24">
          <el-form-item label="联系人" prop="name">
            <el-select v-model="detailFormData.connects" clearable filterable style="width:100%" multiple placeholder="联系人">
              <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" min-width="100" prop="description">
            <el-input v-model="detailFormData.notes" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" style="width:100%"/>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit_page = false">取 消</el-button>
        <el-button type="primary" @click="editSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>


<script>
  import {getNginxLogNowList, getNginxLogHisLineData, nginxLogBatchUpdate} from '@/api/zabbix/nginx_log_now'
  import Pagination from '@/components/Pagination'
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";
  import line_chart from "./components/nginx_log/lineChart"
  import {AccGetUserList} from '@/api/cmdb'

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
    components: {Pagination, el_button_wait, line_chart},
    data() {
      return {
        user_list: [],
        now_row: null,
        scale: false,
        pickerOptions1: {},
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
        active_dict: [{value: 1, label: '启用'}, {value: 2, label: '禁用'}],
        first_level_dict: [],
        listLoading: true,
        rules_add: {
          first_level: [{required: true, message: '必填项', trigger: 'blur'}],
          second_level: [{required: true, message: '必填项', trigger: 'blur'}],
          active: [{required: true, message: '必填项', trigger: 'blur'}],
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
      urlClick(url) {
        this.$router.push({name: "nginx_log_config", params: {url: url}})
      },
      batchUpdateClick(row) {
        this.initForm();
        this.show_edit_page = true;
      },
      datePickerReset() {
        let now = new Date().getTime();
        this.inner_dialog_time_range = [getPureDate().getTime() - 86400000, getPureDate().getTime()];
        this.datePickerChanged()
      },
      datePickerChanged(value) {
        if (Array.isArray(value)) {
          this.inner_dialog_time_range = [value[0].getTime(), value[1].getTime()];
        }
        let row = this.now_row;
        for (let line_type of Object.keys(this.line_chart_series)) {
          getNginxLogHisLineData({
            line_type: line_type,
            request_uri_id: row.request_uri,
            time_range: this.inner_dialog_time_range.toString(),
          }).then(response => {
            this.line_chart_series[line_type] = response
          })
        }
      },
      handleShowHistory(row) {
        this.inner_his_dialog_title = row.http_host + row.url
        let now = new Date().getTime();
        this.inner_dialog_time_range = [getPureDate().getTime() - 86400000, getPureDate().getTime()];
        this.now_row = row;
        this.show_line_chart = true;
        for (let line_type of Object.keys(this.line_chart_series)) {
          getNginxLogHisLineData({
            line_type: line_type,
            request_uri_id: row.request_uri,
            time_range: this.inner_dialog_time_range.toString(),
          }).then(response => {
            this.line_chart_series[line_type] = response
          })
        }
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
        this.detailFormData = {connects: '', notes: ''};
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
            createNewMalSubdivision(this.detailFormData).then(response => {
              if (response['error']) {
                this.$notify({
                  title: '失败',
                  message: response['error'],
                  type: 'warning',
                  duration: 3000
                });
                this.resetClick()
              } else {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 3000
                });
                this.resetClick()
              }
            });
            this.show_add_page = false;
            this.resetClick()
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
            nginxLogBatchUpdate({connects: connects, notes: this.detailFormData.notes, selected_rows: selected_rows_ids}).then(response => {
              if (response['error']) {
                this.$notify({
                  title: '失败',
                  message: response['error'],
                  type: 'warning',
                  duration: 3000
                });
                this.resetClick()
              } else {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 3000
                });
                this.resetClick()
              }
            });
            this.show_edit_page = false;
            this.resetClick()
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
          deleteMalSubdivision(row.id).then((response) => {
              this.$message({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 3000
              });
            }
          );
        }).then(() => {
          setTimeout(this.resetClick, 200)
        })
      },
      getList() {
        this.listLoading = true;
        getNginxLogNowList(this.listQuery).then(response => {
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
