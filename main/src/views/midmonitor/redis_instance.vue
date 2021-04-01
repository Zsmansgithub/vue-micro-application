<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item prop="status">
        <el-select v-model="listQuery.status" clearable placeholder="监控状态"  @change="handleFilter" style="width:150px">
          <el-option v-for="item in status_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
          <!-- <el-option value="0" label="监控中">监控中</el-option>
          <el-option value="1" label="异常中" >异常中</el-option>
          <el-option value="20" label="未监控" >未监控</el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item prop="env">
        <el-select v-model="listQuery.rediscluster__cluster_type" clearable placeholder="集群类型"  @change="handleFilter" style="width:150px">
          <el-option v-for="item in redisclustertype" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="instance_version">
        <el-select v-model="listQuery.instance_version" clearable placeholder="Redis版本" @change="handleFilter" style="width:150px">
          <el-option value="2.6.16"></el-option>
          <el-option value="3.0.0"></el-option>
          <el-option value="3.0.7"></el-option>
          <el-option value="3.2.0"></el-option>
          <el-option value="4.0.0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="listQuery.ip_port" placeholder="IP:PORT" clearable @change="handleFilter" @keyup.native.enter="handleFilter" style="width:250px;"/>
      </el-form-item>
      <!-- <el-form-item>
        <el-input v-model.trim="listQuery.port" placeholder="端口号" style="width: 150px;" @keyup.enter.native="handleFilter" class="filter-item" />
      </el-form-item> -->
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
        <el-button type="primary" icon="el-icon-search" @click="handleBatchSearch">批量查询</el-button>
      </el-form-item>
      <el-form-item v-if="adminrole">
        <el-button type="primary" :disabled="bulkButton" icon="el-icon-edit" @click="bulkEditDialogVisible=true">批量修改</el-button>
      </el-form-item>
      <el-form-item v-if="adminrole">
        <el-button type="danger" :disabled="bulkButton" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="tableList" border highlight-current-row 
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChange">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="监控状态" width="90px" align="center" >
        <template slot-scope="scope">
          <el-badge :value="null" :max="99" class="el-badge-item">
            <el-button v-if="scope.row.status==0" size="mini" type="success">监控中</el-button>
            <el-button v-else-if="scope.row.status==1" size="mini" type="danger">异常中</el-button>
            <el-button v-else size="mini" type="warning">未监控</el-button>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column label="集群名称" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="rowFilter(scope.row.rediscluster, scope.row.cluster_name)">{{ scope.row.cluster_cname }}</a>
          <div style="color: #8492a6; font-size: 10px">类型:{{scope.row.cluster_type }}</div>
        </template>
      </el-table-column>
      <el-table-column label="实例类型" width="82">
        <template slot-scope="scope">
          <span>{{ scope.row.instance_type }}</span>
          <div style="color: #8492a6; font-size: 10px">版本:{{scope.row.instance_version }}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="155">
        <template slot-scope="scope">
          <span v-if="scope.row.instance_type =='master' ">
            <span>{{ scope.row.ip +':'+ scope.row.port }}</span>
            <div v-if="scope.row.master_ip" style="color: #8492a6; font-size: 10px">S:{{scope.row.master_ip}}</div>
          </span>
          <span v-else>
            <span>{{ scope.row.ip +':'+ scope.row.port }}</span>
            <div style="color: #8492a6; font-size: 10px">M:{{scope.row.master_ip}}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="持久化" width="65">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light"  placement="top" >
            <div slot="content">AOF写入状态:{{scope.row.aof_last_bgrewrite_status }}<br/>AOF最后写入状态:{{scope.row.aof_last_write_status }}</div>
            <span v-if="scope.row.aof_enabled==1">是</span>
            <span v-else>否</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="cpu_used" sortable="custom" label="CPU" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.cpu_used }}%</span>
          <el-tooltip class="item" effect="light" content="User/Sys"  placement="top">
          <div style="color: #8492a6; font-size: 10px">{{scope.row.used_cpu_user +' / '+ scope.row.used_cpu_sys  }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="mem_used" sortable="custom" label="使用率/碎片率" min-width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.mem_used +'% / '+scope.row.mem_fragmentation_ratio + '%' }}</span>
           <el-tooltip class="item" effect="light" content="峰值内存/最大内存"  placement="top">
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.used_memory_peak_human+' / '+scope.row.maxmemory_human }}</div>
           </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="client_rate" sortable="custom" label="连接率/连接数" min-width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.client_rate+'% / '+scope.row.connected_clients }}</span>
          <el-tooltip class="item" effect="light" content="接收连接数/拒绝连接数/最大连接数"  placement="top" >
            <div style="color: #8492a6; font-size: 10px">{{ scope.row.connected_received +' / '+ scope.row.rejected_connections +' / '+ scope.row.max_clients }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="instantaneous_ops_per_sec" sortable="custom" label="OPS/命令数" min-width="125">
        <template slot-scope="scope">
          <span>{{ scope.row.instantaneous_ops_per_sec }}</span>
          <div style="color:#8492a6;">{{ scope.row.total_commands_processed }}</div>
        </template>
      </el-table-column>
      
      <el-table-column prop="instantaneous_output_kbps" label="入/出流量(k)" :formatter="format1024Nested" min-width="125">
      </el-table-column>
      <el-table-column prop="keyspace_misses" label="命中率" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.keyspace_misses ? parseFloat(scope.row.keyspace_hits*100/(scope.row.keyspace_hits+scope.row.keyspace_misses)).toFixed(2)+'%' : '100%' }}</span>
             <el-tooltip class="item" effect="light" content="命中数/失败数"  placement="top" >
          <div style="color: #8492a6; font-size: 10px">{{scope.row.keyspace_hits +' / '+scope.row.keyspace_misses }}</div>
             </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column  prop="keys" label="Key/过期数" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.keys }}</span>
          <el-tooltip class="item" effect="light" content="过期数"  placement="top" >
          <div style="color: #8492a6;">{{ scope.row.expires }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="evicted_keys" sortable  label="剔除/过期数" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.evicted_keys+' / '+ scope.row.expired_keys }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监控时间" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.f_update_time }}</span>
          <div style="color: #8492a6; font-size: 10px">运行{{ scope.row.uptime }}天</div>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="50" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110px" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" icon="el-icon-rank"  @click="handleEditCluster(scope.row);" /> -->
          <el-button type="text" @click="handleDetail(scope.row)">
            <svg-icon icon-class="data1" style="width:16px;height:16px;color:#1890FF;"/>
          </el-button>
          <el-button type="text" icon="el-icon-edit" style="font-size:18px;color:#1890FF;" v-if="adminrole" @click="handleEditRow(scope.row)" />
          <el-button type="text" icon="el-icon-delete" style="font-size:18px;color:#FF4949;" v-if="adminrole" @click="handleDelete(scope.row)" />
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
      <el-input v-model="listQuery.ip_list" type="textarea" :rows="15" placeholder="请输入IP:PORT列表,以逗号分隔" />
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改记录" :visible.sync="editDialogVisible" width="400px" @close="handleCloseEdit" :close-on-click-modal="false">
      <el-form ref="poolForm" :model="editForm" label-width="50px">
        <el-form-item label="状态" min-width="100">
          <el-select v-model="editForm.status" style="width:100%;">
            <el-option v-for="item in status_list" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" min-width="100">
          <el-input v-model.trim="editForm.comments" type="text" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseEdit">取 消</el-button>
        <el-button type="primary" @click="onHandleEdit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改" :visible.sync="bulkEditDialogVisible" width="400px" @close="handleCloseBulkEdit" :close-on-click-modal="false">
      <el-form :model="bulkEditForm" label-width="50px">
        <el-form-item label="状态" min-width="100">
          <el-select v-model="bulkEditForm.status" style="width:100%;">
            <el-option v-for="item in status_list" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" min-width="100">
          <el-input v-model.trim="bulkEditForm.comments" type="text" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBulkEdit">取 消</el-button>
        <el-button type="primary" @click="onHandleBulkEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";

import { fetchList, deleteRow, BulkDeleteInstance, redisInstanceUpdate, redisInstanceBulkUpdate } from '@/api/midmonitor/redis'
import Pagination from '@/components/Pagination'
import { format1024 } from '@/utils/format-function'
import { mapGetters } from 'vuex'
import { validIp } from '@/utils/validate'

const redisclustertype = [{value: 'cluster', label: 'Cluster'}, {value: 'master_slave', label: 'MasterSlave'},
                          {value: 'standalone', label: 'Standalone'}, {value: 'sentinel', label: 'Sentinel'}]

export default {
  name: 'redisInstance',
  components: { Pagination },
  directives: { waves },
  mixins: [resize, sessionListQuery],

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        cluster_name: undefined,
        instance_version: undefined,
        ip: undefined,
        port: undefined,
        ip_list: '',
        rediscluster__cluster_type: undefined,
        status: undefined,
        ip_port: undefined,
        search: undefined,
        sort_prop: undefined,
        sort_order: undefined
      },

      listLoading: false,
      tableList: [],
      total: 0,

      redisclustertype: redisclustertype,
      status_list: [{label: '监控中', value: 0}, {label: '异常中', value: 1}, {label: '未监控', value: 20}],

      dialogSearchVisible: false,

      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning',
      },
      bulkButton: true,
      multipleSelection: [],

      editDialogVisible: false,
      editForm: {id: undefined, status: undefined, comments: undefined},
      bulkEditDialogVisible: false,
      bulkEditForm: {id_list: undefined, status: 20, comments: undefined, change_user: this.name},

    }
  },

  created() {
    this.getList()

    this.adminrole = this.roles.includes('redis_admin')
  },

  computed: {
  ...mapGetters(['roles', 'name'])
  },

  watch: {

  },

  methods: {
//过滤相关
    handleFilter() {
      this.listQuery.page=1
      this.listQuery.ip_list = ''
      this.getList()
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    format1024Nested(row, column, cellValue) {
      return format1024(row.instantaneous_input_kbps*8*1000)+' / '+format1024(row.instantaneous_output_kbps*8*1000)
    },
    getList() {
      this.listLoading = true
      let ip_port = this.listQuery.ip_port
      if(ip_port) {
        let lst = ip_port.split(/[:]/)
        if(lst[0]) {
          this.listQuery.ip = lst[0]
          if(lst[1]) {
            this.listQuery.port = lst[1]
          } else {
            this.listQuery.port = undefined
          }
        } else {
          this.listQuery.ip = undefined
        }
      } else {
        this.listQuery.ip = undefined
        this.listQuery.port = undefined
      }
      fetchList(this.listQuery).then(response => {
        this.tableList = response.data.results
        this.total = response.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },

    rowFilter(app, app_name) {
      this.listQuery={
        page: 1,
        limit: 20,
        rediscluster_id: app,
      }
      this.getList()
    },

    resetlistQuery() {
      this.listQuery = this.$options.data().listQuery;
    },

    handleDetail(row) {
      const ip=row.ip+':'+row.port
      this.$router.push({ name: 'redis_instance_detail', params: { id: row.id ,ip:ip }})
    },

    handleDelete(row) {
      this.$confirm('确认删除该实例吗?',
                    '提示',
                    {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'}).then(() => {
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
            message: error,
            type: 'error',
            duration: 3000
          })
        })
      })
    },

    handleBatchSearch() {
      this.listQuery.ip_list = ''
      this.dialogSearchVisible = true
    },
    handleCloseDialog() {
      // this.listQuery.ip_list = undefined
      this.dialogSearchVisible = false
    },
    onSubmitDialogButton() {
      this.listQuery.ip_list = this.listQuery.ip_list.trim().split(/[,;\/\-|\s]+/).join(',')
      this.getList()
      this.dialogSearchVisible = false
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
    handleBatchDelete() {
      let msg = '确认删除选中的实例?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        BulkDeleteInstance({id_list: this.multipleSelection.join()}).then(response => {
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
            message: error,
            type: 'error',
            duration: 3000
          })
        })
      })
    },

    handleEditRow(row) {
      this.editForm.id = row.id
      this.editForm.status = row.status
      this.editForm.comments = row.comments
      this.editDialogVisible = true
    },

    onHandleEdit() {
      redisInstanceUpdate(this.editForm.id, this.editForm).then(response=>{
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 3000
        })
        this.getList()
      })
      this.editDialogVisible=false
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
      this.getList()
    },
    onHandleBulkEdit() {
      this.bulkEditForm.id_list = this.multipleSelection.join()
      redisInstanceBulkUpdate(this.bulkEditForm).then(response=>{
        this.showResultMessage(response.data);
      })
      this.bulkEditDialogVisible = false
    },

    handleCloseEdit() {
      this.editDialogVisible = false
      this.editForm = this.$options.data().editForm
    },
    handleCloseBulkEdit() {
      this.bulkEditDialogVisible = false
      this.bulkEditForm = this.$options.data().bulkEditForm
    },

    handleSortChange(val) {
      this.listQuery.sort_prop = val.prop
      this.listQuery.sort_order = val.order
      this.getList()
    },

    tableRowClassName({row, rowIndex}) {
      if (row.cluster_status == 10) {
        return 'cachecloud-row';
      }
      return '';
    }

  }
}
</script>

<style>
.el-table .cachecloud-row {
  background: #f0f9eb;
}
</style>
