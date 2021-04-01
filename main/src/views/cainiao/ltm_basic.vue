<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="设备信息" name="first">
        <el-form ref="listQuery" :model="listQuery" :inline="true">
          <el-form-item>
            <el-input v-model="listQuery.name" clearable placeholder="请输入查询内容" style="width: 300px"
                      @input="getDevice"></el-input>
          </el-form-item>
          <el-button class="filter-item" icon="el-icon-refresh" style="margin-left: 10px" type="primary" plain
                     @click="handleReset">重置
          </el-button>
        </el-form>
        <el-table v-loading="listLoading" :data="device" border stripe highlight-current-row style="width: 100%">
          <el-table-column label="状态" align="center" width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.failoverstate==='主'"><svg-icon icon-class="F5_LTM_主(1)" style="width: 14px; height:14px;"/>&nbsp;{{scope.row.failoverstate}}</span>
              <span v-else><svg-icon icon-class="F5_LTM_备(1)" style="width: 14px; height:14px;"/>&nbsp;{{scope.row.failoverstate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="管理IP/SN号">
            <template slot-scope="scope">
              <span>{{ scope.row.managementip }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.chassisid}}</div>
            </template>
          </el-table-column>
          <el-table-column label="名称/主机名" width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.hostname}}</div>
            </template>
          </el-table-column>
          <el-table-column label="时区">
            <template slot-scope="scope">
              <span>{{scope.row.timezone}}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品名称/微码版本" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.platformid+' '+scope.row.marketingname}}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.version}}</div>
            </template>
          </el-table-column>
          <el-table-column label="同步IP/MAC地址" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.configsyncip }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.basemac}}</div>
            </template>
          </el-table-column>
          <el-table-column label="备注信息">
            <template slot-scope="scope">
              <span>{{scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column label="激活模块" width="80">
            <template slot-scope="scope">
              <a style="color: #1890ff" @click="send_active(scope.row.activemodules)">点击查看</a>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          :page-sizes="[20,50,100,200,500]"
          @pagination="getDevice"
          style="padding-top: 5px;margin-top: 10px;"
        />
      </el-tab-pane>
      <el-tab-pane label="设备组信息" name="second">
        <el-form ref="listQuery1" :model="listQuery1" :inline="true">
          <el-form-item>
            <el-input v-model="listQuery1.name" clearable placeholder="请输入查询内容" style="width: 300px"
                      @input="getDeviceGroup"></el-input>
          </el-form-item>
          <el-button class="filter-item" icon="el-icon-refresh" style="margin-left: 10px" type="primary" plain
                     @click="handleReset">重置
          </el-button>
        </el-form>
        <el-table v-loading="listLoading" :data="list1" border stripe highlight-current-row style="width: 100%"
                  @row-click="click_row" ref="table1">
          <el-table-column label="管理IP地址列表">
            <template slot-scope="scope">
              <div v-if="scope.row.managementips.indexOf(',')!==-1" v-for="item in scope.row.managementips.split(',')">
                <a style="color: #1890ff" @click="sendDevice(item)">{{item}}</a>
              </div>
              <div v-else>
                <a style="color: #1890ff" @click="sendDevice(scope.row.managementips)">{{ scope.row.managementips }}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分区/组名称">
            <template slot-scope="scope">
              <span>{{ scope.row.partition }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="组类型/同步类型">
            <template slot-scope="scope">
              <el-popover placement="top-start" width="200" trigger="hover">
                <p>保存自动同步: {{ scope.row.saveonautosync }}</p>
                <p>增量同步最大值: {{ scope.row.incrementalconfigsyncsizemax }}</p>
                <div slot="reference" class="name-wrapper">
                  <span>{{ scope.row.grouptype }}</span>
                  <div style="color: #8492a6; font-size: 10px">{{scope.row.synctype}}</div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="网络故障转移">
            <template slot-scope="scope">
              <span>{{scope.row.networkfailover}}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备成员" width="300">
            <template slot-scope="scope">
              <div v-if="scope.row.members.indexOf(',')!==-1" v-for="item in scope.row.members.split(',')">
                <a style="color: #1890ff" @click="sendDevice(item)">{{item}}</a>
              </div>
              <div v-else>
                <a style="color: #1890ff" @click="sendDevice(scope.row.members)">{{ scope.row.members }}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注信息">
            <template slot-scope="scope">
              <span>{{scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="1" fixed="right">
            <template slot-scope="props">
              <el-table v-loading="listLoading" :data="props.row.rowList" border stripe highlight-current-row
                        style="width: 100%">
                <el-table-column label="状态" align="center" width="70">
                  <template slot-scope="scope">
                    <span v-if="scope.row.failoverstate==='主'"><svg-icon icon-class="F5_LTM_主(1)" style="width: 14px; height:15px;"/>&nbsp;{{scope.row.failoverstate}}</span>
                    <span v-else><svg-icon icon-class="F5_LTM_备(1)" style="width: 14px; height:13px;"/>&nbsp;{{scope.row.failoverstate}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="设备名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <a style="color: #1890ff" @click="sendDevice(scope.row.device)">{{scope.row.device}}</a>
                  </template>
                </el-table-column>
                <el-table-column label="同步状态" align="center" width="90">
                  <template slot-scope="scope">
                    <span v-if="scope.row.syncstatus==='已同步'"><svg-icon icon-class="F5_LTM_已同步" style="width: 16px; height:16px;"/>&nbsp;{{scope.row.syncstatus}}</span>
                    <span v-else><svg-icon icon-class="F5_LTM_待更改" style="width: 12px; height:12px;"/>&nbsp;{{scope.row.syncstatus}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="最新提交时间/提交发起方" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.commitidtime!=='-'">{{scope.row.commitidtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                    <span v-else>{{scope.row.commitidtime}}</span>
                    <div style="color: #8492a6; font-size: 10px">{{scope.row.commitidoriginator}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="上次提交时间/提交发起方" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.lsstime!=='-'">{{scope.row.lsstime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                    <span v-else>{{scope.row.lsstime}}</span>
                    <div style="color: #8492a6; font-size: 10px">{{scope.row.lssoriginator}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="最后一次同步时间/类型" width="165">
                  <template slot-scope="scope">
                    <span v-if="scope.row.timesincelastsync!=='-'">{{scope.row.timesincelastsync | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                    <span v-else>{{scope.row.timesincelastsync}}</span>
                    <div style="color: #8492a6; font-size: 10px">{{scope.row.lastsynctype}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total1>0"
          :total="total1"
          :page.sync="listQuery1.page"
          :limit.sync="listQuery1.limit"
          :page-sizes="[20,50,100,200,500]"
          @pagination="getDeviceGroup"
          style="padding-top: 5px;margin-top: 10px;"
        />
      </el-tab-pane>
      <el-tab-pane label="规则信息" name="third">
        <el-form ref="listQuery2" :model="listQuery2" :inline="true">
          <el-form-item>
            <el-input v-model="listQuery2.name" clearable placeholder="请输入查询内容" style="width: 300px"
                      @input="getRule"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery2.ltm_ip" filterable clearable placeholder="管理IP" @change="getRule">
              <el-option v-for="item in ruleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="filter-item" icon="el-icon-refresh" style="margin-left: 10px" type="primary" plain
                     @click="handleReset">重置
          </el-button>
        </el-form>
        <el-table v-loading="listLoading" :data="list2" border stripe highlight-current-row style="width: 100%">
          <el-table-column label="管理IP">
            <template slot-scope="scope">
              <span>{{scope.row.ltm_ip}}</span>
            </template>
          </el-table-column>
          <el-table-column label="分区">
            <template slot-scope="scope">
              <span>{{ scope.row.partition }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规则名称" min-width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规则内容">
            <template slot-scope="scope">
              <a style="color: #1890ff" @click="sendRule(scope.row.apianonymous,scope.row.name)">查看内容</a>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total2>0"
          :total="total2"
          :page.sync="listQuery2.page"
          :limit.sync="listQuery2.limit"
          :page-sizes="[20,50,100,200,500]"
          @pagination="getRule"
          style="padding-top: 5px;margin-top: 10px;"
        />
      </el-tab-pane>
      <el-tab-pane label="SNATPOOL信息" name="fourth">
        <el-form ref="listQuery3" :model="listQuery3" :inline="true">
          <el-form-item>
            <el-input v-model="listQuery3.name" clearable placeholder="请输入查询内容" style="width: 300px"
                      @input="getSnatpool"></el-input>
          </el-form-item>
          <el-button class="filter-item" icon="el-icon-refresh" style="margin-left: 10px" type="primary" plain
                     @click="handleReset">重置
          </el-button>
        </el-form>
        <el-table v-loading="listLoading" :data="list3" border stripe highlight-current-row style="width: 100%"
                  @row-click="toggleRowExpansion" ref="table">
          <el-table-column label="管理IP">
            <template slot-scope="scope">
              <span>{{scope.row.ltm_ip}}</span>
            </template>
          </el-table-column>
          <el-table-column label="分区">
            <template slot-scope="scope">
              <span>{{ scope.row.partition }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.snatpool_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成员数量">
            <template slot-scope="scope">
              <span>{{ scope.row.member_counts }}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="1" fixed="right">
            <template slot-scope="props">
              <el-table v-loading="listLoading" :data="props.row.rowList" border stripe highlight-current-row
                        style="width: 100%">
                <el-table-column label="状态" width="60" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="名称/IP地址">
                  <template slot-scope="scope">
                    <span>{{scope.row.snattranslation_name}}</span>
                    <div style="font-size: 10px;color: #8492a6;">{{scope.row.address}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="ARP设置/连接限制">
                  <template slot-scope="scope">
                    <span>{{scope.row.arp}}</span>
                    <div style="font-size: 10px;color: #8492a6;">{{scope.row.connectionlimit}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="IP空闲超时">
                  <template slot-scope="scope">
                    <span>{{scope.row.ipidletimeout}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="TCP/UDP空闲超时">
                  <template slot-scope="scope">
                    <span>{{scope.row.tcpidletimeout}}</span>
                    <div style="color: #8492a6; font-size: 10px">{{scope.row.udpidletimeout}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="Traffic Group名称/是否继承" min-width="110">
                  <template slot-scope="scope">
                    <span>{{scope.row.trafficgroup}}</span>
                    <div style="color: #8492a6; font-size: 10px">{{scope.row.inheritedtrafficgroup}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="UnitID">
                  <template slot-scope="scope">
                    <span>{{scope.row.unit}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total3>0"
          :total="total3"
          :page.sync="listQuery3.page"
          :limit.sync="listQuery3.limit"
          :page-sizes="[20,50,100,200,500]"
          @pagination="getSnatpool"
          style="padding-top: 5px;margin-top: 10px;"
        />
      </el-tab-pane>
      <el-tab-pane label="网络接口" name="fifth">
        <el-form ref="listQuery4" :model="listQuery4" :inline="true">
          <el-form-item>
            <el-input v-model="listQuery4.name" clearable placeholder="请输入查询内容" style="width: 300px"
                      @input="getInterface"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery4.enabled" clearable placeholder="启用状态" @change="getInterface">
              <el-option v-for="item in enableOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="filter-item" icon="el-icon-refresh" style="margin-left: 10px" type="primary" plain
                     @click="handleReset">重置
          </el-button>
        </el-form>
        <el-table v-loading="listLoading" :data="list4" border stripe highlight-current-row style="width: 100%">
          <el-table-column label="管理IP/更新时间" width="125">
            <template slot-scope="scope">
              <span>{{scope.row.managementip}}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.updatetime| parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
            </template>
          </el-table-column>
          <el-table-column label="名称" width="75">
            <template slot-scope="scope">
              <el-popover placement="top-start" width="200" trigger="hover">
                <p>状态: {{ scope.row.status }}</p>
                <div slot="reference" class="name-wrapper">
                  <span v-if="scope.row.status==='已连接'"><svg-icon icon-class="F5_网口已连接" style="color:#009551;"></svg-icon>&nbsp;<span>{{ scope.row.name }}</span></span>
                  <span v-else><svg-icon icon-class="F5_网口未连接" style="color:#C64333;"></svg-icon>&nbsp;<span>{{ scope.row.name }}</span></span>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="最大速率/当前速率" width="140">
            <template slot-scope="scope">
              <span>{{ scope.row.mediamax }}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.mediaactive}}</div>
            </template>
          </el-table-column>
          <el-table-column label="流量控制/MAC地址" width="145">
            <template slot-scope="scope">
              <span>{{scope.row.flowcontrol}}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.macaddress}}</div>
            </template>
          </el-table-column>
          <el-table-column label="LLDP/MTU" width="95">
            <template slot-scope="scope">
              <span>{{ scope.row.lldpadmin}}</span>
              <div style="color: #8492a6; font-size: 10px">{{scope.row.mtu}}</div>
            </template>
          </el-table-column>
          <el-table-column label="STP" width="50">
            <template slot-scope="scope">
              <el-popover placement="top-start" width="300" trigger="hover">
                <p>SFP Requested Media: {{ scope.row.mediasfp }}</p>
                <p>STP Link Type: {{ scope.row.stplinktype }}</p>
                <p>STP Edge Port: {{ scope.row.stpedgeport }}</p>
                <p>STP Edge Port Detection: {{ scope.row.stpautoedgeport }}</p>
                <div slot="reference" class="name-wrapper">
                  <span>{{ scope.row.stp }}</span>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.enabled==='启用'"><svg-icon icon-class="F5_Enabled"
                                                                   style="color:#009551;"></svg-icon>&nbsp;<span
                style="color:#009551;">启用</span></span>
              <span v-else-if="scope.row.enabled==='禁用'"><svg-icon icon-class="F5_Disabled"
                                                                        style="color:#C64333;"></svg-icon>&nbsp;<span
                style="color:#C64333;">禁用</span></span>
            </template>
          </el-table-column>
          <el-table-column label="入向/出向 数据量" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.bitsin+' / '+scope.row.bitsout}}</span>
            </template>
          </el-table-column>
          <el-table-column label="入向/出向 包数" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.pktsin+' / '+scope.row.pktsout}}</span>
            </template>
          </el-table-column>
          <el-table-column label="丢弃数/错误数">
            <template slot-scope="scope">
              <span>{{scope.row.dropsall+' / '+scope.row.errorsall}}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total4>0"
          :total="total4"
          :page.sync="listQuery4.page"
          :limit.sync="listQuery4.limit"
          :page-sizes="[20,50,100,200,500]"
          @pagination="getInterface"
          style="padding-top: 5px;margin-top: 10px;"
        />
      </el-tab-pane>
      <el-tab-pane label="名称绑定" name="sixth">
        <line-bind></line-bind>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="rule_title" :visible.sync="dialogRemark" width="70%" @close="handleClose">
      <el-form :model="rule">
        <el-form-item>
          <el-input v-model="rule.rule" style="width: 100%" type="textarea" :rows="30" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="激活模块" :visible.sync="dialogActive" width="30%" @close="handleClose">
      <el-form :model="active">
        <el-form-item>
          <el-input v-model="active.active" style="width: 100%" type="textarea" :rows="20" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchLtmDevice, getLtmDeviceGroup, getLtmRule,getSnatpool,getLtmIp,getNetInterface} from '@/api/cainiao/ltm'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionLtmBasic from "@/components/mixins/sessionLtmBasic";
  console.log('-----')
  console.log(sessionLtmBasic)
  import LineBind from '@/views/cainiao/line_ip_bind.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: "basic_info",
    mixins: [resize, sessionLtmBasic],
    components: {
      Pagination,
      LineBind
    },
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        device: null,
        total: 0,
        list1: null,
        total1: 0,
        list2: null,
        total2: 0,
        list3: null,
        total3: 0,
        list4: null,
        total4: 0,
        remark: '',
        rule_title:'',
        ruleOptions:[],
        enableOptions:[{'value':'启用', 'label':'启用'},{'value':'禁用', 'label':'禁用'}],
        listLoading: true,
        dialogRemark: false,
        dialogActive: false,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        listQuery1: {
          page: 1,
          limit: 20,
          name: undefined
        },
        listQuery2: {
          page: 1,
          limit: 20,
          name: undefined,
          ltm_ip: undefined,
        },
        listQuery3: {
          page: 1,
          limit: 20,
          name: undefined
        },
        listQuery4: {
          page: 1,
          limit: 20,
          name: undefined,
          enabled: undefined,
        },
        active:{
          active:''
        },
        rule:{
          rule:''
        },
      }
    },
    created() {
      this.getDevice()
      this.getDeviceGroup()
      this.getRule()
      this.getSnatpool()
      this.getInterface()
      this.getParam()
      getLtmIp().then(res=>{
        this.ruleOptions=res
      })
    },
    computed: {},
    methods: {
      getParam(){
        const param = this.$route.query
        if ('rule'in param) {
          this.activeName='third'
          this.listQuery2.name=param.rule
        }else if ('snat' in param) {
          this.activeName='fourth'
          this.listQuery3.name=param.snat
        }
      },
      send_active(val){
        this.active.active=val.replace(/\|/g,"\r\n")
        this.dialogActive=true
      },
      getInterface(){
        getNetInterface(this.listQuery4).then(res => {
          this.list4 = res.results
          this.total4 = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getSnatpool(){
        getSnatpool(this.listQuery3).then(res => {
          this.list3 = res.results
          this.total3 = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      sendRule(val,name) {
        this.dialogRemark = true
        this.rule.rule = val
        this.rule_title = name+'-'+'规则内容'
      },
      getRule() {
        getLtmRule(this.listQuery2).then(res => {
          this.list2 = res.results
          this.total2 = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      sendDevice(val) {
        this.activeName = 'first'
        this.listQuery.name = val
        this.getDevice()
      },
      getDeviceGroup() {
        getLtmDeviceGroup(this.listQuery1).then(res => {
          this.list1 = res.results
          this.total1 = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      getDevice() {
        fetchLtmDevice(this.listQuery).then(res => {
          this.device = res.results
          this.total = res.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.getDevice()
        this.getRule()
        this.getDeviceGroup()
        this.getSnatpool()
      },
      handleReset() {
        this.resetlistQuery()
        this.getDevice()
        this.getDeviceGroup()
        this.getRule()
        this.getSnatpool()
        this.getInterface()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          name: undefined,
        }
        this.listQuery1={
          page: 1,
          limit: 20,
          name: undefined
        }
        this.listQuery2={
          page: 1,
          limit: 20,
          name: undefined,
          ltm_ip: undefined,
        },
        this.listQuery3={
          page: 1,
          limit: 20,
          name: undefined
        }
        this.listQuery4={
          page: 1,
          limit: 20,
          name: undefined,
          enabled: undefined,
        }
      },
      handleClose() {
        this.dialogRemark = false
        this.dialogActive = false
      },
      click_row(row) {
        let $table = this.$refs.table1;
        this.list1.map((item) => {
          if (row.id !== item.id) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      },
      toggleRowExpansion(row) {
        let $table = this.$refs.table;
        this.list3.map((item) => {
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
