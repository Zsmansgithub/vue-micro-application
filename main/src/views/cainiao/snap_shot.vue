<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getSnapByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.sourcedisktype" @change="getSnapByInput" clearable placeholder="请选择磁盘属性" style="width: 150px">
            <el-option v-for="item in diskProOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getSnapByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getSnapByInput"
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
    <el-table :data="snapShotData" border stripe  highlight-current-row ref="table">
        <el-table-column label="快照名称/快照ID" width="350">
          <template slot-scope="scope">
            <span>{{ scope.row.snapshotname }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.snapshotid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="磁盘ID">
          <template slot-scope="scope">
            <span>{{ scope.row.sourcediskid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="容量(GB)" prop="sourcedisksize" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.sourcedisksize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="磁盘属性">
          <template slot-scope="scope">
            <span>{{ scope.row.sourcedisktype }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保留时间" prop="retentiondays" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.retentiondays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="135" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
          <el-table-column label="进度" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.progress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getSnapShot"
      />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {getSnapShotList } from  '@/api/cainiao/snap_shot'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      snapShotData:[],
      total: 0,
      listQuery: {
          page: 1,
          limit: 20,
          input: '',
          creationtime: undefined,
          sourcedisktype: undefined,
          creationtime_s: undefined
        },
      diskProOptions: [
        {'value':'数据盘','label':'数据盘'},
        {'value':'系统盘','label':'系统盘'},
      ],
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
   created() {
    this.getSnapShot()
  },
  methods: {
    handleReset(){
      this.listQuery={
          page: 1,
          limit: 20,
          input: '',
          creationtime: undefined,
          sourcedisktype: undefined,
          creationtime_s: undefined
        }
        this.getSnapShot()
    },
    getSnapByInput() {
      this.listQuery.page = 1
      this.getSnapShot()
    },
    getSnapShot() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getSnapShotList(this.listQuery).then(response => {
        this.snapShotData = response.results
        this.total = response.count
      }
      )
      this.listLoading = false
    },
  }
}
</script>
