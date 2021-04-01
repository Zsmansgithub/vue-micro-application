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
          <el-form-item prop="type">
            <el-select v-model.trim="listQuery.type" @change="handleFilter" clearable placeholder="类型"
                       style="width: 100px;">
              <el-option v-for="item in poolType" :key="item.value" :label="item.value"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="partition">
            <el-select v-model.trim="listQuery.partition" @change="handleFilter" clearable placeholder="分区"
                       style="width: 125px;">
              <el-option v-for="item in partitionOptions" :key="item.id" :value="item.value_or_code"
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
              @change="handleFilter">
            </el-date-picker>
          </el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">重置
          </el-button>
          <el-tooltip class="item" effect="dark" content="新增一条WIDEIP信息" placement="top" :hide-after="1000">
            <el-button class="filter-item" v-if="adminrole||adminrole1" type="primary" @click="dialogAddWideIP=true"
                       plain
                       icon="el-icon-plus">新增
            </el-button>
          </el-tooltip>
        </el-row>
        <el-row v-if="adminrole||adminrole1">
          <el-col :span="12">
            <el-button class="filter-item" v-if="adminrole||adminrole1" type="success" @click="refreshBatch"
                       :disabled="f1"
                       icon="el-icon-refresh">刷新
            </el-button>
            <el-button class="filter-item" v-if="adminrole||adminrole1" type="success" @click="enableBatch"
                       :disabled="f1"
                       icon="el-icon-circle-check">启用
            </el-button>
            <el-button class="filter-item" v-if="adminrole||adminrole1" type="danger" @click="disableBatch"
                       :disabled="f1"
                       icon="el-icon-circle-close">禁用
            </el-button>
            <el-button class="filter-item" v-if="adminrole||adminrole1" type="primary" @click="dialogRemark=true"
                       :disabled="f1"
                       icon="el-icon-info">备注
            </el-button>
            <el-tooltip class="item" effect="dark" content="批量删除WIDEIP信息" placement="top" :hide-after="1000">
              <el-button class="filter-item" v-if="adminrole1" type="danger" @click="deleteWideBatch" :disabled="f1"
                         icon="el-icon-delete">删除
              </el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-tooltip class="item" effect="dark" content="新增WIDEIP信息以及Server和Pool信息" placement="top"
                        :hide-after="1000">
              <el-button class="filter-item" v-if="adminrole||adminrole1" type="primary"
                         @click="dialogEditAppVisible=true" plain
                         icon="el-icon-plus">新增A记录
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="批量删除WIDEIP信息以及Server和Pool信息" placement="top"
                        :hide-after="1000">
              <el-button class="filter-item" v-if="adminrole1" type="danger" @click="deleteBatch" :disabled="f1"
                         icon="el-icon-delete">删除A记录
              </el-button>
            </el-tooltip>
            <el-button class="filter-item" v-if="adminrole||adminrole1" type="primary"
                       @click="bulkImportFormVisible=true" plain
                       icon="el-icon-upload" style="text-align: right">导入
            </el-button>
            <el-button class="filter-item" type="success" icon="el-icon-search" plain @click="handleBatchSearch"
                       style="text-align: right">批量查询
            </el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col style="text-align: right">
            <el-button class="filter-item" type="success" icon="el-icon-search" plain @click="handleBatchSearch">批量查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @selection-change="handleSelectionChange" @row-click="toggleRowExpansion" ref="table">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column label="可用状态" align="center" width="80">
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
      <el-table-column label="Wide名称" width="235">
        <template slot-scope="scope">
          <span>{{ scope.row.wide_name }}</span>
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
      <el-table-column label="POOL个数" width="90px" prop="member_counts" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pool_counts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="POOL名称" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.pool_names.indexOf(',')!==-1" v-for="(item,index) in scope.row.pool_names.split(',')">
            <a style="color: #1890ff" @click="sendDomain(item)">{{ item }}</a>
          </div>
          <div v-else>
            <a style="color: #1890ff" @click="sendDomain(scope.row.pool_names)">{{ scope.row.pool_names }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ServerIp地址" width="127">
        <template slot-scope="scope">
          <div v-if="scope.row.srv_ips.indexOf(',')!==-1" v-for="(item,index) in scope.row.srv_ips.split(',')">
            <span>{{ item }}</span>
          </div>
          <div v-else>
            <span>{{ scope.row.srv_ips }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="别名" width="205">
        <template slot-scope="scope">
          <div v-if="scope.row.aliases_name.indexOf(',')!==-1"
               v-for="(item,index) in scope.row.aliases_name.split(',')">
            <span>{{ item }}</span>
          </div>
          <div v-else>
            <span>{{ scope.row.aliases_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="140px" align="center">
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
      <el-table-column label="操作" width="200px" fixed="right" v-if="adminrole||adminrole1" align="center">
        <template slot-scope="props">
          <el-button type="text" @click="refresh_srv(props.row)">
            <svg-icon icon-class="refresh8" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-button type="text" v-if="props.row.enabledstate==='启用'||props.row.enabledstate==='被父级禁用'"
                     @click="status_operate(props.row)">
            <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
          </el-button>
          <el-button type="text" v-else-if="props.row.enabledstate==='禁用'"
                     @click="status_operate(props.row)">
            <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-tooltip class="item" effect="dark" content="更新WIDEIP" placement="top" :hide-after="300">
            <el-button type="text" @click="editCommon(props.row)">
              <svg-icon icon-class="F5_Update" style="width: 16px; height:16px;"/>
            </el-button>
          </el-tooltip>
          <el-dropdown @command="handleCommand">
            <span><svg-icon icon-class="delete1"
                            style="width: 16px; height:16px;color:#FF4949;margin-left: 10px;margin-right: 10px"/></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="beforeHandleCommand(props.$index,props.row, '仅删除WIDEIP')">仅删除WIDEIP
              </el-dropdown-item>
              <el-dropdown-item v-if="props.row.srv_ips.split(',').length>1" disabled
                                :command="beforeHandleCommand(props.$index,props.row, '删除整条A记录')">
                删除整条A记录(包括POOL和SERVER)
              </el-dropdown-item>
              <el-dropdown-item v-else :command="beforeHandleCommand(props.$index,props.row, '删除整条A记录')">
                删除整条A记录(包括POOL和SERVER)
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tooltip class="item" effect="dark" content="备注" placement="top">
            <el-button type="text" @click="remarkDialog(props.row)">
              <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="设置别名" placement="top">
            <el-button type="text" @click="aliasesDialog(props.row)">
              <svg-icon icon-class="F5_Alias1" style="width: 16px; height:16px;"/>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-row>
              <el-col :md="24" :lg="12" :xl="4">
                <el-form-item label="类型:">
                  <span>{{props.row.type}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="5">
                <el-form-item label="分区:">
                  <span>{{props.row.partition}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="5">
                <el-form-item label="负载模式:">
                  <span>{{ props.row.poollbmode }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="5">
                <el-form-item label="persistence:">
                  <span>{{ props.row.persistence }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="5">
                <el-form-item label="lastresortpool:">
                  <span>{{ props.row.lastresortpool }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
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
      <el-form ref="addAppForm" :model="loadAppForm" :rules="rules" class="editAppForm" label-width="50px">
        <el-form-item label="备注" style="width: 400px">
          <el-input v-model="loadAppForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addAppForm')">取 消</el-button>
        <el-button type="primary" @click="remark_srv()">确定</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogEditAppVisible" @close="handleClose" width="790px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">一键新增A记录（包括POOL和SERVER创建）</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="editAppForm" :rules="rules" label-width="115px" style="margin:0 5px 0 -50px;">
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="IP地址" prop="ip">
              <el-input style="width: 100%" v-model="editAppForm.ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据中心" prop="datacenter">
              <el-select v-model="editAppForm.datacenter" style="width: 100%">
                <el-option v-for="item in datacenterOptions" :key="item.id" :value="item.value_or_code"
                           :label="item.displayname"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="名称" prop="name">
              <el-input style="width: 100%" v-model="editAppForm.name">
                <template slot="append">
                  <el-select v-model="editAppForm.value" style="width: 142px">
                    <el-option v-for="item in zonelistOptions" :key="item.key" :value="item.value"
                               :label="item.label"></el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="分区" prop="pool_partition">
              <el-select v-model="editAppForm.pool_partition" style="width: 100%">
                <el-option v-for="item in partitionOptions" :key="item.id" :value="item.value_or_code"
                           :label="item.displayname"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="端口">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">“0”表示 All Ports</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                端口
              </label>
              <el-input-number v-model="editAppForm.port" controls-position="right" :min="0" :max="65535"
                               style="width: 100%;float: left"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="状态">
              <el-select v-model="editAppForm.state" style="width: 100%">
                <el-option v-for="item in statusOptions1" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="别名">
              <el-input style="width: 100%" v-model="editAppForm.aliases" placeholder='多个别名请使用英文逗号(",")隔开'></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="备注">
              <el-input style="width: 100%" v-model="editAppForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editAppForm')">取 消</el-button>
        <el-button type="primary" @click="insert_wide()">确定</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogRemark" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">批量修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="remarkForm" :rules="rules" label-width="50px">
        <el-form-item label="备注" style="width:400px;">
          <el-input v-model="remarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogRemark=false">取 消</el-button>
        <el-button type="primary" @click="remarkBatch()">确定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量导入" :visible.sync="bulkImportFormVisible" width="70%" @close="handleCloseBluk" top="50px"
               style=" height: 100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link"
               href="/vue/cmdb/DNS域名导入模板.xlsx">
              <el-button type="text">DNS域名导入模板（模板下载）</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="14">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="width: 100%;"/>
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;"
                :row-class-name="tableRowClassName">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
        <el-table-column label="操作" width="60px" v-if="tableData.length !=0">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="danger" plain circle
                       @click.native.prevent="deleteRow(scope.$index, tableData)"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkImportFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="uploadSuccess">提 交</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogAliaese" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">设置别名</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="aliaeseForm" :rules="rules" label-width="50px">
        <el-form-item label="别名" style="width:400px;">
          <el-input v-model="aliaeseForm.aliases" placeholder='多个别名请使用英文逗号(",")隔开'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogAliaese=false">取 消</el-button>
        <el-button type="primary" @click="aliaese()">确定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" :close-on-click-modal="false" @close="handleClose"
               width="45%">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="IP地址" name="ip">
          <template>
            <el-row>
              <el-col :span="24">
                <el-input type="textarea" :rows="15" placeholder="请输入IP列表,以逗号分隔或者换行"
                          v-model="listQuery.ip_list"></el-input>
              </el-col>
            </el-row>
          </template>
        </el-tab-pane>
        <el-tab-pane label="域名" name="wide_name">
          <el-row>
            <el-col :span="24">
              <el-input type="textarea" :rows="15" placeholder="请输入域名列表,以逗号分隔或者换行"
                        v-model="listQuery.wide_name_list"></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog :visible.sync="dialogAddWideIP" @close="handleClose" width="975px" :close-on-click-modal="false">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增WideIP</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addWideForm" :model="addWideForm" :rules="rules" label-width="105px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="Wide名称" prop="wide_name">
              <el-input v-model.trim="addWideForm.wide_name" style="width: 320px;">
                <template slot="append">
                  <el-select v-model="addWideForm.value" style="width: 142px">
                    <el-option v-for="item in zonelistOptions" :key="item.key" :value="item.value"
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
            <el-form-item label="别名" style="margin-left:-4px;">
              <el-input style="width: 320px;" v-model="addWideForm.aliases" placeholder='多个别名请使用英文逗号(",")隔开'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态">
              <el-select v-model="addWideForm.state" style="width: 320px;">
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
            <el-form-item label="分区" prop="wide_partition" style="margin-left:-4px;">
              <el-select v-model="addWideForm.wide_partition" style="width: 320px;" @change="handleWide">
                <el-option v-for="item in partitionOptions" :key="item.id" :value="item.value_or_code"
                           :label="item.displayname"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="类型" prop="type">
              <el-select v-model="addWideForm.type" style="width: 320px;" @change="handleType">
                <el-option v-for="item in poolType" :key="item.key" :value="item.value"
                           :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" style="margin-left:-4px;">
              <el-input style="width: 320px;" v-model="addWideForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="POOLS列表" prop="pools">
          <!--          <el-transfer filterable filter-placeholder="请输入查询条件" v-model="addWideForm.pools"-->
          <!--                       :data="poolOptions" :titles="['待选POOL', '已选POOL']" class="transfer" style="width: 100%">-->
          <!--          </el-transfer>-->
          <el-select v-model="addWideForm.pools" multiple filterable remote reserve-keyword placeholder="请输入关键词"
                     :remote-method="remoteMethod" :loading="loading" style="width: 825px">
            <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addWideForm')">取 消</el-button>
        <el-button type="primary" @click="addWide('addWideForm')">确定</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogUpdateWideIP" @close="handleClose" width="975px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">更新WideIP</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editWideForm" :model="editWideForm" :rules="rules" label-width="105px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态">
              <el-select v-model="editWideForm.state" style="width: 100%">
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
            <el-form-item label="别名" style="margin-left:-4px;">
              <el-input style="width: 320px;" v-model="editWideForm.aliases"
                        placeholder='多个别名请使用英文逗号(",")隔开'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="POOLS列表" prop="pools">
              <!--          <el-transfer filterable filter-placeholder="请输入查询条件" v-model="editWideForm.pools"-->
              <!--                       :data="poolOptions" :titles="['待选POOL', '已选POOL']" class="transfer" style="width: 100%">-->
              <!--          </el-transfer>-->
              <el-select v-model="editWideForm.pools" multiple filterable remote reserve-keyword placeholder="请输入关键词"
                         :remote-method="remoteMethod" :loading="loading" style="width: 100%">
                <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item></el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" style="margin-left:-4px;">
              <el-input disabled v-model="editWideForm.remark" style="width: 320px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editWideForm')">取 消</el-button>
        <el-button type="primary" @click="editWide('editWideForm')">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import {
    addF5Wide,
    aliaeseF5WideIp,
    deleteF5Wide,
    deleteF5WideIp,
    editF5Wide,
    fetchF5WideIp,
    getDatacenter,
    getPartition,
    getPool,
    getPoolType,
    getUsers,
    getzonelist,
    importF5WideIp,
    insertF5WideIp,
    refreshF5WideIp,
    remarkF5WideIp,
    statusF5WideIp,
  } from '@/api/cainiao/f5_dns'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'
  import {validIp} from '@/utils/validate'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  export default {
    name: 'ComplexTable',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
      UploadExcelComponent
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
      };
      return {
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          availabilitystate: undefined,
          enabledstate: undefined,
          deleted: 0,
          opr_time_s: undefined,
          ip_list: undefined,
          wide_name_list: undefined,
          partition: undefined,
          type: undefined,
        },
        loadAppForm: {
          wide_name: '',
          partition: '',
          type: '',
          remark: '',
        },
        editAppForm: {
          ip: '',
          pool_partition: 'Server_DNS',
          name: '',
          remark: '',
          datacenter: '/Common/DC_YTO',
          state: 'enabled',
          value: 'yto.cloud',
          port: 0,
          aliases: ''
        },
        addWideForm: {
          wide_name: '',
          type: '',
          state: 'enabled',
          wide_partition: 'Server_DNS',
          pools: [],
          aliases: '',
          value: 'yto.cloud',
          remark: '',
        },
        editWideForm: {
          wide_name: '',
          type: '',
          state: '',
          wide_partition: '',
          pools: [],
          aliases: '',
          remark: '',
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
        list: null,
        total: 0,
        listLoading: true,
        dialogCreateAppVisible: false,
        dialogEditAppVisible: false,
        dialogRemark: false,
        bulkImportFormVisible: false,
        dialogSearchVisible: false,
        dialogAliaese: false,
        dialogAddWideIP: false,
        dialogUpdateWideIP: false,
        adminrole: false,
        adminrole1: false,
        loading: false,
        activeName: 'ip',
        f1: true,
        statusOptions: [{'value': '启用', 'label': '启用'}, {'value': '禁用', 'label': '禁用'},
          {'value': '被父级禁用', 'label': '被父级禁用'}],
        statusOptions1: [{'value': 'enabled', 'label': '启用'}, {'value': 'disabled', 'label': '禁用'}],
        enableOptions: [{'value': '可用', 'label': '可用'}, {'value': '不可用', 'label': '不可用'},
          {'value': '离线', 'label': '离线'}, {'value': '未知', 'label': '未知'}],
        datacenterOptions: [],
        partitionOptions: [],
        zonelistOptions: [],
        poolOptions: [],
        poolOptions1: [],
        options: [],
        rules: {
          ip: [{required: 'true', message: '请正确填写ip', trigger: 'blur'}, {validator: validateIpaddress}],
          datacenter: [{required: 'true', message: '请填写数据中心字段', trigger: 'blur'}],
          pool_partition: [{required: 'true', message: '请填写分区字段', trigger: 'blur'}],
          name: [{required: 'true', message: '请填写名称字段', trigger: 'blur'}],
          wide_name: [{required: 'true', message: '请填写wide名称字段', trigger: 'blur'}],
          type: [{required: 'true', message: '请选择类型', trigger: 'blur'}],
          pools: [{required: 'true', message: '请选择pool成员', trigger: 'blur'}],
          wide_partition: [{required: 'true', message: '请选择分区', trigger: 'blur'}],
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        multipleSelection: [],
        tableData: [],
        tableHeader: [],
        poolType: [],
        remarkForm: {
          remark: ''
        },
        aliaeseForm: {
          aliases: '',
          wide_partition: '',
          wide_name: '',
          type: '',
        },
        user: '',
        select1: '',
      }
    },
    created() {
      this.adminrole = this.roles.includes('f5_gtm_dns');
      this.adminrole1 = this.roles.includes('f5_gtm_dns_delete_batch');
      this.getList();
      this.getParams();
      getUsers().then(res => {
        this.user = res.user
      });
      getDatacenter().then(res => {
        this.datacenterOptions = res
      });
      getPartition().then(res => {
        this.partitionOptions = res
      });
      getPool().then(res => {
        this.poolOptions1 = res
      });
      getzonelist().then(res => {
        this.zonelistOptions = res;
        for (const i of res) {
          const zone = [];
          const list = i.displayname.split(',');
          for (let j of list.wh_enumerate()) {
            zone.push({label: j.v, value: j.v, key: j.k})
          }
          this.zonelistOptions = zone
        }
      });
      getPoolType().then(res => {
        this.poolType = res
        // for (const i of res) {
        //   const list = i.displayname.split(',');
        //   const pool = [];
        //   for (const j in list) {
        //     pool.push({
        //       value: list[j], label: list[j], key: j
        //     })
        //   }
        //   this.poolType = pool
        // }
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.poolOptions.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      handleType(val) {
        const tmp = [];
        for (const i of this.poolOptions1) {
          if (val === i.type && this.addWideForm.wide_partition === i.partition) {
            tmp.push(i)
          }
        }
        this.poolOptions = tmp
      },
      handleWide(val) {
        const tmp = [];
        this.poolOptions = [];
        for (const i of this.poolOptions1) {
          if (val === i.partition && this.addWideForm.type === i.type) {
            tmp.push(i)
          }
        }
        this.poolOptions = tmp
      },
      beforeHandleCommand(index, row, command) {
        return {index, row, command}
      },
      handleCommand(command) {
        //可以相对应的进行操作
        switch (command.command) {
          case "仅删除WIDEIP":
            const msg = '确定要删除该条Wideip信息吗?';
            this.$confirm(msg, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'Wideip信息删除中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              deleteF5Wide({
                one: this.user,
                two: [{type: command.row.type, partition: command.row.partition, wide_name: command.row.wide_name}]
              }).then(res => {
                if (res.status === 'ok') {
                  loading.close();
                  this.$message({
                    title: '成功',
                    message: res.message,
                    type: 'success',
                    duration: 2000
                  });
                  this.getList()
                } else {
                  loading.close();
                  this.$message({
                    title: '失败',
                    message: res.message,
                    type: 'error',
                    duration: 2000
                  });
                  this.getList()
                }
              }).catch(err => {
                loading.close();
                this.$message({
                  message: err,
                });
              });
            });
            break;
          case "删除整条A记录":
            const msg1 = '确定要删除该域名吗?';
            this.$confirm(msg1, '提示', this.confirmOptions).then(() => {
              const loading = this.$loading({
                lock: true,
                text: '域名删除中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              deleteF5WideIp({
                one: this.user,
                two: [{
                  wide_name: command.row.wide_name,
                  partition: command.row.partition,
                  pool_names: command.row.pool_names,
                }]
              }).then(res => {
                if (res.status === 'ok') {
                  loading.close();
                  this.$message({
                    title: '成功',
                    message: res.message,
                    type: 'success',
                    duration: 2000
                  });
                  this.getList()
                } else {
                  loading.close();
                  this.$message({
                    title: '失败',
                    message: res.message,
                    type: 'error',
                    duration: 2000
                  });
                  this.getList()
                }
              }).catch(err => {
                loading.close();
                this.$message({
                  message: err,
                });
              });
            });
            break;
        }
      },
      deleteWideBatch() {
        if (this.multipleSelection.length > 0) {
          const msg = '确定要删除该' + this.multipleSelection.length + '条Wideip信息吗?';
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'Wideip信息删除中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            deleteF5Wide({one: this.user, two: this.multipleSelection}).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
                this.$message({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                });
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
      editWide(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'WIDEIP信息更新中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.editWideForm.pools = this.editWideForm.pools.toString();
            editF5Wide({one: this.user, two: [this.editWideForm]}).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
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
            this.dialogUpdateWideIP = false
          }
        })
      },
      editCommon(row) {
        this.dialogUpdateWideIP = true;
        this.editWideForm.wide_name = row.wide_name;
        this.editWideForm.aliases = row.aliases_name;
        this.editWideForm.type = row.type;
        this.editWideForm.pools = row.pool_names.split(',');
        this.editWideForm.wide_partition = row.partition;
        this.editWideForm.remark = row.remark;
        if (row.enabledstate === '启用') {
          this.editWideForm.state = 'enabled'
        } else {
          this.editWideForm.state = 'disabled'
        }
        if (row.type && row.partition) {
          const tmp = [];
          for (const i of this.poolOptions1) {
            if (row.type === i.type && row.partition === i.partition) {
              tmp.push(i)
            }
          }
          this.poolOptions = tmp
        }
      },
      addWide(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'WIDEIP信息添加中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.addWideForm.pools = this.addWideForm.pools.toString();
            this.addWideForm.wide_name = this.addWideForm.wide_name + '.' + this.addWideForm.value;
            addF5Wide({one: this.user, two: [this.addWideForm]}).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
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
            this.dialogAddWideIP = false
          }
        })
      },
      getParams() {
        // 取到路由带过来的参数
        const routerParams = this.$route.query.mallCode;
        this.$route.query.mallCode = undefined;
        // 将数据放在当前组件的数据内
        if (routerParams) {
          this.listQuery.name = routerParams
        }
      },
      onSubmitDialogButton() {
        if (this.listQuery.ip_list) {
          this.listQuery.ip_list = this.listQuery.ip_list.split('\n').join();
          this.listQuery.ip_list = this.listQuery.ip_list.replace(/[\r\n]/g, '').replace(/\s/g, '')
        }
        if (this.listQuery.wide_name_list) {
          this.listQuery.wide_name_list = this.listQuery.wide_name_list.split('\n').join();
          this.listQuery.wide_name_list = this.listQuery.wide_name_list.replace(/[\r\n]/g, '').replace(/\s/g, '')
        }
        this.getList();
        this.dialogSearchVisible = false
      },
      clearBatchTextSearch() {
        // 清空批量搜索textarea内容
        const listQuery = {...this.listQuery}
        this.listQuery = Object.assign({}, listQuery, {
          ip_list: undefined,
          wide_name_list: undefined,
        })
        // this.listQuery.ip_list = undefined;
        // this.listQuery.wide_name_list = undefined
      },
      handleBatchSearch() {
        // 打开批量搜索框
        this.clearBatchTextSearch();
        this.dialogSearchVisible = true
      },
      aliaese() {
        const tmp = {
          user: this.user
        };
        const loading = this.$loading({
          lock: true,
          text: '别名修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if (!this.aliaeseForm.aliases) {
          this.aliaeseForm.aliases = ''
        }
        aliaeseF5WideIp({one: tmp, two: [this.aliaeseForm]}).then(res => {
          if (res.status === 'ok') {
            loading.close();
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            loading.close();
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
        this.dialogAliaese = false
      },
      aliasesDialog(row) {
        this.dialogAliaese = true;
        this.aliaeseForm.aliases = row.aliases_name;
        this.aliaeseForm.wide_partition = row.partition;
        this.aliaeseForm.wide_name = row.wide_name;
        this.aliaeseForm.type = row.type
      },
      deleteBatch() {
        if (this.multipleSelection.length > 0) {
          const msg = '确定要删除该' + this.multipleSelection.length + '条域名吗?';
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名删除中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            deleteF5WideIp({one: this.user, two: this.multipleSelection}).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
                this.$message({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                });
                this.getList()
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
            this.dialogRemark = false
          })
        }
      },
      remarkBatch() {
        if (this.multipleSelection.length > 0 && this.remarkForm.remark) {
          const tmp = {
            user: this.user,
            remark: this.remarkForm.remark
          };
          const loading = this.$loading({
            lock: true,
            text: '域名备注中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          remarkF5WideIp({one: tmp, two: this.multipleSelection}).then(res => {
            if (res.status === 'ok') {
              loading.close();
              this.$message({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000
              });
              this.getList()
            } else {
              loading.close();
              this.$message({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              });
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
          };
          const msg = '确定要禁用该' + this.multipleSelection.length + '条域名吗?';
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5WideIp({one: tmp, two: this.multipleSelection}).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
                this.$message({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                });
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
          };
          const msg = '确定要启用该' + this.multipleSelection.length + '条域名吗?';
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5WideIp({one: tmp, two: this.multipleSelection}).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
                this.$message({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                });
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
          };
          const msg = '确定要刷新该' + this.multipleSelection.length + '条域名吗?';
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名刷新中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            refreshF5WideIp({one: tmp, two: this.multipleSelection}).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
                this.$message({
                  title: '失败',
                  message: res.message,
                  type: 'error',
                  duration: 2000
                });
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
        this.multipleSelection = val;
        if (val.length > 0) {
          this.f1 = false
        } else {
          this.f1 = true
        }
      },
      sendDomain(name) {
        this.$router.push({
          path: '/cainiao/index/f5_dns_pool',
          query: {
            mallCode: name
          }
        })
      },
      insert_wide() {
        const tmp = {
          user: this.user
        };
        const loading = this.$loading({
          lock: true,
          text: '记录添加中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.editAppForm.port = '' ? 0 : this.editAppForm.port;
        this.editAppForm.state = '' ? 'enabled' : this.editAppForm.state;
        this.editAppForm.name = this.editAppForm.name + '.' + this.editAppForm.value;
        insertF5WideIp({one: tmp, two: [this.editAppForm]}).then(res => {
          if (res.status === 'ok') {
            loading.close();
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            loading.close();
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
      remark_srv() {
        const tmp = {
          user: this.user,
          remark: this.loadAppForm.remark
        };
        const loading = this.$loading({
          lock: true,
          text: '备注信息修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        remarkF5WideIp({one: tmp, two: [this.loadAppForm]}).then(res => {
          if (res.status === 'ok') {
            loading.close();
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            loading.close();
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
        this.dialogCreateAppVisible = true;
        this.loadAppForm.wide_name = row.wide_name;
        this.loadAppForm.remark = row.remark;
        this.loadAppForm.partition = row.partition;
        this.loadAppForm.type = row.type
      },
      status_operate(row) {
        if (row.enabledstate === '启用' || row.enabledstate === '被父级禁用') {
          const tmp = {
            enabledstate: 'disabled',
            user: this.user
          };
          const msg = '确定要禁用该域名吗?';
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5WideIp({
              one: tmp, two: [{
                wide_name: row.wide_name,
                partition: row.partition,
                type: row.type,
              }]
            }).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
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
            user: this.user
          };
          const msg = '确定要启用该域名吗?';
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '域名启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5WideIp({
              one: tmp, two: [{
                wide_name: row.wide_name,
                partition: row.partition,
                type: row.type,
              }]
            }).then(res => {
              if (res.status === 'ok') {
                loading.close();
                this.$message({
                  title: '成功',
                  message: res.message,
                  type: 'success',
                  duration: 2000
                });
                this.getList()
              } else {
                loading.close();
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
        };
        const loading = this.$loading({
          lock: true,
          text: '域名刷新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        refreshF5WideIp({
          one: tmp,
          two: [{type: row.type, wide_name: row.wide_name, partition: row.partition}]
        }).then(res => {
          if (res.status === 'ok') {
            loading.close();
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            loading.close();
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
        this.resetlistQuery();
        this.getList()
      },
      getList() {
        this.listLoading = true;
        if (this.listQuery.opr_time_s) {
          this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        } else {
          this.listQuery.rtime = undefined
        }
        fetchF5WideIp(this.listQuery).then(response => {
          this.list = response.results;
          this.total = response.count;
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
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
          ip_list: undefined,
          wide_name_list: undefined,
          partition: undefined,
          type: undefined,
        }
      },
      resetForm(formName) {
        this.dialogCreateAppVisible = false;
        this.dialogEditAppVisible = false;
        this.dialogAddWideIP = false;
        this.dialogUpdateWideIP = false;
        this.$refs[formName].resetFields()
      },
      handleClose() {
        this.loadAppForm = {
          wide_name: '',
          wide_partition: '',
          type: '',
          remark: '',
        };
        this.editAppForm = {
          ip: '',
          pool_partition: 'Server_DNS',
          name: '',
          remark: '',
          datacenter: '/Common/DC_YTO',
          state: 'enabled',
          value: 'yto.cloud',
          port: 0,
          aliases: ''
        };
        this.remarkForm = {
          remark: ''
        };
        this.aliaeseForm = {
          aliases: '',
          wide_partition: '',
          wide_name: '',
          type: '',
        };
        this.addWideForm = {
          wide_name: '',
          type: '',
          state: 'enabled',
          wide_partition: 'Server_DNS',
          pools: [],
          aliases: '',
          value: 'yto.cloud',
          remark: '',
        };
        this.poolOptions = [];
        this.options = []
      },
      handleCloseBluk() {
        this.bulkImportFormVisible = false;
        this.tableData = []
      },
      handleSuccess({results, header}) {
        if (results.length > 100) {
          this.$message({
            message: '提示: 本次上传超过100条，只截取出前100条',
            type: 'warning',
            duration: 5000
          })
        }
        this.tableData = results.slice(0, 100);
        this.tableHeader = header
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (isLt1M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning',
        });
        return false
      },
      tableRowClassName({row, rowIndex}) {
        if (Object.keys(row).length < 6) {
          return 'warning-row'
        }
        return ''
      },
      deleteRow(index, rows) {
        rows.splice(index, 1)
      },
      uploadSuccess() {
        const tmp = {
          user: this.user
        };
        this.bulkImportFormVisible = false;
        const loading = this.$loading({
          lock: true,
          text: '数据导入中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        importF5WideIp({one: tmp, two: this.tableData}).then(res => {
          if (res.status === 'ok') {
            loading.close();
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            loading.close();
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            });
            this.getList()
          }
        }).catch(error => {
          loading.close();
          this.$message({
            message: '上传异常',
            type: 'error',
          })
        });
      },
      toggleRowExpansion(row, label) {
        if (label.label === '操作' || label.label === 'Wide名称' || label.label === 'ServerIp地址') {
          return
        }
        let $table = this.$refs.table;
        this.list.map((item) => {
          if (row.id !== item.id) {
            $table.toggleRowExpansion(item, false)
          }
        });
        $table.toggleRowExpansion(row)
      },
    },
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

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .transfer /deep/ div.el-transfer-panel {
    width: 320px;
  }

  .transfer /deep/ label.el-checkbox {
    display: block;
  }
</style>
