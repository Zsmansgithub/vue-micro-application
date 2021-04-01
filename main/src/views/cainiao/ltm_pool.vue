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
      <el-table-column label="POOL名称" width="220">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="send_member(scope.row)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="分区" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康检查" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.monitor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负载模式" width="110" align="center">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover">
            <p>忽略会话保持权重: {{ scope.row.ignorepersistedweight }}</p>
            <p>优先组设置最小成员数: {{ scope.row.minactivemembers }}</p>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.loadbalancingmode }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="成员总数" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.membercnt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活跃成员" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activemembercnt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用成员" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.availablemembercnt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.enabledstate==='启用'"><svg-icon icon-class="F5_Enabled"
                                                                 style="color:#009551;"></svg-icon>&nbsp;<span
              style="color:#009551;">启用</span></span>
            <span v-else-if="scope.row.enabledstate==='禁用'"><svg-icon icon-class="F5_Disabled"
                                                                      style="color:#C64333;"></svg-icon>&nbsp;<span
              style="color:#C64333;">禁用</span></span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人员" width="77" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px" align="center" v-if="adminrole" fixed="right">
        <template slot-scope="props">
          <el-button type="text" @click="refresh_pool(props.row)">
            <svg-icon icon-class="refresh8" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-tooltip class="item" effect="dark" content="更新POOL" placement="top" :hide-after="300">
            <el-button type="text" @click="editFormCommon(props.row)">
              <svg-icon icon-class="F5_Update" style="width: 16px; height:16px;"/>
            </el-button>
          </el-tooltip>
          <el-button type="text" @click="delete_pool(props.row)">
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
    <el-dialog :title="member_title" :visible.sync="dialogMemberVisible" @close="handleClose" width="80%">
      <el-form ref="memberQuery" :inline="true">
        <el-form-item>
          <el-input v-model="searchValue" placeholder="请输入查询条件" @input="member_search" class="filter-item" clearable
                    style="width: 330px" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchValue1" @input="member_search" clearable placeholder="可用状态" style="width: 105px;">
            <el-option v-for="item in enableOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="searchValue2" @input="member_search" clearable placeholder="启用状态"
                     style="width: 120px;">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="searchValue3" @input="member_search" clearable placeholder="会话状态"
                     style="width: 120px;">
            <el-option v-for="item in sessionOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" v-if="adminrole" type="primary" plain icon="el-icon-plus" @click="dialog_add">新增</el-button>
        <el-button class="filter-item" v-if="adminrole" :disabled="disable4" plain icon="el-icon-edit" type="warning" @click="dialogEditMemberVisible=true">修改
        </el-button>
        <el-button class="filter-item" v-if="adminrole" :disabled="disable4" plain icon="el-icon-delete" type="danger" @click="batach_member_delete">移除
        </el-button>
      </el-form>
      <el-table v-loading="listLoading" :data="member_list_temp_page" @selection-change="handleSelectionChange"
                stripe highlight-current-row border style="width: 100%">
        <el-table-column type="selection" width="35"/>
        <el-table-column prop="availabilitystate" label="可用状态" width="78" align="center">
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
        <el-table-column prop="name" label="Member名称" width="200"/>
        <el-table-column prop="address" label="IP地址/服务端口" width="140">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.serviceport}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="node_name" label="节点名称" width="120"/>
        <el-table-column prop="ratio" label="权重/优先级" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.ratio}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.prioritygroup}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="monitorstatus" label="健康状态/会话状态" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.monitorstatus}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.sessionstatus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" width="109" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.enabledstate==='启用'"><svg-icon icon-class="F5_Enabled"
                                                                 style="color:#009551;"></svg-icon>&nbsp;<span
              style="color:#009551;">启用</span></span>
            <span v-else-if="scope.row.enabledstate==='禁用'"><svg-icon icon-class="F5_Disabled"
                                                                      style="color:#C64333;"></svg-icon>&nbsp;<span
              style="color:#C64333;">禁用</span></span>
            <span v-else><svg-icon icon-class="F5_Tmp_Disabled" style="color:#DA8C10;"></svg-icon>&nbsp;<span
              style="color:#DA8C10;">被父级禁用</span></span>
          </template>
        </el-table-column>
        <el-table-column prop="updatetime" label="更新时间/更新人员" width="145px">
          <template slot-scope="scope">
            <span>{{scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.operate_user}}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="adminrole" width="120px" fixed="right">
          <template slot-scope="props">
            <el-dropdown @command="handleCommand">
            <span><svg-icon icon-class="禁用 (2)"
                            style="width: 16px; height:16px;color:#FFBA00;margin-left: 10px;margin-right: 10px"/></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="props.row.sessionstatus!=='启用(允许所有)'"
                                :command="beforeHandleCommand(props.$index,props.row, '启用')">启用(允许所有)
              </el-dropdown-item>
              <el-dropdown-item v-if="props.row.sessionstatus!=='禁用(仅允许持久或活动连接)'"
                                :command="beforeHandleCommand(props.$index,props.row, '禁用')">
                禁用(仅允许持久或活动连接)
              </el-dropdown-item>
              <el-dropdown-item v-if="props.row.sessionstatus!=='强制离线(仅允许活动连接)'"
                                :command="beforeHandleCommand(props.$index,props.row, '强制离线')">
                强制离线(仅允许活动连接)
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="text" @click="remove_member(props.row)">
            <svg-icon icon-class="delete1" style="width: 16px; height:16px;color:#FF4949;"/>
          </el-button>
            <el-button type="text" @click="remarkMemberDialog(props.row)">
            <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="member_page" :page-sizes="[5,10,20,50]" :page-size="member_limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="member_total" style="margin-top: 10px;">
      </el-pagination>
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
        <el-button @click="resetForm('remarkForm')">取 消</el-button>
        <el-button type="primary" @click="remark_pool()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddVisible" @close="handleClose" width="1000px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增POOL</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addPoolForm" :model="addPoolForm" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="管理IP" prop="mgmt_ip">
              <el-select v-model="addPoolForm.mgmt_ip" style="width: 320px" @change="handleChange"
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
              <el-select style="width: 320px;" v-model="addPoolForm.partition" placeholder='请选择分区' @change="handleCheck">
                <el-option v-for="item in selectPartition" :key="item.ltm_ip" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">名称无需添加后缀"_pool"，创建时会自动增加后缀</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                名称
              </label>
              <el-input v-model.trim="addPoolForm.name" style="width: 320px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="健康检查" style="margin-left:-4px;" prop="monitor">
              <el-select v-model.trim="addPoolForm.monitor" style="width: 320px" filterable multiple>
                <el-option v-for="item in selectMonitor" :key="item.name" :value="item.name" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="负载模式">
              <el-select v-model="addPoolForm.slbmode" style="width: 320px;" @change="handleSlb">
                <el-option v-for="item in slbOptions" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-if="disable1===true" label="忽略会话权重" style="margin-left:-4px;">
              <el-select v-model.trim="addPoolForm.ignorepersistedweight" :disabled="disable1" style="width: 320px;">
                <el-option value="disabled" label="禁用"></el-option>
                <el-option value="enabled" label="启用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-else label="忽略会话权重" style="margin-left:-4px;" prop="ignorepersistedweight">
              <el-select v-model.trim="addPoolForm.ignorepersistedweight" :disabled="disable1" style="width: 320px;">
                <el-option value="disabled" label="禁用"></el-option>
                <el-option value="enabled" label="启用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="优先组设置">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">“0”表示禁用</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                优先组设置
              </label>
              <el-input-number style="width: 320px;" controls-position="right" :min="0" v-model.trim="addPoolForm.minactivemembers" @change="handleActive"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" style="margin-left:-4px;">
              <el-input style="width: 320px;" v-model.trim="addPoolForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="成员来源">
          <el-radio v-model="addPoolForm.newnode" label="yes" @change="handle_node">新增Node</el-radio>
          <el-radio v-model="addPoolForm.newnode" label="no" @change="handle_node">从已有Node中选择</el-radio>
        </el-form-item>
        <el-form-item label="成员信息" prop="members">
          <div>
            <el-table :data="addPoolForm.members" class='overflow-vis'>
              <el-table-column prop="ip" label="IP地址" align="center" width="160" class-name='overflow-vis'>
                <template slot-scope="scope">
                  <el-form-item v-if="f1" :prop="'members.' + scope.$index + '.ip'"
                                :rules="[{required: true, message: 'IP不能为空', trigger: 'blur'}, {validator: validateIpaddress}]">
                    <el-autocomplete class="inline-input" v-model="scope.row.ip" :fetch-suggestions="querySearch"
                                     placeholder="请输入ip"></el-autocomplete>
                  </el-form-item>
                  <el-form-item v-else :prop="'members.' + scope.$index + '.ip'"
                                :rules="[{required: true, message: 'IP不能为空', trigger: 'blur'}]">
                    <el-select v-model="scope.row.ip" style="width: 100%" filterable>
                      <el-option v-for="item in nodeOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="port" label="服务端口" align="center" width="130">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.port'">
                    <el-input-number v-model="scope.row.port" controls-position="right" :min="0" :max="65534"
                                     style="width: 100%;"></el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="state" label="状态" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.state'">
                    <el-select v-model="scope.row.state" placeholder="请选择" style="width: 100%">
                      <el-option v-for="item in status1Options" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="ratio" label="权重" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.ratio'">
                    <el-input-number v-model="scope.row.ratio" controls-position="right" :min="1" :max="65535" style="width: 100%" :disabled="disable2">
                    </el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="prioritygroup" label="优先级" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.prioritygroup'">
                    <el-input-number v-model="scope.row.prioritygroup" controls-position="right" :min="0" :max="4294967295" style="width: 100%" :disabled="disable3">
                    </el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.remark'">
                    <el-input v-model="scope.row.remark" style="width: 100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-plus" v-if="scope.$index===0" circle
                             @click="addMember(scope.row);" :disabled="addPoolForm.members.length>10"/>
                  <el-button type="danger" icon="el-icon-delete" v-else circle @click="removeMember(scope.row);"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addPoolForm')">取 消</el-button>
        <el-button type="primary" @click="insert_pool('addPoolForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogRemarkMemberVisible" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="remarkMember" :model="remarkMember" class="remarkMember" label-width="50px">
        <el-form-item label="备注" style="width: 400px">
          <el-input v-model="remarkMember.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogRemarkMemberVisible=false">取 消</el-button>
        <el-button type="primary" @click="remark_member()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditVisible" @close="handleClose" width="1000px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">{{'更改POOL'+'-'+edit_title}}</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editPool" :model="editPool" class="editPool" label-width="115px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="健康检查" prop="monitor">
              <el-select v-model="editPool.monitor" style="width: 320px;" filterable multiple>
                <el-option v-for="item in select2" :key="item.name" :value="item.name" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="负载模式" prop="slbmode" style="margin-left:-15px;">
              <el-select v-model="editPool.slbmode" style="width: 320px;">
                <el-option v-for="item in slbOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="优先组设置">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">“0”表示禁用</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                优先组设置
              </label>
              <el-input-number style="width: 320px;" controls-position="right" :min="0" v-model.trim="editPool.minactivemembers"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="忽略会话权重" prop="ignorepersistedweight" style="margin-left:-15px;">
              <el-select v-if="this.check.indexOf(this.editPool.slbmode)>-1" v-model="editPool.ignorepersistedweight" style="width: 320px;">
                <el-option label="启用" value="enabled"></el-option>
                <el-option label="禁用" value="disabled"></el-option>
              </el-select>
              <el-select v-else v-model="editPool.ignorepersistedweight" style="width: 320px;" disabled>
                <el-option label="启用" value="enabled"></el-option>
                <el-option label="禁用" value="disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="editPool.remark" style="width: 98%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editPool')">取 消</el-button>
        <el-button type="primary" @click="edit_pool('editPool')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddMemberVisible" @close="handleClose" width="1000px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">{{add_title}}</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addMemberForm" :model="addMemberForm" :rules="rules" label-width="110px">
        <el-form-item label="成员来源">
          <el-radio v-model="addMemberForm.newnode" label="yes" @change="handle_member_node">新增Node</el-radio>
          <el-radio v-model="addMemberForm.newnode" label="no" @change="handle_member_node">从已有Node中选择</el-radio>
        </el-form-item>
        <el-form-item label="成员信息" prop="members">
          <div>
            <el-table :data="addMemberForm.members" class='overflow-vis'>
              <el-table-column prop="ip" label="IP地址" align="center" width="160" class-name='overflow-vis'>
                <template slot-scope="scope">
                  <el-form-item v-if="f2" :prop="'members.' + scope.$index + '.ip'"
                                :rules="[{required: true, message: 'IP不能为空', trigger: 'blur'}, {validator: validateIpaddress}]">
                    <el-autocomplete class="inline-input" v-model="scope.row.ip" :fetch-suggestions="querySearch"
                                     placeholder="请输入ip"></el-autocomplete>
                    </el-form-item>
                  <el-form-item v-else :prop="'members.' + scope.$index + '.ip'"
                                :rules="[{required: true, message: 'IP不能为空', trigger: 'blur'}]">
                    <el-select v-model="scope.row.ip" style="width: 100%" filterable>
                      <el-option v-for="item in nodeOptions1" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="port" label="服务端口" align="center" width="130">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.port'">
                    <el-input-number v-model="scope.row.port" controls-position="right" :min="0" :max="65534"
                                     style="width: 100%;"></el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="state" label="状态" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.state'">
                    <el-select v-model="scope.row.state" placeholder="请选择" style="width: 100%">
                      <el-option v-for="item in status1Options" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="ratio" label="权重" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.ratio'">
                    <el-input-number v-model="scope.row.ratio" controls-position="right" :min="1" :max="65535" style="width: 100%" :disabled="disable5">
                    </el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="prioritygroup" label="优先级" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.prioritygroup'">
                    <el-input-number v-model="scope.row.prioritygroup" controls-position="right" :min="0" :max="4294967295" style="width: 100%" :disabled="disable6">
                    </el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'members.' + scope.$index + '.remark'">
                    <el-input v-model="scope.row.remark" style="width: 100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-plus" v-if="scope.$index===0" circle
                             @click="add_member_form(scope.row);" :disabled="addMemberForm.members.length>10"/>
                  <el-button type="danger" icon="el-icon-delete" v-else circle @click="remove_member_form(scope.row);"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogAddMemberVisible=false">取 消</el-button>
        <el-button type="primary" @click="insert_member('addMemberForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditMemberVisible" @close="handleClose" width="500px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">批量修改</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="batch_member" :model="batch_member" class="batch_member" label-width="110px" style="margin:0 25px 0 -25px;">
        <el-form-item label="修改选项">
          <el-checkbox-group v-model="checkList" @change="handleCheckBox">
            <el-checkbox label="状态"></el-checkbox>
            <el-checkbox label="权重" :disabled="this.check1.indexOf(this.slb_mode)===-1"></el-checkbox>
            <el-checkbox label="优先级" :disabled="this.min_active<0||this.min_active===0"></el-checkbox>
            <el-checkbox label="备注"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="batch_member.state" style="width: 100%" :disabled="disable7">
            <el-option v-for="item in status1Options" :key="item.value" :value="item.value"
                           :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input-number v-model="batch_member.ratio" controls-position="right" :min="1" :max="65535" style="width: 100%" :disabled="disable8"></el-input-number>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="batch_member.prioritygroup" controls-position="right" :min="0" :max="4294967295" style="width: 100%" :disabled="disable9"></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="batch_member.remark" style="width: 100%" :disabled="disable10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogEditMemberVisible=false">取 消</el-button>
        <el-button type="primary" @click="batch_edit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getLtmPool,
    refreshLtmPool,
    insertLtmPool,
    deleteLtmPool,
    remarkLtmPool,
    editLtmPool,
    statusPoolMembers,
    remarkPoolMembers,
    insertPoolMember,
    editPoolMember,
    removePoolMember,
    mgIps,
    ltmIpName,
    getLtmSlb,
    getLtmNewNode,
    getLtmNewNodeIp,
    getLtmPartition
  } from '@/api/cainiao/ltm'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'
  import {mapGetters} from 'vuex'

  export default {
    name: "ltm_pool",
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
    },
    directives: {
      waves,
    },
    data() {
      return {
        listLoading: true,
        total: 0,
        list: null,
        member_total: 0,
        member_page: 1,
        member_limit: 5,
        member_list:[],
        member_list_temp:[],
        searchValue: null,
        searchValue1: null,
        searchValue2: null,
        searchValue3: null,
        temp_row:{},
        member_row:{},
        memberQuery:{},
        edit_title:'',
        add_title:'',
        member_title:'',
        slb_mode:'',
        min_active:'',
        adminrole: false,
        dialogMemberVisible: false,
        dialogRemarkVisible: false,
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogAddMemberVisible: false,
        dialogEditMemberVisible: false,
        dialogRemarkMemberVisible: false,
        disable1:true,
        disable2:true,
        disable3:true,
        disable4:true,
        disable5:true,
        disable6:true,
        disable7:true,
        disable8:true,
        disable9:true,
        disable10:true,
        f1:true,
        f2:true,
        ipOptions: [],
        partitionOptions: [],
        monitorOptions: [],
        slbOptions: [],
        nodeOptions: [],
        nodeIpOptions: [],
        nodeOptions1: [],
        selectPartition: [],
        selectMonitor: [],
        select2: [],
        checkList: [],
        multipleSelection: [],
        check:['ratio-node','ratio-member','observed-node','observed-member','predictive-node','predictive-member'],
        check1:['ratio-member','dynamic-ratio-node','least-connections-node','ratio-least-connections-member'],
        statusOptions: [{'value': '启用', 'label': '启用'}, {'value': '禁用', 'label': '禁用'}],
        enableOptions: [{'value': '可用', 'label': '可用'}, {'value': '不可用', 'label': '不可用'},
          {'value': '离线', 'label': '离线'}, {'value': '未知', 'label': '未知'}],
        status1Options: [{'value': 'enabled', 'label': '启用(允许所有)'}, {'value': 'disabled', 'label': '禁用(仅允许持久或活动连接)'},
          {'value': 'forcedoffline', 'label': '强制离线(仅允许活动连接)'}],
        sessionOptions: [{'value': '启用(允许所有)', 'label': '启用(允许所有)'}, {'value': '禁用(仅允许持久或活动连接)', 'label': '禁用(仅允许持久或活动连接)'},
          {'value': '强制离线(仅允许活动连接)', 'label': '强制离线(仅允许活动连接)'}],
        listQuery: {
          page: 1,
          limit: 20,
          deleted: 0,
          availabilitystate: undefined,
          enabledstate: undefined,
          opr_time_s: undefined,
          name: undefined
        },
        remarkForm:{
          remark:''
        },
        remarkMember:{
          remark:''
        },
        addPoolForm:{
          mgmt_ip:'',
          partition:'',
          name:'',
          monitor:'',
          slbmode:'',
          ignorepersistedweight:'disabled',
          minactivemembers:'',
          remark:'',
          newnode:'yes',
          members:[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }],
        },
        member_config:{
          ip:'',
          port:'',
          state:'enabled',
          ratio:'',
          prioritygroup:'',
          remark:'',
          },
        editPool:{
          mgmt_ip:'',
          partition:'',
          name:'',
          monitor:'',
          slbmode:'',
          ignorepersistedweight:'',
          minactivemembers:'',
          remark:'',
        },
        addMemberForm:{
          mgmt_ip:'',
          partition:'',
          pool_name:'',
          newnode:'yes',
          members:[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }],
        },
        add_member: {
          ip: '',
          port: '',
          state: 'enabled',
          ratio: '',
          prioritygroup: '',
          remark: '',
        },
        batch_member: {
          mgmt_ip:'',
          pool_name:'',
          pool_partition:'',
          state: '',
          ratio: '',
          prioritygroup: '',
          remark: '',
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        rules: {
          mgmt_ip: [{required: 'true', message: '请选择管理IP', trigger: 'blur'}],
          partition: [{required: 'true', message: '请选择分区', trigger: 'blur'}],
          name: [{required: 'true', message: '请填写名称', trigger: 'blur'}],
          monitor: [{required: 'true', message: '请选择健康检查', trigger: 'blur'}],
          slbmode: [{required: 'true', message: '请选择负载模式', trigger: 'blur'}],
          ignorepersistedweight: [{required: 'true', message: '请选择忽略会话保持权重', trigger: 'blur'}],
          members: [{required: 'true', message: '请填写成员信息', trigger: 'blur'}],
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
      this.adminrole=this.roles.includes('ltm_pool_admin')
      this.getParam()
      mgIps().then(res=>{
        this.ipOptions=res
      })
      ltmIpName().then(res=>{
        this.partitionOptions=res
      })
      getLtmPartition().then(res=>{
        this.monitorOptions=res
      })
      getLtmSlb().then(res=>{
        this.slbOptions=res
      })
    },
    computed: {
      ...mapGetters(['roles']),
      member_list_temp_page () {
        return this.member_list_temp.slice((this.member_page - 1) * this.member_limit, this.member_page * this.member_limit)
      }
    },
    watch: {
      'addPoolForm.mgmt_ip': {
        handler(val) {
          if (val&&this.addPoolForm.partition) {
            getLtmNewNode({ltm_ip:val,partition:this.addPoolForm.partition}).then(res=>{
            this.nodeOptions=res
          })
            getLtmNewNodeIp({ltm_ip:val,partition:this.addPoolForm.partition}).then(res=>{
              this.nodeIpOptions=res
            })
          }
        },
        deep: true,
        immediate: true
      },
      'addPoolForm.partition': {
        handler(val) {
          if (val&&this.addPoolForm.mgmt_ip) {
            getLtmNewNode({ltm_ip:this.addPoolForm.mgmt_ip,partition:val}).then(res=>{
            this.nodeOptions=res
          })
            getLtmNewNodeIp({ltm_ip:this.addPoolForm.mgmt_ip,partition:val}).then(res=>{
              this.nodeIpOptions=res
            })
          }
        },
        deep: true,
        immediate: true
      },
    },
    methods: {
      querySearch(queryString, cb) {
        let node_ip = this.nodeIpOptions;
        let results = queryString ? node_ip.filter(this.createFilter(queryString)) : node_ip;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (ip) => {
          return (ip.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      batach_member_delete(){
        const msg = '确定要移除该'+this.multipleSelection.length+'条member信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'member信息移除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          removePoolMember(this.multipleSelection).then(res => {
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
          this.dialogMemberVisible=false
        })
      },
      validateIpaddress (rule, value, callback) {
        if (value) {
          if (validIp(value)) {
            callback()
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      },
      getParam(){
        const param = this.$route.query.pool
        if (param) {
          this.listQuery.name=param
        }
      },
      remove_member(row) {
        const msg = '确定要移除该条member信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'member信息移除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          removePoolMember([row]).then(res => {
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
          this.dialogMemberVisible=false
        })
      },
      batch_edit() {
        const loading = this.$loading({
          lock: true,
          text: 'member信息批量修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        editPoolMember({'one':this.batch_member,'two':this.multipleSelection}).then(res => {
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
        this.dialogEditMemberVisible = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length > 0) {
          this.disable4 = false
        }else {
          this.disable4 = true
        }
      },
      handleCheckBox(val){
        if (val.indexOf('状态')>-1){
          this.disable7=false
          this.batch_member.state='enabled'
        }else {
          this.disable7=true
          this.batch_member.state=''
        }
        if (val.indexOf('权重')>-1&&this.check1.indexOf(this.slb_mode)>-1) {
          this.disable8=false
        }else {
          this.disable8=true
          this.batch_member.ratio=''
        }
        if (val.indexOf('优先级')>-1&&this.min_active>0) {
          this.disable9=false
        }else {
          this.disable9=true
          this.batch_member.prioritygroup=''
        }
        if (val.indexOf('备注')>-1) {
          this.disable10=false
        }else {
          this.disable10=true
          this.batch_member.remark=''
        }
      },
      add_member_form(){
        const configinfo = Object.assign({}, this.add_member)
        this.addMemberForm.members.push(configinfo)
      },
      remove_member_form(item) {
        const index = this.addMemberForm.members.indexOf(item)
        if (index !== -1) {
          this.addMemberForm.members.splice(index, 1)
        }
      },
      dialog_add(){
        this.dialogAddMemberVisible=true
        this.add_title='新增成员-'+this.addMemberForm.mgmt_ip+'-'+this.addMemberForm.pool_name
        getLtmNewNode({ltm_ip: this.addMemberForm.mgmt_ip, partition: this.addMemberForm.partition}).then(res => {
          this.nodeOptions1 = res
        })
        getLtmNewNodeIp({ltm_ip: this.addMemberForm.mgmt_ip, partition: this.addMemberForm.partition}).then(res => {
          this.nodeIpOptions = res
        })
      },
      insert_member(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'member信息添加中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            insertPoolMember([this.addMemberForm]).then(res => {
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
            this.dialogAddMemberVisible = false
            this.dialogMemberVisible=false
          }
        })
      },
      handle_member_node(val){
        if (val==='no') {
          this.f2=false
          this.addMemberForm.members=[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }]
          // getLtmNewNode({ltm_ip:this.addMemberForm.mgmt_ip,partition:this.addMemberForm.partition}).then(res=>{
          //   this.nodeOptions1=res
          // })
        }else {
          this.f2=true
          this.addMemberForm.members=[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }]
        }
      },
      edit_pool(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息更改中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.editPool.monitor=this.editPool.monitor.toString()
            editLtmPool([this.editPool]).then(res => {
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
            this.dialogEditVisible = false
          }
        })
      },
      editFormCommon(row){
        this.dialogEditVisible=true
        this.editPool.mgmt_ip=row.ltm_ip
        this.editPool.name=row.name
        this.editPool.partition=row.partition
        this.editPool.monitor=row.monitor.split(',')
        this.editPool.slbmode=row.loadbalancingmode
        this.editPool.minactivemembers=row.minactivemembers
        if (row.ignorepersistedweight==='禁用') {
          this.editPool.ignorepersistedweight='disabled'
        }else {
          this.editPool.ignorepersistedweight='enabled'
        }
        this.editPool.remark=row.remark
        this.edit_title=row.ltm_ip+'-'+row.name
        const tmp = []
        this.select2=[]
        for (const i of this.monitorOptions){
          if (row.ltm_ip===i.ltm_ip&&row.partition===i.partition) {
            tmp.push(i)
          }
        }
        this.select2=tmp
      },
      remark_member() {
        const loading = this.$loading({
          lock: true,
          text: 'member信息备注中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        remarkPoolMembers({'one':this.remarkMember.remark,'two':[this.member_row]}).then(res => {
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
        this.dialogRemarkMemberVisible = false
        this.dialogMemberVisible=false
      },
      remarkMemberDialog(row){
        this.dialogRemarkMemberVisible=true
        this.member_row=row
        this.remarkMember.remark=row.description
      },
      insert_pool(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息新增中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.addPoolForm.monitor=this.addPoolForm.monitor.toString()
            insertLtmPool([this.addPoolForm]).then(res => {
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
        });
      },
      handle_node(val){
        if (val==='no') {
          this.f1=false
          this.addPoolForm.members=[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }]
          // getLtmNewNode({ltm_ip:this.addPoolForm.mgmt_ip,partition:this.addPoolForm.partition}).then(res=>{
          //   this.nodeOptions=res
          // })
        }else {
          this.f1=true
          this.addPoolForm.members=[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }]
        }
      },
      handleActive(val){
        if (val>0){
          this.disable3=false
        }else {
          this.disable3=true
        }
      },
      addMember() {
        const configinfo = Object.assign({}, this.member_config)
        this.addPoolForm.members.push(configinfo)
      },
      removeMember(item) {
        const index = this.addPoolForm.members.indexOf(item)
        if (index !== -1) {
          this.addPoolForm.members.splice(index, 1)
        }
      },
      handleSlb(val){
        if (this.check.indexOf(val)>-1){
          this.disable1=false
          this.addPoolForm.ignorepersistedweight='disabled'
        }else {
          this.disable1=true
          this.addPoolForm.ignorepersistedweight='disabled'
        }
        if (this.check1.indexOf(val)>-1) {
          this.disable2=false
        }else {
          this.disable2=true
        }
      },
      handleCheck(val){
        let tem = []
        for (const i of this.monitorOptions){
          if (i.ltm_ip===this.addPoolForm.mgmt_ip&&i.partition===val) {
            tem.push(i)
          }
        }
        this.selectMonitor=tem
      },
      handleChange(val){
        this.selectPartition=[]
        for (const i of this.partitionOptions) {
          if (val===i.ltm_ip) {
            this.selectPartition.push(i)
          }
        }
      },
      beforeHandleCommand(index, row, command) {
        return {index, row, command}
      },
      handleCommand(command) {
        //可以相对应的进行操作
        switch (command.command) {
          case "启用":
            const msg = '确定要启用该条member信息吗?'
            this.$confirm(msg, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'member信息启用中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              statusPoolMembers({one: 'enabled', two: [command.row]}).then(res => {
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
              this.dialogMemberVisible=false
            })
            break;
          case "禁用":
            const msg1 = '确定要禁用该member信息吗?'
            this.$confirm(msg1, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'member信息禁用中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              statusPoolMembers({one: 'disabled', two: [command.row]}).then(res => {
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
              this.dialogMemberVisible=false
            })
            break;
          case "强制离线":
            const msg2 = '确定要强制离线该member信息吗?'
            this.$confirm(msg2, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'member信息强制离线中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              statusPoolMembers({one: 'forcedoffline', two: [command.row]}).then(res => {
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
              this.dialogMemberVisible=false
            })
            break;
        }
      },
      remark_pool(){
        const loading = this.$loading({
          lock: true,
          text: 'pool信息备注中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        remarkLtmPool({'one':this.remarkForm.remark,'two':[this.temp_row]}).then(res => {
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
        this.temp_row=row
      },
      delete_pool(row) {
        const msg = '确定要删除该条pool信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'pool信息删除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          deleteLtmPool([row]).then(res => {
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
      refresh_pool(row) {
        const loading = this.$loading({
          lock: true,
          text: 'pool信息刷新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        refreshLtmPool([row]).then(res => {
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
      member_search(search) {
        if (search) {
          let list = this.member_list.filter(v=>{
            if (v.description) {
              return v.name.includes(search) || v.address.includes(search) || v.description.includes(search) || v.operate_user.includes(search) || v.enabledstate.includes(search) || v.availabilitystate.includes(search) || v.sessionstatus.includes(search) || v.node_name.includes(search)
            } else {
              return v.name.includes(search) || v.address.includes(search) || v.operate_user.includes(search) || v.enabledstate.includes(search) || v.availabilitystate.includes(search) || v.sessionstatus.includes(search) || v.node_name.includes(search)
            }
          })
          this.member_list_temp = list
          this.member_total = list.length
          this.member_page = 1
        }else{
          this.member_list_temp = this.member_list
          this.member_total = this.member_list.length
          this.member_page = 1
        }
      },
      handleSizeChange(val) {
        this.member_limit = val
      },
      handleCurrentChange(val) {
        this.member_page = val
      },
      send_member(row){
        this.member_list=row.rowList
        this.dialogMemberVisible=true
        this.member_title=row.name+'-'+'成员信息'
        this.member_total=row.rowList.length
        this.member_list_temp=row.rowList
        this.addMemberForm.mgmt_ip=row.ltm_ip
        this.addMemberForm.partition=row.partition
        this.addMemberForm.pool_name=row.name
        this.slb_mode=row.loadbalancingmode
        this.min_active=row.minactivemembers
        this.batch_member.mgmt_ip=row.ltm_ip
        this.batch_member.pool_name=row.name
        this.batch_member.pool_partition=row.partition
        if (row.minactivemembers>0){
          this.disable6=false
        }
        if (this.check1.indexOf(row.loadbalancingmode)>-1){
          this.disable5=false
        }
      },
      handleReset() {
        this.getList()
        this.listQuery = {
          page: 1,
          limit: 20,
          ltm_ip: undefined,
          deleted: 0,
          availabilitystate: undefined,
          enabledstate: undefined,
          name: undefined
        }
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
        getLtmPool(this.listQuery).then(res => {
          this.list = res.results
          this.total = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleClose(){
        this.selectPartition=[]
        this.selectMonitor=[]
        this.nodeOptions=[]
        this.nodeIpOptions=[]
        this.searchValue=undefined
        this.member_page=1
        this.member_limit=5
        this.disable7=true
        this.disable8=true
        this.disable9=true
        this.disable10=true
        this.f2=true
        this.f1=true
        this.checkList=[]
        this.addPoolForm={
          mgmt_ip:'',
          partition:'',
          name:'',
          monitor:'',
          slbmode:'',
          ignorepersistedweight:'disabled',
          minactivemembers:'',
          remark:'',
          newnode:'yes',
          members:[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }],
        }
        this.addMemberForm={
          mgmt_ip:'',
          partition:'',
          pool_name:'',
          newnode:'yes',
          members:[{
            ip:'',
            port:'',
            state:'enabled',
            ratio:'',
            prioritygroup:'',
            remark:'',
          }],
        }
        this.batch_member= {
          mgmt_ip:'',
          pool_name:'',
          pool_partition:'',
          state: '',
          ratio: '',
          prioritygroup: '',
          remark: '',
        }
      },
    }
  }
</script>
