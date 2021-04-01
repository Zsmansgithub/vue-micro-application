<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="工单流程" name="first">
          <el-table :data="workflow_list" border stripe highlight-current-row>
            <el-table-column label="发起人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.workflow_detail.engineer_display }}</span>
              </template>
            </el-table-column>
            <el-table-column label="审批流程">
              <template slot-scope="scope">
                <span>{{ scope.row.audit_auth_group }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前审批">
              <template slot-scope="scope">
                <span>{{ scope.row.current_audit_auth_group }}</span>
              </template>
            </el-table-column>
            <el-table-column label="目标实例">
              <template slot-scope="scope">
                <span>{{ scope.row.workflow_detail.instance_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数据库">
              <template slot-scope="scope">
                <span>{{ scope.row.workflow_detail.db_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发起时间">
              <template slot-scope="scope">
                <span>{{
                  scope.row.workflow_detail.start_time
                    | parseTime("{y}-{m}-{d} {h}:{i}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="可执行时间范围">
              <template slot-scope="scope">
                <span>{{
                  scope.row.workflow_detail.run_date_start
                    | parseTime("{y}-{m}-{d} {h}:{i}")
                }}</span>
                <span>{{
                  scope.row.workflow_detail.run_date_end
                    | parseTime("{y}-{m}-{d} {h}:{i}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间">
              <template slot-scope="scope">
                <span>{{
                  scope.row.workflow_detail.finish_time
                    | parseTime("{y}-{m}-{d} {h}:{i}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备份">
              <template slot-scope="scope">
                <span v-if="scope.row.workflow_detail.is_backup === true"
                  >是</span
                >
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="当前状态">
              <template slot-scope="scope">
                <span
                  style="color: green"
                  v-if="
                    ['workflow_finish', 'workflow_finish_manual'].includes(
                      scope.row.workflow_detail.status
                    )
                  "
                  >{{ scope.row.workflow_detail.get_status_display }}</span
                >
                <span style="color: red" v-else>{{
                  scope.row.workflow_detail.get_status_display
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="组">
              <template slot-scope="scope">
                <span>{{ scope.row.workflow_detail.group_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span>{{
                  scope.row.workflow_detail.get_syntax_type_display
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="工单详情" name="second">
          <sqlsha1
            :detail_list="detail_list"
            :isDBA="true"
            @select_load="select_load"
          ></sqlsha1>
        </el-tab-pane>
        <el-tab-pane label="工单日志" name="third">
          <el-table :data="log_list" border stripe highlight-current-row>
            <el-table-column
              label="操作"
              prop="operation_type_desc"
            ></el-table-column>
            <el-table-column
              label="操作人"
              prop="operator_display"
            ></el-table-column>
            <el-table-column
              label="操作时间"
              prop="operation_time"
            ></el-table-column>
            <el-table-column
              label="操作信息"
              prop="operation_info"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 测试环境节点id: 372  生产环境节点id: 255 -->
      <div
        v-if="
          XC_workflow_detail &&
            [372, 255].includes(XC_workflow_detail.node_id * 1)
        "
        class="btn-group"
      >
        <el-button type="primary" v-if="is_can_review" @click="send_remark"
          >DBA审核</el-button
        >
        <el-button
          type="primary"
          v-if="is_can_review"
          @click="dialogChangeTimeVisible = true"
          >可执行时间变更</el-button
        >
      </div>
      <div class="btn-group" v-else>
        <template
          v-if="
            is_can_rollback &&
              ['workflow_finish', 'workflow_exception'].includes(
                workflow_status
              )
          "
        >
          <el-button class="btn-default" @click="rollbackSql"
            >查看回滚SQL</el-button
          >
          <el-button type="primary" @click="downRollbacksql" class="btn-info"
            >下载回滚SQL</el-button
          >
        </template>
        <el-button
          type="primary"
          v-if="is_can_review"
          @click="dialogChangeTimeVisible = true"
          >可执行时间变更</el-button
        >
        <!-- 测试环境节点id: 377  生产环境节点id: 291(262删除) -->
        <el-button
          type="primary"
          v-if="
            XC_workflow_detail &&
              [377, 291].includes(XC_workflow_detail.node_id * 1) &&
              is_can_rollback &&
              [
                'workflow_finish',
                'workflow_autoreviewwrong',
                'workflow_abort',
                'workflow_exception'
              ].includes(workflow_status)
          "
          @click="send_remark"
          >执行完成</el-button
        >
        <!-- 测试环境节点id: 376   生产环境节点id: 290(261删除)-->
        <el-button
          v-if="
            is_can_review &&
              XC_workflow_detail &&
              [376, 290].includes(XC_workflow_detail.node_id * 1)
          "
          type="primary"
          @click="send_remark"
          >DBA执行</el-button
        >
        <!-- <el-button type="danger" v-if="is_can_execute" @click="execute('auto')">立即执行</el-button> -->
        <el-button
          type="warning"
          v-if="is_can_execute && manual"
          @click="execute('manual')"
          >手动执行</el-button
        >
        <!-- <el-button type="primary" v-if="is_can_timingtask && ['workflow_review_pass'].includes(workflow_status)" @click="dialogTimeVisible=true">定时执行</el-button> -->
        <el-button
          type="primary"
          v-if="
            is_can_timingtask &&
              ['workflow_timingtask'].includes(workflow_status)
          "
          @click="dialogTimeVisible = true"
          >执行时间变更</el-button
        >
        <el-button
          @click="copySQL"
          v-show="activeName === 'second'"
          type="primary"
          >复制SQL</el-button
        >
      </div>
    </div>
    <timingtask
      :dialogTimeVisible.sync="dialogTimeVisible"
      :workflow_id="workflow_id"
    />
    <alter-date
      :dialogChangeTimeVisible.sync="dialogChangeTimeVisible"
      :workflow_id="workflow_id"
    /><rollback
      :workflow_id="workflow_id"
      :other_instance="other_instance"
      @goSubmit="goSubmit"
      :rollbackDialog.sync="rollbackDialog"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import e_text from "@/views/itsm/components/system_avail_info/e_text.vue";
import rollback from "./components/rollback";
import alterDate from "./components/alterDate";
import timingtask from "./components/timingtask";
import sqlsha1 from "./components/sqlsha1";
import { mapGetters } from "vuex";
import handleClipboard from "@/utils/clipboard";

import { saveAs } from "file-saver";
import {
  getDetailContent,
  getDetailWorkflow,
  getInception,
  getlist,
  getSqlLog,
  sqlPassed,
  downSqlBack,
  doExecute,
  doCancel,
  getWorkflowStatus
} from "@/api/archery/sql_workflow";
import {
  getWorkFlows,
  handleWorkFlow,
  getWorkflowparentline
} from "@/api/workflow/app_manage";
const sqlForm = [
  "sql_content",
  "workflow_name",
  "demand_url",
  "group_name",
  "instance_name",
  "db_name",
  "run_date_start",
  "run_date_end",
  "time_range",
  "is_backup"
];
export default {
  components: {
    Pagination,
    rollback,
    alterDate,
    timingtask,
    sqlsha1,
    e_text
  },
  data() {
    return {
      other_instance: {
        editWorkflowNname: "",
        editDemandUrl: "",
        editSqlContent: "",
        editGroup: "",
        editIsBackup: "",
        editDbName: "",
        editInstanceName: ""
      },
      activeName: "first", //
      workflow_list: [],
      detail_list: [],
      log_list: [],
      load_list: [],
      total: 0,
      workflow_id: null, //sql工单id
      uuid: null, //星辰工单id
      workflow_detail: {}, // sql工单详情
      XC_workflow_detail: {}, // 星辰工单详情
      is_can_review: "",
      is_can_execute: "",
      is_can_timingtask: "",
      manual: "",
      is_can_cancel: "",
      is_can_rollback: "",
      last_operation_info: "",
      workflow_status: "",
      engineer: "",
      rollbackDialog: false,
      dialogTimeVisible: false,
      dialogChangeTimeVisible: false,
      // dialogLoadVisible: false,
      dialogRemarkVisible: false,
      adminrole: false,
      multipleSelection: [],
      confirmOptions: {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "el-button--danger",
        type: "warning"
      },
      workflowType: null
    };
  },
  created() {
    this.getList();
    if (this.$route.query) {
      const query = this.$route.query;
      this.workflow_id = query.params;

      getDetailContent({ workflow_id: query.params }).then(res => {
        this.detail_list = res.rows;
      });
      getSqlLog({ workflow_id: query.params, workflow_type: 2 }).then(res => {
        this.log_list = res.rows;
      });
      getDetailWorkflow({ workflow_id: query.params }).then(res => {
        const workflow_detail = res.workflow_detail;
        this.workflow_detail = workflow_detail;
        this.is_can_cancel = res.is_can_cancel;
        this.is_can_execute = res.is_can_execute;
        this.is_can_review = res.is_can_review;
        this.is_can_rollback = res.is_can_rollback;
        this.is_can_timingtask = res.is_can_timingtask;
        this.manual = res.manual;
        this.engineer = workflow_detail.engineer;
        this.workflow_status = workflow_detail.status;
        this.uuid = workflow_detail.uuid;
        this.workflow_list = [res];

        this.other_instance.editSqlContent = workflow_detail.sql_content;
        this.other_instance.editDemandUrl = workflow_detail.demand_url;
        this.other_instance.editGroup = workflow_detail.group_name;
        this.other_instance.editIsbackup = workflow_detail.is_back_up;
        this.other_instance.editDbName = workflow_detail.db_name;
        this.other_instance.editInstanceName = workflow_detail.instance_name;
        this.other_instance.editWorkflowNname = workflow_detail.workflow_name;
        if (!this.uuid) {
          return;
        }
        getWorkFlows({ page: 1, limit: 20, uuid: this.uuid })
          .then(res => {
            this.XC_workflow_detail = res.results[0];
          })
          .catch(e => {
            console.error(e);
          });
      });
    }
    getWorkflowparentline().then(res => {
      try {
        const workflowType = res.results
          .find(item => item.name === "数据库类申请")
          .workflow.find(item => item.name === "SQL审核上线");
        if (workflowType.name && workflowType.id) {
          this.workflowType = workflowType;
        }
      } catch (e) {
        console.error(e);
      }
    });
  },
  computed: {
    ...mapGetters(["roles", "name"])
  },
  methods: {
    // 刷新页面
    updateRoute() {
      this.$router.push({
        name: this.$route.name,
        query: Object.assign({}, this.$route.query, { id: Date.now() }),
        params: this.$route.params
      });
    },
    // 提交页面跳转
    goSubmit(query) {
      // if(this.XC_workflow_detail.step_line || this.XC_workflow_detail.step_line_name) return;
      if (!this.workflowType.id || !this.workflowType.name) return;
      this.$router.push({
        name: "sql_workflow_submit",
        query,
        params: {
          id: this.workflowType.id,
          name: this.workflowType.name
        }
      });
    },
    // 执行
    execute(mode) {
      this.$confirm(
        mode === "auto"
          ? "请确认是否立即执行？"
          : "请确认是否已经手工执行结束？",
        "提示",
        this.confirmOptions
      )
        .then(() => {
          doExecute({ workflow_id: this.workflow_id, mode: mode }).then(res => {
            if (res.errMsg) {
              this.$message.error(res.errMsg);
              return;
            }
            this.updateRoute();
          });
        })
        .catch(e => {
          console.error(e);
        });
    },
    send_execute(val) {
      let msg = "确定执行该操作吗?";
      if (val === "kill") {
        msg = "请确认是否立即终止？终止后需要手动清理触发器以及相关中间表！";
      }
      this.$confirm(msg, "提示", this.confirmOptions).then(() => {
        const actions = this.multipleSelection.reduce((list, v) => {
          if (v.sqlsha1)
            list.push(
              getInception({
                sqlsha1: v.sqlsha1 || v.SQLSHA1,
                workflow_id: this.workflow_id,
                command: val
              })
            );
          return list;
        }, []);
        Promise.all(actions)
          .then(res => {
            this.load_list = res.pop().rows;
            this.$message.success("操作成功!");
          })
          .catch(error => {
            this.$message.error(error);
          });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    select_load(val) {
      // if(!val) return
      // getInception({sqlsha1: val, workflow_id: this.workflow_id, command: "get"}).then(res=>{
      //   this.multipleSelection = []
      //   this.load_list=res.rows
      //   this.dialogLoadVisible = true
      // })
    },
    send_instance() {
      const query = {
        type: "上线其他实例",
        workflow_name: this.other_instance.editWorkflowNname,
        demand_url: "",
        sql_content: this.other_instance.editSqlContent,
        group: this.other_instance.editGroup,
        backup: this.other_instance.editIsBackup
        // params:id
      };
      this.goSubmit(query);
    },
    // 重新修改
    resetSubmit() {
      const query = sqlForm.reduce(
        (obj, key) => {
          obj[key] = this.workflow_detail[key];
          return obj;
        },
        { type: "重新修改" }
      );
      this.goSubmit(query);
    },
    send_edit() {
      const query = {
        type: "查看提交信息",
        workflow_name: this.other_instance.editWorkflowNname,
        demand_url: this.other_instance.editDemandUrl,
        sql_content: this.other_instance.editSqlContent,
        group: this.other_instance.editGroup,
        instance: this.other_instance.editInstanceName,
        db_name: this.other_instance.editDbName,
        backup: this.other_instance.editIsBackup
      };
      this.goSubmit(query);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 查看回滚sql
    rollbackSql() {
      this.rollbackDialog = true;
    },
    // 下载回滚sql
    downRollbacksql() {
      downSqlBack({ workflow_id: this.workflow_id, download: 1 })
        .then(res => {
          saveAs(res, "回滚sql.sql");
        })
        .catch(e => {
          console.error(e);
        });
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        navStatus: undefined,
        instance_id: undefined,
        group_id: undefined,
        start_date: undefined,
        end_date: undefined,
        search: undefined
      };
      this.getList();
    },
    getList() {
      getlist(this.listQuery).then(response => {
        this.list = response.rows;
        this.total = response.total;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 审核通过
    send_remark() {
      this.$prompt("", "提示", {
        confirmButtonText: "确定",
        inputPlaceholder: "请输入审批意见",
        inputValue: "已确认并同意",
        inputType: "textarea",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          const site = this.XC_workflow_detail.node_handle.filter(
            v => v.name === "同意"
          )[0];
          const ackForm = {
            uuid: this.uuid,
            hand_id: site.ID,
            hand_name: site.name,
            comments: value,
            file_json: [],
            user: "",
            uuid_user: ""
          };
          handleWorkFlow(this.uuid, ackForm).then(res => {
            this.updateRoute();
          });
          // const data = {
          //   workflow_id: this.workflow_id,
          //   audit_remark: value
          // }
          // sqlPassed(data).then(() => {
          //   this.updateRoute();
          // })
        })
        .catch(() => {});
    },
    // 终止流程
    send_stop() {
      const validator = val => {
        if (!val) {
          return "请输入终止原因";
        }
        return true;
      };
      this.$prompt("", "提示", {
        confirmButtonText: "确定",
        inputPlaceholder: "请输入终止原因",
        inputValidator: validator,
        inputType: "textarea",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          const data = {
            workflow_id: this.workflow_id,
            cancel_remark: value
          };
          doCancel(data)
            .then(res => {
              this.updateRoute();
            })
            .catch(e => {
              console.error(e);
            });
        })
        .catch(e => {
          console.error(e);
        });
    },
    copySQL($evt) {
      const text = this.detail_list.reduce((str, item) => {
        str += /[\s\S];$/.test(item.sql)
          ? `${item.sql}\r\n`
          : `${item.sql};\r\n`;
        return str;
      }, "");
      handleClipboard(text, $evt);
    }
  }
};
</script>

<style scoped>
.btn-default:hover {
  color: #333;
  background-color: #e6e6e6;
  border-color: #adadad;
}

.btn-info:hover {
  color: #fff;
  background-color: #31b0d5;
  border-color: #269abc;
}
.btn-group {
  /* display: none; */
  padding: 10px 0;
}
</style>
