<template>
  <div class="app-container">
    <el-form ref="listQuery" id="listQuery1" :model="listQuery" :inline="true" label-width="150px">
      <div
        class="listQuery-Search-icon"
        @click="listQuerySearch = !listQuerySearch"
        style="cursor: pointer"
        v-show="!listLoading"
      >高级搜索<i
        class="el-icon-arrow-right"
        :class="{'is-active': listQuerySearch}"
      ></i></div>
      <transition name="el-zoom-in-top">
        <div style="padding-right: 75px;position: relative;">
          <template v-for="item in listQueryKeys">
            <transition name="el-zoom-in-top" :key="item.key">
              <el-form-item v-show="item.def || listQuerySearch">
                <component
                  :is="item.component"
                  v-model="listQuery[item.key]"
                  :placeholder="item.name"
                  :limit="item.limit"
                  :item="item"
                  :selOptions="retOptions(item.key)"
                ></component>
              </el-form-item>
            </transition>
          </template>
          <el-form-item>
            <el-button :disabled="listLoading" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
            <el-button :disabled="listLoading" @click="resetlistQuery" style="margin-left: 10px;" type="primary" plain
                       icon="el-icon-refresh">重置
            </el-button>
            <el-button :disabled="listLoading" type="primary" icon="el-icon-plus" plain @click="openAddAppForm">新增
            </el-button>
<!--            <el-button :disabled="listLoading" @click="openKeysEditDialog" plain type="primary">编辑数据项</el-button>-->
            <el-button :disabled="listLoading" @click="dialogUpload = true" plain icon="el-icon-upload" type="primary">
              导入
            </el-button>
            <el-button :disabled="listLoading || !checkList.length" @click="batchDeletion" plain type="danger">
              批量删除
            </el-button>
          </el-form-item>
          <el-button style="position: absolute;bottom: 22px;right: 0" :disabled="listLoading" @click="exportAllClick"
                     plain icon="el-icon-download" type="primary">导出
          </el-button>
        </div>
      </transition>
    </el-form>

    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list"
      stripe
      width="100%"
      :default-sort="{prop: 'date', order: 'descending'}"
      highlight-current-row
      row-key="id"
      @row-click="opneRow"
      @expand-change="toggleRowExpansion"
      @selection-change="handleSelectionChange"
      :key="tablekey">
      <el-table-column type="expand" width="36">
        <template slot="header">
          <i ref="expandHead" @click="closeRows" class="el-icon-arrow-right"></i>
        </template>
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item v-for="item in columnDetails" :key='item.key'>
              <span v-if="item.filters === 'e_open'"><b>{{item.name}}：</b>{{ props.row[item.key] | openArray}}</span>
              <span v-else-if="item.filters === 'date1'"><b>{{item.name}}：</b>{{ props.row[item.key] | date1}}</span>
              <span v-else-if="item.filters === 'project_type'"><b>{{item.name}}：</b>
                <el-tag v-if="props.row[item.key] === '标准类'" size="medium">{{ props.row[item.key]}}</el-tag>
                <el-tag v-else-if="props.row[item.key] === '维护类'" type="success"
                        size="medium">{{ props.row[item.key]}}</el-tag>
                <el-tag v-else-if="props.row[item.key] === '重构类'" type="info"
                        size="medium">{{ props.row[item.key]}}</el-tag>
                <span v-else>{{defText}}</span>
              </span>
              <span v-else><b>{{item.name}}：</b>{{ props.row[item.key] || defText}}</span>
            </el-form-item>
            <div class="bd-r1"></div>
            <div class="bd-r2"></div>
            <div class="bd-r3"></div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        width="105px"
        align="center"
        sortable
        :render-header="tableTitle"
        column-key="columTitle1"
        :sort-method="sortList"
        :resizable="false"
      >
        <template slot-scope="scope">
          <div class="text1"><a style="color: #46a6ff" @click.stop="dialogDetail(scope.row)">{{ scope.row.number ||
            defText}}</a>
          </div>
          <div class="text2">{{ scope.row.add_time_time | date1}}</div>
        </template>
      </el-table-column>

      <!--      故障名称-->
      <el-table-column
        width="200px"
        align="center"
        :resizable="false"
      >
        <template slot="header">
          <div class="text1">{{dataKeysMap.break_title}}</div>
        </template>
        <template slot-scope="scope">
          <e_text class="text2" :text="scope.row.break_title" :tip="scope.row.break_title"></e_text>
        </template>
      </el-table-column>

      <!--      系统模块-->
      <el-table-column
        align="center"
        :resizable="false"
      >
        <template slot="header">

          <div class="text1">{{dataKeysMap.system}}</div>
          <div class="text1">{{dataKeysMap.app}}</div>
        </template>
        <template slot-scope="scope">
          <tip-text :classStr="'textO text2'" :text="scope.row.system || defText"></tip-text>
          <tip-text :classStr="'textO text1'" :text="scope.row.app || defText"></tip-text>

        </template>
      </el-table-column>

      <!--      对应产品，责任部门-->
      <el-table-column
        align="center"
        :resizable="false"
      >
        <template slot="header">
          <div>{{dataKeysMap.product}}</div>
          <div>{{dataKeysMap.blame_department_name}}</div>
        </template>
        <template slot-scope="scope">
          <tip-text :classStr="'textO text1'" :text="scope.row.product || defText"></tip-text>
          <div v-if="scope.row.blame_department_name && scope.row.blame_department_name.length > 0">
<!--            <SAI_department_ls :ls="scope.row.blame_department_name"/>-->
            <div>{{scope.row.blame_department_name[0].ou_name}}</div>
          </div>
          <div class="textO text2" v-else>{{defText}}</div>
        </template>
      </el-table-column>

      <!--      异常情况描述-->
      <el-table-column
        width="200px"
        align="center"
        :resizable="false"
      >
        <template slot="header">
          <div class="text1">{{dataKeysMap.exception}}</div>
        </template>
        <template slot-scope="scope">
          <div class="text1">{{ scope.row.exception}}</div>
        </template>
      </el-table-column>

      <!--      发生时间，完成时间-->
      <el-table-column
        width="200px"
        align="center"
        :resizable="false"
      >
        <template slot="header">
          <div class="text1">{{dataKeysMap.gz_start_time}}</div>
          <div class="text1">{{dataKeysMap.gz_end_time}}</div>
        </template>
        <template slot-scope="scope">
          <div class="text1">{{ scope.row.gz_start_time}}</div>
          <div class="text1">{{ scope.row.gz_end_time}}</div>
        </template>
      </el-table-column>

      <!--      处理时长-->
      <el-table-column
        width="130px"
        align="center"
        sortable
        :render-header="tableTitle"
        column-key="columTitle2"
        :sort-method="sortList1"
        :resizable="false"
      >
        <template slot-scope="scope">
          <div class="text1">{{ scope.row.gz_continued + ' 分钟'}}</div>
        </template>
      </el-table-column>

      <!--      影响程度最终等级Gn-->
      <el-table-column
        width="178px"
        align="center"
        sortable
        :render-header="tableTitle"
        column-key="columTitle3"
        :sort-method="sortList2"
        :resizable="false"
      >
        <template slot-scope="scope">
          <e_rate :star="scope.row.start_class"></e_rate>
        </template>
      </el-table-column>

<!--      故障原因-->
      <el-table-column
        width="200px"
        align="center"
        :resizable="false"
      >
        <template slot="header">
          <div class="text1">{{dataKeysMap.except_reason}}</div>
        </template>
        <template slot-scope="scope">
          <div class="text1">{{ scope.row.except_reason}}</div>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        :resizable="false"
      >
        <template slot="header">
          <div>{{dataKeysMap.solve_people_name}}</div>
          <div>{{dataKeysMap.own_people_name}}</div>
        </template>
        <template slot-scope="scope">
          <tip-text :classStr="'textO text1'" :text="openArray(scope.row.solve_people_name)"></tip-text>
          <tip-text :classStr="'textO text2'" :text="openArray(scope.row.own_people_name)"></tip-text>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="60px">
        <template slot-scope="scope">
          <i class="el-icon-edit" style="color: #409eff;padding-right: 8px;cursor: pointer;"
             @click.stop="openEditAppForm(scope.row)"></i><i
          class="el-icon-delete" style="color: #ff4949;cursor: pointer;"
          @click.stop="doDelete(scope.row)"></i>
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

    <el-dialog :title="apptitle" :visible.sync="dialogEditAppVisible" width="1300px" append-to-body :lock-scroll='true'>
      <div>
        <el-form ref="editAppForm" :model="editAppForm" :rules="rules" class="editAppForm" :inline="true"
                 label-width="150px" style="width:100%">
          <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px #67C23A solid;border-radius: 0px">
            <div slot="header" class="clearfix">
              <div style="margin: -10px;position: relative;">
                <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
                <label style="font-size:15px;">基础信息</label>
                <i @click="cardVisb.info1 = !cardVisb.info1"
                   :style="{transform: cardVisb.info1 ? 'rotate(0deg)' : 'rotate(90deg)'}"
                   style="position: absolute;right: 0;top: 5px;z-index: 9"
                   class="el-icon-arrow-right"></i>
              </div>
            </div>
            <transition name="el-zoom-in-top">
              <div v-show="cardVisb.info1" style="padding: 20px">
                <template v-for="item in formKeys">
                  <el-form-item :label="item.name" :prop="keyValue[item.key] || item.key" :key='item.key'>
                    <component
                      :is="item.component"
                      v-model.trim="editAppForm[keyValue[item.key] || item.key]"
                      :item="item"
                      :selOptions="retOptions(keyValue[item.key] || item.key)"
                    ></component>
                  </el-form-item>
                </template>
              </div>
            </transition>
          </el-card>
          <el-card shadow="never" class="el-card_in_edit"
                   style="border-top: 3px rgba(103, 194, 58, .6) solid;border-radius: 0px;">
            <div slot="header" class="clearfix">
              <div style="margin: -10px;position: relative;">
                <svg-icon icon-class="detail_info" style="color:grey;height:14px;"/>
                <label style="font-size:15px;">处理信息</label>
                <i @click="cardVisb.info2 = !cardVisb.info2"
                   :style="{transform: cardVisb.info2 ? 'rotate(0deg)' : 'rotate(90deg)'}"
                   style="position: absolute;right: 0;top: 5px;z-index: 9" data-v-2f6a61b0=""
                   class="el-icon-arrow-right"></i>
              </div>
            </div>
            <transition name="el-zoom-in-top">
              <div v-show="cardVisb.info2" style="padding: 20px">
                <template v-for="item in formKeys1">
                  <el-form-item :label="item.name" :prop="keyValue[item.key] || item.key" :key='item.key'>
                    <component
                      :is="item.component"
                      v-model.trim="editAppForm[keyValue[item.key] || item.key]"
                      :item="item"
                      :selOptions="retOptions(keyValue[item.key] || item.key)"
                    ></component>
                  </el-form-item>
                </template>
              </div>
            </transition>
          </el-card>
          <el-card shadow="never" class="el-card_in_edit" style="border-top: 3px #409EFF solid;border-radius: 0px">
            <div slot="header" class="clearfix">
              <div style="margin: -10px;position: relative;">
                <svg-icon icon-class="detail_form" style="color:grey;"/>
                <label style="font-size:15px;">其他信息</label>
                <i @click="cardVisb.info3 = !cardVisb.info3"
                   :style="{transform: cardVisb.info3 ? 'rotate(0deg)' : 'rotate(90deg)'}"
                   style="position: absolute;right: 0;top: 5px;z-index: 9" data-v-2f6a61b0=""
                   class="el-icon-arrow-right"></i>
              </div>
            </div>
            <transition name="el-zoom-in-top">
              <div v-show="cardVisb.info3" style="padding: 20px">
                <template v-for="item in formKeys2">
                  <el-form-item :label="item.name" :prop="keyValue[item.key] || item.key" :key="item.key">
                    <component
                      :is="item.component"
                      v-model.trim="editAppForm[keyValue[item.key] || item.key]"
                      :item="item"
                      :selOptions="retOptions(keyValue[item.key] || item.key)"
                    ></component>
                  </el-form-item>
                </template>
                <el-form-item v-for="item in dataKeysEdit" :key="item.key" :label="item.name">
                  <el-input v-model.trim="editAppForm[item.key]"></el-input>
                </el-form-item>
              </div>
            </transition>
          </el-card>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditAppVisible = false">取 消</el-button>
        <el-button type="primary" @click="subForm('editAppForm')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请选择" :visible.sync="visible" width="1000px" append-to-body :lock-scroll='true'>
      <div class="keys-wrapper">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="基础数据项" name="1">
            <el-row>
              <el-col v-for="item in dataKeys" :key="item.key" :span="8">
                <div class="dataKeyItem">
                  <el-input v-model="item.name"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="扩展数据项" name="2">
            <el-row style="min-height: 46px">
              <el-col :span="8" v-for="(item, index) in dataKeysEdit" :key="index">
                <div class="dataKeyItem">
                  <i class="el-icon-error" @click="deleteKey(index)"></i>
                  <el-input v-model="item.name"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-button @click="addKeys" class="add-btn" type="primary" icon="el-icon-plus" round circle></el-button>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="onSub">确 定</el-button>
        </span>
    </el-dialog>

    <SAI_detail :detailsDialog.sync="detailsDialog" :data-item="detaildata"></SAI_detail>
    <upload-excel :dialogUpload.sync="dialogUpload"></upload-excel>
    <download-file :dialogDown.sync="dialogDown"></download-file>
  </div>
</template>

<script>
  import SparkMD5 from "spark-md5";
  import Pagination from '@/components/Pagination';
  import * as components from './components/system_avail_info/';
  import sessionListQuery from '@/components/mixins/sessionListQuery';

  import {
    getlist,
    add,
    doEdit,
    doDelete,
    change_extra_title,
    get_extra_title,
    getRow,
    doBatchDeletion
  } from '@/api/itsm/event_management';
  import {getUserInfo} from '@/api/zabbix/user_info';
  import {getDepart} from '@/api/manage_monitor/user_department';
  // 下拉选项
  const selectOptions = {
    system_type: [{label: '管理类'}, {label: '操作类'}, {label: '运营类'}],
    project_type: [{label: '维护类'}, {label: '标准类'}, {label: '重构类'}],
    except_type: [{label: '系统故障'}],
    yc_reason: [{label: '应用类故障'}, {label: '服务器类故障'}],
    is: [{label: '是'}, {label: '否'}]
  }
  // 下拉数据提交及编辑需处理数据项(展示数据数据项与表单提交数据数据项映射)
  const keyValue = {
    'solve_people_name': 'solve_people_name',
    'own_people_name': 'own_people_name',
    'check_people_name': 'check_people_name',
    'confirm_people_name': 'confirm_people_name',
    'add_people_name': 'add_people_name',
  }
  // 表单校验
  const validate_blame_department_name = (rule, value, callback) => {
    try {
      if (value && typeof value === 'object' && value instanceof Array && value.length > 0) {
        if (value.length === 1 && !value[0].ouid && !value[0].own_people[0].own_people_id) {
          callback()
        }
        let isEmpty = false
        let isEmptyPeople = false
        const per = value.reduce((persent, v) => {
          if (!v.ouid) isEmpty = true
          persent += v.own_people.reduce((persentPeople, j) => {
            if (!j.own_people_id) isEmptyPeople = true
            persentPeople += j.persent * 1
            return persentPeople
          }, 0)
          return persent
        }, 0)
        if (per === 100 && !isEmpty && !isEmptyPeople) {
          callback();
        } else {
          if (isEmpty) callback(new Error('请选择责任部门'));
          else if (isEmptyPeople) callback(new Error('请选择负责人'));
          else callback(new Error('责任部门百分比之和要为100'));
        }
      } else {
        callback(new Error('数据错误'));
      }
    } catch (e) {
      callback(new Error('验证失败'));
    }
  };
  const rules = {
    // blame_department_name: [
    //   {validator: validate_blame_department_name, trigger: 'blur'}
    // ],
    yc_range: [
      {min: 0, max: 5, message: '长度不能超过5个字符', trigger: 'blur'}
    ],
    number: [
      {required: true, message: '请输入编号', trigger: 'blur'}
    ],
    break_title: [
      {required: true, message: '请输入故障名称', trigger: 'blur'}
    ],
    system: [
      {required: true, message: '请选择系统', trigger: 'change'}
    ],
    solve_people_id: [
      {required: true, message: '请选择处理人', trigger: 'change'}
    ],
    // own_people_id: [
    //   {required: true, message: '请选择负责人', trigger: 'change'}
    // ],
    app: [
      {required: true, message: '请选择应用', trigger: 'change'}
    ],
    exception: [
      {required: true, message: '请输入异常情况描述', trigger: 'blur'}
    ],
    except_reason: [
      {required: true, message: '请输入故障原因', trigger: 'blur'}
    ],
  }
  // listQuery数据项 页面表单与绑定数据映射
  const queryKeys = {
    is_report: {sort: 21, component: 'SAI_select4', key: 'is_report'},
    standard_report: {sort: 22, component: 'SAI_select4', key: 'standard_report'},
    solve_people_name: {sort: 28, component: 'SAI_select1', key: 'solve_people'},
    own_people_name: {sort: 29, component: 'SAI_select1', key: 'own_people'},
    start_class: {sort: 25, component: 'SAI_rate', key: 'start_class'},
    end_class: {sort: 26, component: 'SAI_rate', key: 'end_class'},
    overtime_report: {sort: 23, component: 'SAI_select4', key: 'overtime_report'},
    confirm_people_name: {sort: 30, component: 'SAI_select1', key: 'confirm_people'},
    overtime_yc_operate: {sort: 24, component: 'SAI_select4', key: 'overtime_yc_operate'},
    add_people_name: {sort: 27, component: 'SAI_select1', key: 'add_people'},
    blame_department_name: {sort: 4, component: 'SAI_select7', key: 'blame_department', def: true},
    product: {sort: 5, component: 'SAI_input', key: 'product', def: true},
    app: {sort: 2, component: 'SAI_select2', key: 'app', noMultiple: true, def: true},
    system: {sort: 1, component: 'SAI_select2', key: 'system', noMultiple: true, def: true},
    yc_reason: {sort: 3, component: 'SAI_select5', key: 'yc_reason', def: true},
    add_time_time: {sort: 6, component: 'SAI_dateTime1', key: 'add_time_search', span: 12, def: true},
  }
  // filter函数
  const openArray = (val) => {
    if (val instanceof Array) {
      val = val.join('，')
    }
    return val || '-'
  };
  const date1 = (val) => {
    if (val) {
      val = val.split(' ')[0]
    }
    return val || '-'
  };
  const intPer = (val) => {
    const v = val * 1;
    if (!(v > 1)) {
      return val
    }
    return parseInt(v) === v ? v : v.toFixed(2)
  };
  // colum 列自定义表头 区分不同表头  key值与columKey对应 值为从表头字段名称数据中筛选所用字段key值
  const columTitle = {
    columTitle1: ['number', 'add_time_time'],
    // columTitle2: ['gz_continued', 'sj_continued'],
    // columTitle3: ['start_class', 'end_class'],
    columTitle2: ['gz_continued'],
    columTitle3: ['end_class'],
  }
  export default {
    mixins: [sessionListQuery],
    components: {
      Pagination,
      ...components
    },
    data() {
      const keys = [
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 1,
          "component": "SAI_input",
          "sort": 2,
          "type": "input",
          "width": "160px",
          "key": "number",
          "name": "编号",
          "filters": "e_link",
          "sortDetail": 1
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 1,
          "component": "SAI_input1",
          "sort": 2,
          "type": "textarea",
          "width": "160px",
          "key": "break_title",
          "name": "故障名称",
          "sortDetail": 1
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 6,
          "component": "SAI_dateTime2",
          "sort": 1,
          "type": "dateTime",
          "width": "160px",
          "key": "add_time_time",
          "name": "日期",
          "filters": "date1",
          "sortDetail": 6
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 2,
          "component": "SAI_select2",
          "sort": 3,
          "type": "select2",
          "width": "200px",
          "key": "system",
          "name": "系统",
          "sortDetail": 2
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 3,
          "component": "SAI_select2",
          "sort": 4,
          "type": "select3",
          "width": "200px",
          "key": "app",
          "name": "模块",
          "sortDetail": 3
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 23,
          "component": "SAI_input",
          "sort": 8,
          "type": "input",
          "width": "150px",
          "key": "product",
          "name": "对应产品",
          "sortDetail": 6
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 27,
          "component": "SAI_select6",
          "sort": 9,
          "type": "select6",
          "width": "150px",
          "key": "blame_department_name",
          "name": "责任部门",
          "sortDetail": 23,
          "filters": 'departments',
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 25,
          "component": "SAI_input",
          "sort": 105,
          "type": "input",
          "width": "150px",
          "key": "project_number_code",
          "name": "项目编号",
          "sortDetail": 26
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 25,
          "component": "",
          "sort": 101,
          "type": "text",
          "width": "150px",
          "key": "project_name",
          "name": "项目名称",
          "sortDetail": 100
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 26,
          "component": "SAI_select5",
          "sort": 109,
          "type": "select5",
          "width": false,
          "key": "project_type",
          "name": "项目类型",
          "filters": "project_type",
          "sortDetail": 27
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 100,
          "component": "",
          "sort": 121,
          "type": "text",
          "width": "150px",
          "key": "create_user_name",
          "name": "创建人",
          "filters": "e_open",
          "sortDetail": 100
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 100,
          "component": "",
          "sort": 125,
          "type": "text",
          "width": "150px",
          "key": "create_time",
          "name": "创建时间",
          "sortDetail": 100
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 100,
          "component": "",
          "sort": 129,
          "type": "text",
          "width": "150px",
          "key": "modify_user_name",
          "name": "修改人",
          "filters": "e_open",
          "sortDetail": 100
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 100,
          "component": "",
          "sort": 133,
          "type": "text",
          "width": "150px",
          "key": "update_time",
          "name": "修改时间",
          "sortDetail": 100
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 18,
          "component": "SAI_select5",
          "sort": 14,
          "type": "select5",
          "width": "110px",
          "key": "except_type",
          "name": "异常类型",
          "sortDetail": 18
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 7,
          "component": "SAI_select5",
          "sort": 15,
          "type": "select5",
          "width": "110px",
          "key": "yc_reason",
          "name": "异常原因",
          "sortDetail": 7
        },
        {
          "tabclu": true,
          "infoType": "info2",
          "sortForm": 28,
          "component": "SAI_input",
          "sort": 16,
          "type": "input",
          "width": false,
          "key": "yc_operate_type",
          "name": "影响操作类型",
          "sortDetail": 28
        },
        {
          "tabclu": true,
          "infoType": "info2",
          "sortForm": 29,
          "component": "SAI_input",
          "sort": 17,
          "type": "input",
          "width": false,
          "key": "yc_range",
          "name": "影响范围",
          "sortDetail": 29
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 20,
          "component": "SAI_input",
          "sort": 136,
          "type": "textarea",
          "width": "200px",
          "key": "exception",
          "name": "异常情况描述",
          "sortDetail": 20
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 24,
          "component": "SAI_select5",
          "sort": 113,
          "type": "select5",
          "width": false,
          "key": "system_type",
          "name": "系统属性",
          "sortDetail": 24
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 24,
          "component": "",
          "sort": 117,
          "type": "text",
          "width": false,
          "key": "system_weight",
          "name": "系统权重",
          "sortDetail": 24
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 21,
          "component": "SAI_select4",
          "sort": 123,
          "type": "select4",
          "width": false,
          "key": "balance",
          "name": "是否计入稳定性考核",
          "sortDetail": 21
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 22,
          "component": "SAI_select4",
          "sort": 122,
          "type": "select4",
          "width": false,
          "key": "develop",
          "name": "是否发布原因",
          "sortDetail": 22
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 31,
          "component": "SAI_dateTime",
          "sort": 130,
          "type": "dateTime",
          "width": false,
          "key": "gz_end_time",
          "name": "故障修复完成时间",
          "sortDetail": 31
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 30,
          "component": "SAI_dateTime",
          "sort": 126,
          "type": "dateTime",
          "width": false,
          "key": "gz_start_time",
          "name": "故障发生时间",
          "sortDetail": 30
        },
        {
          "tabclu": true,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 21,
          "type": "text",
          "width": false,
          "key": "gz_continued",
          "name": "故障处理时长",
          "filters": "e_company",
          "sortDetail": 31
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 32,
          "component": "SAI_dateTime",
          "sort": 115,
          "type": "dateTime",
          "width": false,
          "key": "sj_start_time",
          "name": "数据处理开始时间",
          "sortDetail": 32
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 33,
          "component": "SAI_dateTime",
          "sort": 119,
          "type": "dateTime",
          "width": false,
          "key": "sj_end_time",
          "name": "数据处理结束时间",
          "sortDetail": 33
        },
        {
          "tabclu": true,
          "infoType": "info3",
          "sortForm": 34,
          "component": "SAI_rate",
          "sort": 29,
          "type": "rate",
          "width": false,
          "key": "start_class",
          "name": "影响程度初始等级G0",
          "filters": "e_rate",
          "sortDetail": 34
        },
        {
          "tabclu": true,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 22,
          "type": "text",
          "width": false,
          "key": "sj_continued",
          "name": "数据处理时长",
          "filters": "e_company",
          "sortDetail": 33
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 102,
          "type": "text",
          "width": "160px",
          "key": "yc_start_time",
          "name": "异常发生时间",
          "sortDetail": 100
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 106,
          "type": "text",
          "width": "160px",
          "key": "yc_end_time",
          "name": "异常结束时间",
          "sortDetail": 100
        },
        {
          "tabclu": true,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 28,
          "type": "text",
          "width": false,
          "key": "yc_continued",
          "name": "异常影响时长",
          "filters": "e_company",
          "sortDetail": 100
        },
        {
          "tabclu": true,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 27,
          "type": "text",
          "width": false,
          "key": "percentage",
          "name": "影响时长换算比例",
          "sortDetail": 100
        },
        {
          "tabclu": true,
          "infoType": "info3",
          "sortForm": 35,
          "component": "SAI_rate",
          "sort": 30,
          "type": "rate",
          "width": false,
          "key": "end_class",
          "name": "影响程度最终等级Gn",
          "filters": "e_rate",
          "sortDetail": 35
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 114,
          "type": "text",
          "width": false,
          "key": "except_time_class",
          "name": "异常处理总时长换算时长按星级",
          "sortDetail": 100
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 100,
          "component": "",
          "sort": 118,
          "type": "text",
          "width": false,
          "key": "except_time_weight",
          "name": "异常处理总时长换算时长按权重",
          "sortDetail": 100
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 38,
          "component": "SAI_dateTime",
          "sort": 111,
          "type": "dateTime",
          "width": "160px",
          "key": "user_confirm_time_time",
          "name": "用户确认时间",
          "sortDetail": 38
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 36,
          "component": "SAI_dateTime",
          "sort": 103,
          "type": "dateTime",
          "width": "160px",
          "key": "devops_report_time_time",
          "name": "运维上报时间",
          "sortDetail": 36
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 39,
          "component": "SAI_dateTime2",
          "sort": 127,
          "type": "dateTime",
          "width": "160px",
          "key": "zg_end_time",
          "name": "计划整改完成时间",
          "filters": "date1",
          "sortDetail": 39
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 37,
          "component": "SAI_dateTime",
          "sort": 107,
          "type": "dateTime",
          "width": "160px",
          "key": "developer_report_time_time",
          "name": "开发报备时间",
          "sortDetail": 37
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 19,
          "component": "SAI_input",
          "sort": 134,
          "type": "textarea",
          "width": "300px",
          "key": "except_reason",
          "name": "故障原因",
          "sortDetail": 19
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 4,
          "component": "SAI_select1",
          "sort": 37,
          "type": "select1",
          "width": false,
          "key": "solve_people_name",
          "name": "处理人",
          "limit": 5,
          "filters": "e_open",
          "sortDetail": 4
        },
        {
          "tabclu": true,
          "infoType": "info1",
          "sortForm": 5,
          "component": "SAI_select1",
          "sort": 38,
          // "type": "select1",
          "type": "text",
          "width": false,
          "key": "own_people_name",
          "name": "负责人",
          "limit": 5,
          "filters": "e_open",
          "sortDetail": 5
        },
        {
          "tabclu": false,
          "infoType": "info1",
          "sortForm": 5,
          "component": "SAI_select1",
          "sort": 128,
          "type": "select1",
          "width": false,
          "key": "check_people_name",
          "name": "验收人",
          "limit": 5,
          "filters": "e_open",
          "sortDetail": 43
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 41,
          "component": "SAI_input",
          "sort": 135,
          "type": "textarea",
          "width": "600px",
          "key": "zg_ideas",
          "name": "整改措施",
          "sortDetail": 41
        },
        {
          "tabclu": false,
          "infoType": "info2",
          "sortForm": 40,
          "component": "SAI_dateTime2",
          "sort": 131,
          "type": "dateTime",
          "width": false,
          "key": "sj_zg_end_time",
          "name": "实际整改完成时间",
          "filters": "date1",
          "sortDetail": 40
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 42,
          "component": "SAI_select1",
          "sort": 120,
          "type": "select1",
          "width": "120px",
          "key": "confirm_people_name",
          "name": "报告审核人",
          "limit": 2,
          "filters": "e_open",
          "sortDetail": 42
        },
        // {
        //   "tabclu": false,
        //   "infoType": "info2",
        //   "sortForm": 43,
        //   "component": "SAI_select1",
        //   "sort": 128,
        //   "type": "select1",
        //   "width": "120px",
        //   "key": "check_people_name",
        //   "name": "验收人",
        //   "limit": 2,
        //   "filters": "e_open",
        //   "sortDetail": 43
        // },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 44,
          "component": "SAI_select4",
          "sort": 104,
          "type": "select4",
          "width": false,
          "key": "is_report",
          "name": "是否提供报告",
          "sortDetail": 44
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 45,
          "component": "SAI_select4",
          "sort": 108,
          "type": "select4",
          "width": false,
          "key": "standard_report",
          "name": "报告是否规范",
          "sortDetail": 45
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 46,
          "component": "SAI_dateTime2",
          "sort": 112,
          "type": "dateTime",
          "width": false,
          "key": "time_report_time",
          "name": "报告提交时间",
          "filters": "date1",
          "sortDetail": 46
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 47,
          "component": "SAI_select4",
          "sort": 116,
          "type": "select4",
          "width": false,
          "key": "overtime_report",
          "name": "报告提交是否超时",
          "sortDetail": 47
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 48,
          "component": "SAI_select4",
          "sort": 110,
          "type": "select4",
          "width": false,
          "key": "overtime_yc_operate",
          "name": "异常处理是否超时",
          "sortDetail": 48
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 49,
          "component": "SAI_select1",
          "sort": 124,
          "type": "select1",
          "width": "120px",
          "key": "add_people_name",
          "name": "记录人",
          "limit": 2,
          "filters": "e_open",
          "sortDetail": 49
        },
        {
          "tabclu": false,
          "infoType": "info3",
          "sortForm": 50,
          "component": "SAI_input",
          "sort": 132,
          "type": "textarea",
          "width": "150px",
          "key": "comment",
          "name": "备注",
          "sortDetail": 50
        }
      ];
      return {
        keyValue: Object.freeze(keyValue),
        rules: Object.freeze(rules),
        selectOptions: Object.freeze(selectOptions),
        queryKeys: Object.freeze(queryKeys),
        defText: '-',
        userOptions: [],
        fieldsOptions: {},
        departoptions: [],
        dialogUpload: false,
        dialogDown: false,
        detailsDialog: false,
        detaildata: {
          fixkeys: [],
          file_json: []
        },
        listQuerySearch: false,
        listQuery: {
          is_report: null,// 是否提供报告
          standard_report: null,// 报告是否规范
          solve_people: null,// 处理人
          own_people: null,// 负责人
          start_class: null,// 影响程度初始等级G0
          end_class: null,// 影响程度最终等级Gn
          overtime_report: null,// 报告提交是否超时
          confirm_people: null,// 报告审核人
          overtime_yc_operate: null,// 异常处理是否超时
          add_people: null,// 记录人
          blame_department: null,// 责任部门
          product: null,// 对应产品
          app: null,// 应用
          system: null,// 系统
          yc_reason: null,// 异常原因
          add_time_search: null,// 日期（开始时间和结束时间，格式："2020-04-14 08:22:23"）
          page: 1,
          limit: 20,
        },
        editAppForm: {
          id: null,
          solve_people_id: null,
          own_people_id: null,
          add_people_id: null,
          check_people_id: null,
          confirm_people_id: null,
          blame_department_name: null,
          status: null,
        },
        dataKeys: keys,
        dataKeysEdit: [],
        resList: [],
        total: 0,
        apptitle: '新增',
        listLoading: false,
        dialogEditAppVisible: false,
        visible: false,
        activeNames: ['2'],
        tablekey: '',
        cardVisb: {
          info1: true,
          info2: true,
          info3: true,
        },
        openRow: [],
        checkList: []
      };
    },
    computed: {
      formKeys() {
        return this.dataKeys.filter(v => v.type !== 'text' && v.infoType === 'info1').sort((a, b) => a.sortForm - b.sortForm);
      },
      formKeys1() {
        return this.dataKeys.filter(v => v.type !== 'text' && v.infoType === 'info2').sort((a, b) => a.sortForm - b.sortForm);
      },
      formKeys2() {
        return this.dataKeys.filter(v => v.type !== 'text' && v.infoType === 'info3').sort((a, b) => a.sortForm - b.sortForm);
      },
      listQueryKeys() {
        const keys1 = Object.keys(this.queryKeys);
        return this.dataKeys.reduce((list, val) => {
          if (keys1.includes(val.key)) {
            list.push(Object.assign({}, val, this.queryKeys[val.key]))
          }
          return list;
        }, []).sort((a, b) => {
          return a.sort - b.sort
        })
      },
      columnDetails() {
        const fixKeys = this.dataKeys.filter(val => !val.tabclu).sort((a, b) => {
          return a.sort - b.sort
        });
        // debugger
        const editKeys = [...this.dataKeysEdit];
        console.log('fixKeys',fixKeys)
        console.log('editKeys',editKeys)
        return [...fixKeys, ...editKeys];
      },
      list() {
        return this.resList.reduce((list, item, index) => {
          const data = item.file_json && this.dataKeysEdit.reduce((dataList, val) => {
            dataList[val.key] = item.file_json[val.key];
            return dataList;
          }, {})
          list.push({...item, ...data, index: ++index});
          return list;
        }, [])
      },
      dataKeysMap() { // dataKeys 值的 key和name对应关系 映射数据
        return this.dataKeys.reduce((obj, v) => {
          obj[v.key] = v.name;
          return obj;
        }, {})
      }
    },
    watch: {
      openRow(nval) {
        if (nval.length > 0) {
          this.$refs['expandHead'].className = "el-icon-arrow-right rotate90";
        } else {
          this.$refs['expandHead'].className = "el-icon-arrow-right";
        }
      },
    },
    mounted() {
      this.getUserOptions();
      this.getFieldsOptions();
      this.getDepartOptions();
      this.initConfig();
    },
    methods: {
      exportAllClick() {
        window.location.href = process.env.VUE_APP_BASE_API + "/itsm/export_excel_data/";
      },
      initConfig() {
        Promise.all([this.getExtraTitle(), this.getList()]).then(() => {
          this.init();
        });
      },
      init() {
        // 表单固定数据项
        this.dataKeys.map((val) => {
          this.$set(this.editAppForm, val.key, undefined);
        })

        // 表单扩展数据项
        this.dataKeysEdit.map((val) => {
          this.$set(this.editAppForm, val.key, undefined);
        })
      },
      handleSelectionChange(val) {
        this.checkList = val;
      },
      batchDeletion() {
        this.$confirm('确定要删除这些信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = this.checkList.reduce((list, v) => {
            list.push(v.id)
            return list;
          }, [])
          doBatchDeletion({ids}).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          })
            .catch((err) => {
              console.error(err)
            })
        }).catch(() => {

        });
      },
      getExtraTitle() {
        return get_extra_title().then((res) => {
          this.dataKeys = res.msg.dataKeys || [];
          this.dataKeysEdit = res.msg.dataKeysEdit || [];
        })
      },
      dialogDetail(row) {
        const item = {...row};
        const file_json = this.dataKeysEdit.reduce((Arr, v, index) => {
          Arr.push({...v, index: ++index, value: item.file_json && item.file_json[v.key]});
          return Arr;
        }, [])
        item.file_json = file_json;
        let fixkeys = [];
        [...this.dataKeys].map((val) => {
          fixkeys.push({
            ...val,
            [val.key]: item[val.key]
          });
        });
        this.detaildata = {fixkeys, file_json};
        this.detailsDialog = true;
      },
      resetEditAppForm() { // 编辑数据
        Object.keys(this.editAppForm).map((key) => {
          this.editAppForm[key] = undefined;
        })
      },
      openAddAppForm() { // 新增数据
        this.apptitle = '新增';
        this.resetEditAppForm();
        this.dialogEditAppVisible = true;
        this.$nextTick(() => {
          this.$refs['editAppForm'].clearValidate();
        })
      },
      openEditAppForm(item) {
        const data = this.$utils.index.deepClone(item);
        this.apptitle = '编辑';
        this.dialogEditAppVisible = true;
        this.editAppForm = data;
        this.$nextTick(() => {
          this.$refs['editAppForm'].clearValidate();
        })
      },
      subForm(formName) {
        const bdn = this.editAppForm.blame_department_name
        const val = bdn.reduce((str, v) => {
          const own_people = v.own_people.reduce((peos, p) => {
            if (p.own_people_id) peos.id += p.own_people_id + ','
            if (p.own_people_name) peos.name.push(p.own_people_name)
            return peos
          }, {id: '', name: []})
          str.id += own_people.id
          str.name = str.name.concat(own_people.name)
          return str;
        }, {id: '', name: []})
        this.editAppForm.own_people_id = val.id.slice(0, -1);
        this.editAppForm.own_people_name = val.name;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.doSubForm();
          } else {
            return false;
          }
        });
      },
      doSubForm() {
        let query = {...this.editAppForm};
        const file_json = this.dataKeysEdit.reduce((list, val) => {
          list[val.key] = query[val.key];
          delete query[val.key];
          return list;
        }, {});
        query = {...query, file_json: file_json};
        Object.keys(query).map((val) => {
          if (!query[val]) delete query[val];
        })
        const bdn = query.blame_department_name
        if (bdn.length === 1 && !bdn[0].ouid && !bdn[0].own_people[0].own_people_id) {
          query.blame_department_name = []
        }
        if (this.apptitle === '新增') {
          add(query).then((res) => {
            if (res.msg) {
              this.$message.error(res.msg);
            } else {
              this.$message.success('新增成功');
              this.subSuccess();
            }
          })
        }
        if (this.apptitle === '编辑') {
          doEdit(query).then((res) => {
            if (res.msg) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('修改成功');
              this.subSuccess();
            }
          })
        }
      },
      subSuccess() {
        this.dialogEditAppVisible = false;
        this.getList();
      },
      doDelete(item) {
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          doDelete(item).then((res) => {
            this.getList();
          })
        }).catch(() => {
        })
      },
      onSub() {
        let names = [];
        let isRepeatName = false;
        let isRepeatKey = false;
        this.dataKeysEdit.map((val) => {
          val = {...val};
          if (val.name) {
            isRepeatName = names.some(v => v.name === val.name)
            if (!val.key) {
              val.key = SparkMD5.hash(val.name).slice(0, 7);
            }
            isRepeatKey = names.some(v => v.key === val.key)
            names.push(val)
          }
        })
        if (isRepeatName) {
          this.$confirm('名称不能重复');
          return
        }
        if (isRepeatKey) {
          this.$confirm('新增名称不能与已使用过的新增名称重复');
          return
        }
        change_extra_title({"expand_title": {dataKeys: this.dataKeys, dataKeysEdit: names}}).then((res) => {
          this.$message.success(res.msg);
          this.visible = false;
          this.initConfig();
        })
      },
      openKeysEditDialog() {
        this.visible = true;
      },
      deleteKey(index) {
        this.dataKeysEdit.splice(index, 1);
      },
      addKeys() {
        if (!this.dataKeysEdit.some(val => !val.name)) this.dataKeysEdit.push({
          key: null,
          name: null,
          value: null,
          type: 'input',
          width: false
        })
      },
      handleChange(val) {
        if (!val.some(val => val === '2')) {
          this.activeNames.push('2')
        }
      },
      getList() {
        const query = Object.keys(this.listQuery).reduce((data, key) => {
          if (this.listQuery[key]) data[key] = this.listQuery[key];
          return data;
        }, {})
        this.listLoading = true;
        return getlist(query).then(response => {
          this.resList = response.results;
          this.total = response.count;
          this.tablekey = new Date().getTime();
          this.listLoading = false;
        })
      },
      resetlistQuery() {
        this.listQuery = this.$options.data().listQuery;
        this.tablekey = new Date().getTime();
        this.$nextTick(() => {
          this.getList();
        })
      },
      getUserOptions() {
        getUserInfo().then(response => {
          this.userOptions = response
        });
      },
      getFieldsOptions() {
        getRow().then(res => {
          this.fieldsOptions = res;
        })
      },
      getDepartOptions() {
        getDepart().then(res => {
          this.departoptions = res;
        })
      },
      retOptions(key) {
        // 根据字段返回子组件下拉数据集
        switch (key) {
          case 'system':
            return this.fieldsOptions.system
          case 'app':
            return this.fieldsOptions.app
          case 'blame_department_name': // 编辑责任部门及负责人
            return [this.departoptions, this.userOptions]
          case 'blame_department': // 条件查询责任部门
            return this.departoptions
          case 'solve_people_id':
          case 'own_people_id':
          case 'check_people_id':
          case 'confirm_people_id':
          case 'add_people_id':
          case 'solve_people':
          case 'own_people':
          case 'check_people':
          case 'confirm_people':
          case 'add_people':
            return this.userOptions
          default:
            return []
        }
      },
      tableTitle(h, {column, $index}) {
        const titles = [
          h('div', this.dataKeysMap[columTitle[column.columnKey][0]]),
          h('div', this.dataKeysMap[columTitle[column.columnKey][1]]),
        ]
        return h('div', {
          style: {
            display: 'inline-flex',
          }
        }, [
          h('div', titles)
        ]);
      },
      sortList(a, b) {
        return new Date(a.add_time_time).getTime() - new Date(b.add_time_time).getTime();
      },
      sortList1(a, b) {
        return a.gz_continued - b.gz_continued;
      },
      sortList2(a, b) {
        return a.end_class - b.end_class;
      },
      toggleRowExpansion(row, expandedRows) {
        this.openRow = expandedRows;
      },
      closeRows() {
        this.openRow.map((row) => {
          this.$refs['table'].toggleRowExpansion(row, false)
        })
      },
      opneRow(row) {
        this.$refs['table'].toggleRowExpansion(row, !this.openRow.some((i) => {
          return i.id === row.id
        }))
      },
      openArray
    },
    filters: {
      openArray,
      date1
    },
    provide() {
      return {
        selectOptions,
        openArray,
        date1,
        intPer,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    position: relative;
    z-index: 0;
  }

  .listQuery-Search-icon {
    position: absolute;
    right: 10px;
    top: 25px;
    transition: all .3s;
    z-index: 9;

    .is-active {
      transform: rotate(90deg);
    }
  }

  .keys-wrapper {
    padding-right: 36px;
    position: relative;

    .add-btn {
      position: absolute;
      right: 0;
      bottom: 30px;
    }
  }

  // /deep/ .el-table th > .cell {
  //   /*overflow: hidden;*/
  //   /*white-space: nowrap;*/
  //   /*text-overflow: ellipsis;*/
  // }

  /deep/ .editAppForm {
    .el-input {
      width: 220px;
    }

    .el-textarea {
      width: 220px;
    }
  }

  .dataKeyItem {
    padding: 5px 15px;
    position: relative;
    transition: all .3s;

    &:hover {
      .el-icon-error {
        display: block;
      }
    }

    .el-icon-error {
      display: none;
      position: absolute;
      right: 9px;
      top: 0;
      z-index: 9;

      &:hover {
        color: rgb(92, 182, 255);
      }
    }
  }

  /deep/ .textO {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  // /deep/ .text1 {

  // }

  /deep/ .text2 {
    color: rgb(132, 146, 166);
  }

  /deep/ .el-card__body {
    padding: 0;
  }

  /deep/ .el-table thead .is-sortable .cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /deep/ .el-table__expanded-cell {
    padding: 0 0 5px 0;

    .table-expand {
      border: 1px solid #dfe6ec;
      padding: 20px 50px;
      position: relative;

      .el-form-item {
        width: calc((100%) / 4);
        min-width: 200px;
        margin-bottom: 0;
        margin-right: 0;
        padding: 5px 20px 5px 0;
      }

      .el-form-item__content {
        line-height: 1.5rem;
      }

      .bd-r {
        position: absolute;
        height: calc(100% - 40px);
        top: 20px;
        width: 1px;
        background: #dfe6ec;
      }

      .bd-r1 {
        @extend .bd-r;
        left: calc((100% - 100px) / 4 + 40px);
      }

      .bd-r2 {
        @extend .bd-r;
        left: calc((100% - 100px) / 2 + 40px);
      }

      .bd-r3 {
        @extend .bd-r;
        left: calc((100% - 100px) / 4 * 3 + 40px);
      }
    }
  }

  // @media only screen and (max-width: 1680px) {
  //   /deep/ .el-table__expanded-cell {
  //     .table-expand {
  //       /*margin-right: 100px;*/
  //     }
  //   }
  // }

  /deep/ .editAppForm .el-form--inline .el-form-item {
    margin-right: 0;
    width: 33.333%;
  }

  /deep/ .el-icon-arrow-right {
    transition: all .3s ease;
  }

  /deep/ .rotate90 {
    transform: rotate(90deg);
  }
</style>
