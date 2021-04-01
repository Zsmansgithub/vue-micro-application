<template>
  <div :model="aDetail">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple-light">名称：{{ aDetail.instancename }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">实例ID：{{ aDetail.instanceid }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">GPU：{{ aDetail.gpuamount }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">规格：{{ aDetail.instancetype }}</div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple-light">私网：{{ aDetail.vpc_ips }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">公网：{{ aDetail.pubips }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">弹性IP：{{ aDetail.eipaddress_ipaddress }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          状态：{{ aDetail.status }}
          <!-- 状态：
          <el-tag v-if="aDetail.status==='运行中'" type="success">{{ aDetail.status }}</el-tag>
          <el-tag v-else-if="aDetail.status==='启动中'" type="primary">{{ aDetail.status }}</el-tag>
          <el-tag v-else-if="aDetail.status==='停止中'" type="warning">{{ aDetail.status }}</el-tag>
          <el-tag v-else type="danger">{{ aDetail.status }}</el-tag> -->
        </div>
      </el-col>
    </el-row >
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple-light">标签：{{ aDetail.tags }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">启动时间：{{ aDetail.starttime }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">所在可用区：{{ aDetail.zoneid }}</div>
      </el-col>
      <el-col :span="6">
        <!-- <div class="grid-content bg-purple-light">状态：{{ aDetail.status }}</div> -->
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple-light">付费方式：{{ aDetail.instancechargetype }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">创建时间：{{ aDetail.creationtime }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">到期时间：{{ aDetail.expiredtime }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">安全组ID：{{ aDetail.secgroupids }}</div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple-light">镜像ID：{{ aDetail.imageid }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">私有网络：{{ aDetail.networkids }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">专有网络：{{ aDetail.vpcid }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">虚拟交换机：{{ aDetail.vswitchid }}</div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple-light">弹性公网：{{ aDetail.eipaddress_allocationid }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">带宽计费方式：{{ aDetail.internetchargetype }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">当前使用带宽：{{ aDetail.internetmaxbandwidthout }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">备注描述：{{ aDetail.description }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {renv, rsStatus, rsType, envList, ip_type} from '@/api/static'
export default {
  name: 'VmDetail',
  props: {
    detailStr: {
    }
  },
  data() {
    return {
      ip_type:ip_type,
      aDetail: {},
      hostList: []
    }
  },
  created() {
    this.aDetail=this.detailStr
  }
}
</script>

<style >
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
