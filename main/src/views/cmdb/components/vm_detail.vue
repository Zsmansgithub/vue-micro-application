<template>
  <div :model="aDetail">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        UUID：{{ aDetail.uuid }}
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">VcenterIP：{{ aDetail.datacenter }}</div>
      </el-col>
            <el-col :span="6">
        <div class="grid-content bg-purple-light">宿主机IP：{{ aDetail.parent_ip }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">集群名：{{ aDetail.cluster_name+'_'+aDetail.pool_name }}</div>
      </el-col>
    </el-row >
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple-light">硬盘类型：{{ aDetail.disk_type }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">MAC地址：{{ aDetail.mac }}</div>
      </el-col>
      <el-col :span="6">
         <div class="grid-content bg-purple-light">更新用户：{{ aDetail.change_user }} ({{ aDetail.update_time }} )</div>
      </el-col>
      <el-col :span="6">
      <div class="grid-content bg-purple-light">其他IP：
        <el-tag v-for="(tag, index) in aDetail.ip_manage" :key="index">
          <label v-if="tag[0]==4"> <a target="_blank" :href="'http://' + tag[1]">{{ ip_type[tag[0]]+':'+ tag[1] }}</a>  </label>
          <label v-else>{{ ip_type[tag[0]]+':'+tag[1] }} </label>
        </el-tag>
      </div>
      </el-col>
    </el-row>
<!--    <el-row type="flex" class="row-bg" justify="center">-->
<!--      <el-col :span="24">-->
<!--        <div class="grid-content bg-purple-light">IP地址：-->
<!--           <el-tag-->
<!--              v-for="(tag, index) in aDetail.ip_manage"-->
<!--            >-->
<!--             <label v-if="tag[0]==4"> <a target="_blank" :href="'http://' + tag[1]">{{ ip_type[tag[0]]+':'+ tag[1] }}</a>  </label>-->
<!--              <label v-else>{{ ip_type[tag[0]]+':'+tag[1] }} </label>-->
<!--            </el-tag>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
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
    // if (this.detailStr) {
    //   try {
    //     this.aDetail = JSON.parse(this.detailStr)
    //     for (let i = 0; i < this.aDetail.configinfo.length; i++) {
    //       if (this.aDetail.configinfo[i].sum > 0) {
    //         this.hostList.push(this.aDetail.configinfo[i])
    //       }
    //     }
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  }
}
</script>

<style >
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
