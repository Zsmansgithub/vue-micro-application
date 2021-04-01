<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-input v-model="listQuery.name" placeholder="进程名" clearable @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="host">
          <el-input v-model="listQuery.host" placeholder="主机名" clearable @input="handleFilter" class="filter-item"/>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="success" plain icon="el-icon-video-play" :disabled="disable1"
                   @click="handleBatchStart">批量启动
        </el-button>
        <el-button class="filter-item" type="danger" plain icon="el-icon-video-pause" :disabled="disable1"
                   @click="handleBatchStop">批量停止
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTableAll"
      :data="tableList"
      border
      stripe
      highlight-current-row
      class="roottable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column type="index" width="40" label="#" align="center"></el-table-column>
      <el-table-column label="进程名" width="210">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进程号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.process_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status===0">启动</el-tag>
          <el-tag type="danger" v-else>停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进程别名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维护人" align="center">
        <template slot-scope="scope">
          <div><span v-for="(site,index) in scope.row.m_user_name" :key="index">{{ site }} </span></div>
          <!--          <span>{{ scope.row.m_user }}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="update_time" sortable>
        <template slot-scope="scope">
          <span v-if="(Math.round(new Date()/1000))-scope.row.update_time>5*60" style="color:#FF4949;">{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" v-if="adminrole" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleBatchEdit(scope.row);">
            <svg-icon icon-class="edit1" style="width: 16px; height:16px;color:#1890FF;"/>
          </el-button>
          <el-button type="text" @click="handleBatchDelete(scope.row);">
            <svg-icon icon-class="delete1" style="width: 14px; height:16px;color:#FF4949;"/>
          </el-button>
          <el-button type="text" @click="handleStop(scope.row);">
            <svg-icon icon-class="suspend1" style="width: 16px; height:16px;color:#FFBA00;"/>
          </el-button>
          <el-button type="text" @click="handleStart(scope.row);">
            <svg-icon icon-class="play1" style="width: 16px; height:16px;color:#42B983;"/>
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
      @pagination="getList"
    />

    <el-dialog title="修改进程相关信息" :visible.sync="dialogEditAppVisible" width="20%">
      <el-form ref="editAppForm" :model="editAppForm" class="editAppForm" :rules="rules" label-width="110px">
        <el-form-item label="进程别名" prop="cname">
          <el-input v-model="editAppForm.cname" type="text" auto-complete="off"/>
        </el-form-item>
        <!--        <el-form-item label="维护人" prop="m_user">-->
        <!--          <el-input v-model="editAppForm.m_user" type="text" auto-complete="off"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="维护人" prop="m_user">
          <el-select
            v-model="editAppForm.m_user"
            filterable
            multiple
            :multiple-limit="5"
            clearable
            placeholder="请输入工号/姓名"
            style="width: 100%;"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="'('+item.value+')'+item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editAppForm.status" filterable clearable style="width: 100%">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditAppVisible=false">取消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {format1024} from '@/utils/format-function'
  import {fetchProcess, editProcess, deleteProcess, startProcess} from '@/api/process/process_monitor'
  import Pagination from '@/components/Pagination'
  import {mapGetters} from 'vuex'
  import {getUserInfo} from '@/api/zabbix/user_info'

  export default {
    name: 'RedisClusterConfig',
    components: {Pagination},
    directives: {waves},
    mixins: [resize, sessionListQuery],
    data() {
      return {
        status: [{value: 0, label: '启动'}, {value: 1, label: '停止'}],
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          host: undefined
        },
        dialogEditAppVisible: false,
        listLoading: false,
        adminrole: false,
        disable1: true,
        tableList: [],
        total: 0,
        userOptions: [],
        editAppForm: {
          name: '',
          cname: '',
          host: '',
          m_user: '',
          update_time: '',
          process_id: '',
          status: ''
        },
        confirmOptions: {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'el-button--danger',
          type: 'warning'
        },
        rules: {
          m_user: [
            {required: true, message: '请输入维护人', trigger: 'blur'}
          ]
        },
        multipleSelection: []
      }
    },

    created() {
      this.getList()
      this.adminrole = this.roles.includes('s_admin')
      getUserInfo().then(response => {
        this.userOptions = response
      });
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (this.multipleSelection.length > 0) {
          this.disable1 = false
        } else {
          this.disable1 = true
        }
      },
      handleFilter() {
        this.listQuery.page = 1
        this.$refs['listQuery'].validate(valid => {
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
          name: undefined,
          host: undefined
        }
      },
      getList() {
        this.listLoading = true
        fetchProcess(this.listQuery).then(response => {
          this.tableList = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleBatchEdit(row) {
        this.dialogEditAppVisible = true
        this.editAppForm.name = row.name
        this.editAppForm.status = row.status
        // this.editAppForm.m_user = row.m_user
        this.editAppForm.m_user = row.m_user? (row.m_user).split(','):''
        this.editAppForm.cname = row.cname
        this.editAppForm.host = row.host
        this.editAppForm.update_time = row.update_time
        this.editAppForm.process_id = row.process_id
      },
      submit() {
        this.$refs.editAppForm.validate(valid => {
          if (valid) {
            this.editAppForm.update_time = Math.round(new Date() / 1000)
            this.editAppForm.m_user = (this.editAppForm.m_user).join(',')
            editProcess(this.editAppForm.name, this.editAppForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          } else {
            this.$message({
              message: '请填写必填项',
              type: 'warning'
            })
            return false
          }
          this.dialogEditAppVisible = false
        })
      },
      handleBatchDelete(row) {
        let msg = '确定删除该进程监控信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteProcess(row.name).then(response => {
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
      handleStart(row) {
        let msg = '确定要启动该进程吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          startProcess({'name': row.name, 'status': 'start'}).then(response => {
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
                type: 'error',
                duration: 3000
              })
            }
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleStop(row) {
        let msg = '确定要停止该进程吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          startProcess({'name': row.name, 'status': 'stop'}).then(response => {
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
                type: 'error',
                duration: 3000
              })
            }
            this.getList()
          })
        }, () => {
          return false
        })
      },
      handleBatchStart() {
        if (this.multipleSelection) {
          let msg = '确定要批量启动该' + this.multipleSelection.length + '条进程吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            for (const i of this.multipleSelection) {
              const temp = {}
              temp.name = i.name
              temp.status = 'start'
              startProcess(temp).then(response => {
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
                    type: 'error',
                    duration: 3000
                  })
                }
                this.getList()
              })
            }
          }, () => {
            return false
          })
        }
      },
      handleBatchStop() {
        if (this.multipleSelection) {
          let msg = '确定要批量停止该' + this.multipleSelection.length + '条进程吗?'
          this.$confirm(msg, '提示', this.confirmOptions).then(() => {
            for (const i of this.multipleSelection) {
              const temp = {}
              temp.name = i.name
              temp.status = 'stop'
              startProcess(temp).then(response => {
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
                    type: 'error',
                    duration: 3000
                  })
                }
                this.getList()
              })
            }
          }, () => {
            return false
          })
        }
      }
    }

  }
</script>

<style>

</style>
