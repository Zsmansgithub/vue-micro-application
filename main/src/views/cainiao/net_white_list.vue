<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item>
        <el-cascader expand-trigger="hover"
                     :options="projectOptions"
                     v-model="listQuery.app_name_s"
                     filterable
                     @change="handleFilter"
                     clearable
                     :filter-method="filterMethod"
                     style="width:100%;"
                     placeholder="请选择产品线及应用名">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.product_manager" @change="handleFilter" placeholder="产品经理" filterable clearable>
          <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.apply_user" @change="handleFilter" placeholder="申请人" filterable clearable>
          <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.manager" @change="handleFilter" placeholder="负责人" filterable clearable>
          <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model.trim="listQuery.department" @change="handleFilter" style="width: 100%" filterable clearable
                   placeholder="申请部门">
          <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.name" clearable @input="handleFilter" placeholder="模糊查询"></el-input>
      </el-form-item>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                 @click="handleReset">重置
      </el-button>
      <el-button class="filter-item" plain type="primary" @click="dialogAdd=true" icon="el-icon-plus">
        新增记录
      </el-button>
      <!--      <el-button class="filter-item" v-if="adminrole" :disabled="f1" plain type="success" @click="dialogBatch=true" icon="el-icon-edit">批量修改</el-button>-->
    </el-form>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <!--      <el-table-column label="ID" align="center" width="60">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.id }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="应用名">
        <template slot-scope="scope">
          <span>{{ scope.row.app_new_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="源地址" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <pre class="pre_class">{{ scope.row.resource_address |  row2MultipleRow}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="目的地址" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <pre class="pre_class">{{ scope.row.dest_address |  row2MultipleRow}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="客户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.customer}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.cus_email}}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品经理">
        <template slot-scope="scope">
          <span>{{ scope.row.cname_product}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请部门">
        <template slot-scope="scope">
          <span>{{ scope.row.cname_department}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人">
        <template slot-scope="scope">
          <span>{{ scope.row.cname_apply_user}}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.cname_manager}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center" fixed="right">
        <template slot-scope="props">
          <el-button icon="el-icon-edit" plain type="primary" circle @click="editFormCommon(props.row)"/>
          <el-button icon="el-icon-delete" plain type="danger" v-if="adminrole" circle @click="deleteFormCommon(props.row)"/>
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

    <el-dialog title="新增记录" :visible.sync="dialogAdd" @close="handleClose" width="65%">
      <el-form ref="addForm" :model="addForm" :rules="rules" class="editAppForm" label-width="110px"
               style="width:100%;padding-right: 60px">
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="应用名" prop="app_name">
              <el-cascader expand-trigger="hover"
                           :options="projectOptions"
                           v-model="addForm.app_name"
                           filterable
                           clearable
                           :filter-method="filterMethod"
                           style="width:100%;"
                           placeholder="请选择产品线及应用名">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="产品经理" prop="product_manager">
              <el-select v-model="addForm.product_manager" placeholder="产品经理" filterable clearable style="width:100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请部门" prop="department">
              <el-select v-model.trim="addForm.department" style="width: 100%" filterable clearable placeholder="申请部门">
                <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请人" prop="apply_user">
              <el-select v-model="addForm.apply_user" placeholder="申请人" filterable clearable style="width:100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="负责人" prop="manager">
              <el-select v-model="addForm.manager" placeholder="负责人" filterable multiple :multiple-limit="3" clearable style="width:100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="客户名称" prop="customer">
              <el-input v-model="addForm.customer" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="客户联系方式" prop="cus_email">
              <el-input v-model="addForm.cus_email" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="源地址">
              <el-input v-model="addForm.resource_address" type="textarea" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="目的地址">
              <el-input v-model="addForm.dest_address" type="textarea" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="备注">
              <el-input v-model="addForm.comment" type="textarea" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogEdit" width="65%">
      <el-form ref="editForm" :model="editForm" :rules="rules" class="editAppForm" label-width="110px"
               style="width:100%;padding-right: 60px">
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="应用名" prop="app_name">
              <el-cascader expand-trigger="hover"
                           :options="projectOptions"
                           v-model="editForm.app_name"
                           filterable
                           clearable
                           :filter-method="filterMethod"
                           style="width:100%;"
                           placeholder="请选择产品线及应用名">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="产品经理" prop="product_manager">
              <el-select v-model="editForm.product_manager" placeholder="产品经理" filterable clearable style="width:100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请部门" prop="department">
              <el-select v-model.trim="editForm.department" style="width: 100%" filterable clearable placeholder="申请部门">
            <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="申请人" prop="apply_user">
              <el-select v-model="editForm.apply_user" placeholder="申请人" filterable clearable style="width:100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="负责人" prop="manager">
              <el-select v-model="editForm.manager" placeholder="负责人" filterable multiple :multiple-limit="3" clearable style="width:100%">
                <el-option v-for="item in userInfoOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="客户名称" prop="customer">
              <el-input v-model="editForm.customer" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="客户联系方式" prop="cus_email">
              <el-input v-model="editForm.cus_email" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="源地址">
              <el-input v-model="editForm.resource_address" type="textarea" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="目的地址">
              <el-input v-model="editForm.dest_address" type="textarea" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="8" :xl="8">
            <el-form-item label="备注">
              <el-input v-model="editForm.comment" type="textarea" :rows="3" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="confirmForm('editForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addNetWhite, deleteNetWhite, editNetWhite, fetchNetWhite} from '@/api/cainiao/net_white_list'
  import {getProductAppCascader} from '@/api/cmdbs/product_line'
  import {getdepartmentInfo2, getUserInfo} from '@/api/zabbix/user_info'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'

  export default {
    name: "net_white_list",
    mixins: [resize, sessionListQuery],
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          app_name_s: undefined,
          manager: undefined,
          apply_user: undefined,
          department: undefined,
          product_manager: undefined,
        },
        addForm: {
          app_name: [],
          domain: '',
          department: '',
          apply_user: '',
          manager: [],
          resource_address: '',
          dest_address: '',
          customer: '',
          cus_email: '',
          product_manager: '',
          change_user: '',
          comment: ''
        },
        editForm: {
          id: '',
          app_name: [],
          domain: '',
          department: '',
          apply_user: '',
          manager: [],
          resource_address: '',
          dest_address: '',
          customer: '',
          cus_email: '',
          product_manager: '',
          change_user: '',
          comment: ''
        },
        list: null,
        total: 0,
        listLoading: true,
        dialogAdd: false,
        dialogEdit: false,
        dialogBatch: false,
        adminrole: '',
        projectOptions:[],
        userInfoOptions:[],
        departmentOptions:[],
        rules: {
          app_name: [{message: '请填写应用名', required: true, trigger: 'blur'}],
          domain: [{message: '请填写域名', required: true, trigger: 'blur'}],
          department: [{message: '请填写部门', required: true, trigger: 'blur'}],
          apply_user: [{message: '请填写申请人', required: true, trigger: 'blur'}],
          manager: [{message: '请填写负责人', required: true, trigger: 'blur'}],
          customer: [{message: '请填写客户名称', required: true, trigger: 'blur'}],
          cus_email: [{message: '请填写客户联系方式', required: true, trigger: 'blur'}],
          product_manager: [{message: '请填写产品经理', required: true, trigger: 'blur'}],
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
      this.getList()
      this.adminrole = this.roles.includes('net_product')
      getProductAppCascader().then(response => {
        this.projectOptions = response;
      })
      getUserInfo().then(response => {
      this.userInfoOptions = response
    })
      getdepartmentInfo2().then(res=>{
        this.departmentOptions=res
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
      ...mapGetters(['roles', 'name'])
    },
    methods: {
      filterMethod(node, keyword){
        keyword = keyword.toLowerCase() // 搜索关键字转为小写
        const { text, path } = node;
        // return text.includes(keyword) || path.includes(keyword);
        return text.toLowerCase().includes(keyword)
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let tmp = [...this.multipleSelection]
            for (const i of tmp) {
              i.product_line = this.batchForm.product_line
              editNetProduct(i.id, i).then(res => {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              }).catch(error => {
                this.$message({
                  message: error
                })
              })
            }
            this.dialogBatch = false
          } else {
            return false;
          }
        });
      },
      deleteFormCommon(row) {
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteNetWhite(row.id).then(response => {
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
      confirmForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editForm.change_user = this.name
            this.editForm.app_name = JSON.stringify(this.editForm.app_name)
            this.editForm.manager = JSON.stringify(this.editForm.manager)
            editNetWhite(this.editForm.id, this.editForm).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(error => {
              this.$message({
                message: error
              })
            })
            this.dialogEdit = false
          } else {
            return false;
          }
        });
      },
      editFormCommon(row) {
        this.dialogEdit = true
        this.editForm.id = row.id
        this.editForm.domain = row.domain
        this.editForm.department = row.department
        this.editForm.app_name = JSON.parse(row.app_name)
        this.editForm.apply_user = row.apply_user
        this.editForm.dest_address = row.dest_address
        this.editForm.resource_address = row.resource_address
        this.editForm.comment = row.comment
        this.editForm.product_manager = row.product_manager
        this.editForm.manager = JSON.parse(row.manager)
        this.editForm.cus_email = row.cus_email
        this.editForm.customer = row.customer
        this.editForm.change_user = row.change_user
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addForm.change_user = this.name
            this.addForm.app_name = JSON.stringify(this.addForm.app_name)
            this.addForm.manager = JSON.stringify(this.addForm.manager)
            addNetWhite(this.addForm).then(res => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(error => {
              this.$message({
                message: error
              })
            })
            this.dialogAdd = false
          } else {
            return false;
          }
        });
      },
      handleFilter() {
        this.getList()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogAdd = false
        this.dialogEdit = false
        this.dialogBatch = false
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
          app_name_s: undefined,
          manager: undefined,
          apply_user: undefined,
          department: undefined,
          product_manager: undefined,
        }
      },
      getList() {
        this.listLoading = true
        this.listQuery.app_name=JSON.stringify(this.listQuery.app_name_s)
        fetchNetWhite(this.listQuery).then(response => {
          this.list = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleClose() {
        this.dialogEdit = false
        this.dialogAdd = false
        this.addForm = {
          app_name: [],
          domain: '',
          department: '',
          apply_user: '',
          manager: [],
          resource_address: '',
          dest_address: '',
          customer: '',
          cus_email: '',
          product_manager: '',
          comment: ''
        }
      },
    }
  }
</script>

<style scoped>
  .pre_class {
    font-size: 14px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }
</style>
