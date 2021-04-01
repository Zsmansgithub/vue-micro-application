<template>
  <el-scrollbar class="el-scrollbar-x" style="height: 100%;">
    <el-tree
      ref="eltree"
      :key="id"
      :data="options"
      show-checkbox
      draggable
      :default-checked-keys="list_check"
      node-key="id"
      @check-change="chkChange"
      :props="{value: 'name'}">
    </el-tree>
  </el-scrollbar>
</template>

<script>
  import { getAllMenu } from '@/api/manage_monitor/route_menu'
  export default {
    props: {
      list_check: Array,
      id: Number
    },
    data() {
      return {
        options: undefined,
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        getAllMenu().then((res) => {
          let resData = [...res]
          const fn = (items) => {
            return items.sort((a, b) => { return a.meta.sort - b.meta.sort })
              .reduce((list, item) => {
                if (item.children && item.children.length > 0) item.children = fn(item.children)
                list.push(item)
                return list
              }, [])
          }
          this.options = fn(resData)
        })
        .catch((e) => {
          console.error(e)
        })
      },
      chkChange() {
        // const ids =this.$refs.eltree.getCheckedNodes(false, true).reduce((list,v)=>{
        //   list.push(v.id)
        //   return list
        // },[]);
        // this.$emit('update:list_check', ids)
      },
      getCheckedIds() {
        return this.$refs.eltree.getCheckedNodes(false, true).reduce((list,v)=>{
          list.push(v.id)
          return list
        },[]);
      },
      getCheckedIds1() {
        return this.$refs.eltree.getCheckedKeys(false);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-scrollbar-x /deep/ {
    .el-scrollbar__wrap {
        overflow-x: auto;
      }
  }
</style>
