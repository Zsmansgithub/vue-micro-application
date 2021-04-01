<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getOssByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.bucketacl" @change="getOssByInput" clearable placeholder="请选择读写权限" style="width: 150px">
            <el-option v-for="item in bucketAcleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getOssByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getOssByInput"
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
    <div>
      <el-table :data="ossTableData" border stripe  highlight-current-row  ref="table">
        <el-table-column label="Bucket名称">
          <template slot-scope="scope">
            <span>{{ scope.row.bucketname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内网访问域名">
          <template slot-scope="scope">
            <span>{{ scope.row.bucketintranetendpoint }}</span>
          </template>
        </el-table-column>
        <el-table-column label="外网访问域名">
          <template slot-scope="scope">
            <span>{{ scope.row.bucketextranetendpoint }}</span>
          </template>
        </el-table-column>
        <el-table-column label="读写权限" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.bucketacl }}</span>
          </template>
        </el-table-column>
        <el-table-column label="存储类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bucketclass }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="135" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bucketcreationdate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getOss"
      />
    </div>
  </div>
</template>

<script>
import {getOssList} from '@/api/cainiao/oss'
import Pagination from '@/components/Pagination'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      ossTableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        bucketacl: undefined
      },
      bucketAcleOptions: [
        {'value': '私有','label': '私有'},
        {'value': '公共读','label': '公共读'},
        {'value': '公共读写','label': '公共读写'}
      ],
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
  created() {
    this.getOss()
  },
  methods:{
    handleReset(){
      this.listQuery= {
        page: 1,
        limit: 20,
        input: undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        bucketacl: undefined
      }
      this.getOss()
    },
    getOssByInput() {
      this.listQuery.page = 1,
      this.getOss()
    },
    getOss() {
      if (this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      } else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getOssList(this.listQuery).then(response => {
        this.ossTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
  }
}
</script>

