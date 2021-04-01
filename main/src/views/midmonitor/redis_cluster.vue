<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.project_name" placeholder="产品线名称"  @change="handleFilter" clearable filterable>
          <el-option v-for="(item, index) in all_project_name" :key="index" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.cluster_type" placeholder="集群类型"  @change="handleFilter" clearable style="width:150px">
          <el-option v-for="item in redisclustertype" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.user_type" placeholder="使用类型"  @change="handleFilter" clearable style="width:150px">
          <el-option v-for="item in usertype" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="listQuery.cluster_cname" placeholder="集群名" clearable @keyup.enter.native="handleFilter" style="width:150px"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.user_name_filter" placeholder="负责人" filterable clearable @change="handleFilter" style="width:150px;">
          <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="listQuery.ip_port" placeholder="IP:PORT" clearable @change="handleFilter" @keyup.native.enter="handleFilter" style="width:250px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.user_name2" placeholder="负责人2" filterable clearable @change="handleFilter" style="width:150px;">
          <el-option v-for="item in userInfoOptions2" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="adminrole" type="warning" icon="el-icon-delete" @click="handleDeleteNullCluster">删空集群</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      ref="table"
      :data="tableList"
      border
      :row-class-name="tableRowClassName"
      highlight-current-row
      @row-click="toggleRowExpansion"
      style="width:100%"
    >
      <el-table-column type="expand" width="30px">
        <template slot-scope="scope1">
          <el-table :data="scope1.row.instances.instances" class="nestedtable" :header-cell-style="{background:'#eef1f6',color:'#606266'}" stripe highlight-current-row border size="mini">
            <!-- <el-table-column v-if="false" prop="id" label="id" align="center"/> -->
            <el-table-column label="状态" align="center" min-width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status==0" size="mini" type="success">监控中</el-button>
                <el-button v-else-if="scope.row.status==1" size="mini" type="danger">异常中</el-button>
                <el-button v-else size="mini" type="warning">未监控</el-button>
              </template>
            </el-table-column>
            <el-table-column label="IP:PORT" align="center" min-width="120">
              <template slot-scope="scope">
                <a style="color:#1890ff" @click="handleInstance(scope.row)">{{ scope.row.instance_type+' '+scope.row.ip+':'+ scope.row.port }}</a>
              </template>
            </el-table-column>
            <el-table-column v-if="scope1.row.cluster_type!='sentinel'" prop="used_memory" label="使用内存" :formatter="format1024Nested" align="center" width="80"/>
            <el-table-column v-if="scope1.row.cluster_type!='sentinel'" prop="max_memory" label="分配内存" :formatter="format1024Nested" align="center" width="80"/>
            <el-table-column prop="used_cpu_user" label="CPU" align="center" width="80">
              <template slot-scope="scope">
                <span>{{ Math.round(scope.row.used_cpu_sys+scope.row.used_cpu_user) }}%</span>
                <!-- <span>{{ scope.row.used_cpu_sys+scope.row.used_cpu_user | reservedTwo }}%</span> -->
                <el-tooltip class="item" effect="light" content="User/Sys"  placement="top" >
                <div style="color: #8492a6; font-size: 10px">{{ Math.round(scope.row.used_cpu_user) }}/{{ Math.round(scope.row.used_cpu_sys) }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="入/出流量(k)" align="center" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.instantaneous_input_kbps+' / '+scope.row.instantaneous_output_kbps }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前连接数/最大连接数" align="center" width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.connected_clients +' / '+ scope.row.max_clients }}</span>
                <el-tooltip class="item" effect="light" content="接收连接数/拒绝连接数" placement="top" >
                  <div style="color: #8492a6; font-size: 10px">{{ scope.row.connected_received +' / '+ scope.row.rejected_connections  }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
                  <el-table-column label="执行命令数" align="center" width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.total_commands_processed }}</span>
              </template>
            </el-table-column>
            <el-table-column label="使用率/碎片率" align="center" width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.mem_used+'% / '+scope.row.mem_fragmentation_ratio + '%' }}</span>
                <el-tooltip class="item" effect="light" content="峰值内存/最大内存"  placement="top" >
                <div style="color: #8492a6; font-size: 10px">{{ scope.row.used_memory_peak_human+' / '+scope.row.maxmemory_human }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="命中率" align="center" width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.keyspace_misses ? Math.round(scope.row.keyspace_hits*100/(scope.row.keyspace_hits+scope.row.keyspace_misses)) : '100%' }}</span>
                  <div style="color: #8492a6; font-size: 10px">{{ scope.row.keyspace_hits +' / '+scope.row.keyspace_misses }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Key/过期数量" align="center" width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.keys +' / '+scope.row.expires }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剔除/过期数" align="center" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.evicted_keys +' / '+ scope.row.expired_keys }}</span>
              </template>
            </el-table-column>
            <el-table-column label="监控时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.create_time }}</span>
                <div style="color: #8492a6; font-size: 10px">运行{{ scope.row.uptime }}天</div>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="scope1.row.cluster_type=='sentinel'">
            <br>
            <el-table :data="scope1.row.instances.sentinel_masters" :header-cell-style="{background:'#eef1f6',color:'#606266'}" stripe highlight-current-row border size="mini">
              <el-table-column label="Sentinel监控名" align="center" min-width="90">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="集群名/产品线名称" align="center" min-width="100" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-if="scope.row.cluster_cname == 'null'">{{ scope.row.cluster_name }}</span>
                  <span v-else-if="scope.row.cluster_cname !== ''">{{ scope.row.cluster_cname }}</span>
                  <span v-else>{{ scope.row.cluster_name }}</span>
                  <div style="color:#8492a6;font-size:10px" v-if="scope.row.project_name=='null'">未设置</div>
                  <div style="color:#8492a6;font-size:10px" v-else>{{ scope.row.project_name }}</div>
                </template>
              </el-table-column>
              <el-table-column label="负责人" align="center" width="120">
                <template slot-scope="scope">
                  <span v-for="(site,index) in scope.row.user_name_list" :key="index">{{ site }} </span>
                </template>
              </el-table-column>
              <el-table-column label="主从实例" align="center" min-width="150">
                <template slot-scope="scope">
                  <!-- <pre>{{ scope.row.instances }}</pre> -->
                  <div v-if="scope.row.master_ins!=''">
                    <a style="color:#1890ff" @click="handleInstance2(scope.row.master_ins)">master_{{ scope.row.master_ins }}</a>
                  </div>
                  <div v-if="scope.row.slave_ins!=''">
                    <a style="color:#1890ff" @click="handleInstance2(scope.row.slave_ins)">slave_{{ scope.row.slave_ins }}</a>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="集群名/产品线名称" prop="project_name" min-width="180" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.cluster_cname == 'null'">{{ scope.row.cluster_name }}</span>
          <span v-else-if="scope.row.cluster_cname !== ''">{{ scope.row.cluster_cname }}</span>
          <span v-else>{{ scope.row.cluster_name }}</span>
          <div style="color:#8492a6;font-size:10px" v-if="scope.row.project_name=='null'">未设置</div>
          <div style="color:#8492a6;font-size:10px"  v-else>{{ scope.row.project_name }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="集群名" min-width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>
            <span v-if="scope.row.cluster_cname == 'null'">{{ scope.row.cluster_name }}</span>
            <span v-else-if="scope.row.cluster_cname !== ''">{{ scope.row.cluster_cname }}</span>
            <span v-else>{{ scope.row.cluster_name }}</span>
          </span>
        </template>
      </el-table-column> -->
      <el-table-column label="集群类型/使用类型" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.cluster_type }}</span>
          <div v-if="scope.row.cluster_type!='sentinel'" style="color:#8492a6;font-size:10px">{{ scope.row.user_type }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="使用类型" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.user_type }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="实例个数" width="78">
        <template slot-scope="scope">
          <span>{{ scope.row.instances.instances.length }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Master数" prop="instance_master" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.instance_master }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Slave数" prop="instance_slave" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.instance_slave }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="使用内存" prop="user_mem" :formatter="format10242" min-width="80"> -->
      <el-table-column label="使用内存/分配内存" prop="user_mem" width="90">
        <template slot-scope="scope">
          <div v-if="scope.row.cluster_type!='sentinel'">
            <span>{{ scope.row.user_mem | format1024 }}</span>
            <div style="color:#8492a6;font-size:10px">{{ scope.row.max_mem | format1024 }}</div>         
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="分配内存" prop="user_mem" width="78">
        <template slot-scope="scope">
         <span>{{ scope.row.max_mem | format1024 }}</span>
        </template>
      </el-table-column> -->

      <el-table-column prop="used_cpu_user" label="CPU" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ Math.round(scope.row.used_cpu_sys+scope.row.used_cpu_user) }}%</span>
          <el-tooltip class="item" effect="light" content="User/Sys"  placement="top" >
          <div style="color:#8492a6;font-size:10px">{{ Math.round(scope.row.used_cpu_user) }}/{{ Math.round(scope.row.used_cpu_sys) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="instantaneous_input_kbps" label="入/出流量(k)" width="98">
        <template slot-scope="scope">
          <span>{{ Math.round(scope.row.instantaneous_input_kbps) }}/{{ Math.round(scope.row.instantaneous_output_kbps) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前连接数/执行命令数" width="100" prop="connected_clients" >
        <template slot-scope="scope">
          <span>{{ scope.row.connected_clients }}</span>
          <div style="color:#8492a6;font-size:10px">{{ scope.row.total_commands_processed }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="执行命令数" prop="total_commands_processed" width="92">
        <template slot-scope="scope">
          <span>{{ scope.row.total_commands_processed }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="evicted_keys" label="剔除/过期数" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.evicted_keys+'/'+ scope.row.expired_keys }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop='user_name.user' width="150">
        <template slot-scope="scope">
          <span v-for="(site,index) in scope.row.user_name_list" :key="index">{{ site }} </span>
        </template>
      </el-table-column>
      <el-table-column label="性能类型/影响范围" :show-overflow-tooltip="true" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.performance_type_name }}</span>
          <div style="color:#8492a6;font-size:10px">{{ scope.row.sphere_of_influence }}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注/appid" :show-overflow-tooltip="true" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
          <div style="color:#8492a6;font-size:10px">{{ scope.row.cluster_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center" fixed="right" v-if="adminrole">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" style="font-size:18px;color:#1890FF;" @click="handleEditCluster(scope.row)" />
          <el-button type="text" icon="el-icon-delete" style="font-size:18px;color:#FF4949;" @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getList"
    />

    <el-dialog
      title="修改redis集群信息"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleCloseDialog"
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" :model="clusterEdit" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="产品线名" min-width="100" prop="project_name">
          <el-input v-model.trim="clusterEdit.project_name" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="集群名" min-width="100" prop="cluster_cname">
          <el-input v-model.trim="clusterEdit.cluster_cname" type="text" auto-complete="off" />
        </el-form-item>
        <el-form-item label="集群类型" min-width="100" prop="cluster_type">
          <el-select v-model="clusterEdit.cluster_type" placeholder="请选择" style="width:330px">
            <el-option v-for="(type,index) in redisclustertype" :key="index" :label="type.label" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用类型" min-width="100" prop="user_type">
          <el-select v-model="clusterEdit.user_type" placeholder="请选择" style="width:330px">
            <el-option v-for="(type,index) in usertype" :key="index" :label="type.label" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="性能类型" min-width="100">
          <el-select v-model="clusterEdit.performance_type" placeholder="请选择" style="width:330px">
            <el-option v-for="(type,index) in performancetype" :key="index" :label="type.label" :value="type.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" min-width="100">
          <!-- <el-input v-model.trim="clusterEdit.user_name" type="text" auto-complete="off" /> -->
          <el-select v-model="clusterEdit.user_name" placeholder="负责人" filterable clearable multiple :multiple-limit="6" style="width:330px">
            <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="影响范围" min-width="100">
          <el-input v-model.trim="clusterEdit.sphere_of_influence" type="text" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editClusterInf('editForm', clusterEdit)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

import { format1024 } from '@/utils/format-function'
import { fetchListCluster, editCluster, getProjectName, deleteClusterRow, getClusterUsername, deleteNullCluster } from '@/api/midmonitor/redis'
import { getUserInfo } from '@/api/zabbix/user_info'

export default {
  name: 'RedisClusterConfig',
  components: { Pagination },
  directives: { waves },
  mixins: [resize, sessionListQuery],
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        project_name: undefined,
        cluster_cname: undefined,
        cluster_type: undefined,
        user_type: undefined,
        user_name_filter: undefined,
        user_name2: undefined,
        ip: undefined,
        port: undefined,
        ip_port: undefined,
      },
      dialogVisible: false,
      listLoading: false,

      adminrole: false,

      tableList: [],
      total: 0,

      all_project_name: [],

      getRowKeys(row) {  //获取row的key值
        return row.id;
      },
      expands: [],   //要展开的行，数值的元素是row的key值

      redisclustertype: [
        {
          value: 'cluster',
          label: 'Cluster',
        },{
          value: 'master_slave',
          label: 'MasterSlave',
        },{
          value: 'standalone',
          label: 'Standalone',
        },{
          value: 'sentinel',
          label: 'Sentinel',
        }],
      redisclustertype2: [
        {
          value: 'standalone',
          label: 'Standalone',
        },{
          value: 'sentinel',
          label: 'Sentinel',
      }],
      usertype: [
        {value: '消耗型', label: '消耗型'},
        {value: '过期型', label: '过期型'},
        {value: '持久型', label: '持久型'}
      ],
      performancetype: [
        {value: 1, label: '高性能型'},
        {value: 2, label: '均衡型'},
        {value: 3, label: '高一致型'},
        {value: 4, label: '极致性能'}
      ],

      // users: [],

      clusterEdit: {
        id: '',
        project_name: '',
        cluster_name: '',
        cluster_cname: '',
        cluster_type: '',
        user_type: '',
        user_name: '',
        sphere_of_influence: '',
        performance_type: '',
        // user_name: {
        //   uid: '',
        //   mobile: '',
        //   email: '',
        //   user: '',   //存id
        // }
      },

      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },

      rules: {
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        cluster_cname: [
          { required: true, message: '请输入集群名', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        cluster_type: [
          { required: true, message: '请选择集群类型', trigger: 'blur' },
        ],
        user_type: [
          { required: true, message: '请选择使用类型', trigger: 'blur' },
        ],
        // user_name: [
        //   { required: true, message: '请选择负责人', trigger: 'blur' },
        // ]
      },

      userInfoOptions: [],
      userInfoOptions2: [],

    }
  },

  watch: {
  },

  created() {
    this.getList()

    getProjectName().then(response => {
      this.all_project_name = response.data
    })

    this.adminrole = this.roles.includes('redis_admin')

    getUserInfo().then(response => {
      this.userInfoOptions = response
    })

    getClusterUsername().then(response => {
      this.userInfoOptions2 = response.data
    })

  },

  computed: {
    ...mapGetters(['roles']),
  },

  filters: {
    // dateFormat(time) {
    //   let d = new Date(time)
    //   return d.getMonth() + '-' + d.getDay() + ' ' + d.getHours() + ':' + d.getMinutes()
    // }
    format1024,

    reservedTwo(num) {
      return num.toFixed(2)
    }
  },

  methods: {
//过滤相关
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      // this.$refs['listQuery'].validate(valid => {
      //   if (valid) {
      //     this.getList()
      //   }
      // })
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },

    resetlistQuery() {
      this.listQuery = this.$options.data().listQuery
    },

    // format10242(row, column, cellValue){
    //  if (column.label == '分配内存') {
    //     return format1024(row.max_mem)
    //   }else if (column.label == '使用内存'){
    //     return format1024(row.user_mem)
    //   }
    // },
    format1024Nested(row, column, cellValue) {
      if(column.label == '分配内存') {
        return format1024(row.max_memory)
      }else if(column.label == '使用内存') {
        return format1024(row.used_memory)
      }
    },

    getList() {
      this.listLoading = true
      let ip_port = this.listQuery.ip_port
      if(ip_port) {
        let lst = ip_port.split(/[:]/)
        if(lst[0]) {
          this.listQuery.ip = lst[0]
          if(lst[1]) {
            this.listQuery.port = lst[1]
          } else {
            this.listQuery.port = undefined
          }
        } else {
          this.listQuery.ip = undefined
        }
      } else {
        this.listQuery.ip = undefined
        this.listQuery.port = undefined
      }
      fetchListCluster(this.listQuery).then(response => {
        this.tableList = response.data.results
        this.total = response.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },

    // userFormatter(row, column) {
    //   for(let item of this.users) {
    //     if(row.user_name === item.value) {
    //       return item.label
    //     }
    //   }
    // },

//嵌表
    // toggleRowExpansion(row){
    //     this.expands = [];
    //     this.expands.push(row.id);
    // },
    toggleRowExpansion(row, label) {
      if (label.label == '操作') {
        return
      }
      let $table = this.$refs.table;
      this.tableList.map((item) => {
        if (row.id !== item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    },

    handleInstance(row) {
      const ip=row.ip+':'+row.port
      this.$router.push({ name: 'redis_instance_detail', params: { id:row.id, ip:ip }})
    },

    handleInstance2(row) {
      const tmp = row.split('_')
      const id = Number(tmp[0])
      const ip = tmp[1]
      this.$router.push({ name: 'redis_instance_detail', params: { id:id, ip:ip }})
    },

    // getUser(id) {
    //   for(let item of this.users) {
    //     if(item.value === id) {
    //       return item.value
    //     }
    //   }
    // },
    handleEditCluster(row) {
      this.dialogVisible = true
      this.clusterEdit.id = row.id
      this.clusterEdit.project_name = row.project_name
      this.clusterEdit.cluster_name = row.cluster_name
      this.clusterEdit.cluster_cname = row.cluster_cname
      this.clusterEdit.cluster_type = row.cluster_type
      this.clusterEdit.user_type = row.user_type
      this.clusterEdit.performance_type = row.performance_type
      this.clusterEdit.sphere_of_influence = row.sphere_of_influence
      if(!row.user_name) {
        this.clusterEdit.user_name = []
      } else {
        this.clusterEdit.user_name = row.user_name.split(',')
      }
      // this.clusterEdit.user_name.uid = row.user_name.id
      // this.clusterEdit.user_name.mobile = row.user_name.mobile
      // this.clusterEdit.user_name.email = row.user_name.email
      // this.clusterEdit.user_name.user = row.user_name.id
    },

//对话框相关
    editClusterInf(formName, clusterEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let clusterEditNew = {
            id: '',
            project_name: '',
            cluster_name: '',
            cluster_cname: '',
            cluster_type: '',
            user_type: '',
            user_name: '',
            sphere_of_influence: '',
            performance_type: '',
          }
          clusterEditNew.id = clusterEdit.id
          clusterEditNew.project_name = clusterEdit.project_name
          clusterEditNew.cluster_name = clusterEdit.cluster_name
          clusterEditNew.cluster_cname = clusterEdit.cluster_cname
          clusterEditNew.cluster_type = clusterEdit.cluster_type
          clusterEditNew.user_type = clusterEdit.user_type
          clusterEditNew.user_name = clusterEdit.user_name.toString()
          clusterEditNew.sphere_of_influence = clusterEdit.sphere_of_influence
          clusterEditNew.performance_type = clusterEdit.performance_type
          editCluster(clusterEditNew.id, clusterEditNew).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          }).catch(error => {
            if (error.response.data) {
              this.$notify({
                title: '修改失败',
                message: '请确认提交的数据',
                type: 'error',
                duration: 3000
              })
            }
            // console.log(error)
          })
          this.dialogVisible = false
        }
      })
    },
    handleCloseDialog() {
      this.dialogVisible = false
    },

    handleDelete(row) {
      this.$confirm('确认删除该集群吗?(同时会删除该集群下的所有实例.)',
                    '提示',
                    {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'}).then(() => {
        deleteClusterRow(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getList()
        }).catch(error => {
          this.$notify({
            title: error.response.status + ' ' + error.response.data.msg,
            message: error.response.data.detail,
            type: 'error',
            duration: 3000
          })
        })
      })
    },

    handleDeleteNullCluster() {
      this.$confirm('确认一键清除所有空集群吗?',
                    '提示',
                    {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'}).then(() => {
        deleteNullCluster().then(response => {
          this.$notify({
            title: response.statusText,
            message: response.data.msg,
            type: 'success',
            duration: 3000
          })
          this.getList()
        }).catch(error => {
          this.$notify({
            title: error.response.status + ' ' + error.response.data.msg,
            message: error.response.data.detail,
            type: 'error',
            duration: 3000
          })
        })
      })
    },

    tableRowClassName({row, rowIndex}) {
      if (row.status == 10) {
        return 'cachecloud-row';
      }
      return '';
    }
  }

}
</script>

<style>
.el-table .cachecloud-row {
  background: #f0f9eb;
}
/* .nestedtable {
  border-color: #A3D3FF;
}
.nestedtable:before .nestedtable:after{
    background-color: #A3D3FF;
}
.el-table .nestedtable:before, .el-table .nestedtable:after {
    background-color: #A3D3FF;
} */

/* .roottable {
  .nestedtable {
    margin-right: -30px;
    .el-table__expand_column {
      width: 0px;
    }
  }
} */
</style>
