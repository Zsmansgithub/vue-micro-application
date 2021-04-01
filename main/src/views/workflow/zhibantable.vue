<template>
  <div>
    <el-col>
      <div align="right" style="padding-top: 10px;padding-right: 20px;">
        <el-button type="warning" plain @click="editmanage">成员管理</el-button>
        <el-button type="primary" plain icon="el-icon-upload2" @click="dialogexcel=true">导入</el-button>
        <el-button type="primary" plain icon="el-icon-download" @click="tabledownload=true,downloadtime = []">导出</el-button>
      </div>
      <el-calendar v-model="calendarvalue">
        <template slot="dateCell" slot-scope="{date, data}">
          <div class="clear">
            <div style="float: left;">
              {{ data.day.split('-').slice(1).join('-') }}
            </div>
            <div style="float: right;">
              <el-button type="text" icon="el-icon-edit-outline" @click="handleEdit(data.day)" style="padding:0;">编辑</el-button>
            </div>
          </div>
          <div v-if="monthdata[data.day]">
            <!-- <span v-for="(item,index) in monthdata[data.day]" style="font-size:14px;">
              <span style="color: hotpink;">{{item.zu}}</span> {{String(item.people)}}
              <br v-if="index !== monthdata[data.day].length-1" />
            </span> -->
            <div v-for="(item,index) in monthdata[data.day]" class="datediv">
              <span class="datezu">{{item.zu}}</span>&nbsp;
              <span class="datepeople">{{String(item.people)}}</span>
            </div>
          </div>
          <div v-else style="height:200px;"></div>
        </template>
      </el-calendar>
    </el-col>
    <el-dialog title="成员管理" :visible.sync="dialogmanage" width="50%" :before-close="dialogClose2">
      <el-form ref="editForm" :model="editForm" label-width="0">
        <!-- 如果全都删完的情况 -->
        <el-button type="primary" @click="addmanage()">新增</el-button>
        <el-form-item prop="manage_content">
          <el-table :data="editForm.manage_content">
            <el-table-column prop="zu" label="部门" align="center" min-width="3">
              <template slot-scope="scope">
                <el-form-item :prop="'manage_content.' + scope.$index + '.zu'">
                  <el-input v-model="scope.row.zu" placeholder="请输入部门名称"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="people" label="值班人员" align="center" min-width="8">
              <template slot-scope="scope">
                <el-form-item :prop="'manage_content.' + scope.$index + '.people'">
                  <el-input v-model="scope.row.people" placeholder="用/分隔" type="textarea" :autosize="{ minRows: 1, maxRows: 8}"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="1">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-plus" @click="addDomain2(scope.row)"/>
                <el-button type="text" icon="el-icon-delete" @click="removeDomain2(scope.row)" style="color:red;"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose2">取 消</el-button>
        <el-button type="primary" @click="saveedit2(editForm)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="值班人员" :visible.sync="dialogVisible" width="50%" :before-close="dialogClose">
      <el-form ref="editForm" :model="editForm" label-width="0">
        <el-form-item prop="duty_date">
          <b>{{editForm.duty_date}}</b>
          <!-- 如果全都删完的情况 -->
          <el-button type="primary" @click="add()">新增</el-button>
          <el-button type="warning" @click="moban()">模板</el-button>
        </el-form-item>
        <el-form-item prop="duty_content">
          <el-table :data="editForm.duty_content">
            <el-table-column prop="time" label="时间段" align="center" min-width="2">
              <template slot-scope="scope">
                <el-form-item :prop="'duty_content.' + scope.$index + '.time'">
                  <el-input v-model="scope.row.time" placeholder="例: 18:00-21:00"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="zu" label="部门" align="center" min-width="2">
              <template slot-scope="scope">
                <el-form-item :prop="'duty_content.' + scope.$index + '.zu'">
                  <el-select v-model="scope.row.zu" placeholder="请选择" filterable style="width: 100%">
                    <el-option v-for="item in Object.keys(managedata)" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="people" label="成员" align="center" min-width="2">
              <template slot-scope="scope">
                <el-form-item :prop="'duty_content.' + scope.$index + '.people'">
                  <el-select v-model="scope.row.people" placeholder="请选择" style="width: 100%" filterable multiple :disabled="scope.row.zu==''?true:false">
                    <el-option v-for="item in scope.row.zu !== ''?(managedata[scope.row.zu].split('/')):[]" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="方式" align="center" min-width="2">
              <template slot-scope="scope">
                <el-form-item :prop="'duty_content.' + scope.$index + '.type'">
                  <el-select v-model="scope.row.type" placeholder="请选择" style="width: 100%">
                    <el-option label="远程" value="远程"></el-option>
                    <el-option label="现场" value="现场"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="1">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-plus" @click="addDomain(scope.row)"/>
                <el-button type="text" icon="el-icon-delete" @click="removeDomain(scope.row)" style="color:red;"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="saveedit(editForm)">保 存</el-button>
        <el-button type="primary" @click="saveeditandnext(editForm)">保存&下一天</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量添加" :visible.sync="dialogexcel" width="600px" :before-close="uploadclose" :close-on-click-modal="false">
      <div style="overflow: auto;">
        <div style="float: left;">
          <a class="el-dropdown-link" href="/vue/cmdb/值班表.xlsx">
            <el-button type="text">值班表（模板下载）</el-button>
          </a>
        </div>
        <div style="float: right;">
          <el-upload class="upload-demo" drag action="#" :http-request="httpRequest"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleChange"
            :before-upload="beforeUpload"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">可上传附件，且单个文件不超过5M</div>
          </el-upload>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadclose">取 消</el-button>
        <el-button type="primary" @click="uploadSuccess">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="默认导出当前周的数据" :visible.sync="tabledownload" style="text-align: left" width="30%" :before-close="downloadclose">
      <el-date-picker
        v-model="downloadtime"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 100%;">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadclose">取 消</el-button>
        <el-button type="primary" @click="clickExportButton">导 出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {change_duty_table,get_duty_table,export_duty_table,input_duty_table} from '@/api/workflow/zhibantable'
  export default {
    name: 'zhibantable',
    components: {
      UploadExcelComponent,
    },
    data() {
      return {
        calendarvalue: new Date(),
        dialogVisible:false,
        dialogexcel:false,
        tabledownload:false,
        dialogmanage:false,
        downloadtime:[],
        fileList:[],
        duty_files:[],
        editForm:{
          duty_date:'',
          duty_content:[],
          manage_content:[],
        },
        configinfodict: {
          'time': "",
          'zu': "",
          'people': [],
          'type': "",
        },
        managedict:{
          'zu':"",
          'people': "",
          // 'color': "",
        },
        monthdata:{},
        managedata:{},
      }
    },
    created() {
      this.getmonth(this.calendarvalue)
      // 获取 部门 成员
      get_duty_table({date:'2000-01-01'}).then(response => {
        if (response.duty_content) {
          var array = eval(response.duty_content)
          this.managedata = {}
          for (var i = 0; i < array.length; i++) {
            this.managedata[array[i].zu] = array[i].people
          }
        }
      })
    },
    watch:{
      // 按钮:上个月 今天 下个月，取整个月的数据
      "calendarvalue": function(newValue, oldValue) {
        this.getmonth(this.calendarvalue)
      },
    },
    methods:{
      getmonth(day){
        var month = day.getFullYear()+'-'+((day.getMonth()+1)<10?'0'+(day.getMonth()+1):(day.getMonth()+1))
        get_duty_table({date:month}).then(response => {
          this.monthdata = {}
          for (var i = 0; i < response.length; i++) {
            this.monthdata[response[i].duty_date] = eval(response[i].duty_content)
          }
        })
      },
      // 成员管理
      editmanage(){
        this.editForm.duty_date='2000-01-01'
        this.editForm.manage_content = []
        get_duty_table({date:this.editForm.duty_date}).then(response => {
          if (response.duty_content) {
            this.editForm.manage_content = eval(response.duty_content)
          }
        })
        this.dialogmanage=true
      },
      addmanage(){
        const manage = Object.assign({}, this.managedict)
        this.editForm.manage_content.push(manage)
      },
      addDomain2(row) {
        var index = this.editForm.manage_content.indexOf(row)
        const manage = Object.assign({}, this.managedict)
        this.editForm.manage_content.splice(index+1,0,manage)
      },
      removeDomain2(row) {
        var index = this.editForm.manage_content.indexOf(row)
        this.editForm.manage_content.splice(index,1)
      },
      dialogClose2(){
        this.editForm.manage_content = []
        this.dialogmanage = false
      },
      saveedit2(form){
        //接口
        // this.$refs[form].validate((valid) => {
        //   if (valid) {
            change_duty_table({date:form.duty_date,duty_content:JSON.stringify(form.manage_content)}).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              var array = form.manage_content
              this.managedata = {}
              for (var i = 0; i < array.length; i++) {
                this.managedata[array[i].zu] = array[i].people
              }
              this.getmonth(this.calendarvalue)
            }).catch(error => {})
            this.dialogmanage = false
        //   }
        // })
      },
      // 每天值班人员
      handleEdit(day){
        // 修改
        this.editForm.duty_date = day
        this.editForm.duty_content = []
        if (this.monthdata[day]) {
          this.editForm.duty_content = this.monthdata[day]
          for (var i = 0; i < this.editForm.duty_content.length; i++) {
            if (this.editForm.duty_content[i].zu == '值班组') {this.editForm.duty_content[i].zu = 'IDC组'}
            if (this.editForm.duty_content[i].zu == '系统运维组') {this.editForm.duty_content[i].zu = '应用运维组'}
            if (this.editForm.duty_content[i].zu == '应用运维') {this.editForm.duty_content[i].zu = '应用运维组'}
            if (this.editForm.duty_content[i].zu == '自动化') {this.editForm.duty_content[i].zu = '自动化组'}
            if (this.editForm.duty_content[i].zu == '区域IT') {this.editForm.duty_content[i].zu = '区域IT组'}
            if (this.editForm.duty_content[i].people.length == 0 || this.editForm.duty_content[i].people[0] == '') {
              this.editForm.duty_content[i].people = []
            } else{
              if (this.editForm.duty_content[i].people[0].indexOf('/')!==-1 || this.editForm.duty_content[i].people[0].indexOf('、')!==-1) {
                // var array = this.editForm.duty_content[i].people[0].split('、')
                var array = this.editForm.duty_content[i].people[0].split(/[、/]/)
                this.editForm.duty_content[i].people = array
              }
            }

          }
        }
        this.dialogVisible = true
        if (this.editForm.duty_content.length == 0) {
          // 新增
          const configinfo = Object.assign({}, this.configinfodict)
          this.editForm.duty_content.push(configinfo)
        }
      },
      add(){
        const configinfo = Object.assign({}, this.configinfodict)
        this.editForm.duty_content.push(configinfo)
      },
      moban(){
        this.editForm.duty_content = []
        var zuarray = Object.keys(this.managedata)
        var day = new Date(this.editForm.duty_date).getDay()
        if (day == 0) { //周日
          for (var i = 0; i < zuarray.length; i++) {
            const configinfo = Object.assign({}, this.configinfodict)
            configinfo.time = '08:30-17:30'
            configinfo.zu = zuarray[i]
            configinfo.type = '远程'
            this.editForm.duty_content.push(configinfo)
          }
        } else if (day == 6){ //周六
          for (var i = 0; i < zuarray.length; i++) {
            const configinfo = Object.assign({}, this.configinfodict)
            configinfo.time = '08:30-17:30'
            configinfo.zu = zuarray[i]
            configinfo.type = '现场'
            this.editForm.duty_content.push(configinfo)
          }
        } else { //工作日
          for (var i = 0; i < zuarray.length; i++) {
            const configinfo = Object.assign({}, this.configinfodict)
            configinfo.time = '18:00-21:00'
            configinfo.zu = zuarray[i]
            configinfo.type = '现场'
            this.editForm.duty_content.push(configinfo)
          }
        }
      },
      addDomain(row) {
        var index = this.editForm.duty_content.indexOf(row)
        const configinfo = Object.assign({}, this.configinfodict)
        this.editForm.duty_content.splice(index+1,0,configinfo)
      },
      removeDomain(row) {
        var index = this.editForm.duty_content.indexOf(row)
        this.editForm.duty_content.splice(index,1)
      },
      dialogClose(){
        this.editForm.duty_content = []
        this.dialogVisible = false
      },
      saveedit(form){
        //接口
        // this.$refs[form].validate((valid) => {
        //   if (valid) {
            change_duty_table({date:form.duty_date,duty_content:JSON.stringify(form.duty_content)}).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              this.getmonth(this.calendarvalue)
            }).catch(error => {})
            this.dialogVisible = false
        //   }
        // })
      },
      saveeditandnext(form){
        this.saveedit(form)
        var nextdaytime = new Date(new Date(form.duty_date).getTime()+24*60*60*1000)
        var nextday = nextdaytime.getFullYear()+'-'+((nextdaytime.getMonth()+1)<10?'0'+(nextdaytime.getMonth()+1):(nextdaytime.getMonth()+1))+'-'+(nextdaytime.getDate()<10?'0'+nextdaytime.getDate():nextdaytime.getDate())
        this.handleEdit(nextday)
      },
      //导入
      uploadclose(){
        this.dialogexcel = false
        this.fileList = [];
        this.duty_files = [];
        // this.tableData=[];
        // this.tableHeader=[];
      },
      httpRequest(file){
        this.duty_files.push(file)
      },
      uploadSuccess(){
        this.dialogexcel = false
        console.log('submit')
        console.log(this.duty_files)
        if (this.duty_files.length !== 0) {
          const headers = {
            'Content-Type': 'multipart/form-data'
          }
          const formData = new FormData();
          this.duty_files.map((val) => {
            formData.append('duty_files', val.file);
          })
          input_duty_table(formData, headers).then((res) => {
            if (res.message.search('成功') > -1) {
              this.$message.success(res.message);
            } else if (res.message.search('失败') > -1) {
              this.$message.error(res.message);
            } else {
              this.$message(res.message);
            }
            this.getmonth(this.calendarvalue);
            this.uploadclose();
          })
        } else{
          this.getmonth(this.calendarvalue);
          this.uploadclose();
        }
      },
      // 附件操作
      handleRemove(file, fileList) {
        this.fileList = []
        this.fileList = fileList
        this.duty_files = []
        this.duty_files = JSON.parse(JSON.stringify(fileList))
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
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleChange(response, file, fileList) {
        this.fileList = []
        this.fileList = fileList
      },
      beforeUpload(file){
        const isLt5M = file.size / 1024 / 1024 < 5
        if(!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      },
      //导出
      downloadclose(){
        this.downloadtime = []
        this.tabledownload = false
      },
      clickExportButton(){
        if (this.downloadtime.length == 0) {
          //默认为当前周
          var now = new Date();
          var nowTime = now.getTime();
          var day = now.getDay();
          var oneDayTime = 24*60*60*1000 ;
          var MondayTime = new Date(nowTime - (day-1)*oneDayTime);//显示周一
          var SundayTime = new Date(nowTime + (7-day)*oneDayTime);//显示周日
          this.downloadtime[0] = MondayTime.getFullYear()+'-'+((MondayTime.getMonth()+1)<10?'0'+(MondayTime.getMonth()+1):(MondayTime.getMonth()+1))+'-'+(MondayTime.getDate()<10?'0'+MondayTime.getDate():MondayTime.getDate())
          this.downloadtime[1] = SundayTime.getFullYear()+'-'+((SundayTime.getMonth()+1)<10?'0'+(SundayTime.getMonth()+1):(SundayTime.getMonth()+1))+'-'+(SundayTime.getDate()<10?'0'+SundayTime.getDate():SundayTime.getDate())
        } else{
          var MondayTime = this.downloadtime[0]
          var SundayTime = this.downloadtime[1]
          this.downloadtime[0] = MondayTime.getFullYear()+'-'+((MondayTime.getMonth()+1)<10?'0'+(MondayTime.getMonth()+1):(MondayTime.getMonth()+1))+'-'+(MondayTime.getDate()<10?'0'+MondayTime.getDate():MondayTime.getDate())
          this.downloadtime[1] = SundayTime.getFullYear()+'-'+((SundayTime.getMonth()+1)<10?'0'+(SundayTime.getMonth()+1):(SundayTime.getMonth()+1))+'-'+(SundayTime.getDate()<10?'0'+SundayTime.getDate():SundayTime.getDate())
        }
        //后端返回文件流下载
        export_duty_table({start_date:this.downloadtime[0],end_date:this.downloadtime[1]}).then(res => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = `值班表${this.downloadtime[0]}至${this.downloadtime[1]}.xls`;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
          this.$message.success('导出成功');
        })
        this.tabledownload = false
      },
    }
  }
</script>

<style lang="scss" scoped>
  // 清浮动
  .clear:after{
    content: '';
    display: block;
    clear: both;
  }
  /deep/.el-calendar-day{
    // overflow: auto;
    // height:200px;
    height: 100%;
  }
  /deep/.el-calendar-table td.is-selected {
    background-color: #FFFFFF;
  }
  /deep/.el-calendar-table .el-calendar-day:hover {
    background-color: #FFFFFF;
  }
  /deep/.el-calendar-table td.is-today {
    color: #FD9602;
    .datediv{
      color: #FD9602;
      background-color:#FBEAD2;
      .datepeople{
        color: #000000;
      }
    }
  }
  .datediv{
    height:100%;
    font-size:14px;
    background-color:#F4F4F5;
    color:#909399;
    border-radius:4px;
    margin:2px;
    padding:5px;
  }
</style>
