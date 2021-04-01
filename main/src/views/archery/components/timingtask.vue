<template>
  <el-dialog title="定时执行SQL" width="400px" :visible.sync="visible">
    <el-form :model="timeForm" ref="run_date" :rules="timeRules" style="margin-left: 20px">
      <el-form-item prop="run_date">
        <el-date-picker
          v-model="timeForm.run_date"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button @click="visible=false">取消</el-button>
      <el-button type="primary" @click="timingtask">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { doTimingtask } from '@/api/archery/sql_workflow';
export default {
  props: {
    workflow_id: {
      type: String | Number,
      default: '',
      required: true
    },
    dialogTimeVisible: Boolean,
    other_instance: Object
  },
  computed: {
    visible: {
      get() {
        return this.dialogTimeVisible;
      },
      set(val) {
        this.$emit('update:dialogTimeVisible', val);
      }
    }
  },
  data() {
    return {
      timeForm: {
        run_date: null
      },
      timeRules: {
        run_date: [{required: true, message: '请选择执行时间'}],
      },
      pickerOptions: {
        disabledDate: (time) => {
            return time < Date.now();
          }
      },
    }
  },
  methods: {
    // 定时执行
    timingtask() {
      this.$refs.run_date.validate((pass) => {
        if(pass) {
          const data = {
            workflow_id: this.workflow_id,
            run_date: this.timeForm.run_date
          }
          doTimingtask(data)
          .then((res) => {
            this.$parent.updateRoute();
          })
          .catch((e) => {
            console.error(e);
          })
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
