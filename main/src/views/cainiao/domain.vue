<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-input v-model="listQuery.domainname" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item prop="domaintype">
          <el-select v-model="listQuery.domaintype" @change="handleFilter" clearable placeholder="域名类型"
                     style="width: 120px">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="version">
          <el-select v-model="listQuery.version" @change="handleFilter" clearable placeholder="版本类型"
                     style="width: 120px">
            <el-option label="免费版" value="免费版"></el-option>
            <el-option label="企业标准版" value="企业标准版"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="listQuery.type" @change="handleFilter" clearable placeholder="状态" style="width: 120px">
            <el-option label="正常" value="正常"></el-option>
            <el-option label="异常" value="异常"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item style="position:relative;z-index:1;">-->
<!--          <div class="weui-div" @click.stop="toggle">-->
<!--            <span class="weui-switch" :class="{'weui-switch-on' : me_checked}"></span>-->
<!--            <div v-if='this.me_checked' class="weui-div-2">按到期日期</div>-->
<!--            <div v-else class="weui-div-1">按注册日期</div>-->
<!--          </div>-->
<!--        </el-form-item>-->
        <el-form-item>
          <!--          <span class="demonstration">到期日期</span>-->
          <div v-if="listQuery.select === 'uuid'">
            <el-button type="text" @click="listQuery.select='ouid'">到期日期<i class="el-icon-caret-bottom "></i></el-button>
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
          <div v-else-if="listQuery.select === 'ouid'">
            <el-button type="text" @click="listQuery.select='uuid'">注册日期<i class="el-icon-caret-bottom"></i></el-button>
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
        <!--        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>-->
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <!--        <el-button class="filter-item" v-if="adminrole" type="primary" @click="addF5">新增应用</el-button>-->
        <!--        <el-button class="filter-item" v-if="adminrole" type="danger" @click="deleteFormCommon">批量删除</el-button>-->
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @row-click="toggleRowExpansion" ref="table">
      <el-table-column label="域名" width="250" prop="domainname" sortable>
        <template slot-scope="scope">
          <a style="color: #1890ff" @click="sendDomain(scope.row.domainname)">{{ scope.row.domainname }}</a>
        </template>
      </el-table-column>
      <el-table-column label="域名类型" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.domaintype }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付费版本" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.versioncode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" prop="domainstatus" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.domainstatus==='正常'" style="color:#42B983;"><svg-icon icon-class="complete1"
                                                                                      style="width: 13px; height:13px;color:#42B983;"/> 正常</span>
          <span v-else style="color:#FF4949;"><svg-icon icon-class="warning1"
                                                        style="width: 13px; height:13px;color:#FF4949;"/> {{scope.row.domainstatus}}</span>
          <el-tooltip class="item" effect="dark" content="已溢价" placement="top" v-if="scope.row.premium==='是'">
            <span v-if="scope.row.premium==='是'"><svg-icon icon-class="money1"
                                                           style="width: 13px; height:13px;color:#FFBA00;"/></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="已过期" placement="top"
                      v-if="scope.row.expirationdatestatus==='已过期'">
            <span v-if="scope.row.expirationdatestatus==='已过期'"><svg-icon icon-class="history1"
                                                                          style="width: 13px; height:13px;color:#FF4949;"/></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="解析记录数" width="120" prop="recordcount" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.recordcount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最小TTL" prop="minttl" :formatter="formatDate" width="80">
      </el-table-column>
      <el-table-column label="注册日期" width="135" prop="registrationdate" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registrationdate |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日期" width="135" prop="expirationdate" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expirationdate |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110px" fixed="right" align="center">
        <template slot-scope="props">
          <el-button type="text" @click="refresh_domain(props.row)">
            <svg-icon icon-class="refresh8" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-button v-if="props.row.versioncode==='企业标准版'" type="text"
                     @click="sendRequest(props.row)"><svg-icon icon-class="data1" style="width: 14px; height:16px;color:#1890FF;"/>
          </el-button>
          <el-button v-else disabled type="text" @click="sendRequest(props.row)"><svg-icon icon-class="data1" style="width: 14px; height:16px;color:#C0C4CC;"/></el-button>
          <el-button type="text" v-if="adminrole" @click="editRemark(props.row)"><svg-icon icon-class="info1" style="width: 16px; height:16px;color:#1890FF;"/></el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1px" fixed="right">
        <template slot-scope="scope">
          <div v-for="item in scope.row.rowList">
            <el-form label-position="left" class="demo-table-expand">
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="instanceid" label="实例编号:"><span>{{item.instanceid}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="registranttype" label="注册类型:"><span>{{item.registranttype}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="realnamestatus" label="实名认证状态:"><span>{{item.realnamestatus}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="zhregistrantname" label="联系人（中文）:"><span>{{item.zhregistrantname}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="registrantname" label="联系人（英文）:"><span>{{item.registrantname}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="zhregistrantorganization" label="持有者（中文）:">
                  <span>{{item.zhregistrantorganization}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="registrantorganization" label="持有者（英文）:">
                  <span>{{item.registrantorganization}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="email" label="所有者邮箱:"><span>{{item.email}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="emailverificationstatus" label="邮箱是否验证:">
                  <span>{{item.emailverificationstatus}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="dnslist" label="DNS列表:"><span>{{item.dnslist}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="domainnameproxyservice" label="隐私保护:"><span>{{item.domainnameproxyservice}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="updateprohibitionlock" label="安全锁状态:"><span>{{item.updateprohibitionlock}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="transferprohibitionlock" label="转移锁状态:">
                  <span>{{item.transferprohibitionlock}}</span></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="domainnameverificationstatus" label="审核状态:"><span>{{item.domainnameverificationstatus}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item prop="transferoutstatus" label="转出状态:"><span>{{item.transferoutstatus}}</span>
                </el-form-item>
              </el-col>
            </el-form>
          </div>
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

    <el-dialog :visible.sync="dialogCreateAppVisible" @close="handleClose" width="35%">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">备注信息</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editDomain" :model="editDomain" :rules="rules" class="editAppForm" label-width="110px"
               style="margin:0 20px 0 -50px;">
        <el-form-item v-if="false">
          <el-input v-model="editDomain.domainname" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="editDomain.remark" style="width: 100%;" :autosize="{ minRows: 4}"
                    type="textarea" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addAppForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="request_title" :visible.sync="dialogEditAppVisible" @close="handleClose" width="70%">
      <el-form :model="requestDomain" inline>
        <el-form-item label="域名" v-if="false">
          <el-input v-model="requestDomain.domainname" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="requestDomain.startDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions3">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="requestDomain.endDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions3">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="domainsearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="24">
          <chart ref="chartd11" id="dchart1" title="" style="width:100%;height:400px;" v-bind:host_id="requestDomain"
                 url="/cainiao/request_domain"/>
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>

<script>
  import {fetchDomainList, updateDomainList,refreshDomain} from '@/api/cainiao/domain'
  import {deepClone} from '@/utils'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {mapGetters} from 'vuex'
  import Chart from '@/components/Charts/LineHistory_cainao'

  export default {
    name: 'ComplexTable',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
      UploadExcelComponent,
      Chart
    },
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          domainname: undefined,
          domaintype: undefined,
          http: undefined,
          status: undefined,
          member: undefined,
          opr_time_s: undefined,
          res_time: undefined,
          version: undefined,
          type: undefined,
          select: "uuid",
        },
        editDomain: {
          remark: '',
          domainname: '',
          instance: '',
        },
        requestDomain: {
          domainname: '',
          startDate: new Date(),
          endDate: new Date(),
        },
        timestamp: '',
        value2: '',
        pickerOptions2: {
          disabledDate(end) {
            return end.getTime() > Date.now()
          }
        },
        pickerOptions3: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
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
        list: null,
        request_title: '',
        total: 0,
        listLoading: true,
        dialogCreateAppVisible: false,
        dialogEditAppVisible: false,
        adminrole: false,
        false1: true,
        false2: false,
        me_checked: this.value,
        value: '',
        typeOptions: [{'value': 'New gTLD', 'label': 'New gTLD'}, {'value': 'gTLD', 'label': 'gTLD'},
          {'value': 'ccTLD', 'label': 'ccTLD'}],
        rules: {
          remark: [{max: 200, message: '长度不超过50个字符', trigger: 'blur'}],
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
      }
    },
    created() {
      this.adminrole = this.roles.includes('domain_admin')
      this.getList()
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      refresh_domain(row){
        const loading = this.$loading({
          lock: true,
          text: '域名信息刷新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        refreshDomain({'domain':row.domainname}).then(res => {
          if (res.status === 'ok') {
            loading.close()
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            loading.close()
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
      },
      formatDate(row, column, cellValue) {
        if (row.minttl < 60) {
          return row.minttl + '秒'
        } else if (60 <= row.minttl && row.minttl < 3600) {
          let h = parseInt(row.minttl / 60)
          return h + '分钟'
        } else if (3600 <= row.minttl && row.minttl < 86400) {
          let h = parseInt(row.minttl / 3600)
          return h + '小时'
        } else if (row.minttl >= 86400) {
          let d = parseInt(row.minttl / 86400)
          return d + '天'
        }
      },
      toggle() {
        this.me_checked = !this.me_checked;
      },
      domainsearch() {
        if (!this.requestDomain.startDate) {
          this.requestDomain.startDate = new Date()
        }
        if (!this.requestDomain.endDate) {
          this.requestDomain.endDate = new Date()
        }
        this.$refs.chartd11.render(this.requestDomain);
      },
      sendDomain(name) {
        this.$router.push({
          path: '/cainiao/index1/domain_dns',
          query: {
            mallCode: name
          }
        })
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
        if (this.listQuery.res_time) {
          this.listQuery.stime = Math.floor(new Date(this.listQuery.res_time[0]) / 1000) + ',' + Math.floor(new Date(this.listQuery.res_time[1]) / 1000)
        } else {
          this.listQuery.stime = undefined
        }
        fetchDomainList(this.listQuery).then(response => {
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
      resetlistQuery() {
        this.listQuery = this.$options.data().listQuery
      },
      editRemark(row) {
        if (row.remark === null) {
          this.editDomain.remark = ''
        }
        this.editDomain.domainname = row.domainname
        this.editDomain.instance = row.instanceid
        this.editDomain.remark1 = row.remark
        this.dialogCreateAppVisible = true
      },
      sendRequest(row) {
        this.request_title = row.domainname + '请求量'
        this.requestDomain.domainname = row.domainname
        this.dialogEditAppVisible = true
        setTimeout(() => {
          this.$refs.chartd11.render(this.requestDomain);
        }, 1.5 * 2)
      },
      submitForm() {
        const loading = this.$loading({
          lock: true,
          text: '域名备注修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        updateDomainList(this.editDomain).then(response => {
          if (response.message === 'ok') {
            loading.close();
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
            this.dialogCreateAppVisible = false
            this.getList();
          } else {
            loading.close();
            this.$message({
              message: response.message,
              type: 'error',
              duration: 20000
            });
          }
        }).catch(err => {
          loading.close();
          this.$message({
            message: err,
          });
        });
        this.dialogCreateAppVisible = false
      },
      resetForm(formName) {
        this.dialogCreateAppVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose() {

      },
      toggleRowExpansion(row, label) {
        if (label.label==='操作'){
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

  .weui-div {
    position: relative;
    cursor: pointer;
    width: 110px;
    height: 36px;
    border: 1px solid #DCDFE6;
    border-radius: 3px 0 0 3px;
  }

  .weui-div-1 {
    position: absolute;
    left: 0px;
    padding-left: 27px;
    top: 0;
    width: 108px;
    line-height: 34px;
    border-radius: 3px 0 0 3px;
    background: #1890FF;
    text-align: center;
    color: #fff;
  }

  .weui-div-2 {
    position: absolute;
    left: 0px;
    width: 108px;
    top: 0;
    line-height: 34px;
    color: #fff;
    border-radius: 3px 0 0 3px;
    background: #FFBA00;
    text-align: center;
    padding-right: 28px;
  }

  .weui-switch {
    z-index: 5000;
    display: block;
    position: relative;
    width: 25px;
    outline: 0;
    height: 34px;
    border-radius: 3px;
    box-sizing: border-box;
    background-color: #1890FF;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
  }

  .weui-switch:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 25px;
    height: 34px;
    border-radius: 3px;
    background-color: #1890FF;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }

  .weui-switch:after {
    content: " ";
    position: absolute;
    z-index: 5000;
    top: 4px;
    left: 4px;
    width: 25px;
    height: 26px;
    border-radius: 3px;
    background-color: #fff;
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }

  .weui-switch-on {
    left: 83px;
    background-color: #FFBA00;
  }

  .weui-switch-on:before {
    background-color: #FFBA00;
  }

  .weui-switch-on:after {
    left: -54px;
    transform: translateX(50px);
  }
</style>
