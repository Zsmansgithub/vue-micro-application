<template>
  <div class="components-container">
    <el-form :model="ruleForm" ref="ruleForm" class="ruleForm">
      <el-form-item prop="input">
        <el-input placeholder="请输入关键字, 多个以逗号分隔" v-model="ruleForm.input" @keyup.enter.native="handleSearch('ruleForm')" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option v-for="item in selectItems" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <!-- <keep-alive> -->
      <component :is="componentName" :input="ruleForm.input" ref="child"></component>
    <!-- </keep-alive> -->

  </div>
</template>

<script>
import { getApp } from '@/api/cmdbs/comprehensive_query'

import QueryDefault from './components/query_default'
import QueryApp from './components/query_app'
import QueryIP from './components/query_ip'

export default {
  name: 'ComprehensiveQuery',

  components: {
    'query-default': QueryDefault,
    'query-app': QueryApp,
    'query-ip': QueryIP,
  },

  data() {
    const validateInput = (rule, value, callback) => {
      if(value) {
        if(value.trim().split(/[,;\s]+/).length<=20) {

        } else {
          return callback(new Error('不能超过20个条目!'))
        }
      } else {
        return callback(new Error('请输入关键字!'))
      }
    }

    return {
      selectItems: [
        {label: '应用名', value: 0},
        {label: 'IP', value: 1},
        {label: '主机名', value: 2},
      ],
      select: 0,
      ruleForm: {input: undefined},

      // rules: {
      //   input: [
      //     // { required: true, validator: validateInput, trigger: 'blur' },
      //     { required: true, message: '请输入关键字!', trigger: 'change' },
      //   ]
      // },
      componentName: 'query-default',
      // data: undefined,

    }
  },
  created() {
    let sessionData = sessionStorage.getItem('cmdb_base_config_route_comprehensive_query');
    if(sessionData) {
      sessionData = JSON.parse(sessionData);
      this.select = sessionData.select;
      this.ruleForm = sessionData.ruleForm;
    }
  },
  watch: {
    // select: {
    //   handler(newValue, oldValue) {
    //     this.componentName = 'query-default'
    //   },
    //   // deep: true
    // }
    select(val) {
      sessionStorage.setItem('cmdb_base_config_route_comprehensive_query', JSON.stringify({
        select: val,
        ruleForm: this.ruleForm,
      }));
    },
    'ruleForm.input': function () {
      sessionStorage.setItem('cmdb_base_config_route_comprehensive_query', JSON.stringify({
        select: this.select,
        ruleForm: this.ruleForm,
      }));
    }
  },

  methods: {
    handleSearch() {
      if(! this.ruleForm.input) {
        this.$message.error('查询关键字不能为空!')
        return
      }
      let input_set = new Set(this.ruleForm.input.trim().split(/[,;\s]+/))
      if(input_set.size>20) {
        this.$message.error('不能超过20个条目!')
        return
      }

      // this.ruleForm.input = [...input_set].join()
      if(this.select == 0) {
        if(this.componentName == 'query-app') {
          this.$refs.child.getAppInfo(this.ruleForm.input)
        } else {
          this.componentName = 'query-app'
        }
      } else if(this.select == 1) {
        if(this.componentName == 'query-ip') {
          this.$refs.child.getIPInfo(this.ruleForm.input)
        } else {
          this.componentName = 'query-ip'
        }
      } else if(this.select == 2) {
        if(this.componentName == 'query-ip') {
          this.$refs.child.getIPInfo(this.ruleForm.input)
        } else {
          this.componentName = 'query-ip'
        }
      }

    }

  }

}
</script>

<style lang="scss" scoped>
  .ruleForm {
    margin-left: 20px;
  }
  .el-input {
    width: 650px;
  }

  .el-select {
    width: 120px;
  }

  .input-with-select {
    background-color: #fff;
  }

  .dashboard-editor-container {
    padding: 62px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>
