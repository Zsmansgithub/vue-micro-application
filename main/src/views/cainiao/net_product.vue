<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.product_line" filterable clearable @change="handleFilter" placeholder="请选择产品线"
          style="width: 250px">
          <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.ip" clearable @input="handleFilter" placeholder="请输入查询条件"></el-input>
      </el-form-item>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
      <el-button class="filter-item" v-if="adminrole" plain type="primary" @click="dialogAdd=true" icon="el-icon-plus">新增记录</el-button>
      <el-button class="filter-item" v-if="adminrole" :disabled="f1" plain type="success" @click="dialogBatch=true" icon="el-icon-edit">批量修改</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border stripe highlight-current-row style="width: 100%"
              @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="35" align="center">
    </el-table-column>
      <el-table-column label="ID" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品线">
        <template slot-scope="scope">
          <span>{{ scope.row.product_line }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公网ip">
        <template slot-scope="scope">
          <pre class="pre_class">{{ scope.row.public_ip | row2MultipleRow}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="内网ip">
        <template slot-scope="scope">
          <pre class="pre_class">{{ scope.row.private_ip | row2MultipleRow}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.change_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center" v-if="adminrole">
        <template slot-scope="props">
          <el-button icon="el-icon-edit" plain type="primary" circle @click="editFormCommon(props.row)" />
          <el-button icon="el-icon-delete" plain type="danger" circle @click="deleteFormCommon(props.row)" />
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

    <el-dialog title="新增记录" :visible.sync="dialogAdd" @close="handleClose" width="850px">
        <el-form ref="addForm" :model="addForm" :rules="rules" class="editAppForm" label-width="110px" style="width:100%;padding-right: 60px">
          <el-form-item label="产品线" prop="product_line">
            <el-select v-model="addForm.product_line" filterable style="width: 100%">
              <el-option v-for="item in nameOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公网ip" prop="public_ip">
            <el-input v-model="addForm.public_ip" type="textarea" :rows="3" style="width: 100%;"></el-input>
          </el-form-item>
          <el-form-item label="内网ip" prop="private_ip">
            <el-input v-model="addForm.private_ip" type="textarea" :rows="3" style="width: 100%;"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="addForm.comment" style="width: 100%;"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改记录" :visible.sync="dialogEdit" width="850px">
        <el-form ref="editForm" :model="editForm" :rules="rules" class="editAppForm" label-width="110px" style="width:100%;padding-right: 60px">
          <el-form-item label="公网ip" prop="public_ip">
            <el-input v-model="editForm.public_ip" type="textarea" :rows="3" style="width: 100%;"></el-input>
          </el-form-item>
          <el-form-item label="内网ip" prop="private_ip">
            <el-input v-model="editForm.private_ip" type="textarea" :rows="3" style="width: 100%;"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="editForm.comment" style="width: 100%;"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="confirmForm('editForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量修改" :visible.sync="dialogBatch" @close="handleClose" width="850px">
        <el-form ref="batchForm" :model="batchForm" :rules="rules" class="editAppForm" label-width="110px" style="width:100%;padding-right: 60px">
          <el-form-item label="产品线" prop="product_line">
            <el-select v-model="batchForm.product_line" filterable style="width: 100%">
              <el-option v-for="item in nameOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('batchForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('batchForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchNetProduct,addNetProduct,editNetProduct,deleteNetProduct,getUnitPlate,getNetProductName} from '@/api/cainiao/net_product'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import resize from '@/components/Charts/mixins/resize'
  import sessionListQuery from "@/components/mixins/sessionListQuery";
  import {mapGetters} from 'vuex'

  export default {
    name: "net_product",
    mixins: [resize, sessionListQuery],
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 20,
          product_line:undefined,
          ip:undefined,
        },
        addForm:{
          product_line:'',
          public_ip:'',
          private_ip:'',
          comment:''
        },
        editForm:{
          id:'',
          product_line:'',
          public_ip:'',
          private_ip:'',
          comment:''
        },
        batchForm:{
          product_line:''
        },
        list: null,
        total: 0,
        listLoading: true,
        dialogAdd:false,
        dialogEdit:false,
        dialogBatch:false,
        f1:true,
        adminrole:'',
        productOptions:[],
        nameOptions:[],
        multipleSelection:[],
        rules:{
          product_line:[{message:'请选择产品线',required:true,trigger:'blur'}],
          public_ip:[{message:'请填写公网ip',required:true,trigger:'blur'}],
          private_ip:[{message:'请填写内网ip',required:true,trigger:'blur'}]
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
      getUnitPlate().then(res=>{
        this.productOptions=res
        getNetProductName(this.productOptions).then(res=>{
        this.nameOptions=res
      })
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
      ...mapGetters(['roles','name'])
    },
    methods: {
      confirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let tmp = [...this.multipleSelection]
            for (const i of tmp) {
              i.product_line=this.batchForm.product_line
              editNetProduct(i.id,i).then(res=>{
              this.$notify({
                title:'成功',
                message:'修改成功',
                type:'success',
                duration:2000
              })
              this.getList()
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
            }
            this.dialogBatch=false
          } else {
            return false;
          }
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length>0) {
          this.f1=false
        }else {
          this.f1=true
        }
      },
      deleteFormCommon(row){
        let msg = '确定删除该条记录吗?'
        this.$confirm(msg, '提示', this.confirmOptions).then(() => {
          deleteNetProduct(row.id).then(response => {
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
      confirmForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editNetProduct(this.editForm.id,this.editForm).then(res=>{
              this.$notify({
                title:'成功',
                message:'修改成功',
                type:'success',
                duration:2000
              })
              this.getList()
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
            this.dialogEdit=false
          } else {
            return false;
          }
        });
      },
      editFormCommon(row){
        this.dialogEdit=true
        this.editForm.id=row.id
        this.editForm.product_line=row.product_line
        this.editForm.public_ip=row.public_ip
        this.editForm.private_ip=row.private_ip
        this.editForm.comment=row.comment
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addNetProduct(this.addForm).then(res=>{
              this.$notify({
                title:'成功',
                message:'添加成功',
                type:'success',
                duration:2000
              })
              this.getList()
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
            this.dialogAdd=false
          } else {
            return false;
          }
        });
      },
      handleFilter(){
        this.getList()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogAdd=false
        this.dialogEdit=false
        this.dialogBatch=false
      },
      handleReset() {
      this.resetlistQuery()
      this.getList()
    },
      resetlistQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        product_line:undefined,
        ip:undefined,
      }
    },
      getList() {
      this.listLoading = true
      fetchNetProduct(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 10)
      })
      getNetProductName(this.productOptions).then(res=>{
      this.nameOptions=res
    })
    },
      handleClose(){
        this.dialogEdit=false
        this.dialogAdd=false
        this.addForm={
          product_line:'',
          public_ip:'',
          private_ip:'',
          comment:''
        }
        this.batchForm={
          product_line:''
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
