<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model="listQuery.type" placeholder="资源类型" clearable @change="handleFilter" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.name" style="width: 100%" filterable clearable @change="handleFilter">
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.time" type="month" placeholder="选择月" @change="handleFilter" value-format="yyyy-MM"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" plain icon="el-icon-plus" type="primary" @click="dialogAddVisible=true">新增
        </el-button>
        <!--        <el-button class="filter-item" plain icon="el-icon-edit" :disabled="disabled1" type="success"-->
        <!--                   @click="dialogEditVisible=true">批量修改-->
        <!--        </el-button>-->
        <!--        <div style="text-align: right">-->
        <!--          <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="handleDownload"-->
        <!--                     :loading="downloadLoading">导出-->
        <!--          </el-button>-->
        <!--        </div>-->
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="资源类型" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CPU">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='虚拟机'">{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='虚拟机'">{{ scope.row.mem }}</span>
        </template>
      </el-table-column>
      <el-table-column label="容量">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='虚拟机'">{{ scope.row.disk }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='物理机'">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置" width="320">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='物理机'">{{ scope.row.conf }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='物理机'">{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格浮动时间" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain circle @click="handleEdit(scope.row);"/>
          <el-button type="danger" icon="el-icon-delete" plain circle
                     @click="handleDelete(scope.row);"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="添加价格" :visible.sync="dialogAddVisible" style="text-align: left;" width="30%" @close="handleClose"
               :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="资源类型">
          <el-select v-model="addForm.type" placeholder="请选择资源类型" class="filter-item"
                     style="width: 100%" @change="handleChange">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="CPU" v-if="f1">
          <el-input-number v-model.trim="addForm.cpu" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="内存" v-if="f1">
          <el-input-number v-model.trim="addForm.mem" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="容量" v-if="f1">
          <el-input-number v-model.trim="addForm.disk" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="名称" v-if="f2">
          <el-input v-model.trim="addForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="配置" v-if="f2">
          <el-input v-model.trim="addForm.conf" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="价格" v-if="f2">
          <el-input-number v-model.trim="addForm.money" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="价格浮动时间" min-width="100">
<!--          <el-input v-model.trim="addForm.time" style="width: 100%"></el-input>-->
          <el-date-picker v-model="addForm.time" type="month" placeholder="选择月" style="width: 100%" value-format="yyyy-MM"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 0px">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改价格" :visible.sync="dialogEditVisible" style="text-align: left;" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="资源类型">
          <el-select v-model="editForm.type" placeholder="请选择资源类型" class="filter-item"
                     style="width: 100%">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="CPU" v-if="editForm.type==='虚拟机'">
          <el-input-number v-model.trim="editForm.cpu" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="内存" v-if="editForm.type==='虚拟机'">
          <el-input-number v-model.trim="editForm.mem" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="容量" v-if="editForm.type==='虚拟机'">
          <el-input-number v-model.trim="editForm.disk" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="名称" v-if="editForm.type==='物理机'">
          <el-input v-model.trim="editForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="配置" v-if="editForm.type==='物理机'">
          <el-input v-model.trim="editForm.conf" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="价格" v-if="editForm.type==='物理机'">
          <el-input-number v-model.trim="editForm.money" :min="0"
                           controls-position="right" class="filter-item" style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="价格浮动时间">
<!--          <el-input v-model.trim="editForm.time" style="width: 100%"></el-input>-->
          <el-date-picker v-model="editForm.time" type="month" placeholder="选择月" style="width: 100%" value-format="yyyy-MM"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 28px">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import {fetchList, addMachine, editMachine, deleteMachine} from '@/api/tools/machine_config'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: "resource_manage",
    directives: {waves},
    mixins: [resize],
    components: {Pagination},
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          type: undefined,
          name: undefined,
          time: undefined,
        },
        list: [],
        total: 0,
        listLoading: true,
        dialogAddVisible: false,
        dialogEditVisible: false,
        adminrole:false,
        f1: false,
        f2: false,
        statusOptions: [{value: '物理机', label: '物理机'}, {value: '虚拟机', label: '虚拟机'}],
        appOptions:[{'label':'DB','value':'DB'},{'label':'ES','value':'ES'},{'label':'VM','value':'VM'},{'label':'MQ','value':'MQ'},
        {'label':'REDIS','value':'REDIS'},{'label':'HADOOP','value':'HADOOP'},{'label':'HOTDB','value':'HOTDB'}],
        addForm: {
          type: '',
          cpu: 0,
          mem: 0,
          disk: 0,
          conf: '',
          money: 0,
          time: '',
          name: '',
          change_user: this.name,
        },
        editForm: {
          id: '',
          type: '',
          cpu: '',
          mem: '',
          name: '',
          disk: '',
          conf: '',
          money: '',
          time: '',
          change_user: '',
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
      }
    },
    created() {
      this.getList()
      this.adminrole=this.roles.includes('resource_manage')
    },
    computed: {
      ...mapGetters(['roles', 'name'])
    },
    methods: {
      handleChange(val) {
        if (val === '虚拟机') {
          this.f1 = true
          this.f2 = false
        } else {
          this.f2 = true
          this.f1 = false
        }
      },
      handleDelete(row) {
        let msg = '确定删除该信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteMachine(row.id).then(response => {
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
        this.editForm.cpu = row.cpu
        this.editForm.mem = row.mem
        this.editForm.disk = row.disk
        this.editForm.conf = row.conf
        this.editForm.money = row.money
        this.editForm.time = row.time
        this.editForm.name = row.name
        this.editForm.change_user = this.name
      },
      edit() {
        editMachine(this.editForm.id, this.editForm).then(res => {
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
      },
      confirm() {
        this.addForm.change_user = this.name
        addMachine(this.addForm).then(res => {
          this.$notify({
            title: '成功',
            message: '新增成功',
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
          name: undefined,
          time: undefined,
        }
        this.getList()
      },
      handleClose() {
        this.f1 = false
        this.f2 = false
        this.addForm = {
          type: '',
          cpu: 0,
          mem: 0,
          disk: 0,
          conf: '',
          money: 0,
          time: '',
          name: '',
          change_user: this.name,
        }
      }
    }
  }
</script>

<style scoped>

</style>
