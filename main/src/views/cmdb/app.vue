<template>
  <div class="app-container">
    <!-- <div class="filter-container"> -->
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item >
          <!-- <el-cascader expand-trigger="hover" :options="projectAppOptions" v-model="listQuery.cascader_list"
                       change-on-select clearable filterable style="width:450px;" placeholder="请选择产品线或应用名"
                       @blur="handleFilter"></el-cascader> -->
          <el-cascader
            :options="projectAppOptions"
            v-model="listQuery.cascader_list"
            filterable
            clearable
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
            placeholder="请选择产品线或应用名"
            @change="handleFilter"
            style="width:300px;">
          </el-cascader>
        </el-form-item>
        <!-- <el-form-item>
          <el-input v-model="listQuery.app_cname_i" placeholder="应用名" @keyup.enter.native="handleFilter" clearable class="filter-item"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-select v-model="listQuery.status" placeholder="状态" clearable @change="handleFilter" class="filter-item" style="width:100px;">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.owner_name" placeholder="负责人" filterable clearable @change="handleFilter" style="width:180px;">
            <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.host_total" placeholder="主机数" filterable clearable @change="handleFilter" style="width:100px;">
            <el-option v-for="item in hostTotalOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable style="width:180px;"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button v-if="adminrole" type="primary" icon="el-icon-plus" @click="insertFormCommon">新增应用</el-button>
        <el-button v-if="adminrole" type="primary" @click="bulkImportFormVisible=true;tableData=[]">批量添加</el-button>
        <el-button v-if="adminrole" type="primary" :disabled="bulkButton" icon="el-icon-edit" @click="bulkEditDialogVisible=true">批量修改</el-button>
        <el-form-item class="fr" style="margin-right:-2px;">
          <!-- <el-button class="filter-item" :loading="downloadLoading" plain type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button> -->
           <el-button 
            class="filter-item" 
            type="primary" 
            plain 
            icon="el-icon-download" 
            @click="downloadXLSX = true" 
            :loading="downloadLoading" 
          >导出</el-button>
        </el-form-item>
      </el-form>
    <!-- </div> -->

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="ID" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.status_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品线:模块-子模块/(组织-板块)" width="300px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.pd_fullname }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.pool_cname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="应用名/应用中文名" width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="rowNameFilter(scope.row.pd_fullname2, scope.row.id)">
            {{ scope.row.app_name }}
          </a>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.app_cname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="应用类型/开发语言" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.app_type }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.app_lang }}</div>
        </template>
      </el-table-column>
      <el-table-column label="包类型/高可用" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.package_type }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.is_available_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开发框架/应用级别" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.app_arch }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.app_level }}</div>
        </template>
      </el-table-column>
      <el-table-column label="负责/维护人" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.owner_name }}</span>
          <!-- <div style="color: #8492a6; font-size: 10px" v-html="uuid2user2(scope.row.maintain_user)"></div> -->
          <div style="color: #8492a6; font-size: 10px"><span v-for="(site,index) in scope.row.maintain_user_name" :key="index">{{ site }} </span></div>
        </template>
      </el-table-column>
      <el-table-column label="运维人员/是否集成发布/包名" show-overflow-tooltip width="130px">
        <template slot-scope="scope">
          <span v-for="(site,index) in scope.row.ops_user_name" :key="index">{{ site }} </span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.is_integration_name }} {{ scope.row.package_name }} </div>
        </template>
      </el-table-column>
      <el-table-column label="产品线仓库名/编译配置路径" show-overflow-tooltip width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.git_name }}</span>
          <div style="color: #8492a6;font-size:10px">{{ scope.row.build_path }}</div>
        </template>
      </el-table-column>
      <el-table-column label="健康检查URL/功能简介" min-width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <a style="color: #1890ff" target="_blank" :href="scope.row.address">{{ scope.row.address }}</a>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.app_descrip }}</div>
        </template>
      </el-table-column>
      <el-table-column label="主机总数" prop="host_total" sortable width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.host_total_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接入星图监控/未接入原因" min-width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.is_switch_on_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.xt_comments }}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注/更新时间" min-width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" fixed="right" align="center">
        <template slot-scope="props">
          <el-button icon="el-icon-edit" type="primary" circle @click="editFormCommon(props.row, $event)" />
          <el-tooltip placement="top" content="复制新增应用" effect="light">
            <button v-if="adminrole" type="button" class="el-button el-button--primary el-button--medium is-circle"
                    @click="copyFormCommon(props.row, $event)"><i class="el-icon-plus"></i></button>
          </el-tooltip>
          <el-button v-if="deleterole" icon="el-icon-delete" type="danger" circle @click="deleteFormCommon(props.row.id, $event)" />
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

    <el-dialog :title="apptitle" :visible.sync="dialogEditAppVisible" :before-close="handleClose" :close-on-click-modal="false" width="900px">
      <div style="padding-left: 4%">
        <el-form ref="editAppForm" :model="editAppForm" :rules="rules" class="editAppForm" :inline="true" label-width="120px" style="width:100%">
          <el-row>
            <el-col :span="12">
              <el-form-item label="应用名" prop="app_name">
                <el-input v-model.trim="editAppForm.app_name" :disabled="apptitle=='修改配置' && !adminrole" style="width: 245px;" maxlength="50" class="input-with-select">
                  <el-select v-model="editAppForm.package_type" slot="append" placeholder="包类型" style="width: 90px">
                    <el-option v-for="item in packageTypeOption" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用中文名" prop="app_cname">
                <el-input v-model.trim="editAppForm.app_cname" :disabled="apptitle=='修改配置' && !adminrole" style="width: 108%;" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="产品线" prop="project_name">
                <!-- <el-cascader expand-trigger="hover" :options="projectOptions" v-model="editAppForm.project_name_list" style="width: 80%;" @change="projectChange"></el-cascader> -->
                <el-cascader
                  expand-trigger="hover"
                  :options="options"
                  v-model="editAppForm.project_name"
                  filterable
                  clearable
                  placeholder="请选择产品线"
                  @change="projectChange"
                  style="width: 80%;">
                </el-cascader>
                <el-button :disabled="apptitle=='修改配置' && !adminrole" type="primary" icon="el-icon-plus" size="small" @click="onOpenProductLine"></el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属项目">
                <el-select v-model="editAppForm.pool_name" placeholder="项目名(如果没有请联系管理员录入)" filterable clearable class="filter-item" :disabled="disabledPool">
                  <el-option v-for="item in poolOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="应用类型" prop="app_type">
                <el-select v-model="editAppForm.app_type" placeholder="应用类型">
                  <el-option v-for="item in appTypeOption" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用等级" prop="app_level">
                <el-select v-model="editAppForm.app_level" placeholder="应用等级">
                  <el-option label="A(影响核心系统应用)" value="A" />
                  <el-option label="B(影响用户体验应用）" value="B" />
                  <el-option label="C(不影响用户使用应用)" value="C" />
                  <el-option label="D(内部应用)" value="D" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="应用负责人" prop="owner">
                <el-select v-model="editAppForm.owner" placeholder="应用负责人" filterable clearable>
                  <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开发维护人" prop="maintain_user">
                <el-select v-model="editAppForm.maintain_user" placeholder="开发维护人" filterable clearable multiple :multiple-limit="3">
                  <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="运维人员" prop="ops_user">
                <el-select v-model="editAppForm.ops_user" placeholder="运维人员" filterable clearable multiple :multiple-limit="3">
                  <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="editAppForm.status" :disabled="apptitle=='修改配置' && !adminrole" placeholder="状态">
                  <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="开发语言">
                <el-select v-model="editAppForm.app_lang" placeholder="开发语言">
                  <el-option v-for="item in langOption" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开发框架">
                <el-select v-model="editAppForm.app_arch" placeholder="开发框架">
                  <el-option label="Struts" value="Struts" />
                  <el-option label="springboot" value="springboot" />
                  <el-option label="springmvc" value="springmvc" />
                  <el-option label="jdbc" value="jdbc" />
                  <el-option label="vue" value="vue" />
                  <el-option label="other" value="other" />
                  <el-option label="null" value="null" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="健康检查URL">
                <el-input v-model.trim="editAppForm.address" style="width: 108%;" maxlength="255">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="高可用">
                <el-select v-model="editAppForm.is_available" placeholder="高可用">
                  <el-option v-for="item in availableOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="集成发布">
                <el-select v-model="editAppForm.is_integration" placeholder="集成发布" clearable>
                  <el-option v-for="item in integrationOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="包名" prop="package_name">
                <el-input v-model="editAppForm.package_name" type="text" style="width:108%;" maxlength="250"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="应用代码仓库">
                <el-input v-model="editAppForm.git_addr" type="text" style="width:108%;" :disabled="gitaddrdisabled"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编译配置路径">
                <el-input v-model="editAppForm.build_path" type="text" style="width:108%;"/>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="星图监控名">
                <el-input v-model="editAppForm.app_name_except" type="text" style="width:108%;"/>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="接入星图监控" prop="is_switch_on">
                <el-select v-model="editAppForm.is_switch_on" placeholder="接入星图监控" clearable>
                  <el-option v-for="item in isSwitchOnOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="不接入原因" prop="xt_comments">
                <el-input v-model="editAppForm.xt_comments" placeholder="不接入星图监控原因" :disabled="editAppForm.is_switch_on==1" type="text" style="width:108%;"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="不接入星图节点">
                <el-select v-model="editAppForm.exclusion_node" :disabled="editAppForm.host_total_name==0" :placeholder="editAppForm.host_total_name==0 ? '无节点可选' : '选择不接入星图的节点'" filterable clearable multiple>
                  <el-option v-for="item in appIPsOption" :key="item.value" :label="item.value" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用描述">
                <label slot="label">&nbsp;&nbsp;应用描述</label>
                <el-input v-model="editAppForm.app_descrip" type="textarea" style="width:115%;" maxlength="150" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="备注信息">
                <label slot="label">&nbsp;&nbsp;备注信息</label>
                <el-input v-model="editAppForm.comments" type="textarea" style="width:115%;" maxlength="150" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-dialog title="新增产品线" :visible.sync="nestedDialogVisibleAdd" width="900px" @close="nestedHandleCloseDialogAdd" append-to-body :close-on-click-modal="false">
        <el-form ref="nestedAddForm" :model="nestedRowAdd" :rules="rules2" label-width="100px" :inline="true" style="width:100%">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织" prop="unit">
              <el-select v-model="nestedRowAdd.unit" placeholder="请选择组织" filterable clearable style="width:121%">
                <el-option v-for="item in unit" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织标识名" prop="unit_alias">
              <el-input v-model.trim="nestedRowAdd.unit_alias" placeholder="请输入组织标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="板块" prop="plate">
              <el-autocomplete
                class="inline-input"
                v-model.trim="nestedRowAdd.plate"
                :fetch-suggestions="querySearch1"
                placeholder="请输入或选择板块"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="板块标识名" prop="plate_alias">
              <el-input v-model.trim="nestedRowAdd.plate_alias" placeholder="请输入板块标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模块" prop="project_name" >
              <el-autocomplete
                class="inline-input"
                v-model.trim="nestedRowAdd.project_name"
                :fetch-suggestions="querySearch2"
                placeholder="请输入或选择模块"
                @select="handleSelect"
                style="width:130%">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块标识名" prop="plate_alias">
              <el-input v-model.trim="nestedRowAdd.project_alias" placeholder="请输入模块标识名" style="width:130%;" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form ref="nestedForm" :model="item" v-for="(item, index) in nestedRowAdd.sn" :key="index" :rules="rules" label-width="90px" :inline="true">
          <div>
            <fieldset>
              <legend>{{ '子模块' + index }}</legend>
              <el-row :gutter="0">
                <el-col :span="11">
                  <el-form-item label="子模块" prop="subsystem_name">
                    <el-autocomplete
                      class="inline-input"
                      v-model="item.subsystem_name"
                      :fetch-suggestions="querySearch3"
                      placeholder="请输入子模块"
                      @select="handleSelect"
                      style="width:100%">
                    </el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="子模块标识名" label-width="110px" prop="subsystem_alias">
                    <el-input v-model.trim="item.subsystem_alias" placeholder="请输入子模块标识名" style="width:100%;" maxlength="64"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button v-if="index===0" :disabled="index===4" type="primary" icon="el-icon-plus" @click="nestedAddKey"></el-button>
                  <el-button v-else type="primary" icon="el-icon-minus" @click.prevent="nestedRemoveKey(item)"></el-button>
                </el-col>
              </el-row>
            </fieldset>
          </div>
        </el-form>

        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-select v-model="nestedRowAdd.owner" placeholder="请选择负责人" filterable clearable style="width:121%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码仓库名称">
              <el-input v-model="nestedRowAdd.git_name" type="text" placeholder="请输入代码仓库名称" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="代码仓库地址">
              <el-input v-model="nestedRowAdd.git_addr" type="text" placeholder="请输入代码仓库地址" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码仓库描述">
              <el-input v-model="nestedRowAdd.git_description" type="text" placeholder="请输入代码仓库描述" style="width:130%" maxlength="150"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status" >
              <el-select v-model="nestedRowAdd.status" placeholder="请选择状态" style="width:121%">
                <el-option v-for="(item,index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="status" >
              <el-input v-model.trim="nestedRowAdd.comments" type="text" placeholder="请输入备注" auto-complete="off" style="width:130%"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="nestedHandleCloseDialogAdd">取 消</el-button>
          <el-button type="primary" @click="nestedAddRowInf('nestedAddForm', nestedRowAdd)">确 定</el-button>
        </span>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" v-if="dialogCreateAppVisible" @click="submitForm('editAppForm', 2)">确定</el-button>
        <el-button type="primary" v-else @click="submitForm('editAppForm', 1)">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量导入" :visible.sync="bulkImportFormVisible" width="85%" :before-close="handleCloseBulk" top="50px" :close-on-click-modal="false" style=" height: 100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/cmdb/应用批量模板.xlsx">
              <el-button type="text">应用管理（模板下载）</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="14">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="width: 100%;" />
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;" :row-class-name="tableRowClassName" >
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        <el-table-column label="操作" width="60px" fixed="right" v-if="tableData.length !=0">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="primary" circle @click.native.prevent="deleteRow(scope.$index, tableData)" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="bulkImportFormVisible=false">取 消</el-button> -->
        <el-button @click="handleCloseBulk">取 消</el-button>
        <el-button type="primary" @click="uploadSuccess">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改" :visible.sync="bulkEditDialogVisible" width="500px" @close="handleCloseBulkEdit" :close-on-click-modal="false">
      <el-form ref="poolForm" :model="bulkEditForm" label-width="90px">
        <el-form-item label="负责人">
          <el-select v-model="bulkEditForm.owner" placeholder="应用负责人" filterable clearable style="width:90%;">
            <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="维护人">
          <el-select v-model="bulkEditForm.maintain_user" placeholder="开发维护人" filterable clearable multiple :multiple-limit="3" style="width:90%">
            <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="bulkEditForm.status" placeholder="状态" filterable clearable style="width:90%;">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBulkEdit">取 消</el-button>
        <el-button type="primary" @click="onHandleBulkEdit()">确 定</el-button>
      </div>
    </el-dialog>

    <download-header :checks="checks" :visible.sync="downloadXLSX" :onDownLoad="handleDownload" :onExport="handleExport"/>
  </div>
</template>

<script>
import {fetchAppListP, fetchProjectList, fetchProjectCList} from '@/api/cmdb'
import {
  fetchPoolInfo,
  fetchUserInfo,
  updateApp,
  createApp,
  createRList,
  bulkUpdateApp,
  deleteAppRow,
  getHostTotal,
  exportList,
  appValidation,
  getAppIPs
} from '@/api/cmdbs/app_manage'
import { exportIsready, exportFile } from '@/api/cmdbs/resourcemanage'

import {deepClone, parseTime} from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {mapGetters} from 'vuex'

import { getUserInfo } from '@/api/zabbix/user_info'
import { getProductCascader, getProductAppCascader, getFields, addRow, fetchProjectId, getFieldsAlias, getProjectGitaddr, getProjectname } from '@/api/cmdbs/product_line'
import DownloadHeader from '@/components/DownloadHeader'

const lange = [
  {
    key: 'Java',
    display_name: 'Java',
  },
  {
    key: 'PHP',
    display_name: 'PHP',
  },
  {
    key: 'Python',
    display_name: 'Python',
  },
  {
    key: 'C++',
    display_name: 'C++',
  },
  {
    key: 'JS',
    display_name: 'JS',
  },
  {
    key: 'GO',
    display_name: 'GO',
  },
  {
    key: '.NET',
    display_name: '.NET',
  },
  {
    key: 'Other',
    display_name: 'Other',
  },
]

const appType = [
  {
    key: 'APPWEB',
    display_name: 'APPWEB',
  },
  {
    key: 'APPWAS',
    display_name: 'APPWAS',
  },
  {
    key: 'Tomcat',
    display_name: 'Tomcat',
  },
  {
    key: 'Jar',
    display_name: 'Jar',
  },
  {
    key: 'Job',
    display_name: 'Job',
  },
  {
    key: 'Nginx',
    display_name: 'Nginx',
  },
  {
    key: '.NET',
    display_name: '.NET',
  },
  {
    key: 'RocketMQ',
    display_name: 'RocketMQ',
  },
  {
    key: 'Kafka',
    display_name: 'Kafka',
  },
  {
    key: 'ZK',
    display_name: 'ZK',
  },
  {
    key: 'Dubbo',
    display_name: 'Dubbo',
  },
  {
    key: 'ES',
    display_name: 'ES',
  },
  {
    key: 'File',
    display_name: 'File',
  },
  {
    key: 'MongoDB',
    display_name: 'MongoDB',
  },
  {
    key: 'MySQL',
    display_name: 'MySQL',
  },
  {
    key: 'Oracle',
    display_name: 'Oracle',
  },
  {
    key: 'HotDB',
    display_name: 'HotDB',
  },
  {
    key: 'Redis',
    display_name: 'Redis',
  },
  { key: 'Jboss', display_name: 'Jboss' },
  { key: 'Jetty', display_name: 'Jetty' },
  {
    key: 'Other',
    display_name: 'Other',
  },
]

export default {
  name: 'CMDBApp',
  mixins: [resize, sessionListQuery],
  components: {
    Pagination,
    UploadExcelComponent,
    DownloadHeader
  },
  directives: {
    waves,
  },
  data() {
    const app_validation = (rule, value, callback) => {
      if(value) {
        // callback()
        appValidation({app_name: this.editAppForm.app_name, appid: this.editAppForm.id}).then(response => {
          if (response.status == 400) {
            callback(new Error(response.msg))
          } else if (response.status == 200) {
            callback()
          }
        })
      } else {
        return callback(new Error('应用名不能为空!'))
      }
    }

    const xt_validation = (rule, value, callback) => {
      if(this.editAppForm.is_switch_on == 1) {
        callback()
      } else {
        if(value=='' || value == undefined) {
          return callback(new Error('不支持星图接入原因不能为空!'))
        }
        callback()
      }
    }

    return {
      listQuery: {
        page: 1,
        limit: 20,
        cascader_list: [],
        status: undefined,
        project_name: undefined,
        app_cname_i: undefined,
        search: undefined,
        owner_name: undefined,
        id: undefined,
        host_total: undefined,
      },

      // cascader_list: [],
      options: [],
      projectAppOptions: [],
      hostTotalOptions: [],

      langOption: lange,
      appTypeOption: appType,
      packageTypeOption: [{ label: 'Jar', value: 'Jar'}, { label: 'War', value: 'War' }, { label: '无', value: '' }],
      availableOption: [{ label: '是', value: 1}, { label: '否', value: 0}],
      integrationOption: [{ label: '是', value: 1}, { label: '否', value: 0}],
      statusOption: [{label: '监控', value: 0}, {label: '启用', value:1}, {label: '禁用', value: 2}, {label: '待确认', value: 10}],
      isSwitchOnOption: [{label: '是', value: 1}, {label: '否', value: 0}],
      appIPsOption: [],
      userInfoOptions: [],

      editAppForm: {
        id: '',  // 用于app_validation, app_name校验
        app_name: '',
        package_type: '无',
        app_type: '',
        // project_name_list: [],
        project_name: [],
        pool_name: '',
        app_level: '',
        app_lang: '',
        app_arch: '',
        address: '',
        owner: undefined,
        ops_user: [],
        maintain_user: [],
        is_available: 1,
        app_descrip: '',
        comments: '',
        change_user: this.name,
        app_cname: '',
        is_integration: 0,
        package_name: '',
        app_name_except: '',
        status: 1,
        git_addr: '',
        build_path: '',
        is_switch_on: 1,
        xt_comments: '',
        host_total_name: 0,
        exclusion_node: [],
      },

      list: null,
      total: 0,
      listLoading: true,

      dialogCreateAppVisible: false,
      disabledPool: true,
      dialogEditAppVisible: false,

      adminrole: false,
      // gitadminrole: false,  // discard
      deleterole: false,

      // projectOptions: [],
      poolOptionsA: [],
      poolOptions: [],
      userOptions: [],
      userDevOptions: [],
      userOpsOptions: [],

      bulkImportFormVisible: false,
      downloadLoading: false,
      filename: '应用管理-导出',
      autoWidth: true,
      bookType: 'xlsx',

      tableData: [],
      tableHeader: [],
      fileList: [],

      apptitle: '修改配置',
      gitaddrdisabled: false,

      project_parent_id: {},

      app_level_values: {'A':'A','B':'B','C':'C','D':'D'},

      rules: {
        app_name: [
          {required: true, validator: app_validation, trigger: 'blur'},
          {min: 3, max: 100, message: '长度在 3 到 100 个字符'},
        ],
        app_type: [
          {required: true, message: '请选择应用类型'}
        ],
        project_name: [
          {required: true, message: '请选择产品线'}
        ],
        app_cname: [
          { required: true, message: '请输入应用中文名称' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符' },
        ],
        app_level: [
          { required: true, message: '请选择应用等级'}
        ],
        owner: [
          {required: true, message: '请选择应用负责人'}
        ],
        maintain_user: [
          {required: true, message: '请选择开发维护人'}
        ],
        ops_user: [
          {required: true, message: '请选择运维人员'}
        ],
        status: [
          {required: true, message: '请选择状态'}
        ],
        is_switch_on: [
          {required: true, message: '请选择是否支持星图接入'}
        ],
        xt_comments: [
          {required: true, validator: xt_validation, trigger: 'blur'},
        ],
        package_name: [
          {required: true, message: '请输入包名'}
        ],
        // project_name_list: [
        //     { type: 'array', required: true, message: '请选择一个项目', trigger: 'change' }
        //   ],
      },

      nestedRowAdd: {
        unit: '',
        unit_alias: '',
        plate: '',
        plate_alias: '',
        project_name: '',
        project_alias: '',
        sn: [{subsystem_name: '', subsystem_alias: ''}],
        owner: undefined,
        git_name: '',
        git_addr: '',
        git_description: '',
        status: 0,
        change_user: this.name,
        comments: ''
      },

      nestedDialogVisibleAdd: false,
      rules2: {
        unit: [
          { required: true, message: '请输入组织', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        unit_alias: [
          { required: true, message: '请输入组织标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        plate: [
          { required: true, message: '请输入板块', trigger: 'change'},
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        plate_alias: [
          { required: true, message: '请输入板块标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        project_name: [
          { required: true, message: '请输入模块', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        project_alias: [
          { required: true, message: '请输入模块标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        subsystem_name: [
          { required: true, message: '请输入子模块', trigger: 'change'},
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
        subsystem_alias: [
          { required: true, message: '请输入子模块标识名', trigger: 'change' },
          { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
        ],
      },

      status: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],

      fileds_obj: {},
      fields_alias: {},
      unit: [],
      plate: [],
      project_name: [],
      subsystem_name: [],

      multipleSelection: [],
      bulkButton: true,
      bulkEditDialogVisible: false,
      bulkEditForm: {id_list: undefined, owner: undefined, maintain_user: [], status: undefined},

      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },

      checks: {
        checkList: ['id', 'pd_fullname', 'p_unit', 'p_plate', 'p_project_name', 'p_subsystem_name', 'pool_cname',
        'app_name', 'app_descrip', 'app_type', 'app_lang', 'package_type', 'is_available_name', 'is_integration_name',
        'app_arch', 'app_level', 'owner_name', 'maintain_user_name', 'ops_user_name', 'address', 'git_addr', 'build_path',
        'comments', 'update_time'],
        list: [
          {key: 'id', label: 'ID'},
          {key: 'pd_fullname', label: '产品线'},
          {key: 'p_unit', label: '产品线(组织)'},
          {key: 'p_plate', label: '产品线(板块)'},
          {key: 'p_project_name', label: '产品线(模块)'},
          {key: 'p_subsystem_name', label: '产品线(子模块)'},
          {key: 'pool_cname', label: '项目'},
          {key: 'app_name', label: '应用名'},
          {key: 'app_descrip', label: '功能简介'},
          {key: 'app_type', label: '应用类型'},
          {key: 'app_lang', label: '开发语言'},
          {key: 'package_type', label: '包类型'},
          {key: 'is_available_name', label: '高可用'},
          {key: 'is_integration_name', label: '系统集成'},
          {key: 'app_arch', label: '开发框架'},
          {key: 'app_level', label: '应用级别'},
          {key: 'owner_name', label: '负责人'},
          {key: 'maintain_user_name', label: '维护人'},
          {key: 'ops_user_name', label: '运维人员'},
          {key: 'address', label: '健康检查URL'},
          {key: 'git_addr', label: '代码仓库'},
          {key: 'build_path', label: '编译配置路径'},
          {key: 'comments', label: '备注'},
          {key: 'update_time', label: '更新时间'}
        ],
      },
      downloadXLSX: false,

    }
  },

  created() {
    // get url param: app_cname_i
    if (this.$route.query.app_cname_i) {
      this.listQuery.app_cname_i = this.$route.query.app_cname_i
    }
    if(this.$route.query.cascader_list) {
      this.listQuery.cascader_list = this.$route.query.cascader_list
    }
    if(this.$route.params.owner_name) {
      this.listQuery.owner_name = this.$route.params.owner_name
    }
    if(this.$route.query.id) {
      this.listQuery.id = this.$route.query.id
    }

    this.adminrole = this.roles.includes('cmdb_admin')
    // this.gitadminrole = this.roles.includes('cmdb_app_git')  // discard
    this.deleterole = this.roles.includes('cmdb_app_delete')

    this.getList()

    // this.getAppList()

    fetchPoolInfo().then(response => {
      this.poolOptionsA = response
    })

    // fetchUserInfo('owner').then(response => {
    //   this.userOptions = response
    // })
    // fetchUserInfo('ops_jc').then(response => {
    //   this.userOpsOptions = response
    // })
    // fetchUserInfo('ops').then(response => {
    //   this.userDevOptions = response
    // })

    fetchProjectId().then(response => {
      this.project_parent_id = response
    });

    // fetchProjectCList().then(response => {
    //     this.projectOptions = response
    // });

    getUserInfo().then(response => {
      this.userInfoOptions = response
    })

    this.getCascader()

    getProductAppCascader().then(response => {
      this.projectAppOptions = response
    })

    getHostTotal().then(response => {
      this.hostTotalOptions = response
    })

  },

  watch: {
    'nestedRowAdd.unit': 'getPlate',
    'nestedRowAdd.plate': 'getProjectName',
    'nestedRowAdd.project_name': 'getSubsystemName',
  },

  computed: {
    ...mapGetters(['roles', 'name']),
  },

  filters: {
  },

  methods: {
    handleReset() {
      this.resetlistQuery()
      this.getList()
    },
    getList() {
      this.listLoading = true
      // if(this.cascader_list.length==3) {
      //   this.listQuery.project_name = this.cascader_list[2]
      // }
      fetchAppListP(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      })
    },

    // getAppList() {},

    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.app_name = undefined

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
        cascader_list: [],
        status: undefined,
        project_name: undefined,
        app_cname_i: undefined,
        search: undefined,
        owner_name: undefined,
        id:undefined,
        host_total: undefined
      }
    },

    getCascader() {
      getProductCascader().then(response => {
        this.options = response
      })
    },
    projectChange(cascader_list) {
      if(cascader_list && cascader_list[0]) {
        let unit = cascader_list[0].split('-')[0]
        this.poolOptions = this.poolOptionsA[unit]

        if (this.apptitle == '新增应用') {
          let pid = cascader_list[2]
          let fields_alias = undefined
          getFieldsAlias().then(response => {
            fields_alias = response
          })
          getProjectGitaddr(pid).then(response => {
            this.editAppForm.git_addr = response.git_addr || ''
            if (response.git_addr) {
              this.gitaddrdisabled = true
            } else {
              this.gitaddrdisabled = false
              getProjectname(pid).then(response => {
                // 与工单应用申请一致，若产品线某一级中有"/"或"-"会出问题
                var levelone = response.project.split('/')[0].split('-')[0]
                var leveltwo = response.project.split('/')[0].split('-')[1]
                var levelthree = response.project.split('/')[1]
                var levelfour = response.project.split('/')[2]
                if (fields_alias[1][levelone] && fields_alias[2][leveltwo] && fields_alias[3][levelthree] && fields_alias[4][levelfour]) {
                  this.editAppForm.git_addr = 'https://git.yto.net.cn/' + fields_alias[1][levelone] + '/' + fields_alias[2][leveltwo] + '/' + fields_alias[3][levelthree] + '/' + fields_alias[4][levelfour] + '.git'
                } else {
                  this.editAppForm.git_addr = ''
                }
              })
            }
          })
        }
      }
      if(this.poolOptions) {
        this.disabledPool = false;
        // console.log(this.poolOptions)
      } else {
        this.poolOptions = [];
        this.editAppForm.pool_name = undefined;
        this.disabledPool = true
      }

    },
    editFormCommon(row) {
      this.apptitle = '修改配置';
      this.editAppForm = deepClone(row);
      // const project_parent_id=this.project_parent_id[row.project_cname];
      // this.projectChange([project_parent_id,0]);
      this.editAppForm.project_name = this.project_parent_id[row.project_name]    //array
      this.projectChange(this.editAppForm.project_name)

      if (!row.ops_user) {
        this.editAppForm.ops_user = []
      } else {
        this.editAppForm.ops_user = row.ops_user.split(',')
      }
      if (!row.maintain_user) {
        this.editAppForm.maintain_user = []
      } else {
        this.editAppForm.maintain_user = row.maintain_user.split(',')
      }
      // this.editAppForm.project_name_list = [project_parent_id, this.editAppForm.project_name]
      // this.editAppForm.maintain_user= typeof(row.maintain_user) =='string' ? row.maintain_user.replace(/\'/g,'').replace(/\[/g,'').replace(/\]/g,'').split(",")	:[]
      // this.poolOptions = this.poolOptionsA[row.project_name]

      if (!row.exclustion_node) {
        this.editAppForm.exclusion_node = []
      } else {
        this.editAppForm.exclusion_node = row.exclustion_node.split(',')
      }
      if (row.host_total_name != 0) {
        getAppIPs({appid: row.id}).then(response => {
          this.appIPsOption = response
        })
      }

      this.dialogEditAppVisible = true
    },

    copyFormCommon(row) {
      this.editFormCommon(row);
      this.apptitle = '复制新增应用';
      this.dialogCreateAppVisible = true;
    },
    insertFormCommon() {
      this.apptitle = '新增应用'
      this.editAppForm = {
        app_name: '',
        package_type: '无',
        app_type: '',
        // project_name_list: [],
        project_name: [],
        pool_name: '',
        app_level: '',
        app_lang: '',
        app_arch: '',
        address: '',
        owner: '',
        ops_user: [],
        maintain_user: [],
        is_available: 1,
        app_descrip: '',
        comments: '',
        change_user: this.name,
        app_cname: '',
        is_integration: 0,
        package_name: '',
        app_name_except: '',
        status: 1,
        git_addr: '',
        build_path: '',
        is_switch_on: 1,
        xt_comments: '',
        host_total_name: '',
        exclusion_node: [],
      }
      this.dialogCreateAppVisible = true
      this.dialogEditAppVisible = true
    },

    submitForm(formName, status) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editAppForm.ops_user = this.editAppForm.ops_user.toString();
          this.editAppForm.maintain_user = this.editAppForm.maintain_user.toString();
          // this.editAppForm.project_name = this.editAppForm.project_name_list[1];
          this.editAppForm.project_name = this.editAppForm.project_name[2]
          this.editAppForm.change_user = this.name
          this.editAppForm.exclusion_node = this.editAppForm.exclusion_node.toString();
          let functionss = undefined
          if (status == 1) {
            functionss = updateApp(this.editAppForm.id, this.editAppForm)
          } else {
            functionss = createApp(this.editAppForm)
          }
          functionss.then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
              });
              this.getList();
              this.resetForm(formName)
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
          this.dialogEditAppVisible = false
          this.handleClose()
        } else {
          this.$message({
            message: '请填写必要的字段和内容',
            type: 'warning',
          });
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleCloseBulk() {
      this.bulkImportFormVisible = false;
      this.fileList = [];
      this.tableData=[];
      this.tableHeader=[];
    },
    uploadSuccess(response) {
      this.bulkImportFormVisible = false
      createRList(this.tableData)
        .then(response => {
          this.showResultMessage(response)
        })
        .catch(error => {
          this.$message({
            message: '上传异常',
            type: 'error',
          })
        })
      this.fileList = []
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '最大支持1M的文件！',
        type: 'warning',
      })
      return false
    },
    handleSuccess({results, header}) {
      this.tableData = results
      this.tableHeader = header
      // this.tableData=[];
      // this.tableHeader=[];
      // let obj = {}
      // for(let item of this.userInfoOptions) {
      //   obj[item.value] = item.label
      // }
      // for(const i in results ) {
      //   let res=true
      //   // if (results[i]['产品线名'] in this.project_parent_id) {
      //     // if (('部门名称' in results[i]) && !(results[i]['部门名称'] in this.project_parent_id) ){
      //     //   res=false
      //     // }
      //     if(!('应用负责人' in results[i]) && !(results[i]['应用负责人'] in obj) && (results[i]['应用负责人'].split(',').length>1)) {
      //       res = false
      //     }
      //     // if (!('所属项目' in results[i]) && !(results[i]['所属项目'] in this.project_parent_id)){
      //     //   res=false
      //     // }
      //     // if (!('应用等级' in results[i]) && !(results[i]['应用等级'].toUpperCase() in this.app_level_values)){
      //     //   res=false
      //     // }
      //   // }
      //   if (res){
      //     this.tableData.push(results[i])
      //   }
      // };
      // this.tableHeader = header
      // // this.tableData = results
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    tableRowClassName({row, rowIndex}) {
      if (Object.keys(row).length < 14) {
        return 'warning-row'
      }
      return ''
    },
    showResultMessage(response) {
      let type = 'success'
      if (response.failed == 0) {
      } else if (response.failed < response.sum) {
        type = 'warning'
      } else if (response.failed == response.sum) {
        type = 'error'
      }
      this.$message({
        message:
          response.msg +
          '! 操作成功：' +
          response.success +
          '条， 操作失败：' +
          response.failed +
          '条， 总数：' +
          response.sum,
        showClose: true,
        type: type,
      })
      this.getList()
    },

    handleClose() {
      this.dialogEditAppVisible = false;
      this.dialogCreateAppVisible = false;
      this.editAppForm = {
        app_name: '',
        package_type: '无',
        app_type: '',
        // project_name_list: [],
        project_name: [],
        pool_name: '',
        app_level: '',
        app_lang: '',
        app_arch: '',
        address: '',
        owner: undefined,
        ops_user: [],
        maintain_user: [],
        is_available: 1,
        app_descrip: '',
        comments: '',
        app_cname: '',
        is_integration: 0,
        package_name: '',
        app_name_except: '',
        status: 1,
        git_addr: '',
        build_path: '',
        is_switch_on: 1,
        xt_comments: '',
        host_total_name: '',
        exclusion_node: [],
      }
      this.appIPsOption = []
    },

    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['ID', '产品线', '产品线(组织)', '产品线(板块)', '产品线(模块)', '产品线(子模块)',  '项目', '应用名', '功能简介', '应用类型', '开发语言', '包类型', '高可用', '系统集成', '开发框架', '应用级别', '负责人', '维护人', '运维人员', '请求地址', '备注', '更新时间']
    //     const filterVal = ['id', 'pd_fullname', 'p_unit', 'p_plate', 'p_project_name', 'p_subsystem_name', 'pool_cname', 'app_name', 'app_descrip', 'app_type', 'app_lang', 'package_type', 'is_available_name', 'is_integration_name', 'app_arch', 'app_level', 'owner_name', 'maintain_user', 'ops_user', 'address', 'comments', 'update_time']
    //     const list = this.list
    //     const data = this.formatJson(filterVal, list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: this.filename,
    //       autoWidth: this.autoWidth,
    //       bookType: this.bookType
    //     })
    //     setTimeout(() => {
    //       this.downloadLoading = false
    //     }, 2000)
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
      let fileName = `应用管理(导出全部)_${parseTime(new Date())}.xls`;
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
      this.$message({
        message: "导出成功",
        type: "success"
      })
    },
    async handleExport(headers) {
      return new Promise((resolve, reject) => {
        let msg = ''
        if (this.total > 3000) {
          msg = '当前有 '+this.total+' 条记录, 数据量过大, 请耐心等待...'
        } else {
          msg = '当前有 '+this.total+' 条记录, 确认导出 ?'
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listQuery['header']=headers.filterVal.join()
          this.listQuery['header_data']=headers.tHeader.join()
          // let queryParams = Object.assign(this.listQuery, {other_page: this.other_page})
          exportList(this.listQuery).then(response => {
            let fp = response.fp
            let interval_fun = undefined
            if(fp) {
              interval_fun = setInterval(() => {
                exportIsready({'fp': fp}).then(response => {
                  if(response.status==1) {
                    exportFile({'fp': fp}).then(response => {
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
                      message: '应用管理-导出全部-后台处理中...',
                    })
                  }
                })
              }, 6000)
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

    // uuid2user(data) {
    //   let res = ''
    //   if(data) {
    //     for (let item of data.split(',')) {
    //       let user = ''
    //       for (let owner of this.userInfoOptions) {
    //         if(owner.value == item) {
    //           user = owner.label + '\n'
    //           res += user
    //         }
    //       }
    //     }
    //     return res.trim(',')
    //   }
    // },
    // uuid2user2(data) {
    //   let res = ''
    //   if(data) {
    //     for (let item of data.split(',')) {
    //       let user = ''
    //       for (let owner of this.userInfoOptions) {
    //         if(owner.value == item) {
    //           user = owner.label + ','
    //           res += user
    //         }
    //       }
    //     }
    //     return res.replace(/,$/, '')
    //   }
    // },

    onOpenProductLine() {
      this.nestedDialogVisibleAdd=true
      this.nestedGetFieldsInf()
    },
    nestedGetFieldsInf() {
      getFields().then(response => {
        this.fields_obj = response
        let unit = []
        for(let k in response) {
          unit.push({'value': k})
        }
        this.unit = unit
      })
      getFieldsAlias().then(response => {
        this.fields_alias = response
      })
    },
//带输入建议
    querySearch(queryString, cb) {
        var unit = this.unit;
        var results = queryString ? unit.filter(this.createFilter(queryString)) : unit;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    querySearch1(queryString, cb) {
        var plate = this.plate;
        var results = queryString ? plate.filter(this.createFilter(queryString)) : plate;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    querySearch2(queryString, cb) {
        var project_name = this.project_name;
        var results = queryString ? project_name.filter(this.createFilter(queryString)) : project_name;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    querySearch3(queryString, cb) {
        var subsystem_name = this.subsystem_name;
        var results = queryString ? subsystem_name.filter(this.createFilter(queryString)) : subsystem_name;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    createFilter(queryString) {
      return (data) => {
        return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item);
    },
//watch相关
    getPlate(val) {
      try {
        let ua = this.fields_alias[1][val]
        if (ua) {
          this.nestedRowAdd.unit_alias = ua
        }
      } catch(error) {
      }
      let plate = []
      try {
        for(let k in this.fields_obj[val]) {
          plate.push({'value': k})
        }
        this.plate = plate
      } catch(error) {
      }
    },
    getProjectName(val) {
      try {
        let ua = this.fields_alias[2][val]
        if (ua) {
          this.nestedRowAdd.plate_alias = ua
        }
      } catch(error) {
      }
      let projectname = []
      try {
        if(this.nestedRowAdd.unit) {
          for(let k in this.fields_obj[this.nestedRowAdd.unit][val]) {
            projectname.push({'value': k})
          }
        }
        this.project_name = projectname
      } catch(error) {
      }
    },
    getSubsystemName(val) {
      try {
        let ua = this.fields_alias[3][val]
        if (ua) {
          this.nestedRowAdd.project_alias = ua
        }
      } catch(error) {
      }
      let subsystemname = []
      try {
        if(this.nestedRowAdd.unit && this.nestedRowAdd.plate) {
          for(let k in this.fields_obj[this.nestedRowAdd.unit][this.nestedRowAdd.plate][val]) {
            subsystemname.push({'value': k})
          }
        }
        this.subsystem_name = subsystemname
      } catch(error) {
      }
    },
    nestedAddRowInf(formName, rowAdd) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let rowInsertAdd = {
            unit: '',
            unit_alias: '',
            plate: '',
            plate_alias: '',
            project_name: '',
            project_alias: '',
            sn: [],
            owner: undefined,
            git_name: '',
            git_addr: '',
            git_description: '',
            status: 0,
            change_user: this.name,
            comments: ''
          }
          rowInsertAdd.unit = rowAdd.unit
          rowInsertAdd.unit_alias = rowAdd.unit_alias
          rowInsertAdd.plate = rowAdd.plate
          rowInsertAdd.plate_alias = rowAdd.plate_alias
          rowInsertAdd.project_name = rowAdd.project_name
          rowInsertAdd.project_alias = rowAdd.project_alias
          rowInsertAdd.sn = rowAdd.sn
          rowInsertAdd.owner = rowAdd.owner
          rowInsertAdd.git_name = rowAdd.git_name
          rowInsertAdd.git_addr = rowAdd.git_addr
          rowInsertAdd.git_description = rowAdd.git_description
          rowInsertAdd.status = rowAdd.status
          rowInsertAdd.comments = rowAdd.comments
          addRow(rowInsertAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加记录成功',
              type: 'success',
              duration: 3000
            })
            this.nestedDialogVisibleAdd = false
            this.nestedGetFieldsInf()
            this.getCascader()
          }).catch(error => {
            this.nestedDialogVisibleAdd = false
            if (error.response) {
              this.$notify({
                title: error.response.status + ' ' + error.response.data.msg,
                message: error.response.data.detail,
                type: 'error',
                duration: 3000
              })
            }
          })
          this.$refs[formName].resetFields()
        }
      })
    },
    nestedHandleCloseDialogAdd() {
      this.nestedDialogVisibleAdd = false
      this.$refs['nestedAddForm'].resetFields()
      this.nestedRowAdd = {
        unit: '',
        unit_alias: '',
        plate: '',
        plate_alias: '',
        project_name: '',
        project_alias: '',
        sn: [{subsystem_name: '', subsystem_alias: ''}],
        owner: undefined,
        git_name: '',
        git_addr: '',
        git_description: '',
        status: 0,
        change_user: this.name,
        comments: ''
      }
    },
    nestedRemoveKey(item) {
      var index = this.nestedRowAdd.sn.indexOf(item)
      if (index !== -1) {
        this.nestedRowAdd.sn.splice(index, 1)
      }
    },
    nestedAddKey() {
      if(this.nestedRowAdd.sn.length<=4) {
        this.nestedRowAdd.sn.push({subsystem_name: '', subsystem_alias: ''})
      }
    },

    rowProjectFilter(id) {
      this.listQuery = { page: 1, limit: 20, project_name: id }
      this.getList()
    },

    rowNameFilter(pd_fullname2, app_id) {
      // this.listQuery = { page: 1, limit: 20, app_cname_i: name, cascader_list: undefined }
      // this.getList()
      let query_str = pd_fullname2 +'^'+ app_id
      this.$router.push({ name: 'ResourceManage', query: { query: new Date().getTime() },params: { query_str: query_str }})
    },

    handleSelectionChange(val) {
      this.multipleSelection = []
      for(let i of val) {
        this.multipleSelection.push(i.id)
      }
      if(this.multipleSelection.length>0) {
        this.bulkButton = false
      } else {
        this.bulkButton = true
      }
    },
    handleCloseBulkEdit() {
      this.bulkEditDialogVisible = false
      this.bulkEditForm = this.$options.data().bulkEditForm
    },
    onHandleBulkEdit() {
      let data = {id_list: this.multipleSelection.join()}
      if(this.bulkEditForm.owner) {
        data['owner'] = this.bulkEditForm.owner
      }
      if(this.bulkEditForm.maintain_user.length!=0) {
        data['maintain_user'] = this.bulkEditForm.maintain_user.toString()
      }
      if(this.bulkEditForm.status>=0) {
        data['status'] = this.bulkEditForm.status
      }
      bulkUpdateApp(data).then(response=>{
        this.showResultMessage(response);
      })
      this.bulkEditDialogVisible = false
    },

    deleteFormCommon(id) {
      var msg = '确认删除该记录吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteAppRow(id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getList()
        }).catch(error => {
          this.$notify({
            title: error.response.status + ' ' + error.response.data.msg,
            message: error.response.data.detail,
            type: 'error',
            duration: 3000
          })
        })
      })
    },

  }
}
</script>

<style lang="scss" scoped>

.app-search-class {
  max-width: 300px;
}

fieldset {
  margin: 0 32px 10px 55px;
  padding: 10px;
  border-color: #DCDFE6;
  border-style: solid;
  border-width: 2px;
  border-radius: 8px;
  line-height: 20px;
  list-style: none;
}
</style>
