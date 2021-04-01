<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model.trim="listQuery.Account" @change="getBrdRouteByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="getBrdRouteByInput"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getBrdRouteByInput"
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
    <el-table :data="brdRouteTableData" border stripe  highlight-current-row ref="table" @row-click="toggleRowExpansion">
      <el-table-column label="名称/边界路由ID"  >
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.VbrId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="接入点/状态"  show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.AccessPointId }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.Status}}</div>
        </template>
      </el-table-column>
      <el-table-column label="路由表ID"  >
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_ro(scope.row.RouteTableId)">{{ scope.row.RouteTableId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="描述"  show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.Description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物理专线ID"  >
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_ph(scope.row.PhysicalConnectionId)">{{ scope.row.PhysicalConnectionId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="物理连接状态/业务状态"  width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.PhysicalConnectionStatus }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.PhysicalConnectionBusinessStatus}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间/激活时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.CreationTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.ActivationTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="恢复时间/终止时间" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.RecoveryTime!=='1970-01-01T00:00:00'">{{ scope.row.RecoveryTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <div v-if="scope.row.TerminationTime!=='1970-01-01T00:00:00'" style="color: #8492a6; font-size: 10px">{{scope.row.TerminationTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1px" fixed="right">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="下一跳:">
                <span>{{ scope.row.VlanInterfaceId }}</span></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="物理专线拥有者ID:">
                <span>{{ scope.row.PhysicalConnectionOwnerUid }}</span></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="阿里云侧互联地址:">
                <span>{{ scope.row.LocalGatewayIp }}</span></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="客户侧互联地址:">
                <span>{{ scope.row.PeerGatewayIp }}</span>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="VLANID:">
                <span>{{ scope.row.VlanId }}</span></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="子网掩码:">
                <span>{{ scope.row.PeeringSubnetMask }}</span></el-form-item>
            </el-col>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getBrdRoute"
      />
  </div>
</template>

<script>
import { getBrdRouteList } from '@/api/cainiao/brdRoute'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      brdRouteTableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined
      },
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
    created() {
      this.getBrdRoute()
    },
    methods: {
    handleReset(){
      this.listQuery= {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined
      }
      this.getBrdRoute()
    },
    send_ro(val){
      this.$router.push({
        path:'/vpc/routetab',
        query:{
          params:val
        }
      })
    },
    send_ph(val){
      this.$router.push({
        path:'/vpc/phycon',
        query:{
          params:val
        }
      })
    },
      getBrdRoute() {
        if(this.listQuery.creationtime_s) {
          this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
        }else {
          this.listQuery.creationtime = undefined
        }
        this.listLoading = true
        getBrdRouteList(this.listQuery).then(response => {
          this.brdRouteTableData = response.results
          this.total = response.count
        }
        )
        this.listLoading = false
        },
      getBrdRouteByInput() {
        this.listQuery.page = 1
        this.getBrdRoute()
      },
      toggleRowExpansion(row) {
        let $table = this.$refs.table;
        this.brdRouteTableData.map((item) => {
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
    width: 100px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>

