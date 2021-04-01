<template>
  <div class="app-container" style="padding-top:0px;">
    <el-row>
      <el-col :span="14">
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
            <el-table-column label="操作系统" prop="name">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="os_code=scope.row.code">
                  {{ scope.row.name }}
                </a>
                <!-- {{ scope.row.name }} -->
              </template>
            </el-table-column>
            <el-table-column label="子版本数" prop="model_count">
              <template slot-scope="scope">
                <span>{{ scope.row.sub_version }}</span>
              </template>
            </el-table-column>
            <el-table-column label="生产环境主机数" align="center">
              <el-table-column label="虚拟机" prop="prod_vir_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.prod_vir_host }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物理机" prop="prod_phy_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.prod_phy_host }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="预生产环境主机数" align="center">
              <el-table-column label="虚拟机" prop="stg_vir_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.stg_vir_host }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物理机" prop="stg_phy_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.stg_phy_host }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="测试环境主机数" align="center">
              <el-table-column label="虚拟机" prop="test_vir_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.test_vir_host }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物理机" prop="test_phy_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.test_phy_host }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="未定义主机" prop="undefined_host">
              <template slot-scope="scope">
                <span>{{ scope.row.undefined_host }}</span>
              </template>
            </el-table-column>
            <el-table-column label="主机总数" prop="host_total">
              <template slot-scope="scope">
                <span>{{ scope.row.host_total }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div style="background:#fff;padding-top:20px;">
            <statistics-pie :piedata="firstPieData" :height="height" :title="firstPieTitle"></statistics-pie>
          </div>
      </el-col>
    </el-row>

    <el-row style="padding-top:10px;">
      <el-col :span="14">
        <div class="search-table">
          <div class="clearfix">
            <ul style="list-style:none;float:left;padding:0;margin-bottom:10px;margin-top:0px;">
              <el-select v-model="os_code" placeholder="机房名" size="mini" filterable clearable style="padding:0;">
                <el-option v-for="(item,index) in os_names" :key="index" :label="item.label" :value="item.value"></el-option>
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
            :summary-method="getSummaries"
            :default-sort = "{prop: 'host_total', order: 'descending'}"
            size="mini"
          >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="子版本" prop="os_version">
              <template slot-scope="scope">
                <span>{{ scope.row.os_version }}</span>
              </template>
            </el-table-column>
            <el-table-column label="生产环境主机数" align="center">
              <el-table-column label="虚拟机" prop="prod_vir_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.prod_vir_host }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物理机" prop="prod_phy_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.prod_phy_host }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="预生产环境主机数" align="center">
              <el-table-column label="虚拟机" prop="stg_vir_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.stg_vir_host }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物理机" prop="stg_phy_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.stg_phy_host }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="测试环境主机数" align="center">
              <el-table-column label="虚拟机" prop="test_vir_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.test_vir_host }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物理机" prop="test_phy_host" min-width="60px">
                <template slot-scope="scope">
                  <span>{{ scope.row.test_phy_host }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="未定义主机" prop="undefined_host">
              <template slot-scope="scope">
                <span>{{ scope.row.undefined_host }}</span>
              </template>
            </el-table-column>
            <el-table-column label="主机总数" prop="host_total">
              <template slot-scope="scope">
                <span>{{ scope.row.host_total }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
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
import { getOSFirstTable, getOSNames, getOSSecondTable } from '@/api/cmdbs/statistics'

export default {
  name: 'StatisticsOS',
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
      firstPieTitle: '操作系统-主机分布',
      firstPieData: [],

      btnPlain: true,
      height: '450px',

      os_code: 1,
      os_names: [],
      tableData2: [],
      listLoading2: false,
      search2: undefined,
      secondPieTitle: '操作系统子版本-主机分布',
      secondPieData: [],

      dialogVisible: false,
      dialogTitle: '',

      downloadLoading: false,
      downloadLoading2: false,
      filename: '操作系统-主机数',
      filename2: '操作系统子版本-主机数',
      autoWidth: true,
      bookType: 'xlsx',

    }
  },

  created() {
    this.getRowsInf()

    getOSNames().then(response => {
      this.os_names = response
    })

    this.getRowsInf2({os_code: this.os_code})

  },

  watch: {
    os_code: {
      handler(newValue, oldValue) {
        this.os_name = newValue
        this.getRowsInf2({os_code: this.os_code})

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
      getOSFirstTable().then(response => {
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
      getOSSecondTable(params).then(response => {
        this.tableData2 = response
        this.secondPieData = []
        for(let item of response) {
          this.secondPieData.push({name: item.os_version, value: item.host_total})
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
      getOSFirstTable().then(response => {
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
      getOSSecondTable({os_code: this.os_code}).then(response => {
        let data = response
        for(let item of data) {
          if(this.search2) {
            this.tableData2 = data.filter(item => item.os_version.indexOf(this.search2)!==-1)
          } else {
            this.tableData2 = data
          }
        }
      })
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['操作系统', '子版本数', '生产-虚机', '生产-物理机', '预生产-虚机', '预生产-物理机', '测试-虚机', '测试-物理机', '未定义主机', '主机总数']
        const filterVal = ['name', 'sub_version', 'prod_vir_host', 'prod_phy_host', 'stg_vir_host', 'stg_phy_host', 'test_vir_host', 'test_phy_host', 'undefined_host', 'host_total']
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
        const tHeader = ['子版本', '生产-虚机', '生产-物理机', '预生产-虚机', '预生产-物理机', '测试-虚机', '测试-物理机', '未定义主机', '主机总数']
        const filterVal = ['os_version', 'prod_vir_host', 'prod_phy_host', 'stg_vir_host', 'stg_phy_host', 'test_vir_host', 'test_phy_host', 'undefined_host', 'host_total']
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
        }, 1000)
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

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += ' 元';
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
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
