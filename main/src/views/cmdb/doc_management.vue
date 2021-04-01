<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item>
          <el-select v-model="listQuery.package_name" style="width: 100%" placeholder="文件名" @change="handleFilter"
            filterable clearable>
            <el-option v-for="item in fnameOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.change_user" style="width: 100%" placeholder="上传用户" @change="handleFilter"
            filterable clearable>
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" placeholder="模糊搜索" @keyup.enter.native="handleFilter" clearable
            style="width:180px;"></el-input>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
          @click="handleReset">重置
        </el-button>
        <el-button v-if="adminrole" class="filter-item" type="primary" @click="addFile" icon="el-icon-plus">新增
        </el-button>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件标题" min-width="300" prop="package_name" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.package_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="80" :formatter="formatter">
      </el-table-column>
      <el-table-column label="所属部门" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user_department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入者" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="备注/更新时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
          <div style="color: #8492a6; font-size: 10px">{{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="预览操作" width="180"> -->
      <!-- <template slot-scope="scope"> -->
      <!-- <el-button type="text"> -->
      <!-- <a :href=scope.row.url>下载</a> -->
      <!-- <a :href="scope.row.url" :download="scope.row.package_name">下载</a> -->
      <!-- <a @click="downLoad(scope.row.package_name)">下载</a> -->
      <!-- </el-button> -->
      <!-- <el-button class="btn" type="text" @click="handleClicks(scope.row.url)">复制路径</el-button> -->
      <!-- </template> -->
      <!-- </el-table-column> -->
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" circle @click="showFile(scope.row)"></el-button>
          <el-button v-if="adminrole" type="primary" circle @click="handleBatchEdit(scope.row);" icon="el-icon-edit">
          </el-button>
          <el-button v-if="adminrole" type="danger" circle @click="handleBatchDelete(scope.row);" icon="el-icon-delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />

    <el-dialog title="添加记录" :visible.sync="dialogSearchVisible" style="text-align: left;" width="40%"
      @close="handleAddClose">
      <el-form ref="groupConfig" :model="groupConfig" :rules="rules" label-width="80px"
        style="margin-right: 20px;margin-left: 20px">
        <!-- <el-form-item label="描述" prop="describe">
          <el-input v-model="groupConfig.describe" style="width: 100%" type="textarea"></el-input>
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="groupConfig.remark" style="width: 100%" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="文档上传">
          <el-upload ref="addUpload" class="upload-demo" :file-list="groupConfig.fileList"
            action="/dev-api/cmdb/doc_upload/" :on-success="handleChange" :on-error="handleError">
            <el-button size="small" type="primary">文档上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetAddForm('groupConfig')">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改记录" :visible.sync="dialogFormVisible" style="text-align: left;" width="40%"
      @close="handleEditClose">
      <el-form ref="groupEditConfig" :model="groupEditConfig" :rules="rules" label-width="80px"
        style="margin-right: 20px;margin-left: 20px">
        <!-- <el-form-item label="描述" prop="describe">
          <el-input v-model="groupEditConfig.describe" style="width: 100%" type="textarea"></el-input>
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="groupEditConfig.remark" style="width: 100%" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload ref="editUpload" class="upload-demo" :file-list="groupEditConfig.fileList"
            action="/dev-api/cmdb/doc_upload/" :on-success="handleEdit" :on-error="handleError">
            <el-button size="small" type="primary">文档上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="resetEditForm('groupEditConfig')">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="previewFileName" :visible.sync="dialogFileVisible" width="80%" top="7.5vh" @close="closeFile">
      <div v-show="is_loading" class="loading-file" v-loading="is_loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
      </div>
      <iframe ref="iframe" v-show="!is_loading" class="iframe-file"></iframe>

      <div slot="footer" class="dialog-footer" style="margin-right: 30px">
        <el-button @click="closeFile">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import { mapGetters } from 'vuex'
  import { addPackageInfo, deletePackageInfo, editPackageInfo, fetchAllPackage, fetchDocOptions, docDownload } from '@/api/cmdbs/doc_management'
  import Clipboard from 'clipboard'
  import { Message } from 'element-ui';
  import { Base64 } from 'js-base64'

  export default {
    name: 'DocManagement',
    components: { Pagination },
    mixins: [resize, sessionListQuery],
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          package_name: undefined,
          change_user: undefined,
          search: undefined,
        },
        userOptions: '',
        fnameOptions: '',

        groupConfig: {
          package_name: '',
          describe: '',
          size: '',
          url: '',
          type: '文档管理',
          remark: '',
          change_user: this.name,
          fileList: []
        },
        groupEditConfig: {
          id: '',
          package_name: '',
          describe: '',
          size: '',
          url: '',
          type: '文档管理',
          remark: '',
          change_user: this.name,
          fileList: []
        },

        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },

        list: null,
        total: 0,
        listLoading: false,
        dialogFormVisible: false,
        dialogSearchVisible: false,
        dialogFileVisible: false,
        previewFileName: null,
        wordSrc: null,

        file_name: '',
        size: '',

        adminrole: false,

        rules: {
          type: [{ required: true, message: '请选择版本', trigger: 'blur' }],
        },

        is_loading: true,

      }
    },

    created() {
      this.getList()

      this.adminrole = this.roles.includes('public_doc')

      fetchDocOptions().then(response => {
        this.userOptions = response.user_options
        this.fnameOptions = response.fname_options
      })

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
      ...mapGetters(['roles', 'name']),
    },

    methods: {
      showFile(row) {
        this.previewFileName = row.package_name;

        let env = 'http://xc.yto.net.cn'
        let url = `${env}${row.url}?fullfilename=${row.package_name}`

        this.$nextTick(() => {
          const iframe = this.$refs.iframe;
          iframe.onload = (e) => {
            this.is_loading = false
          }
          iframe.onerror = (e) => {
            this.$message.error('加载失败')
            this.is_loading = false
          }
          iframe.src = `http://xc.yto.net.cn/onlinepreview/onlinePreview?url=${encodeURIComponent(url)}`
        })
        this.dialogFileVisible = true;
      },
      closeFile() {
        this.previewFileName = null;
        this.wordSrc = null;
        this.dialogFileVisible = false;
        this.is_loading = true;
      },
      handleError(err, file, fileList) {
        this.$message({
          title: '失败',
          message: '上传包不能超过1GB',
          type: 'error',
          duration: 2000
        })
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
        } else if (1024 <= row.size && row.size < 1048576) {
          return (row.size / 1024).toFixed(1) + 'MB'
        } else {
          return (row.size / 1048576).toFixed(1) + 'G'
        }
      },

      handleChange(response, file, fileList) {
        // const res = response.file_alias.split('/')
        this.groupConfig.package_name = response.file_name
        this.groupConfig.size = Math.floor((file.size) * 0.0009766)
      },

      handleBatchDelete(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deletePackageInfo(row.id).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功 !',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: '错误',
              message: '删除失败 !'
            });
          })
        })
      },

      handleEdit(response, file, fileList) {
        this.file_name = response.file_name
        this.size = Math.floor((file.size) * 0.0009766)
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
            if (this.file_name && this.size) {
              this.groupEditConfig.package_name = this.file_name
              this.groupEditConfig.size = this.size
            }
            this.groupEditConfig.url = '/cmdb/doc_download/' + this.groupEditConfig.package_name
            editPackageInfo(this.groupEditConfig.id, this.groupEditConfig).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功 !',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.file_name = ''
              this.size = ''
            }).catch(response => {
              this.$notify.error({
                title: '错误',
                message: '修改失败 !'
              });
            })
            this.dialogFormVisible = false
          }
        })
      },

      confirm() {
        this.$refs.groupConfig.validate(valid => {
          if (valid) {
            this.groupConfig.url = '/cmdb/doc_download/' + this.groupConfig.package_name
            addPackageInfo(this.groupConfig).then(response => {
              this.$notify({
                title: '成功',
                message: '上传成功 !',
                type: 'success'
              });
              this.getList()
            }).catch(response => {
              this.$notify.error({
                title: '错误',
                message: '上传失败 !'
              });
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
          search: undefined,
        }
      },

      resetAddForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogSearchVisible = false
      },
      resetEditForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
      },

      handleAddClose() {
        this.groupConfig = {
          package_name: '',
          describe: '',
          size: '',
          url: '',
          type: '文档管理',
          remark: '',
          change_user: this.name,
          fileList: [],
        }
        this.dialogSearchVisible = false

      },
      handleEditClose() {
        this.groupEditConfig = {
          id: '',
          package_name: '',
          describe: '',
          size: '',
          url: '',
          type: '文档管理',
          remark: '',
          change_user: this.name
        }
        this.dialogFormVisible = false

      },

      downLoad(file_name) {
        docDownload(file_name).then(response => {
          let url = window.URL.createObjectURL(new Blob([response]));
          let link = document.createElement("a");
          let fileName = file_name;
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
          this.$message({
            message: "下载成功",
            type: "success"
          })
        }).catch(err => {
          this.$message({
            message: "下载失败",
            type: "error"
          })
        })
      },

      addFile() {
        this.dialogSearchVisible = true
        this.groupConfig = {
          package_name: '',
          describe: '',
          size: '',
          url: '',
          type: '文档管理',
          remark: '',
          change_user: this.name,
          fileList: [],
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

  .loading-file {
    width: 100%;
    min-height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
  }

  .iframe-file {
    width: 100%;
    min-height: 600px;
  }
</style>