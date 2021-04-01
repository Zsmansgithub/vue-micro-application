<template>
  <div>
    <el-card class="box-card">
       <div slot="header" class="clearfix">
         <span style="color: #006cff;font-size: 14px">虚拟机</span>
      </div>
      <el-form ref="newAppForm" :model="newAppForm" class="newAppForm" style="width:100%">
      <el-form-item>
        <el-table :data="newAppForm.list">
          <el-table-column prop="name" label="资源名称" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.name'">
                <el-select v-model="scope.row.name" placeholder="请选择" style="width: 100%">
                  <el-option label="虚拟机" value="虚拟机"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="app" label="应用名" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.app'">
                <el-input v-model="scope.row.app" style="width: 100%"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="CPU(C)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.cpu'">
                <el-input v-model="scope.row.cpu" style="width: 100%"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="mem" label="内存(G)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.mem'">
                <el-input v-model="scope.row.mem" style="width: 100%"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="disk" label="硬盘(G)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.disk'">
                <el-input v-model="scope.row.disk" style="width: 100%"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量(台)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.count'">
                <el-input v-model="scope.row.count" style="width: 100%"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="单价(万元)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.money'">
                {{scope.row.money=(scope.row.cpu*550+scope.row.mem*225+scope.row.disk*3.5)/10000}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="总预算(万元)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.total'">
                {{scope.row.total=(scope.row.count*scope.row.money).toFixed(2)}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" circle @click="addDomain(scope.row)"/>
              <el-button type="danger" icon="el-icon-delete" circle @click="removeDomain(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    </el-card>
    <el-card class="box-card">
       <div slot="header" class="clearfix">
         <span style="color: #006cff;font-size: 14px">物理机</span>
      </div>
      <el-select v-model="time_line" @change="handleTime" placeholder="价格浮动月份">
        <el-option v-for="item in timeOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-form ref="newAppForm" :model="appForm" class="newAppForm" style="width:100%">
      <el-form-item>
        <el-table :data="appForm.list">
          <el-table-column prop="name" label="资源名称" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.name'">
                <el-select v-model="scope.row.name" placeholder="请选择" style="width: 100%">
                  <el-option label="物理机" value="物理机"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="app" label="应用名" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.app'">
                <el-select v-model="scope.row.app" style="width: 100%" filterable clearable @change="handleChange(scope.$index,scope.row.app)">
                  <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="配置" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.conf'">
                <el-select v-model="scope.row.conf" style="width: 100%" @change="handleMoney(scope.$index,scope.row)">
                  <el-option v-for="item in confOptions" :key="item.money" :label="item.conf" :value="item.conf"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量(台)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.count'">
                <el-input v-model="scope.row.count" style="width: 100%"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="单价(万元)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.money'">
                {{(scope.row.money)}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="总预算(万元)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'list.' + scope.$index + '.total'">
                {{scope.row.total=(scope.row.count*scope.row.money).toFixed(2)}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" circle @click="addList(scope.row)"/>
              <el-button type="danger" icon="el-icon-delete" circle @click="removeList(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    </el-card>

    <div style="text-align: right">
      <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="handleDownload"
                 :loading="downloadLoading">导出
      </el-button>
<!--      <el-button class="filter-item" style="text-align: right" type="primary" plain icon="el-icon-upload"-->
<!--                 @click="bulkImportFormVisible=true;tableData=[]">虚拟机导入-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" style="text-align: right" type="primary" plain icon="el-icon-upload"-->
<!--                 @click="bulkImportPhyVisible=true;tableData=[]">物理机导入-->
<!--      </el-button>-->
    </div>
    <el-dialog title="虚拟机导入" :visible.sync="bulkImportFormVisible" width="85%" :before-close="handleCloseBluk" top="50px"
               style=" height: 100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/cmdb/phy_server_bulk.xlsx">
              <el-button type="text">资源（模板下载）</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="14">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="width: 100%;"/>
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
<!--      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;"-->
<!--                :row-class-name="tableRowClassName">-->
<!--        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>-->
<!--        &lt;!&ndash;        <el-table-column label="操作" width="60px" fixed="right" v-if="tableData.length !=0">&ndash;&gt;-->
<!--        &lt;!&ndash;          <template slot-scope="scope">&ndash;&gt;-->
<!--        &lt;!&ndash;            <el-button icon="el-icon-delete" type="primary" circle @click.native.prevent="deleteRow(scope.$index, tableData)" />&ndash;&gt;-->
<!--        &lt;!&ndash;          </template>&ndash;&gt;-->
<!--        &lt;!&ndash;        </el-table-column>&ndash;&gt;-->
<!--      </el-table>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkImportFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="bulkImportFormVisible=false">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="物理机导入" :visible.sync="bulkImportPhyVisible" width="85%" :before-close="handleCloseBluk" top="50px"
               style=" height: 100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/cmdb/phy_server_bulk.xlsx">
              <el-button type="text">资源（模板下载）</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="14">
          <upload-excel-component :on-success="handleSuccessPhy" :before-upload="beforeUpload" style="width: 100%;"/>
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
<!--      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;"-->
<!--                :row-class-name="tableRowClassName">-->
<!--        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>-->
<!--        &lt;!&ndash;        <el-table-column label="操作" width="60px" fixed="right" v-if="tableData.length !=0">&ndash;&gt;-->
<!--        &lt;!&ndash;          <template slot-scope="scope">&ndash;&gt;-->
<!--        &lt;!&ndash;            <el-button icon="el-icon-delete" type="primary" circle @click.native.prevent="deleteRow(scope.$index, tableData)" />&ndash;&gt;-->
<!--        &lt;!&ndash;          </template>&ndash;&gt;-->
<!--        &lt;!&ndash;        </el-table-column>&ndash;&gt;-->
<!--      </el-table>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkImportFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="bulkImportFormVisible=false">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import {getPhyResourceConf } from '@/api/tools/machine_config'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  export default {
    name: "resource_compute",
    directives: {waves},
    mixins: [resize],
    components: {UploadExcelComponent},
    data() {
      return {
        appForm:{
          list: [{
          'name': '物理机',
          'app': '',
          'conf': '',
          'money': 0,
          'count': 0,
          'total': 0,
        }]
        },
        listinfo:{
          'name': '物理机',
          'app': '',
          'conf': '',
          'money': 0,
          'count': 0,
          'total': 0,
        },
        newAppForm: {
          list: [{
            'name': '虚拟机',
            'app': '',
            'cpu': 4,
            'mem': 8,
            'disk': 30,
            'count': 1,
            'money': 0,
            'total': 0,
          }],
        },
        tableData: [],
        tableHeader: [],
        appOptions:[{'label':'DB','value':'DB'},{'label':'ES','value':'ES'},{'label':'VM','value':'VM'},{'label':'MQ','value':'MQ'},
        {'label':'REDIS','value':'REDIS'},{'label':'HADOOP','value':'HADOOP'},{'label':'HOTDB','value':'HOTDB'}],
        confOptions:[],
        downloadLoading: false,
        bulkImportFormVisible: false,
        bulkImportPhyVisible: false,
        configinfodict: {
          'name': '虚拟机',
          'app': '',
          'cpu': '',
          'mem': '',
          'disk': '',
          'count': 0,
          'money': 0,
          'total': 0,
        },
        resource:{
          // 'DB':[{'conf':'2*5120(14C)+512G+12T(SAS)','money':71000},
          //       {'conf':'(五月份价格)2*5120(14C)+512G+12T(SSD)','money':111650},
          //       {'conf':'(一月份价格)2*5120(14C)+512G+12T(SSD)','money':96500}],
          // 'REDIS':[{'conf':'2*4110(8C)+512G+4*800G(SSD)','money':51700}],
          // 'VM':[{'conf':'2*5120(14C)+384G+1.6T(SSD)+1.8T*6','money':59000}],
          // 'ES':[{'conf':'(五月份价格)2*4110(8C)+256G+1.6T*7(SSD)','money':57580},
          //       {'conf':'(一月份价格)2*4110(8C)+256G+1.6T*7(SSD)','money':45000}],
          // 'MQ':[{'conf':'(五月份价格)2*4110(8C)+256G+1.6T*6(SSD)','money':57580},
          //       {'conf':'(一月份价格)2*4110(8C)+256G+1.6T*6(SSD)','money':43000}],
          // 'HADOOP':[{'conf':'2*4116(12C)+512G+800G(SSD)+2T*21(SATA)','money':67000}],
          // 'HOTDB':[{'conf':'2*6152(22C)+96G+800G(SSD)','money':72000}],
        },
        phy_conf:{},
        time_line:'',
        timeOptions:[]
      }
    },
    created() {
      getPhyResourceConf().then(res=>{
        this.phy_conf=res.data
        const key = Object.keys(res.data)
        this.resource=this.phy_conf[key[0]]
        this.time_line=key[0]
        key.forEach(time=>{
          this.timeOptions.push({label:time,value:time})
        })
      })
    },
    watch:{
    },
    methods: {
      handleTime(val){
        this.resource={}
        this.resource=this.phy_conf[val]
        this.appForm={
          list: [{
          'name': '物理机',
          'app': '',
          'conf': '',
          'money': 0,
          'count': 0,
          'total': 0,
        }]
        }
      },
      handleSuccessPhy({results, header}){
        for (const i of results) {
          if (this.appForm.list.length === 1 && this.appForm.list[0].app === '') {
            this.appForm.list[0] = {
              'name': i.资源名称,
              'app': i.应用名,
              'conf': i.配置,
              'count': i.数量,
              'money': i.单价,
              'total': i.总预算,
            }
          } else {
            this.appForm.list.push({
              'name': i.资源名称,
              'app': i.应用名,
              'conf': i.配置,
              'count': i.数量,
              'money': i.单价,
              'total': i.总预算,
            })
          }
        }
        this.bulkImportPhyVisible=false
      },
      tableRowClassName({row, rowIndex}) {
        if (Object.keys(row).length < 14) {
          return 'warning-row'
        }
        return ''
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1

        if (isLt1M) {
          return true
        }

        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning',
        })
        return false
      },
      handleSuccess({results, header}) {
        for (const i of results) {
          if (this.newAppForm.list.length === 1 && this.newAppForm.list[0].app === '') {
            this.newAppForm.list[0] = {
              'name': i.资源名称,
              'app': i.应用名,
              'cpu': i.CPU,
              'mem': i.内存,
              'disk': i.硬盘,
              'count': i.数量,
              'money': i.单价,
              'total': i.总预算,
            }
          } else {
            this.newAppForm.list.push({
              'name': i.资源名称,
              'app': i.应用名,
              'cpu': i.CPU,
              'mem': i.内存,
              'disk': i.硬盘,
              'count': i.数量,
              'money': i.单价,
              'total': i.总预算,
            })
          }
        }
        this.bulkImportFormVisible=false
        this.tableHeader = header
      },
      handleCloseBluk() {
        this.bulkImportFormVisible = false
        this.bulkImportPhyVisible = false
        this.fileList = []
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['资源名称', '应用名','配置', 'CPU(C)', '内存(G)', '硬盘(G)', '数量(台)', '单价(万元)', '总预算(万元)']
          const filterVal = ['name', 'app','conf', 'cpu', 'mem', 'disk', 'count', 'money', 'total']
          const list = this.newAppForm.list.concat(this.appForm.list)
          let all=0
          let sum=0
          for (const i of list) {
            all = all+parseFloat(i.total)
            sum = sum+parseInt(i.count)
            if (i.conf) {
              let value = i.conf.split('+')
              i.cpu=value[0].match(/\(([^)]*)\)/)[1]
              i.mem=value[1]
              if (value[3]) {
                i.disk=value[2]+'+'+value[3]
              }else {
                i.disk=value[2]
              }
            }
          }
          list.push({
            'name': '合计',
            'app': '',
            'cpu': '',
            'conf': '',
            'mem': '',
            'disk': '',
            'count': sum,
            'money': '',
            'total': all,
          })
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
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
      handleChange(index, row) {
        this.confOptions=[]
        this.confOptions=this.resource[row]
        this.appForm.list[index].conf=''
        this.appForm.list[index].money=0.00
        this.appForm.list[index].count=0.00
      },
      handleMoney(index,row){
        for (const i of this.resource[row.app]) {
          if (row.conf===i['conf']) {
            this.appForm.list[index].money=i['money']/10000
          }
        }
      },
      addList() {
        const configinfo = Object.assign({}, this.listinfo)
        this.appForm.list.push(configinfo)
      },
      removeList(item) {
        let index = this.appForm.list.indexOf(item)
        if (index !== -1) {
          this.appForm.list.splice(index, 1)
        }
      },
      addDomain() {
        const configinfo = Object.assign({}, this.configinfodict)
        this.newAppForm.list.push(configinfo)
      },
      removeDomain(item) {
        let index = this.newAppForm.list.indexOf(item)
        if (index !== -1) {
          this.newAppForm.list.splice(index, 1)
        }
      },
    }
  }
</script>

<style scoped>

</style>
