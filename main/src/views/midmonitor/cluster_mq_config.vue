<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <!-- <el-col :span="20"> -->
        <el-form-item>
          <el-select v-model="listQuery.status" placeholder="状态" clearable @change="handleFilter" style="width: 120px">
            <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-select v-model="listQuery.cluster_type" placeholder="集群类型" clearable @change="handleFilter" style="width: 150px">-->
<!--            <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-select v-model="listQuery.cluster_name" placeholder="集群名称" clearable filterable @change="handleFilter">
            <el-option v-for="(item, index) in all_cluster_name" :key="index" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.ip_filter" placeholder="IP:PORT" clearable @keyup.enter.native="handleFilter" @change="handleFilter"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.uuid_filter" placeholder="联系人" filterable clearable  @change="handleFilter" >
            <el-option v-for="(item,index) in users" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogInsertVisible=true" icon="el-icon-plus" v-if="adminrole">新增集群</el-button>
        </el-form-item>
      <!-- </el-col> -->

      <!-- <el-col :span="2" style="text-align: right;">
        <el-form-item>
          <el-button type="success" icon="el-icon-success" :disabled="checkbutton" @click="toggleSelection()">批量探测URL</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="2"></el-col> -->
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="cardData"
      border
      stripe
      highlight-current-row
      @row-click="toggleRowExpansion"
      ref="table"
    >
      <el-table-column type="expand" width="30px">
        <template slot-scope="scope">
            <el-table :data="scope.row.instances" class="nestedtable" stripe highlight-current-row border size="mini" >
              <el-table-column v-if="false" prop="id" label="id" align="center" />
              <el-table-column label="角色" align="center" sortable min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 0">Master</span>
                  <span v-if="scope.row.type === 1">Slave</span>
                  <span v-if="scope.row.type === 2">NameServer</span>
                  <span v-if="scope.row.type === 3">JMX</span>
                </template>
              </el-table-column>
              <el-table-column prop="ip" label="IP:PORT" align="center" min-width="100">
                <template slot-scope="scope">
                  <a style="color: #1890ff" @click="toServerMonitor(scope.row.ip)">
                    {{ scope.row.ip+':'+ scope.row.port }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column label="节点名称" align="center" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.broker_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="版本" align="center" min-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.version }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" min-width="100">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status==0" size="mini" type="success">监控中</el-button>
                  <el-button v-else-if="scope.row.status==1" size="mini" type="danger">异常中</el-button>
                  <el-button v-else size="mini" type="warning">未监控</el-button>
                </template>
              </el-table-column>
            </el-table>
        </template>
      </el-table-column>

     <!-- @selection-change="handleSelectionChange" -->
      <!-- <el-table-column type="selection" width="35" align="center"></el-table-column> -->
<!--      <el-table-column label="ID" prop="id" sortable align="center" width="70">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.id }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="集群名称" min-width="120">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="toMqMonitor(scope.row.id)">
            {{ scope.row.cluster_name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="集群别名" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cluster_name_alias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="集群类型" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.cluster_type_display }}</span>
          <!-- <span v-show="scope.row.cluster_type === 1">RocketMQ</span>
          <span v-show="scope.row.cluster_type === 2">Kafka</span>
          <span v-show="scope.row.cluster_type === 3">ES</span> -->
        </template>
      </el-table-column>
      <el-table-column label="控制台URL" show-overflow-tooltip min-width="190">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.console_url }}</span> -->
          <a style="color: #1890ff" target="_blank" :href="'http://'+scope.row.console_url">{{ 'http://'+scope.row.console_url }}</a>
          <!-- <v-html-panel :url="scope.row.console_url">{{ scope.row.console_url }}</v-html-panel> -->
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="170">
        <template slot-scope="scope">
          <pre v-html="uuid2user(scope.row.contacts)"></pre>
          <!-- <span>{{ scope.row.contacts }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="60" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 0">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="变更人/备注" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
          <div style="color:#8492a6;font-size:10px">{{ scope.row.comments }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170px" align="center" v-if="adminrole">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.status===1"
            v-if="scope.row.console_url_status===0" type="success"
            icon="el-icon-check"
            circle
            @click="handleUrl(scope.row.id, scope.row.cluster_name)">
          </el-button>
          <el-button :disabled="scope.row.status===1"
            v-else type="danger"
            icon="el-icon-check"
            circle @click="handleUrl(scope.row.id, scope.row.cluster_name)">
          </el-button>
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEditCluster(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDeleteCluster(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getClustersInf"
    />

    <el-dialog title="新增集群" :visible.sync="dialogInsertVisible" width="880px" @close="handleClose" :close-on-click-modal="false">
      <el-form ref="dataForm"
        :model="clusterInsert"
        :rules="rules"
        label-width="120px"
        style="width:100%;padding-right: 60px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="集群名称" prop="cluster_name">
              <el-input v-model.trim="clusterInsert.cluster_name" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集群别名" prop="cluster_name_alias">
              <el-input v-model.trim="clusterInsert.cluster_name_alias" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="集群类型" prop="cluster_type">
              <el-select v-model.trim="clusterInsert.cluster_type" style="width:100%">
                <el-option v-for="(type,index) in types" :key="index" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model.trim="clusterInsert.status" style="width:100%">
                <el-option v-for="(type,index) in status" :key="index" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="clusterInsert.username" type="text" auto-complete="off" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" >
              <el-input v-model.trim="clusterInsert.password" type="password" auto-complete="off" show-password style="width:100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="控制台URL" prop="console_url">
              <!-- <el-input v-model.trim="clusterInsert.console_url" type="text" auto-complete="off" placeholder="IP:PORT"/> -->
              <el-input v-model.trim="clusterInsert.console_url" type="text" auto-complete="off" placeholder="IP:PORT" style="width:100%;">
                <template slot="prepend">http://</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="comments">
              <el-input v-model.trim="clusterInsert.comments" type="textarea" auto-complete="off" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="联系人" prop="contacts">
              <el-select v-model="clusterInsert.contacts" multiple filterable clearable placeholder="请选择联系人" style="width:100%">
                <el-option v-for="(item,index) in users" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addClusterInf('dataForm', clusterInsert)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改集群信息" :visible.sync="dialogVisible" width="880px" @close="handleCloseDialog" :close-on-click-modal="false">
      <el-form ref="editForm" :model="clusterEdit" :rules="rules" label-width="100px" style="width:100%;padding-right: 60px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="集群名称" prop="cluster_name">
              <el-input v-model.trim="clusterEdit.cluster_name" type="text" auto-complete="off" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集群别名" prop="cluster_name_alias">
              <el-input v-model.trim="clusterEdit.cluster_name_alias" type="text" auto-complete="off" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="集群类型" prop="cluster_type">
              <el-select v-model.trim="clusterEdit.cluster_type" style="width:100%">
              <el-option v-for="(type,index) in types" :key="index" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model.trim="clusterEdit.status" style="width:100%">
              <el-option v-for="(type,index) in status" :key="index" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="clusterEdit.username" type="text" auto-complete="off" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model.trim="clusterEdit.password" type="password" auto-complete="off" style="width:100%" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="控制台URL" prop="console_url">
              <!-- <el-input v-model.trim="clusterInsert.console_url" type="text" auto-complete="off" placeholder="IP:PORT"/> -->
              <el-input v-model.trim="clusterEdit.console_url" type="text" auto-complete="off" placeholder="IP:PORT" style="width:100%">
                <template slot="prepend">http://</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="comments">
              <el-input v-model.trim="clusterEdit.comments" type="textarea" auto-complete="off" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="联系人" prop="contacts">
              <el-select v-model="clusterEdit.contacts" multiple filterable clearable placeholder="请选择联系人" style="width:100%">
                <el-option v-for="(item,index) in users" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editClusterInf('editForm', clusterEdit)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="consoleTitle"
      :visible.sync="dialogVisibleConsole"
      width="500px"
      @close="handleCloseDialogConsole"
      :close-on-click-modal="false"
    >
      <el-form ref="consoleStatus" :model="consoleStatus" label-width="100px" style="padding-right: 30px;">
        <el-row>
          <el-col :span="24" v-if="consoleStatus.exception === ''" style="text-align: center;"><el-button type="success" icon="el-icon-check" circle></el-button></el-col>
          <el-col :span="24" v-if="consoleStatus.exception !== ''" style="text-align: center;"><el-button type="danger" icon="el-icon-error" circle></el-button></el-col>
        </el-row>
        <el-row :gutter="5" v-if="consoleStatus.status_code !== ''" style="margin-top: 20px">
          <el-col :span="24" style="text-align: center;"><el-tag>状态码: {{ consoleStatus.status_code }}</el-tag></el-col>
        </el-row>
        <el-row :gutter="5" v-if="consoleStatus.exception !== ''" style="margin-top: 20px">
          <el-col :span="24" style="text-align: center;">{{ consoleStatus.exception }}</el-col>
        </el-row>
        <!-- <el-row :gutter="5" v-if="consoleStatus.url !== ''" style="margin-top: 20px">
          <el-col :span="24" style="text-align: center;"><el-tag>URL: {{ consoleStatus.url }}</el-tag></el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleConsole=false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {
    addClusterMq,
    deleteClusterMq,
    editClusterMq,
    getClustersMq,
    getClustersNameMq,
    getUserInfo,
    handleURLMq
  } from '@/api/midmonitor/cluster_config'
  import Pagination from '@/components/Pagination'
  import {mapGetters} from 'vuex'

  var validUrl = (rule, value, callback) => {
  if (!(/^[0-9.]+:[0-9]+$/.test(value))) {
    callback(new Error('请输入正确的URL,格式为IP:PORT'))
  } else {
    callback()
  }
}

export default {
  name: 'MqClusterConfig',
  components: { Pagination },
  directives: { waves },
  mixins: [resize, sessionListQuery],

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        cluster_name: undefined,
        cluster_type: 1,
        status: undefined,
        ip_filter: undefined,
        uuid_filter: undefined,
      },
      dialogInsertVisible: false,
      dialogVisible: false,
      dialogVisibleConsole: false,

      consoleStatus: {},
      consoleTitle: '',

      listLoading: false,

      adminrole: false,

      cardData: [],
      all_cluster_name: [],
      total: 0,

      clusterInsert: {
        cluster_name: '',
        cluster_name_alias: '',
        cluster_type: 1,
        console_url: '',
        username: '',
        password: '',
        status: 0,
        contacts: [],
        console_script_path: '',
        comments: '',
        change_user: this.name
      },
      clusterEdit: {
        id: '',
        cluster_name: '',
        cluster_name_alias: '',
        cluster_type: '',
        console_url: '',
        status: '',
        username: '',
        password: '',
        contacts: [],
        console_script_path: '',
        comments: '',
        change_user: this.name
      },

      types: [{value: 1, label: 'RocketMQ'}, { value: 2, label: 'Kafka'}],

      status: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],

      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },

      rules: {
        cluster_name: [
          { required: true, message: '请输入集群名称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        cluster_name_alias: [
          { required: true, message: '请输入集群别名', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        cluster_type: [
          { required: true, message: '请选择集群类型', trigger: 'blur' },
        ],
        console_url: [
          { required: true, message: '请输入URL', trigger: 'blur' },
          { validator: validUrl, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' },
        ],
      },

      checkbutton: true,
      multipleSelection: [],
      bulkHandleURLResult: [],

      getRowKeys(row) {  //获取row的key值
        return row.id;
      },
      expands: [],   //要展开的行，数值的元素是row的key值

      users: [],
    }
  },

  created() {
    this.getClustersInf()

    getClustersNameMq().then(response => {
      this.all_cluster_name = response
    }).catch(error => {
      this.$message({ message: '调用后端接口getClusterName出错!'})
    })

    getUserInfo().then(response => {
      this.users = response
    })

    this.adminrole = this.roles.includes('mq_admin')
  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  methods: {
//过滤相关
    handleFilter() {
      this.listQuery.page = 1
      this.getClustersInf()
    },
    handleReset() {
      this.resetlistQuery()
      this.getClustersInf()
    },

    getClustersInf() {
      this.listLoading = true
      getClustersMq(this.listQuery).then(response => {
        this.cardData = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      }).catch(error => {
        this.$message({ message: '调用后端接口getCluster出错!'})
        this.listLoading = false
      })
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        cluster_name: undefined,
        cluster_type: 1,
        status: undefined,
        ip_filter: undefined,
        uuid_filter: undefined,
      }
    },

    handleDeleteCluster(row) {
      var msg = '确认删除该集群信息吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteClusterMq(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getClustersInf()
        }).catch(error => {
          this.$notify({
            title: '失败' + '-' + error.response.data.msg,
            message: error.response.data.detail,
            type: 'error',
            duration: 3000
          })
        })
      })
    },

    handleEditCluster(row) {
      this.dialogVisible = true
      this.clusterEdit.id = row.id
      this.clusterEdit.cluster_name = row.cluster_name
      this.clusterEdit.cluster_name_alias = row.cluster_name_alias
      this.clusterEdit.cluster_type = row.cluster_type
      this.clusterEdit.console_url = row.console_url
      this.clusterEdit.status = row.status
      this.clusterEdit.username = row.username
      this.clusterEdit.password = row.password
      this.clusterEdit.contacts = row.contacts.split(',')
      this.clusterEdit.console_script_path = row.console_script_path
      this.clusterEdit.comments = row.comments
      this.clusterEdit.change_user = this.name
    },

//对话框相关
    editClusterInf(formName, clusterEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let clusterEditNew = {
            id: '',
            cluster_name: '',
            cluster_name_alias: '',
            cluster_type: '',
            console_url: '',
            status: '',
            username: '',
            password: '',
            contacts: [],
            console_script_path: '',
            comments: '',
            change_user: this.name
          }
          clusterEditNew.id = clusterEdit.id
          clusterEditNew.cluster_name = clusterEdit.cluster_name
          clusterEditNew.cluster_name_alias = clusterEdit.cluster_name_alias
          clusterEditNew.cluster_type = clusterEdit.cluster_type
          clusterEditNew.console_url = clusterEdit.console_url
          clusterEditNew.status = clusterEdit.status
          clusterEditNew.username = clusterEdit.username
          clusterEditNew.password = clusterEdit.password
          clusterEditNew.contacts = String(clusterEdit.contacts)
          clusterEditNew.console_script_path = clusterEdit.console_script_path
          clusterEditNew.comments = clusterEdit.comments
          editClusterMq(clusterEditNew.id, clusterEditNew).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getClustersInf()
          }).catch(error => {
            if (error.response.data) {
              this.$notify({
                title: '修改失败',
                message: '该集群信息修改失败',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.dialogVisible = false
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogInsertVisible = false
      this.$refs['dataForm'].resetFields()
      this.clusterInsert = {
        cluster_name: '',
        cluster_name_alias: '',
        cluster_type: 1,
        console_url: '',
        username: '',
        password: '',
        status: 0,
        contacts: [],
        console_script_path: '',
        comments: ''
      }
    },
    handleCloseDialog() {
      this.dialogVisible = false
      this.clusterEdit = {
        cluster_name: '',
        cluster_name_alias: '',
        cluster_type: 1,
        console_url: '',
        username: '',
        password: '',
        status: 0,
        contacts: [],
        console_script_path: '',
        comments: ''
      }
    },
    handleCloseDialogConsole() {
      this.dialogVisibleConsole = false
    },

    addClusterInf(formName, clusterInsert) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let clusterInsertAdd = {
            cluster_name: '',
            cluster_name_alias: '',
            cluster_type: '',
            console_url: '',
            username: '',
            password: '',
            status: '',
            contacts: [],
            console_script_path: '',
            comments: '',
            change_user: this.name
          }
          clusterInsertAdd.cluster_name = clusterInsert.cluster_name
          clusterInsertAdd.cluster_name_alias = clusterInsert.cluster_name_alias
          clusterInsertAdd.cluster_type = clusterInsert.cluster_type
          clusterInsertAdd.console_url = clusterInsert.console_url
          clusterInsertAdd.username = clusterInsert.username
          clusterInsertAdd.password = clusterInsert.password
          clusterInsertAdd.status = clusterInsert.status
          clusterInsertAdd.contacts = String(clusterInsert.contacts)
          clusterInsertAdd.console_script_path = clusterInsert.console_script_path
          clusterInsertAdd.comments = clusterInsert.comments
          addClusterMq(clusterInsertAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加集群信息成功',
              type: 'success',
              duration: 3000
            })
            this.dialogInsertVisible = false
            this.getClustersInf()
          }).catch(error => {
            this.dialogInsertVisible = false
            if (error.response.data) {
              this.$notify({
                title: '添加失败',
                message: '该集群信息已存在，请勿重复添加',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.$refs[formName].resetFields()
        }
      })
    },

    // toggleSelection(rows) {
    //   let list = this.multipleSelection.join()
    //   bulkHandleURL(list).then(response => {
    //     this.bulkHandleURLResult = response
    //     console.log(this.bulkHandleURLResult)
    //   })
    // },

    // handleSelectionChange(val) {
    //   this.multipleSelection = []
    //   for(let item of val) {
    //     this.multipleSelection.push(item.id)
    //   }
    //   // console.log(this.multipleSelection)
    //   if(this.multipleSelection.length !== 0) {
    //     this.checkbutton = false
    //   } else {
    //     this.checkbutton = true
    //   }
    // },

    handleUrl(id, cluster_name) {
      this.consoleTitle = '探测控制台是否正常 - ' + cluster_name
      handleURLMq(id).then(response => {
        this.consoleStatus = response
        this.dialogVisibleConsole = true
      })

      // if(this.consoleStatus.exception !== '') {
      //   this.$message({
      //     showClose: true,
      //     message: '该URL可正常访问!',
      //     type: 'success'
      //   })
      // } else if(this.consoleStatus.exception === '') {
      //   this.$message({
      //     showClose: true,
      //     message: '该url有问题,异常原因：'+this.consoleStatus.exception,
      //     type: 'error'
      //   })
      // }

      // const instance = axios.create({
      //   // baseURL: 'http://',
      //   headers:{
      //     'Content-Type':'application/x-www-form-urlencoded',
      //     "Access-Control-Allow-Headers":"Authorization,Origin, X-Requested-With, Content-Type, Accept",
      //     "Access-Control-Allow-Methods":"GET,POST",
      //     "Access-Control-Allow-Origin":"*"
      //   },
      //   transformRequest: [function (data) {
      //     data = Qs.stringify(data);
      //     return data;
      //   }],
      //   withCredentials:true,
      //   timeout: 1500
      // })
      // instance.defaults.baseURL = 'http://inspect'
      // instance.defaults.headers.post["Content-Type"] = 'application/x-www-form-urlencoded'
      // instance.defaults.headers.post["Access-Control-Allow-Headers"] = "Authorization,Origin, X-Requested-With, Content-Type, Accept"
      // instance.defaults.headers.post["Access-Control-Allow-Methods"] = "GET,POST"

      // axios.get('http://'+url).then(response => {
      //   console.log('!!!!!!!!!!!', response)
      // }).catch(err =>{
      //   console.log('@@@@@@@@@@@@@', err)
      // })
      // this.$http.get('http://'+url).then(res => {
      //   console.log('!!!!!!!!', res)
      // }, err => {
      //   console.log('@@@@@@@@@', err)
      // })
    },

    //嵌表
    // toggleRowExpansion(row){
    //   this.expands = [];
    //   this.expands.push(row.id);
    // },
    toggleRowExpansion(row) {
      let $table = this.$refs.table;
      this.cardData.map((item) => {
        if (row.id !== item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    },

    toMqMonitor(item) {
      this.$router.push({ name: 'rocketmq_monitor', query: { cid: item }})
    },

    toServerMonitor(item) {
      this.$router.push({ name: 'KeyboardChart', query: { ip: item }})
    },

    uuid2user(uuids) {
      let users = ''
      if (uuids) {
        for (let item of uuids.split(',')) {
          // let user = ''
          for (let i of this.users) {
            if (item === i.value) {
              // users.push(i.label)
              // user = i.label + '\n'
              users += i.label + '\n'
            }
          }
        }
      }
      return users
    },

  }

}
</script>
