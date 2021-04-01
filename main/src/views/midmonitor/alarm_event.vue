<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col :span="20">
        <el-form-item prop="type">
          <el-select v-model="listQuery.type" placeholder="数据源" clearable style="width: 150px;" @change="handleFilter">
            <el-option v-for="item in type_set" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="priority">
          <el-select v-model="listQuery.priority" placeholder="报警级别" clearable style="width: 150px;" @change="handleFilter">
            <el-option v-for="item in priority_dict" :key="item[0]" :label="item[1]" :value="item[0]">
              <span :style="getPriorityStyle(item[0])">{{ item[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_mail">
          <el-select v-model="listQuery.is_mail" placeholder="是否发送报警" clearable style="width: 150px;" @change="handleFilter">
            <el-option v-for="item in is_mail_dict" :key="item[0]" :label="item[1]" :value="item[0]"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_ack">
          <el-select v-model="listQuery.is_ack" placeholder="是否确认" clearable style="width: 150px;" @change="handleFilter">
            <el-option v-for="item in is_mail_dict" :key="item[0]" :label="item[1]" :value="item[0]"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchText">
          <el-input v-model="listQuery.description" placeholder="报警信息模糊查询" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-button  type="primary" @click="batchAckClick" :disabled="selected_rows.length===0">批量确认</el-button>
      </el-col>
    </el-form>


    <el-table v-loading="listLoading" :data="tableData" border stripe highlight-current-row
              style="width: 100%;" :cell-style="descLine" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" class="select_class"></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="数据源" align="center" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" align="center" width="130" v-if="false">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警实例名" min-width="100" v-if="false">
        <template slot-scope="scope">
          <span>{{ scope.row.node_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警级别" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.priority_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警信息" min-width="520px" align="center">
        <template slot-scope="scope">
          <span type="success">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否发送报警" width="160" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_mail !== 0" size="medium">是</el-tag>
          <el-tag v-if="scope.row.is_mail === 0" size="medium" type='danger'>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否确认" class-name="status-col" width="100">
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
      <el-table-column label="持续时间" prop="ctime" class-name="status-col" width="110" sortable :formatter="formatDate">
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleShowHistory(row)">
            确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br/>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="page" :page-sizes="[20,50,100,200]" :page-size="limit"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>


    <el-dialog title="确认框" :visible.sync="dialogFormVisible" @open="dialogOpen" @close="handleClose" width="30%"
               top="60px" style=" height: 400px;">
      <el-form ref="dataForm" :model="ackForm">
        <el-form-item label="确认描述信息">
          <el-input type="textarea" v-model.trim="ackForm.comments"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCommon()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量确认" :visible.sync="show_batch_ack_dialog" width="30%" top="60px" style=" height: 400px;">
      <el-form>
        <el-form-item label="确认描述信息">
          <el-input type="textarea" v-model="batch_ack_comments"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_batch_ack_dialog = false">取 消</el-button>
        <el-button type="primary" @click="batchAckConfirm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import resize from '@/components/Charts/mixins/resize'
  import sessionSearchText from "@/components/mixins/sessionSearchText";

  import {getAlarmEvent, updateAlarmEvent, uaeBatchAck} from '@/api/midmonitor/alarm'
  import Pagination from '@/components/Pagination'
  import {mapGetters} from 'vuex'
  import axios from 'axios'
  import Qs from 'qs'
  import {get_array_dict_value} from '@/utils/time_trans'

  var validUrl = (rule, value, callback) => {
    if (!(/^[0-9.]+:[0-9]+$/.test(value))) {
      callback(new Error('请输入正确的URL,格式为IP:PORT'))
    } else {
      callback()
    }
  };

  export default {
    name: 'MqClusterConfig',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionSearchText],

    data() {
      return {
        tableData:[],
        batch_ack_comments: '确认',
        show_batch_ack_dialog: false,
        selected_rows: [],
        type_set: new Set(),
        is_mail_dict: [[1, '是'], [0, '否']],
        searchText: '',
        listQuery: {
          // page: 1,
          // limit: 20,
          priority: undefined
        },
        dialogFormVisible: false,
        consoleStatus: {},
        searchVal: '',
        listLoading: false,
        adminrole: false,
        cardData: [],
        cardTempData: [],
        all_cluster_name: [],
        total: 0,
        ackForm: {
          comments: '确认'
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
        priorityOptions: [{label: 'information', key: 1}, {label: 'warning', key: 2}, {label: 'average', key: 3},
          {label: 'high', key: 4}, {label: 'disaster', key: 5}, {label: 'not_classified', key: 0},
        ],
        priority_color_dict: [[5, '#E45959'], [4, '#E97659'], [3, '#FFA059'], [2, '#FFC859'], [1, '#7499FF'], [0, '#97AAB3']],
        priority_dict: [[1, '通知'], [2, '警告'], [3, '一般严重'], [4, '严重'], [5, '灾难'], [0, '未定义']],
        types: [{value: 1, label: 'rocketmq'}, {value: 2, label: 'kafka'}, {value: 3, label: 'ES'}],

        status: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],

        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        rules: {
          cluster_name: [
            {required: true, message: '请输入集群名称', trigger: 'blur'},
            {max: 50, message: '长度不能超过50个字符', trigger: 'blur'}
          ],
          cluster_name_alias: [
            {required: true, message: '请输入集群别名', trigger: 'blur'},
            {max: 50, message: '长度不能超过50个字符', trigger: 'blur'}
          ],
          cluster_type: [
            {required: true, message: '请选择集群类型', trigger: 'blur'},
          ],
          console_url: [
            {required: true, message: '请输入URL', trigger: 'blur'},
            {validator: validUrl, trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {max: 255, message: '长度不能超过255个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {max: 255, message: '长度不能超过255个字符', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'},
          ],
        },
        currentPage: 1,
        pageSize: 30,
        currentTotal: 0,
        limit: 20,
        page: 1,
      }
    },

    created() {
      this.getClustersInf(true);
      this.adminrole = this.roles.includes('admin')
    },

    computed: {
      ...mapGetters(['roles'])
    },

    methods: {
      batchAckConfirm() {
        let ids = [];
        this.selected_rows.forEach(i => ids.push(i.id));
        // console.log(ids)
        // console.log(this.batch_ack_comments)
        uaeBatchAck({ids: ids.toString(), comments: this.batch_ack_comments}).then(res => {
          if (res.success) {
            this.$message({
              message: '确认成功',
              type: 'success'
            });
            this.getClustersInf();
            this.show_batch_ack_dialog = false;
          } else if (res.error) {
            this.$message({
              message: res.error,
              type: 'error'
            });
          }
        })
      },
      batchAckClick() {
        this.show_batch_ack_dialog = true;
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getClustersInf()
          }
        })
      },
      getPriorityStyle(priority) {
        let color = get_array_dict_value(this.priority_color_dict, priority, false);
        return "font-weight:bold; color:" + color
      },
      handleSizeChange(val) {
        this.limit = val;
        this.tableData = this.cardData.slice((this.page-1)*this.limit,this.page*this.limit)
      },
      handleCurrentChange(val) {
        this.page = val;
        this.tableData = this.cardData.slice((this.page-1)*this.limit,this.page*this.limit)
      },
      handleReset() {
        this.resetlistQuery();
        this.getClustersInf();
        this.searchText = undefined
      },
      getClustersInf(need_change_type_set = false) {
        this.listLoading = true;
        getAlarmEvent(this.listQuery).then(response => {
          this.cardData = response;
          this.tableData = this.cardData.slice((this.page-1)*this.limit,this.page*this.limit);
          this.cardTempData = response;
          this.total = this.cardData.length;
          this.currentTotal = this.cardData.length;

          let new_set = new Set();
          this.cardData.forEach(x => {
            new_set.add(x.type);
            x.priority_name = get_array_dict_value(this.priority_dict, x.priority)
          });
          if (need_change_type_set) {
            this.type_set = new_set;
          }

          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      resetlistQuery() {
        this.listQuery = {
          // page: 1,
          // limit: 20,
          priority: undefined
        }
      },
      descLine(row, column, rowIndex, columnIndex) {
        if (["报警级别", "报警信息"].indexOf(row.column.label) !== -1) {
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
      formatDate(row, column, cellValue) {
        if (row.ctime < 60) {
          return row.ctime + '秒'
        } else if (60 < row.ctime && row.ctime < 3600) {
          let h = parseInt(row.ctime / 60);
          return h + '分钟'
        } else if (3600 < row.ctime && row.ctime < 86400) {
          let h = parseInt(row.ctime / 3600);
          return h + '小时'
        } else if (row.ctime > 86400) {
          let d = parseInt(row.ctime / 86400);
          return d + '天'
        }
      },
      updateCommon() {
        updateAlarmEvent(this.ackForm['id'], this.ackForm).then(response => {
          this.$notify({
            title: '成功',
            message: '确认成功',
            type: 'success',
            duration: 3000
          });
          this.getClustersInf()
        });
        this.dialogFormVisible = false
      },
      handleShowHistory(row) {
        this.ackForm['id'] = row['id']; // copy obj
        this.ackForm['comments'] = row['comments']; // copy obj
        this.dialogFormVisible = true
      },
      handleClose() {
        this.dialogVisible = false;
        this.$refs['dataForm'].resetFields()
      },
      dialogOpen() {
        this.activeName = 'first'
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
