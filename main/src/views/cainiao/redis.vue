<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getRedisByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.architecturetype" @change="getRedisByInput" clearable placeholder="请选择架构类型" style="width: 150px">
            <el-option v-for="item in architecturetypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.engineversion" @change="getRedisByInput" clearable placeholder="请选择引擎版本" style="width: 150px">
            <el-option v-for="item in engineversionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getRedisByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <div v-if="listQuery.select==='A'">
            <el-button type="text" @click="listQuery.select='B'">到期日期<i class="el-icon-caret-bottom "></i></el-button>
            <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getRedisByInput"
            value-format="yyyy-MM-dd HH:mm"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
          </div>
          <div v-else-if="listQuery.select==='B'">
            <el-button type="text" @click="listQuery.select='A'">创建日期<i class="el-icon-caret-bottom "></i></el-button>
            <el-date-picker
            v-model.trim="listQuery.expiredtime_s"
            @change="getRedisByInput"
            value-format="yyyy-MM-dd HH:mm"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </div>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="redisTableData" border stripe  highlight-current-row @row-click="toggleRowExpansion" ref="table">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="实例类型:">
                <span>{{ props.row.instanceclass }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="套餐类型:">
                <span>{{ props.row.packagetype }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="QPS:">
                <span>{{ props.row.qps }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="内网带宽:">
                <span>{{ props.row.bandwidth }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="最大连接数:">
                <span>{{ props.row.connections }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="可用性:">
                <span>{{ props.row.availabilityvalue }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="网络类型:">
                <span>{{ props.row.networktype }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="专有网络:">
                <a style="color: #1890ff" @click="send_vpc(props.row.vpcid)">{{ props.row.vpcid }}</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="虚拟交换机:">
                <a style="color: #1890ff" @click="send_vpc(props.row.vswitchid)">{{ props.row.vswitchid }}</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="维护窗口:">
                <span>{{ props.row.maintaintime }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="参数设置:">
                <a style="color: #1890ff" @click="getConfigDetail(props.row)">点击查看参数设置详情</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="白名单列表:">
                <a style="color: #1890ff" @click="getSecFroupDetail(props.row)">点击查看白名单详情</a>
              </el-form-item>
              </el-col>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="名称/实例ID">
          <template slot-scope="scope">
            <span>{{ scope.row.instancename }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.instanceid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="实例规格">
          <template slot-scope="scope">
            <span>{{ scope.row.replicationmode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="私网IP">
          <template slot-scope="scope">
            <span>{{ scope.row.privateip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="架构类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.architecturetype }}</span>
          </template>
        </el-table-column>
        <el-table-column label="引擎版本" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.engineversion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="连接端口" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column label="连接地址" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.connectiondomain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在可用区/状态" width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.zoneid }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.instancestatus}}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getRedis"
      />

      <el-dialog title="参数信息" :visible.sync="configDialog" width="70%" @close="handleClose">
        <el-form :model="detail">
          <el-form-item>
            <el-input v-model="detail.config" style="width: 100%" type="textarea" :rows="30" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="白名单详情" :visible.sync="secGroupDialog" width="70%" @close="handleClose">
        <el-form :model="detail">
          <el-form-item>
            <el-input v-model="detail.securitygroups" style="width: 100%" type="textarea" :rows="30" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getRedisList} from  '@/api/cainiao/redis'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      redisTableData: [],
      configDialog: false,
      secGroupDialog: false,
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        architecturetype: undefined,
        engineversion: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        expiredtime: undefined,
        expiredtime_s: undefined,
        select: 'A',
      },
      total: 0,
      detail: {
        config: '',
        securitygroups: ''
        },
      architecturetypeOptions: [
        {'value':'标准版','label':'标准版'},
        {'value':'集群版','label':'集群版'}
      ],
      engineversionOptions: [
        {'value':'Redis 2.8','label':'Redis 2.8'},
        {'value':'Redis 4.0','label':'Redis 4.0'}
      ],
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
  created() {
    this.getRedis()
  },
  methods: {
    send_vpc(val){
      this.$router.push({
        path:'/vpc/vpc',
        query:{
          params:val
        }
      })
    },
    getRedisByInput() {
      this.listQuery.page = 1
      this.getRedis()
    },
    handleClose() {
      this.configDialog = false
      this.secGroupDialog = false
    },
    handleReset() {
      this.clearListQuery()
      this.getRedis()
    },
    getConfigDetail(row) {
      this.configDialog = true
      this.detail.config = row.config
    },
    getSecFroupDetail(row) {
      this.secGroupDialog = true
      this.detail.securitygroups = row.securitygroups
    },
     clearListQuery() {
      this.listQuery = this.$options.data().listQuery
    },
    getRedis() {
      if (this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      } else {
        this.listQuery.creationtime = undefined
      }
      if (this.listQuery.expiredtime_s) {
        this.listQuery.expiredtime = this.listQuery.expiredtime_s[0] + ',' + this.listQuery.expiredtime_s[1]
      } else {
        this.listQuery.expiredtime = undefined
      }
      this.listLoading = true
      getRedisList(this.listQuery).then(response => {
        this.redisTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
    toggleRowExpansion(row) {
      let $table = this.$refs.table;
      this.redisTableData.map((item) => {
         if (row.id !== item.id) {
           $table.toggleRowExpansion(item, false)
        }
       })
      $table.toggleRowExpansion(row)
    },
  }
}
</script>

<style scoped>
   .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #606266;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
   .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 10px;
  }
</style>
