<template>
  <div class="app-container">


    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col :span="20">
        <el-form-item prop="type">
        <el-select v-model="listQuery.type" placeholder="项目类型" style="width: 100%" @change="handleFilter" clearable>
          <el-option v-for="item in appOptions" :label="item.type" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item prop="priority">
          <el-select v-model="listQuery.priority" placeholder="请选择优先级" clearable style="width: 200px;" @change="getList">
            <el-option v-for="item in priority_dict" :key="item[0]" :label="item[1]" :value="item[0]">
              <span :style="getPriorityStyle(item[0])">{{ item[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.nodeconf" placeholder="请选择分组名" filterable clearable class="filter-item"
                     style="width: 200px;" @change="getList">
            <el-option v-for="item in node_conf_list" :key="item.id" :label="item.node_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.status" placeholder="是否启用" filterable clearable class="filter-item"
                     style="width: 200px;" @change="getList">
            <el-option v-for="item in [{k:'启用',v:0},{k:'禁用',v:1}]" :key="item.k" :label="item.k" :value="item.v"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="title">
          <el-input v-model="listQuery.title" placeholder="请输入报警名" clearable style="width: 200px;"></el-input>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" @click="dialogAddVisible=true" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-form>


    <el-table v-loading="listLoading" :data="data" border stripe highlight-current-row style="width: 100%;" :cell-style="cellStyleClass">
      <el-table-column label="ID" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类型" width="82" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分组名" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.node_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" width="90" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.priority_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警名" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警规则" min-width="200px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.expression }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警描述" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0" type="success" size="medium">启用</el-tag>
          <el-tag v-if="scope.row.status!==0" type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改人" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.modify_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="160px" align="center" prop="modfiy_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.modfiy_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" circle @click="editOld(row)"/>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>


    <el-dialog title="新增信息" :visible.sync="dialogAddVisible" width="500px">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="90px">
        <el-form-item label="分组名" prop="nodeconf">
          <el-select v-model.trim="addForm.nodeconf" placeholder="请选择分组名" filterable clearable class="filter-item"
                     style="width: 100%" @change="nodeConfChanged">
            <el-option v-for="item in node_conf_list" :key="item.id" :label="item.node_name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="监控模板" prop="template_ids">
          <el-select v-model.trim="addForm.template_ids" placeholder="请选择报警名" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in template_list" :key="item.key" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <w_collapse title="高级设置 :" :default_expand="true">
          <el-form-item label="告警方式" prop="alarm_method">
            <el-select v-model="addForm.alarm_method" placeholder="选填" style="width: 100%" multiple clearable>
              <el-option v-for="item in alarm_method_dict" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警联系人" prop="alarm_user">
            <el-select v-model="addForm.alarm_user" placeholder="选填" style="width: 100%" multiple clearable filterable>
              <el-option v-for="item in alarm_user_dict" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </w_collapse>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :model="ackForm" label-width="90px">
        <el-form-item label="报警名" prop="title">
          <el-input v-model.trim="ackForm.title" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="报警规则" prop="expression">
          <el-input v-model.trim="ackForm.expression" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="报警描述" prop="description">
          <el-input v-model.trim="ackForm.description" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="ackForm.priority" class="filter-item" style="width: 100%">
            <el-option v-for="item in priority_dict" :key="item[0]" :label="item[1]" :value="item[0]">
              <span :style="getPriorityStyle(item[0])">{{ item[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model.trim="ackForm.status" class="filter-item" style="width: 100%">
            <el-option v-for="item in typeStatus" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警类型" prop="alarm_type">
          <el-select v-model.trim="ackForm.alarm_type" placeholder="请选择报警类型" filterable clearable multiple class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model.trim="ackForm.comments" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCommon()">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import w_collapse from "@/components/WangHuiSelfDefined/w_collapse";
  import w_drawer from "@/components/WangHuiSelfDefined/w_drawer";
  import resize from '@/components/Charts/mixins/resize'
  import {getUserConf} from '@/api/cmdb'
  import {
    getTriggersConf, updateTriggersConf, getTemplateByNodeId, addTriggersConf, getNodeConf, deleteTriggersConf
  } from '@/api/midmonitor/alarm'
  import Pagination from '@/components/Pagination'
  import {get_array_dict_value} from '@/utils/time_trans'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {fetchAppTable} from '@/api/manage_monitor/manage'

  export default {
    name: 'MqClusterConfig',
    components: {Pagination, w_collapse, w_drawer},
    directives: {waves},
    mixins: [resize, sessionListQuery],

    data() {
      return {
        searchText: '',
        listQuery: {page: 1, limit: 20},
        dialogFormVisible: false,
        dialogAddVisible: false,
        listLoading: false,
        data: [],
        alarm_user_dict: [],
        template_list: [],
        node_conf_list: [],
        title_list: [],
        total: 0,
        appOptions: [],
        ackForm: {},
        addForm: {template_ids: '', nodeconf: '',},
        alarm_method_dict: [{value: 'dingding', label: '钉钉报警'}, {value: 'sms', label: '短信报警'}],
        node_conf: [],
        typeStatus: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],
        types: [{value: 'dingding', label: '钉钉报警'}, {value: 'sms', label: '短信报警'}],
        confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'},
        rules: {
          nodeconf: [{required: true, message: '请输入分组名', trigger: 'blur'}],
          template_ids: [{required: true, message: '请输入分组名', trigger: 'blur'}],
        },
        priority_color_dict: [[5, '#E45959'], [4, '#E97659'], [3, '#FFA059'], [2, '#FFC859'], [1, '#7499FF'], [0, '#97AAB3']],
        priority_dict: [[1, '通知'], [2, '警告'], [3, '一般严重'], [4, '严重'], [5, '灾难'], [0, '未定义']],
      }
    },
    created() {
      this.getList()
      getNodeConf().then(res => {
        this.node_conf_list = res
      });
      getUserConf().then(res => {
        this.alarm_user_dict = [];
        res.forEach(item => this.alarm_user_dict.push({value: item.mobile, label: item.user_name + '(' + item.mobile + ')',}))
      });
      fetchAppTable().then(res => {
        this.appOptions = res
      });
    },
    methods: {
      getPriorityStyle(priority) {
        let color = get_array_dict_value(this.priority_color_dict, priority, false)
        return "font-weight:bold; color:" + color
      },
      nodeConfChanged() {
        this.addForm.template_ids = []
        let node_conf_id = this.addForm.nodeconf;
        getTemplateByNodeId({'node_conf_id': node_conf_id}).then(res => {
          this.template_list = res
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate(valid => {
          if (valid) {
            this.getList()
          }
        })
      },
      resetListQuery() {
        this.listQuery = {page: 1, limit: 20,}
      },
      handleReset() {
        this.resetListQuery()
        this.getList()
      },
      getList() {
        this.listLoading = true
        getTriggersConf(this.listQuery).then(response => {
          this.data = response.results
          this.total = response.count
          for (let i of this.data) {
            i.priority_name = get_array_dict_value(this.priority_dict, i.priority)
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      cellStyleClass(row, column, rowIndex, columnIndex) {
        let style = 'padding:5px 0;'
        if (row.column.label === "优先级") {
          let color = get_array_dict_value(this.priority_color_dict, row.row.priority, false)
          style = style + 'background-color:' + color + ';color:#f9ebeb;font-weight: bold'
        }
        return style
      },
      initForm() {
        this.ackForm = {id: '', status: '', priority: '', comments: '', alarm_type: '', description: '', expression: '', title: ''}
      },
      addConfirm() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            addTriggersConf(this.addForm).then(response => {
              this.$message({
                message: '成功添加' + response.sum + '条',
                showClose: true,
                type: 'success',
                duration: 3000,
              });
              this.getList()
            })
            this.dialogAddVisible = false
          }
        })
      },
      updateCommon() {
        this.ackForm.alarm_type = String(this.ackForm.alarm_type)
        updateTriggersConf(this.ackForm.id, this.ackForm).then(response => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
          this.getList()
        });
        this.dialogFormVisible = false
      },
      editOld(row) {
        this.initForm()
        this.ackForm.id = row.id
        this.ackForm.comments = row.comments
        this.ackForm.status = row.status
        this.ackForm.priority = row.priority
        this.ackForm.alarm_type = row.alarm_type.split(',').map(x => String(x))
        this.ackForm.description = row.description
        this.ackForm.templateid = row.templateid
        this.ackForm.expression = row.expression
        this.ackForm.title = row.title
        this.dialogFormVisible = true
      },
      handleDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteTriggersConf(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          })
        }, () => {
          return false
        })
      },
    }
  }
</script>
