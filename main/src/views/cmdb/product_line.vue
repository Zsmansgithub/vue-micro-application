<template>
  <div class="app-container">
    <el-form :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-cascader
            :options="projectOptions"
            v-model="listQuery.cascader_list"
            filterable
            clearable
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
            placeholder="请选择产品线"
            @change="handleFilter"
            style="width:450px;">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="dialogVisibleAdd=true" v-if="adminrole">新增记录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="bulkButton" icon="el-icon-edit" @click="bulkEditDialogVisible=true" v-if="adminrole">批量修改</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="dialogVisibleForm=true" v-if="adminrole">新增组织</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table class="eltabledata" v-loading="listLoading" :data="tableData" border stripe highlight-current-row fit @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="ID" prop="id" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织/标识名" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.unit_alias }}</div>
        </template>
      </el-table-column>
      <el-table-column label="板块/标识名" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.plate }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.plate_alias }}</div>
        </template>
      </el-table-column>
      <el-table-column label="模块/标识名" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.project_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.project_alias }}</div>
        </template>
      </el-table-column>
      <el-table-column label="子模块/标识名" min-width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.subsystem_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.subsystem_alias }}</div>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.owner_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码仓库名称" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.git_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码仓库地址" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.git_addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码仓库描述" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.git_description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100px">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.status==0">启用</span>
          <span v-else-if="scope.row.status==1">禁用</span>
          <span v-else-if="scope.row.status==100">一级组织</span> -->
          <el-tag v-if="scope.row.status==0" type="success">启用</el-tag>
          <el-tag v-else-if="scope.row.status==1" type="error">禁用</el-tag>
          <el-tag v-else-if="scope.row.status==100">一级组织</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="变更人">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注/更新时间" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
          <div style="color:#8492a6;font-size: 10px">{{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px" fixed="right" align="center" v-if="adminrole">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getRowsInf"
    />

    <el-dialog title="新增记录" :visible.sync="dialogVisibleAdd" width="900px" @close="handleCloseDialogAdd" :close-on-click-modal="false">
      <el-form ref="addForm" :model="rowAdd" :rules="rules" label-width="100px" :inline="true" style="width:100%">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织" prop="unit">
              <el-select v-model="rowAdd.unit" placeholder="请选择组织" filterable clearable style="width:121%">
                <el-option v-for="item in unit" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
              <!-- <el-autocomplete
                class="inline-input"
                v-model.trim="rowAdd.unit"
                :fetch-suggestions="querySearch"
                placeholder="请选择组织"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织标识名" prop="unit_alias">
              <el-input v-model.trim="rowAdd.unit_alias" placeholder="请输入组织标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="板块" prop="plate">
              <el-autocomplete
                class="inline-input"
                v-model.trim="rowAdd.plate"
                :fetch-suggestions="querySearch1"
                placeholder="请输入或选择板块"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="板块标识名" prop="plate_alias">
              <el-input v-model.trim="rowAdd.plate_alias" placeholder="请输入板块标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模块" prop="project_name" >
              <el-autocomplete
                class="inline-input"
                v-model.trim="rowAdd.project_name"
                :fetch-suggestions="querySearch2"
                placeholder="请输入或选择模块"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块标识名" prop="plate_alias">
              <el-input v-model.trim="rowAdd.project_alias" placeholder="请输入模块标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form ref="nestedForm" :model="item" v-for="(item, index) in rowAdd.sn" :key="index" :rules="rules" label-width="90px" :inline="true">
          <div>
            <fieldset>
              <legend>{{ '子模块' + index }}</legend>
              <el-row :gutter="0">
                <el-col :span="11">
                  <el-form-item label="子模块" prop="subsystem_name">
                    <el-autocomplete
                      class="inline-input"
                      v-model="item.subsystem_name"
                      :fetch-suggestions="querySearch3"
                      placeholder="请输入子模块"
                      @select="handleSelect"
                      style="width:100%">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="子模块标识名" label-width="110px" prop="subsystem_alias">
                    <el-input v-model.trim="item.subsystem_alias" placeholder="请输入子模块标识名" style="width:100%;" maxlength="64"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button v-if="index===0" :disabled="index===4" type="primary" icon="el-icon-plus" @click="addKey"></el-button>
                  <el-button v-else type="primary" icon="el-icon-minus" @click.prevent="removeKey(item)"></el-button>
                </el-col>
              </el-row>
            </fieldset>
          </div>
        </el-form>

        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-select v-model="rowAdd.owner" placeholder="请选择负责人" filterable clearable style="width:121%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码仓库名称">
              <el-input v-model="rowAdd.git_name" type="text" placeholder="请输入代码仓库名称" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="代码仓库地址">
              <el-input v-model="rowAdd.git_addr" type="text" placeholder="请输入代码仓库地址" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码仓库描述">
              <el-input v-model="rowAdd.git_description" type="text" placeholder="请输入代码仓库描述" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status" >
              <el-select v-model="rowAdd.status" placeholder="请选择状态" style="width:121%">
                <el-option v-for="(item,index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="status" >
              <el-input v-model.trim="rowAdd.comments" type="text" placeholder="请输入备注" auto-complete="off" style="width:130%"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogAdd">取 消</el-button>
        <el-button type="primary" @click="addRowInf('addForm', rowAdd)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改记录" :visible.sync="dialogVisibleEdit" width="900px" @close="handleCloseDialogEdit" :close-on-click-modal="false">
      <el-form ref="editForm" :model="rowEdit" :rules="rules" label-width="108px" :inline="true" style="width:100%">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织" prop="unit">
              <el-select v-model="rowEdit.unit" placeholder="请选择组织" filterable clearable style="width:121%">
                <el-option v-for="item in unit" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
              <!-- <el-autocomplete
                class="inline-input"
                v-model.trim="rowEdit.unit"
                :fetch-suggestions="querySearch"
                placeholder="请选择组织"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织标识名" prop="unit_alias">
              <el-input v-model.trim="rowEdit.unit_alias" placeholder="请输入组织标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="板块" prop="plate">
              <el-autocomplete
                class="inline-input"
                v-model.trim="rowEdit.plate"
                :fetch-suggestions="querySearch1"
                placeholder="请输入或选择板块"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="板块标识名" prop="plate_alias">
              <el-input v-model.trim="rowEdit.plate_alias" placeholder="请输入板块标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模块" prop="project_name" >
              <el-autocomplete
                class="inline-input"
                v-model.trim="rowEdit.project_name"
                :fetch-suggestions="querySearch2"
                placeholder="请输入或选择模块"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块标识名" prop="plate_alias">
              <el-input v-model.trim="rowEdit.project_alias" placeholder="请输入模块标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="子模块" prop="subsystem_name">
              <el-autocomplete
                class="inline-input"
                v-model.trim="rowEdit.subsystem_name"
                :fetch-suggestions="querySearch3"
                placeholder="请输入或选择子模块"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子模块标识名" prop="subsystem_alias">
              <el-input v-model.trim="rowEdit.subsystem_alias" placeholder="请输入子模块标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-select v-model="rowEdit.owner" placeholder="请选择负责人" filterable clearable style="width:121%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码仓库名称">
              <el-input v-model="rowEdit.git_name" type="text" placeholder="请输入代码仓库名称" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="代码仓库地址">
              <el-input v-model="rowEdit.git_addr" type="text" placeholder="请输入代码仓库地址" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码仓库描述">
              <el-input v-model="rowEdit.git_description" type="text" placeholder="请输入代码仓库描述" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="rowEdit.status" placeholder="请选择状态" style="width:121%">
                <el-option v-for="(item,index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="status">
              <el-input v-model.trim="rowEdit.comments" type="text" placeholder="请输入备注" auto-complete="off" style="width:130%"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="editRowInf('editForm', rowEdit)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量修改" :visible.sync="bulkEditDialogVisible" width="500px" @close="handleCloseBulkEdit" :close-on-click-modal="false">
      <el-form ref="bulkEditForm" :model="bulkEdit" :rules="bulkEditRules" label-width="75px" style="width:100%">
        <el-form-item>
          <el-radio-group v-model="bulkEdit.radio">
            <el-radio :label="1">组织</el-radio>
            <el-radio :label="2">板块</el-radio>
            <el-radio :label="3">模块</el-radio>
            <el-radio :label="4">子模块</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="bulkEdit.name" placeholder="请输入层级名称" type="text" style="width:90%" maxlength="64" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="标识名" prop="alias">
          <el-input v-model.trim="bulkEdit.alias" placeholder="请输入层级名称的标识名" type="text" style="width:90%" maxlength="64" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBulkEdit">取 消</el-button>
        <el-button type="primary" @click="onHandleBulkEdit('bulkEditForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增组织" :visible.sync="dialogVisibleForm" width="500px" @close="handleCloseAddUnit" :close-on-click-modal="false">
      <el-form ref="addUnitForm" :model="addUnit" :rules="addUnitRules" label-width="90px" style="width:100%">
        <el-form-item label="部门名称" prop="unit">
          <el-input v-model.trim="addUnit.unit" placeholder="请输入部门名称" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="标识名" prop="alias">
          <el-input v-model.trim="addUnit.alias" placeholder="请输入部门名称的标识名" type="text" style="width:90%" maxlength="64" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="addUnit.comments" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleForm=false">取 消</el-button>
        <el-button type="primary" @click="add_form('addUnitForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改组织" :visible.sync="dialogVisibleEditForm" width="500px" :close-on-click-modal="false">
      <el-form ref="editUnitForm" :model="editUnit" :rules="addUnitRules" label-width="90px" style="width:100%">
        <el-form-item label="部门名称" prop="unit">
          <el-input v-model.trim="editUnit.unit" placeholder="请输入部门名称" style="width:90%"></el-input>
        </el-form-item>
        <el-form-item label="标识名" prop="alias">
          <el-input v-model.trim="editUnit.alias" placeholder="请输入部门名称的标识名" type="text" style="width:90%" maxlength="64" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="editUnit.comments" style="width:90%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEditForm=false">取 消</el-button>
        <el-button type="primary" @click="edit_form('editUnitForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";

import { getRow, addRow, editRow, deleteRow, getFields, getProductCascader2, bulkUpdateProduct, addProjectUnit,
         editProjectUnit, getFieldsAlias } from '@/api/cmdbs/product_line'
import { getUserInfo } from '@/api/zabbix/user_info'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

export default {
  name: 'ProductLine',
  components: { Pagination },
  directives: { waves },
  mixins: [resize, sessionListQuery],

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        cascader_list: [],
        search: undefined
      },
      cascader_list: [],
      projectOptions: [],

      tableData: [],
      total: 0,

      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      dialogVisibleForm:false,
      dialogVisibleEditForm:false,

      listLoading: false,

      adminrole: false,

      userInfoOptions: [],
      rowAdd: {
        unit: '',
        unit_alias: '',
        plate: '',
        plate_alias: '',
        project_name: '',
        project_alias: '',
        sn: [{subsystem_name: '', subsystem_alias: ''}],
        owner: undefined,
        git_name: '',
        git_addr: '',
        git_description: '',
        status: 0,
        change_user: this.name,
        comments: ''
      },

      addUnit:{
        unit: '',
        alias: '',
        plate: '',
        project_name: '',
        subsystem_name: '',
        status: 100,
        change_user: this.name,
        comments: '',
      },
      addUnitRules: {
        unit: [
          { required: true, message: '请输入部门名称', trigger: 'change'},
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入部门名称的标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
      },
      editUnit:{
        id:'',
        unit: '',
        alias: '',
        plate: '',
        project_name: '',
        subsystem_name: '',
        status: '',
        change_user: '',
        comments: '',
      },

      rowEdit: {
        id: '',
        unit: '',
        unit_alias: '',
        plate: '',
        plate_alias: '',
        project_name: '',
        project_alias: '',
        subsystem_name: '',
        subsystem_alias: '',
        owner: undefined,
        git_name: '',
        git_addr: undefined,
        git_description: '',
        status: '',
        change_user: this.name,
        comments: ''
      },

      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },

      rules: {
        unit: [
          { required: true, message: '请输入组织', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        unit_alias: [
          { required: true, message: '请输入组织标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        plate: [
          { required: true, message: '请输入板块', trigger: 'change'},
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        plate_alias: [
          { required: true, message: '请输入板块标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        project_name: [
          { required: true, message: '请输入模块', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        project_alias: [
          { required: true, message: '请输入模块标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        subsystem_name: [
          { required: true, message: '请输入子模块', trigger: 'change'},
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        subsystem_alias: [
          { required: true, message: '请输入子模块标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
      },

      status: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],

      fileds_obj: {},
      fields_alias: {},
      unit: [],
      plate: [],
      project_name: [],
      subsystem_name: [],

      multipleSelection: [],
      bulkButton: true,
      bulkEditDialogVisible: false,
      bulkEdit: {
        id_list: undefined,
        radio: 1,
        name: undefined,
        alias: undefined},
      bulkEditRules: {
        name: [
          { required: true, message: '请输入层级名称', trigger: 'change'},
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入层级名称的标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
      }

    }
  },

  created() {
    this.getRowsInf()

    this.getFieldsInf()

    getProductCascader2().then(response => {
      this.projectOptions = response
    })

    getUserInfo().then(response => {
      this.userInfoOptions = response
    })

    this.adminrole = this.roles.includes('cmdb_admin')
  },

  watch: {
    'rowAdd.unit': 'getPlate',
    'rowAdd.plate': 'getProjectName',
    'rowAdd.project_name': 'getSubsystemName',
    // 'rowAdd.subsystem_name': 'getSubsystemAlias',

    'rowEdit.unit': 'getPlate0',
    'rowEdit.plate': 'getProjectName0',
    'rowEdit.project_name': 'getSubsystemName0',
    'rowEdit.subsystem_name': 'getSubsystemAlias0',

    'bulkEdit.radio': 'getBulkEdit',
    'bulkEdit.name': 'getName',

  },

  mounted() {
  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  filters: {},

  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getRowsInf()
    },

    handleReset() {
      this.resetlistQuery()
      this.getRowsInf()
    },

    getRowsInf() {
      this.listLoading = true
      getRow(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      }).catch(error => {
        this.$message({ message: '调用后端接口getRow出错!'})
        this.listLoading = false
      })
    },

    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        cascader_list: [],
        search: undefined
      }
    },

    handleDelete(row) {
      var msg = '确认删除该记录吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteRow(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getRowsInf()
        }).catch(error => {
          this.$notify({
            title: error.response.status + ' ' + error.response.data.msg,
            message: error.response.data.detail,
            type: 'error',
            duration: 3000
          })
          // console.log(error)
        })
      }, () => {
        return false
      })
    },

//带输入建议
    querySearch(queryString, cb) {
        var unit = this.unit;
        var results = queryString ? unit.filter(this.createFilter(queryString)) : unit;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    querySearch1(queryString, cb) {
        var plate = this.plate;
        var results = queryString ? plate.filter(this.createFilter(queryString)) : plate;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    querySearch2(queryString, cb) {
        var project_name = this.project_name;
        var results = queryString ? project_name.filter(this.createFilter(queryString)) : project_name;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    querySearch3(queryString, cb) {
        var subsystem_name = this.subsystem_name;
        var results = queryString ? subsystem_name.filter(this.createFilter(queryString)) : subsystem_name;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    createFilter(queryString) {
      return (data) => {
        return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item);
    },

//watch相关
    getPlate(val) {
      try {
        let ua = this.fields_alias[1][val]
        if (ua) {
          this.rowAdd.unit_alias = ua
        } else {
          this.rowAdd.unit_alias = undefined
        }
      } catch(error) {
      }
      let plate = []
      try {
        for(let k in this.fields_obj[val]) {
          plate.push({'value': k})
        }
        this.plate = plate
      } catch(error) {
      }
    },
    getProjectName(val) {
      try {
        let ua = this.fields_alias[2][val]
        if (ua) {
          this.rowAdd.plate_alias = ua
        } else {
          this.rowAdd.plate_alias = undefined
        }
      } catch(error) {
      }
      let projectname = []
      try {
        if(this.rowAdd.unit) {
          for(let k in this.fields_obj[this.rowAdd.unit][val]) {
            projectname.push({'value': k})
          }
        }
        this.project_name = projectname
      } catch(error) {
      }
    },
    getSubsystemName(val) {
      try {
        let ua = this.fields_alias[3][val]
        if (ua) {
          this.rowAdd.project_alias = ua
        } else {
          this.rowAdd.project_alias = undefined
        }
      } catch(error) {
      }
      let subsystemname = []
      try {
        if(this.rowAdd.unit && this.rowAdd.plate) {
          for(let k in this.fields_obj[this.rowAdd.unit][this.rowAdd.plate][val]) {
            subsystemname.push({'value': k})
          }
        }
        this.subsystem_name = subsystemname
      } catch(error) {
      }
    },
    getSubsystemAlias(val) {
      try {
        let ua = this.fields_alias[4][val]
        if (ua) {
          this.rowAdd.subsystem_alias = ua
        } else {
          this.rwoAdd.subsystem_alias = undefined
        }
      } catch(error) {
      }
    },
    getPlate0(val) {
      try {
        let ua = this.fields_alias[1][val]
        if (ua) {
          this.rowEdit.unit_alias = ua
        } else {
          this.rowEdit.unit_alias = undefined
        }
      } catch(error) {
      }
      let plate = []
      try {
        for(let k in this.fields_obj[val]) {
          plate.push({'value': k})
        }
        this.plate = plate
      } catch(error) {
      }
    },
    getProjectName0(val) {
      try {
        let ua = this.fields_alias[2][val]
        if (ua) {
          this.rowEdit.plate_alias = ua
        } else {
          this.rowEdit.plate_alias = undefined
        }
      } catch(error) {
      }
      let projectname = []
      try {
        if(this.rowEdit.unit) {
          for(let k in this.fields_obj[this.rowEdit.unit][val]) {
            projectname.push({'value': k})
          }
        }
        this.project_name = projectname
      } catch(error) {
      }
    },
    getSubsystemName0(val) {
      try {
        let ua = this.fields_alias[3][val]
        if (ua) {
          this.rowEdit.project_alias = ua
        } else {
          this.rowEdit.project_alias = undefined
        }
      } catch(error) {
      }
      let subsystemname = []
      try {
        if(this.rowEdit.unit && this.rowEdit.plate) {
          for(let k in this.fields_obj[this.rowEdit.unit][this.rowEdit.plate][val]) {
            subsystemname.push({'value': k})
          }
        }
        this.subsystem_name = subsystemname
      } catch(error) {
      }
    },
    getSubsystemAlias0(val) {
      try {
        let ua = this.fields_alias[4][val]
        if (ua) {
          this.rowEdit.subsystem_alias = ua
        } else {
          this.rowEdit.subsystem_alias = undefined
        }
      } catch(error) {
      }
    },
    getName(val) {
      try {
        let ua = this.fields_alias[this.bulkEdit.radio][val]
        if (ua) {
          this.bulkEdit.alias = ua
        } else {
          this.bulkEdit.alias = undefined
        }
      } catch(error) {
      }
    },
    getBulkEdit(val) {
      this.$refs['bulkEditForm'].resetFields()
    },

    //添加|修改信息后,重新到后台拿数据
    getFieldsInf() {
      getFields().then(response => {
        this.fields_obj = response
        let unit = []
        for(let k in response) {
          unit.push({'value': k})
        }
        this.unit = unit
      })

      getFieldsAlias().then(response => {
        this.fields_alias = response
      })
    },

    handleEdit(data) {
      let row = deepClone(data)
      if (row.status===100) {
        this.editUnit.id = row.id
        this.editUnit.unit = row.unit
        this.editUnit.alias = row.unit_alias
        this.editUnit.comments = row.comments
        this.dialogVisibleEditForm=true
      } else {
        this.rowEdit.id = row.id
        this.rowEdit.unit = row.unit
        this.rowEdit.unit_alias = row.unit_alias
        this.rowEdit.plate = row.plate
        this.rowEdit.plate_alias = row.plate_alias
        this.rowEdit.project_name = row.project_name
        this.rowEdit.project_alias = row.project_alias
        this.rowEdit.subsystem_name = row.subsystem_name
        this.rowEdit.subsystem_alias = row.subsystem_alias
        this.rowEdit.owner = row.owner
        this.rowEdit.git_name = row.git_name
        this.rowEdit.git_addr = row.git_addr
        this.rowEdit.git_description = row.git_description
        this.rowEdit.status = row.status
        this.rowEdit.comments = row.comments
        this.dialogVisibleEdit = true
      }
    },

    addRowInf(formName, rowAdd) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let rowInsertAdd = {
            unit: '',
            unit_alias: '',
            plate: '',
            plate_alias: '',
            project_name: '',
            project_alias: '',
            sn: [],
            owner: undefined,
            git_name: '',
            git_addr: '',
            git_description: '',
            status: 0,
            change_user: this.name,
            comments: ''
          }
          rowInsertAdd.unit = rowAdd.unit
          rowInsertAdd.unit_alias = rowAdd.unit_alias
          rowInsertAdd.plate = rowAdd.plate
          rowInsertAdd.plate_alias = rowAdd.plate_alias
          rowInsertAdd.project_name = rowAdd.project_name
          rowInsertAdd.project_alias = rowAdd.project_alias
          rowInsertAdd.sn = rowAdd.sn
          rowInsertAdd.owner = rowAdd.owner
          rowInsertAdd.git_name = rowAdd.git_name
          rowInsertAdd.git_addr = rowAdd.git_addr
          rowInsertAdd.git_description = rowAdd.git_description
          rowInsertAdd.status = rowAdd.status
          rowInsertAdd.comments = rowAdd.comments
          addRow(rowInsertAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加记录成功',
              type: 'success',
              duration: 3000
            })
            this.dialogVisibleAdd = false
            this.getRowsInf()
            this.getFieldsInf()
          }).catch(error => {
            this.$notify({
              title: error.response.status + ' ' + error.response.data.msg,
              message: error.response.data.detail,
              type: 'error',
              duration: 3000
            })
            this.dialogVisibleAdd = false
          })
          // this.$refs[formName].resetFields()
          this.handleCloseDialogAdd()
        }
      })
    },

    editRowInf(formName, rowEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let rowEditNew = {
            id: '',
            unit: '',
            unit_alias: '',
            plate: '',
            plate_alias: '',
            project_name: '',
            project_alias: '',
            subsystem_name: '',
            subsystem_alias: '',
            owner: undefined,
            git_name: '',
            git_addr: '',
            git_description: '',
            status: 0,
            change_user: this.name,
            comments: ''
          }
          rowEditNew.id = rowEdit.id
          rowEditNew.unit = rowEdit.unit
          rowEditNew.unit_alias = rowEdit.unit_alias
          rowEditNew.plate = rowEdit.plate
          rowEditNew.plate_alias = rowEdit.plate_alias
          rowEditNew.project_name = rowEdit.project_name
          rowEditNew.project_alias = rowEdit.project_alias
          rowEditNew.subsystem_name = rowEdit.subsystem_name
          rowEditNew.subsystem_alias = rowEdit.subsystem_alias
          rowEditNew.owner = rowEdit.owner
          rowEditNew.git_name = rowEdit.git_name
          rowEditNew.git_addr = rowEdit.git_addr
          rowEditNew.git_description = rowEdit.git_description
          rowEditNew.status = rowEdit.status
          rowEditNew.comments = rowEdit.comments
          editRow(rowEditNew.id, rowEditNew).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.dialogVisibleEdit = false
            this.getRowsInf()
            this.getFieldsInf()
          }).catch(error => {
            if (error.response.data) {
              this.$notify({
                title: '修改失败',
                message: '修改出错',
                type: 'error',
                duration: 3000
              })
            }
          })
          // this.$refs[formName].resetFields()
          this.handleCloseDialogEdit()
        }
      })
    },

    handleCloseDialogAdd() {
      this.dialogVisibleAdd = false
      this.$refs['addForm'].resetFields()
      this.rowAdd = {
        unit: '',
        unit_alias: '',
        plate: '',
        plate_alias: '',
        project_name: '',
        project_alias: '',
        sn: [{subsystem_name: '', subsystem_alias: ''}],
        owner: undefined,
        git_name: '',
        git_addr: '',
        git_description: '',
        status: 0,
        change_user: this.name,
        comments: ''
      }
    },
    handleCloseDialogEdit() {
      this.dialogVisibleEdit = false
      this.$refs['editForm'].resetFields()
    },

    removeKey(item) {
      var index = this.rowAdd.sn.indexOf(item)
      if (index !== -1) {
        this.rowAdd.sn.splice(index, 1)
      }
    },
    addKey() {
      if(this.rowAdd.sn.length<=4) {
        this.rowAdd.sn.push({subsystem_name: '', subsystem_alias: ''})
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = []
      for(let i of val) {
        this.multipleSelection.push(i.id)
      }
      if(this.multipleSelection.length>0) {
        this.bulkButton = false
      } else {
        this.bulkButton = true
      }
    },
    handleCloseBulkEdit() {
      this.bulkEditDialogVisible = false
      this.$refs['bulkEditForm'].resetFields()
    },
    showResultMessage(response) {
      let type ='success';
      if (response.failed == 0) {
         type = 'success'
      } else if (response.failed < response.sum) {
         type = 'warning'
      } else if (response.failed == response.sum) {
         type = 'error'
      }
      // let filedips= response.filedips ? response.filedips: ''
      this.$message({
        message:
          response.msg + '! 操作成功：' + response.success +'条， 操作失败：' + response.failed + '条, 总数: ' + response.sum + '.',
          // + '失败IP:' + filedips,
        showClose: true,
        type: type,
        duration: 60000,
      });
      this.getRowsInf()
    },
    onHandleBulkEdit(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          let data = {}
          data.id_list = this.multipleSelection.join()
          data.radio = this.bulkEdit.radio
          data.name = this.bulkEdit.name
          data.alias = this.bulkEdit.alias
          bulkUpdateProduct(data).then(response=>{
            this.showResultMessage(response);
            this.getRowsInf()
            this.getFieldsInf()
          })
          this.bulkEditDialogVisible = false
        }
      })
    },

    edit_form(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {status: 100, plate: '', project_name: '', subsystem_name: '', change_user: this.name}
          data.id = this.editUnit.id
          data.unit = this.editUnit.unit
          data.alias = this.editUnit.alias
          data.comments = this.editUnit.comments
          editProjectUnit(data).then(res=>{
            if (res.status==='success') {
              this.$message({
                title:'成功',
                message:'修改成功',
                type:'success',
                duration:2000
              })
              this.getRowsInf()
            }else {
              this.$message({
                title:'失败',
                message:res.message,
                type:'error',
                duration:3000
              })
            }
          })
          this.dialogVisibleEditForm=false
        }
      })
    },
    add_form(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {status: 100, plate: '', project_name: '', subsystem_name: '', change_user: this.name}
          data.unit = this.addUnit.unit
          data.alias = this.addUnit.alias
          data.comments = this.addUnit.comments
          addProjectUnit(data).then(res=>{
            if (res.status==='success') {
              this.$message({
                title:'成功',
                message:'添加成功',
                type:'success',
                duration:2000
              })
              this.getRowsInf()
            } else {
              this.$message({
                title:'失败',
                message:res.message,
                type:'error',
                duration:3000
              })
            }
          })
          this.dialogVisibleForm=false
        }
      })
    },
    handleCloseAddUnit() {
      this.dialogVisibleForm=false
      this.addUnit={
        unit: '',
        alias: '',
        plate: '',
        project_name: '',
        subsystem_name: '',
        status: 100,
        change_user: '',
        comments: ''
      }
    },

  }
}
</script>

<style lang="scss" scoped>

fieldset {
  margin: 0 62px 10px 55px;
  padding: 10px;
  border-color: #DCDFE6;
  border-style: solid;
  border-width: 2px;
  border-radius: 8px;
  line-height: 20px;
  list-style: none;
}

</style>
