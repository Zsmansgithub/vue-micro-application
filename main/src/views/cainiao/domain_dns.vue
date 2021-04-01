<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item v-if="false1">
          <el-input v-model.trim="listQuery.domainname" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                    @change="change_fs" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item v-if="false2">
          <el-input v-model.trim="listQuery.name" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="listQuery.type" @change="handleFilter" clearable filterable placeholder="类型">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="line">
          <el-select v-model="listQuery.line" @change="handleFilter" clearable filterable placeholder="线路"
                     style="width: 120px">
            <el-option v-for="item in lineOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" @change="handleFilter" clearable placeholder="状态" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="yto_line">
          <el-select v-model="listQuery.yto_line" @change="handleFilter" clearable placeholder="出口链路"
                     style="width: 120px">
            <el-option v-for="item in yLineOptions1" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <!--        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>-->
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" v-if="adminrole&fff" type="primary" @click="dialogCreateAppVisible=true"
                   icon="el-icon-plus">添加记录
        </el-button>
        <el-button class="filter-item" v-if="adminrole" :loading="downloadLoading" plain type="primary"
                   icon="el-icon-download" @click="exportCommon">导出
        </el-button>
        <el-button class="filter-item" v-if="adminrole" :disabled="disable3" type="danger"
                   @click="dialogUpdateVisible=true" icon="el-icon-edit">批量修改
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @selection-change="handleSelection" ref="table">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column label="域名">
        <template slot-scope="scope">
          <span>{{ scope.row.domainname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机记录" width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.rr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录类型" prop="type" sortable width="110">
        <template slot-scope="scope">
          <div v-if="scope.row.type==='MX'">
            <el-popover placement="top-start" width="10" trigger="hover">
              <p>优先级: {{ scope.row.priority }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.type }}</span>
              </div>
            </el-popover>
          </div>
          <div v-else>{{scope.row.type}}</div>
        </template>
      </el-table-column>
      <el-table-column label="解析线路" prop="line" sortable width="110" :formatter="isLine"/>
      <el-table-column label="记录值" width="150" prop="value" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TTL" prop="ttl" width="90" sortable :formatter="formatDate"/>
      <el-table-column label="状态" prop="status" width="90" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.status==='ENABLE'" style="color:#42B983;"><svg-icon icon-class="complete1"
                                                                                    style="width: 13px; height:13px;color:#42B983;"/> 正常</span>
          <span v-if="scope.row.status==='DISABLE'" style="color:#FFBA00;"><svg-icon icon-class="suspend1"
                                                                                     style="width: 13px; height:13px;color:#FFBA00;"/> 暂停</span>
          <el-tooltip class="item" effect="dark" content="已锁定" placement="top" v-if="scope.row.locked!=='未锁定'">
            <span v-if="scope.row.locked!=='未锁定'"><svg-icon icon-class="lock1"
                                                            style="width: 13px; height:13px;color:#42B983;"/></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="出口链路" width="120" prop="yto_line" sortable :formatter="changeLine">
      </el-table-column>
      <el-table-column label="端口" width="80" prop="port" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.port===-1"></span>
          <span v-else>{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="90" prop="user" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" width="135px" align="center" prop="update_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170px" fixed="right" align="center">
        <template slot-scope="props">
          <el-tooltip class="item" effect="dark" content="修改" placement="top" :hide-after="300">
            <el-button type="text" v-if="adminrole" @click="editFormCommon(props.row)">
              <svg-icon icon-class="edit1" style="width: 16px; height:16px;color:#1890FF;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="暂停" placement="top" :hide-after="300">
            <el-button type="text" @click="suspendCommon(props.row)" v-if="adminrole&props.row.status==='ENABLE'">
              <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="启动" placement="top" :hide-after="300">
            <el-button type="text" @click="suspendCommon(props.row)" v-if="adminrole&props.row.status==='DISABLE'">
              <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="300">
            <el-button type="text" v-if="adminrole" @click="deleteCommon(props.row)">
              <svg-icon icon-class="delete1" style="width: 14px; height:16px;color:#FF4949;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="请求量" placement="top">
            <el-button type="text" v-if="props.row.version==='企业标准版'" @click="sendRequest(props.row)">
              <svg-icon icon-class="data1" style="width: 14px; height:16px;color:#1890FF;"/>
            </el-button>
            <el-button type="text" v-else disabled @click="sendRequest(props.row)">
              <svg-icon icon-class="data1" style="width: 14px; height:16px;color:#C0C4CC;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="备注" placement="top">
            <el-button type="text" v-if="adminrole" @click="editRemark(props.row)">
              <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#1890FF;"/>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
      style="padding-top: 5px;margin-top: 10px;"
    />

    <el-dialog :visible.sync="dialogCreateAppVisible" @close="handleClose" width="35%">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">添加信息</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addDomainDns" :model="addDomainDns" :rules="rules" label-width="110px"
               style="margin:0 20px 0 -3px;">
        <el-form-item label="记录类型" prop="type">
          <el-select v-model.trim="addDomainDns.type" style="width: 95%;" filterable placeholder="类型"
                     @change="handleChange">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机记录" prop="rr">
          <el-input v-model.trim="addDomainDns.rr" style="width: 95%;float: left">
            <template slot="append"><span>{{this.addDomainDns.domainname}}</span></template>
          </el-input>
          <el-tooltip class="item" effect="dark" content="" placement="top-end" style="width: 5%;float: left">
            <div slot="content">主机记录就是域名前缀，常见用法有:<br/>
              www：解析后的域名为www.aliyun.com<br/>
              @：直接解析主域名 aliyun.com<br/>
              *：泛解析，匹配其他所有域名 *.aliyun.com<br/>
              mail：将域名解析为mail.aliyun.com，通常用于解析邮箱服务器<br/>
              二级域名：如：abc.aliyun.com，填写abc<br/>
              手机网站：如：m.aliyun.com，填写m<br/>
              显性URL：不支持泛解析（泛解析：将所有子域名解析到同一地址）
            </div>
            <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px;margin-top: 10px"/>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="记录值" prop="value">
          <el-input v-model.trim="addDomainDns.value" style="width: 95%;">
          </el-input>
        </el-form-item>
        <el-form-item label="解析线路" prop="line">
          <el-select v-model.trim="addDomainDns.line" style="width: 95%;float: left" filterable placeholder="线路">
            <el-option v-for="item in lineOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
          <el-tooltip class="item" effect="dark" content="" placement="top-end" style="width: 5%;float: left">
            <div slot="content">如果只有一个IP地址或CNAME域名，请务必选择[默认]<br/>
              默认：必填！未匹配到智能解析线路时，返回[默认]线路设置结果<br/>
              境外：向除中国大陆以外的其他国家和地区，返回设置的记录值<br/>
              搜索引擎：向搜索引擎爬虫的DNS，返回设置的记录值
            </div>
            <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px;margin-top: 10px"/>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="TTL" prop="ttl">
          <el-select v-model.trim="addDomainDns.ttl" style="width: 95%;">
            <el-option v-for="item in ttlOptions1" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" v-if="ff">
          <el-input-number v-model.trim="addDomainDns.priority" controls-position="right" :min="1" :max="50"
                           style="width: 95%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addDomainDns')">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="request_title" :visible.sync="dialogEditAppVisible" @close="handleClose" width="70%">
      <el-form :model="requestDomain" inline>
        <el-form-item label="域名" v-if="false">
          <el-input v-model="requestDomain.domainname" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="requestDomain.startDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions3">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="requestDomain.endDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions3">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="domainsearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24">
          <chart ref="chartd11" id="dchart1" title="" style="width:100%;height:400px;" v-bind:host_id="requestDomain"
                 url="/cainiao/request_domain_dns"/>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="dialogRemarkVisible" @close="handleClose" width="35%">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editDomain" :model="editDomain" label-width="110px" :rules="rules" style="margin:0 30px 0 -30px;">
        <el-form-item label="端口">
          <el-input v-model.trim="editDomain.port" controls-position="right" :min="0" :max="65535"
                    style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model.trim="editDomain.user" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="editDomain.remark" maxlength="50" show-word-limit :autosize="{ minRows: 4}"
                    type="textarea" style="width: 100%;">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editDomain')">取 消</el-button>
        <el-button type="primary" @click="submitRemark()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditVisible" @close="handleClose" width="35%">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改信息</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editDomainDns" :model="editDomainDns" :rules="rules" label-width="110px"
               style="margin:0 20px 0 -3px;">
        <el-form-item label="记录类型" prop="type">
          <el-select v-model.trim="editDomainDns.type" style="width: 95%;" filterable placeholder="类型"
                     @change="handleChange">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机记录" prop="rr">
          <el-input v-model.trim="editDomainDns.rr" style="width: 95%;float: left">
            <template slot="append"><span>{{this.editDomainDns.domainname}}</span></template>
          </el-input>
          <el-tooltip class="item" effect="dark" content="" placement="top-end" style="width: 5%;float: left">
            <div slot="content">主机记录就是域名前缀，常见用法有:<br/>
              www：解析后的域名为www.aliyun.com<br/>
              @：直接解析主域名 aliyun.com<br/>
              *：泛解析，匹配其他所有域名 *.aliyun.com<br/>
              mail：将域名解析为mail.aliyun.com，通常用于解析邮箱服务器<br/>
              二级域名：如：abc.aliyun.com，填写abc<br/>
              手机网站：如：m.aliyun.com，填写m<br/>
              显性URL：不支持泛解析（泛解析：将所有子域名解析到同一地址）
            </div>
            <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px;margin-top: 10px"/>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="记录值" prop="value">
          <el-input v-model.trim="editDomainDns.value" style="width: 95%;">
          </el-input>
        </el-form-item>
        <el-form-item label="解析线路" prop="line">
          <el-select v-model.trim="editDomainDns.line" style="width: 95%;float: left" filterable placeholder="线路">
            <el-option v-for="item in lineOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
          <el-tooltip class="item" effect="dark" content="" placement="top-end" style="width: 5%;float: left">
            <div slot="content">如果只有一个IP地址或CNAME域名，请务必选择[默认]<br/>
              默认：必填！未匹配到智能解析线路时，返回[默认]线路设置结果<br/>
              境外：向除中国大陆以外的其他国家和地区，返回设置的记录值<br/>
              搜索引擎：向搜索引擎爬虫的DNS，返回设置的记录值
            </div>
            <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px;margin-top: 10px"/>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="TTL" prop="ttl">
          <el-select v-model.trim="editDomainDns.ttl" style="width: 95%;">
            <el-option v-for="item in ttlOptions1" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" v-if="ff">
          <el-input-number v-model.trim="editDomainDns.priority" controls-position="right" :min="1" :max="50"
                           style="width: 95%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editDomainDns')">取 消</el-button>
        <el-button type="primary" @click="submitEdit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogUpdateVisible" @close="handleClose" width="500px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">批量修改配置</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="updateDomain" :model="updateDomain" :rules="batch_rules" label-width="110px"
               style="margin:0 20px 0 -20px;">
        <el-form-item label="修改选项">
          <el-checkbox-group v-model="checkList" @change="handleCheck">
            <el-checkbox label="状态"></el-checkbox>
            <el-checkbox label="解析线路"></el-checkbox>
            <el-checkbox label="记录值"></el-checkbox>
            <el-checkbox label="备注"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="updateDomain.status" style="width: 100%" :disabled="disable4">
            <el-option label="启用" value="ENABLE"></el-option>
            <el-option label="禁用" value="DISABLE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="解析线路" prop="line">
          <el-select v-model="updateDomain.line" style="width: 100%" :disabled="disable">
            <el-option v-for="item in lineOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="记录值" prop="value">
          <el-input v-model.trim="updateDomain.value" style="width: 100%;" :disabled="disable1">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="updateDomain.remark" style="width: 100%;" :disabled="disable2">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('updateDomain')">取 消</el-button>
        <el-button type="primary" @click="submitUpdate()">提交</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    domainDns,
    fetchDomainList,
    domainDnsInsert,
    fetchTypeInfo,
    domainDnsUpdate,
    domainDnsEdit,
    domainDnsSuspend,
    domainDnsDelete,
    batchDomainDns
  } from '@/api/cainiao/domain'
  import {deepClone} from '@/utils'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {mapGetters} from 'vuex'
  import {validIp} from '@/utils/validate'
  import Chart from '@/components/Charts/LineHistory_cainao'

  export default {
    name: 'ComplexTable',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
      UploadExcelComponent,
      Chart
    },
    directives: {
      waves,
    },
    data() {
      let validateValue = (rule, value, callback) => {
        if (!value && this.disable1 === false) {
          return callback(new Error('如果选择了记录值选项则必填'));
        } else {
          callback();
        }
      };
      let validateLine = (rule, value, callback) => {
        if (!value && this.disable === false) {
          return callback(new Error('如果选择了线路选项则必选'));
        } else {
          callback();
        }
      };
      let validateStatus = (rule, value, callback) => {
        if (!value && this.disable4 === false) {
          return callback(new Error('如果选择了状态选项则必选'));
        } else {
          callback();
        }
      };
      return {
        listQuery: {
          page: 1,
          limit: 20,
          domainname: undefined,
          type: undefined,
          line: undefined,
          status: undefined,
          yto_line: undefined,
          name: undefined,
          deleted: 0
        },
        addDomainDns: {
          type: 'A',
          priority: 10,
          line: 'default',
          ttl: this.ttls
        },
        requestDomain: {
          domainname: '',
          startDate: new Date(),
          endDate: new Date(),
          rr: ''
        },
        editDomain: {
          domainname: '',
          remark: '',
          recordid: '',
          port: -1,
          user: '',
        },
        editDomainDns: {
          domainname: '',
          rr: '',
          type: '',
          value: '',
          line: '',
          ttl: '',
          priority: '',
          recordid: ''
        },
        statusDomain: {
          recordid: '',
          status: '',
          domainname: ''
        },
        updateDomain: {
          status: '',
          line: '',
          remark: '',
          value: '',
        },
        timestamp: '',
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() > Date.now()
          }
        },
        pickerOptions3: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        datatime_default: '',
        list: null,
        request_title: '',
        disable: true,
        disable1: true,
        disable2: true,
        disable3: true,
        disable4: true,
        total: 0,
        listLoading: true,
        dialogCreateAppVisible: false,
        dialogEditAppVisible: false,
        dialogRemarkVisible: false,
        dialogEditVisible: false,
        dialogSmsVisible: false,
        downloadLoading: false,
        dialogUpdateVisible: false,
        adminrole: false,
        ff: false,
        fff: false,
        false1: true,
        false2: false,
        ttlOptions: [],
        ttlOptions1: [],
        yLineOptions1: [],
        checkList: [],
        selectOptions: [{'value': '1', 'label': '修改'}, {'value': '2', 'label': '暂停'}, {'value': '3', 'label': '删除'},
          {'value': '4', 'label': '请求量'}, {'value': '5', 'label': '备注'}],
        statusOptions: [{'value': 'ENABLE', 'label': '正常'}, {'value': 'DISABLE', 'label': '暂停'}],
        typeOptions: [],
        lineOptions: [],
        temp: '',
        ttls: '',
        rules: {
          value: [{required: true, message: '请填写记录值', trigger: 'blur'}],
          remark: [{max: 50, message: '备注不超过50个字符', trigger: 'blur'}],
        },
        batch_rules: {
          value: [{validator: validateValue, trigger: 'blur'}],
          line: [{validator: validateLine, trigger: 'blur'}],
          status: [{validator: validateStatus, trigger: 'blur'}],
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        multipleSelection: [],
        multipleSelect: []
      }
    },
    created() {
      this.adminrole = this.roles.includes('domain_admin')
      this.getList()
      this.datatime_default = this.getdata()
      this.getParams()
      this.getTypeInfo()
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      getTypeInfo() {
        fetchTypeInfo().then(res => {
          const line = []
          const type = []
          const y_line = []
          for (let i of res) {
            if (i.typename === 'Dns_Record_Line') {
              line.push({
                label: i.displayname, key: i.value_or_code
              })
            } else if (i.typename === 'Dns_Record_Type') {
              type.push({
                label: i.displayname, key: i.value_or_code
              })
            } else if (i.typename === 'YTO_Line') {
              y_line.push({
                label: i.displayname, key: i.value_or_code
              })
            }
          }
          this.lineOptions = line
          this.typeOptions = type
          this.yLineOptions1 = y_line
        })
      },
      handleCheck(val) {
        let line2 = 'N'
        let value2 = 'N'
        let remark2 = 'N'
        let status2 = 'N'
        for (const v in val) {
          if (val[v] === '解析线路') {
            line2 = 'Y'
          }
          if (val[v] === '记录值') {
            value2 = 'Y'
          }
          if (val[v] === '备注') {
            remark2 = 'Y'
          }
          if (val[v] === '状态') {
            status2 = 'Y'
          }
        }
        if (line2 == 'Y') {
          this.disable = false
        } else {
          this.disable = true
          this.updateDomain.line = undefined
        }
        if (value2 == 'Y') {
          this.disable1 = false
        } else {
          this.disable1 = true
          this.updateDomain.value = ''
        }
        if (remark2 == 'Y') {
          this.disable2 = false
        } else {
          this.disable2 = true
          this.updateDomain.remark = ''
        }
        if (status2 == 'Y') {
          this.disable4 = false
        } else {
          this.disable4 = true
          this.updateDomain.status = undefined
        }
      },
      isLine(row, column, cellValue) {
        for (const i of this.lineOptions) {
          if (i.key.indexOf(row.line) !== -1) {
            return i.label
          }
        }
      },
      getParams() {
        // 取到路由带过来的参数
        const routerParams = this.$route.query.mallCode
        this.$route.query.mallCode = undefined
        // 将数据放在当前组件的数据内
        if (routerParams) {
          this.listQuery.domainname = routerParams;
          this.temp = routerParams
          this.addDomainDns.domainname = this.temp
          this.getList()
          this.fff = true
          this.false1 = false
          this.false2 = true
          this.selectDomain(routerParams)
        } else {
          this.fff = false
          this.false2 = false
          this.false1 = true
        }
      },
      change_fs() {
        this.$route.query.mallCode = undefined
        this.fff = false
      },
      changeLine(val) {
        for (const i of this.yLineOptions1) {
          if (i.key.indexOf(val.yto_line) !== -1) {
            return i.label
          }
        }
        return '其他'
      },
      selectDomain(val) {
        fetchDomainList({domainname: val}).then(res => {
          const ttl = []
          const ava = res.results[0].availablettls.replace(/\[|]/g, '').split(',')
          this.ttls = parseInt(ava[0])
          ava.forEach(v => {
            ttl.push({label: v, key: parseInt(v)})
          })
          const data = this.formatTTL(ttl)
          this.ttlOptions1 = data
          this.addDomainDns.ttl = this.ttls
        })
        return this.ttlOptions1
      },
      getdata() {
        const date = new Date()
        return date.getFullYear() + '-' + date.getMonth() // 2019-05-1
      },
      formatDate(row, column, cellValue) {
        if (row.ttl < 60) {
          return row.ttl + '秒'
        } else if (60 <= row.ttl && row.ttl < 3600) {
          let h = parseInt(row.ttl / 60)
          return h + '分钟'
        } else if (3600 <= row.ttl && row.ttl < 86400) {
          let h = parseInt(row.ttl / 3600)
          return h + '小时'
        } else if (row.ttl >= 86400) {
          let d = parseInt(row.ttl / 86400)
          return d + '天'
        }
      },
      handleChange(val) {
        if (val === 'MX') {
          this.ff = true
          this.addDomainDns.priority = 10
        } else {
          this.ff = false
          this.addDomainDns.priority = 10
        }
      },
      sendRequest(row) {
        this.request_title = row.rr + '.' + row.domainname + '请求量'
        this.requestDomain.rr = row.rr
        this.requestDomain.domainname = row.domainname
        this.dialogEditAppVisible = true
        setTimeout(() => {
          this.$refs.chartd11.render(this.requestDomain);
        }, 1.5 * 2)
      },
      domainsearch() {
        if (!this.requestDomain.startDate) {
          this.requestDomain.startDate = new Date()
        }
        if (!this.requestDomain.endDate) {
          this.requestDomain.endDate = new Date()
        }
        this.$refs.chartd11.render(this.requestDomain);
      },
      handleSelection(val) {
        this.multipleSelect = val
        if (val.length > 10 || val.length < 1) {
          this.disable3 = true
          if (val.length > 10) {
            this.$refs.table.toggleRowSelection(val[val.length - 1], false);
            this.$msgbox({
              title: "提示",
              message: '一次最大修改记录条目不能超过10条！',
              showCancelButton: false,
              confirmButtonText: '确定',
              type: "warning"
            });
          }
        } else {
          this.disable3 = false
        }
      },
      handleReset() {
        if (this.temp) {
          this.resetlistQuery()
          this.listQuery.domainname = this.temp
          this.getList()
        } else {
          this.resetlistQuery()
          this.getList()
        }

      },
      getList() {
        this.listLoading = true
        domainDns(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          domainname: undefined,
          type: undefined,
          line: undefined,
          status: undefined,
          yto_line: undefined,
          name: undefined,
          deleted: 0
        }
      },
      submitForm() {
        this.$refs.addDomainDns.validate(valid => {
          if (valid) {
            if (typeof this.addDomainDns.rr == "undefined" || this.addDomainDns.rr == null || this.addDomainDns.rr === "") {
              this.addDomainDns.rr = '@';
            }
            const loading = this.$loading({
              lock: true,
              text: '记录添加中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            domainDnsInsert(this.addDomainDns).then(response => {
              if (response.message === 'ok') {
                loading.close();
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                });
                this.dialogCreateAppVisible = false
                this.getList();
              } else {
                loading.close();
                this.$message({
                  message: '失败:' + response.message,
                  type: 'error',
                  duration: 5000
                });
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          } else {
            loading.close();
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            });
            return false
          }
        })
        this.dialogCreateAppVisible = false
      },
      editRemark(row) {
        this.editDomain.remark = row.remark
        this.editDomain.domainname = row.domainname
        this.editDomain.recordid = row.recordid
        this.editDomain.port = row.port
        this.editDomain.user = row.user
        this.editDomain.users = row.user
        this.editDomain.ports = row.port
        this.editDomain.remarks = row.remark
        this.dialogRemarkVisible = true
      },
      submitRemark() {
        const loading = this.$loading({
          lock: true,
          text: '备注信息修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        domainDnsUpdate(this.editDomain).then(response => {
          if (response.message === 'ok') {
            loading.close();
            this.$message({
              message: '备注成功',
              type: 'success',
              duration: 2000
            });
            this.dialogRemarkVisible = false
            this.getList();
          } else {
            loading.close();
            this.$message({
              message: '失败:' + response.message,
              type: 'error',
              duration: 5000
            });
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
        this.dialogRemarkVisible = false
      },
      editFormCommon(row) {
        this.selectDomain(row.domainname)
        this.dialogEditVisible = true
        this.editDomainDns.rr = row.rr
        this.editDomainDns.type = row.type
        this.editDomainDns.line = row.line
        this.editDomainDns.recordid = row.recordid
        this.editDomainDns.ttl = row.ttl
        this.editDomainDns.domainname = row.domainname
        this.editDomainDns.priority = row.priority
        this.editDomainDns.value = row.value
        this.editDomainDns.values = row.value
        this.editDomainDns.ttls = row.ttl
        this.editDomainDns.lines = row.line
        this.editDomainDns.type1 = row.type
        this.editDomainDns.rrs = row.rr
      },
      submitEdit() {
        this.$refs.editDomainDns.validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: '域名修改中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            domainDnsEdit(this.editDomainDns).then(res => {
              if (res.message === 'ok') {
                loading.close();
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                });
                this.dialogEditVisible = false
                this.getList()
              } else {
                loading.close();
                this.$message({
                  message: '失败:' + res.message,
                  type: 'error',
                  duration: 5000
                });
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            })
          } else {
            loading.close();
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            });
            return false
          }
        })
        this.dialogEditVisible = false
      },
      suspendCommon(row) {
        this.statusDomain.recordid = row.recordid
        this.statusDomain.domainname = row.domainname
        this.statusDomain.status_s = row.status
        if (row.status === 'ENABLE') {
          this.statusDomain.status = 'DISABLE'
          const msg = '确定要暂停该域名吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名暂停中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            domainDnsSuspend(this.statusDomain).then(res => {
              if (res.message === 'ok') {
                loading.close();
                this.$message({
                  message: '暂停成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
                this.$message({
                  message: '失败:' + res.message,
                  type: 'error',
                  duration: 5000
                });
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          })
        } else {
          this.statusDomain.status = 'ENABLE'
          const msg = '确定要启动该域名吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名启动中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            domainDnsSuspend(this.statusDomain).then(res => {
              if (res.message === 'ok') {
                loading.close();
                this.$message({
                  message: '启动成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
                this.$message({
                  message: '失败:' + res.message,
                  type: 'error',
                  duration: 5000
                });
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          })
        }
      },
      deleteCommon(row) {
        const msg = '确定删除该域名吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: '域名删除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          domainDnsDelete({'domainname': row.domainname, 'record': row.recordid}).then(res => {
            if (res.message === 'ok') {
              loading.close();
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.getList()
            } else {
              loading.close();
              this.$message({
                message: '失败:' + res.message,
                type: 'error',
                duration: 5000
              });
            }
          }).catch(err => {
            loading.close();
            this.$message({
              message: err,
            });
          });
        })
      },
      submitUpdate() {
        this.$refs.updateDomain.validate(valid => {
          if (valid) {
            if (this.checkList.length > 0) {
              let aaa = '0'
              let bbb = 'N'
              for (const i of this.multipleSelect) {
                if (aaa === '0') {
                  aaa = '1'
                } else {
                  bbb = 'Y'
                }
                const temp = {}
                temp.sign = bbb
                temp.status2 = i.status
                temp.lines = i.line
                temp.values = i.value
                temp.remarks = i.remark
                if (this.updateDomain.status) {
                  temp.status = this.updateDomain.status
                } else {
                  temp.status = ''
                }
                if (this.checkList.indexOf('备注') === -1) {
                  temp.remark = 'NoSet'
                } else {
                  temp.remark = this.updateDomain.remark
                }
                temp.line = i.line
                temp.value = i.value
                temp.modifyd_line = 'N'
                temp.modifyd_value = 'N'
                if (this.updateDomain.line) {
                  temp.modifyd_line = i.line
                  temp.line = this.updateDomain.line
                }
                if (this.updateDomain.value) {
                  temp.modifyd_value = i.value
                  temp.value = this.updateDomain.value
                }
                temp.domainname = i.domainname
                temp.recordid = i.recordid
                temp.rr = i.rr
                temp.type = i.type
                temp.ttl = i.ttl
                temp.priority = i.priority
                const loading = this.$loading({
                  lock: true,
                  text: '域名修改中，请稍后',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                batchDomainDns(temp).then(res => {
                  if (res.message === '修改成功') {
                    this.$message({
                      message: '修改成功',
                      type: 'success',
                      duration: 1000
                    });
                    loading.close();
                  } else {
                    this.$message({
                      message: res.message,
                      type: 'error',
                      duration: 3000
                    });
                    loading.close();
                  }
                  this.getList()
                }).catch(err => {
                  loading.close();
                  this.$message({
                    message: err,
                  });
                })
                this.dialogUpdateVisible = false
              }
            } else {
              this.$message({
                message: '请填写相关字段',
                type: 'warning',
                duration: 2000
              });
            }
          }
        })
      },
      resetForm(formName) {
        this.dialogCreateAppVisible = false
        this.dialogRemarkVisible = false
        this.dialogEditVisible = false
        this.dialogUpdateVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose() {
        this.addDomainDns = {
          type: 'A',
          priority: 10,
          line: 'default',
          rr: '',
          value: '',
          ttl: this.ttls,
          domainname: this.temp
        }
        this.ff = false
        this.updateDomain = {
          value: '',
          status: '',
          line: '',
          remark: '',
        }
        this.checkList = []
        this.disable4 = true
        this.disable = true
        this.disable1 = true
        this.disable2 = true
        this.$refs['updateDomain'].resetFields()
      },
      exportCommon() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '域名', '主机记录', '记录类型', '解析线路', '记录值', '端口', 'TTL', '状态', '是否锁定', '负责人', '优先级', '更新日期', '备注']
          const filterVal = ['id', 'domainname', 'rr', 'type', 'line', 'value', 'port', 'ttl', 'status', 'locked', 'user', 'priority', 'update_time', 'remark']
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'update_time') {
            const date = new Date(parseInt(v[j]) * 1000);
            const year = date.getFullYear();
            const mon = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minu = date.getMinutes();
            const sec = date.getSeconds();
            return year + '/' + mon + '/' + day + ' ' + hours + ':' + minu + ':' + sec;
          } else {
            return v[j]
          }
        }))
      },
      formatTTL(val) {
        for (const i of val) {
          if (parseInt(i.label) === 60) {
            i.label = '1分钟'
          } else if (parseInt(i.label) === 120) {
            i.label = '2分钟'
          } else if (parseInt(i.label) === 600) {
            i.label = '10分钟'
          } else if (parseInt(i.label) === 1800) {
            i.label = '30分钟'
          } else if (parseInt(i.label) === 3600) {
            i.label = '1小时'
          } else if (parseInt(i.label) === 43200) {
            i.label = '12小时'
          } else if (parseInt(i.label) === 86400) {
            i.label = '1天'
          }
        }
        return val
      }
    },
  }
</script>
<style scoped>
  .app-search-class {
    max-width: 300px;
  }

  .pre_class {
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }
</style>
