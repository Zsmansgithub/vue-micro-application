<template>
  <div class="app-container" style="padding-top:0px;">
    <div class="search-table">
      <div class="clearfix">
        <ul style="list-style:none;float:left;padding:0;margin-bottom:10px;margin-top:0px;">
          <el-select v-model="unit" placeholder="组织" size="small" filterable clearable style="padding:0;">
            <el-option v-for="(item,index) in units" :key="index" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </ul>
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
              @click="handleDownload" style="display:inline;" >
              导出
              <i class="el-icon-download"></i>
            </el-button>
          </li>
        </ul>
      </div>

    <!-- <el-row :gutter="10" style="padding-right:15px">
      <el-col :span="19">
        <el-select v-model="unit" placeholder="组织" size="small">
          <el-option v-for="(item,index) in units" :key="index" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" >
        <el-input placeholder="输入关键字搜索"
          v-model="search"
          size="small"
          @keyup.delete.native="handleReset"
          @keyup.enter.native="handleFilter">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="handleFilter"></i>
        </el-input>
      </el-col>
      <el-col :span="1" style="float:right;">
        <el-button type="primary" size="small" :plain="btnPlain" :loading="downloadLoading" @click="handleDownload">导出<i class="el-icon-download"></i></el-button>
      </el-col>
    </el-row> -->

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
      <el-table-column label="板块" prop="name" min-width="120px">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="getSecondLevelContent({ name: scope.row.name, unit: unit })">
            {{ scope.row.plate }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="模块数" prop="module_count" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.module_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="子模块数" prop="submodule_count" min-width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.submodule_count }}</span>
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
      <el-table-column label="主机总数" prop="total" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <el-row style="margin-top:10px;">
      <el-col :span="10">
        <div style="background:#fff;">
          <statistics-pie :piedata="firstLevelPieData" :height="height" :title="firstLevelPieTitle"></statistics-pie>
        </div>
      </el-col>
      <el-col :span="14">
        <div style="background:#fff;">
          <statistics-tree :height="height" :treedata="treeData"></statistics-tree>
        </div>
      </el-col>
    </el-row>
    <!-- <div>
      <statistics-project-pie />
    </div> -->

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
        <statistics-pie :piedata="secondLevelPieData"></statistics-pie>
      </el-row>
      <el-row>
        <el-table
          v-loading="listLoading2"
          :data="secondTableData"
          border
          stripe
          highlight-current-row
          fit
          show-summary
          size="mini"
          :default-sort = "{prop: 'total', order: 'descending'}">
          <el-table-column label="ID" prop='id' width="55px">
            <template slot-scope="scope">
              <span>{{ scope.$index }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模块" prop="name" min-width="80px">
            <template slot-scope="scope">
              <a style="color: #1890ff" @click="getThirdLevelContent({ name: scope.row.name, unit: unit })">
              {{ scope.row.module_name }}
              </a>
              <!-- <span>{{ scope.row.module_name }}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="子模块数" prop="submodule_count" min-width="60px">
            <template slot-scope="scope">
              <span>{{ scope.row.submodule_count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应用数" prop="app_count" min-width="50px">
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
      </el-row>
    <!-- </el-drawer> -->

      <el-dialog
        :title="dialogTitle2"
        :visible.sync="dialogVisible2"
        :before-close="handleClose2"
        height="90%"
        width="800px"
        top="12vh"
        append-to-body
      >
        <el-row>
          <statistics-pie :piedata="thirdLevelPieData"></statistics-pie>
        </el-row>
        <el-row>
          <el-table
            v-loading="listLoading3"
            :data="thirdTableData"
            border
            stripe
            highlight-current-row
            fit
            show-summary
            size="mini"
            :default-sort = "{prop: 'total', order: 'descending'}">
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="子模块" prop="name" min-width="80px">
              <template slot-scope="scope">
                <span>{{ scope.row.submodule_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用数" prop="app_count" min-width="50px">
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
        </el-row>
      </el-dialog>
    </el-dialog>


  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import sessionDashboard from "@/components/mixins/sessionDashboard";
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'

import StatisticsPie from './statistics_pie'
import StatisticsTree from './statistics_tree'
import { getProjectFirstList, getProjectSecondList, getProjectUnit, getProjectTree, getProjectThirdList } from '@/api/cmdbs/statistics'

export default {
  name: 'StatisticsProject',
  components: {
    Pagination,
    'statistics-pie': StatisticsPie,
    'statistics-tree': StatisticsTree,
  },
  directives: { waves },
  mixins: [resize, sessionDashboard],
  data() {
    return {
      // listQuery: {
      //   unit: '国内速递产品部',
      //   search: undefined,
      // },
      unit: '国内速递产品部',
      search: undefined,
      units: [],
      btnPlain: true,
      tableData: [],
      firstLevelPieTitle: '板块-主机分布',
      firstLevelPieData: [],
      secondTableData: [],
      secondLevelPieData: [],
      thirdTableData: [],
      thirdLevelPieData: [],
      listLoading: false,
      listLoading2: false,
      listLoading3: false,
      // showSecondTable: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogVisible2: false,
      dialogTitle2: '',
      drawer: false,
      height: '550px',
      treeData: [],
      downloadLoading: false,
      filename: '产品线-主机数',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created() {
    this.getTreeData({unit: this.unit})
    getProjectUnit().then(response => {
      this.units = response
    })
    this.getRowsInf({unit: this.unit})
  },
  watch: {
    secondTableData: {
      handler(newValue, oldValue) {
      this.secondTableData = newValue
      // this.showSecondTable = false
      // this.showSecondTable = true
      },
      deep: true
    },
    secondLevelPieData: {
      handler(newValue, oldValue) {
      this.secondLevelPieData = newValue
      },
      deep: true
    },
    unit: {
      handler(newValue, oldValue) {
        this.unit = newValue
        this.getRowsInf({unit: this.unit})
        this.getTreeData({unit: this.unit})
        this.setSessionItem({
          [this.$attrs.componentName]: {unit: newValue}
        })
      },
      deep: true
    },
    thirdTableData: {
      handler(newValue, oldValue) {
      this.thridTableData = newValue
      },
      deep: true
    },
    thirdLevelPieData: {
      handler(newValue, oldValue) {
      this.thirdLevelPieData = newValue
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
    getTreeData(params) {
      getProjectTree(params).then(response =>
        this.treeData = response
      )
    },
    getRowsInf(params) {
      this.listLoading = true
      getProjectFirstList(params).then(response => {
        this.tableData = response.results

        this.firstLevelPieData = []
        for(let item of response.results) {
          let name = item.name.split('-')[1]
          this.firstLevelPieData.push({name: name, value: item.total})
        }

        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    getSecondLevelContent(params) {
      this.listLoading2 = true
      getProjectSecondList(params).then(response => {
        if(response) {
          // this.showSecondTable = true
          // this.drawer = true
          this.dialogTitle = params.name
          this.dialogVisible = true
          let resp = response.sort((a, b) => a.total-b.total)
          this.secondTableData = resp
          this.secondLevelPieData = []
          for(let item of resp) {
            this.secondLevelPieData.push({name: item.module_name, value: item.total})
          }

          setTimeout(() => {
            this.listLoading2 = false
          }, 1000)
          // console.log('@@@@@@',document.getElementById('module').scrollTop)
          // window.onload=function() {
          //   let hScrollTop = document.getElementById('module').scrollTop;
          //   let hScrollHeight = document.getElementById('module').scrollHeight;
          //   let height = document.getElementById('module').offsetHeight;
          //   console.log(hScrollTop+" "+hScrollHeight+" "+height);
          //   if((height+hScrollTop)>=hScrollHeight) {    //滚动条已经到了容器底部
          //       // document.getElementById('main').scrollTop=0;
          //   } else {
          //       var h = hScrollTop + height;
          //       document.getElementById('module').scrollTop=h;
          //   }
          // }
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogTitle = ''
    },
    getThirdLevelContent(params) {
      this.listLoading3 = true
      getProjectThirdList(params).then(response => {
        if(response) {
          this.dialogTitle2 = params.name
          this.dialogVisible2 = true
          let resp = response.sort((a, b) => a.total-b.total)
          this.thirdTableData = resp
          this.thirdLevelPieData = []
          for(let item of resp) {
            this.thirdLevelPieData.push({name: item.submodule_name, value: item.total})
          }

          setTimeout(() => {
            this.listLoading3 = false
          }, 1000)
        }
      })
    },
    handleClose2() {
      this.dialogVisible2 = false
      this.dialogTitle2 = ''
    },
    handleReset() {
      this.search = undefined
    },
    handleFilter() {
      getProjectFirstList({unit: this.unit}).then(response => {
        // this.tableData = response.results.filter(item => item.name.indexOf(this.search)!==-1)
        let data = response.results
        for(let item of data) {
          if(this.search) {
            this.tableData = data.filter(item => item.name.indexOf(this.search)!==-1)
          } else {
            this.tableData = data
          }
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['组织-板块', '模块数', '子模块数', '应用数', '生产-虚机', '生产-物理机', '预生产-虚机', '预生产-物理机', '测试-虚机', '测试-物理机', '未定义主机', '主机总数']
        const filterVal = ['name', 'module_count', 'submodule_count', 'app_count', 'prod_vir_host', 'prod_phy_host', 'stg_vir_host', 'stg_phy_host', 'test_vir_host', 'test_phy_host', 'undefined_host', 'total']
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  },
}
</script>

<style lang="scss" scoped>
  /* .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #212e3e !important;
  } */
// 表格中选中当前行样式,两种方式
  /* .el-table__body tr:hover>td{
    background-color: #e1e7f0!important;
  }
  .el-table__body tr.current-row>td{
    background-color: #e1e7f0!important;
  } */
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
