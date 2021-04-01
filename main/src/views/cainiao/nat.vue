<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="geNatByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="geNatByInput"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="geNatByInput"
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
    <el-table :data="natTableData" border stripe  highlight-current-row ref="table">
      <el-table-column label="名称/实例ID">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.natgatewayid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="专有网路">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_zh(scope.row.vpcid)">{{ scope.row.vpcid }}</a>
        </template>
      </el-table-column>
      <el-table-column label="规格/状态" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.spec }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.status}}</div>
        </template>
      </el-table-column>
      <el-table-column label="付费类型/地域" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.instancechargetype }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.regionid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="DANT表ID/SNAT表ID" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.forwardtableids }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.snattableids}}</div>
        </template>
      </el-table-column>
      <el-table-column label="带宽包">
        <template slot-scope="scope">
          <div v-if="scope.row.bandwidthpackageids.indexOf(',')>-1" v-for="item in scope.row.bandwidthpackageids.split(',')">
            <a style="color: #1890ff" @click="send_pa(item)">{{ item }}</a>
            </div>
          <div v-else><a style="color: #1890ff" @click="send_pa(scope.row.bandwidthpackageids)">{{scope.row.bandwidthpackageids}}</a></div>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间/到期时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <div v-if="scope.row.expiredtime!=='1970-01-01 00:00:00'" style="color: #8492a6; font-size: 10px">{{scope.row.expiredtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getNat"
      />
  </div>

</template>
<script>
import {getNatList} from '@/api/cainiao/nat'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      natTableData: [],
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
    this.getNat()
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
      this.getNat()
    },
    send_pa(val){
      this.$router.push({
        path:'/vpc/natpac',
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
    getNat() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getNatList(this.listQuery).then(response => {
        this.natTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
    geNatByInput() {
      this.listQuery.page = 1,
      this.getNat()
    }
  }

}
</script>

