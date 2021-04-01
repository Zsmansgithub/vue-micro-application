<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item>
        <el-input v-model="listQuery.name" placeholder="请输入工作流类型"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="工作流类型" width="250px" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="工作流节点" align="center">
        <template slot-scope="scope">
          <table cellspacing="0" cellpadding="0">
            <span v-for="(item,index) in scope.row.nodes">
              <td align="center" style="padding: 5px;border:1px solid #dfe6ec;line-height:16px;">
                <span style="display: block;">{{ item.name }}
                  <el-button type="text" icon="el-icon-edit" @click="handleEdit(item)" style="padding:0;"/>
                  <el-button type="text" icon="el-icon-delete" @click="deletenode(item.id)" style="padding:0;margin-left:0;color:red;"/>
                </span>
                <div style="color: #8492a6; font-size: 10px;text-align:center;">
                  <span style="float: left;">{{item.handler_user}}</span>
                  <span style="float: right;">{{ item.id }}</span>
                </div>
              </td>
              <td align="center" style="padding: 5px;border:0;line-height:16px;" v-if="index !== scope.row.nodes.length-1">
                <i class="el-icon-right"></i>
              </td>
            </span>
          </table>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-tooltip content="增加审批节点" placement="top">
            <el-button type="primary" icon="el-icon-plus" circle @click="addNodeButton(scope.row.id);" />
          </el-tooltip>
          <el-tooltip content="添加默认节点" placement="top">
            <el-button type="warning"icon="el-icon-star-off" circle @click="setnode(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    <!--新增弹框-->
    <el-dialog title="新增节点" :visible.sync="dialogVisibleAdd" width="700px" @close="handleCloseDialogAdd" >
      <el-form ref="addForm" :model="rowAdd" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="对应工作流" min-width="100" prop='workflowline'>
          <el-select v-model="rowAdd.workflowline" placeholder="请选择" style="width: 528px" disabled>
            <el-option v-for="item in WorkFlowLine" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批节点名" min-width="110" prop='node_name'>
          <el-input v-model.trim="rowAdd.node_name"></el-input>
        </el-form-item>
        <el-form-item label="下一节点" min-width="100" prop='next_node'>
          <el-select v-model="rowAdd.next_node" placeholder="请选择" style="width: 528px">
            <el-option v-for="(item, id) in NodeName" :key="id" :label="item" :value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批角色" min-width="100" prop='role'>
          <el-select v-model="rowAdd.role" placeholder="请选择" style="width: 528px" @change="rowAdd.people = null">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="rowAdd.role == 'role'" label="审批人" min-width="100" prop='people'>
          <el-select v-model="rowAdd.people" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsR" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="rowAdd.role == 'uuid'" label="审批人" min-width="100" prop='people'>
          <el-select v-model="rowAdd.people" filterable clearable placeholder="请输入审批人工号/姓名" style="width: 100%;">
            <el-option v-for="item in OptionsU" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="rowAdd.role == 'ou'" label="审批部门" min-width="100" prop='people'>
          <el-select v-model="rowAdd.people" filterable clearable placeholder="请输入审批部门名称" style="width: 100%;">
            <el-option v-for="item in OptionsD" :key="item.ou_id" :label="item.ou_name" :value="item.ou_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="节点类型" min-width="100" prop='node_type'>
          <el-select v-model="rowAdd.node_type" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsNode" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通过条件" min-width="100" prop='condition'>
          <el-select v-model="rowAdd.condition" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsCondition" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可否撤回" min-width="100" prop='handler_type'>
          <el-select v-model="rowAdd.handler_type" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsHandler" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动态节点" min-width="100" prop='dynamic'>
          <el-select v-model="rowAdd.dynamic" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsDynamic" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表单字段" min-width="110" prop='dynamic_params'>
          <el-input v-model.trim="rowAdd.dynamic_params"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogAdd">取 消</el-button>
        <el-button type="primary" @click="addRowInf('addForm', rowAdd)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹框 -->
    <el-dialog title="修改记录" :visible.sync="dialogVisibleEdit" width="700px" @close="dialogVisibleEdit=false" >
      <el-form ref="editForm" :model="rowEdit" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="对应工作流" min-width="100" prop='workflowline'>
          <el-select v-model="rowEdit.workflowline" placeholder="请选择" style="width: 528px" disabled>
            <el-option v-for="item in WorkFlowLine" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点名称" min-width="100" prop='node_name'>
          <el-input v-model.trim="rowEdit.node_name"></el-input>
        </el-form-item>
        <el-form-item label="下一节点" min-width="100" prop='next_node'>
          <el-select v-model="rowEdit.next_node" placeholder="请选择" style="width: 528px">
            <el-option v-for="(item, id) in NodeName" :key="id" :label="item" :value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批角色" min-width="100" prop='role'>
          <el-select v-model="rowEdit.role" placeholder="请选择" style="width: 528px" @change="rowEdit.people = null">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="rowEdit.role == 'role'" label="审批人" min-width="100" prop='people'>
          <el-select v-model="rowEdit.people" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsR" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="rowEdit.role == 'uuid'" label="审批人" min-width="100" prop='people'>
          <el-select v-model="rowEdit.people" filterable clearable placeholder="请输入审批人工号/姓名" style="width: 100%;">
            <el-option v-for="item in OptionsU" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="rowEdit.role == 'ou'" label="审批部门" min-width="100" prop='people'>
          <el-select v-model="rowEdit.people" filterable clearable placeholder="请输入审批部门名称" style="width: 100%;">
            <el-option v-for="item in OptionsD" :key="item.ou_id" :label="item.ou_name" :value="item.ou_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="节点类型" min-width="100" prop='node_type'>
          <el-select v-model="rowEdit.node_type" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsNode" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通过条件" min-width="100" prop='condition'>
          <el-select v-model="rowEdit.condition" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsCondition" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可否撤回" min-width="100" prop='handler_type'>
          <el-select v-model="rowEdit.handler_type" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsHandler" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动态节点" min-width="100" prop='dynamic'>
          <el-select v-model="rowEdit.dynamic" placeholder="请选择" style="width: 528px">
            <el-option v-for="item in OptionsDynamic" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表单字段" min-width="110" prop='dynamic_params'>
          <el-input v-model.trim="rowEdit.dynamic_params"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="editRowInf('editForm', rowEdit)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getNodesName, editWorkflowNode, addWorkFlowNode, delWorkFlowNode, setDefaultNode} from '@/api/workflow/app_nodes'
import {getWorkFlowLine, getLineAndNodes} from '@/api/workflow/app_line'
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import {getUserInfo,getdepartmentInfo} from '@/api/zabbix/user_info'

export default {
  name: 'ComplexTable',
  directives: { waves },
  components: { Pagination },
  mixins: [resize],
  computed: {
    ...mapGetters(['roles'])
  },
  data(){
    return {
      listQuery: {
        page: 1,
        limit: 20,
        name:undefined
      },
      list:[],
      total:0,
      status: [{ value: 'uuid', label: '用户审批' }, { value: 'ou', label: '部门审批' },{ value: 'role', label: '角色审批' }],
      OptionsNode:[{ value: 0, label: '正常' }, { value: 1, label: '系统' }],
      OptionsCondition:[{ value: 1, label: '任何一个通过就通过' }, { value: 2, label: '所有人通过' }],
      OptionsHandler:[{ value: 1, label: '可以撤回' }, { value: 2, label: '不可以撤回' }],
      OptionsDynamic:[{ value: 0, label: '非动态节点' }, { value: 1, label: '动态节点' },{ value: 6, label: '数据库节点' }],
      OptionsU:[],
      OptionsD:[],
      OptionsR:[{ value: 'leader1', label: '一级部门负责人' }, { value: 'leader2', label: '二级部门负责人' }, { value: 'createUser', label: '申请人' }],
      NodeName:null,
      dialogVisibleEdit: false,
      listLoading:false,
      WorkFlowLine:null,
      dialogVisibleAdd:false,
      adminrole:false,
      rowAdd: {
        node_name: "",
        next_node : "",
        workflowline : "",
        role: "",
        people:"",
        node_type:0,
        condition:1,
        handler_type:1,
        dynamic:0,
        dynamic_params:''
      },
      rowEdit: {
        node_id:"",
        node_name: "",
        next_node : "",
        workflowline : "",
        role: "",
        people:"",
        node_type:"",
        condition:"",
        handler_type:"",
        dynamic:"",
        dynamic_params:""
      },
      rules: {
        node_name: [{ required: true, message: '请输入节点名称', trigger: 'blur' },{min:3, max: 50, message: '长度3-50字符', trigger: 'blur' }],
      },
    }
  },
  created(){
    this.getList()
    getWorkFlowLine().then(response => {
      this.WorkFlowLine = response
    }),
    getUserInfo().then(response => {
      this.OptionsU = response
    }),
    getdepartmentInfo().then(response => {
      this.OptionsD = response
    }),
    this.adminrole = this.roles.includes('admin')
  },
  methods: {
    getList(){
      this.listLoading = true
      getLineAndNodes(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    addNodeButton(id){
      getNodesName(id).then(response => {
        this.NodeName = response
      });
      this.dialogVisibleAdd = true
      this.rowAdd.workflowline = id
    },
    handleEdit(row) {
      this.dialogVisibleEdit = true
      getNodesName(row.line_id).then(response => {
        this.NodeName = response
        if (row.node == 'start') {
          this.rowEdit.next_node = 'step_1'
        } else{
          this.rowEdit.next_node = row.node.split('_')[0]+'_'+ String(Number(row.node.split('_')[1])+1)
        }
        if ( Object.keys(this.NodeName).indexOf(this.rowEdit.next_node)==-1 ) {
          this.rowEdit.next_node = 'end'
        }
      });
      this.rowEdit.node_id = row.id
      this.rowEdit.node_name = row.name
      this.rowEdit.workflowline = row.line_id
      this.rowEdit.role = row.role
      this.rowEdit.people = row.people
      this.rowEdit.node_type = row.node_type
      this.rowEdit.condition = row.condition
      this.rowEdit.handler_type = row.handler_type
      this.rowEdit.dynamic = row.dynamic || 0
      this.rowEdit.dynamic_name = row.dynamic_name
      console.log(row.line_id)
      console.log(this.rowEdit)
    },
    handleCloseDialogAdd() {
      this.dialogVisibleAdd = false
      this.$refs['addForm'].resetFields()
    },
    // 新建记录提交
    addRowInf(formName, rowAdd){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addWorkFlowNode(rowAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 3000
            })
            this.handleCloseDialogAdd()
            this.getList()
          }).catch(error => {
            if (error.response.status===400) {
              this.$notify({
                title: '创建失败',
                message: error.response.data.message,
                type: 'error',
                duration: 3000
              })
            }
            this.dialogVisibleAdd = false
          })
        }
      })
    },
    // 修改记录提交
    editRowInf(formName, rowEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editWorkflowNode(rowEdit.node_id, rowEdit).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          }).catch(error => {
            if (error.response.status === 400) {
              this.$notify({
                title: '修改失败',
                message: '该记录已存在，请勿重复添加',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.dialogVisibleEdit = false
        }
      })
    },
    deletenode(node_id){
      delWorkFlowNode(node_id).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 3000
        })
        this.getList()
      }).catch(error => {
        if (error.response.status===400) {
          this.$notify({
            title: '删除失败',
            message: error.response.data.message,
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    handleReset() {
      this.listQuery.name = undefined
      this.getList()
    },
    setnode(row){
      setDefaultNode(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 3000,
        })
        this.getList()
      }).catch(response => {
        if (error.response.status===400) {
          this.$notify({
            title: '创建失败',
            message: error.response.data.message,
            type: 'error',
            duration: 3000
          })
        }
      })
    },
  },
}
</script>
