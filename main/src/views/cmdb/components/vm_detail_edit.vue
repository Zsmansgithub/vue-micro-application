<template>
  <div style="padding-left:8%">
    <el-form :model="aDetail" :rules="rules" ref="updateAppForm" label-width="90px" style="width:100%">
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主机名" prop="host_name">
              <el-input v-model.trim="aDetail.host_name" placeholder="主机名" maxlength="100" style="width:70%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机IP" prop="ip">
              <el-input v-model.trim="aDetail.ip" placeholder="IP" style="width:70%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境类型">
              <el-select v-model="aDetail.resource_env" placeholder="环境类型" style="width:70%;">
                <el-option v-for="item in resource_env"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统版本">
              <system-version :selectedOptions="selectedOptions" @sendValueToParent="getValueFromChild" style="width:70%;"></system-version>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息">
              <el-input v-model="aDetail.comments" placeholder="备注" type="textarea" autosize maxlength="100" style="width:87%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="IP地址" prop="inputMaintainerValue">
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
            <el-tag
              v-for="(tag, index) in aDetail.ip_manage"
              :key="index"
              closable
              :disable-transitions="false"
              @close="maintainerTagsClose(index)"
            >
              {{ ip_type[tag[0]]+':'+tag[1] }}
            </el-tag>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getClusterList, updateVmbaseInfo, getSupplierList, editIPValidation } from '@/api/cmdbs/resourcemanage'
import { deepClone  } from '@/utils'
import { validIp } from '@/utils/validate'
import SystemVersion from '@/components/Tools/SystemVersion'
import {renv, rsStatus, rsType, envList, ip_type, ip_type_list} from '@/api/static'

export default {
name: 'VmDetailEdit',
components: { SystemVersion },
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
      ip_type:ip_type,
      ip_type_list:ip_type_list,
      resource_sla:[],
      disk_type_list:[{value: '精简配置', label: '精简配置'},{value: '后置备置零', label: '后置备置零'}],
      resource_env:renv,
      inputMaintainerVisible: false,
      inputMaintainerValue: undefined,
      selectedOptions:[],
      select: "3",
      resource_fr:[],
      resource_sp:[],
      aDetail: {},
      rules: {
        host_name: [
          { required: true, message: '请输入主机名称', trigger: 'blur' },
          { min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur' }
        ],
        ip: [
          { required: true, validator: validateIpaddress2, trigger: 'blur' }
        ],
        inputMaintainerValue: [
          { message: '请输入正确的IP地址', trigger: 'blur' , validator: validateIpaddress}
        ],
      },

    }
  },

  created() {
    this.aDetail=Object.assign({"inputMaintainerValue":''}, this.detailStr);

    this.selectedOptions=[this.aDetail.os_type,this.aDetail.os_version]

    getClusterList().then(response => {
      this.resource_sla = response
    }).catch((error) => {
      this.$message({
        message: '数据不存在！'
      })
    })
  },

  beforeDestroy() {
    this.aDetail=undefined
  },

  methods: {
    update() {
      this.$refs['updateAppForm'].validate(valid => {
        if (valid) {
          updateVmbaseInfo(this.aDetail).then(response => {
            this.$message({
              message: '更新完成',
              type: 'success',
            })
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
        }
      })
    },

    maintainerInputConfirm() {
      const inputMaintainerValue = this.aDetail.inputMaintainerValue

      if (validIp(inputMaintainerValue)) {
        if (this.aDetail.ip_manage.toString().indexOf([this.select,inputMaintainerValue].toString()) == -1) {
          this.aDetail.ip_manage.push([this.select, inputMaintainerValue])
        }
      }
      this.inputMaintainerVisible = false
      this.aDetail.inputMaintainerValue = ''
    },
    maintainerTagsClose(index) {
      this.aDetail.ip_manage.splice(index, 1)
    },
    getValueFromChild(value1){
      this.aDetail.os_type=value1[0]
      this.aDetail.os_version=value1[1]
    }
  }
}
</script>
<style>
</style>

