<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="tabSwitching">
      <el-tab-pane label="待办申请单" name="first">
        <div class="filter-container">
          <el-form ref="listQuery" :model="listQuery" :inline="true">
            <el-form-item prop="step_line">
              <el-select
                v-model="listQuery.step_line"
                placeholder="申请单类型"
                filterable
                clearable
                class="filter-item"
                style="width: 100%"
                @change="getList">
                <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="create_user_id">
              <el-select
                v-model="listQuery.create_user_id"
                filterable
                clearable
                placeholder="申请人姓名"
                style="width: 100%;"
                @change="getList">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="uuid">
              <el-input v-model.trim="listQuery.uuid" placeholder="申请单号精确查找" style="width: 200px;" clearable
                        class="filter-item"
                        @blur="getList" @clear="getList"/>
            </el-form-item>
            <el-form-item prop="search">
              <el-input v-model="listQuery.search" clearable placeholder="模糊搜索" style="width: 200px;"
                        class="filter-item"
                        @clear="getList" @blur="getList"/>
            </el-form-item>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-refresh" style="margin-left: 10px;" plain @click="handleReset">重置</el-button>
            <el-button class="filter-item" type="success" icon="el-icon-check" plain :disabled="selected_rows.length === 0" @click="agreeClick">批量同意</el-button>
            <el-button class="filter-item" type="danger" icon="el-icon-close" plain :disabled="selected_rows.length === 0" @click="noagreeClick">批量驳回</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-refresh-right" plain :disabled="selected_rows.length === 0" @click="selfClick">批量撤回</el-button>
            <!-- <el-button class="filter-item" type="primary" @click="anotherperson=true;">委托办理</el-button> -->
            <el-button class="filter-item" type="primary" @click="anotherperson2=true;">委托办理</el-button>
          </el-form>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          stripe
          highlight-current-row
          style="width: 100%;"
          @selection-change="SelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="标题" min-width="200px" prop="title" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" @click="handleDetail(scope.row)" style="color: #606266;user-select:unset">
                <span>{{ scope.row | titleText }}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="当前节点" width="130px" prop="node_id_name" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag size="medium" v-if="scope.row.status == 5"><span>沟通询问</span></el-tag>
              <el-tag size="medium" v-else><span>{{ scope.row.node_id_name }}</span></el-tag>
            </template>
          </el-table-column>
          <el-table-column label="当前处理人" width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.next_user }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间/单号" width="150px" prop="create_time" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="line-height: 16px;">
                <span style="display: block;">{{ scope.row.create_time }}</span>
                <div style="color: #8492a6; font-size: 10px">{{ scope.row.uuid }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="135px" prop="update_time" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.update_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批意见" align="center" min-width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="165" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button  v-for="site in scope.row.node_handle" type="text"
                    @click="handleShowHistory(site,scope.row)">{{site['name']}}
              </el-button><el-button type="text" @click="handleDetail(scope.row)">详情</el-button> -->
              <!-- 行内元素 换行会自动添加空白节点,影响前端显示 -->
              <el-button v-for="(site,index) in scope.row.node_handle" type="text" v-if="index < 2" :key="index"
                         @click="handleShowHistory(site,scope.row)">{{site['name']}}
              </el-button><el-button
                type="text" @click="handleDetail(scope.row)">详情
              </el-button><el-dropdown><el-button
                  type="text" style="margin-left: 10px;">更多
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(site,index) in scope.row.node_handle" v-if="index > 1"
                                    @click.native="handleShowHistory(site,scope.row)">{{site.name}}</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.node_handle[0].name == '同意'"
                                    @click.native="handleShowother(scope.row,scope.row.node_handle[0].ID)">转办</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.node_handle[0].name == '同意'"
                                    @click.native="updateCommon4(scope.row,scope.row.node_handle[0].ID)">认领</el-dropdown-item>
                  <el-dropdown-item @click.native="handleding(scope.row)">督办提醒</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
      </el-tab-pane>
      <el-tab-pane label="我发起的申请" name="second">
        <div class="filter-container">
          <el-form ref="listQueryMyh" :model="listQueryMyh" :inline="true">
            <el-form-item prop="step_line">
              <el-select
                v-model="listQueryMyh.step_line"
                placeholder="申请单类型"
                filterable
                clearable
                class="filter-item"
                style="width: 100%"
                @change="getListMyHistory">
                <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="search">
              <el-input v-model="listQueryMyh.search" placeholder="模糊搜索" clearable style="width: 200px;"
                        class="filter-item"
                        @clear="getListMyHistory" @blur="getListMyHistory"/>
            </el-form-item>
            <el-form-item prop="opr_time_s">
              <el-date-picker
                v-model="listQueryMyh.opr_time_s"
                class="filter-item"
                align="right"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getListMyHistory"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>

            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterMyh">搜索</el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              plain
              icon="el-icon-refresh"
              @click="handleResetMyh">重置
            </el-button>
          </el-form>
        </div>
        <el-table
          v-loading="listLoading"
          :data="listMyh"
          border
          stripe
          highlight-current-row
          style="width: 100%;">
          <el-table-column label="标题" min-width="200px" prop="title" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" @click="handleDetail(scope.row)" style="color: #606266;user-select:unset">
                <span>{{ scope.row | titleText }}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="当前节点" width="130px" prop="node_id_name" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag size="medium"><span>{{ scope.row.node_id_name }}</span></el-tag>
            </template>
          </el-table-column>
          <el-table-column label="当前处理人" width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.next_user }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间/单号" width="150px" prop="create_time" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="line-height: 16px;">
                <span style="display: block;">{{ scope.row.create_time }}</span>
                <div style="color: #8492a6; font-size: 10px">{{ scope.row.uuid }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="135px" prop="update_time" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.update_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批意见" align="center" min-width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="50" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="totalMyh>0" :total="totalMyh" :page.sync="listQueryMyh.page"
                    :limit.sync="listQueryMyh.limit"
                    @pagination="getListMyHistory"/>
      </el-tab-pane>
      <el-tab-pane label="我的草稿单" name="third">
        <div class="filter-container">
          <el-form ref="listQuery3" :model="listQuery3" :inline="true">
            <el-form-item prop="step_line">
              <el-select
                v-model="listQuery3.step_line"
                placeholder="申请单类型"
                filterable
                clearable
                class="filter-item"
                style="width: 100%"
                @change="getList3">
                <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="search">
              <el-input v-model="listQuery3.search" placeholder="模糊搜索" style="width: 200px;" clearable
                        class="filter-item"
                        @clear="getList3" @blur="getList3"/>
            </el-form-item>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter3">搜索</el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              plain
              icon="el-icon-refresh"
              @click="handleReset3">重置
            </el-button>
          </el-form>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list3"
          border
          stripe
          highlight-current-row
          style="width: 100%;">
          <el-table-column label="标题" min-width="200px" prop="title" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" @click="handleDetail(scope.row)" style="color: #606266;user-select:unset">
              <span>{{ scope.row | titleText}}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="当前节点" width="120px" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag size="medium">
                <span v-if="scope.row.status == '1'">草稿</span>
                <span v-else-if="scope.row.status == '4'">打回再提交</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="申请时间/单号" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="line-height: 16px;">
                <span style="display: block;">{{ scope.row.create_time }}</span>
                <div style="color: #8492a6; font-size: 10px">{{ scope.row.uuid }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="135px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.update_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批意见" align="center" min-width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="130" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- 行内元素 换行会自动添加空白节点,影响前端显示 -->
              <el-button type="text" @click="handleEdit(scope.row)">修改
              </el-button><el-button type="text" @click="handleDetail(scope.row)">详情
              </el-button><el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total3>0" :total="total3" :page.sync="listQuery3.page" :limit.sync="listQuery3.limit"
                    @pagination="getList3"/>
      </el-tab-pane>
      <el-tab-pane label="我审批的申请" name="four">
        <div class="filter-container">
          <el-form ref="listQuery2" :model="listQuery2" :inline="true">
            <el-form-item prop="step_line">
              <el-select
                v-model="listQuery2.step_line"
                placeholder="申请单类型"
                filterable
                clearable
                class="filter-item"
                style="width: 100%"
                @change="getList2">
                <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="create_user_id">
              <el-select
                v-model="listQuery2.create_user_id"
                filterable
                clearable
                placeholder="申请人姓名"
                style="width: 100%;"
                @change="getList2">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="operlog_name">
              <el-select
                v-model="listQuery2.operlog_name"
                filterable
                clearable
                placeholder="审批人姓名"
                style="width: 100%;"
                @change="getList2">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="uuid">
              <el-input v-model.trim="listQuery2.uuid" placeholder="申请单号精确查找" style="width: 200px;" clearable
                        class="filter-item"
                        @clear="getList2" @blur="getList2"/>
            </el-form-item>
            <el-form-item prop="search">
              <el-input v-model="listQuery2.search" placeholder="模糊搜索" style="width: 200px;" clearable
                        class="filter-item"
                        @clear="getList2" @blur="getList2"/>
            </el-form-item>
            <el-form-item prop="opr_time_s">
              <el-date-picker
                v-model="listQuery2.opr_time_s"
                class="filter-item"
                align="right"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getList2"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>

            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter2">搜索</el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              plain
              icon="el-icon-refresh"
              @click="handleReset2">重置
            </el-button>
            <el-button class="filter-item" type="primary" plain icon="el-icon-download" @click="dialogdownload = true">导出</el-button>
          </el-form>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list2"
          border
          stripe
          :default-sort ="{prop:'update_time',order:'descending'}"
          highlight-current-row
          style="width: 100%;">
          <el-table-column label="标题" min-width="200px" prop="title" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <!--              <span>{{ scope.row.title }}</span>-->
              <el-button type="text" @click="handleDetail(scope.row)" style="color: #606266;user-select:unset">
                <span>{{ scope.row | titleText}}</span>
              </el-button>
              <i v-show="scope.row.is_attachment" class="el-icon-paperclip"></i>
            </template>
          </el-table-column>
          <el-table-column label="当前节点" width="130px" prop="node_id_name" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- status 为0待审批 为1草稿/撤回  为2删除  为3审批完成/驳回 为4打回 -->
              <el-tag size="medium" v-if="scope.row.status == 1"><span>草稿</span></el-tag>
              <el-tag size="medium" v-else-if="scope.row.status == 2"><span>已删除</span></el-tag>
              <el-tag size="medium" v-else-if="scope.row.status == 4"><span>打回再提交</span></el-tag>
              <el-tag size="medium" v-else-if="scope.row.status == 5"><span>沟通询问</span></el-tag>
              <el-tag size="medium" v-else><span>{{ scope.row.node_id_name }}</span></el-tag>
            </template>
          </el-table-column>
          <el-table-column label="当前处理人" width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.next_user }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间/单号" width="150px" prop="create_time" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="line-height: 16px;">
                <span style="display: block;">{{ scope.row.create_time }}</span>
                <div style="color: #8492a6; font-size: 10px">{{ scope.row.uuid }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="135px" prop="update_time" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.update_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批意见" align="center" min-width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span type="success">{{ scope.row.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="50" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total2>0" :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.limit"
                    @pagination="getList2"/>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="确认框"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="dialogClose">
      <el-form ref="ackForm" :rules="rules" :model="ackForm">
        <el-form-item label="请输入审批意见" prop="comments" required>
          <el-input v-model="ackForm.comments" type="textarea"/>
        </el-form-item>
        <el-form-item v-if="ackForm.hand_name == '沟通'" label="沟通对象" prop="uuid_user" required>
          <el-select v-model="ackForm.uuid_user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ackForm.hand_name == '转办'" label="转办对象" prop="user" required>
          <el-select v-model="ackForm.user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/dev-api/workflow/workflow_upload_file_first"
            :http-request="myUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleChange"
            :before-upload="beforeUpload"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="ackForm.file_json">
            <el-button size="small" type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">可上传附件，且单个文件不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-tooltip v-if="ackForm.hand_name == '驳回'" content="重新提交可回到当前节点" placement="top">
          <el-button v-if="ackForm.hand_name == '驳回'" type="primary" @click="updateCommon2('ackForm')" :loading="buttondisabled">打回再提交</el-button>
        </el-tooltip>
        <el-button @click="dialogClose">取 消</el-button>
        <el-button v-if="ackForm.hand_name == '沟通' || ackForm.hand_name == '回复'" type="primary"
                   @click="updateCommon3('ackForm')" :loading="buttondisabled">确 定</el-button>
        <el-button v-else-if="ackForm.hand_name !== '驳回'" type="primary" @click="updateCommon('ackForm')" :loading="buttondisabled">确 定</el-button>
        <el-tooltip v-if="ackForm.hand_name == '驳回'" content="驳回后该申请单将关闭不能再提交" placement="top">
          <el-button v-if="ackForm.hand_name == '驳回'" type="primary" @click="updateCommon('ackForm')" :loading="buttondisabled">驳 回</el-button>
        </el-tooltip>
      </div>
    </el-dialog>
    <el-dialog title="委托办理" :visible.sync="anotherperson" width="30%" :before-close="anotheroneclose">
      <el-form ref="anotherone" :rules="rules" :model="anotherone" label-width="100px">
        <el-form-item label="工单类型" prop="step_line" :rules="{required: true, message: '请选择工单类型', trigger: 'change'}">
          <el-select v-model="anotherone.step_line" filterable clearable placeholder="请选择工单类型" style="width: 100%">
            <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托对象" prop="entrust_user" :rules="{required: true, message: '请选择委托对象', trigger: 'change'}">
          <el-select v-model="anotherone.entrust_user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="anotheroneclose">取 消</el-button>
        <el-button type="primary" @click="anotheronetodo('anotherone')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="委托办理" :visible.sync="anotherperson2" width="30%" :before-close="anotheroneclose2">
      <el-form ref="anotherone2" :rules="rules" :model="anotherone2" label-width="100px">
        <el-form-item label="工单类型" prop="step_line" :rules="{required: true, message: '请选择工单类型', trigger: 'change'}">
          <el-select v-model="anotherone2.step_line" filterable clearable placeholder="请选择工单类型" style="width: 100%">
            <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="resetentrust.indexOf(anotherone2.step_line)==-1 || anotherone2.step_line==undefined"
          label="委托对象" prop="entrust_user" :rules="{required: true, message: '请选择委托对象', trigger: 'change'}">
          <el-select v-model="anotherone2.entrust_user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="resetentrust.indexOf(anotherone2.step_line)==-1 || anotherone2.step_line==undefined" label="截至时间" prop="deadline_time">
          <el-date-picker v-model="anotherone2.deadline_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="默认为两周" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="anotheroneclose2">取 消</el-button>
        <el-button type="primary" v-if="resetentrust.indexOf(anotherone2.step_line)!==-1" @click="anotheronetodo2no('anotherone2')">取消委托</el-button>
        <el-button type="primary" v-else @click="anotheronetodo2yes('anotherone2')">委托办理</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导出" :visible.sync="dialogdownload" width="30%" :before-close="downloadclose">
      <el-form ref="downloaddata" :rules="rules" :model="downloaddata">
        <el-form-item label="工单类型" prop="step_line" :rules="{required: true, message: '请选择工单类型', trigger: 'change'}">
          <!-- <el-select v-model="downloaddata.step_line" filterable clearable placeholder="请选择工单类型" style="width: 100%">
            <el-option v-for="item in step_line" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select> -->
          <el-radio-group v-model="downloaddata.step_line" v-for="item in step_line">
            <el-radio v-if="item.url=='/workflow/app_expansion_apply'" :label="item.id" style="margin-right: 30px;">{{item.name}}</el-radio>
            <el-radio v-if="item.url=='/workflow/app_expansion_offline'" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据类型" prop="data_type" :rules="{required: true, message: '请选择数据类型', trigger: 'change'}">
          <el-radio-group v-model="downloaddata.data_type">
            <el-radio :label="1">我参与的工单</el-radio>
            <el-radio :label="2">待我审批工单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申请时间" prop="time_range">
          <el-date-picker v-model="downloaddata.time_range" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadclose">取 消</el-button>
        <el-button type="primary" @click="getdownloaddata('downloaddata')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getWorkFlows, getWorkFlowsHistory, getDraftsWorkFlows, getWorkFlowsMyHistory,
    deleteWorkFlowConfRow, handleWorkFlow, getWorkflowline, getnotice
  } from '@/api/workflow/app_manage'
  import {getWorkFlowLine,workflownodesentrust,get_workflowdata,get_workflownodesentrust,post_workflownodesentrust} from '@/api/workflow/app_line'
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'
  import resize from '@/components/Charts/mixins/resize'
  import {getUserInfo} from '@/api/zabbix/user_info'
  import {getLoginUser} from '@/api/cmdb'
  // import moment from 'moment'

  export default {
    name: 'workflowApprovalxxx',
    components: {Pagination},
    directives: {waves},
    mixins: [resize],
    data() {
      return {
        activeName: 'first',
        selected_rows:[],
        selected_rows_handleid:[],
        // name: undefined,
        // introduction: undefined,
        listQuery: {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          uuid: undefined,
          search: undefined,
        },
        listQuery2: {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          operlog_name:undefined,
          uuid: undefined,
          search: undefined,
          opr_time_s: undefined,
        },
        listQuery3: {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          uuid: undefined,
          search: undefined,
        },
        listQuery4: {
          page: 1,
          limit: 20,
          name: undefined,
        },
        listQueryMyh: {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          uuid: undefined,
          search: undefined,
          opr_time_s: undefined,
        },
        ackForm: {
          comments: '',
          uuid_user: '',
          user:'',
          file_json: [],
        },
        anotherone:{
          step_line:undefined,
          entrust_user:'',
        },
        downloaddata:{
          step_line:undefined,
          data_type:undefined,
          time_range:[],
        },
        dialogdownload:false,
        list: [],
        list2: [],
        list3: [],
        listMyh: [],
        total: 0,
        total2: 0,
        total3: 0,
        totalMyh: 0,
        buttondisabled:false,
        listLoading: true,
        dialogFormVisible: false,
        anotherperson:false,
        anotherperson2:false,
        anotherone2:{
          step_line:undefined,
          entrust_user:'',
          deadline_time:'',
        },
        resetentrust:[],
        step_line: [],
        userOptions: [],
        username:'',
        rules: {
          comments: [
            {required: true, message: '请输入审批意见', trigger: 'blur'}, ,
            {min: 2, max: 250, message: '长度在 2 到 250个字符之间', trigger: 'blur'},
          ],
          uuid_user: [
            {required: true, message: '请选择沟通对象', trigger: 'blur'},
          ],
          user: [
            {required: true, message: '请选择转办对象', trigger: 'blur'},
          ],
        },
      };
    },
    created() {
      this.setDialogWidth()
      getWorkFlowLine().then(response => {
        this.step_line = response
      })
      getUserInfo().then(response => {
        this.userOptions = response
      });
      getLoginUser().then(response => {
        this.username = response.username;
      })
      // 获取搜索条件 step_line由string变number
      // this.listQuery.step_line = sessionStorage.getItem('step_line1')
      this.listQuery.step_line = Number(sessionStorage.getItem('step_line1')) || sessionStorage.getItem('step_line1')
      this.listQuery.create_user_id = sessionStorage.getItem('create_user_id1')
      this.listQuery.uuid = sessionStorage.getItem('uuid1')
      this.listQuery.search = sessionStorage.getItem('search1')
      // this.listQueryMyh.step_line = sessionStorage.getItem('step_line2')
      this.listQueryMyh.step_line = Number(sessionStorage.getItem('step_line2')) || sessionStorage.getItem('step_line2')
      this.listQueryMyh.create_user_id = sessionStorage.getItem('create_user_id2')
      this.listQueryMyh.uuid = sessionStorage.getItem('uuid2')
      this.listQueryMyh.search = sessionStorage.getItem('search2')
      this.listQueryMyh.opr_time_s = sessionStorage.getItem('opr_time_s2')?sessionStorage.getItem('opr_time_s2').split(','):sessionStorage.getItem('opr_time_s2')
      // this.listQuery3.step_line = sessionStorage.getItem('step_line3')
      this.listQuery3.step_line = Number(sessionStorage.getItem('step_line3')) || sessionStorage.getItem('step_line3')
      this.listQuery3.create_user_id = sessionStorage.getItem('create_user_id3')
      this.listQuery3.uuid = sessionStorage.getItem('uuid3')
      this.listQuery3.search = sessionStorage.getItem('search3')
      // this.listQuery2.step_line = sessionStorage.getItem('step_line4')
      this.listQuery2.step_line = Number(sessionStorage.getItem('step_line4')) || sessionStorage.getItem('step_line4')
      this.listQuery2.create_user_id = sessionStorage.getItem('create_user_id4')
      this.listQuery2.operlog_name = sessionStorage.getItem('operlog_name4')
      this.listQuery2.uuid = sessionStorage.getItem('uuid4')
      this.listQuery2.search = sessionStorage.getItem('search4')
      this.listQuery2.opr_time_s = sessionStorage.getItem('opr_time_s4')?sessionStorage.getItem('opr_time_s4').split(','):sessionStorage.getItem('opr_time_s4')
      this.getList()
      this.getList2()
      this.getList3()
      this.getListMyHistory()
      // this.name = this.$store.getters.name
      // this.introduction = this.$store.getters.introduction
    },
    beforeUpdate() {
      this.activeName = sessionStorage.getItem('activeName')
      if (!this.activeName) {
        this.activeName = 'first'
      }
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.setDialogWidth()
        })
      }
    },
    watch: { // 监听搜索条件 会话缓存
      listQuery: {//深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          if (this.listQuery.step_line !== undefined && this.listQuery.step_line !== null) {
            sessionStorage.setItem("step_line1", this.listQuery.step_line);
          }
          if (this.listQuery.create_user_id !== undefined && this.listQuery.create_user_id !== null) {
            sessionStorage.setItem("create_user_id1", this.listQuery.create_user_id);
          }
          if (this.listQuery.uuid !== undefined && this.listQuery.uuid !== null) {
            sessionStorage.setItem("uuid1", this.listQuery.uuid);
          }
          if (this.listQuery.search !== undefined && this.listQuery.search !== null) {
            sessionStorage.setItem("search1", this.listQuery.search);
          }
        },
        deep: true //true 深度监听
      },
      listQueryMyh: {//深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          if (this.listQueryMyh.step_line !== undefined && this.listQueryMyh.step_line !== null) {
            sessionStorage.setItem("step_line2", this.listQueryMyh.step_line);
          }
          if (this.listQueryMyh.create_user_id !== undefined && this.listQueryMyh.create_user_id !== null) {
            sessionStorage.setItem("create_user_id2", this.listQueryMyh.create_user_id);
          }
          if (this.listQueryMyh.uuid !== undefined && this.listQueryMyh.uuid !== null) {
            sessionStorage.setItem("uuid2", this.listQueryMyh.uuid);
          }
          if (this.listQueryMyh.search !== undefined && this.listQueryMyh.search !== null) {
            sessionStorage.setItem("search2", this.listQueryMyh.search);
          }
          if (this.listQueryMyh.opr_time_s !== undefined && this.listQueryMyh.opr_time_s !== null) {
            sessionStorage.setItem("opr_time_s2", this.listQueryMyh.opr_time_s);
          } else {
            sessionStorage.removeItem("opr_time_s2");
          }
        },
        deep: true //true 深度监听
      },
      listQuery3: {//深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          if (this.listQuery3.step_line !== undefined && this.listQuery3.step_line !== null) {
            sessionStorage.setItem("step_line3", this.listQuery3.step_line);
          }
          if (this.listQuery3.create_user_id !== undefined && this.listQuery3.create_user_id !== null) {
            sessionStorage.setItem("create_user_id3", this.listQuery3.create_user_id);
          }
          if (this.listQuery3.uuid !== undefined && this.listQuery3.uuid !== null) {
            sessionStorage.setItem("uuid3", this.listQuery3.uuid);
          }
          if (this.listQuery3.search !== undefined && this.listQuery3.search !== null) {
            sessionStorage.setItem("search3", this.listQuery3.search);
          }
        },
        deep: true //true 深度监听
      },
      listQuery2: {//深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          if (this.listQuery2.step_line !== undefined && this.listQuery2.step_line !== null) {
            sessionStorage.setItem("step_line4", this.listQuery2.step_line);
          }
          if (this.listQuery2.create_user_id !== undefined && this.listQuery2.create_user_id !== null) {
            sessionStorage.setItem("create_user_id4", this.listQuery2.create_user_id);
          }
          if (this.listQuery2.operlog_name !== undefined && this.listQuery2.operlog_name !== null) {
            sessionStorage.setItem("operlog_name4", this.listQuery2.operlog_name);
          }
          if (this.listQuery2.uuid !== undefined && this.listQuery2.uuid !== null) {
            sessionStorage.setItem("uuid4", this.listQuery2.uuid);
          }
          if (this.listQuery2.search !== undefined && this.listQuery2.search !== null) {
            sessionStorage.setItem("search4", this.listQuery2.search);
          }
          if (this.listQuery2.opr_time_s !== undefined && this.listQuery2.opr_time_s !== null) {
            sessionStorage.setItem("opr_time_s4", this.listQuery2.opr_time_s);
          } else {
            sessionStorage.removeItem("opr_time_s4");
          }
        },
        deep: true //true 深度监听
      },
    },
    methods: {
      downloadclose(){
        this.dialogdownload = false
        this.downloaddata.step_line=undefined
        this.downloaddata.data_type=undefined
        this.downloaddata.time_range=[]
      },
      getdownloaddata(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var formdata = new FormData()
            formdata.append('step_line', this.downloaddata.step_line)
            formdata.append('data_type', this.downloaddata.data_type)
            if (this.downloaddata.time_range.length !== 0) {
              formdata.append('time_range', this.downloaddata.time_range)
            }
            get_workflowdata(formdata).then(res => {
            // get_workflowdata(this.downloaddata).then(res => {
              let blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
              let downloadElement = document.createElement('a');
              let href = window.URL.createObjectURL(blob);
              downloadElement.href = href;
              downloadElement.download = `导出表格.xls`;
              document.body.appendChild(downloadElement);
              downloadElement.click();
              document.body.removeChild(downloadElement);
              window.URL.revokeObjectURL(href);
              this.$message.success('导出成功');
              this.downloadclose()
            })
          }
        })
      },
      anotheronetodo(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            workflownodesentrust(this.anotherone).then(response => {
              this.$notify({
                title: '成功',
                message: '委托成功',
                type: 'success',
                duration: 3000
              })
              this.anotheroneclose()
              this.getList()
            }).catch(error => {
              this.$notify({
                title: '失败',
                message: '委托失败',
                type: 'error',
                duration: 3000
              })
            })
          }
        })
      },
      anotheronetodo2yes(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            post_workflownodesentrust(this.anotherone2).then(response => {
              this.$notify({
                title: '成功',
                // message: '委托成功',
                message: response.msg,
                type: 'success',
                duration: 3000
              })
              this.anotheroneclose2()
              this.getList()
            }).catch(error => {
              this.$notify({
                title: '失败',
                // message: '委托失败',
                message: response.msg,
                type: 'error',
                duration: 3000
              })
            })
          }
        })
      },
      anotheronetodo2no(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            post_workflownodesentrust({step_line:this.anotherone2.step_line}).then(response => {
              this.$notify({
                title: '成功',
                // message: '委托成功',
                message: response.msg,
                type: 'success',
                duration: 3000
              })
              this.anotheroneclose2()
              this.getList()
            }).catch(error => {
              this.$notify({
                title: '失败',
                // message: '委托失败',
                message: response.msg,
                type: 'error',
                duration: 3000
              })
            })
          }
        })
      },
      anotheroneclose(){
        this.anotherperson = false
        this.anotherone.step_line = undefined
        this.anotherone.entrust_user = ''
      },
      anotheroneclose2(){
        this.anotherperson2 = false
        this.anotherone2.step_line = undefined
        this.anotherone2.entrust_user = ''
        this.anotherone2.deadline_time = ''
      },
      handleding(row) {
        getnotice({uuid:row.uuid}).then(response => {
          this.$notify({
            title: '成功',
            message: '提醒成功',
            type: 'success',
            duration: 3000
          })
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '提醒失败',
            type: 'error',
            duration: 3000
          })
        })
      },
      setDialogWidth() {
        // console.log(document.body.clientWidth)
        var val = document.body.clientWidth
        const def = 800 // 默认宽度
        if (val < def) {
          this.dialogWidth = '100%'
        } else {
          this.dialogWidth = def + 'px'
        }
      },
      dialogClose() {
        // this.ackForm.comments = ''
        // this.ackForm.uuid_user = ''
        // this.ackForm.user = ''
        // this.ackForm.file_json = []
        // this.ackForm.piliang = false
        // this.ackForm.status = undefined
        this.ackForm = {
          comments: '',
          uuid_user: '',
          user:'',
          file_json: [],
        },
        this.dialogFormVisible = false
      },
      //重置 待办
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          uuid: undefined,
          search: undefined,
        }
        sessionStorage.removeItem("step_line1");
        sessionStorage.removeItem("create_user_id1");
        sessionStorage.removeItem("uuid1");
        sessionStorage.removeItem("search1");
      },
      // 重置历史申请单搜索条件
      handleReset2() {
        this.resetlistQuery2()
        this.getList2()
      },
      resetlistQuery2() {
        this.listQuery2 = {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          uuid: undefined,
          search: undefined,
        }
        sessionStorage.removeItem("step_line4");
        sessionStorage.removeItem("create_user_id4");
        sessionStorage.removeItem("operlog_name4");
        sessionStorage.removeItem("uuid4");
        sessionStorage.removeItem("search4");
        sessionStorage.removeItem("opr_time_s4");
      },
      // 重置草稿搜索条件
      handleReset3() {
        this.resetlistQuery3()
        this.getList3()
      },
      resetlistQuery3() {
        this.listQuery3 = {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          uuid: undefined,
          search: undefined,
        }
        sessionStorage.removeItem("step_line3");
        sessionStorage.removeItem("create_user_id3");
        sessionStorage.removeItem("uuid3");
        sessionStorage.removeItem("search3");
      },
      // 重置我发起搜索条件
      handleResetMyh() {
        this.resetlistQueryMyh()
        this.getListMyHistory()
      },
      resetlistQueryMyh() {
        this.listQueryMyh = {
          page: 1,
          limit: 20,
          step_line: undefined,
          create_user_id: undefined,
          uuid: undefined,
          search: undefined,
        }
        sessionStorage.removeItem("step_line2");
        sessionStorage.removeItem("create_user_id2");
        sessionStorage.removeItem("uuid2");
        sessionStorage.removeItem("search2");
        sessionStorage.removeItem("opr_time_s2");
      },
      piliangupdate(i){
        if (this.selected_rows_handleid[i] !== undefined) {
            handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
                           hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name}).then(response => {
                             // this.getList()
                             // this.ackForm.file_json = []
                             // this.ackForm.piliang = false
                             this.$notify({
                               title: '成功',
                               // message: '审批成功',
                               type: 'success',
                               duration: 3000
                             })
                             i=i+1
                             if (i < this.selected_rows.length) {
                               this.piliangupdate(i)
                             } else{
                               this.getList()
                               this.ackForm.file_json = []
                               this.ackForm.piliang = false
                             }
                           })
          }
      },
      // 审批意见 更新
      updateCommon(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            if (this.ackForm.piliang == true) {
              // for (var i = 0; i < this.selected_rows.length; i++) {
              //   if (this.selected_rows_handleid[i] !== undefined) {
              //     handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
              //                    hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name}).then(response => {
              //                      this.getList()
              //                      this.ackForm.file_json = []
              //                      this.ackForm.piliang = false
              //                    })
              //   }
              // }
              this.piliangupdate(0)
            } else{
              handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
                this.getList()
                // this.$refs[formName].resetFields();
                this.ackForm.file_json = []
                this.ackForm.user = ''
              })
            }
            this.dialogFormVisible = false
          }
        })
      },
      piliangupdate2(i){
        if (this.selected_rows_handleid[i] !== undefined) {
            handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
                           hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name,status:4}).then(response => {
                             this.$notify({
                               title: '成功',
                               // message: '审批成功',
                               type: 'success',
                               duration: 3000
                             })
                             i=i+1
                             if (i < this.selected_rows.length) {
                               this.piliangupdate2(i)
                             } else{
                               this.getList()
                               this.ackForm.file_json = []
                               this.ackForm.piliang = false
                             }
                           })
          }
      },
      // 打回再提交  status=4
      updateCommon2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            if (this.ackForm.piliang == true) {
              // for (var i = 0; i < this.selected_rows.length; i++) {
              //   if (this.selected_rows_handleid[i] !== undefined) {
              //     handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
              //                    hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name,status:4}).then(response => {
              //                      this.getList()
              //                      this.ackForm.file_json = []
              //                      this.ackForm.piliang = false
              //                    })
              //   }
              // }
              this.piliangupdate2(0)
            } else{
              handleWorkFlow(this.ackForm.uuid, {comments:this.ackForm.comments,file_json:this.ackForm.file_json,
                            hand_id:this.ackForm.hand_id,hand_name:this.ackForm.hand_name,status:4}).then(response => {
                this.getList()
                // this.$refs[formName].resetFields();
                this.ackForm.file_json = []
              })
            }
            this.dialogFormVisible = false
          }
        })
      },
      // 沟通  status=5  回复 status=0
      updateCommon3(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            if (this.ackForm.hand_name == '沟通') {
              // this.ackForm.status = 5
            } else {
              this.ackForm.status = 0
            }
            handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
              this.getList()
              // this.$refs[formName].resetFields();
              this.ackForm.file_json = []
              this.ackForm.uuid_user = ''
              this.ackForm.status = undefined
            })
            this.dialogFormVisible = false
          }
        })
      },
      updateCommon4(row,id) {
        this.ackForm.uuid = row.uuid
        this.ackForm.hand_id = id
        this.ackForm.hand_name = '认领'
        this.ackForm.comments = '认领'
        this.ackForm.user = this.username
        handleWorkFlow(this.ackForm.uuid, this.ackForm).then(response => {
          this.getList()
          this.ackForm.user = ''
        })
      },
      //表格数据
      getList() {
        this.listLoading = true
        getWorkFlows(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          this.listLoading = false
        })
        get_workflownodesentrust().then(response => {
          this.resetentrust = response.entrusted;
        })
      },
      getList2() {
        this.listLoading = true
        getWorkFlowsHistory(this.listQuery2).then(response => {
          this.list2 = response.results
          this.total2 = response.count
          this.listLoading = false
        })
      },
      getListMyHistory() {
        this.listLoading = true
        getWorkFlowsMyHistory(this.listQueryMyh).then(response => {
          this.listMyh = response.results
          this.totalMyh = response.count
          this.listLoading = false
        })
      },
      getList3() {
        this.listLoading = true
        getDraftsWorkFlows(this.listQuery3).then(response => {
          this.list3 = response.results
          this.total3 = response.count
          this.listLoading = false
        })
      },
      // 搜索功能
      handleFilter(listQuery) {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      handleFilter2(listQuery2) {
        this.listQuery2.page = 1
        this.$refs['listQuery2'].validate((valid) => {
          if (valid) {
            this.getList2()
          }
        })
      },
      handleFilter3(listQuery3) {
        this.listQuery3.page = 1
        this.$refs['listQuery3'].validate((valid) => {
          if (valid) {
            this.getList3()
          }
        })
      },
      handleFilterMyh(listQueryMyh) {
        this.listQueryMyh.page = 1
        this.$refs['listQueryMyh'].validate((valid) => {
          if (valid) {
            this.getListMyHistory()
          }
        })
      },
      // 按钮审批
      handleShowHistory(ss, row) {
        this.ackForm.uuid = row.uuid
        this.ackForm.hand_id = ss.ID
        this.ackForm.hand_name = ss.name
        if (ss.name == '回复') {
          this.ackForm.comments = '回复：同意'
        } else if(ss.name == '同意') {
          this.ackForm.comments = '已确认并同意'
        } else {
          this.ackForm.comments = ss.name
        }
        // this.ackForm.comments = ss.name
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      //转办
      handleShowother(row,id){
        this.ackForm.uuid = row.uuid
        this.ackForm.hand_id = id
        this.ackForm.hand_name = '转办'
        this.ackForm.comments = '转办'
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      // 修改时将原始信息带出
      handleEdit(row) {
        this.listQuery4.name = row.step_line_name
        getWorkflowline(this.listQuery4).then(response => {
          this.$router.push({
            name: response.results[0].url.split('/')[2],
            params: {uuid: row.uuid, id: response.results[0].id, name: response.results[0].name, detailData_edit: row}
          })
        })
      },
      // 详情
      handleDetail(row) {
        this.listQuery4.name = row.step_line_name
        getWorkflowline(this.listQuery4).then(response => {
          this.$router.push({name: response.results[0].url.split('/')[2] + "_detail", params: {detailData: row}})
        })
      },
      // 删除草稿
      handleDelete(row) {
        var msg = '确认删除该记录吗？'
        // alert(row.uuid)
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteWorkFlowConfRow(row.uuid).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getList3()
          }).catch(error => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 3000
            })
            console.log(error)
          })
        }, () => {
          return false
        })
      },
      tabSwitching() {
        sessionStorage.setItem("activeName", this.activeName);
        this.getList()
        this.getList2()
        this.getList3()
        this.getListMyHistory()
      },
      SelectionChange(val){
        this.selected_rows = val;
        // console.log(this.selected_rows)
      },
      agreeClick(){
        this.ackForm.hand_name = '同意'
        this.ackForm.comments = '同意'
        this.ackForm.piliang = true
        for (var i = 0; i < this.selected_rows.length; i++) {
          for (var j = 0; j < this.selected_rows[i].node_handle.length; j++) {
            this.selected_rows_handleid[i] = undefined
            if (this.selected_rows[i].node_handle[j].name == this.ackForm.hand_name) {
              this.selected_rows_handleid[i] = this.selected_rows[i].node_handle[j].ID
              break
            }
          }
        }
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      noagreeClick(){
        this.ackForm.hand_name = '驳回'
        this.ackForm.comments = '驳回'
        this.ackForm.piliang = true
        for (var i = 0; i < this.selected_rows.length; i++) {
          for (var j = 0; j < this.selected_rows[i].node_handle.length; j++) {
            this.selected_rows_handleid[i] = undefined
            if (this.selected_rows[i].node_handle[j].name == this.ackForm.hand_name) {
              this.selected_rows_handleid[i] = this.selected_rows[i].node_handle[j].ID
              break
            }
          }
        }
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      selfClick(){
        this.ackForm.hand_name = '撤回'
        this.ackForm.comments = '撤回'
        this.ackForm.piliang = true
        for (var i = 0; i < this.selected_rows.length; i++) {
          for (var j = 0; j < this.selected_rows[i].node_handle.length; j++) {
            this.selected_rows_handleid[i] = undefined
            if (this.selected_rows[i].node_handle[j].name == this.ackForm.hand_name) {
              this.selected_rows_handleid[i] = 'cancel'
              break
            }
          }
        }
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      //附件
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.ackForm.file_json = []
        this.ackForm.file_json = fileList
        console.log(this.ackForm.file_json)
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (file.status == 'ready') {
          return
        }
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleChange(response, file, fileList) {
        console.log(file, fileList);
        if (file.status == 'success') {this.buttondisabled = false} //文件上传成功后才能确认
        this.ackForm.file_json = []
        this.ackForm.file_json = fileList
        console.log(this.ackForm.file_json)
      },
      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      },
      //重命名上传，下载时文件名带uuid
      myUpload(content) {
        this.buttondisabled = true //上传顺序 beforeUpload -> myUpload -> handleChange
        var copyFile = new File([content.file], `${this.ackForm.uuid}_${content.file.name}`, {type: content.file.type});
        let formData = new FormData();
        formData.append(content.filename, copyFile);
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/dev-api/workflow/workflow_upload_file_first");
        xhr.send(formData);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            content.onSuccess(JSON.parse(xhr.responseText))
          }
        }
      }
    },
    filters: {
      titleText(row) {
        // return JSON.parse(row.values).fullPath === '/workflow/database_access_application' ? `${row.create_user_name} 【${row.step_line_name}】` : row.title
        // 如果title应用名为空 目前有:数据库接入申请 产品线申请
        return row.title.indexOf('【】')!==-1 ? `${row.create_user_name} 【${row.step_line_name}】` : row.title
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
