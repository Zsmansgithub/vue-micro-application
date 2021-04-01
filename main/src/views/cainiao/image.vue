<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getImageByInput" clearable placeholder="请选择账户" style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.imageowneralias" @change="getImageByInput" clearable placeholder="请选择镜像类型" style="width: 150px">
            <el-option v-for="item in imageOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.architecture" @change="getImageByInput" clearable placeholder="请选择系统位数" style="width: 150px">
            <el-option v-for="item in arcOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.ostype" @change="getImageByInput" clearable placeholder="请选择平台" style="width: 150px">
            <el-option v-for="item in osTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.status" @change="getImageByInput" clearable placeholder="请选择状态" style="width: 150px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getImageByInput" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model.trim="listQuery.creationtime_s"
            @change="getImageByInput"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm"
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
    <el-table :data="imageTableData" border stripe  highlight-current-row ref="table">
        <el-table-column label="名称/镜像ID" width="450">
          <template slot-scope="scope">
            <span>{{ scope.row.imagename }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.imageid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="镜像类型/镜像大小" width="138">
          <template slot-scope="scope">
            <span>{{ scope.row.imageowneralias }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.size}}</div>
          </template>
        </el-table-column>
        <el-table-column label="平台/系统位数" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.ostype }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.architecture}}</div>
          </template>
        </el-table-column>
        <el-table-column label="系统名称/进度">
          <template slot-scope="scope">
            <span>{{ scope.row.osname }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.progress}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态"  width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='可用'" type="success">{{ scope.row.status }}</el-tag>
            <el-tag v-else type="danger">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="135" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="快照详情/备注" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.diskdevicemappings.indexOf(',')>-1" v-for="item in scope.row.diskdevicemappings.split(',')">
              {{ item }}
            </div>
          <div v-else>{{scope.row.diskdevicemappings}}</div>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.description}}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            style="padding-top: 5px;margin-top: 10px;"
            @pagination="getImage"
      />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {getImageList } from  '@/api/cainiao/image'
import sessionListQuery from "@/components/mixins/sessionListQuery";

export default {
  components: { Pagination },
  mixins: [sessionListQuery],
  data() {
    return {
      imageTableData:[],
      total: 0,
      listQuery: {
          page: 1,
          limit: 20,
          input: undefined,
          imageowneralias: undefined,
          architecture: undefined,
          ostype: undefined,
          status: undefined,
          creationtime: undefined,
          creationtime_s: undefined
      },
      imageOptions: [
        {'value':'自定义镜像','label':'自定义镜像'},
        {'value':'系统镜像','label':'系统镜像'}
      ],
      arcOptions: [
        {'value':'32位','label':'32位'},
        {'value':'64位','label':'64位'}
      ],
      osTypeOptions: [
        {'value':'linux','label':'linux'},
        {'value':'windows','label':'windows'}
      ],
      statusOptions: [
        {'value':'可用','label':'可用'},
        {'value':'不可用','label':'不可用'},
      ],
      accountOptions: [
        {'value':'hw', 'label':'海外'},
        {'value':'cn', 'label':'国内'}
      ]
    }
  },
   created() {
    this.getImage()
     this.getParams()
  },
  methods: {
    getParams(){
      const val = this.$route.query.params
      this.$route.query.params = undefined
      if (val){
        this.listQuery.input=val
      }
    },
    handleReset(){
      this.listQuery= {
          page: 1,
          limit: 20,
          input: undefined,
          imageowneralias: undefined,
          architecture: undefined,
          ostype: undefined,
          status: undefined,
          creationtime: undefined,
          creationtime_s: undefined
      }
      this.getImage()
    },
    getImageByInput() {
      this.listQuery.page = 1,
      this.getImage()
    },
    getImage() {
      if(this.listQuery.creationtime_s) {
        this.listQuery.creationtime = this.listQuery.creationtime_s[0] + this.listQuery.creationtime_s[1]
      }else {
        this.listQuery.creationtime = undefined
      }
      this.listLoading = true
      getImageList(this.listQuery).then(response => {
        this.imageTableData = response.results
        this.total = response.count
      })
      this.listLoading = false
    },
  }
}
</script>
