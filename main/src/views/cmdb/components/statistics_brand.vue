<template>
  <div class="app-container" style="padding-top:0px;">
    <el-row>
      <el-col :span="12">
        <div class="search-table">
          <div class="clearfix">
            <ul style="list-style:none;float:right;padding:0;margin-bottom:10px;margin-top:0;">
              <li style="float:left;padding-right:10px">
                <el-input placeholder="输入关键字搜索"
                  v-model="search"
                  size="mini"
                  @keyup.delete.native="handleReset"
                  @keyup.enter.native="handleFilter">
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="handleFilter"></i>
                </el-input>
              </li>
              <li style="float:right;">
                <el-button type="primary" size="mini" :plain="btnPlain" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button type="primary"
                  size="mini"
                  :plain="btnPlain"
                  :loading="downloadLoading"
                  @click="handleDownload" style="display:line;" >
                  导出
                  <i class="el-icon-download"></i>
                </el-button>
              </li>
            </ul>
          </div>

          <el-table
            v-loading="listLoading"
            :data="tableData"
            border
            stripe
            highlight-current-row
            fit
            show-summary
            :default-sort = "{prop: 'host_total', order: 'descending'}"
            size="mini"
          >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="品牌" prop="name">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="brand_name=scope.row.name">
                  {{ scope.row.name }}
                </a>
                <!-- {{ scope.row.name }} -->
              </template>
            </el-table-column>
            <el-table-column label="型号数" prop="model_count">
              <template slot-scope="scope">
                <span>{{ scope.row.model_count }}</span>
              </template>
            </el-table-column>
            <el-table-column label="物理机数" prop="host_total">
              <template slot-scope="scope">
                <span>{{ scope.row.host_total }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="background:#fff;padding-top:20px;">
            <statistics-pie :piedata="firstPieData" :height="height" :title="firstPieTitle"></statistics-pie>
          </div>
      </el-col>
    </el-row>

    <el-row style="margin-top:10px;">
      <el-col :span="12">
        <div class="search-table">
          <div class="clearfix">
            <ul style="list-style:none;float:left;padding:0;margin-bottom:10px;margin-top:0px;">
              <el-select v-model="brand_name" placeholder="机房名" size="mini" filterable clearable style="padding:0;">
                <el-option v-for="(item,index) in brand_names" :key="index" :label="item.value" :value="item.value"></el-option>
              </el-select>
            </ul>
            <ul style="list-style:none;float:right;padding:0;margin-bottom:10px;margin-top:0;">
              <li style="float:left;padding-right:10px">
                <el-input placeholder="输入关键字搜索"
                  v-model="search2"
                  size="mini"
                  @keyup.delete.native="handleReset2"
                  @keyup.enter.native="handleFilter2">
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="handleFilter2"></i>
                </el-input>
              </li>
              <li style="float:right;">
                <el-button type="primary"
                  size="mini"
                  :plain="btnPlain"
                  :loading="downloadLoading2"
                  @click="handleDownload2" style="display:line;" >
                  导出
                  <i class="el-icon-download"></i>
                </el-button>
              </li>
            </ul>
          </div>

          <el-table
            v-loading="listLoading2"
            :data="tableData2"
            border
            stripe
            highlight-current-row
            fit
            show-summary
            :default-sort = "{prop: 'host_total', order: 'descending'}"
            size="mini"
          >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="型号" prop="model_name">
              <template slot-scope="scope">
                <span>{{ scope.row.model_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="物理机数" prop="host_total">
              <template slot-scope="scope">
                <span>{{ scope.row.host_total }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            v-show="total>0"
            :total="total"
            :page.sync="page"
            :limit.sync="limit"
            @pagination="getRowsInf2"
            style="padding-top:5px;margin-top:10px;"
          /> -->
        </div>
      </el-col>
      <el-col :span="12">
        <div style="background:#fff;padding-top:20px;">
            <statistics-pie :piedata="secondPieData" :height="height" :title="secondPieTitle"></statistics-pie>
          </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import resize from '@/components/Charts/mixins/resize'
import sessionDashboard from "@/components/mixins/sessionDashboard";

import StatisticsPie from './statistics_pie'
import StatisticsTree from './statistics_tree'
import { getBrandFirstTable, getBrandNames, getBrandSecondTable } from '@/api/cmdbs/statistics'

export default {
  name: 'StatisticsBrand',
  mixins: [resize, sessionDashboard],
  components: {
    'statistics-pie': StatisticsPie,
    'statistics-tree': StatisticsTree,

  },

  data() {
    return {
      tableData: [],
      listLoading: false,
      search: undefined,
      firstPieTitle: '品牌-主机分布',
      firstPieData: [],

      btnPlain: true,
      height: '450px',

      brand_name: 'HP',
      brand_names: [],
      tableData2: [],
      listLoading2: false,
      search2: undefined,
      secondPieTitle: '品牌_型号-主机分布',
      secondPieData: [],

      dialogVisible: false,
      dialogTitle: '',

      downloadLoading: false,
      downloadLoading2: false,
      filename: '品牌-主机数',
      filename2: '品牌型号-主机数',
      autoWidth: true,
      bookType: 'xlsx',

      total: 0,
      page: 1,
      limit: 10,

    }
  },

  created() {
    this.getRowsInf()

    getBrandNames().then(response => {
      this.brand_names = response
    })

    this.getRowsInf2({brand_name: this.brand_name})

  },

  watch: {
    brand_name: {
      handler(newValue, oldValue) {
        this.brand_name = newValue
        this.getRowsInf2({brand_name: this.brand_name})

      },
    deep: true
    },

  },

  mounted() {
  },
  updated() {
  },
  computed: {
  },
  filters: {
  },

  methods: {
    getRowsInf() {
      this.listLoading = true
      getBrandFirstTable().then(response => {
        this.tableData = response
        this.firstPieData = []
        for(let item of response) {
          this.firstPieData.push({name: item.name, value: item.host_total})
        }

        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },

    getRowsInf2(params) {
      this.listLoading2 = true
      getBrandSecondTable(params).then(response => {
        this.tableData2 = response
        this.secondPieData = []
        for(let item of response) {
          this.secondPieData.push({name: item.model_name, value: item.host_total})
        }

        setTimeout(() => {
          this.listLoading2 = false
        }, 1000)
      })
    },

    handleReset() {
      this.search = undefined
    },
    handleFilter() {
      getBrandFirstTable().then(response => {
        let data = response
        for(let item of data) {
          if(this.search) {
            this.tableData = data.filter(item => item.name.indexOf(this.search)!==-1)
          } else {
            this.tableData = data
          }
        }
      })
    },

    handleReset2() {
      this.search2 = undefined
    },
    handleFilter2() {
      getBrandSecondTable({brand_name: this.brand_name}).then(response => {
        let data = response
        for(let item of data) {
          if(this.search2) {
            this.tableData2 = data.filter(item => item.model_name.indexOf(this.search2)!==-1)
          } else {
            this.tableData2 = data
          }
        }
      })
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['品牌', '型号数', '物理机数']
        const filterVal = ['name', 'model_count', 'host_total']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })

        setTimeout(() => {
          this.downloadLoading = false
        }, 1000)
      })
    },
    handleDownload2() {
      this.downloadLoading2 = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['型号', '物理机数']
        const filterVal = ['model_name', 'host_total']
        const list = this.tableData2
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename2,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })

        setTimeout(() => {
          this.downloadLoading2 = false
        }, 10000)

      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

  },
}
</script>

<style lang="scss" scoped>
  .el-table{
    overflow: visible!important;
  }

  .search-table{
    padding: 10px 10px 10px 10px;
    border:1px solid #e3f4ff;
  }

  .clearfix:after{
    content: '';
    display: block;
    clear: both;
  }

</style>
