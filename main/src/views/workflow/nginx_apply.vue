<template>
  <div class="app-container">
    <div style="padding:20px 0 60px 0;">
      <el-col :span="18" :xs="22" :offset="2" style="text-align:center;">
        <span style="font-size:1.17em;font-weight:bold;color:#48096b">{{this.$route.params.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size:15px;color: red;" @click="getHelpDoc">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>帮助指引</a>
        <h5 style="text-align:center;color:#606266">所有的资源成本将计入项目或团队成本</h5> <br>
      </el-col>
    </div>

    <div>
      <el-form ref="newAppForm" :model="newAppForm" :rules="rules" label-width="180px" class="newAppForm"
               style="width:100%">
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="Nginx类型" prop="ntype" required>
              <el-radio-group v-model="newAppForm.ntype">
                <el-radio label="0">负载均衡型</el-radio>
                <el-radio label="1">静态服务型</el-radio>
              </el-radio-group>
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
                           :options="nginxOptions"
                           v-model="newAppForm.project_name_list"
                           filterable
                           clearable
                           :filter-method="filterMethod"
                           style="width:100%;"
                           placeholder="请选择产品线及应用名"
                           @change="productchange">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="应用IP">
              <div style="width:100%;overflow-wrap:break-word;color:darkgray;">{{String(this.newAppForm.tableData)}}</div>
            </el-form-item>
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
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="项目编号" prop="project_num" required>
              <el-select v-model="newAppForm.project_num" placeholder="请选择项目(如果没有请联系管理员录入)" style="width: 100%;">
                <el-option v-for="item in poolOptions"
                  :key="'('+item.key+')'+item.display_name"
                  :label="'('+item.key+')'+item.display_name"
                  :value="'('+item.key+')'+item.display_name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8" >
            <el-form-item label="资源类型" prop="type">
              <el-select v-model.trim="newAppForm.type" placeholder="请选择" style="width: 100%" @change="changeexpecteddate">
                <el-option label="独占型" value="独占型"/>
                <el-option label="共享型" value="共享型"/>
              </el-select>
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
            <el-form-item label="类型" prop="htype" required>
              <el-radio v-model="newAppForm.htype" label="HTTP">HTTP</el-radio>
              <el-radio v-model="newAppForm.htype" label="HTTPS">HTTPS</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.ntype == '0'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="QPS" prop="qps">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">QPS = 并发量 / 平均响应时间</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                QPS
              </label>
              <el-input-number v-model.trim="newAppForm.qps" controls-position="right" :min="1" :precision="0"
                               :controls="false" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="负载策略" prop="network_rule">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">轮询：顺序循环将请求依次顺序循环地连接每个服务器<br/>
                                      权重：给每个服务器分配一个加权值为比例，根椐这个比例，把用户的请求分配到每个服务器<br/>
                                      最小连接数：对每一台服务器的当前连接数进行统计，当有新的请求进入时，将新的请求分配给当前最少连接处理的服务器。</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>负载策略
              </label>
              <el-select v-model="newAppForm.network_rule" popper-class="app-search-class" style="width: 100%;">
                <el-option label="轮询" value="轮询"/>
                <el-option label="权重" value="权重"/>
                <el-option label="最小连接数" value="最小连接数"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
                  <div slot="content">映射后使用的公网端口，一般情况和内网服务器端口保持一致</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>映射端口
              </label>
              <el-input-number v-model.trim="newAppForm.port" controls-position="right" :min="0" :max="65535" :precision="0" :controls="false" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.ntype == '1'">
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="是否走cdn" prop="is_cdn" required>
              <el-switch v-model="newAppForm.is_cdn"
                active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="location" prop="location" required>
              <el-input v-model.trim="newAppForm.location" placeholder="请输入location"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newAppForm.ntype == '0'" style="margin-bottom:10px;">
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <fieldset v-for="(item,index) in newAppForm.slbconfiginfo">
                <legend style="color:darkgray;">策略{{index+1}}</legend>
                <el-row class="marginbottom">
                  <el-col :span="11">
                    <el-form-item label="location" label-width="80px" :prop="`slbconfiginfo.${index}.location`" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                      <el-input v-model.trim="item.location" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="健康检查URL" label-width="110px" :prop="`slbconfiginfo.${index}.check_url`" :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                      <el-input v-model.trim="item.check_url" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align:center;">
                    <el-button type="primary" icon="el-icon-plus" @click="addDomain()" :disabled="newAppForm.slbconfiginfo.length>9"></el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="应用名" label-width="80px" :prop="`slbconfiginfo.${index}.project_name_list`" :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                      <el-cascader expand-trigger="hover"
                                   :options="projectOptions"
                                   v-model="item.project_name_list"
                                   filterable
                                   clearable
                                   :filter-method="filterMethod"
                                   style="width:100%;"
                                   placeholder="请选择产品线及应用名"
                                   @change="getslbIP(item)">
                      </el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="备注描述" label-width="110px" :prop="`slbconfiginfo.${index}.desc`">
                      <el-input v-model.trim="item.desc" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="11">
                    <el-form-item size="small" style="text-align: right" class="config_os" label-width="30px">
                      <el-button type="primary"  @click="step0(item),slbindex = index" :disabled="item.project_name_list.length!=0?false:true">添加应用IP</el-button>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="2" style="text-align:center;">
                    <el-button type="danger" icon="el-icon-delete" v-if="item.status !== 1" @click="removeDomain(item)" />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22">
                    <el-form-item prop="slbconf">
                      <div>
                        <el-table :data="item.slbconf">
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
                              <el-form-item :prop="`slbconfiginfo[${index}].slbconf.` + scope.$index + '.port'" :rules="{type:'number',required:true,message:'端口不能为空',trigger:'blur'}">
                                <el-input-number v-model.trim="scope.row.port" controls-position="right" :min="0" :max="65535" :precision="0" :controls="false" style="width: 100%;" @change="changeport(scope.row,item.slbconf)"></el-input-number>
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
                              <el-form-item :prop="`slbconfiginfo[${index}].slbconf.` + scope.$index + '.weight'" :rules="{type:'number',required:true,message:'权重不能为空',trigger:'blur'}">
                                <el-input-number v-model.trim="scope.row.weight" v-if="newAppForm.network_rule == '权重'" controls-position="right" :min="0" :max="100" :precision="0"  :controls="false" style="width: 100%;"></el-input-number>
                                <el-input-number v-model.trim="scope.row.weight" v-else controls-position="right" :min="0" :max="100" :precision="0" :controls="false" style="width: 100%;" disabled></el-input-number>
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="100" align="center">
                            <template slot="header" slot-scope="scope">
                              <el-button type="primary" size="small" @click="step0(item),slbindex = index" :key="buttonkey" :disabled="item.project_name_list.length==0">添加应用IP</el-button>
                            </template>
                            <template slot-scope="scope">
                              <el-button type="danger" icon="el-icon-delete" circle @click="removeport(scope.row,item.slbconf)" />
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item label="特殊类型说明" prop="elsetype">
              <el-input v-model="newAppForm.elsetype" type="textarea" placeholder="请填写特殊类型说明" maxlength="200" :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="期望时间" prop="expecteddate" required>
              <el-date-picker
                v-model="newAppForm.expecteddate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2"
                :clearable='false'
                style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="备注描述" prop="desc">
              <el-input v-model="newAppForm.desc" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align: right" :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <span v-if="isNginxandDZ" style="color:red;">独占型nginx,应用的应用类型不是Nginx,不能提交<br /></span>
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="saveDraftsForm('newAppForm')" :disabled="isNginxandDZ" :loading="buttondisabled">保存草稿</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',1)" :disabled="isNginxandDZ" :loading="buttondisabled">保存草稿</el-button>
              <el-button @click="resetForm('newAppForm')">重置</el-button>
              <el-button v-if="this.$route.params.uuid == null" type="primary" @click="submitForm('newAppForm')" :disabled="isNginxandDZ" :loading="buttondisabled">立即提交</el-button>
              <el-button v-else type="primary" @click="submitEditForm('newAppForm',0)" :disabled="isNginxandDZ" :loading="buttondisabled">提交草稿</el-button>
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
        <el-button size="small" type="primary" v-if="active == 1 && conf.length == 0" @click="addvmip" disabled>确定</el-button>
        <el-button size="small" type="primary" v-else-if="active == 1" @click="addvmip">确定</el-button>
        <el-button v-if="active == 1" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchAppInfo } from '@/api/cmdbs/app_manage'
import {addWorkFlow, saveDraftsWorkFlow, editWorkFlowConfRow,getWFLine } from '@/api/workflow/app_manage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import { getProductAppCascader,getProductAppCascaderNginx} from '@/api/cmdbs/product_line'
import { getHelpDocContent } from '@/api/management/help_doc'
import { getPoolProduct,fetchIPList } from '@/api/cmdb'

export default {
  name: 'AppApplyForm',
  directives: { waves },
  mixins: [resize, sessionNewAppForm],
  data() {
    return {
      aDetail:{},
      nginxOptions:[],
      projectOptions:[],
      // infooptions:[],
      poolOptionsA:[],
      poolOptions:[],
      // disabledPool: true,
      isNginxandDZ:false,
      dialogVisible:false,
      buttondisabled:false,
      slbindex:undefined,
      buttonkey:1,
      active: 0,
      total:0,
      tableData:[],
      ipList:[],
      conf:[],
      help_doc_url:'',
      configinfodict: {
        'ip': '',
        'port': '80',
        'weight':'100',
        'portstatus':'0',
      },
      newAppForm: {
        project_name_list:[],
        app_name:'',
        app_cname:'',
        app_type:'',
        app_id:'',
        project_num:'',
        expecteddate: '',
        needdesc:'',
        elsetype:'',
        desc: '',
        Domain_name:'',
        port:undefined,
        env:'生产',
        htype:'HTTP',
        ntype:'0',
        is_cdn:'0',
        location:'',
        qps: undefined,
        network_rule: '轮询',
        type:'独占型',
        tableData:[],
        slbconfiginfo:[],
        routeParams: '',
      },
      slbconfiginfodictadd: {
        'location': '',
        'check_url': '',
        'project_name_list':[],
        'app_name':'',
        'app_cname':'',
        'app_id':'',
        'desc':'',
        'slbconf':[],
        'status':1,
      },
      pickerOptions2: {
        disabledDate(end) {
          return end.getTime() < Date.now() + 86400000 * 6
        }
      },
      listQuery: {
        page: 1,
        limit: 20,
        app_id: undefined,
        resource_env:undefined
      },
      rules: {
        project_name_list: [{ type: 'array',required: true, message: '请选择产品线及应用名', trigger: 'change' },],
        project_num: [{ required: true, message: '请选择项目编号', trigger: 'change' },],
        type:[{ required: true, message: '请选择资源类型', trigger: 'blur' },],
        needdesc:[{ required: true, message: '请输入需求描述', trigger: 'blur' },],
        Domain_name:[{ required: true, message: '请输入域名', trigger: 'blur' },],
        qps: [{required: true, message: '请输入QPS', trigger: 'blur'},],
      }
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
    this.newAppForm.expecteddate = this.initDate(7);
    this.newAppForm.slbconfiginfo.push(Object.assign({}, this.slbconfiginfodictadd))
    getProductAppCascader().then(response => {
      this.projectOptions = response
    })
    getProductAppCascaderNginx().then(response => {
      this.nginxOptions = response
    })
    getPoolProduct().then(response => {
      this.poolOptionsA = response
      this.getpooloption()
    })
    this.renderDraftsData()
  },
  methods: {
    // 独占型day+7 共享型day+3
    changeexpecteddate(){
      if ( this.newAppForm.type == '独占型' && this.newAppForm.app_type.toLowerCase() !== 'nginx') {
        this.isNginxandDZ = true
      } else{
        this.isNginxandDZ = false
      }
      if (this.newAppForm.type == '独占型') {
        this.newAppForm.expecteddate = this.initDate(7);
        this.pickerOptions2 = {
          disabledDate(end) {
            return end.getTime() < Date.now() + 86400000 * 6
          }
        }
      } else{
        this.newAppForm.expecteddate = this.initDate(3);
        this.pickerOptions2 = {
          disabledDate(end) {
            return end.getTime() < Date.now() + 86400000 * 2
          }
        }
      }
    },
    renderDraftsData() {
      if(this.$route.params.detailData_edit){
        this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
        this.renderDraftsData1();
      }
    },
    renderDraftsData1() {
      try {
        this.newAppForm.ntype = this.aDetail.ntype
        this.newAppForm.project_name_list = this.aDetail.project_name_list
        this.newAppForm.app_id = this.newAppForm.project_name_list[3]
        this.newAppForm.app_name = this.aDetail.app_name
        this.newAppForm.app_cname = this.aDetail.app_cname
        this.newAppForm.app_type = this.aDetail.app_type
        this.newAppForm.project_num = this.aDetail.project_num
        this.newAppForm.type = this.aDetail.type
        this.newAppForm.expecteddate = this.aDetail.expecteddate
        this.newAppForm.needdesc = this.aDetail.needdesc
        this.newAppForm.desc = this.aDetail.desc
        this.newAppForm.Domain_name = this.aDetail.Domain_name
        this.newAppForm.port = this.aDetail.port
        if (this.newAppForm.project_name_list[3]) this.vmIpList(this.newAppForm.project_name_list)
        this.newAppForm.elsetype = this.aDetail.elsetype
        this.newAppForm.env = this.aDetail.env
        this.newAppForm.htype = this.aDetail.htype
        this.newAppForm.is_cdn = this.aDetail.is_cdn
        this.newAppForm.location = this.aDetail.location
        this.newAppForm.qps = this.aDetail.qps
        this.newAppForm.network_rule = this.aDetail.network_rule
        this.newAppForm.slbconfiginfo = this.aDetail.slbconfiginfo
        if (this.newAppForm.type == '独占型') {
          this.pickerOptions2 = {
            disabledDate(end) {
              return end.getTime() < Date.now() + 86400000 * 6
            }
          }
        } else{
          this.pickerOptions2 = {
            disabledDate(end) {
              return end.getTime() < Date.now() + 86400000 * 2
            }
          }
        }
      } catch (error) {
        // TODO 异常情况如何处理
        console.log(this.$route.params.detailData_edit)
      }
    },
    beforesubmit(){
      if (this.newAppForm.ntype == '0') {
        for (var i = 0; i < this.newAppForm.slbconfiginfo.length; i++) {
          if (this.newAppForm.slbconfiginfo[i].slbconf.length == 0) {
            this.$message({
              showClose: true,
              message: '策略不能为空',
              type: 'warning'
            });
            return false
          }
        }
      }
    },
    // 修改草稿提交、或者再次保存草稿，都是update数据
    submitEditForm(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (this.beforesubmit()==false) {
          return false
        }
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
      if (this.beforesubmit()==false) {
        return false
      }
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
    submitForm(formName) {
      if (this.beforesubmit()==false) {
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.buttondisabled = true
          addWorkFlow(this.$route.params.id, this.newAppForm).then(response => {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 3000
            })
            this.buttondisabled = false
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push('/workflow/workflow_list');
              })
          }).catch(err => {
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
        this.getpooloption()
      }else{
        this.poolOptions = []
        // this.$refs[formName].resetFields()
        this.newAppForm = this.$options.data().newAppForm;
        var object={}
        object.id = this.$route.params.id
        object.name = this.$route.params.name
        this.newAppForm.routeParams = object
        this.newAppForm.expecteddate = this.initDate(7);
        this.pickerOptions2 = {
          disabledDate(end) {
            return end.getTime() < Date.now() + 86400000 * 6
          }
        }
        this.newAppForm.slbconfiginfo = []
        this.newAppForm.slbconfiginfo.push(Object.assign({}, this.slbconfiginfodictadd))
        // 重置时button重新渲染
        if (this.buttonkey == 1) {
          this.buttonkey = 0
        } else{
          this.buttonkey = 1
        }
        // this.disabledPool = true;
        this.isNginxandDZ = false
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
      })
    },
    getpooloption(){
      if(this.$route.params.detailData_edit){
        this.projectChange(this.newAppForm.project_name_list)
        this.newAppForm.project_num = this.aDetail.project_num
      }
    },
    projectChange(choose) {
      this.newAppForm.project_num = ''
      if (this.newAppForm.project_name_list.length == 0) {
        this.poolOptions = []
        this.isNginxandDZ = false
        return
      }
      // this.disabledPool = false;
      //取产品线大部门
      choose = choose[0].split('-')[0];
      this.poolOptions = this.poolOptionsA[choose]
      if (this.poolOptions) {
        // console.log(this.poolOptions)
      } else {
        this.poolOptions = []
        // this.disabledPool = true
      }
      // 应用已关联项目,直接取到
      this.newAppForm.app_id = this.newAppForm.project_name_list[3]
      fetchAppInfo(this.newAppForm.app_id).then(response => {
        this.newAppForm.app_name = response.app_name
        this.newAppForm.app_cname = response.app_cname
        this.newAppForm.app_type = response.app_type
        if ( this.newAppForm.type == '独占型' && this.newAppForm.app_type.toLowerCase() !== 'nginx') {
          this.isNginxandDZ = true
        } else{
          this.isNginxandDZ = false
        }
        var project_num = response.pool_cname
        if ( project_num !== '') {
          for (var i = 0; i < this.poolOptions.length; i++) {
            if ( this.poolOptions[i].display_name == project_num) {
              this.newAppForm.project_num = '('+this.poolOptions[i].key+')'+this.poolOptions[i].display_name
              // this.disabledPool = true
              return
            }
          }
        }
      })
    },
    data(query){
      fetchIPList(query).then(response => {
        var total = response.count
        const tableData = []
        for (const i of response.results) {
          tableData.push( i.ip )
        }
        // 合并为一个数组
        this.newAppForm.tableData = this.newAppForm.tableData.concat(tableData)
        if( query.page < total/20 ){
          query.page++
          this.data(query)
        } else{
          query.page = 1
        }
      })
    },
    vmIpList(produceline){
      this.newAppForm.tableData = []
      if (!produceline[3]) { return }
      this.listQuery.app_id = produceline[3]
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
    //应用名修改 应用IP 项目编号
    productchange(produceline){
      this.vmIpList(produceline)
      this.projectChange(produceline)
    },
    getslbIP(item){
      if (item.project_name_list.length == 0) {
        item.slbconf = []
        return
      } else{
        item.app_id = item.project_name_list[3]
        fetchAppInfo(item.app_id).then(response => {
          item.app_name = response.app_name
          item.app_cname = response.app_cname
        })
      }
    },
    addDomain() {
      const slbconfiginfo = Object.assign({}, this.slbconfiginfodictadd)
      slbconfiginfo.status = 2
      this.newAppForm.slbconfiginfo.push(slbconfiginfo)
    },
    removeDomain(item) {
      var index = this.newAppForm.slbconfiginfo.indexOf(item)
      if (index !== -1) {
        this.newAppForm.slbconfiginfo.splice(index, 1)
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
    slbdata(query){
      fetchIPList(query).then(response => {
        this.total = response.count
        const tableData = []
        for (const i of response.results) {
          tableData.push( {ip:i.ip} )
        }
        // 合并为一个数组
        this.tableData = this.tableData.concat(tableData)
        if( query.page < this.total/20 ){
          query.page++
          this.slbdata(query)
        } else{
          query.page = 1
        }
      })
    },
    slbIpList(produceline){
      if (!produceline[3]) { return }
      this.listQuery.app_id = produceline[3]
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
      this.slbdata(this.listQuery)
    },
    step0(item){
      this.dialogVisible = true
      if (item.slbconf.length == 0) {
        this.active = 0
        this.ipList = []
        this.total = 0
        this.tableData = []
        this.conf = []
        this.slbIpList(item.project_name_list)
      }else{
        this.active = 1
        this.conf = item.slbconf
        this.ipList = []
        for (var i = 0; i < this.conf.length; i++) {
          if( i==0 || this.conf[i].ip !== this.conf[i-1].ip ){
            this.ipList.push(this.conf[i].ip)
          }
        }
      }
    },
    step1(){
      this.active = 0
      this.total = 0
      this.tableData = []
      this.slbIpList(this.newAppForm.slbconfiginfo[this.slbindex].project_name_list)
      this.ipList = []
      for (var i = 0; i < this.conf.length; i++) {
        if( i==0 || this.conf[i].ip !== this.conf[i-1].ip ){
          this.ipList.push(this.conf[i].ip)
        }
      }
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
      this.newAppForm.slbconfiginfo[this.slbindex].slbconf = this.conf
      this.dialogVisible = false
    },
    getHelpDoc() {
      // getHelpDocContent({board:'workflow',title:'新建申请单-'+ this.$route.params.name}).then(response => {
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
  }
}
</script>
<style lang="scss" scoped>
  .app-search-class {
    max-width: 500px;
  }
  // .config_os > label {
  //   padding-right: 1px;
  // }
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
  .marginbottom{
    /deep/.el-form-item{margin-bottom:10px;}
  }
  .help-svg-pointer:hover {
    cursor: pointer;
  }
  a{
    color: #1890ff;
  }
</style>
