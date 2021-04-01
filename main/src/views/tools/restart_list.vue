<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <el-form-item>
        <el-select v-model="listQuery.app"
                   remote clearable
            reserve-keyword
            :remote-method="remoteSearchMethod"
                   placeholder="请输入应用名" filterable clearable class="filter-item"
                   no-data-text="正在搜索应用"
                   style="width: 250px">
          <el-option v-for="item in appnameOptionsP" :key="item.key" :label="'('+item.key+')'+item.display_name"
                     :value="item.key"/>
        </el-select>
          </el-form-item>
        <el-form-item prop="ip">
          <el-input v-model="listQuery.server_ip" placeholder="IP地址" style="width: 200px;" class="filter-item"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">
          重置
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监控状态" width="115px">
        <template slot-scope="scope">
          <el-badge :value="null" :max="99" class="el-badge-item">
            <el-button v-if="scope.row.status==0" size="mini" type="success">监控中</el-button>
            <el-button v-else size="mini" type="warning">未监控</el-button>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.server_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名">
        <template slot-scope="scope">
          <span>{{ scope.row.app_name  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境类型" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.server_env || -1  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="85" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleShowHistory(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :page-sizes="[10, 20]"
                :limit.sync="listQuery.limit"
                @pagination="getList" style="padding-top: 5px;margin-top: 10px;"/>

    <el-dialog  custom-class="server_history_dialog" :visible.sync="dialogFormVisible" @open="dialogOpen"
               @close="handleClose" width="70%" top="50px" style="height:100%;">
    </el-dialog>
  </div>
</template>


<script>
import { fetchList,fetchAppList } from '@/api/cmdb'
import { fetchServerList, } from '@/api/zabbix'
import waves from '@/directive/waves' // waves directive
import { format1024 } from '@/utils/format-function'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import tabPane from '../tab/components/TabPane'
import Chart from '@/components/Charts/LineZabbix'
import ChartL from '@/components/Charts/LineKmg'
import resize from '@/components/Charts/mixins/resize'
import {validIp } from '@/utils/validate'
import {RsaEncrypt } from '@/utils/rsa-encrypt'

export default {
  name: 'ZabbixList',
  mixins: [resize],
  components: { Pagination, Chart, ChartL},
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    const validateIpaddress = (rule, value, callback) => {
      if (value) {
        if (validIp(value)) {
          callback()
        } else {
          callback(new Error('IP填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      listQuery: {
        page: 1,
        limit: 10,
        project: undefined,
        appname: undefined,
        ip: undefined,
        network: undefined
      },
      projectOptions: [1, 2, 3],
      historySearch:{
        id: undefined,
        timestamp: '',
       },
      pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      activeName: 'first',
      list: null,
      total: 0,
      listLoading: true,
      appnameOptions:[],
      appnameOptionsP:[],
      networkOptions: [{ label: 'A网', key: 'a' }, { label: 'B网', key: 'b' },{ label: 'G网', key: 'g' }],
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        ip: [{  message: '请输入正确的IP地址', trigger: 'blur' , validator: validateIpaddress}],
      },
    }
  },
  created() {
    this.getList();
    this.getAppList();
  },
  methods: {
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    format10242(row, column, cellValue){
      if (column.label == '入流量' ) {

              return format1024(row.ifin)
      }else if (column.label == '总内存') {

              return format1024(row.memory)
      }else if (column.label == '出流量') {

        return format1024(row.ifout)
      }else if (column.label == '内存使用'){
        return format1024(row.mused)
      }

    },
    remoteSearchMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.appnameOptionsP = this.appnameOptions.filter(item => {
            return item.display_name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.appnameOptionsP = []
      }
    },
    resetlistQuery() {
      this.listQuery={
        page: 1,
        limit: 10,
        app: undefined,
        server_ip: undefined,
        ip_list: undefined,
        hostname_list: undefined
      }
    },
    renderline(){
      if (this.activeName=='first') {

      this.$refs.chart1.render( this.historySearch );
      this.$refs.chart2.render( this.historySearch );
      this.$refs.chart3.render( this.historySearch );
      this.$refs.chart4.render( this.historySearch );

      } else {

        this.$refs.mychild.render( this.historySearch );
      }

    },
    handleClose(){
      this.activeName=null;
      this.resetTemp();

    },
    handleClick(tab, event) {

      console.info('sfsf')
      },
    getList() {
      this.listLoading = true
      let xx=RsaEncrypt(this.listQuery.server_ip)
      console.log(xx)
      fetchServerList(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    getAppList() {
      fetchAppList().then(response => {
        let appnameOptions=[]
        for( let i of response){
            appnameOptions.push({
              display_name: i.app_cname, key: i.id
            })
        }
        this.appnameOptions=appnameOptions
      })
    },
    handleFilter(listQuery) {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate((valid) => {
        if (valid) {
            this.getList()
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleShowHistory(row) {
      this.historySearch = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
    },
    dialogOpen(){
      this.activeName='first'
    }
  }
}
</script>
<style scoped>

.el-dialog__heade {
  padding-top: 1px;
}
.el-dialog__body {
	padding-top: 5px;
	padding-bottom: 20px;
}
.el-tabs__header {
margin-bottom: 0px;
}

.el-select-dropdown__wrap {
  max-width:800px;
}
</style>
