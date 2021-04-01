<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-input v-model.trim="listQuery.id" placeholder="ID" clearable @clear="handleFilter"  style="width:150px"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.status" placeholder="状态" clearable @change="handleFilter" style="width:100px">
            <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.app_name" placeholder="APP名称" filterable clearable @change="handleFilter">
            <el-option v-for="(item, index) in local_app_name" :key="index" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="listQuery.ip_filter" placeholder="IP" clearable @keyup.enter.native="handleFilter" style="width:150px"/>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model.trim="listQuery.path_filter" placeholder="PATH" clearable @keyup.enter.native="handleFilter" style="width:150px"/> -->
          <el-select v-model="listQuery.path_filter" placeholder="PATH" filterable clearable @change="handleFilter" style="width:150px">
            <el-option v-for="(item, index) in path_list" :key="index" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.mobile_filter" placeholder="联系人" filterable clearable @change="handleFilter" style="width:150px">
            <el-option v-for="(item,index) in sms_list" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.send_mode" placeholder="告警方式" filterable clearable @change="handleFilter" style="width:150px">
            <el-option v-for="(item,index) in send_mode_status" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable style="width:130px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="adminrole" type="primary" @click="dialogVisibleAdd=true" icon="el-icon-plus">新增记录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="adminrole" type="primary" @click="bulkImportFormVisible=true;importTableData=[]">批量新增</el-button>
        </el-form-item>
        <!-- <el-form-item class="fr" style="margin-right:-2px;">
          <el-button type="warning" icon="el-icon-refresh" :loading="refreshFlag" @click="handleSync">同步APP名称</el-button>
        </el-form-item> -->
      </el-col>
    </el-form>

    <el-table class="eltabledata" v-loading="listLoading" :data="tableData" border stripe highlight-current-row :cell-style="cellStyleClass">
      <el-table-column label="ID" prop="id" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="APP名称" min-width="155" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.app_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" width="130" align="center">
        <template slot-scope="scope">
          <span v-html="scope.row.ip.replace(/,/g,'<br/>')"></span>
        </template>
      </el-table-column>
      <el-table-column label="端口" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PATH路径" show-overflow-tooltip width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方法" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求参数" show-overflow-tooltip min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parameter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期望状态码/超时时间" width="95" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.http_code }}</span>
          <div style="color:#8492a6;font-size:10px">{{ scope.row.timeout }}</div>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="160" align="center">
        <template slot-scope="scope">
          <span v-html="mobile2user(scope.row.sms_list)"></span>
        </template>
      </el-table-column>
      <el-table-column label="变更人" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="70" align="center" sortable>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0 || scope.row.status==10" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="告警方式" width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.send_mode==0">默认</span>
          <span v-else>微信</span>
        </template>
      </el-table-column>
      <el-table-column label="备注/更新时间" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-check" circle @click="handleUrl(scope.row.id)"/>
          <el-button v-if="adminrole" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"/>
          <el-button v-if="adminrole" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getRowsInf"
    />

    <el-dialog title="新增记录" :visible.sync="dialogVisibleAdd" width="850px" @close="handleCloseDialogAdd" :close-on-click-modal="false">
      <el-form ref="addForm" :model="rowAdd" :rules="rules" label-width="110px" :inline="true" style="width:100%">
        <el-row>
          <el-col :span="12">
          <!-- <el-form-item label="APP名称" min-width="300" prop="app_name">
            <el-autocomplete
              class="inline-input"
              v-model.trim="rowAdd.app_name"
              :fetch-suggestions="querySearch"
              placeholder="请输入或选择app名称"
              @select="handleSelect"
              style="width: 528px">
            </el-autocomplete>
          </el-form-item> -->
            <el-form-item label="APP名称">
              <el-input v-model.trim="rowAdd.app_name" type="text" placeholder="板块_模块_子模块_应用名" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警方式">
              <el-select v-model="rowAdd.send_mode" placeholder="请选择告警方式">
                <el-option v-for="(item,index) in send_mode_status" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="IP" prop="ip" style="height:125px">
              <el-input v-model="rowAdd.ip" type="textarea" :rows="5" placeholder="请输入IP列表,以逗号分隔." style="width:115%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口" prop="port">
              <el-input v-model.trim="rowAdd.port" type="number" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="PATH路径" prop="path">
              <el-input v-model.trim="rowAdd.path" type="text" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方法" prop="method">
              <el-select v-model="rowAdd.method" placeholder="请选择请求方法">
                <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="请求参数">
              <el-input v-model.trim="rowAdd.parameter" type="text" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望状态码" prop="http_code">
              <el-input v-model.trim="rowAdd.http_code" type="text" auto-complete="off" placeholder="期望状态码" style="width:108%;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="超时时间(S)" prop="timeout">
              <el-input v-model.trim="rowAdd.timeout" type="number" auto-complete="off" placeholder="超时时间" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="sms_list">
              <el-select v-model="rowAdd.sms_list" multiple filterable placeholder="请选择联系人">
                <el-option v-for="(item,index) in sms_list" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="rowAdd.status" placeholder="请选择状态">
                <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="rowAdd.comment" type="text" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogAdd">取 消</el-button>
        <el-button type="primary" @click="addRowInf('addForm', rowAdd)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改记录" :visible.sync="dialogVisibleEdit" width="850px" @close="handleCloseDialogEdit" :close-on-click-modal="false">
      <el-form ref="editForm" :model="rowEdit" :rules="rules" label-width="110px" :inline="true" style="width:100%">
        <el-row>
          <el-col :span="12">
            <el-form-item label="APP名称">
              <el-input v-model.trim="rowEdit.app_name" type="text" placeholder="板块_模块_子模块_应用名" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警方式">
              <el-select v-model="rowEdit.send_mode" placeholder="请选择告警方式">
                <el-option v-for="(item,index) in send_mode_status" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="IP" prop="ip" style="height:125px">
              <el-input v-model="rowEdit.ip" type="textarea" :rows="5" placeholder="请输入IP列表,以逗号分隔." style="width:115%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口" prop="port">
              <el-input v-model.trim="rowEdit.port" type="number" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="PATH路径" prop="path">
              <el-input v-model.trim="rowEdit.path" type="text" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方法" prop="method">
              <el-select v-model="rowEdit.method" placeholder="请选择请求方法">
                <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="请求参数">
              <el-input v-model.trim="rowEdit.parameter" type="text" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望状态码" prop="http_code">
              <el-input v-model.trim="rowEdit.http_code" type="text" auto-complete="off" placeholder="期望状态码" style="width:108%;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="超时时间(S)" prop="timeout">
              <el-input v-model.trim="rowEdit.timeout" type="number" auto-complete="off" placeholder="超时时间" style="width:108%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="sms_list">
              <el-select v-model="rowEdit.sms_list" multiple filterable placeholder="请选择联系人">
                <el-option v-for="(item,index) in sms_list" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="rowEdit.status" placeholder="请选择状态">
                <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="rowEdit.comment" type="text" auto-complete="off" style="width:108%;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="APP名称" min-width="100">
          <el-input v-model.trim="rowEdit.app_name" type="text" placeholder="板块_模块_子模块_应用名"/>
        </el-form-item>
        <el-form-item label="IP" min-width="100" prop="ip" style="height: 125px">
          <el-input v-model="rowEdit.ip"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入IP列表,以逗号分隔."
          />
        </el-form-item>
        <el-form-item label="端口" min-width="100" prop="port">
          <el-input v-model.trim="rowEdit.port" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model.trim="rowEdit.path" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-select v-model="rowEdit.method" placeholder="请选择请求方法" style="width: 528px">
            <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求参数">
          <el-input v-model.trim="rowEdit.parameter" type="text" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="期望状态码" min-width="100" prop="http_code">
          <el-input v-model.trim="rowEdit.http_code" type="text" auto-complete="off" placeholder="HTTP_CODE"/>
        </el-form-item>
        <el-form-item label="联系人" min-width="100" prop="sms_list">
          <el-select v-model="rowEdit.sms_list" multiple filterable placeholder="请选择联系人" style="width: 528px">
            <el-option v-for="(item,index) in sms_list" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警方式">
          <el-select v-model="rowEdit.send_mode" placeholder="请选择告警方式" style="width: 528px">
            <el-option v-for="(item,index) in send_mode_status" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" min-width="100">
          <el-select v-model="rowEdit.status" placeholder="请选择状态" style="width: 528px">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="rowEdit.comment" type="text" auto-complete="off"/>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="editRowInf('editForm', rowEdit)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="检测URL结果" :visible.sync="dialogVisibleUrl" width="1200px" @close="handleCloseDialogUrl" :close-on-click-modal="false">
      <el-table v-loading="listLoading" :data="url_result" border stripe highlight-current-row>
        <el-table-column label="URL" prop="url" show-overflow-tooltip min-width="300">
          <template slot-scope="scope">
            <a target="_blank" style="color:dodgerblue;text-decoration:underline" :href="scope.row.url">{{ scope.row.url }}</a>
          </template>
        </el-table-column>
        <el-table-column label="异常" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.exception }}</span>
          </template>
        </el-table-column>
        <el-table-column label="期望返回码" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.expected_status_code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实测返回码" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.status_code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="响应内容" min-width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.resp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结果" min-width="60">
          <template slot-scope="scope">
            <el-button v-if="scope.row.expected_status_code===scope.row.status_code.toString()" type="success" icon="el-icon-check"
                       circle></el-button>
            <el-button v-if="scope.row.expected_status_code!==scope.row.status_code.toString()" type="danger" icon="el-icon-error"
                       circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="批量导入" :visible.sync="bulkImportFormVisible" width="85%" :before-close="handleCloseBulk" top="50px"
               :close-on-click-modal="false" style="height:100%">
      <el-row>
        <el-col :span="5">
          <div>
            <a class="el-dropdown-link" href="/vue/zabbix/url_check_template.xlsx">
              <el-button type="text">URL检测（模板下载）</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="14">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="width: 100%;"/>
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
      <el-table :data="importTableData" border highlight-current-row style="width: 100%;margin-top:20px;" :row-class-name="tableRowClassName">
        <el-table-column v-for="item of importTableHeader" :key="item" :prop="item" :label="item"/>
        <el-table-column label="操作" width="60px" fixed="right" v-if="importTableData.length!=0">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="primary" circle @click.native.prevent="deleteRow(scope.$index, importTableData)"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBulk">取 消</el-button>
        <el-button type="primary" @click="uploadSuccess">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  import {getRow, addRow, editRow, deleteRow, getSMSList, getLocalAppName, getPathList, handleURL, createRList} from '@/api/zabbix/urlcheck'
  import Pagination from '@/components/Pagination'
  import {mapGetters} from 'vuex'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {validIp} from '@/utils/validate'

  var validIP = (rule, value, callback) => {
    for (let item of value.split(/[,;\/\-|\s]+/)) {
      // if(validIp(item)) {    // 待添加域名验证
      if (item) {
        // callback()
      } else {
        return callback(new Error('输入的IP格式不正确!请输入IP列表,以逗号分隔.'))
      }
    }
    callback()
  }

  var validPort = (rule, value, callback) => {
    if (Number(value) > 0 && Number(value) <= 65536) {
      callback()
    } else {
      return callback(new Error('输入的值应为0-65536!'))
    }
  }

  export default {
    name: 'URLCheck',
    components: {Pagination, UploadExcelComponent,},
    mixins: [sessionListQuery],
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          status: undefined,
          ip_filter: undefined,
          path_filter: undefined,
          app_name: undefined,
          mobile_filter: undefined,
          send_mode: undefined,
          id: undefined,
          search: undefined,
        },
        tableData: [],
        total: 0,
        dialogVisibleAdd: false,
        dialogVisibleEdit: false,
        dialogVisibleUrl: false,
        listLoading: false,
        adminrole: false,
        rowAdd: {
          app_name: '',
          ip: '',
          port: '',
          path: '',
          method: 'GET',
          parameter: '',
          http_code: '200',
          sms_list: '',
          send_mode: 0,
          change_user: this.name,
          status: 0,
          timeout: 3,
          comment: ''
        },
        rowEdit: {
          id: '',
          app_name: '',
          ip: '',
          port: '',
          path: '',
          method: '',
          parameter: '',
          http_code: '',
          sms_list: '',
          send_mdoe: '',
          change_user: this.name,
          status: '',
          timeout: '',
          comment: ''
        },
        sms_list: [],
        local_app_name: [],
        path_list: [],
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        rules: {
          // app_name: [
          //   { required: true, message: '请选择或输入APP名称', trigger: 'blur' },
          //   { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
          // ],
          ip: [
            {required: true, message: '请输入IP', trigger: 'blur'},
            {validator: validIP, trigger: 'blur'}
          ],
          port: [
            {required: true, message: '请输入端口', trigger: 'blur'},
            {validator: validPort, trigger: 'blur'}
          ],
          path: [
            {required: true, message: '请输入路径', trigger: 'blur'},
            {max: 512, message: '长度不能超过512个字符', trigger: 'blur'}
          ],
          method: [
            {required: true, message: '请输入请求方法', trigger: 'blur'},
          ],
          http_code: [
            {required: true, message: '请输入状态码', trigger: 'blur'},
          ],
          sms_list: [
            {required: true, message: '请选择联系人', trigger: 'blur'}
          ]
        },
        status: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}, {value: 10, label: '启用(有1次异常就告警)'}],
        send_mode_status: [{value: 0, label: '默认'}, {value: 1, label: '微信'}],
        methods: [{value: 'GET', label: 'GET'}, {value: 'POST', label: 'POST'}],
        url_result: [],
        bulkImportFormVisible: false,
        importTableData: [],
        importTableHeader: [],
        fileList: [],
        refreshFlag: false,
      }
    },
    created() {
      if (this.$route.params.id) {
        this.listQuery.id = this.$route.params.id;
      }

      this.getRowsInf()
      getSMSList().then(response => {
        this.sms_list = response
      })
      this.adminrole = this.roles.includes('zabbix_admin')
    },
    mounted() {
      getPathList().then(response => {
        this.path_list = response
      })

      getLocalAppName().then(response => {
        this.local_app_name = response
      })
    },
    computed: {
      ...mapGetters(['roles', 'name'])
    },
    filters: {
      row2MultipleRow(data) {
        let res = ''
        if (data) {
          for (let item of data.split(',')) {
            item += '\n'
            res += item
          }
        }
        return res
      }
    },
    methods: {
      cellStyleClass() {
        return 'padding:5px 0'
      },
      handleFilter() {
        // this.listQuery.id = undefined;
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate(valid => {
          if (valid) {
            this.getRowsInf()
          }
        })
      },

      handleReset() {
        this.resetlistQuery()
        this.getRowsInf()
      },

      getRowsInf() {
        this.listLoading = true
        getRow(this.listQuery).then(response => {
          this.tableData = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        }).catch(error => {
          this.$notify({
            title: '出错',
            message: '获取数据出错',
            type: 'error',
            duration: 3000
          })
          this.listLoading = false
        })
      },

      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          status: undefined,
          app_name: undefined,
          ip_filter: undefined,
          path_filter: undefined,
          mobile_filter: undefined,
          send_mode: undefined,
          search: undefined,
        }
      },

      handleDelete(row) {
        var msg = '确认删除该记录吗？'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteRow(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getRowsInf()
          }).catch(error => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 3000
            })
            // console.log(error)
          })
        })
      },

      handleEdit(row) {
        this.dialogVisibleEdit = true
        this.rowEdit.id = row.id
        this.rowEdit.app_name = row.app_name
        this.rowEdit.ip = row.ip
        this.rowEdit.port = row.port
        this.rowEdit.method = row.method
        this.rowEdit.parameter = row.parameter
        this.rowEdit.path = row.path
        this.rowEdit.http_code = row.http_code
        this.rowEdit.sms_list = row.sms_list.split(',')
        this.rowEdit.send_mode = row.send_mode
        this.rowEdit.status = row.status
        this.rowEdit.timeout = row.timeout
        this.rowEdit.comment = row.comment
        this.rowEdit.change_user = row.change_user
      },

      addRowInf(formName, rowAdd) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let rowInsertAdd = {
              app_name: '',
              ip: '',
              port: '',
              path: '',
              method: '',
              parameter: '',
              http_code: '',
              sms_list: '',
              send_mode: '',
              status: '',
              timeout: '',
              comment: '',
              change_user: this.name,
            }
            rowInsertAdd.app_name = rowAdd.app_name
            rowInsertAdd.ip = rowAdd.ip.split(/[,;\/\-|\s]+/).join(',')
            rowInsertAdd.port = Number(rowAdd.port)
            rowInsertAdd.path = rowAdd.path
            rowInsertAdd.method = rowAdd.method
            rowInsertAdd.parameter = rowAdd.parameter
            rowInsertAdd.http_code = rowAdd.http_code
            rowInsertAdd.sms_list = String(rowAdd.sms_list)
            rowInsertAdd.send_mode = rowAdd.send_mode
            rowInsertAdd.status = rowAdd.status
            rowInsertAdd.timeout = rowAdd.timeout
            rowInsertAdd.comment = rowAdd.comment
            // rowInsertAdd.change_user = this.name
            addRow(rowInsertAdd).then(response => {
              this.$notify({
                title: '成功',
                message: '添加记录成功',
                type: 'success',
                duration: 3000
              })
              this.dialogVisibleAdd = false
              this.getRowsInf()
            }).catch(error => {
              this.dialogVisibleAdd = false
              if (error.response.data) {
                this.$notify({
                  title: '添加失败',
                  message: '该记录添加失败',
                  type: 'error',
                  duration: 3000
                })
              }
            })
            this.$refs[formName].resetFields()
          }
        })
      },

      editRowInf(formName, rowEdit) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let rowEditNew = {
              id: '',
              app_name: '',
              ip: '',
              port: '',
              path: '',
              method: '',
              parameter: '',
              http_code: '',
              sms_list: '',
              send_mode: '',
              change_user: this.name,
              status: '',
              timoout: '',
              comment: ''
            }
            rowEditNew.id = rowEdit.id
            rowEditNew.app_name = rowEdit.app_name
            rowEditNew.ip = rowEdit.ip.split(/[,，]+/).join(',')
            rowEditNew.port = Number(rowEdit.port)
            rowEditNew.path = rowEdit.path
            rowEditNew.method = rowEdit.method
            rowEditNew.parameter = rowEdit.parameter
            rowEditNew.http_code = rowEdit.http_code
            rowEditNew.sms_list = String(rowEdit.sms_list)
            rowEditNew.send_mode = rowEdit.send_mode
            // rowEditNew.change_user = rowEdit.change_user
            rowEditNew.status = rowEdit.status
            rowEditNew.timeout = rowEdit.timeout
            rowEditNew.comment = rowEdit.comment
            editRow(rowEditNew.id, rowEditNew).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getRowsInf()
            }).catch(error => {
              if (error.response.data) {
                this.$notify({
                  title: '修改失败',
                  message: '该记录修改失败',
                  type: 'error',
                  duration: 3000
                })
              }
            })
            this.dialogVisibleEdit = false
          }
        })
      },
      handleCloseDialogAdd() {
        this.dialogVisibleAdd = false
        this.$refs['addForm'].resetFields()
      },
      handleCloseDialogEdit() {
        this.dialogVisibleEdit = false
        this.$refs['editForm'].resetFields()
      },
      handleCloseDialogUrl() {
        this.dialogVisibleUrl = false
      },

      handleUrl(id) {
        let sid = id
        handleURL(sid).then(response => {
          this.url_result = response
          this.dialogVisibleUrl = true
        })
      },

      //带输入建议
      querySearch(queryString, cb) {
        var app_name = this.app_name;
        var results = queryString ? app_name.filter(this.createFilter(queryString)) : app_name;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearch2(queryString, cb) {
        var sms_list = this.sms_list;
        var results = queryString ? sms_list.filter(this.createFilter(queryString)) : sms_list;
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

      mobile2user(mobiles) {
        let users = ''
        if (mobiles) {
          for (let item of mobiles.split(',')) {
            let user = ''
            for (let i of this.sms_list) {
              if (item === i.value) {
                // users.push(i.label)
                user = i.label + '<br/>'
                users += user
              }
            }
          }
        }
        return users
      },

      handleCloseBulk() {
        this.bulkImportFormVisible = false;
        this.fileList = [];
        this.importTableData = [];
        this.importTableHeader = [];
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
        this.importTableData = []
        this.importTableHeader = []

        // let obj = {}
        // for(let item of this.userInfoOptions) {
        //   obj[item.value] = item.label
        // }
        // for(const i in results) {
        //   let res=true
        //   if(!('应用负责人' in results[i]) && !(results[i]['应用负责人'] in obj) && (results[i]['应用负责人'].split(',').length>1)) {
        //     res = false
        //   }
        //   if(res){
        //     this.importTableData.push(results[i])
        //   }
        // }

        this.importTableHeader = header
        this.importTableData = results
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
        this.getRowsInf()
      },
      uploadSuccess() {
        this.bulkImportFormVisible = false
        createRList(this.importTableData).then(response => {
          this.showResultMessage(response)
        }).catch(error => {
          this.$message({
            message: '上传异常',
            type: 'error',
          })
        })
        this.fileList = []
      },

      // handleSync() {
      //   this.$confirm('确认执行同步操作?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {

      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       });
      //     })
      // }

    }
  }
</script>

<style lang="scss" scoped>
  // .eltabledata .cell {
  //   white-space: pre-line;
  // }
  .pre {
    font-size: 14px;
    font-family: "微软雅黑";
  }
</style>
