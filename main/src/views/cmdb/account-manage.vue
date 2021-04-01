<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-row>
          <el-form-item prop="account_name">
            <el-input v-model="listQuery.account_name" clearable placeholder="账号名" style="width: 140px;" class="filter-item"/>
          </el-form-item>
          <el-form-item prop="ip">
            <el-input v-model="listQuery.ip" placeholder="IP地址" clearable style="width: 140px;" class="filter-item"/>
          </el-form-item>
          <el-form-item prop="account_type">
            <el-select v-model="listQuery.account_type" placeholder="账号类型" filterable clearable class="filter-item"
                       @change="handleFilter" style="width: 120px;">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.label"/>
            </el-select>
          </el-form-item>

          <el-form-item prop="is_expired">
            <el-select v-model="listQuery.is_expired" placeholder="是否过期" filterable clearable class="filter-item"
                       @change="handleFilter" style="width: 120px;">
              <el-option key="是" label="是" value="是"/>
              <el-option key="否" label="否" value="否"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="is_not">
            <el-select v-model="listQuery.is_not" placeholder="是否启用" filterable clearable class="filter-item"
                       @change="handleFilter" style="width: 120px">
              <el-option key="1" label="启用" value="1"/>
              <el-option key="2" label="禁用" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="time_value">
            <el-date-picker class="filter-item" v-model="listQuery.time_value" align="right" style="width: 250px;padding-right:0"
                            type="daterange"
                            start-placeholder="开始时间" end-placeholder="结束时间" @change="handleFilter" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleBatchSearch()">新增</el-button>

          <el-button v-if="show_password" class="filter-item" style="float:right" type="primary" icon="el-icon-time" plain
                     @click="clickHisPwdButton()">历史密码
          </el-button>
        </el-row>
        <el-row>
          <el-button v-if='show_password' class="filter-item" type="warning" icon="el-icon-edit-outline" plain
                     :disabled="selected_rows.length === 0 " @click="handleBatchUpdate">批量修改
          </el-button>
          <el-button v-if='show_password' class="filter-item" icon="el-icon-delete" plain
                     :disabled="selected_rows.length === 0 " type="danger" @click="deletePool">批量删除
          </el-button>

          <el-button class="filter-item" type="primary" plain @click="batchSearchVisible=true">
            <svg-icon icon-class="search2"/>&nbsp; 批量查询
          </el-button>

          <el-button v-if='show_password' class="filter-item" type="primary" plain icon="el-icon-upload2"
                     @click="bulkImportClick">导入
          </el-button>
          <el-button class="filter-item" :loading="downloadLoading" plain type="primary" icon="el-icon-download"
                     @click="handleDownload">导出
          </el-button>

          <el-button v-if="show_password" class="filter-item" type="primary" plain icon="el-icon-success" :disabled="selected_rows.length === 0 "
                     @click="grantPermissionClick">授权
          </el-button>
        </el-row>
      </el-form>

    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row @cell-click="cellClick" :cell-style="cellStyleClass"
              :row-class-name="tableRowClassName" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column label="资源ID" align="center" min-width="70">
        <template slot-scope="scope">
          <span style="color:dodgerblue"><a @click="resouceIdClick(scope.row.resource_id)">{{ scope.row.resource_id }}</a></span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" align="center" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号名" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.account_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.exposed_pwd }}</span>
          <div style="float: right;border-radius:2px;cursor: pointer"
               onmousedown="this.style.backgroundColor= '#aaaaaa';" onmouseup="this.style.backgroundColor= '';">
            <el-tooltip class="item" effect="dark" content="复制到粘贴板" placement="top">
              <i class="el-icon-document-copy" style="color:dodgerblue" @click="clickCopy(scope.row)"></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="明文显示" align="center" width="65px">
        <template slot-scope="scope" slot="header">
          <el-button v-if="open_eye_in_header" type="primary" @click="plaintextPassword" :disabled="!show_password" circle>
            <svg-icon icon-class="eye-open"/>
          </el-button>
          <el-button v-if="!open_eye_in_header" type="primary" @click="plaintextPassword" :disabled="!show_password" circle>
            <svg-icon icon-class="eye"/>
          </el-button>
        </template>
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.plaintext"/>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.account_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" align="center" min-width="220">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roles===1" size="medium">管理用户</el-tag>
          <el-tag v-if="scope.row.roles===2" size="medium">普通用户</el-tag>
          <el-tag v-if="scope.row.roles===3" size="medium">只读用户</el-tag>
          <el-tag v-if="scope.row.is_not===1" size="medium">启用</el-tag>
          <el-tag v-if="scope.row.is_not===2" type="danger" size="medium">禁用</el-tag>
          <el-tag v-if="new Date(scope.row.expire_time*1000)<=Date.now()" type="danger" size="medium">已过期</el-tag>
          <el-tag v-if="new Date(scope.row.expire_time*1000)>Date.now()" size="medium">未过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" align="center" prop="expire_time" sortable width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.expire_time * 1000 | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="update_time" width="170" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time.substring(0,scope.row.update_time.length-3)  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show_his_pwd " label="历史密码1" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.his_pwd_1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show_his_pwd " label="历史密码2" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.his_pwd_2 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show_password" label="操作" align="center" width="130" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleBatchEdit(scope.row)"/>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleBatchDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>


    <pagination
      :page-sizes="[20,30,50,100]"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getList"
    />


    <el-dialog title="添加账号信息" :visible.sync="dialogSearchVisible" style="text-align: left;" width="27%"
               @open="dialogOpen" @close="handleClose">
      <el-form ref="numForm" :model="numberForm" :rules="rules" label-width="100px">
        <el-col :span="24">
          <el-form-item label="账号名" min-width="100" prop="account_name">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="numberForm.account_name" type="text" auto-complete="off" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" min-width="100" prop="pwd">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="numberForm.pwd" :type="password_type" auto-complete="off" style="width:100%">
              <el-button slot="append" icon="el-icon-view" @click="showPwd"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IP地址" min-width="100" prop="ip">
            <!--            <template slot-scope="scope" slot="error">-->
            <!--              <span></span>-->
            <!--            </template>-->
            <el-input v-model.trim="numberForm.ip" type="text" auto-complete="off" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账号类型" min-width="100" prop="account_type">
            <el-select v-model="numberForm.account_type" placeholder="请选择" style="width:100%">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="is_not">
            <el-select v-model="numberForm.is_not" placeholder="请选择" style="width:100%">
              <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="过期时间" min-width="100" prop="expire_time">
            <el-date-picker v-model="numberForm.expire_time" type="datetime" value-format="timestamp"
                            placeholder="选择日期时间" style="width:100%"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="角色" min-width="100" prop="roles">
            <el-select v-model="numberForm.roles" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in rolesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改账号信息" :visible.sync="dialogFormVisible" style="text-align: left;" width="27%" @open="dialogOpen"
               @close="handleClose">
      <el-form ref="dataForm" :model="accountEdit" :rules="rules" label-width="100px">
        <el-col :span="24">
          <el-form-item v-if="false" label="ID" min-width="100">
            <el-input v-model="accountEdit.id" type="text" auto-complete="off" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账号名" min-width="100" prop="account_name">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="accountEdit.account_name" type="text" auto-complete="off" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" min-width="100" prop="pwd">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="accountEdit.pwd" :type="password_type" auto-complete="off" style="width:100%">
              <el-button slot="append" icon="el-icon-view" @click="showPwd"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IP地址" min-width="100" prop="ip">
            <el-input v-model.trim="accountEdit.ip" type="text" auto-complete="off" disabled
                      style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账号类型" min-width="100" prop="account_type">
            <el-select v-model="accountEdit.account_type" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="is_not">
            <el-select v-model="accountEdit.is_not" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="过期时间" min-width="100" prop="expire_time">
            <el-date-picker
              v-model="accountEdit.expire_time"
              type="datetime"
              value-format="timestamp"
              placeholder="选择日期时间"
              :clearable=false
              style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="false" label="添加人" min-width="100">
            <el-input v-model.trim="accountEdit.add_people" :disabled="true" type="text" auto-complete="off"
                      style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色" min-width="100" prop="roles">
            <el-select v-model="accountEdit.roles" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in rolesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNumberManage()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量导入" :visible.sync="bulkImportFormVisible" width="85%" :before-close="handleCloseBluk" top="50px"
               style=" height: 100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link"
               href="/vue/cmdb/账号管理批量模板.xlsx">
              <el-button type="text">批量账号新增模板下载</el-button>
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
        <el-table-column label="操作" width="60px" fixed="right" v-if="tableData.length !=0">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="primary" circle
                       @click.native.prevent="deleteRow(scope.$index, tableData)"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkImportFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="uploadSuccess">提 交</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量修改" :visible.sync="patchUpdateFormVisible" style="text-align: left;" width="27%"
               @open="dialogOpen" @close="handleClose">
      <el-form ref="batchUpdateForm" :model="batchUpdateForm" :rules="rulesForBatchUpdate" label-width="100px">

        <el-col :span="24">
          <el-form-item label="密码" min-width="100" prop="pwd">
            <el-input type="password" style="position: fixed;bottom: -9999px"></el-input>
            <el-input v-model.trim="batchUpdateForm.pwd" :type="password_type" style="width:100%">
              <el-button slot="append" icon="el-icon-view" @click="showPwd"></el-button>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="账号类型" min-width="100" prop="account_type">
            <el-select v-model.trim="batchUpdateForm.account_type" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="是否启用" min-width="100" prop="is_not">
            <el-select v-model.trim="batchUpdateForm.is_not" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="过期时间" min-width="100" prop="expire_time">
            <el-date-picker v-model.trim="batchUpdateForm.expire_time"
                            type="datetime"
                            value-format="timestamp"
                            placeholder="选择日期时间"
                            :clearable=false
                            style="width:100%"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="角色" min-width="100" prop="roles">
            <el-select v-model.trim="batchUpdateForm.roles" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in rolesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="patchUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchUpdateAccountCommit()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量查询" :visible.sync="batchSearchVisible" :close-on-click-modal="false" @open="dialogOpen"
               width="45%">
      <template>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="IP地址" name="ip">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-input type="textarea" :rows="15" placeholder="请输入IP列表, 以逗号或回车分隔"
                            v-model="listQuery.ip_list"></el-input>
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="batchSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogBatchSearchSubmit">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="授权" :visible.sync="grantPermissionVisible" style="text-align: left;" width="1200px">
      <el-form ref="grantForm" :model="grantForm" label-width="100px">
        <el-table :data="grantForm.grant_table_data" highlight-current-row ref="grantTable"
                  tooltip-effect="dark" :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">

          <el-table-column label="用户/组" align="center" show-overflow-tooltip width="150px">
            <template slot-scope="scope">
              <el-form-item label-width="0" style="margin-bottom:0" :prop="'grant_table_data.' + scope.$index + '.user_or_group'"
                            :rules="rules_add.user_or_group">
                <el-select v-model="scope.row.user_or_group" filterable style="width:100%" @change="scope.row.user=''">
                  <el-option v-for="i in user_or_group_dict" :key="i[1]" :label="i[1]" :value="i[0]"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="员工/组" align="center" show-overflow-tooltip width="700px">
            <template slot-scope="scope">
              <el-form-item label-width="0" style="margin-bottom:0" :prop="'grant_table_data.' + scope.$index + '.user'" :rules="rules_add.user">
                <el-select v-if="scope.row.user_or_group==1" v-model="scope.row.user" clearable filterable style="width:100%">
                  <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <el-select v-else v-model="scope.row.user" clearable filterable style="width:100%">
                  <el-option v-for="item in group_list" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="过期时间" align="center" show-overflow-tooltip width="250px">
            <template slot-scope="scope">
              <el-form-item label-width="0" style="margin-bottom:0" :prop="'grant_table_data.' + scope.$index + '.expire_time'"
                            :rules="rules_add.expire_time">
                <el-date-picker type="datetime" v-model.trim="scope.row.expire_time" :picker-options="startTimePickerOptions"
                                style="width:100%" value-format="timestamp" format="yyyy-MM-dd HH:mm"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip width="60px">
            <template slot-scope="scope" slot="header">
              <el-button type="primary" icon="el-icon-plus" circle @click="clickAddDeviceButton"/>
            </template>
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-minus" circle @click="clickDeleteDeviceButton(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantPermissionVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantPermissionCommit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    fetchNumberList, addNumber, editNumber, deleteNumber, getLoginUser, AccGetGroupList,
    accountBulkCreate, accountBacthUpdate, accountGetIpList, AccGetUserList, AccAddGrandPermission
  } from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp, validSpecialChar} from '@/utils/validate'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {copyToClipboard} from '@/utils/wanghui_tools'
  // import ElButton from "../../components/WangHuiSelfDefined/el_button_wait/index";

  export default {
    name: 'ComplexTable',
    components: {Pagination, UploadExcelComponent},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        user_or_group_dict: new Map([[1, "用户"], [2, "组"]]),
        group_list: [],
        show_his_pwd: false,
        user_list: [],
        startTimePickerOptions: {disabledDate: this.disabledStartDate},
        grantPermissionVisible: false,
        grantForm: {grant_table_data: []},
        pickerOptions: {
          shortcuts: [
            {
              text: '最近三天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近两周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
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
            }, {
              text: '未来三天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '未来一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '未来两周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 14);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '未来一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '未来三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        open_eye_in_header: false,
        people: '',
        showIdColumn: false,
        downloadLoading: false,
        ipList: [],
        fileList: [],
        tableData: [],
        tableHeader: [],
        show_password: true,
        ciphertext: "********",
        password_type: 'password',
        selected_rows: Array(),
        status: [{value: 1, label: '启用'}, {value: 2, label: '禁用'}],
        rolesList: [{value: 1, label: '管理用户'}, {value: 2, label: '普通用户'}, {value: 3, label: '只读用户'}],
        typeList: [{value: 1, label: '虚拟机'}, {value: 2, label: '物理机'}, {value: 3, label: '管理IP'}, {
          value: 4, label: '数据库'
        }],
        listQuery: {
          page: 1,
          limit: 20,
          account_name: null,
          ip: null,
          account_type: null,
          is_expired: null,
          is_not: null,
          time_value: null,
          ip_list: null,
        },
        numberForm: {
          account_name: '',
          account_type: '',
          is_not: 1,
          pwd: '',
          ip: '',
          expire_time: (new Date()).getTime() + 86400 * 7 * 1000,
          add_people: '',
          roles: 1
        },
        batchUpdateForm: null,
        accountEdit: {
          id: '',
          account_name: '',
          account_type: '',
          is_not: 1,
          pwd: '',
          ip: '',
          expire_time: '',
          add_people: '',
          roles: ''
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        list: null,
        total: 0,
        listLoading: true,
        activeName: 'ip',
        dialogFormVisible: false,
        dialogSearchVisible: false,
        batchSearchVisible: false,
        bulkImportFormVisible: false,
        patchUpdateFormVisible: false,
        timestamp: '',
        logOptions: [],
        rules: {
          pwd: [{required: true, message: '请输入密码', trigger: 'blur'},
            {min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur'}],
          account_name: [{required: true, message: '请输入账号名', trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'},
            {validator: this.validateSpecialCharacter}],
          account_type: [{required: true, message: '请选择账号类型', trigger: 'blur'}],
          is_not: [{required: true, message: '请选择是否启用', trigger: 'blur'}],
          ip: [{message: '请输入正确的IP地址', required: true, trigger: 'blur'}, {validator: this.validateIpaddress}],
          expire_time: [{required: true, type: 'date', message: '请选择过期时间', trigger: 'blur'}],
          roles: [{required: true, message: '请选择角色类型', trigger: 'blur'}]
        },
        rulesForBatchUpdate: {
          pwd: [{min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur'}],
        },
        rules_add: {
          user: [{required: true, message: '请输入', trigger: 'blur'}],
          expire_time: [{required: true, message: '请输入', trigger: 'blur'}],
          user_or_group: [{required: true, message: '请输入', trigger: 'blur'}],
        }
      }
    },
    created() {
      if (this.$route.query.ip) {
        this.listQuery.ip = this.$route.query.ip
      }
      this.getList();
      this.getUser();
      this.getGroups();
      this.getIpList()
      this.initBatchUpdateForm()
    },
    mounted() {
      AccGetUserList().then(response => {
        this.user_list = response
      });
    },
    methods: {
      clickCopy(row) {
        copyToClipboard(row.pwd)
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      },
      clickHisPwdButton() {
        this.show_his_pwd = !this.show_his_pwd
      },
      resouceIdClick(resource_id) {
        this.$router.push({name: "ResourceManage", params: {id: resource_id}})
      },
      clickDeleteDeviceButton(row) {
        if (!row.user) {
          this.grantForm.grant_table_data.splice(row.index, 1)
          return
        }
        this.$confirm("确认删除吗", '提示', this.confirmOptions).then(() => {
          this.grantForm.grant_table_data.splice(row.index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      disabledStartDate(end) {
        return end.getTime() < new Date().getTime() - 86400000
      },
      clickAddDeviceButton() {
        if (this.grantForm.grant_table_data.length > 0) {
          let data = JSON.parse(JSON.stringify(this.grantForm.grant_table_data[this.grantForm.grant_table_data.length - 1])); //深拷贝;
          this.grantForm.grant_table_data.push({user: null, expire_time: data.expire_time, user_or_group: 1})
        } else {
          this.grantForm.grant_table_data.push({user: null, user_or_group: 1})
        }
      },
      grantPermissionClick() {
        this.grantPermissionVisible = true;
        this.grantForm.grant_table_data = [{user: null, user_or_group: 1}]
      },
      grantPermissionCommit() {
        let error_message = [];

        this.grantForm.grant_table_data.forEach(v => {
          v.grant_people = this.people;
        });

        let keys = []
        for (let i in this.grantForm.grant_table_data) {
          for (let prop of ['user', 'expire_time']) {
            let key = 'grant_table_data.' + i + '.' + prop
            keys.push(key)
          }
        }

        for (let key of keys)
          this.$refs.grantForm.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        let str_err = error_message.toString();
        if (str_err === '') {
          console.log(this.grantForm.grant_table_data)
          AccAddGrandPermission({data: this.grantForm.grant_table_data, selected_rows: this.selected_rows}).then(response => {
            console.log(this.grantForm.grant_table_data)
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
            }
          })
          this.grantPermissionVisible = false;
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },
      deviceHeaderClass() {
        return 'text-align: center;background:#f5f7fa;color:#56585c;padding:6px 0 5px 0'
      },
      cellStyleClass() {
        return 'padding:6px 0'
      },
      bulkImportClick() {
        this.bulkImportFormVisible = true
        this.tableHeader = []
        this.tableData = []
      },
      initBatchUpdateForm() {
        this.batchUpdateForm = {
          account_type: '',
          is_not: '',
          pwd: '',
          expire_time: '',
          add_people: this.people,
          roles: ''
        }
      },
      keyToValue(key, dict) {
        let new_dict = {};
        for (let i of dict) {
          new_dict[i['value']] = i['label']
        }
        return new_dict[key]
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'expire_time') {
            return this.$options.filters['parseTime'](v[j])
          } else if (j === 'is_not') {
            return this.keyToValue(v[j], this.status)
          } else if (j === 'roles') {
            return this.keyToValue(v[j], this.rolesList)
          } else {
            return v[j]
          }
        }))
      },
      getNow() {
        let now = new Date();
        let year = now.getFullYear(); //得到年份
        let month = now.getMonth();//得到月份
        let date = now.getDate();//得到日期
        let hour = now.getHours();//得到小时
        let minu = now.getMinutes();//得到分钟
        let sec = now.getSeconds();
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        let time = year + "-" + month + "-" + date + "-" + " " + hour + ":" + minu + ":" + sec;
        return year + "年" + month + "月" + date + "日"
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['账号名', '密码', 'IP', '账号类型', '角色', '是否启用', '过期时间', '更新时间', '添加人'];
          const filterVal = ['account_name', 'pwd', 'ip', 'account_type', 'roles', 'is_not', 'expire_time', 'update_time', 'add_people'];
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '账号密码管理-' + this.getNow(),
          })
          this.downloadLoading = false
        })
      },
      dialogBatchSearchSubmit() {
        if (this.listQuery.ip_list) {
          this.listQuery.ip_list = this.listQuery.ip_list.split('\n').join()
          this.listQuery.ip_list = this.listQuery.ip_list
            .replace(/[\r\n]/g, '')
            .replace(/\s/g, '')
        }
        this.getList();
        this.batchSearchVisible = false
      },
      validateIpaddress(rule, value, callback) {
        if (value) {
          if (validIp(value)) {
            if (this.ipList.indexOf(value) !== -1) {
              callback()
            } else {
              callback('此ip不在资源管理中')
            }
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      },
      validateSpecialCharacter(rule, value, callback) {
        if (value) {
          if (validSpecialChar(value)) {
            callback(new Error('不允许特殊字符'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      uploadSuccess(response) {
        this.bulkImportFormVisible = false;
        this.getUser();
        for (let item of this.tableData) {
          item.add_people = this.people
          item.change_user = this.people
        }
        accountBulkCreate(this.tableData).then(response => {
          let msg;
          let success_count = response.success_count;
          let error_msg = response.error_log;
          let failed_count = this.tableData.length - success_count;
          if (success_count !== 0) {
            msg = '成功上传' + success_count + '条,失败' + failed_count + '条\n';
            msg += error_msg
            msg = msg.replace('\n', '<br/>')
            this.$alert(msg, '提示', {confirmButtonText: '确定', dangerouslyUseHTMLString: true});
          } else {
            msg = '全部上传失败\n';
            msg += error_msg
            msg = msg.replace('\n', '<br/>')
            this.$alert(msg, '提示', {confirmButtonText: '确定', dangerouslyUseHTMLString: true})
          }
          console.log(msg);

        }).then(() => {
          setTimeout(this.handleReset, 500)
        });
      },
      deleteRow(index, rows) {
        rows.splice(index, 1)
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (isLt1M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning',
        })
        return false
      },
      handleSuccess({results, header}) {
        this.tableData = results
        this.tableHeader = header
      },
      handleCloseBluk() {
        this.bulkImportFormVisible = false
        this.fileList = []
      },
      deletePool() {
        let msg = '确定要删除信息吗?';
        var del_count = 0;
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          for (let row of this.selected_rows) {
            deleteNumber(row.id);
            del_count += 1
          }
        }).then(() => {
            this.$message({
              title: '成功',
              message: '成功删除' + del_count + '条',
              type: 'success',
              duration: 3000
            });
          }
        ).then(() => {
          setTimeout(this.handleReset, 500)
        })
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      showPwd() {
        if (this.password_type === 'password') {
          this.password_type = 'text'
        } else {
          this.password_type = 'password'
        }
      },
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      handleReset() {
        this.resetlistQuery();
        this.getList()
      },
      handleBatchSearch() {
        this.dialogSearchVisible = true;
        this.password_type = 'password'
      },
      handleBatchUpdate() {
        this.patchUpdateFormVisible = true;
        this.password_type = 'password';
        this.initBatchUpdateForm()
      },
      confirm() {
        let error_message = [];
        for (let key of ['account_name', 'pwd', 'ip', 'account_type', 'is_not', 'expire_time', 'roles'])
          this.$refs.numForm.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });

        let str_err = error_message.toString();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          this.numberForm.change_user = this.people;
          this.numberForm.add_people = this.people;
          this.numberForm.expire_time = parseInt(this.numberForm.expire_time / 1000);
          addNumber(this.numberForm).then(response => {
            if (response.error === '记录已存在') {
              this.$notify({
                title: '失败',
                message: '此条记录已存在',
                type: 'error',
                duration: 5000
              });
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.getList()
            }
          });
          this.dialogSearchVisible = false
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },
      handleBatchEdit(row) {
        console.log(this.listQuery.page)
        this.password_type = 'password';
        this.dialogFormVisible = true;
        this.accountEdit.id = row.id;
        this.accountEdit.account_name = row.account_name;
        this.accountEdit.account_type = row.account_type;
        this.accountEdit.pwd = row.pwd;
        this.accountEdit.ip = row.ip;
        this.accountEdit.expire_time = row.expire_time * 1000;
        this.accountEdit.add_people = row.add_people;
        this.accountEdit.roles = row.roles;
        this.accountEdit.is_not = row.is_not
        this.accountEdit.change_user = this.people;
        console.log(this.listQuery.page)
      },
      editNumberManage() {
        let error_message = [];
        for (let key of ['account_name', 'pwd', 'ip', 'account_type', 'is_not', 'expire_time', 'roles'])
          this.$refs.dataForm.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });

        let str_err = error_message.toString();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          this.accountEdit.change_user = this.people
          this.accountEdit.expire_time = this.accountEdit.expire_time / 1000;
          editNumber(this.accountEdit.id, this.accountEdit).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            });
            this.getList()
          });
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },
      batchUpdateAccountCommit() {
        let error_message = [];
        for (let key of ['pwd'])
          this.$refs.batchUpdateForm.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });

        let str_err = error_message.toString();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          this.batchUpdateForm.change_user = this.people
          this.batchUpdateForm.expire_time = this.batchUpdateForm.expire_time / 1000;
          let id_list = [];
          for (let i of this.selected_rows) {
            id_list.push(i.id)
          }
          this.batchUpdateForm.id_list = id_list;
          accountBacthUpdate(this.batchUpdateForm).then(response => {
            let failed_count = this.selected_rows.length - response.success_count
            this.$message({
              title: '成功',
              message: '成功修改' + response.success_count + '条，失败' + failed_count + '条',
              type: 'success',
              duration: 5000
            });
            this.getList();
            console.log(response.error_log)
          });
          this.patchUpdateFormVisible = false
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'error'
          });
          return false
        }

      },
      handleBatchDelete(row) {
        var msg = '确定删除该账号信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteNumber(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            });
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleClose() {
        this.activeName = null
      },
      getList() {
        this.listLoading = true;
        fetchNumberList(this.listQuery).then(response => {
          this.list = response.results;
          for (let item of this.list) {
            item.plaintext = 'eye';
            item.exposed_pwd = this.ciphertext;
            if (new Date(item.expire_time * 1000) > Date.now()) {
              item.out_of_date = '否'
            } else {
              item.out_of_date = '是'
            }
          }

          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getUser() {
        getLoginUser().then(response => {
          this.people = this.$store.getters.name;
          this.roles = this.$store.getters.roles;
          this.show_password = (response.show_password === 1);
        })
      }, getGroups() {
        AccGetGroupList().then(response => {
          this.group_list = response
        })
      },
      getIpList() {
        accountGetIpList().then(response => {
          this.ipList = response
        })
      },
      handleFilter(listQuery) {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
        if (this.listQuery.time_value) {
          let start = Math.floor(this.listQuery.time_value[0] / 1000);
          let end = Math.floor(this.listQuery.time_value[1] / 1000 + 86400);
          this.listQuery.time_range = start + ',' + end
        } else {
          this.listQuery.time_range = undefined
        }
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
        }
      },
      dialogOpen() {
        this.activeName = 'ip';
        // this.$refs['numForm'].resetFields()
        this.numberForm = {
          account_name: '',
          account_type: '虚拟机',
          is_not: 1,
          pwd: '',
          ip: '',
          expire_time: (new Date()).getTime() + 86400 * 7 * 1000,
          add_people: this.people,
          roles: 1
        }
      },
      plaintextPassword() {
        if (!this.open_eye_in_header) {
          for (let item of this.list) {
            item.plaintext = 'eye-open';
            item.exposed_pwd = item.pwd
          }
        } else {
          for (let item of this.list) {
            item.plaintext = 'eye';
            item.exposed_pwd = this.ciphertext
          }
        }
        for (let item of this.list) {
          this.$set(this.list, item.index, item)
        }
        this.open_eye_in_header = !this.open_eye_in_header
      },
      cellClick(row, column, cell, event) {
        if (!this.show_password) {
          return
        }
        if (column.label === '明文显示') {
          if (row.plaintext === 'eye') {
            row.plaintext = 'eye-open';
            row.exposed_pwd = row.pwd
          } else {
            row.plaintext = 'eye';
            row.exposed_pwd = this.ciphertext
          }
        }
        this.$set(this.list, row.index, row)
      }
    }
  }
</script>
<style>

</style>
