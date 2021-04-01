<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery5" :model="listQuery5" :inline="true">
        <el-form-item>
          <el-input v-model.trim="listQuery5.name" placeholder="请输入查询条件" class="filter-item" @input="handleFilter"
                    clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery5.line" placeholder="出口链路" filterable clearable @change="handleFilter">
            <el-option v-for="item in lineOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" v-if="adminrole" style="margin-left: 10px;" type="primary" plain icon="el-icon-plus"
                   @click="dialogAddVisible=true">新增
        </el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%">
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址段">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出口链路">
        <template slot-scope="scope">
          <span>{{ scope.row.line }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新用户">
        <template slot-scope="scope">
          <span>{{ scope.row.operate_user}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息">
        <template slot-scope="scope">
          <span>{{ scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="135" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" v-if="adminrole">
        <template slot-scope="scope">
          <el-button type="primary" plain circle icon="el-icon-edit" @click="editLine(scope.row)"></el-button>
          <el-button type="danger" plain circle icon="el-icon-delete" @click="deleteLine(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery5.page"
      :limit.sync="listQuery5.limit"
      :page-sizes="[20,50,100,200,500]"
      @pagination="getList"
      style="padding-top: 5px;margin-top: 10px;"
    />
    <el-dialog :visible.sync="dialogAddVisible" @close="handleClose" width="800px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">新增记录</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="addForm" :model="addForm" class="addForm" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-form-item label="IP地址段" prop="address">
              <el-input v-model="addForm.address" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="出口链路">
              <el-select v-model="addForm.line" filterable style="width: 100%">
                <el-option v-for="item in lineOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-form-item label="备注信息">
              <el-input v-model="addForm.description" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditVisible" @close="handleClose" width="800px">
      <div slot="title" style="font-size:16px;color:#1890FF;padding-top:1px;">修改记录</div>
      <hr style="position:absolute;left:0px;width:100%;top:51px;border:0;border-bottom:1px solid #E6EBEF;"/>
      <el-form ref="editForm" :model="editForm" class="editForm" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-form-item label="IP地址段" prop="address">
              <el-input v-model="editForm.address" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="出口链路">
              <el-select v-model="editForm.line" filterable style="width: 100%">
                <el-option v-for="item in lineOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-form-item label="备注信息">
              <el-input v-model="editForm.description" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-28px;margin-bottom:-10px;">
        <hr style="position:absolute;left:0px;width:100%;bottom:52px;border:0;border-bottom:1px solid #E6EBEF;"/>
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getLineIpBind,addLineIpBind,editLineIpBind,deleteLineIpBind,getOutLine} from '@/api/cainiao/ltm'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionLtmBasic from "@/components/mixins/sessionLtmBasic";
  import {mapGetters} from 'vuex'

  export default {
    name: "line_ip_bind",
    mixins: [resize, sessionLtmBasic],
    components: {
      Pagination,
    },
    directives: {
      waves,
    },
    data() {
      return {
        listQuery5: {
          page: 1,
          limit: 20,
          operate_obj: undefined,
          opr_time_s: undefined,
        },
        addForm:{
          name:'',
          address: '',
          description: '',
          line: '',
          operate_user: '',
          updatetime: ''
        },
        editForm:{
          id:'',
          name:'',
          address: '',
          description: '',
          line: '',
          operate_user: '',
          updatetime: ''
        },
        list: null,
        total: 0,
        listLoading: true,
        dialogAddVisible: false,
        dialogEditVisible: false,
        adminrole: false,
        lineOptions:[],
        rules: {
          name: [{required:'true',message:'请填写名称',trigger:'blur'}],
          address: [{required:'true',message:'请填写ip地址段',trigger:'blur'}]
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
      this.adminrole=this.roles.includes('line_ip_bind')
      getOutLine().then(res=>{
        this.lineOptions=res
      })
    },
    computed: {
      ...mapGetters(['roles']),
    },
    methods: {
      deleteLine(row) {
        const msg = '确定要删除该条信息吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteLineIpBind(row.id).then(res => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(error => {
            this.$message({
              message: error
            })
          })
        })
      },
      edit(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid) {
            this.editForm.updatetime=Math.round(new Date()/1000)
            editLineIpBind(this.editForm.id,this.editForm).then(res=>{
              if (res.status==='ok') {
                this.$notify({
                title:'成功',
                message:'修改成功',
                type:'success',
                duration:2000
              })
              this.getList()
              }else {
                this.$message({
                title:'失败',
                message:res.message,
                type:'error',
                duration:2000
              })
                this.getList()
              }
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
            this.dialogEditVisible=false
          }
        })
      },
      editLine(row){
        this.dialogEditVisible=true
        this.editForm.id=row.id
        this.editForm.name=row.name
        this.editForm.address=row.address
        this.editForm.operate_user=row.operate_user
        this.editForm.description=row.description
        this.editForm.line=row.line
        this.editForm.updatetime=row.updatetime
      },
      add(formName){
        this.$refs[formName].validate((valid)=>{
          if (valid) {
            this.addForm.updatetime=Math.round(new Date()/1000)
            addLineIpBind(this.addForm).then(res=>{
              if (res.status==='ok') {
                this.$notify({
                title:'成功',
                message:'添加成功',
                type:'success',
                duration:2000
              })
              this.getList()
              }else {
                this.$message({
                title:'失败',
                message:res.message,
                type:'error',
                duration:2000
              })
              this.getList()
              }
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
            this.dialogAddVisible=false
          }
        })
      },
      handleReset() {
        this.resetlistQuery()
        this.getList()
      },
      getList() {
        this.listLoading = true
        // if (this.listQuery5.opr_time_s) {
        //   this.listQuery5.rtime = Math.floor(this.listQuery5.opr_time_s[0] / 1000) + ',' + Math.floor(this.listQuery5.opr_time_s[1] / 1000)
        // } else {
        //   this.listQuery5.rtime = undefined
        // }
        getLineIpBind(this.listQuery5).then(response => {
          this.list = response.results
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        })
      },
      handleFilter() {
        this.listQuery5.page = 1
        this.getList()
      },
      resetlistQuery() {
        this.listQuery5 = {
          page: 1,
          limit: 20,
          operate_obj: undefined,
          opr_time_s: undefined,
        }
      },
      resetForm(formName) {
        this.dialogAddVisible = false
        this.dialogEditVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose(){
        this.addForm={
          name:'',
          address: '',
          description: '',
          line: '',
          operate_user: '',
          updatetime: ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
