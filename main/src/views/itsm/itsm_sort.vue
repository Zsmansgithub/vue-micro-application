<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">

        <el-form-item v-for="item in filter_form_cols" :prop="item['key']">
          <el-input v-if="!item['el_component'] || item['el_component'] === 'el-input'" v-model.trim="listQuery[item['key']]"
                    :type="item['type'] || 'text'" :style="item['style'] || 'width:200px'" :disabled="item['disabled'] || false"
                    :placeholder="item['label'] || ''"/>

          <el-select v-if="item['el_component'] === 'el-select'" v-model="listQuery[item['key']]" :placeholder="item['label'] || ''"
                     :style="item['style'] || 'width:200px'" :clearable="item['clearable'] || true" :disabled="item['disabled'] || false">
            <el-option v-for="k in item['options']" :key="k" :label="k" :value="k">
              <span style="float: left">{{ k }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-plus" @click="addNew">新增</el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" :cell-style="{padding:'4px 0'}">


      <el-table-column v-for="item in table_cols" :label="item['label']" :align="item['align'] || 'center'" :prop="item['key']"
                       :show-overflow-tooltip="item['show-overflow-tooltip'] || false" :sortable="item['sortable'] || false">
        <template slot-scope="scope">
          <span>{{item['trans_map'] ? item['trans_map'][scope.row[item['key']]] :scope.row[item['key']] }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="is_admin_role" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain circle @click="editOld(scope.row)"/>
          <el-button type="danger" icon="el-icon-delete" plain circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList" :page-sizes="[20,50,100]"/>


    <el-dialog title="新增" :visible.sync="show_add_page" style="text-align: left;" width="27%">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="100px">

        <el-col v-for="item in add_form_cols" :span="item['span'] || 24">
          <el-form-item :label="item['label']" :prop="item['key']">
            <el-input v-if="!item['el_component'] || item['el_component'] === 'el-input'" v-model.trim="detailFormData[item['key']]"
                      :type="item['type'] || 'text'" :style="item['style'] || 'width:100%'" :disabled="item['disabled'] || false"
                      :placeholder="item['placeholder'] || ''"/>

            <el-select v-if="item['el_component'] === 'el-select'" v-model="detailFormData[item['key']]" :placeholder="item['placeholder'] || ''"
                       :style="item['style'] || 'width:100%'" :clearable="item['clearable'] || true" :disabled="item['disabled'] || false">
              <el-option v-for="k in item['options']" :key="k" :label="k" :value="k">
                <span style="float: left">{{ k }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show_add_page = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改" :visible.sync="show_edit_page" style="text-align: left;" width="27%">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="100px">
        <el-col v-for="item in edit_form_cols" :span="item['span'] || 24">
          <el-form-item :label="item['label']" :prop="item['key']">

            <el-input v-if="!item['el_component'] || item['el_component'] === 'el-input'" v-model.trim="detailFormData[item['key']]"
                      :type="item['type'] || 'text'" :style="item['style'] || 'width:100%'" :disabled="item['disabled'] || false"
                      :placeholder="item['placeholder'] || ''"/>

            <el-select v-if="item['el_component'] === 'el-select'" v-model="detailFormData[item['key']]" :placeholder="item['placeholder'] || ''"
                       :style="item['style'] || 'width:100%'" :clearable="item['clearable'] || true" :disabled="item['disabled'] || false">
              <el-option v-for="k in item['options']" :key="k" :label="k" :value="k">
                <span style="float: left">{{ k }}</span>
              </el-option>
            </el-select>

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
  import Pagination from '@/components/Pagination'
  import request from '@/utils/request2'

  export default {
    components: {Pagination},
    data() {
      return {
        now_row: {},
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
        confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'},
        listQuery: {page: 1, limit: 100},
        listLoading: true,
        rules_add: {
          name: [{required: true, message: '必填项', trigger: 'blur'}],
          key: [{required: true, message: '必填项', trigger: 'blur'}],
          sort: [{required: true, message: '必填项', trigger: 'blur'}],
          infoType: [{required: true, message: '必填项', trigger: 'blur'}],
          sortForm: [{required: true, message: '必填项', trigger: 'blur'}],
          component: [{required: true, message: '必填项', trigger: 'blur'}],
        },
        table_cols: [
          {key: 'name', label: '键中文名'},
          {key: 'key', label: '键英文名'},
          {key: 'sort', label: '顺序编号', sortable: true},
          {key: 'infoType', label: '表单号', sortable: true},
          {key: 'sortForm', label: '表单内顺序号', sortable: true},
          {key: 'component', label: '输入框类型'},
          {key: 'tabclu', label: '重点显示', trans_map: {true: '是', false: '否'}},
        ],
        add_form_cols: [
          {key: 'name', label: '键中文名'},
          {key: 'key', label: '键英文名'},
          {key: 'sort', label: '顺序编号'},
          {key: 'infoType', label: '表单号'},
          {key: 'sortForm', label: '表单内顺序'},
          {key: 'component', label: '输入框类型', el_component: 'el-select', options: ['SAI_input', 'SAI_dateTime']},
        ],
        edit_form_cols: [
          {key: 'name', label: '键中文名'},
          {key: 'key', label: '键英文名', disabled: true},
          {key: 'sort', label: '顺序编号'},
          {key: 'infoType', label: '表单号'},
          {key: 'sortForm', label: '表单内顺序'},
          {key: 'component', label: '输入框类型', el_component: 'el-select', options: ['SAI_input', 'SAI_dateTime']},
        ],
        filter_form_cols: [
          {key: 'name', label: '键中文名'},
          {key: 'key', label: '键英文名'},
          {key: 'infoType', label: '表单号', el_component: 'el-select', options: ['info1', 'info2', 'info3']},
        ]
      }
    },
    created() {
      this.getList();
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.is_admin_role = true;

    },
    methods: {
      fillUpForm(row) {
        this.initForm();
        this.detailFormData.id = row.id;
        for (let item of this.edit_form_cols) {
          this.detailFormData[item['key']] = row[item['key']]
        }
      },
      editOld(row) {
        this.fillUpForm(row);
        this.now_row = row;
        this.show_edit_page = true;
      },
      addNew() {
        this.initForm();
        this.show_add_page = true;
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {};
        for (let item of this.add_form_cols) {
          this.detailFormData[item['key']] = ''
        }
        this.detailFormData['infoType'] = 'info1';
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
            postShit(this.detailFormData).then(response => {
              if (response['error']) {
                this.$notify({title: '失败', message: response['error'], type: 'warning', duration: 3000});
              } else {
                this.$notify({title: '成功', message: '提交成功', type: 'success', duration: 3000});
                this.show_add_page = false;
                this.getList()
              }
            });
          } else {
            this.$message({message: '表单填写有误', type: 'warning'});
            return false
          }
        })

      },
      editSubmitConfirm() {
        this.detailFormData.change_user = this.people;
        this.$refs.detailFormData.validate((valid) => {
          if (valid) {
            let selected_rows_ids = this.selected_rows.map(x => x.id);
            putShit(this.detailFormData, this.detailFormData.id).then(response => {
              console.log('response', response);
              if (response['error']) {
                this.$notify({title: '失败', message: response['error'], type: 'warning', duration: 3000});
              } else {
                this.$notify({title: '成功', message: '提交成功', type: 'success', duration: 3000});
                this.show_edit_page = false;
                this.getList()
              }
            })
          } else {
            this.$message({message: '表单填写有误', type: 'warning'});
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
                this.$notify({title: '失败', message: response['error'], type: 'warning', duration: 3000});
              } else {
                this.$notify({title: '成功', message: '提交成功', type: 'success', duration: 3000});
                this.getList();
                this.show_batch_edit_page = false;
              }
            });
          } else {
            this.$message({message: '表单填写有误', type: 'warning'});
            return false
          }
        })
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteShit(row.id).then((response) => {
              this.$message({title: '成功', message: '删除成功', type: 'success', duration: 3000});
            }
          );
        }).then(() => {
          setTimeout(this.getList, 200)
        })
      },
      getList() {
        this.listLoading = true;
        getShit(this.listQuery).then(response => {
          this.table_data_list = response.results;
          this.total = response.count;
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
        this.listQuery = {page: 1, limit: 100}
      },
    }
  }

  function getShit(query) {
    return request({
      url: 'itsm/itsm_sort/',
      method: 'get',
      params: query
    })
  }

  function postShit(data) {
    return request({
      url: '/itsm/itsm_sort/',
      method: 'post',
      data
    })
  }

  function putShit(data) {
    return request({
      url: `/itsm/itsm_sort/${data.id}`,
      method: 'put',
      data
    })
  }

  function deleteShit(id) {
    return request({
      url: `/itsm/itsm_sort/` + id,
      method: 'delete',
    })
  }
</script>
