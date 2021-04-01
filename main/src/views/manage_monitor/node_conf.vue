<template>
  <div class="app-container">


    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="app_table_conf">
          <el-select v-model="listQuery.app_table_conf" placeholder="项目类型" style="width: 120px" @change="handleFilter" clearable>
            <el-option v-for="item in appOptions" :label="item.type" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="node_name">
          <el-input v-model="listQuery.node_name" placeholder="分组名" style="width: 200px;" clearable @input="handleFilter" class="filter-item"/>
        </el-form-item>

        <el-form-item prop="alarm_type">
          <el-select v-model="listQuery.alarm_type" placeholder="状态" style="width: 120px" @change="handleFilter" clearable>
            <el-option v-for="item in alarmOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="是否启用" style="width: 120px" @change="handleFilter" clearable>
            <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" @click="addNew" icon="el-icon-plus">新增</el-button>
      </el-form>
    </div>


    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row :cell-style="cellStyleClass">
      <el-table-column label="ID" prop="id" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类型" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.app_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分组名" align="center" width="300" prop="node_name"/>
      <el-table-column label="告警集群" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.cluster }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警节点" align="center" width="300">
        <template slot-scope="scope">
          <span v-html="scope.row.ip_port.replace(/,/g,'<br>')"></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="alarm_type" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.alarm_type===0" type="danger">告警</el-tag>
          <el-tag v-else type="primary">排除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" prop="status" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1" type="danger">禁用</el-tag>
          <el-tag v-else type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改人" prop="modify_user" align="center" width="87"/>
      <el-table-column label="修改时间" prop="modify_time" sortable align="center" width="150"/>
      <el-table-column label="备注" min-width="160" prop="comments" align="center" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" circle @click="editOld(scope.row)" icon="el-icon-edit"></el-button>
          <el-button type="danger" circle @click="handleBatchDelete(scope.row)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>


    <el-dialog title="新增信息" :close-on-click-modal="false" :visible.sync="dialogSearchVisible" style="text-align: left;" width="500px"
               @open="dialogSearchVisible = true" @close="dialogSearchVisible = false" top="50px">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="90px">
        <el-form-item label="分组名" prop="node_name">
          <el-input v-model.trim="editForm.node_name" type="text" auto-complete="off" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="项目类型" prop="app_table_conf">
          <el-select v-model="editForm.app_table_conf" style="width: 100%" @change="appTypeChanged">
            <el-option v-for="item in appOptions" :key="item.id" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警节点" prop="filtration">
          <el-cascader expand-trigger="hover" :options="cascade_options" v-model="editForm.filtration" filterable clearable
                       style="width:100%;" :props="{ multiple: true, checkStrictly: true }" @change="filtrationChanged"/>
        </el-form-item>
        <el-form-item label="状态" prop="alarm_type">
          <el-select v-model="editForm.alarm_type" style="width: 100%">
            <el-option v-for="item in alarmOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model.trim="editForm.comments" auto-complete="off" style="width: 100%"/>
        </el-form-item>
        <w_collapse title="高级设置 :" :default_expand="true">
          <el-form-item label="告警方式" prop="alarm_method">
            <el-select v-model="editForm.alarm_method" placeholder="选填" style="width: 100%" multiple clearable>
              <el-option v-for="item in alarm_method_dict" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警联系人" prop="alarm_user">
            <el-select v-model="editForm.alarm_user" placeholder="选填" style="width: 100%" multiple clearable filterable>
              <el-option v-for="item in alarm_user_dict" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </w_collapse>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="修改信息" :close-on-click-modal="false" :visible.sync="dialogFormVisible" style="text-align: left;" width="500px"
               @open="dialogFormVisible = true" @close="dialogFormVisible = false">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="90px">
        <el-form-item label="分组名" prop="node_name">
          <el-input v-model.trim="editForm.node_name" type="text" auto-complete="off" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="项目类型" prop="app_table_conf">
          <el-select v-model="editForm.app_table_conf" style="width: 100%" @change="appTypeChanged">
            <el-option v-for="item in appOptions" :key="item.id" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警节点" prop="filtration">
          <el-cascader expand-trigger="hover" :options="cascade_options" v-model="editForm.filtration" filterable clearable
                       style="width:100%;" :props="{ multiple: true, checkStrictly: true }" @change="filtrationChanged"/>
        </el-form-item>
        <el-form-item label="状态" prop="alarm_type">
          <el-select v-model="editForm.alarm_type" style="width: 100%">
            <el-option v-for="item in alarmOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model.trim="editForm.comments" auto-complete="off" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPoolConfig()">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import {fetchNodeConf, fetchAppTable, fetchNodename, addNodeConf, editNodeConf, deleteNodeConf} from '@/api/manage_monitor/manage'
  import {getLoginUser} from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import w_collapse from "@/components/WangHuiSelfDefined/w_collapse";
  import {getUserConf} from '@/api/cmdb'

  export default {
    name: 'ComplexTable',
    components: {Pagination, w_collapse},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        activeName: ['1'],
        alarmOptions: [{value: 1, label: '排除'}, {value: 0, label: '告警'}],
        statusOptions: [{value: 1, label: '禁用'}, {value: 0, label: '启用'}],
        alarm_method_dict: [{value: 'dingding', label: '钉钉报警'}, {value: 'sms', label: '短信报警'}],
        alarm_user_dict: [{value: 'dingding', label: '钉钉报警'}, {value: 'sms', label: '短信报警'}],
        appOptions: [],
        cascade_options_dict: {},
        cascade_options: [],
        listQuery: {page: 1, limit: 20,},
        editForm: {},
        confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'},
        list: null,
        total: 0,
        listLoading: true,
        dialogFormVisible: false,
        dialogSearchVisible: false,
        rules: {
          app_table_conf: [{required: true, message: '请选择项目类型', trigger: 'blur'}],
          filtration: [{required: true, message: '请选择告警节点', trigger: 'blur'}],
          node_name: [{required: true, message: '请输入分组名', trigger: 'blur'}],
          status: [{required: true, message: '请选择是否启用', trigger: 'blur'}],
          alarm_type: [{required: true, message: '请选择状态', trigger: 'blur'}],
        },
        user: '',
        filterText: '',
      }
    },
    created() {
      this.getList();
      getLoginUser().then(response => {
        this.user = response.username;
      });
      fetchAppTable().then(res => {
        this.appOptions = res
      });
      fetchNodename().then(res => {
        this.cascade_options_dict = res
      });
      getUserConf().then(res => {
        this.alarm_user_dict = [];
        res.forEach(item => this.alarm_user_dict.push({value: item.mobile, label: item.user_name + '(' + item.mobile + ')',}))
      })
    },
    filters: {
      row2MultipleRow(data) {
        let res = '';
        if (data) {
          for (let item of data.split(',')) {
            item += '\n';
            res += item
          }
        }
        return res
      }
    },
    methods: {
      addNew() {
        this.initForm();
        this.dialogSearchVisible = true;
        this.cascade_options = JSON.parse(JSON.stringify(this.cascade_options_dict['es'])); //深拷贝;
      },
      initForm() {
        this.editForm = {
          id: '', app_table_conf: 1, status: 0, filtration: [], node_name: '', alarm_type: 0, modify_user: '', comments: '',
          alarm_method: '', alarm_user: ''
        }
      },
      filtrationChanged(value) {
        if (value.length === 0) {
          for (let i of this.cascade_options) {
            i.disabled = false;
            for (let j of i.children) {
              j.disabled = false
            }
          }
        } else {
          for (let i of this.cascade_options) {
            if (i.value !== value[0][0]) {
              i.disabled = true;
              for (let j of i.children) {
                j.disabled = true;
              }
            }
          }
        }
        // console.log(this.cascade_options)
      },
      cellStyleClass() {
        return 'padding:5px 0'
      },
      appTypeChanged(val) {
        for (let i of this.appOptions) {
          if (parseInt(val) === parseInt(i.id)) {
            this.editForm.filtration = [];
            this.cascade_options = JSON.parse(JSON.stringify(this.cascade_options_dict[i.type])); //深拷贝;
          }
        }
      },
      handleReset() {
        this.resetListQuery();
        this.getList()
      },
      confirm() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.editForm.modify_user = this.user;
            addNodeConf(this.editForm).then(response => {
              if (response.error) {
                this.$notify({
                  title: '失败',
                  message: response.error,
                  type: 'error',
                  duration: 3000
                })
              } else {
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success',
                  duration: 3000
                });
                this.getList();
                this.dialogSearchVisible = false
              }
            });
          }
        })
      },
      editOld(row) {
        // fillUpForm
        this.initForm();
        this.cascade_options = JSON.parse(JSON.stringify(this.cascade_options_dict[row.app_type])); //深拷贝;
        this.dialogFormVisible = true;
        this.editForm.id = row.id;
        this.editForm.app_table_conf = row.app_table_conf;
        this.editForm.filtration = row.filtration;
        this.editForm.node_name = row.node_name;
        this.editForm.status = row.status;
        this.editForm.alarm_type = row.alarm_type;
        this.editForm.comments = row.comments;
        this.editForm.app_type = row.app_type;
        this.filtrationChanged(row.filtration);
        console.log(row.filtration)
      },
      editPoolConfig() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.editForm.modify_user = this.user;
            editNodeConf(this.editForm.id, this.editForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              });
              this.getList()
            });
            this.dialogFormVisible = false
          }
        })
      },
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteNodeConf(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            });
            this.getList()
          })
        }, () => {
          return false
        })
      },
      getList() {
        this.listLoading = true;
        fetchNodeConf(this.listQuery).then(response => {
          this.list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogSearchVisible = false
      },
      resetListQuery() {
        this.listQuery = {page: 1, limit: 20,}
      },
    }
  }
</script>


<style>

</style>
