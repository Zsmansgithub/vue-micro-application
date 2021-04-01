<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="app_name">
          <el-input v-model="listQuery.app_name" placeholder="请输入搜索条件" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="是否核对" style="width: 110px;" clearable
                     @input="handleFilter">
            <el-option value="未核对" label="未核对"></el-option>
            <el-option value="已核对" label="已核对"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.in_or_out" placeholder="出入向" style="width: 110px;" clearable
                     @input="handleFilter">
            <el-option v-for="item in inOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.leader" placeholder="负责人" @input="handleFilter" clearable style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.line" placeholder="线路" @change="handleFilter" clearable style="width: 120px;">
            <el-option v-for="item in lineOptions" :key="item.value_or_code" :label="item.displayname" :value="item.value_or_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div v-if="listQuery.select1==='in'">
            <el-button type="text" @click="listQuery.select1='out'">核对人<i class="el-icon-caret-bottom "></i></el-button>
            <el-select v-model="listQuery.check_user" placeholder="核对人" @input="handleFilter" clearable filterable
                       style="width: 100px;">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </div>
          <div v-else-if="listQuery.select1==='out'">
            <el-button type="text" @click="listQuery.select1='in'">录入人<i class="el-icon-caret-bottom "></i></el-button>
            <el-select v-model="listQuery.add_user" placeholder="录入人" @change="handleFilter" clearable filterable
                       style="width: 100px;">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <div v-if="listQuery.select == 'uuid'">
            <el-button type="text" @click="listQuery.select='ouid'">申请日期<i class="el-icon-caret-bottom "></i></el-button>
            <!--            <span class="demonstration">到期日期</span>-->
            <el-date-picker
              v-model="listQuery.opr_time_s"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              @change="handleFilter">
            </el-date-picker>
          </div>
          <div v-else-if="listQuery.select == 'ouid'">
            <el-button type="text" @click="listQuery.select='uuid'">核对日期<i class="el-icon-caret-bottom"></i></el-button>
            <!--                    <span class="demonstration">注册日期</span>-->
            <el-date-picker
              v-model="listQuery.res_time"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              @change="handleFilter">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" v-if="adminrole" type="primary" @click="dialogSearchVisible=true" plain
                   icon="el-icon-plus">新增
        </el-button>
        <el-button class="filter-item" v-if="adminrole" :loading="downloadLoading" plain type="primary"
                   icon="el-icon-download" @click="exportCommon">导出
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
      @row-click="toggleRowExpansion" ref="table"
    >
      <el-table-column label="ID" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.app_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="源地址" width="200">
        <template slot-scope="scope">
          <pre class="pre_class">{{ scope.row.resource_address |  row2MultipleRow}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="目的地址" width="200">
        <template slot-scope="scope">
          <pre class="pre_class">{{ scope.row.destination |  row2MultipleRow}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="出入向" width="90" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.in_or_out===0">入向</span>
          <span v-else-if="scope.row.in_or_out===1">出向</span>
          <span v-else>内网权限/内网负载</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时长/申请人" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.valid_time==='3155731200'">永久</span>
          <span v-else>{{ scope.row.valid_time | parseTime('{y}-{m}-{d}')}}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.apply_user}}</div>
        </template>
      </el-table-column>
      <el-table-column label="录入人/核对人" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.add_user}}</span>
          <div style="color: #8492a6; font-size: 10px">{{scope.row.check_user}}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否核对" width="80">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==='已核对'">已核对</el-tag>
          <el-tag type="danger" v-else>未核对</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <!--          <pre class="pre_class">{{ scope.row.remark |  row2MultipleRow}}</pre>-->
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" width="120px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" plain circle @click="handleBatchEdit(scope.row)" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain circle @click="handleBatchDelete(scope.row)"
                     icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-row>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="负责人:">
                  <span>{{props.row.leader}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="域名:">
                  <span>{{props.row.domain}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="申请部门:">
                  <span>{{ props.row.department }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="核对时间:">
                  <span v-if="props.row.check_time!==0">{{ props.row.check_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="申请时间:">
                  <span>{{ props.row.apply_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="处理时长:">
                  <span>{{ props.row.net }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>


    <el-dialog title="添加记录" :visible.sync="dialogSearchVisible" :close-on-click-modal="false" style="text-align: left;" width="65%"
               @close="handleClose">

      <div style="text-align:center">
        <el-input v-model="input_uuid" style="width: 300px;margin-bottom: 40px" placeholder="通过工单号搜索填充">
          <el-button icon="el-icon-search" slot="append" plain type="primary" @click="getWorkflow">搜索</el-button>
        </el-input>
      </div>

      <el-form ref="dataConfig" :model="dataConfig" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="应用名" prop="app_name">
              <el-input v-model.trim="dataConfig.app_name" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="出入向" prop="in_or_out">
              <el-select v-model="dataConfig.in_or_out" style="width: 100%">
                <el-option v-for="item in inOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="域名" prop="domain">
              <el-input v-model.trim="dataConfig.domain" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请部门" prop="department">
              <el-input v-model.trim="dataConfig.department" style="width: 100%">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请人" prop="apply_user">
              <el-input v-model.trim="dataConfig.apply_user" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="负责人">
              <el-input v-model.trim="dataConfig.leader" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="有效时长" prop="valid_time">
              <!--              <el-input v-model.trim="dataConfig.valid_time" style="width: 100%;"></el-input>-->
              <el-date-picker
                v-model="dataConfig.valid_time"
                align="right"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
                :picker-options="pickerOptions1"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请时间" prop="apply_time">
              <el-date-picker v-model="dataConfig.apply_time" type="datetime" placeholder="选择日期时间" align="right"
                              :picker-options="pickerOptions" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="处理时长" prop="net">
              <el-input v-model="dataConfig.net" style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="源地址">
              <el-input type="textarea" :rows="3" v-model="dataConfig.resource_address" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="目的地址">
              <el-input type="textarea" :rows="3" v-model="dataConfig.destination" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="dataConfig.remark" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('dataConfig')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改记录" :visible.sync="dialogFormVisible" style="text-align: left;" width="65%"
               @close="handleClose">
      <el-form ref="dataEditConfig" :model="dataEditConfig" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="应用名" prop="app_name">
              <el-input v-model.trim="dataEditConfig.app_name" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="出入向" prop="in_or_out">
              <el-select v-model="dataEditConfig.in_or_out" style="width: 100%">
                <el-option v-for="item in inOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="域名" prop="domain">
              <el-input v-model.trim="dataEditConfig.domain" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请部门" prop="department">
              <el-input v-model.trim="dataEditConfig.department" style="width: 100%">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请人" prop="apply_user">
              <el-input v-model.trim="dataEditConfig.apply_user" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="负责人">
              <el-input v-model.trim="dataEditConfig.leader" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="有效时长" prop="valid_time">
              <!--              <el-input v-model.trim="dataEditConfig.valid_time" style="width: 100%;"></el-input>-->
              <el-date-picker
                v-model="dataEditConfig.valid_time"
                align="right"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
                :picker-options="pickerOptions1"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请时间" prop="apply_time">
              <el-date-picker v-model="dataEditConfig.apply_time" type="datetime" placeholder="选择日期时间" align="right"
                              :picker-options="pickerOptions" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="处理时长" prop="net">
              <el-input v-model="dataEditConfig.net" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="源地址">
              <el-input type="textarea" :rows="3" v-model="dataEditConfig.resource_address"
                        style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="目的地址">
              <el-input type="textarea" :rows="3" v-model="dataEditConfig.destination" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="dataEditConfig.remark" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('dataEditConfig')">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="primary" @click="submit()">核 对</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'
  import {addDatas, deleteDatas, editDatas, fetchAllData, getLine, getWorkflow} from '@/api/cmdbs/data_manage'
  import {getUsers,} from '@/api/cainiao/f5_dns'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  export default {
    name: 'DirectivePermission',
    components: {Pagination, UploadExcelComponent},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        inOptions: [{'label': '入向', 'value': 0}, {'label': '出向', 'value': 1}, {'label': '内网权限/内网负载', 'value': 2}],
        userOptions: [{'label': '黄海龙', 'value': '黄海龙'}, {'label': '李威', 'value': '李威'}, {'label': '丘财龙', 'value': '丘财龙'}
          , {'label': '王鹏', 'value': '王鹏'}, {'label': '宋义新', 'value': '宋义新'}],
        listQuery: {
          page: 1,
          limit: 20,
          app_name: undefined,
          status: undefined,
          leader: undefined,
          add_user: undefined,
          opr_time_s: undefined,
          res_time: undefined,
          in_or_out: undefined,
          check_user: undefined,
          line: undefined,
          select1: 'in',
          select: "uuid",
        },
        dataConfig: {
          app_name: '',
          in_or_out: '',
          resource_address: '',
          destination: '',
          domain: '',
          net: '',
          valid_time: '',
          department: '',
          apply_user: '',
          leader: '',
          add_user: '',
          check_user: '',
          apply_time: '',
          remark: '',
        },
        dataEditConfig: {
          id: '',
          app_name: '',
          in_or_out: '',
          resource_address: '',
          destination: '',
          domain: '',
          net: '',
          valid_time: '',
          department: '',
          apply_user: '',
          leader: '',
          add_user: '',
          check_user: '',
          apply_time: '',
          status: '',
          remark: '',
          check_time: '',
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        pickerOptions: {
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
        pickerOptions1: {
          shortcuts: [{
            text: '永久',
            onClick(picker) {
              picker.$emit('pick', '3155731200000');
            }
          }]
        },
        input_uuid: '',
        step_line_name:'',
        false: false,
        list: null,
        total: 0,
        listLoading: true,
        activeName: 'ip',
        dialogFormVisible: false,
        dialogSearchVisible: false,
        downloadLoading: false,
        lineOptions: [],
        adminrole: false,
        rules: {
          app_name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          in_or_out: [{required: true, message: '请选择出入向', trigger: 'blur'}],
          resource_address: [{required: true, message: '请输入源地址', trigger: 'blur'}],
          destination: [{required: true, message: '请输入目的地址', trigger: 'blur'}],
          domain: [{required: true, message: '请输入域名', trigger: 'blur'}],
          valid_time: [{required: true, message: '请选择有效时长', trigger: 'blur'}],
          department: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
          apply_user: [{required: true, message: '请输入申请人姓名', trigger: 'blur'}],
          leader: [{required: true, message: '请输入负责人姓名', trigger: 'blur'}],
          status: [{required: true, message: '请选择状态', trigger: 'blur'}],
          apply_time: [{required: true, message: '请选择申请时间', trigger: 'blur'}],
          net: [{required: true, message: '请填写处理时长', trigger: 'blur'}],
        },
        user: '',
      }
    },
    created() {
      this.getList();
      this.adminrole = this.roles.includes('data_resource_manage');
      getUsers().then(res => {
        this.user = res.user
      });
      getLine().then(res => {
        this.lineOptions = res
      })
      this.getParams()
    },
    filters: {
      row2MultipleRow(data) {
        let res = '';
        if (data) {
          for (let item of data.split(' ')) {
            item += '\n';
            res += item
          }
        }
        return res
      }
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      getParams(){
        const dic =this.$route.query
        // this.dialogSearchVisible=true
        this.input_uuid=dic.uuid
        this.step_line_name=dic.step_line_name
      },
      getWorkflow() {
        getWorkflow({uuid: this.input_uuid+','+this.step_line_name}).then(res => {
          if (res.error) {
            this.$message({type: 'warning', message: res.error});
          } else {
            let row = res.success;
            if (row.types==='nw') {
              this.dataConfig.app_name = row.app_name;
              this.dataConfig.in_or_out = 0;
              this.dataConfig.domain = '无';
              this.dataConfig.department = row.ou_name;
              this.dataConfig.apply_user = row.apply_user;
              this.dataConfig.leader = '';
              this.dataConfig.apply_time = row.apply_time;
              this.dataConfig.valid_time = row.valid_time === '永久' ? 3155731200000 : new Date(row.valid_time).getTime();
              this.dataConfig.remark = row.desc;
              this.dataConfig.destination = row.dest.toString() || 'any';
              this.dataConfig.resource_address = row.resource.toString();
              this.dataConfig.net = this.formatDate(row.time_long * 60)
            }else if (row.types==='fz') {
              this.dataConfig.app_name = row.app_name;
              this.dataConfig.in_or_out = row.in_out==='入向'?0:1;
              this.dataConfig.domain = row.domain;
              this.dataConfig.department = row.ou_name;
              this.dataConfig.apply_user = row.apply_user;
              this.dataConfig.leader = '';
              this.dataConfig.apply_time = row.apply_time;
              this.dataConfig.valid_time = row.valid_time === '永久' ? 3155731200000 : new Date(row.valid_time).getTime();
              this.dataConfig.remark = row.desc;
              // this.dataConfig.destination = row.dest || 'any';
              this.dataConfig.resource_address = row.resource.toString();
              this.dataConfig.net = this.formatDate(row.time_long * 60)
            }else {
              this.dataConfig.app_name = row.app_name;
              this.dataConfig.in_or_out = 1;
              this.dataConfig.domain = '无';
              this.dataConfig.department = row.ou_name;
              this.dataConfig.apply_user = row.apply_user;
              this.dataConfig.leader = '';
              this.dataConfig.apply_time = row.apply_time;
              this.dataConfig.valid_time = row.valid_time === '永久' ? 3155731200000 : new Date(row.valid_time).getTime();
              this.dataConfig.remark = row.desc;
              this.dataConfig.destination = row.dest.toString() || 'any';
              this.dataConfig.resource_address = row.resource.toString();
              this.dataConfig.net = this.formatDate(row.time_long * 60)
            }
          }
        })
      },
      formatDate(time_long) {
        let res;
        if (time_long < 60) {
          res = parseInt(time_long) + '秒'
        } else if (60 <= time_long && time_long < 3600) {
          res = parseInt(time_long / 60) + '分' + parseInt(time_long % 60) + '秒'
        } else if (3600 <= time_long && time_long < 86400) {
          res = parseInt(time_long / 3600) + '时' + parseInt(time_long % 3600 / 60) + '分'
        } else if (time_long >= 86400) {
          let h = parseInt(time_long % 86400);
          res = parseInt(time_long / 86400) + '天' + parseInt(h / 3600) + '时' + parseInt(h % 3600 / 60) + '分'
        }
        return res
      },
      exportCommon() {
        this.downloadLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['应用名', '目的地址', '出入向', '申请人', '录入人', '负责人', '处理时长'];
          const filterVal = ['app_name', 'destination', 'in_or_out', 'apply_user', 'add_user', 'leader', 'net'];
          const list = this.list;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          });
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'in_or_out') {
            if (v[j] === 0) {
              return v[j] = '入向'
            } else if (v[j] === 1) {
              return v[j] = '出向'
            } else {
              return v[j] = '内网权限/内网负载'
            }
          } else {
            return v[j]
          }
        }))
      },
      submit() {
        let obj = {...this.dataEditConfig};
        if (obj.status === '未核对') {
          obj.check_user = this.user;
          if (obj.add_user === obj.check_user) {
            this.$message({
              type: 'warning',
              message: '核对人和录入人不能为同一人，请使用正确账号操作'
            });
          } else {
            obj.status = '已核对';
            obj.check_time = Math.floor(new Date() / 1000);
            obj.apply_time = Math.floor(new Date(obj.apply_time) / 1000);
            obj.valid_time = parseInt(obj.valid_time) / 1000;
            editDatas(obj.id, obj).then(res => {
              this.$notify({
                title: '成功',
                message: '核对成功',
                type: 'success',
                duration: 2000
              });
              this.getList()
            }).catch(response => {
              this.$msgbox({
                title: '消息',
                message: response.re.message,
              })
            });
            this.dialogFormVisible = false
          }
        } else {
          this.$message({
            type: 'warning',
            message: '该信息已核对，请选择其他操作按钮'
          });
        }
      },
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?';
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteDatas(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleBatchEdit(row) {
        this.dialogFormVisible = true;
        this.dataEditConfig.app_name = row.app_name;
        this.dataEditConfig.in_or_out = row.in_or_out;
        this.dataEditConfig.domain = row.domain;
        this.dataEditConfig.resource_address = row.resource_address;
        this.dataEditConfig.destination = row.destination;
        this.dataEditConfig.net = row.net;
        this.dataEditConfig.inner_port = row.inner_port;
        this.dataEditConfig.out_port = row.out_port;
        this.dataEditConfig.valid_time = row.valid_time * 1000;
        this.dataEditConfig.department = row.department;
        this.dataEditConfig.apply_user = row.apply_user;
        this.dataEditConfig.leader = row.leader;
        this.dataEditConfig.apply_time = new Date(row.apply_time * 1000);
        this.dataEditConfig.add_user = row.add_user;
        this.dataEditConfig.check_user = row.check_user;
        this.dataEditConfig.remark = row.remark;
        this.dataEditConfig.id = row.id;
        this.dataEditConfig.status = row.status;
        this.dataEditConfig.check_time = row.check_time
      },
      edit() {
        this.$refs.dataEditConfig.validate(valid => {
          if (valid) {
            this.dataEditConfig.apply_time = Math.floor(new Date(this.dataEditConfig.apply_time) / 1000);
            this.dataEditConfig.valid_time=parseInt(this.dataEditConfig.valid_time)/1000
            editDatas(this.dataEditConfig.id, this.dataEditConfig).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
              this.getList()
            }).catch(response => {
              this.$msgbox({
                title: '消息',
                message: response.re.message,
              })
            });
            this.dialogFormVisible = false
          }
        })
      },
      confirm() {
        this.$refs.dataConfig.validate(valid => {
          if (valid) {
            this.dataConfig.add_user = this.user;
            this.dataConfig.apply_time = Math.floor(new Date(this.dataConfig.apply_time) / 1000);
            this.dataConfig.valid_time = this.dataConfig.valid_time/1000
            addDatas(this.dataConfig).then(response => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
              this.getList()
            }).catch(response => {
              this.$msgbox({
                title: '消息',
                message: response.re.message,
              })
            });
            this.dialogSearchVisible = false
          }
        })
      },
      getList() {
        this.listLoading = true;
        if (this.listQuery.opr_time_s) {
          this.listQuery.rtime = Math.floor(new Date(this.listQuery.opr_time_s[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.opr_time_s[1]) / 1000)
        } else {
          this.listQuery.rtime = undefined
        }
        if (this.listQuery.res_time) {
          this.listQuery.stime = Math.floor(new Date(this.listQuery.res_time[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.res_time[1]) / 1000)
        } else {
          this.listQuery.stime = undefined
        }
        fetchAllData(this.listQuery).then(response => {
          this.list = response.results;
          this.total = response.count;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      handleReset() {
        this.resetlistQuery();
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = this.$options.data().listQuery
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
        this.dialogSearchVisible = false
      },
      toggleRowExpansion(row, label) {
        if (label.label == '操作') {
          return
        }
        let $table = this.$refs.table;
        this.list.map((item) => {
          if (row.id !== item.id) {
            $table.toggleRowExpansion(item, false)
          }
        });
        $table.toggleRowExpansion(row)
      },
      handleClose() {
        this.dataConfig = {
          app_name: '',
          in_or_out: '',
          resource_address: '',
          destination: '',
          inner_port: '',
          out_port: '',
          domain: '',
          net: '',
          valid_time: '',
          department: '',
          apply_user: '',
          leader: '',
          add_user: '',
          check_user: '',
          apply_time: '',
          remark: '',
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    /deep/ .permission-alert {
      width: 320px;
      margin-top: 15px;
      background-color: #f0f9eb;
      color: #67c23a;
      padding: 8px 16px;
      border-radius: 4px;
      display: inline-block;
    }

    /deep/ .permission-sourceCode {
      margin-left: 15px;
    }

    /deep/ .permission-tag {
      background-color: #ecf5ff;
    }
  }

  .pre_class {
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }
</style>

