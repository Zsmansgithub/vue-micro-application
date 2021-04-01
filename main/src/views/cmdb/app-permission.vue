<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-cascader expand-trigger="hover" :options="projectOptions" v-model="listQuery.project_name_list"
                       change-on-select clearable filterable style="width:280px;" placeholder="请选择产品线名称"
                       @change="handleFilter"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.app_name"
            placeholder="请输入应用名"
            filterable
            clearable
            style="width: 280px"
            remote
            allow-create
            reserve-keyword
            :remote-method="remoteSearchMethod"
            popper-class="app-search-class"
            no-data-text='应用未找到'
            loading-text="查询中请稍等"
            :loading="loading"
            @change="appChange"
          >
            <el-option
              v-for="item in appnameOptionsP"
              :key="item.key"
              :label="item.display_name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div v-if="select == 'uuid'">
            <el-button type="text" @click="select='ouid'">用户<i class="el-icon-caret-bottom "></i></el-button>
            <el-select
              v-model="listQuery.name"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入审批人工号/姓名"
              popper-class="app-search-class"
            >
              <el-option
                v-for="item in OptionsUserList"
                :key="item.value"
                :label="'('+item.value+')'+item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-else-if="select == 'ouid'">
            <el-button type="text" @click="select='uuid'">部门<i class="el-icon-caret-bottom"></i></el-button>
            <el-select
              v-model="listQuery.name"
              filterable
              clearable
              reserve-keyword
              placeholder="请输入审批部门名称"
              popper-class="app-search-class"
            >
              <el-option
                v-for="item in OptionsD"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>


        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="handleReset"
        >
          重置
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogAddVisible=true">
          新增信息
        </el-button>

        <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="batchDelete">
          批量删除
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @selection-change="selectChanges">
      <el-table-column type="selection" width="35" align="center"></el-table-column>
      <el-table-column label="ID" prop="id" sortable align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品线名称" min-width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>
            {{scope.row.project_name}}_{{ scope.row.subsystem_name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="应用/用途" min-width="150px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="appFilter(scope.row.app, scope.row.app_name)">{{ scope.row.app_name
            }}_{{scope.row.app_type}}</a>

        </template>
      </el-table-column>
      <el-table-column label="用户名称" min-width="100px" prop="ip" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.cname  }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.host_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新人员" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135px" :show-overflow-tooltip="true" prop="update_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="55px">
        <template slot-scope="scope">
          <el-button icon="el-icon-delete" type="danger" plain circle @click="deleteRowH(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>
    <el-dialog title="新增权限" :visible.sync="dialogAddVisible" :close-on-click-modal="false"
               width="35%" @open="dialogOpen">
      <template>
        <el-form  :model="addpForm" ref="addpermissionform">
          <el-row>
            <el-form-item required>
              <el-col :span="20">
                <div v-if="select == 'uuid'">
                  <el-button type="text" @click="select='ouid'">用户<i class="el-icon-caret-bottom "></i></el-button>
                  <el-select
                    v-model="userName"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请输入审批人工号/姓名"
                    popper-class="app-search-class"
                  >
                    <el-option
                      v-for="item in OptionsUserList"
                      :key="item.value"
                      :label="'('+item.value+')'+item.label"
                      :value="item"
                    />
                  </el-select>
                  <el-button type="primary" icon="el-icon-plus" @click="addUser"></el-button>
                </div>
                <div v-else-if="select == 'ouid'">
                  <el-button type="text" @click="select='uuid'">部门<i class="el-icon-caret-bottom"></i></el-button>
                  <el-select
                    v-model="userName"
                    filterable
                    clearable
                    reserve-keyword
                    placeholder="请输入审批部门名称"
                    popper-class="app-search-class"
                  >
                    <el-option
                      v-for="item in OptionsD"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    />
                  </el-select>
                  <el-button type="primary" icon="el-icon-plus" @click="addUser"></el-button>
                </div>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="addPermissonMethods">确 定</el-button>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-tag
                v-for="(tag, index) in addUserList"
                closable
                :disable-transitions="false"
                @close="addUserList.splice(index, 1)"
              >
                {{ tag[2] }}
              </el-tag>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-input placeholder="输入关键字进行过滤"  v-model="filterText">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-tree
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              node-key="id"
              accordion
              show-checkbox
              :default-expanded-keys="[2]"
              :filter-node-method="filterNode"
              @node-click="check_get"
              ref="tree2">
            </el-tree>
          </el-row>
        </el-form>
      </template>
    </el-dialog>
    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" :close-on-click-modal="false"
               width="45%" @open="dialogOpen">
      <template>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="IP地址" name="ip">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-input
                    v-model="listQuery.ip_list"
                    type="textarea"
                    :rows="15"
                    placeholder="请输入IP列表,以逗号或者回车分隔：10.1.1.1,10.2.3.2"
                  />
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
          <el-tab-pane label="主机名" name="hostname">
            <el-row>
              <el-col :span="24">
                <el-input
                  v-model="listQuery.hostname_list"
                  type="textarea"
                  :rows="15"
                  placeholder="请输入主机名列表,以逗号或者回车分隔：vm222,vm2111"
                />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogSearchVisible = false;">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, fetchAppList} from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'
  import {getUserInfo,getdepartmentInfo2} from '@/api/zabbix/user_info'
  import {createAppPermission, getAppPermission, deleteAppp, getProjectTreeList} from '@/api/cmdbs/app_permission'
  import { getProductCascader } from '@/api/cmdbs/product_line'
  export default {
    name: 'AppPermission',
    components: {Pagination},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    mixins: [resize, sessionListQuery],
    data() {
      return {
        select: "uuid",
        OptionsUserList:[],
        multipleSelection:[],
        OptionsD:[],
        options:[],
        cascader_list:[],
        userName:undefined,
        addUserList:[],
        resource_cluster: [],
        dialogAddVisible: false,
        projectOptions: [],
        listQuery: {
          page: 1,
          limit: 20,
          app: undefined,
          server_ip: undefined,
          ip_list: undefined,
          hostname_list: undefined,
        },
        historySearch: {
          id: undefined,
          timestamp: '',
        },
        list: null,
        total: 0,
        listLoading: true,
        loading: false,
        activeName: 'ip',
        appnameOptions: [],
        appnameOptionsP: [],
        dialogFormVisible: false,
        dialogSearchVisible: false,
        dialogStatus: '',
        filterText: '',
        data: [],
        addpForm:{},
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.getList()
      this.getAppList()
      getUserInfo().then(response => {
        this.OptionsUserList = response
      })
      getdepartmentInfo2().then(response => {
      this.OptionsD = response
      })
      getProductCascader().then(response => {
          this.projectOptions = response
      })
      getProjectTreeList().then(response => {
        this.data=response
      })
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      check_get(sss,ss,s) {
        debugger
      },

      addUser(){
        if (this.addUserList.toString().indexOf([this.select,this.userName.value,this.userName.label].toString()) == -1) {
          this.addUserList.push([this.select,this.userName.value,this.userName.label])
        }
      },
      addPermissonMethods() {
        let app_list=this.$refs.tree2.getCheckedNodes(true,false);
        this.$refs['addpermissionform'].validate((valid)=> {
          createAppPermission({"user_list":this.addUserList,"app_list":app_list, 'type':this.select}).then(response => {
          console.log(response)
          this.dialogAddVisible=false
          this.getList()
          })
        });

      },
      deleteRowH(row) {
        this.$confirm('确定要删除信息吗?', '提示', this.confirmOptions).then(() => {
          this.deleteRow(row)
        })
      },
      deleteRow(row) {
        deleteAppp(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
           this.getList()
          }).catch(response => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'danger',
              duration: 3000
            })
          })
      },
      sleep(ms) {
          return new Promise(function(resolve, reject) {
              setTimeout(resolve,ms);
          })
      },
      async handle(){
        for (let row of this.multipleSelection) {
          await this.sleep(1)
          this.deleteRow(row)
          // console.log("BBB")
        }
        this.getList()
      },
      batchDelete(){
        let list = this.multipleSelection.join()
        let msg = '确定要删除信息吗?';
        var del_count = 0;
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            this.handle()
        }).then(() => {
            this.getList()
          }
        )
      },
      selectChanges(val){
        this.multipleSelection = val;
      },
      getCascader() {
      getProductCascader().then(response => {
        this.options = response
      })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      clearBatchTextSearch() {
        // 清空批量搜索textarea内容
        this.listQuery.ip_list = undefined
        this.listQuery.hostname_list = undefined
      },
      handleBatchSearch() {
        // 打开批量搜索框
        this.clearBatchTextSearch()
        this.dialogSearchVisible = true
      },
      onSubmitDialogButton() {
        if (this.listQuery.ip_list) {
          this.listQuery.ip_list = this.listQuery.ip_list.split('\n').join()
          this.listQuery.ip_list = this.listQuery.ip_list
            .replace(/[\r\n]/g, '')
            .replace(/\s/g, '').replace(/\'/g, '').replace(/\"/g, '')
        }
        if (this.listQuery.hostname_list) {
          this.listQuery.hostname_list = this.listQuery.hostname_list
            .split('\n')
            .join()
          this.listQuery.hostname_list = this.listQuery.hostname_list
            .replace(/[\r\n]/g, '')
            .replace(/\s/g, '').replace(/\'/g, '').replace(/\"/g, '')
        }
        this.getList()
        this.dialogSearchVisible = false
      },
      remoteSearchMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.appnameOptionsP = this.appnameOptions.filter(item => {
              return (
                item.display_name.toLowerCase().indexOf(query.toLowerCase()) > -1
              )
            })
          }, 200)
        } else {
          this.appnameOptionsP = []
        }
      },
      handleClick(tab, event) {
        console.info('sfsf')
      },
      getList() {
        this.listLoading = true
        getAppPermission(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getAppList() {
        fetchAppList().then(response => {
          const appnameOptions = []
          for (const i of response) {
            appnameOptions.push({
              display_name: i.app_name,
              key: i.id,
            })
          }
          this.appnameOptions = appnameOptions
        })
      },
      handleFilter(listQuery) {
        this.clearBatchTextSearch()
        this.listQuery.page = 1
        this.$refs['listQuery'].validate(valid => {
          if (valid) {
            this.getList()
          }
        })
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          app: undefined,
          server_ip: undefined,
          ip_list: undefined,
          hostname_list: undefined,
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleShowHistory(row) {
        this.historySearch = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      dialogOpen() {
        this.resetlistQuery()
        this.activeName = 'ip'
      },
      appFilter(app, app_name) {
        this.clearBatchTextSearch()
        this.appnameOptionsP = [{'key': app, 'display_name': app_name}]
        this.listQuery = {
          page: 1,
          limit: 20,
          app_id: app,
        }
        this.getList()
      },
      appChange(e) {
        if (typeof (e) === 'object') {
          this.listQuery.app_name = e['display_name']
          this.listQuery.app = e['key']
        } else if (typeof (e) === 'string') {
          this.listQuery.app_name = e
          this.listQuery.app = undefined
        }
      }
    },
  }
</script>
<style scoped>
  .app-search-class {
    max-width: 500px;
  }
</style>
