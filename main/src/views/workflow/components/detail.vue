<template>
  <div>
    <el-dialog :title="previewFileName" :visible.sync="dialogFileVisible" width="80%" top="7.5vh" @close="closeFile">
      <iframe v-if='wordSrc' :src="wordSrc" style="width: 100%;min-height: 600px;"></iframe>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="closeFile">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确认框" :visible.sync="dialogFormVisible" width="30%" :before-close="dialogClose">
      <el-form ref="ackForm" :model="ackForm" :rules="rules">
        <el-form-item label="请输入审批意见" prop="comments" required>
          <el-input v-model="ackForm.comments" type="textarea"/>
        </el-form-item>
        <el-form-item v-if="ackForm.hand_name == '沟通'" label="沟通对象" prop="uuid_user" required>
          <el-select v-model="ackForm.uuid_user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ackForm.hand_name == '转办'" label="转办对象" prop="user" required>
          <el-select v-model="ackForm.user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/dev-api/workflow/workflow_upload_file_first"
            :http-request="myUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleChange"
            :before-upload="beforeUpload"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="ackForm.file_json">
            <el-button size="small" type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">可上传附件，且单个文件不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-tooltip v-if="ackForm.hand_name == '驳回'" content="重新提交可回到当前节点" placement="top">
          <el-button v-if="ackForm.hand_name == '驳回'" type="primary" @click="updateCommon2('ackForm')" :loading="buttondisabled">打回再提交</el-button>
        </el-tooltip>
        <el-button @click="dialogClose">取 消</el-button>
        <el-button v-if="ackForm.hand_name == '沟通' || ackForm.hand_name == '回复'" type="primary" @click="updateCommon3('ackForm')" :loading="buttondisabled">确 定</el-button>
        <!-- <el-button v-else-if="ackForm.hand_name == '驳回'" type="primary" @click="updateCommon('ackForm')">驳 回</el-button>
        <el-button v-else type="primary" @click="updateCommon('ackForm')">确 定</el-button> -->
        <el-button v-else-if="ackForm.hand_name == '同意'" type="primary" @click="updateCommon1('ackForm')" :loading="buttondisabled">确 定</el-button>
        <el-button v-else-if="ackForm.hand_name !== '驳回'" type="primary" @click="updateCommon('ackForm')" :loading="buttondisabled">确 定</el-button>
        <el-tooltip v-if="ackForm.hand_name == '驳回'" content="驳回后该申请单将关闭不能再提交" placement="top">
          <el-button v-if="ackForm.hand_name == '驳回'" type="primary" @click="updateCommon1('ackForm')" :loading="buttondisabled">驳 回</el-button>
        </el-tooltip>
      </div>
    </el-dialog>

    <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="15" :offset="2">
      <el-row class="detailtitle" style="width:inherit;"> <!-- 继承父元素宽度，但有侧边栏时对不齐 -->
        <el-col style="width:3rem;" align="left">
          <el-button type="text" icon="el-icon-back" @click="handleReset">返回</el-button>
        </el-col>
        <el-col style="width:calc(100% - 19rem);" align="center">
          <!-- <span>{{ this.$route.params.detailData | titleText }}</span> -->
          <div v-if="this.$route.params.detailData.node_handle">
            <el-button type="text" icon="el-icon-d-arrow-left" @click.native="handlepre()">上个待办工单</el-button>
            <span style="color:#000000;"> | </span>
            <el-button type="text" @click.native="handlenext()">下个待办工单<i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
          </div>
          <div v-else>&nbsp;</div>
        </el-col>
        <el-col style="width:16rem;" align="right">
          <!-- 行内元素 换行会自动添加空白节点,影响前端显示 -->
          <div v-if="this.$route.params.detailData.node_handle">
            <el-button :type="button(item)" plain v-for="(item, index) in this.$route.params.detailData.node_handle" v-if="index < 2" :key="index"
                       @click="open(item)">{{item.name}}
            </el-button><el-dropdown><el-button type="primary" plain class="buttonmore">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in this.$route.params.detailData.node_handle" v-if="index > 1" @click.native="open(item)">{{item.name}}</el-dropdown-item>
                <el-dropdown-item v-if="this.$route.params.detailData.node_handle[0].name == '同意'"
                                  @click.native="handleShowother($route.params.detailData.node_handle[0].ID)">转办</el-dropdown-item>
                <el-dropdown-item v-if="this.$route.params.detailData.node_handle[0].name == '同意'"
                                  @click.native="updateCommon4($route.params.detailData.node_handle[0].ID)">认领</el-dropdown-item>
                <el-dropdown-item @click.native="handleding()">督办提醒</el-dropdown-item>
                <!-- Redis 到 数据库组实施的节点时，同步到cachecloud -->
                <el-dropdown-item v-if="this.$route.params.detailData.status==0 && this.$route.params.detailData.node_id == 125 && this.$route.path=='/workflow/Redis_detail'" @click.native="handlecachecloud()">同步到cachecloud</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- Redis申请 审批完成后,手动同步cachecloud按钮 -->
          <!-- <div v-if="this.$route.params.detailData.status==3 && this.$route.params.detailData.node_id_node_id=='end' && this.$route.path=='/workflow/Redis_detail'">
            <el-button type="primary" plain @click.native="handlecachecloud()">同步到cachecloud</el-button>
          </div> -->
        </el-col>
      </el-row>

      <div style="height:3.5rem;"></div> <!-- 空出标题位置 -->
      <el-card shadow="never" class="el-card_in_edit">
        <table border="0" cellspacing="0" cellpadding="10" width="100%" style="font-size:0.9375rem;">
          <col width="100%"/>
          <tr align="left">
            <td align="center"><b>{{this.$route.params.detailData | titleText}}</b></td>
          </tr>
        </table>
      </el-card>
      <el-card shadow="never" class="el-card_in_edit" style="border-top:0.2rem #67C23A solid;">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="detail_info" class="svgstyle"/>
          <label style="font-size:0.9375rem;">基础信息</label>
        </div>
        <table border="0" cellspacing="0" cellpadding="10" width="100%" style="font-size:0.9375rem;">
          <col width="33%"/><col width="33%"/><col width="34%"/>
          <tr align="left">
            <td v-if="this.network.indexOf(this.$route.params.detailData.step_line)!==-1">
              <b>申请单号：</b><el-button type="text" style="color:#303133;user-select:unset;padding:0;" @click="networkworkflow">{{this.$route.params.detailData.uuid}}</el-button>
            </td>
            <td v-else><b>申请单号：</b>{{this.$route.params.detailData.uuid}}</td>
            <td><b>申请人：</b> {{this.$route.params.detailData.create_user_id}} {{this.$route.params.detailData.create_user_name}}</td>
            <td><b>申请时间：</b> {{this.$route.params.detailData.create_time}}</td>
          </tr>
          <tr align="left">
            <td colspan="2"><b>所在部门：</b> {{this.$route.params.detailData.create_user_department}}</td>
            <td><b>申请人岗位：</b> {{this.$route.params.detailData.create_user_post}}</td>
          </tr>
        </table>
      </el-card>
      <el-card shadow="never" class="el-card_in_edit" style="border-top: 0.2rem #409EFF solid;">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="detail_form" class="svgstyle"/>
          <label style="font-size:0.9375rem;">配置信息</label>
        </div>
        <!-- <table></table> -->
        <slot></slot>
      </el-card>
      <el-card shadow="never" class="el-card_in_edit" style="border-top: 0.2rem #E6A23C solid;">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="detail_line" class="svgstyle"/>
          <label style="font-size:0.9375rem;">流程处理</label>
          <span style="font-size:0.8125rem;">&nbsp;&nbsp;&nbsp;
            <b style="color: red;">注：</b>
            <b style="color: #67C23A;">绿色</b>表示已完成节点，
            <b style="color: #1890ff;">蓝色</b>表示当前节点
          </span>
        </div>
        <div class="block" style="width: 95%;">
          <el-timeline :reverse="false">
            <el-timeline-item
              v-for="(item, k) in logs"
              :type="item.type"
              :timestamp="item.create_time"
              :icon="item.icon"
              :color="item.color"
              size="large"
              placement="top">
              <el-card :style="{'border-color':item.color}" shadow="never" v-if="item.node_id == 'end'">
                <div style="text-align:center;">
                  <div style="float:left;"><b>{{item.node_name}}</b></div>
                <br>
                </div>
              </el-card>
              <el-card :style="{'border-color':item.color}" shadow="never" v-else>
                <div>
                  <el-row>
                    <el-col :span="9">
                      <div><b>{{item.node_name}}</b></div>
                    </el-col>
                    <el-col :span="10">
                      <div v-if="item.type=='primary'" :title="title">处理人: {{item.user_name}} {{item.user}}
                      <el-button type="text" style="padding:0;" icon="el-icon-refresh" @click="refreshuser"></el-button>
                      </div>
                      <div v-else>处理人: {{item.user_name}} {{item.user}}</div>
                    </el-col>
                    <el-col :span="5">
                      <div v-if="item.update_status">未开始</div>
                      <div v-else>{{timeComputed(item.c_time) }}</div>
                    </el-col>
                  </el-row>
                  <br />
                  <el-row>
                    <div style="float:left;" class="text-wrapper">
                      <div v-if="item.node_id !== 'end'" style="float:left;">处理意见: </div>
                      <div style="float:left;">{{item.comments}}</div>
                    </div>
                  </el-row>
                  <br v-if="JSON.stringify(item.file_json) !== '{}' && item.file_json != null && item.file_json.length != 0"/>
                  <el-row v-if="JSON.stringify(item.file_json) !== '{}' && item.file_json != null && item.file_json.length != 0">
                    <div style="float:left;">
                      <div v-if="item.node_id !== 'end'" style="float:left;">附件: </div>
                      <div style="float:left;">
                        <!-- <el-button-group v-for="itemF in item.file_json">
                          <a class="el-dropdown-link" :href="download(itemF)">
                            <el-button type="text" style="padding: 0;">{{ itemF.name }} &nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                          </a>
                        </el-button-group> -->
                        <span v-for="itemF in item.file_json">
                          <a :href="download(itemF)" style="color:#1890FF;">{{ itemF.name }}&nbsp;</a>
                          <!-- <el-button type="text" @click="showFile(itemF)" style="color:#909399;padding:0;">预览&nbsp;&nbsp;&nbsp;</el-button> -->
                          <el-button type="text" @click="showFile(itemF)" style="color:#FFFFFF;padding:0;">预览&nbsp;&nbsp;&nbsp;</el-button>
                        </span>
                      </div>
                    </div>
                  </el-row>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>
    </el-col>
  </div>
</template>
<script>
  import {getWorkFlowLog,handleWorkFlow,getnotice,getWorkflowparentline,getworkflowuser,getWorkFlows,getWorkflowline,get_Rediscachecloud} from '@/api/workflow/app_manage'
  import {getProjectname} from '@/api/cmdbs/product_line'
  import {fetchIPList,getLoginUser} from '@/api/cmdb'
  import {getUserInfo} from '@/api/zabbix/user_info'
  export default {
    name: "detailxxx",
    data() {
      return {
        rules: {
          comments: [
            { required: true, message: '请输入审批意见', trigger: 'blur' },,
            {min: 2, max: 250, message: '长度在 2 到 250个字符之间', trigger: 'blur'},
          ],
          uuid_user:[
            { required: true, message: '请选择沟通对象', trigger: 'blur' },
          ],
          user: [
            {required: true, message: '请选择转办对象', trigger: 'blur'},
          ],
        },
        dialogFileVisible: false,
        previewFileName: null,
        wordSrc: null,
        dialogFormVisible:false,
        buttondisabled:false,
        aDetail: {},
        userOptions:[],
        logs: [],
        listQuery: {
          page: 1,
          limit: 20,
          app_id: undefined,
        },
        total:0,
        listQuery_uuid: {
          page: 1,
          limit: 20,
          workflowconf_id: undefined
        },
        ackForm:{
          uuid:'',
          hand_id:'',
          comments:'',
          uuid_user:'',
          user:'',
          file_json:[],
        },
        notice: {
          uuid: '',
        },
        network:[],
        username:'',
        title:'',
      }
    },
    created() {
      // 详情路由/workflow/xxx_detail  取xxx_detail作为缓存名称
      this.session_name = this.$route.path.split('/')[2]
      // console.log(this.session_name)
      // 缓存
      if (this.$route.params.detailData) {
        sessionStorage.setItem(this.session_name, JSON.stringify(this.$route.params.detailData));
      }
      let workflow_detail = sessionStorage.getItem(this.session_name)
      if (workflow_detail) {
              this.$route.params.detailData = JSON.parse(workflow_detail);
      }else{
        this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
            sessionStorage.removeItem(this.session_name);
            this.$router.push('/workflow/workflow_list');
          })
      }
      this.$route.params.detailData = JSON.parse(sessionStorage.getItem(this.session_name));
      // 取数据
      this.aDetail = JSON.parse(this.$route.params.detailData.values);
      // 获取该单号uuid传递给getWorkFlowLog()方法,查询出该单号的审批日志
      this.listQuery_uuid.workflowconf_id = this.$route.params.detailData.uuid;
      getWorkFlowLog(this.listQuery_uuid).then(response => {
        this.logs = response.results
      });
      getworkflowuser({uuid:this.$route.params.detailData.uuid}).then(response => {
        this.title = String(response.data)
      });
      getUserInfo().then(response => {
        this.userOptions = response
      });
      // 通过id取产品线 新应用申请 虚拟机申请 负载内网申请
      if(!this.aDetail.project_name_list && this.aDetail.project_cname){
        getProjectname(this.aDetail.project_cname).then(response => {
          this.aDetail.project_cname = response.project
        });
      }
      // 应用已有IP数量
      this.listQuery.app_id = this.aDetail.app_id
      if (this.aDetail.app_id !== undefined) {
        fetchIPList(this.listQuery).then(response => {
          this.total=response.count
          this.$emit("iptotal", this.total)
        })
      }
      // 网络类申请
      getWorkflowparentline().then(response => {
        var workflowteamOptions = response.results
        this.network = []
        for (let lei of workflowteamOptions) {
          if (lei.name == '网络类申请') {
            for (var i = 0; i < lei.workflow.length; i++) {
              if (lei.workflow[i].status == 0) {
                this.network.push(lei.workflow[i].id)
              }
            }
            break
          }
        }
      })
      // 认领 当前登录用户工号
      getLoginUser().then(response => {
        this.username = response.username;
      })
      // 向父组件传值
      this.$emit("detaildata", this.aDetail)
    },
    methods: {
      // 点击应用，跳转虚机查询
      rowNameFilter(id) {
        let routes;
        routes = this.$router.resolve({path: '/cmdb/server', query: {app: id}})
        window.open(routes.href, "_blank");
      },
      // 点击应用，跳转资源管理
      rowNameFilter2(id) {
        let routes;
        routes = this.$router.resolve({path: '/cmdb/resoucre', query: {app: id}})
        window.open(routes.href, "_blank");
      },
      // 点击应用，跳转应用管理
      rowNameAPPFilter(id) {
        let routes;
        routes = this.$router.resolve({path: '/cmdb/index1_app/app', query: {id: id}})
        window.open(routes.href, "_blank");
      },
      // 跳转申请单管理
      handleReset() {
        // this.$router.push({path:`/workflow/workflow_list`})
        this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
          sessionStorage.removeItem(this.session_name);
          this.$router.push('/workflow/workflow_list');
        })
      },
      //跳转路由登记
      networkworkflow(){
        // if (this.network.indexOf(this.$route.params.detailData.step_line)!==-1) {
          // let routes;
          this.$router.push({path: '/cainiao/data_in_and_out', query: {uuid:this.$route.params.detailData.uuid,
          step_line:this.$route.params.detailData.step_line,step_line_name:this.$route.params.detailData.step_line_name}})
          // window.open(routes.href, "_blank");
        // }
      },
      // 处理人
      refreshuser(){
        getworkflowuser({uuid:this.$route.params.detailData.uuid,rebuild:true}).then(response => {
          this.title = String(response.data)
        });
      },
      // 处理时长
      timeComputed: function (minute) {
        let day = parseInt(minute/60/24)
        let hour = parseInt(minute/60%24)
        minute = parseInt(minute - day*24*60 - hour*60 )
        let process_time = day + ' 天 ' + hour + ' 时 '+ minute +' 分'
        return '处理时长: ' + process_time
      },
      // 审批按钮
      button(item){
        if ( item.name == '驳回') {
          return "danger"
        } else{
          return "primary"
        }
      },
      // 点击审批按钮,打开对话框
      open(item){
        this.dialogFormVisible = true
        this.buttondisabled = false
        this.ackForm.uuid = this.$route.params.detailData.uuid
        this.ackForm.hand_id = item.ID
        if (item.name == '回复') {
          this.ackForm.comments = '回复：同意'
        } else if(item.name == '同意') {
          this.ackForm.comments = '已确认并同意'
        } else {
          this.ackForm.comments = item.name
        }
        // this.ackForm.comments = item.name
        this.ackForm.hand_name = item.name
      },
      //转办
      handleShowother(id){
        this.ackForm.uuid = this.$route.params.detailData.uuid
        this.ackForm.hand_id = id
        this.ackForm.hand_name = '转办'
        this.ackForm.comments = '转办'
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      // 钉钉提醒
      handleding(){
        this.notice.uuid = this.$route.params.detailData.uuid
        getnotice(this.notice).then(response => {
          this.$notify({
            title: '成功',
            message: '提醒成功',
            type: 'success',
            duration: 3000
          })
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '提醒失败',
            type: 'error',
            duration: 3000
          })
        })
      },
      // Redis手动同步到cachecloud
      handlecachecloud(){
        var formdata = new FormData()
        formdata.append('uuid', this.$route.params.detailData.uuid)
        get_Rediscachecloud(formdata).then(response => {
          this.$notify({
            title: '成功',
            message: '同步成功',
            type: 'success',
            duration: 3000
          })
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '同步失败',
            type: 'error',
            duration: 3000
          })
        })
      },
      // 上个工单详情
      handlepre(){
        getWorkFlows().then(res => {
          getWorkFlows({limit:res.count,page:1}).then(response => {
            var list = response.results
            var finduuid = false
            var preuuidindex = undefined
            var predetail = {}
            for (var i = 0; i < list.length; i++) {
              if (list[i].uuid == this.$route.params.detailData.uuid) {
                // 有没有上一条工单
                if ( i == 0 ) {    //当前工单为待办第一条  没有上一条
                  this.$message({
                    showClose: true,
                    message: '没有上个待审批工单呦',
                    type: 'warning'
                  });
                } else{     //有上一条
                  finduuid = true
                  preuuidindex = i-1
                }
              }
            }
            // 有上一条工单 找上一条待审批工单
            if (finduuid == true) {
              for (var i = preuuidindex; i > -1; i--) {
                if (list[i].node_handle[0].name=='同意') {
                  predetail = JSON.parse(JSON.stringify(list[i]))
                  break
                }
                if (i == 0) {    //当前工单为待办第一条 待同意
                  this.$message({
                    showClose: true,
                    message: '没有上个待审批工单呦',
                    type: 'warning'
                  });
                }
              }
            }
            if (JSON.stringify(  predetail  ) !== '{}') {
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                sessionStorage.removeItem(this.session_name);
                this.$router.push('/workflow/workflow_list');
                getWorkflowline({name:predetail.step_line_name}).then(response => {
                  this.$router.push({name: response.results[0].url.split('/')[2] + "_detail", params: {detailData: predetail}})
                })
              })
            }
          })
        })
      },
      // 下个工单详情
      handlenext(){
        getWorkFlows().then(res => {
          getWorkFlows({limit:res.count,page:1}).then(response => {
            var list = response.results
            var finduuid = false
            var nextdetail = {}
            for (var i = 0; i < list.length; i++) {
              if (list[i].uuid == this.$route.params.detailData.uuid) {
                // 有没有下一条工单
                if ( i+1 < list.length ) {
                  finduuid = true
                  continue
                } else{    //当前工单为待办最后一条
                  this.$message({
                    showClose: true,
                    message: '没有下个待审批工单呦',
                    type: 'warning'
                  });
                }
              }
              // 有下一条工单 找下一条待审批工单
              if (finduuid == true) {
                if (list[i].node_handle[0].name=='同意') {
                  nextdetail = JSON.parse(JSON.stringify(list[i]))
                  break
                }
                if (i == list.length-1) {    //当前工单为待办最后一条 待同意
                  this.$message({
                    showClose: true,
                    message: '没有下个待审批工单呦',
                    type: 'warning'
                  });
                }
              }
            }
            if (JSON.stringify(  nextdetail  ) !== '{}') {
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                sessionStorage.removeItem(this.session_name);
                this.$router.push('/workflow/workflow_list');
                getWorkflowline({name:nextdetail.step_line_name}).then(response => {
                  this.$router.push({name: response.results[0].url.split('/')[2] + "_detail", params: {detailData: nextdetail}})
                })
              })
            }
          })
        })
      },
      // 处理意见 撤回 转办
      updateCommon(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
              this.$message({
                type: 'success',
                message: '成功提交'
              });
              this.dialogFormVisible = false
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                sessionStorage.removeItem(this.session_name);
                this.$router.push('/workflow/workflow_list');
              })
            })
          }
        })
      },
      // 同意 驳回 跳转下一个详情页
      updateCommon1(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            getWorkFlows().then(res => {
              getWorkFlows({limit:res.count,page:1}).then(response => {
              var list = response.results
              var finduuid = false
              var nextdetail = {}
              for (var i = 0; i < list.length; i++) {
                if (list[i].uuid == this.$route.params.detailData.uuid) {
                  if ( i+1 < list.length ) {
                    finduuid = true
                    continue
                  } else{    //当前工单为待办最后一条
                    this.submitCommon1()
                  }
                }
                if (finduuid == true) {
                  if (list[i].node_handle[0].name=='同意') {
                    nextdetail = JSON.parse(JSON.stringify(list[i]))
                    break
                  }
                  if (i == list.length-1) {    //当前工单为待办最后一条 待同意
                    this.submitCommon1()
                  }
                }
              }
              if (JSON.stringify(  nextdetail  ) !== '{}') {
                handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
                  this.$message({
                    type: 'success',
                    message: '成功提交'
                  });
                  this.dialogFormVisible = false
                  this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                    sessionStorage.removeItem(this.session_name);
                    this.$router.push('/workflow/workflow_list');
                    getWorkflowline({name:nextdetail.step_line_name}).then(response => {
                      this.$router.push({name: response.results[0].url.split('/')[2] + "_detail", params: {detailData: nextdetail}})
                    })
                  })
                })
              }
              })
            })
          }
        })
      },
      submitCommon1(){
        handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
          this.$message({
            type: 'success',
            message: '成功提交'
          });
          this.dialogFormVisible = false
          this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
            sessionStorage.removeItem(this.session_name);
            this.$router.push('/workflow/workflow_list');
          })
        })
      },
      // 打回再提交  status=4
      updateCommon2(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            getWorkFlows().then(res => {
              getWorkFlows({limit:res.count,page:1}).then(response => {
              var list = response.results
              var finduuid = false
              var nextdetail = {}
              for (var i = 0; i < list.length; i++) {
                if (list[i].uuid == this.$route.params.detailData.uuid) {
                  if ( i+1 < list.length ) {
                    finduuid = true
                    continue
                  } else{    //当前工单为待办最后一条
                    this.submitCommon2()
                  }
                }
                if (finduuid == true) {
                  if (list[i].node_handle[0].name=='同意') {
                    nextdetail = JSON.parse(JSON.stringify(list[i]))
                    break
                  }
                  if (i == list.length-1) {    //当前工单为待办最后一条 待同意
                    this.submitCommon2()
                  }
                }
              }
              if (JSON.stringify(  nextdetail  ) !== '{}') {
                this.ackForm.status=4
                handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
                  this.$message({
                    type: 'success',
                    message: '成功提交'
                  });
                  this.ackForm.status = undefined
                  this.dialogFormVisible = false
                  this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                    sessionStorage.removeItem(this.session_name);
                    this.$router.push('/workflow/workflow_list');
                    getWorkflowline({name:nextdetail.step_line_name}).then(response => {
                      this.$router.push({name: response.results[0].url.split('/')[2] + "_detail", params: {detailData: nextdetail}})
                    })
                  })
                })
              }
              })
            })
          }
        })
      },
      submitCommon2(){
        this.ackForm.status=4
        handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
          this.$message({
            type: 'success',
            message: '成功提交'
          });
          this.ackForm.status = undefined
          this.dialogFormVisible = false
          this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
            sessionStorage.removeItem(this.session_name);
            this.$router.push('/workflow/workflow_list');
          })
        })
      },
      // 沟通  status=5 回复 status=0
      updateCommon3(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            if (this.ackForm.hand_name=='沟通') {
              // this.ackForm.status = 5
            } else{
              this.ackForm.status = 0
            }
            handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
              this.$message({
                type: 'success',
                message: '成功提交'
              });
              this.ackForm.status = undefined
              this.dialogFormVisible = false
              this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                sessionStorage.removeItem(this.session_name);
                this.$router.push('/workflow/workflow_list');
              })
            })
          }
        })
      },
      // 认领
      updateCommon4(id) {
        this.ackForm.uuid = this.$route.params.detailData.uuid
        this.ackForm.hand_id = id
        this.ackForm.hand_name = '认领'
        this.ackForm.comments = '认领'
        this.ackForm.user = this.username
        handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
          this.$message({
            type: 'success',
            message: '成功提交'
          });
          this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
            sessionStorage.removeItem(this.session_name);
            this.$router.push('/workflow/workflow_list');
          })
        })
      },
      // 附件下载
      download(item){
        if (item) {
          //单行
          return "/dev-api/workflow/file_download/" + item.response.file_alias
        } else {
          //全部
          // var urls = [],
          // for (var i = 0; i < this.aDetail.fileList.length; i++) {
            // var url = "/dev-api/workflow/file_download/" + i.name
            // urls.push(url)
          // }
        }
      },
      showFile(item) {
        this.previewFileName = item.response.file_alias.split('/').pop();
        // console.log(this.previewFileName)
        // let env = 'http://10.130.10.229'
        let env = 'http://xc.yto.net.cn'
        let url = `${env}/dev-api/workflow/file_download/${item.response.file_alias}`
        this.wordSrc = `http://xc.yto.net.cn/onlinepreview/onlinePreview?url=${encodeURIComponent(url)}`
        this.dialogFileVisible = true;
      },
      closeFile() {
        this.previewFileName = null;
        this.wordSrc = null;
        this.dialogFileVisible = false;
      },
      // 关闭对话框
      dialogClose() {
        this.ackForm.comments=''
        this.ackForm.uuid_user = ''
        this.ackForm.file_json = []
        this.dialogFormVisible=false
      },
      // 附件操作
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.ackForm.file_json = []
        this.ackForm.file_json = fileList
        console.log(this.ackForm.file_json)
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (file.status == 'ready') {
          return
        }
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleChange(response, file, fileList) {
        console.log(file, fileList);
        if (file.status == 'success') {this.buttondisabled = false} //文件上传成功后才能确认
        this.ackForm.file_json = []
        this.ackForm.file_json = fileList
        console.log(this.ackForm.file_json)
      },
      beforeUpload(file){
        const isLt5M = file.size / 1024 / 1024 < 5
        if(!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      },
      //重命名上传，下载时文件名带uuid
      myUpload(content){
        this.buttondisabled = true //上传顺序 beforeUpload -> myUpload -> handleChange
        var copyFile =new File([content.file],`${this.ackForm.uuid}_${content.file.name}`,{type:content.file.type});
        let formData = new FormData();
        formData.append(content.filename, copyFile);
        var xhr = new XMLHttpRequest();
        xhr.open("post","/dev-api/workflow/workflow_upload_file_first");
        xhr.send(formData);
        xhr.onreadystatechange = function(){
          if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            content.onSuccess(JSON.parse(xhr.responseText))
          }
        }
      }
    },
    filters: {
      titleText(row) {
        // return JSON.parse(row.values).fullPath === '/workflow/database_access_application' ? `${row.create_user_name} 【${row.step_line_name}】` : row.title
        // 如果title应用名为空 目前有:数据库接入申请 产品线申请
        return row.title.indexOf('【】')!==-1 ? `${row.create_user_name} 【${row.step_line_name}】` : row.title
        // return `${row.create_user_name} 【${row.step_line_name}】`
      }
    }
  }
</script>
<style lang="scss" scoped>
  .text-wrapper {white-space:pre-wrap;overflow-wrap:break-word;}
  .detailtitle{position:fixed;background-color:white;z-index:100;height:3.5rem;line-height:3.5rem;}
  .buttonmore{margin-left:0.625rem;height:2.25rem;}
  .svgstyle{color:gray;}
  /deep/.el-card__header{padding:0.625rem;}
  /deep/.el-card__body{padding:0.625rem;}
  /deep/.el-card_in_edit{margin-top:0;}
</style>
