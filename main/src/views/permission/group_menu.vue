<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model="listQuery.gname" placeholder="组名" style="width: 100%" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.detail" placeholder="组名详情" style="width: 100%" />
        </el-form-item>
        <!-- <el-form-item prop="status">
          <el-select v-model="listQuery.status" style="width: 100%" clearable placeholder="可用状态"
                     @change="handleFilter">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" @click="handleBatchAdd" icon="el-icon-plus">新增记录
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名" width="200">
        <template slot-scope="scope">
          <a style="color: rgb(70, 166, 255);" @click="showDetail(scope.row)">{{ scope.row.gname }}</a>
        </template>
      </el-table-column>
      <el-table-column label="组名详情" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.detail }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="所有用户">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name.join('，') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" plain circle @click="handleBatchEdit(scope.row)" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain circle @click="handleBatchDelete(scope.row)"
                     icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog :title="title" :visible.sync="dialogSearchVisible" style="text-align: left;" width="900px" top="50px" append-to-body>
      <div class="tab-pane-wrapper">
        <el-form ref="groupConfig" :model="groupConfig" :rules="rules" label-width="110px"
                 style="margin-right: 20px;margin-left: 20px">
              <el-form-item label="组名" min-width="100" prop="gname">
                <el-input v-model="groupConfig.gname" style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item label="组名详情" prop="detail">
                <el-input v-model="groupConfig.detail" style="width: 100%"></el-input>
              </el-form-item>
              <!-- <el-form-item label="备注">
                <el-input v-model="groupConfig.comment" style="width: 100%"></el-input>
              </el-form-item> -->
              <el-form-item label="权限" prop="list">
                  <el-tabs v-model="activeName1">
                    <el-tab-pane label="菜单权限" name="caidanxinxi">
                        <el-scrollbar class="el-scrollbar-x" style="height: 100%;">
                          <el-tree
                            ref="eltree"
                            :key="groupConfig.key"
                            :data="options"
                            show-checkbox
                            draggable
                            :default-checked-keys="groupConfig.list_check"
                            node-key="id"
                            :props="{value: 'name'}">
                          </el-tree>
                        </el-scrollbar>
                    </el-tab-pane>
                    <el-tab-pane label="角色管理" name="caozuoxinxi" style="overflow: visible">
                      <role-msg :role_list.sync="groupConfig.role_list" :options="{ name:'name' }" :list="listAll"></role-msg>
                    </el-tab-pane>
                  </el-tabs>
              </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('groupConfig')">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="dialogDetail" width="700px" append-to-body>
      <div class="detail-wrapper">
        <div class="el-tabs__nav-wrap is-top">
          <div class="el-tabs__nav-scroll">
            <div role="tablist" class="el-tabs__nav is-top">
              <div class="el-tabs__item is-top" style="margin-right: 100px">角色管理</div>
              <div class="el-tabs__item is-top">菜单权限</div>
            </div>
          </div>
        </div>
        <div class="detail-content">
            <div class="roles-content">
              <div v-if="!detailRowRoles || detailRowRoles.length < 1" class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
              <span v-for="tag in detailRowRoles" :key="tag.id"
                  class="el-tag el-tag--small el-tag--light">{{tag.name}}
              </span>
            </div>
            <div class="menu-content">
              <el-tree
              ref="filterTree"
              :data="options"
              default-expand-all
              :filter-node-method="filterNode"
              node-key="id"
              :props="{value: 'name'}">
            </el-tree>
            </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery"
  import roleMsg from './components/roleMsg'
  import {mapGetters} from 'vuex'
  import {fetchAuthUser} from '@/api/manage_monitor/manage'
  import {getGroupMenu, addGroupMenu, editGroupMenu, delGroupMenu, getAllRoles, getAllMenu} from '@/api/manage_monitor/route_menu'
  import {getdepartmentInfo2} from '@/api/zabbix/user_info'

  export default {
    components: {Pagination, roleMsg},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        userOptions: [],
        listQuery: {
          page: 1,
          limit: 20,
          gname: undefined,
          detail: undefined,
          status: undefined,
        },
        groupConfig: {
          gname: undefined, // 组名称
          menu_list: [], // 菜单列表id包含半选状态id(多个菜单id)
          list_check: [], // 菜单列表选中id(多个菜单id)
          role_list: [], // 按钮权限列表(多个权限按钮的id)
          status: undefined, // true启用,false禁用
          detail: undefined, // 组名描述
          // comment: undefined, // 备注
          id: '',
          list: undefined,
          key: undefined,
          // user_id: [],
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        listAll: [],
        list: [],
        total: 0,
        listLoading: true,
        activeName: 'ip',
        dialogSearchVisible: false,
        adminrole: false,
        rules: {
          list: [{required: true, message: '请选择权限', trigger: 'blur'}],
          gname: [{required: true, message: '请填写组名', trigger: 'blur'}],
          detail: [{required: true, message: '请填写组名详情', trigger: 'blur'}],
        },
        // activeName1: 'jichuxinxi',
        activeName1: 'caidanxinxi',
        title: '添加记录',
        dialogDetail: false,
        options: [],
        detailRowRoles: [],
      }
    },
    created() {
      this.getList()
      getAllRoles().then((res) => {
        this.listAll = res
      })
      .catch((e) => {
        console.error(e)
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
          this.options = fn(resData)
        })
        .catch((e) => {
          console.error(e)
        })
      this.adminrole = this.roles.includes('admin')
      // Promise.all([getdepartmentInfo2(), fetchAuthUser()]).then((res) => {
      //   const department = res[0].reduce((depLs, v) => {
      //     depLs.push({
      //       key: v.value, label: v.label
      //     })
      //     return depLs
      //   }, [])
      //   const user = res[1].reduce((userLs, v) => {
      //     userLs.push({
      //       key: v.id, label: v.first_name + '_' + v.email
      //     })
      //     return userLs
      //   }, [])
      //   this.userOptions = [...department, ...user]
      // })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          delGroupMenu(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
          .catch((e) => {
           console.error(e)
          })
        }, () => {
          return false
        })
      },
      handleBatchAdd() {
        this.title = '添加记录'
        this.groupConfig = this.$options.data().groupConfig
        this.groupConfig.key = Date.now()
        this.activeName1 = 'caidanxinxi'
        this.dialogSearchVisible = true
      },
      handleBatchEdit(row) {
        const item = {...row}
        const groupConfig = this.$options.data().groupConfig
        this.title = '修改记录'
        this.groupConfig = Object.assign({}, groupConfig, item)
        this.groupConfig.key = Date.now()
        this.activeName1 = 'caidanxinxi'
        this.dialogSearchVisible = true
      },
      edit(query) {
        editGroupMenu(query, query.id).then(response => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.dialogSearchVisible = false
          this.getList()
        }).catch(e => {
          console.error(e)
        })
      },
      retGroupConfig(){
        this.groupConfig.list = undefined
        const menu_list = this.getCheckedIds()
        const list_check = this.getCheckedIds1()
        const list = [...menu_list, ...this.groupConfig.role_list]
        if(list.length > 0) this.groupConfig.list = list
        const query = {...this.groupConfig}
        delete query.list
        delete query.key
        query.menu_list = JSON.stringify(menu_list)
        query.list_check = JSON.stringify(list_check)
        query.role_list = JSON.stringify(query.role_list)
        return query
      },
      add(query) {
        delete query.id
        addGroupMenu(query).then(response => {
          this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 3000
            })
          this.dialogSearchVisible = false
          this.getList()
        }).catch(e => {
          console.error(e)
        })
      },
      confirm() {
        const query = this.retGroupConfig()
        this.$refs.groupConfig.validate(valid => {
          if (valid) {
            if (this.title === '添加记录') this.add(query)
            if (this.title === '修改记录') this.edit(query)
          }
        })
      },
      getList() {
        this.listLoading = true
        getGroupMenu(this.listQuery).then(response => {
          this.list = response.results.reduce((list, i) => {
            const v = {...i}
            try {
              v.menu_list = v.menu_list && JSON.parse(v.menu_list)
              v.list_check = v.list_check && JSON.parse(v.list_check)
              v.role_list = v.role_list && JSON.parse(v.role_list)
            } catch {
              list.push(i)
              return list;
            }
            list.push(v)
            return list;
          }, [])
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      showDetail(row) {
        this.detailRowRoles = this.listAll.filter((v) => {
          return row.role_list.includes(v.id)
        })
        this.$nextTick(() => {
          this.$refs.filterTree.filter(row.menu_list)
        })
        this.dialogDetail = true
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          first_name: undefined,
          email: undefined,
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogSearchVisible = false;
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      filterNode(value, data) {
        if (!value) return true;
        return value.includes(data.id);
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
  .app-container {
    /deep/ .permission-alert {
      width: 320px;
      margin-top: 15px;
      background-color: #f0f9eb;
      color: #67c23a;
      padding: 8px 16px;
      border-radius: 4px;
      display: inline-block;
    }

    /deep/ .permission-sourceCode {
      margin-left: 15px;
    }

    /deep/ .permission-tag {
      background-color: #ecf5ff;
    }
  }

  .transfer /deep/ div.el-transfer-panel {
    width: 240px;
  }
  .transfer /deep/ label.el-checkbox {
    display: block;
  }
  /deep/ .tab-pane-wrapper {
    height: 568;
    .el-tab-pane {
      height: 400px;
      overflow-y: auto;
    }
  }
  .el-scrollbar-x /deep/ {
    .el-scrollbar__wrap {
        overflow-x: auto;
      }
  }
  .detail-wrapper {
    .detail-content {
      display: grid;
      grid-template-columns: 200px 1fr;
      min-height: 160px;
      .roles-content {
        padding: 20px 15px;
        .el-tag {
          margin: 0 5px 5px 0;
        }
      }
      .menu-content {
        position: relative;
        padding: 20px 15px;
        &:after {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          content: ' ';
          width: 2px;
          height: 100%;
          background: #dfe4ed;
        }
      }
    }
  }
</style>

