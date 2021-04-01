<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getSecurityByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getSecurityByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getSecurityByInput"
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
    <el-table :data="securityGroupData" border stripe  highlight-current-row ref="table">
        <el-table-column label="安全组ID" >
          <template slot-scope="scope">
            <span>{{ scope.row.securitygroupid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="安全组名称"  >
          <template slot-scope="scope">
            <span>{{ scope.row.securitygroupname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规划条目数" prop="secgroups_attr_counts" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.secgroups_attr_counts }}</span>
          </template>
        </el-table-column>
        <el-table-column label="专有网络" >
          <template slot-scope="scope">
            <span>{{ scope.row.vpcid }}</span>
          </template>
        </el-table-column>
      <el-table-column label="标签" >
          <template slot-scope="scope">
            <span>{{ scope.row.tags }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="135" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center">
          <template slot-scope="scope">
          <el-button type="text" @click="getDetail(scope.row);">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getsecurityGroup"
      />
    <el-dialog
      title="出入向详情"
      :visible.sync="dialogForm"
      width="70%"
      @close="handleClose">
      <el-tabs v-model="activeName">
        <el-tab-pane label="入方向" name="one">
          <el-table :data="inData" border>
            <el-table-column label="策略" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.policy }}</span>
              </template>
            </el-table-column>
            <el-table-column label="协议" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.ipprotocol }}</span>
              </template>
            </el-table-column>
            <el-table-column label="端口范围" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.portrange }}</span>
              </template>
            </el-table-column>
            <el-table-column label="授权类型" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.nictype }}</span>
              </template>
            </el-table-column>
            <el-table-column label="授权对象" width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.cidrip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="优先级" width="70">
              <template slot-scope="scope">
                <span>{{ scope.row.priority }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述">
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="135" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="出方向" name="second">
          <el-table :data="outData" border>
            <el-table-column label="策略" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.policy }}</span>
              </template>
            </el-table-column>
            <el-table-column label="协议" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.ipprotocol }}</span>
              </template>
            </el-table-column>
            <el-table-column label="端口范围" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.portrange }}</span>
              </template>
            </el-table-column>
            <el-table-column label="授权类型" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.nictype }}</span>
              </template>
            </el-table-column>
            <el-table-column label="授权对象" width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.cidrip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="优先级" width="70">
              <template slot-scope="scope">
                <span>{{ scope.row.priority }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述">
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="135" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {getsecurityGroupList } from  '@/api/cainiao/security_group'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      securityGroupData:[],
      total: 0,
      inData:[],
      outData:[],
      activeName:'one',
      dialogForm:false,
      listQuery: {
          page: 1,
          limit: 20,
          input: undefined,
          creationtime: undefined,
          securitygroupid: undefined,
          creationtime_s: undefined
        },
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
   created() {
    this.getsecurityGroup()
    this.getParams()
  },
  methods: {
    handleReset(){
      this.listQuery={
          page: 1,
          limit: 20,
          input: undefined,
          creationtime: undefined,
          securitygroupid: undefined,
          creationtime_s: undefined
        }
        this.getsecurityGroup()
    },
    getSecurityByInput() {
      this.listQuery.page = 1
      this.getsecurityGroup()
    },
    getsecurityGroup() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' +this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getsecurityGroupList(this.listQuery).then(response => {
        this.securityGroupData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
    getParams() {
      const routerParams = this.$route.query.securitygroupid
      if(routerParams) {
        this.listQuery.input = routerParams
      }
    },
    getDetail(row) {
      this.dialogForm=true
      this.inData=row.inList
      this.outData=row.outList
    },
    handleClose(){
      this.dialogForm=false
      this.activeName='one'
    }
  }
}
</script>
