<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="http_host">
          <el-input v-model="listQuery.ip" clearable placeholder="ip" style="width: 200px;"/>
        </el-form-item>

        <el-form-item prop="enabled">
          <el-select v-model="listQuery.enabled" placeholder="是否启用" filterable clearable
                     @change="searchClick" style="width: 120px">
            <el-option key="1" label="启用" value="1"/>
            <el-option key="0" label="禁用" value="0"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="comments">
          <el-input v-model="listQuery.comments" clearable placeholder="备注" style="width: 160px;"/>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>
        <el-button :disabled="selected_rows.length <= 0" plain type="warning" @click="batchUpdateClick">批量修改</el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" :cell-style="{padding:'4px 0'}">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column label="APP名称" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.app_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP端口" align="center" show-overflow-tooltip width="180px">
        <template slot-scope="scope">
          <span v-for="item in scope.row.ip_port" style="display: block;">{{item.ip+':'+item.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新检测时间" align="center" show-overflow-tooltip min-width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.data_time">{{scope.row.data_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测结果" align="center" show-overflow-tooltip min-width="90px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.success" size="medium" type="success">成功</el-tag>

          <el-popover v-if="!scope.row.success" placement="right" width="180" trigger="hover">
            <el-table :data="scope.row.error_ips" :cell-style="{padding:'4px 0'}">
              <el-table-column width="150" property="ip" label="异常IP" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-tag slot="reference" type="danger" size="medium">异常</el-tag>
<!--            <el-button slot="reference">click 激活</el-button>-->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center"  min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.sms_list }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" show-overflow-tooltip min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.change_user }}</span>
          <div v-if="scope.row.change_time" style="color: #8492a6; font-size: 10px">时间:{{scope.row.change_time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" min-width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enabled" size="medium" type="success">启用</el-tag>
          <el-tag v-if="!scope.row.enabled" type="danger" size="medium">禁用</el-tag>
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


    <el-dialog title="新增" :visible.sync="show_add_page" width="710px" :close-on-click-modal="false" top="80px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="110px">
        <el-col :span="24">
          <el-form-item label="APP名称" min-width="100" prop="app_name">
            <el-input v-model.trim="detailFormData.app_name" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IP端口" min-width="100">
            <el-table :data="detailFormData.ip_port" highlight-current-row ref="grantTable"
                      tooltip-effect="dark" :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">

              <el-table-column label="IP" align="center" show-overflow-tooltip width="200px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'ip_port.' + scope.$index + '.ip'" :rules="rules_add.ip">
                    <el-input v-model="scope.row.ip" type="text" style="width:100%" placeholder="一个ip"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="端口" align="center" show-overflow-tooltip width="300px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'ip_port.' + scope.$index + '.port'" :rules="rules_add.port">
                    <el-input v-model="scope.row.port" type="text" style="width:100%" placeholder="多个端口, 用/分隔"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" show-overflow-tooltip width="60px">
                <template slot-scope="scope" slot="header">
                  <el-button type="primary" icon="el-icon-plus" circle @click="clickAddDeviceButton"/>
                </template>
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-minus" circle @click="clickDeleteDeviceButton(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
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
          <el-form-item label="联系人" prop="sms_list">
            <el-select v-model="detailFormData.sms_list" clearable filterable style="width:100%" multiple placeholder="联系人">
              <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" min-width="100" prop="comments">
            <el-input v-model.trim="detailFormData.comments" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_add_page = false">取 消</el-button>
        <el_button_wait :interval="3" type="primary" @click="addSubmitConfirm()">确 定</el_button_wait>
      </div>
    </el-dialog>


    <el-dialog title="修改" :visible.sync="show_edit_page" width="710px" :close-on-click-modal="false" top="80px">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="110px">
        <el-col :span="24">
          <el-form-item label="APP名称" min-width="100" prop="app_name">
            <el-input v-model.trim="detailFormData.app_name" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IP端口" min-width="100">
            <el-table :data="detailFormData.ip_port" highlight-current-row ref="grantTable"
                      tooltip-effect="dark" :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">

              <el-table-column label="IP" align="center" show-overflow-tooltip width="200px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'ip_port.' + scope.$index + '.ip'" :rules="rules_add.ip">
                    <el-input v-model="scope.row.ip" type="text" style="width:100%" placeholder="一个ip"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="端口" align="center" show-overflow-tooltip width="300px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'ip_port.' + scope.$index + '.port'" :rules="rules_add.port">
                    <el-input v-model="scope.row.port" type="text" style="width:100%" placeholder="多个端口, 用英文逗号分隔"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" show-overflow-tooltip width="60px">
                <template slot-scope="scope" slot="header">
                  <el-button type="primary" icon="el-icon-plus" circle @click="clickAddDeviceButton"/>
                </template>
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-minus" circle @click="clickDeleteDeviceButton(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
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
          <el-form-item label="联系人" prop="sms_list">
            <el-select v-model="detailFormData.sms_list" clearable filterable style="width:100%" multiple placeholder="联系人">
              <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" min-width="100" prop="comments">
            <el-input v-model.trim="detailFormData.comments" type="text" style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit_page = false">取 消</el-button>
        <el_button_wait :interval="3" type="primary" @click="editSubmitConfirm()">确 定</el_button_wait>
      </div>
    </el-dialog>


    <el-dialog title="批量修改" :visible.sync="show_batch_edit_page" style="text-align: left;" width="650px" top="80px">
      <el-form ref="batchUpdateForm" :model="batchUpdateForm" label-width="90px">
        <el-col :span="24">
          <el-form-item label="端口" min-width="100" prop="notes">
            <el-input v-model="batchUpdateForm.port" type="text" style="width:100%"/>
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
          <el-form-item label="联系人" prop="sms_list">
            <el-select v-model="batchUpdateForm.sms_list" clearable filterable style="width:100%" multiple placeholder="联系人">
              <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
            </el-select>
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
    getPortConfigList, createNewPortConfig, deletePortConfig, editPortConfig, portConfigBatchUpdate
  } from '@/api/zabbix/port_monitor_config'
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
        detailFormData: {},
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
          ip: [{required: true, message: '必填项', trigger: 'blur'}],
          app_name: [{required: true, message: '必填项', trigger: 'blur'}],
          // port: [{required: true, message: '必填项', trigger: 'blur'}],
          sms_list: [{required: true, message: '必填项', trigger: 'blur'}],
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
      clickDeleteDeviceButton(row) {
        if (!row.user) {
          this.detailFormData.ip_port.splice(row.index, 1)
          return
        }
        this.$confirm("确认删除吗", '提示', this.confirmOptions).then(() => {
          this.detailFormData.ip_port.splice(row.index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      clickAddDeviceButton() {
        if (this.detailFormData.ip_port.length > 0) {
          let data = JSON.parse(JSON.stringify(this.detailFormData.ip_port[this.detailFormData.ip_port.length - 1])); //深拷贝;
          this.detailFormData.ip_port.push({ip: null, port: null})
        } else {
          this.detailFormData.ip_port.push({ip: null})
        }
      }, grantPermissionClick() {
        this.grantPermissionVisible = true;

      },
      deviceHeaderClass() {
        return 'text-align: center;background:#f5f7fa;color:#56585c;padding:6px 0 5px 0'
      },
      fillUpForm(row) {
        this.initForm();
        this.detailFormData.enabled = row.enabled ? 1 : 0;
        this.detailFormData.ip_port = row.ip_port;
        this.detailFormData.app_name = row.app_name;
        this.detailFormData.comments = row.comments;
        this.detailFormData.id = row.id;
        this.detailFormData.sms_list = row.sms_list ? row.sms_list.split(',') : '';
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
          sms_list: '', comments: '', enabled: 1, change_user: this.people, app_name: '',
        };
        this.detailFormData.ip_port = [{ip: null}];
        this.batchUpdateForm = {sms_list: '', notes: '', enabled: 1, request_uri: '', http_host: '', func_module: ''};
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
        console.log('this.detailFormData', this.detailFormData)
        this.$refs.detailFormData.validate((valid) => {
          if (valid) {
            createNewPortConfig(this.detailFormData).then(response => {
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
            let sms_list = this.detailFormData.sms_list.toString();
            let selected_rows_ids = this.selected_rows.map(x => x.id);
            editPortConfig(this.detailFormData, this.detailFormData.id).then(response => {
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
            let sms_list = this.batchUpdateForm.sms_list.toString();
            let selected_rows_ids = this.selected_rows.map(x => x.id);
            portConfigBatchUpdate({selected_rows: selected_rows_ids, ...this.batchUpdateForm}).then(response => {
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
          deletePortConfig(row.id).then((response) => {
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
        getPortConfigList(this.listQuery).then(response => {
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
