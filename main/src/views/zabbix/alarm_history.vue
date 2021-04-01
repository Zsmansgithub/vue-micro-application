<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <el-form-item>
<!--          <el-select class="filter-item"-->
<!--                     v-model="listQuery.alarm_app_id"-->
<!--                     filterable-->
<!--                     remote clearable-->
<!--                     reserve-keyword-->
<!--                     placeholder="请输入应用名"-->
<!--                     :remote-method="remoteSearchMethod"-->
<!--                     popper-class="app-search-class"-->

<!--                     no-data-text='应用未找到'-->
<!--                     loading-text="查询中请稍等"-->
<!--                    :loading="loading"-->
<!--                  >-->
<!--            <el-option-->
<!--              v-for="item in appnameOptionsP"-->
<!--              :key="item.key"-->
<!--              :label="'('+item.key+')'+item.display_name"-->
<!--              :value="item.key">-->
<!--            </el-option>-->
<!--          </el-select>-->
          <el-cascader expand-trigger="hover" :options="projectOptions" v-model="listQuery.project_name_list"
                       clearable filterable style="width:450px;" placeholder="请选择产品线或应用名"
                       @change="handleFilter" ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.alarm_source" placeholder="报警来源" clearable style="width: 140px"
                     class="filter-item" @change="handleFilter">
            <el-option v-for="item in alarmsourceOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.priority" placeholder="级别" clearable style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in priorityOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="ip">
          <el-input v-model="listQuery.host_name" placeholder="IP地址" style="width: 200px;" class="filter-item" @input="handleFilter"/>
        </el-form-item>
        <el-form-item prop="stime">
          <el-date-picker class="filter-item" value-format="timestamp" :picker-options="pickerOptions2"
                          v-model="listQuery.start_time_gt" align="right" :default-value="datatime_default"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" @change="handleFilter">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%;"
      :cell-style="descLine"
    >
      <el-table-column label="IP地址" width="120px">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" width="200" class="popver_user">
          <p>联系人: {{ scope.row.maintain_user }}</p>
          <div slot="reference" class="name-wrapper">

            <el-tag size="medium" ><span>{{ scope.row.host_name }}</span></el-tag>
          </div>
        </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="应用名" width="220px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.app_name!==''">{{ scope.row.subsystem_name+'_'+scope.row.app_name  }}</span>
          <div  style="color: #8492a6; font-size: 10px">{{scope.row.project_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="数据源" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.alarm_source }}</span>
        </template>
      </el-table-column>

      <el-table-column label="报警信息" align="center">
        <template slot-scope="scope">
          <span type="success">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否确认" class-name="status-col" width="50">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" width="200">
            <p>信息: {{ scope.row.comments }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.is_ack==1" size="medium">是</el-tag>
              <el-tag v-else size="medium" type='danger'>否</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否报警" class-name="status-col" width="50" :formatter="isornot"/>
      <el-table-column label="持续时间" class-name="status-col" width="110" sortable :formatter="formatDate">
      </el-table-column>
      <el-table-column label="开始时间" class-name="status-col" width="180">
        <template slot-scope="scope">
          <span
            type="success">{{ new Date( scope.row.start_time*1000).toLocaleString().replace(/:\d{1,2}$/,' ')    }}</span>
        </template>

      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
import { fetchAlarmHistoryList } from '@/api/zabbix'
import { getAppList } from '@/api/cmdb'
import { getProductAppCascader } from '@/api/cmdbs/product_line'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Chart from '@/components/Charts/LineZabbix'
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import {validIp } from '@/utils/validate'
import {isORnot} from "../../utils/format-function";

export default {
  name: 'ComplexTable',
  mixins: [resize, sessionListQuery],
  components: { Pagination, Chart},
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
      datatime_default:'',
      listQuery: {
        page: 1,
        limit: 20,
        start_time_gt: undefined,
        alarm_source: undefined,
        project_name_list: undefined,
        host_name: undefined,
        priority: undefined
      },
      ackForm:{
        comments:'确认'
      },
      projectOptions: [1, 2, 3],
      historySearch:{
        id: undefined,
        timestamp: '',
       },
       pickerOptions2: {

         disabledDate(end) {
            return end.getTime() > Date.now();
          }
        },
      activeName: 'first',
      list: null,
      total: 0,
      listLoading: true,
      loading:false,
      projectOptions:[],
      appnameOptionsP:[],
      alarmsourceOptions:[{ label: '主机组', key: 1 },{ label: '集成组', key: 2 },{ label: 'DB组', key: 3 },{ label: '天眼', key: 4 },{ label: '网络组', key: 5 } ],
      appnameOptions:[],
      priorityOptions: [{ label: 'information', key: 1 }, { label: 'warning', key: 2 },{ label: 'average', key: 3 },
        { label: 'high', key: 4 },{ label: 'disaster', key: 5 },{ label: 'not_classified', key: 0 },
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        ip: [{  message: '请输入正确的IP地址', trigger: 'blur' , validator: validateIpaddress}],
      },
    }
  },
  created() {
    this.getList();
    this.appnameOptions = getAppList()
    this.datatime_default= this.getdata()
    getProductAppCascader().then(response => {
        this.projectOptions = response
    })
  },
  methods: {
    getdata() {
      const date = new Date();
      return date.getFullYear()+'-'+date.getMonth();  //2019-05-1

    },
    isornot(row, column, cellValue){
      if (column.label == '是否报警' ) {
              return isORnot(row.is_mail)
      }else if (column.label == '是否确认') {
              return isORnot(row.is_ack)
      }
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    resetlistQuery() {
      this.listQuery={
        page: 1,
        limit: 20,
        start_time_gt: undefined,
        alarm_source: undefined,
        project_name_list: undefined,
        host_name: undefined,
        priority: undefined
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
    descLine(row, column, rowIndex, columnIndex) {
      if (row.column.label == "报警信息") {
        if (row.row.priority == 5) {
          return 'background:#E45959;color:#f9ebeb;font-weight: bold;'
        } else if (row.row.priority == 4) {
          return 'background:#E97659;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority == 3) {
          return 'background:#FFA059;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority == 2) {
          return 'background:#FFC859;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority == 1) {
          return 'background:#7499FF;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority == 0) {
          return 'background:#97AAB3;color:#f9ebeb;font-weight: bold'
        } else {
          return 'background:#97AAB3;color:#f9ebeb;font-weight: bold'
        }
      }
    },
    formatDate(row, column, cellValue){
      if (row.continue_time <60) {
        return row.continue_time+'秒'
      }else if (60< row.continue_time && row.continue_time < 3600){
        let h=parseInt(row.continue_time/60)
        return h+'分钟'
      }else if (3600< row.continue_time && row.continue_time < 86400){
        let h=parseInt(row.continue_time/3600)
        return h+'小时'
      }else if (row.continue_time > 86400){
        let d = parseInt(row.continue_time/86400)
        return d+'天'
      }
    },
    renderline(){
      this.$refs.mychild.render( this.historySearch );
    },
    handleClose(){

    },
    updateCommon(){
      // update(this.ackForm['id'],this.ackForm).then(response => {
      //         this.getList()
      // });
      // this.dialogFormVisible = false

    },
    handleClick(tab, event) {
      console.info('sfsf')
      },
    getList() {
      this.listLoading = true
      if (this.listQuery.start_time_gt) {
        this.listQuery.rtime=Math.floor(this.listQuery.start_time_gt[0]/1000)+','+Math.floor(this.listQuery.start_time_gt[1]/1000)
      }else{
        this.listQuery.rtime= undefined
      }

      fetchAlarmHistoryList(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
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
      this.ackForm['id'] = row['id'] // copy obj
      this.ackForm['comments'] = row['comments'] // copy obj

      this.dialogFormVisible = true
    },
    dialogOpen(){
      this.activeName='first'
    }
  }
}
</script>
<style>
  .app-search-class {
    max-width: 500px;
  }
</style>
