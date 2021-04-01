<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-date-picker
            v-model="tmpDatetime"
            class="filter-item"
            :picker-options="pickerOptions"
            align="right"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFilter"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.pool_full_name" clearable placeholder="项目编号" @change="handleFilter"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.opr_status" clearable placeholder="操作状态" style="width:130px" @change="handleFilter">
            <el-option label="上线" value="3"></el-option>
            <el-option label="下线" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">
          重置
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="dialogSearchVisible=true">
          批量查询
        </el-button>
        <el-form-item class="fr" style="margin-right:-2px;">
          <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="downloadXLSX = true" :loading="downloadLoading">导出</el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      stripe
      highlight-current-row
      style="width:100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目编号" align="center" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.pool_full_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.opr_ip }}</span>
          <div style="color:#8492a6;font-size:10px">资源ID: {{ scope.row.resource_id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="资源信息" align="center">
        <el-table-column label="类型" align="center" width="70px">
          <template slot-scope="scope">
            <span>{{ scope.row.resource_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU" align="center" width="70px">
          <template slot-scope="scope">
            <span>{{ scope.row.resource_cpu }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内存" align="center" width="70px">
          <template slot-scope="scope">
            <span>{{ scope.row.resource_memory }}G</span>
          </template>
        </el-table-column>
        <el-table-column label="磁盘" align="center" width="70px">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.resource_info.disk }}</span> -->
            <span v-if="scope.row.resource_disk<=1000">{{ scope.row.resource_disk }}G</span>
            <span v-else>{{ (scope.row.resource_disk/1000).toFixed(2) }}T</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="动作" align="center" width="70px">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.opr_status==3">上线</span>
          <span v-else>下线</span> -->
          <el-tag v-if="scope.row.opr_status==3" type="success">上线</el-tag>
          <el-tag v-else-if="scope.row.opr_status==4" type="warning">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="应用信息" align="center">
        <!-- <el-table-column label="ID" align="center" width="60px">
          <template slot-scope="scope">
            <span>{{ scope.row.app }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="应用名" align="center" width="180px" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.app_name }}</span>
            <div style="color:#8492a6;font-size:10px" v-if="scope.row.app!=null">应用ID: {{ scope.row.app }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品线" align="center" min-width="200px" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.project_name }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作用户" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.opr_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding-top: 5px;margin-top: 10px;" @pagination="getRowsInf"/>
    
    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" :close-on-click-modal="false" @open="activeName='pool'" width="45%">
      <template>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="项目编号" name="pool">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-input type="textarea" :rows="15" placeholder="请输入项目编号,以逗号分隔" v-model="listQuery.pool_list"></el-input>
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
          <!-- <el-tab-pane label="主机名" name="hostname">
            <el-row>
              <el-col :span="24">
                <el-input type="textarea" :rows="15" placeholder="请输入主机名列表,以逗号分隔" v-model="listQuery.hostname_list"></el-input>
              </el-col>
            </el-row>
          </el-tab-pane> -->
        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogSearchVisible=false;">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton">确 定</el-button>
      </span>
    </el-dialog>

    <download-header :checks="checks" :visible.sync="downloadXLSX" :onDownLoad="handleDownload" :onExport="handleExport"/>
  </div>
</template>

<script>
import { getRow, exportList } from '@/api/cmdbs/resource_opr'
import { exportIsready, exportFile } from '@/api/cmdbs/resourcemanage'
import Pagination from '@/components/Pagination'
import DownloadHeader from '@/components/DownloadHeader'
import { parseTime } from '@/utils'

export default {
  name: 'ResourceOpr',
  components: { Pagination, DownloadHeader },

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        pool_full_name: undefined,
        r_time: undefined,
        opr_status: undefined,
        pool_list: undefined,
      },

      tmpDatetime: [],
      pickerOptions: {
        disabledDate(end) {
          return end.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

      listLoading: false,
      total: 0,
      tableData: [],

      downloadXLSX: false,
      downloadLoading: false,
      checks: {
        checkList: ['id', 'pool_full_name', 'opr_ip', 'resource_id', 'resource_type', 'resource_cpu', 'resource_memory',
        'resource_disk', 'opr_status_name', 'app', 'app_name', 'project_name', 'opr_user', 'comments', 'create_time'],
        list: [
          {key: 'id', label: 'ID'},
          {key: 'pool_full_name', label: '项目编号'},
          {key: 'opr_ip', label: 'IP'},
          {key: 'resource_id', label: '资源ID'},
          {key: 'resource_type', label: '资源类型'},
          {key: 'resource_cpu', label: 'CPU'},
          {key: 'resource_memory', label: '内存'},
          {key: 'resource_disk', label: '磁盘'},
          {key: 'opr_status_name', label: '动作'},
          {key: 'app', label: '应用ID'},
          {key: 'app_name', label: '应用名'},
          {key: 'project_name', label: '产品线'},
          {key: 'opr_user', label: '操作用户'},
          {key: 'comments', label: '备注'},
          {key: 'create_time', label: '操作时间'}
        ],
      },

      dialogSearchVisible: false,
      activeName: 'pool',

    }
  },

  created() {
    this.getRowsInf()

  },

  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getRowsInf()
    },

    handleReset() {
      this.listQuery = this.$options.data().listQuery
      this.tmpDatetime = []
      this.getRowsInf()
    },

    getRowsInf() {
      this.listLoading = true
      if (this.tmpDatetime && this.tmpDatetime.length!=0){
        this.listQuery.r_time = Math.floor(new Date(this.tmpDatetime[0])/1000)+ ','+ Math.floor(new Date(this.tmpDatetime[1])/1000)
      } else {
        this.listQuery.r_time=undefined
      }

      getRow(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },

    handleDownload(headers) {
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = headers.tHeader;
        const filterVal = headers.filterVal;
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '项目资源预算-导出',
          autoWidth: true,
          bookType: 'xlsx'
        })
        // setTimeout(() => {
        //   this.downloadLoading = false
        // }, 1000)
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
    downloadFile(data) {
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      let fileName = `项目资源预算(导出全部)_${parseTime(new Date())}.xls`;
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
      this.$message({
        message: "导出成功",
        type: "success"
      })
    },
    async handleExport(headers) {
      return new Promise((resolve, reject) => {
        let msg = ''
        if (this.total > 3000) {
          msg = '当前有 '+this.total+' 条记录, 数据量过大, 请耐心等待...'
        } else {
          msg = '当前有 '+this.total+' 条记录, 确认导出 ?'
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listQuery['header']=headers.filterVal.join()
          this.listQuery['header_data']=headers.tHeader.join()
          // let queryParams = Object.assign(this.listQuery, {other_page: this.other_page})
          exportList(this.listQuery).then(response => {
            let fp = response.fp
            let interval_fun = undefined
            if(fp) {
              interval_fun = setInterval(() => {
                exportIsready({'fp': fp}).then(response => {
                  if(response.status==1) {
                    exportFile({'fp': fp}).then(response => {
                      this.downloadFile(response)
                      interval_fun = clearInterval(interval_fun)
                      this.$message({
                        message: '导出成功! ',
                        type: 'success'
                      })
                      resolve()
                    })
                  } else {
                    this.$message({
                      message: '项目资源预算-导出全部-后台处理中...',
                    })
                  }
                })
              }, 6000)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          });
        });
      })
      .catch((e) => {
        console.error(e)
      })
    },

    onSubmitDialogButton(formName) {
      if (this.listQuery.pool_list) {
        let pool_lst = this.listQuery.pool_list.split(/[,;\/\-|\s]+/)
        let len = pool_lst.length
        if(len > 200) {
          this.$message({
            message: '查询条目数不能超过200个 !  当前已经 ' + len + '个 !',
            type: 'warning',
          })
          return false
        }
        this.listQuery.pool_list = pool_lst.join(',')
      }
      // if (this.listQuery.hostname_list) {
      //   let hostname_lst = this.listQuery.hostname_list.split(/[,;\/\-|\s]+/)
      //   let len = hostname_lst.length
      //   if(len > 500) {
      //     this.$message({
      //       message: '查询条目数不能超过500个 !  当前已经 ' + len + '个 !',
      //       type: 'warning',
      //     })
      //     return false
      //   }
      //   this.listQuery.hostname_list = hostname_lst.join(',')
      // }
      this.getRowsInf()
      this.dialogSearchVisible = false
    },

  }

}
</script>
