<template>
  <div class="app-container">
    <workflow-title :name="newAppForm.routeParams && newAppForm.routeParams.name" :help_doc_url="help_doc_url"/>

    <div>
      <el-form  ref="newAppForm"
                :model="newAppForm"
                :rules="rules"
                label-width="130px"
                class="newAppForm"
                style="width:100%">
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="入职时间" prop="entryTime">
              <el-date-picker
                v-model="newAppForm.entryTime"
                type="date"
                class="form-item"
                :clearable=false
                value-format="yyyy-MM-dd"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="访问时间范围" prop="timeRange">
              <range-date
                v-model="newAppForm.timeRange"
                type="daterange"
                class="form-item"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :clearable="false"
                :editable="false"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="申请访问数据库" prop="databaseType1" required>
              <el-radio v-model="newAppForm.databaseType1" label="测试数据库">测试数据库</el-radio>
              <el-radio v-model="newAppForm.databaseType1" label="生产数据库">生产数据库</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="客户端IP地址" prop="Cip">
              <el-select
                class="form-item"
                v-model="newAppForm.Cip"
                filterable
                clearable
                multiple
                :multiple-limit="5"
                placeholder="请选择客户端IP">
                <el-option-group
                v-for="(group, index) in tableData"
                  :key="index"
                  :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.ip"
                      :label="item.ip"
                      :value="item.ip">
                    </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="数据库信息" prop="configinfo" required>
              <label slot="label">
<!--                <el-tooltip class="item" effect="dark" placement="top-end">-->
<!--                  <div slot="content">最大支持5个数据库</div>-->
<!--                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>-->
<!--                </el-tooltip>-->
                数据库信息
              </label>
              <div>
                <el-table :data="newAppForm.configinfo" class="mytable">
                  <el-table-column prop="MorO" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.MorO'" :rules="rules1.MorO">
                        <el-select v-model="scope.row.MorO"
                                   style="width: 100%;"
                                   class="myselect2"
                                   @change="changedbtype(scope.row)"
                                   filterable
                                   allow-create
                        >
                          <el-option label="Mysql" value="Mysql"/>
                          <el-option label="Oracle" value="Oracle"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="db" label="数据库" align="center" min-width="5">
                    <template slot-scope="scope">
                      <el-form-item v-if="['Oracle', 'Mysql'].includes(scope.row.MorO)" :prop="'configinfo.' + scope.$index + '.db'" :rules="rules1.db">
                        <el-cascader :key="scope.row.MorO" expand-trigger="hover"
                                     :options="scope.row.MorO === 'Mysql' ? dboptions : dboptions_oracle"
                                     :props="{ multiple: true }"
                                     v-model="scope.row.db"
                                     filterable
                                     clearable
                                     style="width:100%;">
                        </el-cascader>
                      </el-form-item>
                      <el-form-item v-else>
                        <el-select
                          v-model="scope.row.db"
                          multiple
                          filterable
                          allow-create
                          placeholder="请选择数据库">
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="db_name" label="库名/Schema"  align="center" min-width="3">
                    <template slot="header">
                      <label slot="label">库名/Schema
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">如果是Oracle数据库，库名填表的所属用户即可</div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.db_name'" :rules="rules1.db_name">
                        <el-input v-model="scope.row.db_name" placeholder="请输入库名/Schema" style="width: 100%;"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="table_name" label="表名"  align="center" min-width="4">
                    <template slot="header">
                      <label slot="label">表名
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">先选择all 或 other<br/>
                            默认为all，为所有表<br/>
                            选择other，需输入表名，多表名用英文逗号分隔
                          </div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.table_name'" :rules="scope.row.table === 'other' ? rules1.table_name : {required:false}">
                        <el-input v-model="scope.row.table_name" placeholder="多表名,分隔" style="width: 100%;" class="myinput" :disabled="scope.row.table !== 'other'">
                          <el-select v-model="scope.row.table" slot="prepend" style="width: 85px;" class="myselect2">
                            <el-option label="all" value="all"/>
                            <el-option label="other" value="other"/>
                          </el-select>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="permissions" label="权限"  align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.permissions'" :rules="rules1.permissions">
                        <el-select v-model="scope.row.permissions" multiple clearable style="width: 100%;" class="myselect">
                          <el-option-group
                            v-for="group in scope.row.MorO=='Oracle'?permissionsoptions_oracle:permissionsoptions_mysql"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                              v-for="item in group.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-option-group>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="接入数据库原因">
              <el-input v-model="newAppForm.reason" type="textarea" placeholder="请填写申请原因" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="特殊访问需求">
              <el-input v-model="newAppForm.accessRequirements" type="textarea" placeholder="特殊访问需求" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
          <el-button v-if="this.newAppForm.routeParams && this.newAppForm.routeParams.uuid" type="primary" @click="submitEditForm(1)" :loading="buttondisabled">保存草稿</el-button>
          <el-button v-else type="primary" @click="saveDraftsForm" :loading="buttondisabled">保存草稿</el-button>
          <el-button @click="resetForm('newAppForm')">重置</el-button>
          <el-button v-if="this.newAppForm.routeParams && this.newAppForm.routeParams.uuid" type="primary" @click="submitEditForm(0)" :loading="buttondisabled">提交草稿</el-button>
          <el-button v-else type="primary" @click="submitForm" :loading="buttondisabled">立即提交</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import RangeDate from './components/RangeDate'
  import workflowTitle from './components/Workflow_title'
  import {addWorkFlow, editWorkFlowConfRow, saveDraftsWorkFlow, getWFLine } from '@/api/workflow/app_manage';
  import { fetchIPList1 } from '@/api/cmdb';
  import {getmysqloracle} from '@/api/zabbix';
  import sessionNewAppForm from '@/components/mixins/sessionNewAppForm';
  import FormMixins from "./components/mixins/FormMixins";
  import { renderDraftsData1, resetForm } from "./components/mixins/renderdata1";
  import { outDocx } from './components/database_access_application/exportDocx';
  const configinfodict = {
      MorO:'Mysql',
      db:[],
      db_name:'',
      table_name:'',
      table:'other',
      permissions:[],
    }
  export default {
    mixins: [sessionNewAppForm, FormMixins],
    components: {RangeDate, workflowTitle},
    data() {
      const validatetable=(rule, value, callback) => {
        if (value) {
          if (/^([0-9A-Za-z_]+[,])*([0-9A-Za-z_]+)$/.test(value)) {
            callback()
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      }
      const rules = {
        entryTime:{required:true,message:"入职日期不能为空",trigger:"change"},
        timeRange:{required:true,message:"访问时间范围不能为空",trigger:"change"},
        Cip:{required:true,message:"客户端IP不能为空",trigger:"change"},
        databaseType:{required:true,message:"数据库类型不能为空",trigger:"change"},
      }
      const rules1 = {
        db:{type:"array",required:true,message:"不能为空",trigger:"change"},
        db_name:{type:"string",required:true,message:"不能为空",trigger:"blur"},
        table_name:[{type:"string",required:true,message:"不能为空",trigger:"blur"},{message: '多表名以英文逗号分隔',trigger: 'blur',validator: validatetable}],
          user_name:{type:"string",required:true,message:"不能为空",trigger:"blur"},
        permissions:{type:"array",required:true,message:"不能为空",trigger:"change"},
      }
      return {
        newAppForm: {
          entryTime: undefined,
          timeRange: undefined,
          ApplicationDate: undefined,
          databaseType1: '测试数据库',
          configinfo: [{...configinfodict}],
          Cip: undefined,
          reason: undefined,
          accessRequirements: undefined
        },
        rules: Object.freeze(rules),
        rules1: Object.freeze(rules1),
        tableData: [],
        permissionsoptions_mysql:[
          {
            label:'基础权限',
            options:[{label:'SELECT',value:'SELECT'},{label:'INSERT',value:'INSERT'},{label:'UPDATE',value:'UPDATE'},{label:'DELETE',value:'DELETE'}],
          },
          {
            label:'mysql其他权限',
            options:[{label:'ALTER',value:'ALTER'},{label:'CREATE',value:'CREATE'},{label:'TRUNCATE',value:'TRUNCATE'},{label:'DROP',value:'DROP'},
              {label:'REPLICATION CLIENT',value:'REPLICATION CLIENT'},{label:'REPLICATION SLAVE',value:'REPLICATION SLAVE'},{label:'EXECUTE',value:'EXECUTE'}],
          },
        ],
        permissionsoptions_oracle:[
          {
            label:'基础权限',
            options:[{label:'SELECT',value:'SELECT'},{label:'INSERT',value:'INSERT'},{label:'UPDATE',value:'UPDATE'},{label:'DELETE',value:'DELETE'}],
          },
          {
            label:'oracle其他权限',
            options:[{label:'ALTER',value:'ALTER'},{label:'DEBUG',value:'DEBUG'},{label:'EXECUTE',value:'EXECUTE'},{label:'MERGE VIEW',value:'MERGE VIEW'},
              {label:'ON COMMIT REFRESH',value:'ON COMMIT REFRESH'},{label:'QUERY REWRITE',value:'QUERY REWRITE'},{label:'REFERENCES',value:'REFERENCES'}],
          }
        ],
        buttondisabled: false,
        userInfo: undefined,
        dboptions_oracle: [],
        dboptions: []
      }
    },
    created() {
      this.newAppForm.ApplicationDate = this.initDate(0);
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        getmysqloracle().then(response => {
          this.dboptions = response.mysql
          this.dboptions_oracle = response.oracle
        })
        .catch((e) => {
          console.error(e);
        })
        fetchIPList1().then((res)=>{
          let list = [
             {label: '操作机IP',
              options: []
             },
             {
              label: '堡垒机IP',
              options: []
             }
          ]
          this.tableData = res.reduce((list, v) => {
            if(v.is_public_ip) {
              list[0].options.push(v)
            } else {
              list[1].options.push(v)
            }
            return list;
          }, list);
        })
        .catch((e) => {
          console.error(e);
        })
      },
      renderDraftsData1,
      resetForm,
      changedbtype(row){
        row.db = [];
      },
      // 立即提交
      submitForm(){
        this.$refs['newAppForm'].validate((valid) => {
          if (valid) {
            this.buttondisabled = true;
            addWorkFlow(this.newAppForm.routeParams.id, {...this.newAppForm, fullPath: this.$route.path})
              .then((res) => {
                this.notify('提交成功')
                outDocx(res, this.newAppForm).then(() => {
                  this.routeLeave('/workflow/workflow_list')
                })
                .catch((e) => {
                  this.$notify.error('下载失败')
                  console.error(e)
                });
              })
              .catch((e) => {
                console.error(e)
              })
          } else {
            this.validateFalse()
            return false
          }
        })
      },
      // 修改草稿、提交草稿
      submitEditForm(status) {
        this.$refs['newAppForm'].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            editWorkFlowConfRow(this.newAppForm.routeParams.uuid, {...this.newAppForm, fullPath: this.$route.path}, status).then(res => {
              this.notify('修改成功')
              // 修改完跳转至我的草稿页面
              if(status === 0) {
                outDocx(res, this.newAppForm).then(() => {
                  this.routeLeave('/workflow/workflow_list')
                })
              } else {
                this.routeLeave('/workflow/workflow_list');
              }
            }).catch(e => {
             console.error(e)
            })
          } else {
            this.validateFalse()
            return false
          }
        })
      },
      // 新增草稿保存
      saveDraftsForm() {
        this.$refs['newAppForm'].validate(valid => {
          if (valid) {
            this.buttondisabled = true
            saveDraftsWorkFlow(this.newAppForm.routeParams.id, {...this.newAppForm, fullPath: this.$route.fullPath}).then(response => {
              this.notify('草稿保存成功')
              this.routeLeave('/workflow/workflow_list')
            })
              .catch(err => {
                console.error(err)
              })
          }
          else {
            this.validateFalse()
            return false
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .form-item{
    width: 100%;
  }
</style>
