<template>
  <el-dialog title="SQL回滚" :visible.sync="visible">
    <div style="padding-bottom: 10px;">
      <el-button type="warning" :disabled="!rollback_list.length"
        ><a @click="send_rollback">提交回滚请求</a></el-button
      >
    </div>
    <el-table :data="rollback_list" border stripe highlight-current-row>
      <el-table-column prop="0" label="执行语句"></el-table-column>
      <el-table-column prop="1" label="回滚语句"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { getSqlBack } from "@/api/archery/sql_workflow";
export default {
  props: {
    workflow_id: {
      type: String | Number,
      default: "",
      required: true
    },
    rollbackDialog: Boolean,
    other_instance: Object
  },
  computed: {
    visible: {
      get() {
        return this.rollbackDialog;
      },
      set(val) {
        this.$emit("update:rollbackDialog", val);
      }
    }
  },
  data() {
    return {
      rollback_list: []
    };
  },
  mounted() {
    getSqlBack({ workflow_id: this.workflow_id }).then(res => {
      this.rollback_list = res.rows || [];
    });
  },
  methods: {
    send_rollback() {
      const query = {
        // workflow_name:'【回滚工单】原工单id:'+this.workflow_id+',工单名称:'+this.other_instance.editWorkflowNname,
        type: "回滚sql",
        workflow_name: this.other_instance.editWorkflowNname,
        workflow_id: this.workflow_id,
        group: this.other_instance.editGroup,
        instance: this.other_instance.editInstanceName,
        db_name: this.other_instance.editDbName,
        back_up: this.other_instance.editIsBackup,
        rollback_sql: this.rollback_list[0][1]
      };
      this.$emit("goSubmit", query);
    }
  }
};
</script>
<style lang="scss" scoped></style>
