<template>
  <div class="app-container" style="padding-top:0px;">
    <el-row style="margin-bottom:10px;">
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
            <el-table-column label="机房" prop="name" width="210">
              <template slot-scope="scope">
                <a @click="mr_name=scope.row.id">{{ scope.row.name }}</a>
                <!-- {{ scope.row.name }} -->
              </template>
            </el-table-column>
            <el-table-column label="通道数" prop="frame_count">
              <template slot-scope="scope">
                <span>{{ scope.row.frame_count }}</span>
              </template>
            </el-table-column>
            <el-table-column label="机柜数" prop="rack_count">
              <template slot-scope="scope">
                <span>{{ scope.row.rack_count }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总U数" prop="size_total">
              <template slot-scope="scope">
                {{ scope.row.size_total }}
              </template>
            </el-table-column>
            <el-table-column label="已用U数" align="center">
              <el-table-column label="设备" prop="size_used" width="60">
                <template slot-scope="scope">
                  <span>{{ scope.row.size_used }}</span>
                </template>
              </el-table-column>
              <el-table-column label="配线架" prop="distribution_frame_used" width="60">
                <template slot-scope="scope">
                  <span>{{ scope.row.distribution_frame_used }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="剩余U数" prop="size_remain">
              <template slot-scope="scope">
                <span>{{ scope.row.size_remain }}</span>
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
        <div style="background:#fff;">
          <statistics-pie :piedata="firstPieData" :height="height" :title="firstPieTitle"></statistics-pie>
        </div>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span="12">
        <div class="search-table">
          <div class="clearfix">
            <ul style="list-style:none;float:left;padding:0;margin-bottom:10px;margin-top:0px;">
              <el-select v-model="mr_name" placeholder="机房名" size="mini" filterable clearable style="padding:0;">
                <el-option v-for="(item,index) in mr_names" :key="index" :label="item.label" :value="item.value"></el-option>
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
                <el-button type="primary" size="mini" :plain="btnPlain" icon="el-icon-search" @click="handleFilter2">搜索</el-button>
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
            size="mini"
            >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="通道" prop="frame_name" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.frame_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="机柜数" prop="rack_count">
              <template slot-scope="scope">
                <a @click="getThirdLevel(scope.row.frame_name, scope.row.the_third_level)">{{ scope.row.rack_count }}</a>
              </template>
            </el-table-column>
            <el-table-column label="总U数" prop="size_total">
              <template slot-scope="scope">
                {{ scope.row.size_total }}
              </template>
            </el-table-column>
            <el-table-column label="已用U数" prop="size_used">
              <template slot-scope="scope">
                <span>{{ scope.row.size_used }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余U数" prop="size_remain">
              <template slot-scope="scope">
                <span>{{ scope.row.size_remain }}</span>
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
        <div style="background:#fff;">
          <statistics-pie :piedata="secondPieData" :height="height" :title="secondPieTitle"></statistics-pie>
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
      <statistics-pie :piedata="thirdPieData"></statistics-pie>
      <el-table v-loading="listLoading3" :data="tableData3" size="mini" border stripe highlight-current-row fit show-summary
        style="width:100%">
        <el-table-column prop="frame_rack" label="机柜">
          <template slot-scope="scope">
            <!-- <span>{{ dialogFrameName + scope.row.rack_number }}</span> -->
            <span>{{ scope.row.frame_rack }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size_total" label="总U数"></el-table-column>
        <el-table-column prop="size_used" label="已用U数"></el-table-column>
        <el-table-column prop="size_remain" label="剩余U数"></el-table-column>
        <el-table-column prop="host_total" label="物理机数"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import resize from '@/components/Charts/mixins/resize'
import sessionDashboard from "@/components/mixins/sessionDashboard";

import StatisticsPie from './statistics_pie'
import StatisticsTree from './statistics_tree'
import { getMRFirstList, getMRNames, getMRSecondList } from '@/api/cmdbs/statistics'

export default {
  name: 'StatisticsMachineRoom',
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
      firstPieTitle: '机房-主机分布',
      firstPieData: [],
      btnPlain: true,
      height: '450px',
      mr_name: 1,
      mr_names: [],
      tableData2: [],
      listLoading2: false,
      search2: undefined,
      secondPieTitle: '机房通道-主机分布',
      secondPieData: [],
      dialogVisible: false,
      dialogTitle: '',
      tableData3: [],
      listLoading3: false,
      thirdPieData: [],
      dialogFrameName: '',
      downloadLoading: false,
      downloadLoading2: false,
      filename: '机房-主机数',
      filename2: '机房通道-主机数',
      autoWidth: true,
      bookType: 'xlsx',
    }
  },
  created() {
    this.getRowsInf()
    getMRNames().then(response => {
      this.mr_names = response
    })
    this.getRowsInf2({mr_name: this.mr_name})
  },
  watch: {
    mr_name: {
      handler(newValue, oldValue) {
        this.mr_name = newValue
        this.getRowsInf2({mr_name: this.mr_name})
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
      getMRFirstList().then(response => {
        this.tableData = response
        this.firstPieData = []
        for(let item of response) {
          this.firstPieData.push({name: item.name, value: item.host_total})
        }

        setTimeout(() => {
          this.listLoading = false
        })
      })
    },

    getRowsInf2(params) {
      this.listLoading2 = true
      getMRSecondList(params).then(response => {
        this.tableData2 = response
        this.secondPieData = []
        for(let item of response) {
          this.secondPieData.push({name: item.frame_name, value: item.host_total})
        }

        setTimeout(() => {
         this.listLoading2 = false
        })
      })
    },

    handleReset() {
      this.search = undefined
    },
    handleFilter() {
      getMRFirstList().then(response => {
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
      getMRSecondList({mr_name: this.mr_name}).then(response => {
        let data = response
        for(let item of data) {
          if(this.search2) {
            this.tableData2 = data.filter(item => item.frame_name.indexOf(this.search2)!==-1)
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
        })
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
        })

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

    getThirdLevel(frame_name, data) {
      this.listLoading3 = true

      this.dialogTitle = '通道-' + frame_name
      this.dialogFrameName = frame_name
      this.tableData3 = data
      this.thirdPieData = []
        for(let item of this.tableData3) {
          this.thirdPieData.push({name: item.frame_rack, value: item.host_total})
        }
      this.dialogVisible = true

      setTimeout(() => {
        this.listLoading3 = false
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogTitle = ''
      this.dialogFrameName = ''
      this.tableData3 = []
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
