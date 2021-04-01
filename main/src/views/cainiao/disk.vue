<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getDiskByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.diskType" @change="getDiskByInput" clearable placeholder="磁盘种类" style="width: 120px">
            <el-option v-for="item in diskTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.category" @change="getDiskByInput" clearable placeholder="磁盘属性" style="width: 105px">
            <el-option v-for="item in diskProOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.diskStatus" @change="getDiskByInput" clearable placeholder="磁盘状态" style="width: 105px">
            <el-option v-for="item in diskStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.chargetype" @change="getDiskByInput" clearable placeholder="付费方式" style="width: 110px">
            <el-option v-for="item in chargeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getDiskByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <div v-if="listQuery.select==='create'">
            <el-button type="text" @click="listQuery.select='expire'">创建时间<i class="el-icon-caret-bottom"></i></el-button>
            <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getDiskByInput"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
          </div>
          <div v-if="listQuery.select==='expire'">
            <el-button type="text" @click="listQuery.select='create'">过期时间<i class="el-icon-caret-bottom"></i></el-button>
            <el-date-picker
            v-model.trim="listQuery.expiretime_s"
            @change="getDiskByInput"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
          </div>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <el-table :data="diskTableData" border stripe  highlight-current-row @row-click="toggleRowExpansion" ref="table">
      <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="付费类型:">
                <span>{{ props.row.diskchargetype }}</span>
              </el-form-item>
              <el-form-item label="随实例释放:">
                <span>{{ props.row.deletewithinstance}}</span>
              </el-form-item>
              <el-form-item label="是否可卸载:">
                <span>{{ props.row.portable}}</span>
              </el-form-item>
              <el-form-item label="是否加密:">
                <span>{{ props.row.encrypted }}</span>
              </el-form-item>
              <el-form-item label="开启自动快照:">
                <span>{{ props.row.enableautosnapshot }}</span>
              </el-form-item>
              <el-form-item label="自动快照随磁盘释放:">
                <span>{{ props.row.deleteautosnapshot }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="磁盘ID/ECS实例ID" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.diskid }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.instanceid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="磁盘种类" width="80" >
          <template slot-scope="scope">
            <span>{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="容量(GB)" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.size }}</span>
          </template>
        </el-table-column>
        <el-table-column label="磁盘属性" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="挂载点" width="85" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.device }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近挂载/卸载时间" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.attachedtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            <div v-if="scope.row.detachedtime!=='1970-01-01 00:00:00'" style="color: #8492a6; font-size: 10px">{{scope.row.detachedtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='使用中'" type="success">{{ scope.row.status }}</el-tag>
            <el-tag v-else type="warning">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间/到期时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.expiredtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="标签">
          <template slot-scope="scope">
            <span>{{ scope.row.tags }}</span>
          </template>
        </el-table-column>
        <el-table-column label="镜像ID/所在区">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_image(scope.row.imageid)">{{ scope.row.imageid }}</a>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.zoneid}}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getDisk"
      />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {getDiskList } from  '@/api/cainiao/disk'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      diskTableData:[],
      total: 0,
      listQuery: {
          page: 1,
          limit: 20,
          input: undefined,
          chargetype: undefined,
          diskstatus: undefined,
          category: undefined,
          creationtime: undefined,
          creationtime_s: undefined,
          expiretime_s: undefined,
          diskType: undefined,
          select:'create',
      },
      diskTypeOptions: [
        {'value':'SSD云盘','label':'SSD云盘'},
        {'value':'ESSD云盘','label':'ESSD云盘'},
        {'value':'高效云盘','label':'高效云盘'}
      ],
      diskStatusOptions: [
        {'value':'使用中','label':'使用中'},
        {'value':'待挂载','label':'待挂载'},
      ],
      diskProOptions: [
        {'value':'数据盘','label':'数据盘'},
        {'value':'系统盘','label':'系统盘'},
      ],
      chargeTypeOptions: [
        {'value':'包年包月','label':'包年包月'},
        {'value':'按量付费','label':'按量付费'}
      ],
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'},
      ]
    }
  },
   created() {
    this.getDisk()
     this.getParams()
  },
  methods: {
    send_image(val) {
      this.$router.push({
        path: '/ecs/image',
        query: {
          params: val
        }
      })
    },
    handleReset(){
      this.listQuery= this.$options.data().listQuery
        this.getDisk()
    },
    getParams(){
      const routerParams = this.$route.query.params
      this.$route.query.params = undefined
      if (routerParams) {
        this.listQuery.input=routerParams
      }
    },
    getDiskByInput() {
      this.listQuery.page = 1
      this.getDisk()
    },
    getDisk() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      if(this.listQuery.expiretime_s) {
        this.listQuery.expiretime = this.listQuery.expiretime_s[0] + ',' + this.listQuery.expiretime_s[1]
      }else {
        this.listQuery.expiretime = undefined
      }
      this.listLoading = true
      getDiskList(this.listQuery).then(response => {
        this.diskTableData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
    toggleRowExpansion(row) {
      let $table = this.$refs.table;
      this.diskTableData.map((item) => {
         if (row.id !== item.id) {
           $table.toggleRowExpansion(item, false)
        }
       })
      $table.toggleRowExpansion(row)
    },
  }
}
</script>

<style scoped>
   .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 150px;
    color: #606266;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  }
  .demo-table-expand .el-form-item__content {
    width: 160px;
  }
   .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 10px;
  }
</style>
