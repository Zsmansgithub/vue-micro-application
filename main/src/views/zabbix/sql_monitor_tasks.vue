<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="category">
          <el-input v-model.trim="listQuery.name" placeholder="任务名称" style="width:130px" clearable/>
        </el-form-item>
        <el-form-item prop="category">
          <el-select v-model="listQuery.db_type" placeholder="数据库类别" style="width:130px" @change="searchClick" clearable>
            <el-option v-for="item in DbCategoryDict" :key="item.value" :label="item.label" :value="item.label">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="active">
          <el-select v-model="listQuery.active" placeholder="是否启用" filterable clearable
                     @change="searchClick" style="width: 120px">
            <el-option key="1" label="启用" value="1"/>
            <el-option key="2" label="禁用" value="2"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="ip">
          <el-input v-model.trim="listQuery.ip" placeholder="IP" style="width:160px" clearable/>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        <el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="resetClick">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>
        <el_button_wait :interval="9" type="warning" icon="el-icon-refresh" @click="celeryRestart">重启服务</el_button_wait>
        <el-button style="margin-right: 2px;float:right" type="primary" @click="expandAll">{{ need_expand_all ? '全部展开' : '全部合起' }}</el-button>
        <a style="font-size:15px;color: red;float:right" href="/vue/zabbix/sql任务帮助文档.docx">
          <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
          帮助指引
        </a>
      </el-form>
    </div>

    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="table_data_list" highlight-current-row
              border stripe :row-class-name="tableRowClassName" ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick"
              @expand-change="expandChange" row-key="id" :expand-row-keys="expand_row_keys" :cell-style="cellStyleClass">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="inner_table_class">
            <el-table :data="scope.row.expand_table_data" highlight-current-row tooltip-effect="dark"
                      v-loading="listLoading" :header-cell-style="deviceHeaderClass">
              <el-table-column label="ID" align="center" prop="id" min-width="70px">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="绑定数据库" align="center" prop="database" min-width="220px">
                <template slot-scope="scope">
                  <span>{{ scope.row.database }}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否启用" align="center" prop="active" width="80">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.active===1" size="medium">启用</el-tag>
                  <el-tag v-if="scope.row.active===2" type="danger" size="medium">禁用</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="最后执行时间" align="center" prop="last_execute_time" sortable width="160px">
                <template slot-scope="scope">
                  <span>{{ scope.row.last_execute_time | formatTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="执行状态" align="center" prop="execute_status" width="80px">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.execute_status===1" size="medium">成功</el-tag>
                  <el-tag v-if="scope.row.execute_status===2" size="medium" type="danger">失败</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="执行结果" align="center" prop="result" min-width="220px" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.execute_status===1? scope.row.result : scope.row.error_log }}</span>
                </template>
              </el-table-column>
              <el-table-column label="执行耗时" align="center" prop="result" min-width="80px" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.time_wait !== -1?scope.row.time_wait + 'ms' :''}}</span>
                </template>
              </el-table-column>

              <el-table-column label="最后触发时间" align="center" prop="last_trigger_time" sortable width="160px">
                <template slot-scope="scope">
                  <span>{{ scope.row.last_trigger_time | formatTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="最后告警时间" align="center" prop="last_alarm_time" sortable width="160px">
                <template slot-scope="scope">
                  <span>{{ scope.row.last_alarm_time | formatTime }}</span>
                </template>
              </el-table-column>

              <el-table-column label="趋势图" align="center" width="70">
                <template slot-scope="scope">
                  <a @click="clickShowLineChartButtom(scope.row)" :class="{disabled:scope.row.need_line_chart!==1}">
                    <svg-icon icon-class="data1" style="width: 16px; height:16px;color:dodgerblue;"/>
                  </a>
                </template>
              </el-table-column>
              <el-table-column v-if="is_admin_role" label="操作" align="center" width="130px">
                <template slot-scope="scope">
                  <a :class="{disabled:scope.row.active_disabled}" style="color:dodgerblue;text-decoration:underline"
                     @click="activeClick(scope.row,1)">启用</a> |
                  <a :class="{disabled:!scope.row.active_disabled}" style="color:dodgerblue;text-decoration:underline"
                     @click="activeClick(scope.row,2)">禁用</a>
                  |
                  <a style="color:dodgerblue;text-decoration:underline" @click="unbindClick(scope.row)">解绑</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务名" align="center" prop="ip" show-overflow-tooltip width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" prop="db_type" show-overflow-tooltip width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.db_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="active" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.active===1" size="medium">启用</el-tag>
          <el-tag v-if="scope.row.active===2" type="danger" size="medium">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="定时" align="center" prop="cron" show-overflow-tooltip width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.cron }}</span>
        </template>
      </el-table-column>
      <el-table-column label="触发器" align="center" prop="trigger" width="120">
        <template slot-scope="scope">
          <a v-for="(item,index) in scope.row.trigger" style="color:dodgerblue;text-decoration:underline" @click="triggerNameClick(item)">
            {{index+1===scope.row.trigger.length ? item : item+','}}
          </a>

        </template>
      </el-table-column>
      <el-table-column label="警报器" align="center" prop="alarm" width="120">
        <template slot-scope="scope">
          <a style="color:dodgerblue;text-decoration:underline" @click="alarmNameClick(scope.row.alarm)">{{ scope.row.alarm }}</a>
        </template>
      </el-table-column>
      <el-table-column label="实例数" align="center" prop="db_count" width="64">
        <template slot-scope="scope">
          <span>{{ scope.row.db_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实例列表" align="center" prop="db_list" width="250px">
        <template slot-scope="scope">
          <!--          <span class="double_line">{{ scope.row.db_list.join('\n') }}</span>-->
          <pre :class="{'double_line': scope.row.in_double_line}"><span>{{ scope.row.db_list.join('\n')}}</span></pre>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.notes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="历史曲线" align="center" prop="active" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.need_line_chart===1" size="medium">开启</el-tag>
          <el-tag v-if="scope.row.need_line_chart===0" type="info" size="medium">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最近更新" align="center" show-overflow-tooltip sortable width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | formatTime }}</span>
          <div style="color: #8492a6; font-size: 10px">更新人:{{ scope.row.change_user }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin_role" label="操作" align="center" width="158">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">绑定数据库</div>
            <el-button plain type="success" @click="bindButtonClick(scope.row)" circle>
              <svg-icon style="color:green" icon-class="paperclip"/>
            </el-button>
          </el-tooltip>
          <el-button plain type="primary" icon="el-icon-edit" circle @click="editOld(scope.row)"/>
          <el-button plain type="danger" icon="el-icon-delete" circle @click="DeleteLine(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog s_title="新增" :title="add_dialog_tile" :visible.sync="show_add_page" width="850px" :close-on-click-modal="false">
      <el-form v-if="is_first_step" ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="80px">

        <el-col :span="12">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model.trim="detailFormData.name" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" min-width="100" prop="active">
            <el-select v-model="detailFormData.active" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库类别" min-width="100" prop="db_type">
            <el-select v-model="detailFormData.db_type" placeholder="数据库类别" style="width:100%" @change="dbTypeChanged">
              <el-option v-for="item in DbCategoryDict" :key="item.value" :label="item.label" :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="库名" min-width="100" prop="db_name">
            <template slot-scope="scope" slot="label">库名
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">不填写的话会默认从数据库管理中得到库名</div>
                <i class="el-icon-question" style="color:dodgerblue"></i>
              </el-tooltip>
            </template>
            <el-select v-model="detailFormData.db_name" clearable allow-create filterable placeholder="库名" style="width:100%">
              <el-option v-for="item in db_name_list" :key="item.value" :label="item.label" :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="SQL语句" min-width="100" prop="sentence">
            <el-input v-model="detailFormData.sentence" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"
                      @input="sentenceInputChanged" style="width:100%"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <label class="el-form-item__label" style="width: 80px;">定时</label>
          <el-col :span="4">
            <el-form-item min-width="100" prop="minute" label-width="0">
              <el-input v-model.trim="detailFormData.minute" type="text" style="width:90%" placeholder="分"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="hour" label-width="0">
              <el-input v-model.trim="detailFormData.hour" type="text" style="width:90%" placeholder="时"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="day" label-width="0">
              <el-input v-model.trim="detailFormData.day" type="text" style="width:90%" placeholder="日"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="month" label-width="0">
              <el-input v-model.trim="detailFormData.month" type="text" style="width:90%" placeholder="月"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="week" label-width="0">
              <el-input v-model.trim="detailFormData.week" type="text" style="width:90%" placeholder="周"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <div style="margin:8px 13px">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">默认为每分钟执行一次<br>遵循crontab定时任务规范,输入框分别为分时日月周</div>
                <i class="el-icon-question" style="color:dodgerblue"></i>
              </el-tooltip>
            </div>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="notes">
            <el-input v-model.trim="detailFormData.notes" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" min-width="100" prop="need_line_chart">
            <el-checkbox v-model="detailFormData.need_line_chart">
              需要生成历史曲线
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">需要生成历史曲线的sql语句结果只会取第一行，将其生成曲线图</div>
                <i class="el-icon-question" style="color:dodgerblue"></i>
              </el-tooltip>
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-form>
      <div v-if="is_first_step" slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveAndExit">保存并退出</el-button>
        <el-button type="primary" @click="addNextStepClick">下一步</el-button>
      </div>

      <div v-if="is_second_step" class="my_transfer">
        <el-transfer filterable v-model="transfer.transfer_right" :data="transfer.transfer_left" @right-check-change="transferSelectChanged"
                     :titles="['未绑定', '已绑定']" :button-texts="['去除', '添加']" @change="transferChanged"/>
      </div>
      <div v-if="is_second_step" slot="footer" class="dialog-footer">
        <el-button type="success" style="float:left" icon="el-icon-phone" :disabled="!test_sql_enabled"
                   @click="testSqlSentenceClick()">语句测试
        </el-button>
        <el-button @click="turnToFirstStep">上一步</el-button>
        <el-button type="primary" @click="turnToThirdStep">下一步</el-button>
      </div>

      <el-form v-if="is_third_step" ref="triggerFormData" :model="triggerFormData" :rules="rules_add" label-width="80px">
        <el-col :span="24">
          <el-form-item label="触发器" prop="trigger">
            <el-select v-model="triggerFormData.trigger" multiple filterable clearable style="width:83%" @visible-change="triggerVisibleChanged">
              <el-option v-for="item in trigger_name_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button size="mini" style="margin-left: 10px" round @click="addNewTrigger">新增触发器</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="警报器" prop="alarm">
            <el-select v-model="triggerFormData.alarm" filterable clearable style="width:83%" @visible-change="alarmVisibleChanged">
              <el-option v-for="item in alarm_name_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button size="mini" style="margin-left: 10px" round @click="addNewAlarm">新增警报器</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div v-if="is_third_step" slot="footer" class="dialog-footer">
        <el-button @click="turnToSecondStep ">上一步</el-button>
        <el-button type="primary" @click="addConfirm">提交</el-button>
      </div>

    </el-dialog>

    <el-dialog title="修改" :visible.sync="show_edit_page" :close-on-click-modal="false" style="text-align: left;" width="850px">
      <el-form v-if="is_first_step" ref="detailFormData" :model="detailFormData" :rules="rules_add" label-width="80px">

        <el-col :span="12">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model.trim="detailFormData.name" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" min-width="100" prop="active">
            <el-select v-model="detailFormData.active" filterable class="filter-item" style="width:100%">
              <el-option v-for="item in active_dict" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库类别" min-width="100" prop="db_type">
            <el-select v-model="detailFormData.db_type" placeholder="数据库类别" style="width:100%" @change="dbTypeChanged">
              <el-option v-for="item in DbCategoryDict" :key="item.value" :label="item.label" :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库名" min-width="100" prop="db_name">
            <template slot-scope="scope" slot="label">库名
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">不填写的话会默认从数据库管理中得到库名</div>
                <i class="el-icon-question" style="color:dodgerblue"></i>
              </el-tooltip>
            </template>
            <el-select v-model="detailFormData.db_name" clearable allow-create filterable placeholder="库名" style="width:100%">
              <el-option v-for="item in db_name_list" :key="item.value" :label="item.label" :value="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="SQL语句" min-width="100" prop="sentence">
            <el-input v-model="detailFormData.sentence" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"
                      @input="sentenceInputChanged" style="width:100%"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <label class="el-form-item__label" style="width: 80px;">定时</label>
          <el-col :span="4">
            <el-form-item min-width="100" prop="minute" label-width="0">
              <el-input v-model.trim="detailFormData.minute" type="text" style="width:90%" placeholder="分"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="hour" label-width="0">
              <el-input v-model.trim="detailFormData.hour" type="text" style="width:90%" placeholder="时"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="day" label-width="0">
              <el-input v-model.trim="detailFormData.day" type="text" style="width:90%" placeholder="日"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="month" label-width="0">
              <el-input v-model.trim="detailFormData.month" type="text" style="width:90%" placeholder="月"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item min-width="100" prop="week" label-width="0">
              <el-input v-model.trim="detailFormData.week" type="text" style="width:90%" placeholder="周"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <div style="margin:8px 13px">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">默认为每分钟执行一次<br>遵循crontab定时任务规范,输入框分别为分时日月周</div>
                <i class="el-icon-question" style="color:dodgerblue"></i>
              </el-tooltip>
            </div>
          </el-col>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="notes">
            <el-input v-model.trim="detailFormData.notes" type="text" style="width:100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" min-width="100" prop="need_line_chart">
            <el-checkbox v-model="detailFormData.need_line_chart">
              需要生成历史曲线
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">需要生成历史曲线的sql语句结果只会取第一行，将其生成曲线图</div>
                <i class="el-icon-question" style="color:dodgerblue"></i>
              </el-tooltip>
            </el-checkbox>

          </el-form-item>
        </el-col>
      </el-form>
      <div v-if="is_first_step" slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addNextStepClick">下一步</el-button>
      </div>

      <div v-if="is_second_step" class="my_transfer">
        <el-transfer filterable v-model="transfer.transfer_right" :data="transfer.transfer_left" @right-check-change="transferSelectChanged"
                     :titles="['未绑定', '已绑定']" :button-texts="['去除', '添加']" @change="transferChanged"/>
      </div>
      <div v-if="is_second_step" slot="footer" class="dialog-footer">
        <el-button type="success" style="float:left" icon="el-icon-phone" :disabled="!test_sql_enabled"
                   @click="testSqlSentenceClick()">语句测试
        </el-button>
        <el-button @click="turnToFirstStep">上一步</el-button>
        <el-button type="primary" @click="turnToThirdStep">下一步</el-button>
      </div>

      <el-form v-if="is_third_step" ref="triggerFormData" :model="triggerFormData" :rules="rules_add" label-width="80px">
        <el-col :span="24">
          <el-form-item label="触发器" prop="trigger">
            <el-select v-model="triggerFormData.trigger" multiple filterable clearable style="width:83%" @visible-change="triggerVisibleChanged">
              <el-option v-for="item in trigger_name_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button size="mini" style="margin-left: 10px" round @click="addNewTrigger">新增触发器</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="警报器" prop="alarm">
            <el-select v-model="triggerFormData.alarm" filterable clearable style="width:83%" @visible-change="alarmVisibleChanged">
              <el-option v-for="item in alarm_name_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button size="mini" style="margin-left: 10px" round @click="addNewAlarm">新增警报器</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div v-if="is_third_step" slot="footer" class="dialog-footer">
        <el-button @click="turnToSecondStep ">上一步</el-button>
        <el-button type="primary" @click="editSubmitConfirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="返回结果" :visible.sync="show_sql_data_table" style="text-align: left;" width="850px">
      <el-table :data="sql_table_data" border stripe highlight-current-row
                :row-class-name="tableRowClassName" ref="sqlTable" tooltip-effect="dark" :cell-style="cellStyleClass">
        <el-table-column v-for="col in sql_table_data_columns" :label="col" align="center" show-overflow-tooltip min-width="160">
          <template slot-scope="scope">
            <span>{{ scope.row[col] }}</span>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-dialog title="曲线图" :visible.sync="show_line_chart" width="1000px">
      <line_chart :series="line_chart_series" :scale="scale" @scale_button_click="scaleButtonClick"></line_chart>
    </el-dialog>

    <el-dialog title="绑定数据库" :visible.sync="show_bind_db_page" :close-on-click-modal="false" style="text-align: left;" width="850px">
      <div class="my_transfer">
        <el-transfer filterable v-model="transfer.transfer_right" :data="transfer.transfer_left" @right-check-change="transferSelectChanged"
                     :titles="['未绑定', '已绑定']" :button-texts="['去除', '添加']" @change="transferChanged"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="float:left" icon="el-icon-phone" :disabled="!test_sql_enabled"
                   @click="testSqlSentenceClick()">语句测试
        </el-button>
        <el-button @click="show_bind_db_page=false">取消</el-button>
        <el-button type="primary" @click="bindConfirm">提交</el-button>
      </div>
    </el-dialog>

  </div>

</template>


<script>
  import {
    getTasksInfoList, createNewTasksInfo, editTasksInfo, deleteTasksInfo, bacthUpdateTasksInfo, createNewTasksWithoutBind,
    getDatabaseList, testSqlSentence, bandIpList, changeActive, testTriggerUseful, getInnerLineChart, InnerUnbind, getDbNameList
  } from '@/api/zabbix/sql_monitor_tasks'
  import {clickCeleryRestart,} from '@/api/zabbix/sql_monitor_database_info'
  import {getTriggerNameList} from '@/api/zabbix/sql_monitor_triggers'
  import {getAlarmNameList} from '@/api/zabbix/sql_monitor_alarm'
  import Pagination from '@/components/Pagination'
  import {parseTime} from "../../utils";
  import {validIp, validSpecialChar, validFuncName} from '@/utils/validate'
  import {accountGetIpList} from '@/api/cmdb'
  import line_chart from "./components/sql_monitor/lineChart"
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";

  export default {
    components: {Pagination, line_chart, el_button_wait},
    mixins: [sessionListQuery],
    data() {
      return {
        timer: null,
        db_name_list: [],
        show_bind_db_page: false,
        scale: false,
        need_expand_all: true,
        line_chart_series: [],
        show_line_chart: false,
        test_sql_enabled: false,
        sql_value_json: '',
        turn_to_third_step_disabled: true,
        alarm_name_list: [],
        trigger_name_list: [],
        listLoading: false,
        expand_row_keys: [],
        active_disabled: true,
        is_first_step: true,
        is_second_step: false,
        is_third_step: false,
        add_dialog_tile: '新增',
        show_bind_transfer: false,
        transfer: {transfer_right: [], transfer_left: [], transfer_right_selected: [], row_id: null},
        sql_table_data_columns: [],
        sql_table_data: [],
        show_sql_data_table: false,
        test_connect_icon: 'el-icon-phone',
        database_list: {},
        ciphertext: "********",
        open_eye_in_header: false,
        password_type: 'password',
        selected_rows: [],
        total: 0,
        ipList: [],
        table_data_list: [],
        detailFormData: {},
        triggerFormData: {},
        batchUpdateForm: {},
        show_add_page: false,
        show_edit_page: false,
        show_batch_edit_page: false,
        is_admin_role: false,
        people: '',
        roles: [],
        DbCategoryDict: [{value: 'Oracle', label: 'Oracle', port: 1521}, {value: 'Mysql', label: 'Mysql', port: 3306}],
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        listQuery: {
          page: 1,
          limit: 10,
          name: null,
          db_type: null,
          active: null,
          ip: null,
        },
        active_dict: [{value: 1, label: '启用'}, {value: 2, label: '禁用'}],
        first_level_dict: [
          {value: '默认', label: '默认'},
          {value: '系统运营组', label: '系统运营组'},
          {value: '数据库管理组', label: '数据库管理组'},
          {value: '信息化安全组', label: '信息化安全组'},
          {value: '主机存储系统组', label: '主机存储系统组'},
        ],
        rules_add: {
          name: [{
            required: true,
            message: '必填项',
            trigger: 'blur'
          }, {validator: this.validateSpecialCharacter}, {validator: this.validateFunctionName}],
          database: [{required: true, message: '必填项', trigger: 'blur'}],
          active: [{required: true, message: '必填项', trigger: 'blur'}],
          sentence: [{required: true, message: '必填项', trigger: 'blur'}],
          minute: [{required: true, message: '必填项', trigger: 'blur'}],
          hour: [{required: true, message: '必填项', trigger: 'blur'}],
          day: [{required: true, message: '必填项', trigger: 'blur'}],
          month: [{required: true, message: '必填项', trigger: 'blur'}],
          week: [{required: true, message: '必填项', trigger: 'blur'}],
        },
      }
    },

    created() {
      if (this.$route.params.name) {
        this.listQuery.name = this.$route.params.name
      }
      this.getList();
      this.getIpList();
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.is_admin_role = this.roles.includes('sql_monitor_admin')
    },
    mounted() {
      getDatabaseList().then(response => {
        this.database_list = response
      });
      getAlarmNameList().then(response => {
        this.alarm_name_list = response
      });
      getDbNameList().then(response => {
        this.db_name_list = response.success
      });
      this.timer = setInterval(() => {
        setTimeout(this.getList, 0)
      }, 1000 * 60)
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    filters: {
      formatTime(value) {
        if (value) {
          let v = value.replace('T', ' ');
          v = v.substring(0, v.length - 7);
          return v
        }
      },
    },
    methods: {
      celeryRestart() {
        clickCeleryRestart().then(res => {
          this.$message({
            message: '重启任务提交成功',
            type: 'success'
          });
        })
      },
      closeDialog() {
        this.show_add_page = false;
        this.show_edit_page = false
      },
      clickHelpDocument() {
        this.$router.push({name: 'help_doc_preview', query: {id: 17}})
      },
      dbTypeChanged(val) {
        let transfer_left_all = JSON.parse(JSON.stringify(this.database_list));
        if (val === 'Mysql') {
          this.transfer.transfer_left = transfer_left_all['mysql_list'];
        } else if (val === 'Oracle') {
          this.transfer.transfer_left = transfer_left_all['oracle_list'];
        }
      },
      sentenceInputChanged() {

      },
      bindButtonClick(row) {
        this.show_bind_db_page = true;
        this.transfer.row_id = row.id;
        this.transfer.transfer_right = row.transfer_right;
        this.transfer.db_name = row.db_name;
        this.dbTypeChanged(row.db_type)
      },
      unbindClick(row) {
        this.$confirm('确定要解绑吗?', '提示', this.confirmOptions).then(() => {
          InnerUnbind({inner_id: row.id}).then(res => {
            if (res.success) {
              this.$message({message: 'success', type: 'success'});
            } else {
              this.$message({message: 'error', type: 'error'});
            }
          })
        }).then(() => {
          setTimeout(this.getList, 200)
        })
      },
      saveAndExit() {
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          let post_data = JSON.parse(JSON.stringify(this.detailFormData)); //深拷贝
          post_data.transfer_right = [];
          post_data.trigger = [];
          post_data.alarm = '';
          createNewTasksWithoutBind(post_data).then(response => {
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 5000
              });
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.show_add_page = false;
              this.getList()
            }
          })
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }

      },
      expandAll() {
        for (let row of this.table_data_list) {
          this.$refs['multipleTable'].toggleRowExpansion(row, this.need_expand_all)
        }
        this.need_expand_all = !this.need_expand_all
      },
      scaleButtonClick() {
        this.scale = !this.scale
      },
      clickShowLineChartButtom(row) {
        this.scale = false;
        this.show_line_chart = true;
        getInnerLineChart({inner_id: row.id}).then(response => {
          console.log(row.id);
          this.line_chart_series = response
        })
      },
      transferChanged() {
        let selected = this.transfer.transfer_right_selected;
        let right = this.transfer.transfer_right;
        this.test_sql_enabled = (selected.length === 1 && right.indexOf(selected[0]) !== -1) || right.length === 1;
        if (right.length === 0) {
          this.transfer.transfer_right_selected = []
        }
      },
      transferSelectChanged(selected, clicked) {
        if (selected.length >= 1) {
          this.transfer.transfer_right_selected = selected;
          this.test_sql_enabled = selected.length === 1 && this.transfer.transfer_right.indexOf(selected[0]) !== -1
        } else {
          this.test_sql_enabled = false
        }
      },
      testTriggerClick() {
        if (!this.triggerFormData.trigger) {
          this.$message({message: '未选择触发器', type: 'warning'});
        }
        testTriggerUseful({trigger_list: this.triggerFormData.trigger, value_json: this.sql_value_json}).then(res => {
          if (res.success) {
            this.$message({message: res.success, type: 'success'});
          } else if (res.error) {
            this.$message({message: res.error, type: 'error'});
          }
        })
      },
      triggerVisibleChanged(val) {
        if (val) {
          getTriggerNameList({value_json: this.sql_value_json}).then(response => {
            console.log(this.sql_value_json);
            this.trigger_name_list = response
          })
        }
      },
      alarmVisibleChanged(val) {
        if (val) {
          getAlarmNameList().then(response => {
            this.alarm_name_list = response
          })
        }
      },
      turnToFirstStep() {
        this.is_first_step = true;
        this.is_second_step = false;
        this.is_third_step = false;
        this.add_dialog_tile = '新增'
      },
      turnToSecondStep() {
        this.is_first_step = false;
        this.is_second_step = true;
        this.is_third_step = false;
        this.add_dialog_tile = '绑定数据库'

      },
      turnToThirdStep() {
        this.detailFormData.transfer_right = this.transfer.transfer_right;
        this.test_connect_icon = 'el-icon-loading';
        testSqlSentence(this.detailFormData).then(res => {
          if (res.success) {
            this.$message({message: res.success, type: 'success'});
          } else if (res.error) {
            this.$message({message: res.error, type: 'error'});
          } else if (res.warning) {
            this.$message({message: res.warning, type: 'warning'});
          } else if (res.sql_success) {
            this.sql_value_json = res.data;
            this.is_first_step = false;
            this.is_second_step = false;
            this.is_third_step = true;
            this.add_dialog_tile = '绑定告警逻辑(可以不选)'
          } else if (res.sql_error) {
            this.$alert(res.sql_error, '语句执行出错,请重新填写sql语句', {dangerouslyUseHTMLString: true}).catch(reason => ({}));
          }
        })

      },
      triggerNameClick(name) {
        this.$router.push({name: "sql_monitor_triggers", params: {name: name}})
      },
      alarmNameClick(name) {
        this.$router.push({name: "sql_monitor_alarm", params: {name: name}})
      },
      addNewTrigger() {
        let routes = this.$router.resolve({name: "sql_monitor_triggers",});
        window.open(routes.href, "_blank");
      },
      addNewAlarm() {
        let routes = this.$router.resolve({name: "sql_monitor_alarm",});
        window.open(routes.href, "_blank");
      },
      expandChange(row, expandedRows) {
        let li = [];
        for (let i of expandedRows) {
          li.push(i.id)
        }
        this.expand_row_keys = li;
        if (row.db_list.length > 30) {
          let expand_table_data = JSON.parse(JSON.stringify(row.expand_table_data)); //深拷贝
          this.$set(row, 'expand_table_data', expand_table_data.slice(0, 30));

          function _show(that) {
            return function () {
              that.$set(row, 'expand_table_data', expand_table_data)
            }
          }

          setTimeout(_show(this), 1000)
        }
      },
      activeClick(row, active) {
        changeActive({row_id: row.id, active: active}).then(res => {
          if (res.success) {
            row.active = active;
            row.active_disabled = active === 1;
            if (active === 1) {
              this.$message({message: '已启用', type: 'success'});
            } else if (active === 2) {
              this.$message({message: '已禁用', type: 'warning'});
            }
          }
        });
        this.getList()
      },
      bindConfirm() {
        console.log(this.transfer.transfer_right);
        let transfer_right = this.transfer.transfer_right;
        let row_id = this.transfer.row_id;
        let db_name = this.transfer.db_name;
        this.test_connect_icon = 'el-icon-loading';
        testSqlSentence({row_id: row_id, transfer_right: transfer_right, db_name: db_name}).then(res => {
          if (res.success) {
            this.$message({message: res.success, type: 'success'});
          } else if (res.error) {
            this.$message({message: res.error, type: 'error'});
          } else if (res.warning) {
            this.$message({message: res.warning, type: 'warning'});
          } else if (res.sql_success) {
            bandIpList({row_id: this.transfer.row_id, transfer_right: this.transfer.transfer_right}).then(res => {
              if (res.success) {
                this.$message({message: res.success, type: 'success'});
              } else if (res.error) {
                this.$alert(res.error, '出错', {dangerouslyUseHTMLString: true}).catch(reason => ({}));
              }
              this.getList();
              this.show_bind_db_page = false
            })
          } else if (res.sql_error) {
            this.$alert(res.sql_error, '语句执行出错,请重新填写sql语句', {dangerouslyUseHTMLString: true}).catch(reason => ({}));
          }
        })
      },
      deviceHeaderClass() {
        return 'text-align: center;background:#f5f7fa;color:#56585c;padding:6px 0 5px 0'
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
      testSqlSentenceClick() {
        console.log('this.detailFormData.sentence', this.detailFormData.sentence)
        this.test_connect_icon = 'el-icon-loading';
        let transfer_right = this.transfer.transfer_right.length === 1 ? this.transfer.transfer_right : this.transfer.transfer_right_selected;
        let row_id = this.transfer.row_id;
        let db_name = this.transfer.db_name;
        let sentence = this.detailFormData.sentence
        testSqlSentence({row_id: row_id, transfer_right: transfer_right, db_name: db_name, sentence: sentence}).then(res => {
          if (res.success) {
            this.$message({message: res.success, type: 'success'});
          } else if (res.error) {
            this.$message({message: res.error, type: 'error'});
          } else if (res.warning) {
            this.$message({message: res.warning, type: 'warning'});
          } else if (res.sql_success) {
            this.sql_value_json = res.data;
            this.sql_table_data = res.data;
            this.sql_table_data_columns = Object.keys(res.data[0]);
            this.show_sql_data_table = true
          } else if (res.sql_error) {
            this.$alert(res.sql_error, '语句执行出错', {dangerouslyUseHTMLString: true}).catch(reason => ({}));
          }
        })
      },
      cellStyleClass() {
        return 'padding:6px 0'
      },
      cellClick(row, column, cell, event) {
        if (['实例列表'].indexOf(column.label) !== -1) {
          row.in_double_line = !row.in_double_line;
          this.table_data_list = JSON.parse(JSON.stringify(this.table_data_list)); //深拷贝
        }
      },
      plaintextPassword() {
        if (!this.open_eye_in_header) {
          for (let item of this.table_data_list) {
            item.plaintext = 'eye-open';
            item.exposed_pwd = item.password
          }
        } else {
          for (let item of this.table_data_list) {
            item.plaintext = 'eye';
            item.exposed_pwd = this.ciphertext
          }
        }
        for (let item of this.table_data_list) {
          this.$set(this.table_data_list, item.index, item)
        }
        this.open_eye_in_header = !this.open_eye_in_header
      },
      getIpList() {

        accountGetIpList().then(response => {
          this.ipList = response
        })

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
      validateFunctionName(rule, value, callback) {
        if (value) {
          if (validFuncName(value)) {
            callback()
          } else {
            callback(new Error('名称请以字母或汉字开头'))
          }
        } else {
          callback()
        }
      },
      clickShowPwd() {
        this.password_type = this.password_type === 'password' ? 'text' : 'password'
      },
      categoryChanged(val) {
        console.log(val);
        for (let i of this.DbCategoryDict) {
          if (i.value === val) {
            this.detailFormData.port = i.port;
            break
          }
        }
      },
      bacthUpdateClick() {
        this.initBatchUpdateForm();
        this.show_batch_edit_page = true
      },
      handleSelectionChange(rows) {
        this.selected_rows = rows;
      },
      initForm() {
        this.detailFormData = {
          name: '', active: 1, database: '', sentence: '', need_line_chart: '', db_type: 'Mysql',
          minute: '*', hour: '*', day: '*', month: '*', week: '*', notes: '', db_name: ''
        };
        this.triggerFormData = {trigger: [], alarm: ''};
        this.test_sql_enabled = false
      },
      initBatchUpdateForm() {
        this.batchUpdateForm = {ip: '', password: ''}
      },
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      resetClick() {
        this.resetListQuery();
        this.getList()
      },
      validateForm() {
        let error_message = [];
        for (let key of Object.keys(this.rules_add)) {
          this.$refs.detailFormData.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        }
        return error_message.toString();
      },
      addNextStepClick() {
        this.transfer.row_id = this.detailFormData.id;
        this.transfer.db_name = this.detailFormData.db_name;
        let str_err = this.validateForm();
        if (str_err === "此ip不在资源管理中" || str_err === '') {
          this.is_first_step = false;
          this.is_second_step = true;
          this.is_third_step = false;
          this.add_dialog_tile = '绑定数据库'
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          return false
        }
      },

      addConfirm() {
        testTriggerUseful({trigger_list: this.triggerFormData.trigger, value_json: this.sql_value_json}).then(res => {
          if (res.success) {
            let post_data = JSON.parse(JSON.stringify(this.detailFormData)); //深拷贝
            post_data.transfer_right = this.transfer.transfer_right;
            post_data.trigger = this.triggerFormData.trigger;
            post_data.alarm = this.triggerFormData.alarm;
            createNewTasksInfo(post_data).then(response => {
              if (response['error']) {
                this.$notify({
                  title: '失败',
                  message: response['error'],
                  type: 'warning',
                  duration: 5000
                });
              } else {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 3000
                });
                this.show_add_page = false;
                this.getList()
              }
            })
          } else if (res.error) {
            this.$message({message: res.error, type: 'error'});
          }
        })
      },
      editSubmitConfirm() {
        testTriggerUseful({trigger_list: this.triggerFormData.trigger, value_json: this.sql_value_json}).then(res => {
          if (res.success) {
            let post_data = JSON.parse(JSON.stringify(this.detailFormData)); //深拷贝
            post_data.transfer_right = this.transfer.transfer_right;
            post_data.trigger = this.triggerFormData.trigger;
            post_data.alarm = this.triggerFormData.alarm;

            editTasksInfo(post_data, this.detailFormData.id).then(response => {
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
                this.show_edit_page = false;
                this.getList()
              }
            })
          } else if (res.error) {
            this.$message({message: res.error, type: 'error'});
          }
        })
      },
      batchEditSubmitConfirm() {
        this.$refs.batchUpdateForm.validate((valid) => {
          if (valid) {
            let id_list = [];
            for (let i of this.selected_rows) {
              id_list.push(i.id)
            }
            this.batchUpdateForm.id_list = id_list;
            this.batchUpdateForm.change_user = this.people;
            bacthUpdateTasksInfo(this.batchUpdateForm).then(response => {
              let failed_count = this.selected_rows.length - response.success_count;
              this.$message({
                title: '成功',
                message: '成功修改' + response.success_count + '条，失败' + failed_count + '条',
                type: 'success',
                duration: 5000
              });
              this.getList();
              console.log(response.error_log)
            });
            this.show_batch_edit_page = false
          } else {
            this.$message({
              message: '表单填写有误',
              type: 'error'
            });
            return false
          }
        })
      },
      addNew() {
        this.initForm();
        this.is_first_step = true;
        this.is_second_step = false;
        this.is_third_step = false;
        this.transfer.transfer_right = [];
        this.show_add_page = true;
        this.add_dialog_tile = '新增';
        this.dbTypeChanged('Mysql')
      },
      fillUpForm(row) {
        this.initForm();
        this.detailFormData.database = row.database;
        this.detailFormData.name = row.name;
        this.detailFormData.active = row.active;
        this.detailFormData.sentence = row.sentence;
        this.detailFormData.minute = row.minute;
        this.detailFormData.hour = row.hour;
        this.detailFormData.day = row.day;
        this.detailFormData.month = row.month;
        this.detailFormData.week = row.week;
        this.detailFormData.notes = row.notes;
        this.detailFormData.id = row.id;
        this.detailFormData.db_name = row.db_name;
        this.detailFormData.db_type = row.db_type;
        this.detailFormData.need_line_chart = row.need_line_chart === 1;
        this.triggerFormData.trigger = row.trigger;
        this.triggerFormData.alarm = row.alarm;
        this.transfer.transfer_right = row.transfer_right ? row.transfer_right : [];
        if (this.transfer.transfer_right.length === 1) {
          this.test_sql_enabled = true
        }
      },
      editOld(row) {
        this.fillUpForm(row);
        this.show_edit_page = true;
        this.password_type = 'password';
        this.is_first_step = true;
        this.is_second_step = false;
        this.is_third_step = false;
        this.dbTypeChanged(this.detailFormData.db_type)
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteTasksInfo(row.id).then((response) => {
              this.$message({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 3000
              });
            }
          );
        }).then(() => {
          setTimeout(this.getList, 200)
        })
      },
      getList() {
        this.listLoading = true;
        getTasksInfoList(this.listQuery).then(response => {
          this.table_data_list = response.results;
          for (let row of response.results) {
            for (let i of row.expand_table_data) {
              i.active_disabled = i.active === 1
            }
          }
          this.total = response.count;
          for (let i of this.table_data_list) {
            i.in_double_line = true
          }
        });
        setTimeout(() => {
          this.listLoading = false
        }, 100)
      },
      searchClick() {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        });
      },
      resetListQuery() {
        this.listQuery = this.$options.data().listQuery;
      },
    }
  }
</script>

<style>
  .my_transfer .el-transfer-panel {
    width: 282px;
    height: 400px;
  }

  .my_transfer .el-checkbox-group {
    height: 300px;
  }

  a.disabled {
    pointer-events: none;
    filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
    -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
    opacity: 0.5; /*其他，透明度50%*/
  }

  .double_line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  pre {
    margin: 0
  }

  .inner_table_class {
    max-height: 500px;
    overflow-y: scroll;
    border: 1px solid lightskyblue;
  }
</style>
