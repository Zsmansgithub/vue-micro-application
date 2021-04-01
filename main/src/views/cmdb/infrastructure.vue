<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-select v-model="listQuery.machine_room" placeholder="大区" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in machine_room_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.device_position" placeholder="设备位置" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in device_position_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.system_category" placeholder="系统类别" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in system_category_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.product_name" placeholder="产品名称" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in product_name_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.brand" placeholder="品牌" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in brand_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.manufacturer" placeholder="生产厂家" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in manufacturer_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.installation_unit" placeholder="安装单位" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in installation_unit_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.maintenance_unit" placeholder="维保质保单位" filterable clearable style="width:130px" @change="handleFilter">
            <el-option v-for="item in maintenance_unit_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable style="width:130px"></el-input>
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
      <el-table-column label="设备编号" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.device_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备位置/大区" width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.device_position }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.machine_room }}</div>
        </template>
      </el-table-column>
      <el-table-column label="系统类别" width="90px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.system_category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称/生产厂家" width="90px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.product_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.manufacturer }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="设备名称/品牌" width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.device_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.brand }}</div>
        </template>
      </el-table-column>
      <el-table-column label="维保质保/单位" show-overflow-tooltip width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.maintenance }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.maintenance_unit }}</div>
        </template>
      </el-table-column>
      <el-table-column label="出保时间/维护频次" show-overflow-tooltip width="93px">
        <template slot-scope="scope">
          <span>{{ scope.row.maintenance_expired_time }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.maintenance_frequency }}</div>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备配置/规格型号" show-overflow-tooltip width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.device_conf }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.model }}</div>
        </template>
      </el-table-column>
      <el-table-column label="序列号/资产编号" width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.series_number }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.asset_number }}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP" min-width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号/密码" show-overflow-tooltip width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.password }}</div>
        </template>
      </el-table-column>
      <el-table-column label="设备负责人" show-overflow-tooltip width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.device_owner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="安装时间/安装单位" show-overflow-tooltip width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.installation_time }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.installation_unit }}</div>
        </template>
      </el-table-column>
      <el-table-column label="变更人/时间/备注" show-overflow-tooltip width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.update_time }}</div>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.comments }}</div>
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
              <el-form-item label="设备编号" prop="device_num">
                <el-input v-model.trim="rowAdd.device_num" style="width:108%;" maxlength="64"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备位置" prop="device_position">
                <el-input v-model.trim="rowAdd.device_position" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="大区" prop="machine_room">
                <el-input v-model.trim="rowAdd.machine_room" style="width:108%;" maxlength="64"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统类别" prop="system_category">
                <el-input v-model.trim="rowAdd.system_category" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品名称 " prop="product_name">
                <el-input v-model.trim="rowAdd.product_name" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂家">
                <el-input v-model.trim="rowAdd.manufacturer" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="device_name">
                <el-input v-model.trim="rowAdd.device_name" style="width:108%;" maxlength="64"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量" prop="amount">
                <el-input v-model.trim="rowAdd.amount" type="number" auto-complete="off" style="width:108%;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="品牌">
                <el-input v-model.trim="rowAdd.brand" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号">
                <el-input v-model.trim="rowAdd.model" style="width:108%;" maxlength="512"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备配置">
                <el-input v-model.trim="rowAdd.device_conf" style="width:108%;" maxlength="512"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资产编码">
                <el-input v-model.trim="rowAdd.asset_number" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="序列号">
                <el-input v-model.trim="rowAdd.series_number" style="width:108%;" maxlength="256"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IP">
                <el-input v-model.trim="rowAdd.ip" style="width:108%;" maxlength="128"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号">
                <el-input v-model.trim="rowAdd.account" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码">
                <el-input v-model.trim="rowAdd.password" type="password" auto-complete="off" show-password/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="安装时间">
                <el-input v-model.trim="rowAdd.installation_time" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装单位">
                <el-input v-model.trim="rowAdd.installation_unit" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="维保质保">
                <el-input v-model.trim="rowAdd.maintenance" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维保质保单位">
                <el-input v-model.trim="rowAdd.maintenance_unit" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="维保频次">
                <el-input v-model.trim="rowAdd.maintenance_frequency" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出保时间">
                <el-input v-model.trim="rowAdd.maintenance_expired_time" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备负责人">
                <el-input v-model.trim="rowAdd.device_owner" style="width:108%;" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <label slot="label">&nbsp;&nbsp;备注信息</label>
                <el-input v-model="rowAdd.comments" type="textarea" style="width:115%;" maxlength="150" />
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
import { getRow, addRow, editRow, deleteRow, getQueryOptions, exportList } from '@/api/cmdbs/infrastructure'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import DownloadHeader from '@/components/DownloadHeader'
import { exportIsready, exportFile } from '@/api/cmdbs/resourcemanage'
import { parseTime } from '@/utils'

export default {
  name: 'Infrastructure',
  components: { Pagination, DownloadHeader },
  mixins: [sessionListQuery],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        machine_room: undefined,
        device_position: undefined,
        system_category: undefined,
        product_name: undefined,
        brand: undefined,
        manufacturer: undefined,
        installation_unit: undefined,
        maintenance_unit: undefined,
        search: undefined
      },
      machine_room_options: [],
      device_position_options: [],
      system_category_options: [],
      product_name_options: [],
      brand_options: [],
      manufacturer_options: [],
      installation_unit_options: [],
      maintenance_unit_options: [],

      tableData: [],
      total: 0,
      listLoading: false,

      adminrole: false,

      addTitle: '新增记录',
      dialogVisible: false,
      addFlag: false,
      rowAdd: {
        device_num: '',
        machine_room: '',
        system_category: '',
        device_position: '',
        product_name: '',
        device_name: '',
        amount: '',
        brand: '',
        model: '',
        device_conf: '',
        manufacturer: '',
        series_number: '',
        ip: '',
        account: '',
        password: '',
        asset_number: '',
        device_owner: '',
        installation_time: '',
        installation_unit: '',
        maintenance: '',
        maintenance_unit: '',
        maintenance_frequency: '',
        maintenance_expired_time: '',
        comments: '',
        change_user: this.name
      },

      rules: {
        device_num: [
          { required: true, message: '设备编号', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        machine_room: [
          { required: true, message: '请输入大区', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        system_category: [
          { required: true, message: '请输入系统类别', trigger: 'change'},
          { max: 32, message: '长度不能超过32个字符', trigger: 'blur' }
        ],
        device_position: [
          { required: true, message: '请输入设备位置', trigger: 'change' },
          { max: 32, message: '长度不能超过32个字符', trigger: 'blur' }
        ],
        product_name: [
          { required: true, message: '请输入产品名称', trigger: 'change' },
          { max: 32, message: '长度不能超过32个字符', trigger: 'blur' }
        ],
        device_name: [
          { required: true, message: '请输入设备名称', trigger: 'change' },
          { max: 32, message: '长度不能超过32个字符', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入数量', trigger: 'change' }
        ],
      },

      downloadXLSX: false,
      downloadLoading: false,
      checks: {
        checkList: ['device_num', 'machine_room', 'device_position', 'system_category', 'product_name', 'manufacturer', 'device_name',
        'brand', 'maintenance', 'maintenance_unit', 'maintenance_expired_time', 'maintenance_frequency', 'amount', 'device_conf',
        'model', 'series_number', 'asset_number', 'ip', 'account', 'password', 'device_owner', 'installation_time', 'installation_unit',
        'change_user', 'update_time', 'comments'],
        list: [
          {key: 'device_num', label: '设备编号'},
          {key: 'machine_room', label: '大区'},
          {key: 'device_position', label: '设备位置'},
          {key: 'system_category', label: '系统类别'},
          {key: 'product_name', label: '产品名称'},
          {key: 'manufacturer', label: '生产厂家'},
          {key: 'device_name', label: '设备名称'},
          {key: 'brand', label: '品牌'},
          {key: 'maintenance', label: '维保质保'},
          {key: 'maintenance_unit', label: '单位'},
          {key: 'maintenance_expired_time', label: '出保时间'},
          {key: 'maintenance_frequency', label: '维护频次'},
          {key: 'amount', label: '数量'},
          {key: 'device_conf', label: '设备配置'},
          {key: 'model', label: '规格型号'},
          {key: 'series_number', label: '序列号'},
          {key: 'asset_number', label: '资产编号'},
          {key: 'ip', label: 'IP'},
          {key: 'account', label: '账号'},
          {key: 'password', label: '密码'},
          {key: 'device_owner', label: '设备负责人'},
          {key: 'installation_time', label: '安装时间'},
          {key: 'installation_unit', label: '安装单位'},
          {key: 'change_user', label: '变更人'},
          {key: 'update_time', label: '时间'},
          {key: 'comments', label: '备注'}
        ],
      },

    }
  },

  created() {
    getQueryOptions().then(response => {
      this.machine_room_options = response['machine_room']
      this.device_position_options = response['device_position']
      this.system_category_options = response['system_category']
      this.product_name_options = response['product_name']
      this.brand_options = response['brand']
      this.manufacturer_options = response['manufacturer']
      this.installation_unit_options = response['installation_unit']
      this.maintenance_unit_options = response['maintenance_unit']
    })

    this.getRowsInf()

    this.adminrole = this.roles.includes('cmdb_admin')

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
            func = editRow(this.rowAdd.device_num, this.rowAdd)
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
        deleteRow(row.device_num).then(response => {
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
          filename: '基础设施-导出',
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
      let fileName = `基础设施(导出全部)_${parseTime(new Date())}.xls`;
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
                      message: '基础设施-导出全部-后台处理中...',
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
