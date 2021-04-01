<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model="listQuery.name" style="width: 100%" filterable clearable placeholder="人员名称/部门名称"
                     @change="handleFilter">
            <el-option v-for="item in optionsAll" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.menu" placeholder="菜单组名称" style="width: 100%" filterable clearable
                     @change="handleFilter">
            <el-option v-for="item in menuGroupList" :key="item.id" :label="item.gname"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
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
      <!-- <el-table-column label="工号/部门编号" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="管理组">
        <template slot-scope="scope">
          <!-- <span>{{ String(scope.row.gname).replace(/\[|]\"/g,'') }}</span> -->
          <span>{{ scope.row.gname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" width="180px">
        <template slot-scope="scope">
          <!-- <el-button type="primary" plain circle @click="handleBatchEdit(scope.row)" icon="el-icon-edit"></el-button>
          <el-tooltip class="item" effect="dark" content="复制当前的权限" placement="top-start">
            <el-button type="primary" circle icon="el-icon-plus" plain @click="batchEdit(scope.row)"></el-button>
          </el-tooltip> -->
          <el-button type="danger" plain circle @click="handleBatchDelete(scope.row)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>
    <el-dialog :title="title" :visible.sync="dialogSearchVisible" style="text-align: left;" width="920px" append-to-body>
      <div style="width:835px;">
        <el-form ref="userConfig" :model="userConfig" :rules="rules" label-width="110px"
                 style="margin-right: 20px;margin-left: 20px">
          <el-form-item v-if="title !== '修改记录'" label="名称" min-width="100" prop="name">
            <el-button type="text">用户</el-button>
            <el-select style="width: calc(100% - 50px);margin-bottom: 10px;" v-model="userConfig.userNames" filterable clearable multiple>
              <el-option v-for="item in userOptions" :key="item.id" :label="'('+item.username+')'+item.first_name"
                        :value="item.username"></el-option>
            </el-select>
            <el-button type="text">部门</el-button>
            <el-select style="width: calc(100% - 50px)" v-model="userConfig.departmentNames" filterable clearable multiple>
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
            </el-select>
            <div style="padding: 10px 0 0 35px">
              <template v-if="userNames">
                <span style="margin: 0 10px 10px 0" v-for="tag in userNames" :key="tag.id"
                      class="el-tag el-tag--small el-tag--light">{{tag.first_name}}
                </span>
              </template>
              <template v-if='departmentNames'>
                <span style="margin: 0 10px 10px 0" v-for="tag in departmentNames" :key="tag.value"
                      class="el-tag el-tag--small el-tag--light">{{tag.label}}
                </span>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="组名" min-width="100" prop="menu">
            <jurisdiction-group ref='jurisdictionGroup' :list='menuGroupList' :menu.sync="userConfig.menu"></jurisdiction-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('userConfig')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery"
  import jurisdictionGroup from './components/jurisdiction_group'
  import {mapGetters} from 'vuex'
  import { fetchAuthUser, } from '@/api/manage_monitor/manage'
  import {
    getUserMenu,
    addUserMenu,
    editUserMenu,
    delUserMenu,
    getAllGroupMenu,
  } from '@/api/manage_monitor/route_menu'
  import {getdepartmentInfo2} from '@/api/zabbix/user_info'
  export default {
    name: 'DirectivePermission',
    components: {Pagination, jurisdictionGroup},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        userOptions: [],
        departmentOptions: [],
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          menu: undefined,
        },
        userConfig: {
          id: undefined,
          name: [], // 对应人员/部门
          userNames: [], // 对应人员
          departmentNames: [], // 对应部门
          menu: [], // 关联菜单组
          type: 1, // 1 用户 2 部门
          comments: undefined,
          status: undefined,
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        list: null,
        total: 0,
        listLoading: true,
        activeName: 'ip',
        dialogSearchVisible: false,
        adminrole: false,
        rules: {
          name: [{required: true, message: '请选择用户名', trigger: 'blur'}],
          menu: [{required: true, message: '请选择组名', trigger: 'blur'}],
        },
        title: '添加记录',
        menuGroupList: [],
        optionsAll: [],
      }
    },
    watch: {
      'userConfig.userNames'(val) {
        const departmentNames = this.userConfig.departmentNames || []
        this.userConfig.name = [...val, ...departmentNames]
      },
      'userConfig.departmentNames'(val) {
        const userNames = this.userConfig.userNames || []
        this.userConfig.name = [...userNames, ...val]
      },
    },
    created() {
      this.init()
    },
    computed: {
      ...mapGetters(['roles']),
      userNames() {
        return this.userOptions.filter((v) => {
          return this.userConfig.name.includes(v.username)
        })
      },
      departmentNames() {
        return this.departmentOptions.filter((v) => {
          return this.userConfig.name.includes(v.value)
        })
      }
    },
    methods: {
      init() {
        this.getList()
        this.adminrole = this.roles.includes('admin')
        Promise.all([fetchAuthUser(), getdepartmentInfo2()]).then((resAll) => {
          this.userOptions = resAll[0]
          this.departmentOptions = resAll[1]
          const user = resAll[0].reduce((list, v) => {
            list.push({label: `(${v.username})${v.first_name}`, value: v.username})
            return list;
          }, [])
          this.optionsAll = [].concat(user).concat(resAll[1])
        })
        .catch(e => {
          console.error(e)
        })
        getAllGroupMenu().then((res) => {
          const resData = [...res]
          resData.map((i) => {
            const v = {...i}
              try {
                i.menu = i.menu && JSON.parse(i.menu)
                i.role = i.role && JSON.parse(i.role)
              } catch {
                i = v
              }
          })
          this.menuGroupList = res;
        })
      },
      batchEdit(row){
        this.title = '新增记录'
        this.userConfig.name = []
        this.userConfig.menu = [row.menu]
        this.userConfig.type = row.type
        this.dialogSearchVisible=true
      },
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          delUserMenu(row.id).then(response => {
            this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleBatchEdit(row) {
        this.title = '修改记录'
        this.userConfig.name = [row.name]
        this.userConfig.menu = [row.menu]
        this.userConfig.type = row.type
        this.userConfig.id = row.id
        this.dialogSearchVisible = true
      },
      handleBatchAdd() {
        this.title = '新增记录'
        this.userConfig = this.$options.data().userConfig
        this.dialogSearchVisible = true
      },
      edit() {
        const query = this.retUserConfig()
        editUserMenu(query, query.id).then(res => {
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
      confirm() {
        this.$refs.userConfig.validate(valid => {
          if (valid) {
            if (this.title === '新增记录') this.doAdd()
            if (this.title === '修改记录') this.edit()
          }
        })
      },
      retUserConfig() {
        const query = { ...this.userConfig }
        delete query.userNames
        delete query.departmentNames
        query.menu = JSON.stringify(query.menu)
        query.name = JSON.stringify(query.name)
        return query
      },
      doAdd() {
        const query = this.retUserConfig()
        addUserMenu(query).then(res => {
          let type = 'success';
          if(res.failed !== 0) {
            type = 'warning'
          } else {
            type = 'success'
          }
          this.$notify({
              title: '成功',
              message: `成功${res.success}\n失败${res.failed}`,
              type: type,
              duration: 2000
            })
          this.dialogSearchVisible = false
          this.getList()
        }).catch(e => {
          console.error(e)
        })
      },
      getList() {
        this.listLoading = true
        getUserMenu(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = this.$options.data().listQuery
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.dialogSearchVisible = false
      }
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
    width: 250px;
  }
  .transfer /deep/ label.el-checkbox {
    display: block;
  }
  /deep/ .el-tabs__header {
    padding-left: 110px;
  }
</style>

