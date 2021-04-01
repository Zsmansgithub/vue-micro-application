<template>
<div style="display: flex;height: 520px">
  <div style="flex: 0 0 270px">
    <role-msg :role_list.sync="role_list" :list="list" :options="{ name: 'gname' }" :isGroup="true" @hv="hv"></role-msg>
  </div>
  <div style="flex: 1;padding-left: 15px;">
    <div class="tags-wrapper">
      <div class="title">角色管理</div>
      <div style="padding: 10px 0 0 10px">
        <span v-for="tag in rolesData" :key="tag.id"
              class="el-tag el-tag--small el-tag--light">{{tag.name}}
        </span>
      </div>
    </div>
    <div style="height: 400px;">
      <div class="title">菜单权限</div>
      <el-scrollbar class="el-scrollbar-x" style="height: calc(100% - 60px)">
        <el-tree
          ref="filterTree"
          :data="options"
          default-expand-all
          :filter-node-method="filterNode"
          node-key="id"
          :props="{value: 'name'}">
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</div>
</template>

<script>
  import roleMsg from './roleMsg'
  import { getAllMenu, getAllRoles } from '@/api/manage_monitor/route_menu'
  export default {
    components: {roleMsg},
    props: {
      menu: Array,
      list: Array,
    },
    data() {
      return {
        menu_id: [],
        options: [],
        allRoles: [],
        rolesData: [],
        rolemsg: new Date().getTime(),
      }
    },
    computed: {
      role_list: {
        get() {
          this.rolemsg = new Date().getTime()
          return this.menu
        },
        set(val) {
          this.$emit('update:menu', val)
        }
      }
    },
    watch: {
      list(newVal) {
        this.hv(newVal[0])
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        getAllRoles().then((res) => {
          this.allRoles = res;
        })
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
          const list =  fn(resData)
          this.options = list
        })
        .catch((e) => {
          console.error(e)
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return value.includes(data.id);
      },
      hv(item) {
        const roles = item.role || []
        this.menu_id = item.menu
        this.rolesData = this.allRoles.filter((v) => { return roles.includes(v.id) })
        this.$refs.filterTree.filter(this.menu_id)
      }
    }
  }
</script>

<style lang="scss" scoped>
.tags-wrapper {
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.title {
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  font-weight: bold;
  color: #909399;
}
.el-scrollbar-x /deep/ {
  .el-scrollbar__wrap {
      overflow-x: auto;
    }
}
</style>
