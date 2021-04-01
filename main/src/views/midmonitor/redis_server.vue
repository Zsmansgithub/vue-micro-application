<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.status" placeholder="状态" clearable  @keyup.enter.native="handleFilter" @change="handleFilter">
          <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="listQuery.ip" placeholder="IP地址" clearable @keyup.enter.native="handleFilter" @change="handleFilter" style="width:200px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleBatchSearch">批量查询</el-button>
      </el-form-item>
      <el-form-item v-if="adminrole">
        <el-button type="primary" icon="el-icon-plus" @click="dialogInsertVisible=true">新增记录</el-button>
      </el-form-item>
      <el-form-item v-if="adminrole">
        <el-button type="primary" :disabled="bulkButton" icon="el-icon-edit" @click="bulkDialogVisible=true">批量修改</el-button>
      </el-form-item>
      <el-form-item class="fr" style="margin-right:-2px;" v-if="adminrole">
        <el-button type="warning" :disabled="bulkButton" icon="el-icon-refresh" :loading="refreshFlag" @click="handleExecuteSync">执行同步</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="tableList" border stripe highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="产品线名称" prop="project_name" min-width="200px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>
            {{ scope.row.project_name}}
            <!-- <span v-if="scope.row.subsystem_name =='all'"></span>
            <span v-else-if="scope.row.subsystem_name">_{{scope.row.subsystem_name}}</span> -->
          </span>
        </template>
      </el-table-column>
      <el-table-column label="应用名/功能简介" min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="appFilter(scope.row.app_name)">{{ scope.row.app_name }}</a>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.app_descrip }}</div>
        </template>
      </el-table-column>
            <el-table-column label="环境" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.resource_env_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="125">
        <template slot-scope="scope">
          <a style="color:#1890ff" @click="toServerMonitor(scope.row.ip)">
            {{ scope.row.ip }}
          </a>
          <!-- <span>{{ scope.row.ip }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="实例个数" prop="instance_sum" sortable width="105">
        <template slot-scope="scope">
         <span>{{ scope.row.instance_sum ? scope.row.instance_sum: 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配内存" prop="max_memory" :formatter="format10242" sortable width="105">
      </el-table-column>
      <el-table-column label="使用内存" prop="used_memory" :formatter="format10242" sortable width="105">
      </el-table-column>
      <el-table-column label="系统内存">
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}G</span>
        </template>
      </el-table-column>
      <el-table-column label="当前连接数/文件描述符" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.connected_clients ? scope.row.connected_clients : 0 }} / {{ scope.row.file_descriptors }}</span>
          <!-- <div style="color: #8492a6; font-size: 10px">{{scope.row.connected_received +'/'+ scope.row.rejected_connections  }}</div>-->
        </template>
      </el-table-column>
      <el-table-column label="执行命令数">
        <template slot-scope="scope">
          <span>{{ scope.row.total_commands_processed ? scope.row.total_commands_processed : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.app_owner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0" size="medium">同步</el-tag>
          <el-tag v-if="scope.row.status===100" size="medium">不同步</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120px" fixed="right" v-if="adminrole">
        <template slot-scope="scope">
          <el-button type="primary" circle icon="el-icon-edit"  @click="handleEdit(scope.row);"></el-button>
          <el-button type="danger" circle icon="el-icon-delete"  @click="handleDelete(scope.row);"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getList"
    />

    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" width="45%" :close-on-click-modal="false" @close="handleCloseDialog" >
      <el-input v-model="listQuery.ip_list" type="textarea" :rows="10" placeholder="请输入IP列表,以逗号分隔" />
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="onHandleBatchSearch">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增记录" :visible.sync="dialogInsertVisible" width="600px" :close-on-click-modal="false" @close="insertHandleClose">
      <el-form ref="insertForm" :model="insertForm" :rules="rules" label-width="50px">
        <el-form-item label="IP" prop="ip_all" >
          <el-input v-model="insertForm.ip_all" type="textarea" :rows="10" placeholder="请输入IP列表,以逗号分隔" style="width:500px;"/>
        </el-form-item>
        <el-form-item label="状态" style="width: 100%;">
          <el-select v-model="insertForm.status" style="width:500px;">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInsertVisible=false">取 消</el-button>
        <el-button type="primary" @click="insertConfirm('insertForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改状态" :visible.sync="dialogVisible" width="400px" @close="handleClose" :close-on-click-modal="false">
      <el-form ref="poolForm" :model="editForm" label-width="100px">
        <el-form-item label="状态" min-width="100">
          <el-select v-model="editForm.status">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改" :visible.sync="bulkDialogVisible" width="400px" @close="bulkHandleClose" :close-on-click-modal="false">
      <el-form ref="poolForm" :model="bulkEditForm" label-width="50px">
        <el-form-item label="状态" min-width="100">
          <el-select v-model="bulkEditForm.status" style="width:100%;">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="bulkConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import { format1024 } from '@/utils/format-function'
import { getRow, editRow, validateCreateRedisPy, addRow, deleteRow, bulkUpdateRow, executeSync } from '@/api/midmonitor/redis_server'
import Pagination from '@/components/Pagination'
import {mapGetters} from 'vuex'
import {validIp} from '@/utils/validate'

export default {
  name: 'RedisServerMonitor',
  components: { Pagination },
  directives: { waves },
  mixins: [resize, sessionListQuery],
  data() {
    const validateIpaddress = (rule, value, callback) => {
      if(value) {
        for(let ip of value.trim().split(/[,;\/\-|\s]+/)) {
          if(validIp(ip)) {
            // callback()
          } else {
            return callback(new Error(ip + '--此IP填写不正确!'))
          }
        }
      } else {
        return callback(new Error('请输入IP!'))
      }
      validateCreateRedisPy({ip: value.trim().split(/[,;\/\-|\s]+/).join(',')}).then(response => {
        if (response.status == 400) {
          callback(new Error(response.msg))
        } else if (response.status == 200) {
          callback()
        }
      })
    }
    return {
      status: [{ value: 0, label: '同步' }, { value: 100, label: '不同步' }],
      listQuery: {
        page: 1,
        limit: 20,
        ip: undefined,
        ip_list: undefined,
      },
      adminrole: false,
      listLoading: false,
      tableList: [],
      total: 0,
      dialogVisible: false,
      bulkDialogVisible: false,
      editForm: {
        id: '',
        status: '',
        resourcemanage: '',
        ip_all: ''
      },
      bulkEditForm: {
        status: '',
        change_user: this.name
      },
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning',
        dangerouslyUseHTMLString: true
      },
      dialogInsertVisible: false,
      insertForm: {ip_all: undefined, status: 0},
      rules: {
        ip_all: [{required: true, validator: validateIpaddress, trigger: 'blur'}],
      },
      multipleSelection: [],
      bulkButton: true,
      dialogSearchVisible: false,
      refreshFlag: false,
    }
  },
  created() {
    this.adminrole = this.roles.includes('redis_admin')
    this.getList()
  },
  computed: {
    ...mapGetters(['roles', 'name']),
  },
  methods: {
    handleFilter() {
      this.listQuery.page=1
      this.listQuery.ip_list = undefined
      this.getList()
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    format10242(row, column, cellValue){
     if (column.label == '分配内存') {
        return row.max_memory ? format1024(row.max_memory) : 0
      }else if (column.label == '使用内存'){
        return row.used_memory ? format1024(row.used_memory) : 0
      }
    },
    getList() {
      this.listLoading = true
      getRow(this.listQuery).then(response => {
        this.tableList = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        ip: undefined,
        ip_list: undefined,
      }
    },
    handleEdit(row) {
      this.dialogVisible=true
      this.editForm.id=row.id
      this.editForm.status=row.status
      this.editForm.resourcemanage=row.resourcemanage
      this.editForm.ip_all=row.ip_all
    },
    confirm() {
      editRow(this.editForm.id, this.editForm).then(response=>{
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 3000
        })
        this.getList()
      })
      this.dialogVisible=false
    },
    handleClose() {
      this.dialogVisible = false
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
      let filedips= response.filedips ? response.filedips: ''
      this.$message({
        message:
          response.msg +'! 操作成功：' + response.success + '条， 操作失败：' + response.failed +'条, 总数: ' + response.sum + '.',
          // + '失败IP:' + filedips,
        showClose: true,
        type: type,
        duration: 60000,
      });
      this.getList()
    },
    bulkHandleClose() {
      this.bulkDialogVisible = false
      this.bulkEditForm.status = ''
    },
    bulkConfirm() {
      bulkUpdateRow({status: this.bulkEditForm.status, id_list: this.multipleSelection.join()}).then(response => {
        this.showResultMessage(response);
        // this.getList()
      })
      this.bulkDialogVisible=false
    },

    insertHandleClose() {
      this.dialogInsertVisible = false
      this.insertForm = {ip_all: undefined, status: 0}
    },
    insertConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          this.insertForm.ip_all = this.insertForm.ip_all.trim().split(/[,;\/\-|\s]+/).join(',')
          addRow(this.insertForm).then(response => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
            this.dialogInsertVisible = false
          })
        }

      })
    },

    appFilter(name) {
      this.$router.push({ name: 'appconfig', query: { app_cname_i: name }})
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
          this.getList()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
          // console.log(error)
        })
      })
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

    handleBatchSearch() {
      this.listQuery.ip_list = undefined
      this.dialogSearchVisible = true
    },
    handleCloseDialog() {
      this.dialogSearchVisible = false
    },
    onHandleBatchSearch() {
      this.listQuery.ip_list = this.listQuery.ip_list.trim().split(/[,;\/\-|\s]+/).join(',')
      this.getList()
      this.dialogSearchVisible = false
    },

    handleExecuteSync() {
      var msg = ['确认执行同步操作?',
                '1.获取此server的cpu|memory同步至资源管理表.',
                '2.获取此server所有redis实例并在redis实例表中创建.',
                '3.确认redis实例类型及关系并同步至redis集群表.'].join('\n')
      msg = '<pre>' + msg + '</pre>'
      // let msg = '确认执行同步操作?'

      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        this.refreshFlag = true
        executeSync({id_list: this.multipleSelection.join()}).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success'
          })
          this.refreshFlag = false
          // if(response.status==400) {
          //   this.$message.error(response.data.msg)
          // } else if(response.status==200) {
          //   if(response.msg=="The task executed successfully!") {
          //     this.$message.success(response.msg)
          //   } else {
          //     this.$message.error(response.msg)
          //   }
          // }
          this.getList()
        }).catch(error => {
          this.$notify.error({
            title: '请求错误',
            message: error.response.data.error
          })
          this.refreshFlag = false
        })
        // this.refreshFlag = false
      })
    },

    toServerMonitor(item) {
      this.$router.push({ name: 'KeyboardChart', query: { ip: item }})
    },

  }

}
</script>
<style>

</style>
