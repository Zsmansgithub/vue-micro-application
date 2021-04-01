<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item label="应用"  required>
          <el-cascader 
            expand-trigger="hover"
            ref="cascaderHandler"
            :options="projectOptions"
            v-model="query_server_id"
            :props="{ checkStrictly: true }"
            style="width:100%;"
            placeholder="请选择应用和URL路径"
            filterable clearable 
            @change="findServer">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>

      </el-col>
    </el-form>
    <el-table v-loading="listLoading" :data="CatUrList" border stripe highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.ips" stripe highlight-current-row border :default-sort = "{prop: 'cat_total', order: 'descending'}" style="width: 100%">
            <el-table-column label="URL" prop="ip" align="left" width="200">
            </el-table-column>
            <el-table-column label="TOTAL" prop="cat_total" align="center" sortable>
            </el-table-column>
            <el-table-column label="faiure" prop="failure" align="center" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.failure }}</span>
              </template>
            </el-table-column>
            <el-table-column label="failure%" prop="failure_percent" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.failure_percent }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="Min(ms)" prop="min_ms" align="center">
            </el-table-column>
            <el-table-column label="Max(ms)" prop="max_ms" align="center">
            </el-table-column>
            <el-table-column label="Avg(ms)" prop="avg_ms" align="center">
            </el-table-column>
            <el-table-column label="Std(ms)" prop="std" align="center">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="应用名称" prop="server_name" align="left" width="200">
      </el-table-column>
      <el-table-column label="访问路径" prop="url" align="left" width="330">
      </el-table-column>
      <el-table-column label="访问次数" prop="cat_total" align="center" sortable>
      </el-table-column>
      <el-table-column label="失败次数" prop="failure" align="center">
      </el-table-column>
      <el-table-column label="失败比例" prop="failure_percent" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.failure_percent }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="Min(ms)" prop="min_ms" align="center">
      </el-table-column>
      <el-table-column label="Max(ms)" prop="max_ms" align="center">
      </el-table-column>
      <el-table-column label="Avg(ms)" prop="avg_ms" align="center">
      </el-table-column>
      <el-table-column label="95Line(ms)" prop="lin_95" align="center" width="100">
      </el-table-column>
      <el-table-column label="99.9Line(ms)" prop="line_999" align="center" width="110">
      </el-table-column>
      <el-table-column label="Std(ms)" prop="Std" align="center">
      </el-table-column>
      <el-table-column label="QPS" prop="Qps" align="center">
      </el-table-column>
      <el-table-column label="IP数量" prop="ip_number" align="center">
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getCatUrlDetail"
      />
    <el-dialog  :visible.sync="handleHeartBeat" width="1400px">
      <div id='aaaaaa' style="height:1200px; width:1200px;"></div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { validIp } from '@/utils/validate'
import { getCatUrlRow, getServerUrl, getHeartBeat } from '@/api/zabbix/catmonitor'

export default {
  components: { Pagination },
  mixins: [resize],
  data(){
    return{
        listQuery: {
          page: 1,
          limit: 10,
          server_name:null,
          server_id:null
        },
        CatUrList:null,
        total:0,
        query_server_id:[],
        projectOptions:[],
        handleHeartBeat:false,
        heartbeatClose:true,
        heartBeats:{
          dates:[],
          OldGcCount:[],
          PS_ScavengeCount:[],
          PS_ScavengeTime:[],
          PS_MarkSweepTime:[],
          Code_Cache:[],
          Metaspace:[],
          Compressed_Class_Space:[],
          PS_Eden_Space:[],
          PS_Survivor_Space:[],
          PS_Old_Gen:[]
        }
    }
  },
  created(){
      this.getCatUrlDetail()
      this.getServer()
  },
  watch:{
    query_server_id:{
      handler(){
        this.listQuery.server_id = null
        this.listQuery.server_name = this.query_server_id[0]
        if(this.query_server_id[1]){
          this.listQuery.server_name = null
          this.listQuery.server_id = this.query_server_id[1]
        }
        this.$refs.cascaderHandler.dropDownVisible = false
      }
    }
  },
  mounted(){
    // cascader 标签 点击后隐藏起来
    setInterval(function(){
      document.querySelectorAll('.el-cascader-node__label').forEach(el=>{
        el.onclick = function () {
          this.previousElementSibling.click()
        }
      })
    },500)
  },
  methods: {
    findServer(){
      console.log(11111111111)
      this.listLoading = true
      getCatUrlRow(this.listQuery).then(response => {
        this.CatUrList = response.results
        this.total = response.count
      })
      this.listLoading = false
    },
    getRowsInf(){
        getCatUrlRow().then(response => {
            this.CatUrList = response.results
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate(valid => {
        if (valid) {
          this.findServer()
        }
      })
    },
    getCatUrlDetail() {
      this.listLoading = true
      getCatUrlRow(this.listQuery).then(response => {
        this.CatUrList = response.results
        this.total = response.count
      })
      this.listLoading = false
    },
    getServer(){
      getServerUrl().then(response => {
        this.projectOptions = response.data
      })
    },
    handleReset(){
      this.listQuery.page = 1
      this.$refs['listQuery'].validate(valid => {
        if (valid) {
          this.getRowsInf()
        }
      })
    }
  },
}
</script>

<style>

</style>