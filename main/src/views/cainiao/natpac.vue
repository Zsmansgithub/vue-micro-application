<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="geNatPacByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="geNatPacByInput"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="geNatPacByInput"
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
    <el-table :data="natPacTableData" border stripe  highlight-current-row ref="table">
      <el-table-column label="名称/实例ID" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.bandwidthpackageid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="线路类型/带宽" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.isp }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.bandwidth}}</div>
        </template>
      </el-table-column>
      <el-table-column label="网络计费类型/实例付费方式" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.internetchargetype }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.instancechargetype}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态/IP数量" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.ipcount}}</div>
        </template>
      </el-table-column>
      <el-table-column label="公网分配ID/公网IP" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.allocationid }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.ipaddress}}</div>
        </template>
      </el-table-column>
      <el-table-column label="公网IP使用状态/可用区" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.usingstatus }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.zoneid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="关联网关ID" width="220">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_na(scope.row.natgatewayid)">{{ scope.row.natgatewayid }}</a>
        </template>
      </el-table-column>
      <el-table-column label="描述/创建时间" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getNatPac"
      />
  </div>

</template>
<script>
import {getNatPacList} from '@/api/cainiao/natpac'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      natPacTableData: [],
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        account:''
      },
      total: 0,
      listLoading: false,
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
  created() {
    this.getNatPac()
    this.getParams()
  },
  methods: {
    handleReset(){
      this.listQuery={
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        account:''
      }
      this.getNatPac()
    },
    send_na(val){
      this.$router.push({
        path:'/vpc/nat',
        query:{
          params:val
        }
      })
    },
    getParams() {
      let val = this.$route.query.params
      if (val) {
        this.listQuery.input = val
      }
    },
    getNatPac() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getNatPacList(this.listQuery).then(response => {
        this.natPacTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
    geNatPacByInput() {
      this.listQuery.page = 1,
      this.getNatPac()
    }
  }

}
</script>
