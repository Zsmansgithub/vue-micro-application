<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="http_host">
          <el-input v-model="listQuery.http_host" clearable placeholder="域名" style="width: 200px;"/>
        </el-form-item>
        <el-form-item prop="url">
          <el-input v-model="listQuery.url" clearable placeholder="URL地址模糊查询" style="width: 280px;"/>
        </el-form-item>
        <el-form-item prop="url_regex">
          <el-input v-model="listQuery.url_regex" clearable placeholder="URL地址正则查询" style="width: 280px;"/>
        </el-form-item>
        <el-form-item prop="ip">
          <el-select v-model="listQuery.enabled" placeholder="是否启用" filterable clearable
                     @change="searchClick" style="width: 120px">
            <el-option key="1" label="启用" value="1"/>
            <el-option key="0" label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="ip">
          <el-select v-model="listQuery.discover" placeholder="发现规则" filterable clearable
                     @change="searchClick" style="width: 120px">
            <el-option v-for="i in discover_dict" :key="i[1]" :label="i[1]" :value="i[0]"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="func_module">
          <el-input v-model="listQuery.func_module" clearable placeholder="功能模块" style="width: 120px;"/>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button type="primary" @click="addNew">新增正则</el-button>
        <el-button :disabled="selected_rows.length <= 0" plain type="warning" @click="batchUpdateClick">批量修改</el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" :cell-style="{padding:'4px 0'}">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <!--      <el-table-column label="ID" property="id" align="center" show-overflow-tooltip width="60px"/>-->
      <!--      <el-table-column label="PID" property="replaced" align="center" show-overflow-tooltip width="60px"/>-->
      <el-table-column label="URL地址" align="left" show-overflow-tooltip min-width="300px">
        <template slot-scope="scope">
          <b style="display: block">{{scope.row.notes }}</b>
          <span>{{ scope.row.request_uri }}</span>
          <el-popover v-if="scope.row.discover===2" placement="bottom-start" width="780" trigger="click"
                      :title="'共替换掉'+scope.row.replaced_count+'条'"
                      style="background-color: #EEEEEE;float: right;border-radius:2px;cursor: pointer;">
            <el-table :data="scope.row.replaced_list" :cell-style="{padding:'4px 0'}">
              <el-table-column width="250" property="http_host" label="域名" show-overflow-tooltip></el-table-column>
              <el-table-column width="500" property="request_uri" label="URL" show-overflow-tooltip></el-table-column>
            </el-table>
            <div slot="reference" onmousedown="this.style.backgroundColor= '#aaaaaa';" onmouseup="this.style.backgroundColor= '#eeeeee';">
              <i class="el-icon-caret-bottom"></i>
            </div>
          </el-popover>

          <div style="color: #8492a6; font-size: 10px">{{scope.row.http_host}}</div>
        </template>
      </el-table-column>
      <el-table-column label="发现规则" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.discover===1" size="medium" type="info">自动生成</el-tag>
          <el-tag v-if="scope.row.discover===2" size="medium" type="warning">正则匹配</el-tag>
          <el-tag v-if="scope.row.discover===0" size="medium" type="success">自动发现</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" show-overflow-tooltip min-width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.connects }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能模块" align="center" show-overflow-tooltip min-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.func_module }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务器地址" align="center" show-overflow-tooltip min-width="100px">
        <template slot-scope="scope">
          <span style="display: block" v-for="i in scope.row.server_addr.split(',')">{{i}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" min-width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enabled" size="medium" type="success">启用</el-tag>
          <el-tag v-if="!scope.row.enabled" type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.change_time }}</span>
          <div v-if="scope.row.change_user" style="color: #8492a6; font-size: 10px">更新人:{{scope.row.change_user}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"/>
          <el-button plain type="danger" icon="el-icon-delete" circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList" :page-sizes="[20,50,100]"/>


    <el-dialog title="新增" :visible.sync="show_add_page" width="650px" :close-on-click-modal="false" top="80px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="110px">
        <el-col :span="24">
          <el-form-item label="接口说明" min-width="100" prop="notes">
            <el-input v-model="detailFormData.notes" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="域名" min-width="100" prop="http_host">
            <el-input v-model.trim="detailFormData.http_host" type="text" style="width: 100%" placeholder="默认不填代表全部"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="URL" min-width="100" prop="request_uri">
            <el-input v-model.trim="detailFormData.request_uri" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="enabled">
            <el-select v-model.trim="detailFormData.enabled" placeholder="请选择状态" filterable clearable class="filter-item" style="width: 100%">
              <el-option v-for="i in enabled_dict" :key="i[1]" :label="i[1]" :value="i[0]">
                <span :style="getEnabledStyle(i[0])">{{ i[1] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系人" prop="name">
            <el-select v-model="detailFormData.connects" clearable filterable style="width:100%" multiple placeholder="联系人">
              <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="功能模块" min-width="100" prop="func_module">
            <el-input v-model.trim="detailFormData.func_module" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <w_collapse title="告警设置 :" :default_expand="true">
          <el-col :span="24">
            <el-form-item label="平均耗时大于" min-width="100" prop="func_module">
              <el-input v-model.trim="detailFormData.avg_time_gt" type="text" style="width: 100%" placeholder="不填默认1000毫秒">
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="5xx数量大于" min-width="100" prop="func_module">
              <el-input v-model.trim="detailFormData.code_5xx_gt" type="text" style="width: 100%" placeholder="数量或百分比，不填默认20%"/>
            </el-form-item>
          </el-col>
        </w_collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_add_page = false">取 消</el-button>
        <el_button_wait :interval="3" type="primary" @click="addSubmitConfirm()">确 定</el_button_wait>
      </div>
    </el-dialog>


    <el-dialog title="修改" :visible.sync="show_edit_page" width="650px" :close-on-click-modal="false" top="80px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="110px">
        <el-col :span="24">
          <el-form-item label="接口说明" min-width="100" prop="notes">
            <el-input v-model="detailFormData.notes" type="text" style="width:100%" placeholder="必填"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="域名" min-width="100" prop="http_host">
            <el-input :disabled="now_row.discover!=2" v-model.trim="detailFormData.http_host" type="text" style="width: 100%"
                      placeholder="不填代表全部"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="URL" min-width="100" prop="request_uri">
            <el-input :disabled="now_row.discover!=2" v-model.trim="detailFormData.request_uri" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="enabled">
            <el-select v-model.trim="detailFormData.enabled" placeholder="请选择状态" filterable clearable class="filter-item" style="width: 100%">
              <el-option v-for="i in enabled_dict" :key="i[1]" :label="i[1]" :value="i[0]">
                <span :style="getEnabledStyle(i[0])">{{ i[1] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系人" prop="name">
            <el-select v-model="detailFormData.connects" clearable filterable style="width:100%" multiple placeholder="联系人">
              <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="功能模块" min-width="100" prop="func_module">
            <el-input v-model.trim="detailFormData.func_module" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>

        <w_collapse title="告警设置 :" :default_expand="true">
          <el-col :span="24">
            <el-form-item label="平均耗时大于" min-width="100" prop="func_module">
              <el-input v-model.trim="detailFormData.avg_time_gt" type="text" style="width: 100%" placeholder="不填默认1000毫秒">
                <template slot="append">ms</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="5xx数量大于" min-width="100" prop="func_module">
              <el-input v-model.trim="detailFormData.code_5xx_gt" type="text" style="width: 100%" placeholder="数量或百分比，不填默认20%"/>
            </el-form-item>
          </el-col>
        </w_collapse>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit_page = false">取 消</el-button>
        <el_button_wait :interval="3" type="primary" @click="editSubmitConfirm()">确 定</el_button_wait>
      </div>
    </el-dialog>


    <el-dialog title="批量修改" :visible.sync="show_batch_edit_page" style="text-align: left;" width="650px" top="80px">
      <el-form ref="batchUpdateForm" :model="batchUpdateForm" label-width="90px">
        <el-col :span="24">
          <el-form-item label="接口说明" min-width="100" prop="notes">
            <el-input v-model="batchUpdateForm.notes" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="enabled">
            <el-select v-model.trim="batchUpdateForm.enabled" placeholder="请选择状态" filterable clearable class="filter-item" style="width: 100%">
              <el-option v-for="i in enabled_dict" :key="i[1]" :label="i[1]" :value="i[0]">
                <span :style="getEnabledStyle(i[0])">{{ i[1] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系人" prop="name">
            <el-select v-model="batchUpdateForm.connects" clearable filterable style="width:100%" multiple placeholder="联系人">
              <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="功能模块" min-width="100" prop="func_module">
            <el-input v-model.trim="batchUpdateForm.func_module" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_batch_edit_page = false">取 消</el-button>
        <el-button type="primary" @click="batchEditSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>


<script>
  import {
    getNginxLogConfigList, createNewNginxConfig, deleteNginxConfig, editNginxConfig, nginxLogBatchUpdate
  } from '@/api/zabbix/nginx_log_config'
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
    watch: {
      '$route': function (to, from) {
        if (this.$route.params.url) {
          this.listQuery.url = this.$route.params.url;
          this.getList();
        }
      },
    },
    created() {
      console.log('this.$route : ', this.$route);
      if (this.$route.params.url) {
        this.listQuery.url = this.$route.params.url
      }
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
        this.detailFormData = {
          connects: '', notes: '', enabled: 1, request_uri: '', http_host: '', func_module: '', avg_time_gt: '', code_5xx_gt: ''
        };
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
        getNginxLogConfigList(this.listQuery).then(response => {
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
