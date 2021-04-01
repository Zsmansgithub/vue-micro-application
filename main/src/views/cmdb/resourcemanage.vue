<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :model="listQuery" :inline="true">
        <search-form :listQuerySearch.sync='listQuerySearch'>
          <template v-slot:content>
            <el-form-item>
              <!-- <el-cascader expand-trigger="hover" :options="projectOptions" v-model="listQuery.project_name_list"
                          change-on-select clearable filterable style="width:450px;" placeholder="请选择产品线或应用名"
                          @blur="handleFilter" ></el-cascader> -->
              <el-cascader :options="projectOptions" v-model="listQuery.project_name_list" filterable clearable
                :props="{ checkStrictly: true, expandTrigger: 'hover' }" placeholder="请选择产品线或应用名" @change="handleFilter"
                style="width:300px;">
              </el-cascader>
            </el-form-item>
            <!-- <el-form-item prop="app">
              <el-select
                v-model="listQuery.app_name"
                filterable
                clearable
                remote
                reserve-keyword
                allow-create
                default-first-option
                placeholder="请输入应用名"
                :remote-method="remoteSearchMethod"
                popper-class="app-search-class"
                no-data-text='应用未找到'
                loading-text="查询中请稍等"
                :loading="loading"
                style="width:180px;"
                @change="appChange"
                @clear="appClear"
              >
                <el-option v-for="item in appnameOptionsP" :key="item.key" :label="item.display_name" :value="item" />
              </el-select> -->
            <!--        </el-form-item>-->
            <el-form-item prop="ip">
              <el-input v-model.trim="listQuery.ip" placeholder="IP地址" @keyup.enter.native="handleFilter" clearable
                style="width:150px;" class="filter-item" />
            </el-form-item>
            <el-form-item prop="env">
              <el-select v-model="listQuery.resource_env" clearable placeholder="环境类型" style="width:130px"
                @change="handleFilter">
                <el-option v-for="item in envList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="listQuery.status" clearable placeholder="状态" style="width:105px"
                @change="handleFilter">
                <el-option v-for="item in rsStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="resource_type">
              <el-select v-model="listQuery.resource_type" clearable placeholder="资源类型" style="width:105px"
                @change="handleFilter">
                <el-option v-for="item in rsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="other_page" clearable placeholder="其它页面数据" style="width:200px" @change="handleFilter"
                multiple>
                <el-option v-for="item in other_page_options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable
                style="width:130px" class="filter-item"></el-input>
            </el-form-item>
          </template>
          <template v-slot:trigger>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.app_name" placeholder="产品线/应用名" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.os_version" placeholder="系统版本" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.cpu" placeholder="CPU" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.memory" placeholder="内存" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.disk" placeholder="容量" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-input v-model.trim="listQuery.app_owner" placeholder="负责/维护人" clearable style="width: 100%;" />
            </form-item>
            <form-item :listQuerySearch="listQuerySearch">
              <el-date-picker v-model.trim="listQuery.update_time" type="datetime" placeholder="更新时间"
                default-time="12:00:00" style="width: 100%;">
              </el-date-picker>
            </form-item>
          </template>
          <template v-slot:search>
            <el-form-item>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleBatchSearch">批量查询
              </el-button>
            </el-form-item>
          </template>
        </search-form>
      </el-form>

      <div>
        <el-col :span="20">
          <el-button class="filter-item" type="success" plain :disabled="sbutton" ref="updatestatus1"
            icon="el-icon-upload2" @click="toggleSelection(1, 'updatestatus1' )" v-if="adminrole">上架</el-button>
          <el-button class="filter-item" type="primary" :disabled="wbutton" ref="updatestatus2" plain
            icon="el-icon-warning" @click="toggleSelection(2,'updatestatus2')" v-if="adminrole">维护</el-button>
          <el-button class="filter-item" type="danger" :disabled="xbutton" ref="updatestatus3" plain
            icon="el-icon-download" @click="toggleSelection(3)" v-if="adminrole">下架</el-button>
          <el-button class="filter-item" type="primary" plain :disabled="fbutton" ref="updatestatus4"
            icon="el-icon-goods" @click="handleAllocation" v-if="adminrole">分配</el-button>
          <el-button class="filter-item" type="primary" plain :disabled="fbutton" ref="updatestatus4"
            icon="el-icon-goods" @click="handleAllocation1" v-if="adminrole">分配(all)</el-button>
          <el-button class="filter-item" type="danger" :disabled="hbutton" ref="updatestatus5" plain
            icon="el-icon-sold-out" @click="handleRecycle" v-if="adminrole">回收</el-button>
          <!--@click="toggleSelection(4)" -->
          <el-button class="filter-item" type="danger" plain :disabled="bbutton" ref="updatestatus6"
            icon="el-icon-delete" @click="toggleSelection(5)" v-if="adminrole">报废</el-button>
          <el-button class="filter-item" type="primary" plain :disabled="bulkbutton" icon="el-icon-edit"
            @click="bulkeditdialogFormVisible=true" v-if="adminrole">批量修改</el-button>
          <el-button class="filter-item" type="danger" plain :disabled="bulkdeletebutton" icon="el-icon-delete"
            @click="handleDelete" v-if="host_manager_role">删除报废</el-button>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="downloadXLSX = true"
            :loading="downloadLoading">导出</el-button>
          <el-button class="filter-item" style="text-align: right" type="primary" plain icon="el-icon-upload"
            @click="bulkImportFormVisible=true;tableData=[]" v-if="adminrole">批量导入</el-button>
        </el-col>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width:100%"
      @row-click="toggleRowExpansion" @selection-change="selectChanges" ref="refTable" class="resource_manage">
      <el-table-column type="selection" width="35" align="center" :selectable="selectable">
      </el-table-column>
      <el-table-column label="ID" prop="id" sortable align="center" width="80">
        <template slot-scope="scope">
          <!-- <el-tooltip class="item" effect="dark" :content="scope.row.change_user_name" placement="top">
            <span>{{ scope.row.id }}</span>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark"
            :content="getTableTooltip(scope.row.app_rm, scope.row.app_rm2, scope.row.change_user_name)" placement="top">
            <span>{{ scope.row.id }}
              <div v-if="scope.row.app_rm" style="color: #8492a6;font-size:10px;">发布管理</div>
              <div v-if="scope.row.app_rm2" style="color: #8492a6;font-size:10px;">多应用</div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品线名称" min-width="135px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>
            {{ scope.row.subsystem_name}}
            <div style="color: #8492a6; font-size: 10px">{{scope.row.project_name}}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="应用名/应用中文名/类型" min-width="170px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="appFilter(scope.row.pd_fullname2, scope.row.app)">{{ scope.row.app_name
            }}</a>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.app_cname}} {{scope.row.app_type}}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP/主机名" width="125px" prop="ip" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.host_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="系统版本" width="110px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.os_version }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.os_type_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="CPU" width="75px" prop="cpu" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存" width="75px" prop="memory" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.memory }}G</span>
        </template>
      </el-table-column>
      <el-table-column label="可用容量" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.disk<=1000">{{ scope.row.disk }}G</span>
          <span v-else>{{ (scope.row.disk/1000).toFixed(2) }}T</span>
        </template>
      </el-table-column>
      <el-table-column label="环境/资源类型" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.resource_env_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.resource_type_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success" class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
          <el-tag v-else-if="scope.row.status==2" type="warning" class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
          <el-tag v-else-if="scope.row.status==5" type="info" class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
          <el-tag v-else class="tag-line">
            <div>{{ scope.row.status_name }}</div>
            <div>{{ scope.row.is_ping_name }}</div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责/维护人" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.app_owner }}</span>
          <div style="color: #8492a6; font-size: 10px"><span v-for="(site,index) in scope.row.maintain_user_name"
              :key="index">{{ site }} </span></div>
          <div style="color: #8492a6; font-size: 10px"><span v-for="(site,index) in scope.row.ops_user_name"
              :key="index">{{ site }} </span></div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间/备注" width="135px" :show-overflow-tooltip="true" prop="update_time" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.comments }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60px" fixed="right" v-if="adminrole">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" plain circle :disabled="getOPBoolean(scope.row)"
            @click="editFormCommon(scope.row, $event)" />
        </template>
      </el-table-column>
      <el-table-column type="expand" class-name="el-table__expand-icon_s" width="1px" fixed="right">
        <template slot-scope="props">
          <vm-detail v-if="props.row.resource_type == 4" :detail-str="props.row.expandinfo"></vm-detail>
          <vm-ecs-detail v-else-if="props.row.resource_type == 7" :detail-str="props.row.expandinfo"></vm-ecs-detail>
          <py-detail v-else :detail-str="props.row.expandinfo"></py-detail>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      :pageSizes.sync="pageSizes" @pagination="getList" style="padding-top: 5px;margin-top: 10px;" />

    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" :close-on-click-modal="false" @open="dialogOpen"
      width="45%">
      <template>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="IP地址" name="ip">
            <template>
              <el-row>
                <el-col :span="24">
                  <!-- <el-form :model="listQuery" :rules="rules" ref="batchSearchForm">
                    <el-form-item prop="ip_list">
                      <el-input type="textarea" :rows="15" placeholder="请输入IP列表,以逗号分隔" v-model="listQuery.ip_list"></el-input>
                    </el-form-item>
                  </el-form> -->
                  <el-input type="textarea" :rows="15" placeholder="请输入IP列表,以逗号分隔" v-model="listQuery.ip_list">
                  </el-input>
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
          <el-tab-pane label="主机名" name="hostname">
            <el-row>
              <el-col :span="24">
                <!-- <el-form :model="listQuery" :rules="rules" ref="batchSearchForm">
                  <el-form-item prop="hostname_list">
                    <el-input type="textarea" :rows="15" placeholder="请输入主机名列表,以逗号分隔" v-model="listQuery.hostname_list"></el-input>
                  </el-form-item>
                </el-form> -->
                <el-input type="textarea" :rows="15" placeholder="请输入主机名列表,以逗号分隔" v-model="listQuery.hostname_list">
                </el-input>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogSearchVisible = false;">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton('batchSearchForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog title="分配资源" :visible.sync="allocationdialogFormVisible" width="30%" top="120px">
      <el-form label-width="100px">
        <el-form-item label="产品线名称">
          <el-cascader expand-trigger="hover" :options="projectOptions" v-model="listQuery.project_name_list"
                      clearable filterable style="width:95%;" placeholder="请选择产品线名称"
                      @change="findapp"></el-cascader>
        </el-form-item>
        <el-form-item label="应用名称">
          <el-select v-model="app_id_log" filterable clearable :disabled="disabledPool" placeholder="请输入应用名" style="width: 95%;">
            <el-option v-for="item in appnameOptionsAlloc" :key="item.id" :label="item.app_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="AllocComments" placeholder="备注" type="textarea" style="width:95%;" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allocationdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCommon()">确 定</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="分配应用" :visible.sync="allocationdialogFormVisible" width="800px" top="120px"
      :close-on-click-modal="false">
      <el-form label-width="100px" :model="allocationForm" :rules="rules1" ref="allocationForm">
        <el-form-item label="应用名" prop="app_id">
          <el-cascader expand-trigger="hover" :options="projectOptions" v-model="allocationForm.app_id" clearable
            filterable style="width:95%;" placeholder="请选择应用名"></el-cascader>
        </el-form-item>
        <el-form-item label="项目编号" prop="pool_full_name">
          <el-select v-model="allocationForm.pool_full_name" clearable filterable placeholder="项目编号" style="width:95%;">
            <el-option v-for="item in poolAllData" :key="item.value" :label="'('+item.value+')'+item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="allocationForm.comments" placeholder="备注信息" type="textarea" style="width:95%;"
            maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allocationdialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateCommon('allocationForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配资源" :visible.sync="allocationdialogFormVisible1" width="800px" top="120px"
      :close-on-click-modal="false">
      <el-form label-width="100px" :model="allocationForm1" :rules="rules1" ref="allocationForm1">
        <fieldset>
          <legend>分配应用</legend>
          <el-form-item label="应用名" prop="app_id">
            <el-cascader expand-trigger="hover" :options="projectOptions" v-model="allocationForm1.app_id" clearable
              filterable style="width:95%;" placeholder="请选择应用名"></el-cascader>
          </el-form-item>
          <el-form-item label="项目编号" prop="pool_full_name">
            <el-select v-model="allocationForm1.pool_full_name" clearable filterable placeholder="项目编号"
              style="width:95%;">
              <el-option v-for="item in poolAllData" :key="item.value" :label="'('+item.value+')'+item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="allocationForm1.comments" placeholder="备注信息" type="textarea" style="width:95%;"
              maxlength="200"></el-input>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>分配应用权限</legend>
          <el-form-item>
            <div v-if="select=='uuid'" style="margin:0 0 0 -48px">
              <el-tooltip content="请选择要赋权的用户或部门(点击可切换)" placement="top">
                <el-button type="text" @click="select='ouid';allocationForm1.userName=[]">用户<i
                    class="el-icon-caret-bottom "></i></el-button>
              </el-tooltip>
              <el-select v-model="allocationForm1.userName" filterable clearable reserve-keyword multiple
                :multiple-limit="6" placeholder="请输入审批人工号/姓名" style="width:88.5%;">
                <el-option v-for="item in OptionsUserList" :key="item.value" :label="'('+item.value+')'+item.label"
                  :value="item.value" />
              </el-select>
            </div>
            <div v-else-if="select=='ouid'" style="margin:0 0 0 -48px">
              <el-button type="text" @click="select='uuid';allocationForm1.userName=[]">部门<i
                  class="el-icon-caret-bottom"></i></el-button>
              <el-select v-model="allocationForm1.userName" filterable clearable reserve-keyword multiple
                :multiple-limit="6" placeholder="请输入审批部门名称" style="width:88.5%;">
                <el-option v-for="item in OptionsD" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>分配账号密码</legend>
          <!-- <el-form-item label="授权用户" v-if="multipleSelectionAccountManageId.length!=0">
            <el-select v-model="allocationForm1.accountUser" placeholder="请选择用户" filterable clearable reserve-keyword multiple
                      :multiple-limit="6" style="width:95%;">
              <el-option v-for="item in OptionsUserList" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->
          <div v-if="account_select=='uuid' && multipleSelectionAccountManageId.length!=0" style="margin:0 0 25px 50px">
            <el-tooltip content="请选择要赋权的用户或部门(点击可切换)" placement="top">
              <el-button type="text" @click="account_select='ouid';allocationForm1.accountUser=[]">用户<i
                  class="el-icon-caret-bottom "></i></el-button>
            </el-tooltip>
            <el-select v-model="allocationForm1.accountUser" filterable clearable reserve-keyword multiple
              :multiple-limit="6" placeholder="请输入审批人工号/姓名" style="width:88.5%;">
              <el-option v-for="item in OptionsUserList" :key="item.value" :label="'('+item.value+')'+item.label"
                :value="item.value" />
            </el-select>
          </div>
          <div v-else-if="account_select=='ouid' && multipleSelectionAccountManageId.length!=0"
            style="margin:0 0 25px 50px">
            <el-button type="text" @click="account_select='uuid';allocationForm1.accountUser=[]">部门<i
                class="el-icon-caret-bottom"></i></el-button>
            <el-select v-model="allocationForm1.accountUser" filterable clearable reserve-keyword multiple
              :multiple-limit="6" placeholder="请输入审批部门名称" style="width:88.5%;">
              <el-option v-for="item in OptionsD" :key="item.value" :label="item.label" :value="item.ou_path" />
            </el-select>
          </div>
          <el-form-item label="过期时间" v-if="multipleSelectionAccountManageId.length!=0">
            <el-date-picker v-model="allocationForm1.expire_time" type="datetime" value-format="timestamp"
              placeholder="选择日期时间" style="width:96%" />
          </el-form-item>
          <el-form-item v-if="problem_items.length>0" style="margin:0 0 0 -70px">
            <div>提示: 共选中 {{ multipleSelection.length }} 条，其中有 {{ multipleSelection.length -
              multipleSelectionAccountManageId.length }} 条的IP在 “账号密码表” 中不存在! 无法添加账号密码权限! 详情如下:</div>
            <!-- <div>{{ problem_items }}</div> -->
            <el-row>
              <el-tag type="danger" v-for="(item, index) in problem_items" :key="index"
                style="margin-right:10px;margin-bottom:10px;">{{ item.id + ' - ' + item.ip }}</el-tag>
            </el-row>
          </el-form-item>
        </fieldset>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allocationdialogFormVisible1=false">取 消</el-button>
        <el-button type="primary" @click="updateCommon1('allocationForm1')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="回收" :visible.sync="recycledialogFormVisible" width="800px" top="120px"
      :close-on-click-modal="false">
      <el-form label-width="100px" :model="recycleForm" :rules="rules1" ref="recycleForm">
        <el-form-item label="项目编号" prop="pool_full_name">
          <el-select v-model="recycleForm.pool_full_name" clearable filterable placeholder="项目编号" style="width:95%;">
            <el-option v-for="item in poolAllData" :key="item.value" :label="'('+item.value+')'+item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="recycleForm.comments" placeholder="备注信息" type="textarea" style="width:95%;"
            maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recycledialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateCommon2('recycleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改资源配置" :visible.sync="editdialogFormVisible" width="55%" :before-close="handleClose" top="60px"
      style="height: 100%;" v-model="editformdict" :close-on-click-modal="false">
      <template>
        <vm-detail-edit ref="updateform" v-if="editformdict.resource_type == 4" :detail-str="editformdict">
        </vm-detail-edit>
        <py-detail-edit ref="updateform" v-else-if="editformdict.resource_type in [1,2,3,6]" :detail-str="editformdict">
        </py-detail-edit>
        <label v-else>error</label>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="editformupdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量导入" :visible.sync="bulkImportFormVisible" width="85%" :before-close="handleCloseBluk" top="50px"
      :close-on-click-modal="false" style=" height: 100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/cmdb/phy_server_bulk.xlsx">
              <el-button type="text">物理设备（模板下载）</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="14">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="width: 100%;" />
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;"
        :row-class-name="tableRowClassName">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        <el-table-column label="操作" width="60px" fixed="right" v-if="tableData.length !=0">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="primary" circle
              @click.native.prevent="deleteRow(scope.$index, tableData)" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkImportFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="uploadSuccess">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改配置" :visible.sync="bulkeditdialogFormVisible" width="45%" :before-close="handleClosebulkedit"
      top="60px" :close-on-click-modal="false">
      <template>
        <div>
          <el-form :model="bulkeditformdict" label-width="110px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="维保商">
                  <el-select v-model="bulkeditformdict.supplier" placeholder="维保商">
                    <el-option v-for="item in resource_sp" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- <el-form-item label="过保时间" prop="expandinfo.expired_day"> -->
                <el-form-item label="过保时间" prop="expired_day">
                  <el-date-picker v-model="bulkeditformdict.expired_day" type="date" placeholder="选择日期"
                    value-format="yyyy-MM-dd" :clearable=false style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="环境类型">
                  <el-select v-model="bulkeditformdict.resource_env" placeholder="环境类型" clearable>
                    <el-option v-for="item in env_list" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注信息">
                  <el-input v-model="bulkeditformdict.comments" placeholder="备注" type="textarea" autosize
                    maxlength="200"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkeditdialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="bulkeditformupdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量删除报废主机" :visible.sync="bulkDeleteDialogVisible" :close-on-click-modal="false" width="45%">
      <div v-if="scrapMachine.is_scrap.length!=0">
        <el-tag v-for="(item, index) in scrapMachine.is_scrap" :key="index"
          style="margin-right:10px;margin-bottom:10px;">{{ item.id + ' - ' + item.ip }}</el-tag>
      </div>
      <div v-if="scrapMachine.is_not_scrap.length!=0" style="margin:20px 10px;">
        <div>提示: 共选中 {{ multipleSelection.length }} 条，其中有 {{ scrapMachine.is_not_scrap.length }} 条的资源不是"报废"状态! 不能执行删除操作!
          详情如下:</div>
        <el-tag type="warning" v-for="(item, index) in scrapMachine.is_not_scrap" :key="index"
          style="margin:10px 10px 0px;">{{ item.id + ' - ' + item.ip }}</el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="bulkDeleteDialogVisible=false;">取 消</el-button>
        <el-button type="primary" v-if="scrapMachine.is_scrap.length!=0 && adminrole" @click="onHandleDelete">确 定
        </el-button>
      </span>
    </el-dialog>

    <download-header :checks="checks" :visible.sync="downloadXLSX" :onDownLoad="handleDownload"
      :onExport="handleExport" />
  </div>
</template>

<script>
  import {
    fetchList,
    fetchPyList,
    updatePyList,
    updategPyList,
    createRList,
    fetchVmList,
    fetchVmEcsList,
    getSupplierList,
    bulkUpdate,
    getScrapMachine,
    handleDeleteMachine,
    updateVmbaseInfo,
    updatePybaseInfo,
    exportList,
    exportIsready,
    exportFile,
  } from '@/api/cmdbs/resourcemanage'
  import { getProductAppCascader } from '@/api/cmdbs/product_line'
  import { fetchAppList, getPoolAll1 } from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import { fetchAppListP } from '@/api/cmdb'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import SearchForm from '@/components/SearchForm'
  import FormItem from '@/components/SearchForm/FormItem'
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import { validIp } from '@/utils/validate'
  import PyDetail from './components/py_detail'
  import VmDetail from './components/vm_detail'
  import VmEcsDetail from './components/vm_ecs_detail'
  import PyDetailEdit from './components/py_detail_edit'
  import VmDetailEdit from './components/vm_detail_edit'
  import { deepClone, parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import SystemVersion from '@/components/Tools/SystemVersion'
  import { renv, rsStatus, rsType, envList } from '@/api/static'
  import { createAppPermission } from '@/api/cmdbs/app_permission'
  import { getUserInfo, getdepartmentInfo2 } from '@/api/zabbix/user_info'
  import { AccAddGrandPermission } from '@/api/cmdb'
  import DownloadHeader from '@/components/DownloadHeader'
  import { setInterval, clearInterval } from 'timers';

  export default {
    name: 'ResourceManage',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
      PyDetail,
      VmDetail,
      VmEcsDetail,
      PyDetailEdit,
      UploadExcelComponent,
      VmDetailEdit,
      SystemVersion,
      DownloadHeader,
      SearchForm,
      FormItem,
    },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger',
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      },
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
      const validateIPList = (rule, value, callback) => {
        if (value) {
          if (value.trim().split(/[,;\/\-|\s]+/).length <= 100) {
            // callback()
          } else {
            callback(new Error('查询条目数不能超过100个!'))
          }
        } else {
          callback(new Error('该输入框不能为空!'))
        }
      }
      return {
        checks: {
          checkList: ['id', 'project_name', 'app_name', 'app_type', 'ip', 'host_name', 'os_type_name', 'os_version',
            'cpu', 'memory', 'disk', 'resource_env_name', 'status_name', 'resource_type_name', 'app_owner',
            'update_time', 'comments', 'location_mr', 'location_frame', 'is_ping_name'],
          list: [
            { key: 'id', label: 'ID' },
            { key: 'project_name', label: '产品线' },
            { key: 'app_name', label: '应用' },
            { key: 'app_type', label: '应用类型' },
            { key: 'ip', label: 'IP' },
            { key: 'host_name', label: '主机名' },
            { key: 'os_type_name', label: '操作系统类型' },
            { key: 'os_version', label: '操作系统版本' },
            { key: 'cpu', label: 'CPU个数' },
            { key: 'memory', label: '内存' },
            { key: 'disk', label: '磁盘' },
            { key: 'resource_env_name', label: '服务器环境' },
            { key: 'status_name', label: '状态' },
            { key: 'is_ping_name', label: '能否ping通' },
            { key: 'resource_type_name', label: '资源类型' },
            { key: 'app_owner', label: '负责人' },
            { key: 'location_mr', label: '机房' },
            { key: 'location_frame', label: '机柜' },
            { key: 'update_time', label: '更新时间' },
            { key: 'comments', label: '备注' }
          ]
        },
        downloadXLSX: false,
        disabledPool: true,
        rsStatus: rsStatus,
        envList: renv,
        rsType: rsType,
        env_list: renv,
        editformdict: {},
        bulkeditformdict: {},
        multipleSelection: [],
        projectOptions: [],
        appnameOptionsAlloc: [],
        resource_sp: [],
        selectedOptions: [],
        fileList: [],
        loading: false,
        expands: [],
        expands_info: undefined,
        app_id_log: undefined,

        adminrole: false,
        host_manager_role: false,

        pageSizes: [20, 50, 100, 150],
        other_page_options: [{ 'label': '多应用', 'value': 1 }, { 'label': '发布管理', 'value': 2 }],
        listQuery: {
          page: 1,
          limit: 20,
          project_name_list: undefined,
          app: undefined,
          resource_env: undefined,
          resource_type: undefined,
          ip: undefined,
          ip_list: undefined,
          hostname_list: undefined,
          status: undefined,
          search: undefined,
          // other_page: [1, 2]
        },
        other_page: [1, 2],
        batchSearchForm: {
          ip_list: '',
          hostname_list: '',
        },
        projectOptions: [1, 2, 3],
        historySearch: {
          id: undefined,
          timestamp: '',
        },
        list: null,
        total: 0,
        listLoading: true,
        activeName: 'ip',
        appnameOptions: [],
        appnameOptionsP: [],
        dialogFormVisible: false,
        bulkeditdialogFormVisible: false,
        editdialogFormVisible: false,
        bulkImportFormVisible: false,
        dialogSearchVisible: false,
        dialogStatus: '',
        rules: {
          ip: [{ message: '请输入正确的IP地址', trigger: 'blur', validator: validateIpaddress }],
          ip_list: [{ trigger: 'blur', validator: validateIPList }],
          hostname_list: [{ trigger: 'blur', validator: validateIPList }]
        },
        tableData: [],
        tableHeader: [],
        sbutton: true,
        wbutton: true,
        xbutton: true,
        hbutton: true,
        fbutton: true,
        bbutton: true,
        bulkbutton: true,
        bulkdeletebutton: true,

        // AllocComments:'',
        poolAllData: [],
        allocationdialogFormVisible: false,
        allocationForm: { app_id: undefined, pool_full_name: undefined, comments: undefined },

        allocationdialogFormVisible1: false,
        select: "uuid",
        account_select: "uuid",
        allocationForm1: {
          app_id: undefined,
          pool_full_name: undefined,
          comments: undefined,
          userName: [],
          accountUser: [],
          expire_time: (new Date()).getTime() + 86400 * 15 * 1000
        },
        OptionsUserList: [],
        OptionsD: [],
        // startTimePickerOptions: {disabledDate: this.disabledStartDate},
        multipleSelectionAccountManageId: [],
        problem_items: [],
        rules1: {
          app_id: [{ required: true, message: '请选择应用名', trigger: 'change' }],
          pool_full_name: [{ required: true, message: '请选择项目编号' }]
        },

        recycledialogFormVisible: false,
        recycleForm: { pool_full_name: undefined, comments: undefined },

        downloadLoading: false,
        filename: '资源管理导出',
        autoWidth: true,
        bookType: 'xlsx',
        listQuerySearch: false,

        bulkDeleteDialogVisible: false,
        scrapMachine: { is_scrap: [], is_not_scrap: [] },

      }
    },
    watch: {
      '$route': function (to, from) {
        if (this.$route.params.ip_list) {
          this.listQuery.ip_list = this.$route.params.ip_list;
          this.getList();
        }
        if (this.$route.params.ip) {
          this.listQuery.ip = this.$route.params.ip;
          this.getList();
        }
        if (this.$route.params.id) {
          this.listQuery.id = this.$route.params.id;
          this.getList();
        }
      },
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      // 'allocationAppPermissionForm.filterText': val => {
      //   this.$refs.tree2.filter(val);
      // }

      // 'checkboxGroup': 'handleFilter',

    },
    created() {
      // get url param: ip
      if (this.$route.query.ip_list) {
        this.listQuery.ip_list = this.$route.query.ip_list
      }
      if (this.$route.query.ip) {
        this.listQuery.ip = this.$route.query.ip
      }
      if (this.$route.params.id) {
        this.listQuery.id = this.$route.params.id
      }

      // this.getAppList()

      this.adminrole = this.roles.includes('cmdb_admin')
      this.host_manager_role = this.roles.includes('host_manager')
      // this.host_manager_role = this.roles.includes('cmdb')    // 测试时用

      getProductAppCascader().then(response => {
        this.projectOptions = response
      })
      getSupplierList().then(response => {
        this.resource_sp = response
      }).catch((error) => {
        this.$message({
          message: '数据不存在！'
        })
      })

      getUserInfo().then(response => {
        this.OptionsUserList = response
      })
      getdepartmentInfo2().then(response => {
        this.OptionsD = response
      })

      getPoolAll1().then(response => {
        this.poolAllData = response
      })

    },

    mounted() {
      this.getParams()
    },

    computed: {
      ...mapGetters(['roles', 'name']),
    },

    methods: {
      getParams() {
        // 取到路由带过来的参数
        const routerParams = this.$route.query.app
        // 将数据放在当前组件的数据内
        if (routerParams) {
          this.listQuery.app = routerParams
          this.handleFilter()
        } else if (this.$route.params.query_str) {
          let query_list = this.$route.params.query_str.split(/[\^]/)
          let cascader_list = [query_list[0] + '-' + query_list[1], query_list[2], query_list[3], Number(query_list[4])]
          this.listQuery.project_name_list = cascader_list
          this.getList()
        } else {
          this.getList()
        }
      },

      getList() {
        this.listLoading = true
        let queryParams = Object.assign(this.listQuery, { other_page: this.other_page })
        // fetchList(this.listQuery).then(response => {
        fetchList(queryParams).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
          // this.editformdict=this.list[2]
        })
      },
      handleFilter() {
        this.clearBatchTextSearch()
        this.listQuery.page = 1
        this.listQuery.limit = 20
        // this.listQuery.app = undefined
        this.$refs['listQuery'].validate(valid => {
          if (valid) {
            this.getList()
          }
        })
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          project_name_list: undefined,
          app: undefined,
          resource_env: undefined,
          resource_type: undefined,
          ip: undefined,
          ip_list: undefined,
          hostname_list: undefined,
          status: undefined,
          search: undefined,
          // other_page: [1, 2]
        }
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },

      appFilter(pd_fullname2, app) {
        // this.clearBatchTextSearch()
        let tmp = pd_fullname2.split('^')
        this.listQuery = Object.assign({ other_page: this.other_page }, this.$options.data().listQuery, {
          page: 1,
          limit: 20,
          project_name_list: [tmp[0] + '-' + tmp[1], tmp[2], tmp[3], app]
        })
        // this.listQuery.app_name=app_name    // app_name有重复
        // this.listQuery.app = app
        this.getList()
      },

      clearBatchTextSearch() {
        // 清空批量搜索textarea内容
        this.listQuery.ip_list = undefined
        this.listQuery.hostname_list = undefined
      },
      handleBatchSearch() {
        this.clearBatchTextSearch()
        this.resetlistQuery()
        this.dialogSearchVisible = true
      },
      onSubmitDialogButton(formName) {
        if (this.listQuery.ip_list) {
          let ip_lst = this.listQuery.ip_list.split(/[,;\/\-|\s]+/)
          let len = ip_lst.length
          if (len > 500) {
            this.$message({
              message: '查询条目数不能超过500个 !  当前已经 ' + len + '个 !',
              type: 'warning',
            })
            return false
          }
          // this.listQuery.ip_list = this.listQuery.ip_list.split('\n').join()
          // this.listQuery.ip_list = this.listQuery.ip_list
          //   .replace(/[\r\n]/g, '')
          //   .replace(/\s/g, '')
          this.listQuery.ip_list = ip_lst.join(',')
        }
        if (this.listQuery.hostname_list) {
          // this.$refs[formName].validate((valid) => {
          //   if (valid) {
          //     this.listQuery.hostname_list = this.listQuery.hostname_list
          //       .split('\n')
          //       .join()
          //     this.listQuery.hostname_list = this.listQuery.hostname_list
          //       .replace(/[\r\n]/g, '')
          //       .replace(/\s/g, '')
          //     this.getList()
          //     this.dialogSearchVisible = false
          //   } else {
          //     return false
          //   }
          // })
          let hostname_lst = this.listQuery.hostname_list.split(/[,;\/\-|\s]+/)
          let len = hostname_lst.length
          if (len > 500) {
            this.$message({
              message: '查询条目数不能超过500个 !  当前已经 ' + len + '个 !',
              type: 'warning',
            })
            return false
          }
          // this.listQuery.hostname_list = this.listQuery.hostname_list
          //   .split('\n')
          //   .join()
          // this.listQuery.hostname_list = this.listQuery.hostname_list
          //   .replace(/[\r\n]/g, '')
          //   .replace(/\s/g, '')
          this.listQuery.hostname_list = hostname_lst.join(',')
        }
        this.getList()
        this.dialogSearchVisible = false
      },
      renderline() {
        this.$refs.mychild.render(this.historySearch)
      },
      toggleRowExpansion(row, label) {
        if (label.label == '操作') {
          return
        }
        const $table = this.$refs.refTable
        this.list.map(item => {
          $table.toggleRowExpansion(item, false)
        })
        if (this.expands.id == row.id) {
          $table.toggleRowExpansion(row, false)
          this.expands = ''
        } else {
          if (row.resource_type == 4) {
            fetchVmList(row.id)
              .then(response => {
                row.expandinfo = response
                row.expandinfo.ip_manage = row.ip_manage
                if (response.detail) {
                  this.$message({
                    message: '数据不存在！',
                  })
                } else {
                  $table.toggleRowExpansion(row)
                  this.expands = row
                }
              })
              .catch(error => {
                this.$message({
                  message: '数据不存在！',
                })
              })
          } else if (row.resource_type == 7) {
            fetchVmEcsList(row.id).then(response => {
              row.expandinfo = response
              // row.expandinfo.ip_manage = row.ip_manage
              if (response.detail) {
                this.$message({
                  message: '数据不存在！',
                })
              } else {
                $table.toggleRowExpansion(row)
                this.expands = row
              }
            }).catch(error => {
              this.$message({ message: '数据不存在！' })
            })
          } else {
            fetchPyList(row.id)
              .then(response => {
                row.expandinfo = response
                row.expandinfo.ip_manage = row.ip_manage
                if (response.detail) {
                  this.$message({
                    message: '数据不存在！',
                  })
                } else {
                  $table.toggleRowExpansion(row)
                  this.expands = row
                }
              })
              .catch(error => {
                this.$message({
                  message: '数据不存在！',
                })
              })
          }
        }
      },

      // remoteSearchMethod(query) {
      //   if (query !== '') {
      //     this.loading = true
      //     setTimeout(() => {
      //       this.loading = false
      //       this.appnameOptionsP = this.appnameOptions.filter(item => {
      //         return (
      //           item.display_name.toLowerCase().indexOf(query.toLowerCase()) > -1
      //         )
      //       })
      //     }, 200)
      //   } else {
      //     this.appnameOptionsP = []
      //     this.listQuery.app_name=query;
      //     this.listQuery.app=undefined
      //   }
      // },

      // getAppList() {    // 过滤用app_name
      //   fetchAppList().then(response => {
      //     let appnameOptions = []
      //     for (let i of response) {
      //       appnameOptions.push({
      //         display_name: i.app_name,
      //         key: i.id,
      //       })
      //     }
      //     this.appnameOptions = appnameOptions
      //   })
      // },

      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleShowHistory(row) {
        this.historySearch = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      dialogOpen() {
        this.resetlistQuery()
        this.activeName = 'ip'
      },
      toggleSelection(status, updatestatus) {
        let list = this.multipleSelection.join()
        this.multipleSelection = []
        this.sbutton = true
        this.wbutton = true
        this.xbutton = true
        this.hbutton = true
        this.fbutton = true
        this.bbutton = true
        updatePyList({
          status: status,
          list: list,
        }).then(response => {
          if (response.failed == 0) {
            var type = 'success'
          } else if (response.failed < response.sum) {
            var type = 'warning'
          } else if (response.failed == response.sum) {
            var type = 'error'
          }
          this.$message({
            message:
              response.msg +
              '。\n\r 操作成功：' +
              response.success +
              '条， 操作失败：' +
              response.failed +
              '条， 总数：' +
              response.sum,
            showClose: true,
            type: type,
            duration: 10000,
          })
          this.getList()
          // this.$refs[updatestatus].loading=false
        })
      },
      selectChanges(val) {
        this.multipleSelection = []
        let status = []
        this.multipleSelectionAccountManageId = []
        this.problem_items = []
        for (let i of val) {
          this.multipleSelection.push(i.id)
          status.push(i.status)
          if (i.account_manage_id != '') {
            this.multipleSelectionAccountManageId.push(i.account_manage_id)
          } else {
            this.problem_items.push({ id: i.id, ip: i.ip })
          }
        }
        if (status.length > 0) {
          this.bulkbutton = false
        } else {
          this.bulkbutton = true
        }

        if (status.indexOf(1) != -1) {
          this.wbutton = false
        } else if (status.indexOf(2) != -1) {
          this.xbutton = false
          this.sbutton = false
        } else if (status.indexOf(3) != -1) {
          this.sbutton = false
          this.hbutton = false
        } else if (status.indexOf(4) != -1) {
          this.bbutton = false
          this.fbutton = false
        } else if (status.indexOf(5) != -1) {
          this.bulkdeletebutton = false
        } else {
          this.sbutton = true
          this.wbutton = true
          this.xbutton = true
          this.hbutton = true
          this.fbutton = true
          this.bbutton = true
          this.bulkdeletebutton = true
        }
      },
      showResultMessage(response) {
        let type = 'success';
        if (response.failed == 0) {
          type = 'success'
        } else if (response.failed < response.sum) {
          type = 'warning'
        } else if (response.failed == response.sum) {
          type = 'error'
        }
        let filedips = response.filedips ? response.filedips : ''
        this.$message({
          message:
            response.msg +
            '! 操作成功：' +
            response.success +
            '条， 操作失败：' +
            response.failed +
            '条， 总数：' +
            response.sum +
            '失败IP:' +
            filedips,
          showClose: true,
          type: type,
          duration: 60000,
        });
        this.getList()
      },
      // updateCommon() {
      //   let list = this.multipleSelection.join();
      //   updategPyList({
      //     app_id: this.app_id_log,
      //     list: list,
      //     comments: this.AllocComments
      //   }).then(response => {
      //     this.showResultMessage(response);
      //     this.allocationdialogFormVisible = false
      //   })
      // },
      handleAllocation() {
        this.allocationForm = { app_id: undefined, pool_full_name: undefined, comments: undefined }
        this.allocationdialogFormVisible = true
      },
      updateCommon(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let id_list = this.multipleSelection.join();
            let app_id = ''
            if (this.allocationForm['app_id']) {
              app_id = this.allocationForm['app_id'][3]
            }
            if (app_id) {
              let request_body = { list: id_list, app_id: app_id, pool_full_name: '', comments: '' }
              request_body.pool_full_name = this.allocationForm['pool_full_name']
              request_body.comments = this.allocationForm['comments']
              updategPyList(request_body).then(response => {
                let result = { 'success': response.success, 'failed': response.failed, 'msg': '分配应用', 'sum': response.sum }
                this.showResultMessage(result);
              })
            }
            this.allocationdialogFormVisible = false
          }
        })
      },

      handleAllocation1() {
        // this.allocationForm1 = { app_id: undefined, comments: undefined, userName: [], accountUser: [], expire_time: undefined }
        this.allocationForm1 = {
          app_id: undefined,
          pool_full_name: undefined,
          comments: undefined,
          userName: [],
          accountUser: [],
          expire_time: (new Date()).getTime() + 86400 * 15 * 1000
        },
          this.select = "uuid"
        this.account_select = "uuid"
        this.allocationdialogFormVisible1 = true
      },
      updateCommon1(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let id_list = this.multipleSelection.join()
            let app_id = ''
            if (this.allocationForm1['app_id']) {
              app_id = this.allocationForm1['app_id'][3]
            }
            let userName = this.allocationForm1['userName']
            let accountUser = this.allocationForm1['accountUser']
            let expire_time = this.allocationForm1['expire_time']
            // let expire_time = parseInt(this.allocationForm1['expire_time'] / 1000)
            let am_id_str = this.multipleSelectionAccountManageId.join()

            if (app_id) {
              let request_body = { list: id_list, app_id: app_id, pool_full_name: '', comments: '' }
              request_body.pool_full_name = this.allocationForm1['pool_full_name']
              request_body.comments = this.allocationForm1['comments']
              updategPyList(request_body).then(response => {
                let result = { 'success': response.success, 'failed': response.failed, 'msg': '分配应用', 'sum': response.sum }
                this.showResultMessage(result);
              })
            }

            if (userName.length != 0 && app_id) {
              let user_list = []
              for (let item of userName) {
                user_list.push([this.select, item])
              }
              let app_list = [{ id: app_id }]
              createAppPermission({ "user_list": user_list, "app_list": app_list }).then(response => {
                let result = { 'success': response.success, 'failed': response.failed, 'msg': '分配应用权限', 'sum': response.sum }
                this.showResultMessage(result)
              })
            }

            if (accountUser.length != 0 && expire_time) {
              let request_body = { data: [], selected_rows: [] }
              for (let item of accountUser) {
                request_body.data.push({
                  user: '-' + item,
                  expire_time: expire_time,
                  grant_people: this.name,
                  user_or_group: this.account_select == 'uuid' ? 1 : 2
                })  // 1对应后端添加用户 2添加部门
              }
              for (let id of am_id_str.split(',')) {
                request_body.selected_rows.push({ id: id })
              }
              AccAddGrandPermission(request_body).then(response => {
                let result = { 'success': response.success, 'failed': '', 'msg': '分配账号密码', 'sum': '' }
                this.showResultMessage(result)
              })
            }
            this.allocationdialogFormVisible1 = false
          }
        })
      },

      handleRecycle() {
        this.recycleForm = { pool_full_name: undefined, comments: undefined }
        this.recycledialogFormVisible = true
      },
      updateCommon2(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let id_list = this.multipleSelection.join()
            let pool_full_name = this.recycleForm.pool_full_name
            if (pool_full_name) {
              let request_body = { list: id_list, status: 4, pool_full_name: pool_full_name, comments: '' }
              request_body.comments = this.recycleForm['comments']
              updatePyList(request_body).then(response => {
                let result = response
                this.showResultMessage(result)
              })
            }
            this.recycledialogFormVisible = false
          }
        })
      },

      editFormCommon(row, event) {
        if (!row) {
          return
        }
        if (row.resource_type == 4) {
          fetchVmList(row.id)
            .then(response => {
              row.expandinfo = response
              if (response.detail) {
                this.$message({
                  message: '数据不存在！',
                })
              } else {
                this.editformdict = deepClone(row)
                this.editdialogFormVisible = true
              }
            })
            .catch(error => {
              this.$message({
                message: '数据不存在！',
              })
            })
        } else {
          fetchPyList(row.id)
            .then(response => {
              row.expandinfo = response
              if (response.detail) {
                this.$message({
                  message: '数据不存在！',
                })
              } else {
                this.editdialogFormVisible = true
                this.editformdict = deepClone(row)
              }
            })
            .catch(error => {
              this.$message({
                message: '数据不存在！',
              })
            })
        }
      },
      editformupdate() {
        this.$refs.updateform.update()
        // let child_obj = this.$refs.updateform
        // if (child_obj.aDetail.resource_type == 4) {
        //   child_obj.$refs['updateAppForm'].validate(valid => {
        //     if (valid) {
        //       updateVmbaseInfo(child_obj.aDetail).then(response => {
        //         this.$message({
        //           message: '更新完成',
        //           type: 'success',
        //         })
        //       }).catch(response => {
        //         this.$alert(response, "Error", {
        //           type: "error"
        //         })
        //       });
        //     } else {
        //       this.$message({
        //         message: '更新失败，请检查字段',
        //         type: 'error',
        //       });
        //     }
        //   })
        // } else if (child_obj.aDetail.resource_type in [1,2,3,6]) {
        //   child_obj.aDetail.expandinfo.machineroom_id = child_obj.resource_fr_ma[0];
        //   child_obj.aDetail.expandinfo.rack = child_obj.resource_fr_ma[1];
        //   child_obj.$refs['updateAppForm'].validate((valid) => {
        //     if (valid) {
        //       updatePybaseInfo(child_obj.aDetail).then(response => {
        //         this.$message({
        //           message: '更新完成',
        //           type: 'success',
        //         });
        //       }).catch(response => {
        //         this.$alert(response, "Error", {
        //           type: "error"
        //         })
        //       });
        //     } else {
        //     this.$message({
        //       message: '更新失败，请检查字段',
        //       type: 'error',
        //     });
        //     return false
        //   }
        //   })
        // }
        this.editdialogFormVisible = false;
        // this.editformdict = {};
        setTimeout(() => {
          this.getList()
          this.editformdict = {}  //必须要延时执行,否则子组件的update不执行,原因子组件没数据要提交
        }, 2000)
      },
      handleClose() {
        this.editdialogFormVisible = false
        this.editformdict = {}
      },

      uploadSuccess(response) {
        this.bulkImportFormVisible = false
        createRList(this.tableData)
          .then(response => {
            this.showResultMessage(response)
            this.tableData = []
          })
          .catch(error => {
            this.$message({
              message: '上传异常',
              type: 'error',
            })
          });
        this.fileList = []
      },
      handleCloseBluk() {
        this.bulkImportFormVisible = false
        this.fileList = []
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
      handleSuccess({ results, header }) {
        this.tableData = results
        this.tableHeader = header
      },
      deleteRow(index, rows) {
        rows.splice(index, 1)
      },
      tableRowClassName({ row, rowIndex }) {
        if (Object.keys(row).length < 14) {
          return 'warning-row'
        }
        return ''
      },
      // appChange(e){
      //   if (typeof(e) === 'object') {
      //     this.listQuery.app_name=e['display_name']
      //     this.listQuery.app=e['key']
      //   }else if (typeof(e) === 'string'){
      //     this.listQuery.app_name=e
      //     this.listQuery.app=undefined
      //   }
      // },
      // appClear(){
      //   this.listQuery.app_name=undefined
      //   this.getList()
      // },

      bulkeditformupdate() {
        let selectList = this.multipleSelection.join();
        let bulkupdate = this.bulkeditformdict
        if (JSON.stringify(bulkupdate) == '{}') {
          this.bulkeditdialogFormVisible = false
          return
        }
        bulkupdate['id_list'] = selectList
        bulkUpdate(bulkupdate).then(response => {
          this.showResultMessage(response);
          this.bulkeditdialogFormVisible = false
        })
        this.bulkeditdialogFormVisible = false
        this.bulkeditformdict = {}
      },
      handleClosebulkedit() {
        this.bulkeditdialogFormVisible = false
      },
      // appdata(query){
      //   fetchAppListP(this.listQuery2).then(response => {
      //     this.num=response.count
      //     const appid_list = []
      //     for (const i of response.results) {
      //       appid_list.push({
      //         key: i.id,display_name:i.app_name+'('+i.app_cname+')'
      //       })
      //     }
      //     // 合并为一个数组
      //     this.appnameOptions = this.appnameOptions.concat(appid_list)
      //     if( this.listQuery2.page < this.num/20 )
      //     {
      //       this.listQuery2.page++
      //       this.appdata(this.listQuery2)
      //     }
      //     else
      //     {
      //       this.listQuery2.page = 1
      //     }
      //   })
      // },

      // findapp(select)
      // {
      //   this.disabledPool = false;
      //   const project_name = select[2]
      //   fetchAppList({'project_name':project_name}).then(response => {
      //     // debugger
      //     this.appnameOptionsAlloc = response
      //   })
      // },
      handleDownload(headers) {
        // this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = headers.tHeader;
          const filterVal = headers.filterVal;
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          // setTimeout(() => {
          //   this.downloadLoading = false
          // }, 1000)
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },

      downloadFile(data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        let fileName = `资源管理(导出全部)_${parseTime(new Date())}.xls`;
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      },
      async handleExport(headers) {
        return new Promise((resolve, reject) => {
          let msg = '仅导出资源管理表数据 (多应用表&发布管理表数据不导出)\n 确认导出 ?'
          // let msg = ''
          // if (this.total > 3000) {
          //   msg = '当前有 '+this.total+' 条记录, 数据量过大, 请耐心等待...'
          // } else {
          //   msg = '当前有 '+this.total+' 条记录, 确认导出 ?'
          // }
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.listQuery['header'] = headers.filterVal.join()
            this.listQuery['header_data'] = headers.tHeader.join()

            let queryParams = Object.assign(this.listQuery, { other_page: this.other_page })
            // exportList(this.listQuery).then(response => {
            //   this.downloadFile(response)
            // })
            exportList(queryParams).then(response => {
              let fp = response.fp
              let interval_fun = undefined
              if (fp) {
                interval_fun = setInterval(() => {
                  exportIsready({ 'fp': fp }).then(response => {
                    if (response.status == 1) {
                      exportFile({ 'fp': fp }).then(response => {
                        this.downloadFile(response)
                        interval_fun = clearInterval(interval_fun)
                        this.$message({
                          message: '导出成功! ',
                          type: 'success'
                        })
                        resolve()
                      })
                    } else {
                      this.$message({
                        message: '资源管理-导出全部-后台处理中...',
                        duration: 2500,
                      })
                    }
                  })
                }, 3000)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消导出'
            });
          });
        })
          .catch((e) => {
            console.error(e)
          })
      },

      handleDelete() {
        this.scrapMachine = { is_scrap: [], is_not_scrap: [] }
        getScrapMachine({ ids: this.multipleSelection }).then(response => {
          this.scrapMachine = response
        })
        this.bulkDeleteDialogVisible = true
      },
      onHandleDelete() {
        let lst = []
        for (let item of this.scrapMachine.is_scrap) {
          lst.push(item.id)
        }
        handleDeleteMachine({ ids: lst }).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.bulkDeleteDialogVisible = false
          this.getList()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
        })
        this.bulkDeleteDialogVisible = false
        this.getList()
      },

      selectable(row, index) {
        if (row.app_rm || row.app_rm2) {
          return false
        } else {
          return true
        }
      },
      getTableTooltip(app_rm, app_rm2, change_user_name) {
        if (app_rm) {
          return '发布管理页面数据'
        } else if (app_rm2) {
          return '多应用管理页面数据'
        } else {
          return change_user_name
        }
      },
      getOPBoolean(row) {
        if ('app_rm' in row) {
          return true
        } else if ('app_rm2' in row) {
          return true
        } else {
          return false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>
  .resource_manage .el-table__expand-icon {
    visibility: hidden;
  }

  .resource_manage .el-table__expand-icon_s {
    display: none !important;
  }

  .resource_manage .el-table .warning-row {
    background: #fd8b75;
  }

  .app-search-class {
    max-width: 300px;
  }

  fieldset {
    margin: 0 10px 10px 10px;
    padding: 10px;
    border-color: #DCDFE6;
    border-style: solid;
    border-width: 2px;
    border-radius: 8px;
    line-height: 20px;
    list-style: none;
  }

  /deep/ .tag-line {
    line-height: 1.5;
    height: auto;
    padding-top: 3px;
    padding-bottom: 3px;
  }
</style>