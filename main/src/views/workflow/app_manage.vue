<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select
            v-model="listQuery.name"
            class="filter-item"
            filterable
            remote
            clearable
            placeholder="请输入工作流"
            :remote-method="getOptions"
            popper-class="app-search-class"
            no-data-text='未找到'
            :loading="loading"
            loading-text="查询中请稍等"
            @change="handleFilter">
            <el-option v-for="item in Options" :key="item.id" :label="item.name" :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-collapse v-model="activeNames" v-for="(item,index) in workflowteamOptions" :key="item.id" :value='item.value' :label="item.label" style="border-top: 0;" >
      <el-collapse-item :title="item.name" :name="index">
        <span v-for="arry in item.workflow" :key="arry.id" :value='item.value' :label="item.label">
          <el-tooltip content="流程单被禁用，请联系管理员" placement="top" v-if="arry.status == 1">
            <el-button type="text"  v-if="arry.status == 1" class="button_workflow" disabled>{{arry.name}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
          </el-tooltip>
          <el-button type="text" v-else-if="arry.status == 0" class="button_workflow" @click="handleShow(arry.name)">{{arry.name}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        </span>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getWorkflowline, getWorkflowparentline } from '@/api/workflow/app_manage'

export default {
  data() {
    return {
      workflowteamOptions: [],
      Options:[],
      listQuery: {
        id: undefined,
        name: undefined,
      },
      loading:false,
      activeNames: [],
    };
  },
  created() {
    this.getTeamList()
  },
  methods: {
    getTeamList() {
      getWorkflowparentline(this.listQuery).then(response => {
        this.workflowteamOptions = response.results
        // 折叠面板全部展开
        for (var i = 0; i < this.workflowteamOptions.length; i++) {
          this.activeNames.push(i)
        }
      })
    },
    handleShow(name) {
      getWorkflowline({name:name}).then(response => {
        this.$router.push({name: response.results[0].url.split('/')[2], params: {id: response.results[0].id, name:response.results[0].name}})
      })
    },
    getOptions(query) {
      getWorkflowparentline().then(response => {
        const Data = []
        for (let i of response.results) {
          for (let j of i.workflow) {
            if (j.status == 0) {
              Data.push({name: j.name, id: j.id})
            }
          }
        }
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.Options = Data.filter(item => {
              return item.name.indexOf(query) > -1;
            })
          }, 200)
        } else {
          this.Options = [];
        }
      })
    },
    handleFilter(){
      if (this.listQuery.name) {
        this.handleShow(this.listQuery.name)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .button_workflow {
    padding: 0;
  }
  .app-search-class {
    max-width: 500px;
  }
  /deep/ .el-icon-arrow-right:before{
    display:none;
  }
  /deep/ .el-collapse-item__header{
    font-weight:bold;
  }
  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }
</style>
