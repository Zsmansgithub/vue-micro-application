<template>
  <div class="app-container">
    <div>
      <el-button-group>
        <el-button @click="getList(1)" :type="timeType[0]">按年</el-button>
        <el-button @click="getList(2)" :type="timeType[1]">按月</el-button>
        <el-button @click="getList(3)" :type="timeType[2]">按周</el-button>
      </el-button-group>
    </div>
    <el-row :gutter="12" class="card-row">
      <el-col :span="6">
        <el-card shadow="never">
          <div>
            发布总数
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div>
            今日发布数
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div>
            产品线数量
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div>
            发布成功率
          </div>
        </el-card>
      </el-col>
  </el-row>
  </div>
</template>

<script>
const timeType = ['',['primary', '', ''],['', 'primary', ''],['', '', 'primary']]
export default {
  data() {
    return {
      listQuery: {
        type: 1
      }
    }
  },
  computed: {
    timeType({listQuery}) {
      return timeType[listQuery.type || 1] 
    }
  },
  methods: {
    getList(type) {
      this.listQuery.type = type
    }
  }
}
</script>
<style lang="scss" scoped>
.card-row {
  margin: 10px 0;
}
</style>
