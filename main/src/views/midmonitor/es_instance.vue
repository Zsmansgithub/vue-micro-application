<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item prop="status">
        <el-select v-model="listQuery.status" clearable placeholder="监控状态" @change="handleFilter" style="width:150px">
          <el-option v-for="item in status" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="env">
        <el-select v-model="listQuery.cluster_name" clearable filterable placeholder="集群名称"  @change="handleFilter" style="width:150px">
          <el-option v-for="item in es_cluster_name" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input v-model.trim="listQuery.ip" placeholder="IP地址" style="width: 150px;" @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="listQuery.port" placeholder="端口号" style="width: 150px;" @keyup.enter.native="handleFilter"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" v-if="adminrole" :disabled="disable" plain icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="tableList"
      border
      stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="监控状态" width="90px" align="center" >
        <template slot-scope="scope">
          <el-badge :value="null" :max="99" class="el-badge-item">
            <el-button v-if="scope.row.status==0" size="mini" type="success">监控中</el-button>
            <el-button v-else-if="scope.row.status==1" size="mini" type="danger">异常中</el-button>
            <el-button v-else size="mini" type="warning">未监控</el-button>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column label="节点名称" min-width="145">
        <template slot-scope="scope">
          <i v-if="scope.row.is_master===true" class="el-icon-star-on" style="color: blue"></i>
          <span>{{ scope.row.node_name }}</span>
          <div style="color: #8492a6; font-size: 10px">角色: {{ scope.row.roles | handleRole }} {{scope.row.cluster_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.ip +':'+ scope.row.port }}</span>
          <div style="color: #8492a6; font-size: 10px">ES版本:{{ scope.row.es_version }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="角色" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.roles }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="负载" sortable width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.load }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sys_cpu_used" label="进程CPU" sortable width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.pro_cpu_used<45">{{ scope.row.pro_cpu_used }}%</span>
          <span v-else style="color: red">{{ scope.row.pro_cpu_used }}%</span>
          <div style="color: #8492a6; font-size: 10px;">OS_CPU: {{ scope.row.sys_cpu_used }}%</div>
        </template>
      </el-table-column>
      <el-table-column prop="mem_used_percent" label="内存使用率/空闲" sortable width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.mem_used_percent }}% / {{ scope.row.mem_free_in_bytes | format1024 }}</span>
          <div style="color: #8492a6; font-size: 10px;">总内存:{{ scope.row.mem_total_in_bytes | format1024 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="heap_used_percent" label="JVM内存%" sortable width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.heap_used_percent<80">{{ scope.row.heap_used_percent }}%</span>
          <span v-else style="color: red">{{ scope.row.heap_used_percent }}%</span>
          <div style="color: #8492a6; font-size: 10px;">最大堆内存:{{ scope.row.heap_max_in_bytes | format1024 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="open_file_descriptors" label="文件描述符" sortable width="125">
        <template slot-scope="scope">
          <span>{{ scope.row.open_file_descriptors }} / {{ scope.row.max_file_descriptors }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="threads" label="线程数" sortable width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.threads }}</span>
        </template>
      </el-table-column>
      <el-table-column label="磁盘使用率/空闲" width="135">
        <template slot-scope="scope">
          <span>{{ (scope.row.disk_total_bytes-scope.row.disk_available_in_bytes)/scope.row.disk_total_bytes*100 | reservedTwo }}% / {{ scope.row.disk_available_in_bytes | format1024 }}</span>
          <!-- <div style="color: #8492a6; font-size: 10px;">可用:{{ scope.row.disk_available_in_bytes | format1024 }}</div> -->
          <div style="color: #8492a6; font-size: 10px;">总:{{ scope.row.disk_total_bytes | format1024 }}</div>
        </template>
      </el-table-column>
      <el-table-column label="版本信息" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          <span>JVM: {{ scope.row.jvm_version }}</span>
          <div style="color: #8492a6; font-size: 10px">系统: {{ scope.row.os_version }}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
          <div style="color: #8492a6; font-size: 10px">运行{{ scope.row.uptime | formatSec2Day }}天</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelete(scope.row);" v-if="adminrole">
            <svg-icon icon-class="delete1" style="width: 14px; height:16px;color:#FF4949;"/>
          </el-button>
          <el-button type="text" @click="handleDetail(scope.row);">
            <svg-icon icon-class="data1" style="width: 14px; height:16px;color:#1890FF;"/>
          </el-button>
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
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";

  import {deleteEsNode, fetchList, getESClusterName} from '@/api/midmonitor/es'
  import Pagination from '@/components/Pagination'
  import {format1024} from '@/utils/format-function'
  import {mapGetters} from 'vuex'

  export default {
  name: 'ESInstance',
  components: { Pagination },
  directives: { waves },
  mixins: [resize, sessionListQuery],

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        cluster_name: undefined,
        ip: undefined,
        port: undefined
      },
      listLoading: false,
      adminrole: false,
      tableList: [],
      total: 0,

      es_cluster_name: [],

      status: [
        {value: 0, label: '监控中'},
        {value: 1, label: '异常中'},
        {value: 2, label: '未监控'}
      ],
      confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
      multipleSelection:[],
      disable:true,
    }
  },

  created() {
    this.adminrole = this.roles.includes('es_instance_admin'),
    this.getList(),
    getESClusterName().then(response => {
      this.es_cluster_name = response.data
    }).catch(error => {
      this.$message({message: '调用后端接口getESClusterName出错!'})
    })
  },
  computed: {
      ...mapGetters(['roles', 'name'])
    },
  filters: {
    format1024,

    formatSec2Day(sec) {
      let num = sec/86400
      return num.toFixed(0)
    },

    reservedTwo(num) {
      return num.toFixed(2)
    },

    handleRole(role) {
      return role.slice(1,-1)
    }
  },

  methods: {
    handleBatchDelete() {
      let msg = '确定删除该' + this.multipleSelection.length + '条信息吗?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        for (const es of this.multipleSelection) {
          deleteEsNode(es.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          }).catch(error => {
            this.$message({
              type: 'error',
              message: error
            })
          })
        }
      }, () => {
        return false
      })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        if (val.length>0) {
          this.disable=false
        }else {
          this.disable=true
        }
      },
    handleDelete(row) {
      let msg = '确定删除该实例吗?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteEsNode(row.id).then(response => {
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
//过滤相关
    handleFilter() {
      this.listQuery.page=1
      this.getList()
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },

    // format1024Nested(row, column, cellValue) {
    //     return format1024(row.instantaneous_input_kbps*8*1000)+'/'+format1024(row.instantaneous_output_kbps*8*1000)
    // },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.tableList = response.data.results
        this.total = response.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      }).catch(error => {
        this.$message({ message: '调用后端接口es_instance_list出错!'})
        this.listLoading = false
      })
    },

    // rowFilter(app, app_name) {
    //   this.listQuery={
    //     page: 1,
    //     limit: 20,
    //     rediscluster_id: app,
    //   }
    //   this.getList()
    // },

    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        status: undefined,
        cluster_name: undefined,
        ip: undefined,
        port: undefined
      }
    },

    handleDetail(row) {
      const ip=row.cluster_name + ' ' + row.ip + ':' + row.port + ' ('+row.node_name+')'
      this.$router.push({ name: 'es_instance_detail', params: { id: row.id, ip: ip }})
    }
  }

}
</script>
<style>

</style>
