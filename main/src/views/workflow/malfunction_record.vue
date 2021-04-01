<template>
  <div class="app-container" v-if="show_index_page">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="full_text">
          <el-input v-model="listQuery.full_text" clearable placeholder="处理过程检索" style="width: 200px;" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="mal_id">
          <el-input v-model="listQuery.mal_id" clearable placeholder="故障/事件ID" style="width: 150px;" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="category">
          <el-select v-model="listQuery.category" placeholder="类别" filterable clearable class="filter-item"
                     @change="handleFilter" style="width: 100px;">
            <el-option v-for="item in category_dict" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="assemble">
          <!--          <el-input v-model="listQuery.subdivision" clearable placeholder="故障分类" style="width: 150px;" class="filter-item"/>-->
          <el-cascader :props="{ expandTrigger: 'hover', checkStrictly: true }" :options="level_cascade" placeholder="故障分类"
                       :show-all-levels="false" @blur="handleFilter('blur')"
                       v-model="listQuery.assemble" style="width:150px" @change="handleFilter('change')" clearable>
          </el-cascader>
        </el-form-item>

        <el-form-item prop="registrant">
          <el-select v-model="listQuery.registrant" clearable allow-create filterable placeholder="登记人" @change="handleFilter"
                     style="width:100px">
            <el-option v-for="item in user_list" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="handler">
          <el-select v-model="listQuery.handler" placeholder="处理人" filterable clearable class="filter-item"
                     style="width:100px" @change="handleFilter">
            <el-option v-for="item in handler_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="mal_result">
          <el-select v-model="listQuery.mal_result" placeholder="状态" filterable clearable class="filter-item"
                     @change="handleFilter" style="width: 100px;">
            <el-option v-for="item in mal_result_dict" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="time_value">
          <el-date-picker class="filter-item" v-model="listQuery.time_value" align="right" type="daterange" style="width: 270px;padding-right:0"
                          start-placeholder="开始时间范围" end-placeholder="开始时间范围" @change="handleFilter" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" v-if="is_admin_role" type="primary" icon="el-icon-plus" @click="addNew">新增</el-button>

        <el_button_wait v-if="is_admin_role" :interval="2" class="filter-item" plain type="primary" icon="el-icon-download"
                        @click="exportAllClick">导出全部
        </el_button_wait>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row @cell-click="cellClick"
              ref="multipleTable" tooltip-effect="dark" :cell-style="cellStyleClass">
      <el-table-column align="center" width="140px" show-overflow-tooltip>
        <template slot-scope="scope" slot="header">
          故障/事件ID
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">故障单: 不影响业务<br/>事件单: 影响业务</div>
            <i class="el-icon-question" style="color:dodgerblue"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <a v-if="scope.row.category===1" style="color:dodgerblue;text-decoration:underline" @click="detailDialogOpen(scope.row)">故障{{
            scope.row.mal_id }}</a>
          <a v-if="scope.row.category===2" style="color:dodgerblue;text-decoration:underline" @click="detailDialogOpen(scope.row)">事件{{
            scope.row.mal_id }}</a>
        </template>
      </el-table-column>
      <el-table-column label="故障分类" align="center" width="130px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.subdivision  }}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.first_level }}</div>
        </template>
      </el-table-column>
      <el-table-column label="等级" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level===1" type="info"> 轻微</el-tag>
          <el-tag v-if="scope.row.level===2" type="primary">一般</el-tag>
          <el-tag v-if="scope.row.level===3" type="warning">严重</el-tag>
          <el-tag v-if="scope.row.level===4" type="danger">灾难</el-tag>
          <el-tag v-if="scope.row.level===5" type="info">无影响</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mal_result===1" type="danger"> 开始</el-tag>
          <el-tag v-if="scope.row.mal_result===2" type="warning">挂起</el-tag>
          <el-tag v-if="scope.row.mal_result===3" type="primary">结束</el-tag>
          <el-tag v-if="scope.row.mal_result===4" type="info">废弃</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <div style="color: #8492a6; font-size: 10px">耗时:{{formatDate(scope.row)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="引起部门" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause_department | getArrayLastOneEval}}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件概述" align="center" min-width="200">
        <template slot-scope="scope">
          <span :class="{'double_line': scope.row.in_double_line}">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理/登记人" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.handler }}</span>
          <div style="color: #8492a6; font-size: 10px">登:{{scope.row.registrant }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <div style="color: #8492a6; font-size: 10px">更新人:{{scope.row.change_user }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin_role" width="110px" label="编辑" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" circle @click="editOld(scope.row)"
                     :disabled="[3,4].indexOf(scope.row.mal_result) !== -1 && !is_super_role && scope.row.registrant !== people "/>
          <el-button type="danger" plain icon="el-icon-delete" circle @click="DeleteLine(scope.row)" :disabled="!is_super_role"/>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog :title="sgDetailFormEdit.category| keyToValue(category_dict)+'ID: '+sgDetailFormEdit.mal_id"
               :visible.sync="show_detail_dialog" width="60%" top="10px">

      <el-form size="small" ref="sgDetailFormEdit" :model="sgDetailFormEdit" :rules="rules_add" label-width="100px">

        <el-card shadow="never" body-style="padding:0" style="margin:-10px -20px 10px -20px; padding: 10px 10px 0 10px; border-color:white">
          <div class="el-card-header"><label>故障信息</label></div>
          <el-row>


            <el-col :span="6">
              <el-form-item label="故障等级:">
                <font style="width:100%">{{sgDetailFormEdit.level | keyToValue(level_dict)}}</font>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理人:">
                <font style="width:100%">{{sgDetailFormEdit.handler}}</font>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="故障分类:" min-width="100">
                <font style="width:100%">{{sgDetailFormEdit.subdivision}}</font>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="当前状态:" min-width="100">
                <font style="width:100%">{{sgDetailFormEdit.mal_result | keyToValue(mal_result_dict)}}</font>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="开始时间:">
                <font style="width:100%">{{sgDetailFormEdit.start_time | timestampToTime}}</font>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间:">
                <font style="width:100%">{{sgDetailFormEdit.end_time | timestampToTime}}</font>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="持续时长:">
                <font style="width:100%">{{sgDetailFormEdit.time_long}}</font>
              </el-form-item>
            </el-col>

          </el-row>

        </el-card>

        <el-card shadow="never" body-style="padding:0" style="margin:10px -20px 10px -20px; padding: 10px 10px 0 10px; border-color:white">
          <div class="el-card-header"><label>设备信息</label></div>
          <el-row>
            <el-col :span="22" :offset="1">
              <el-table v-loading="listLoading" :data="sgDetailFormEdit.device_table_data" border ref="multipleTable"
                        tooltip-effect="dark" :row-class-name="tableRowClassName" :cell-style="cellStyleClass">
                <el-table-column label="IP地址" align="center" show-overflow-tooltip width="130px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.equipment_ip  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="端口" align="center" show-overflow-tooltip width="100px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.port  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="影响项目" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.project.toString().replace(/,/g,'/')  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="维保商" align="center" show-overflow-tooltip width="100px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.maintenance }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="品牌" align="center" show-overflow-tooltip width="100px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.brand }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="型号" align="center" show-overflow-tooltip width="100px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.device_model }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="备注" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.notes  }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

        </el-card>

        <el-card v-if="sgDetailFormEdit.first_level==='主机存储系统组'" shadow="never" body-style="padding:0"
                 style="margin:10px -20px 10px -20px; padding: 10px 10px 0 10px; border-color:white">
          <div class="el-card-header"><label>维保评分</label></div>
          <el-row>
            <el-col :span="22" :offset="1">
              <el-table v-loading="listLoading" :data="sgDetailFormEdit.score_table_data" border ref="multipleTable"
                        tooltip-effect="dark" :row-class-name="tableRowClassName" :cell-style="cellStyleClass">
                <el-table-column label="电话支持响应时间" align="center" width="135">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_phone  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="远程支持响应时间" align="center" width="135">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_remote  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="现场支持响应时间" align="center" width="135">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_scene }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="备件到达时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_spare_part  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="故障恢复时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_recover  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="故障处理时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_handle  }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="综合评价" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_comprehensive }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="总分(100)" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.score_sum  }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

        </el-card>

        <el-card shadow="never" body-style="padding:0" style="margin:20px -20px 10px -20px; padding: 10px 10px 0 10px; border-color:white">
          <div class="el-card-header"><label>处理过程</label></div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="事件概述:">
                <div class="tag_textarea">{{sgDetailFormEdit.description}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="故障原因:">
                <div class="tag_textarea">{{sgDetailFormEdit.reason}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="解决方案:">
                <div class="tag_textarea">{{sgDetailFormEdit.solution}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="引起部门:" prop="solution">
                <div class="tag_textarea">{{sgDetailFormEdit.cause_department.toString().replace(/,/g,'/') }}</div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-col :span="24"><label class="el-form-item__label">故障处理过程:</label></el-col>
          <el-col :span="24" style="border-top: solid 1px lavender">
            <div style="overflow:hidden">
              <el-form-item label-width="100" prop="handle_process">
                <span v-html="sgDetailFormEdit.handle_process"></span>
              </el-form-item>
            </div>
          </el-col>
        </el-card>

      </el-form>

    </el-dialog>

  </div>

  <div class="app-container" v-else-if="show_add_page" style="padding-top:0">
    <div style="position:fixed;width:100%;z-index:9;padding:15px;background-color:white;margin-left: -20px">
      <el-button-group style="margin-left: 20px">
        <el-button class="filter-item" type="primary" plain icon="el-icon-back" @click="handleReset" round>返回</el-button>
        <el_button_wait class="filter-item" type="primary" icon="el-icon-upload2" @click="addSubmitConfirm" :interval="1">提交
        </el_button_wait>
      </el-button-group>
      <div style="font-size: 18px;margin-right: 300px;color:grey;float:right;padding-top: 8px">ID: {{sgDetailFormEdit.mal_id}}</div>
      <div style="height: 10px;width:100%"></div>
      <div style="border-top:solid 1px lavender;width:100%"></div>
    </div>
    <el-form ref="sgDetailFormEdit" :model="sgDetailFormEdit" :rules="rules_add" label-width="100px" style="padding-top: 66px">

      <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px sandybrown solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="malfunction" style="color:grey"/>
            <label style="font-size:15px;"> 故障信息收集</label>
          </div>
        </div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="故障类别" align="center" prop="category">
              <template slot-scope="scope" slot="label">

                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">故障单: 不影响业务<br/>事件单: 影响业务</div>
                  <i class="el-icon-question" style="color:dodgerblue"></i>
                </el-tooltip>
                故障类别
              </template>
              <el-select v-model="sgDetailFormEdit.category" placeholder="请选择" style="width:100%" @change="addFormCategoryChange">
                <el-option v-for="item in category_dict" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="故障分类" min-width="100" prop="assemble">
              <el-cascader :props="{ expandTrigger: 'hover', checkStrictly: true }" :options="level_cascade" @change="assembleChanged"
                           v-model="sgDetailFormEdit.assemble" style="width:100%">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="故障等级" min-width="100" prop="level">
              <el-select v-model="sgDetailFormEdit.level" placeholder="请选择" style="width:100%">
                <el-option v-for="item in level_dict" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="当前状态" min-width="100" prop="mal_result">
              <el-select v-model="sgDetailFormEdit.mal_result" placeholder="请选择" style="width:100%" @change="malResultChanged">
                <el-option v-for="item in mal_result_dict" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>


        <el-col :span="6">
          <el-form-item label="处理人" prop="handler">
            <el-input v-model.trim="sgDetailFormEdit.handler" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker type="datetime" v-model.trim="sgDetailFormEdit.start_time" :picker-options="startTimePickerOptions"
                            style="width:100%" value-format="timestamp" format="yyyy-MM-dd HH:mm" @change="getTimeLong"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker type="datetime" v-model.trim="sgDetailFormEdit.end_time" style="width:100%" format="yyyy-MM-dd HH:mm"
                            :picker-options="endTimePickerOptions" value-format="timestamp" @change="endTimeChanged"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="持续时长">
            <el-input v-model.trim="sgDetailFormEdit.time_long" style="width:100%" :disabled="true"/>
          </el-form-item>
        </el-col>
      </el-card>

      <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px lightblue solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="computer" style="color:grey"/>
            <label style="font-size:15px;"> 设备信息收集</label>
          </div>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table v-loading="listLoading" :data="sgDetailFormEdit.device_table_data" highlight-current-row ref="multipleTable"
                      tooltip-effect="dark" :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">
              <el-table-column label="IP地址" align="center" show-overflow-tooltip width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'device_table_data.' + scope.$index + '.equipment_ip'" :rules="rules_add.equipment_ip">
                    <el-input v-model.trim="scope.row.equipment_ip" type="text" style="width:100%" @input="equipIpChanged(scope.row)"
                              ref="ip_button"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="端口" align="center" show-overflow-tooltip width="110px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'device_table_data.' + scope.$index + '.port'"
                                :rules="rules_add.port">
                    <el-input v-model.trim="scope.row.port" type="text" placeholder="非必填" style="width:100%"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="影响项目" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-cascader :props="{ expandTrigger: 'hover', checkStrictly: true }" :options="app_name_cascade"
                               v-model="scope.row.project" style="width:100%">
                  </el-cascader>
                </template>
              </el-table-column>
              <el-table-column label="维保商" align="center" show-overflow-tooltip width="130px">
                <template slot-scope="scope">
                  <!--                  <span>{{ scope.row.maintenance }}</span>-->
                  <el-select v-model="scope.row.maintenance" placeholder="自动生成" style="width:100%">
                    <el-option v-for="item in maintenance_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="品牌" align="center" show-overflow-tooltip width="110px">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.brand" type="text" placeholder="自动生成" style="width:100%" :disabled="true"/>
                  <!--                  <span>{{ scope.row.brand }}</span>-->
                </template>
              </el-table-column>
              <el-table-column label="型号" align="center" show-overflow-tooltip width="110px">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.device_model" type="text" placeholder="自动生成" style="width:100%" :disabled="true"/>
                  <!--                  <span>{{ scope.row.device_model }}</span>-->
                </template>
              </el-table-column>

              <el-table-column label="备注" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.notes" type="text" placeholder="备注" style="width:100%"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" show-overflow-tooltip width="65px">
                <template slot-scope="scope" slot="header">
                  <el-button type="primary" icon="el-icon-plus" circle @click="clickAddDeviceButton"/>
                </template>
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-minus" circle @click="clickDeleteDeviceButton(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>

      <el-card v-if="sgDetailFormEdit.first_level==='主机存储系统组'" shadow="never" class="el-card_in_edit"
               style="border-top: 3px lightpink solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="computer" style="color:grey"/>
            <label style="font-size:15px;">维保商评分</label>
          </div>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table v-loading="listLoading" :data="sgDetailFormEdit.score_table_data" highlight-current-row ref="multipleTable"
                      tooltip-effect="dark" :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">
              <el-table-column label="电话支持响应时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_phone'"
                                :rules="rules_add.score_phone">
                    <el-input v-model.trim="scope.row.score_phone" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="远程支持响应时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_remote'"
                                :rules="rules_add.score_remote">
                    <el-input v-model.trim="scope.row.score_remote" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="现场支持响应时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_scene'"
                                :rules="rules_add.score_scene">
                    <el-input v-model.trim="scope.row.score_scene" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备件到达时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_spare_part'"
                                :rules="rules_add.score_spare_part">
                    <el-input v-model.trim="scope.row.score_spare_part" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="故障恢复时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_recover'"
                                :rules="rules_add.score_recover">
                    <el-input v-model.trim="scope.row.score_recover" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="故障处理时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_handle'"
                                :rules="rules_add.score_handle">
                    <el-input v-model.trim="scope.row.score_handle" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="综合评价(10)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_comprehensive'"
                                :rules="rules_add.score_comprehensive">
                    <el-input v-model.trim="scope.row.score_comprehensive" type="text" placeholder="分数" style="width:100%"
                              @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="总得分(100)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0">
                    <el-input v-model.trim="scope.row.score_sum" type="text" placeholder="分数" style="width:100%" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px lightgreen solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="aid" style="color:grey"/>
            <label style="font-size:15px;"> 分析诊断及处理过程</label>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事件概述" prop="description">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="sgDetailFormEdit.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障原因" prop="reason">
              <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model="sgDetailFormEdit.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="解决方案" prop="solution">
              <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model="sgDetailFormEdit.solution"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="引起部门" prop="cause_department">
              <template slot-scope="scope" slot="label">
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">引起该事故的部门</div>
                  <i class="el-icon-question" style="color:dodgerblue"></i>
                </el-tooltip>
                引起部门
              </template>

              <el-cascader :props="{ expandTrigger: 'hover', checkStrictly: true }" :options="app_name_cascade" clearable placeholder="非必填"
                           v-model="sgDetailFormEdit.cause_department" style="width:100%"/>

            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24"><label class="el-form-item__label">故障处理过程:</label></el-col>
        <el-col :span="24">
          <el-form-item label-width="100" prop="handle_process">
            <Tinymce v-model="sgDetailFormEdit.handle_process" :height="500"></Tinymce>
          </el-form-item>
        </el-col>
      </el-card>

    </el-form>

  </div>

  <div class="app-container" v-else-if="show_edit_page" style="padding-top:0">
    <div style="position:fixed;width:100%;z-index:9;padding:15px;background-color:white;margin-left: -20px">
      <el-button-group style="margin-left: 20px">
        <el-button class="filter-item" type="primary" plain icon="el-icon-back" @click="handleReset" round>返回</el-button>
        <el_button_wait class="filter-item" type="primary" icon="el-icon-plus" @click="editSubmitConfirm" :interval="3">提交
        </el_button_wait>
      </el-button-group>
      <div style="font-size: 18px;margin-right: 300px;color:grey;float:right;padding-top: 8px">ID: {{sgDetailFormEdit.mal_id}}</div>
      <div style="height: 10px;width:100%"></div>
      <div style="border-top:solid 1px lavender;width:100%"></div>
    </div>

    <el-form ref="sgDetailFormEdit" :model="sgDetailFormEdit" :rules="rules_add" label-width="100px" style="padding-top: 66px">
      <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px sandybrown solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="malfunction" style="color:grey"/>
            <label style="font-size:15px;"> 故障信息收集</label>
          </div>
        </div>
        <el-row>
          <el-col :span="6">
            <el-form-item label="故障类别" align="center" prop="category">
              <el-select v-model="sgDetailFormEdit.category" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in category_dict" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="故障分类" min-width="100" prop="assemble">
              <el-cascader :props="{ expandTrigger: 'hover', checkStrictly: true }" :options="level_cascade" @change="assembleChanged"
                           v-model="sgDetailFormEdit.assemble" style="width:100%">
              </el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="故障等级" min-width="100" prop="level">
              <el-select v-model="sgDetailFormEdit.level" placeholder="请选择" style="width:100%">
                <el-option v-for="item in level_dict" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="当前状态" min-width="100" prop="mal_result">
              <el-select v-model="sgDetailFormEdit.mal_result" placeholder="请选择" style="width:100%" @change="malResultChanged">
                <el-option v-for="item in mal_result_dict" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>


        <el-col :span="6">
          <el-form-item label="处理人" prop="handler">
            <el-input v-model.trim="sgDetailFormEdit.handler" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker type="datetime" v-model.trim="sgDetailFormEdit.start_time" :picker-options="startTimePickerOptions"
                            style="width:100%" value-format="timestamp" format="yyyy-MM-dd HH:mm" @change="getTimeLong"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker type="datetime" v-model.trim="sgDetailFormEdit.end_time" style="width:100%" format="yyyy-MM-dd HH:mm"
                            :picker-options="endTimePickerOptions" value-format="timestamp" @change="endTimeChanged"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="持续时长">
            <el-input v-model.trim="sgDetailFormEdit.time_long" style="width:100%" :disabled="true"/>
          </el-form-item>
        </el-col>

      </el-card>

      <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px lightblue solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="computer" style="color:grey"/>
            <label style="font-size:15px;"> 设备信息收集</label>
          </div>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table v-loading="listLoading" :data="sgDetailFormEdit.device_table_data" highlight-current-row ref="multipleTable"
                      tooltip-effect="dark" :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">
              <el-table-column label="IP地址" align="center" show-overflow-tooltip width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0"
                                :prop="'device_table_data.' + scope.$index + '.equipment_ip'" :rules="rules_add.equipment_ip">
                    <el-input v-model.trim="scope.row.equipment_ip" type="text" style="width:100%" @input="equipIpChanged(scope.row)"
                              ref="ip_button"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="端口" align="center" show-overflow-tooltip width="110px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'device_table_data.' + scope.$index + '.port'"
                                :rules="rules_add.port">
                    <el-input v-model.trim="scope.row.port" type="text" placeholder="非必填" style="width:100%"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="影响项目" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-cascader :options="app_name_cascade" :props="{ expandTrigger: 'hover', checkStrictly: true }"
                               v-model="scope.row.project" style="width:100%">
                  </el-cascader>
                </template>
              </el-table-column>
              <el-table-column label="维保商" align="center" show-overflow-tooltip width="130px">
                <template slot-scope="scope">
                  <!--                  <span>{{ scope.row.maintenance }}</span>-->
                  <el-select v-model="scope.row.maintenance" placeholder="自动生成" style="width:100%">
                    <el-option v-for="item in maintenance_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="品牌" align="center" show-overflow-tooltip width="110px">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.brand" type="text" placeholder="自动生成" style="width:100%" :disabled="true"/>
                  <!--                  <span>{{ scope.row.brand }}</span>-->
                </template>
              </el-table-column>
              <el-table-column label="型号" align="center" show-overflow-tooltip width="110px">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.device_model" type="text" placeholder="自动生成" style="width:100%" :disabled="true"/>
                  <!--                  <span>{{ scope.row.device_model }}</span>-->
                </template>
              </el-table-column>

              <el-table-column label="备注" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.notes" type="text" placeholder="备注" style="width:100%"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" show-overflow-tooltip width="65px">
                <template slot-scope="scope" slot="header">
                  <el-button type="primary" icon="el-icon-plus" circle @click="clickAddDeviceButton"/>
                </template>
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-minus" circle @click="clickDeleteDeviceButton(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>

      <el-card v-if="sgDetailFormEdit.first_level==='主机存储系统组'" shadow="never" class="el-card_in_edit"
               style="border-top: 3px lightpink solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="computer" style="color:grey"/>
            <label style="font-size:15px;">维保商评分</label>
          </div>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table v-loading="listLoading" :data="sgDetailFormEdit.score_table_data" highlight-current-row ref="multipleTable"
                      tooltip-effect="dark" :header-cell-style="deviceHeaderClass" :row-class-name="tableRowClassName">
              <el-table-column label="电话支持响应时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_phone'"
                                :rules="rules_add.score_phone">
                    <el-input v-model.trim="scope.row.score_phone" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="远程支持响应时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_remote'"
                                :rules="rules_add.score_remote">
                    <el-input v-model.trim="scope.row.score_remote" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="现场支持响应时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_scene'"
                                :rules="rules_add.score_scene">
                    <el-input v-model.trim="scope.row.score_scene" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备件到达时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_spare_part'"
                                :rules="rules_add.score_spare_part">
                    <el-input v-model.trim="scope.row.score_spare_part" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="故障恢复时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_recover'"
                                :rules="rules_add.score_recover">
                    <el-input v-model.trim="scope.row.score_recover" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="故障处理时间(15)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_handle'"
                                :rules="rules_add.score_handle">
                    <el-input v-model.trim="scope.row.score_handle" type="text" placeholder="分数" style="width:100%" @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="综合评价(10)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0" :prop="'score_table_data.' + scope.$index + '.score_comprehensive'"
                                :rules="rules_add.score_comprehensive">
                    <el-input v-model.trim="scope.row.score_comprehensive" type="text" placeholder="分数" style="width:100%"
                              @input="scoreChanged"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="总得分(100)" align="center" min-width="150px">
                <template slot-scope="scope">
                  <el-form-item label-width="0" style="margin-bottom:0">
                    <el-input v-model.trim="scope.row.score_sum" type="text" placeholder="分数" style="width:100%" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px lightgreen solid;">
        <div slot="header" class="clearfix">
          <div style="margin: -10px">
            <svg-icon icon-class="aid" style="color:grey"/>
            <label style="font-size:15px;"> 分析诊断及处理过程</label>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事件概述" prop="description">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="sgDetailFormEdit.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障原因" prop="reason">
              <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model="sgDetailFormEdit.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="解决方案" prop="solution">
              <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" v-model="sgDetailFormEdit.solution"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="引起部门" prop="cause_department">
              <template slot-scope="scope" slot="label">
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">引起该事故的部门</div>
                  <i class="el-icon-question" style="color:dodgerblue"></i>
                </el-tooltip>
                引起部门
              </template>

              <el-cascader :props="{ expandTrigger: 'hover', checkStrictly: true }" :options="app_name_cascade" clearable placeholder="非必填"
                           v-model="sgDetailFormEdit.cause_department" style="width:100%"/>

            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24"><label class="el-form-item__label">故障处理过程:</label></el-col>
        <el-col :span="24">
          <el-form-item label-width="100" prop="handle_process">
            <Tinymce v-model="sgDetailFormEdit.handle_process" :height="500"></Tinymce>
          </el-form-item>
        </el-col>
      </el-card>
    </el-form>

  </div>

</template>

<script>
  import {
    getMalfunctionList, getAppNameCascade, getLevelCascade, getUserList, getMaintenanceList, getHandlerList, getUserDepartment,
    getNewestMalId, createNewMalfunction, getEquipDetail, editMalfunction, getHandleProcess, getDeviceInfo, getScoreInfo,
    deleteMalfunction, MalfunctionExportAll
  } from '@/api/workflow/malfunction'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {validMultipleIp, validSpecialChar, validPort, validScore15} from '@/utils/validate'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {parseTime} from "../../utils";
  import Tinymce from '@/components/Tinymce'
  import el_button_wait from "@/components/WangHuiSelfDefined/el_button_wait";

  export default {
    components: {Pagination, UploadExcelComponent, Tinymce, el_button_wait},

    data() {
      return {
        newest_device_project: [],
        show_device_dialog: false,
        pickerOptions: {},
        deviceForm: {},
        maintenance_list: [],
        handler_list: [],
        commit_button_loading: false,
        show_project_detail_button: true,
        is_admin_role: false,
        is_super_role: false,
        user_list: [],
        list: null,
        app_name_cascade: [],
        level_cascade: [],
        fileList: [],
        upload_url: process.env.VUE_APP_BASE_API + '/workflow/malfunction_upload_file', // '/dev-api'
        show_index_page: true,
        show_add_page: false,
        show_edit_page: false,
        show_detail_dialog: false,
        dialogImageUrl: '',
        bigImageVisible: false,
        sgDetailFormEdit: {start_time: null},
        loading: false,
        category_dict: [{value: 1, label: '故障单'}, {value: 2, label: '事件单'}],
        level_dict: [{value: 5, label: '无影响'}, {value: 1, label: '轻微'}, {value: 2, label: '一般'}, {value: 3, label: '严重'}, {
          value: 4,
          label: '灾难'
        }],
        mal_result_dict: [{value: 1, label: '开始'}, {value: 2, label: '挂起'}, {value: 3, label: '结束'}, {value: 4, label: '废弃'}],
        people: '',
        downloadLoading: false,
        projectList: {},
        projectListP: [],
        listQuery: {page: 1, limit: 20, registrant: '', subdivision: '', assemble: []},
        total: 0,
        listLoading: true,
        timestamp: '',
        roles: [],
        rules_add: {
          start_time: [{required: true, type: 'date', message: '请选择时间', trigger: 'blur'}],
          end_time: [{validator: this.validateEndTime}],
          assemble: [{required: true, message: '必填项', trigger: 'blur'}],
          category: [{required: true, message: '必填项', trigger: 'blur'}],
          mal_result: [{required: true, message: '必填项', trigger: 'blur'}],
          level: [{required: true, message: '必填项', trigger: 'blur'}],
          handler: [{required: true, message: '必填项', trigger: 'blur'}],
          description: [{required: true, message: '必填项', trigger: 'blur'}, {max: 512, message: '长度不超过512个字符', trigger: 'blur'},],
          reason: [{max: 512, message: '长度不超过512个字符', trigger: 'blur'},],
          equipment_ip: [{required: true, message: '必填项', trigger: 'blur'}, {validator: this.validateIpAddress}],
          solution: [{validator: this.validateSolution}],
          port: [{validator: this.validatePort}],
          score_phone: [{required: true, message: '分数必填项', trigger: 'blur'}, {validator: this.validateScore15}],
          score_remote: [{required: true, message: '分数必填项', trigger: 'blur'}, {validator: this.validateScore15}],
          score_scene: [{required: true, message: '分数必填项', trigger: 'blur'}, {validator: this.validateScore15}],
          score_spare_part: [{required: true, message: '分数必填项', trigger: 'blur'}, {validator: this.validateScore15}],
          score_recover: [{required: true, message: '分数必填项', trigger: 'blur'}, {validator: this.validateScore15}],
          score_handle: [{required: true, message: '分数必填项', trigger: 'blur'}, {validator: this.validateScore15}],
          score_comprehensive: [{required: true, message: '分数必填项', trigger: 'blur'}, {validator: this.validateScore15}],
        },
        startTimePickerOptions: {disabledDate: this.disabledStartDate},
        endTimePickerOptions: {disabledDate: this.disabledDate},
      }
    },
    filters: {
      timestampToTime(timestamp) {
        if (timestamp === '' || timestamp === null) {
          return null
        }
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m;
      },
      keyToValue(key, dict) {
        let new_dict = {};
        for (let i of dict) {
          new_dict[i['value']] = i['label']
        }
        return new_dict[key]
      },
      getArrayLastOne(arra) {
        if (arra) {
          return arra[arra.length - 1]
        }

      },
      getArrayLastOneEval(arra_str) {
        if (arra_str) {
          let arra = eval(arra_str)
          return arra[arra.length - 1]
        }

      },
    },
    created() {
      this.pickerOptions = this.initPickerOptions();
      if (this.$route.query.time_range) {
        let [start, end] = this.$route.query.time_range.split(',');
        this.listQuery.time_value = [new Date(parseInt(start)), new Date(parseInt(end))];
      }
      this.people = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.initSgForm();
      this.is_admin_role = this.roles.includes('malfunction_admin') || this.roles.includes('malfunction_super_admin')
      this.is_super_role = this.roles.includes('malfunction_super_admin')
      this.handleFilter()
    },
    mounted() {
      getUserList().then(response => {
        this.user_list = response
      });
      getAppNameCascade().then(response => {
        this.app_name_cascade = response
      });
      getLevelCascade().then(response => {
        this.level_cascade = response
      });
      getMaintenanceList().then(response => {
        this.maintenance_list = response
      });
      getHandlerList().then(response => {
        this.handler_list = response
      })
      getUserDepartment().then(response => {
        this.listQuery.assemble = [response['department']]
      })

    },
    methods: {
      exportAllClick() {
        window.location.href = process.env.VUE_APP_BASE_API + "/workflow/malfunction_export_all";
      },
      cellClick(row, column, cell, event) {
        if (['事件概述'].indexOf(column.label) !== -1) {
          row.in_double_line = !row.in_double_line
          this.list = JSON.parse(JSON.stringify(this.list)); //深拷贝
        }
      },
      cellStyleClass() {
        return 'padding:7px 0'
      },
      scoreChanged() {
        // console.log(this.sgDetailFormEdit.score_table_data)
        for (let i of this.sgDetailFormEdit.score_table_data) {
          let score_phone = i.score_phone ? parseInt(i.score_phone) : 0
          let score_handle = i.score_handle ? parseInt(i.score_handle) : 0
          let score_comprehensive = i.score_comprehensive ? parseInt(i.score_comprehensive) : 0
          let score_recover = i.score_recover ? parseInt(i.score_recover) : 0
          let score_remote = i.score_remote ? parseInt(i.score_remote) : 0
          let score_scene = i.score_scene ? parseInt(i.score_scene) : 0
          let score_spare_part = i.score_spare_part ? parseInt(i.score_spare_part) : 0
          i.score_sum = score_phone + score_handle + score_comprehensive + score_recover + score_remote + score_scene + score_spare_part
          console.log(i.score_sum)
        }
      },
      assembleChanged() {
        this.sgDetailFormEdit.first_level = this.sgDetailFormEdit.assemble[0]
        console.log(this.sgDetailFormEdit.first_level)
        // this.sgDetailFormEdit = JSON.parse(JSON.stringify(this.sgDetailFormEdit)); //深拷贝
      },
      clickAddDeviceButton() {
        if (this.sgDetailFormEdit.device_table_data.length !== 0) {
          let data = JSON.parse(JSON.stringify(this.sgDetailFormEdit.device_table_data[this.sgDetailFormEdit.device_table_data.length - 1])); //深拷贝;
          this.sgDetailFormEdit.device_table_data.push({project: data.project})
        } else {
          this.sgDetailFormEdit.device_table_data.push({})
        }
      },
      clickDeleteDeviceButton(row) {
        if (this.sgDetailFormEdit.device_table_data.length <= 1) {
          this.$message({
            showClose: true,
            message: '不能再删啦',
            type: 'error'
          });
          return;
        }

        let msg = '确定要删除信息吗?';
        if (!row.equipment_ip) {
          this.sgDetailFormEdit.device_table_data.splice(row.index, 1)
          return
        }

        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          this.sgDetailFormEdit.device_table_data.splice(row.index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      deviceHeaderClass() {
        return 'text-align: center;background:#f5f7fa;color:#56585c;padding:6px 0 5px 0'
      },
      initPickerOptions() {
        return {
          onPick(time) {
            console.log(time)
          },
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
            }],
        }
      },
      DeleteLine(row) {
        let msg = '确定要删除信息吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteMalfunction(row.id).then((response) => {
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            });
            this.handleReset()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })

      },
      malResultChanged(value) {
        console.log(value);
        if ([3, 4].indexOf(value) !== -1 && [null, ''].indexOf(this.sgDetailFormEdit.end_time) !== -1) {
          this.sgDetailFormEdit.end_time = new Date().getTime()
        }
      },
      disabledDate(end) {
        return end.getTime() < this.sgDetailFormEdit.start_time - 86400000 + 1 || end.getTime() > new Date().getTime()
      },
      disabledStartDate(end) {
        return end.getTime() > new Date().getTime()

      },
      detailDialogOpen(row) {
        this.fillUpForm(row)
        this.clear_maintenance()
        this.show_detail_dialog = true;
      },
      getEquipmentDetail() {
        let routes = this.$router.resolve({path: '/cmdb/resoucre', query: {ip_list: this.sgDetailFormEdit.equipment_ip}});
        window.open(routes.href, "_blank");
      },
      getMaintenanceDetail(maintenance) {
        let routes = this.$router.resolve({path: '/cmdb/supplierManage', query: {name: maintenance}});
        if (maintenance === '未知') {
          routes = this.$router.resolve({path: '/cmdb/supplierManage', query: {name: ''}});
        }
        window.open(routes.href, "_blank");
      },
      // getAppDetail() {
      //   let routes;
      //   if (this.sgDetailFormEdit.project.length >= 3) {
      //     routes = this.$router.resolve({
      //       path: '/cmdb/app',
      //       query: {
      //         app_cname_i: this.sgDetailFormEdit.project[this.sgDetailFormEdit.project.length - 1],
      //         cascader_list: this.sgDetailFormEdit.project.slice(0, 3).toString()
      //       }
      //     })
      //   } else {
      //     routes = this.$router.resolve({path: '/cmdb/app', query: {cascader_list: this.sgDetailFormEdit.project.toString()}})
      //   }
      //   window.open(routes.href, "_blank");
      //
      // },
      arrayDel(array, index) {
        let new_array = [];
        for (let i in array) {
          if (parseInt(index) !== parseInt(i)) {
            new_array.push(array[i])
          }
        }
        return new_array
      },
      addFormCategoryChange() {
        getNewestMalId(this.sgDetailFormEdit.category).then(response => {
          this.sgDetailFormEdit.mal_id = response.mal_id;
        })
      },
      endTimeChanged(value) {
        if (value) {
          this.sgDetailFormEdit.mal_result = 3
        }
        this.getTimeLong()
      },
      getTimeLong() {
        if (!this.sgDetailFormEdit.end_time || !this.sgDetailFormEdit.start_time) {
          this.sgDetailFormEdit.time_long = ''
        } else {
          let time_long = (this.sgDetailFormEdit.end_time - this.sgDetailFormEdit.start_time) / 1000;
          let res;
          if (time_long < 60) {
            res = parseInt(time_long) + '秒'
          } else if (60 <= time_long && time_long < 3600) {
            res = parseInt(time_long / 60) + '分' + parseInt(time_long % 60) + '秒'
          } else if (3600 <= time_long && time_long < 86400) {
            res = parseInt(time_long / 3600) + '时' + parseInt(time_long % 3600 / 60) + '分'
          } else if (time_long >= 86400) {
            let h = parseInt(time_long % 86400)
            res = parseInt(time_long / 86400) + '天' + parseInt(h / 3600) + '时' + parseInt(h % 3600 / 60) + '分'
          }
          this.sgDetailFormEdit.time_long = res
        }
      },
      initSgForm() {
        this.sgDetailFormEdit = {
          id: null, category: 1, registrant: '', mal_id: '', start_time: null, end_time: null, description: '', postscript: '', handler: '',
          handle_process: '', mal_result: '', project: [], db_manager: '', sql_ip_port: '', project_manager: '', time_long: '', equipment_ip: '',
          maintenance: '', subdivision: [], solution: '', reason: '', level: '', first_level: '', cause_department: [],
          device_table_data: [], score_table_data: [],
        };
      },
      formatDate(row) {
        let time_long;
        if (!row.end_time) {
          time_long = new Date().getTime() / 1000 - row.start_time;
        } else {
          time_long = row.end_time - row.start_time;
        }

        let res;
        if (time_long < 60) {
          res = parseInt(time_long) + '秒'
        } else if (60 <= time_long && time_long < 3600) {
          res = parseInt(time_long / 60) + '分' + parseInt(time_long % 60) + '秒'
        } else if (3600 <= time_long && time_long < 86400) {
          res = parseInt(time_long / 3600) + '时' + parseInt(time_long % 3600 / 60) + '分'
        } else if (time_long >= 86400) {
          let h = parseInt(time_long % 86400)
          res = parseInt(time_long / 86400) + '天' + parseInt(h / 3600) + '时' + parseInt(h % 3600 / 60) + '分'
        }
        row.time_long = res;
        return res
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
      remoteSearchProject(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.projectListP = Object.keys(this.projectList).filter(item => {
              return item.toString().indexOf(query) > -1
            })
          }, 200)
        } else {
          this.projectListP = []
        }
      },
      validateIpAddress(rule, value, callback) {
        if (value) {
          if (validMultipleIp(value)) {
            callback()
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      },
      validatePort(rule, value, callback) {
        if (value) {
          if (validPort(value)) {
            callback()
          } else {
            callback(new Error('端口填写不正确'))
          }
        } else {
          callback()
        }
      },
      validateScore15(rule, value, callback) {
        if (value) {
          if (validScore15(value)) {
            callback()
          } else {
            callback(new Error('填写不正确'))
          }
        } else {
          callback()
        }
      },
      validateEndTime(rule, value, callback) {
        if (value) {
          if (this.sgDetailFormEdit.end_time < this.sgDetailFormEdit.start_time) {
            callback(new Error('结束时间不能小于开始时间'))
          }
        } else {
          if (this.sgDetailFormEdit.mal_result === 3) {
            callback(new Error('结束状态需填写结束时间'))
          }
        }
      },
      validateSolution(rule, value, callback) {
        if (this.sgDetailFormEdit.mal_result === 3 && !value) {
          callback(new Error('结束状态需填写解决方案'))
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
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      handleReset() {
        this.resetListQuery();
        this.getList()
      },
      correctedEndTime() {
        if (this.sgDetailFormEdit.mal_result === 1) {
          this.sgDetailFormEdit.end_time = null
        } else if (this.sgDetailFormEdit.mal_result === 2) {
          this.sgDetailFormEdit.end_time = null
        } else if (this.sgDetailFormEdit.mal_result === 4) {
          this.sgDetailFormEdit.end_time = new Date().getTime()
        }
      },
      addSubmitConfirm() {
        this.commit_button_loading = true;
        this.sgDetailFormEdit.change_user = this.people;
        this.correctedEndTime()
        let error_message = [];

        let keys = Object.keys(this.rules_add)
        for (let i in this.sgDetailFormEdit.device_table_data) {
          for (let prop of ['equipment_ip', 'port']) {
            let key = 'device_table_data.' + i + '.' + prop
            keys.push(key)
          }
        }
        for (let i of this.sgDetailFormEdit.device_table_data) {
          if (i.maintenance === "安图特") {
            for (let i in this.sgDetailFormEdit.score_table_data) {
              for (let prop of Object.keys(this.sgDetailFormEdit.score_table_data[0])) {
                let key = 'score_table_data.' + i + '.' + prop
                keys.push(key)
              }
            }
            break
          }
        }

        for (let key of keys) {
          this.$refs.sgDetailFormEdit.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        }
        let str_err = error_message.toString();
        console.log(str_err)
        if (str_err === '') {
          let send_data = Object.assign({}, this.sgDetailFormEdit)
          send_data.start_time = parseInt(send_data.start_time / 1000);
          send_data.end_time = parseInt(send_data.end_time / 1000);
          send_data.maintenance = send_data.maintenance.toString();

          createNewMalfunction(send_data).then(response => {
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });

              this.handleReset()
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.handleReset()

            }
          })
          this.commit_button_loading = false;
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          this.commit_button_loading = false;
          return false
        }

      },
      editSubmitConfirm() {
        this.commit_button_loading = true;
        console.log('click commit')
        this.correctedEndTime();
        let error_message = [];

        let keys = Object.keys(this.rules_add)
        for (let i in this.sgDetailFormEdit.device_table_data) {
          for (let prop of ['equipment_ip', 'port']) {
            let key = 'device_table_data.' + i + '.' + prop
            keys.push(key)
          }
        }
        for (let i of this.sgDetailFormEdit.device_table_data) {
          if (i.maintenance === "安图特") {
            for (let i in this.sgDetailFormEdit.score_table_data) {
              for (let prop of Object.keys(this.sgDetailFormEdit.score_table_data[0])) {
                let key = 'score_table_data.' + i + '.' + prop
                keys.push(key)
              }
            }
            break
          }
        }
        for (let key of keys) {
          this.$refs.sgDetailFormEdit.validateField(key, msg => {
            if (msg !== '') {
              error_message.push(msg)
            }
          });
        }
        let str_err = error_message.toString();
        if (str_err === '') {
          let send_data = Object.assign({}, this.sgDetailFormEdit)
          send_data.start_time = parseInt(send_data.start_time / 1000);
          send_data.end_time = parseInt(send_data.end_time / 1000);
          send_data.maintenance = send_data.maintenance.toString();
          send_data.change_user = this.people;

          let pk = send_data.id;
          editMalfunction(send_data, pk).then(response => {
            if (response['error']) {
              this.$notify({
                title: '失败',
                message: response['error'],
                type: 'warning',
                duration: 3000
              });
              this.handleReset()
            } else {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 3000
              });
              this.handleReset()
            }
          });
          this.commit_button_loading = false;
        } else {
          this.$message({
            message: '表单填写有误',
            type: 'warning'
          });
          this.commit_button_loading = false;
          return false
        }

      },
      addNew() {
        this.commit_button_loading = false;
        this.fileList = [];
        this.initSgForm();
        this.show_index_page = false;
        this.show_add_page = true;
        this.sgDetailFormEdit.registrant = this.people;
        this.sgDetailFormEdit.mal_result = 1;
        this.sgDetailFormEdit.level = 2;
        getNewestMalId(this.sgDetailFormEdit.category).then(response => {
          this.sgDetailFormEdit.mal_id = response.mal_id;
        })
        this.sgDetailFormEdit.device_table_data.push({project: ['无影响']})
        this.sgDetailFormEdit.score_table_data.push({
          score_phone: '', score_remote: '', score_scene: '',
          score_spare_part: '', score_handle: '', score_recover: '', score_comprehensive: ''
        })
      },
      fillUpForm(row) {
        this.sgDetailFormEdit.id = row.id;
        this.sgDetailFormEdit.category = row.category;
        this.sgDetailFormEdit.registrant = row.registrant;
        this.sgDetailFormEdit.mal_id = row.mal_id;
        this.sgDetailFormEdit.subdivision = row.first_level + ' / ' + row.subdivision;
        this.sgDetailFormEdit.first_level = row.first_level;
        this.sgDetailFormEdit.assemble = [row.first_level, row.subdivision];
        this.sgDetailFormEdit.handler = row.handler;
        this.sgDetailFormEdit.mal_id = row.mal_id;
        this.sgDetailFormEdit.start_time = row.start_time * 1000;
        this.sgDetailFormEdit.end_time = (row.end_time === null || row.end_time === '') ? '' : row.end_time * 1000;
        this.sgDetailFormEdit.description = row.description;
        this.sgDetailFormEdit.mal_result = row.mal_result;
        this.sgDetailFormEdit.level = row.level;
        this.sgDetailFormEdit.reason = row.reason;
        this.sgDetailFormEdit.solution = row.solution;
        this.sgDetailFormEdit.cause_department = eval(row.cause_department);

        this.getTimeLong();

        getHandleProcess(row.id).then(response => {
          this.sgDetailFormEdit.handle_process = response['handle_process'];
        });
        getDeviceInfo(row.id).then(response => {
          this.sgDetailFormEdit.device_table_data = response['device_table_data'];
        });
        getScoreInfo(row.id).then(response => {
          if (response['score_table_data'].length === 0) {
            this.sgDetailFormEdit.score_table_data = [{
              score_phone: '', score_remote: '', score_scene: '',
              score_spare_part: '', score_handle: '', score_recover: '', score_comprehensive: ''
            }]
          } else {
            this.sgDetailFormEdit.score_table_data = response['score_table_data'];
          }
          this.scoreChanged();
        });
      },
      clear_maintenance() {
        if (this.sgDetailFormEdit.maintenance.length > 1) {
          let index = this.sgDetailFormEdit.maintenance.indexOf('无');
          if (index > -1) {
            this.sgDetailFormEdit.maintenance.splice(index, 1);
          }
        }
      },
      equipIpChanged(row) {
        getEquipDetail({'equipment_ip': row.equipment_ip}).then(res => {
          for (let i of this.sgDetailFormEdit.device_table_data) {
            if (i.equipment_ip === row.equipment_ip) {
              this.$set(i, 'brand', res.brand)
              this.$set(i, 'device_model', res.device_model)
              this.$set(i, 'maintenance', res.maintenance)
            }
          }
        })
      },
      editOld(row) {
        this.commit_button_loading = false;
        this.fillUpForm(row)
        this.show_index_page = false;
        this.show_add_page = false;
        this.show_edit_page = true;
        this.clear_maintenance()
      },
      getList() {
        this.listLoading = true;
        this.show_index_page = true;
        this.show_add_page = false;
        this.show_edit_page = false;
        getMalfunctionList(this.listQuery).then(response => {
          this.list = response.results;
          for (let i of this.list) {
            i.in_double_line = true
          }
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter(way = '') {
        if (way === 'change' && this.listQuery.assemble.length === 1) {
          return;
        }
        if (way === 'blur' && this.listQuery.assemble.length === 2) {
          return;
        }
        this.listQuery.page = 1;
        if (this.listQuery.assemble) {
          this.listQuery.assemble_str = this.listQuery.assemble.toString()
        }
        if (this.listQuery.time_value) {
          console.log(this.listQuery.time_value)
          let start = Math.floor(this.listQuery.time_value[0] / 1000);
          let end = Math.floor(this.listQuery.time_value[1] / 1000 + 86400);
          if (end - start > 86400 * 366) {
            this.$message({
              showClose: true,
              message: '错了哦，选择时间范围不可以超过1年',
              type: 'error'
            });
            return
          } else {
            this.listQuery.time_range = start + ',' + end
          }
        } else {
          this.listQuery.time_range = undefined
        }

        this.getList()
      },
      resetListQuery() {
        this.listQuery = {page: 1, limit: 20, registrant: '', subdivision: ''}
      },
    }
  }
</script>
<style>
  .tag_textarea {
    padding: 5px 10px;
    line-height: 26px;
    min-height: 30px;
    max-height: 240px;
    border-radius: 4px;
    width: 100%;
    overflow: auto;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 12px;
  }

  .el-card-header {
    padding: 5px 10px 3px 10px;
    color: #606266;
    line-height: 26px;
    border: solid 1px rgb(209, 233, 255);
    min-height: 30px;
    max-height: 120px;
    background-color: #fafafa;
    border-radius: 4px;
    width: 100%;
    overflow: auto;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 14px;
    margin: -10px 0 20px 0;
  }

  .fieldset_in_edit {
    margin: 10px 10px 10px 10px;
    padding: 10px 10px 0 10px;
    border-color: lavender;
    border-radius: 4px;

  }

  .el-card-header_in_edit {
    padding: 4px 10px 3px 16px;
    color: #606266;
    line-height: 26px;
    min-height: 30px;
    max-height: 120px;
    background-color: #a3dbfc;
    border-radius: 4px;
    width: 100%;
    overflow: auto;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 15px;
    margin: 10px 0 27px 0;
  }

  .el-card_in_edit {
    border-bottom: 1px solid whitesmoke;
    border-left: 1px solid whitesmoke;
    border-right: 1px solid whitesmoke;
    margin-top: 20px;
    border-radius: 4px;
  }

  .el-card__header {
    border-bottom-color: whitesmoke
  }

  img {
    max-width: 100%
  }

  .double_line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
