<template>
  <div :model="aDetail">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <!-- 编号：{{ aDetail.resource_id }} -->
        <div class="grid-content bg-purple-light">SN码：{{ aDetail.sn }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">品牌：{{ aDetail.brand }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">过保时间：{{ aDetail.expired_day }}</div>
      </el-col>
      <el-col :span="6">
        <!-- <div class="grid-content bg-purple-light">SN码：{{ aDetail.sn }}</div> -->
        <div class="grid-content bg-purple-light">资产编码：{{ aDetail.asset_number }}</div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple">型号：{{ aDetail.device_model }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">上架时间：{{ aDetail.putaway_day }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">机房信息：{{ aDetail.mach_name + aDetail.frame_name + aDetail.rack_name  }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">维保商：{{ aDetail.supplier_name }}</div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="6">
        <div class="grid-content bg-purple">高度：{{ aDetail.size }}U</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">SLA级别：{{ aDetail.sla_name  }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">机柜位置：{{ aDetail.rack_location }}-{{ aDetail.rack_location+aDetail.size-1 }}U
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">更新用户：{{ aDetail.change_user }}({{ aDetail.update_time }})</div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">
        <div class="grid-content bg-purple-light">其他IP：
          <el-tag v-for="(tag, index) in aDetail.ip_manage">

            <label v-if="tag[0]==4"> <a target="_blank" :href="'http://' + tag[1]">{{ ip_type[tag[0]]+':'+ tag[1] }}</a>
            </label>
            <label v-else>{{ ip_type[tag[0]]+':'+tag[1] }} </label>
          </el-tag>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const ip_type = {
    '1': '主IP',
    '2': '管理IP',
    '3': '扩展IP',
    '4': "IPMI",
    '5': 'VIP'
  }
  export default {
    name: 'PyDetail',
    props: {
      detailStr: {}
    },
    data() {
      return {
        ip_type: ip_type,
        aDetail: {},
        hostList: []
      }
    },
    created() {
      this.aDetail = this.detailStr
    }
  }
</script>

<style>
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
