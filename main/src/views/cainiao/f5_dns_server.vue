<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-row>
          <el-form-item>
            <el-input v-model.trim="listQuery.name" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                      clearable
                      style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item prop="availabilitystate">
            <el-select v-model="listQuery.availabilitystate" @change="handleFilter" clearable placeholder="可用状态"
                       style="width: 105px;">
              <el-option v-for="item of enableOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="enabledstate">
            <el-select v-model.trim="listQuery.enabledstate" @change="handleFilter" clearable placeholder="启用状态"
                       style="width: 120px;">
              <el-option v-for="item of statusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="listQuery.opr_time_s"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="handleFilter"/>
          </el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                     @click="handleReset">重置
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-plus"
                     @click="dialogAddServer=true" v-if="adminrole||adminrole1">新增
          </el-button>
        </el-row>
        <el-row>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="success" @click="refreshBatch" :disabled="f1"
                     icon="el-icon-refresh">刷新
          </el-button>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="success" @click="enableBatch" :disabled="f1"
                     icon="el-icon-circle-check">启用
          </el-button>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="danger" @click="disableBatch" :disabled="f1"
                     icon="el-icon-circle-close">禁用
          </el-button>
          <el-button class="filter-item" v-if="adminrole||adminrole1" type="primary" @click="dialogRemark=true" :disabled="f1"
                     icon="el-icon-info">备注
          </el-button>
          <el-button class="filter-item" v-if="adminrole1" type="danger" @click="deleteBatch" :disabled="f1"
                     icon="el-icon-delete">删除
          </el-button>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @row-click="toggleRowExpansion" ref="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column label="可用状态" align="center" width="78">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="250" trigger="hover">
            <p>状态: {{ scope.row.statusreason }}</p>
            <div slot="reference" class="name-wrapper">
              <span v-if="scope.row.availabilitystate==='可用'"><svg-icon icon-class="F5_Available"
                                                                        style="font-size: 16px"></svg-icon></span>
              <span v-else-if="scope.row.availabilitystate==='不可用'"><svg-icon icon-class="F5_UnAvailable"
                                                                              style="font-size: 16px"></svg-icon></span>
              <span v-else-if="scope.row.availabilitystate==='离线'"><svg-icon icon-class="F5_Offline"
                                                                             style="font-size: 16px"></svg-icon></span>
              <span v-else><svg-icon icon-class="F5_Unknow" style="font-size: 16px"></svg-icon></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Server名称" width="157">
        <template slot-scope="scope">
          <span>{{ scope.row.srv_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.addresses }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据中心" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.datacenter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分区" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.partition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康检查" width="115px">
        <template slot-scope="scope">
          <span>{{ scope.row.monitors }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" width="109" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.enabledstate==='启用'"><svg-icon icon-class="F5_Enabled"
                                                               style="color:#009551;"></svg-icon>&nbsp;<span
            style="color:#009551;">启用</span></span>
          <span v-else-if="scope.row.enabledstate==='禁用'"><svg-icon icon-class="F5_Disabled"
                                                                    style="color:#C64333;"></svg-icon>&nbsp;<span
            style="color:#C64333;">禁用</span></span>
          <span v-else><svg-icon icon-class="F5_Tmp_Disabled" style="color:#DA8C10;"></svg-icon>&nbsp;<span
            style="color:#DA8C10;">被父级禁用</span></span>
        </template>
      </el-table-column>
      <el-table-column label="VS数量" width="92px" prop="vs_counts" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vs_counts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人员" width="77">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170px" v-if="adminrole||adminrole1" align="center" fixed="right">
        <template slot-scope="props">
          <el-button type="text" @click="refresh_srv(props.row)">
            <svg-icon icon-class="refresh8" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-button type="text" v-if="props.row.enabledstate==='启用'|| props.row.enabledstate==='被父级禁用'"
                     @click="status_operate(props.row)">
            <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
          </el-button>
          <el-button type="text" v-else @click="status_operate(props.row)">
            <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          <el-button type="text" @click="deleteCommon(props.row)">
            <svg-icon icon-class="delete1" style="width: 16px; height:16px;color:#FF4949;"/>
          </el-button>
          <el-tooltip class="item" effect="dark" content="备注" placement="top">
          <el-button type="text" @click="remarkDialog(props.row)">
            <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
          </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="新增VS" placement="top">
            <el-button type="text" @click="vsDialog(props.row)">
            <svg-icon icon-class="F5_Add" style="width: 16px; height:16px;"/>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="props">
          <el-table :data="props.row.rowList" label-position="left" class="xxxwwww" stripe highlight-current-row border>
            <el-table-column prop="availabilitystate" label="可用状态" width="78" align="center">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="250" trigger="hover">
                  <p>状态: {{ scope.row.statusreason }}</p>
                  <div slot="reference" class="name-wrapper">
                    <span v-if="scope.row.availabilitystate==='可用'"><svg-icon icon-class="F5_Available"
                                                                              style="font-size: 16px"></svg-icon></span>
                    <span v-else-if="scope.row.availabilitystate==='不可用'"><svg-icon icon-class="F5_UnAvailable"
                                                                                    style="font-size: 16px"></svg-icon></span>
                    <span v-else-if="scope.row.availabilitystate==='离线'"><svg-icon icon-class="F5_Offline"
                                                                                   style="font-size: 16px"></svg-icon></span>
                    <span v-else><svg-icon icon-class="F5_Unknow" style="font-size: 16px"></svg-icon></span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="vs_name" label="VS名称" width="195"/>
            <el-table-column prop="addresses" label="IP地址" width="130"/>
            <el-table-column prop="port" label="服务端口" width="80"/>
            <el-table-column label="启用状态" width="109" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.enabledstate==='启用'"><svg-icon icon-class="F5_Enabled"
                                                                     style="color:#009551;"></svg-icon>&nbsp;<span
                  style="color:#009551;">启用</span></span>
                <span v-else-if="scope.row.enabledstate==='禁用'"><svg-icon icon-class="F5_Disabled"
                                                                          style="color:#C64333;"></svg-icon>&nbsp;<span
                  style="color:#C64333;">禁用</span></span>
                <span v-else><svg-icon icon-class="F5_Tmp_Disabled" style="color:#DA8C10;"></svg-icon>&nbsp;<span
                  style="color:#DA8C10;">被父级禁用</span></span>
              </template>
            </el-table-column>
            <el-table-column prop="updatetime" label="更新时间" width="135" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新人员" width="77">
              <template slot-scope="scope">
                <span>{{ scope.row.operate_user }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
            <el-table-column label="操作" align="center" v-if="adminrole||adminrole1" width="120px">
              <template slot-scope="props">
                <el-button type="text" v-if="props.row.enabledstate==='启用'|| props.row.enabledstate==='被父级禁用'"
                           @click="status_vs(props.row)">
                  <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
                </el-button>
                <el-button type="text" v-else @click="status_vs(props.row)">
                  <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
                </el-button>
                <el-button type="text" @click="delete_vs(props.row)">
                  <svg-icon icon-class="delete1" style="width: 16px; height:16px;color:#FF4949;"/>
                </el-button>
                <el-button type="text" @click="remarkVsDialog(props.row)">
                  <svg-icon icon-class="info1" style="width: 16px; height:16px;color:#42B983;"/>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes="[20,50,100,200,500]"
      @pagination="getList"
      style="padding-top: 5px;margin-top: 10px;"
    />

    <el-dialog :visible.sync="dialogCreateAppVisible" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addAppForm" :model="loadAppForm" :rules="rules" class="editAppForm" label-width="50px">
        <el-form-item label="备注" style="width:400px;">
          <el-input v-model="loadAppForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addAppForm')">取 消</el-button>
        <el-button type="primary" @click="remark_srv()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditAppVisible" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="editAppForm" :rules="rules" label-width="50px">
        <el-form-item label="备注" style="width:400px;">
          <el-input v-model="editAppForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogEditAppVisible=false">取 消</el-button>
        <el-button type="primary" @click="remark_vs()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogRemark" @close="handleClose" width="450px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">批量修改备注</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editAppForm" :model="remarkForm" :rules="rules" label-width="50px">
        <el-form-item label="备注" style="width: 400px">
          <el-input v-model="remarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogRemark=false">取 消</el-button>
        <el-button type="primary" @click="remarkBatch()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddServer" @close="handleClose" width="800px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增记录</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="serverForm" :model="serverForm" :rules="rules" label-width="110px" style="margin:0 10px 0 -9px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="IP地址" prop="srv_ip">
              <el-input v-model.trim="serverForm.srv_ip" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据中心" prop="datacenter">
              <el-select v-model="serverForm.datacenter" style="width: 100%">
                <el-option v-for="item in datacenterOptions" :key="item.id" :value="item.value_or_code"
                           :label="item.displayname"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-select v-model="serverForm.state" placeholder="请选择" style="width: 100%">
                <el-option label="启用" value="enabled"></el-option>
                <el-option label="禁用" value="disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input style="width: 100%" v-model="serverForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="VS资源列表" prop="vss">
              <div>
                <el-table :data="serverForm.vss" class='overflow-vis'>
                  <el-table-column prop="vs_ip" label="VS_IP地址" align="center" width="160" class-name="overflow-vis">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vss.' + scope.$index + '.vs_ip'" :rules="[{required: true, message: 'IP不能为空', trigger: 'blur'}, {validator: validateIpaddress}]">
                        <el-input v-model="scope.row.vs_ip" style="width: 100%"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="vs_port" label="服务端口" align="center" width="130">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vss.' + scope.$index + '.vs_port'">
                        <el-input-number v-model="scope.row.vs_port" controls-position="right" :min="0" :max="65535"
                                         style="width: 100%;"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vss.' + scope.$index + '.state'">
                        <el-select v-model="scope.row.state" placeholder="请选择" style="width: 100%">
                          <el-option label="启用" value="enabled"></el-option>
                          <el-option label="禁用" value="disabled"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vss.' + scope.$index + '.remark'">
                        <el-input v-model="scope.row.remark" style="width: 100%"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-plus" v-if="scope.$index===0" circle
                                 @click="addDomain(scope.row)" :disabled="serverForm.vss.length>4"/>
                      <el-button type="danger" icon="el-icon-delete" v-else circle @click="removeDomain(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="dialogAddServer=false">取 消</el-button>
        <el-button type="primary" @click="addServer('serverForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVsServer" @close="handleClose" width="800px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增VS</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="vsForm" :model="vs" :rules="rules" label-width="110px" style="margin:0 10px 0 -9px;">
                <el-row>
          <el-col>
            <el-form-item label="VS资源列表" prop="vsForm">
              <div>
                <el-table :data="vs.vsForm" class='overflow-vis'>
                  <el-table-column prop="vs_ip" label="IP地址" align="center" width="160" class-name="overflow-vis">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vsForm.' + scope.$index + '.vs_ip'" :rules="[{required: true, message: 'IP不能为空', trigger: 'blur'}, {validator: validateIpaddress}]">
                        <el-input v-model="scope.row.vs_ip" style="width: 100%"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="vs_port" label="服务端口" align="center" width="130">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vsForm.' + scope.$index + '.vs_port'">
                        <el-input-number v-model="scope.row.vs_port" controls-position="right" :min="0" :max="65535"
                                         style="width: 100%;"></el-input-number>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vsForm.' + scope.$index + '.state'">
                        <el-select v-model="scope.row.state" placeholder="请选择" style="width: 100%">
                          <el-option label="启用" value="enabled"></el-option>
                          <el-option label="禁用" value="disabled"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'vsForm.' + scope.$index + '.remark'">
                        <el-input v-model="scope.row.remark" style="width: 100%"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-plus" v-if="scope.$index===0" circle
                                 @click="addVs(scope.row)" :disabled="vs.vsForm.length>4"/>
                      <el-button type="danger" icon="el-icon-delete" v-else circle @click="removeVs(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-30px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('vsForm')">取 消</el-button>
        <el-button type="primary" @click="addVsForm('vsForm')">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import {
    addF5Server,
    addF5Vs,
    deleteF5Server,
    deleteF5Vs,
    fetchF5Server,
    getDatacenter,
    getUsers,
    refreshF5Server,
    remarkF5Server,
    remarkVs,
    statusF5Server,
    statusVs,
  } from '@/api/cainiao/f5_dns'
  import {validIp} from '@/utils/validate'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'

  export default {
    name: 'ComplexTable',
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
    },
    directives: {
      waves,
    },
    data() {
      const validateIpaddress = (rule, value, callback) => {
        if (value) {
          if (validIp(value)) {
            callback()
          } else {
            callback(new Error('IP填写不正确'))
          }
        } else {
          callback()
        }
      }
      return {
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          availabilitystate: undefined,
          enabledstate: undefined,
          deleted: 0,
          opr_time_s: undefined,
        },
        loadAppForm: {
          srv_name: '',
          type: 'srv',
          remark: '',
        },
        editAppForm: {
          srv_name: '',
          type: 'vs',
          remark: '',
          vs_name: '',
        },
        serverForm: {
          srv_ip: '',
          datacenter: '/Common/DC_YTO',
          state: 'enabled',
          remark: '',
          vss: [{
            vs_ip: '',
            vs_port: '',
            state: 'enabled',
            remark: '',
          }],
        },
        vs:{
          srv_name:'',
          vsForm:[{
          vs_ip: '',
          vs_port: '',
          state: 'enabled',
          remark: '',
        }],
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
        total: 0,
        listLoading: true,
        dialogCreateAppVisible: false,
        dialogEditAppVisible: false,
        dialogRemark: false,
        dialogAddServer: false,
        dialogVsServer: false,
        adminrole: false,
        adminrole1: false,
        f1: true,
        statusOptions: [{'value': '启用', 'label': '启用'}, {'value': '禁用', 'label': '禁用'},
          {'value': '被父级禁用', 'label': '被父级禁用'}],
        enableOptions: [{'value': '可用', 'label': '可用'}, {'value': '不可用', 'label': '不可用'},
          {'value': '离线', 'label': '离线'}, {'value': '未知', 'label': '未知'}],
        rules: {
          srv_ip: [{required: 'true', message: '请正确填写ip', trigger: 'blur'}, {validator: validateIpaddress}],
          datacenter: [{required: 'true', message: '请选择选项', trigger: 'blur'}],
          state: [{required: 'true', message: '请选择状态', trigger: 'blur'}],
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        multipleSelection: [],
        remarkForm: {
          remark: '',
          operate_user: this.user
        },
        user: '',
        configinfodictadd: {
          vs_ip: '',
          vs_port: '',
          state: 'enabled',
          remark: '',
        },
        vs_config: {
          vs_ip: '',
          vs_port: '',
          state: 'enabled',
          remark: '',
        },
        datacenterOptions: [],
        srv:''
      }
    },
    created() {
      this.adminrole = this.roles.includes('f5_gtm_dns')
      this.adminrole1 = this.roles.includes('f5_gtm_dns_delete_batch')
      this.getList()
      this.getParams()
      getUsers().then(res => {
        this.user = res.user
      })
      getDatacenter().then(res => {
        this.datacenterOptions = res
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      validateIpaddress (rule, value, callback) {
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
      delete_vs(row){
        const msg = '确定要删除该VS信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'VS信息删除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          deleteF5Vs({one:this.user,two:[{srv_name: row.srv_name,vs_name:row.vs_name}]}).then(res => {
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
        })
      },
      addVsForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
            lock: true,
            text: 'VS信息添加中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
            addF5Vs({one:this.user,two:this.vs}).then(res=>{
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
            this.dialogVsServer=false
          }
        });
      },
      vsDialog(row){
        this.dialogVsServer=true
        this.vs.srv_name=row.srv_name
      },
      addVs() {
        const configinfo = Object.assign({}, this.vs_config)
        this.vs.vsForm.push(configinfo)
      },
      removeVs(item) {
        const index = this.vs.vsForm.indexOf(item)
        if (index !== -1) {
          this.vs.vsForm.splice(index, 1)
        }
      },
      deleteCommon(row) {
        const msg = '确定要删除该Server信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Server信息删除中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          deleteF5Server({one:this.user,two:[{srv_name: row.srv_name}]}).then(res => {
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
        })
      },
      deleteBatch() {
        if (this.multipleSelection.length > 0) {
          const msg = '确定要删除该' + this.multipleSelection.length + '条Server信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'Server信息删除中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            deleteF5Server({one:this.user,two:this.multipleSelection}).then(res => {
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
                this.getList()
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
            this.dialogRemark = false
          })
        }
      },
      addServer(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
            lock: true,
            text: 'Server信息添加中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
            addF5Server({one: this.user, two: [this.serverForm]}).then(res => {
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
                this.getList()
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
            this.dialogAddServer = false
          }
        })
      },
      addDomain() {
        const configinfo = Object.assign({}, this.configinfodictadd)
        this.serverForm.vss.push(configinfo)
      },
      removeDomain(item) {
        const index = this.serverForm.vss.indexOf(item)
        if (index !== -1) {
          this.serverForm.vss.splice(index, 1)
        }
      },
      getParams() {
        // 取到路由带过来的参数
        const routerParams = this.$route.query.mallCode
        this.$route.query.mallCode = undefined
        // 将数据放在当前组件的数据内
        if (routerParams) {
          this.listQuery.name = routerParams
        }
      },
      remarkBatch() {
        if (this.multipleSelection.length > 0 && this.remarkForm.remark) {
          const tmp = {
            remark: this.remarkForm.remark,
            user: this.user
          }
          const loading = this.$loading({
            lock: true,
            text: '信息备注中，请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          remarkF5Server({one: tmp, two: this.multipleSelection}).then(res => {
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
              this.getList()
            }
          }).catch(err => {
            loading.close();
            this.$message({
              message: err,
            });
          });
          this.dialogRemark = false
        }
      },
      disableBatch() {
        if (this.multipleSelection.length > 0) {
          const tmp = {
            enabledstate: 'disabled',
            user: this.user
          }
          const msg = '确定要禁用该' + this.multipleSelection.length + '条server信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'server信息禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Server({one: tmp, two: this.multipleSelection}).then(res => {
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
                this.getList()
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          })
        }
      },
      enableBatch() {
        if (this.multipleSelection.length > 0) {
          const tmp = {
            enabledstate: 'enabled',
            user: this.user
          }
          const msg = '确定要启用该' + this.multipleSelection.length + '条server信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'server信息启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Server({one: tmp, two: this.multipleSelection}).then(res => {
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
                this.getList()
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          })
        }
      },
      refreshBatch() {
        if (this.multipleSelection.length > 0) {
          const tmp = {
            user: this.user
          }
          const msg = '确定要刷新该' + this.multipleSelection.length + '条server信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'server信息刷新中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            refreshF5Server({one: tmp, two: this.multipleSelection}).then(res => {
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
                this.getList()
              }
            }).catch(err => {
              loading.close();
              this.$message({
                message: err,
              });
            });
          })
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (val.length > 0) {
          this.f1 = false
        } else {
          this.f1 = true
        }
      },
      remark_vs() {
        const tmp = {
          user: this.user
        }
        const loading = this.$loading({
          lock: true,
          text: '备注信息修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if (!this.editAppForm.remark) {
          this.editAppForm.remark = ''
        }
        remarkVs({one: tmp, two: [this.editAppForm]}).then(res => {
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
        this.dialogEditAppVisible = false
      },
      remarkVsDialog(row) {
        this.dialogEditAppVisible = true
        this.editAppForm.remark = row.remark
        this.editAppForm.srv_name = row.srv_name
        this.editAppForm.vs_name = row.vs_name
      },
      status_vs(row) {
        const tmp = {
          user: this.user
        }
        if (row.enabledstate === '启用' || row.enabledstate === '被父级禁用') {
          const msg = '确定要禁用该vs信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'vs信息禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusVs({
              one: tmp,
              two: [{state: 'disabled', type: 'vs', srv_name: row.srv_name, vs_name: row.vs_name}]
            }).then(res => {
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
          })
        } else {
          const msg = '确定要启用该vs信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'vs信息启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusVs({
              one: tmp,
              two: [{state: 'enabled', type: 'vs', srv_name: row.srv_name, vs_name: row.vs_name}]
            }).then(res => {
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
          })
        }
      },
      remark_srv() {
        const tmp = {
          remark: this.loadAppForm.remark,
          user: this.user
        }
        const loading = this.$loading({
          lock: true,
          text: '备注信息修改中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        remarkF5Server({one: tmp, two: [this.loadAppForm]}).then(res => {
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
        this.dialogCreateAppVisible = false
      },
      remarkDialog(row) {
        this.dialogCreateAppVisible = true
        this.loadAppForm.srv_name = row.srv_name
        this.loadAppForm.remark = row.remark
      },
      status_operate(row) {
        if (row.enabledstate === '启用' || row.enabledstate === '被父级禁用') {
          const tmp = {
            enabledstate: 'disabled',
            user: this.user
          }
          const msg = '确定要禁用该server信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'server信息禁用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Server({one: tmp, two: [{type: 'srv', srv_name: row.srv_name}]}).then(res => {
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
          })
        } else {
          const msg = '确定要启用该server信息吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            const tmp = {
              enabledstate: 'enabled',
              user: this.user
            }
            const loading = this.$loading({
              lock: true,
              text: 'server信息启用中，请稍后',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            statusF5Server({one: tmp, two: [{type: 'srv', srv_name: row.srv_name}]}).then(res => {
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
          })
        }
      },
      refresh_srv(row) {
        const tmp = {
          user: this.user
        }
        const loading = this.$loading({
          lock: true,
          text: 'server信息刷新中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        refreshF5Server({one: tmp, two: [{type: 'srv', srv_name: row.srv_name}]}).then(res => {
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
        fetchF5Server(this.listQuery).then(response => {
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
        this.listQuery = {
          page: 1,
          limit: 20,
          name: undefined,
          availabilitystate: undefined,
          enabledstate: undefined,
          deleted: 0,
          opr_time_s: undefined,
        }
      },
      resetForm(formName) {
        this.dialogCreateAppVisible = false
        this.dialogEditAppVisible = false
        this.dialogVsServer = false
        this.$refs[formName].resetFields()
      },
      handleClose() {
        this.loadAppForm = {
          srv_name: '',
          type: 'srv',
          remark: '',
        }
        this.editAppForm = {
          srv_name: '',
          type: 'vs',
          vs_name: '',
          remark: '',
        }
        this.remarkForm = {
          remark: '',
          operate_user: this.user
        }
        this.serverForm = {
          srv_ip: '',
          datacenter: '/Common/DC_YTO',
          state: 'enabled',
          remark: '',
          vss: [{
            vs_ip: '',
            vs_port: '',
            state: 'enabled',
            remark: '',
          }],
        }
        this.vs= {
          srv_name: '',
          vsForm: [{
            vs_ip: '',
            vs_port: '',
            state: 'enabled',
            remark: '',
          }],
        }
      },
      toggleRowExpansion(row, label) {
        if (label.label === '操作'||label.label==='Server名称') {
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
  .el-table--border .xxxwwww:after,
  .el-table .xxxwwww:before {
    background-color: #A3D3FF;
  }

  .el-table--border .xxxwwww {
    border-color: #A3D3FF;
  }

  .xxxwwww .el-table__header-wrapper th {
    background: #ecf0f5;
  }
</style>
