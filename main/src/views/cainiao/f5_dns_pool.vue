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
          <el-form-item prop="availabilitystate">
            <el-select v-model="listQuery.availabilitystate" @change="handleFilter" clearable placeholder="可用状态"
                       style="width: 105px;">
              <el-option v-for="item of enableOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="enabledstate">
            <el-select v-model.trim="listQuery.enabledstate" @change="handleFilter" clearable placeholder="启用状态"
                       style="width: 120px;">
              <el-option v-for="item of statusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model.trim="listQuery.type" @change="handleFilter" clearable placeholder="类型"
                       style="width: 100px;">
              <el-option v-for="item of poolType" :key="item.value" :label="item.value"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="partition">
            <el-select v-model.trim="listQuery.partition" @change="handleFilter" clearable placeholder="分区"
                       style="width: 125px;">
              <el-option v-for="item of partitionOptions" :key="item.id" :value="item.value_or_code"
                         :label="item.displayname"></el-option>
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
              @change="handleFilter"/>
          </el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-plus"
                     @click="dialogAddPool=true" v-if="adminrole||adminrole1">新增
          </el-button>
        </el-row>
        <el-row>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="success" @click="refreshBatch"
                     :disabled="f1"
                     icon="el-icon-refresh">刷新
          </el-button>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="success" @click="enableBatch" :disabled="f1"
                     icon="el-icon-circle-check">启用
          </el-button>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="danger" @click="disableBatch" :disabled="f1"
                     icon="el-icon-circle-close">禁用
          </el-button>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="primary" @click="dialogRemark=true"
                     :disabled="f1"
                     icon="el-icon-info">备注
          </el-button>
          <el-button class="filter-item" v-if="adminrole1" type="danger" @click="deleteBatch" :disabled="f1"
                     icon="el-icon-delete">删除
          </el-button>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @row-click="toggleRowExpansion" ref="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30"></el-table-column>
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
      <el-table-column label="POOL名称" width="250">
        <template slot-scope="scope">
<!--          <el-popover placement="right" trigger="hover">-->
<!--            <el-button type="text" class="btn1" @click="handleClick(scope.row.pool_name)">复制</el-button>-->
<!--            <div slot="reference">-->
<!--              <span>{{ scope.row.pool_name }}</span>-->
<!--            </div>-->
<!--          </el-popover>-->
          <span>{{ scope.row.pool_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.monitors!==''">
            <el-popover trigger="hover" placement="top">
              <p>健康检查: {{ scope.row.monitors }}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.type }}</span>
              </div>
            </el-popover>
          </div>
          <div v-else><span>{{ scope.row.type }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="分区" width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>Alternate:&nbsp;&nbsp;{{ scope.row.alternatemode }},&nbsp;&nbsp;Fallback:&nbsp;&nbsp;{{scope.row.fallbackmode}}</p>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.partition }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="TTL" width="47" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>手动恢复:&nbsp;&nbsp;{{ scope.row.manualresume }},&nbsp;&nbsp;检验成员:&nbsp;&nbsp;{{scope.row.verifymemberavailability}}</p>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.ttl }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="首选负载模式" width="105" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.loadbalancingmode }}</span>
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
      <el-table-column label="成员数量" width="101px" prop="member_counts" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.member_counts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人员" width="77">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px" v-if="adminrole||adminrole1" align="center" fixed="right">
        <template slot-scope="props">
          <el-button type="text" @click="refresh_srv(props.row)">
            <svg-icon icon-class="refresh8" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-button type="text" v-if="props.row.enabledstate==='启用'|| props.row.enabledstate==='被父级禁用'"
                     @click="status_operate(props.row)">
            <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
          </el-button>
          <el-button type="text" v-else @click="status_operate(props.row)">
            <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-tooltip class="item" effect="dark" content="更新POOL" placement="top" :hide-after="300">
            <el-button type="text" @click="editFormCommon(props.row)">
              <svg-icon icon-class="F5_Update" style="width: 16px; height:16px;"/>
            </el-button>
          </el-tooltip>
          <el-button type="text" @click="removeFormCommon(props.row)">
            <svg-icon icon-class="delete1" style="width: 16px; height:16px;color:#FF4949;"/>
          </el-button>
          <el-tooltip class="item" effect="dark" content="备注" placement="top">
          <el-button type="text" @click="remarkDialog(props.row)">
            <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="props">
          <el-table :data="props.row.rowList" label-position="left" class="xxxwwww" stripe highlight-current-row border>
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
            <el-table-column prop="member_name" label="成员名称" width="335"/>
            <el-table-column v-if="props.row.rowList[0] && props.row.rowList[0].partition!==''" prop="partition" label="分区" width="78"
                             align="center"/>
            <el-table-column prop="memberorder" label="序号" width="50" align="center"/>
            <el-table-column prop="ratio" label="Ratio" width="60" align="center"/>
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
            <el-table-column v-if="props.row.rowList[0] && props.row.rowList[0].pool_type==='A'" prop="srv_name" label="Server名称" width="157">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="sendDomain(scope.row.srv_name)">{{ scope.row.srv_name }}</a>
              </template>
            </el-table-column>
            <el-table-column v-else-if="props.row.rowList[0] &&  props.row.rowList[0].pool_type==='CNAME'" prop="srv_name" label="Wide名称"
                             width="157">
              <template slot-scope="scope">
                <a style="color: #1890ff" @click="sendWide(scope.row.srv_name)">{{ scope.row.srv_name }}</a>
              </template>
            </el-table-column>
            <el-table-column v-if="props.row.rowList[0] &&  props.row.rowList[0].vs_name!==''" prop="vs_name" label="VS名称" width="195"/>
            <el-table-column prop="updatetime" label="更新时间" width="135px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新人员" width="77">
              <template slot-scope="scope">
                <span>{{ scope.row.operate_user }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
            <el-table-column label="操作" align="center" v-if="adminrole" width="80px">
              <template slot-scope="props">
                <el-button type="text" v-if="props.row.enabledstate==='启用'|| props.row.enabledstate==='被父级禁用'"
                           @click="status_vs(props.row)">
                  <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
                </el-button>
                <el-button type="text" v-else @click="status_vs(props.row)">
                  <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
                </el-button>
                <el-button type="text" @click="remarkVsDialog(props.row)">
                  <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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

    <el-dialog :visible.sync="dialogCreateAppVisible" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addAppForm" :model="loadAppForm" class="editAppForm" label-width="50px">
        <el-form-item label="备注" style="width:400px;">
          <el-input v-model="loadAppForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addAppForm')">取 消</el-button>
        <el-button type="primary" @click="remark_srv()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditAppVisible" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="editAppForm" label-width="50px">
        <el-form-item label="备注" style="width:400px;">
          <el-input v-model="editAppForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogEditAppVisible=false">取 消</el-button>
        <el-button type="primary" @click="remark_vs()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogRemark" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">批量修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="remarkForm" label-width="50px">
        <el-form-item label="备注" style="width: 400px;">
          <el-input v-model="remarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogRemark=false">取 消</el-button>
        <el-button type="primary" @click="remarkBatch()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddPool" @close="handleClose" width="1120px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增POOL记录</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="115px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="Pool名称" prop="pool_name">
              <el-input v-model.trim="addForm.pool_name" placeholder="只需填写名称,后缀请选择,例test" style="width: 380px;">
                <template slot="append">
                  <el-select v-model="addForm.value" style="width: 142px">
                    <el-option v-for="item of zonelistOptions" :key="item.key" :value="item.value"
                               :label="item.label"></el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="负载模式" prop="preferred" style="margin-left:-13px;">
              <el-select v-model="addForm.preferred" style="width: 380px;">
                <el-option v-for="item of preferOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态" prop="state">
              <el-select v-model="addForm.state" style="width: 380px;">
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
            <el-form-item label="分区" prop="pool_partition" style="margin-left:-13px;">
              <el-select v-model="addForm.pool_partition" style="width: 380px;" @change="handlePool">
                <el-option v-for="item of partitionOptions" :key="item.id" :value="item.value_or_code"
                           :label="item.displayname"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type" style="width:380px;" @change="handleType">
                <el-option v-for="item of poolType" :key="item.key" :value="item.value"
                           :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" style="margin-left:-13px;">
              <el-input style="width: 380px;" v-model="addForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="健康检查">
              <el-select v-model="addForm.monitor" multiple style="width: 380px;" :disabled="disable1">
                <el-option v-for="item of monitorOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item></el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Members列表" prop="members" style="margin-left:-13px;">
              <div v-if="f2">
                <!--            <el-transfer filterable :filter-method="getTrans" filter-placeholder="请输入查询条件" v-model="addForm.members" target-order="push"-->
                <!--                         :data="memberOptions" :titles="['待选VS', '已选VS']" class="transfer" style="width: 100%"-->
                <!--                         @right-check-change="handleChoose">-->
                <!--            </el-transfer>-->
                <!--            <div style="text-align: right" v-if="this.addForm.preferred==='global-availability'">-->
                <!--              <el-button icon="el-icon-arrow-up" slot="right-footer" size="mini"-->
                <!--                         @click="handleUp(addForm.members,'add')"></el-button>-->
                <!--              <el-button icon="el-icon-arrow-down" slot="right-footer" size="mini"-->
                <!--                         @click="handleDown(addForm.members,'add')"></el-button>-->
                <!--            </div>-->
                <el-select v-model="addForm.members" multiple filterable remote reserve-keyword placeholder="请输入关键词"
                           :remote-method="remoteMethod" :loading="loading" style="width: 380px">
                  <el-option v-for="item of options" :key="item.key" :label="item.label" :value="item.key">
                  </el-option>
                </el-select>
              </div>
              <div v-if="f3">
                <!--            <el-transfer filterable filter-placeholder="请输入查询条件" v-model="addForm.members" target-order="push"-->
                <!--                         :data="wideOptions" :titles="['待选Wide', '已选Wide']" class="transfer" style="width: 100%"-->
                <!--                         @right-check-change="handleChoose">-->
                <!--            </el-transfer>-->
                <!--            <div style="text-align: right" v-if="this.addForm.preferred==='global-availability'">-->
                <!--              <el-button icon="el-icon-arrow-up" slot="right-footer" size="mini"-->
                <!--                         @click="handleUp(addForm.members,'add')"></el-button>-->
                <!--              <el-button icon="el-icon-arrow-down" slot="right-footer" size="mini"-->
                <!--                         @click="handleDown(addForm.members,'add')"></el-button>-->
                <!--            </div>-->
                <el-select v-model="addForm.members" multiple filterable remote reserve-keyword placeholder="请输入关键词"
                           :remote-method="remoteMethodWide" :loading="loading" style="width: 380px">
                  <el-option v-for="item of options" :key="item.key" :label="item.label" :value="item.key">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="addPool('addForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditPool" @close="handleClose" width="1102px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改POOL记录</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="115px" style="margin-left:-5px;">
        <el-row>
          <el-col :span="11">
            <el-form-item label="负载模式" prop="preferred">
              <el-select v-model="editForm.preferred" style="width: 380px;">
                <el-option v-for="item of preferOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="state" style="margin-left:-15px;">
              <el-select v-model="editForm.state" style="width: 380px;">
                <el-option label="启用" value="enabled"></el-option>
                <el-option label="禁用" value="disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="健康检查">
              <el-select v-if="this.editForm.type!=='A'" v-model="editForm.monitor" disabled multiple
                         style="width: 380px;">
                <el-option v-for="item of monitorOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              <el-select v-else v-model="editForm.monitor" multiple style="width: 380px;">
                <el-option v-for="item of monitorOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" style="margin-left:-15px;">
              <el-input style="width: 380px;" v-model="editForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Members列表">
          <div v-if="this.editForm.type==='A'">
            <!--            <el-transfer filterable filter-placeholder="请输入查询条件"-->
            <!--                         v-model="editForm.members" target-order="push" @right-check-change="handleChoose"-->
            <!--                         :data="memberOptions" :titles="['待选VS', '已选VS']" class="transfer" style="width: 100%">-->
            <!--            </el-transfer>-->
            <!--            <div style="text-align: right" v-if="this.editForm.preferred==='global-availability'">-->
            <!--              <el-button icon="el-icon-arrow-up" slot="right-footer" size="mini"-->
            <!--                         @click="handleUp(editForm.members,'edit')"></el-button>-->
            <!--              <el-button icon="el-icon-arrow-down" slot="right-footer" size="mini"-->
            <!--                         @click="handleDown(editForm.members,'edit')"></el-button>-->
            <!--            </div>-->
            <el-select v-model="editForm.members" multiple filterable remote reserve-keyword placeholder="请输入关键词"
                       :remote-method="remoteMethod" :loading="loading" style="width: 945px">
              <el-option v-for="item of options" :key="item.key" :label="item.label" :value="item.key">
              </el-option>
            </el-select>
          </div>
          <div v-if="this.editForm.type==='CNAME'">
            <!--            <el-transfer filterable filter-placeholder="请输入查询条件"-->
            <!--                         v-model="editForm.members" target-order="push" @right-check-change="handleChoose"-->
            <!--                         :data="wideOptions" :titles="['待选Wide', '已选Wide']" class="transfer" style="width: 100%">-->
            <!--            </el-transfer>-->
            <!--            <div style="text-align: right" v-if="this.editForm.preferred==='global-availability'">-->
            <!--              <el-button icon="el-icon-arrow-up" slot="right-footer" size="mini"-->
            <!--                         @click="handleUp(editForm.members,'edit')"></el-button>-->
            <!--              <el-button icon="el-icon-arrow-down" slot="right-footer" size="mini"-->
            <!--                         @click="handleDown(editForm.members,'edit')"></el-button>-->
            <!--            </div>-->
            <el-select v-model="editForm.members" multiple filterable remote reserve-keyword placeholder="请输入关键词"
                       :remote-method="remoteMethodWide" :loading="loading" style="width: 99%">
              <el-option v-for="item of options" :key="item.key" :label="item.label" :value="item.key">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="editPool('editForm')">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import {
    addF5Pool,
    deleteF5Pool,
    fetchF5Pool,
    getMonitors,
    getPartition,
    getPoolType,
    getUsers,
    getVs,
    getWide,
    getzonelist,
    refreshF5Pool,
    remarkF5Member,
    remarkF5Pool,
    statusF5Member,
    statusF5Pool,
    updateF5Pool,
  } from '@/api/cainiao/f5_dns'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "../../components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'
  import {Message} from 'element-ui';

  export default {
    name: 'ComplexTable',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,Message
    },
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          availabilitystate: undefined,
          enabledstate: undefined,
          deleted: 0,
          opr_time_s: undefined,
          type: undefined,
          partition: undefined,
        },
        loadAppForm: {
          pool_name: '',
          partition: '',
          type: '',
          remark: '',
        },
        editAppForm: {
          pool_name: '',
          pool_partition: '',
          type: 'member',
          remark: '',
          member_partition: '',
          pool_type: '',
          member_name: ''
        },
        addForm: {
          type: '',
          preferred: 'round-robin',
          pool_name: '',
          value: 'yto.cloud',
          monitor: [],
          pool_partition: 'Server_DNS',
          state: 'enabled',
          members: [],
          remark: '',
        },
        editForm: {
          pool_name: '',
          pool_partition: '',
          preferred: '',
          type: '',
          monitor: [],
          state: '',
          members: [],
          remark: '',
        },
        list: null,
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
        total: 0,
        listLoading: true,
        dialogCreateAppVisible: false,
        dialogEditAppVisible: false,
        dialogRemark: false,
        dialogAddPool: false,
        dialogEditPool: false,
        adminrole: false,
        adminrole1: false,
        f1: true,
        f2: false,
        f3: false,
        disable1: true,
        loading: false,
        statusOptions: [{'value': '启用', 'label': '启用'}, {'value': '禁用', 'label': '禁用'},
          {'value': '被父级禁用', 'label': '被父级禁用'}],
        enableOptions: [{'value': '可用', 'label': '可用'}, {'value': '不可用', 'label': '不可用'},
          {'value': '离线', 'label': '离线'}, {'value': '未知', 'label': '未知'}],
        preferOptions: [{'value': 'round-robin', 'label': 'Round Robin'}, {
          'value': 'return-to-dns',
          'label': 'Return to DNS'
        },
          {'value': 'global-availability', 'label': 'Global Availability'}],
        rules: {
          pool_name: [{required: 'true', message: '请填写Pool名称', trigger: 'blur'}],
          pool_partition: [{required: 'true', message: '请选择分区', trigger: 'blur'}],
          preferred: [{required: 'true', message: '请选择负载模式', trigger: 'blur'}],
          type: [{required: 'true', message: '请选择类型', trigger: 'blur'}],
          state: [{required: 'true', message: '请选择状态', trigger: 'blur'}],
          members: [{required: 'true', message: '请选择成员', trigger: 'blur'}]
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        multipleSelection: [],
        poolType: [],
        partitionOptions: [],
        memberOptions: [],
        wideOptions: [],
        wideOptions1: [],
        monitorOptions: [],
        zonelistOptions: [],
        remarkForm: {
          remark: '',
          operate_user: ''
        },
        item: [],
        options: [],
      }
    },
    created() {
      this.adminrole = this.roles.includes('f5_gtm_dns')
      this.adminrole1 = this.roles.includes('f5_gtm_dns_delete_batch')
      this.getList()
      this.getParams()
      getUsers().then(res => {
        this.user = res.user
      })
      getPartition().then(res => {
        this.partitionOptions = res
      })
      getVs().then(res => {
        this.memberOptions = res
      })
      getWide().then(res => {
        this.wideOptions1 = res
      })
      getMonitors().then(res => {
        this.monitorOptions = res
      })
      getPoolType().then(res => {
        this.poolType = res
        // for (const i of res) {
        //   const list = i.displayname.split(',')
        //   const pool = []
        //   for (const j in list) {
        //     pool.push({
        //       value: list[j], label: list[j], key: j
        //     })
        //   }
        //   this.poolType = pool
        // }
      })
      getzonelist().then(res => {
        // this.zonelistOptions = res
        for (const i of res) {
          const zone = []
          const list = i.displayname.split(',')
          for (let j of list.wh_enumerate()) {
            zone.push({label: j.v, value: j.v, key: j.k})
          }
          this.zonelistOptions = zone
        }
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      // handleClick(val) {
      //   const copy_text = val
      //   let clipboard = new Clipboard('.btn1', {
      //     text: function () {
      //       return copy_text;
      //     }
      //   });
      //   // let clipboard = new Clipboard(".btn");
      //   clipboard.on('success', e => {
      //     this.$message({
      //       type:'success',
      //       message:'复制成功'
      //     })
      //     // Message.success('复制成功')
      //     clipboard.destroy();
      //   });
      //   clipboard.on('error', function (e) {
      //     Message.error('复制失败')
      //     clipboard.destroy();
      //   });
      // },
      remoteMethodWide(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.wideOptions.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.memberOptions.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      handleDown(val, param, index) {
        let temp = [...val]
        let item = this.item;
        if (item.length === 1) {
          //选中值的下标
          val.find((val, indexs, arr) => {
            if (val === item[0]) {
              index = indexs;
            }
          });
          if (index === val.length - 1) { // 这里是length-1,因为下标值从0开始
            this.$message("没有下移的空间了");
            return;
          }
          let changeItem = val[index + 1];
          temp[index] = changeItem
          temp[index + 1] = item[0]
          if (param === 'edit') {
            this.editForm.members = temp
          } else {
            this.addForm.members = temp
          }
        } else {
          this.$message.error("只能选择右侧一条数据进行上下移动");
          item.splice(1.1)
          return;
        }
      },
      handleUp(val, param, index) {
        let temp = [...val]
        let item = this.item;
        if (item.length === 1) {// 因为右侧的选项是可以多选，但这里的上下移动事件，我做的是单项上移，每次上移一个空间，所以判断，当我的选中值只有一个选项时，进行上移操作
          //选中值的下标【/这里我不知道如何直接获取选中值的下标，所以用find()方法，在右侧值的数组里memberOptions中找选中项对应的下标】
          val.find((val, indexs, arr) => { // find()方法 val-项，indexs-下标，arr数组
            if (val === item[0]) { //memberOptions数组的项val等于我选中的项item
              index = indexs; // 数组项的下标就是我当前选中项的下标
            }
          });
          if (index === 0) { //当选择的项的下标为0，即第一个，则提醒没有上移的空间，选择其他项进行上移
            this.$message("没有上移的空间了");
            return;
          }
          let changeItem = val[index - 1];
          temp[index] = changeItem;
          temp[index - 1] = item[0]
          if (param === 'edit') {
            this.editForm.members = temp
          } else {
            this.addForm.members = temp
          }
        } else {
          this.$message.error("只能选择右侧一条数据进行上下移动");
          item.splice(1.1)
          return;
        }
      },
      handleChoose(val) {
        this.item = val
      },
      deleteBatch() {
        if (this.multipleSelection.length > 0) {
          const msg = '确定要删除该' + this.multipleSelection.length + '条pool信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息删除中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            deleteF5Pool({one: this.user, two: this.multipleSelection}).then(res => {
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
        }
      },
      removeFormCommon(row) {
        const msg = '确定要删除该pool信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'pool信息删除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          deleteF5Pool({
            one: this.user,
            two: [{type: row.type, pool_name: row.pool_name, partition: row.partition}]
          }).then(res => {
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
      editPool(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'POOL信息更新中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.editForm.members = this.editForm.members.toString()
            this.editForm.monitor = this.editForm.monitor.toString()
            updateF5Pool({one: this.user, two: [this.editForm]}).then(res => {
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
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
            this.dialogEditPool = false
          }
        })
      },
      editFormCommon(row) {
        this.dialogEditPool = true
        this.editForm.remark = row.remark
        this.editForm.preferred = row.loadbalancingmode
        if (row.enabledstate === '启用') {
          this.editForm.state = 'enabled'
        } else {
          this.editForm.state = 'disabled'
        }
        this.editForm.members = row.mem
        this.editForm.type = row.type
        this.editForm.pool_name = row.pool_name
        this.editForm.pool_partition = row.partition
        if (row.type === 'A') {
          this.editForm.monitor = row.monitors.split(',')
        }
        if (row.type === 'CNAME') {
          const tmp = []
          for (const i of this.wideOptions1) {
            if (row.partition === i.partition) {
              tmp.push(i)
            }
          }
          this.wideOptions = tmp
        }
      },
      addPool(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.addForm.pool_name.indexOf('_pool') > -1) {
              return this.$message({
                title: '警告',
                message: '请正确填写pool名称,不需要后缀_pool,会自动添加后缀',
                type: 'warning',
                duration: 3000
              })
            }
            const loading = this.$loading({
              lock: true,
              text: 'POOL信息添加中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.addForm.members = this.addForm.members.toString()
            this.addForm.monitor = this.addForm.monitor.toString()
            this.addForm.pool_name = this.addForm.pool_name + '.' + this.addForm.value + '_pool'
            addF5Pool({one: this.user, two: [this.addForm]}).then(res => {
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
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
            this.dialogAddPool = false
          }
        })
      },
      handlePool(val) {
        this.wideOptions = []
        const tmp = []
        for (const i of this.wideOptions1) {
          if (val === i.partition) {
            tmp.push(i)
          }
        }
        this.wideOptions = tmp
      },
      handleType(val) {
        if (val === 'A') {
          this.f2 = true
          this.f3 = false
          this.disable1 = false
          this.addForm.monitor.push('gateway_icmp')
          this.addForm.members = []
        }
        if (val === 'CNAME' && this.addForm.pool_partition) {
          const tmp = []
          for (const i of this.wideOptions1) {
            if (this.addForm.pool_partition === i.partition) {
              tmp.push(i)
            }
          }
          this.wideOptions = tmp
          this.f3 = true
          this.f2 = false
          this.disable1 = true
          this.addForm.monitor = []
          this.addForm.members = []
        }
      },
      sendDomain(name) {
        this.$router.push({
          path: '/cainiao/index/f5_dns_server',
          query: {
            mallCode: name
          }
        })
      },
      sendWide(name) {
        this.$router.push({
          path: '/cainiao/index/f5_dns_wideIp',
          query: {
            mallCode: name
          }
        })
      },
      remarkBatch() {
        if (this.multipleSelection.length > 0 && this.remarkForm.remark) {
          const tmp = {
            remark: this.remarkForm.remark,
            user: this.user
          }
          const loading = this.$loading({
            lock: true,
            text: '备注信息修改中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          remarkF5Pool({one: tmp, two: this.multipleSelection}).then(res => {
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
          this.dialogRemark = false
        }
      },
      disableBatch() {
        if (this.multipleSelection.length > 0) {
          const tmp = {
            enabledstate: 'disabled',
            user: this.user
          }
          const msg = '确定要禁用该' + this.multipleSelection.length + '条pool信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Pool({one: tmp, two: this.multipleSelection}).then(res => {
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
        }
      },
      enableBatch() {
        if (this.multipleSelection.length > 0) {
          const tmp = {
            enabledstate: 'enabled',
            user: this.user
          }
          const msg = '确定要启用该' + this.multipleSelection.length + '条pool信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Pool({one: tmp, two: this.multipleSelection}).then(res => {
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
        }
      },
      refreshBatch() {
        if (this.multipleSelection.length > 0) {
          const tmp = {
            user: this.user
          }
          const msg = '确定要刷新该' + this.multipleSelection.length + '条pool信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息刷新中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            refreshF5Pool({one: tmp, two: this.multipleSelection}).then(res => {
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
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (val.length > 0) {
          this.f1 = false
        } else {
          this.f1 = true
        }
      },
      getParams() {
        // 取到路由带过来的参数
        const routerParams = this.$route.query.mallCode
        this.$route.query.mallCode = undefined
        // 将数据放在当前组件的数据内
        if (routerParams) {
          this.listQuery.name = routerParams
        }
      },
      remark_vs() {
        const tmp = {
          user: this.user,
        }
        const loading = this.$loading({
          lock: true,
          text: '备注信息修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if (!this.editAppForm.remark) {
          this.editAppForm.remark = ''
        }
        remarkF5Member({one: tmp, two: [this.editAppForm]}).then(res => {
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
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
        this.dialogEditAppVisible = false
      },
      remarkVsDialog(row) {
        this.dialogEditAppVisible = true
        this.editAppForm.remark = row.remark
        this.editAppForm.pool_name = row.pool_name
        this.editAppForm.pool_partition = row.pool_partition
        this.editAppForm.member_name = row.member_name
        this.editAppForm.member_partition = row.partition
        this.editAppForm.pool_type = row.pool_type
      },
      status_vs(row) {
        if (row.enabledstate === '启用' || row.enabledstate === '被父级禁用') {
          const tmp = {
            user: this.user,
          }
          const msg = '确定要禁用该member信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'member信息禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Member({
              one: tmp, two: [{
                state: 'disabled',
                type: 'member',
                pool_name: row.pool_name,
                pool_partition: row.pool_partition,
                member_partition: row.partition,
                member_name: row.member_name,
                pool_type: row.pool_type,
              }]
            }).then(res => {
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
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          })
        } else {
          const tmp = {
            user: this.user,
          }
          const msg = '确定要启用该member信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'member信息启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Member({
              one: tmp, two: [{
                type: 'member',
                pool_name: row.pool_name,
                pool_partition: row.pool_partition,
                member_partition: row.partition,
                member_name: row.member_name,
                pool_type: row.pool_type,
                state: 'enabled',
              }]
            }).then(res => {
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
      remark_srv() {
        const tmp = {
          user: this.user,
          remark: this.loadAppForm.remark
        }
        const loading = this.$loading({
          lock: true,
          text: '备注信息修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        remarkF5Pool({one: tmp, two: [this.loadAppForm]}).then(res => {
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
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
        this.dialogCreateAppVisible = false
      },
      remarkDialog(row) {
        this.dialogCreateAppVisible = true
        this.loadAppForm.pool_name = row.pool_name
        this.loadAppForm.remark = row.remark
        this.loadAppForm.partition = row.partition
        this.loadAppForm.type = row.type
      },
      status_operate(row) {
        if (row.enabledstate === '启用' || row.enabledstate === '被父级禁用') {
          const tmp = {
            enabledstate: 'disabled',
            user: this.user,
          }
          const msg = '确定要禁用该pool信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Pool({
              one: tmp,
              two: [{type: row.type, pool_name: row.pool_name, partition: row.partition,}]
            }).then(res => {
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
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          })
        } else {
          const tmp = {
            enabledstate: 'enabled',
            user: this.user,
          }
          const msg = '确定要启用该pool信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'pool信息启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Pool({
              one: tmp,
              two: [{type: row.type, pool_name: row.pool_name, partition: row.partition,}]
            }).then(res => {
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
      refresh_srv(row) {
        const tmp = {
          user: this.user
        }
        const loading = this.$loading({
          lock: true,
          text: 'pool信息刷新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        refreshF5Pool({
          one: tmp,
          two: [{pool_name: row.pool_name, type: row.type, partition: row.partition}]
        }).then(res => {
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
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      getList() {
        this.listLoading = true
        if (this.listQuery.opr_time_s) {
          this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        } else {
          this.listQuery.rtime = undefined
        }
        fetchF5Pool(this.listQuery).then(response => {
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
          name: undefined,
          availabilitystate: undefined,
          enabledstate: undefined,
          deleted: 0,
          opr_time_s: undefined,
          type: undefined,
          partition: undefined,
        }
      },
      resetForm(formName) {
        this.dialogCreateAppVisible = false
        this.dialogEditAppVisible = false
        this.dialogAddPool = false
        this.dialogEditPool = false
        this.$refs[formName].resetFields()
      },
      handleClose() {
        this.loadAppForm = {
          pool_name: '',
          partition: '',
          type: '',
          remark: '',
        }
        this.editAppForm = {
          pool_name: '',
          pool_partition: '',
          type: 'member',
          remark: '',
          member_partition: '',
          member_name: '',
          pool_type: '',
        }
        this.remarkForm = {
          remark: ''
        }
        this.addForm = {
          type: '',
          preferred: 'round-robin',
          pool_name: '',
          value: 'yto.cloud',
          pool_partition: 'Server_DNS',
          state: 'enabled',
          members: [],
          monitor: [],
          remark: '',
        }
        this.f2 = false
        this.f3 = false
        this.disable1 = true
        this.options=[]
        this.editForm = {
          pool_name: '',
          pool_partition: '',
          preferred: '',
          type: '',
          state: '',
          members: [],
          monitor: [],
          remark: '',
        }
      },
      toggleRowExpansion(row, label) {
        if (label.label === '操作'||label.label==='POOL名称') {
          return
        }
        let $table = this.$refs.table;
        this.list.map((item) => {
          if (row.id !== item.id) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      },
    }
  }
</script>
<style scoped>
  .el-table--border .xxxwwww:after,
  .el-table .xxxwwww:before {
    background-color: #A3D3FF;
  }

  .el-table--border .xxxwwww {
    border-color: #A3D3FF;
  }

  .xxxwwww .el-table__header-wrapper th {
    background: #ecf0f5;
  }

  .transfer /deep/ div.el-transfer-panel {
    width: 380px;
  }

  .transfer /deep/ label.el-checkbox {
    display: block;
  }
</style>
