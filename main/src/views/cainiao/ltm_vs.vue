<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-row>
          <el-form-item>
            <el-input v-model.trim="listQuery.name" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                      clearable
                      style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model.trim="listQuery.ltm_ip" @change="handleFilter" clearable placeholder="管理IP"
                       style="width: 130px;">
              <el-option v-for="item in ipOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="availabilitystate">
            <el-select v-model="listQuery.availabilitystate" @change="handleFilter" clearable placeholder="可用状态"
                       style="width: 105px;">
              <el-option v-for="item in enableOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="enabledstate">
            <el-select v-model.trim="listQuery.enabledstate" @change="handleFilter" clearable placeholder="启用状态"
                       style="width: 120px;">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div v-if="listQuery.select==='create'">
              <el-button type="text" @click="listQuery.select='update'">创建时间<i class="el-icon-caret-bottom "></i></el-button>
              <el-date-picker
              v-model="listQuery.opr_time_s"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="handleFilter">
            </el-date-picker>
            </div>
            <div v-else-if="listQuery.select==='update'">
              <el-button type="text" @click="listQuery.select='create'">更新时间<i class="el-icon-caret-bottom "></i></el-button>
              <el-date-picker
              v-model="listQuery.opr_time_u"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="handleFilter">
            </el-date-picker>
            </div>
          </el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-plus"
                     @click="dialogAddVisible=true" v-if="adminrole">新增
          </el-button>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="可用状态" align="center" width="78">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="250" trigger="hover">
            <p>状态: {{ scope.row.statusreason }}</p>
            <div slot="reference" class="name-wrapper">
              <span v-if="scope.row.availabilitystate==='可用'"><svg-icon icon-class="F5_Available"
                                                                        style="font-size: 16px"></svg-icon></span>
              <span v-else-if="scope.row.availabilitystate==='不可用'"><svg-icon icon-class="F5_UnAvailable"
                                                                              style="font-size: 16px"></svg-icon></span>
              <span v-else-if="scope.row.availabilitystate==='离线'"><svg-icon icon-class="F5_Offline"
                                                                             style="font-size: 16px"></svg-icon></span>
              <span v-else><svg-icon icon-class="F5_Unknow" style="font-size: 16px"></svg-icon></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="管理IP" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ltm_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VS名称/分区" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.partition}}</div>
        </template>
      </el-table-column>
      <el-table-column label="目的地址/端口" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.destination }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.serviceport}}</div>
        </template>
      </el-table-column>
      <el-table-column label="协议/HTTP" width="100">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="250" trigger="hover">
            <p v-if="scope.row.ssl_profile_client!==''">SSL Profile (Client): {{ scope.row.ssl_profile_client }}</p>
            <p v-if="scope.row.protocol_profile_client!==''">Protocol Profile (Client): {{ scope.row.protocol_profile_client }}</p>
            <p>Notify Status: {{ scope.row.addressstatus }}</p>
            <div slot="reference" class="name-wrapper">
              <span>{{scope.row.ipprotocol}}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.http_profile_client}}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="源地址/SnatPool" width="130">
        <template slot-scope="scope">
          <span>{{scope.row.sourceaddresstranslation}}</span>
          <div><a style="color: #1890ff;font-size: 10px" @click="send_snat(scope.row.snatpool)">{{ scope.row.snatpool }}</a></div>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" width="77" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.enabledstate==='启用'"><svg-icon icon-class="F5_Enabled"
                                                               style="color:#009551;"></svg-icon>&nbsp;<span
            style="color:#009551;">启用</span></span>
          <span v-else-if="scope.row.enabledstate==='禁用'"><svg-icon icon-class="F5_Disabled"
                                                                    style="color:#C64333;"></svg-icon>&nbsp;<span
            style="color:#C64333;">禁用</span></span>
        </template>
      </el-table-column>
      <el-table-column label="默认Pool/规则" width="250">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_pool(scope.row.pool)">{{ scope.row.pool }}</a>
          <div><a style="color: #1c22ff;font-size: 10px" @click="send_rule(scope.row.rules)">{{ scope.row.rules }}</a></div>
        </template>
      </el-table-column>
      <el-table-column label="修改/创建 时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.lastmodifiedtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新人员/备注" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.description}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170px" align="center" v-if="adminrole" fixed="right">
        <template slot-scope="props">
          <el-button type="text" @click="refresh_vs(props.row)">
            <svg-icon icon-class="refresh8" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-tooltip class="item" effect="dark" content="禁用" placement="top" :hide-after="300">
            <el-button type="text" @click="suspendCommon(props.row)" v-if="props.row.enabledstate==='启用'">
              <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="启用" placement="top" :hide-after="300">
            <el-button type="text" @click="startCommon(props.row)" v-if="props.row.enabledstate==='禁用'">
              <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="更新VS" placement="top" :hide-after="300">
            <el-button type="text" @click="editFormCommon(props.row)">
              <svg-icon icon-class="F5_Update" style="width: 16px; height:16px;"/>
            </el-button>
          </el-tooltip>
          <el-button type="text" @click="delete_vs(props.row)">
            <svg-icon icon-class="delete1" style="width: 16px; height:16px;color:#FF4949;"/>
          </el-button>
          <el-button type="text" @click="remarkDialog(props.row)">
            <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes="[20,50,100,200,500]"
      @pagination="getList"
      style="padding-top: 5px;margin-top: 10px;"
    />
    <el-dialog :visible.sync="dialogAddVisible" @close="handleClose" width="1020px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增Virtual Server</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addVsForm" :model="addVsForm" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="管理IP" prop="mgmt_ip">
              <el-select v-model="addVsForm.mgmt_ip" style="width: 320px" @change="handleChange"
                         placeholder='请选择管理IP'>
                <el-option v-for="item in ipOptions" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="分区" style="margin-left:-4px;" prop="partition">
              <el-select style="width: 320px;" v-model="addVsForm.partition" placeholder='请选择分区' @change="handleCheck">
                <el-option v-for="item in selectOptions" :key="item.ltm_ip" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">仅输入名称即可，创建时格式会自动补全（名称_服务端口_链路_vs）</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                名称
              </label>
              <el-input v-model.trim="addVsForm.name" style="width: 320px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="NotifyStatus" style="margin-left:-4px;" prop="monitor">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">Notify Status to Virtual Address</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                NotifyStatus
              </label>
              <el-select v-model.trim="addVsForm.addressstatus" style="width: 320px">
                <el-option v-for="item in notifyOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="目的地址" prop="destination">
              <el-input v-model="addVsForm.destination" style="width: 320px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="服务端口" style="margin-left:-4px;" prop="serviceport">
              <el-input-number style="width: 320px;" controls-position="right" :min="0" :max="65535" v-model.trim="addVsForm.serviceport"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="协议" prop="ipprotocol">
              <el-select style="width: 320px;" v-model.trim="addVsForm.ipprotocol" @change="handleProtocol">
                <el-option v-for="item in ipprotocolOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户端协议配置" style="margin-left:-4px;">
              <el-select style="width: 320px;" v-model.trim="addVsForm.protocol_profile_client">
                <el-option v-for="item in clientOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="客户端HTTP配置">
              <el-select :disabled="disabled" style="width: 320px;" v-model.trim="addVsForm.http_profile_client">
                <el-option v-for="item in httpOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户端SSL配置" style="margin-left:-4px;">
              <el-select style="width: 320px;" v-model.trim="addVsForm.ssl_profile_client" filterable multiple>
                <el-option v-for="item in sslOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="源地址转换">
              <el-select style="width: 320px;" v-model.trim="addVsForm.sourceaddresstranslation" @change="handleSource">
                <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="SNATPool" style="margin-left:-4px;">
              <el-select :disabled="disabled1" style="width: 320px;" v-model.trim="addVsForm.snatpool">
                <el-option v-for="item in snatOptions" :key="item.id" :label="item.snatpool_name" :value="item.snatpool_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="默认Pool">
              <el-select style="width: 320px;" v-model.trim="addVsForm.pool" filterable>
                <el-option v-for="item in poolOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="iRules" style="margin-left:-4px;">
              <el-select style="width: 320px;" v-model.trim="addVsForm.rules" filterable multiple>
                <el-option v-for="item in ruleOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态">
              <el-select style="width: 320px;" v-model.trim="addVsForm.state">
                <el-option label="启用" value="enabled"></el-option>
                <el-option label="禁用" value="disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" style="margin-left:-4px;">
              <el-input style="width: 320px;" v-model.trim="addVsForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addVsForm')">取 消</el-button>
        <el-button type="primary" @click="insert_vs('addVsForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogRemarkVisible" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="remarkForm" :model="remarkForm" class="remarkForm" label-width="50px">
        <el-form-item label="备注" style="width: 400px">
          <el-input v-model="remarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogRemarkVisible=false">取 消</el-button>
        <el-button type="primary" @click="remark_vs()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditVisible" @close="handleClose" width="1020px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改Virtual Server</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editVsForm" :model="editVsForm" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="目的地址" prop="destination">
              <el-input v-model="editVsForm.destination" style="width: 320px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="服务端口" style="margin-left:-4px;" prop="serviceport">
              <el-input-number style="width: 320px;" controls-position="right" :min="0" :max="65535" v-model.trim="editVsForm.serviceport"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="协议">
              <el-select style="width: 320px;" v-model.trim="editVsForm.ipprotocol" @change="handleProtocol">
                <el-option v-for="item in ipprotocolOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户端协议配置" style="margin-left:-4px;">
              <el-select style="width: 320px;" v-model.trim="editVsForm.protocol_profile_client" filterable clearable>
                <el-option v-for="item in clientOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="客户端HTTP配置">
              <el-select :disabled="disabled" style="width: 320px;" v-model.trim="editVsForm.http_profile_client" filterable clearable>
                <el-option v-for="item in httpOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户端SSL配置" style="margin-left:-4px;">
              <el-select style="width: 320px;" v-model.trim="editVsForm.ssl_profile_client" filterable multiple>
                <el-option v-for="item in sslOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="源地址转换">
              <el-select style="width: 320px;" v-model.trim="editVsForm.sourceaddresstranslation" @change="handleSource">
                <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="SNATPool" style="margin-left:-4px;">
              <el-select :disabled="disabled1" style="width: 320px;" v-model.trim="editVsForm.snatpool" clearable>
                <el-option v-for="item in snatOptions" :key="item.id" :label="item.snatpool_name" :value="item.snatpool_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="默认Pool">
              <el-select style="width: 320px;" v-model.trim="editVsForm.pool" filterable clearable>
                <el-option v-for="item in poolOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="iRules" style="margin-left:-4px;">
              <el-select style="width: 320px;" v-model.trim="editVsForm.rules" filterable multiple>
                <el-option v-for="item in ruleOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态">
              <el-select style="width: 320px;" v-model.trim="editVsForm.state">
                <el-option label="启用" value="enabled"></el-option>
                <el-option label="禁用" value="disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="NotifyStatus" style="margin-left:-4px;" prop="monitor">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">Notify Status to Virtual Address</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                NotifyStatus
              </label>
              <el-select v-model.trim="editVsForm.addressstatus" style="width: 320px">
                <el-option v-for="item in notifyOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" style="margin-left:-4px;">
          <el-input style="width: 100%;" v-model.trim="editVsForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editVsForm')">取 消</el-button>
        <el-button type="primary" @click="edit_vs('editVsForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getLtmVs, addLtmVs, editLtmVs, deleteLtmVs,mgIps,ltmIpName,getProfileClient,getSnatName,getPoolName,getRuleName,refreshLtmVs,statusLtmVs,remarkLtmVs} from '@/api/cainiao/ltm'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'
  import {mapGetters} from 'vuex'

  export default {
    name: "ltm_vs",
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
    },
    directives: {
      waves,
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
      }
      return {
        listLoading: true,
        adminrole: false,
        dialogAddVisible: false,
        dialogRemarkVisible: false,
        dialogEditVisible: false,
        disabled: true,
        disabled1: true,
        total: 0,
        list: null,
        remark_row:'',
        ipOptions:[],
        partitionOptions:[],
        selectOptions:[],
        profileOptions:[],
        snatOptions:[],
        poolOptions:[],
        ruleOptions:[],
        clientOptions:[],
        httpOptions:[],
        sslOptions:[],
        sourceOptions: [{'value': 'snat', 'label': 'SNAT'}, {'value': 'automap', 'label': 'AutoMap'},{'value': 'none', 'label': 'None'}],
        ipprotocolOptions: [{'value': 'tcp', 'label': 'TCP'}, {'value': 'udp', 'label': 'UDP'}],
        notifyOptions: [{'value': 'yes', 'label': '启用'}, {'value': 'no', 'label': '禁用'}],
        statusOptions: [{'value': '启用', 'label': '启用'}, {'value': '禁用', 'label': '禁用'}],
        enableOptions: [{'value': '可用', 'label': '可用'}, {'value': '不可用', 'label': '不可用'},
          {'value': '离线', 'label': '离线'}, {'value': '未知', 'label': '未知'}],
        listQuery: {
          page: 1,
          limit: 20,
          deleted: 0,
          ltm_ip:undefined,
          availabilitystate: undefined,
          enabledstate: undefined,
          opr_time_s: undefined,
          opr_time_u: undefined,
          name: undefined,
          select:'create',
        },
        addVsForm:{
          mgmt_ip:'',
          partition:'',
          name:'',
          destination:'',
          serviceport:'',
          addressstatus:'yes',
          ipprotocol:'',
          protocol_profile_client:'',
          http_profile_client:'',
          ssl_profile_client:'',
          sourceaddresstranslation:'None',
          snatpool:'',
          pool:'',
          state:'enabled',
          rules:[],
          remark:'',
        },
        editVsForm:{
          mgmt_ip:'',
          partition:'',
          name:'',
          destination:'',
          serviceport:'',
          addressstatus:'',
          ipprotocol:'',
          protocol_profile_client:'',
          http_profile_client:'',
          ssl_profile_client:'',
          sourceaddresstranslation:'',
          snatpool:'',
          pool:'',
          state:'',
          rules:'',
          remark:'',
        },
        remarkForm:{
          remark:''
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        rules: {
          mgmt_ip: [{required: 'true', message: '请选择管理IP', trigger: 'blur'}],
          name: [{required: 'true', message: '请填写名称', trigger: 'blur'}],
          destination: [{required: 'true', message: '请填写ip地址', trigger: 'blur'}, {validator: validateIpaddress}],
          serviceport: [{required: 'true', message: '请填写服务端口', trigger: 'blur'}],
          ipprotocol: [{required: 'true', message: '请选择协议', trigger: 'blur'}],
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
      this.getList()
      this.adminrole = this.roles.includes('ltm_vs_admin')
      mgIps().then(res=>{
        this.ipOptions=res
      })
      ltmIpName().then(res=>{
        this.partitionOptions=res
      })
      getProfileClient().then(res=>{
        this.profileOptions=res
        for (const i of res) {
          if (i.protocol_type==='http'){
            this.httpOptions.push(i)
          }else if (i.protocol_type==='client-ssl'){
            this.sslOptions.push(i)
          }
        }
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    watch: {
      'addVsForm.partition': {
        handler(val) {
          if (val && this.addVsForm.mgmt_ip) {
            this.clientOptions = []
            this.addVsForm.ipprotocol='tcp'
            this.addVsForm.protocol_profile_client='tcp'
            for (const i of this.profileOptions) {
              if (this.addVsForm.mgmt_ip === i.ltm_ip && val === i.partition && 'tcp' === i.protocol_type) {
                this.clientOptions.push(i)
              }
            }
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      delete_vs(row) {
        const msg = '确定要删除该信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'vs信息删除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          deleteLtmVs([row]).then(res => {
            if (res.status === 'ok') {
              loading.close()
              this.$message({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              loading.close()
              this.$message({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              })
              this.getList()
            }
          }).catch(err => {
            loading.close();
            this.$message({
              message: err,
            });
          });
        })
      },
      edit_vs() {
        const loading = this.$loading({
          lock: true,
          text: 'vs信息更新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        editLtmVs([this.editVsForm]).then(res => {
          if (res.status === 'ok') {
            loading.close()
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            loading.close()
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
            this.getList()
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
        this.dialogEditVisible=false
      },
      editFormCommon(row){
        this.dialogEditVisible=true
        this.editVsForm.mgmt_ip=row.ltm_ip
        this.editVsForm.partition=row.partition
        this.editVsForm.name=row.name
        this.editVsForm.destination=row.destination
        this.editVsForm.serviceport=row.serviceport
        this.editVsForm.ipprotocol=row.ipprotocol
        this.editVsForm.http_profile_client=row.http_profile_client
        this.editVsForm.protocol_profile_client=row.protocol_profile_client
        this.editVsForm.sourceaddresstranslation=row.sourceaddresstranslation
        this.editVsForm.snatpool=row.snatpool
        this.editVsForm.pool=row.pool
        this.editVsForm.rules=row.rules.split(',')
        this.editVsForm.remark=row.description
        const temp =[]
        for (const i of this.profileOptions) {
          if (this.editVsForm.mgmt_ip===i.ltm_ip&&this.editVsForm.partition===i.partition&&this.editVsForm.ipprotocol===i.protocol_type) {
            temp.push(i)
          }
        }
        this.clientOptions=temp
        this.editVsForm.ipprotocol==='tcp'?this.disabled=false:this.disabled=true
        this.editVsForm.sourceaddresstranslation==='snat'?this.disabled1=false:this.disabled1=true
        row.enabledstate==='启用'?this.editVsForm.state='enabled':this.editVsForm.state='disabled'
        row.ssl_profile_client!==''?this.editVsForm.ssl_profile_client=row.ssl_profile_client.split(','):this.editVsForm.ssl_profile_client=row.ssl_profile_client
        row.addressstatus==='启用'?this.editVsForm.addressstatus='yes':this.editVsForm.addressstatus='no'
        getPoolName({ip:this.editVsForm.mgmt_ip,partition:this.editVsForm.partition}).then(res=>{
        this.poolOptions=res
      })
        getRuleName({ip:this.editVsForm.mgmt_ip,partition:this.editVsForm.partition}).then(res=>{
        this.ruleOptions=res
      })
        getSnatName({ip:this.editVsForm.mgmt_ip,partition:this.editVsForm.partition}).then(res=>{
        this.snatOptions=res
      })
      },
      remark_vs() {
        const loading = this.$loading({
          lock: true,
          text: 'vs信息备注中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        remarkLtmVs({'one':this.remarkForm.remark,'two':[this.remark_row]}).then(res => {
          if (res.status === 'ok') {
            loading.close()
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            loading.close()
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
            this.getList()
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
        this.dialogRemarkVisible=false
      },
      remarkDialog(row){
        this.dialogRemarkVisible=true
        this.remarkForm.remark=row.description
        this.remark_row=row
      },
      startCommon(row) {
        const msg = '确定要启用该信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'vs信息启用中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          statusLtmVs({'one': 'enabled', 'two': [row]}).then(res => {
            if (res.status === 'ok') {
              loading.close()
              this.$message({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              loading.close()
              this.$message({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              })
              this.getList()
            }
          }).catch(err => {
            loading.close();
            this.$message({
              message: err,
            });
          });
        })
      },
      suspendCommon(row) {
        const msg = '确定要禁用该信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'vs信息禁用中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          statusLtmVs({'one': 'disabled', 'two': [row]}).then(res => {
            if (res.status === 'ok') {
              loading.close()
              this.$message({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              loading.close()
              this.$message({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              })
              this.getList()
            }
          }).catch(err => {
            loading.close();
            this.$message({
              message: err,
            });
          });
        })
      },
      refresh_vs(row) {
        const loading = this.$loading({
          lock: true,
          text: 'vs信息刷新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        refreshLtmVs([row]).then(res => {
          if (res.status === 'ok') {
            loading.close()
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            loading.close()
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
            this.getList()
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
      },
      insert_vs(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'vs信息添加中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.addVsForm.ssl_profile_client=this.addVsForm.ssl_profile_client.toString()
            addLtmVs([this.addVsForm]).then(res=>{
              if (res.status === 'ok') {
                loading.close()
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                loading.close()
                this.$message({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                })
                this.getList()
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
            this.dialogAddVisible = false
          }
        })
      },
      handleSource(val){
        if (val==='snat') {
          this.disabled1=false
          this.addVsForm.snatpool=''
          this.editVsForm.snatpool=''
        }else {
          this.disabled1=true
          this.addVsForm.snatpool=''
          this.editVsForm.snatpool=''
        }
      },
      handleProtocol(val){
        const temp =[]
        this.clientOptions=[]
        for (const i of this.profileOptions) {
          if (this.addVsForm.mgmt_ip===i.ltm_ip&&this.addVsForm.partition===i.partition&&val===i.protocol_type){
            temp.push(i)
          }
          if (this.editVsForm.mgmt_ip===i.ltm_ip&&this.editVsForm.partition===i.partition&&val===i.protocol_type) {
            temp.push(i)
          }
        }
        this.clientOptions=temp
        if (val==='tcp') {
          this.addVsForm.protocol_profile_client='tcp'
          this.disabled=false
          this.addVsForm.http_profile_client=''
        }else if (val==='udp') {
          this.addVsForm.protocol_profile_client='udp'
          this.disabled=true
          this.addVsForm.http_profile_client=''
        }
      },
      handleCheck(val){
        getSnatName({ip:this.addVsForm.mgmt_ip,partition:val}).then(res=>{
        this.snatOptions=res
      })
        getPoolName({ip:this.addVsForm.mgmt_ip,partition:val}).then(res=>{
        this.poolOptions=res
      })
        getRuleName({ip:this.addVsForm.mgmt_ip,partition:val}).then(res=>{
        this.ruleOptions=res
      })
      },
      handleChange(val){
        this.selectOptions=[]
        for (const i of this.partitionOptions) {
          if (val===i.ltm_ip) {
            this.selectOptions.push(i)
          }
        }
      },
      send_rule(val){
        this.$router.push({
          path:'/cainiao/index2/ltm_basic',
          query:{
            rule:val
          }
        })
      },
      send_pool(val){
        this.$router.push({
          path:'/cainiao/index2/ltm_pool',
          query:{
            pool:val
          }
        })
      },
      send_snat(val){
        this.$router.push({
          path:'/cainiao/index2/ltm_basic',
          query:{
            snat:val
          }
        })
      },
      handleReset() {
        this.getList()
        this.listQuery = this.$options.data().listQuery
      },
      handleFilter() {
        this.getList()
      },
      resetForm(formName) {
        this.dialogRemarkVisible = false
        this.dialogAddVisible = false
        this.dialogRemarkMemberVisible = false
        this.dialogEditVisible = false
        this.$refs[formName].resetFields()
      },
      getList() {
        this.listLoading = true
        if (this.listQuery.opr_time_s) {
          this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        } else {
          this.listQuery.rtime = undefined
        }
        if (this.listQuery.opr_time_u) {
          this.listQuery.stime = Math.floor(new Date(this.listQuery.opr_time_u[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_u[1]) / 1000)
        } else {
          this.listQuery.stime = undefined
        }
        getLtmVs(this.listQuery).then(res => {
          this.list = res.results
          this.total = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleClose() {
        this.addVsForm={
          mgmt_ip:'',
          partition:'',
          name:'',
          destination:'',
          serviceport:'',
          addressstatus:'yes',
          ipprotocol:'',
          protocol_profile_client:'',
          http_profile_client:'',
          ssl_profile_client:'',
          sourceaddresstranslation:'',
          snatpool:'',
          pool:'',
          state:'enabled',
          rules:[],
          remark:'',
        }
      },
    }
  }
</script>

<style scoped>
 .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
