<template>
  <el-dialog :visible.sync="dialogDown" width="420px" title="导出" :before-close="closeDia" append-to-body>
    <div style="padding-bottom: 20px;">请选择月份</div>
    <el-form ref="form" :model="dateForm" :rules="rules">
      <el-form-item prop="date">
        <el-date-picker
          style="width: 100%"
          v-model="dateForm.date"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="closeDia">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { exportExcel } from '@/api/itsm/event_management';
  import { saveAs } from 'file-saver'
  export default {
    name: 'DownLoadExcel',
    props: {
      dialogDown: Boolean
    },
    data(){
      const rules = {
        date: [
          {required: true, message: '请选择月份', trigger: 'change'}
        ],
      }
      return {
        rules: Object.freeze(rules),
        dateForm: {
          date: undefined
        }
      }
    },
    methods: {
      closeDia() {
        this.date = undefined;
        this.$emit('update:dialogDown', false);
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.doDownload();
          } else {
            return false;
          }
        });
      },
      doDownload() {
        const data = {date: this.dateForm.date};
        exportExcel(data).then((res) => {
          const down = () => {
            const fileName = `${this.dateForm.date.split('-')[0]}年${this.dateForm.date.split('-')[1]}月份信息系统可用性记录.xls`;
            saveAs(blob, fileName)
            this.$message.success('导出成功');
            this.closeDia();
          }
          let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
          if(blob.size < 200) {
            const fileReader = new FileReader();
            fileReader.onload = (content) => {
              content.target.result === "{\"msg\":\"无相关数据\"}"
                ? this.$message.warning(JSON.parse(content.target.result).msg)
                : down()
            }
            fileReader.readAsText(blob);
          } else {
            down()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 10px;
}
</style>
