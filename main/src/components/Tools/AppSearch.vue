<template>
  <el-select
    placeholder="请输入应用名"
    filterable
    clearable
    style="width: 280px"
    remote
    reserve-keyword
    :remote-method="remoteSearchMethod"
    popper-class="app-search-class"

    no-data-text='应用未找到'
    :loading="loading"
    loading-text="查询中请稍等"
    @change="handleChange"
  >
    <el-option v-for="item in appnameOptionsP" :key="item.key" :label="'('+item.key+')'+item.display_name"
               :value="item.key"/>
  </el-select>
</template>

<script>
import {fetchAppList} from '@/api/cmdb'

export default {
  name: 'AppSearch',
  data() {
    return {
      loading:false,
      appnameOptions:[],
      appnameOptionsP:[],
      selectedOptionsA:undefined,
    }
  },
  created() {
    fetchAppList().then(response => {
      const appnameOptions = []
      for (const i of response) {
        appnameOptions.push({
          display_name: i.app_cname,
          key: i.id,
        })
      }
      this.appnameOptions = appnameOptions
    }).catch((error) => {
      this.$message({
        message: error.toString()
      })
    })
  },
  methods: {
    remoteSearchMethod(query) {
      if (query !== '') {
        this.loading=true
        setTimeout(() => {
          this.appnameOptionsP = this.appnameOptions.filter(item => {
            return item.display_name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.appnameOptionsP = []
      }
      this.this.loading=false
    },
    handleChange(value) {
      console.log(value);
      this.$emit('sendValueToParent', value);
    }
  }
}
</script>

<style>
  .app-search-class {
    max-width: 500px;
  }
</style>
