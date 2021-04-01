<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model.trim="listQuery.Account" @change="getSwitchByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="getSwitchByInput"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getSwitchByInput"
            value-format="yyyy-MM-dd HH:mm"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <el-table :data="switchTableData" border stripe  highlight-current-row ref="table">
      <el-table-column label="名称/实例ID" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.VSwitchName }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.VSwitchId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属专有网络" >
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_zh(scope.row.VpcId)">{{ scope.row.VpcId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="默认交换机/状态" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.IsDefault }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.Status}}</div>
        </template>
      </el-table-column>
      <el-table-column label="目标网段/可用IP数" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.CidrBlock }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.AvailableIpAddressCount}}</div>
        </template>
      </el-table-column>
      <el-table-column label="路由表类型/可用区" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.RouteTableType }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.ZoneId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="路由表ID">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_ro(scope.row.RouteTableId)">{{ scope.row.RouteTableId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="描述" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.Description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CreationTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getSwitch"
      />
  </div>
</template>

<script>
import { getSwitchList } from '@/api/cainiao/switch'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      switchTableData: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        VSwitchId: undefined,
        Account:''
      },
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
  created() {
    this.getSwitch()
    this.getParam()
    this.getParams1()
  },
  methods: {
    handleReset(){
      this.listQuery= {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        VSwitchId: undefined,
        Account:''
      }
      this.getSwitch()
    },
    send_ro(val){
      this.$router.push({
        path:'/vpc/routetab',
        query:{
          params:val
        }
      })
    },
    send_zh(val){
      this.$router.push({
        path:'/vpc/vpc',
        query:{
          params:val
        }
      })
    },
    getSwitch() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getSwitchList(this.listQuery).then(response => {
        this.switchTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
    getParam() {
       const routerParams = this.$route.query.switchid
      if(routerParams) {
        this.listQuery.input = routerParams
      }
    },
    getParams1(){
      const val = this.$route.query.params
      this.$route.query.params = undefined
      if (val){
        this.listQuery.input=val
      }
    },
    getSwitchByInput() {
      this.listQuery.page = 1,
      this.getSwitch()
    }
  }
}
</script>
