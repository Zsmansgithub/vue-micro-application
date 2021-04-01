<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model="listQuery.vcenter" placeholder="Vcenter名称" @input="handleFilter" filterable clearable
                     @change="handleChange">
            <el-option v-for="item in vcenterOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.cluster" placeholder="Cluster名称" @change="handleFilter" filterable clearable>
            <el-option v-for="item in clusterOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.run_status" placeholder="运行状态" @change="handleFilter" filterable clearable>
            <el-option v-for="item in runStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.ip" placeholder="宿主机IP" @input="handleFilter" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.vendor" placeholder="品牌" @input="handleFilter" clearable></el-input>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
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
      <el-table-column label="Vcenter">
        <template slot-scope="scope">
          <span>{{scope.row.vc_name}}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.vc_ip}}</div>
        </template>
      </el-table-column>
      <el-table-column label="Vcenter集群" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.vs_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态/连接状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='poweredOn'">运行中</span>
          <span v-else>已关机</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.connection_state}}</div>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" width="79" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.run_status==='green'">正常</el-tag>
          <el-tag type="warning" v-else-if="scope.row.run_status==='yellow'">警告</el-tag>
          <el-tag type="danger" v-else>异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="DAS状态" prop="state" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.das_state==='connectedToMaster'">slave</span>
          <span v-else>{{scope.row.das_state}}</span>
        </template>
      </el-table-column>
      <el-table-column label="宿主机IP">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="sendIp(scope.row.ip)">{{ scope.row.ip }}</a>
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.vendor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号/系统版本" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.model }}</span>
          <div>
            <span style="color: #8492a6; font-size: 10px">{{ scope.row.sys_version }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率" prop="cpu_hz_usage" sortable width="210">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="20"
            trigger="hover">
            <p>{{Math.round((scope.row.cpu_hz_usage/scope.row.cpu_hz)*100)+'%'}}</p>
            <div slot="reference">
              <el-progress :percentage="Math.round((scope.row.cpu_hz_usage/scope.row.cpu_hz)*100)"
                           :stroke-width="10" :show-text="false"
                           color="#67c23a"
                           v-if="Math.round((scope.row.cpu_hz_usage/scope.row.cpu_hz)*100)<30"></el-progress>
              <el-progress :percentage="Math.round((scope.row.cpu_hz_usage/scope.row.cpu_hz)*100)"
                           :stroke-width="10" :show-text="false"
                           color="#e6a23c"
                           v-else-if="Math.round((scope.row.cpu_hz_usage/scope.row.cpu_hz)*100)<70"></el-progress>
              <el-progress :percentage="Math.round((scope.row.cpu_hz_usage/scope.row.cpu_hz)*100)"
                           :stroke-width="10" :show-text="false"
                           color="#f56c6c" v-else></el-progress>
              <span
                style="color: #8492a6; font-size: 10px">{{'可用/总量:'+((scope.row.cpu_hz-scope.row.cpu_hz_usage)/1000).toFixed(1)+'KHz/'+(scope.row.cpu_hz/1000).toFixed(1)+'KHz' }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="内存使用率" prop="memory_usage" sortable width="180">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="20"
            trigger="hover">
            <p>{{Math.round((scope.row.memory_usage/scope.row.memory)*100)+'%'}}</p>
            <div slot="reference">
              <el-progress :percentage="Math.round((scope.row.memory_usage/scope.row.memory)*100)"
                           :stroke-width="10" :show-text="false"
                           color="#67c23a"
                           v-if="Math.round((scope.row.memory_usage/scope.row.memory)*100)<30"></el-progress>
              <el-progress :percentage="Math.round((scope.row.memory_usage/scope.row.memory)*100)"
                           :stroke-width="10" :show-text="false"
                           color="#e6a23c"
                           v-else-if="Math.round((scope.row.memory_usage/scope.row.memory)*100)<70"></el-progress>
              <el-progress :percentage="Math.round((scope.row.memory_usage/scope.row.memory)*100)"
                           :stroke-width="10" :show-text="false"
                           color="#f56c6c" v-else></el-progress>
              <span
                style="color: #8492a6; font-size: 10px">{{'可用/总量:'+((scope.row.memory-scope.row.memory_usage)/1024).toFixed(1)+'G/'+(scope.row.memory/1024).toFixed(1)+'G' }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="虚拟机" prop="virtual_total" sortable width="90">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="sendVip(scope.row.ip)">{{ scope.row.virtual_total }}</a>
        </template>
      </el-table-column>
      <el-table-column label="更新时间/运行时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.run_day}}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

  </div>
</template>

<script>
  import {selectVcenter, selectCluster, fetchHost} from '@/api/cmdbs/v_center'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'

  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        vcenterOptions: [],
        clusterOptions: [],
        runStatus: [{label: '正常', value: 'green'}, {label: '警告', value: 'yellow'}, {label: '异常', value: 'red'}],
        statusOptions: [{label: '运行中', value: 'poweredOn'}, {label: '已关机', value: 'poweredOff'}],
        select: [],
        listQuery: {
          page: 1,
          limit: 20,
          ip: undefined,
          run_status: undefined,
          vcenter: undefined,
          cluster: undefined,
          vendor: undefined,
        },
        list: null,
        total: 0,
        listLoading: true,
        adminrole: false,
      }
    },
    created() {
      this.adminrole = this.roles.includes('pwd_manager')
      this.getList()
      this.getParams()
      selectVcenter().then(res => {
        this.vcenterOptions = res
      })
      selectCluster().then(res => {
        this.clusterOptions = res
        this.select = res
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      sendVip(val) {
        this.$router.push({
          path: '/cmdb/server',
          query: {
            vip: val
          }
        })
      },
      sendIp(val) {
        this.$router.push({
          path: '/cmdb/resoucre',
          query: {
            ip: val
          }
        })
      },
      handleChange(val) {
        if (val) {
          this.clusterOptions = []
          const tmp = []
          for (const i of this.select) {
            if (i.vcenter === val) {
              tmp.push(i)
            }
          }
          this.clusterOptions = tmp
        } else {
          this.clusterOptions = this.select
        }
      },
      getParams() {
        // 取到路由带过来的参数
        const routerParams = this.$route.query.mallCode
        this.$route.query.mallCode = undefined
        // 将数据放在当前组件的数据内
        if (routerParams) {
          this.listQuery.cluster = routerParams
        }
      },
      changeName(row) {
        for (const i of this.vcenterOptions) {
          if (i.id.toString().indexOf(row.vcenter_id) !== -1) {
            return i.name
          }
        }
      },
      changeCluster(row) {
        for (const i of this.clusterOptions) {
          if (i.id.toString().indexOf(row.cluster_id) !== -1) {
            return i.name
          }
        }
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      getList() {
        this.listLoading = true
        fetchHost(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter(listQuery) {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          ip: undefined,
          run_status: undefined,
          vcenter: undefined,
          cluster: undefined,
          vendor: undefined,
        }
      },
    }
  }
</script>
<style scoped>

</style>
