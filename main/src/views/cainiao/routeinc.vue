<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model.trim="listQuery.Account" @change="geRouteIncByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="geRouteIncByInput"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="geRouteIncByInput"
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
    <el-table :data="routeIncTableData" border stripe highlight-current-row ref="table" @row-click="toggleRowExpansion">
      <el-table-column label="名称/实例ID">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.RouterInterfaceId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="路由器ID">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_ro(scope.row.RouterId)">{{ scope.row.RouterId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="路由器类型/状态" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.RouterType }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.Status}}</div>
        </template>
      </el-table-column>
      <el-table-column label="对端路由器接口ID">
        <template slot-scope="scope">
          <span>{{ scope.row.OppositeInterfaceId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对端路由器ID">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_ro(scope.row.RouterId)">{{ scope.row.OppositeRouterId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="对端VPC实例ID/付费类型">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_vpc(scope.row.OppositeVpcInstanceId)">{{ scope.row.OppositeVpcInstanceId }}</a>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.ChargeType}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间/过期时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.CreationTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <div v-if="scope.row.EndTime!=='1970-01-01 00:00:00'" style="color: #8492a6; font-size: 10px">{{scope.row.EndTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1px" fixed="right">
        <template slot-scope="scope">
            <el-form label-position="left" class="demo-table-expand">
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="本端位置:"><span>{{scope.row.AccessPointId}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="规格:"><span>{{scope.row.Spec}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="连接角色:"><span>{{scope.row.Role}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="连接时间:"><span>{{scope.row.ConnectedTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="对端位置:"><span>{{scope.row.OppositeRegionId}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="对端规格:"><span>{{scope.row.OppositeInterfaceSpec}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="对端路由器类型:"><span>{{scope.row.OppositeRouterType}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="对端状态:"><span>{{scope.row.OppositeInterfaceStatus}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="物理专线拥有者ID:"><span>{{scope.row.OppositeInterfaceOwnerId}}</span></el-form-item>
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
      @pagination="geRouteInc"
    />
  </div>
</template>

<script>
  import {geRouteIncList} from '@/api/cainiao/routeinc'
  import Pagination from '@/components/Pagination'
  import sessionListQuery from "@/components/mixins/sessionListQuery";

  export default {
    components: {Pagination},
    mixins: [sessionListQuery],
    data() {
      return {
        routeIncTableData: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          input: undefined,
          creationtime: undefined,
          creationtime_s: undefined,
          Account:''
        },
        accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
      }
    },
    created() {
      this.geRouteInc()
    },
    methods: {
      send_vpc(val){
        // this.$router.push({
        //   path: '/vpc/routetab',
        //   query: {
        //     params: val
        //   }
        // })
        this.listQuery.input=val
        this.geRouteInc()
      },
      handleReset(){
        this.listQuery= {
          page: 1,
          limit: 20,
          input: undefined,
          creationtime: undefined,
          creationtime_s: undefined,
          Account:''
        }
        this.geRouteInc()
      },
      send_ro(val){
        this.$router.push({
          path: '/vpc/routetab',
          query: {
            params: val
          }
        })
      },
      geRouteInc() {
        if (this.listQuery.creationtime_s) {
          this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
        } else {
          this.listQuery.creationtime = undefined
        }
        this.listLoading = true
        geRouteIncList(this.listQuery).then(response => {
            this.routeIncTableData = response.results
            this.total = response.count
          }
        )
        this.listLoading = false
      },
      geRouteIncByInput() {
        this.listQuery.page = 1
        this.geRouteInc()
      },
      toggleRowExpansion(row) {
        let $table = this.$refs.table;
        this.routeIncTableData.map((item) => {
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
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>

