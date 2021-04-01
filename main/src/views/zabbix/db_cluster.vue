<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="number_name">
          <el-input v-model="listQuery.cluster_name" placeholder="请输入实例名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.db_type" placeholder="数据库类型" style="width:130px" clearable @change="handleFilter">
            <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="copy_type">
          <el-select v-model="listQuery.copy_type" placeholder="复制类型" :loading="loading" style="width:150px" clearable
                     @change="handleFilter">
            <el-option v-for="item in select4" :key="item.value" :label="item.label" :value="item.label"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="listQuery.filter_ip" placeholder="请输入ip地址" clearable style="width:150px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.filter_domain" placeholder="请输入域名" clearable style="width:200px"></el-input>
        </el-form-item>
<el-form-item prop="enable">
          <el-select v-model="listQuery.enable" placeholder="是否启用" filterable clearable
                     @change="handleFilter" style="width: 120px">
            <el-option key="1" label="启用" value="1"/>
            <el-option key="0" label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>

        <el-button class="filter-item" type="warning" icon="el-icon-edit-outline" plain @click="batchUpdateClick"
                   :disabled="selected_rows.length===0">批量修改
        </el-button>

        <el_button_wait :interval="2" class="filter-item" type="success" icon="el-icon-download" plain @click="exportMysqlDataX">导出全部</el_button_wait>
        <!--        <el-button class="filter-item" type="success" icon="el-icon-download" plain @click="exportRootDiff">磁盘历史</el-button>-->
        <!--        <el-button class="filter-item" type="success" icon="el-icon-upload2" plain @click="batchImportClick2">批量导入</el-button>-->
      </el-form>
    </div>


    <el-table v-loading="listLoading" ref="multipleTableAll" :data="list" border stripe highlight-current-row style="width: 100%"
              @cell-click="cellClick" :cell-style="cellStyleClass" @selection-change="selectRowChanged">
      <el-table-column type="selection" align="center" width="45"></el-table-column>
      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="scope">
          <el-table :data="scope.row.config_info" class="xxxwwww" stripe highlight-current-row border @cell-click="cellClick">
            <el-table-column prop="channel_name" label="集群名" align="center" width="110"/>
            <el-table-column prop="roles" label="角色" align="center" width="90" sortable>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.roles==='master'" type="danger">master</el-tag>
                <el-tag v-if="scope.row.roles==='slave'" type="success">slave</el-tag>
                <el-tag v-if="scope.row.roles==='vip'" type="info">vip</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP" align="center" width="120"/>
            <el-table-column prop="port" label="端口" align="center" width="80"/>
            <el-table-column prop="master_ip" label="master地址" align="center" min-width="160"/>
            <el-table-column prop="slave_ip" label="slave地址" align="center" width="160">
              <template slot-scope="scope">
                <span v-html="scope.row.slave_ip.replace(/,/g,'<br/>')"></span>
              </template>
            </el-table-column>
            <el-table-column prop="app_id" label="应用名" align="center" width="250">
              <template slot-scope="scope">
                <span :class="{'one_line': true}">{{ scope.row.app_id.substring(1,scope.row.app_id.length-1) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="client_ip" label="对应IP" align="center" width="250">
              <template slot-scope="scope">
                <span :class="{'one_line': true}">{{ scope.row.client_ip.replace(/\{|}/g,'') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" align="center" width="100"/>
            <el-table-column label="备注" align="center" show-overflow-tooltip min-width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.comments }}</span>
                <div style="color: #8492a6; font-size: 10px">更新时间: {{ scope.row.update_time }}</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="实例名" align="center" width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.cluster_name }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.db_type }}</div>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.department[scope.row.department.length -1] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复制类型" align="center" prop="copy_type" sortable width="110"/>
      <el-table-column label="DB管理员" align="center" width="110" prop="manager_name"/>
      <el-table-column label="告警联系人" align="center" width="110" prop="alarm_sms_name"/>
      <el-table-column label="经理" align="center" width="110" prop="jingli_name"/>
      <el-table-column label="实例数" align="center" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.not_vip_count}}</span>
          <div style="color: #8492a6; font-size: 10px">master:{{ scope.row.master_count }}, slave:{{ scope.row.slave_count }}</div>
        </template>
      </el-table-column>
      <el-table-column label="实例IP" align="center" width="190">
        <template slot-scope="scope">
          <pre :class="{'double_line': scope.row.in_double_line}"><span v-for="item in scope.row.config_info">{{item.roles+' '+item.ip+':'+item.port+'\n'}}</span></pre>
        </template>
      </el-table-column>
      <el-table-column label="实例IP域名" align="center" width="190">
        <template slot-scope="scope">
          <pre :class="{'double_line': scope.row.in_double_line}" v-text="scope.row.ip_domain_list.toString().replace(/,/g,'\n')"></pre>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
          <div style="color: #8492a6; font-size: 10px">更新时间: {{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110px" align="center">
        <template slot-scope="scope">
          <el-button plain type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"/>
          <el-button plain type="danger" icon="el-icon-delete" circle @click="handleBatchDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>


    <el-dialog title="新增" :visible.sync="add_dialog_visible" style="text-align: left;"
               :close-on-click-modal="false" width="1200px" top="80px">
      <el-form :model="dbClusterEdit" label-width="90px" :rules="rules_add" ref="detailFormEdit">
        <el-row>
          <el-col :span="12">
            <el-form-item label="实例名" prop="cluster_name">
              <el-input v-model="dbClusterEdit.cluster_name" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-select v-model="dbClusterEdit.enable" placeholder="是否启用" style="width: 100%" @change="clusterEnableChanged">
                <el-option v-for="item in [[true,'启用'],[false,'禁用']]" :key="item[1]" :label="item[1]" :value="item[0]"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库类型" prop="db_type">
              <el-select v-model="dbClusterEdit.db_type" placeholder="数据库类型" style="width: 100%" @change="dbTypeChanged">
                <el-option v-for="i in dbType" :label="i.label" :value="i.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-cascader expand-trigger="hover" change-on-select :options="app_name_cascade" clearable placeholder="部门"
                           v-model="dbClusterEdit.department" filterable style="width:100%"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="复制类型">
              <el-select v-model="dbClusterEdit.copy_type" placeholder="复制类型" style="width: 100%">
                <el-option v-for="i in select4" :label="i.label" :value="i.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="DB管理员" prop="manager">
              <el-select v-model="dbClusterEdit.manager" filterable clearable multiple placeholder="请选择管理员" style="width: 100%">
                <el-option v-for="item in db_managers_list" :key="item.user_name+item.uuid"
                           :label="'('+item.user_name+item.uuid+')'+item.mobile" :value="item.mobile"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经理">
              <el-select v-model="dbClusterEdit.jingli" multiple filterable clearable placeholder="选择经理" style="width: 100%">
                <el-option v-for="item in db_jinli_list" :key="item.user_name+item.uuid"
                           :label="'('+item.user_name+item.uuid+')'+item.mobile" :value="item.mobile"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警联系人">
              <el-select v-model="dbClusterEdit.alarm_sms" multiple filterable clearable placeholder="请选择报警联系人" style="width: 100%">
                <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name"
                           :value="item.display_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="dbClusterEdit.comments" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-for="channel of dbClusterEdit.channel_keys" :draggable='draggable'
                @drop.native="drop($event,channel)"
                @dragstart.native="dragstart($event,channel)"
                @dragover.native='dragover($event)'>

          <el-col :span="22" :offset="1" class="db_cluster_detail_table">
            <input class="channel_name" v-model="dbClusterEdit.channel_dict[channel].channel_name"
                   @focus="channelGetFocus(channel)" @blur="channelBlur(channel)">
            <el-table v-loading="listLoading" :data="dbClusterEdit.channel_dict[channel].data"
                      highlight-current-row ref="multipleTable" tooltip-effect="dark" :cell-style="cellStyleClass"
                      :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">
              <el-table-column label="启用" align="right" show-overflow-tooltip width="60px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0;margin-left:3px">
                    <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ff4949" @change="dbManageEnableChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="角色" align="center" show-overflow-tooltip width="140px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.roles'" :rules="rules_add.roles">
                    <el-select v-model="scope.row.roles" placeholder="角色" style="width: 100%" clearable>
                      <el-option label="master" value="master"/>
                      <el-option label="slave" value="slave"/>
                      <el-option label="vip" value="vip"/>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="IP地址" align="center" show-overflow-tooltip width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.ip'" :rules="rules_add.ip">
                    <el-input v-model.trim="scope.row.ip" type="text" style="width:100%" ref="ip_button"
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="端口" align="center" show-overflow-tooltip width="140px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.port'" :rules="rules_add.port">
                    <el-input v-model.trim="scope.row.port" type="text" placeholder="端口" style="width:100%"
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="版本" align="center" show-overflow-tooltip width="160px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  +'.version'" :rules="rules_add.version">

                    <el-input v-model.trim="scope.row.version" type="text" placeholder="版本" style="width:100%" clearable
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" show-overflow-tooltip min-width="160px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.comments'" :rules="rules_add.comments">
                    <el-input v-model.trim="scope.row.comments" type="text" placeholder="备注" style="width:100%" clearable
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="channel" align="center" show-overflow-tooltip width="65px">
                <div slot-scope="scope" slot="header">
                  <el-button type="primary" icon="el-icon-plus" circle @click="clickAddDeviceButton(scope.column.label)"/>
                </div>
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-minus" circle @click="clickDeleteDeviceButton(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <div style="text-align: center;">
          <div style="border-top:dashed 1px darkgrey; border-bottom:dashed 1px darkgrey;width:300px;display:inline-block;
          margin:7px 17px;margin-bottom:0;color:#1890ff">
            <a style="margin:6px;display:inline-block;" @click="addMasterSlaveClick">
              <i class="el-icon-circle-plus-outline">&nbsp;&nbsp;新增一组master-slave</i>
            </a>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="float:left" icon="el-icon-upload2" @click="batchImportClick">从Excel导入</el-button>
        <el-button type="primary" style="float:left" icon="el-icon-download" @click="exportClick">导出</el-button>
        <el-button @click="add_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改" :visible.sync="edit_dialog_visible" style="text-align: left;"
               :close-on-click-modal="false" width="1200px" top="80px">
      <el-form :model="dbClusterEdit" label-width="90px" :rules="rules_add" ref="detailFormEdit">
        <el-row>
          <el-col :span="12">
            <el-form-item label="实例名" prop="cluster_name">
              <el-input v-model="dbClusterEdit.cluster_name" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-select v-model="dbClusterEdit.enable" placeholder="是否启用" style="width: 100%" @change="clusterEnableChanged">
                <el-option v-for="item in [[true,'启用'],[false,'禁用']]" :key="item[1]" :label="item[1]" :value="item[0]"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库类型" prop="db_type">
              <el-select v-model="dbClusterEdit.db_type" placeholder="数据库类型" style="width: 100%" @change="dbTypeChanged">
                <el-option v-for="i in dbType" :label="i.label" :value="i.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-cascader expand-trigger="hover" change-on-select :options="app_name_cascade" clearable placeholder="部门"
                           v-model="dbClusterEdit.department" filterable style="width:100%"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="复制类型">
              <el-select v-model="dbClusterEdit.copy_type" placeholder="复制类型" style="width: 100%">
                <el-option v-for="i in select4" :label="i.label" :value="i.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="DB管理员" prop="manager">
              <el-select v-model="dbClusterEdit.manager" filterable clearable multiple placeholder="请选择管理员" style="width: 100%">
                <el-option v-for="item in db_managers_list" :key="item.user_name+item.uuid"
                           :label="'('+item.user_name+item.uuid+')'+item.mobile" :value="item.mobile"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经理">
              <el-select v-model="dbClusterEdit.jingli" multiple filterable clearable placeholder="选择经理" style="width: 100%">
                <el-option v-for="item in db_jinli_list" :key="item.user_name+item.uuid"
                           :label="'('+item.user_name+item.uuid+')'+item.mobile" :value="item.mobile"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警联系人">
              <el-select v-model="dbClusterEdit.alarm_sms" multiple filterable clearable placeholder="请选择报警联系人" style="width: 100%">
                <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name"
                           :value="item.display_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="dbClusterEdit.comments" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-for="channel of dbClusterEdit.channel_keys" :draggable='draggable'
                @drop.native="drop($event,channel)"
                @dragstart.native="dragstart($event,channel)"
                @dragover.native='dragover($event)'>

          <el-col :span="22" :offset="1" class="db_cluster_detail_table">
            <input class="channel_name" v-model="dbClusterEdit.channel_dict[channel].channel_name"
                   @focus="channelGetFocus(channel)" @blur="channelBlur(channel)">
            <el-table v-loading="listLoading" :data="dbClusterEdit.channel_dict[channel].data"
                      highlight-current-row ref="multipleTable" tooltip-effect="dark" :cell-style="cellStyleClass"
                      :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">
              <el-table-column label="启用" align="right" show-overflow-tooltip width="60px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0;margin-left:3px">
                    <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ff4949" @change="dbManageEnableChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="角色" align="center" show-overflow-tooltip width="140px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.roles'" :rules="rules_add.roles">
                    <el-select v-model="scope.row.roles" placeholder="角色" style="width: 100%" clearable>
                      <el-option label="master" value="master"/>
                      <el-option label="slave" value="slave"/>
                      <el-option label="vip" value="vip"/>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="IP地址" align="center" show-overflow-tooltip width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.ip'" :rules="rules_add.ip">
                    <el-input v-model.trim="scope.row.ip" type="text" style="width:100%" ref="ip_button"
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="端口" align="center" show-overflow-tooltip width="140px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.port'" :rules="rules_add.port">
                    <el-input v-model.trim="scope.row.port" type="text" placeholder="端口" style="width:100%"
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="版本" align="center" show-overflow-tooltip width="160px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  +'.version'" :rules="rules_add.version">

                    <el-input v-model.trim="scope.row.version" type="text" placeholder="版本" style="width:100%" clearable
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" show-overflow-tooltip min-width="160px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'channel_dict.' + channel + '.data.' + scope.$index  + '.comments'" :rules="rules_add.comments">
                    <el-input v-model.trim="scope.row.comments" type="text" placeholder="备注" style="width:100%" clearable
                              @focus="draggable=false" @blur="draggable=true"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="channel" align="center" show-overflow-tooltip width="65px">
                <div slot-scope="scope" slot="header">
                  <el-button type="primary" icon="el-icon-plus" circle @click="clickAddDeviceButton(scope.column.label)"/>
                </div>
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-minus" circle @click="clickDeleteDeviceButton(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <div style="text-align: center;">
          <div style="border-top:dashed 1px darkgrey; border-bottom:dashed 1px darkgrey;width:300px;display:inline-block;
          margin:7px 17px;margin-bottom:0;color:#1890ff">
            <a style="margin:6px;display:inline-block;" @click="addMasterSlaveClick">
              <i class="el-icon-circle-plus-outline">&nbsp;&nbsp;新增一组master-slave</i>
            </a>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="filter-item" type="primary" icon="el-icon-download" style="float:left" @click="exportClick">导出</el-button>
        <el-button @click="edit_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量添加" :visible.sync="batch_add_dialog_visible" :close-on-click-modal="false" width="45%">
      <template>
        <el-tabs value="ip" type="border-card">
          <el-tab-pane label="IP和端口相关数据" name="ip">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-input v-model="information" type="textarea" :rows="15"
                            placeholder="请按照以下格式填写:vip 10.1.1.1 5000 5.2.4 备注内容 （角色 ip 端口 版本 备注）多组数据采用换行"/>
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="batch_add_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="batchUpdateConfirm">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="批量修改" :visible.sync="batch_update_visible" style="text-align: left;" width="500px">
      <el-form ref="batchUpdateForm" :model="batchUpdateForm" :rules="rules_batch_update" label-width="100px">
        <el-col :span="24">
          <el-form-item label="库类型" prop="db_type">
            <el-select v-model="batchUpdateForm.db_type" placeholder="数据库类型" style="width: 100%" @change="dbTypeChanged">
              <el-option v-for="i in dbType" :label="i.label" :value="i.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="部门" prop="department">
            <el-cascader expand-trigger="hover" change-on-select :options="app_name_cascade" clearable placeholder="部门"
                         v-model="batchUpdateForm.department" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="复制类型">
            <el-select v-model="batchUpdateForm.copy_type" placeholder="复制类型" style="width: 100%">
              <el-option v-for="i in select4" :label="i.label" :value="i.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="DB管理员" prop="manager">
            <el-select v-model="batchUpdateForm.manager" filterable clearable multiple placeholder="请选择管理员" style="width: 100%">
              <el-option v-for="item in db_managers_list" :key="item.user_name+item.uuid"
                         :label="'('+item.user_name+item.uuid+')'+item.mobile" :value="item.mobile"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经理">
            <el-select v-model="batchUpdateForm.jingli" multiple filterable clearable placeholder="选择经理" style="width: 100%">
              <el-option v-for="item in db_jinli_list" :key="item.user_name+item.uuid"
                         :label="'('+item.user_name+item.uuid+')'+item.mobile" :value="item.mobile"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="报警联系人">
            <el-select v-model="batchUpdateForm.alarm_sms" multiple filterable clearable placeholder="请选择报警联系人" style="width: 100%">
              <el-option v-for="item in mobileOptions" :key="item.key" :label="'('+item.key+')'+item.display_name"
                         :value="item.display_name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="batch_update_visible = false">取 消</el-button>
        <el-button type="primary" @click="batchUpdateConfirm()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量新增" :visible.sync="batch_import_visible" width="80%" top="50px">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/cmdb/db集群新增模板.xlsx">
              <el-button type="text">db集群新增模板下载</el-button>
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
        <el-button @click="batch_import_visible=false">取 消</el-button>
        <el-button type="primary" @click="batchImportConfirm">提 交</el-button>
      </div>
    </el-dialog>


    <el-dialog title="批量导入" :visible.sync="batch_import_visible_2" width="80%" top="50px">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/cmdb/db集群批量模板.xlsx">
              <el-button type="text">db集群批量模板下载</el-button>
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
        <el-button @click="batch_import_visible_2=false">取 消</el-button>
        <el-button type="primary" @click="batchImportConfirm2">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    fetchDbCluster, fetchZabbixDb, editDbCluster, deleteDbCluster, dbClusterCreate,
    dbClusterBatchUpdate, dbClusterBatchCreate, getDbManagers, getDbJinliList, exportMysqlData
  } from '@/api/zabbix/db'
  import {getUserConf} from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validMultipleIp, validSpecialChar, validPort, validIp} from '@/utils/validate'
  import {getAppNameCascade} from '@/api/workflow/malfunction'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";

  export default {
    name: 'ComplexTable',
    components: {Pagination, UploadExcelComponent, el_button_wait},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        draggable: true,
        tableData: [],
        tableHeader: [],
        selected_rows: [],
        information: '',
        version_list: [],
        app_name_cascade: [],
        db_managers_list: [],
        db_jinli_list: [],
        dbType: [{value: 'Oracle', label: 'Oracle'}, {value: 'Mysql', label: 'Mysql'},
          {value: 'PostgreSQL', label: 'PostgreSQL'}, {value: 'MongoDB', label: 'MongoDB'}],
        select4: [{value: '异步物理复制', label: '异步物理复制'}, {value: 'ogg逻辑复制', label: 'ogg逻辑复制'},
          {value: '异步', label: '异步'}, {value: '半同步', label: '半同步'}, {value: '多源复制', label: '多源复制'},
          {value: '组复制', label: '组复制'}, {value: 'mongodb副本集', label: 'mongodb副本集'}, {value: 'mongodb集群', label: 'mongodb集群'},],
        loading: false,
        listQuery: {
          page: 1,
          limit: 20,
          ip: [],
          cluster_name: null,
          db_type: null,
          copy_type: null,
          filter_ip: null,
          client_ip: null,
        },
        dbClusterEdit: {},
        batchUpdateForm: {},
        confirmOptions: {confirmButtonText: '确定', cancelButtonText: '取消', cancelButtonClass: 'el-button--danger', type: 'warning'},
        default_channel_data: {'ip': '', 'port': '3306', 'roles': 'master', 'version': '', 'comments': '', enable: true},
        rules_add: {
          cluster_name: [{required: true, message: '必填项', trigger: 'blur'}],
          db_type: [{required: true, message: '必填项', trigger: 'blur'}],
          ip: [{required: true, message: '必填项', trigger: 'blur'}],
          port: [{required: true, message: '必填项', trigger: 'blur'}],
          manager: [{required: true, message: '必填项', trigger: 'blur'}],
          department: [{required: true, message: '必填项', trigger: 'blur'}],
        },
        rules_batch_update: {},
        // 要展开的行，数值的元素是row的key值
        expands: [],
        list: [],
        total: 0,
        listLoading: true,
        edit_dialog_visible: false,
        batch_add_dialog_visible: false,
        add_dialog_visible: false,
        batch_update_visible: false,
        batch_import_visible: false,
        batch_import_visible_2: false,
        mobileOptions: [],
        dbCluster: []
      }
    },
    created() {
      if (this.$route.params.name) {
        this.listQuery.cluster_name = this.$route.params.name
      }
      this.getList();
      this.getUserConfList();
      this.getDb()
    },
    filters: {
      row2MultipleRow(data) {
        let res = '';
        if (data) {
          for (let item of data.split(',')) {
            item += '\n';
            res += item
          }
        }
        return res
      }
    },
    mounted() {
      getAppNameCascade().then(response => {
        this.app_name_cascade = response
      });
      getDbManagers().then(response => {
        this.db_managers_list = response
      });
      getDbJinliList().then(response => {
        this.db_jinli_list = response
      });
    },
    methods: {
      dbManageEnableChanged(value) {
        console.log(value);
        if (value) {
          this.dbClusterEdit.enable = true
        } else {
          for (let key of Object.keys(this.dbClusterEdit.channel_dict)) {
            for (let i of this.dbClusterEdit.channel_dict[key].data) {
              if (i.enable) {
                this.dbClusterEdit.enable = true;
                return
              }
            }
          }
          this.dbClusterEdit.enable = false
        }
      },
      clusterEnableChanged(value) {
        console.log(value);
        for (let key of Object.keys(this.dbClusterEdit.channel_dict)) {
          for (let i of this.dbClusterEdit.channel_dict[key].data) {
            i.enable = value
          }
        }
      },
      dragover(event) {
        event.preventDefault()
      },
      drop(event, channel) {
        console.log('drop');
        let channel_id_1 = event.dataTransfer.getData('channel_id_1');
        let channel_id_2 = channel;
        console.log('channel_id_1', channel_id_1);
        console.log('channel_id_2', channel_id_2);

        let start_channel_name = event.dataTransfer.getData('start_channel_name');
        let drop_channel_name = this.dbClusterEdit.channel_dict[channel].channel_name;
        console.log('drop_channel_name', drop_channel_name);
        console.log('start_channel_name', start_channel_name);

        if (channel_id_1 !== channel_id_2) {
          let channel_1 = start_channel_name.split(':')[1].trim();
          let channel_2 = drop_channel_name.split(':')[1].trim();
          console.log('即将和并【' + channel_1 + '】和【' + channel_2 + '】');
          let msg = '和并【' + channel_1 + '】和【' + channel_2 + '】 ?';
          // this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          let dict = JSON.parse(JSON.stringify(this.dbClusterEdit.channel_dict));
          let data1 = JSON.parse(JSON.stringify(dict[channel_id_1].data));
          let data2 = JSON.parse(JSON.stringify(dict[channel_id_2].data));
          delete dict[channel_id_1];

          for (let i of data1) {
            i['channel'] = channel_id_2;
            i['channel_name'] = drop_channel_name
          }
          dict[channel_id_2].data = [...data2, ...data1];  //深拷贝

          this.dbClusterEdit.channel_keys = Object.keys(dict);
          this.dbClusterEdit.channel_dict = dict;
          this.$message({message: '和并了【' + channel_1 + '】和【' + channel_2 + '】', type: 'success'});
          // })
        }
      },
      dragstart(event, channel) {
        console.log('dragstart');
        let start_channel_name = this.dbClusterEdit.channel_dict[channel].channel_name;
        event.dataTransfer.setData('start_channel_name', start_channel_name);
        event.dataTransfer.setData('channel_id_1', channel)
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
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      exportClick() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['集群名', '角色', 'IP', '端口', '版本', '备注'];
          const filterVal = ['channel_name', 'roles', 'ip', 'port', 'version', 'comments'];
          const list = this.dbClusterEdit.config_info;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'db集群信息-' + this.getNow(),
          })
        })
      },
      batchImportClick() {
        this.batch_import_visible = true;
        this.tableData = [];
        this.tableHeader = []
      },
      batchImportClick2() {
        this.batch_import_visible_2 = true;
        this.tableData = [];
        this.tableHeader = []
      },
      deleteRow(index, rows) {
        rows.splice(index, 1)
      },
      batchImportConfirm(response) {
        this.dbClusterEdit.channel_dict = {};
        let channel_names = [];
        for (let i of this.tableData) {
          if (channel_names.indexOf(i['集群名']) === -1) {
            channel_names.push(i['集群名'])
          }
        }
        let channel_name_dict = {};
        for (let i of channel_names) {
          channel_name_dict[i] = this.getRandomString()
        }
        let channel_dict = JSON.parse(JSON.stringify(this.dbClusterEdit.channel_dict));  //深拷贝
        for (let i of this.tableData) {
          let line_data = {
            comments: i['备注'] || '', version: i['版本'] || '', port: i['端口'], roles: i['角色'] || '', ip: i['IP'],
            channel: channel_name_dict[i['集群名']] || '', 'channel_name': '集群名: ' + i['集群名']
          };
          if (!channel_dict[channel_name_dict[i['集群名']]]) {
            channel_dict[channel_name_dict[i['集群名']]] = {data: [line_data]};
            channel_dict[channel_name_dict[i['集群名']]].channel_name = '集群名: ' + i['集群名']
          } else {
            channel_dict[channel_name_dict[i['集群名']]].data.push(line_data)
          }
        }
        this.$set(this.dbClusterEdit, 'channel_dict', channel_dict);
        this.dbClusterEdit.channel_keys = Object.keys(this.dbClusterEdit.channel_dict);
        this.batch_import_visible = false;
      },
      batchImportConfirm2(response) {

        dbClusterBatchCreate(this.tableData).then(response => {
          if (response['error']) {
            this.$notify({
              title: '失败',
              message: response['error'],
              type: 'warning',
              duration: 3000
            });
          } else if (response['success']) {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 3000
            });
            this.batch_import_visible_2 = false;
            this.getList()
          }
        })

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
      handleSuccess({results, header}) {
        this.tableData = results;
        this.tableHeader = header
      },
      channelGetFocus(channel) {
        this.dbClusterEdit.channel_dict[channel].channel_name = this.dbClusterEdit.channel_dict[channel].channel_name.replace('集群名: ', '')
      },
      channelBlur(channel) {
        this.dbClusterEdit.channel_dict[channel].channel_name = '集群名: ' + this.dbClusterEdit.channel_dict[channel].channel_name
      },
      selectRowChanged(rows) {
        this.selected_rows = rows;
      },
      batchUpdateClick() {
        this.batch_update_visible = true;
        // initBatchUpdateForm
        this.batchUpdateForm = {db_type: '', department: '', jingli: '', manager: '', alarm_sms: '', copy_type: ''}
      },
      exportMysqlDataX() {
        window.location.href = process.env.VUE_APP_BASE_API + "/zabbix/db_cluster_export_mysql_data";
      },
      exportRootDiff() {
        window.location.href = process.env.VUE_APP_BASE_API + "/zabbix/db_cluster_export_root_diff";
      },
      getRandomString(len) {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd
      },
      addMasterSlaveClick() {
        let random_str = this.getRandomString();
        let channel_data = JSON.parse(JSON.stringify(this.default_channel_data));  //深拷贝
        channel_data['channel'] = random_str;
        channel_data['enable'] = this.dbClusterEdit.enable;
        let last_num = 0;
        let new_name = '集群名: 新集群';
        for (let i of Object.keys(this.dbClusterEdit.channel_dict)) {
          if (this.dbClusterEdit.channel_dict[i].channel_name.search(new_name) !== -1) {
            let this_num = this.dbClusterEdit.channel_dict[i].channel_name.replace(new_name, '');
            if (parseInt(this_num) > last_num) {
              last_num = parseInt(this_num)
            }
          }
        }
        last_num += 1;
        this.$set(this.dbClusterEdit.channel_dict, random_str, {data: [channel_data], channel_name: new_name + last_num});
        this.dbClusterEdit.channel_keys = Object.keys(this.dbClusterEdit.channel_dict)
      },
      clickAddDeviceButton(channel) {
        let li = this.dbClusterEdit.channel_dict[channel].data;
        let data = JSON.parse(JSON.stringify(li[li.length - 1])); //深拷贝;
        data.db_manage_id = undefined
        li.push(data)
      },
      clickDeleteDeviceButton(row) {
        this.dbClusterEdit.channel_dict[row.channel].data.splice(row.index, 1);
        if (this.dbClusterEdit.channel_dict[row.channel].data.length === 0) {
          delete this.dbClusterEdit.channel_dict[row.channel];
          this.dbClusterEdit.channel_keys = Object.keys(this.dbClusterEdit.channel_dict)
        }
      },
      deviceHeaderClass() {
        return 'text-align: center;background:#f5f7fa;color:#56585c;padding:6px 0 5px 0'
      },
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      validBeforeConfirm() {
        let error_message = [];
        let keys = Object.keys(this.rules_add);
        for (let column of ['ip', 'port']) {
          for (let channel of Object.keys(this.dbClusterEdit.channel_dict)) {
            for (let i in this.dbClusterEdit.channel_dict[channel].data) {
              keys.push('channel_dict.' + channel + '.data.' + i + '.' + column)
            }
          }
        }
        for (let key of keys) {
          this.$refs.detailFormEdit.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        }
        return error_message.toString();
      },
      addConfirm() {
        let str_err = this.validBeforeConfirm();
        if (str_err === '') {
          let obj = {...this.dbClusterEdit};
          obj.alarm_sms = obj.alarm_sms ? obj.alarm_sms.join() : obj.alarm_sms;
          obj.manager = obj.manager ? obj.manager.join() : obj.manager;
          dbClusterCreate(obj).then(response => {
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
              this.add_dialog_visible = false;
              this.handleReset()
            }

          });
        } else {
          this.$message.error('表单填写有误！');
        }
      },
      addNew() {
        this.initForm();
        this.add_dialog_visible = true
      },
      initForm() {
        this.dbClusterEdit = {
          id: '', alarm_sms: '', manager: '', app_id: '', cluster_name: '', comments: '', vip: '', jingli: [], db_type: 'Mysql',
          department: [], config_info: [], channel_dict: {}, enable: true, copy_type: '', channel_keys: []
        }
      },
      batchUpdateConfirm() {
        let id_list = [];
        for (let i of this.selected_rows) {
          id_list.push(i.id)
        }
        this.batchUpdateForm.id_list = id_list;
        dbClusterBatchUpdate(this.batchUpdateForm).then(response => {
          let failed_count = this.selected_rows.length - response.success_count;
          if (response.success_count !== 0) {
            this.$message({
              title: '成功',
              message: '成功修改' + response.success_count + '条，失败' + failed_count + '条',
              type: 'success',
              duration: 5000
            });
            this.getList();
            this.batch_update_visible = false;
          } else {
            this.$message({
              title: '失败',
              message: '操作失败',
              type: 'error',
              duration: 5000
            });
          }
          console.log(response.error_log)
        });
      },
      dbTypeChanged(val) {
        if (val.toLocaleLowerCase() === 'mysql') {
          this.version_list = [
            {value: '5.5', label: '5.5'}, {value: '5.6', label: '5.6'}, {value: '5.7', label: '5.7'}
          ]
        } else if (val.toLocaleLowerCase() === 'oracle') {
          this.version_list = [
            {value: '11.2.0.3', label: '11.2.0.3'}, {value: '11.2.0.4', label: '11.2.0.4'}
          ]
        }
      },
      addDomain() {
        let configinfo = {'ip': '', 'port': '3306', 'roles': 'master', 'version': '', 'comments': ''};
        this.dbClusterEdit.config_info.push(configinfo)
      },
      removeDomain(index) {
        console.log(index);
        this.dbClusterEdit.config_info.splice(index, 1)
      },
      handleBatchAdd() {
        this.information = '';
        this.batch_add_dialog_visible = true
      },
      validateIpAddress(rule, value, callback) {
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
      cellClick(row, column, cell, event) {
        if (['实例IP', '实例IP域名'].indexOf(column.label) !== -1) {
          row.in_double_line = !row.in_double_line;
          this.list = JSON.parse(JSON.stringify(this.list)); //深拷贝
        } else if (['对应IP'].indexOf(column.label) !== -1 && row.client_ip) {
          this.$alert(row.client_ip.toString().replace(/,/g, '<br>'), '对应IP', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
          }).catch(() => {
          });
        } else if (['应用名'].indexOf(column.label) !== -1 && row.app_id) {
          this.$alert(row.app_id.toString().replace(/,/g, '<br>'), '应用名', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
          }).catch(() => {
          });
        } else if (['实例名', '部门', '复制类型', 'DB管理员', '告警联系人', '经理', '实例数', '备注'].indexOf(column.label) !== -1) {
          this.$refs['multipleTableAll'].toggleRowExpansion(row)
        }
      },
      cellStyleClass() {
        return 'padding:6px 0'
      },
      handleReset() {
        this.resetlistQuery();
        this.getList()
      },
      editOld(row) {
        //fillUpForm
        this.initForm();
        this.edit_dialog_visible = true;
        this.dbClusterEdit.id = row.id;
        row.alarm_sms === '' ? this.dbClusterEdit.alarm_sms = '' : this.dbClusterEdit.alarm_sms = row.alarm_sms.split(',').map(x => String(x));
        this.dbClusterEdit.app_id = row.app_id;
        row.manager === '' ? this.dbClusterEdit.manager = '' : this.dbClusterEdit.manager = row.manager.split(',').map(x => String(x));
        this.dbClusterEdit.cluster_name = row.cluster_name;
        this.dbClusterEdit.comments = row.comments;
        row.jingli === '' ? this.dbClusterEdit.jingli = '' : this.dbClusterEdit.jingli = row.jingli.split(',').map(x => String(x));
        this.dbClusterEdit.department = row.department;
        this.dbClusterEdit.db_type = row.db_type;
        this.dbClusterEdit.copy_type = row.copy_type;
        this.dbClusterEdit.config_info = row.config_info;
        this.dbClusterEdit.channel_dict = JSON.parse(JSON.stringify(row.channel_dict));
        this.dbClusterEdit.channel_keys = Object.keys(row.channel_dict);
        this.dbClusterEdit.enable = row.enable;
        this.dbTypeChanged(row.db_type)
      },
      editConfirm() {
        let str_err = this.validBeforeConfirm();
        if (str_err === '') {
          let obj = {...this.dbClusterEdit};
          obj.alarm_sms = obj.alarm_sms ? obj.alarm_sms.join() : obj.alarm_sms;
          obj.manager = obj.manager ? obj.manager.join() : obj.manager;
          editDbCluster(this.dbClusterEdit.id, obj).then(response => {
            if (response.error) {
              this.$notify({title: '失败', message: response.error, type: 'error', duration: 6000})
            } else {
              this.$notify({title: '成功', message: '修改成功', type: 'success', duration: 3000});
              this.getList();
              this.edit_dialog_visible = false
            }
          })
        } else {
          this.$message.error('表单填写有误！');
        }
      },
      handleBatchDelete(row) {
        var msg = '确定删除该集群信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteDbCluster(row.id).then(response => {
            if (response.error) {
              this.$notify({title: '删除失败', message: response.error, type: 'warning', duration: 3000})
            } else {
              this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 3000})
            }
            this.getList()
          })
        }, () => {
          return false
        })
      },
      getList() {
        this.listLoading = true;
        let dic = {...this.listQuery};
        fetchDbCluster(dic).then(response => {
          this.list = response.results;
          this.total = response.count;
          for (let i of this.list) {
            i.in_double_line = true
          }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getUserConfList() {
        getUserConf().then(response => {
          const mobileOption = [];
          for (const i of response) {
            mobileOption.push({
              display_name: i.mobile, key: i.user_name + i.uuid
            })
          }
          this.mobileOptions = mobileOption
        })
      },
      getDb() {
        fetchZabbixDb().then(res => {
          this.dbCluster = res
        })
      },
      handleFilter(listQuery) {
        this.listQuery.page = 1;
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
          cluster_name: undefined,
          db_type: undefined,
          copy_type: undefined,
          client_ip: undefined,
          ip: []
        }
      }
    },
  }

</script>
<style>
  .xxxwwww .el-table__header-wrapper th {
    background: #ecf0f5;
  }

  .pre_class {
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }

  .coll .el-collapse-item__header {
    color: #1890ff;
    background-color: rgba(250, 250, 250, 0);
  }

  .ip_sss {
    background-color: rgba(250, 250, 250, 0);
  }

  .ip_sss .el-collapse-item__wrap {
    background-color: rgba(250, 250, 250, 0);
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

  .el-table--border .xxxwwww {
    border-color: #A3D3FF;
  }

  .double_line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .one_line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .not_double_line {
    display: inline;
  }

  .cell pre {
    margin-top: 0;
    margin-bottom: 0;
    /*margin-left: -8px*/
  }

  .field {
    padding-top: 11px;
    border: 1px solid #1890ff;
    margin-bottom: 10px;
  }

  .field .el-row:first-child {
    margin-bottom: 15px;
  }

  .db_cluster_detail_table .el-table {
    border: 1px solid lightsteelblue;
    border-radius: 0px 7px 7px 7px;
    margin-bottom: 10px;
  }

  div[aria-label="对应IP"] > .el-message-box, div[aria-label="应用名"] > .el-message-box {
    max-height: 800px;
  }

  div[aria-label="对应IP"] p, div[aria-label="应用名"] p {
    overflow-y: scroll;
    max-height: 660px;
  }

  .channel_name {
    position: relative;
    top: 1px;
    z-index: 9999;
    background-color: #A3D3FF;
    border: solid 1px lightsteelblue;
    height: 26px;
    border-bottom-width: 0;
    width: 200px;
    overflow-x: visible;
    overflow-y: visible;
    border-radius: 7px 7px 0px 0px;
    text-align: center;
  }

  .not_radius {
    position: relative;
    top: 8px;
    left: -5px;
    display: inline-block;
    width: 10px;
    height: 10px;
    border: solid 1px lightsteelblue;
    border-top-width: 0;
    border-right-width: 0;
    border-radius: 0px 0px 0px 3px;
    z-index: 99999;
  }
</style>
