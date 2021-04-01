<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="package_name">
          <el-input v-model="listQuery.package_name" placeholder="包名" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="change_user">
          <el-input v-model="listQuery.change_user" placeholder="上传用户" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="describe">
          <el-input v-model="listQuery.describe" placeholder="描述" style="width: 200px;" clearable
                    @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="listQuery.type" style="width: 100%" placeholder="版本类型" @change="handleFilter" clearable>
            <el-option v-for="item in versionOptions" :key="item.label" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>-->
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" v-if="adminrole" type="primary" @click="dialogSearchVisible=true" plain
                   icon="el-icon-plus">新增
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
    >
      <el-table-column label="包名" width="250" prop="package_name" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.package_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" width="200" v-if="false">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="78" :formatter="formatter">
      </el-table-column>
      <el-table-column label="版本类型" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==='定制版'" type="warning">定制版</el-tag>
          <el-tag v-else type="success">标准版</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上传用户" width="77">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传日期" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
<!--          <span v-if="scope.row.describe.indexOf(' ')!==-1" v-for="item in scope.row.describe.split(' ')">{{item}}</span>-->
          <span>{{scope.row.describe}}</span>
<!--          <pre class="pre_class">{{ scope.row.describe | row2MultipleRow}}</pre>-->
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下载操作" width="123">
        <template slot-scope="scope">
          <el-button type="text"><a :href=scope.row.url>下载</a></el-button>
<!--          <el-button type="text" @click="download(scope.row.package_name)">下载</el-button>-->
          <el-button class="btn" type="text" @click="handleClicks(scope.row.url)">复制路径</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="adminrole" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" plain circle @click="handleBatchEdit(scope.row);" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain circle @click="handleBatchDelete(scope.row);"
                     icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList"/>

    <el-dialog title="添加记录" :visible.sync="dialogSearchVisible" style="text-align: left;" width="40%"
               @close="handleClose">
      <el-form ref="groupConfig" :model="groupConfig" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-form-item label="版本类型" prop="type">
          <el-select v-model="groupConfig.type" style="width: 100%" @change="handleType">
            <el-option v-for="item in versionOptions" :key="item.label" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="groupConfig.describe" style="width: 100%" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="groupConfig.remark" style="width: 100%" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload v-if="f1" ref="upload" class="upload-demo" action="/dev-api/cmdb/upload_excel_standard" :on-success="handleChange" :on-error="handleError">
            <el-button size="small" type="primary">标准版上传</el-button>
          </el-upload>
          <el-upload v-if="f2" ref="upload" class="upload-demo" action="/dev-api/cmdb/upload_excel" :on-success="handleChange" :on-error="handleError">
            <el-button size="small" type="primary">定制版上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('groupConfig')">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogFormVisible" style="text-align: left;" width="40%"
               @close="handleClose">
      <el-form ref="groupEditConfig" :model="groupEditConfig" :rules="rules" label-width="110px"
               style="margin-right: 20px;margin-left: 20px">
        <el-form-item label="版本类型" prop="type">
          <el-select v-model="groupEditConfig.type" style="width: 100%">
            <el-option v-for="item in versionOptions" :key="item.label" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="groupEditConfig.describe" style="width: 100%" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="groupEditConfig.remark" style="width: 100%" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload v-if="this.groupEditConfig.type==='标准版'" ref="upload" class="upload-demo" action="/dev-api/cmdb/upload_excel_standard" :on-success="handleEdit" :on-error="handleError">
            <el-button size="small" type="primary">标准版上传</el-button>
          </el-upload>
          <el-upload v-if="this.groupEditConfig.type==='定制版'" ref="upload" class="upload-demo" action="/dev-api/cmdb/upload_excel" :on-success="handleEdit" :on-error="handleError">
            <el-button size="small" type="primary">定制版上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetForm('groupEditConfig')">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
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
  import {addPackageInfo, deletePackageInfo, editPackageInfo, fetchAllPackage} from '@/api/cmdbs/tools'
  import Clipboard from 'clipboard'
  import Tinymce from '@/components/Tinymce'
  import {Message} from 'element-ui';

  export default {
    name: 'DirectivePermission',
    components: {Pagination, Tinymce,Message},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        versionOptions: [{label: '标准版', value: '标准版'},{label: '定制版', value: '定制版'}],
        listQuery: {
          page: 1,
          limit: 20,
          package_name: undefined,
          change_user: undefined,
          describe: undefined,
          type: undefined,
        },
        groupConfig: {
          package_name: '',
          describe: '',
          size: '',
          url: '',
          type: '',
          remark: ''
        },
        groupEditConfig: {
          id: '',
          package_name: '',
          describe: '',
          size: '',
          url: '',
          type: '',
          remark: ''
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
        name: '',
        size: '',
        adminrole: false,
        f1: false,
        f2: false,
        rules: {
          type: [{required: true, message: '请选择版本', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList()
      this.adminrole = this.roles.includes('post_package_admin')
    },
    filters: {
      row2MultipleRow(data) {
        let res = ''
        if (data) {
          for (let item of data.split(' ')) {
            item += '\n'
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
      handleType(val) {
        if (val==='标准版'){
          this.f1=true
          this.f2=false
        }
        if(val==='定制版') {
          this.f2=true
          this.f1=false
        }
      },
      handleError(err, file, fileList){
        this.$message({
          title: '失败',
          message: '上传包不能超过1GB',
          type: 'error',
          duration: 2000
        })
      },
      handleEdit(response, file, fileList) {
        const res = response.file_alias.split('/')
        this.name = res[2]
        this.size = Math.floor((file.size) * 0.0009766)
      },
      handleClicks(val) {
        // const input = document.location
        const copy_text = 'http://xc.yto.net.cn' + val
        let clipboard = new Clipboard('.btn', {
          text: function () {
            return copy_text;
          }
        });
        clipboard.on('success', e => {
          Message.success('复制成功')
          clipboard.destroy();
        });
        clipboard.on('error', function (e) {
          Message.error('复制失败')
          clipboard.destroy();
        });
      },
      formatter(row, column, cellValue, index) {
        if (row.size < 1024) {
          return row.size + 'KB'
        } else if (1024<=row.size&&row.size<1048576) {
          return (row.size / 1024).toFixed(1) + 'MB'
        }else {
          return (row.size / 1048576).toFixed(1) + 'G'
        }
      },
      handleChange(response, file, fileList) {
        const res = response.file_alias.split('/')
        this.groupConfig.package_name = res[2]
        this.groupConfig.size = Math.floor((file.size) * 0.0009766)
      },
      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deletePackageInfo(row.id).then(response => {
            if (response.status==='ok') {
              this.$message({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
              this.getList()
            }else {
              this.$message({
              title: '失败',
              message: response.message,
              type: 'error',
              duration: 2000
            })
              this.getList()
            }
          })
        }, () => {
          return false
        })
      },
      handleBatchEdit(row) {
        this.dialogFormVisible = true
        this.groupEditConfig.describe = row.describe
        this.groupEditConfig.remark = row.remark
        this.groupEditConfig.id = row.id
        this.groupEditConfig.url = row.url
        this.groupEditConfig.package_name = row.package_name
        this.groupEditConfig.size = row.size
        this.groupEditConfig.type = row.type
      },
      edit() {
        this.$refs.groupEditConfig.validate(valid => {
          if (valid) {
            if (this.name && this.size) {
              this.groupEditConfig.package_name = this.name
              this.groupEditConfig.size = this.size
            }
            if (this.groupEditConfig.type==='标准版'){
              this.groupEditConfig.url = '/cmdb/file_download/standard/' + this.groupEditConfig.package_name
            } else {
              this.groupEditConfig.url = '/cmdb/file_download/custom/' + this.groupEditConfig.package_name
            }
            editPackageInfo(this.groupEditConfig.id, this.groupEditConfig).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
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
            this.dialogFormVisible = false
          }
        })
      },
      confirm() {
        this.$refs.groupConfig.validate(valid => {
          if (valid) {
            if(this.groupConfig.type==='标准版'){
              this.groupConfig.url = '/cmdb/file_download/standard/' + this.groupConfig.package_name
            }else {
              this.groupConfig.url = '/cmdb/file_download/custom/' + this.groupConfig.package_name
            }
            addPackageInfo(this.groupConfig).then(response => {
              if (response.status === 'ok') {
                this.$message({
                  title: '成功',
                  message: response.message,
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$message({
                  title: '失败',
                  message: response.message,
                  type: 'warning',
                  duration: 2000
                })
              }
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
      getList() {
        this.listLoading = true
        fetchAllPackage(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate((valid) => {
          if (valid) {
            this.getList()
          }
        })
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      resetlistQuery() {
        this.listQuery = {
          page: 1,
          limit: 20,
          package_name: undefined,
          change_user: undefined,
          describe: undefined,
          type: undefined,
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.dialogSearchVisible = false
      },
      handleClose() {
        this.groupConfig = {
          describe: '',
          type: '',
          remark: ''
        }
        this.$refs.upload.clearFiles();
        this.f1=false
        this.f2=false
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

