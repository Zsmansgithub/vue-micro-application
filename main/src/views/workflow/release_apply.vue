<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
          帮助指引</a>
        <h5 style="text-align:center;color:#606266">所有的资源成本将计入项目或团队成本</h5> <br>
      </el-col>
    </div>

    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm"
               style="width:100%">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="申请类型" prop="steplinestatus" required>
              <el-radio v-model="newAppForm.steplinestatus" label="0">应用发布</el-radio>
              <el-radio v-model="newAppForm.steplinestatus" label="1">静态发布</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row>
            <el-col :span="12" class="col-1400-8 col-1400-offset-2">
              <el-form-item label="发布类型" prop="release_type" required>
                <el-select v-model="newAppForm.release_type" placeholder="请选择发布类型" style="width: 100%;">
                  <el-option
                    v-for="item in releaseOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="col-1400-8">
              <el-form-item label="版本名称" prop="version" required>
                <el-input v-model="newAppForm.version" placeholder="请输入版本名称" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <div v-for="(item,index) in newAppForm.configinfo">
              <el-col :span="newAppForm.steplinestatus=='0'?18:21">
                <el-form-item label="产品线" :prop="`configinfo.${index}.project_name_list`" :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                  <label slot="label">
                    <el-tooltip class="item" effect="dark" content="" placement="top-end">
                      <div slot="content">如未找到应用，请提交“新应用申请单”
                      </div>
                      <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                    </el-tooltip>
                    应用名{{index+1}}
                  </label>
                  <el-cascader expand-trigger="hover"
                               :options="projectOptions"
                               v-model="item.project_name_list"
                               filterable
                               clearable
                               :filter-method="filterMethod"
                               style="width:100%;"
                               placeholder="请选择产品线及应用名"
                               @change="getApptype(item)">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="3" v-if="newAppForm.steplinestatus=='0'" style="text-align:center;height:100%;">
                <!-- <span v-if="item.app_type">{{item.app_type}}</span>
                <span v-else>应用类型</span> -->
                <el-form-item :prop="`configinfo.${index}.app_type`" label-width="0">
                  <el-select v-model="item.app_type" placeholder="应用类型" style="width: 100%;" disabled>
                    <el-option label="was应用" value="was应用"></el-option>
                    <el-option label="非was应用" value="非was应用"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="text-align:center;">
                <el-button-group>
                  <el-button type="primary" icon="el-icon-plus" @click="addDomain()" :disabled="newAppForm.configinfo.length>9"></el-button>
                  <el-button type="danger" icon="el-icon-delete" v-if="item.status !== 1" @click="removeDomain(item)" />
                </el-button-group>
              </el-col>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="需求描述" prop="needdesc" required>
              <el-input v-model="newAppForm.needdesc" type="textarea" placeholder="请填写需求描述" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="风险说明" prop="dangerdesc" required>
              <el-input v-model="newAppForm.dangerdesc" type="textarea" placeholder="请填写风险说明" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '1'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="期望时间" prop="expecteddate" required>
              <el-date-picker
                v-model="newAppForm.expecteddate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable='false'
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="是否分批" prop="is_fenpi">
              <el-switch v-model="newAppForm.is_fenpi" active-text="是" inactive-text="否" active-value="1" inactive-value="0"
              @change="newAppForm.fenpidate = '',newAppForm.fenpipercent = 0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="期望时间" prop="expecteddate" required>
              <el-date-picker
                v-model="newAppForm.expecteddate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable='false'
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '0' && newAppForm.is_fenpi == '1'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="分批时间" prop="fenpidate" required>
              <el-date-picker
                v-model="newAppForm.fenpidate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable='false'
                style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="分批比例" prop="fenpipercent" required>
              <el-slider v-model="newAppForm.fenpipercent" :format-tooltip="formatTooltip"></el-slider>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="是否配置变更" prop="conf_edit">
              <el-switch v-model="newAppForm.conf_edit" active-text="是" inactive-text="否" active-value="1" inactive-value="0" @change="confalertmessage"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="是否sql变更" prop="sql_edit">
              <el-switch v-model="newAppForm.sql_edit" active-text="是" inactive-text="否" active-value="1" inactive-value="0" @change="sqlalertmessage"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" placeholder="如需其他配置,请写在备注描述" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="选择包日期" prop="BaoDate">
              <el-date-picker
                v-model="newAppForm.BaoDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyyMMdd"
                style="width: 100%;"
                :clearable="false"
                @change="selectBaoOptions(newAppForm.BaoDate)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="选择包名称" prop="BaoName">
              <el-select v-model="newAppForm.BaoName" clearable multiple placeholder="请选择日期后,再选择包" style="width: 100%;">
                <el-option
                  v-for="item in BaoOptions"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item>
              <el-upload
                class="upload-demo"
                action="/dev-api/archery/uploadFiles"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleChange"
                :before-upload="beforeUpload"
                multiple
                :limit="10"
                :on-exceed="handleExceed"
                :file-list="newAppForm.fileList">
                <el-button size="small" type="primary"><i class="el-icon-upload2"></i> 上传包</el-button>
                <div slot="tip" class="el-upload__tip">上传包日期为当前日期</div>
                <!-- 可上传附件，且单个文件不超过5M -->
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" class="col-1400-8">
            <el-form-item label="选择包" prop="BaoName" required>
              <el-select v-model="newAppForm.BaoName" placeholder="请选择包" style="width: 100%;">
                <el-option
                  v-for="item in BaoOptions"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="saveDraftsForm('newAppForm')" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :loading="buttondisabled">保存草稿</el-button>
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="submitForm('newAppForm')" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :loading="buttondisabled">提交草稿</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {fetchIPList} from '@/api/cmdb'
  import {fetchAppInfo} from '@/api/cmdbs/app_manage'
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow, getWFLine,select_bao} from '@/api/workflow/app_manage'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import {getHelpDocContent} from '@/api/management/help_doc'

  export default {
    name: 'AppApplyForm',
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        aDetail: {},
        help_doc_url: '',
        projectOptions: [],
        BaoOptions:[],
        buttondisabled:false,
        releaseOptions: [{value: '双周产品发布', label: '双周产品发布'}, {value: '单周产品发布', label: '单周产品发布'}, {value: '紧急产品发布', label: '紧急产品发布'},
        {value: '试点产品发布', label: '试点产品发布'},{value: 'BUG修复优化发布', label: 'BUG修复优化发布'},{value: '耦合性需求发布', label: '耦合性需求发布'}],
        newAppForm: {
          steplinestatus:'0',
          release_type:'',
          version:'',
          configinfo: [],
          is_fenpi:'0',
          expecteddate: '',
          fenpidate:'',
          fenpipercent:0,
          conf_edit:'0',
          sql_edit:'0',
          needdesc:'',
          dangerdesc:'',
          desc: '',
          BaoDate:'',
          BaoName:[],
          fileList: [],
          routeParams: '',
        },
        configinfodictadd:{
          project_name_list:[],
          app_id: '',
          app_cname:'',
          app_name:'',
          app_type:'',
          status:1,
        },
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now()
          }
        },
        rules: {

        },
      }
    },
    created() {
      if(!this.newAppForm.routeParams || !this.newAppForm.routeParams.id || !this.newAppForm.routeParams.name) {
        this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
          this.$router.push('/workflow/app_manage');
        })
      }
      this.$route.params.id = this.$route.params.id || this.newAppForm.routeParams.id
      this.$route.params.name = this.$route.params.name || this.newAppForm.routeParams.name
      this.$route.params.uuid = this.$route.params.uuid || this.newAppForm.routeParams.uuid
      // 判断跳转时获取的ID，在根据id渲染
      if (this.$route.params.id) {
        getWFLine(this.$route.params.id).then(response => {
          if(response.status==1){
            this.$router.push('/404')
          }
          this.help_doc_url = response.help_url
        })
      }
      this.newAppForm.expecteddate = this.initDate(1);
      this.newAppForm.BaoDate = this.initDate2(0);
      this.selectBaoOptions(this.newAppForm.BaoDate)
      this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
      getProductAppCascader().then(response => {
        this.projectOptions = response;
      })
      this.renderDraftsData()
    },
    methods: {
      renderDraftsData() {
        if (this.$route.params.detailData_edit) {
          this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
          this.renderDraftsData1();
        }
      },
      renderDraftsData1() {
        try {
          this.newAppForm.steplinestatus = this.aDetail.steplinestatus
          this.newAppForm.release_type = this.aDetail.release_type
          this.newAppForm.version = this.aDetail.version
          this.newAppForm.configinfo = this.aDetail.configinfo
          this.newAppForm.expecteddate = this.aDetail.expecteddate
          this.newAppForm.needdesc = this.aDetail.needdesc
          this.newAppForm.dangerdesc = this.aDetail.dangerdesc
          this.newAppForm.desc = this.aDetail.desc
          // if(this.aDetail.project_name_list[3]) this.getApptype()
          this.newAppForm.BaoDate = this.aDetail.BaoDate
          if(this.aDetail.BaoDate) this.selectBaoOptions(this.aDetail.BaoDate)
          this.newAppForm.BaoName = this.aDetail.BaoName
          this.newAppForm.fileList = this.aDetail.fileList
        } catch (error) {
          // TODO 异常情况如何处理
          // console.log(this.$route.params.detailData_edit);
          console.log(error);
        }
      },
      addDomain() {
        const configinfo = Object.assign({}, this.configinfodictadd)
        configinfo.status = 2
        this.newAppForm.configinfo.push(configinfo)
      },
      removeDomain(item) {
        var index = this.newAppForm.configinfo.indexOf(item)
        if (index !== -1) {
          this.newAppForm.configinfo.splice(index, 1)
        }
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newAppForm.app_name = ''
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              if ( i == 2&&i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name) {
                this.newAppForm.app_name = this.newAppForm.app_name + '……'
                break;
              }
              if(i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name){
                this.newAppForm.app_name = this.newAppForm.app_name + ','
              }
            }
            this.buttondisabled = true
            editWorkFlowConfRow(this.$route.params.uuid, this.newAppForm, status).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.buttondisabled = false
              // 修改完跳转至我的草稿页面
              this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
                this.$router.push('/workflow/workflow_list');
              })
            }).catch(error => {
              // if (error.response.data.path == 'url_check with this record already exists.') {
              //   this.$notify({
              //     title: '修改失败',
              //     message: '该记录已存在，请勿重复添加',
              //     type: 'error',
              //     duration: 3000
              //   })
              // }
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

      // 保存草稿
      saveDraftsForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.newAppForm.app_name = ''
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              if ( i == 2&&i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name) {
                this.newAppForm.app_name = this.newAppForm.app_name + '……'
                break;
              }
              if(i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name){
                this.newAppForm.app_name = this.newAppForm.app_name + ','
              }
            }
            this.buttondisabled = true
            saveDraftsWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '草稿保存成功',
                type: 'success',
                duration: 3000,
              })
              this.buttondisabled = false
              this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
                this.$router.push('/workflow/workflow_list');
              })
            }).catch(err => {
              // this.$message({
              //   message: err.errError,
              // })
              console.log(err)
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newAppForm.app_name = ''
            for (var i = 0; i < this.newAppForm.configinfo.length; i++) {
              this.newAppForm.app_name = this.newAppForm.app_name + this.newAppForm.configinfo[i].app_name
              if ( i == 2&&i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name) {
                this.newAppForm.app_name = this.newAppForm.app_name + '……'
                break;
              }
              if(i !== this.newAppForm.configinfo.length-1&&this.newAppForm.configinfo[i+1].app_name){
                this.newAppForm.app_name = this.newAppForm.app_name + ','
              }
            }
            this.buttondisabled = true
            addWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              })
              this.buttondisabled = false
              this.$store.dispatch('tagsView/delView', this.$route).then(({visitedViews}) => {
                this.$router.push('/workflow/workflow_list');
              })
            }).catch(err => {
              console.log(err)
              this.$notify({
                message: '提交异常！'
              })
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
        const sessionData = sessionStorage.getItem(this.sessionKey)
        if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
          this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
          this.renderDraftsData1()
        } else {
          this.newAppForm.fileList = []
          this.$refs[formName].resetFields()
          this.newAppForm.expecteddate = this.initDate(1);
          this.newAppForm.BaoDate = this.initDate2(0);
          this.newAppForm.configinfo = [];
          this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd));
          this.selectBaoOptions(this.newAppForm.BaoDate)
          // this.$refs.childMethod.resetForm()
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
      },
      getApptype(item) {
        // 当clearable应用的输入框
        if (item.project_name_list.length == 0) {
          item.app_id = ''
          item.app_name = ''
          item.app_cname = ''
          item.app_type = ''
          return
        }
        item.app_id = item.project_name_list[3]
        fetchAppInfo(item.app_id).then(response => {
          item.app_name = response.app_name
          item.app_cname = response.app_cname
          var app_type = response.app_type
          if (app_type.toLowerCase() == 'was') {
            item.app_type = 'was应用'
          } else{
            item.app_type = '非was应用'
          }
        })
      },
      selectBaoOptions(date){
        this.BaoOptions = []
        this.newAppForm.BaoName = ''
        select_bao({datetime:date}).then(response => {
          this.BaoOptions = response.data
        })
      },
      formatTooltip(val) {
        return val + '%';
      },
      initDate2(num = 1) {
        const nowDate = new Date()
        let initDate = ''
        nowDate.setDate(nowDate.getDate() + num)
        const nowMonth = ((nowDate.getMonth() + 1) < 10) ? '0' + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1)
        const nowDay = (nowDate.getDate() < 10) ? '0' + nowDate.getDate() : nowDate.getDate()
        initDate = nowDate.getFullYear() + nowMonth + nowDay
        return initDate
      },
      sqlalertmessage(){
        if (this.newAppForm.sql_edit == '1') {
          this.$alert('请确认上述sql变更完成', '注意事项', {confirmButtonText: '确定',});
        }
      },
      confalertmessage(){
        if (this.newAppForm.conf_edit == '1') {
          this.$alert('请确认上述配置变更完成', '注意事项', {confirmButtonText: '确定',});
        }
      },
      getHelpDoc() {
        // getHelpDocContent({board:'workflow',title:'新建申请单-'+this.$route.params.name}).then(response => {
        //   this.$router.push({name:"help_doc_preview", params: {content: response.content}})
        // })
        this.$router.push('/' + this.help_doc_url.split('/')[2])
      },
      filterMethod(node, keyword){
        keyword = keyword.toLowerCase() // 搜索关键字转为小写
        const { text, path } = node;
        // return text.includes(keyword) || path.includes(keyword);
        return text.toLowerCase().includes(keyword)
      },
      handleRemove(file, fileList) {
        this.newAppForm.fileList = []
        this.newAppForm.fileList = fileList
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (file.status == 'ready') {
          return
        }
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleChange(response, file, fileList) {
        this.newAppForm.fileList = []
        this.newAppForm.fileList = fileList
        //上传包后，改变选择包options
        this.selectBaoOptions(this.newAppForm.BaoDate)
      },
      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-search-class {
    max-width: 500px;
  }

  .help-svg-pointer:hover {
    cursor: pointer;
  }

  a {
    color: #1890ff;
  }
</style>
