<template>
  <div class="app-container">
    <!-- <div class="filter-container"> -->
    <transition name="el-zoom-in-top">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <search-form :listQuerySearch.sync='listQuerySearch'>
          <template v-slot:content>
            <el-form-item>
              <!-- <el-cascader expand-trigger="hover" :options="projectOptions" v-model="listQuery.project_name_list"
                          change-on-select clearable filterable style="width:450px;" placeholder="请选择产品线或应用名"
                          @blur="handleFilter"></el-cascader> -->
              <el-cascader :options="projectOptions" v-model="listQuery.project_name_list" filterable clearable
                :props="{ checkStrictly: true, expandTrigger: 'hover' }" placeholder="请选择产品线或应用名" @change="handleFilter"
                style="width:300px;">
              </el-cascader>
            </el-form-item>
            <!-- <el-form-item>
              <el-select
                v-model="listQuery.app_name"
                filterable
                clearable
                remote
                reserve-keyword
                allow-create
                default-first-option
                placeholder="请输入应用名"
                :remote-method="remoteSearchMethod"
                popper-class="app-search-class"
                no-data-text='应用未找到'
                loading-text="查询中请稍等"
                :loading="loading"
                style="width:180px;"
                @change="appChange"
                @clear="appClear"
              >
                <el-option v-for="item in appnameOptionsP" :key="item.key" :label="item.display_name" :value="item"/>
              </el-select>
            </el-form-item> -->
            <el-form-item prop="cluster">
              <el-select v-model="listQuery.cluster" clearable filterable placeholder="集群信息" @change="handleFilter"
                style="width: 130px">
                <el-option v-for="item in resource_cluster" :key="item.value" :label="item.label" :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ip">
              <el-input v-model.trim="listQuery.server_ip" placeholder="IP地址" @keyup.enter.native="handleFilter"
                clearable style="width:150px;" class="filter-item" />
            </el-form-item>
            <el-form-item prop="env">
              <el-select v-model="listQuery.resource_env" clearable placeholder="环境类型" style="width:110px"
                @change="handleFilter">
                <el-option v-for="item in envList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="listQuery.status" clearable placeholder="状态" style="width:95px"
                @change="handleFilter">
                <el-option v-for="item in rsStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="other_page" clearable placeholder="其它页面数据" style="width:200px" @change="handleFilter"
                multiple>
                <el-option v-for="item in other_page_options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable
                style="width:130px" class="filter-item"></el-input>
            </el-form-item>
          </template>
          <template v-slot:trigger>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.app_name" placeholder="产品线/应用名" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.os_version" placeholder="系统版本" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.cpu" placeholder="CPU" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.memory" placeholder="内存" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.disk" placeholder="容量" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.app_owner" placeholder="负责/维护人" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-date-picker v-model.trim="listQuery.update_time" type="datetime" placeholder="更新时间"
                default-time="12:00:00" style="width: 100%;">
              </el-date-picker>
            </form-item>
          </template>
          <template v-slot:search>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
              @click="handleReset">
              重置
            </el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleBatchSearch">
              批量查询
            </el-button>
          </template>
          <template v-slot:fr>
            <el-form-item class="fr" style="margin-right:-2px;">
              <el-button v-if="host_manager_role" type="danger" icon="el-icon-delete" @click="handleDelete">删除报废
              </el-button>
              <!-- <el-button v-if="adminrole" type="primary" plain icon="el-icon-download" @click="downloadXLSX = true" :loading="downloadLoading" style="display:inline;">导出</el-button> -->
              <el-button type="primary" plain icon="el-icon-download" @click="downloadXLSX = true"
                :loading="downloadLoading" style="display:inline;">导出</el-button>
            </el-form-item>
          </template>
        </search-form>

      </el-form>
    </transition>
    <!-- </div> -->

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="ID" prop="id" sortable align="center" width="80">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.id }}</span> -->
          <el-tooltip class="item" effect="dark"
            :content="getTableTooltip(scope.row.app_rm, scope.row.app_rm2, scope.row.change_user_name)" placement="top">
            <span>{{ scope.row.id }}
              <div v-if="scope.row.app_rm" style="color: #8492a6;font-size:10px;">发布管理</div>
              <div v-if="scope.row.app_rm2" style="color: #8492a6;font-size:10px;">多应用</div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品线名称" min-width="135px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>
            {{ scope.row.subsystem_name}}
            <div style="color: #8492a6; font-size: 10px">{{scope.row.project_name}}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="应用名/应用中文名/类型" min-width="170px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="appFilter(scope.row.pd_fullname2, scope.row.app)">{{ scope.row.app_name
            }}</a>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.app_cname}} {{scope.row.app_type}}</div>
          <!-- <div style="color: #8492a6; font-size: 10px">{{scope.row.app_type}}</div> -->
        </template>
      </el-table-column>
      <el-table-column label="IP/主机名" width="125px" prop="ip" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.host_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Vcenter/宿主机" width="130px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span> V:{{ scope.row.datacenter }}</span>
          <div style="color: #8492a6; font-size: 10px">M:{{ scope.row.parent_ip}}</div>
        </template>
      </el-table-column>
      <el-table-column label="集群/池" width="85px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.cluster }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.pool_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="系统版本" width="110px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.os_version }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.os_type_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="CPU" width="80px" prop="cpu" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存" width="80px" prop="memory" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}G</span>
        </template>
      </el-table-column>
      <el-table-column label="容量" width="80px" prop="disk" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.disk }}G</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.disk_type}}</div>
        </template>
      </el-table-column>
      <el-table-column label="环境" width="80px" prop="resource_env_name" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.resource_env_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px" prop="status" sortable>
        <template slot-scope="scope">
          <!-- <el-tag v-if="scope.row.status==1" type="success">{{ scope.row.status_name }}</el-tag>
          <el-tag v-else-if="scope.row.status==2" type="warning">{{ scope.row.status_name }}</el-tag>
          <el-tag v-else-if="scope.row.status==5" type="info">{{ scope.row.status_name }}</el-tag>
          <el-tag v-else>{{ scope.row.status_name }}</el-tag> -->
          <el-tag v-if="scope.row.status==1" type="success" class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
          <el-tag v-else-if="scope.row.status==2" type="warning" class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
          <el-tag v-else-if="scope.row.status==5" type="info" class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
          <el-tag v-else class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责/维护人" width="130px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.app_owner }}</span>
          <div style="color: #8492a6; font-size: 10px"><span v-for="(site,index) in scope.row.maintain_user_name"
              :key="index">{{ site }} </span></div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间/备注" width="135px" :show-overflow-tooltip="true" prop="update_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.comments }}</div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      :pageSizes.sync="pageSizes" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />

    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" :close-on-click-modal="false" width="45%"
      @open="dialogOpen">
      <template>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="IP地址" name="ip">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-input v-model="listQuery.ip_list" type="textarea" :rows="15" placeholder="请输入IP列表,以逗号或者回车分隔" />
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
          <el-tab-pane label="主机名" name="hostname">
            <el-row>
              <el-col :span="24">
                <el-input v-model="listQuery.hostname_list" type="textarea" :rows="15"
                  placeholder="请输入主机名列表,以逗号或者回车分隔" />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量删除报废虚机" :visible.sync="dialogDeleteVisible" :close-on-click-modal="false" width="45%">
      <div v-if="scrapVMs.length!=0" v-loading="deleteLoading" :data="scrapVMs">
        <div style="margin-bottom:10px;color:#8492a6;font-size:15px;">当前报废主机共: {{ scrapVMs.length }} 个.</div>
        <el-tag v-for="(item,index) in scrapVMs" :key="index" style="margin-right:10px;margin-bottom:10px;">{{ item }}
        </el-tag>
      </div>
      <div v-else>
        当前没有要删除的报废主机!
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogDeleteVisible=false">取 消</el-button>
        <el-button type="primary" v-if="scrapVMs.length!=0 && host_manager_role" @click="onHandleDelete">确定删除
        </el-button>
      </span>
    </el-dialog>

    <download-header :checks="checks" :visible.sync="downloadXLSX" :onDownLoad="handleDownload"
      :onExport="handleExport" />
  </div>
</template>

<script>
  import { fetchList, fetchAppList, getScrapVM, handleDeleteVM, exportList } from '@/api/cmdbs/server'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import SearchForm from '@/components/SearchForm'
  import FormItem from '@/components/SearchForm/FormItem'
  import { getProductAppCascader } from '@/api/cmdbs/product_line'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import { validIp } from '@/utils/validate'
  import { getClusterList, exportIsready, exportFile } from '@/api/cmdbs/resourcemanage'
  import { renv, rsStatus, rsType, envList, ip_type } from '@/api/static'
  import { mapGetters } from 'vuex'
  import DownloadHeader from '@/components/DownloadHeader'
  import { setInterval, clearInterval } from 'timers';
  import { parseTime } from '@/utils'

  export default {
    name: 'ServerList',
    components: { Pagination, DownloadHeader, SearchForm, FormItem },
    directives: { waves },
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
      const validateIpaddress = (rule, value, callback) => {
        if (value) {
          if (validIp(value)) {
            callback()
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      }
      return {
        checks: {
          checkList: ['id', 'project_name', 'app_name', 'app_type', 'ip', 'host_name', 'datacenter', 'parent_ip',
            'cluster', 'pool_name', 'os_type_name', 'os_version', 'cpu', 'memory', 'disk', 'resource_env_name', 'status_name', 'is_ping_name',
            'app_owner', 'update_time', 'comments'],
          list: [
            { key: 'id', label: 'ID' },
            { key: 'project_name', label: '产品线' },
            { key: 'app_name', label: '应用' },
            { key: 'app_type', label: '应用类型' },
            { key: 'app_owner', label: '负责人' },
            { key: 'ip', label: 'IP' },
            { key: 'host_name', label: '主机名' },
            { key: 'datacenter', label: 'Vcenter' },
            { key: 'parent_ip', label: '宿主机' },
            { key: 'cluster', label: '集群' },
            { key: 'pool_name', label: '池' },
            { key: 'os_type_name', label: '操作系统类型' },
            { key: 'os_version', label: '操作系统版本' },
            { key: 'cpu', label: 'CPU个数' },
            { key: 'memory', label: '内存' },
            { key: 'disk', label: '磁盘' },
            { key: 'resource_env_name', label: '服务器环境' },
            { key: 'status_name', label: '状态' },
            { key: 'is_ping_name', label: '能否ping通' },
            { key: 'update_time', label: '更新时间' },
            { key: 'comments', label: '备注' },
          ]
        },
        downloadXLSX: false,
        rsStatus: rsStatus,
        envList: renv,
        resource_cluster: [],
        projectOptions: [],
        pageSizes: [20, 50, 100, 150],
        other_page_options: [{ 'label': '多应用', 'value': 1 }, { 'label': '发布管理', 'value': 2 }],
        listQuery: {
          page: 1,
          limit: 20,
          project_name_list: [],
          app_name: undefined,
          cluster: undefined,
          server_ip: undefined,
          resource_env: undefined,
          status: undefined,
          search: undefined,
          ip_list: undefined,
          hostname_list: undefined,
          // other_page: [1, 2],
          app_name: undefined,
          os_version: undefined,
          cpu: undefined,
          memory: undefined,
          disk: undefined,
          app_owner: undefined,
          update_time: undefined,
        },
        other_page: [1, 2],
        batchSearchForm: {
          ip_list: '',
          hostname_list: '',
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
        rules: {
          ip: [
            {
              message: '请输入正确的IP地址',
              trigger: 'blur',
              validator: validateIpaddress,
            },
          ],
        },

        adminrole: false,
        host_manager_role: false,

        scrapVMs: [],
        scrapVMsObj: [],
        dialogDeleteVisible: false,
        deleteLoading: false,

        downloadLoading: false,
        filename: '虚机管理导出',
        autoWidth: true,
        bookType: 'xlsx',
        listQuerySearch: false,
      }
    },
    created() {
      this.getList()

      // this.getAppList()

      getProductAppCascader().then(response => {
        this.projectOptions = response
      })

      getClusterList()
        .then(response => {
          this.resource_cluster = response
        })
        .catch(error => {
          this.$message({
            message: '数据不存在！',
          })
        })

      if (this.$route.query.vip) {
        this.listQuery.server_ip = this.$route.query.vip
      }
      if (this.$route.query.app) {
        this.listQuery.app = this.$route.query.app
      }

      this.adminrole = this.roles.includes('cmdb_admin')
      this.host_manager_role = this.roles.includes('host_manager')

    },

    computed: {
      ...mapGetters(['roles', 'name']),
    },

    methods: {
      getList() {
        // console.log(this.listQuery.project_name_list)
        this.listLoading = true
        let queryParams = Object.assign(this.listQuery, { other_page: this.other_page })
        fetchList(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      handleFilter(listQuery) {
        this.clearBatchTextSearch()
        // console.log(this.listQuery.project_name_list)
        this.listQuery.page = 1
        this.listQuery.limit = 20
        // this.listQuery.app_name = undefined
        // if (this.listQuery.project_name_list) {
        //       if (this.listQuery.project_name_list.length == 1) {
        //         this.listQuery.project_name = this.listQuery.project_name_list[0]
        //       } else if (this.listQuery.project_name_list.length == 2) {
        //         this.listQuery.project_name = this.listQuery.project_name_list[1]
        //       }
        // }
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
          project_name_list: [],
          app_name: undefined,
          cluster: undefined,
          server_ip: undefined,
          resource_env: undefined,
          status: undefined,
          search: undefined,
          ip_list: undefined,
          hostname_list: undefined,
          // other_page: [1, 2]
        }
      },

      appFilter(pd_fullname2, app) {
        // this.clearBatchTextSearch()
        // // this.appnameOptionsP=[{'key':app, 'display_name':app_name}]
        // this.listQuery.app_name = app_name
        // this.listQuery.project_name_list = undefined
        let tmp = pd_fullname2.split('^')
        this.listQuery = Object.assign({ other_page: this.other_page }, this.$options.data().listQuery, {
          page: 1,
          limit: 20,
          project_name_list: [tmp[0] + '-' + tmp[1], tmp[2], tmp[3], app]
        })
        // console.log(this.listQuery.project_name_list)
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
        this.resetlistQuery()
        this.dialogSearchVisible = true
      },
      onSubmitDialogButton() {
        if (this.listQuery.ip_list) {
          let len = this.listQuery.ip_list.split(/[,;\/\-|\s]+/).length
          if (len > 500) {
            this.$message({
              message: '查询条目数不能超过500个 ! 当前已经 ' + len + '个 !',
              type: 'warning',
            })
            return false
          }
          this.listQuery.ip_list = this.listQuery.ip_list.split('\n').join()
          this.listQuery.ip_list = this.listQuery.ip_list
            .replace(/[\r\n]/g, '')
            .replace(/\s/g, '').replace(/\'/g, '').replace(/\"/g, '')
        }
        if (this.listQuery.hostname_list) {
          let len = this.listQuery.hostname_list.split(/[,;\/\-|\s]+/).length
          if (len > 500) {
            this.$message({
              message: '查询条目数不能超过500个 ! 当前已经 ' + len + '个 !',
              type: 'warning',
            })
            return false
          }
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
      renderline() {
        this.$refs.mychild.render(this.historySearch)
      },
      handleClose() {
        this.activeName = null
        this.$refs.mychild.timers()
        this.resetTemp()
      },

      // remoteSearchMethod(query) {
      //   if (query !== '') {
      //     this.loading = true
      //     setTimeout(() => {
      //       this.loading = false
      //       this.appnameOptionsP = this.appnameOptions.filter(item => {
      //         return (
      //           item.display_name.toLowerCase().indexOf(query.toLowerCase()) > -1
      //         )
      //       })
      //     }, 200)
      //   } else {
      //     this.appnameOptionsP = []
      //     this.listQuery.app_name=query;
      //   }
      // },
      // handleClick(tab, event) {
      //   console.info('sfsf')
      // },

      // getAppList() {
      //   fetchAppList().then(response => {
      //     const appnameOptions = []
      //     for (const i of response) {
      //       appnameOptions.push({
      //         display_name: i.app_name,
      //         key: i.id,
      //       })
      //     }
      //     this.appnameOptions = appnameOptions
      //   })
      // },

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

      // appChange(e){
      //   if (typeof(e) === 'object') {
      //     this.listQuery.app_name=e['display_name']
      //     this.listQuery.app=e['key']
      //   }else if (typeof(e) === 'string'){
      //     this.listQuery.app_name=e
      //     this.listQuery.app=undefined
      //   }
      // },
      // appClear(){
      //   this.listQuery.app_name=undefined
      //   this.getList()
      // },

      handleDelete() {
        // this.scrapVMs = []
        this.dialogDeleteVisible = true

        getScrapVM().then(response => {
          this.deleteLoading = true
          this.scrapVMs = []
          this.scrapVMsObj = response
          for (let item of this.scrapVMsObj) {
            this.scrapVMs.push(item.ip)
          }
          this.deleteLoading = false
        })

        // setTimeout(() => {
        //   this.deleteLoading = false;
        // }, 2000);

      },

      onHandleDelete() {
        let lst = []
        for (let item of this.scrapVMsObj) {
          lst.push(item.id)
        }
        handleDeleteVM({ ids: lst }).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
        })
        this.dialogDeleteVisible = false
        this.getList()
      },

      handleDownload(headers) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = headers.tHeader;
          const filterVal = headers.filterVal;
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },

      getTableTooltip(app_rm, app_rm2, change_user_name) {
        if (app_rm) {
          return '发布管理页面数据'
        } else if (app_rm2) {
          return '多应用管理页面数据'
        } else {
          return change_user_name
        }
      },

      downloadFile(data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        let fileName = `虚机查询(导出全部)_${parseTime(new Date())}.xls`;
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      },
      async handleExport(headers) {
        return new Promise((resolve, reject) => {
          let msg = '仅导出资源管理表数据 (多应用表&发布管理表数据不导出)\n 确认导出 ?'
          // let msg = ''
          // if (this.total > 3000) {
          //   msg = '当前有 '+this.total+' 条记录, 数据量过大, 请耐心等待...'
          // } else {
          //   msg = '当前有 '+this.total+' 条记录, 确认导出 ?'
          // }
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.listQuery['header'] = headers.filterVal.join()
            this.listQuery['header_data'] = headers.tHeader.join()

            // exportList(this.listQuery).then(response => {
            //   this.downloadFile(response)
            // })
            let queryParams = Object.assign(this.listQuery, { other_page: this.other_page })
            exportList(queryParams).then(response => {
              let fp = response.fp
              let interval_fun = undefined
              if (fp) {
                interval_fun = setInterval(() => {
                  exportIsready({ 'fp': fp }).then(response => {
                    if (response.status == 1) {
                      exportFile({ 'fp': fp }).then(response => {
                        this.downloadFile(response)
                        interval_fun = clearInterval(interval_fun)
                        this.$message({
                          message: '导出成功! ',
                          type: 'success'
                        })
                        resolve()
                      })
                    } else {
                      this.$message({
                        message: '虚机查询-导出全部-后台处理中...',
                        duration: 2500
                      })
                    }
                  })
                }, 3000)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消导出'
            });
          });
        })
          .catch((e) => {
            console.error(e)
          })
      },

    },
  }
</script>

<style lang="scss" scoped>
  .app-search-class {
    max-width: 500px;
  }

  /deep/ .tag-line {
    line-height: 1.5;
    height: auto;
    padding-top: 3px;
    padding-bottom: 3px;
  }
</style>