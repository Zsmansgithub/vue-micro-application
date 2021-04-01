<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <el-form-item prop="host">
          <el-input v-model="listQuery.host" placeholder="IP地址" clearable  class="filter-item"/>
        </el-form-item>
        <el-form-item prop="">
          <el-autocomplete
            class="inline-input"
            v-model="listQuery.facility"
            :fetch-suggestions="querySearch"
            clearable
            placeholder="类型"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="severity">
          <el-select v-model="listQuery.severity" placeholder="级别" clearable style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in priorityOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="msg">
          <el-input v-model="listQuery.msg" placeholder="模糊查询"  clearable class="filter-item"/>
        </el-form-item>
        <el-form-item prop="stime">
          <el-date-picker class="filter-item"
                          v-model="listQuery.sdate"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期" >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="sdate">
            <el-time-picker
                is-range
                v-model="listQuery.stime"
                range-separator="至"
                start-placeholder="开始时间"
                value-format="HH:mm:ss"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">
          重置
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="日志时间" width="200px" sortable prop="_source.timestamp" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row._source.timestamp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="120px" sortable prop="_source.host">
        <template slot-scope="scope">
          <span>{{ scope.row._source.logsource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80px" sortable prop="_source.facility_label">
        <template slot-scope="scope">
          <span>{{ scope.row._source.facility_label  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" width="120px"  sortable prop="_source.severity">
        <template slot-scope="scope">
          <span>{{ scope.row._source.severity_label  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息内容" >
        <template slot-scope="scope">
          <span>{{ scope.row._source.message  }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>=0" :total="total" :page.sync="listQuery.page" :page-sizes=page_sizes
                :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-top: 5px;margin-top: 10px;"/>
  </div>
</template>


<script>
import { fetchList, } from '@/api/tools/syslog'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import {validIp } from '@/utils/validate'

export default {
  name: 'SysLogList',
  mixins: [resize, sessionListQuery],
  components: { Pagination,},
  directives: { waves },
  data() {
    const validateIpaddress = (rule, value, callback) => {
      if (value) {
        if (validIp(value)) {
          callback()
        } else {
          callback(new Error('IP填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      listQuery: {
        page: 0,
        limit: 20
      },
      list:[],
      restaurants: [],
      page_sizes:[20,50,100],
      priorityOptions: [{ label: 'Debug', key: 7 },{ label: 'information', key: 6 }, { label: 'Notice', key: 5 },{ label: 'Warning', key: 4 },
        { label: 'Error', key: 3 },{ label: 'Critical', key: 2 },{ label: 'Alert', key: 1 },{label:'Emergency',key:0}
      ],
      total:0,

      rules: {
        ip: [{  message: '请输入正确的IP地址', trigger: 'blur' , validator: validateIpaddress}],
      },
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    resetlistQuery() {
      this.listQuery={
        page: 1,
        limit: 20
      }
    },
    getList() {
      this.listLoading = true
      // let xx=RsaEncrypt(this.listQuery.server_ip)
      // console.log(xx)
      fetchList(this.listQuery).then(response => {
        this.list = response.data.hits
        this.total = response.data.total.value
        // Just to simulate the time of the request
        this.listLoading = false
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1)
      })
    },
    handleFilter(listQuery) {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate((valid) => {
        if (valid) {
            this.getList()
        }
      })
    },
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "kernel", "address": "kernel" },
          { "value": "user", "address": "user" },
          { "value": "mail", "address": "mail" },
          { "value": "system", "address": "system" },
          { "value": "security/authorization", "address": "security/authorization" },
          { "value": "clock", "address": "clock" },
          { "value": "local0", "address": "local0" },
          { "value": "local1", "address": "local1" },
          { "value": "local2", "address": "local2" },
          { "value": "local3", "address": "local3" },
          { "value": "local4", "address": "local4" },
          { "value": "local5", "address": "local5" },
          { "value": "local6", "address": "local6" },
          { "value": "local7", "address": "local7" },
        ];

  }}
}
</script>
