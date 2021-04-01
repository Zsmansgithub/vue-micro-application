<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
      </el-col>
    </div>
    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="90px" class="newAppForm" style="width:100%">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <fieldset v-for="(item,index) in newAppForm.configinfo">
              <legend style="color:darkgray;">产品线{{index+1}}</legend>
              <el-row class="marginbottom">
                <el-col :span="5">
                  <el-form-item label="组织CN" label-width="70px" :prop="`configinfo.${index}.levelone`" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-autocomplete class="inline-input" v-model.trim="item.levelone" :fetch-suggestions="querySearch"
                      placeholder="请输入或选择组织" style="width: 100%" @select="getleveloneEN(item)" @input="getleveloneEN(item)">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="板块CN" :prop="`configinfo.${index}.leveltwo`" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-autocomplete class="inline-input" v-model.trim="item.leveltwo" :fetch-suggestions="((queryString,cb)=>{querySearch1(queryString,cb,item)})"
                      placeholder="请输入或选择板块" style="width: 100%" @select="getleveltwoEN(item)" @input="getleveltwoEN(item)">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="模块CN" label-width="70px" :prop="`configinfo.${index}.levelthree`" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-autocomplete class="inline-input" v-model.trim="item.levelthree" :fetch-suggestions="((queryString,cb)=>{querySearch2(queryString,cb,item)})"
                      placeholder="请输入或选择模块" style="width: 100%" @select="getlevelthreeEN(item)" @input="getlevelthreeEN(item)">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="子模块CN" :prop="`configinfo.${index}.levelfour`" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-autocomplete class="inline-input" v-model.trim="item.levelfour" :fetch-suggestions="((queryString,cb)=>{querySearch3(queryString,cb,item)})"
                      placeholder="请输入或选择子模块" style="width:100%" @select="getlevelfourEN(item)" @input="getlevelfourEN(item)">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align:center;">
                  <el-button type="primary" icon="el-icon-plus" @click="addDomain()" :disabled="newAppForm.configinfo.length>9"></el-button>
                </el-col>
              </el-row>
              <el-row class="marginbottom">
                <el-col :span="5">
                  <el-form-item label="组织EN" label-width="70px" :prop="`configinfo.${index}.levelone_EN`" :rules="[{type:'string',required:true,message:'不能为空',trigger:'change'},{validator: validateNoChinese}]">
                    <el-input v-model="item.levelone_EN" placeholder="请输入组织英文名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="板块EN" :prop="`configinfo.${index}.leveltwo_EN`" :rules="[{type:'string',required:true,message:'不能为空',trigger:'change'},{validator: validateNoChinese}]">
                    <el-input v-model="item.leveltwo_EN" placeholder="请输入板块英文名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="模块EN" label-width="70px" :prop="`configinfo.${index}.levelthree_EN`" :rules="[{type:'string',required:true,message:'不能为空',trigger:'change'},{validator: validateNoChinese}]">
                    <el-input v-model="item.levelthree_EN" placeholder="请输入模块英文名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="子模块EN" :prop="`configinfo.${index}.levelfour_EN`" :rules="[{type:'string',required:true,message:'不能为空',trigger:'change'},{validator: validateNoChinese}]">
                    <el-input v-model="item.levelfour_EN" placeholder="请输入子模块英文名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align:center;">
                  <el-button type="danger" icon="el-icon-delete" v-if="item.status !== 1" @click="removeDomain(item)" />
                </el-col>
              </el-row>
              <el-row class="marginbottom">
                <el-col :span="5">
                  <el-form-item label="仓库名称" label-width="70px" :prop="`configinfo.${index}.git_name`">
                    <el-input v-model="item.git_name" placeholder="请输入仓库名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="仓库地址" :prop="`configinfo.${index}.git_addr`">
                    <!-- <el-input v-model="item.git_addr" placeholder="请输入代码仓库"></el-input> -->
                    <el-autocomplete class="inline-input" v-model.trim="item.git_addr" :fetch-suggestions="((queryString,cb)=>{querySearchGit(queryString,cb,item)})"
                      placeholder="请输入或选择仓库地址" style="width:100%">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="仓库描述" :prop="`configinfo.${index}.git_desc`">
                    <el-input v-model="item.git_desc" placeholder="请输入仓库描述"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="2" style="text-align:center;">
                  <el-button type="danger" icon="el-icon-delete" v-if="item.status !== 1" @click="removeDomain(item)" />
                </el-col> -->
              </el-row>
              <el-row class="marginbottom">
                <el-col :span="5">
                  <el-form-item label="负责人" label-width="70px" :prop="`configinfo.${index}.user`" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                    <el-select v-model="item.user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
                      <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="'('+item.value+')'+item.label"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-form-item label="备注描述" :prop="`configinfo.${index}.desc`">
                    <el-input v-model="item.desc" placeholder="请输入备注描述"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
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
  import { getFields,getFieldsAlias } from '@/api/cmdbs/product_line'
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine,get_gitaddr} from '@/api/workflow/app_manage'
  import {getUserInfo} from '@/api/zabbix/user_info'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getHelpDocContent} from '@/api/management/help_doc'
  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        validateNoChinese:(rule, value, callback) => {
          if (value) {
            //不能有中文字符
            // if (/[\u4E00-\u9FA5]/g.test(value)) {
            //   callback(new Error('不能有中文字符!'))
            // } else {
            //   callback()
            // }
            // 数字字母下划线中划线
            if (/^[0-9A-Za-z_-]+$/.test(value)) {
              callback()
            } else {
              callback(new Error('格式不正确'))
            }
          } else {
            callback()
          }
        },
        buttondisabled:false,
        help_doc_url:'',
        newAppForm: {
          configinfo:[],
          desc:'',
          routeParams: '',
        },
        configinfodictadd: {
          levelone:'',
          leveltwo:'',
          levelthree:'',
          levelfour:'',
          levelone_EN:'',
          leveltwo_EN:'',
          levelthree_EN:'',
          levelfour_EN:'',
          user:'',
          git_name:'',
          git_addr:'',
          git_desc:'',
          desc:'',
          status:1,
        },
        fields_obj: '',
        leveloneOptions: [],
        fields_alias:[],
        userOptions:[],
        gitarray:[],
        rules: {},
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
      getUserInfo().then(response => {
        this.userOptions = response
      });
      getFields().then(response => {
        this.fields_obj = response
        this.leveloneOptions = []
        for(let k in response) {
          this.leveloneOptions.push({'value': k})
        }
      })
      getFieldsAlias().then(response => {
        this.fields_alias = response
      })
      get_gitaddr().then(response => {
        this.gitarray = response
      });
      this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))
      this.renderDraftsData()
    },
    methods: {
      // 渲染草稿数据
      renderDraftsData() {
        if(this.$route.params.detailData_edit){
          this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
          this.renderDraftsData1();
        }
      },
      renderDraftsData1() {
        try {
          this.newAppForm.configinfo = this.aDetail.configinfo
          this.newAppForm.desc = this.aDetail.desc
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
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
      //带输入建议
      querySearch(queryString, cb) {
        var levelone = this.leveloneOptions;
        var results = queryString ? levelone.filter(this.createFilter(queryString)) : levelone;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearch1(queryString, cb, row) {
        var leveltwo = [];
        if (row.levelone !== '') {
          for(let k in this.fields_obj[row.levelone]) {
            leveltwo.push({'value': k})
          }
        }
        var results = queryString ? leveltwo.filter(this.createFilter(queryString)) : leveltwo;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearch2(queryString, cb, row) {
        var levelthree = [];
        if (row.levelone !== '' && row.leveltwo !== '') {
          for(let k in this.fields_obj[row.levelone][row.leveltwo]) {
            levelthree.push({'value': k})
          }
        }
        var results = queryString ? levelthree.filter(this.createFilter(queryString)) : levelthree;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearch3(queryString, cb, row) {
        var levelfour = [];
        if (row.levelone !== '' && row.leveltwo !== '' && row.levelthree !== '') {
          for(let k in this.fields_obj[row.levelone][row.leveltwo][row.levelthree]) {
            levelfour.push({'value': k})
          }
        }
        var results = queryString ? levelfour.filter(this.createFilter(queryString)) : levelfour;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearchGit(queryString, cb, row) {
        var gitarray = [];
        for (var i = 0; i < this.gitarray.length; i++) {
          gitarray.push({'value': this.gitarray[i]})
        }
        var results = queryString ? gitarray.filter(this.createFilter(queryString)) : gitarray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      // createFilter(queryString) { //精确匹配
      //   return (data) => {
      //     return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      //   };
      // },
      createFilter(queryString) { //模糊匹配
        return (data) => {
          return data.value.toLowerCase().match(queryString.toLowerCase());
        };
      },
      getleveloneEN(item){
        item.levelone_EN = ''
        if (this.fields_alias[1][item.levelone]) {
          item.levelone_EN = this.fields_alias[1][item.levelone]
        }
      },
      getleveltwoEN(item){
        item.leveltwo_EN = ''
        if (this.fields_alias[2][item.leveltwo]) {
          item.leveltwo_EN = this.fields_alias[2][item.leveltwo]
        }
      },
      getlevelthreeEN(item){
        item.levelthree_EN = ''
        if (this.fields_alias[3][item.levelthree]) {
          item.levelthree_EN = this.fields_alias[3][item.levelthree]
        }
      },
      getlevelfourEN(item){
        item.levelfour_EN = ''
        if (this.fields_alias[4][item.levelfour]) {
          item.levelfour_EN = this.fields_alias[4][item.levelfour]
        }
      },
      // 新建流程单提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.buttondisabled = true
            addWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000,
              })
              this.buttondisabled = false
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
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
        }else{
          // this.newAppForm = this.$options.data().newAppForm;
          this.$refs[formName].resetFields()
          this.newAppForm.configinfo = [];
          this.newAppForm.configinfo.push(Object.assign({}, this.configinfodictadd))

        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push('/workflow/workflow_list');
              })
            }).catch(error => {
              // console.log(error)
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
      // 首次保存草稿,为新增数据
      saveDraftsForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.buttondisabled = true
            saveDraftsWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '草稿保存成功',
                type: 'success',
                duration: 3000,
              })
              this.buttondisabled = false
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
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
      getHelpDoc() {
        // getHelpDocContent(({board:'workflow',title:'新建申请单-'+this.$route.params.name})).then(response => {
        //   this.$router.push({name:"help_doc_preview", params: {content: response.content}})
        // })
        this.$router.push('/'+this.help_doc_url.split('/')[2])
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
  fieldset {
    padding: 3px;
    margin-bottom: 10px;
    border: 1px solid #e6ebf5;
    background: #fff;
  }
  .marginbottom{
    /deep/.el-form-item{margin-bottom:10px;}
  }
</style>
