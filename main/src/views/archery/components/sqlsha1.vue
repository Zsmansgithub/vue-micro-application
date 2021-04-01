<template>
  <el-table 
    :data="detail_list"
    border
    stripe
    @row-click="opneRow"
    highlight-current-row
    ref="table"
  >
    <el-table-column type="expand" align="center" width="60">
      <template slot-scope="props">
        <div v-if="props.row.sql"><b>SQL内容：</b>{{props.row.sql}}</div>
        <template v-if="props.row.errormessage">
          <div style="height: 1px;background-color: #dcdfe6;margin: 8px 0;"></div>
          <div><b>审核/执行信息：</b>{{props.row.errormessage}}</div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="ID" align="center" width="60">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column label="SQL内容" max-width="200">
      <template slot-scope="scope">
        <span class="text-ellipsis">{{scope.row.sql}}</span>
      </template>
    </el-table-column>
    <el-table-column label="审核/执行状态" align="center" width="120">
      <template slot-scope="scope">
        <span >{{errlevel[scope.row.errlevel]}}</span>
      </template>
    </el-table-column>
    <el-table-column label="审核/执行信息" align="center" max-width="200">
      <template slot-scope="scope">
        <span class="text-ellipsis">{{scope.row.errormessage}}</span>
      </template>
    </el-table-column>
    <el-table-column label="扫描/影响行数" align="center" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.affected_rows}}</span>
      </template>
    </el-table-column>
    <el-table-column label="执行耗时" align="center" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.execute_time}}</span>
      </template>
    </el-table-column>
    <el-table-column label="备份耗时" align="center" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.backup_time}}</span>
      </template>
    </el-table-column>
    <el-table-column label="当前阶段" align="center" width="150">
      <template slot-scope="scope">
        <span>{{scope.row.stagestatus}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column v-if="isDBA" width="80" label="操作">
      <template slot-scope="scope">
        <el-link type="primary" :underline="false" v-if="isDBA" @click.stop="select_load(scope.row.sqlsha1)">查看进度</el-link>
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
const errlevel = ['pass', 'warning', 'error'];
export default {
  props: {
    detail_list: {
      type: Array,
      default: () => [],
      required: true
    },
    isDBA: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errlevel: Object.freeze(errlevel)
    }
  },
  methods: {
    select_load(sqlsha1) {
      this.$emit('select_load', sqlsha1)
    },
    opneRow(row) {
        this.$refs['table'].toggleRowExpansion(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
