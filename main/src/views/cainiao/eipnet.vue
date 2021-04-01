<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="geEipnetByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" class="filter-item" @input="geEipnetByInput"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="分配时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="geEipnetByInput"
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
    <el-table :data="eipnetTableData" border stripe  highlight-current-row ref="table">
      <el-table-column label="名称/实例ID">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.allocationid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP地址/带宽" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.ipaddress }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.bandwidth}}</div>
        </template>
      </el-table-column>
      <el-table-column label="带宽计费方式/付费类型" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.internetchargetype }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.chargetype}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态/地域" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.regionid}}</div>
        </template>
      </el-table-column>
      <el-table-column label="绑定实例ID">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_ei(scope.row.instanceid)">{{ scope.row.instanceid }}</a>
        </template>
      </el-table-column>
      <el-table-column label="实例类型">
        <template slot-scope="scope">
          <span>{{ scope.row.instancetype }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.descritpion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配时间/过期时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.allocationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <div v-if="scope.row.expiredtime!=='1970-01-01T00:00:00'" style="color: #8492a6; font-size: 10px">{{scope.row.expiredtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getEipNet"
      />
  </div>
</template>

<script>
import { getEipnetList } from '@/api/cainiao/eipnet'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      eipnetTableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        account:''
      },
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
    created() {
      this.getEipNet()
    },
    methods: {
    handleReset(){
      this.listQuery= {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        account:''
      }
      this.getEipNet()
    },
    send_ei(val){
      this.$router.push({
        path:'/ecs/ecs',
        query:{
          params:val
        }
      })
    },
      getEipNet() {
        if(this.listQuery.creationtime_s) {
          this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
        }else {
          this.listQuery.creationtime = undefined
        }
        this.listLoading = true
        getEipnetList(this.listQuery).then(response => {
          this.eipnetTableData = response.results
          this.total = response.count
        }
        )
        this.listLoading = false
        },
      geEipnetByInput() {
        this.listQuery.page = 1
        this.getEipNet()
      }

    }

}
</script>

