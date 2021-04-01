<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-select v-model="listQuery.status" placeholder="状态" filterable clearable @change="handleFilter">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.supplier" placeholder="维保商" filterable clearable @change="handleFilter">
            <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable style="width:300px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增记录</el-button>
        </el-form-item>
        <el-form-item class="fr" style="margin-right:-2px;">
          <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="downloadXLSX = true" :loading="downloadLoading">导出</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table v-loading="listLoading" :data="tableData" border stripe highlight-current-row fit>
      <el-table-column label="ID" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="序列号/类型" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.sn }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.brand }}</div>
        </template>
      </el-table-column>
      <el-table-column label="机房/机柜位置" show-overflow-tooltip min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.machine_room }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.location }}</div>
        </template>
      </el-table-column>
      <el-table-column label="资产编号/型号" min-width="110px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.asset_number }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.device_model }}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP/计划下线时间" show-overflow-tooltip width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.plan_offline_date }}</div>
        </template>
      </el-table-column>
      <el-table-column label="维保商/维保截止时间" show-overflow-tooltip min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.expired_day }}</div>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" width="110px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">{{ scope.row.status_name }}</el-tag>
          <el-tag v-else-if="scope.row.status==0" type="warning">{{ scope.row.status_name }}</el-tag>
          <!-- <span>{{ scope.row.status_name }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="CPU" min-width="170px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存" width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="磁盘" align="center">
        <el-table-column label="数据盘" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.disk_data }}</span>
          </template>
        </el-table-column>
        <el-table-column label="系统盘" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.disk_sys }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="变更人" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注/更新时间" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getRowsInf"
    />

    <el-dialog :title="addTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="850px">
      <div style="padding-left:4%">
        <el-form ref="rowAdd" :model="rowAdd" :rules="rules" :inline="true" label-width="110px" style="width:100%">
          <el-row>
            <el-col :span="12">
              <el-form-item label="序列号" prop="sn">
                <el-input v-model.trim="rowAdd.sn" style="width:108%;" maxlength="64"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="rowAdd.status" placeholder="状态" filterable clearable>
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="类型">
                <el-input v-model.trim="rowAdd.brand" style="width:108%;" maxlength="64"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="型号">
                <el-input v-model.trim="rowAdd.device_model" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="机房">
                <el-input v-model.trim="rowAdd.machine_room" style="width:108%;" maxlength="64"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机柜位置">
                <el-input v-model.trim="rowAdd.location" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="资产编号">
                <el-input v-model.trim="rowAdd.asset_number" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IP">
                <el-input v-model.trim="rowAdd.ip" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="计划下线时间">
                <el-date-picker v-model="rowAdd.plan_offline_date" type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd" :clearable=false style="width:94%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维保截止时间">
                <el-date-picker v-model="rowAdd.expired_day" type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd" :clearable=false style="width:94%;"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="CPU">
                <el-input v-model.trim="rowAdd.cpu" style="width:108%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内存">
                <el-input v-model.trim="rowAdd.memory" style="width:108%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="数据盘">
                <el-input v-model.trim="rowAdd.disk_data" style="width:108%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统盘">
                <el-input v-model.trim="rowAdd.disk_sys" style="width:108%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="维保商">
                <el-select v-model="rowAdd.supplier" placeholder="维保商" filterable clearable>
                  <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input v-model.trim="rowAdd.comments" type="textarea" style="width:115%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="addFlag" @click="submitForm('rowAdd', 1)">确定</el-button>
        <el-button type="primary" v-else @click="submitForm('rowAdd', 2)">确定</el-button>
      </div>
    </el-dialog>

    <download-header :checks="checks" :visible.sync="downloadXLSX" :onDownLoad="handleDownload" :onExport="handleExport"/>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRow, addRow, editRow, deleteRow, exportList, getSupplier } from '@/api/cmdbs/scrap_machine'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import DownloadHeader from '@/components/DownloadHeader'
import { exportIsready, exportFile } from '@/api/cmdbs/resourcemanage'
import { parseTime } from '@/utils'

export default {
  name: 'ScrapMachine',
  components: { Pagination, DownloadHeader },
  mixins: [sessionListQuery],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        supplier: undefined,
        status: undefined,
        search: undefined,
      },
      statusOptions: [{label: "使用中", value: 1}, {label: "已下线", value: 0}],
      supplierOptions: undefined,

      tableData: [],
      total: 0,
      listLoading: false,

      adminrole: false,

      addTitle: '新增记录',
      dialogVisible: false,
      addFlag: false,
      rowAdd: {
        sn: '',
        brand: '',
        device_model: '',
        location: '',
        asset_number: '',
        ip: '',
        plan_offline_date: '',
        supplier: '',
        expired_day: '',
        status: 0,
        cpu: '',
        memory: '',
        disk_data: '',
        disk_sys: '',
        comments: '',
        machine_room: '',
        change_user: this.name
      },

      rules: {
        sn: [
          { required: true, message: '请输入序列号', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        device_model: [
          { required: true, message: '请输入设备型号', trigger: 'change' },
          { max: 128, message: '长度不能超过128个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'change'},
        ],
      },

      downloadXLSX: false,
      downloadLoading: false,
      checks: {
        checkList: ['sn', 'device_model', 'status_name', 'cpu', 'memory', 'disk_data', 'disk_sys', 'change_user',
                    'update_time', 'comments'],
        list: [
          {key: 'sn', label: '序列号'},
          {key: 'device_model', label: '设备型号'},
          {key: 'status_name', label: '状态'},
          {key: 'cpu', label: 'CPU'},
          {key: 'memory', label: '内存'},
          {key: 'disk_data', label: '数据盘'},
          {key: 'disk_sys', label: '系统盘'},
          {key: 'change_user', label: '变更人'},
          {key: 'update_time', label: '更新时间'},
          {key: 'comments', label: '备注'}
        ],
      },

    }
  },

  created() {
    this.getRowsInf()

    this.adminrole = this.roles.includes('cmdb_admin')

    getSupplier().then(response => {
      this.supplierOptions = response
    })

  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getRowsInf()
    },

    handleReset() {
      this.listQuery = this.$options.data().listQuery
      this.getRowsInf()
    },

    getRowsInf() {
      this.listLoading = true
      getRow(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },

    handleAdd() {
      this.addTitle = '新增记录'
      this.rowAdd = this.$options.data().rowAdd
      this.dialogVisible = true
      this.addFlag = true
    },

    handleClose() {
      this.rowAdd = this.$options.data().rowAdd
      this.dialogVisible = false
      this.addFlag = false
    },

    handleEdit(row) {
      this.addTitle = '修改记录'
      this.dialogVisible = true
      this.rowAdd = deepClone(row)
      this.rowAdd.change_user = this.name
      delete this.rowAdd['update_time']
    },

    submitForm(formName, status) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          this.rowAdd.change_user = this.name
          let func = undefined
          if(status == 2) {
            func = editRow(this.rowAdd.id, this.rowAdd)
          } else {
            func = addRow(this.rowAdd)
          }
          func.then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
              });
              this.getRowsInf();
              this.resetForm(formName)
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
          this.handleClose()
        } else {
          this.$message({
            message: '请填写必要的字段和内容',
            type: 'warning',
          });
          return false
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleDelete(row) {
      var msg = '确认删除该记录吗?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteRow(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getRowsInf()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
          // console.log(error)
        })
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
          filename: '报废主机-导出',
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
      let fileName = `报废主机(导出全部)_${parseTime(new Date())}.xls`;
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
                      message: '报废主机-导出全部-后台处理中...',
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

  }

}
</script>

<style lang="scss" scoped>
  a {
    color: #1890ff;
  }
</style>
