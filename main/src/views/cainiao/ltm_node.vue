<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-row>
          <el-form-item>
            <el-input v-model.trim="listQuery.name" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                      clearable
                      style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model.trim="listQuery.ltm_ip" @change="handleFilter" clearable placeholder="管理IP"
                       style="width: 130px;">
              <el-option v-for="item in ipOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="availabilitystate">
            <el-select v-model="listQuery.availabilitystate" @change="handleFilter" clearable placeholder="可用状态"
                       style="width: 105px;">
              <el-option v-for="item in enableOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="enabledstate">
            <el-select v-model.trim="listQuery.enabledstate" @change="handleFilter" clearable placeholder="启用状态"
                       style="width: 120px;">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="listQuery.opr_time_s"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            @change="handleFilter">
            </el-date-picker>
          </el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-plus"
                     @click="dialogAddVisible=true" v-if="adminrole">新增
          </el-button>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="可用状态" align="center" width="78">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="250" trigger="hover">
            <p>状态: {{ scope.row.statusreason }}</p>
            <div slot="reference" class="name-wrapper">
              <span v-if="scope.row.availabilitystate==='可用'"><svg-icon icon-class="F5_Available"
                                                                        style="font-size: 16px"></svg-icon></span>
              <span v-else-if="scope.row.availabilitystate==='不可用'"><svg-icon icon-class="F5_UnAvailable"
                                                                              style="font-size: 16px"></svg-icon></span>
              <span v-else-if="scope.row.availabilitystate==='离线'"><svg-icon icon-class="F5_Offline"
                                                                             style="font-size: 16px"></svg-icon></span>
              <span v-else><svg-icon icon-class="F5_Unknow" style="font-size: 16px"></svg-icon></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="管理IP" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ltm_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="NODE名称" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分区" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="logging设置" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.logging }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权重值" width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorstatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会话状态" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sessionstatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.enabledstate==='启用'"><svg-icon icon-class="F5_Enabled"
                                                                 style="color:#009551;"></svg-icon>&nbsp;<span
              style="color:#009551;">启用</span></span>
          <span v-else-if="scope.row.enabledstate==='禁用'"><svg-icon icon-class="F5_Disabled"
                                                                    style="color:#C64333;"></svg-icon>&nbsp;<span
            style="color:#C64333;">禁用</span></span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人员" width="77">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px" align="center" v-if="adminrole" fixed="right">
        <template slot-scope="props">
          <el-button type="text" @click="refresh_node(props.row)">
            <svg-icon icon-class="refresh8" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-dropdown @command="handleCommand">
            <span><svg-icon icon-class="禁用 (2)"
                            style="width: 16px; height:16px;color:#FFBA00;margin-left: 10px;margin-right: 10px"/></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="props.row.sessionstatus!=='启用(允许所有)'"
                                :command="beforeHandleCommand(props.$index,props.row, '启用')">启用(允许所有)
              </el-dropdown-item>
              <el-dropdown-item v-if="props.row.sessionstatus!=='禁用(仅允许持久或活动连接)'"
                                :command="beforeHandleCommand(props.$index,props.row, '禁用')">
                禁用(仅允许持久或活动连接)
              </el-dropdown-item>
              <el-dropdown-item v-if="props.row.sessionstatus!=='强制离线(仅允许活动连接)'"
                                :command="beforeHandleCommand(props.$index,props.row, '强制离线')">
                强制离线(仅允许活动连接)
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="text" @click="deleteNode(props.row)">
            <svg-icon icon-class="delete1" style="width: 16px; height:16px;color:#FF4949;"/>
          </el-button>
          <el-button type="text" @click="remarkDialog(props.row)">
            <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes="[20,50,100,200,500]"
      @pagination="getList"
      style="padding-top: 5px;margin-top: 10px;"
    />
    <el-dialog :visible.sync="dialogRemarkVisible" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="remarkForm" :model="remarkForm" class="remarkForm" label-width="50px">
        <el-form-item label="备注" style="width: 400px">
          <el-input v-model="remarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('remarkForm')">取 消</el-button>
        <el-button type="primary" @click="remark_node()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddVisible" @close="handleClose" width="975px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增NODE</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addNodeForm" :model="addNodeForm" :rules="rules" label-width="105px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="管理IP" prop="mgmt_ip">
              <el-select v-model="addNodeForm.mgmt_ip" style="width: 320px" @change="handleChange" placeholder='请选择管理IP'>
                <el-option v-for="item in ipOptions" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="分区" style="margin-left:-4px;" prop="partition">
              <el-select style="width: 320px;" v-model="addNodeForm.partition" placeholder='请选择分区'>
                <el-option v-for="item in select" :key="item.ltm_ip" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model.trim="addNodeForm.ip" style="width: 320px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名称" style="margin-left:-4px;">
              <el-input v-model.trim="addNodeForm.name" placeholder="选填，默认将使用ip地址作为名称" style="width: 320px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态">
              <el-select v-model="addNodeForm.state" style="width: 320px;">
                <el-option v-for="item in status1Options" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="权重" style="margin-left:-4px;" prop="radio">
              <el-input-number controls-position="right" style="width: 320px;" :min="1" v-model.trim="addNodeForm.radio"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="监控记录">
              <el-select v-model="addNodeForm.logging" style="width: 320px;">
                <el-option label="启用" value="enabled"></el-option>
                <el-option label="禁用" value="disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" style="margin-left:-4px;">
              <el-input style="width: 320px;" v-model.trim="addNodeForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addNodeForm')">取 消</el-button>
        <el-button type="primary" @click="insert_node('addNodeForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getLtmNode, refreshLtmNode, statusLtmNode, remarkLtmNode, insertLtmNode,mgIps,ltmIpName,deleteLtmNode} from '@/api/cainiao/ltm'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'
  import {mapGetters} from 'vuex'

  export default {
    name: "ltm_node",
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
    },
    directives: {
      waves,
    },
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
        listLoading: true,
        total: 0,
        list: null,
        remark_row:'',
        dialogRemarkVisible:false,
        dialogAddVisible:false,
        adminrole: false,
        ruleOptions: [],
        ipOptions: [],
        select: [],
        partitionOptions: [],
        statusOptions: [{'value': '启用', 'label': '启用'}, {'value': '禁用', 'label': '禁用'}],
        enableOptions: [{'value': '可用', 'label': '可用'}, {'value': '不可用', 'label': '不可用'},
          {'value': '离线', 'label': '离线'}, {'value': '未知', 'label': '未知'}],
        status1Options: [{'value': 'enabled', 'label': '启用(允许所有)'}, {'value': 'disabled', 'label': '禁用(仅允许持久或活动连接)'},
          {'value': 'forcedoffline', 'label': '强制离线(仅允许活动连接)'}],
        listQuery: {
          page: 1,
          limit: 20,
          ltm_ip: undefined,
          deleted: 0,
          availabilitystate: undefined,
          enabledstate: undefined,
          opr_time_s: undefined,
          name: undefined
        },
        remarkForm:{
          remark:''
        },
        addNodeForm:{
          mgmt_ip:'',
          partition:'',
          name:'',
          ip:'',
          state:'enabled',
          radio:'',
          logging:'disabled',
          remark:'',
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        rules:{
          mgmt_ip:[{required: 'true', message: '请选择管理IP', trigger: 'blur'}],
          partition:[{required: 'true', message: '请选择分区', trigger: 'blur'}],
          ip:[{required: 'true', message: '请正确填写ip', trigger: 'blur'}, {validator: validateIpaddress}],
          radio:[{required: 'true', message: '请填写权重值', trigger: 'blur'}],
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
      this.adminrole = this.roles.includes('ltm_node_admin')
      this.getList()
      mgIps().then(res=>{
        this.ipOptions=res
      })
      ltmIpName().then(res=>{
        this.partitionOptions=res
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      deleteNode(row) {
        const msg = '确定要删除该条node信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'node信息删除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          deleteLtmNode([row]).then(res => {
            if (res.status === 'ok') {
              loading.close()
              this.$message({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              loading.close()
              this.$message({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              })
              this.getList()
            }
          }).catch(err => {
            loading.close();
            this.$message({
              message: err,
            });
          });
        })
      },
      insert_node(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'node信息添加中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            insertLtmNode([this.addNodeForm]).then(res => {
              if (res.status === 'ok') {
                loading.close()
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                loading.close()
                this.$message({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
            this.dialogAddVisible = false
          }
        })
      },
      handleChange(val){
        this.select=[]
        let tmp = []
        for (const i of this.partitionOptions) {
          if (val===i.ltm_ip) {
            tmp.push(i)
          }
        }
        this.select=tmp
      },
      remarkDialog(row){
        this.dialogRemarkVisible=true
        this.remarkForm.remark=row.description
        this.remark_row=row
      },
      remark_node() {
        const loading = this.$loading({
          lock: true,
          text: 'node信息备注中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        remarkLtmNode({'one':this.remarkForm.remark,'two':[this.remark_row]}).then(res => {
          if (res.status === 'ok') {
            loading.close()
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            loading.close()
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
        this.dialogRemarkVisible=false
      },
      beforeHandleCommand(index, row, command) {
        return {index, row, command}
      },
      handleCommand(command) {
        //可以相对应的进行操作
        switch (command.command) {
          case "启用":
            const msg = '确定要启用该条node信息吗?'
            this.$confirm(msg, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'node信息启用中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              statusLtmNode({one: 'enabled', two: [command.row]}).then(res => {
                if (res.status === 'ok') {
                  loading.close()
                  this.$message({
                    title: '成功',
                    message: res.message,
                    type: 'success',
                    duration: 2000
                  })
                  this.getList()
                } else {
                  loading.close()
                  this.$message({
                    title: '失败',
                    message: res.message,
                    type: 'error',
                    duration: 2000
                  })
                  this.getList()
                }
              }).catch(err => {
                loading.close();
                this.$message({
                  message: err,
                });
              });
            })
            break;
          case "禁用":
            const msg1 = '确定要禁用该node信息吗?'
            this.$confirm(msg1, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'node信息禁用中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              statusLtmNode({one: 'disabled', two: [command.row]}).then(res => {
                if (res.status === 'ok') {
                  loading.close()
                  this.$message({
                    title: '成功',
                    message: res.message,
                    type: 'success',
                    duration: 2000
                  })
                  this.getList()
                } else {
                  loading.close()
                  this.$message({
                    title: '失败',
                    message: res.message,
                    type: 'error',
                    duration: 2000
                  })
                  this.getList()
                }
              }).catch(err => {
                loading.close();
                this.$message({
                  message: err,
                });
              });
            })
            break;
          case "强制离线":
            const msg2 = '确定要强制离线该node信息吗?'
            this.$confirm(msg2, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'node信息强制离线中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              statusLtmNode({one: 'forcedoffline', two: [command.row]}).then(res => {
                if (res.status === 'ok') {
                  loading.close()
                  this.$message({
                    title: '成功',
                    message: res.message,
                    type: 'success',
                    duration: 2000
                  })
                  this.getList()
                } else {
                  loading.close()
                  this.$message({
                    title: '失败',
                    message: res.message,
                    type: 'error',
                    duration: 2000
                  })
                  this.getList()
                }
              }).catch(err => {
                loading.close();
                this.$message({
                  message: err,
                });
              });
            })
            break;
        }
      },
      refresh_node(row) {
        const loading = this.$loading({
          lock: true,
          text: 'node信息刷新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        refreshLtmNode([row]).then(res => {
          if (res.status === 'ok') {
            loading.close()
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            loading.close()
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
      },
      handleReset() {
        this.getList()
        this.listQuery = {
          page: 1,
          limit: 20,
          ltm_ip: undefined,
          deleted: 0,
          availabilitystate: undefined,
          enabledstate: undefined,
          name: undefined
        }
      },
      handleFilter() {
        this.getList()
      },
      getList() {
        this.listLoading = true
        if (this.listQuery.opr_time_s) {
          this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        } else {
          this.listQuery.rtime = undefined
        }
        getLtmNode(this.listQuery).then(res => {
          this.list = res.results
          this.total = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      resetForm(formName) {
        this.dialogRemarkVisible = false
        this.dialogAddVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose(){
        this.addNodeForm={
          mgmt_ip:'',
          partition:'',
          name:'',
          ip:'',
          state:'enabled',
          radio:'',
          logging:'disabled',
          remark:'',
        }
        this.select=[]
      },
    }
  }
</script>

<style scoped>

</style>
