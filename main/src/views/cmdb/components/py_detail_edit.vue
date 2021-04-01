<template>
  <div style="padding-left: 8%">
    <el-form :model="aDetail" :rules="rules" ref="updateAppForm" label-width="90px" style="width:100%">
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主机名" prop="host_name">
              <el-input v-model.trim ="aDetail.host_name" placeholder="主机名" style="width:70%;" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机IP" prop="ip" required>
              <el-input v-model.trim="aDetail.ip" placeholder="IP" style="width:70%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境类型" required>
              <el-select v-model="aDetail.resource_env" placeholder="环境类型" style="width:70%;">
                <el-option v-for="item in resource_env" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统版本" required>
              <system-version :selectedOptions="selectedOptions" @sendValueToParent="getValueFromChild" style="width:70%;"></system-version>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="CPU核数" prop="cpu" required>
              <el-input-number v-model.trim="aDetail.cpu" controls-position="right" :min=1 :max="300" style="width:70%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内存大小" prop="memory" required>
              <el-input-number v-model="aDetail.memory" controls-position="right" :min=1 :max="2000" style="width:70%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="磁盘容量" prop="disk" required>
              <el-input-number v-model="aDetail.disk" controls-position="right" :min=100 :max="10000" style="width:70%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起始位置" prop="expandinfo.rack_location" required>
              <el-input-number v-model="aDetail.expandinfo.rack_location" controls-position="right" :min="1" :max="42" style="width:70%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机房信息" required>
              <el-cascader expand-trigger="hover" filterable :options="resource_fr" v-model="resource_fr_ma" style="width:70%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保商" required>
              <el-select v-model="aDetail.expandinfo.supplier" placeholder="应用等级" style="width:70%;">
                <el-option v-for="item in resource_sp" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="过保时间" prop="expandinfo.expired_day" required>
              <el-date-picker v-model="aDetail.expandinfo.expired_day" type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd" :clearable=false style="width:70%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号">
              <el-input v-model="aDetail.expandinfo.device_model" placeholder="设备型号" style="width:70%;" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SN码">
              <el-input v-model="aDetail.expandinfo.sn" placeholder="SN码" style="width:70%;" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产条码">
              <el-input v-model="aDetail.expandinfo.asset_number" placeholder="资产条码" style="width:70%;" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SLA级别">
              <el-select v-model="aDetail.expandinfo.sla" placeholder="SLA级别" style="width:70%;">
                <el-option v-for="item in sla_level" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注信息">
              <el-input v-model="aDetail.comments" placeholder="备注" type="textarea" autosize  maxlength="100" style="width:70%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
        </el-row>
        <el-row>
          <el-form-item prop="inputMaintainerValue">
            <label slot="label">&nbsp;&nbsp;&nbsp;&nbsp;IP地址&nbsp;&nbsp;</label>
            <el-input placeholder="请输入IP" v-model="aDetail.inputMaintainerValue" class="input-new-tag" size="mini" style="width:50%;">
              <el-select v-model="select" slot="prepend" placeholder="请选择IP类型" style="width:90px ">
                <el-option v-for="item in ip_type_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-button slot="append" class="button-new-tag" icon="el-icon-plus" @click="maintainerInputConfirm">添加</el-button>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <label slot="label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <el-tag v-for="(tag, index) in aDetail.ip_manage" :key="index" closable :disable-transitions="false" @close="maintainerTagsClose(index)">
              {{ ip_type[tag[0]]+':'+tag[1] }}
            </el-tag>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getFrackList,
  updatePybaseInfo,
  getSupplierList,
  editIPValidation
} from '@/api/cmdbs/resourcemanage'
import {
  deepClone
} from '@/utils'
import {
  validIp
} from '@/utils/validate'
import SystemVersion from '@/components/Tools/SystemVersion'
import {renv, rsStatus, rsType, envList, ip_type, ip_type_list } from '@/api/static'

  export default {
    name: 'PyDetailEdit',
    components: {
      SystemVersion
    },
    props: {
      detailStr: {}
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
      };
      const validateIpaddress2 = (rule, value, callback) => {
        if(value) {
          // debugger
          if(value === this.detailStr.ip) {
            callback()
          } else if(validIp(value)) {
            // callback()
          } else {
            callback(new Error('IP填写不正确!'))
          }
        } else {
          callback(new Error('请输入IP!'))
        }
        editIPValidation({ip: value}).then(response => {
          if (response.status == 400) {
            callback(new Error(response.msg))
          } else if (response.status == 200) {
            callback()
          }
        })
      };
      return {
        ip_type: ip_type,
        resource_env: renv,
        ip_type_list: ip_type_list,
        selectedOptions: [],
        inputMaintainerVisible: false,
        inputMaintainerValue: undefined,
        select: "3",
        resource_fr: [],
        resource_sp: [],
        aDetail: {},
        hostList: [],
        resource_fr_ma: [],
        rules: {
          host_name: [{
              required: true,
              message: '请输入主机名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 255,
              message: '长度在 3 到 255 个字符',
              trigger: 'blur'
            }
          ],
          expandinfo: [{
            type: 'object',
            required: true,
            trigger: 'change',
            fields: {
              sla: {
                required: true,
                message: '请选择SLA级别',
                trigger: 'blur'
              },
              rack_location: {
                required: true,
                message: '请写入设备起始位置',
                trigger: 'blur'
              }
            }
          }],
          cpu: [{
            required: true,
            message: '请输入CPU个数,最大200个',
            trigger: 'change'
          }],
          inputMaintainerValue: [{
            message: '请输入正确的IP地址',
            trigger: 'blur',
            validator: validateIpaddress
          }],
          ip: [
            { required: true, validator: validateIpaddress2, trigger: 'blur' }
          ],
        },

        sla_level: [
          {label: 'A', value: 1},
          {label: 'B', value: 2},
          {label: 'C', value: 3},
          {label: 'D', value: 4},
          {label: 'E', value: 5},
        ],

      }
    },

    created() {
      this.aDetail = Object.assign({
        "inputMaintainerValue": ''
      }, this.detailStr);

      this.resource_fr_ma = [this.aDetail.expandinfo.machineroom_id, this.aDetail.expandinfo.rack]
      this.selectedOptions = [this.aDetail.os_type, this.aDetail.os_version]
      getFrackList().then(response => {
        this.resource_fr = response
      }).catch((error) => {
        this.$message({
          message: '数据不存在！'
        })
      })
      getSupplierList().then(response => {
        this.resource_sp = response
      }).catch((error) => {
        this.$message({
          message: '数据不存在！'
        })
      })
    },

    beforeDestroy() {
      this.aDetail = {}
    },

    methods: {
      update() {
        this.aDetail.expandinfo.machineroom_id = this.resource_fr_ma[0];
        this.aDetail.expandinfo.rack = this.resource_fr_ma[1];
        this.$refs['updateAppForm'].validate((valid) => {
          if (valid) {
            updatePybaseInfo(this.aDetail).then(response => {
              this.$message({
                message: '更新完成',
                type: 'success',
              });
            }).catch(response => {
              this.$alert(response, "Error", {
                type: "error"
              })
            });
          } else {
          this.$message({
            message: '更新失败，请检查字段',
            type: 'error',
          });
          return false
        }
        })
      },

      maintainerInputConfirm() {
        const inputMaintainerValue = this.aDetail.inputMaintainerValue

        if (validIp(inputMaintainerValue)) {
          if (this.aDetail.ip_manage.toString().indexOf([this.select, inputMaintainerValue].toString()) == -1) {
            this.aDetail.ip_manage.push([this.select, inputMaintainerValue])
          }
        }
        this.inputMaintainerVisible = false
        this.aDetail.inputMaintainerValue = ''
      },
      maintainerTagsClose(index) {
        this.aDetail.ip_manage.splice(index, 1)
      },
      getValueFromChild(value1) {
        this.aDetail.os_type = value1[0]
        this.aDetail.os_version = value1[1]
      }
    }
  }
</script>
<style>
</style>
