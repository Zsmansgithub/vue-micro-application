<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="project_name">
          <el-select v-model="listQuery.project_name" placeholder="请选择二级部门" filterable clearable class="filter-item"
                     style="width: 162px" @change="changeProject">
            <el-option v-for="item in appOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="pool_full_name">
          <el-input v-model="listQuery.pool_full_name" placeholder="项目编号" style="width: 200px" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="pool_cname">
          <el-input v-model="listQuery.pool_cname" placeholder="项目中文名" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.status" placeholder="项目状态" clearable @change="handleFilter" class="filter-item">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" plain icon="el-icon-plus" type="primary" @click="handleBatchSearch()">新增项目
        </el-button>
        <el-button class="filter-item" plain icon="el-icon-edit" :disabled="disabled1" type="success"
                   @click="dialogEditVisible=true">批量修改
        </el-button>
        <el-button class="filter-item" style="text-align: right" type="primary" plain icon="el-icon-upload"
                   @click="bulkImportVisible=true;tableData=[]">导入
        </el-button>
        <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="handleDownload"
                   :loading="downloadLoading" style="float: right">导出
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="toggleRowExpansion" ref="table"
    >
      <el-table-column type="selection" width="39"></el-table-column>
      <el-table-column label="二级部门/附属部门" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.project_names }}</span>
          <div v-for="item in scope.row.attach_name">
            <div style="color: #8492a6; font-size: 10px">{{item}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="项目编号/名称" min-width="250" >
        <template slot-scope="scope">
          <span>{{ scope.row.pool_full_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.pool_cname}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1" size="medium">进行中</el-tag>
          <el-tag v-else-if="scope.row.status===2" type="danger" size="medium">已结项</el-tag>
          <el-tag v-else type="warning" size="medium">已归档</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="项目经理/PMO" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.new_manager }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.new_manage_user}}</div>
        </template>
      </el-table-column>
      <el-table-column label="项目资源" width="230">
        <template slot-scope="scope">
          <pool-collapse @toMallInfo="toMallInfo" :app_name="scope.row.app_name"/>
          <!-- <el-collapse accordion>
            <el-collapse-item>
              <template slot="title" style="line-height: 23px!important;">
                <template v-for="(item, idx) in scope.row.app_name">
                  <div>
                    <a style="color: #1890ff" @click="toMallInfo(item.id,item.name)" v-show="[0, 1,2,3,4].includes(idx)"
                      :key="idx">{{item.name}}</a>
                  </div>
                </template>
              </template>
              <template v-for="(item, idx) in scope.row.app_name">
                <div>
                  <a style="color: #1890ff" @click="toMallInfo(item.id,item.name)" v-show="![0, 1,2,3,4].includes(idx)"
                    :key="idx">{{item.name}}</a>
                </div>
              </template>
            </el-collapse-item>
          </el-collapse> -->
        </template>
      </el-table-column>
      <el-table-column label="预算/实际资源" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.people_usage+'台/'+scope.row.resource_usage+'万元'}}</span>
          <div><a style="color: #1c22ff; font-size: 10px" @click="send_app(scope.row.app_name,scope.row.pool_cname)">{{scope.row.ip_total+'台/'+scope.row.actual_resource_usage+'万元'}}</a></div>
        </template>
      </el-table-column>
<!--      <el-table-column label="预算/实际投入" width="110">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{scope.row.resource_usage}}</span>-->
<!--          <div style="color: #8492a6; font-size: 10px">{{scope.row.actual_resource_usage}}</div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="更新时间/备注">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.comments}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain circle @click="handleBatchEdit(scope.row);"/>
          <el-button type="danger" icon="el-icon-delete" plain circle
                     @click="handleBatchDelete(scope.row);"></el-button>
        </template>
      </el-table-column>

      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-row>
<!--              <el-col :md="24" :lg="8" :xl="8">-->
<!--                <el-form-item label="资源预算投入:">-->
<!--                  <span>{{props.row.resource_usage+'万元'}}</span>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :md="24" :lg="8" :xl="8">-->
<!--                <el-form-item label="资源实际投入:">-->
<!--                  <span>{{props.row.actual_resource_usage+'万元'}}</span>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="资源差额:">
                  <span>{{ props.row.actual_resource_usage-props.row.resource_usage+'万元'}}</span>
                </el-form-item>
              </el-col>
              <!--              <el-col :md="24" :lg="8" :xl="8">-->
              <!--                <el-form-item label="人员预算投入:">-->
              <!--                  <span>{{ props.row.people_usage+'万元'}}</span>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <!--              <el-col :md="24" :lg="8" :xl="8">-->
              <!--                <el-form-item label="人员实际投入:">-->
              <!--                  <span>{{ props.row.actual_people_usage+'万元'}}</span>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <!--              <el-col :md="24" :lg="8" :xl="8">-->
              <!--                <el-form-item label="人员差额:">-->
              <!--                  <span>{{ props.row.actual_people_usage- props.row.people_usage+'万元'}}</span>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="JIRA文档链接:">
                  <span>{{ props.row.doc_url }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="项目描述:">
                  <span>{{ props.row.pool_description }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="变更人:">
                  <span>{{ props.row.change_user }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="项目文档:">
                  <div v-for="item in props.row.new_url">
                    <a style="color: #1890ff" :href="'/cmdb/pool_config_download/pmo_doc/'+item">{{item}}</a>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :pageSizes.sync="pageSizes"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="添加项目详情" :visible.sync="dialogSearchVisible" style="text-align: left;" width="50%"
               @open="dialogOpen" @close="handleClose" :close-on-click-modal="false">
      <el-form ref="poolForm" :model="poolForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="二级部门" min-width="100" prop="project_name">
              <el-select v-model="poolForm.project_name" placeholder="请选择二级部门" filterable clearable class="filter-item"
                         style="width: 100%">
                <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="项目编号" min-width="100" prop="pool_full_name">
              <el-input v-model.trim="poolForm.pool_full_name" type="text" placeholder="项目编号需唯一" auto-complete="off"
                        style="width: 100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="项目中文名" min-width="100" prop="pool_cname">
              <el-input v-model.trim="poolForm.pool_cname" type="text" placeholder="项目中文名" auto-complete="off"
                        style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="状态" min-width="100" prop="status">
              <el-select v-model="poolForm.status" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="项目经理" min-width="100" prop="manager">
              <el-select v-model.trim="poolForm.manager" placeholder="请选择" filterable clearable auto-complete="off"
                         style="width: 100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="PMO" min-width="100" label-width="97px">
              <el-select v-model.trim="poolForm.manage_user" filterable clearable auto-complete="off"
                         style="width: 100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="附属部门" min-width="100">
              <el-select v-model="poolForm.attached_project_name" placeholder="请选择附属部门" filterable clearable multiple
                         class="filter-item"
                         style="width: 100%">
                <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="文档URL">
              <el-input v-model.trim="poolForm.doc_url" style="width: 100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--          <el-col :md="24" :lg="12" :xl="12">-->
          <!--            <el-form-item label="人员投入">-->
          <!--              <el-input-number v-model.trim="poolForm.people_usage" placeholder="单位/万元" :min="0" controls-position="right" style="width: 100%"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="资源投入" min-width="100">
              <el-input-number v-model.trim="poolForm.resource_usage" placeholder="单位/万元" :min="0"
                               controls-position="right" class="filter-item" style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="预算资源数" min-width="100">
              <el-input-number v-model.trim="poolForm.people_usage" :min="0"
                               controls-position="right" class="filter-item" style="width: 100%">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="项目描述内容" min-width="100">
              <el-input v-model="poolForm.pool_description" type="textarea" auto-complete="off" style="width: 100%"/>
            </el-form-item>
          </el-col>
           <el-col :md="24" :lg="12" :xl="12">
            <el-form-item label="备注" min-width="100">
              <el-input v-model="poolForm.comments" type="textarea" auto-complete="off" style="width: 100%"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 0px">
        <el-upload ref="upload" class="upload-demo" action="/dev-api/cmdb/pool_config_doc"
                   :on-success="handleSuccess" :on-error="handleError" style="float: left">
          <el-button size="small" type="primary">上传项目相关文档</el-button>
        </el-upload>
        <el-button @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改项目信息" :visible.sync="dialogFormVisible" style="text-align: left;" width="50%" @open="dialogOpen"
               @close="handleClose">
      <el-form ref="dataForm" :model="poolEdit" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="项目中文名" min-width="100" prop="pool_cname">
            <el-input v-model.trim="poolEdit.pool_cname" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="项目编号" min-width="100" prop="pool_full_name">
            <el-input v-model.trim="poolEdit.pool_full_name" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="项目经理" min-width="100" prop="manager">
            <el-select v-model.trim="poolEdit.manager" type="text" auto-complete="off" filterable clearable
                       style="width: 100%">
              <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="状态" min-width="100" prop="status">
            <el-select v-model="poolEdit.status" placeholder="请选择" style="width: 100%">
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
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="PMO" min-width="100">
            <el-select v-model.trim="poolEdit.manage_user" auto-complete="off" style="width: 100%" filterable clearable>
              <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="预算资源数" min-width="100">
            <el-input-number v-model.trim="poolEdit.people_usage" :min="0"
                             controls-position="right" class="filter-item" style="width: 100%">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="二级部门" min-width="100">
            <el-select v-model="poolEdit.project_name" placeholder="请选择附属部门" filterable
                       class="filter-item"
                       style="width: 100%">
              <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="附属部门" min-width="100">
            <el-select v-model="poolEdit.attached_project_name" placeholder="请选择附属部门" filterable clearable multiple
                       class="filter-item"
                       style="width: 100%">
              <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="资源预算投入" min-width="100">
            <el-input-number v-model.trim="poolEdit.resource_usage" placeholder="单位/万元" :min="0"
                             controls-position="right" class="filter-item" style="width: 100%">
            </el-input-number>
          </el-form-item>
        </el-col>
        <!--        <el-col :md="24" :lg="12" :xl="12">-->
        <!--          <el-form-item label="人员预算投入" min-width="100">-->
        <!--              <el-input-number v-model.trim="poolEdit.people_usage" placeholder="单位/万元" :min="0" controls-position="right" class="filter-item" style="width: 100%">-->
        <!--              </el-input-number>-->
        <!--            </el-form-item>-->
        <!--        </el-col>-->
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="资源实际投入" min-width="100">
            <el-input-number v-model.trim="poolEdit.actual_resource_usage" placeholder="单位/万元" :min="0"
                             controls-position="right" class="filter-item" style="width: 100%">
            </el-input-number>
          </el-form-item>
        </el-col>
        <!--        <el-col :md="24" :lg="12" :xl="12">-->
        <!--          <el-form-item label="人员实际投入" min-width="100">-->
        <!--              <el-input-number v-model.trim="poolEdit.actual_people_usage" placeholder="单位/万元" :min="0" controls-position="right" class="filter-item" style="width: 100%">-->
        <!--              </el-input-number>-->
        <!--            </el-form-item>-->
        <!--        </el-col>-->
        <el-col :md="24" :lg="24" :xl="24">
          <el-form-item label="文档URL" min-width="100">
            <el-input v-model.trim="poolEdit.doc_url" type="text" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="项目描述内容" min-width="100">
            <el-input v-model="poolEdit.pool_description" type="textarea" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12" :xl="12">
          <el-form-item label="备注" min-width="100">
            <el-input v-model="poolEdit.comments" type="textarea" auto-complete="off" style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 28px">
        <el-upload ref="upload" class="upload-demo" action="/dev-api/cmdb/pool_config_doc" multiple
                   :on-success="handleSuccess" :on-error="handleError" style="float: left">
          <el-button size="small" type="primary">上传项目相关文档</el-button>
        </el-upload>
        <el-button @click="editCancel">取 消</el-button>
        <el-button type="primary" @click="editPoolConfig()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改" :visible.sync="dialogEditVisible" style="text-align: left;" width="50%"
               @close="handleClose">
      <el-form ref="batchEdit" :model="batchEdit" label-width="100px" style="padding-right: 30px;">
        <el-form-item label="二级部门" min-width="100">
          <el-select v-model.trim="batchEdit.project" placeholder="请选择二级部门" filterable clearable auto-complete="off"
                     style="width: 100%">
            <el-option v-for="item in appnameOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="项目经理" min-width="100">
          <el-select v-model.trim="batchEdit.manager" placeholder="请选择" filterable clearable auto-complete="off"
                     style="width: 100%">
            <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="PMO" min-width="100">
          <el-select v-model="batchEdit.pmo_user" filterable clearable style="width: 100%">
            <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 28px">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchEditForm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="app_title" :visible.sync="dialogAppVisible" style="text-align: left;" width="50%"
               @close="handleClose">
      <el-table :data="app_data" border show-summary stripe highlight-current-row width="100%">
        <el-table-column label="资源类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            <span>{{scope.row.app_type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU(C)">
          <template slot-scope="scope">
            <span>{{scope.row.cpu}}</span>
          </template>
        </el-table-column>
        <el-table-column label="内存(G)">
          <template slot-scope="scope">
            <span>{{scope.row.mem}}</span>
          </template>
        </el-table-column>
        <el-table-column label="磁盘(G)">
          <template slot-scope="scope">
            <span>{{scope.row.disk}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量(台)" prop="count">
          <template slot-scope="scope">
            <span>{{scope.row.count}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预算(万元)" prop="money">
          <template slot-scope="scope">
            <span>{{scope.row.money}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="app_title" :visible.sync="dialogPoolVisible" style="text-align: left;" width="50%"
               @close="handleClose">
      <el-table :data="app_data" border show-summary stripe highlight-current-row width="100%">
        <el-table-column label="资源类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU(C)">
          <template slot-scope="scope">
            <span>{{scope.row.cpu}}</span>
          </template>
        </el-table-column>
        <el-table-column label="内存(G)">
          <template slot-scope="scope">
            <span>{{scope.row.mem}}</span>
          </template>
        </el-table-column>
        <el-table-column label="磁盘(G)">
          <template slot-scope="scope">
            <span>{{scope.row.disk}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量(台)" prop="count">
          <template slot-scope="scope">
            <span>{{scope.row.count}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预算(万元)" prop="money">
          <template slot-scope="scope">
            <span>{{scope.row.money}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="项目信息导入" :visible.sync="bulkImportVisible" width="85%" :before-close="handleCloseBluk"
               top="50px" :close-on-click-modal="false"
               style=" height: 100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/cmdb/pool_bulk.xlsx">
              <el-button type="text">项目信息（模板下载）</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="14">
          <upload-excel-component :on-success="handleSuccessExcel" :before-upload="beforeUpload" style="width: 100%;"/>
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;"
                :row-class-name="tableRowClassName">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
        <el-table-column label="操作" width="60px" fixed="right" v-if="tableData.length !=0">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="danger" circle
                       @click.native.prevent="deleteRow(scope.$index, tableData)"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bulkImportVisible=false">取 消</el-button>
        <el-button type="primary" @click="uploadSuccess">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    addPool,
    deletePool,
    editPool,
    fetchPoolList,
    fetchProjectList,
    getAppResource,
    importPool,
    sumResource,
    poolValidation,
  } from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import {getUserInfo} from '@/api/zabbix/user_info'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import poolCollapse from './components/pool_collapse.vue';
  import {mapGetters} from 'vuex'

  export default {
    name: 'PoolConfig',
    components: {Pagination, UploadExcelComponent, poolCollapse},
    directives: {waves},
    mixins: [resize],

    data() {
      const pool_validation = (rule, value, callback) => {
        if(value) {
          // callback()
          poolValidation({pool_full_name: value, id: this.poolEdit.id}).then(response => {
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

    return {
      status: [{value: 1, label: '进行中'}, {value: 2, label: '已结项'}, {value: 3, label: '已归档'}],
      listQuery: {
        page: 1,
        limit: 20,
        pool_cname: undefined,
        project_name: undefined,
        pool_full_name: undefined,
        status: undefined
      },
      disabled: false,
      poolForm: {
        pool_cname: '',
        pool_full_name: '',
        status: '',
        comments: '',
        pool_description: '',
        doc_url: '',
        project_name: '',
        manager: '',
        manage_user: '',
        attached_project_name: '',
        resource_usage: '',
        people_usage: '',
        url: '',
        change_user: this.name,
      },
      poolEdit: {
        id: '',
        pool_cname: '',
        pool_full_name: '',
        status: '',
        comments: '',
        pool_description: '',
        doc_url: '',
        project_name: '',
        manager: '',
        manage_user: '',
        attached_project_name: '',
        resource_usage: '',
        people_usage: '',
        url: '',
        actual_resource_usage: '',
        actual_people_usage: '',
        change_user: '',
      },
      batchEdit: {
        pmo_user: '',
        manager: '',
        project: '',
      },
      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },
      list: [],
      total: 0,
      pageSizes: [20, 50, 100, 150],
      listLoading: true,
      dialogFormVisible: false,
      dialogSearchVisible: false,
      dialogEditVisible: false,
      dialogAppVisible: false,
      dialogPoolVisible: false,
      downloadLoading: false,
      bulkImportVisible: false,
      disabled1: true,
      appnameOptions: [],
      appOptions: [],
      multipleSelection: [],
      userInfoOptions: [],
      tableData: [],
      tableHeader: [],
      app_title: '',
      app_data: [],
      rules: {
        project_name: [{required: true, message: '请选择二级部门', trigger: 'blur'}],
        pool_full_name: [{required: true, validator: pool_validation, trigger: 'blur'}],
        pool_cname: [{required: true, message: '请输入项目中文名', trigger: 'blur'}],
        status: [{required: true, message: '请选择状态', trigger: 'blur'}],
        manager: [{required: true, max: 10, message: '请选择项目经理', trigger: 'blur'}],
        manage_user: [{max: 10, message: '请选择PMO对接人', trigger: 'blur'}],
        pool_description: [{max: 30, message: '长度不超过30个字符', trigger: 'blur'}],
        doc_url: [{max: 30, message: '长度不超过30个字符', trigger: 'blur'}],
        comments: [{max: 150, message: '长度不超过150个字符', trigger: 'blur'}],
      }
    }
  },

    created() {
      this.getList()
      this.getProjectList()
      getUserInfo().then(response => {
        this.userInfoOptions = response
      })
    },

    computed: {
      ...mapGetters(['roles', 'name'])
    },

    methods: {
      uploadSuccess() {
        this.bulkImportVisible = false
        importPool(this.tableData).then(response => {
          if (response.error === 0) {
            this.$message({
              title: '结果',
              message: '共计导入数据' + response.total + '条,成功' + response.success + '条',
              type: 'success',
              duration: 3000
            })
          } else {
            this.$message({
              title: '结果',
              message: '共计导入数据' + response.total + '条,失败' + response.error + '条,项目编号有' + response.err_pool.toString(),
              type: 'warning',
              duration: 3000
            })
          }
          this.getList()
          this.tableData = []
        }).catch(error => {
          this.$message({
            message: '上传异常',
            type: 'error',
          })
        });
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
      handleSuccessExcel({results, header}) {
        this.tableData = results
        this.tableHeader = header
      },
      handleCloseBluk() {
        this.bulkImportVisible = false
      },
      send_app(app, name) {
        sumResource({app: app}).then(res => {
          this.app_data = res
        })
        this.app_title = name + '-项目总资源信息'
        this.dialogPoolVisible = true
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['项目编号', '项目名称', '状态', '资源预算投入(万元)', '资源实际投入(万元)', '二级部门', '附属部门', 'PMO', '项目经理', '资源数', 'JIRA文档链接', '项目描述', '备注']
          const filterVal = ['pool_full_name', 'pool_cname', 'status', 'resource_usage', 'actual_resource_usage', 'project_names', 'attached_project_name', 'new_manage_user', 'new_manager', 'ip_total', 'doc_url', 'pool_description', 'comments']
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
          if (j === 'status') {
            return this.status_fun(v[j])
          } else {
            return v[j]
          }
        }))
      },
      status_fun(val) {
        if (val === 1) {
          return val = '进行中'
        } else if (val === 2) {
          return val = '已结项'
        } else {
          return val = '已归档'
        }
      },
      handleError(err, file, fileList) {
        this.$message({
          title: '失败',
          message: '上传包不能超过1GB',
          type: 'error',
          duration: 2000
        })
      },
      handleSuccess(response, file, fileList) {
        if (this.poolForm.url === null) {
          this.poolForm.url = ''
        }
        if (this.poolEdit.url === null) {
          this.poolEdit.url = ''
        }
        this.poolForm.url = this.poolForm.url + ',' + response.file_name
        this.poolEdit.url = this.poolEdit.url + ',' + response.file_name
      },
      batchEditForm() {
        let temp = [...this.multipleSelection]
        for (const i of temp) {
          if (this.batchEdit.project) {
            i.project_name = this.batchEdit.project
          }
          if (this.batchEdit.pmo_user) {
            i.manage_user = this.batchEdit.pmo_user
          }
          if (this.batchEdit.manager) {
            i.manager = this.batchEdit.manager
          }
          editPool(i.id, i).then(res => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          }).catch(response => {
            this.$msgbox({
              title: '消息',
              message: response.re.message,
            })
          })
          this.dialogEditVisible = false
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.disabled1 = !(val.length > 0)
      },
      toMallInfo(id, name) {
        getAppResource({id: id}).then(res => {
          this.app_data = res.data
          this.app_title = name + '-资源信息'
          this.dialogAppVisible = true
        })
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      handleBatchSearch() {
        this.dialogSearchVisible = true
      },
      confirm() {
        this.$refs.poolForm.validate(valid => {
          if (valid) {
            this.poolForm.attached_project_name = this.poolForm.attached_project_name.toString()
            addPool(this.poolForm).then(response => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
            }).catch(response => {
              this.$msgbox({
                title: '消息',
                message: response.re.message,
              })
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
      handleBatchEdit(row) {
        let poolEdit = Object.keys(this.poolEdit).reduce((obj, key) => {
          obj[key] = row[key]
          return obj
        }, {});
        poolEdit.attached_project_name = row.attached_project_name ?
          row.attached_project_name.split(',').map(Number)
          : '';
        this.poolEdit = Object.assign({} , this.poolEdit, poolEdit);
        this.dialogFormVisible = true;
      },
      editPoolConfig() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.poolEdit.attached_project_name = this.poolEdit.attached_project_name.toString()
            this.poolEdit.change_user = this.name
            editPool(this.poolEdit.id, this.poolEdit).then(response => {
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
        let msg = '确定删除该项目吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deletePool(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleClose() {
        this.batchEdit = {
          pmo_user: '',
          manager: '',
          project: '',
        }
      },
      getList() {
        this.listLoading = true
        fetchPoolList(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          for (let i of this.list) {
            if (i.url) {
              let val = i.url.split(',')
              let temp = []
              for (var j = 0; j < val.length; j++) {
                if (val[j]!='') {
                  temp.push(val[j].split("/").pop())
                }
              }
              i.new_url = temp
            }
          }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getProjectList() {
        fetchProjectList().then(response => {
          const appnameOptions = []
          for (const i of response) {
            appnameOptions.push({
              display_name: i.unit, key: i.id
            })
          }
          this.appnameOptions = appnameOptions
          this.appOptions = appnameOptions
          let temp = [{display_name: '承诺达产品部', key: 201}]
          this.appOptions = this.appOptions.concat(temp)
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
      changeProject() {
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          pool_cname: undefined,
          project_name: undefined,
          pool_full_name: undefined,
          status: undefined
        }
      },
      dialogOpen() {
        this.$refs.upload.clearFiles();
        this.resetlistQuery()
        this.poolForm = {
          pool_cname: '',
          pool_full_name: '',
          status: '',
          comments: '',
          pool_description: '',
          doc_url: '',
          project_name: '',
          manager: '',
          manage_user: '',
          attached_project_name: '',
          resource_usage: '',
          people_usage: '',
          url: '',
          change_user: this.name,
        }
      },
      toggleRowExpansion(row, label) {
        if (label.label === '操作' || label.label === '预算/实际资源' || label.label === '项目资源') {
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

      editCancel() {
        this.dialogFormVisible=false
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-collapse-item__header {
    display: block;
    height: 125px;
    line-height: 23px !important;
    border-bottom-width: 0 !important;

    .el-collapse-item__arrow {
      display: none;
    }
  }

  /deep/ .el-collapse-item__content,
  /deep/ .el-collapse-item__header {
    transition: background-color .25s ease;

  }

  /deep/ .el-table__body tr:nth-child(2n) > td .el-collapse-item__header,
  /deep/ .el-table__body tr:nth-child(2n) > td .el-collapse-item__content {
    background-color: #FAFAFA !important;
  }

  /deep/ .el-table__body tr:hover > td .el-collapse-item__header,
  /deep/ .el-table__body tr:hover > td .el-collapse-item__content {
    background-color: #F5F7FA !important;
  }

  /deep/ .el-collapse {
    border-top-width: 0;
    border-bottom-width: 0;
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
</style>
