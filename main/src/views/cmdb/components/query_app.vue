<template>
  <div class="app-container">
    <fieldset v-if="data.length==0">
      <legend> 查询结果 </legend>
      没有查询到匹配的结果!
    </fieldset>

    <fieldset v-for="(item,index) in data" :key="index" v-else>
      <legend>{{ item.app_name + ' 查询结果' }}</legend>
      <!-- <legend>{{ item.app_name + ' 查询结果: ' + index + ' / ' + data.length }}</legend> -->
      <el-card shadow="never" class="elCard">
        <div slot="header" class="clearfix">
          <div style="margin:-10px;">
            <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
            <label style="font-size:15px;">基础信息</label>
          </div>
        </div>
        <el-table :data="item.basic_info" style="width:100%">
          <el-table-column prop="project" label="产品线" width="380"></el-table-column>
          <el-table-column prop="owner" label="应用负责人"></el-table-column>
          <el-table-column label="是否集成维护">
            <template slot-scope="scope">
              <span v-if="scope.row.is_integration==0">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
          <el-table-column prop="host_total" label="主机数"></el-table-column>
        </el-table>
      </el-card>

      <el-card shadow="never" class="elCard">
        <div slot="header" class="clearfix">
          <div style="margin:-10px;">
            <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
            <label style="font-size:15px;">主机信息</label>
          </div>
        </div>
        <el-table :data="item.host_info" style="width:100%">
          <el-table-column prop="ip" label="IP"></el-table-column>
          <el-table-column prop="resource_type_name" label="资源类型"></el-table-column>
          <el-table-column prop="resource_env_name" label="环境"></el-table-column>
          <!-- <el-table-column label="主机数" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.host_total }}</span>
            </template>
          </el-table-column>
          <el-table-column label="主机" min-width="680">
            <template slot-scope="scope">
              <span><el-tag v-for="(i,index) in scope.row.ip" :key="index">{{ i }} </el-tag> </span>
            </template>
          </el-table-column> -->
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
import { getApp } from '@/api/cmdbs/comprehensive_query'
import QueryDefault from './query_default'

export default {
  name: 'QueryApp',

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
    //     this.getAppInfo(newValue)
    //   },
    //   // deep: true
    // }
  },

  created() {
    this.getAppInfo(this.input)

  },

  methods: {
    getAppInfo(input) {
      // if(input in [undefined, ""]) {
      //   this.data = []
      //   return
      // }
      // input = input.trim().split(/[,;\s]+/).join()
      getApp({'input': input}).then(response => {
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
