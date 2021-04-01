<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <!-- <el-form-item prop="name">
          <el-select v-model="listQuery.name" placeholder="请选择工作流" filterable clearable class="filter-item" style="width: 162px" @change="changeProject">
            <el-option v-for="item in workflownameOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item> -->
        <el-form-item prop="team">
          <el-select v-model="listQuery.team" placeholder="请选择分类" filterable clearable class="filter-item" style="width: 162px" @change="changeProjectTeam">
            <el-option v-for="item in workflowteamOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="listQuery.name" placeholder="请输入工作流" />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="请选择状态" filterable clearable class="filter-item" style="width: 162px">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button v-if='is_admin_role' class="filter-item" type="primary" @click="dialogInsertVisible=true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if='is_admin_role' type="warning" icon="el-icon-edit-outline" plain
                    :disabled="selected_rows.length === 0" @click="bacthUpdateClick">批量修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table @selection-change="SelectionChange" v-loading="listLoading"
    :data="tableData" border stripe highlight-current-row>
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="ID" min-width="30" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单分类" sortable min-width="75" align="center" prop='wf_class'>
        <template slot-scope="scope">
          <span>{{ scope.row.parent_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单名称" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" sortable min-width="50" align="center" prop='priority'>
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="50" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0" size="medium">启用</el-tag>
          <el-tag v-if="scope.row.status===1" type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="工单url" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详情url" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.detail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="帮助指引" min-width="60" align="center">
        <template slot-scope="scope">
          <!-- <a style="font-size:8px; color:#1890FF" @click="getHelpDoc(scope.row.name)">帮助指引</a> -->
          <a style="font-size:8px; color:#1890FF" :href="scope.row.help_url" target="_blank">帮助指引</a>
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
      <el-table-column label="更新人"  min-width="50" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleBatchEdit(scope.row);" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDeleteWorkflowline(scope.row);" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getWorkflowlineDetail"
    />
    <el-dialog
      title="新增工作流"
      :visible.sync="dialogInsertVisible"
      width="500px"
      @close="handleClose"
    >
      <el-form ref="dataForm" :model="WorkflowlineInsert" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="工单分类" min-width="100" prop="parent">
        <el-select v-model="WorkflowlineInsert.parent" placeholder="请选择分类"
          default-first-option filterable allow-create clearable class="filter-item" style="width: 100%">
          <el-option v-for="item in workflowteamOptions" :key="item.key" :label="item.name" :value="item.key" />
        </el-select>
        </el-form-item>
        <el-form-item label="工单名称" min-width="100" prop="name">
          <el-input v-model.trim="WorkflowlineInsert.name" type="text" placeholder="请输入工作流" auto-complete="off" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" min-width="100" prop="status">
          <el-select v-model="WorkflowlineInsert.status"  style="width: 100%">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单url" min-width="100" prop="url">
          <el-input v-model.trim="WorkflowlineInsert.url" type="text" placeholder="请输入工单url" auto-complete="off" style="width: 100%" />
        </el-form-item>
        <el-form-item label="详情url" min-width="100" prop="detail">
          <el-input v-model.trim="WorkflowlineInsert.detail" type="text" placeholder="请输入详情url" auto-complete="off" style="width: 100%" />
        </el-form-item>
        <el-form-item label="优先级" min-width="100" prop="priority">
          <el-input v-model.trim="WorkflowlineInsert.priority" type="text" placeholder="请输入优先级" auto-complete="off" style="width: 100%" />
        </el-form-item>
        <el-form-item label="帮助文档URL" min-width="100" prop="help_url">
          <el-input v-model.trim="WorkflowlineInsert.help_url" type="text" placeholder="请输入帮助文档URL" auto-complete="off" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="AddWorkflowlineInf('dataForm', WorkflowlineInsert)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改工作流"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleClose"
    >
      <el-form ref="editForm" :model="WorkflowlineEdit" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <!-- <el-form-item label="ID" min-width="100">
          <el-input v-model.trim="WorkflowlineEdit.id" type="text" auto-complete="off" />
        </el-form-item> -->
        <el-form-item label="工单分类" min-width="100" prop="parent">
          <el-select v-model="WorkflowlineEdit.parent" placeholder="请选择分类" filterable clearable class="filter-item" style="width: 100%">
            <el-option v-for="item in workflowteamOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单名称" min-width="100" prop="name">
          <el-input v-model.trim="WorkflowlineEdit.name" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="状态" min-width="100" prop="status">
          <el-select v-model="WorkflowlineEdit.status" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="分类" min-width="100" prop="parent">
          <el-input v-model.trim="WorkflowlineEdit.parent" type="text" auto-complete="off" />
        </el-form-item> -->
        <el-form-item label="工单url" min-width="100" prop="url">
          <el-input v-model.trim="WorkflowlineEdit.url" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="详情url" min-width="100" prop="detail">
          <el-input v-model.trim="WorkflowlineEdit.detail" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="优先级" min-width="100" prop="priority">
          <el-input v-model.trim="WorkflowlineEdit.priority" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="帮助文档URL" min-width="100" prop="help_url">
          <el-input v-model.trim="WorkflowlineEdit.help_url" type="text" placeholder="请输入帮助文档URL" auto-complete="off" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editWorkflowlineInf('editForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量修改" :visible.sync="show_batch_edit_page" style="text-align: left;" width="27%">
      <el-form ref="batchUpdateForm" :model="batchUpdateForm" label-width="100px">
        <el-col :span="24">
          <el-form-item label="一级分类" min-width="100" prop="first_level">
            <el-select v-model="batchUpdateForm.first_level" placeholder="请选择分类"
              default-first-option filterable allow-create clearable class="filter-item" style="width: 100%">
              <el-option v-for="item in workflowteamOptions" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="active">
            <el-select v-model="batchUpdateForm.active" placeholder="请选择" style="width:100%">
              <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
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
import { editWorkflowline, addWorkflowline, getWorkflowline, deleteWorkflowline, getWorkflowparentline, batchEditWorkflowline } from '@/api/workflow/app_manage'
import Pagination from '@/components/Pagination'
import resize from '@/components/Charts/mixins/resize'
import {validMultipleIp, validSpecialChar} from '@/utils/validate'
import {parseTime} from "../../utils";
import { getHelpDocContent } from '@/api/management/help_doc'

export default {
  components: { Pagination },
  mixins: [resize],
  data() {
    return {
      is_admin_role: false,
      rules: {
        name: [{ required: true, message: '请输入工作流', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        parent: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        url: [{ required: true, message: '请输入工单url', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入详情url', trigger: 'blur' }],
        priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }, {validator:this.isNumber, trigger:'blur'}],
      },
      user_name: '',
      roles:[],
      dialogInsertVisible: false,
      dialogVisible: false,
      listLoading: false,
      // workflownameOptions: [],
      workflowteamOptions: [],
      status: [{ value: 0, label: '启用' }, { value: 1, label: '禁用' }],
      show_batch_edit_page:false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        team: undefined,
        status:undefined,
      },
      tableData: [],
      total: 0,
      WorkflowlineInsert: {
        name: '',
        status: '',
        parent: '',
        url:'',
        detail:'',
        priority:'',
        help_url: ''
      },
      WorkflowlineEdit: {
        id: '',
        name: '',
        status: '',
        parent: '',
        url:'',
        detail:'',
        priority:'',
        help_url: ''
      },
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },
      batchUpdateForm:{},
      selected_rows:[],
    }
  },
  created() {
    this.getWorkflowlineDetail()
    // this.getList()
    // this.getProjectList()
    this.getTeamList()
    this.getProjectTeamList()
    this.user_name = this.$store.getters.name;
    this.roles = this.$store.getters.roles;
    this.is_admin_role = this.roles.includes('workflow_admin')
  },
  filters: {
    formatTime(value) {
      let v = value.replace('T', ' ')
      v = v.substring(0, v.length - 7)
      return v
    },
  },
  methods: {
    isNumber(rule, value, callback) {
      const r = /^\+?[1-9][0-9]*$/;
      if (!r.test(value)) {
        return callback(new Error('数量必须为正整数'));
      }else {
        return callback();
      }
    },
    SelectionChange(val){
      this.selected_rows = val;
    },
    bacthUpdateClick() {
      this.initBatchUpdateForm()
      this.show_batch_edit_page = true
    },
    initBatchUpdateForm() {
      this.batchUpdateForm = {id_list: [], first_level: '', active: null}
    },
    handleReset() {
      this.resetlistQuery()
      this.getWorkflowlineDetail()
    },
    handleFilter() {
      this.getWorkflowlineDetail()
    },
    getWorkflowlineDetail() {
      this.listLoading = true
      getWorkflowline(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
      this.listLoading = false
    },
    batchEditSubmitConfirm() {
      this.$refs.batchUpdateForm.validate((valid) => {
        if (valid) {
          let id_list = [];
          for (let i of this.selected_rows) {
            id_list.push(i.id)
          }
          this.batchUpdateForm.id_list = id_list;

          batchEditWorkflowline(this.batchUpdateForm).then(response => {
            let failed_count = this.selected_rows.length - response.success_count
            this.$message({
              title: '成功',
              message: '成功修改' + response.success_count + '条，失败' + failed_count + '条',
              type: 'success',
              duration: 5000
            });
            this.handleReset();
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
    AddWorkflowlineInf(WorkflowName, WorkflowlineInsert) {
      this.$refs[WorkflowName].validate(valid => {
        if (valid) {
          var WorkflowlineAdd = {
            change_user:this.$store.getters.name,
            name: '',
            status: '',
            parent: '',
            url:'',
            detail:'',
            priority:'',
            help_url: ''
          }
          // WorkflowlineAdd.change_user = WorkflowlineInsert.change_user
          WorkflowlineAdd.name = WorkflowlineInsert.name
          WorkflowlineAdd.status = WorkflowlineInsert.status
          WorkflowlineAdd.parent = WorkflowlineInsert.parent
          WorkflowlineAdd.url = WorkflowlineInsert.url
          WorkflowlineAdd.detail = WorkflowlineInsert.detail
          WorkflowlineAdd.priority = WorkflowlineInsert.priority
          WorkflowlineAdd.help_url = WorkflowlineInsert.help_url
          addWorkflowline(WorkflowlineAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加工作流成功',
              type: 'success',
              duration: 3000
            })
            this.dialogInsertVisible = false
            this.getWorkflowlineDetail()
          }).catch(error => {
            this.dialogInsertVisible = false
            if (error.response.data.message == 'resource application process already exist') {
              this.$notify({
                title: '添加失败',
                message: '该工作流已存在，请勿重复添加',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.$refs[WorkflowName].resetFields()
        }
      })
    },
    // getList() {
    //   this.listLoading = true
    //   getWorkflowline(this.listQuery).then(response => {
    //     this.list = response.results
    //     this.total = response.count
    //     setTimeout(() => {
    //       this.listLoading = false
    //     }, 1.5 * 10)
    //   })
    // },
    // getProjectList() {
    //   getWorkflowline().then(response => {
    //     const workflownameOptions = []
    //     for (const i of response) {
    //       workflownameOptions.push({
    //         name: i.name, key: i.id
    //       })
    //     }
    //     this.workflownameOptions = workflownameOptions
    //   })
    // },
    getTeamList() {
      this.listLoading = true
      getWorkflowparentline(this.listQuery).then(response => {
        this.list = response.results
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    getProjectTeamList() {
      getWorkflowparentline().then(response => {
        const workflowteamOptions = []
        for (const i of response.results) {
          workflowteamOptions.push({
            name: i.name, key: i.id
          })
        }
        this.workflowteamOptions = workflowteamOptions
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogInsertVisible = false
      // this.$refs['dataForm'].resetFields()
    },
    // changeProject() {
    //   this.getList()
    // },
    changeProjectTeam() {
      this.getTeamList()
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: undefined,
        team: undefined,
        status:undefined,
      }
    },
    handleDeleteWorkflowline(row) {
      var msg = '确认删除该工作流吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteWorkflowline(row.id,'true').then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getWorkflowlineDetail()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
          console.log(error)
        })
      }, () => {
        return false
      })
    },
    handleBatchEdit(row) {
      this.dialogVisible = true
      this.WorkflowlineEdit.id = row.id
      this.WorkflowlineEdit.name = row.name
      this.WorkflowlineEdit.status = row.status
      this.WorkflowlineEdit.parent = row.parent
      this.WorkflowlineEdit.url = row.url
      this.WorkflowlineEdit.detail = row.detail
      this.WorkflowlineEdit.priority = row.priority
      this.WorkflowlineEdit.help_url = row.help_url
    },
    editWorkflowlineInf(WorkflowName) {
      this.$refs[WorkflowName].validate((valid) => {
        if (valid) {
          editWorkflowline(this.WorkflowlineEdit.id, this.WorkflowlineEdit).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getWorkflowlineDetail()
          }).catch(error => {
            if (error.response.data.message == 'resource application process already exist') {
              this.$notify({
                title: '修改失败',
                message: '该工作流已存在，请勿重复添加',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.dialogVisible = false
        }
      })
    },
    resetWorkflowlineInsert() {
      this.WorkflowlineInsert = {
        name: '',
        status: '',
        parent: '',
        url:'',
        detail:'',
        priority:'',
        help_url: ''
      }
    },
    getHelpDoc(workflow_name) {
      let workflow_title = "新建申请单-" + workflow_name
      getHelpDocContent(({board:'workflow',title:workflow_title})).then(response => {
        this.$router.push({name:"help_doc_preview", params: {content: response.content}})
      })
    }
  }
}
</script>
