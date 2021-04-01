<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <el-select v-model.trim="listQuery.account" @change="getEcsByInput" clearable placeholder="请选择账户"
                     style="width: 150px">
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.status" @change="getEcsByInput" clearable placeholder="请选择实例状态"
                     style="width: 150px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="listQuery.instancechargetype" @change="getEcsByInput" clearable placeholder="请选择付费方式"
                     style="width: 150px">
            <el-option v-for="item in chargeTypeOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="listQuery.input" placeholder="请输入查询条件" @input="getEcsByInput" clearable
                    style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <div v-if="listQuery.select==='A'">
            <el-button type="text" @click="listQuery.select='B'">创建日期<i class="el-icon-caret-bottom "></i></el-button>
            <el-date-picker
              v-model.trim="listQuery.creationtime_s"
              @change="getEcsByInput"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
          <div v-else-if="listQuery.select==='B'">
            <el-button type="text" @click="listQuery.select='A'">到期日期<i class="el-icon-caret-bottom "></i></el-button>
            <el-date-picker
              v-model.trim="listQuery.expiredtime_s"
              @change="getEcsByInput"
              value-format="yyyy-MM-dd HH:mm"
              unlink-panels
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="success" icon="el-icon-search" plain @click="handleBatchSearch"
                   style="text-align: right">批量查询
        </el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="ecsTableData" border stripe highlight-current-row @row-click="toggleRowExpansion" ref="table">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="付费方式:">
                  <span>{{ props.row.instancechargetype }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="创建时间:">
                  <span>{{ props.row.creationtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="到期时间:">
                  <span>{{ props.row.expiredtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="安全组ID:">
                  <a style="color: #1890ff" @click="FilterSecGroups(props.row.secgroupids)">{{ props.row.secgroupids
                    }}</a>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="镜像ID:">
                  <a style="color: #1890ff" @click="EcsFilterByImageId(props.row.imageid)">{{ props.row.imageid }}</a>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="备注描述:">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="私有网络:">
                  <span>{{ props.row.networkids }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="专有网络:">
                  <a style="color: #1890ff" @click="vpcidFilter(props.row.vpcid)">{{ props.row.vpcid }}</a>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="虚拟交换机:">
                  <a style="color: #1890ff" @click="vSwitchFilter(props.row.vswitchid)">{{ props.row.vswitchid }}</a>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="弹性公网:">
                  <span>{{ props.row.eipaddress_allocationid }}</span>
                </el-form-item>
              </el-col>
              <!--              <el-col :md="24" :lg="12" :xl="8">-->
              <!--              <el-form-item label="公网入口带宽:">-->
              <!--                <span>{{ props.row.internetmaxbandwidthin }}</span>-->
              <!--              </el-form-item>-->
              <!--              </el-col>-->
              <!--              <el-col :md="24" :lg="12" :xl="8">-->
              <!--              <el-form-item label="公网出口带宽:">-->
              <!--                <span>{{ props.row.internetmaxbandwidthout }}</span>-->
              <!--              </el-form-item>-->
              <!--              </el-col>-->
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="带宽计费方式:">
                  <span v-if="props.row.internetchargetype!==''">{{ props.row.internetchargetype }}</span>
                  <span v-else>{{ props.row.eipaddress_internetchargetype }}</span>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="12" :xl="8">
                <el-form-item label="当前使用带宽:">
                  <span v-if="props.row.internetchargetype!==''">{{ props.row.internetmaxbandwidthout }}</span>
                  <span v-else>{{ props.row.eipaddress_bandwidth }}</span>
                </el-form-item>
              </el-col>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="名称/实例ID" width="360">
          <template slot-scope="scope">
            <span>{{ scope.row.instancename }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.instanceid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="CPU/内存/GPU" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.cpu+'/'+scope.row.memory }}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.gpuamount}}</div>
          </template>
        </el-table-column>
        <el-table-column label="磁盘">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="send_ecs(scope.row.instanceid)">{{ scope.row.disks }}</a>
          </template>
        </el-table-column>
        <el-table-column label="规格/系统版本">
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="EcsFilterByinstanceType(scope.row.instancetype)">{{ scope.row.instancetype
              }}</a>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.osname}}</div>
          </template>
        </el-table-column>
        <el-table-column label="私网/公网/弹性IP" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.vpc_ips}}</span>
            <div style="color: #1c1c64; font-size: 12px">{{scope.row.pubips}}</div>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.eipaddress_ipaddress}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='运行中'" type="success">{{ scope.row.status }}</el-tag>
            <el-tag v-else-if="scope.row.status==='启动中'" type="primary">{{ scope.row.status }}</el-tag>
            <el-tag v-else-if="scope.row.status==='停止中'" type="warning">{{ scope.row.status }}</el-tag>
            <el-tag v-else type="danger">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" show-overflow-tooltip>
          <template slot-scope="scope">
            <a style="color: #1890ff" @click="EcsFilterByTags(scope.row.tags)">{{ scope.row.tags }}</a>
          </template>
        </el-table-column>
        <el-table-column label="启动时间/所在可用区" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.starttime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            <div style="color: #8492a6; font-size: 10px">{{scope.row.zoneid}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px" align="center" v-if="adminrole">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.status === '运行中'" @click="start(scope.row);">
              <svg-icon v-if="scope.row.status !== '运行中'" icon-class="play1"
                        style="width: 16px; height:16px;color:#42B983;"/>
              <svg-icon v-else icon-class="play1" style="width: 16px; height:16px;color:#C0C4CC;"/>
            </el-button>
            <el-dropdown @command="stop(scope.row)">
              <span class="el-dropdown-link">
                <svg-icon v-if="scope.row.status==='运行中'" icon-class="停止"
                          style="width: 16px; height:16px;color:#FFBA00;margin-left: 15px;margin-right: 10px"/>
                <svg-icon v-else icon-class="停止"
                          style="width: 16px; height:16px;color:#C0C4CC;margin-left: 15px;margin-right: 10px"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" :disabled="scope.row.status === '已停止'">停止</el-dropdown-item>
                <el-dropdown-item @click.native="ForceStop" :disabled="scope.row.status === '已停止'">强制停止
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="restart(scope.row)" :disabled="scope.row.status === '已停止'">
              <span class="el-dropdown-link">
                <svg-icon v-if="scope.row.status==='运行中'" icon-class="重启 (2)"
                          style="width: 16px; height:16px;margin-left: 10px;margin-right: 15px"/>
                <svg-icon v-else icon-class="重启 (2)"
                          style="width: 16px;color:#C0C4CC; height:16px;margin-left: 10px;margin-right: 15px"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" :disabled="scope.row.status !== '运行中'">重启</el-dropdown-item>
                <el-dropdown-item @click.native="ForceStop" :disabled="scope.row.status !== '运行中'">强制重启
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip class="item" effect="dark" content="远程" placement="top" :hide-after="300">
              <el-button type="text" :disabled="scope.row.status !== '运行中'" @click="connect(scope.row);">
                <svg-icon v-if="scope.row.status==='运行中'" icon-class="远程访问" style="width: 16px; height:16px;"/>
                <svg-icon v-else icon-class="远程访问" style="width: 16px; height:16px;color:#C0C4CC;"/>
              </el-button>
            </el-tooltip>
            <!--            <el-button type="text" :disabled="scope.row.status != '运行中'" @click="restart(scope.row);">监控信息</el-button>-->
            <el-button type="text" disabled @click="restart(scope.row);" v-if="false">
              <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        style="padding-top: 5px;margin-top: 10px;"
        @pagination="getEcs"
      />
    </div>
    <el-dialog
      v-loading="loading"
      element-loading-text="获取链接中,请稍候"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      title="点击链接远程连接该ECS"
      :visible.sync="connectDialog"
      width="58%"
      center>
      <span>
        <a :href="url" target="_blank" @click="connectDialog = false">{{ url }}</a>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="connectDialog = false">取 消</el-button>
        <el-button type="primary" @click="connectDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量查询" :visible.sync="dialogSearchVisible" :close-on-click-modal="false" width="45%">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="私网IP" name="ip">
          <template>
            <el-row>
              <el-col :span="24">
                <el-input type="textarea" :rows="15" placeholder="请输入IP列表,以逗号分隔或者换行"
                          v-model="listQuery.ip_list"></el-input>
              </el-col>
            </el-row>
          </template>
        </el-tab-pane>
<!--        <el-tab-pane label="公网IP" name="pub_ip">-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->
<!--              <el-input type="textarea" :rows="15" placeholder="请输入域名列表,以逗号分隔或者换行"-->
<!--                        v-model="listQuery.pub_ip_list"></el-input>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="弹性IP" name="tan_ip">-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->
<!--              <el-input type="textarea" :rows="15" placeholder="请输入域名列表,以逗号分隔或者换行"-->
<!--                        v-model="listQuery.tan_ip_list"></el-input>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-tab-pane>-->
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitDialogButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>


<script>
  import {getEcsConnection, getEcsList, restartEcs, startEcs, stopEcs} from '@/api/cainiao/ecs'
  import Pagination from '@/components/Pagination'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'

  export default {
    components: {Pagination},
    mixins: [sessionListQuery],
    data() {
      return {
        ecsTableData: [],
        loading: false,
        adminrole: false,
        dialogSearchVisible: false,
        url: '',
        total: 0,
        activeName: 'ip',
        isForce: false,
        connectDialog: false,
        listQuery: {
          page: 1,
          limit: 20,
          input: undefined,
          status: undefined,
          instancechargetype: undefined,
          expiredtime: undefined,
          creationtime: undefined,
          expiredtime_s: undefined,
          creationtime_s: undefined,
          account: undefined,
          ip_list: undefined,
          // pub_ip_list: undefined,
          // tan_ip_list: undefined,
          select: 'A',
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--info',
          type: 'warning'
        },
        chargeTypeOptions: [
          {'value': '包年包月', 'label': '包年包月'},
          {'value': '按量付费', 'label': '按量付费'}
        ],
        accountOptions: [
          {'value': 'hw', 'label': '海外'},
          {'value': 'cn', 'label': '国内'}
        ],
        statusOptions: [
          {'value': '运行中', 'label': '运行中'},
          {'value': '已停止', 'label': '已停止'},
          {'value': '启动中', 'label': '启动中'},
          {'value': '停止中', 'label': '停止中'}
        ]
      }
    },
    created() {
      this.getEcs()
      this.getParams()
      this.adminrole = this.roles.includes('ecs_admin')
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      onSubmitDialogButton() {
        if (this.listQuery.ip_list) {
          this.listQuery.ip_list = this.listQuery.ip_list.split('\n').join();
          this.listQuery.ip_list = this.listQuery.ip_list.replace(/[\r\n]/g, '').replace(/\s/g, '')
        }
        // if (this.listQuery.pub_ip_list) {
        //   this.listQuery.pub_ip_list = this.listQuery.pub_ip_list.split('\n').join();
        //   this.listQuery.pub_ip_list = this.listQuery.pub_ip_list.replace(/[\r\n]/g, '').replace(/\s/g, '')
        // }
        // if (this.listQuery.tan_ip_list) {
        //   this.listQuery.tan_ip_list = this.listQuery.tan_ip_list.split('\n').join();
        //   this.listQuery.tan_ip_list = this.listQuery.tan_ip_list.replace(/[\r\n]/g, '').replace(/\s/g, '')
        // }
        this.getEcs();
        this.dialogSearchVisible = false
      },
      clearBatchTextSearch() {
        // 清空批量搜索textarea内容
        const listQuery = {...this.listQuery}
        this.listQuery = Object.assign({}, listQuery, {
          ip_list: undefined,
          // pub_ip_list: undefined,
          // tan_ip_list: undefined,
        })
        // this.listQuery.ip_list = undefined;
        // this.listQuery.pub_ip_list = undefined
        // this.listQuery.tan_ip_list = undefined
      },
      handleBatchSearch() {
        // 打开批量搜索框
        this.dialogSearchVisible = true
        this.clearBatchTextSearch()
        // this.$nextTick(() => {
        //   this.clearBatchTextSearch()
        // })
      },
      getParams() {
        const val = this.$route.query.params
        this.$route.query.params = undefined
        if (val) {
          this.listQuery.input = val
        }
      },
      getEcs() {
        if (this.listQuery.creationtime_s) {
          this.listQuery.creationtime = this.listQuery.creationtime_s[0] + ',' + this.listQuery.creationtime_s[1]
        } else {
          this.listQuery.creationtime = undefined
        }
        if (this.listQuery.expiredtime_s) {
          this.listQuery.expiredtime = this.listQuery.expiredtime_s[0] + ',' + this.listQuery.expiredtime_s[1]
        } else {
          this.listQuery.expiredtime = undefined
        }
        this.listLoading = true
        getEcsList(this.listQuery).then(response => {
            this.ecsTableData = response.results
            this.total = response.count
          }
        )
        this.listLoading = false
      },
      toggleRowExpansion(row, label) {
        if (label.label == '操作') {
          return
        }
        let $table = this.$refs.table;
        this.ecsTableData.map((item) => {
          if (row.id !== item.id) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      },
      getEcsByInput() {
        this.listQuery.page = 1
        this.getEcs()
      },
      clearListQuery() {
        this.listQuery = this.$options.data().listQuery
      },
      handleReset() {
        this.clearListQuery()
        this.getEcs()
      },
      send_ecs(val) {
        this.$router.push({
          path: '/ecs/disk',
          query: {
            params: val
          }
        })
      },
      FilterSecGroups(FilterSecGroups) {
        this.$router.push({
          path: '/ecs/sercuritygroup',
          query: {
            securitygroupid: FilterSecGroups
          }
        })
      },
      vpcidFilter(vpcid) {
        this.$router.push({
          path: '/vpc/vpc',
          query: {
            vpcid: vpcid
          }
        })
      },
      vSwitchFilter(switchid) {
        this.$router.push({
          path: '/vpc/switch',
          query: {
            switchid: switchid
          }
        })
      },
      EcsFilterByinstanceType(instancetype) {
        this.listQuery.input = instancetype
        this.getEcs()
      },
      EcsFilterByImageId(val) {
        this.$router.push({
          path: '/ecs/image',
          query: {
            params: val
          }
        })
      },
      EcsFilterByTags(tags) {
        this.listQuery.input = tags
        this.getEcs()
      },
      restart(row) {
        var msg
        if (this.isForce) {
          msg = '此操作将强制重启该ECS,是否继续 ?'
        }
        msg = '此操作将重启该ECS,是否继续？'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          var restartParam = {instanceid: row.instanceid, regionid: row.regionid, if_force: this.isForce,}
          restartEcs(restartParam).then(response => {
            if (response.message == 'ok') {
              this.$notify({
                title: '成功',
                message: '重启成功',
                type: 'success',
                duration: 6000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 6000
              })
            }
            this.getEcs()
          })
          this.$message({
            type: 'success',
            message: '重启命令已下发, 请等待执行结果'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      stop(row) {
        console.log(this.isForce)
        var msg
        if (this.isForce) {
          msg = '确定强制停止该 ECS ?'
        }
        msg = '确定停止该 ECS ?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          var stopParam = {instanceid: row.instanceid, if_force: this.isForce, regionid: row.regionid}
          stopEcs(stopParam).then(response => {
            if (response.message == 'ok') {
              this.$notify({
                title: '成功',
                message: '该实例已停止',
                type: 'success',
                duration: 6000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 6000
              })
            }
            this.getEcs()
          })
          this.$message({
            type: 'success',
            message: '停止命令已下发, 请等待执行结果'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      connect(row) {
        this.loading = true
        const loading = this.$loading({
          lock: true,
          text: '链接获取中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        var getConnectionParam = {instanceid: row.instanceid, regionid: row.regionid, osname: row.osname}
        getEcsConnection(getConnectionParam).then(response => {
          this.loading = false
          this.url = response.url
          if (this.url) {
            loading.close()
            window.open(this.url)
          } else {
            loading.close()
          }
        })
        this.url = undefined
      },
      ForceStop() {
        this.isForce = true
      },
      start(row) {
        var msg = '此操作将启动该ECS,是否继续？'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          var startParam = {instanceid: row.instanceid, regionid: row.regionid}
          startEcs(startParam).then(response => {
            if (response.message == 'ok') {
              this.$notify({
                title: '成功',
                message: '启动成功.',
                type: 'success',
                duration: 6000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 6000
              })
            }
            this.getEcs()
          })
          this.$message({
            type: 'success',
            message: '启动命令已下发, 请等待启动结果'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #606266;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 10px;
  }
</style>
