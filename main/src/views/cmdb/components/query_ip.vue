<template>
  <div class="app-container">
    <fieldset v-if="data.length==0">
     <legend> 查询结果 </legend>
      没有查询到匹配的结果!
    </fieldset>

    <fieldset v-for="(item,index) in data" :key="index">
      <legend>{{ item.ip + ' 查询结果' }}</legend>
      <el-card shadow="never" class="elCard">
        <div slot="header" class="clearfix">
          <div style="margin:-10px;">
            <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
            <label style="font-size:15px;">基础信息</label>
          </div>
        </div>
        <el-table :data="item.basic_info" style="width:100%">
          <el-table-column prop="host_name" label="主机名"></el-table-column>
          <el-table-column prop="project" label="产品线" width="280"></el-table-column>
          <el-table-column prop="app_name" label="应用名"></el-table-column>
          <el-table-column prop="owner" label="应用负责人"></el-table-column>
          <!-- <el-table-column label="是否集成维护">
            <template slot-scope="scope">
              <span v-if="scope.row.is_integration==0">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="resource_env_name" label="环境"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">使用中</el-tag>
              <el-tag v-else-if="scope.row.status==2" type="warning">维护中</el-tag>
              <el-tag v-else-if="scope.row.status==5" type="info">已报废</el-tag>
              <el-tag v-else>{{ scope.row.status_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="resource_type_name" label="资源类型" width="180"></el-table-column>
        </el-table>
      </el-card>

      <el-card shadow="never" class="elCard" v-if="item.resource_type in [1,2,3,6]">
        <div slot="header" class="clearfix">
          <div style="margin:-10px;">
            <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
            <label style="font-size:15px;">物理设备相关</label>
          </div>
        </div>
        <el-table :data="item.pd" style="width:100%">
          <el-table-column prop="machine_room" label="机房"></el-table-column>
          <el-table-column prop="frame_rack" label="通道机架"></el-table-column>
          <el-table-column prop="size" label="设备大小"></el-table-column>
          <el-table-column prop="supplier_name" label="维保商"></el-table-column>
          <el-table-column prop="brand" label="品牌"></el-table-column>
          <el-table-column prop="device_model" label="设备型号"></el-table-column>
          <el-table-column prop="sn" label="SN码"></el-table-column>
          <el-table-column prop="is_vcenter_host" label="VCenter宿主机"></el-table-column>
          <el-table-column prop="putaway_day" label="上架时间"></el-table-column>
          <el-table-column prop="expired_day" label="过保时间"></el-table-column>
        </el-table>
      </el-card>

      <el-card shadow="never" class="elCard" v-if="item.resource_type == 4">
        <div slot="header" class="clearfix">
          <div style="margin:-10px;">
            <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
            <label style="font-size:15px;">虚拟机相关</label>
          </div>
        </div>
        <el-table :data="item.vm" style="width:100%">
          <el-table-column prop="cluster_name" label="集群名"></el-table-column>
          <el-table-column prop="pool_name" label="资源池"></el-table-column>
          <el-table-column prop="parent_ip" label="VCenter宿主机"></el-table-column>
        </el-table>
      </el-card>
    </fieldset>

    <!-- <query-default></query-default> -->
    <el-card shadow="never" class="elCard">
      <div slot="header" class="clearfix">
        <div style="margin:-10px;">
          <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
          <label style="font-size:15px;">工具简介</label>
        </div>
      </div>
      <span>综合查询页</span>
    </el-card>


  </div>
</template>

<script>
import { getIP } from '@/api/cmdbs/comprehensive_query'
import QueryDefault from './query_default'

export default {
  name: 'QueryIP',

  components: {
    'query-default': QueryDefault,
  },

  props: ['input'],

  data() {
    return {
      data: {},

    }
  },

  watch: {
    // input: {
    //   handler(newValue, oldValue) {
    //     this.getIPInfo(newValue)
    //   },
    //   deep: true
    // }
  },

  created() {
    this.getIPInfo(this.input)

  },

  methods: {
    getIPInfo(input) {
    //   if(input==undefined) {
    //     this.data = []
    //     return
    //   }
    //   input = input.trim().split(/[,;\s]+/).join()
      getIP({'input': input}).then(response => {
        this.data = response
      }).catch(error => {
        this.$notify.error({
          title: '请求错误',
          message: error.response.data.error
        });
      })
    }

  }

}
</script>

<style lang="scss" scoped>
  fieldset {
    // margin: 0 32px 10px 55px;
    margin-bottom: 30px;
    padding: 15px 30px;
    border-color: #DCDFE6;
    border-style: solid;
    border-width: 2px;
    border-radius: 8px;
    line-height: 20px; 
    list-style: none; 
  }

  .elCard {
    border-top: 3px #409EFF solid;
    border-radius: 0px;
    margin-bottom: 20px;
  }
</style>
