<template>
    <el-dialog title="时间变更" width="500px" :visible.sync="visible">
      <el-form :model="changeTime" ref="form" :rules = "rules" style="margin-left: 20px">
        <el-form-item prop="time">
          <el-date-picker
            v-model="changeTime.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary" @click="doalterRunDate">确定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import { alterRunDate } from '@/api/archery/sql_workflow';
const dateToday = (() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  })()
export default {
  props: {
    workflow_id: {
      type: String | Number,
      default: '',
      required: true
    },
    dialogChangeTimeVisible: Boolean,
    other_instance: Object
  },
  computed: {
    visible: {
      get() {
        return this.dialogChangeTimeVisible;
      },
      set(val) {
        this.$emit('update:dialogChangeTimeVisible', val);
      }
    }
  },
  data() {
    return {
        changeTime:{ // 变更可执行时间
          time: null,
        },
        rules: {
          time: [{required: true, message: '请选择可执行时间!'}],
        },
        pickerOptions: {
          disabledDate: (time) => {
              return time < dateToday;
            }
        },
    }
  },
  methods: {
      doalterRunDate() {
        this.$refs.form.validate((pass) => {
          if(!pass) return;
          const data = {
            workflow_id: this.workflow_id,
            run_date_start: this.changeTime.time[0],
            run_date_end: this.changeTime.time[1]
          };
          alterRunDate(data)
          .then((res) => {
            this.$parent.updateRoute();
          })
          .catch((e) => {
            console.error(e);
          })
        })
      },
  }
}
</script>
<style lang="scss" scoped>

</style>
