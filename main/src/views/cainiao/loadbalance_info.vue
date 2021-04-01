<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model.trim="listQuery.name" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                    clearable
                    style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item prop="http">
          <el-select v-model="listQuery.http" @change="handleFilter" clearable placeholder="类型" style="width: 90px">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model.trim="listQuery.status" @change="handleFilter" clearable placeholder="状态"
                     style="width: 90px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.line" @change="handleFilter" clearable placeholder="设备名称"
                     style="width: 200px">
            <el-option v-for="item in lineOptions" :key="item.key" :label="item.label"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="listQuery.opr_time_s"
            class="filter-item"
            :picker-options="pickerOptions2"
            align="right"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFilter"
          />
        </el-form-item>
<!--        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>-->
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" v-if="adminrole" type="primary" @click="addF5" icon="el-icon-plus">新增</el-button>
        <el-button class="filter-item" v-if="adminrole" :disabled="disable1" type="danger" @click="deleteFormCommon" icon="el-icon-delete">
          批量删除
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @selection-change="handleSelection" @row-click="toggleRowExpansion" ref="table">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column label="VSIP" width="140" prop="vserver" sortable>
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="selectVsip(scope.row.id,scope.row.vserver,scope.row.port)">{{ scope.row.vserver }}</a>
        </template>
      </el-table-column>
      <el-table-column label="端口" width="80" prop="port" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VS名称" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="POOLS" width="100" prop="pools" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total_pools }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80" prop="http" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.http }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" prop="status" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='enable'">启用</span>
          <span v-if="scope.row.status==='disable'">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="180px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用描述" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.app }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135px" prop="update_time" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" fixed="right" v-if="adminrole" align="center">
        <template slot-scope="props">
          <el-tooltip class="item" effect="dark" content="修改" placement="left-start">
            <el-button icon="el-icon-edit" type="primary" circle @click="editFormCommon(props.row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="el-icon-delete" type="danger" circle @click="deleteFormSingle(props.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-row>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="域名:">
                  <span>{{props.row.domain}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="会话保持:">
                  <span>{{ props.row.session }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="PROFILES:">
                  <span>{{ props.row.profiles }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="其他配置:">
                  <span>{{ props.row.others }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="规则:">
                  <span v-if="props.row.rule===null||props.row.rule==='无'||props.row.rule===''">无</span>
                  <span v-else>
                    <a style="color: #1890ff" @click="display_detail(props.row)">点击显示规则信息</a>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="源地址转换:">
                  <span>{{ props.row.snat }}</span>
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
      @pagination="getList"
      style="padding-top: 5px;margin-top: 10px;"
    />
    <el-dialog :visible.sync="dialogCreateAppVisible" @close="handleClose" width="65%">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增负载信息</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addAppForm" :model="loadAppForm" :rules="rules" class="editAppForm" label-width="100px"
               style="margin:0 10px 0 -9px;">
        <el-row>
          <div v-for="(domain, index) in configinfo" :key="index" class="port_ip">
            <el-row>
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="VSIP">
                  <el-input v-model="domain.vserver" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="VS名称">
                  <el-input v-model="domain.name" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="8" :xl="8">
                <el-form-item label="操作">
                  <el-button-group>
                    <el-button v-if="index ==0" type="primary" size="mini" icon="el-icon-plus" @click="addDomain"/>
                    <el-button v-if="index !=0" type="primary" size="mini" icon="el-icon-minus"
                               @click.prevent="removeDomain(domain)"/>
                  </el-button-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="端口" prop="port">
              <el-input v-model.trim="loadAppForm.port" controls-position="right" :maxlength="5" type="number"
                        style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model.trim="loadAppForm.status" style="width: 100%;">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="类型" prop="http">
              <el-select v-model.trim="loadAppForm.http" style="width: 100%;">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="域名" prop="domain">
              <el-input v-model.trim="loadAppForm.domain" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="负责人" prop="user">
              <el-input v-model.trim="loadAppForm.user" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="应用描述" prop="app">
              <el-input v-model.trim="loadAppForm.app" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="会话保持" prop="session">
              <el-select v-model.trim="loadAppForm.session" style="width: 100%">
                <el-option v-for="item in sessionOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="PROFILES" prop="profiles">
              <el-input v-model.trim="loadAppForm.profiles" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="源地址转换" prop="snat">
              <el-input v-model.trim="loadAppForm.snat" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="其他配置" prop="others">
              <el-input v-model="loadAppForm.others" type="textarea" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="规则" prop="rule">
              <el-input v-model="loadAppForm.rule" type="textarea" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="loadAppForm.remark" type="textarea" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="24" :xl="24">
            <hr style="border:0;margin-left:19px;margin-top:0px;margin-bottom:20px;border-bottom:1px dashed #E6EBEF;"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="POOL名称" prop="pool_name">
              <el-input v-model.trim="loadAppForm.pool_name" type="textarea" :rows="4"
                        style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="POOL成员" prop="member">
              <el-input v-model="loadAppForm.member" type="textarea" :rows="4"
                        style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="POOL备注" prop="pool_remark">
              <el-input v-model="loadAppForm.pool_remark" type="textarea" :rows="4"
                        style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addAppForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditAppVisible" @close="handleClose" width="65%">
      <div slot="title" style="font-size:16px;color:#FFBA00;padding-top:1px;">修改负载信息</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="editAppForm" :rules="rules" label-width="110px" style="margin:0 10px 0 -9px;">
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="VSIP" prop="vserver">
              <el-input v-model.trim="editAppForm.vserver" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="VS名称" prop="name">
              <el-input v-model.trim="editAppForm.name" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="端口" prop="port">
              <el-input-number v-model.trim="editAppForm.port" controls-position="right" :min="0" :max="65536"
                               style="width: 100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model.trim="editAppForm.status" style="width: 100%;">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="类型" prop="http">
              <el-select v-model.trim="editAppForm.http" style="width: 100%;">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="会话保持" prop="session">
              <el-select v-model.trim="editAppForm.session" style="width: 100%">
                <el-option v-for="item in sessionOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="域名" prop="domain">
              <el-input v-model="editAppForm.domain" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="负责人" prop="user">
              <el-input v-model.trim="editAppForm.user" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="应用描述" prop="app">
              <el-input v-model.trim="editAppForm.app" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="PROFILES" prop="profiles">
              <el-input v-model.trim="editAppForm.profiles" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="源地址转换" prop="snat">
              <el-input v-model.trim="editAppForm.snat" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="POOLS数量" prop="pools">
              <el-input v-model.trim="editAppForm.pools" style="width: 100%;" type="number" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="其他配置" prop="others">
              <el-input v-model="editAppForm.others" style="width: 100%;" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="规则" prop="rule">
              <el-input v-model="editAppForm.rule" style="width: 100%;" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="editAppForm.remark" style="width: 100%;" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogEditAppVisible=false">取 消</el-button>
        <el-button type="primary" @click="editForm()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="e_title" :visible.sync="dialogPoolVisible" width="60%" @close="handleClose">
      <el-form ref="poolQuery" :model="poolQuery" :inline="true">
        <el-form-item prop="searchValue">
          <el-input v-model="searchValue" placeholder="请输入查询条件" @input="poolsearch" class="filter-item" clearable
                    style="width: 350px" ></el-input>
        </el-form-item>
        <el-button class="filter-item" v-if="adminrole" type="primary" @click="downloadLoading=true">新增POOL</el-button>
        <el-button class="filter-item" v-if="adminrole" :disabled="disable2" type="danger" @click="deletePool">批量删除
        </el-button>
      </el-form>
      <el-table v-loading="listLoading" :data="pool_search" @selection-change="handleSelectionChange"
                border stripe highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column label="POOL名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成员">
          <template slot-scope="scope">
            <pre class="pre_class">{{ scope.row.member | row2MultipleRow }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="140" prop="create_time" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="140" prop="update_time" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" v-if="adminrole">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="left-start">
              <el-button icon="el-icon-edit" type="primary" circle @click="editPool(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button icon="el-icon-delete" type="danger" circle @click="deletePoolSingle(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pool_page" :page-sizes="[5,10,20,50]" :page-size="pool_limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="pool_total" style="margin-top: 10px;">
      </el-pagination>
    </el-dialog>
    <el-dialog :visible.sync="downloadLoading" width="40%" @close="dialogAddPool">
      <div slot="title" style="font-size:16px;color:#1890FF;">新增POOL信息</div>
      <hr style="position:absolute;left:0px;width:100%;top:50px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="poolAppForm" :model="poolAppForm" :rules="pool_rules" label-width="110px"
               style="margin:0 20px 0 0;">
        <el-form-item label="POOL名称" prop="name">
          <el-input v-model.trim="poolAppForm.name" placeholder="名称需唯一" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="成员" prop="member">
          <el-input v-model="poolAppForm.member" type="textarea" :autosize="{ minRows: 8}"
                    style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="poolAppForm.remark" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="downloadLoading=false">取 消</el-button>
        <el-button type="primary" @click="addPoolForm()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditPoolForm" width="40%">
      <div slot="title" style="font-size:16px;color:#FFBA00;">修改POOL信息</div>
      <hr style="position:absolute;left:0px;width:100%;top:50px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editPoolForm" :model="editPoolForm" :rules="pool_rules" label-width="110px"
               style="margin:0 20px 0 0;">
        <el-form-item label="POOL名称" prop="name">
          <el-input v-model.trim="editPoolForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="成员" prop="member">
          <el-input v-model="editPoolForm.member" type="textarea" :autosize="{ minRows: 8}"
                    style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="editPoolForm.remark" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogEditPoolForm=false">取 消</el-button>
        <el-button type="primary" @click="edits()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="rule信息" :visible.sync="dialogDetail" width="70%" @close="handleClose">
      <el-form :model="detail">
        <el-form-item>
          <el-input v-model="detail.rule" style="width: 100%" type="textarea" :rows="30" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchLoadBalanceList, addLoadBalanceList, deleteLoadBalanceList, editLoadBalanceList,
    fetchLoadPoolList, addLoadPoolList, editLoadPoolList, deleteLoadPoolList
  } from '@/api/cainiao/loadbalance'
  import {fetchTypeInfo} from '@/api/cainiao/domain'
  import {deepClone} from '@/utils'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {mapGetters} from 'vuex'
  import {validIp} from '@/utils/validate'

  export default {
    name: 'ComplexTable',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
      UploadExcelComponent,
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
        poolQuery: {
          vserverid: undefined,
          name: undefined,
        },
        datas:[],
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          http: undefined,
          status: undefined,
          opr_time_s: undefined,
          line: undefined,
        },
        loadAppForm: {
          status: 'enable',
          http: 'TCP',
          session: '无',
          pools: 0,
          vserver: '',
          name: '',
          port: '',
          snat: '',
          user: '',
          rule: '',
          app: '',
          remark: '',
          domain: '',
          others: '',
          profiles: '',
          member: '',
          pool_name: '',
          pool_remark: ''
        },
        detail: {
          rule: ''
        },
        editAppForm: {
          id: '',
          vserver: '',
          port: '',
          name: '',
          http: '',
          status: '',
          pools: '',
          snat: '',
          user: '',
          rule: '',
          session: '',
          app: '',
          remark: '',
          update_time: '',
          domain: '',
          others: '',
          profiles: ''
        },
        poolAppForm: {
          vserverid: ''
        },
        editPoolForm: {
          id: '',
          vserverid: '',
          name: '',
          member: '',
          remark: ''
        },
        configinfodict: {
          'vserver': '',
          'name': ''
        },
        configinfo: [{
          'vserver': '',
          'name': ''
        }],
        timestamp: '',
        pickerOptions2: {
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
        select: 'A',
        e_title: '',
        list: null,
        pool_list: [],
        pool_list_temp: [],
        temp_list: null,
        searchValue: null,
        expands: [],
        pool_id: '',
        total: 0,
        pool_total: 0,
        pool_page: 1,
        pool_limit: 5,
        listLoading: true,
        dialogCreateAppVisible: false,
        dialogEditAppVisible: false,
        dialogPoolVisible: false,
        downloadLoading: false,
        dialogEditPoolForm: false,
        dialogDetail: false,
        adminrole: false,
        statusOptions: [{'value': 'enable', 'label': '启用'}, {'value': 'disable', 'label': '禁用'}],
        typeOptions: [{'value': 'TCP', 'label': 'TCP'}, {'value': 'UDP', 'label': 'UDP'}, {
          'value': 'HTTP',
          'label': 'HTTP'
        },
          {'value': 'HTTPS', 'label': 'HTTPS'}],
        sessionOptions: [{'value': '无', 'label': '无'}, {'value': 'cookie ', 'label': 'Cookie '},
          {'value': 'source_addr ', 'label': '源地址 '}, {'value': 'dest_addr', 'label': '目的地址'},
          {'value': 'sourceIP ', 'label': '源IP '}, {'value': 'hash ', 'label': '哈希 '}],
        rules: {
          vserver: [{required: true, message: '请输入正确的ip地址', trigger: 'blur'},
            {validator: validateIpaddress}],
          port: [{required: true, message: '请输入端口', trigger: 'blur'}],
          name: [{required: true, message: '请输入VS名称', trigger: 'blur'},
            {max: 50, message: '长度不超过50个字符', trigger: 'blur'}],
          http: [{required: true, message: '请选择类型', trigger: 'blur'}],
          status: [{required: true, message: '请选择状态', trigger: 'blur'}],
          pool_name: [{min: 3, max: 50, message: '长度需大于3且小于50个字符', trigger: 'blur'}],
        },
        pool_rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'},
            {min: 3, max: 50, message: '长度需大于3且小于50个字符', trigger: 'blur'}],
          member: [{required: true, message: '请输入成员', trigger: 'blur'}]
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        multipleSelection: [],
        multipleSelect: [],
        disable1: true,
        disable2: true,
        lineOptions: []
      }
    },
    created() {
      this.adminrole = this.roles.includes('loadbalance')
      this.getList()
      fetchTypeInfo().then(res => {
        const line = []
        for (let i of res) {
          if (i.typename === 'SLB_Type') {
            line.push({
              label: i.displayname, key: i.value_or_code
            })
          }
        }
        this.lineOptions = line
      })
    },
    computed: {
      ...mapGetters(['roles']),
      pool_search(){
          return this.pool_list_temp.slice((this.pool_page-1)*this.pool_limit,this.pool_page*this.pool_limit)
      }
    },
    filters: {
      row2MultipleRow(data) {
        let res = ''
        if (data) {
          for (let item of data.split(' ')) {
            item += '\n'
            res += item
          }
        }
        return res
      }
    },
     watch:{
   },
    methods: {
      poolsearch(search) {
        if (search) {
          let list = this.pool_list.filter(v=>{
            if (v.remark) {
              return v.name.includes(search)||v.member.includes(search)||v.remark.includes(search)
            }else {
              return v.name.includes(search)||v.member.includes(search)
            }
          })
          this.pool_list_temp = list
          this.pool_total = list.length
          this.pool_page = 1
        }else{
          this.pool_list_temp = this.pool_list
          this.pool_total = this.pool_list.length
          this.pool_page = 1
        }
      },
      addDomain() {
        if (this.configinfo.length < 5) {
          const configinfo = Object.assign({}, this.configinfodict)
          this.configinfo.push(configinfo)
        } else {
          this.$msgbox({
            title: "提示",
            message: '一次添加记录条目不能超过5条！',
            showCancelButton: false,
            confirmButtonText: '确定',
            type: "warning"
          });
        }

      },
      removeDomain(item) {
        const index = this.configinfo.indexOf(item)
        if (index !== -1) {
          this.configinfo.splice(index, 1)
        }
      },
      display_detail(row) {
        this.dialogDetail = true
        this.detail.rule = row.rule
      },
      handleSelection(val) {
        this.multipleSelect = val
        if (val.length > 0) {
          this.disable1 = false
        } else {
          this.disable1 = true
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (val.length > 0) {
          this.disable2 = false
        } else {
          this.disable2 = true
        }
      },
      selectVsip(id, ip, port) {
        this.e_title = ip + ':' + port + '-POOL信息'
        this.poolQuery.vserverid = id
        this.pool_id = id
        fetchLoadPoolList(this.poolQuery).then(res => {
          this.pool_list = res
          this.pool_list_temp = res
          this.pool_total = res.length
          this.temp_list = res
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
        this.dialogPoolVisible = true
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
        fetchLoadBalanceList(this.listQuery).then(response => {
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
      handleSizeChange(val) {
        this.pool_limit = val
      },
      handleCurrentChange(val) {
        this.pool_page = val
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          name: undefined,
          http: undefined,
          status: undefined,
          opr_time_s: undefined,
          line: undefined,
        }
      },
      addF5() {
        if (this.multipleSelect) {
          this.multipleSelect.forEach(v => {
            this.loadAppForm = v
            this.loadAppForm.pools = 0
          })
        }
        this.dialogCreateAppVisible = true
      },
      submitForm() {
        this.$refs.addAppForm.validate(valid => {
          if (valid) {
            for (const i of this.configinfo) {
              const temp = {}
              if (!i.vserver || !i.name) {
                return this.$msgbox({
                  title: "提示",
                  message: 'vsip和vs名称都为必填项',
                  showCancelButton: false,
                  confirmButtonText: '确定',
                  type: "warning"
                });
              } else {
                // this.loadAppForm.temp = this.configinfo
                temp.vserver = i.vserver
                temp.name = i.name
                temp.http = this.loadAppForm.http
                temp.port = this.loadAppForm.port
                temp.app = this.loadAppForm.app
                temp.rule = this.loadAppForm.rule
                temp.status = this.loadAppForm.status
                temp.member = this.loadAppForm.member
                temp.pool_name = this.loadAppForm.pool_name
                temp.pool_remark = this.loadAppForm.pool_remark
                temp.profiles = this.loadAppForm.profiles
                temp.domain = this.loadAppForm.domain
                temp.user = this.loadAppForm.user
                temp.snat = this.loadAppForm.snat
                temp.others = this.loadAppForm.others
                temp.remark = this.loadAppForm.remark
                temp.pools = this.loadAppForm.pools
                temp.session = this.loadAppForm.session
                const ip = i.vserver.split('.')
                temp.line = ip[0]+'.'+ip[1]+'.'+ip[2]
                addLoadBalanceList(temp).then(response => {
                  if (response.status === 'ok') {
                    this.$notify({
                      title: '成功',
                      message: response.message,
                      type: 'success',
                      duration: 2000
                    });
                  }else {
                    this.$notify({
                      title: '失败',
                      message: response.message,
                      type: 'error',
                      duration: 2000
                    });
                  }
                  this.dialogCreateAppVisible = false
                  this.getList();
                }).catch(err => {
                  this.$message({
                    message: err,
                  });
                });
              }
            }
          }
        });
      },
      editFormCommon(row) {
        this.dialogEditAppVisible = true
        this.e_title = row.vserver
        this.editAppForm.id = row.id
        this.editAppForm.vserver = row.vserver
        this.editAppForm.name = row.name
        this.editAppForm.app = row.app
        this.editAppForm.port = row.port
        this.editAppForm.pools = row.total_pools
        this.editAppForm.status = row.status
        this.editAppForm.http = row.http
        this.editAppForm.remark = row.remark
        this.editAppForm.user = row.user
        this.editAppForm.snat = row.snat
        this.editAppForm.rule = row.rule
        this.editAppForm.session = row.session
        this.editAppForm.domain = row.domain
        this.editAppForm.others = row.others
        this.editAppForm.profiles = row.profiles
      },
      editForm() {
        this.$refs.editAppForm.validate(valid => {
          if (valid) {
            this.editAppForm.update_time = Math.round(new Date() / 1000)
            editLoadBalanceList(this.editAppForm.id, this.editAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
              this.dialogEditAppVisible = false
              this.getList();
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
          } else {
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            });
            return false
          }
        });
      },
      addPoolForm() {
        this.$refs.poolAppForm.validate(valid => {
          if (valid) {
            this.poolAppForm.vserverid = this.pool_id
            this.poolAppForm.create_time = Math.round(new Date() / 1000)
            this.poolAppForm.update_time = Math.round(new Date() / 1000)
            addLoadPoolList(this.poolAppForm).then(res => {
              if (res.mes==='ok') {
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList();
                this.selectVsip(this.pool_id)
                this.downloadLoading = false
              } else {
                this.$notify({
                  title: '失败',
                  message: res.mes,
                  type: 'error',
                  duration: 2000
                })
              }
            })
          } else {
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            });
            return false
          }
        });
      },
      editPool(row) {
        this.dialogEditPoolForm = true
        this.editPoolForm.id = row.id
        this.editPoolForm.vserverid = row.vserverid
        this.editPoolForm.name = row.name
        this.editPoolForm.member = row.member
        this.editPoolForm.remark = row.remark
      },
      edits() {
        this.$refs.editPoolForm.validate(valid => {
          if (valid) {
            this.editPoolForm.update_time = Math.round(new Date() / 1000)
            editLoadPoolList(this.editPoolForm.id, this.editPoolForm).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogEditPoolForm = false
              this.selectVsip(this.pool_id)
            })
          } else {
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            });
            return false
          }
        })
      },
      deletePool() {
        if (this.multipleSelection.length > 0) {
          let msg = '确定删除该' + this.multipleSelection.length + '条pools信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            deleteLoadPoolList(this.multipleSelection).then(res => {
              if (res.sum > 0) {
                this.$message({
                  title: '成功',
                  message: '成功删除' + res.sum + '条',
                  type: 'success',
                  duration: 2000
                })
                this.getList();
                this.downloadLoading = false
                this.selectVsip(this.pool_id)
              } else {
                this.$notify({
                  title: '失败',
                  message: '删除失败',
                  type: 'error',
                  duration: 2000
                })
              }
            })
          }, () => {
            return false
          })
        }
      },
      deletePoolSingle(row) {
        const arr1 = []
        arr1.push(row)
        let msg = '确定删除该pools信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteLoadPoolList(arr1).then(res => {
            if (res.sum > 0) {
              this.$message({
                title: '成功',
                message: '成功删除' + res.sum + '条',
                type: 'success',
                duration: 2000
              })
              this.getList();
              this.downloadLoading = false
              this.selectVsip(this.pool_id)
            } else {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }, () => {
          return false
        })
      },
      deleteFormCommon() {
        if (this.multipleSelect.length > 0) {
          let msg = '确定删除该' + this.multipleSelect.length + '条负载信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            deleteLoadBalanceList(this.multipleSelect).then(response => {
              if (response.sum > 0) {
                this.$message({
                  title: '成功',
                  message: '成功删除' + response.sum + '条',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '删除失败',
                  type: 'error',
                  duration: 2000
                })
              }
            })
          }, () => {
            return false
          })
        }

      },
      deleteFormSingle(row) {
        const arr = []
        arr.push(row)
        let msg = '确定删除该负载信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteLoadBalanceList(arr).then(response => {
            if (response.sum > 0) {
              this.$message({
                title: '成功',
                message: '成功删除' + response.sum + '条',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }, () => {
          return false
        })
      },
      resetForm(formName) {
        this.dialogCreateAppVisible = false
        this.$refs[formName].resetFields()

      },
      handleClose() {
        this.loadAppForm = {
          vserver: '',
          port: '',
          name: '',
          http: 'TCP',
          status: 'enable',
          pools: 0,
          snat: '',
          user: '',
          rule: '',
          session: '无',
          app: '',
          remark: ''
        }
        this.configinfo=[{
          'vserver': '',
          'name': ''
        }]
        this.searchValue = ''
        this.disable2 = true
        this.dialogDetail = false
        this.pool_limit=5
        this.pool_page=1
      },
      dialogAddPool() {
        this.poolAppForm = {
          name: '',
          member: '',
          remark: ''
        }
      },
      toggleRowExpansion(row,label) {
        if (label.label == '操作') {
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

  .filed {
    padding-top: 11px;
    border: 1px solid #dfe6ec;
    margin-bottom: 5px;
  }

  /*.port_ip .el-form-item__content > div {*/
  /*  margin-bottom: 3px;*/
  /*}*/
</style>
