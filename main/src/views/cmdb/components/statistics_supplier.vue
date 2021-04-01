<template>
  <div class="app-container" style="padding-top:0px;">
    <el-row>
      <el-col :span="14">
        <div class="search-table">
          <div class="clearfix">
            <ul style="list-style:none;float:left;padding:0;margin:0 0 10px 0;">
              <li style="float:left;padding-right:5px">
                <el-select v-model="type" placeholder="资源类型" size="mini" filterable clearable style="width:120px">
                  <el-option v-for="(item,index) in types" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </li>
            </ul>
            <ul style="list-style:none;float:right;padding:0;margin-bottom:10px;margin-top:0;">
              <li style="float:left;padding-right:10px;">
                <el-date-picker
                  v-model="custom_date"
                  type="date"
                  placeholder="自定义日期应大于3个月"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  :default-value="showDate"
                >
                </el-date-picker>
              </li>
              <li style="float:right;">
                <el-button type="primary" size="mini" :plain="btnPlain" icon="el-icon-search">搜索</el-button>
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
            <el-table-column label="维保商" prop="name">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="维保过期时间" align="center">
              <el-table-column label="已过期" prop="had_expired">
                <template slot-scope="scope">
                  <a @click="handleSecondTable(scope.row.name, scope.row.had_expired_ids, '已过期')" v-if="scope.row.had_expired!==0">
                    {{ scope.row.had_expired }}
                  </a>
                  <span v-else>{{ scope.row.had_expired }}</span>
                </template>
              </el-table-column>
              <el-table-column label="3个月内" prop="three_months">
                <template slot-scope="scope">
                  <a @click="handleSecondTable(scope.row.name, scope.row.three_months_ids, '3个月内过期')" v-if="scope.row.three_months!==0">
                    {{ scope.row.three_months }}
                  </a>
                  <span v-else>{{ scope.row.three_months }}</span>
                </template>
              </el-table-column>
              <el-table-column label="自定义日期前" prop="custom_date_expired">
                <template slot-scope="scope">
                  <a @click="handleSecondTable(scope.row.name, scope.row.custom_date_expired_ids, '自定义日期前过期')" v-if="scope.row.custom_date_expired">
                    {{ scope.row.custom_date_expired }}
                  </a>
                  <span v-else>{{ scope.row.custom_date_expired }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="1年内" prop="one_year">
                <template slot-scope="scope">
                  {{ scope.row.one_year }}
                </template>
              </el-table-column>
              <el-table-column label="2年内" prop="two_years">
                <template slot-scope="scope">
                  {{ scope.row.two_years }}
                </template>
              </el-table-column>
              <el-table-column label="2年后" prop="over_two_years">
                <template slot-scope="scope">
                  {{ scope.row.over_two_years }}
                </template>
              </el-table-column> -->
            </el-table-column>
            <el-table-column label="总设备数" prop="host_total">
              <template slot-scope="scope">
                <span>{{ scope.row.host_total }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="详情" align="center">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-more-outline" @click="handleMore(scope.row)" circle plain></el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div style="background:#fff;padding-top:20px;">
            <statistics-pie :piedata="firstPieData" :height="height" :title="firstPieTitle"></statistics-pie>
          </div>
      </el-col>
    </el-row>

    <!-- <div class="search-table" v-if="showTable2" style="margin-top:10px;">
      <div style="padding-bottom:10px;">
        <span>{{ name }} ({{ table2Type }}):</span>
      </div>
      <el-table
        v-loading="listLoading2"
        :data="tableData2"
        border
        stripe
        highlight-current-row
        fit
        :show-header="false"
        size="mini"
      >
        <el-table-column label="维保商" prop="name" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主机ip" prop="ips">
          <template slot-scope="scope">
            <span>{{ scope.row.ips }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div> -->

    <div class="search-table" v-if="showTable2" style="margin-top:10px;">
      <div class="clearfix">
        <el-tag>{{ name }} ({{ table2Type }}) - {{ expired_date }}</el-tag>
        <ul style="list-style:none;float:right;padding:0;margin:0 0 10px 0;">
          <!-- <li style="float:left;padding-right:10px">
            <el-input placeholder="输入关键字搜索"
              v-model="search2"
              size="mini"
              @keyup.delete.native="handleReset2"
              @keyup.enter.native="handleFilter2">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="handleFilter2"></i>
            </el-input>
          </li> -->
          <li style="float:right;">
            <el-button type="primary"
              size="mini"
              :plain="btnPlain"
              :loading="downloadLoading2"
              @click="handleDownload2" style="display:line;">
              导出
              <i class="el-icon-download"></i>
            </el-button>
          </li>
        </ul>
      </div>

      <el-table
        v-loading="listLoading2"
        :data="tableData2.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        stripe
        highlight-current-row
        fit
        size="mini"
      >
        <el-table-column label="ID" prop='id' width="55px">
          <template slot-scope="scope">
            <span>{{ scope.$index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP" prop="ip">
          <template slot-scope="scope">
            {{ scope.row.ip }}
          </template>
        </el-table-column>
        <el-table-column label="应用名" prop="app_name_type">
          <template slot-scope="scope">
            {{ scope.row.app_name_type }}
          </template>
        </el-table-column>
        <el-table-column label="机房" prop="machine_room">
          <template slot-scope="scope">
            {{ scope.row.machine_room }}
          </template>
        </el-table-column>
        <el-table-column label="机架通道" prop="frame_name">
          <template slot-scope="scope">
            {{ scope.row.frame_name }}
          </template>
        </el-table-column>
        <el-table-column label="机架起始位置" prop="rack_location">
          <template slot-scope="scope">
            <span>{{ scope.row.rack_location }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备大小(U)" prop="size">
          <template slot-scope="scope">
            <span>{{ scope.row.size }}</span>
          </template>
        </el-table-column>
        <el-table-column label="sla级别" prop="sla">
          <template slot-scope="scope">
            {{ scope.row.sla }}
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand">
          <template slot-scope="scope">
            <span>{{ scope.row.brand }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备型号" prop="device_model">
          <template slot-scope="scope">
            <span>{{ scope.row.device_model }}</span>
          </template>
        </el-table-column>
        <el-table-column label="sn" prop="设备sn码">
          <template slot-scope="scope">
            <span>{{ scope.row.sn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产编号" prop="asset_number">
          <template slot-scope="scope">
            <span>{{ scope.row.asset_number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过保时间" prop="expired_day">
          <template slot-scope="scope">
            <span>{{ scope.row.expired_day }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上架时间" prop="putaway_day">
          <template slot-scope="scope">
            <span>{{ scope.row.putaway_day }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        small
        layout="prev, pager, next"
        :page-size="pagesize"
        :total="total"
        @current-change="currentChange"
        style="padding:10px 0 0 20px;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import resize from '@/components/Charts/mixins/resize'
import sessionDashboard from "@/components/mixins/sessionDashboard";

import StatisticsPie from './statistics_pie'
import { getSupplierFirstTable, getSupplierTypes, getSupplierSecondTable } from '@/api/cmdbs/statistics'

export default {
  name: 'StatisticsSupplier',
  mixins: [resize, sessionDashboard],
  components: {
    'statistics-pie': StatisticsPie,
  },
  data() {
    return {
      types: [],
      type: 1,
      name: undefined,
      custom_date: undefined,
      showDate: undefined,
      total: 0,
      pagesize: 10,
      currentPage: 1,
      tableData2: [],
      listLoading2: false,
      showTable2: false,
      expired_date: undefined,
      tableData: [],
      listLoading: false,
      search: undefined,
      firstPieTitle: '维保商-主机分布',
      firstPieData: [],
      height: '450px',
      search2: undefined,
      // dialogVisible: false,
      // dialogTitle: '',
      btnPlain: true,
      downloadLoading: false,
      filename: '维保商-过期主机数',
      autoWidth: true,
      bookType: 'xlsx',
      downloadLoading2: false,
      filename2: '维保商-过期主机数详情',
      once: true,
      componentNameData: null,
    }
  },
  created() {
    getSupplierTypes().then(response => {
      this.types = response
    })
    this.showDateMethod()
    this.getRowsInf({type: this.type})
    let sessionData = sessionStorage.getItem(this.$route.fullPath.replace(/\//g, '_')) || '{}'
    this.componentNameData = Object.freeze(JSON.parse(sessionData)[this.$attrs.componentName]);
    if(this.componentNameData && this.componentNameData.custom_date && this.componentNameData.type !== this.$options.data().type) this.once = false;
  },
  watch: {
    type: {
      handler(newValue, oldValue) {
        this.type = newValue
        this.getRowsInf({type: this.type})
        if(this.once) this.custom_date = undefined;
        this.once = true;
        this.showTable2 = false
        this.setSessionItem({
          [this.$attrs.componentName]: {type: newValue}
        })
      },
      deep: true,
    },
    custom_date: {
      handler(newValue, oldValue) {
        this.custom_date = newValue
        this.getRowsInf({type: this.type, custom_date: this.custom_date})
        this.showTable2 = false
        this.setSessionItem({
          [this.$attrs.componentName]: {
            type: this.type,
            custom_date: newValue,
          }
        })
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
  computed: {
    table2Type: function() {
      for(let item of this.types) {
        if(this.type === item.value) {
          return item.label
        }
      }
    }
  },

  methods: {
    getRowsInf(params) {
      this.listLoading = true
      getSupplierFirstTable(params).then(response => {
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

    // handleReset() {
    //   this.search = undefined
    // },
    // handleFilter() {
    //   getSupplierFirstTable({type: this.type, custom_date: this.custom_date}).then(response => {
    //     let data = response
    //     for(let item of data) {
    //       if(this.search) {
    //         this.tableData = data.filter(item => item.name.indexOf(this.search)!==-1)
    //       } else {
    //         this.tableData = data
    //       }
    //     }
    //   })
    // },

    // handleReset2() {
    //   this.search2 = undefined
    // },
    // handleFilter2() {
    //   getSupplierSecondTable().then(response => {
    //     let data = response
    //     for(let item of data) {
    //       if(this.search2) {
    //         this.tableData2 = data.filter(item => item.name.indexOf(this.search2)!==-1)
    //       } else {
    //         this.tableData2 = data
    //       }
    //     }
    //   })
    // },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['维保商', '已过期', '已过期ip','3个月内过期', '3个月内过期ip', '1年内过期', '1年内过期ip', '2年内过期', '2年内过期ip', '2年后过期', '2年后过期ip', '总设备数']
        // const filterVal = ['name', 'had_expired', 'had_expired_ips', 'three_months', 'three_months_ips', 'one_year', 'one_year_ips', 'two_years', 'two_years_ips', 'over_two_years', 'over_two_years_ips', 'host_total']
        const tHeader = ['维保商', '已过期', '3个月内过期', '自定义日期前过期', '总设备数']
        const filterVal = ['name', 'had_expired', 'three_months', 'custom_date_expired', 'host_total']
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
        const tHeader = ['IP', '应用名', '机房', '机架通道', '机架起始位置', '设备大小(U)', 'sla', '品牌', '设备型号', 'sn', '资产编号', '过期时间', '上架时间']
        const filterVal = ['ip', 'app_name_type', 'machine_room', 'frame_name', 'rack_location', 'size', 'sla', 'brand', 'device_model', 'sn', 'asset_number', 'expired_day', 'putaway_day']
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

    // handleMore(row){
    //   this.listLoading2 = true
    //   this.name = row.name
    //   this.tableData2 = [
    //     {name: '已过期', ips: row.had_expired_ips},
    //     {name: '3个月内过期', ips: row.three_months_ips},
    //     {name: '1年内过期', ips: row.one_year_ips},
    //     {name: '2年内过期', ips: row.two_years_ips},
    //     {name: '2年后过期', ips: row.over_two_years_ips}
    //   ]
    //   this.showTable2 = true
    //   this.listLoading2 = false
    // },

    handleSecondTable(name, ids, date) {
      this.listLoading2 = true
      getSupplierSecondTable({ids: ids}).then(response => {
        this.tableData2 = response
        this.total = response.length
        this.currentPage = 1
        this.showTable2 = true
        this.expired_date = date
        this.name = name

        setTimeout(() => {
          this.listLoading2 = false
        }, 1000)
      })
    },

    currentChange(currentPage) {
      this.currentPage = currentPage;
    },

    showDateMethod() {
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1 + 3    //d.getMonth()+1当前月
      let day = d.getDate()
      if(month > 11) {
        year += 1
        month -= 11
        this.showDate = year+'-'+month+'-'+day
      } else {
        this.showDate = year+'-'+month+'-'+day
      }
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

  a{
    color: #1890ff;
  }
</style>
