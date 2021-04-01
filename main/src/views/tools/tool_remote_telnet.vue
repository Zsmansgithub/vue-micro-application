<template>
  <div class="dashboard-editor-container">
    <div class="ping_certain" v-if="is_loading">
      <i class="el-icon-loading"></i>
      <!-- <el-progress type="circle" :percentage="percentage" status="success"></el-progress> -->
    </div>
    <el-row>
      <panel_card title="参数配置" head_color="#409EFF">
        <el-row>
          <el-col :span="24">
            <div>
              <el-form ref="numForm" :model="numberForm" label-width="80px" :rules="rules">
                <el-col :span="24" :md="6" :lg="8">
                  <el-form-item label="源" min-width="100" prop="source" label-width="40px">
                    <el-scrollbar class="el-scrollbar-x">
                      <el-input v-model="numberForm.source" placeholder="IP之间用逗号分隔 | 必须在CMDB资源管理中存在." type="textarea" :rows="15" style="width:100%;"/>
                    </el-scrollbar>
                  </el-form-item>
                </el-col>
                <el-col :span="24" :md="18" :lg="16">
                  <el-form-item label="目标" min-width="100" prop="dest" style="position: relative;">
                    <!-- <el-input v-model="numberForm.dest" placeholder="IP:PORT之间用逗号分隔" type="textarea" :rows="15" style="width:80%;"></el-input> -->
                    <destIPs v-model="numberForm.dest" @validateDest='validateDest'></destIPs>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="10">
                  <el-form-item label="重试次数" min-width="100">
                    <el-input v-model.trim="numberForm.retry_times" type="text" style="width:80%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="超时时间(ms)" min-width="100">
                    <el-input v-model.trim="numberForm.time_out" type="text" style="width:80%"/>
                  </el-form-item>
                </el-col> -->
              </el-form>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row style="float:right;margin-right:120px;margin-bottom:15px"> -->
        <el-row>
          <el-col :span="10" style="margin-left:39px;">
            <el-input v-model="workFlowID" placeholder="内网防火墙申请单号" style="width:300px;"></el-input>&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="syncContent">同步</el-button>
          </el-col>
          <el-col :span="3"></el-col>
          <el-col :span="9" style="float:right;">
            <el-button type="primary" icon="el-icon-caret-right" @click="startClick" :disabled="this.countDown!=30">开始
            <span v-if="!(this.countDown==30)">({{ countDown }})</span>
          </el-button>
          <el-button type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
          <el-button :disabled="!(tableData.success_list.length || tableData.failed_list.length)" :loading="downloadLoading" plain type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
          </el-col>
        </el-row>
      </panel_card>
    </el-row>

    <el-row>
      <el-col :lg="6">
        <panel_card :title="'成功列表(共'+success_count+'个)'" head_color="#67C23A" height="470px">
          <el-table :data="tableData.success_list" style="width:100%" :cell-style="cellStyleClass" empty-text="-" height="400">
            <el-table-column prop="source" label="源" align="center" min-width="120"></el-table-column>
            <el-table-column prop="name" label="目标(集群名)" align="center" min-width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dest" label="目标(IP:PORT)" align="center" min-width="150px"></el-table-column>
            <!-- <el-table-column prop="status" label="状态" align="center" min-width="60">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" circle size="mini" v-if="scope.row.status==0"></el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </panel_card>
      </el-col>
      <el-col :lg="12">
        <panel_card :title="'失败列表(共'+failed_count+'个)'" head_color="#F56C6C" height="470px">
          <el-table :data="tableData.failed_list" style="width: 100%" :cell-style="cellStyleClass" empty-text="-" height="400">
            <el-table-column prop="source" label="源" align="center" min-width="120"></el-table-column>
            <el-table-column prop="name" label="目标(集群名)" align="center" min-width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dest" label="目标(IP:PORT)" align="center" min-width="120px"></el-table-column>
            <el-table-column prop="status" label="原因" align="center" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">资源管理中不存在</span>
                <span v-else-if="scope.row.status==2">连不上源主机</span>
                <span v-else-if="scope.row.status==3">nc命令找不到</span>
                <span v-else-if="scope.row.status==4">超时</span>
                <span v-else-if="scope.row.status==5">拒绝连接</span>
                <span v-else-if="scope.row.status==6">其它异常</span>
              </template>
            </el-table-column>
          </el-table>
        </panel_card>
      </el-col>
      <el-col :lg="6">
        <panel_card :title="'汇总统计(共'+all_count+'个)'" head_color="#409EFF" height="470px">
          <pie_chart v-if="success_count || failed_count" :success_count="success_count" :failed_count="failed_count"></pie_chart>
        </panel_card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SparkMD5 from "spark-md5";
  import panel_card from "./components/tool_ping/panel_card"
  import pie_chart from "./components/tool_ping/PieChart"
  import destIPs from "./components/tool_ping/destIPs"
  import {remoteTelnet, backValidation, getTaskResult, syncWorkFlow} from "@/api/tools/tool_remote_telnet"
  import {validIp} from '@/utils/validate'
  import { setInterval, clearInterval, setTimeout } from 'timers';
  import {parseTime} from '@/utils'

  const validateMultiIpAddrPort = (rule, value, callback) => {
    let req_ip = []
    if((value.chkips && value.chkips.length) || (value.custIps && value.custIps.length)) {
      if((value.custIps && value.custIps.length)) {
        for(let ip_port of value.custIps) {  // ip:port
          let tmp = ip_port.split(':')
          if (tmp.length == 2) {
            const [ip, port] = tmp
            req_ip.push(ip)
            if(!ip || !port) {
              return callback(new Error(ip_port + '--此IP:PORT填写不正确!'))
            }
            if (port) {
              let port_num = Number.parseInt(port)
              if (!(port_num > 0 && port_num < 65536)) {
                return callback(new Error(ip_port + '--端口填写不正确!'))
              }
            }
          } else {
            return callback(new Error(ip_port + '--此IP:PORT填写不正确!'))
          }
        }
      }
    } else {
      return callback(new Error('请输入IP!'))
    }
  }

  export default {
    components: {panel_card, pie_chart, destIPs},
    data() {
      const validateMultiIpAddr = (rule, value, callback) => {
        let req_ip = value.trim().split(/[,;\/\-|\s]+/)
        if(value) {
          for(let ip of req_ip) {
            if(validIp(ip)) {
              // callback()
            } else {
              return callback(new Error(ip + '--此IP填写不正确!'))
            }
          }
        } else {
          return callback(new Error('请输入IP!'))
        }
        backValidation({ip: req_ip.join(',')}).then(response => {
          if (response.status == 400) {
            callback(new Error(response.msg))
          } else if (response.status == 200) {
            callback()
          }
        })
      }
      return {
        is_loading: false,
        numberForm: {},
        tableData: {success_list: [], failed_list: []},
        success_count: 0,
        failed_count: 0,
        all_count: 0,
        rules: {
          source: [{required: true, message: '请输入IP!'}, {validator: validateMultiIpAddr, trigger: 'blur'}],
          dest: [{required: true, message: '请输入IP!'}, {validator: validateMultiIpAddrPort, trigger: 'blur'}],
        },

        percentage: 0,
        downloadLoading: false,
        mapData: {0: '成功', 1: '资源管理中不存在', 2: '连不上源主机', 3: 'nc命令找不到', 4: '超时', 5: '拒绝连接', 6: '其它异常'},

        countDown: 30,

        workFlowID: '',

      }
    },
    created() {
      this.initForm()
    },
    methods: {
      validateDest() {
        this.$refs.numForm.validateField('dest', validateMultiIpAddrPort)
      },
      initForm() {
        this.numberForm = {
          source: '', dest: '', retry_times: 1, time_out: 100
        }
      },
      cellStyleClass() {
        return 'padding:4px 0'
      },

      validForm() {
        let error_message = [];
        let keys = Object.keys(this.rules);
        for (let key of keys) {
          let formName = 'numForm'
          this.$refs[formName].validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        }
        return error_message.toString();
      },

      countDownFunc(){
        this.countDown--
        if(this.countDown<=0){
            this.countDown=30
            return false
        }
        setTimeout(() => this.countDownFunc(), 1000);
      },
      async startClick() {
        let err_msg = this.validForm();
        if (err_msg === '') {
          this.tableData = {success_list: [], failed_list: []}
          this.is_loading = true
          this.countDown = 30
          this.percentage = 0
          let request_body = {}
          request_body.source = this.numberForm.source.trim().split(/[,;\/\-|\s]+/).join()
          // request_body.dest = this.numberForm.dest.trim().split(/[,;\/\-|\s]+/).join()
          const chkips = this.numberForm.dest.chkips.reduce((iplist, ip) => {
            iplist.push(ip.slice(-1)[0])
            return iplist;
          }, [])
          request_body.dest = {custIps: this.numberForm.dest.custIps, chkips};
          // request_body.retry_times = this.numberForm.retry_times
          // request_body.time_out = this.numberForm.time_out
          // remoteTelnet(this.numberForm).then(res => {  // [task_id1, task_id2]
          //   this.tableData = res
          //   this.success_count = res.success_list.length
          //   this.failed_count = res.failed_list.length
          //   this.all_count = this.success_count + this.failed_count
          //   this.is_loading = false
          // })

          try {
            var task_id_list = await remoteTelnet(request_body)
          } catch(error) {
            // this.$message({
            //   message: error,
            //   type: 'error'
            // });
            this.is_loading = false
            return false
          }
          let p_list = []
          let num = 0
          if (task_id_list.length!=0) {
            for (let task_id of task_id_list) {
              let p = new Promise((resolve, reject) => {
                getTaskResult({task_id: task_id}).then(response => {
                  if (response.status=='SUCCESS') {
                    this.tableData.success_list.push(...response.success_list)
                    this.tableData.failed_list.push(...response.failed_list)
                    resolve('ok')
                  } else if (response.status=='FAILURE') {
                    reject(response.msg)
                  }
                })
              })
              p.then(() => {
                num++
                this.percentage = parseInt(num*100/(task_id_list.length))
              })
              p_list.push(p)
            }
          } else {
            this.$message({
              message: '表单填写有误',
              type: 'warning'
            });
            return false
          }
          let p_all = Promise.all(p_list)
          p_all.then(() => {
            this.success_count = this.tableData.success_list.length
            this.failed_count = this.tableData.failed_list.length
            this.all_count = this.success_count + this.failed_count
            this.is_loading = false
            this.$notify({
              title: '成功',
              message: '所有任务执行成功!',
              type: 'success'
            });
          }).catch((error) => {
            this.$notify({
              title: '任务执行失败!',
              message: error,
              type: 'warning'
            })
            this.is_loading = false
          })
          this.countDownFunc()
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },
      resetClick() {
        this.initForm()
        this.tableData = {success_list: [], failed_list: []}
        this.success_count = 0
        this.failed_count = 0
        this.all_count = 0
        this.$refs.numForm.clearValidate()
      },
      handleDownload() {
        this.downloadLoading = true
        let list = [...this.tableData.success_list, ...this.tableData.failed_list]
        for (let item of list) {
          item.status = this.mapData[item.status]
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['源', '集群名', '目标', '状态']
          const filterVal = ['source', 'name', 'dest', 'status']
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '内网防火墙检测-导出',
            autoWidth: true,
            bookType: 'xlsx'
          })
          setTimeout(() => {
            this.downloadLoading = false
          }, 2000)
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

      syncContent() {
        if(!this.workFlowID) {
          this.$message({
              message: '请填写需同步的工单id',
              type: 'warning'
            });
            return
        }
        syncWorkFlow({wf_id: this.workFlowID}).then(response => {
          if(response.status==200) {
            this.initForm()
            this.numberForm.source = response.msg.source
            const dest = {};
            response.msg.dest.map((val) => {
              const labelLowerCase = val.cluster_type.toLowerCase();
              const key = SparkMD5.hash(`${labelLowerCase}${val.cluster_name}`).slice(0, 7);
              const ip = val.ip.replace(/\s{1,}/g, '')
              const groupIp = val.port.split(',').reduce((ipGroup, portItem) => {
                  portItem = portItem.replace(/\s{1,}/g, '');
                  ipGroup.push(`${ip}:${portItem}`);
                  return ipGroup;
              }, [])
              if(dest[key]) {
                dest[key][1].value = dest[key][1].value.concat(groupIp)
              } else {
                dest[key] = [
                    labelLowerCase,
                    {
                      key: key,
                      label: val.cluster_name,
                      value: groupIp
                    }
                  ]
              }
            })
            const chkips = Object.values(dest).map((val) => {
              val[1].value = val[1].value.sort((a, b) => a.localeCompare(b,'zh-CN'))
              return val;
            })
            this.numberForm.dest = Object.assign({custIps: [], chkips})
          } else {
            this.$message({
              message: response.msg,
              type: 'warning'
            });
          }
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 10px 15px;
    background-color: #f0f2f5;
    position: relative;
  }

  .ping_certain {
    position: absolute;
    width: 100%;
    height: 100%;
    // background-color: white;
    opacity: 0.5;
    z-index: 9999; //优先级自定
    text-align: center;
    font-size: 30px;
    padding-top: 400px;
    margin-top: -10px;
    margin-left: -20px;
  }
  .card-panel /deep/ {
    border-radius: 4px;
    .el-card-header {
      color: #fff!important;
    }
  }
  .el-scrollbar-x /deep/ {
    height: 327px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    .el-scrollbar__wrap {
      overflow-x: auto;
    }
    .el-textarea__inner {
      border-width: 0;
    }
  }
</style>
