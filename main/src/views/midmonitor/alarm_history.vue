<template>
  <div class="app-container">
    
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col :span="20">
<!--        <el-form-item>-->
<!--          <el-select v-model="listQuery.alarm_source" placeholder="数据源" clearable style="width: 140px"-->
<!--                     class="filter-item">-->
<!--            <el-option v-for="item in alarmsourceOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-select v-model="listQuery.alarm_source" placeholder="IP地址" clearable style="width: 140px"-->
<!--                     class="filter-item">-->
<!--            <el-option v-for="item in alarmsourceOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-select v-model="listQuery.alarm_source" placeholder="报警实例名" clearable style="width: 140px"-->
<!--                     class="filter-item">-->
<!--            <el-option v-for="item in alarmsourceOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item prop="priority">
          <el-select v-model="listQuery.priority" placeholder="级别" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in priorityOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="stime">
          <el-date-picker class="filter-item" value-format="timestamp" :picker-options="pickerOptions2"
                          v-model="listQuery.start_time_gt" align="right" :default-value="datatime_default"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="cardData"
      border
      stripe
      highlight-current-row
      :cell-style="descLine"
    >
     <!-- @selection-change="handleSelectionChange" -->
      <!-- <el-table-column type="selection" width="35" align="center"></el-table-column> -->
      <el-table-column label="数据源" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" align="center" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警实例名" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.node_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警信息" min-width="1000px" align="center">
        <template slot-scope="scope">
          <span type="success">{{ scope.row.alarm_values }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="优先级" min-width="100" prop="priority" sortable>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.priority }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="是否发送报警" min-width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.is_mail === 0">否</span>
          <span v-if="scope.row.is_mail === 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="是否确认" min-width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" width="200">
          <p>信息: {{ scope.row.comments }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag v-if="scope.row.is_ack==1" size="medium">是</el-tag>
            <el-tag v-else size="medium" type='danger'>否</el-tag>
          </div>
        </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="持续时间" min-width="110" prop="continue_time" class-name="status-col" sortable :formatter="formatDate">
      </el-table-column>
      <el-table-column label="写入时间" min-width="100" v-if="false">
        <template slot-scope="scope">
          <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发生时间" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleShowHistory(row)">
            确认
          </el-button>
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

    <el-dialog title="确认框" :visible.sync="dialogFormVisible" @open="dialogOpen" width="30%"
               top="60px" style=" height: 400px;">
      <el-form ref="dataForm" :model="ackForm">
        <el-form-item label="确认描述信息">
          <el-input type="textarea" v-model.trim="ackForm.comments"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCommon()" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'

import { getAlarmHistory,updateAlarmHistory } from '@/api/midmonitor/alarm'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import axios from 'axios'
import Qs from 'qs'

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
  mixins: [resize],

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        priority: undefined,
        start_time_gt: undefined,
      },
      datatime_default:'',
      dialogFormVisible: false,
      dialogVisible: false,
      dialogVisibleConsole: false,

      consoleStatus: {},

      listLoading: false,

      adminrole: false,
      pickerOptions2: {
         disabledDate(end) {
            return end.getTime() > Date.now();
          }
        },

      cardData: [],
      all_cluster_name: [],
      total: 0,
      ackForm:{
        comments:'确认'
      },
      clusterInsert: {
        cluster_name: '',
        cluster_name_alias: '',
        cluster_type: 1,
        console_url: '',
        username: '',
        password: '',
        status: 1
      },
      clusterEdit: {
        id: '',
        cluster_name: '',
        cluster_name_alias: '',
        cluster_type: '',
        console_url: '',
        status: '',
        username: '',
        password: ''
      },
      types: [{value: 1, label: 'rocketmq'}, { value: 2, label: 'kafka'}, { value: 3, label: 'ES'}],
      status: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],
      priorityOptions: [{ label: 'information', key: 1 }, { label: 'warning', key: 2 },{ label: 'average', key: 3 },
        { label: 'high', key: 4 },{ label: 'disaster', key: 5 },{ label: 'not_classified', key: 0 },
      ],
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
      bulkHandleURLResult: []
    }
  },

  created() {
    this.getList()
    this.adminrole = this.roles.includes('admin')
    this.datatime_default= this.getdata()
  },

  computed: {
    ...mapGetters(['roles'])
  },

  methods: {
    getdata() {
      const date = new Date();
      return date.getFullYear()+'-'+date.getMonth();  //2019-05-1
    },
//过滤相关
    handleFilter() {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate(valid => {
        if (valid) {
          this.getList()
        }
      })
    },
    // handleFilter() {
    //   this.getList()
    // },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },

    getList() {
      this.listLoading = true
      if (this.listQuery.start_time_gt) {
        this.listQuery.rtime=Math.floor(this.listQuery.start_time_gt[0]/1000)+','+Math.floor(this.listQuery.start_time_gt[1]/1000)
      }else{
        this.listQuery.rtime= undefined
      }
      getAlarmHistory(this.listQuery).then(response => {
        this.cardData = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        priority: undefined
      }
    },
    formatDate(row, column, cellValue){
      if (row.continue_time <60) {
        return row.continue_time+'秒'
      }else if (60< row.continue_time && row.continue_time < 3600){
        let h=parseInt(row.continue_time/60)
        return h+'分钟'
      }else if (3600< row.continue_time && row.continue_time < 86400){
        let h=parseInt(row.continue_time/3600)
        return h+'小时'
      }else if (row.continue_time > 86400){
        let d = parseInt(row.continue_time/86400)
        return d+'天'
      }
    },
    descLine(row, column, rowIndex, columnIndex) {
      if (row.column.label === "报警信息") {
        if (row.row.priority === 5) {
          return 'background:#E45959;color:#f9ebeb;font-weight: bold;'
        } else if (row.row.priority === 4) {
          return 'background:#E97659;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority === 3) {
          return 'background:#FFA059;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority === 2) {
          return 'background:#FFC859;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority === 1) {
          return 'background:#7499FF;color:#f9ebeb;font-weight: bold'
        } else if (row.row.priority === 0) {
          return 'background:#97AAB3;color:#f9ebeb;font-weight: bold'
        } else {
          return 'background:#97AAB3;color:#f9ebeb;font-weight: bold'
        }
      }
    },
    handleShowHistory(row) {
      this.ackForm['id'] = row['id'] // copy obj
      this.ackForm['comments'] = row['comments'] // copy obj
      this.dialogFormVisible = true
    },
    updateCommon(){
      updateAlarmHistory(this.ackForm['id'],this.ackForm).then(response => {
        this.$notify({
              title: '成功',
              message: '确认成功',
              type: 'success',
              duration: 3000
            })
        this.getList()
      });
      this.dialogFormVisible = false
    },
    handleDeleteCluster(row) {
      var msg = '确认删除该集群信息吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteCluster(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getList()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
          console.log(error)
        })
      }, () => {
        return false
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
    },

//对话框相关
    editClusterInf(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editCluster(this.clusterEdit.id, this.clusterEdit).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          }).catch(error => {
            if (error.response.data.cluster_name == 'mq_cluster_config with this 集群名字 already exists.') {
              this.$notify({
                title: '修改失败',
                message: '该集群信息已存在，请勿重复添加',
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
    },
    dialogOpen() {},
    handleCloseDialog() {
      this.dialogVisible = false
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
            status: ''
          }
          clusterInsertAdd.cluster_name = clusterInsert.cluster_name
          clusterInsertAdd.cluster_name_alias = clusterInsert.cluster_name_alias
          clusterInsertAdd.cluster_type = clusterInsert.cluster_type
          clusterInsertAdd.console_url = clusterInsert.console_url
          clusterInsertAdd.username = clusterInsert.username
          clusterInsertAdd.password = clusterInsert.password
          clusterInsertAdd.status = clusterInsert.status
          addCluster(clusterInsertAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加集群信息成功',
              type: 'success',
              duration: 3000
            })
            this.dialogInsertVisible = false
            this.getList()
          }).catch(error => {
            this.dialogInsertVisible = false
            if (error.response.data.cluster_name == 'cluster config with this 集群名字 already exists.') {
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
  }

}
</script>

<style lang="scss" scoped>
// .app-container {
//   .test {
//     .el-row {
//       margin-top: 0px;
//       margin-bottom: 0px;
//       &:last-child {
//         margin-bottom: 10px;
//       }
//     }
//     .el-col {
//       border-radius: 4px;
//     }
//     .bg-purple-dark {
//       // background: #99a9bf;
//       background: #ffffff;
//     }
//     .bg-purple {
//       background: #d3dce6;
//     }
//     .bg-purple-light {
//       background: #e5e9f2;
//     }
//     .grid-content {
//       border-radius: 4px;
//       min-height: 36px;
//     }
//     .row-bg {
//       padding: 10px 0;
//       background-color: #f9fafc;
//     }
//   }
// }
</style>
