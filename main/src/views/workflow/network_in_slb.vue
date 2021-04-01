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
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="130px" class="newAppForm" style="width:100%">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="申请类型" prop="steplinestatus" required>
              <el-radio v-model="newAppForm.steplinestatus" label="0">外网-新增负载</el-radio>
              <el-radio v-model="newAppForm.steplinestatus" label="1">外网-变更已有负载</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="产品线" prop="project_name_list" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">如未找到应用，请提交“新应用申请单”
                  </div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                应用名
              </label>
              <el-cascader expand-trigger="hover"
                          :options="projectOptions"
                          v-model="newAppForm.project_name_list"
                          filterable
                          clearable
                          :filter-method="filterMethod"
                          style="width:100%;"
                          placeholder="请选择产品线及应用名"
                          @change="vmIpList">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="环境" prop="env" required>
              <el-radio-group v-model="newAppForm.env" @change="vmIpList">
                <el-radio label="生产">生产</el-radio>
                <el-radio label="UAT">UAT</el-radio>
                <el-radio label="SIT">SIT</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item v-if="newAppForm.steplinestatus == '0'" label="负载策略" prop="network_rule">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">轮询：顺序循环将请求依次顺序循环地连接每个服务器<br/>
                                      权重：给每个服务器分配一个加权值为比例，根椐这个比例，把用户的请求分配到每个服务器<br/>
                                      最小连接数：对每一台服务器的当前连接数进行统计，当有新的请求进入时，将新的请求分配给当前最少连接处理的服务器。</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>负载策略
              </label>
              <!-- <el-radio v-model="newAppForm.network_rule" label="轮询">轮询</el-radio>
              <el-radio v-model="newAppForm.network_rule" label="权重">权重</el-radio>
              <el-radio v-model="newAppForm.network_rule" label="最小连接数">最小连接数</el-radio> -->
              <el-select v-model="newAppForm.network_rule" popper-class="app-search-class" style="width: 100%;">
                <el-option label="轮询" value="轮询"/>
                <el-option label="权重" value="权重"/>
                <el-option label="最小连接数" value="最小连接数"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="newAppForm.steplinestatus == '1'" label="负载信息" prop="slbinfo">
              <el-input v-model="newAppForm.slbinfo" type="textarea" maxlength="500" placeholder="请输入已有负载访问url或服务器节点地址" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="类型" prop="type" required>
              <el-radio v-model="newAppForm.type" label="TCP">TCP</el-radio>
              <el-radio v-model="newAppForm.type" label="HTTP">HTTP</el-radio>
              <el-radio v-model="newAppForm.type" label="HTTPS">HTTPS</el-radio>
              <!-- <el-select v-model="newAppForm.type" popper-class="app-search-class" style="width: 100%;">
                <el-option label="TCP" value="TCP"/>
                <el-option label="HTTP" value="HTTP"/>
                <el-option label="HTTPS" value="HTTPS"/>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="会话保持" prop="session">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">服务器在收到请求后，从Cookie中获得该用户的Session ID,根据此Session ID进行相关处理<br/>
                                      在大部分的情况下，服务器之间并不会互相复制用户的SessionID信息，因此在采用四层负载均<br/>
                                      衡进行负载均衡后，一旦某个用户登陆到一台服务器上，负载均衡设备必须采用一种机制，可以<br/>
                                      识别做客户与服务器之间交互过程的关连性，在作负载均衡的同时，还保证一系列相关连的访问<br/>
                                      请求会保持分配到一台服务器上。如果没有会话保持技术，则可能将同一用户的请求发送到不同<br/>
                                      的服务器上，而在另外一台服务器上没有该用户端的唯一标识，则造成用户请求失败或与此用户<br/>
                                      的相关信息丢失。此时通常表现出来的现象就是用户登陆后再进行操作时，系统就提示重新登陆，<br/>
                                      并且一直持续下去，导致应用无法使用。</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>会话保持
              </label>
              <el-select v-model="newAppForm.session" popper-class="app-search-class" style="width: 100%;">
                <el-option label="无" value="无"/>
                <el-option label="cookie" value="cookie"/>
                <el-option label="源地址" value="源地址"/>
                <el-option label="目的地址" value="目的地址"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item v-if="newAppForm.type!=='TCP'" label="透传源地址" prop="is_Sip" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">应用需要做统计或者审计等需求时，HTTP应用可以将源地址插入到HTTP header中X-Forwarded-For字段。</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>透传源地址
              </label>
              <el-switch v-model="newAppForm.is_Sip"
                active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item v-if="newAppForm.type!=='TCP'" label="健康检查URL" prop="check_httpurl" required>
              <el-input v-model.trim="newAppForm.check_httpurl" placeholder="请与网络组协商后填写"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="开通时长" prop="is_forever" required>
              <el-switch v-model="newAppForm.is_forever"
                active-text="永久" inactive-text="临时" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item v-if="newAppForm.is_forever == 0" label="截止时间" prop="enddate" required>
              <el-date-picker
                v-model="newAppForm.enddate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable=false
                style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.steplinestatus == '0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="域名" prop="Domain_name" required>
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">例如XXX.yto.net.cn 只需要填写XXX字段，此字段为申请部门自定义，一般为接口、应用缩写；<br/>
                                      首位为字母，不允许为数字或特殊字符。</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>域名
              </label>
              <el-input v-model.trim="newAppForm.Domain_name" placeholder="请输入域名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="映射端口" prop="port">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">映射后使用的公网端口，一般情况和内网服务器端口保持一致，<br />
                  80端口资源有限，面向大众的web应用可以使用80/443端口，接口调用类无特殊需求请使用非80/443端口，测试环境不限制</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>映射端口
              </label>
              <!-- <el-input v-model.trim="newAppForm.port" placeholder="0-65535"></el-input> -->
              <!-- <el-input v-model.trim="newAppForm.port" type="number" :min="0" :max="65535"></el-input> -->
              <el-input-number v-model.trim="newAppForm.port" controls-position="right" :min="0" :max="65535" :precision="0" :controls="false" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item size="small" style="text-align: right" class="config_os" label-width="30px">
              <div v-if="newAppForm.app_id == '' || total ==0">
                <el-tooltip content="未选择应用或应用已有ip为0" placement="top">
                  <el-button type="primary"  @click="step0" disabled>添加应用IP</el-button>
                </el-tooltip>
              </div>
              <div v-else>
                <el-button type="primary"  @click="step0" :disabled="disabledbuttonPool">添加应用IP</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item prop="configinfo">
              <div>
                <el-table :data="newAppForm.configinfo">
                  <el-table-column prop="ip" label="服务器IP"  align="center">
                    <!-- 后加的端口，不显示ip -->
                    <template slot-scope="scope" v-if="scope.row.portstatus == '0'">
                      {{scope.row.ip}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="port" label="服务端口"  align="center">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">服务端口
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">若相同IP端口重复,将只保留一条该记录</div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.port'" :rules="{type:'number',required:true,message:'端口不能为空',trigger:'blur'}">
                        <el-input-number v-model.trim="scope.row.port" controls-position="right" :min="0" :max="65535" :precision="0" :controls="false" style="width: 50%;" @change="changeport(scope.row,newAppForm.configinfo)"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="权重"  align="center">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">权重
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">
                            1.权重越大转发的请求越多,默认为100;<br/>
                            2.如开启会话保持,可能会造成后端服务器的请求不均匀;<br/>
                            3.权重设置为0,该服务器不会再接受新请求;
                          </div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.weight'" :rules="{type:'number',required:true,message:'权重不能为空',trigger:'blur'}">
                        <el-input-number v-model.trim="scope.row.weight" v-if="newAppForm.network_rule == '权重'" controls-position="right" :min="0" :max="100" :precision="0"  :controls="false" style="width: 50%;"></el-input-number>
                        <el-input-number v-model.trim="scope.row.weight" v-else controls-position="right" :min="0" :max="100" :precision="0" :controls="false" style="width: 50%;" disabled></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                      <el-button type="danger" icon="el-icon-delete" circle @click="removeport(scope.row,newAppForm.configinfo)" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="备注描述" prop="desc"
            :rules="(newAppForm.port==80||newAppForm.port==443)&&newAppForm.env == '生产'?[{ required: true, message: '请输入使用默认端口80/443的理由', trigger: 'blur' }]:[{ required: false, message: '请输入备注描述', trigger: 'blur' }]">
              <el-input v-if="(newAppForm.port==80||newAppForm.port==443)&&newAppForm.env == '生产'" v-model="newAppForm.desc" type="textarea" placeholder="请输入使用默认端口80/443的理由" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
              <el-input v-else v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <el-button v-if="this.$route.params.uuid == null && newAppForm.configinfo.length !== 0" type="primary" @click="saveDraftsForm('newAppForm')" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else-if="newAppForm.configinfo.length == 0" type="primary" @click="saveDraftsForm('newAppForm')" disabled>保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :loading="buttondisabled">保存草稿</el-button>
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <el-button v-if="this.$route.params.uuid == null && newAppForm.configinfo.length !== 0" type="primary" @click="submitForm('newAppForm')" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else-if="this.$route.params.uuid == null && newAppForm.configinfo.length == 0" type="primary" @click="submitForm('newAppForm')" disabled>立即提交</el-button>
              <el-button v-else-if="newAppForm.configinfo.length == 0" type="primary" @click="submitEditForm('newAppForm',0)" disabled>提交草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :loading="buttondisabled">提交草稿</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step description="选择服务器"></el-step>
        <el-step description="配置端口和权重"></el-step>
      </el-steps>
      <div style="text-align:center;padding-top:2%;padding-bottom:2%;" v-if="active == 0">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="ipList"
          filterable
          :titles="['未选服务器', '已选服务器']"
          :props="{
            key: 'ip',
            label: 'ip'
          }"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="handleChange"
          :data="tableData">
          <span slot-scope="{ option }">{{ option.ip }}</span>
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="active == 0 && ipList.length == 0" @click="step2" disabled>下一步</el-button>
        <el-button size="small" type="primary" v-else-if="active == 0" @click="step2">下一步</el-button>
        <el-button v-if="active == 0" @click="dialogVisible = false">取 消</el-button>
      </div>
      <div align="center" v-if="active == 1" style="padding-bottom:2%;">
        <!-- <el-alert
            title="若相同IP端口重复,将只保留一条该记录" center
            type="warning"
            :closable="false">
        </el-alert> -->
        <el-table :data="conf" height="320px">
          <el-table-column prop="ip" label="服务器IP"  align="center" min-width="2">
            <!-- 后加的端口，不显示ip -->
            <template slot-scope="scope" v-if="scope.row.portstatus == '0'">
              {{scope.row.ip}}
            </template>
          </el-table-column>
          <el-table-column prop="port" label="服务端口"  align="center" min-width="2">
            <template slot="header" slot-scope="scope">
              <label slot="label">服务端口
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">若相同IP端口重复,将只保留一条该记录</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                </el-tooltip>
              </label>
            </template>
            <template slot-scope="scope">
              <el-input-number v-model.trim="scope.row.port" controls-position="right" :min="0" :max="65535" :precision="0" :controls="false" style="width: 70%;" @change="changeport(scope.row,conf)"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="权重"  align="center" min-width="2">
            <template slot="header" slot-scope="scope">
              <label slot="label">权重
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">
                    1.权重越大转发的请求越多,默认为100;<br/>
                    2.如开启会话保持,可能会造成后端服务器的请求不均匀; <br/>
                    3.权重设置为0,该服务器不会再接受新请求;
                  </div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                </el-tooltip>
              </label>
            </template>
            <template slot-scope="scope">
              <el-input-number v-model.trim="scope.row.weight" v-if="newAppForm.network_rule == '权重'" controls-position="right" :min="0" :max="100" :precision="0" :controls="false" style="width: 70%;"></el-input-number>
              <el-input-number v-model.trim="scope.row.weight" v-else controls-position="right" :min="0" :max="100" :precision="0" :controls="false" style="width: 70%;" disabled></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right" min-width="1">
            <template slot-scope="scope">
              <el-button type="primary" v-if="scope.row.portstatus == '0'" icon="el-icon-plus" circle @click="addport(scope.row)" />
              <el-button type="danger" icon="el-icon-delete" circle @click="removeport(scope.row,conf)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="active == 1" @click="step1">上一步</el-button>
        <el-button size="small" type="primary" v-if="active == 1 && this.conf.length == 0" @click="addvmip" disabled>确定</el-button>
        <el-button size="small" type="primary" v-else-if="active == 1" @click="addvmip">确定</el-button>
        <el-button v-if="active == 1" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine} from '@/api/workflow/app_manage'
  import {fetchAppInfo} from '@/api/cmdbs/app_manage'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import {fetchIPList} from '@/api/cmdb'
  import {getHelpDocContent} from '@/api/management/help_doc'
  //TODO 这个需要对表进行重新设计，因为存在一次申请多个应用的服务器的情况，系统版本可能也需要拉下来，这个针对windows 需要有特殊设置
  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionNewAppForm],
    data() {
      return {
        disabledbuttonPool:true,
        active: 0,
        total:0,
        dialogVisible:false,
        buttondisabled:false,
        help_doc_url:'',
        projectOptions: [],
        tableData:[],
        ipList:[],
        conf:[],
        newAppForm: {
          // rules:{
          //   port:{type:"number",required:true,message:"端口不能为空",trigger:"blur"},
          //   weight:{type:"number",required:true,message:"权重不能为空",trigger:"blur"},
          // },
          steplinestatus:'0',
          project_name_list: [],
          app_id: '',
          app_cname:'',
          app_name:'',
          env:'生产',
          slbinfo:'',
          type:'HTTP',
          is_Sip:0,
          check_httpurl:'',
          network_rule: '轮询',
          session: '无',
          is_forever:0,
          enddate: '',
          Domain_name: '',
          port:undefined,
          configinfo: [],
          desc:'',
          routeParams: '',
        },
        configinfodict: {
          'ip': '',
          'port': '80',
          'weight':'100',
          'portstatus':'0',
        },
        listQuery: {
          page: 1,
          limit: 20,
          app_id: undefined,
          resource_env:undefined
        },
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() < Date.now()
          }
        },
        rules: {
          steplinestatus:[{ required: true, message: '请选择申请类型', trigger: 'change' },],
          project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
          Domain_name:[{ required: true, message: '请输入域名', trigger: 'blur' },],
          check_httpurl:[{ required: true, message: '请输入健康检查URL', trigger: 'blur' },],
          slbinfo:[{ required: true, message: '请输入负载信息', trigger: 'blur' },],
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
      this.newAppForm.enddate = this.initDate(1);
      getProductAppCascader().then(response => {
        this.projectOptions = response
      });
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
          this.newAppForm.steplinestatus = this.aDetail.steplinestatus
          this.newAppForm.project_name_list = this.aDetail.project_name_list
          this.newAppForm.app_id = this.newAppForm.project_name_list[3]
          this.newAppForm.env = this.aDetail.env
          if (this.newAppForm.project_name_list[3]) this.vmIpList()
          this.newAppForm.slbinfo = this.aDetail.slbinfo
          this.newAppForm.type = this.aDetail.type
          this.newAppForm.is_Sip = this.aDetail.is_Sip
          this.newAppForm.check_httpurl = this.aDetail.check_httpurl
          this.newAppForm.network_rule = this.aDetail.network_rule
          this.newAppForm.session = this.aDetail.session
          this.newAppForm.is_forever = this.aDetail.is_forever
          this.newAppForm.enddate = this.aDetail.enddate
          this.newAppForm.Domain_name = this.aDetail.Domain_name
          this.newAppForm.port = this.aDetail.port
          this.newAppForm.configinfo = this.aDetail.configinfo
          this.conf = this.aDetail.configinfo
          this.newAppForm.desc = this.aDetail.desc
          this.ipList = []
          for (var i = 0; i < this.conf.length; i++) {
            if( i==0 ||this.conf[i].ip !== this.conf[i-1].ip){
              this.ipList.push(this.conf[i].ip)
            }
          }
        } catch (error) {
          // TODO 异常情况如何处理
          console.log(this.$route.params.detailData_edit)
        }
      },
      changeport(row,arr){
        var index = arr.indexOf(row)
        for (var i = 0; i < arr.length; i++) {
          if( i !== index && arr[i].ip == row.ip && arr[i].port == row.port ){
            // console.log(row)
            // alert(row.ip+'的'+row.port+'重复')
            //若同一ip的端口重复，直接删除该条记录
            //如果portstatus为0 删除另一条      为1删除本条     即为0的行保留
            if (row.portstatus == '0') {
              arr.splice(i, 1)
              // this.ipList.splice(i, 1)
            } else{
              arr.splice(index, 1)
              // this.ipList.splice(index, 1)
            }
          }
        }
      },
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
      },
      step0(){
        this.dialogVisible = true
        if (this.newAppForm.configinfo.length == 0) {
          this.active = 0
        }else{
          this.active = 1
        }
        // 点击添加按钮,会清空之前数据
        // this.active = 0
        // this.ipList = []
      },
      step1(){
        this.active = 0
      },
      step2(){
        //增减ip
        this.conf = []
        this.active = 1
        for (var i = 0; i < this.ipList.length; i++) {
          const configinfo = Object.assign({}, this.configinfodict)
          configinfo.ip = this.ipList[i]
          configinfo.port = this.newAppForm.port
          this.conf.push(configinfo)
        }
        //补全之前的port、weight、portstatus
        // if (before_conf.length !== 0) {

        // }
        //与前一个记录 ip相同，则设置portstatus为1
        // for (var i = 1; i < this.conf.length; i++) {
        //   if(this.conf[i].ip == this.conf[i-1].ip){
        //     this.conf[i].port = undefined
        //     this.conf[i].portstatus = '1'
        //   }
        // }
        // console.log(this.conf)
      },
      addport(item){
        // console.log(item.ip)
        const configinfo = Object.assign({}, this.configinfodict)
        configinfo.ip = item.ip
        // 添加端口的时候,端口为空
        configinfo.port = undefined
        configinfo.portstatus = '1'
        var index = this.conf.indexOf(item)
        if (index !== -1) {
          this.conf.splice(index+1, 0, configinfo)
          // this.ipList.splice(index+1, 0, configinfo.ip)
        }
        // this.conf.push(configinfo)
      },
      removeport(row,arr){
        var index = arr.indexOf(row)
        if (index !== -1) {
          if (row.portstatus == '0' && index+1 < arr.length &&arr[index+1].portstatus == '1') {
            // 有加的端口，恢复ip和加端口按钮显示
            arr[index+1].portstatus = '0'
          }else if(row.portstatus == '0' && index+1 < arr.length &&arr[index+1].portstatus == '0' || row.portstatus == '0' && index+1 == arr.length){
            // 没有加的端口 或者为最后一条(没有index+1)
            this.ipList.splice(index, 1)
          }
          arr.splice(index, 1)
        }
        // console.log(this.conf)
      },
      addvmip(){
        //删除相同IP端口重复，有则删除记录
        for (var i = 0; i < this.conf.length; i++) {
          this.changeport(this.conf[i],this.conf)
        }
        this.newAppForm.configinfo = this.conf
        // this.newAppForm.configinfo = this.newAppForm.configinfo.concat(this.conf)
        this.dialogVisible = false
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
          this.disabledbuttonPool = true;
          this.newAppForm = this.$options.data().newAppForm;
          var object={}
          object.id = this.$route.params.id
          object.name = this.$route.params.name
          this.newAppForm.routeParams = object
          this.newAppForm.enddate = this.initDate(1);
        }
        this.$nextTick(() => {
          this.$refs[formName].clearValidate();
        })
      },
      // 修改草稿提交、或者再次保存草稿，都是update数据
      submitEditForm(formName, status) {
        // alert(rowEdit.desc)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //提交草稿时，需要传入的6为该类型的申请单对应的node表中的node_id=start对应的id值
            this.buttondisabled = true
            editWorkFlowConfRow(this.$route.params.uuid, this.newAppForm, status, this.$route.params.node_id).then(response => {
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
      data(query){
        fetchIPList(query).then(response => {
          this.total=response.count
          const tableData = []
          for (const i of response.results) {
            tableData.push({
              ip: i.ip
            })
          }
          // 合并为一个数组
          this.tableData = this.tableData.concat(tableData)
          // console.log(this.tableData.length)
          if( this.listQuery.page < this.total/20 ){
            this.listQuery.page++
            this.data(this.listQuery)
          } else{
            this.listQuery.page = 1
          }
        })
      },
      vmIpList(){
        this.tableData = []
        this.ipList = []
        this.conf = []
        this.newAppForm.configinfo = []
        if (this.newAppForm.project_name_list.length == 0) {
          this.disabledbuttonPool = true
          return
        }
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        this.disabledbuttonPool = false
        this.listQuery.app_id = this.newAppForm.app_id
        fetchAppInfo(this.newAppForm.app_id).then(response => {
          this.newAppForm.app_name = response.app_name
          this.newAppForm.app_cname = response.app_cname
        })
        //环境
        if ( this.newAppForm.env == '生产') {
          this.listQuery.resource_env = 1
        } else if ( this.newAppForm.env == 'SIT') {
          this.listQuery.resource_env = 2
        } else if ( this.newAppForm.env == 'UAT') {
          this.listQuery.resource_env = 4
        } else{
          this.listQuery.resource_env = undefined
        }
        this.data(this.listQuery)
      },
      getHelpDoc() {
        // getHelpDocContent(({board:'workflow',title:'新建申请单-'+this.$route.params.name})).then(response => {
        //   this.$router.push({name:"help_doc_preview", params: {content: response.content}})
        // })
        this.$router.push('/'+this.help_doc_url.split('/')[2])
      },
      filterMethod(node, keyword){
        keyword = keyword.toLowerCase() // 搜索关键字转为小写
        const { text, path } = node;
        // return text.includes(keyword) || path.includes(keyword);
        return text.toLowerCase().includes(keyword)
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

  /deep/.el-step__description {
      margin-top: 0px;
      padding-top: 5px;
      font-size: 15px;
      line-height: 20px;
      font-weight: normal;
  }
  /deep/.el-radio__label {
    font-size: 14px;
    padding-left: 2px;
  }
  .help-svg-pointer:hover {
    cursor: pointer;
  }
  a{
    color: #1890ff;
  }
</style>
