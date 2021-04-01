<template>
<div class="app-container">
  <div  class="filter-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getRouteTabByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="getRouteTabByInput"
                  clearable style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getRouteTabByInput"
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
  <el-table :data="routeTableData" border stripe  highlight-current-row ref="table">
      <el-table-column label="名称/实例ID" width="205">
        <template slot-scope="scope">
          <span>{{ scope.row.routetablename }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.routetableid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属专有网络" >
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_zh(scope.row.vpcid)">{{ scope.row.vpcid }}</a>
        </template>
      </el-table-column>
      <el-table-column label="路由器ID" >
        <template slot-scope="scope">
          <span>{{ scope.row.routerid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路由表类型" >
        <template slot-scope="scope">
          <span>{{ scope.row.routetabletype }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交换机">
        <template slot-scope="scope">
          <div v-if="scope.row.vswitchids.indexOf(',')>-1" v-for="item in scope.row.vswitchids.split(',')">
            <a style="color: #1890ff" @click="send_ex(item)">{{ item }}</a>
            </div>
          <div v-else><a style="color: #1890ff" @click="send_ex(scope.row.vswitchids)">{{scope.row.vswitchids}}</a></div>
        </template>
      </el-table-column>
      <el-table-column label="描述" >
        <template slot-scope="scope">
          <span>{{ scope.row.descrpition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
  </el-table>
  <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getRouteTable"
      />
</div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getRouteTableList } from '@/api/cainiao/routetable'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return{
      routeTableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        input:undefined,
        account:undefined,
        creationtime: undefined,
        creationtime_s: undefined
      },
      listLoading: false,
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
  created() {
    this.getRouteTable()
    this.getParams()
  },
  methods:{
    handleReset(){
      this.listQuery= {
        page: 1,
        limit: 20,
        input:undefined,
        account:undefined,
        creationtime: undefined,
        creationtime_s: undefined
      }
      this.getRouteTable()
    },
    send_ex(val){
      this.$router.push({
        path:'/vpc/switch',
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
    getParams(){
      const val = this.$route.query.params
      this.$route.query.params = undefined
      if (val){
        this.listQuery.input=val
      }
    },
    getRouteTable() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getRouteTableList(this.listQuery).then(response =>{
        this.routeTableData = response.results
        this.total = response.count
      })
      this.listLoading = false
    },
    getRouteTabByInput() {
      this.listQuery.page = 1
      this.getRouteTable()
    }
  }
}
</script>

