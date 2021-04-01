<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="名称" clearable @change="handleFilter" class="filter-item">
          </el-input>
        </el-form-item>
        <el-form-item>
          <!--          <el-input v-model="listQuery.type" style="width: 100%" placeholder="类型" clearable @change="handleFilter">-->
          <!--          </el-input>-->
          <el-select v-model="listQuery.type" style="width: 100%" placeholder="类型" clearable @change="handleFilter">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="listQuery.domain_ip" style="width: 100%" placeholder="域名或ip" clearable @change="handleFilter">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.port" style="width: 100%" placeholder="port" clearable @change="handleFilter"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.need_delete" style="width: 100%" placeholder="状态变更" clearable @change="handleFilter">
            <el-option v-for="item in ['等待新增','等待更新','等待删除']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" v-if="adminrole" plain icon="el-icon-plus" type="primary" @click="dialogAddVisible=true">新增
        </el-button>
        <!--        <el-button class="filter-item" plain icon="el-icon-edit" type="success" :disabled="disable_batch_confirm"-->
        <!--                   @click="clickBatchConfirm" v-if="adminrole">批量确认-->
        <!--        </el-button>-->

      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column label="ID" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="400px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="域名或者IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.domain_ip}}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.port}}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更人/更新时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.change_user}}</span>
          <div style="color: #909399;font-size: 10px">{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否有变更" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.need_update>0" style="color:orange">等待更新</span>
          <span v-else-if="scope.row.need_update===0" style="color:green">等待新增</span>
          <span v-else-if="scope.row.need_delete" style="color:red">等待删除</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" v-if="adminrole || in_host_group">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="确认更新" placement="top">
            <el-button :disabled="(!scope.row.need_delete && scope.row.need_update === -1) || (!in_host_group && !adminrole)" type="success" plain
                       circle icon="el-icon-check" @click="clickConfirmUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-button type="primary" icon="el-icon-edit" plain circle @click="handleEdit(scope.row);" v-if="adminrole"/>
          <el-button type="danger" icon="el-icon-delete" plain circle v-if="adminrole"
                     @click="handleDelete(scope.row);"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="新增记录" :visible.sync="dialogAddVisible" style="text-align: left;" width="60%" @close="handleClose"
               :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" :rules="rules">
        <el-form-item>
          <div>
            <el-table :data="addForm.config_info">
              <el-table-column prop="name" label="名称" align="center" min-width="4">
                <template slot-scope="scope">
                  <el-form-item :prop="'config_info.' + scope.$index + '.name'"
                                :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-input v-model.trim="scope.row.name" style="width:100%;"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="类型" align="center" min-width="4">
                <template slot-scope="scope">
                  <el-form-item :prop="'config_info.' + scope.$index + '.type'"
                                :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-input v-model.trim="scope.row.type" style="width: 100%;"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="domain_ip" label="域名或IP" align="center" min-width="5">
                <template slot-scope="scope">
                  <el-form-item :prop="'config_info.' + scope.$index + '.domain_ip'"
                                :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-input v-model.trim="scope.row.domain_ip" style="width: 100%;"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="port" label="端口" align="center" min-width="5">
                <template slot-scope="scope">
                  <el-form-item :prop="'config_info.' + scope.$index + '.port'"
                                :rules="{type:'string',required:true,message:'不能为空',trigger:'change',validator: validatePort,}">
                    <el-input v-model.trim="scope.row.port" placeholder="多端口以英文逗号分隔" style="width: 100%;"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="comment" label="备注" align="center" min-width="4">
                <template slot-scope="scope">
                  <el-form-item :prop="'config_info.' + scope.$index + '.comment'">
                    <el-input v-model.trim="scope.row.comment" style="width: 100%;"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" min-width="2">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;"
                             @click="addDomain()">
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle
                             style="padding:2px;" @click="removeDomain(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 0px">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogEditVisible" style="text-align: left;" width="30%">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="editForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model.trim="editForm.type" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="域名或IP" prop="domain_ip">
          <el-input v-model.trim="editForm.domain_ip" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model.trim="editForm.port" style="width: 100%" placeholder="多端口以英文逗号分隔"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="editForm.comment" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 28px">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import {addList, deleteList, editList, fetchList, getMqType, confirmUpdate, beforeUpdate} from '@/api/tools/workflow_mq_config'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import {mapGetters} from 'vuex'
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";

  export default {
    name: "workflow_mq_config",
    directives: {waves},
    mixins: [resize],
    components: {Pagination, el_button_wait},
    data() {
      const validatePort = (rule, value, callback) => {
        if (value) {
          if (/^(([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]),)*([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value)) {
            callback()
          } else {
            callback(new Error('port填写不正确'))
          }
        } else {
          callback()
        }
      }
      return {
        validatePort: (rule, value, callback) => {
          if (value) {
            if (/^(([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]),)*([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value)) {
              callback()
            } else {
              callback(new Error('port填写不正确'))
            }
          } else {
            callback()
          }
        },
        selected_rows: [],
        disable_batch_confirm: true,
        listQuery: {
          page: 1,
          limit: 20,
          type: undefined,
          name: undefined,
          domain_ip: undefined,
          port: undefined,
        },
        list: [],
        total: 0,
        listLoading: true,
        dialogAddVisible: false,
        dialogEditVisible: false,
        adminrole: false,
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 50, message: '长度不能超过50个字符', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请输入类型', trigger: 'blur'},
            {max: 10, message: '长度不能超过10个字符', trigger: 'blur'}
          ],
          domain_ip: [
            {required: true, message: '请输入域名或ip', trigger: 'blur'},
            {max: 100, message: '长度不能超过100个字符', trigger: 'blur'}
          ],
          port: [
            {required: true, message: '请输入端口', trigger: 'blur'},
            // {max: 50, message: '长度不能超过50个字符', trigger: 'blur'},
            {validator: validatePort, message: '多端口以英文逗号分隔'}
          ],
        },
        addForm: {
          config_info: [{
            name: '',
            type: '',
            domain_ip: '',
            port: '',
            status: 1,
            comment: '',
          }],
          change_user: this.name,
        },
        editForm: {
          id: '',
          name: '',
          type: '',
          domain_ip: '',
          port: '',
          comment: '',
          change_user: '',
        },
        config_info_dict: {
          name: '',
          type: '',
          domain_ip: '',
          port: '',
          status: '',
          comment: '',
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        typeOptions: []
      }
    },
    created() {
      this.getList()
      console.log(this.roles)
      this.adminrole = this.roles.includes('config_firewall')
      this.in_host_group = this.roles.includes('config_firewall_for_host_group')
      getMqType().then(res => {
        this.typeOptions = res.data
      })
    },
    computed: {
      ...mapGetters(['roles', 'name'])
    },
    methods: {
      handleSelectionChange(rows) {
        this.selected_rows = rows;
        this.disable_batch_confirm = rows.length === 0
        console.log(this.disable_batch_confirm)
      },
      clickBatchConfirm() {
        let ids = this.selected_rows.map(x => x.id)
        ids = ids.toString()
        beforeUpdate({ids: ids}).then(res => {
          res = res.data.success
          let msg = '新增:<br>' + JSON.stringify(res.add) + '<br>删除:<br>' + JSON.stringify(res.del) +
            '<br>更新前:<br>' + JSON.stringify(res.old) + '<br>更新后:<br>' + JSON.stringify(res.new)
          this.$confirm(msg, '请确认以下变更', {dangerouslyUseHTMLString: true, customClass: 'foo_confirm_class'}).then(() => {
            confirmUpdate({ids: ids}).then(res => {
              console.log(ids)
              if (res.data.success) {
                this.$notify({
                  title: '成功',
                  message: '确认成功',
                  type: 'success',
                  duration: 3000
                });
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '确认失败',
                  type: 'warning',
                  duration: 3000
                })
              }
            })
          })
        })
      },
      foo_format(input) {
        let res_data = ''
        for (let item of input) {
          for (let i of Object.keys(item)) {
            res_data += (i + ':' + item[i] + '<br>')
          }
        }
        return res_data
      },
      clickConfirmUpdate(row) {
        beforeUpdate({ids: row.id}).then(res => {
          res = res.data.success

          let msg = '新增:<br>' + JSON.stringify(res.add) + '<br>删除:<br>' + JSON.stringify(res.del) +
            '<br>更新前:<br>' + JSON.stringify(res.old) + '<br>更新后:<br>' + JSON.stringify(res.new)
          this.$confirm(msg, '请确认以下变更', {dangerouslyUseHTMLString: true, customClass: 'foo_confirm_class'}).then(() => {
            confirmUpdate({ids: row.id}).then(res => {
              if (res.data.success) {
                this.$notify({
                  title: '成功',
                  message: '确认成功',
                  type: 'success',
                  duration: 3000
                })
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '确认失败',
                  type: 'warning',
                  duration: 3000
                })
              }
            })
          })
        })

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogAddVisible = false
        this.dialogEditVisible = false
      },
      addDomain() {
        const configinfo = Object.assign({}, this.config_info_dict)
        configinfo.status = 2
        this.addForm.config_info.push(configinfo)
      },
      removeDomain(item) {
        let index = this.addForm.config_info.indexOf(item)
        if (index !== -1) {
          this.addForm.config_info.splice(index, 1)
        }
      },
      handleDelete(row) {
        let msg = '确定删除该信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteList(row.id).then(response => {
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
      handleEdit(row) {
        this.dialogEditVisible = true
        this.editForm.id = row.id
        this.editForm.type = row.type
        this.editForm.name = row.name
        this.editForm.domain_ip = row.domain_ip
        this.editForm.port = row.port
        this.editForm.comment = row.comment
        this.editForm.change_user = this.name
      },
      edit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editList(this.editForm.id, this.editForm).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            }).catch(error => {
              this.$message({
                message: error
              })
            })
            this.dialogEditVisible = false
          } else {
            return this.$message({
              message: '请填写必填字段',
              type: 'warning'
            })
          }
        })
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addForm.change_user = this.name
            addList(this.addForm).then(res => {
              console.log(res)
              console.log(typeof res)
              this.$message({
                title: '执行结果',
                message: '总共:' + res.data.total + '条,成功:' + res.data.success + '条,失败' + res.data.error + '条',
                type: 'success',
                duration: 3000
              })
              this.getList()
            }).catch(error => {
              this.$message({
                message: error
              })
            })
            this.dialogAddVisible = false
          } else {
            return this.$message({
              message: '请填写必填字段',
              type: 'warning'
            })
          }
        })
      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.results
          this.total = response.data.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          type: undefined,
          domain_ip: undefined,
          name: undefined,
          port: undefined,
        }
        this.getList()
      },
      handleClose() {
        this.addForm = {
          config_info: [{
            name: '',
            type: '',
            domain_ip: '',
            port: '',
            status: 1,
            comment: '',
          }],
          change_user: this.name,
        }
      }
    }
  }
</script>

<style>
  .foo_confirm_class {
    width: 800px;
  }


</style>
