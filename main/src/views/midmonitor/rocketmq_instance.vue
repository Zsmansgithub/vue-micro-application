<template>
  <div class="app-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model="listQuery.status" clearable placeholder="监控状态" @change="handleFilter" style="width:150px">
            <el-option value="0" label="监控中">监控中</el-option>
            <el-option value="1" label="异常中">异常中</el-option>
            <el-option value="20" label="未监控">未监控</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.cluster_name" placeholder="集群名称" clearable filterable @change="handleFilter">
            <el-option v-for="(item, index) in all_cluster_name" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="listQuery.broker_name" placeholder="节点名称" style="width: 150px;" @change="handleFilter" @keyup.enter.native="handleFilter" class="filter-item" />
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="listQuery.ip_port" placeholder="IP:PORT" style="width:200px;" clearable @change="handleFilter" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <!-- <el-form-item>
          <el-input v-model.trim="listQuery.port" placeholder="端口号" style="width: 150px;" @keyup.enter.native="handleFilter" class="filter-item" />
        </el-form-item> -->
        <el-form-item>
          <el-select v-model="listQuery.version" clearable placeholder="MQ版本" @change="handleFilter" style="width:150px">
            <el-option value="V4_2_0_SNAPSHOT"></el-option>
            <el-option value="V4_1_0_SNAPSHOT"></el-option>
            <el-option value="V4_4_0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      stripe
      highlight-current-row
    >
      <el-table-column label="监控状态" width="90px" align="center" >
        <template slot-scope="scope">
          <el-badge :value="null" :max="99" class="el-badge-item">
            <el-button v-if="scope.row.status==0" size="mini" type="success">监控中</el-button>
            <el-button v-else-if="scope.row.status==1" size="mini" type="danger">异常中</el-button>
            <el-button v-else size="mini" type="warning">未监控</el-button>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column label="集群名称" min-width="100">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="rowFilter(scope.row.c_id)">{{ scope.row.cluster_name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="节点名称" min-width="82">
        <template slot-scope="scope">
          <span>{{ scope.row.broker_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="82">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">Master</span>
          <span v-if="scope.row.type === 1">Slave</span>
          <span v-if="scope.row.type === 2">NameServer</span>
          <span v-if="scope.row.type === 3">JMX</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" min-width="155" >
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}:{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监控时间" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.modfiy_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleClusterChart(scope.row.c_id)">
            <svg-icon icon-class="data1" style="width:16px;height:16px;color:#1890FF;"/>
          </el-button>
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
  </div>
</template>

<script>
import { getRow, deleteRow, getMQClusterName } from '@/api/midmonitor/rocketmq_instance'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import { mapGetters } from 'vuex'
import store from "../../store";

export default {
  name: 'redisInstance',
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        cluster_name: undefined,
        broker_name: undefined,
        version: undefined,
        ip: undefined,
        port: undefined,
        ip_port: undefined,
      },
      all_cluster_name: [],
      listLoading: false,
      tableData: [],
      total: 0,
    }
  },
  created() {
    getMQClusterName().then(response => {
      this.all_cluster_name = response
    })
    this.getList()
    this.adminrole = this.roles.includes('mq_admin')
  },
  computed: {
  ...mapGetters(['roles'])
  },
  methods: {
//过滤相关
    handleFilter() {
      this.listQuery.page=1
      this.getList()
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    resetlistQuery() {
      this.listQuery = this.$options.data().listQuery;
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
      getRow(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
      this.listLoading = false
    },

    rowFilter(cid) {
      this.listQuery={
        page: 1,
        limit: 20,
        cluster_name: cid,
      }
      this.getList()
    },

    handleClusterChart(cid) {

      this.$router.push({ name: 'rocketmq_monitor', query: { cid: cid } })
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
  },
}
</script>
<style>

</style>
