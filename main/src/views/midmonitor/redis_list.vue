<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-col>
        <el-form-item>
          <el-select v-model="listQuery.status" placeholder="状态" filterable clearable  @change="handleFilter" style="width: 90px">
            <el-option v-for="(item,index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.availability" placeholder="启用|禁用" filterable clearable  @change="handleFilter" style="width: 110px">
            <el-option v-for="(item,index) in availability" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.cluster_cname" placeholder="集群名" filterable clearable  @change="handleFilter" >
            <el-option v-for="(item,index) in cluster_cnames" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="listQuery.ip_filter" placeholder="实例IP:PORT" clearable @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="listQuery.key_filter" placeholder="键名" clearable @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.mobile_filter" placeholder="联系人" filterable clearable  @change="handleFilter" >
            <el-option v-for="(item,index) in sms_list" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisibleAdd=true" v-if="adminrole">新增记录</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table class="eltabledata" v-loading="listLoading" :data="tableData" border stripe highlight-current-row>
      <el-table-column label="ID" prop="id" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <el-badge :value="null" :max="99" class="el-badge-item">
            <el-button v-if="scope.row.status==0" size="mini" type="success">正常</el-button>
            <el-button v-else-if="scope.row.status==1" size="mini" type="danger">异常</el-button>
            <el-button v-else size="mini" type="warning">不可用</el-button>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column label="集群名" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.cluster_cname == 'null'">{{ scope.row.cluster_name }}</span>
          <span v-if="scope.row.cluster_cname !== ''">{{ scope.row.cluster_cname }}</span>
          <span v-else>{{ scope.row.cluster_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实例" min-width="180">
        <template slot-scope="scope">
          <pre>{{ scope.row.ip + ':' + scope.row.port }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="键名" show-overflow-tooltip min-width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="队列长度" min-width="100">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.length }}</span> -->
          <span v-if="scope.row.logic==='gte' && scope.row.length>=scope.row.threshold" style="color: red">{{ scope.row.length }}</span>
          <span v-else-if="scope.row.logic==='lte' && scope.row.length<=scope.row.threshold" style="color: red">{{ scope.row.length }}</span>
          <span v-else>{{ scope.row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阈值" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.logic==='gte'">&gt;=</span>
          <span v-if="scope.row.logic==='lte'">&lt;=</span>
          <span>{{ scope.row.threshold }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="170">
        <template slot-scope="scope">
          <pre v-html="mobile2user(scope.row.sms_list)"></pre>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.availability===0">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="变更人" min-width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170px" align="center" v-if="adminrole">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.availability===1" type="success" icon="el-icon-check" circle @click="handleLen(scope.row.id)"></el-button>
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding-top: 5px;margin-top: 10px;"
      @pagination="getRowsInf"
    />

    <el-dialog title="新增记录" :visible.sync="dialogVisibleAdd" width="600px" @close="handleCloseDialogAdd" :close-on-click-modal="false">
      <el-form ref="addForm" :model="rowAdd" :rules="rules" label-width="100px">
        <el-form-item label="实例" prop="instance_fk" style="margin-bottom: 10px">
          <el-select
            v-model="rowAdd.instance_fk"
            filterable
            clearable
            reserve-keyword
            remote
            :remote-method="remoteMethod"
            placeholder="请输入一个实例,格式ip:port"
            popper-class="ins-search-class"
            no-data-text='实例未找到'
            loading-text="查询中请稍等"
            :loading="loading"
            style="width: 428px"
          >
            <el-option v-for="(item,index) in instance_list" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form ref="nestedForm" :model="item" v-for="(item, index) in rowAdd.keys" :key="index" label-width="50px">
          <div>
            <fieldset>
              <legend>{{ 'key' + index }}</legend>
              <el-row :gutter="15">
                <el-col :span="20">
                  <el-form-item label="键名" prop="key" :rules="{ required: true, message: '请输入键名', trigger: 'blur' }">
                    <el-input placeholder="请输入键名" v-model="item.key"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button v-if="index===0" type="primary" icon="el-icon-plus" @click="addKey"></el-button>
                  <el-button v-else type="primary" icon="el-icon-minus" @click.prevent="removeKey(item)"></el-button>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="10">
                  <el-form-item label="阈值" prop="logic">
                    <el-select v-model="item.logic" placeholder="请选择阈值逻辑关系">
                      <el-option v-for="(item,index) in logic" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                 </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="threshold" :rules="{required: true, message: '请输入>0的数字', trigger: 'blur' }" label-width="0px">
                    <!-- :rules="[{ required: true, message: '请输入>0的数字', trigger: 'blur' },{ type: 'number', message: '请输入>0的数字', min: 0, trigger: 'blur' }]" -->
                    <el-input v-model="item.threshold" placeholder="请输入阈值" type="number" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4"></el-col>
              </el-row>
            </fieldset>
          </div>
        </el-form>

        <el-form-item label="联系人" prop="sms_list">
          <el-select v-model="rowAdd.sms_list" multiple filterable clearable placeholder="请选择联系人" style="width: 428px">
            <el-option v-for="(item,index) in sms_list" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="availability" >
          <el-select v-model="rowAdd.availability" placeholder="请选择状态" style="width: 428px">
            <el-option v-for="(item,index) in availability" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model.trim="rowAdd.comment" type="text" auto-complete="off" style="width: 428px"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialogAdd">取 消</el-button>
        <el-button type="primary" @click="addRowInf('addForm', rowAdd)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改记录" :visible.sync="dialogVisibleEdit" width="600px" @close="handleCloseDialogEdit" :close-on-click-modal="false">
      <el-form ref="editForm" :model="rowEdit" :rules="rules" label-width="100px" style="padding-right: 30px;">
        <el-form-item v-if="false" label="ID" min-width="100"></el-form-item>
        <el-form-item label="实例" min-width="100" prop="instance">
          <el-select
            v-model="rowEdit.instance_fk"
            filterable
            clearable
            reserve-keyword
            remote
            :remote-method="remoteMethod"
            placeholder="请输入一个实例,格式ip:port"
            popper-class="ins-search-class"
            no-data-text='实例未找到'
            loading-text="查询中请稍等"
            :loading="loading"
            style="width: 428px"
          >
            <el-option v-for="(item,index) in instance_list" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="键名" min-width="100" prop="keys">
          <el-input v-model="rowEdit.key" placeholder="请输入键名"></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="阈值" prop="logic">
              <el-select v-model="rowEdit.logic" placeholder="请选择阈值逻辑关系">
                <el-option v-for="(item,index) in logic" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item prop="threshold" :rules="{required: true, message: '请输入>0的数字', trigger: 'blur' }" label-width="0px">
              <el-input v-model="rowEdit.threshold" placeholder="请输入阈值" type="number" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="联系人" prop="sms_list">
          <el-select v-model="rowEdit.sms_list" multiple filterable clearable placeholder="请选择联系人"  style="width: 428px">
            <el-option v-for="(item,index) in sms_list" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用|禁用" prop="availability">
          <el-select v-model="rowEdit.availability" style="width: 428px">
            <el-option v-for="item in availability" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" min-width="100" prop="comment">
          <el-input v-model.trim="rowEdit.comment" type="text" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="editRowInf('editForm', rowEdit)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="检测队列长度" :visible.sync="dialogVisibleUrl" width="600px" @close="handleCloseDialogUrl" :close-on-click-modal="false">
      <el-table v-loading="listLoading" :data="list_result" border stripe highlight-current-row>
        <el-table-column label="键名" prop="key" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实测长度" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="阈值" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.logic==='gte'">&gt;=</span>
            <span v-if="scope.row.logic==='lte'">&lt;=</span>
            <span>{{ scope.row.threshold }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检测异常" prop="key" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.exception }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结果" min-width="60">
          <template slot-scope="scope">
           <el-button v-if="scope.row.length > scope.row.threshold || scope.row.exception != ''" type="danger" icon="el-icon-error" circle></el-button>
           <el-button v-else type="success" icon="el-icon-check" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import resize from '@/components/Charts/mixins/resize'
import sessionListQuery from "@/components/mixins/sessionListQuery";

import { getRow, addRow, editRow, deleteRow, getSMSList, handleLength, getInstanceList, getClusterList } from '@/api/midmonitor/redis_list'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'RedisList',
  components: { Pagination },
  directives: { waves },
  mixins: [resize, sessionListQuery],

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        availability: undefined,
        cluster_cname: undefined,
        ip_filter: undefined,
        key_filter: undefined,
        mobile_filter: undefined
      },

      tableData: [],
      total: 0,

      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      dialogVisibleUrl: false,

      listLoading: false,

      adminrole: false,

      rowAdd: {
        keys: [{key: '', logic: 'gte', threshold: ''}],
        instance_fk: '',
        sms_list: '',
        change_user: this.name,
        availability: 0,
        comment: ''
      },

      rowEdit: {
        id: '',
        instance_fk: '',
        i_fk: '',
        key: '',
        logic: '',
        threshold: '',
        sms_list: '',
        change_user: '',
        availability: '',
        comment: '',
        cluster_name: '',
        cluster_cname: '',
      },

      sms_list: [],

      confirmOptions: {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      },

      rules: {
        instance_fk: [
          { required: true, message: '请输入实例,格式ip:port', trigger: 'blur' }
        ],
        comment: [
          { max: 512, message: '长度不能超过512个字符', trigger: 'blur'}
        ]
      },

      status: [{value: 0, label: '正常'}, {value: 1, label: '异常'}],

      list_result: [],

      instance_list: [],
      instances: [],
      loading: false,

      logic: [{value: 'gte', label: '>='}, {value: 'lte', label: '<='}],
      availability: [{value: 0, label: '启用'}, {value: 1, label: '禁用'}],
      cluster_cnames: [],
    }
  },

  created() {
    this.getRowsInf()

    getSMSList().then(response => {
      this.sms_list = response
    }).catch(error => {
      this.$message({ message: '调用后端接口getSMSList出错!'})
    })

    getInstanceList().then(response => {
      this.instances = response
    })

    getClusterList().then(response => {
      this.cluster_cnames = response
    })

    this.adminrole = this.roles.includes('redis_admin')
  },

  mounted() {
  },

  computed: {
    ...mapGetters(['roles', 'name'])
  },

  filters: {
    row2MultipleRow(data) {
      let res = ''
      if (data) {
        for (let item of data.split(',')) {
          res += item + '\n'
        }
      }
      return res
    }
  },

  methods: {
//过滤相关
    handleFilter() {
      this.listQuery.page = 1
      this.$refs['listQuery'].validate(valid => {
        if (valid) {
          this.getRowsInf()
        }
      })
    },

    handleReset() {
      this.resetlistQuery()
      this.getRowsInf()
    },

    getRowsInf() {
      this.listLoading = true
      getRow(this.listQuery).then(response => {
        this.tableData = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      }).catch(error => {
        this.$message({ message: '调用后端接口getRow出错!'})
        this.listLoading = false
      })
    },

    resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        status: undefined,
        availability: undefined,
        cluster_cname: undefined,
        ip_filter: undefined,
        key_filter: undefined,
        mobile_filter: undefined
      }
    },

    handleDelete(row) {
      var msg = '确认删除该记录吗？'
      this.$confirm(msg, '提示', this.confirmOptions).then(() => {
        deleteRow(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getRowsInf()
        }).catch(error => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 3000
          })
          // console.log(error)
        })
      })
    },

    handleEdit(row) {
      this.dialogVisibleEdit = true
      this.rowEdit.id = row.id
      this.rowEdit.instance_fk = row.ip+':'+row.port
      this.rowEdit.i_fk = row.instance_fk,
      this.rowEdit.key = row.key
      this.rowEdit.logic = row.logic
      this.rowEdit.threshold = row.threshold
      this.rowEdit.sms_list = row.sms_list.split(',')
      this.rowEdit.availability = row.availability
      this.rowEdit.comment = row.comment
      this.rowEdit.change_user = row.change_user
      // this.rowEdit.cluster_name = row.cluster_name
      // this.rowEdit.cluster_cname = row.cluster_cname
    },

    addRowInf(formName, rowAdd) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let rowInsertAdd = {
            keys: '',
            instance_fk: '',
            sms_list: '',
            change_user: this.name,
            availability: 0,
            comment: ''
          }
          for (let item of rowAdd.keys) {
            item.threshold = Number(item.threshold)
          }

          rowInsertAdd.keys = rowAdd.keys
          rowInsertAdd.instance_fk = rowAdd.instance_fk
          rowInsertAdd.sms_list = String(rowAdd.sms_list)
          rowInsertAdd.availability = Number(rowAdd.availability)
          rowInsertAdd.comment = rowAdd.comment
          addRow(rowInsertAdd).then(response => {
            this.$notify({
              title: '成功',
              message: '添加记录成功',
              type: 'success',
              duration: 3000
            })
            this.dialogVisibleAdd = false
            this.getRowsInf()
          }).catch(error => {
            this.dialogVisibleAdd = false
            if (error.response.data) {
              this.$notify({
                title: '添加失败',
                message: '该记录已存在',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.$refs[formName].resetFields()
        }
      })
    },

    editRowInf(formName, rowEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let rowEditNew = {
            id: '',
            instance_fk: '',
            i_fk: '',
            key: '',
            logic: '',
            threshold: '',
            sms_list: '',
            change_user: this.name,
            availability: '',
            comment: '',
            // cluster_name: '',
            // cluster_cname: ''
          }
          rowEditNew.id = rowEdit.id
          rowEditNew.instance_fk = rowEdit.i_fk
          rowEditNew.key = rowEdit.key
          rowEditNew.logic = rowEdit.logic
          rowEditNew.threshold = Number(rowEdit.threshold)
          rowEditNew.sms_list = String(rowEdit.sms_list)
          rowEditNew.availability = Number(rowEdit.availability)
          rowEditNew.comment = rowEdit.comment
          // rowEditNew.cluster_name = rowEdit.cluster_name
          // rowEditNew.cluster_cname = rowEdit.cluster_cname
          editRow(rowEditNew.id, rowEditNew).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 3000
            })
            this.getRowsInf()
          }).catch(error => {
            if (error.response.data) {
              this.$notify({
                title: '修改失败',
                message: '该记录修改失败',
                type: 'error',
                duration: 3000
              })
            }
          })
          this.dialogVisibleEdit = false
        }
      })
    },
    handleCloseDialogAdd() {
      this.dialogVisibleAdd = false
      this.$refs['addForm'].resetFields()
      // this.rowAdd.keys = [{key: '', logic: 'gte', threshold: ''}]
      this.rowAdd = {
        keys: [{key: '', logic: 'gte', threshold: ''}],
        instance_fk: '',
        sms_list: '',
        change_user: this.name,
        availability: 0,
        comment: ''
      }
    },
    handleCloseDialogEdit() {
      this.dialogVisibleEdit = false
      this.$refs['editForm'].resetFields()
    },
    handleCloseDialogUrl() {
      this.dialogVisibleUrl = false
    },

    handleLen(id) {
      let sid = id
      handleLength(sid).then(response => {
        this.list_result = response
        this.dialogVisibleUrl = true
      })
    },

    handleSelect(item) {
      // console.log(item);
    },

    mobile2user(mobiles) {
      let users = ''
      if (mobiles) {
        for (let item of mobiles.split(',')) {
          // let user = ''
          for (let i of this.sms_list) {
            if (item === i.value) {
              // users.push(i.label)
              // user = i.label + '\n'
              users += i.label + '\n'
            }
          }
        }
      }
      return users
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.instance_list = this.instances.filter(item => {
            return item.label.indexOf(query) > -1;
          });
        }, 200);
      } else {
        this.instance_list = [];
      }
    },

    removeKey(item) {
      var index = this.rowAdd.keys.indexOf(item)
      if (index !== -1) {
        this.rowAdd.keys.splice(index, 1)
      }
    },
    addKey() {
      this.rowAdd.keys.push({key: '', threshold: '', logic: 'gte'});
    }

  }
}
</script>

<style lang="scss" scoped>
// .eltabledata .cell {
//   white-space: pre-line;
// }
  .pre {
    font-size: 14px;
    font-family: "微软雅黑";
  }

  .ins-search-class {
      max-width: 500px;
    }

  fieldset {
    margin: 0 32px 10px 100px;
    // padding: 10px;
    border-color: #DCDFE6;
    border-style: solid;
    border-width: 2px;
    border-radius: 8px;
    line-height: 20px;
    list-style: none;
  }
</style>
