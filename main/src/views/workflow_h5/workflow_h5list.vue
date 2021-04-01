<template>
  <div class="divstyle scrollstyle">
    <el-form ref="listQuery" :model="listQuery">
      <el-form-item prop="search" style="margin:0;">
        <el-input v-model="listQuery.search" clearable placeholder="模糊搜索" style="width: 100%;" @input="search">
          <template slot="prepend">
            <span v-if="activeName=='first'">待办工单</span>
            <span v-if="activeName=='second'">我发起工单</span>
            <span v-if="activeName=='third'">我审批工单</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="待办工单" name="first"></el-tab-pane> -->
      <el-tab-pane name="first">
        <span slot="label">待办工单<el-badge v-show="total != 0" class="mark" :value="total" /></span><!-- 待办工单 total显示 -->
      </el-tab-pane>
      <el-tab-pane label="我发起工单" name="second"></el-tab-pane>
      <el-tab-pane label="我审批工单" name="third"></el-tab-pane>
    </el-tabs>
    <div class="listdiv" :style="{'padding-bottom' : activeName=='first' ? '3.5rem' : '0'}" @touchstart='touchstart' @touchmove='touchmove' @touchend='touchend'>
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scrollstyle">
        <!-- <ul class="listul" id="boxid">
          <li v-for="item in dataList" @click="handleDetail(item)">
            <el-card shadow="never">
              <div slot="header">
                <span>{{ item | titleText }}</span>
              </div>
              <div>
                <i class="el-icon-date"></i>&nbsp;{{ item.uuid }}&nbsp;&nbsp;&nbsp;<i class="el-icon-time"></i>&nbsp;{{ item.node_id_name }}
              </div>
            </el-card>
          </li>
        </ul> -->
        <el-table id="boxid" ref="multipleTable" :data="dataList" :show-header="false" @selection-change="SelectionChange">
          <el-table-column type="selection" width="30" align="center" v-if="activeName=='first'"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div @click="handleDetail(scope.row)">
                <div class="detail-title">{{ scope.row | titleText }}</div>
                <span class="detail-id"><i class="el-icon-date"></i>&nbsp;{{ scope.row.uuid }}&nbsp;&nbsp;&nbsp;<i class="el-icon-time"></i>&nbsp;{{ scope.row.node_id_name }}</span>
                <!-- <el-card shadow="never">
                  <div slot="header">
                    <span>{{ scope.row | titleText }}</span>
                  </div>
                  <div>
                    <i class="el-icon-date"></i>&nbsp;{{ scope.row.uuid }}&nbsp;&nbsp;&nbsp;<i class="el-icon-time"></i>&nbsp;{{ scope.row.node_id_name }}
                  </div>
                </el-card> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <img v-show="showToTop" src="../../../public/static/mescroll/mescroll-totop.png" class="mescroll-totop mescroll-fade-in" style="animation-duration: 0.5s;" @click="scrollToTop">
      </mescroll-vue>
    </div>
    <el-row class="MyButton" style="width:calc(100% - 2rem);" v-if="activeName=='first'">
      <el-col style="width:3rem;" align="left">
        <el-checkbox v-model="allcheck" :indeterminate="selected_rows.length > 0 && selected_rows.length < dataList.length" @change="AllCheckEvent">全选 {{selected_rows.length}}</el-checkbox>
      </el-col>
      <el-col style="width:calc(100% - 3rem);" align="right">
        <el-button class="filter-item" type="success" plain :disabled="selected_rows.length === 0" @click="agreeClick">同意
        </el-button><el-button class="filter-item" type="danger" plain :disabled="selected_rows.length === 0" @click="noagreeClick">驳回
        </el-button><el-button class="filter-item" type="primary" plain :disabled="selected_rows.length === 0" @click="selfClick">撤回</el-button>
      </el-col>
    </el-row>
    <el-dialog title="确认框" :visible.sync="dialogFormVisible" width="100%" :before-close="dialogClose" :append-to-body="true">
      <el-form ref="ackForm" :rules="rules" :model="ackForm">
        <el-form-item label="请输入审批意见" prop="comments" required>
          <el-input v-model="ackForm.comments" type="textarea"/>
        </el-form-item>
        <!-- <el-form-item v-if="ackForm.hand_name == '沟通'" label="沟通对象" prop="uuid_user" required>
          <el-select v-model="ackForm.uuid_user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ackForm.hand_name == '转办'" label="转办对象" prop="user" required>
          <el-select v-model="ackForm.user" filterable clearable placeholder="请输入工号/姓名" style="width: 100%;">
            <el-option v-for="item in userOptions" :key="item.value" :label="'('+item.value+')'+item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/dev-api/workflow/workflow_upload_file_first"
            :http-request="myUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleChange"
            :before-upload="beforeUpload"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="ackForm.file_json">
            <el-button size="small" type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">可上传附件，且单个文件不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-tooltip v-if="ackForm.hand_name == '驳回'" content="重新提交可回到当前节点" placement="top">
          <el-button v-if="ackForm.hand_name == '驳回'" type="primary" @click="updateCommon2('ackForm')" :loading="buttondisabled">打回再提交</el-button>
        </el-tooltip>
        <el-button @click="dialogClose">取 消</el-button>
        <!-- <el-button v-if="ackForm.hand_name == '沟通' || ackForm.hand_name == '回复'" type="primary"
                   @click="updateCommon3('ackForm')" :loading="buttondisabled">确 定</el-button>
        <el-button v-else-if="ackForm.hand_name !== '驳回'" type="primary" @click="updateCommon('ackForm')" :loading="buttondisabled">确 定</el-button> -->
        <el-button v-if="ackForm.hand_name !== '驳回'" type="primary" @click="updateCommon('ackForm')" :loading="buttondisabled">确 定</el-button>
        <el-tooltip v-if="ackForm.hand_name == '驳回'" content="驳回后该申请单将关闭不能再提交" placement="top">
          <el-button v-if="ackForm.hand_name == '驳回'" type="primary" @click="updateCommon('ackForm')" :loading="buttondisabled">驳 回</el-button>
        </el-tooltip>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getWorkFlows, getWorkFlowsHistory, getWorkFlowsMyHistory,getWorkflowline,handleWorkFlow} from '@/api/workflow/app_manage'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import { loginDD_h5 } from '@/api/user'
  // import { getCode } from './dd-login'
  import { getCode } from './ddlogin_h5'
  export default {
    components: {
      MescrollVue ,// 注册mescroll组件
    },
    data() {
      return {
        activeName: 'first',
        selected_rows:[],
        selected_rows_handleid:[],
        allcheck:false,
        ackForm: {
          comments: '',
          // uuid_user: '',
          // user:'',
          file_json: [],
        },
        buttondisabled:false,
        dialogFormVisible: false,
        rules: {
          comments: [
            {required: true, message: '请输入审批意见', trigger: 'blur'}, ,
            {min: 2, max: 250, message: '长度在 2 到 250个字符之间', trigger: 'blur'},
          ],
          // uuid_user: [
          //   {required: true, message: '请选择沟通对象', trigger: 'blur'},
          // ],
          // user: [
          //   {required: true, message: '请选择转办对象', trigger: 'blur'},
          // ],
        },
        listQuery: {
          page: 1,
          limit: 20,
          search: undefined,
        },
        showToTop:false,
        //mescroll
        mescroll: null, // mescroll实例对象
        mescrollDown:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
            //以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 20 //每页数据条数,默认10
          },
          onScroll: this.showToTopFunc,//列表滑动监听,默认onScroll: null;function(mescroll, y, isUp)y为列表当前滚动条的位置
          htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
          noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
          // toTop: {
          //   //回到顶部按钮
          //   src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
          //   offset: 1000 //列表滚动1000px才显示回到顶部按钮
          // },
          empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: "boxid", //父布局的id (1.3.5版本支持传入dom元素)
            icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
            tip: "暂无相关数据~" //提示
          }
        },
        dataList: [] ,// 列表数据
        total:undefined,
      };
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
        vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
      // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
      this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
      next()
    },
    created() {
      getCode(code => {
        // 登录处理
        this.code = code || this.$route.query.code; //code可以通过接口获取，还可以通过url中传入
        // this.$alert(this.code)
        // loginDD_h5(this.code).then(response => {
          // const { data } = response;
          // store.dispatch('user/loginjwt', data).then(() => {
          //   next({ path: '/' })
          // })
        // })
      })

      //如果传入了工单号，直接填上
      if (this.$route.query.wcf_id){
        this.listQuery.search = this.$route.query.wcf_id
      }

    },
    methods: {
      // mescroll组件初始化的回调,可获取到mescroll对象
      mescrollInit (mescroll) {
        this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      },
      upCallback (page, mescroll) {
        // console.log(page.num)
        this.listQuery.page = page.num
        this.listQuery.limit = page.size
        if (this.activeName=='first') {
          // this.getList()  // 待办工单
          getWorkFlows(this.listQuery).then(response => {
            this.total = response.count
            let arr = response.results
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.dataList = []
            // 把请求到的数据添加到列表
            this.dataList = this.dataList.concat(arr)
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length)
            })
          })
        } else if (this.activeName=='second') {
          // this.getListMyHistory() //我发起工单
          getWorkFlowsMyHistory(this.listQuery).then(response => {
            let arr = response.results
            if (page.num === 1) this.dataList = []
            this.dataList = this.dataList.concat(arr)
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length)
            })
          })
        } else {
          // this.getList2() //我审批工单
          getWorkFlowsHistory(this.listQuery).then(response => {
            let arr = response.results
            if (page.num === 1) this.dataList = []
            this.dataList = this.dataList.concat(arr)
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length)
            })
          })
        }
      },
      handleClick(tab, event) {
        this.resetlistQuery()
        this.mescroll.resetUpScroll() //重置mescroll的page
        this.mescroll.setScrollTop(0) //滚动条回到顶部
      },
      search(){ //模糊搜索
        this.mescroll.resetUpScroll() //重置mescroll的page
        this.mescroll.setScrollTop(0) //滚动条回到顶部
      },
      scrollToTop(){ //回到顶部
        // this.mescroll.setScrollTop(0) //回到顶部，但是没有滚动过程
        this.mescroll.scrollTo( 0 ); //mescroll.scrollTo( y, t );y=0,则回到列表顶部;t时长,单位ms,默认300;
      },
      showToTopFunc(mescroll, y, isUp){
        if (y>=1000) {
          this.showToTop = true
        } else{
          this.showToTop = false
        }
      },
      resetlistQuery(){
        this.listQuery.page = 1
        this.listQuery.limit = 20
        this.listQuery.search = undefined
      },
      // 详情
      handleDetail(row) {
        getWorkflowline({name:row.step_line_name}).then(response => {
          this.$router.push({name: response.results[0].url.split('/')[2] + "_detail", params: {detailData: row}})
        })
      },
      touchstart (e) {
        // 如果你要阻止点击事件，请反注释下一行代码
        // e.preventDefault()
        this.startX = e.touches[0].clientX
        this.startY = e.touches[0].clientY
      },
      touchmove (e) {
        this.moveX = e.touches[0].clientX
        this.moveY = e.touches[0].clientY
      },
      touchend (e) {
        //先判断是否是左右滑动，防止影响上下滑动   | x | >= | y |
        if (Math.abs(this.startX - this.moveX) >= Math.abs(this.startY - this.moveY)) {
          this.startX - this.moveX <= 0 ? this.changgeright() : this.changgeleft()
        }
      },
      changgeleft(){ //往右移是从右往左滑
        if (this.activeName=='first') {
          this.activeName = 'second'
        } else {
          this.activeName = 'third'
        }
        this.handleClick()
      },
      changgeright(){
        // if (this.activeName=='third') {
        //   this.activeName = 'second'
        // } else {
        //   this.activeName = 'first'
        // }
        // this.handleClick()

        // 待办 多选框放最左边,所以下拉刷新和上拉加载 都会触发 右滑
        if (this.activeName=='third') {
          this.activeName = 'second'
          this.handleClick()
        } else if(this.activeName=='second') {
          this.activeName = 'first'
          this.handleClick()
        } else {
          //当activeName == 'first'时，不执行this.handleClick()
        }
      },
      SelectionChange(val){
        this.selected_rows = val;
        // console.log(this.selected_rows)
        if (this.selected_rows.length == this.dataList.length && this.activeName == 'first') {
          this.allcheck = true
        }
        if (this.selected_rows.length == 0 && this.activeName == 'first') {
          this.allcheck = false
        }
      },
      agreeClick(){
        this.ackForm.hand_name = '同意'
        this.ackForm.comments = '同意'
        this.ackForm.piliang = true
        for (var i = 0; i < this.selected_rows.length; i++) {
          for (var j = 0; j < this.selected_rows[i].node_handle.length; j++) {
            this.selected_rows_handleid[i] = undefined
            if (this.selected_rows[i].node_handle[j].name == this.ackForm.hand_name) {
              this.selected_rows_handleid[i] = this.selected_rows[i].node_handle[j].ID
              break
            }
          }
        }
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      noagreeClick(){
        this.ackForm.hand_name = '驳回'
        this.ackForm.comments = '驳回'
        this.ackForm.piliang = true
        for (var i = 0; i < this.selected_rows.length; i++) {
          for (var j = 0; j < this.selected_rows[i].node_handle.length; j++) {
            this.selected_rows_handleid[i] = undefined
            if (this.selected_rows[i].node_handle[j].name == this.ackForm.hand_name) {
              this.selected_rows_handleid[i] = this.selected_rows[i].node_handle[j].ID
              break
            }
          }
        }
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      selfClick(){
        this.ackForm.hand_name = '撤回'
        this.ackForm.comments = '撤回'
        this.ackForm.piliang = true
        for (var i = 0; i < this.selected_rows.length; i++) {
          for (var j = 0; j < this.selected_rows[i].node_handle.length; j++) {
            this.selected_rows_handleid[i] = undefined
            if (this.selected_rows[i].node_handle[j].name == this.ackForm.hand_name) {
              this.selected_rows_handleid[i] = 'cancel'
              break
            }
          }
        }
        this.dialogFormVisible = true
        this.buttondisabled = false
      },
      AllCheckEvent(){
        this.$refs.multipleTable.toggleAllSelection()
      },
      dialogClose() {
        this.ackForm = {
          comments: '',
          // uuid_user: '',
          // user:'',
          file_json: [],
        },
        this.dialogFormVisible = false
      },
      piliangupdate(i){
        if (this.selected_rows_handleid[i] !== undefined) {
            handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
                           hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name}).then(response => {
                             // this.getList()
                             // this.ackForm.file_json = []
                             // this.ackForm.piliang = false
                             this.$notify({
                               title: '成功',
                               // message: '审批成功',
                               type: 'success',
                               duration: 3000
                             })
                             i=i+1
                             if (i < this.selected_rows.length) {
                               this.piliangupdate(i)
                             } else{
                               // this.getList()
                               this.handleClick()
                               this.ackForm.file_json = []
                               this.ackForm.piliang = false
                             }
                           })
          }
      },
      // 审批意见 更新
      updateCommon(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            if (this.ackForm.piliang == true) {
              // for (var i = 0; i < this.selected_rows.length; i++) {
              //   if (this.selected_rows_handleid[i] !== undefined) {
              //     handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
              //                    hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name}).then(response => {
              //                      this.getList()
              //                      this.ackForm.file_json = []
              //                      this.ackForm.piliang = false
              //                    })
              //   }
              // }
              this.piliangupdate(0)
            } else{
              handleWorkFlow(this.ackForm['uuid'], this.ackForm).then(response => {
                // this.getList()
                this.handleClick()
                // this.$refs[formName].resetFields();
                this.ackForm.file_json = []
                this.ackForm.user = ''
              })
            }
            this.dialogFormVisible = false
          }
        })
      },
      piliangupdate2(i){
        if (this.selected_rows_handleid[i] !== undefined) {
            handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
                           hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name,status:4}).then(response => {
                             this.$notify({
                               title: '成功',
                               // message: '审批成功',
                               type: 'success',
                               duration: 3000
                             })
                             i=i+1
                             if (i < this.selected_rows.length) {
                               this.piliangupdate2(i)
                             } else{
                               // this.getList()
                               this.handleClick()
                               this.ackForm.file_json = []
                               this.ackForm.piliang = false
                             }
                           })
          }
      },
      // 打回再提交  status=4
      updateCommon2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttondisabled = true
            if (this.ackForm.piliang == true) {
              // for (var i = 0; i < this.selected_rows.length; i++) {
              //   if (this.selected_rows_handleid[i] !== undefined) {
              //     handleWorkFlow(this.selected_rows[i].uuid,{comments:this.ackForm.comments,file_json:this.ackForm.file_json,
              //                    hand_id:this.selected_rows_handleid[i],hand_name:this.ackForm.hand_name,status:4}).then(response => {
              //                      this.getList()
              //                      this.ackForm.file_json = []
              //                      this.ackForm.piliang = false
              //                    })
              //   }
              // }
              this.piliangupdate2(0)
            } else{
              handleWorkFlow(this.ackForm.uuid, {comments:this.ackForm.comments,file_json:this.ackForm.file_json,
                            hand_id:this.ackForm.hand_id,hand_name:this.ackForm.hand_name,status:4}).then(response => {
                // this.getList()
                this.handleClick()
                // this.$refs[formName].resetFields();
                this.ackForm.file_json = []
              })
            }
            this.dialogFormVisible = false
          }
        })
      },
      //附件
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.ackForm.file_json = []
        this.ackForm.file_json = fileList
        console.log(this.ackForm.file_json)
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        if (file.status == 'ready') {
          return
        }
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleChange(response, file, fileList) {
        console.log(file, fileList);
        if (file.status == 'success') {this.buttondisabled = false} //文件上传成功后才能确认
        this.ackForm.file_json = []
        this.ackForm.file_json = fileList
        console.log(this.ackForm.file_json)
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
      //重命名上传，下载时文件名带uuid
      myUpload(content) {
        this.buttondisabled = true //上传顺序 beforeUpload -> myUpload -> handleChange
        var copyFile = new File([content.file], `${this.ackForm.uuid}_${content.file.name}`, {type: content.file.type});
        let formData = new FormData();
        formData.append(content.filename, copyFile);
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/dev-api/workflow/workflow_upload_file_first");
        xhr.send(formData);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            content.onSuccess(JSON.parse(xhr.responseText))
          }
        }
      }
    },
    filters: {
      titleText(row) {
        // return JSON.parse(row.values).fullPath === '/workflow/database_access_application' ? `${row.create_user_name} 【${row.step_line_name}】` : row.title
        // 如果title应用名为空 目前有:数据库接入申请 产品线申请
        return row.title.indexOf('【】')!==-1 ? `${row.create_user_name} 【${row.step_line_name}】` : row.title
      }
    }
  };
</script>

<style lang="scss" scoped>
  /*通过fixed固定mescroll的高度*/
  // .mescroll {position: fixed;top: 44px;bottom: 0;height: auto;}
  .divstyle{padding:1rem;width:100%;height:100%;display:flex;flex-direction:column;flex-wrap:nowrap;} //顶部固定
  .listdiv{
    flex:1;//沾满剩下的空间
    overflow:hidden //这个是重点！，一定要加，若不加，当它子元素高度小于它时，会沾满剩下高度，但当子元素高度大于它时，它的高度等于子元素撑开的高度
  }
  // .listul{list-style:none;padding:0;margin:0;}
  /deep/.el-tabs__header {margin:0;}
  // /deep/.el-card{margin-top:0.5rem;}
  // /deep/.el-card__header{padding:0.5rem;font-size:0.9rem;}
  // /deep/.el-card__body{padding:0.3rem;color:#8492a6;font-size:0.7rem;}
  // 隐藏滚动条
  .scrollstyle{
    overflow:auto;
    -ms-overflow-style: none;//IE
    scrollbar-width: none;//火狐
  }
  .scrollstyle::-webkit-scrollbar{width: 0;height:0;}//chrome 和Safari

  // /deep/.el-table{width:100%;border: 0.3rem solid #dfe6ec;border-bottom: 0;}
  // /deep/.el-table td{padding:0;border-bottom: 0.3rem solid #dfe6ec;}
  /deep/.el-table{width:100%;}
  /deep/.el-table__body{border-spacing:0 0.3rem;}
  /deep/.el-table td{padding:0;border:1px solid #dfe6ec;}
  //待办工单 有两个td
  /deep/.el-table td:first-child{border-right:0;}
  /deep/.el-table td:last-child{border-left:0;}
  //我发起工单 我审批工单 只有一个td
  /deep/.el-table td:first-child{border-left:1px solid #dfe6ec;}
  /deep/.el-table td:last-child{border-right:1px solid #dfe6ec;}

  /deep/.el-table:before{background-color:#FFFFFF;}
  /deep/.el-table--border td:first-child .cell {padding-left: 0;border-right: 0;}
  /deep/.el-table .cell{padding:0;}

  .detail-title{border-bottom: 1px solid #dfe6ec;padding:0.5rem;}
  .detail-id{padding:0.3rem;color:#8492a6;font-size:0.7rem;}
  .MyButton{position:fixed;bottom:0;background-color:white;z-index:100;height:3.5rem;line-height:3.5rem;}
  /deep/.el-checkbox__inner{border-radius: 50%;}

  // 回到顶部按钮 与 底部审批按钮 会重叠，重写回到顶部按钮
  img {border-style: none;}
  .mescroll-totop {
      z-index: 9990;
      position: fixed;
      right: 1rem;
      bottom: 5rem;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      opacity: 0;
  }
  .mescroll-lazy-in, .mescroll-fade-in {
      -webkit-animation: mescrollFadeIn .5s linear forwards;
      animation: mescrollFadeIn .5s linear forwards;
  }
</style>
