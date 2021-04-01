<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="first_level">
          <el-select v-model="listQuery.first_level" placeholder="一级分类" style="width: 150px;" clearable @change="searchClick">
            <el-option v-for="item in first_level_dict" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item prop="second_level">
          <el-input v-model="listQuery.second_level" clearable placeholder="二级分类" style="width: 150px;"/>
        </el-form-item>
        <el-form-item prop="active">
          <el-select v-model="listQuery.active" placeholder="是否启用" filterable clearable
                     @change="searchClick" style="width: 120px">
            <el-option key="1" label="启用" value="1"/>
            <el-option key="2" label="禁用" value="2"/>
          </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button v-if="is_admin_role" type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>
        <el-button v-if='is_admin_role' type="warning" icon="el-icon-edit-outline" plain
                   :disabled="selected_rows.length === 0 " @click="bacthUpdateClick">批量修改
        </el-button>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" border stripe highlight-current-row
              :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column label="一级分类" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.first_level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二级分类" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.second_level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" prop="active" sortable>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.active===1" size="medium">启用</el-tag>
          <el-tag v-if="scope.row.active===2" type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin_role" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain circle @click="EditLine(scope.row)"/>
          <el-button type="danger" icon="el-icon-delete" plain circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="新增分类" :visible.sync="show_add_page" style="text-align: left;" width="27%">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="100px">
        <el-col :span="24">

          <el-form-item label="一级分类" min-width="100" prop="active">
            <el-select v-model="detailFormData.first_level" placeholder="请选择" style="width:100%">
              <el-option v-for="item in first_level_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="二级分类" min-width="100" prop="second_level">
            <el-input v-model.trim="detailFormData.second_level" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="active">
            <el-select v-model="detailFormData.active" placeholder="请选择" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
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

    <el-dialog title="修改分类" :visible.sync="show_edit_page" style="text-align: left;" width="27%">
      <el-form ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="100px">
        <el-col :span="24">
          <el-form-item v-if="false" label="ID" min-width="100">
            <el-input v-model="detailFormData.id" type="text" auto-complete="off" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="一级分类" min-width="100" prop="active">
            <el-select v-model="detailFormData.first_level" placeholder="请选择" style="width:100%">
              <el-option v-for="item in first_level_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="二级分类" min-width="100" prop="second_level">
            <el-input v-model.trim="detailFormData.second_level" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="active">
            <el-select v-model="detailFormData.active" placeholder="请选择" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
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

    <el-dialog title="批量修改" :visible.sync="show_batch_edit_page" style="text-align: left;" width="27%">
      <el-form ref="batchUpdateForm" :model="batchUpdateForm" label-width="100px">
        <el-col :span="24">
          <el-form-item label="一级分类" min-width="100" prop="first_level">
            <el-select v-model="batchUpdateForm.first_level" placeholder="请选择" style="width:100%">
              <el-option v-for="item in first_level_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="active">
            <el-select v-model="batchUpdateForm.active" placeholder="请选择" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
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
    getMalSubdivisionList, createNewMalSubdivision, editMalSubdivision, deleteMalSubdivision,
    bacthUpdateMalSubdivision, getFirstLevelDict
  } from '@/api/workflow/malfunction_subdivision'
  import Pagination from '@/components/Pagination'
  import {validMultipleIp, validSpecialChar} from '@/utils/validate'
  import {parseTime} from "../../utils";

  export default {
    components: {Pagination},
    data() {
      return {
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
      this.is_admin_role = this.roles.includes('malfunction_admin')
      getFirstLevelDict().then(response => {
        this.first_level_dict = response
      });
    },
    filters: {
      formatTime(value) {
        let v = value.replace('T', ' ')
        v = v.substring(0, v.length - 7)
        return v
      },
    },
    methods: {
      bacthUpdateClick() {
        this.initBatchUpdateForm()
        this.show_batch_edit_page = true
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {id: null, first_level: '', second_level: '', active: 1};
      },
      initBatchUpdateForm() {
        this.batchUpdateForm = {id_list: [], first_level: '', active: null}
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
        this.detailFormData.change_user = this.people
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
            })
            this.show_add_page = false
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
        this.detailFormData.change_user = this.people
        this.$refs.detailFormData.validate((valid) => {
          if (valid) {
            editMalSubdivision(this.detailFormData, this.detailFormData.id).then(response => {
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
            })
            this.show_edit_page = false
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
      batchEditSubmitConfirm() {
        this.$refs.batchUpdateForm.validate((valid) => {
          if (valid) {
            let id_list = [];
            for (let i of this.selected_rows) {
              id_list.push(i.id)
            }
            this.batchUpdateForm.id_list = id_list;
            bacthUpdateMalSubdivision(this.batchUpdateForm).then(response => {
              let failed_count = this.selected_rows.length - response.success_count
              if (response['error']) {
                this.$message({
                  title: '失败',
                  message: response.error,
                  type: 'success',
                  duration: 5000
                });
              } else {
                this.$message({
                  title: '成功',
                  message: '成功修改' + response.success_count + '条，失败' + failed_count + '条',
                  type: 'success',
                  duration: 5000
                });
              }
              this.getList();
              console.log(response.error_log)
            });
            this.show_batch_edit_page = false
          } else {
            this.$message({
              message: '表单填写有误',
              type: 'error'
            });
            return false
          }
        })
      },
      addNew() {
        this.initForm();
        this.show_add_page = true;
      },
      fillUpForm(row) {
        this.initForm()
        this.detailFormData.id = row.id;
        this.detailFormData.active = row.active;
        this.detailFormData.first_level = row.first_level;
        this.detailFormData.second_level = row.second_level;
      },
      EditLine(row) {
        this.fillUpForm(row)
        this.show_edit_page = true;
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
        getMalSubdivisionList(this.listQuery).then(response => {
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
