<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="number_name">
          <el-select v-model="listQuery.instant_name" placeholder="数据库项目名" filterable clearable>
            <el-option v-for="item in dbOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="ip">
          <el-select v-model="listQuery.ip" placeholder="数据库IP" filterable clearable style="width: 150px">
            <el-option v-for="item in serveripOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="app_id_s">
          <el-select v-model="listQuery.app_id_s" multiple placeholder="请输入应用名" filterable clearable class="filter-item" style="width: 100%" popper-class="app-search-class">
            <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="listQuery.type" placeholder="数据库类型" style="width:100%" @change="getDbType">
            <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="copy_type">
          <el-select v-model="listQuery.copy_type" placeholder="复制类型" :loading="loading">
            <el-option v-for="item in select4" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" @click="handleBatchSearch()">新增数据库信息</el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" ref="multipleTableAll" :data="list" border stripe highlight-current-row style="width: 100%"
              :row-key="getRowKeys" :expand-row-keys="expands"  @current-change="toggleRowExpansion">
      <el-table-column type="expand">
        <template slot-scope="scope">
            <el-table :data="scope.row.hostList" class="xxxwwww" stripe highlight-current-row border >
              <el-table-column v-if="false" prop="id" label="id" align="center" />
              <el-table-column prop="roles" label="角色" align="center" width="250px" />
              <el-table-column prop="server_ip" label="IP" align="center" width="253px" />
              <el-table-column prop="port" label="端口" align="center" width="253px" />
              <el-table-column prop="version" label="版本" align="center" width="253px" />
              <el-table-column prop="comments" label="备注" align="center" />
              <el-table-column label="操作" width="120px" align="center">
                <template slot-scope="scope1">
                  <el-button type="primary" icon="el-icon-edit" circle @click="handleBatchEdit(scope1.row);" />
                  <el-button type="danger" icon="el-icon-delete" circle @click="handleBatchDelete(scope1.row);" />
                </template>
              </el-table-column>
            </el-table>
        </template>

      </el-table-column>
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库项目名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.instance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" align="center" width="350px">
        <template slot-scope="scope">
          <span>{{ scope.row.app_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复制类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.copy_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库管理员" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.manager }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务器数量" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.hostList.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleBatchEditTable(scope.row);" />
          <el-button type="primary" icon="el-icon-plus" circle @click="handleBatchAddTable(scope.row);" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />

    <el-dialog title="添加数据库信息" :visible.sync="dialogSearchVisible" style="text-align: left;" width="70%" @open="dialogOpen" @close="handleClose">
      <el-form ref="ddForm" :model="dbForm" :rules="rules" label-width="110px" style="padding-right: 30px">
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库项目名" prop="instant_name">
            <el-input v-model.trim="dbForm.instant_name" type="text" auto-complete="off" style="width:100%" />
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库类型" prop="type">
              <el-select v-model="dbForm.type" placeholder="数据库类型" style="width:100%" @change="getDbType">
                <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="复制类型" prop="copy_type">
              <el-select v-model="dbForm.copy_type" placeholder="复制类型" :loading="loading" style="width:100%" @change="getCopyType">
                <el-option v-for="item in select2" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库管理员" prop="manager">
              <el-select v-model="dbForm.manager" multiple placeholder="数据库管理员" style="width:100%">
                <el-option label="谢茂林" value="谢茂林" />
                <el-option label="方伟杰" value="方伟杰" />
                <el-option label="陈川" value="陈川" />
                <el-option label="刘泉" value="刘泉" />
                <el-option label="邓旺" value="邓旺" />
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
        <el-col :md="24" :lg="24" :xl="24">
        <el-form-item label="应用名" prop="app_id">
          <el-select v-model="dbForm.app_id" multiple placeholder="请输入应用名" filterable clearable class="filter-item" style="width: 100%" popper-class="app-search-class">
            <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        </el-col>
        <el-form-item label="端口和IP">
          <el-form-item />
          <el-form-item v-for="(domain, index) in configinfo" :key="index" class="port_ip">
            <fieldset class="filed">
            <el-row>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="角色"  required>
                <el-select v-model="domain.roles" placeholder="角色" style="width: 100%">
                  <el-option label="主库" value="master" />
                  <el-option label="备库" value="slave" />
                  <el-option label="虚拟ip" value="vip" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="IP" required>
                <el-select
                  v-model="domain.ip"
                  placeholder="请选择IP"
                  filterable
                  clearable
                  class="filter-item"
                  style="width: 100%"
                >
                  <el-option v-for="item in serveripOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="操作">
              <el-button-group>
                <el-button v-if="index ==0" type="primary" size="mini" icon="el-icon-plus"   @click="addDomain" />
                <el-button v-if="index !=0" type="primary" size="mini" icon="el-icon-minus"  @click.prevent="removeDomain(domain)" />
                <el-button v-if="index ==0" class="filter-item" size="mini" icon="el-icon" type="primary" @click="handleBatchAdd">批量添加</el-button>
              </el-button-group>
                  </el-form-item>
            </el-col>
              </el-row>
            <el-row>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="端口"  required >
                <el-input-number v-model.trim="domain.port" controls-position="right"  :min="10" :max="65536" style="width: 100%"/>
              </el-form-item>
            </el-col>
              <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="版本"  required>
                <el-select v-model="domain.version" placeholder="请选择版本" filterable clearable style="width: 100%">
                  <el-option v-for="item in select3" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="备注" prop="comments">
                <el-input v-model.trim="domain.comments" type="text" style="width: 100%"/>
              </el-form-item>
            </el-col>
          </el-row>
              </fieldset>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加集群信息" :visible.sync="dialogAddTableVisible" style="text-align: left;" width="70%" @open="dialogOpenCluster" @close="handleClose">
      <el-form ref="dbTableForm" :model="dbTableForm" :rules="rules" label-width="100px" style="padding-right: 30px;">
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库项目名">
            <el-input v-model.trim="dbTableForm.instant_name" disabled type="text" auto-complete="off" style="width:100%" />
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库类型">
              <el-select v-model="dbTableForm.type" disabled placeholder="数据库类型" style="width:100%" @change="getDbType">
                <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="复制类型">
            <el-select v-model="dbTableForm.copy_type" disabled placeholder="复制类型" :loading="loading" style="width:100%" @change="getCopyType">
              <el-option v-for="item in select2" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库管理员" >
              <el-select v-model="dbTableForm.manager" disabled placeholder="数据库管理员" style="width:100%">
                <el-option label="谢茂林" value="谢茂林" />
                <el-option label="方伟杰" value="方伟杰" />
                <el-option label="陈川" value="陈川" />
                <el-option label="刘泉" value="刘泉" />
                <el-option label="邓旺" value="邓旺" />
              </el-select>
            </el-form-item>
          </el-col>
        <el-col :md="24" :lg="24" :xl="24">
        <el-form-item label="应用名" class="app-filter-item">
          <el-select v-model="dbTableForm.app_id" disabled multiple placeholder="请输入应用名" filterable clearable popper-class="app-search-class" style="width:100%">
            <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
          </el-col>
        <el-form-item label="端口和IP">
          <el-form-item />
          <el-form-item v-for="(domain, index) in configinfo" :key="index" class="port_ip">
            <fieldset class="filed">
            <el-row>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="角色" required>
                <el-select v-model="domain.roles" placeholder="角色" style="width:100%">
                  <el-option label="主库" value="master" />
                  <el-option label="备库" value="slave" />
                  <el-option label="虚拟ip" value="vip" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="IP" required>
                <el-select
                  v-model="domain.ip"
                  placeholder="请选择IP"
                  filterable
                  clearable
                  class="filter-item"
                  style="width:100%"
                >
                  <el-option v-for="item in serveripOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="操作">
              <el-button-group>
                <el-button v-if="index ==0" type="primary" size="mini" icon="el-icon-plus" @click="addDomain" />
                <el-button v-if="index !=0" type="primary" size="mini" icon="el-icon-minus" @click.prevent="removeDomain(domain)" />
                <el-button v-if="index ==0" class="filter-item" size="mini" icon="el-icon" type="primary" @click="handleBatchAdd">批量添加</el-button>
              </el-button-group>
                </el-form-item>
            </el-col>
              </el-row>
            <el-row>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="端口" required>
                <el-input-number v-model.trim="domain.port" controls-position="right" style="width:100%" :min="10" :max="65536" />
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="版本"  required>
                <el-select v-model="domain.version" placeholder="请选择版本" filterable clearable style="width:100%">
                  <el-option v-for="item in select3" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="备注" prop="comments" >
                <el-input v-model.trim="domain.comments" type="text" style="width:100%" />
              </el-form-item>
            </el-col>
            </el-row>
              </fieldset>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="dialogAddTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTable()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改数据库信息" :visible.sync="dialogFormTableVisible" style="text-align: left;" width="70%" @open="dialogOpenUpdate" @close="handleClose">
      <el-form ref="dbEdit" :model="dbEdit" :rules="rules" label-width="110px" style="padding-right: 30px;">
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库项目名"  prop="instant_name">
            <el-input v-model.trim="dbEdit.instant_name" type="text" auto-complete="off" style="width:100%" />
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库类型"  prop="type">
              <el-select v-model="dbEdit.type" placeholder="数据库类型" style="width:100%" @change="getDbType">
                <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="复制类型"  prop="copy_type">
            <el-select v-model="dbEdit.copy_type" placeholder="复制类型" :loading="loading" style="width:100%" @change="getCopyType">
              <el-option v-for="item in select2" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="数据库管理员"  prop="manager">
              <el-select v-model="dbEdit.manager" multiple placeholder="数据库管理员" style="width:100%">
                <el-option label="谢茂林" value="谢茂林" />
                <el-option label="方伟杰" value="方伟杰" />
                <el-option label="陈川" value="陈川" />
                <el-option label="刘泉" value="刘泉" />
                <el-option label="邓旺" value="邓旺" />
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
        <el-col :md="24" :lg="24" :xl="24">
        <el-form-item label="应用名"  class="app-filter-item" prop="app_id">
          <el-select v-model="dbEdit.app_id" multiple placeholder="请输入应用名" class="app-filter-item" filterable clearable popper-class="app-search-class" style="width:100%">
            <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" class="app-filter-item" :value="item.key" />
          </el-select>
        </el-form-item>
          </el-col>
        <el-form-item label="端口和IP" class="app-filter-item">
          <el-form-item />
          <el-form-item v-for="(domain, index) in configinfo" :key="index" class="port_ip">
            <fieldset class="filed">
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="角色" required>
                <el-select v-model="domain.roles" placeholder="角色" style="width:100%">
                  <el-option label="主库" value="master" />
                  <el-option label="备库" value="slave" />
                  <el-option label="虚拟ip" value="vip" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="IP" required>
                <el-select v-model="domain.ip" placeholder="请选择IP" filterable clearable class="filter-item" style="width:100%">
                  <el-option v-for="item in serveripOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="端口"  required>
                <el-input-number v-model.trim="domain.port" controls-position="right" style="width:100%" :min="10" :max="65536" />
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="版本"  required>
                <el-select v-model="domain.version" placeholder="请选择版本" filterable style="width:100%">
                  <el-option v-for="item in select3" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="8" :xl="8">
              <el-form-item label="备注" prop="comments" >
                <el-input v-model.trim="domain.comments" type="text" style="width:100%" />
              </el-form-item>
            </el-col>
              </fieldset>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 25px">
        <el-button @click="dialogFormTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDbManage()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改数据库单节点信息" :visible.sync="dialogFormVisible" style="text-align: left;" width="70%" @open="dialogOpenSingle" @close="handleClose">
      <el-form ref="dbSingleEdit" :model="dbSingleEdit" :rules="rules" label-width="100px">
          <el-col :md="24" :lg="24" :xl="24">
            <el-form-item label="数据库项目名" min-width="100">
            <el-input v-model.trim="dbSingleEdit.instant_name" type="text" disabled auto-complete="off" style="width:100%" />
              </el-form-item>
          </el-col>
        <el-form-item label="端口和IP" class="port_ip">
          <el-form-item />
          <fieldset class="filed">
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="角色" prop="roles" required>
              <el-select v-model="dbSingleEdit.roles" placeholder="角色" style="width:100%">
                <el-option label="主库" value="master" />
                <el-option label="备库" value="slave" />
                <el-option label="虚拟ip" value="vip" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="IP" prop="ip"  required>
              <el-select
                v-model="dbSingleEdit.ip"
                placeholder="请选择IP"
                filterable
                clearable
                class="filter-item"
                style="width:100%"
              >
                <el-option v-for="item in serveripOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="端口" prop="port" required>
              <el-input-number v-model.trim="dbSingleEdit.port" controls-position="right" style="width:100%" :min="10" :max="65536" />
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="版本" prop="version"  required>
              <el-select v-model="dbSingleEdit.version" placeholder="请选择版本" filterable style="width:100%">
                <el-option v-for="item in select3" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="备注" prop="comments" >
              <el-input v-model.trim="dbSingleEdit.comments" type="text" style="width:100%" />
            </el-form-item>
          </el-col>
            </fieldset>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSingleDbManage()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog

      title="批量添加"
      :visible.sync="dialogAddVisible"
      :close-on-click-modal="false"
      width="45%"
      @open="Open"
    >
      <template>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="IP和端口相关数据" name="ip">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-input
                    v-model="information"
                    type="textarea"
                    :rows="15"
                    placeholder="请按照以下格式填写:vip 10.1.1.1 5000 1.1.1.1 备注内容 （角色 ip 端口 版本 备注）多组数据采用换行"
                  />
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogAddVisible = false;">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDbList, addDbManager, editDb, deleteDb, fetchAppList } from '@/api/cmdb'
import { addInstance, editInstance, fetchDb } from '@/api/db'
import { getIpList } from '@/api/cmdbs/resourcemanage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  mixins: [resize],
  data() {
    return {
      dbType: [{ value: 'oracle', label: 'oracle' }, { value: 'mysql', label: 'mysql' }, { value: 'postgresql', label: 'postgresql' }, { value: 'mongodb', label: 'mongodb' }],
      copyType: [{ value: 'oracle', label: '异步物理复制' }, { value: 'oracle', label: 'ogg逻辑复制' }, { value: 'oracle', label: '无' },
        { value: 'mysql', label: '异步' }, { value: 'mysql', label: '半同步' }, { value: 'mysql', label: '多源复制' },
        { value: 'mysql', label: '组复制' }, { value: 'mysql', label: '无' },
        { value: 'postgresql', label: '无' }, { value: 'mongodb', label: '无' }],
      versionType: [{ value: 'oracle', label: '11.2.0.3' }, { value: 'oracle', label: '11.2.0.4' }, { value: 'mysql', label: '5.5' },
        { value: 'mysql', label: '5.6' }, { value: 'mysql', label: '5.7' }, { value: 'postgresql', label: '无' }, { value: 'mongodb', label: '无' }],
      select2: [],
      select3: [],
      select4: [{ value: '异步物理复制', label: '异步物理复制' },{ value: 'ogg逻辑复制', label: 'ogg逻辑复制' },{ value: '异步', label: '异步' },
      { value: '半同步', label: '半同步' },{ value: '多源复制', label: '多源复制' },{ value: '组复制', label: '组复制' },],
      loading: false,
      listQuery: {
        page: 1,
        limit: 20,
        instant_name: undefined,
        ip: undefined,
        app_id_s: [],
        type: undefined,
        copy_type: undefined
      },
      dbForm: {
        manager: [],
        copy_type: ''
      },
      dbTableForm: {
        instant_name: '',
        copy_type: '',
        type: '',
        manager: '',
        app_id: '',
        tep_ins: ''
      },
      dbEdit: {
        id: '',
        instant_name: '',
        copy_type: '',
        type: '',
        manager: '',
        app_id: '',
        ins: ''
      },
      dbSingleEdit: {
        id: '',
        instant_name: '',
        ip: '',
        port: '',
        roles: '',
        version: '',
        comments: '',
        tp_isn: ''
      },
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },
      getRowKeys(row) {
        return row.id;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      list: [],
      total: 0,
      listLoading: true,
      activeName: 'ip',
      dialogFormVisible: false,
      dialogSearchVisible: false,
      dialogAddVisible: false,
      dialogAddTableVisible: false,
      dialogFormTableVisible: false,
      timestamp: '',
      dialogStatus: '',
      logOptions: [],
      information: '',
      appnameOptions: [],
      serveripOptions: [],
      dbOptions: [],
      configinfodict: {
        'ip': 11381,
        'port': '3306',
        'roles': 'master',
        'version': '',
        'comments': ''
      },
      configinfo: [{
        'ip': 11381,
        'port': '3306',
        'roles': 'vip',
        'version': '',
        'comments': ''
      }],
      instant_name: undefined,
      rules: {
        instant_name: [{ required: true, message: '请输入数据库项目名', trigger: 'blur' },
        { max: 30, message: '长度不超过30 个字符', trigger: 'blur' }],
        app_id: [{ required: true, message: '请选择应用名', trigger: 'blur' }],
        copy_type: [{ required: true, message: '请选择复制类型', trigger: 'blur' }],
        type: [{ required: true, message: '请选择数据库类型', trigger: 'blur' }],
        manager: [{ required: true, message: '请选择数据库管理员', trigger: 'blur' }],
        roles: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        ip: [{ required: true, message: '请选择ip', trigger: 'blur' }],
        // port: [
        //   { required: true, message: '请输入端口', trigger: 'blur' },
        //   { min: 10, max: 65536, message: '端口最小不能小于10，最大不能大于65536', trigger: 'blur' }
        // ],
        version: [{ required: true, message: '请选择版本', trigger: 'blur' }],
        comments: [{ max: 150, message: '长度不超过150个字符', trigger: 'blur' }]
      }

    }
  },
  created() {
    this.getList()
    this.getAppList()
    this.getIpList()
    this.getInstant()
  },
  methods: {
    toggleRowExpansion(row){
        this.expands = [];
        this.expands.push(row.id);
    },
    getDbType(prov) {
      this.dbForm.copy_type = undefined
      this.dbEdit.copy_type = undefined
      for (const i in this.configinfo) {
        this.configinfo[i].version = undefined
      }
      this.select2 = []
      this.select3 = []
      for (const val in this.copyType) {
        if (prov === this.copyType[val].value) {
          this.select2.push({ label: this.copyType[val].label, value: this.copyType[val].label })
        }
      }
      for (const val in this.versionType) {
        if (prov === this.versionType[val].value) {
          this.select3.push({ label: this.versionType[val].label, value: this.versionType[val].label })
        }
      }
    },
    getCopyType(opt) {},
    addDomain() {
      const configinfo = Object.assign({}, this.configinfodict)
      this.configinfo.push(configinfo)
    },
    removeDomain(item) {
      const index = this.configinfo.indexOf(item)
      if (index !== -1) {
        this.configinfo.splice(index, 1)
      }
    },
    onSubmitDialogButton() {
      if (this.information) {
        const information = this.information.split(/[(\r\n)\r\n]+/)
        for (let i = 0; i < information.length; i++) {
          const temp = information[i].split(" ")
          if (temp[4] == null || temp[4] === '') {
            temp[4] = '无'
          }
          const tmp_dict = {
            'roles': temp[0],
            'ip': temp[1],
            'port': temp[2],
            'version': temp[3],
            'comments': temp[4]
          }
          if (this.configinfo.length === 1 && this.configinfo[0].ip === '') {
            this.configinfo[0] = tmp_dict
          } else {
            this.configinfo.push(tmp_dict)
          }
        }
      }
      this.dialogAddVisible = false
    },
    clearBatchTextSearch() {
      // 清空批量搜索textarea内容
      this.information = undefined
    },
    handleBatchAdd() {
      // 打开批量搜索框
      this.clearBatchTextSearch()
      this.dialogAddVisible = true
    },
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    handleBatchSearch() {
      this.dialogSearchVisible = true
    },
    confirm() {
      this.$refs.ddForm.validate(valid => {
        if (valid) {
          let tmp = {}
          let abcccccc=this.configinfo
          tmp.instant_name = this.dbForm.instant_name
          addInstance(tmp).then(response => {
            let ins_id=response.id
            for (const i in abcccccc) {
              let db_form = {}
              db_form.ip = parseInt(abcccccc[i].ip)
              db_form.manager = String(this.dbForm.manager)
              db_form.copy_type = this.dbForm.copy_type
              db_form.type = this.dbForm.type
              db_form.app_id = String(this.dbForm.app_id)
              db_form.instant_name = ins_id
              db_form.port = abcccccc[i].port
              db_form.roles = abcccccc[i].roles
              db_form.version = abcccccc[i].version
              db_form.comments = abcccccc[i].comments
              addDbManager(db_form).then(response => {
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success',
                  duration: 3000
                })
                this.getList()
              }).catch(err => {
                this.$message({
                  message: err,
                });
              });
          }
        }).catch(error => {
          this.$message({
            message: '该项目名已存在',
            type: 'error'
          })
          console.log(error)
          })
          this.dialogSearchVisible = false
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleBatchAddTable(row) {
      this.dialogAddTableVisible = true
      this.dbTableForm.instant_name = row.instance
      this.dbTableForm.tep_ins = row.instant_name
      this.dbTableForm.copy_type = row.copy_type
      this.dbTableForm.type = row.type
      this.dbTableForm.manager = row.manager
      this.dbTableForm.app_id = row.app_id.split(',').map(x => parseInt(x))
    },
    confirmTable() {
      this.$refs.dbTableForm.validate(valid => {
        if (valid) {
          for (const i in this.configinfo) {
            const db_form = {}
            db_form.ip = this.configinfo[i].ip
            db_form.port = this.configinfo[i].port
            db_form.roles = this.configinfo[i].roles
            db_form.version = this.configinfo[i].version
            db_form.comments = this.configinfo[i].comments
            db_form.manager = this.dbTableForm.manager
            db_form.copy_type = this.dbTableForm.copy_type
            db_form.type = this.dbTableForm.type
            db_form.app_id = String(this.dbTableForm.app_id)
            db_form.instant_name = this.dbTableForm.tep_ins
            addDbManager(db_form).then(response => {
              this.$notify({
                title: '成功',
                message: '添加集群信息成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            })
          }
          this.dialogAddTableVisible = false
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleBatchEditTable(row) {
      this.dialogFormTableVisible = true
      this.dbEdit.id = row.id
      this.dbEdit.instant_name = row.instance
      this.instant_name = row.instance
      this.dbEdit.ins = row.instant_name
      this.dbEdit.manager = [row.manager]
      this.dbEdit.type = row.type
      this.dbEdit.copy_type = row.copy_type
      this.dbEdit.app_id = row.app_id.split(',').map(x => parseInt(x))
      this.configinfo = row.hostList
    },
    editDbManage() {
      this.$refs.dbEdit.validate(valid => {
        if (valid) {
          const tep = {}
          let tp = this.configinfo
          tep.instant_name = this.dbEdit.instant_name
          editInstance(this.instant_name, tep).then(response => {
            for (const i in tp) {
            const db_form = {}
            db_form.ip = tp[i].ip
            db_form.id = tp[i].id
            db_form.port = tp[i].port
            db_form.roles = tp[i].roles
            db_form.version = tp[i].version
            db_form.comments = tp[i].comments
            db_form.manager = String(this.dbEdit.manager)
            db_form.copy_type = this.dbEdit.copy_type
            db_form.type = this.dbEdit.type
            db_form.app_id = String(this.dbEdit.app_id)
            db_form.instant_name = this.dbEdit.ins
            editDb(db_form.id, db_form).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            })
          }
            })
          this.dialogFormTableVisible = false
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleBatchEdit(row) {
      this.dbSingleEdit.id = row.id
      this.dbSingleEdit.instant_name = row.instance
      this.dbSingleEdit.app_id = row.app_id
      this.dbSingleEdit.type = row.type
      this.dbSingleEdit.manager = row.manager
      this.dbSingleEdit.copy_type = row.copy_type
      this.dbSingleEdit.roles = row.roles
      this.dbSingleEdit.comments = row.comments
      this.dbSingleEdit.ip = row.ip
      this.dbSingleEdit.port = row.port
      this.dbSingleEdit.version = row.version
      this.dbSingleEdit.tp_isn = row.instant_name
      this.dialogFormVisible = true
    },
    editSingleDbManage() {
      this.$refs.dbSingleEdit.validate(valid => {
        if (valid) {
          let dbSingle={}
          dbSingle.id=this.dbSingleEdit.id
          dbSingle.instant_name=this.dbSingleEdit.tp_isn
          dbSingle.app_id=this.dbSingleEdit.app_id
          dbSingle.type=this.dbSingleEdit.type
          dbSingle.manager=this.dbSingleEdit.manager
          dbSingle.copy_type=this.dbSingleEdit.copy_type
          dbSingle.roles=this.dbSingleEdit.roles
          dbSingle.comments=this.dbSingleEdit.comments
          dbSingle.ip=this.dbSingleEdit.ip
          dbSingle.port=this.dbSingleEdit.port
          dbSingle.version=this.dbSingleEdit.version
          editDb(dbSingle.id, dbSingle).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          })
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleBatchDelete(row) {
      var msg = '确定删除该数据库节点信息吗?'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteDb(row.id).then(response => {
          this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
          this.getList()
        })
        // deleteInstance(row.instant_name).then(response=>{})
      }, () => {
        return false
      })
    },
    handleClose() {
      this.activeName = null
      this.configinfo = [{
        'ip': '',
        'port': '',
        'roles': '',
        'version': '',
        'comments': ''
      }]
    },
    getList() {
      this.listLoading = true
      this.listQuery.app_id = String(this.listQuery.app_id_s)
      fetchDbList(this.listQuery).then(response => {
        this.list = []
        const results = response.results
        const temp = {}
        for (const i in results) {
          const name = results[i].instant_name
          if (results[i].instant_name in temp) {
            temp[name].hostList.push(results[i])
          } else {
            temp[name] = results[i]
            temp[name].hostList = [results[i]]
          }
        }
        for (const i in temp) {
          this.list.push(temp[i])
        }
        this.total = response.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
    },
    getAppList() {
      fetchAppList().then(response => {
        const appnameOptions = []
        for (const i of response) {
          appnameOptions.push({
            display_name: i.app_cname, key: i.id
          })
        }
        this.appnameOptions = appnameOptions
      })
    },
    getIpList() {
      getIpList().then(response => {
        const serveripOptions = []
        for (const i of response) {
          serveripOptions.push({
            display_name: i.label, key: i.key
          })
        }
        this.serveripOptions = serveripOptions
      })
    },
    getInstant() {
      fetchDb().then(response => {
        const dbOptions = []
        for (const i of response) {
          dbOptions.push({
            display_name: i.instant_name, key: i.id
          })
        }
        this.dbOptions = dbOptions
      })
    },
    handleFilter(listQuery) {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate((valid) => {
        if (valid) {
          this.getList()
        }
      })
    },
    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pool_cname: undefined,
        app_id_s: [],
        ip: undefined,
        type: undefined,
        copy_type: undefined
      }
    },
    dialogOpen() {
      this.resetlistQuery()
      this.activeName = 'ip'
      this.dbForm= {
        manager: [],
        instant_name: '',
        copy_type: '',
        type: '',
        app_id: []
      }
    },
    dialogOpenCluster() {
      this.select3 = []
      if (this.dbTableForm.type === 'mysql') {
        this.select3 = [
          { value: '5.5', label: '5.5' }, { value: '5.6', label: '5.6' }, { value: '5.7', label: '5.7' }
        ]
      } else {
        this.select3 = [
          { value: '11.2.0.3', label: '11.2.0.3' }, { value: '11.2.0.4', label: '11.2.0.4' }
        ]
      }
    },
    dialogOpenUpdate() {
      this.select3 = []
      if (this.dbEdit.type === 'mysql') {
        this.select3 = [
          { value: '5.5', label: '5.5' }, { value: '5.6', label: '5.6' }, { value: '5.7', label: '5.7' }
        ]
      } else {
        this.select3 = [
          { value: '11.2.0.3', label: '11.2.0.3' }, { value: '11.2.0.4', label: '11.2.0.4' }
        ]
      }
    },
    dialogOpenSingle() {
      this.select3 = []
      if (this.dbSingleEdit.type === 'mysql') {
        this.select3 = [
          { value: '5.5', label: '5.5' }, { value: '5.6', label: '5.6' }, { value: '5.7', label: '5.7' }
        ]
      } else {
        this.select3 = [
          { value: '11.2.0.3', label: '11.2.0.3' }, { value: '11.2.0.4', label: '11.2.0.4' }
        ]
      }
    },
    Open() {

    }
  },
}
</script>
<style >

.xxxwwww .el-table__header-wrapper th{
      background: #ecf0f5;
    }


  .app-search-class {
    max-width: 500px;
  }
</style>
<style>
.el-table--border .xxxwwww:after,
.el-table .xxxwwww:before {
    background-color: #A3D3FF;
}
.el-table--border .xxxwwww {border-color: #A3D3FF;}
  .port_ip .el-form-item__content >div{
    margin-bottom: 3px;
  }
  .filed {
    padding-top: 11px;
    border: 1px solid #1890ff;
    margin-bottom: 5px;
  }
</style>
