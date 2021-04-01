<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getRdsByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.paytype" @change="getRdsByInput" clearable placeholder="请选择付费方式" style="width: 150px">
            <el-option v-for="item in chargeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getRdsByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <div v-if="select==='A'">
            <el-button type="text" @click="select='B'">创建日期<i class="el-icon-caret-bottom "></i></el-button>
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getRdsByInput"
            value-format="yyyy-MM-dd HH:mm"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
          </div>
          <div v-else-if="select==='B'">
            <el-button type="text" @click="select='A'">到期日期<i class="el-icon-caret-bottom "></i></el-button>
            <el-date-picker
            v-model.trim="listQuery.expiredtime_s"
            @change="getRdsByInput"
            value-format="yyyy-MM-dd HH:mm"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </div>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="rdsTableData" border stripe  highlight-current-row @row-click="toggleRowExpansion" ref="table">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="最大连接数:">
                <span>{{ props.row.maxconnections }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="最大IOPS:">
                <span>{{ props.row.maxiops }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="内核版本:">
                <span>{{ props.row.currentkernelversion }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="实例可用性:">
                <span>{{ props.row.availabilityvalue }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="内网地址:">
                <span> {{ props.row.connectionstring }} </span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="付费类型:">
                <span>{{ props.row.paytype }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="只读实例:">
                <span>{{ props.row.readonlydbinstanceids }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="专有网络:">
                <a style="color: #1890ff" @click="send_rds(props.row.vpcid)">{{ props.row.vpcid }}</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="虚拟交换机:">
                <a style="color: #1890ff" @click="send_rds(props.row.vswitchid)">{{ props.row.vswitchid }}</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="连接模式:">
                <span>{{ props.row.connectionmode }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="锁定模式:">
                <span>{{ props.row.lockmode }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
              <el-form-item label="维护窗口:">
                <span>{{ props.row.maintaintime }}</span>
              </el-form-item>
              </el-col>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="名称/实例ID" width="350" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.dbinstancedescription }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.instanceid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="CPU/内存/存储类型">
          <template slot-scope="scope">
            <span>{{ scope.row.dbinstancecpu+'/'+ scope.row.dbinstancememory}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.dbinstancestoragetype}}</div>
          </template>
        </el-table-column>
        <el-table-column label="存储空间">
          <template slot-scope="scope" >
            <el-popover
            placement="top-start"
            width="20"
            trigger="hover">
            <p>{{Math.round((scope.row.dbinstancestorageused/scope.row.dbinstancestoragetotal)*100)+'%'}}</p>
            <div slot="reference">
            <el-progress :percentage="Math.round((scope.row.dbinstancestorageused/scope.row.dbinstancestoragetotal)*100)" :stroke-width="10" :show-text="false"
                       color="#67c23a" v-if="Math.round((scope.row.dbinstancestorageused/scope.row.dbinstancestoragetotal)*100)<=30"></el-progress>
            <el-progress :percentage="Math.round((scope.row.dbinstancestorageused/scope.row.dbinstancestoragetotal)*100)" :stroke-width="10" :show-text="false"
                       color="#e6a23c" v-else-if="Math.round((scope.row.dbinstancestorageused/scope.row.dbinstancestoragetotal)*100)<=70"></el-progress>
            <el-progress :percentage="Math.round((scope.row.dbinstancestorageused/scope.row.dbinstancestoragetotal)*100)" :stroke-width="10" :show-text="false"
                         color="#f56c6c" v-else></el-progress>
            <span>{{ scope.row.dbinstancestorageused }}GB/{{scope.row.dbinstancestoragetotal}}GB</span>
            </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="系列/实例类型" >
          <template slot-scope="scope" >
            <span>{{ scope.row.category }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.dbinstancetype}}</div>
          </template>
        </el-table-column>
        <el-table-column label="引擎/内网端口" >
          <template slot-scope="scope">
            <span>{{ scope.row.engine }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.port}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.dbinstancestatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格/所在区">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="handleLoad(scope.row.dbinstanceclass)">{{ scope.row.dbinstanceclass }}</a>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.zoneid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间/到期时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            <div v-if="scope.row.expiredtime!=='1970-01-01 00:00:00'" style="color: #8492a6; font-size: 10px">{{scope.row.expiredtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getRds"
      />
    </div>
  </div>
  
</template>


<script>
import {getRdsList} from  '@/api/cainiao/rds'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      rdsTableData: [],
      loading: false,
      url : '',
      total: 0,
      isForce: false,
      connectDialog: false,
      select:'A',
      listQuery: {
        page: 1,
        limit: 20,
        input: undefined,
        expiredtime: undefined,
        creationtime: undefined,
        paytype: undefined,
        expiredtime_s: undefined,
        creationtime_s: undefined
      },
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--info',
        type: 'warning'
      },
      chargeTypeOptions: [
        {'value':'包年包月','label':'包年包月'},
        {'value':'按量付费','label':'按量付费'}
      ],
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
  created() {
    this.getRds()
  },
  methods: {
    handleReset(){
      this.listQuery= {
        page: 1,
        limit: 20,
        input: undefined,
        expiredtime: undefined,
        creationtime: undefined,
        paytype: undefined,
        expiredtime_s: undefined,
        creationtime_s: undefined
      }
      this.getRds()
    },
    send_rds(val){
      this.$router.push({
        path:'/vpc/vpc',
        query:{
          params:val
        }
      })
    },
    handleLoad(val){
      this.listQuery.input=val
      this.getRds()
    },
    getRdsByInput() {
      this.listQuery.page = 1
      this.getRds()
    },
     getRds() {
      if (this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      } else {
        this.listQuery.creationtime = undefined
      }
      if (this.listQuery.expiredtime_s) {
        this.listQuery.expiredtime = this.listQuery.expiredtime_s[0] + ',' + this.listQuery.expiredtime_s[1]
      } else {
        this.listQuery.expiredtime = undefined
      }
      this.listLoading = true
      getRdsList(this.listQuery).then(response => {
        this.rdsTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
     toggleRowExpansion(row) {
      let $table = this.$refs.table;
      this.rdsTableData.map((item) => {
         if (row.id !== item.id) {
           $table.toggleRowExpansion(item, false)
        }
       })
      $table.toggleRowExpansion(row)
    },
    // getPercentage(used, all) {
    //   var percent = used/all
    //   var percentage = Math.round(percent*100)
    //   return percentage
    // }
  }
}
</script>

<style scoped>
   .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #606266;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
