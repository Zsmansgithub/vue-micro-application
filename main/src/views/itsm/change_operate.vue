<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <el-select v-model="listQuery.gd_type" clearable @change="handleFilter" placeholder="工单类型" style="width: 110px;">
            <el-option label="变更类" value="0"></el-option>
            <el-option label="实施类" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.change_type" clearable @change="handleFilter" placeholder="变更类型" style="width: 110px;">
            <el-option label="主机类" value="主机类"/>
            <el-option label="安全类" value="安全类"/>
            <el-option label="网络类" value="网络类"/>
            <el-option label="数据库类" value="数据库类"/>
            <el-option label="中间件类" value="中间件类"/>
            <el-option label="配置类" value="配置类"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.change_level" clearable @change="handleFilter" placeholder="变更级别" style="width: 110px;">
            <el-option label="严重" value="严重"/>
            <el-option label="一般" value="一般"/>
            <el-option label="无影响" value="无影响"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.apply_user" clearable filterable @change="handleFilter" placeholder="申请人" style="width: 180px;">
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="'('+item.value+')'+item.label"
              :value="'('+item.value+')'+item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.name" clearable @change="handleFilter" placeholder="标题/影响范围/相关人员"></el-input>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" icon="el-icon-plus" type="primary" plain @click="add_dialog">
          变更类新增
        </el-button>
        <el-button class="filter-item" icon="el-icon-plus" type="primary" plain @click="add_dialog1">
          实施类新增
        </el-button>
      </el-form>
    </div>
    <el-table :data="list" border stripe highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table v-loading="listLoading" :data="[props.row.extend_field]" border stripe highlight-current-row
                    style="width: 100%" class="xxxwwww">
              <el-table-column type="expand">
                <el-table v-loading="listLoading" :data="props.row.extend_field.configinfo" border stripe
                          highlight-current-row
                          style="width: 100%" class="xxxwwww">
                  <el-table-column label="应用名" v-if="props.row.gd_type===0">
                    <template slot-scope="scope">
                      <span>{{scope.row.app_cname}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="环境" v-if="props.row.gd_type===0">
                    <template slot-scope="scope">
                      <span>{{scope.row.env}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="IP" v-if="props.row.gd_type===0">
                    <template slot-scope="scope">
                      <span>{{JSON.stringify(scope.row.Sip).replace(/\"|\[|]/g,'')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="开始时间" v-if="props.row.gd_type===1">
                    <template slot-scope="scope">
                      <span>{{scope.row.start_time}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束时间" v-if="props.row.gd_type===1">
                    <template slot-scope="scope">
                      <span>{{scope.row.end_time}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="实施人" v-if="props.row.gd_type===1">
                    <template slot-scope="scope">
                      <span>{{scope.row.implementer}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="实施内容或步骤" v-if="props.row.gd_type===1">
                    <template slot-scope="scope">
                      <span>{{scope.row.step}}</span>
                    </template>
                  </el-table-column>
                </el-table>
            </el-table-column>
            <el-table-column label="变更原因" v-if="props.row.gd_type===0">
              <template slot-scope="scope">
                <span>{{scope.row.edit_reason}}</span>
              </template>
            </el-table-column>
            <el-table-column label="变更内容" v-if="props.row.gd_type===0">
              <template slot-scope="scope">
                <span>{{scope.row.edit_event}}</span>
              </template>
            </el-table-column>
            <el-table-column label="变更步骤" v-if="props.row.gd_type===0">
              <template slot-scope="scope">
                <span>{{scope.row.edit_step}}</span>
              </template>
            </el-table-column>
            <el-table-column label="回退方案" v-if="props.row.gd_type===0">
              <template slot-scope="scope">
                <span>{{scope.row.backplan}}</span>
              </template>
            </el-table-column>
            <el-table-column label="验证方案" v-if="props.row.gd_type===0">
              <template slot-scope="scope">
                <span>{{scope.row.testplan}}</span>
              </template>
            </el-table-column>
            <el-table-column label="风险评估" v-if="props.row.gd_type===1">
              <template slot-scope="scope">
                <span>{{scope.row.danger}}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间/备注" width="140" align="center">
              <template slot-scope="scope">
                <span>{{ props.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                <div style="color: #8492a6;font-size: 10px">{{ scope.row.desc }}</div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="工单类型" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.gd_type===0">变更类</el-tag>
          <el-tag type="primary" v-else>实施类</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
          <!--          <div style="color: #8492a6; font-size: 10px">{{scope.row.instanceid}}</div>-->
        </template>
      </el-table-column>
      <el-table-column label="变更类型">
        <template slot-scope="scope">
          <span>{{ scope.row.change_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更级别">
        <template slot-scope="scope">
          <span>{{ scope.row.change_level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更时间">
        <template slot-scope="scope">
          <span>{{ scope.row.change_time.replace(/\"|\[|]/g,'') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="影响范围">
        <template slot-scope="scope">
          <span>{{ scope.row.change_range }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实施人员">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user.replace(/\"|\[|]/g,'')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="通知人员">
        <template slot-scope="scope">
          <span>{{ scope.row.notice_user.replace(/\"|\[|]/g,'') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人">
        <template slot-scope="scope">
          <span>{{ scope.row.apply_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文档链接">
        <template slot-scope="scope">
          <span v-for="item in JSON.parse(scope.row.url)">
            <el-button type="text"><a :href="'/dev-api/workflow/file_download/'+item">{{item}}</a></el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain circle @click="handleEdit(scope.row);" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain circle @click="handleDelete(scope.row);" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getList"
    />
    <el-dialog :title="dialog_title" :visible.sync="dialogCreateAppVisible" style="text-align: left;" width="60%"
               @close="handleClose">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="addForm.title" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="apply_user">
              <el-select
                v-model="addForm.apply_user"
                filterable
                clearable
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="变更类型" prop="change_type">
              <el-select v-model="addForm.change_type" style="width: 100%;">
                <el-option label="主机类" value="主机类"/>
                <el-option label="安全类" value="安全类"/>
                <el-option label="网络类" value="网络类"/>
                <el-option label="数据库类" value="数据库类"/>
                <el-option label="中间件类" value="中间件类"/>
                <el-option label="配置类" value="配置类"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更级别" prop="change_level">
              <el-select v-model="addForm.change_level" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="严重" value="严重"/>
                <el-option label="一般" value="一般"/>
                <el-option label="无影响" value="无影响"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="变更时间" prop="change_time">
              <el-date-picker
                v-model="addForm.change_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响范围" prop="change_range">
              <el-input v-model="addForm.change_range" style="width: 100%" placeholder="请输入影响范围"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实施人员" prop="operate_user">
              <el-select
                v-model="addForm.operate_user"
                filterable
                clearable
                multiple
                :multiple-limit="10"
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知人员" prop="notice_user">
              <el-select
                v-model="addForm.notice_user"
                filterable
                clearable
                multiple
                :multiple-limit="10"
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.addForm.gd_type===0">
          <el-col :span="12">
            <el-form-item label="变更原因">
              <el-input v-model="addForm.extend_field.edit_reason" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更内容">
              <el-input v-model="addForm.extend_field.edit_event" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.addForm.gd_type===0">
          <el-col :span="12">
            <el-form-item label="变更步骤">
              <el-input v-model="addForm.extend_field.edit_step" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回退方案">
              <el-input v-model="addForm.extend_field.backplan" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.addForm.gd_type===0">
          <el-col :span="12">
            <el-form-item label="验证方案">
              <el-input v-model="addForm.extend_field.testplan" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注描述">
              <el-input v-model="addForm.extend_field.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.addForm.gd_type===1">
          <el-col :span="12">
            <el-form-item label="风险评估">
              <el-input v-model="addForm.extend_field.danger" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注描述">
              <el-input v-model="addForm.extend_field.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.addForm.gd_type===0">
          <el-col :span="24">
            <el-form-item label="变更应用">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">最大支持5条信息</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                变更应用
              </label>
              <div>
                <el-table :data="addForm.extend_field.configinfo">
                  <el-table-column prop="project_name_list" label="应用名" align="center" min-width="10">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.project_name_list'"
                                    :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                        <el-cascader expand-trigger="hover"
                                     :options="projectOptions"
                                     v-model="scope.row.project_name_list"
                                     filterable
                                     :filter-method="filterMethod"
                                     :show-all-levels="false"
                                     style="width:100%;"
                                     placeholder="请选择产品线及应用名"
                                     @change="vmIpList(scope.row)">
                        </el-cascader>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="env" label="环境" align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.env'"
                                    :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                        <el-select v-model="scope.row.env" style="width: 100%;" @change="vmIpList(scope.row)">
                          <el-option label="生产" value="生产"/>
                          <el-option label="UAT" value="UAT"/>
                          <el-option label="SIT" value="SIT"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Sip" label="IP地址" align="center" min-width="9">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.Sip'"
                                    :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                        <el-select
                          v-model="scope.row.Sip"
                          filterable
                          clearable
                          multiple
                          placeholder="请选择应用后,再选择IP地址"
                          style="width: 100%;"
                          @change='changeSelect(scope.row)'>
                          <el-checkbox v-model="scope.row.checked" @change='selectAll(scope.row)'
                                       style="text-align: right; width: 100%;padding-right: 20px;">全选
                          </el-checkbox>
                          <el-option
                            v-for="item in scope.row.tableData"
                            :key="item.ip"
                            :label="item.ip"
                            :value="item.ip">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;"
                                 @click="addDomain()" :disabled="addForm.extend_field.configinfo.length>4">
                      </el-button>
                      <el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle
                                 style="padding:2px;" @click="removeDomain(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.addForm.gd_type===1">
          <el-col  :span="24">
            <el-form-item label="实施步骤">
              <el-table :data="addForm.extend_field.configinfo">
                <el-table-column prop="start_time" label="开始时间"  align="center" min-width="2">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.start_time'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.start_time" placeholder="请输入" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="end_time" label="结束时间"  align="center" min-width="2">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.end_time'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.end_time" placeholder="请输入" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="implementer" label="实施人"  align="center" min-width="3">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.implementer'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <!-- <el-input v-model="scope.row.implementer" placeholder="请输入" style="width: 100%;"></el-input> -->
                      <el-select v-model="scope.row.implementer" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
                        <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="'('+item.value+')'+item.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="step" label="实施内容或步骤"  align="center" min-width="4">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.step'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.step" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="1">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;" @click="addDomain()" :disabled="addForm.extend_field.configinfo.length>29">
                    </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removeDomain(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="/dev-api/workflow/workflow_upload_file_first"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleChange"
                :before-upload="beforeUpload"
                multiple
                :limit="10"
                :on-exceed="handleExceed"
                :file-list="addForm.url">
                <el-button size="small" type="primary">上传附件</el-button>
                <div slot="tip" class="el-upload__tip"><span style="color: red;">*</span>请上传附件，且单个文件不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialog_title" :visible.sync="dialogEditAppVisible" style="text-align: left;" width="60%"
               @close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="editForm.title" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="apply_user">
              <el-select
                v-model="editForm.apply_user"
                filterable
                clearable
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="变更类型" prop="change_type">
              <el-select v-model="editForm.change_type" style="width: 100%;">
                <el-option label="主机类" value="主机类"/>
                <el-option label="安全类" value="安全类"/>
                <el-option label="网络类" value="网络类"/>
                <el-option label="数据库类" value="数据库类"/>
                <el-option label="中间件类" value="中间件类"/>
                <el-option label="配置类" value="配置类"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更级别" prop="change_level">
              <el-select v-model="editForm.change_level" popper-class="app-search-class"
                         style="width: 100%;">
                <el-option label="严重" value="严重"/>
                <el-option label="一般" value="一般"/>
                <el-option label="无影响" value="无影响"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="变更时间" prop="change_time">
              <el-date-picker
                v-model="editForm.change_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响范围" prop="change_range">
              <el-input v-model="editForm.change_range" style="width: 100%" placeholder="请输入影响范围"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实施人员" prop="operate_user">
              <el-select
                v-model="editForm.operate_user"
                filterable
                clearable
                multiple
                :multiple-limit="10"
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知人员" prop="notice_user">
              <el-select
                v-model="editForm.notice_user"
                filterable
                clearable
                multiple
                :multiple-limit="10"
                placeholder="请输入工号/姓名"
                style="width: 100%;">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="'('+item.value+')'+item.label"
                  :value="'('+item.value+')'+item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.editForm.gd_type===0">
          <el-col :span="12">
            <el-form-item label="变更原因">
              <el-input v-model="editForm.extend_field.edit_reason" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更内容">
              <el-input v-model="editForm.extend_field.edit_event" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.editForm.gd_type===0">
          <el-col :span="12">
            <el-form-item label="变更步骤">
              <el-input v-model="editForm.extend_field.edit_step" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回退方案">
              <el-input v-model="editForm.extend_field.backplan" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.editForm.gd_type===0">
          <el-col :span="12">
            <el-form-item label="验证方案">
              <el-input v-model="editForm.extend_field.testplan" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注描述">
              <el-input v-model="editForm.extend_field.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.editForm.gd_type===1">
          <el-col :span="12">
            <el-form-item label="风险评估">
              <el-input v-model="editForm.extend_field.danger" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注描述">
              <el-input v-model="editForm.extend_field.desc" type="textarea" maxlength="200"
                        :autosize="{ minRows: 2, maxRows: 8}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.editForm.gd_type===0">
          <el-col :span="24">
            <el-form-item label="变更应用" prop="configinfo">
              <label slot="label">
                <el-tooltip class="item" effect="dark" content="" placement="top-end">
                  <div slot="content">最大支持5条信息</div>
                  <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px"/>
                </el-tooltip>
                变更应用
              </label>
              <div>
                <el-table :data="editForm.extend_field.configinfo">
                  <el-table-column prop="project_name_list" label="应用名" align="center" min-width="10">
                    <template slot="header" slot-scope="scope">
                      <label slot="label">应用名
                        <el-tooltip class="item" effect="dark" placement="top">
                          <div slot="content">
                            如未找到应用，请提交“新应用申请单”
                          </div>
                          <svg-icon class-name="help-svg" icon-class="help" style="width: 14px; height:14px"/>
                        </el-tooltip>
                      </label>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.project_name_list'"
                                    :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                        <el-cascader expand-trigger="hover"
                                     :options="projectOptions"
                                     v-model="scope.row.project_name_list"
                                     filterable
                                     :filter-method="filterMethod"
                                     :show-all-levels="false"
                                     style="width:100%;"
                                     placeholder="请选择产品线及应用名"
                                     @change="vmIpList(scope.row)">
                        </el-cascader>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="env" label="环境" align="center" min-width="3">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.env'"
                                    :rules="{type:'string',required:true,message:'不能为空',trigger:'change'}">
                        <el-select v-model="scope.row.env" style="width: 100%;" @change="vmIpList(scope.row)">
                          <el-option label="生产" value="生产"/>
                          <el-option label="UAT" value="UAT"/>
                          <el-option label="SIT" value="SIT"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Sip" label="IP地址" align="center" min-width="9">
                    <template slot-scope="scope">
                      <el-form-item :prop="'configinfo.' + scope.$index + '.Sip'"
                                    :rules="{type:'array',required:true,message:'不能为空',trigger:'change'}">
                        <el-select
                          v-model="scope.row.Sip"
                          filterable
                          clearable
                          multiple
                          placeholder="请选择应用后,再选择IP地址"
                          style="width: 100%;"
                          @change='changeSelect(scope.row)'>
                          <el-checkbox v-model="scope.row.checked" @change='selectAll(scope.row)'
                                       style="text-align: right; width: 100%;padding-right: 20px;">全选
                          </el-checkbox>
                          <el-option
                            v-for="item in scope.row.tableData"
                            :key="item.ip"
                            :label="item.ip"
                            :value="item.ip">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="2">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;"
                                 @click="addDomainEdit(scope.row)" :disabled="editForm.extend_field.configinfo.length>4">
                      </el-button>
                      <el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle
                                 style="padding:2px;" @click="removeDomainEdit(scope.row)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.editForm.gd_type===1">
          <el-col  :span="24">
            <el-form-item label="实施步骤" prop="configinfo">
              <el-table :data="editForm.extend_field.configinfo">
                <el-table-column prop="start_time" label="开始时间"  align="center" min-width="2">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.start_time'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.start_time" placeholder="请输入" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="end_time" label="结束时间"  align="center" min-width="2">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.end_time'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.end_time" placeholder="请输入" style="width: 100%;"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="implementer" label="实施人"  align="center" min-width="3">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.implementer'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <!-- <el-input v-model="scope.row.implementer" placeholder="请输入" style="width: 100%;"></el-input> -->
                      <el-select v-model="scope.row.implementer" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
                        <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="'('+item.value+')'+item.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="step" label="实施内容或步骤"  align="center" min-width="4">
                  <template slot-scope="scope">
                    <el-form-item :prop="'configinfo.' + scope.$index + '.step'" :rules="{type:'string',required:true,message:'不能为空',trigger:'blur'}">
                      <el-input v-model="scope.row.step" type="textarea" maxlength="200" :autosize="{ minRows: 1, maxRows: 8}"/>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="1">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-plus" circle style="padding:2px;" @click="addDomainEdit()" :disabled="editForm.extend_field.configinfo.length>29">
                    </el-button><el-button type="danger" icon="el-icon-delete" v-if="scope.row.status !== 1" circle style="padding:2px;" @click="removeDomainEdit(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="/dev-api/workflow/workflow_upload_file_first"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleChange"
                :before-upload="beforeUpload"
                multiple
                :limit="10"
                :on-exceed="handleExceed"
                :file-list="editForm.url">
                <el-button size="small" type="primary">上传附件</el-button>
                <div slot="tip" class="el-upload__tip"><span style="color: red;">*</span>请上传附件，且单个文件不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit_form('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addChangeOperate, deleteChangeOperate, editChangeOperate, getlist} from '@/api/itsm/change_operate'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import {fetchAppInfo} from '@/api/cmdbs/app_manage'
  import {fetchIPList} from '@/api/cmdb'
  import {getUserInfo} from '@/api/zabbix/user_info'

  export default {
    name: "change_operate",
    mixins: [resize, sessionListQuery],
    components: {
      Pagination,
    },
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          gd_type:undefined,
          change_type:undefined,
          change_level:undefined,
          apply_user:undefined,
          name:undefined,
        },
        addForm: {
          title:'',
          apply_user: '',
          change_level: '',
          change_range: '',
          change_time: '',
          change_type: '',
          comments: '',
          extend_field: {
            configinfo: [],
            edit_reason: '',
            edit_event: '',
            edit_step: '',
            backplan: '',
            testplan: '',
            desc: '',
          },
          gd_type: '',
          notice_user: '',
          operate_user: '',
          url: [],
        },
        editForm: {
          id: '',
          title:'',
          apply_user: '',
          change_level: '',
          change_range: '',
          change_time: '',
          change_type: '',
          comments: '',
          extend_field: {
            configinfo: [],
            edit_reason: '',
            edit_event: '',
            edit_step: '',
            backplan: '',
            testplan: '',
            danger: '',
            desc: '',
          },
          gd_type: '',
          notice_user: '',
          operate_user: '',
          url: [],
        },
        configinfodictadd: {
          project_name_list: [],
          app_id: '',
          app_cname: '',
          app_name: '',
          env: '生产',
          Sip: [],
          status: 1,
          total: 0,
          tableData: [],
          checked: false,
        },
        configinfodict: {
          start_time:'',
          end_time:'',
          implementer:'',
          step:'',
          status:1,
        },
        list: null,
        total: 0,
        dialog_title:'',
        listLoading: true,
        dialogCreateAppVisible: false,
        dialogEditAppVisible: false,
        dialogAddVisible: false,
        dialogEditVisible: false,
        adminrole: false,
        projectOptions: [],
        userOptions: [],
        typeOptions: [{'value': 0, 'label': '变更类'}, {'value': 1, 'label': '实施类'}],
        rules: {
          change_type: [{required: true, message: '请选择变更类型', trigger: 'blur'},],
          change_level: [{required: true, message: '请选择变更级别', trigger: 'blur'},],
          change_time: [{required: true, message: '请选择变更时间', trigger: 'blur'},],
          operate_user: [{required: true, message: '请选择实施人员', trigger: 'blur'},],
          notice_user: [{required: true, message: '请选择通知人员', trigger: 'blur'},],
          // edit_event: [{required: true, message: '请输入变更内容', trigger: 'blur'},],
          // edit_reason: [{required: true, message: '请输入变更原因', trigger: 'blur'},],
          change_range: [{required: true, message: '请输入影响范围', trigger: 'blur'},],
          title: [{required: true, message: '请输入标题', trigger: 'blur'},],
          // edit_step: [{required: true, message: '请输入变更步骤', trigger: 'blur'},],
          // backplan: [{required: true, message: '请输入回退方案', trigger: 'blur'},],
          // testplan: [{required: true, message: '请输入验证方案', trigger: 'blur'},],
          apply_user: [{required: true, message: '请选择申请人', trigger: 'blur'},],
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
      // this.adminrole = this.roles.includes('domain_admin')
      this.getList()
      getProductAppCascader().then(response => {
        this.projectOptions = response
      });
      getUserInfo().then(response => {
        this.userOptions = response
      });
    },
    computed: {
      ...mapGetters(['roles', 'name']),
    },
    methods: {
      add_dialog1(){
        this.dialogCreateAppVisible=true
        this.addForm.gd_type=1
        this.addForm.extend_field.configinfo.push(Object.assign({}, this.configinfodict))
        this.dialog_title='实施类新增'
      },
      add_dialog(){
        this.dialogCreateAppVisible=true
        this.addForm.gd_type=0
        this.addForm.extend_field.configinfo.push(Object.assign({}, this.configinfodictadd))
        this.dialog_title='变更类新增'
      },
      handleEdit(row){
        this.dialogEditAppVisible=true
        row.gd_type===0?this.dialog_title='变更类修改':this.dialog_title='实施类修改'
        this.editForm.id=row.id,
        this.editForm.apply_user=row.apply_user,
        this.editForm.change_level=row.change_level,
        this.editForm.change_range=row.change_range,
        this.editForm.change_time=JSON.parse(row.change_time),
        this.editForm.change_type=row.change_type,
        this.editForm.comments=row.comments,
        this.editForm.extend_field=row.extend_field
        this.editForm.gd_type=row.gd_type,
        this.editForm.notice_user=JSON.parse(row.notice_user),
        this.editForm.operate_user=JSON.parse(row.operate_user),
        this.editForm.url=JSON.parse(row.url)
        this.editForm.title=row.title
      },
      handleRemove(file, fileList) {
        this.addForm.url = []
        this.addForm.url = fileList
        this.editForm.url = []
        this.editForm.url = fileList
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (file.status === 'ready') {
          return
        }
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleChange(response, file, fileList) {
        this.addForm.url = []
        this.addForm.url = fileList
        this.editForm.url = []
        this.editForm.url = fileList
      },
      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      },
      data(query, row) {
        fetchIPList(query).then(response => {
          row.total = response.count
          const tableData = []
          for (const i of response.results) {
            tableData.push({
              ip: i.ip
            })
          }
          // 合并为一个数组
          row.tableData = row.tableData.concat(tableData)
          if (this.listQuery.page < row.total / 20) {
            this.listQuery.page++
            this.data(this.listQuery, row)
          } else {
            this.listQuery.page = 1
          }
        })
      },
      selectAll(row) {
        row.Sip = []
        if (row.checked) {
          row.tableData.map((item) => {
            row.Sip.push(item.ip)
          })
        } else {
          row.Sip = []
        }
      },
      changeSelect(row) {
        if (row.Sip.length === row.tableData.length) {
          row.checked = true
        } else {
          row.checked = false
        }
      },
      filterMethod(node, keyword) {
        keyword = keyword.toLowerCase() // 搜索关键字转为小写
        const {text, path} = node;
        // return text.includes(keyword) || path.includes(keyword);
        return text.toLowerCase().includes(keyword)
      },
      vmIpList(row) {
        row.app_id = row.project_name_list[3]
        this.listQuery.app_id = row.app_id
        if (this.listQuery.app_id === undefined) {
          return
        }
        fetchAppInfo(row.app_id).then(response => {
          row.app_name = response.app_name
          row.app_cname = response.app_cname
        })
        // console.log(row)
        row.tableData = []
        row.Sip = []
        row.checked = false
        //环境
        if (row.env === '生产') {
          this.listQuery.resource_env = 1
        } else if (row.env === 'SIT') {
          this.listQuery.resource_env = 2
        } else if (row.env === 'UAT') {
          this.listQuery.resource_env = 4
        } else {
          this.listQuery.resource_env = undefined
        }
        this.data(this.listQuery, row)
      },
      addDomain() {
        if (this.addForm.gd_type===0) {
          const configinfo = Object.assign({}, this.configinfodictadd)
          configinfo.status = 2
          this.addForm.extend_field.configinfo.push(configinfo)
        }else {
          const configinfo = Object.assign({}, this.configinfodict)
          configinfo.status = 2
          this.addForm.extend_field.configinfo.push(configinfo)
        }
      },
      removeDomain(item) {
        let index = this.addForm.extend_field.configinfo.indexOf(item)
        if (index !== -1) {
          this.addForm.extend_field.configinfo.splice(index, 1)
        }
      },
      addDomainEdit() {
        if (this.editForm.gd_type === 0) {
          const configinfo = Object.assign({}, this.configinfodictadd)
          configinfo.status = 2
          this.editForm.extend_field.configinfo.push(configinfo)
        } else {
          const configinfo = Object.assign({}, this.configinfodict)
          configinfo.status = 2
          this.editForm.extend_field.configinfo.push(configinfo)
        }
      },
      removeDomainEdit(item) {
        let index = this.editForm.extend_field.configinfo.indexOf(item)
        if (index !== -1) {
          this.editForm.extend_field.configinfo.splice(index, 1)
        }
      },
      handleDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteChangeOperate(row.id).then(response => {
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(error => {
            this.$message({
              type: 'error',
              message: error
            })
          })
        }, () => {
          return false
        })
      },
      edit_form(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.editForm.change_time = JSON.stringify(this.editForm.change_time)
            this.editForm.notice_user = JSON.stringify(this.editForm.notice_user)
            this.editForm.operate_user = JSON.stringify(this.editForm.operate_user)
            const temp = []
            this.editForm.url.forEach(v => {
              if (v.name && v.status === 'success') {
                temp.push(v.name)
              } else {
                temp.push(v)
              }
            })
            this.editForm.url = JSON.stringify(temp)
            // console.log(this.editForm)
            editChangeOperate(this.editForm).then(res => {
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
            this.dialogEditAppVisible = false
          } else {
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            })
            return false
          }
        })
      },
      handleReset() {
        this.listQuery= {
          page: 1,
          limit: 20,
          gd_type:undefined,
          change_type:undefined,
          change_level:undefined,
          apply_user:undefined,
          name:undefined,
        }
        this.getList()
      },
      getList() {
        this.listLoading = true
        getlist(this.listQuery).then(response => {
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
      confirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.addForm.change_time = JSON.stringify(this.addForm.change_time)
            this.addForm.notice_user = JSON.stringify(this.addForm.notice_user)
            this.addForm.operate_user = JSON.stringify(this.addForm.operate_user)
            const temp = []
            this.addForm.url.forEach(v => {
              if (v.status === 'success') {
                temp.push(v.name)
              }
            })
            this.addForm.url = JSON.stringify(temp)
            addChangeOperate(this.addForm).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            }).catch(err => {
              this.$message({
                message: err,
              });
            });
            this.dialogCreateAppVisible = false
          } else {
            this.$message({
              message: '请填写必要的字段和内容',
              type: 'warning',
            })
            return false
          }
        })
      },
      resetForm(formName) {
        this.dialogCreateAppVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose() {
        this.$refs.upload.clearFiles();
        this.addForm={
          title:'',
          apply_user: '',
          change_level: '',
          change_range: '',
          change_time: '',
          change_type: '',
          comments: '',
          extend_field: {
            configinfo: [],
            edit_reason: '',
            edit_event: '',
            edit_step: '',
            backplan: '',
            testplan: '',
            desc: '',
          },
          gd_type: '',
          notice_user: '',
          operate_user: '',
          url: [],
        }
      },
    },
  }
</script>

<style scoped>

</style>
