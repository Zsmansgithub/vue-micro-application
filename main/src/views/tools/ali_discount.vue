<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-select v-model="listQuery.category" placeholder="产品类目" filterable clearable @change="handleFilter">
            <el-option v-for="item in category_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.name" placeholder="产品名称" filterable clearable @change="handleFilter">
            <el-option v-for="item in name_options" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item class="fr" style="margin-right:-2px;">
          <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="downloadXLSX = true" :loading="downloadLoading">导出</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table v-loading="listLoading" :data="tableData" border stripe highlight-current-row fit>
      <el-table-column label="产品类目" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣对象">
        <template slot-scope="scope">
          <span>{{ scope.row.discount_obj }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地域">
        <template slot-scope="scope">
          <span>{{ scope.row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订购时长">
        <template slot-scope="scope">
          <span>{{ scope.row.order_duration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣比例">
        <template slot-scope="scope">
          <span>{{ scope.row.discount_ratio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
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

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRow, addRow, editRow, deleteRow, getQueryOptions, exportList } from '@/api/tools/ali_discount'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import DownloadHeader from '@/components/DownloadHeader'
import { exportIsready, exportFile } from '@/api/cmdbs/resourcemanage'
import { parseTime } from '@/utils'

export default {
  name: 'AliDiscount',
  components: { Pagination, DownloadHeader },
  mixins: [sessionListQuery],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        category: undefined,
        name: undefined,
      },
      category_options: [],
      name_options: [],

      tableData: [],
      total: 0,
      listLoading: false,

      downloadXLSX: false,
      downloadLoading: false,
      checks: {
        checkList: ['category', 'name', 'discount_obj', 'region', 'order_duration', 'discount_ratio', 'update_time', 'comments'],
        list: [
          {key: 'category', label: '产品类目'},
          {key: 'name', label: '产品名称'},
          {key: 'discount_obj', label: '折扣对象'},
          {key: 'region', label: '地域'},
          {key: 'order_duration', label: '订购时长'},
          {key: 'discount_ratio', label: '折扣比例'},
          {key: 'update_time', label: '更新时间'},
          {key: 'comment', label: '备注'}
        ],
      },

    }
  },

  created() {
    getQueryOptions().then(response => {
      this.category_options = response['category']
      this.name_options = response['name']
    })

    this.getRowsInf()

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

  }

}
</script>

<style lang="scss" scoped>
</style>
