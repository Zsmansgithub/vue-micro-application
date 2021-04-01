<template>

  <div class="dashboard-editor-container">
    <div class="ping_certain" v-if="is_loading">
      <i class="el-icon-loading"></i>
    </div>
    <el-row style="margin-top: -20px;margin-bottom: -5px">
      <panel_card title="参数配置" head_color="lightskyblue">
        <el-row>
          <el-col :span="24" style="margin-top: -10px">
            <el-tabs v-model="tab_num">
              <el-tab-pane label="1.指定IP" name="first">
                <el-col :span="3" class="left_radio">
                  <el-col style="margin: 30px 10px 10px -10px; ">
                    <el-radio v-model="radio" label="1">指定端口</el-radio>
                  </el-col>
                  <el-col style="margin: 10px 10px 10px -10px; ">
                    <el-radio v-model="radio" label="2">范围端口</el-radio>
                  </el-col>
                </el-col>
                <el-col :span="21" style="margin-top: 10px">
                  <el-form ref="numForm" :model="numberForm" label-width="130px" :rules="rules_add" >
                    <el-col :span="24">
                      <el-form-item label="IP列表" min-width="100" prop="ip_list">
                        <el-input v-model.trim="numberForm.ip_list" type="textarea" :rows="1" placeholder="ip之间用逗号分隔" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="radio==='1'" :span="24">
                      <el-form-item label="指定端口" min-width="100" prop="port_list">
                        <el-input v-model.trim="numberForm.port_list" type="textarea" :rows="1" placeholder="端口之间用逗号分隔" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="radio==='2'" :span="12">
                      <el-form-item label="开始端口" min-width="100" prop="start_port">
                        <el-input v-model.trim="numberForm.start_port" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="radio==='2'" :span="12">
                      <el-form-item label="结束端口" min-width="100" prop="end_port">
                        <el-input v-model.trim="numberForm.end_port" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="次数" min-width="100" prop="times">
                        <el-input v-model.trim="numberForm.times" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="超时时间(ms)" min-width="100" prop="time_out">
                        <el-input v-model.trim="numberForm.time_out" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="2.范围IP" name="second">
                <el-col :span="3" class="left_radio">
                  <el-col style="margin: 30px 10px 10px -10px; ">
                    <el-radio v-model="radio" label="1">指定端口</el-radio>
                  </el-col>
                  <el-col style="margin: 10px 10px 10px -10px; ">
                    <el-radio v-model="radio" label="2">范围端口</el-radio>
                  </el-col>
                </el-col>
                <el-col :span="21" style="margin-top: 10px">
                  <el-form ref="numForm2" :model="numberForm" label-width="130px" :rules="rules_add">
                    <el-col :span="12">
                      <el-form-item label="开始IP" min-width="100" prop="start_ip">
                        <el-input v-model.trim="numberForm.start_ip" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="结束IP" min-width="100" prop="end_ip">
                        <el-input v-model.trim="numberForm.end_ip" style="width:100%"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="radio==='1'" :span="24">
                      <el-form-item label="指定端口" min-width="100" prop="port_list">
                        <el-input v-model.trim="numberForm.port_list" type="textarea" :rows="1" placeholder="端口之间用逗号分隔" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="radio==='2'" :span="12">
                      <el-form-item label="开始端口" min-width="100" prop="start_port">
                        <el-input v-model.trim="numberForm.start_port" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="radio==='2'" :span="12">
                      <el-form-item label="结束端口" min-width="100" prop="end_port">
                        <el-input v-model.trim="numberForm.end_port" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="次数" min-width="100" prop="times">
                        <el-input v-model.trim="numberForm.times" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="超时时间(ms)" min-width="100" prop="time_out">
                        <el-input v-model.trim="numberForm.time_out" type="text" style="width:100%"/>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-row style="float:right;margin-right: 40px">
            <el-button type="primary" icon="el-icon-caret-right" @click="startClick">开始</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetClick">重置</el-button>
          </el-row>
        </el-row>
      </panel_card>
    </el-row>

    <el-row style="margin-bottom: -15px">
      <el-col :xs="8" :sm="8" :lg="8">
        <panel_card :title="'成功列表(共'+success_count+'个)'" head_color="lightgreen" height="470px">
          <el-table :data="tableData.success_list" style="width: 100%" :cell-style="cellStyleClass" empty-text="-" height="400">
            <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
            <el-table-column prop="port" label="端口" align="center"></el-table-column>
          </el-table>
        </panel_card>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8">
        <panel_card :title="'失败列表(共'+failed_count+'个)'" head_color="lightsalmon" height="470px">
          <el-table :data="tableData.failed_list" style="width: 100%" :cell-style="cellStyleClass" empty-text="-" height="400">
            <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
            <el-table-column prop="port" label="端口" align="center"></el-table-column>
          </el-table>
        </panel_card>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8">
        <panel_card :title="'汇总统计(共'+all_count+'个)'" head_color="lightblue" height="470px">
          <pie_chart v-if="success_count || failed_count" :success_count="success_count" :failed_count="failed_count"></pie_chart>
        </panel_card>
      </el-col>
    </el-row>

  </div>
</template>


<script>
  import panel_card from "./components/tool_ping/panel_card"
  import pie_chart from "./components/tool_ping/PieChart"
  import {telnetTest} from "@/api/tools/tool_telnet"
  import {validMultipleIp, validSpecialChar, validPort, validScore15} from '@/utils/validate'

  export default {
    components: {panel_card, pie_chart},
    data() {
      return {
        is_loading: false,
        numberForm: {},
        tableData: [],
        success_count: 0,
        failed_count: 0,
        all_count: 0,
        tab_num: 'first',
        radio: '2',
        rules_add: {
          start_ip: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validateMultiIpAddr}],
          end_ip: [{validator: this.validateMultiIpAddr}],
          start_port: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validatePort}],
          end_port: [{validator: this.validatePort}],
          ip_list: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validateMultiIpAddr}],
          port_list: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validatePort}],
        },
      }
    },
    created() {
      this.initForm()
    },
    methods: {
      initForm() {
        this.numberForm = {
          start_ip: '', end_ip: '', ip_list: '',
          times: 1, start_port: '', end_port: '', port_list: '', time_out: 500
        }
      },
      cellStyleClass() {
        return 'padding:4px 0'
      },
      startClick() {
        let err_msg = this.validForm();
        if (err_msg === '') {
          this.is_loading = true;
          telnetTest({data: this.numberForm, tab_num: this.tab_num, radio: this.radio}).then(res => {
            this.tableData = res;
            this.success_count = res.success_list.length;
            this.failed_count = res.failed_list.length;
            this.all_count = this.success_count + this.failed_count;
            this.is_loading = false
          })
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },
      resetClick() {
        this.initForm();
        this.tableData = [];
        this.success_count = 0;
        this.failed_count = 0;
        this.all_count = 0
      },
      validateMultiIpAddr(rule, value, callback) {
        if (value) {
          if (validMultipleIp(value)) {
            callback()
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      },
      validatePort(rule, value, callback) {
        if (value) {
          if (validPort(value)) {
            callback()
          } else {
            callback(new Error('端口填写不正确'))
          }
        } else {
          callback()
        }
      },
      validForm() {
        let error_message = [];
        let keys = Object.keys(this.rules_add);
        for (let key of keys) {
          let formName = this.tab_num === 'first' ? 'numForm' : 'numForm2';
          this.$refs[formName].validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        }
        return error_message.toString();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 10px 15px 15px 15px;
    background-color: #f0f2f5;
    position: relative;
  }

  .ping_certain {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0.5;
    z-index: 9999; //优先级自定
    text-align: center;
    font-size: 30px;
    padding-top: 400px;
    margin-top: -10px;
    margin-left: -20px;
  }

  .left_radio {
    margin-top: 10px;
    text-align: center;
    border-right: lightgrey 1px solid;
    height: 150px;
    font-size: 18px
  }
</style>
