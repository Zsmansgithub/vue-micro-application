<template>
  <div class="app-container">
    <fieldset>
      <el-row type="flex" justify="center">
        <el-col :span="3"></el-col>
        <el-col :span="1">
          <a class="el-dropdown-link" href="/vue/cmdb/batch_change_ip.xlsx">
            <el-button type="text">模板下载</el-button>
          </a>
        </el-col>
        <el-col :span="14">
        <div>
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="width:100%;" />
        </div>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>

      <div style="margin-top:20px">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form ref="ruleForm" :inline="true" :model="item" v-for="(item, index) in formData" :key="index" :rules="rules">
              <el-form-item prop="old_ip">
                <el-input v-model.trim="item.old_ip" clearable placeholder="当前IP"></el-input>
              </el-form-item>
              <el-form-item prop="new_ip">
                <el-input v-model.trim="item.new_ip" clearable placeholder="新IP"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-if="index==0" type="primary" icon="el-icon-plus" @click="addKey"></el-button>
                <el-button v-if="index==0" type="primary" icon="el-icon-check" @click="commitSuccess('ruleForm')">提交全部</el-button>
                <el-button v-else type="primary" icon="el-icon-minus" @click.prevent="removeKey(item)"></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

    <!-- <el-row>
    <el-col :span="24" class="col-1400-16 col-1400-offset-2">
    <el-form>
    <el-table :data="formData">
      <el-table-column label="当前IP" align="center" min-width="2">
        <template slot-scope="scope">
          <el-form-item :rules="{ required: true, trigger: 'change', validator: validateIpaddress }">
            <el-input v-model="scope.row.old_ip" style="width: 100%;"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="新IP"  align="center" min-width="2">
        <template slot-scope="scope">
          <el-form-item :rules="{ required: true, trigger: 'change', validator: validateIpaddress2 }">
            <el-input v-model="scope.row.new_op" style="width:100%"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" min-width="2">
        <template slot-scope="scope">
          <el-button v-if="scope.$index==0" type="primary" icon="el-icon-plus" size="small" @click="addKey"></el-button>
          <el-button v-if="scope.$index==0" type="primary" icon="el-icon-check" size="small" @click="commitSuccess('ruleForm')">提交全部</el-button>
          <el-button v-else type="primary" icon="el-icon-minus" size="small" @click.prevent="removeKey(item)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-form>
    </el-col>
    </el-row> -->

    <div>

    </div>
    </fieldset>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { validIp } from '@/utils/validate'
import { addValidation, changeIp } from '@/api/cmdbs/resourcemanage'

export default {
  name: 'BatchChangeIP',
  components: {
    UploadExcelComponent
  },

  data() {
    const validateIp = (rule, value, callback) => {
      if(value) {
        if(validIp(value)) {
          // callback()
        } else {
          return callback(new Error('IP填写不正确!'))
        }
      } else {
        return callback(new Error('请输入IP!'))
      }
    }
    const validateIpaddress = (rule, value, callback) => {
      if(value) {
        if(validIp(value)) {
          // callback()
        } else {
          return callback(new Error('IP填写不正确!'))
        }
      } else {
        return callback(new Error('请输入IP!'))
      }
      addValidation({old_ip: value}).then(response => {
        if (response.status == 400) {
          callback(new Error(response.msg))
        } else if (response.status == 200) {
          callback()
        }
      })
    }
    const validateIpaddress2 = (rule, value, callback) => {
      if(value) {
        if(validIp(value)) {
          // callback()
        } else {
          return callback(new Error('IP填写不正确!'))
        }
      } else {
        return callback(new Error('请输入IP!'))
      }
      addValidation({new_ip: value}).then(response => {
        if (response.status == 400) {
          callback(new Error(response.msg))
        } else if (response.status == 200) {
          callback()
        }
      })
    }

    return {
      formData: [{'old_ip': '', 'new_ip': ''}],
      rules: {
        'old_ip': [{ required: true, trigger: 'change', validator: validateIpaddress }],
        'new_ip': [{ required: true, trigger: 'change', validator: validateIpaddress2 }]
      }

    }
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters(['roles', 'name'])
  },
  filters: {},
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning',
      })
      return false
    },
    handleSuccess({results, header}) {
      for (let i=0;i<results.length-1;i++) {
        this.formData.push({old_ip: '', new_ip: ''})
      }
      setTimeout(() => {
        let data = []
        for (let i of results) {
          data.push({old_ip: i['当前IP'], new_ip: i['新IP']})
        }
        this.formData = data
      }, 1000)
      // this.header = header
    },

    removeKey(item) {
      var index = this.formData.indexOf(item)
      if (index !== -1) {
        this.formData.splice(index, 1)
      }
    },
    addKey() {
      this.formData.push({old_ip: '', new_ip: ''})
    },

    commitSuccess() {
      // this.$refs['ruleForm'].validate(valid => {
      //   if (valid) {
      //     alert('submit!');
      //   } else {
      //     this.$message({
      //       message: '请确认有问题的条目!',
      //       type: 'warning'
      //     });
      //     return false;
      //   }
      // })
      let data = []
      for (let i of this.formData) {
        if (i.old_ip && i.new_ip) {  //不要字符串为空的
          data.push(i)
        }
      }
      if (data.length > 0) {
        changeIp(data).then(response => {
          let title = '成功'
          let type ='success';
          if (response.failed == 0) {
            type = 'success'
            title = '成功'
          } else if (response.failed < response.sum) {
            type = 'warning'
            title = '警告'
          } else if (response.failed == response.sum) {
            type = 'error'
            title = '错误'
          }
          let detail = response.detail ? response.detail : ''
          this.$notify({
            message: response.msg + '! 操作成功：' + response.success + '条， 操作失败：' + response.failed + '条， 总数：' + response.sum + '条， 失败IP:' + detail,
            showClose: true,
            type: type,
            title: title,
            duration: 60000,
          });
        })
      } else {
        this.$message({
          message: '没有可提交的数据!',
          type: 'warning'
        })
      }

    },

  }
}
</script>

<style lang="scss" scoped>
  fieldset {
    margin: 0px 100px 10px 55px;
    padding: 20px;
    border-color: #DCDFE6;
    border-style: solid;
    border-width: 2px;
    border-radius: 8px;
    line-height: 20px;
    list-style: none;
  }

</style>