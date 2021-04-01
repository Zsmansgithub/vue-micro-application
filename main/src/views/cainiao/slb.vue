<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getSlbByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.chargetype" @change="getSlbByInput" clearable placeholder="请选择计费方式" style="width: 150px">
            <el-option v-for="item in chargeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.paytype" @change="getSlbByInput" clearable placeholder="请选择付费类型" style="width: 150px">
            <el-option v-for="item in payTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.networktype" @change="getSlbByInput" clearable placeholder="请选择网络类型" style="width: 150px">
            <el-option v-for="item in networkOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getSlbByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getSlbByInput"
            value-format="yyyy-MM-dd HH:mm"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="slbTableData" border stripe  highlight-current-row @row-click="toggleRowExpansion" ref="table">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-col :md="24" :lg="12" :xl="6">
              <el-form-item label="实例规格:">
                <a style="color: #1890ff" @click="handleLoad(props.row.loadbalancerspec)">{{ props.row.loadbalancerspec }}</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="6">
              <el-form-item label="付费方式:">
                <span>{{ props.row.paytype }}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="12">
              <el-form-item label="创建时间:">
                <span>{{ props.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="6">
              <el-form-item label="专有网络:">
                <a style="color: #1890ff" @click="send_rds(props.row.vpcid)">{{ props.row.vpcid }}</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="6">
              <el-form-item label="虚拟交换机:">
                <a style="color: #1890ff" @click="send_rds(props.row.vswitchid)">{{ props.row.vswitchid }}</a>
              </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="12">
              <el-form-item label="实例规格说明:">
                <span>{{ props.row.loadbalancerspec_dis }}</span>
              </el-form-item>
              </el-col>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="名称/实例ID" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.loadbalancername }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.loadbalancerid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务地址">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="网络类型/计费方式">
          <template slot-scope="scope">
            <span>{{ scope.row.networktype }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.internetchargetype}}</div>
          </template>
        </el-table-column>
        <el-table-column label="带宽" prop="bandwidth" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.bandwidth }}</span>
          </template>
        </el-table-column>
        <el-table-column label="监听端口数" width="120" prop="listenerportcounts" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.listenerportcounts }}</span>
          </template>
        </el-table-column>
        <el-table-column label="默认ECS数" width="120" prop="defaultgroupcounts" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.defaultgroupcounts }}</span>
          </template>
        </el-table-column>
        <el-table-column label="虚拟机数" width="110" prop="virtualgroupcounts" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.virtualgroupcounts }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.loadbalancerstatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主/备可用区" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.masterzoneid }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.slavezoneid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="text"  @click="getDeploy(scope.row);">查看配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getSlb"
      />
    </div>
    <el-dialog 
      :title="slb_title"
      :visible.sync="dialog"
      width="70%"
      @close="dialog = false">
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="监听端口" name="one">
          <el-table :data="listenPortData" border>
            <el-table-column label="协议" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.listenerprotocol }}</span>
              </template>
            </el-table-column>
            <el-table-column label="监听端口" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.listenerport }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="默认服务组" name="second">
          <el-table :data="defaultData" border>
            <el-table-column label="默认服务器组中云服务器实例ID" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.defaultserverid }}</span>
              </template>
            </el-table-column>
            <el-table-column label="权重" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.defaultserverweight }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟服务组" name="third">
          <el-table :data="virtualData" border>
            <el-table-column label="虚拟服务器组ID" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.virtualservergroupid }}</span>
              </template>
            </el-table-column>
            <el-table-column label="组名称" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.virtualservergroupname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="虚拟服务器组云服务器实例ID|监听端口|权重" min-width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.virtualservergroupinfo.indexOf(',')>-1" v-for="item in scope.row.virtualservergroupinfo.split(',')">
                  <span>{{ item }}</span>
                </div>
                <div v-else>{{scope.row.virtualservergroupinfo}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    
  </div>
</template>

<script>
import {getSlbList} from '@/api/cainiao/slb'
import { getListenPortById } from '@/api/cainiao/slbattr'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      slbTableData: [],
      activeName: 'one',
      listenPortData: [],
      defaultData: [],
      virtualData: [],
      dialog: false,
      total: 0,
      listLoading: false,
      slb_title:'',
      listQuery: {
        page: 1,
        limit: 20,
        input:undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        paytype: undefined,
        networktype: undefined,
        chargetype: undefined
      },
      chargeTypeOptions:[
        {'label':'按固定宽带计费','value':'按固定宽带计费'},
        {'label':'按使用流量计费','value':'按使用流量计费'}
      ],
      payTypeOptions: [
        {'label':'预付费','value':'预付费'},
        {'label':'按量付费','value':'按量付费'}
      ],
      networkOptions: [
        {'label':'专有网络','value':'专有网络'},
        {'label':'经典网络','value':'经典网络'}
      ],
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
  created() {
    this.getSlb()
  },
  methods: {
    handleReset(){
      this.listQuery={
        page: 1,
        limit: 20,
        input:undefined,
        creationtime: undefined,
        creationtime_s: undefined,
        paytype: undefined,
        networktype: undefined,
        chargetype: undefined
      }
      this.getSlb()
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
      this.getSlb()
    },
    getSlbByInput() {
      this.listQuery.page = 1
      this.getSlb()
    },
    getSlb() {
      if (this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      } else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getSlbList(this.listQuery).then(response => {
        this.slbTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
     toggleRowExpansion(row, label) {
       if (label.label == '操作') {
        return
      }
      let $table = this.$refs.table;
      this.slbTableData.map((item) => {
        if (row.id !== item.id) {
           $table.toggleRowExpansion(item, false)
        }
       })
      $table.toggleRowExpansion(row)
    },
    getDeploy(row) {
      this.listenPortData=[]
      this.defaultData=[]
      this.virtualData=[]
      this.dialog = true
      this.slb_title=row.loadbalancerid+'-SLB详情'
      getListenPortById({loadbalancerid:row.loadbalancerid }).then(response => {
        for (const i of response) {
          if (i.flag===0){
            this.listenPortData.push(i)
          }else if (i.flag===1) {
            this.defaultData.push(i)
          }else {
            this.virtualData.push(i)
          }
        }
        // this.listenPortData = response.results
      })

    },
    handleClick(tab, event) {
    }
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
