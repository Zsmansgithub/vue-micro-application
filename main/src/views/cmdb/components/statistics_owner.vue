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
            :default-sort = "{prop: 'total', order: 'descending'}"
            size="mini"
          >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门" prop="dep_name" min-width="90px">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="name=scope.row.dep_name">
                  {{ scope.row.dep_name }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="负责人数" prop="owner_count" min-width="60px">
              <template slot-scope="scope">
                <span>{{ scope.row.owner_count }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用数" prop="app_count" min-width="60px">
              <template slot-scope="scope">
                <span>{{ scope.row.app_count }}</span>
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
            <el-table-column label="主机总数" prop="total">
              <template slot-scope="scope">
                <span>{{ scope.row.total }}</span>
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

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      height="90%"
      width="800px"
      top="6vh">
    <!-- <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="50%"> -->
      <el-row>
        <statistics-pie :piedata="secondPieData" :title="secondPieTitle"></statistics-pie>
      </el-row>
      <el-row>
        <el-table
            v-loading="listLoading2"
            :data="tableData2"
            border
            stripe
            highlight-current-row
            fit
            show-summary
            :default-sort = "{prop: 'total', order: 'descending'}"
            size="mini"
          >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="负责人" prop="name" min-width="115px">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用数" prop="app_count" min-width="60px">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="handleRedirect(scope.row.name)">
                  {{ scope.row.app_count }}
                </a>
                <!-- <span>{{ scope.row.app_count }}</span> -->
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
            <el-table-column label="主机总数" prop="total">
              <template slot-scope="scope">
                <span>{{ scope.row.total }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-dialog>

    <!-- <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="14">
        <div class="search-table">
          <div class="clearfix">
            <ul style="list-style:none;float:left;padding:0;margin-bottom:10px;margin-top:0px;">
              <el-select v-model="name" placeholder="机房名" size="mini" style="padding:0;">
                <el-option v-for="(item,index) in names" :key="index" :label="item.value" :value="item.value"></el-option>
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
            v-loading="listLoading"
            :data="tableData2"
            border
            stripe
            highlight-current-row
            fit
            show-summary
            :default-sort = "{prop: 'total', order: 'descending'}"
            size="mini"
          >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名" prop="app_name">
              <template slot-scope="scope">
                <span>{{ scope.row.app_name }}</span>
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
            <el-table-column label="主机总数" prop="total">
              <template slot-scope="scope">
                <span>{{ scope.row.total }}</span>
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
    </el-row> -->

  </div>
</template>

<script>
import resize from '@/components/Charts/mixins/resize'
import sessionDashboard from "@/components/mixins/sessionDashboard";

import StatisticsPie from './statistics_pie'
import StatisticsTree from './statistics_tree'
import { getOwnerFirstList, getOwnerNames, getOwnerSecondList } from '@/api/cmdbs/statistics'

export default {
  name: 'StatisticsOwner',
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
      firstPieTitle: '部门-主机分布',
      firstPieData: [],
      btnPlain: true,
      height: '450px',
      name: undefined,
      names: [],
      tableData2: [],
      listLoading2: false,
      search2: undefined,
      secondPieTitle: '',
      secondPieData: [],
      dialogVisible: false,
      dialogTitle: '',
      downloadLoading: false,
      downloadLoading2: false,
      filename: '负责人-主机数',
      filename2: '应用-主机数',
      autoWidth: true,
      bookType: 'xlsx',
    }
  },
  created() {
    this.getRowsInf()

    // getOwnerNames().then(response => {
    //   this.names = response
    // })

    // this.getRowsInf2({name: this.name})

  },
  watch: {
    name: {
      handler(newValue, oldValue) {
        this.name = newValue
        this.getRowsInf2({name: this.name})
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
      getOwnerFirstList().then(response => {
        this.tableData = response
        this.firstPieData = []
        for(let item of response) {
          this.firstPieData.push({name: item.dep_name, value: item.total})
        }

        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },

    getRowsInf2(params) {
      this.listLoading2 = true
      getOwnerSecondList(params).then(response => {
        this.dialogTitle = params.name
        this.dialogVisible = true
        this.tableData2 = response
        this.secondPieData = []
        for(let item of response) {
          this.secondPieData.push({name: item.name, value: item.total})
        }

        setTimeout(() => {
          this.listLoading2 = false
        }, 1000)
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogTitle = ''
    },

    handleReset() {
      this.search = undefined
    },
    handleFilter() {
      getOwnerFirstList().then(response => {
        let data = response
        for(let item of data) {
          if(this.search) {
            this.tableData = data.filter(item => item.dep_name.indexOf(this.search)!==-1)
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
      getOwnerSecondList({name: this.name}).then(response => {
        let data = response
        for(let item of data) {
          if(this.search2) {
            this.tableData2 = data.filter(item => item.app_name.indexOf(this.search2)!==-1)
          } else {
            this.tableData2 = data
          }
        }
      })
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['机房', '通道数', '机柜数', '总大小', '已用大小', '剩余大小', '物理机数']
        const filterVal = ['name', 'frame_count', 'rack_count', 'size_total', 'size_used', 'size_remain', 'host_total']
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
        const tHeader = ['通道', '机柜数', '总大小', '已用大小', '剩余大小', '物理机数']
        const filterVal = ['frame_name', 'rack_count', 'size_total', 'size_used', 'size_remain', 'host_total']
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

    handleRedirect(name) {
      let owner_name = name.split(/[()]/)[1]
      this.$router.push({ name: 'appconfig', params: { owner_name: owner_name }})
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
