<template>
    <el-dialog :visible.sync="dialogUpload" width="500px" title="批量导入" :before-close="closeDia" append-to-body>
      <div style="padding-left: 50px">
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          action="api"
          :http-request="appendFile"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleChange"
          :before-upload="beforeUpload"
          multiple
          accept=".xls,.xlsx"
          :limit="10"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip"><span style="color: red;">*</span>
             请上传附件，且单个文件不超过5M
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="closeDia">取 消</el-button>
        <el-button type="primary" @click="onSub">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
  import { importExcel } from '@/api/itsm/event_management';

  export default {
    name: 'importExcel',
    props: {
      dialogUpload: Boolean
    },
    data() {
      return {
        fileList: [],
        files: []
      }
    },
    methods: {
      closeDia() {
        this.$emit('update:dialogUpload', false);
      },
      appendFile(file) {
        this.files.push(file);
      },
      onSub() {
        const headers = {
          'Content-Type': 'multipart/form-data'
        }
        const formData = new FormData();
        this.files.map((val) => {
          formData.append('files', val.file);
        })
        importExcel(formData, headers).then((res) => {
          if (res.message.search('成功') > -1) {
            this.$message.success(res.message);
          } else if (res.message.search('失败') > -1) {
            this.$message.error(res.message);
          } else {
            this.$message(res.message);
          }
          this.$refs['upload'].clearFiles();
          this.fileList = [];
          this.files = [];
          this.closeDia();
          this.$parent.getList();
        })
      },
      handleRemove(file, fileList) {
        this.fileList = []
        this.fileList = fileList
      },
      beforeRemove(file, fileList) {
        if (file.status === 'ready') {
          return
        }
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      handleChange(response, file, fileList) {
        this.fileList = []
        this.fileList = fileList
      },
      beforeUpload(file){
        const isLt5M = file.size / 1024 / 1024 < 5;
        if(!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 5MB!',
            type: 'error'
          });
          return false;
        }
        return isLt5M
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .upload-demo {
    .el-upload-dragger {
      height: 80px;
      padding-top: 30px;
    }
  }
</style>
