<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-select v-model="listQuery.name" placeholder="Vcenter名称" style="width: 200px" clearable
                     @input="handleFilter" class="filter-item">
            <el-option v-for="item in vcenterOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="vc_ip">
          <el-input v-model="listQuery.vc_ip" placeholder="IP" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="状态" style="width: 100%" @change="handleFilter">
            <el-option v-for="item in statusOptions" :label="item.label" :key="item.value"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-form-item>
          <el-button v-if="adminrole" type="primary" style="margin-left: 10px;" @click="dialogSearchVisible=true" plain icon="el-icon-plus">新增记录
        </el-button>
        </el-form-item>
        <el-form-item>
        <el-button v-if="adminrole" :disabled="f1" type="success" @click="refreshBatch" icon="el-icon-refresh">批量更新
        </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="toggleRowExpansion" ref="table">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column label="ID" prop="id" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable align="center" width="75">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0" type="warning">禁用</el-tag>
          <el-tag v-else type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Vcenter名称" prop="name" sortable min-width="120px">
        <template slot-scope="scope">
<!--          <a style="color: #1890ff" @click="sendVcenter(scope.row.id)">{{ scope.row.name }}</a>-->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="vc_ip" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.vc_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号名称" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" v-if="false">
        <template slot-scope="scope">
          <span>{{ scope.row.pwd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="集群数量" prop="c_total" sortable width="110">
        <template slot-scope="scope">
          <span>{{scope.row.c_total}}</span>
        </template>
      </el-table-column>
      <el-table-column label="宿主机数量" prop="ip_total" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.ip_total}}</span>
        </template>
      </el-table-column>
      <el-table-column label="虚拟机数量" prop="v_total" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.v_total}}</span>
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率" prop="cpu" sortable>
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.cpu" :stroke-width="16" :text-inside="true"
                       color="#67c23a" v-if="scope.row.cpu<30"></el-progress>
          <el-progress :percentage="scope.row.cpu" :stroke-width="16" :text-inside="true"
                       color="#e6a23c" v-else-if="scope.row.cpu<70"></el-progress>
          <el-progress :percentage="scope.row.cpu" :stroke-width="16" :text-inside="true"
                       color="#f56c6c" v-else></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="内存使用率" prop="ram" sortable>
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.ram" :stroke-width="16" :text-inside="true"
                       color="#67c23a" v-if="scope.row.ram<30"></el-progress>
          <el-progress :percentage="scope.row.ram" :stroke-width="16" :text-inside="true"
                       color="#e6a23c" v-else-if="scope.row.ram<70"></el-progress>
          <el-progress :percentage="scope.row.ram" :stroke-width="16" :text-inside="true"
                       color="#f56c6c" v-else></el-progress>
        </template>
      </el-table-column>
      <!--      <el-table-column label="内存使用率" prop="mem" sortable>-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-progress :percentage="scope.row.mem" :stroke-width="16" :text-inside="true"-->
      <!--                       color="#67c23a" v-if="scope.row.mem<30"></el-progress>-->
      <!--          <el-progress :percentage="scope.row.mem" :stroke-width="16" :text-inside="true"-->
      <!--                       color="#e6a23c" v-else-if="scope.row.mem<70"></el-progress>-->
      <!--          <el-progress :percentage="scope.row.mem" :stroke-width="16" :text-inside="true"-->
      <!--                       color="#f56c6c" v-else></el-progress>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="运行状态">
        <template slot-scope="scope">
          <span>{{ scope.row.run_status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="135px">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleBatchEdit(scope.row);" icon="el-icon-edit"
                     style="width: 16px; height:16px;color:#1890FF;"></el-button>
          <el-button type="text" @click="handleBatchDelete(scope.row);" icon="el-icon-delete"
                     style="width: 16px; height:16px;color:#FF4949;"></el-button>
          <el-button type="text" @click="handleBatchRefresh(scope.row);"
                     icon="el-icon-refresh" style="width: 16px; height:16px;color:#13ce66;"></el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1" fixed="right">
        <template slot-scope="scope">
          <el-table v-loading="listLoading" :data="scope.row.List" border stripe highlight-current-row
                    style="width: 100%" class="xxxwwww">
            <el-table-column label="集群名" min-width="100px" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="HA启用" placement="top" v-if="scope.row.ha===0">
            <span v-if="scope.row.ha===0"><svg-icon icon-class="vsphere_ha"
                                                    style="width: 18px; height:18px;color:#42B983;"/></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="HA禁用" placement="top" v-if="scope.row.ha===1">
            <span v-if="scope.row.ha===1"><svg-icon icon-class="vsphere_ha"
                                                    style="width: 18px; height:18px;color:#d3d4d6;"/></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="DRS启用" placement="top" v-if="scope.row.drs===0">
            <span v-if="scope.row.drs===0"><svg-icon icon-class="vsphere_drs"
                                                     style="width: 18px; height:18px;color:#42B983;"/></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="DRS禁用" placement="top" v-if="scope.row.drs===1">
            <span v-if="scope.row.drs===1"><svg-icon icon-class="vsphere_drs"
                                                     style="width: 18px; height:18px;color:#d3d4d6;"/></span>
                </el-tooltip>
                <a style="color: #1890ff" @click="sendCluster(scope.row.id)">{{ scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column label="CPU使用率" prop="cpu" sortable width="215">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="20"
                  trigger="hover">
                  <p>{{Math.round((scope.row.cpu/scope.row.cpu_total)*100)+'%'}}</p>
                  <div slot="reference">
                    <el-progress :percentage="Math.round((scope.row.cpu/scope.row.cpu_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#67c23a"
                                 v-if="Math.round((scope.row.cpu/scope.row.cpu_total)*100)<30"></el-progress>
                    <el-progress :percentage="Math.round((scope.row.cpu/scope.row.cpu_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#e6a23c"
                                 v-else-if="Math.round((scope.row.cpu/scope.row.cpu_total)*100)<70"></el-progress>
                    <el-progress :percentage="Math.round((scope.row.cpu/scope.row.cpu_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#f56c6c" v-else></el-progress>
                  </div>
                </el-popover>
                <span
                  style="color: #8492a6; font-size: 10px">{{'可用/总量:'+((scope.row.cpu_total-scope.row.cpu)/1000).toFixed(1)+'KHz/'+(scope.row.cpu_total/1000).toFixed(1)+'KHz' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="内存使用率" prop="ram" sortable width="200">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="20"
                  trigger="hover">
                  <p>{{Math.round((scope.row.ram/scope.row.ram_total)*100)+'%'}}</p>
                  <div slot="reference">
                    <el-progress :percentage="Math.round((scope.row.ram/scope.row.ram_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#67c23a"
                                 v-if="Math.round((scope.row.ram/scope.row.ram_total)*100)<30"></el-progress>
                    <el-progress :percentage="Math.round((scope.row.ram/scope.row.ram_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#e6a23c"
                                 v-else-if="Math.round((scope.row.ram/scope.row.ram_total)*100)<70"></el-progress>
                    <el-progress :percentage="Math.round((scope.row.ram/scope.row.ram_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#f56c6c" v-else></el-progress>
                  </div>
                </el-popover>
                <span style="color: #8492a6; font-size: 10px">{{'可用/总量:'+formatValue(scope.row.ram_total-scope.row.ram)+'/'+formatValue(scope.row.ram_total) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="内存分配率" prop="ram" sortable width="200">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="20"
                  trigger="hover">
                  <p>{{Math.round((scope.row.mem_total/scope.row.ram_total)*100)+'%'}}</p>
                  <div slot="reference">
                    <el-progress :percentage="Math.round((scope.row.mem_total/scope.row.ram_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#67c23a"
                                 v-if="Math.round((scope.row.mem_total/scope.row.ram_total)*100)<30"></el-progress>
                    <el-progress :percentage="Math.round((scope.row.mem_total/scope.row.ram_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#e6a23c"
                                 v-else-if="Math.round((scope.row.mem_total/scope.row.ram_total)*100)<70"></el-progress>
                    <el-progress :percentage="Math.round((scope.row.mem_total/scope.row.ram_total)*100)"
                                 :stroke-width="10" :show-text="false"
                                 color="#f56c6c" v-else></el-progress>
                  </div>
                </el-popover>
                <span style="color: #8492a6; font-size: 10px">{{'可用/总量:'+formatValue(scope.row.ram_total-scope.row.mem_total)+'/'+formatValue(scope.row.ram_total) }}</span>
              </template>
            </el-table-column>
            <!--      <el-table-column label="存储使用率" prop="vc_mem" sortable>-->
            <!--        <template slot-scope="scope">-->
            <!--          <el-progress :percentage="Math.round(((scope.row.mem_total-scope.row.vc_mem)/scope.row.mem_total)*100)"-->
            <!--                       :stroke-width="16" :text-inside="true"-->
            <!--                       color="#67c23a"-->
            <!--                       v-if="Math.round(((scope.row.mem_total-scope.row.vc_mem)/scope.row.mem_total)*100)<30"></el-progress>-->
            <!--          <el-progress :percentage="Math.round(((scope.row.mem_total-scope.row.vc_mem)/scope.row.mem_total)*100)"-->
            <!--                       :stroke-width="16" :text-inside="true"-->
            <!--                       color="#e6a23c"-->
            <!--                       v-else-if="Math.round(((scope.row.mem_total-scope.row.vc_mem)/scope.row.mem_total)*100)<70"></el-progress>-->
            <!--          <el-progress :percentage="Math.round(((scope.row.mem_total-scope.row.vc_mem)/scope.row.mem_total)*100)"-->
            <!--                       :stroke-width="16" :text-inside="true"-->
            <!--                       color="#f56c6c" v-else></el-progress>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <el-table-column label="环境类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.env_type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="宿主机" prop="version" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="虚拟机" prop="version" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.virtual_total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="网络" prop="net" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.net }}</span>
              </template>
            </el-table-column>
            <el-table-column label="资源池" prop="pool" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.pool }}</span>
              </template>
            </el-table-column>
            <el-table-column label="运行状态" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.run_status==='green'">正常</el-tag>
                <el-tag type="warning" v-else-if="scope.row.run_status==='yellow'">警告</el-tag>
                <el-tag type="danger" v-else>异常</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间/备注" width="140" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                <div style="color: #8492a6;font-size: 10px">{{ scope.row.remark }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70px" align="center" fixed="right" v-if="adminrole">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row);" icon="el-icon-edit"
                     style="width: 16px; height:16px;color:#1890FF;"/>
                <el-button type="text" @click="handleDelete(scope.row);" icon="el-icon-delete"
                           style="width: 16px; height:16px;color:#FF4949;"/>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="添加记录" :visible.sync="dialogSearchVisible" style="text-align: left;" width="25%"
               @open="dialogOpen" @close="handleClose">
      <el-form ref="vcForm" :model="vcForm" :rules="rules" label-width="110px" style="margin-right: 40px">
        <el-form-item label="名称" min-width="100" prop="name">
          <el-input v-model.trim="vcForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="IP" min-width="100" prop="vc_ip">
          <el-input v-model.trim="vcForm.vc_ip" type="text" placeholder="ip需唯一" auto-complete="off"
                    style="width: 100%"/>
        </el-form-item>
        <el-form-item label="账号" min-width="100" prop="user">
          <el-input v-model.trim="vcForm.user" type="text" auto-complete="off" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="密码" min-width="100" prop="pwd">
          <el-input v-model="vcForm.pwd" style="width: 100%" :type="password_type">
            <el-button slot="append" icon="el-icon-view" @click="showPwd"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" min-width="100" prop="status">
          <el-select v-model="vcForm.status" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in statusOptions" :label="item.label" :key="item.value"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" min-width="100">
          <el-input v-model.trim="vcForm.remark" auto-complete="off" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 0px">
        <el-button @click="resetForm('vcForm')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogFormVisible" style="text-align: left;" width="25%" @open="dialogOpen"
               @close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="110px" style="margin-right: 40px">
        <el-form-item label="名称" min-width="100" prop="name">
          <el-input v-model.trim="editForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="IP" min-width="100" prop="vc_ip">
          <el-input v-model.trim="editForm.vc_ip" type="text" placeholder="ip需唯一" auto-complete="off"
                    style="width: 100%"/>
        </el-form-item>
        <el-form-item label="账号" min-width="100" prop="user">
          <el-input v-model.trim="editForm.user" type="text" auto-complete="off" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="密码" min-width="100" prop="pwd">
          <el-input v-model="editForm.pwd" style="width: 100%" :type="password_type">
            <el-button slot="append" icon="el-icon-view" @click="showPwd"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" min-width="100" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in statusOptions" :label="item.label" :key="item.value"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" min-width="100">
          <el-input v-model.trim="editForm.remark" auto-complete="off" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 28px">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="editPoolConfig()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogEditVisible" style="text-align: left;" width="30%"
               @open="dialogOpen" :inline="true">
      <el-form ref="clusterForm" :model="clusterForm" :rules="rules" label-width="110px" style="margin-right: 40px">
        <el-form-item label="环境类型">
          <el-select v-model="clusterForm.env_type" style="width: 100%">
            <el-option v-for="item in typeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 28px">
        <el-button @click="resetForm('clusterForm')">取 消</el-button>
        <el-button type="primary" @click="editCluster()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="更新记录" :visible.sync="dialogRefreshVisible" style="text-align: left;" width="50%"
               @open="dialogOpen" :inline="true">
      <el-form ref="refreshForm" :model="refreshForm" :rules="rules" label-width="110px" style="margin-right: 40px">
        <el-form-item>
          <div v-if="select == 'uuid'">
            <el-button type="text" @click="select='ouid'">更新全部<i class="el-icon-caret-bottom "></i></el-button>
            <el-select v-model="refreshForm.id" filterable clearable multiple>
              <el-option v-for="item in select1" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
          <div v-else="select == 'ouid'">
            <el-button type="text" @click="select='uuid'">更新部分<i class="el-icon-caret-bottom"></i></el-button>
            <el-select v-model="refreshForm.id" filterable clearable multiple>
              <el-option v-for="item in select1" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 28px">
        <el-button @click="resetForm('refreshForm')">取 消</el-button>
        <el-button type="primary" @click="editPoolConfig()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    fetchList,
    insertVCenter,
    editVCenter,
    deleteVCenter,
    selectVcenter,
    refreshVCenter,
    deleteClusters,
    editClusters,
    selectCluster
  } from '@/api/cmdbs/v_center'
  import {getLoginUser} from '@/api/cmdb'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'

  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        statusOptions: [{value: 1, label: '启用'}, {value: 0, label: '禁用'}],
        vcenterOptions: [],
        typeOptions: [{'value':'SIT','label':'SIT'},{'value':'UAT','label':'UAT'},{'value':'生产环境','label':'生产环境'}],
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          status: undefined,
          vc_ip: undefined,
        },
        disabled: false,
        vcForm: {
          name: '',
          status: 1,
          remark: '',
          pwd: '',
          user: '',
          vc_ip: '',
          add_user: ''
        },
        editForm: {
          id: '',
          name: '',
          status: '',
          remark: '',
          pwd: '',
          user: '',
          vc_ip: '',
          add_user: ''
        },
        refreshForm: {
          id: []
        },
        clusterForm:{
          env_type:''
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        list: null,
        total: 0,
        listLoading: true,
        activeName: 'ip',
        dialogFormVisible: false,
        dialogSearchVisible: false,
        dialogRefreshVisible: false,
        dialogEditVisible: false,
        adminrole: false,
        f1: true,
        radio: 1,
        select: "uuid",
        ciphertext: "********",
        password_type: 'password',
        rules: {
          name: [{required: true, message: '请输入名字', trigger: 'blur'}],
          vc_ip: [{required: true, message: '请输入ip', trigger: 'blur'},
            {max: 21, trigger: 'blur', message: '长度不可以超过21个字符'}],
          user: [{required: true, message: '请输入账号', trigger: 'blur'}],
          status: [{required: true, message: '请选择状态', trigger: 'blur'}],
          pwd: [{required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 30, trigger: 'blur', message: '长度在6到30之间'}],
        },
        user: '',
        ss: new Map(),
        multipleSelection: [],
        select: [],
        select1: [],
        cluster:''
      }
    },
    created() {
      this.adminrole = this.roles.includes('pwd_manager')
      this.getList()
      selectVcenter().then(res => {
        this.vcenterOptions = res
      })
      getLoginUser().then(response => {
        this.user = response.username;
      })
      selectCluster().then(res => {
        this.select = res
      })
    },
    computed: {
      ...mapGetters(['roles', 'name']),
    },
    methods: {
      editCluster(){
        delete this.cluster.change_user
        delete this.cluster.create_time
        delete this.cluster.update_time
        this.cluster.env_type=this.clusterForm.env_type
        this.cluster.vcenter=this.cluster.vcenter_id
        editClusters(this.cluster.id,this.cluster).then(res=>{
          this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
        this.dialogEditVisible=false
      },
      handleEdit(row){
        this.dialogEditVisible=true
        this.clusterForm.env_type=row.env_type
        this.cluster = {...row}
      },
      handleDelete(row){
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteClusters(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }, () => {
          return false
        })
      },
     formatValue(val){
       if (val<1024) {
         return val+'G'
       }else {
         return (val/1024).toFixed(1)+'T'
       }
     },
      refreshBatch() {
        if (this.multipleSelection.length > 0) {
          let msg = '确定更新该' + this.multipleSelection.length + '条记录吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            for (const i of this.multipleSelection) {
              const tmp = {}
              tmp.id = i.id
              refreshVCenter(tmp).then(response => {
                if (response.mes === '更新成功') {
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.getList()
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.mes,
                    type: 'warning',
                    duration: 2000
                  })
                }
              })
            }
          }, () => {
            return false
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
      customColorMethod(percentage) {
        if (percentage < 30) {
          return '#67c23a';
        } else if (percentage < 70) {
          return '#e6a23c';
        } else {
          return '#f56c6c';
        }
      },
      sendCluster(name) {
        this.$router.push({
          name: 'v_center_host',
          query: {
            mallCode: name,
            type:'cluster'
          }
        })
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      confirm() {
        this.$refs.vcForm.validate(valid => {
          if (valid) {
            this.vcForm.add_user = this.name
            insertVCenter(this.vcForm).then(response => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(response => {
              this.$msgbox({
                title: '消息',
                message: response.re.message,
              })
            })
            this.dialogSearchVisible = false
          }
        })
      },
      handleBatchEdit(row) {
        this.dialogFormVisible = true
        this.editForm.id = row.id
        this.editForm.name = row.name
        this.editForm.status = row.status
        this.editForm.remark = row.remark
        this.editForm.user = row.user
        this.editForm.pwd = row.pwd
        this.editForm.vc_ip = row.vc_ip
        this.editForm.add_user = row.add_user
      },
      editPoolConfig() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            editVCenter(this.editForm.id, this.editForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
            this.dialogFormVisible = false
          }
        })
      },
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteVCenter(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleBatchRefresh(row) {
        let msg = '确定更新该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          refreshVCenter({'id': row.id}).then(response => {
            if (response.mes === '更新成功') {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: response.mes,
                type: 'warning',
                duration: 2000
              })
            }
          })
        }, () => {
          return false
        })
      },
      showPwd() {
        if (this.password_type === 'password') {
          this.password_type = 'text'
        } else {
          this.password_type = 'password'
        }
      },
      handleClose() {
        this.activeName = null
      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter(listQuery) {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.dialogSearchVisible = false
        this.dialogRefreshVisible = false
        this.dialogEditVisible = false
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          name: undefined,
          status: undefined,
          vc_ip: undefined,
        }
      },
      dialogOpen() {
        this.resetlistQuery()
        this.activeName = 'ip'
        // this.$refs['vcForm'].resetFields()
        this.vcForm = {
          name: '',
          status: 1,
          remark: '',
          pwd: '',
          user: '',
          vc_ip: ''
        }
        this.refreshForm = {
          id: []
        }
        this.select1 = []
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
        })
        $table.toggleRowExpansion(row)
      },
    }
  }
</script>
<style>

</style>
