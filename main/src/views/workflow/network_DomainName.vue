<template>
  <div class="app-container">
    <!-- <div>
      <el-col :span="12" :xs="20" :offset="3">
        <h3 style="text-align:center;color:#48096b">圆通域名申请单</h3>
        <br>
      </el-col>
    </div> -->
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">圆通域名申请单</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:8px;" @click="getHelpDoc">帮助指引</a>
      </el-col>
    </div>

    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm"
               style="width:100%">
        <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item label="主机记录" prop="host_record">
              <label slot="label">主机记录
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">主机记录就是域名前缀，常见用法有(以域名为aliyun.com为例):<br/>
                    www：解析后的域名为www.aliyun.com<br/>
                    @：直接解析主域名 aliyun.com<br/>
                    *：泛解析，匹配其他所有域名 *.aliyun.com<br/>
                    mail：将域名解析为mail.aliyun.com，通常用于解析邮箱服务器<br/>
                    二级域名：如：abc.aliyun.com，填写abc<br/>
                    手机网站：如：m.aliyun.com，填写m<br/>
                    显性URL：不支持泛解析（泛解析：将所有子域名解析到同一地址）</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px;margin-top: 10px"/>
                </el-tooltip>
              </label>
              <el-input v-model.trim="newAppForm.host_record" placeholder="请输入主机记录"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="11">
            <el-form-item label="域名" prop="domain_name"  required>
              <el-select
                v-model="newAppForm.domain_name"
                filterable
                clearable
                placeholder="请选择域名"
                style="width: 100%;">
                <el-option
                  v-for="item in DomainList"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item label="类型" prop="type">
              <el-select v-model="newAppForm.type" clearable placeholder="请选择类型" style="width: 100%;">
                <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="11">
            <!-- <el-form-item label="线路" prop="line">
              <label slot="label">线路
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">如果只有一个IP地址或CNAME域名，请务必选择[默认]<br/>
                    默认：必填！未匹配到智能解析线路时，返回[默认]线路设置结果<br/>
                    境外：向除中国大陆以外的其他国家和地区，返回设置的记录值<br/>
                    搜索引擎：向搜索引擎爬虫的DNS，返回设置的记录值</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px;margin-top: 10px"/>
                </el-tooltip>
              </label>
              <el-select v-model="newAppForm.line" clearable placeholder="请选择线路" style="width: 100%">
                <el-option v-for="item in lineOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="记录值" prop="record">
              <el-input v-model.trim="newAppForm.record" placeholder="请输入记录值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item label="记录值" prop="record">
              <el-input v-model.trim="newAppForm.record" placeholder="请输入记录值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="11">
            <el-form-item  label="TTL" prop="TTL">
              <el-select v-model="newAppForm.TTL" popper-class="app-search-class" style="width: 100%;">
                <el-option label="1秒" value="1秒"/>
                <el-option label="5秒" value="5秒"/>
                <el-option label="10秒" value="10秒"/>
                <el-option label="1分钟" value="1分钟"/>
                <el-option label="2分钟" value="2分钟"/>
                <el-option label="10分钟" value="10分钟"/>
                <el-option label="30分钟" value="30分钟"/>
                <el-option label="1小时" value="1小时"/>
                <el-option label="12小时" value="12小时"/>
                <el-option label="1天" value="1天"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :xs="11" :offset="2">
            <el-form-item label="出口链路" prop="yto_line">
              <el-select v-model="newAppForm.yto_line" clearable style="width: 100%">
                <el-option v-for="item in ytoLineOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="16" :xs="22" :offset="2">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align: right" :span="18" :xs="24">
            <el-form-item>
              <el-button v-if="this.$route.params.id == null" type="primary" @click="saveDraftsForm('newAppForm')">保存草稿</el-button>
              <el-button v-else type="primary" @click="saveDrafts('newAppForm',status=1,step_line)">保存草稿</el-button>
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <el-button v-if="this.$route.params.id == null" type="primary" @click="submitForm('newAppForm')">立即提交</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',status=0)">提交草稿</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import {fetchDomainList,fetchTypeInfo} from '@/api/cainiao/domain'
  import {getWFLine} from '@/api/workflow/app_manage'
  import { getHelpDocContent } from '@/api/management/help_doc'
  //TODO 这个需要对表进行重新设计，因为存在一次申请多个应用的服务器的情况，系统版本可能也需要拉下来，这个针对windows 需要有特殊设置
  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize],
    data() {
      return {
        DomainList: [],
        typeOptions:[],
        lineOptions:[],
        ytoLineOptions:[],
        newAppForm: {
          host_record:'',
          domain_name: '',
          type:'A',
          line:'default',
          record:'',
          TTL:'10分钟',
          yto_line:'',
          desc:'',
        },
        rules: {
        },
      }
    },
    created() {
      getWFLine(7).then(response => {
        if(response.status==1){
          this.$router.push('/404')
        }
      })
      // 域名列表
      fetchDomainList().then(response => {
        // this.DomainList = response.results
        for (const i of response.results) {
          this.DomainList.push({
            key: i.id, label: i.domainname
          })
        }
        // console.log(this.DomainList)
      })
      //线路、类型、出口链路列表
      fetchTypeInfo().then(res=>{
        for (let i of res) {
          // if (i.typename==='Dns_Record_Line'){
          //   this.lineOptions.push({
          //     label:i.displayname,key:i.value_or_code
          //   })
          // }else
          if (i.typename==='Dns_Record_Type'){
            this.typeOptions.push({
              label:i.displayname,key:i.value_or_code
            })
          }
          // else if (i.typename==='YTO_Line'){
          //   this.ytoLineOptions.push({
          //     label:i.displayname,key:i.value_or_code
          //   })
          // }
        }
      })
    },
    methods: {
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addWorkFlow(6, this.newAppForm)
              .then(response => {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 3000,
                })
                this.$refs[formName].resetFields()
              })
              .catch(err => {
                // this.$message({
                //   message: err.errError,
                // })
                console.log(err)
              })
          } else {
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            })
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        // alert(rowEdit.desc)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //提交草稿时，需要传入的6为该类型的申请单对应的node表中的node_id=start对应的id值
            editWorkFlowConfRow(this.$route.params.id, this.newAppForm, status, this.$route.params.node_id).then(response => {
              // editWorkFlowConfRow(rowEditNew.id, this.rowEdit, 0, 1).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              // 修改完跳转至我的草稿页面
              this.$router.push({path: `/workflow/workflow_list`})
              this.getList3()
            }).catch(error => {
              if (error.response.data.path == 'url_check with this record already exists.') {
                this.$notify({
                  title: '修改失败',
                  message: '该记录已存在，请勿重复添加',
                  type: 'error',
                  duration: 3000
                })
              }
            })
          } else {
            this.$message({
              message: '请填写必要的标题和内容',
              type: 'warning',
            })
            return false
          }
        })
      },

      // 首次保存草稿,为新增数据
      saveDraftsForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
          saveDraftsWorkFlow(6, this.newAppForm)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '草稿保存成功',
                type: 'success',
                duration: 3000,
              })
              this.$refs[formName].resetFields()
            })
            .catch(err => {
              // this.$message({
              //   message: err.errError,
              // })
              console.log(err)
            })
        }
        else {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning',
          })
          return false
        }
        })
      },
      // 修改草稿后，再次保存草稿
      saveDrafts(formName, status) {
        // alert(this.$route.params.node_id)
        if (this.newAppForm.app_name != '') {
          editWorkFlowConfRow(this.$route.params.id, this.newAppForm, status, this.$route.params.node_id).then(response => {
            this.$notify({
              title: '成功',
              message: '草稿保存成功',
              type: 'success',
              duration: 3000,
            })
            this.$refs[formName].resetFields()
            // 修改完跳转至我的草稿页面
            this.$router.push({path: `/workflow/workflow_list`})
          })
            .catch(err => {
              console.log(err)
            })
        }
        else {
          this.$message({
            message: '请至少填写【应用英文名】',
            type: 'warning',
          })
          return false
        }
      },

      getHelpDoc() {
        getHelpDocContent(({board:'workflow',title:'新建申请单-域名申请'})).then(response => {
          this.$router.push({name:"help_doc_preview", params: {content: response.content}})
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .app-search-class {
    max-width: 300px;
  }

  .config_os > label {
    padding-right: 1px;
  }

  .help-svg-pointer:hover {
    cursor: pointer;
  }
  a{
    color: #1890ff;
  }
</style>
