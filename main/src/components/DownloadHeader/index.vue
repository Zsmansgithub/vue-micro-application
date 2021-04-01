<template>
<div>
  <el-dialog title="请选择" :visible.sync="visible" width="800px" :before-close="close">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checks.checkList">
      <el-checkbox v-for="item in checks.list" :label="item.key" :key="item.key" style="width: 25%;margin-right: 0;height: 25px;">{{item.label}}</el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="close">取 消</el-button>
      <el-button type="primary" :disabled="!disabledSub" @click="exportAll">导出(全部)</el-button>
      <!-- <el-button type="primary" :disabled="!disabledSub" @click="onSub">确 定</el-button> -->
      <el-button type="primary" :disabled="!disabledSub" @click="onSub">导出(当前页)</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  export default {
    props: {
      checks: {
        type: Object,
        default: () => {
          return {
            checkList: [],
            list: [],
          }
        }
      },
      onDownLoad: Function,
      visible: Boolean,
      onExport: Function,
    },
    data() {
      return {
        checkAll: false,
        loadingFetch: true
      };
    },
    computed: {
      isIndeterminate() {
        return this.checks.checkList.length > 0 && this.checks.checkList.length < this.checks.list.length
      },
      disabledSub() {
        return this.checks.checkList.length > 0 && this.loadingFetch
      }
    },
    watch: {
      'checks.checkList': {
        handler() {
          this.checkAll = this.checks.checkList.length === this.checks.list.length
        },
        immediate: true,
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.checks.checkList = val ? this.checks.list.reduce((list, v) => {list.push(v.key);return list},[]) : [];
      },
      onSub() {
        let headers = this.checks.list.reduce((list, v)=>{
          if(this.checks.checkList.includes(v.key)) {
            list.filterVal.push(v.key)
            list.tHeader.push(v.label)
          }
          return list;
        }, {tHeader: [], filterVal: []});
        this.onDownLoad && this.onDownLoad(headers)
      },
      close() {
        this.$emit('update:visible', false)
      },

      async exportAll() {
        let headers = this.checks.list.reduce((list, v)=>{
          if(this.checks.checkList.includes(v.key)) {
            list.filterVal.push(v.key)
            list.tHeader.push(v.label)
          }
          return list;
        }, {tHeader: [], filterVal: []});
        this.loadingFetch = false
        await this.onExport(headers)
        this.loadingFetch = true

      },

    }
  };
</script>

<style scoped>

</style>
