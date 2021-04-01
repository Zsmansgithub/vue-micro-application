<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model.trim="listQuery.Account" @change="getPhyconByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="getPhyconByInput"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <el-table :data="PhyconTableData" border stripe  highlight-current-row ref="table">
      <el-table-column label="专线ID" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.PhysicalConnectionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专线类型/运营商" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.Type }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.LineOperator}}</div>
        </template>
      </el-table-column>
      <el-table-column label="接入点/端口类型"  width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.AccessPointId }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.PortType}}</div>
        </template>
      </el-table-column>
      <el-table-column label="接口/端口规格"  width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.PortNumber }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.Bandwidth}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态/业务状态" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.Status }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.BusinessStatus}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间/状态变化时间"  width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.CreationTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <div v-if="scope.row.EnabledTime!=='1970-01-01T00:00:00'" style="color: #8492a6; font-size: 10px">{{scope.row.EnabledTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="位置/对端位置" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.AdLocation }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.PeerLocation}}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getPhycon"
      />
  </div>
</template>

<script>
import { gePhyconList } from '@/api/cainiao/phycon'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      PhyconTableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        Account:''
      },
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
    created() {
      this.getPhycon()
      this.getParams()
    },
    methods: {
    handleReset(){
      this.listQuery= {
        page: 1,
        limit: 20,
        input: undefined,
        Account:''
      }
      this.getPhycon()
    },
    getParams(){
      const val = this.$route.query.params
      this.$route.query.params = undefined
      if (val){
        this.listQuery.input=val
      }
    },
      getPhycon() {
        this.listLoading = true
        gePhyconList(this.listQuery).then(response => {
          this.PhyconTableData = response.results
          this.total = response.count
        }
        )
        this.listLoading = false
        },
      getPhyconByInput() {
        this.listQuery.page = 1
        this.getPhycon()
      }

    }

}
</script>

