<template>
  <div class="app-container" style="padding-top:0;">
    <el-row>
      <el-col :span="14">
        <div class="search-table">
          <div class="clearfix">
            <ul class="fl" style="list-style:none;padding:0;margin:0 0 10px 0;">
              <li style="flaot:left;padding-right:5px">
                <el-select v-model="vcenter" placeholder="vcenter" size="mini" filterable clearable style="width:120px" @change="getRowsInf({vid: vcenter})">
                  <el-option v-for="(item,index) in select_vcenter" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </li>
            </ul>
            <ul class="fr" style="list-style:none;padding:0;margin:0 0 10px 0;">
              <li class="fl" style="padding-right:10px">
                <el-input placeholder="根据宿主机IP全局搜索"
                  v-model="search"
                  size="mini"
                  @keyup.delete.native="handleReset"
                  @keyup.enter.native="handleFilter">
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="handleFilter"></i>
                </el-input>
              </li>
              <li class="fr">
                <el-button type="primary" size="mini" :plain="btnPlain" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button type="primary"
                  size="mini"
                  :plain="btnPlain"
                  :loading="downloadLoading"
                  @click="handleDownload" style="display:line;">
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
            :summary-method="getSummaries"
            :default-sort = "{prop: 'vir_total', order: 'descending'}"
            size="mini"
          >
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="集群名" prop="cluster_name">
              <template slot-scope="scope">
                <a @click="handleCluster(scope.row.cid, scope.row.cluster_name)">{{ scope.row.cluster_name }}</a>
              </template>
            </el-table-column>
            <el-table-column label="宿主机数" prop="phy_total">
              <template slot-scope="scope">
                {{ scope.row.phy_total }}
              </template>
            </el-table-column>
            <el-table-column label="虚拟机数" prop="vir_total">
              <template slot-scope="scope">
                {{ scope.row.vir_total }}
              </template>
            </el-table-column>
            <el-table-column label="应用数" prop="app_total">
              <template slot-scope="scope">
                {{ scope.row.app_total }}
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

    <el-row v-if="showTable2" style="padding-top:10px;">
      <el-col :span="14">
        <div class="search-table">
          <div class="clearfix">
            <el-tag>{{ vcenter_name }} - {{ cluster_name }}</el-tag>
            <ul class="fr" style="list-style:none;padding:0;margin:0 0 10px 0;">
              <li class="fr">
                <el-button type="primary"
                  size="mini"
                  :plain="btnPlain"
                  :disabled="bulkButton"
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
            :data="tableData2"
            border
            stripe
            highlight-current-row
            fit
            show-summary
            :summary-method="getSummaries2"
            :default-sort = "{prop: 'vir_total', order: 'descending'}"
            size="mini"
            @selection-change="handleSelectionChange" 
          >
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="ID" prop='id' width="55px">
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="宿主机IP" prop="host_ip">
              <template slot-scope="scope">
                {{ scope.row.host_ip }}
              </template>
            </el-table-column>
            <el-table-column label="虚拟机数" prop="vir_total">
              <template slot-scope="scope">
                <a @click="handleHost(scope.row.vir_info, scope.row.host_ip)">{{ scope.row.vir_total }}</a>
              </template>
            </el-table-column>
            <el-table-column label="应用数" prop="app_total">
              <template slot-scope="scope">
                <!-- <a @click="handleApp(scope.row.app_id_list, scope.row.host_ip)" v-if="scope.row.app_total!==0">{{ scope.row.app_total }}</a> -->
                <a @click="handleApp(scope.row.app_info, scope.row.host_ip)" v-if="scope.row.app_total!==0">{{ scope.row.app_total }}</a>
                <span v-else>{{ scope.row.app_total }}</span>
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

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      height="80%"
      width="1000px"
      top="12vh">
      <el-table v-loading="listLoading3" :data="tableData3.slice((currentPage-1)*pagesize,currentPage*pagesize)" size="mini" style="width:100%">
        <el-table-column prop="ip" label="虚拟机IP"></el-table-column>
        <el-table-column prop="app_name" label="应用名_类型"></el-table-column>
        <el-table-column prop="app_owner" label="负责人"></el-table-column>
      </el-table>
      <el-pagination
        small
        layout="prev, pager, next"
        :page-size="pagesize"
        :total="total"
        @current-change="currentChange"
        style="padding:10px 0 0 20px;">
      </el-pagination>
    </el-dialog>

    <el-dialog
      :title="dialogTitle2"
      :visible.sync="dialogVisible2"
      :before-close="handleClose2"
      height="80%"
      width="1000px"
      top="12vh"
    >
      <div class="search-table">
        <div class="clearfix">
          <ul class="fr" style="list-style:none;padding:0;margin:0 0 10px 0;">
            <li class="fr">
              <el-button type="primary"
                size="mini"
                :plain="btnPlain"
                :loading="downloadLoading3"
                @click="handleDownload3" style="display:line;">
                导出
                <i class="el-icon-download"></i>
              </el-button>
            </li>
          </ul>
        </div>
        <el-table v-loading="listLoading4" :data="tableData4" size="mini" style="width:100%">
          <el-table-column prop="name" label="应用名_类型"></el-table-column>
          <el-table-column prop="project" label="产品线"></el-table-column>
          <el-table-column prop="owner" label="负责人" min-width="30px"></el-table-column>
          <el-table-column prop="vir_all" label="所有虚拟机数量" sortable></el-table-column>
          <el-table-column prop="vir_local" label="该宿主机下虚拟机数量"></el-table-column>
          <el-table-column prop="ip" label="该宿主机下虚拟机IP">
            <template slot-scope="scope">
              <pre>{{ scope.row.ip }}</pre>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getVcenterSelect, getVcenterFirstList, getVcenterSecondList, getVcenterVirApp, getVcenterAppInfo, getVcenterClusterDic} from '@/api/cmdbs/statistics'
import StatisticsPie from './statistics_pie'
import {deepClone} from '@/utils'
import sessionDashboard from "@/components/mixins/sessionDashboard";

export default {
  name: 'StatisticsVcenter',
  mixins: [sessionDashboard],
  components: {
    'statistics-pie': StatisticsPie,
  },
  data() {
    return {
      select_vcenter: [],
      vcenter: 6,
      data_all: undefined,
      search: undefined,
      tableData: [],
      listLoading: false,
      firstPieTitle: '集群-虚机分布',
      firstPieData: [],
      height: '450px',
      showTable2: false,
      btnPlain: true,
      downloadLoading: false,
      filename: '集群-虚机',
      autoWidth: false,
      bookType: 'xlsx',
      vcenter_name: undefined,
      cluster_name: undefined,
      search2: undefined,
      tableData2: [],
      listLoading2: false,
      secondPieTitle: '宿主机-虚机分布',
      secondPieData: [],
      downloadLoading2: false,
      filename2: '宿主机-虚机',
      dialogTitle: undefined,
      dialogVisible: false,
      tableData3: [],
      listLoading3: false,
      total: 0,
      pagesize: 15,
      currentPage: 1,
      dialogTitle2: undefined,
      dialogVisible2: false,
      tableData4: [],
      listLoading4: false,
      downloadLoading3: false,

      multipleSelection: [],
      bulkButton: true,
      // filename3: undefined,    // this.dialogTitle2
    }
  },

  created() {
    getVcenterSelect().then(response => {
      this.select_vcenter = response
    })

    this.getRowsInf({vid: this.vcenter ? this.vcenter : 6})

    getVcenterClusterDic().then(response => {
      this.data_all = response
    })

  },

  mounted() {

  },

  watch: {
    // vcenter: {
    //   handler(newValue, oldValue) {
    //     this.vcenter = newValue
    //     this.getRowsInf({vid: this.vcenter})
    //     this.showTable2 = false
    //   },
    //   deep: true
    // },
    vcenter(newValue) {
      this.setSessionItem({
        [this.$attrs.componentName]: {vcenter: newValue}
      })
    },
  },

  methods: {
    getRowsInf(params) {
      if (params.vid) {
        this.listLoading = true
        getVcenterFirstList(params).then(response => {
          this.tableData = response

          this.firstPieData = []
          for(let item of this.tableData) {
            this.firstPieData.push({name: item.cluster_name, value: item.vir_total})
          }

          setTimeout(() => {
            this.listLoading = false
          }, 1000)

        })
      }
    },

    handleReset() {
      this.search = undefined
    },
    handleFilter() {
      if(this.search) {
        let data = this.data_all
        let vid = undefined
        let cid = undefined
        for(let k of Object.keys(data)) {
          for(let c_obj of data[k]) {
            if(c_obj['phy_ip_list'].includes(this.search)) {
              vid = k
              cid = c_obj['cid']
              break
            }
          }
        }

        vid ? this.vcenter = Number(vid) : this.vcenter = 6
        getVcenterFirstList({vid: this.vcenter}).then(response => {
          let d = response
          if(cid) {
            this.tableData = d.filter(item => item.cid===cid)
          } else {
            this.tableData = d
          }
        })

      } else {
        this.getRowsInf({vid: this.vcenter})
      }
    },

    // handleReset2() {
    //   this.search = undefined
    // },
    // handleFilter2() {
    //   if(this.search2) {
    //     this.tableData2 =
    //   }

    // },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 4) {
          sums[index] = '';
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
          sums[index] = '';
        }
      });
      return sums;
    },
    getSummaries2(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if (index === 4) {
          sums[index] = '';
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
          sums[index] = '';
        }
      });
      return sums;
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['集群名', '宿主机数', '虚拟机数', '应用数', '宿主机IP']
        const filterVal = ['cluster_name', 'phy_total', 'vir_total', 'app_total', 'phy_ip_list']
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
    // handleDownload2() {
    //   this.downloadLoading2 = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['宿主机IP', '虚拟机数', '应用数', '虚拟机IP', '应用详情']
    //     const filterVal = ['host_ip', 'vir_total', 'app_total', 'vir_ip_list', 'app_name_list']
    //     const list = this.tableData2
    //     const data = this.formatJson(filterVal, list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: this.filename2,
    //       autoWidth: this.autoWidth,
    //       bookType: this.bookType
    //     })
    //     this.downloadLoading2 = false
    //   })
    // },
    handleDownload2() {
      this.downloadLoading2 = true

      let selected_data = []  // 放每个物理机的app_info
      for (let item of this.tableData2) {
        if (this.multipleSelection.includes(item.host_ip)) {
          for (let app of item.app_info) {
            // app.ip = app.ip.replace(/\s/g, ',')
            selected_data.push(app)
          }
        }
      }

      if (selected_data.length > 0) {
        let result_data = selected_data.reduce((groups, item) => {
          let groupFound = groups.find(i => item.name == i.name && item.project == i.project)
          if (groupFound) {
            groupFound.vir_local += item.vir_local
            groupFound.ip += '\n'+item.ip
          } else {
            let newGroup = {name: item.name, project: item.project, owner: item.owner, vir_all: item.vir_all, vir_local: item.vir_local, ip: item.ip}
            groups.push(newGroup)
          }
          return groups
        }, [])

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['应用名_类型', '产品线', '负责人', '所有虚拟机数量', '选中宿主机的虚拟机数量', '选中宿主机的虚拟机IP']
          const filterVal = ['name', 'project', 'owner', 'vir_all', 'vir_local', 'ip']
          const list = result_data
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '选定宿主机-应用-虚机',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })

          setTimeout(() => {
            this.downloadLoading2 = false
          }, 1000)
        })
      } else {
        setTimeout(() => {
          this.downloadLoading2 = false
        }, 1000)
        this.$message({
        message: '没有可导出的数据! (选中的宿主机上的虚拟机没有绑定应用! )'
      })
      }

    },
    handleDownload3() {
      this.downloadLoading3 = true

      let td = deepClone(this.tableData4)
      for (let item of td) {
        item.ip = item.ip.replace(/\s/g, ',')
      }

      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['应用名_类型', '产品线', '负责人', '所有虚拟机数量', '该宿主机下的虚拟机数量', '该宿主机上的虚拟机IP']
        const filterVal = ['name', 'project', 'owner', 'vir_all', 'vir_local', 'ip']
        const list = td
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.dialogTitle2,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })

        setTimeout(() => {
          this.downloadLoading3 = false
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

    handleCluster(cid, cluster_name) {
      this.listLoading2 = true
      getVcenterSecondList({cid: cid}).then(response => {

        this.tableData2 = response

        this.secondPieData = []
        for(let item of this.tableData2) {
          this.secondPieData.push({name: item.host_ip, value: item.vir_total})
        }

        setTimeout(() => {
          this.listLoading2 = false
        }, 1000)

        for(let item of this.select_vcenter) {
          if(this.vcenter===item.value) {
            this.vcenter_name = item.label
            break;
          }
        }
        this.cluster_name = cluster_name

        this.showTable2 = true
      })
    },

    // handleHost(list, host_ip) {
    //   getVcenterVirApp({vids: list}).then(response => {
    //     this.tableData3 = []
    //     this.tableData3 = response
    //     this.total = this.tableData3.length
    //     this.currentPage = 1
    //     this.dialogTitle = host_ip
    //     this.dialogVisible = true
    //   })
    // },
    handleHost(list, host_ip) {
      this.listLoading3 = true

      this.tableData3 = list
      this.total = this.tableData3.length
      this.currentPage = 1
      this.dialogTitle = host_ip
      this.dialogVisible = true

      setTimeout(() => {
        this.listLoading3 = false
      }, 1000)
    },

    // handleApp(list, host_ip) {
    //   getVcenterAppInfo({aids: list}).then(response => {
    //     this.tableData4 = response

    //     this.dialogTitle2 = host_ip
    //     this.dialogVisible2 = true
    //   })
    // },
    handleApp(list, host_ip) {
      this.listLoading4 = true

      this.tableData4 = list.sort((a, b) => b.vir_all - a.vir_all)

      this.dialogTitle2 = host_ip
      this.dialogVisible2 = true

      setTimeout(() => {
        this.listLoading4 = false
      }, 1000)
    },

    handleClose() {
      this.dialogVisible = false
      this.dialogTitle = undefined
    },
    handleClose2() {
      this.dialogVisible2 = false
      this.dialogTitle2 = undefined
    },

    currentChange(currentPage) {
      this.currentPage = currentPage;
    },

    handleSelectionChange(val) {
      this.multipleSelection = []
      for(let i in val) {
        this.multipleSelection.push(val[i].host_ip)
      }
      if(this.multipleSelection.length>0) {
        this.bulkButton = false
      } else {
        this.bulkButton = true
      }
    },

  }
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
