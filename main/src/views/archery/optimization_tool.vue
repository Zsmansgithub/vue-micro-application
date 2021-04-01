<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="title">SQL优化工具</div>
      <div class="content">
        <el-form ref="elform" :model="newAppForm" :rules="rules">
          <el-row>
            <el-col :span="18">
              <el-form-item prop="sql_content" required>
                <div class="ace-content">
                  <pre ref="editor" id="editor" class="editor"></pre>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div class="form-content">
                <ul class="ul-link">
                  <li>
                    [MYSQL]SQLAdvisor:<el-link
                      :underline="false"
                      target="_blank"
                      type="primary"
                      href="https://tech.meituan.com/2017/03/09/sqladvisor-pr.html"
                      >查看介绍</el-link
                    >
                  </li>
                  <li>
                    [MYSQL]SOAR:<el-link
                      :underline="false"
                      target="_blank"
                      type="primary"
                      href="https://github.com/XiaoMi/soar"
                      >查看介绍</el-link
                    >
                  </li>
                  <li>
                    [MYSQL]MySQLTuning:<el-link
                      :underline="false"
                      target="_blank"
                      type="primary"
                      href="http://dbaplus.cn/blog-77-736-1.html"
                      >查看介绍</el-link
                    >
                  </li>
                  <li>
                    [MYSQL]SQL Tuning Advisor:<el-link
                      :underline="false"
                      target="_blank"
                      type="primary"
                      href="https://docs.oracle.com/database/121/TGSQL/tgsql_sqltune.htm#TGSQL540"
                      >查看介绍</el-link
                    >
                  </li>
                </ul>
                <div style="margin-top: 20px;">
                  <el-form-item>
                    <group-sel
                      v-model="group_name"
                      @change="getSelInstances"
                      style="width: 100%"
                    ></group-sel>
                  </el-form-item>
                  <el-form-item prop="instance_name">
                    <instance-sel
                      v-model="newAppForm.instance_name"
                      :instanceOptions="instanceOptions"
                      :loading="loading"
                      :remote-method="searchFuzzy"
                      @change="handleDb"
                      style="width: 100%"
                    ></instance-sel>
                  </el-form-item>
                  <el-form-item prop="db_name">
                    <DBSel
                      v-model="newAppForm.db_name"
                      :dbOptions="dbOptions"
                      style="width: 100%"
                    ></DBSel>
                  </el-form-item>
                  <el-form-item prop="db_name">
                    <el-select v-model="toolType" style="width: 100%">
                      <el-option
                        label="SQLAdvisor"
                        value="SQLAdvisor"
                      ></el-option>
                      <el-option
                        label="SQLTuning"
                        value="SQLTuning"
                      ></el-option>
                      <el-option label="SOAR" value="SOAR"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    prop="verbose"
                    v-show="toolType === 'SQLAdvisor'"
                  >
                    <el-select
                      v-model="newAppForm.verbose"
                      clearable
                      filterable
                      placeholder="是否查看优化过程"
                      @change="list = []"
                      style="width: 100%"
                    >
                      <el-option :value="1">是</el-option>
                      <el-option :value="0">否</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="range">美化</el-button>
                    <!-- <el-button type="warning" style="margin-left: 10px;" @click="doInquire">执行计划</el-button> -->
                    <el-button
                      type="success"
                      style="margin-left: 10px;"
                      @click="doInquire"
                      >获取优化建议</el-button
                    >
                  </el-form-item>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="wrapper">
      <div class="title">优化建议</div>
      <div class="content" v-show="toolTypeRes === 'SQLAdvisor'">
        <ul v-if="optimization.length" class="ul-link">
          <template v-for="(item, index) in optimization">
            <li v-if="item" :key="`l1_${index}`">
              {{ item }}
            </li>
          </template>
        </ul>
      </div>
      <div class="content" v-show="toolTypeRes === 'SOAR'">
        <ul v-if="soarRes.length" class="ul-link">
          <template v-for="(item, index) in soarRes[0]">
            <li
              :key="`l2_${index}`"
              v-if="item"
              :class="{ 'tool-title': item.includes('# Query') }"
            >
              {{ item }}
            </li>
          </template>
          <li class="sql-container">
            <template v-for="(item, index) in soarRes[1]">
              <div :key="`l3_${index}`" v-if="item">
                {{ item }}
              </div>
            </template>
          </li>
          <template v-for="(item, index) in soarRes[2]">
            <li
              :key="`l4_${index}`"
              v-if="item"
              class="tool-li"
              :class="{ 'tool-title tool-title1': item.includes('##') }"
            >
              {{ item }}
            </li>
          </template>
        </ul>
      </div>
      <div class="content" v-show="toolTypeRes === 'SQLTuning'">
        <el-collapse v-model="activeNames">
          <el-collapse-item
            title="BASIC INFORMATION"
            class="basic-information"
            name="1"
          >
            <div>
              author：<b>MySQL SQL Tuning Tools v1.0 (by hanfeng)</b
              ><el-link
                target="_blank"
                type="primary"
                href="http://dbaplus.cn/blog-77-736-1.html"
                :underline="false"
                >查看文章</el-link
              >
            </div>
            <div
              v-for="(item, index) in tuningRes.basic_information"
              :key="index"
            >
              db_version：{{ item }}
            </div>
          </el-collapse-item>
          <el-collapse-item
            title="SYSTEM PARAMETER"
            class="system-parameter"
            name="2"
          >
            <el-table
              :data="tuningRes.sys_parameter.rows"
              border
              empty-text="--"
            >
              <el-table-column
                v-for="(key, index) in tuningRes.sys_parameter.column_list"
                :key="`c3_${key}${index}`"
                :label="key"
                :prop="key"
              />
            </el-table>
          </el-collapse-item>
          <el-collapse-item
            title="OPTIMIZER SWITCH"
            class="optimizer-switch"
            name="3"
          >
            <div
              v-if="
                tuningRes.optimizer_switch.column_list &&
                  tuningRes.optimizer_switch.column_list.length === 1 &&
                  tuningRes.optimizer_switch.column_list[0] === 'variable_value'
              "
              class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium"
            >
              <div class="el-table__header-wrapper">
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  class="el-table__header"
                  style="width: 100%;"
                >
                  <thead class="has-gutter">
                    <tr>
                      <th colspan="1" rowspan="1" class="is-leaf">
                        <div class="cell">variable_value</div>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="el-table__body-wrapper is-scrolling-none">
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  class="el-table__body"
                  style="width: 100%;"
                >
                  <tbody>
                    <tr
                      class="el-table__row"
                      v-for="(item, idx) in tuningRes.optimizer_switch.rows"
                      :key="`column_${idx}`"
                    >
                      <td
                        rowspan="1"
                        colspan="1"
                        class="el-table_18_column_75  "
                      >
                        <div class="cell">
                          <ul class="ul-link">
                            <li
                              v-for="val in item.variable_value"
                              :key="`columnval_${val}_${idx}`"
                            >
                              {{ val }}
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <el-table
              v-else
              :data="tuningRes.optimizer_switch.rows"
              border
              empty-text="--"
            >
              <el-table-column
                v-for="(key, index) in tuningRes.optimizer_switch.column_list"
                :key="`c4_${key}${index}`"
                :label="key"
                :prop="key"
              >
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="SQL PLAN" class="sql-plan" name="4">
            <el-table :data="tuningRes.plan.rows" border empty-text="--">
              <el-table-column
                v-for="(key, index) in tuningRes.plan.column_list"
                :key="`c5_${key}${index}`"
                :label="key"
                :prop="key"
              />
            </el-table>
          </el-collapse-item>
          <el-collapse-item
            title="OPTIMIZER REWRITE SQL"
            class="optimizer-rewrite-sql"
            name="5"
          >
            <el-table
              :data="tuningRes.optimizer_rewrite_sql.rows"
              border
              empty-text="--"
            >
              <el-table-column
                v-for="(key, index) in tuningRes.optimizer_rewrite_sql
                  .column_list"
                :key="`c2_${key}${index}`"
                :label="key"
                :prop="key"
              />
            </el-table>
          </el-collapse-item>
          <el-collapse-item
            title="OBJECT STATISTICS"
            class="object-statistics"
            name="6"
          >
            <el-table>
              <el-table-column label="Message" prop=""> </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item
            title="STATUS&PROFILING"
            class="status-profiling"
            name="7"
          >
            <el-collapse v-model="activeNames1" style="padding-left: 20px;">
              <el-collapse-item
                title="SESSION STATUS (DIFFERENT)"
                class="session-status"
                name="7-1"
              >
                <el-table
                  :data="tuningRes.session_status.SESSION_STATUS_DIFFERENT.rows"
                  border
                  empty-text="--"
                >
                  <el-table-column
                    v-for="(key, index) in tuningRes.session_status
                      .SESSION_STATUS_DIFFERENT.column_list"
                    :key="`c6_${key}${index}`"
                    :label="key"
                    :prop="key"
                  />
                </el-table>
              </el-collapse-item>
              <el-collapse-item
                title="SQL PROFILING(DETAIL)"
                class="sql-profiling-detail"
                name="7-2"
              >
                <el-table
                  :data="tuningRes.session_status.PROFILING_DETAIL.rows"
                  border
                  empty-text="--"
                >
                  <el-table-column
                    v-for="(key, index) in tuningRes.session_status
                      .PROFILING_DETAIL.column_list"
                    :key="`c1_${key}${index}`"
                    :label="key"
                    :prop="key"
                  />
                </el-table>
              </el-collapse-item>
              <el-collapse-item
                title="SQL PROFILING(SUMMARY)"
                class="sql-profiling-summary"
                name="7-3"
              >
                <el-table
                  :data="tuningRes.session_status.PROFILING_SUMMARY.rows"
                  border
                  empty-text="--"
                >
                  <el-table-column
                    v-for="key in tuningRes.session_status.PROFILING_SUMMARY
                      .column_list"
                    :key="`c7_${key}${index}`"
                    :label="key"
                    :prop="key"
                  />
                </el-table>
              </el-collapse-item>
              <el-collapse-item
                title="EXECUTE TIME"
                class="execute-time"
                name="7-4"
              >
                <div>
                  execute_time:
                  <b>{{ tuningRes.session_status.execute_time || "--" }}</b>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
        </el-collapse>
        <!-- {{ tuningRes }} -->
      </div>
    </div>
  </div>
</template>
<script>
import { GroupSel, InstanceSel, DBSel } from "./components/dropcomponents";
import {
  instanceFuzzy,
  sqltuning,
  sqlsoar,
  sqladvisor
} from "@/api/archery/sql_workflow";
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-language_tools.js";
import sqlFormatter from "sql-formatter";
import mixins from "./components/mixins";

export default {
  components: { GroupSel, InstanceSel, DBSel },
  mixins: [mixins],
  data() {
    return {
      newAppForm: {
        group_name: undefined,
        instance_name: undefined,
        db_name: undefined,
        sql_content: undefined,
        verbose: undefined
      },
      group_name: undefined,
      toolType: "SQLAdvisor",
      toolTypeRes: undefined,
      editor: null,
      optimization: [],
      soarRes: [],
      tuningRes: {
        basic_information: {},
        sys_parameter: {},
        optimizer_switch: {},
        optimizer_rewrite_sql: {},
        plan: {},
        object_statistics: [],
        session_status: {
          EXECUTE_TIME: "",
          BEFORE_STATUS: {},
          AFTER_STATUS: {},
          SESSION_STATUS_DIFFERENT: {},
          PROFILING_DETAIL: {},
          PROFILING_SUMMARY: {}
        }
      },
      activeNames: ["1", "2", "3", "4", "5", "6", "7"],
      activeNames1: ["7-1", "7-2", "7-3", "7-4"],
      rules: {
        instance_name: [{ required: true, message: "请选择实例名" }],
        db_name: [{ required: true, message: "请选择DB/schema名称" }],
        group_name: [{ required: true, message: "请选择项目名称" }],
        sql_content: [{ required: true, message: "SQL不能为空" }],
        sql_content: { required: true, message: "请填写或上传sql" }
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.editor = ace.edit("editor", {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        mode: "ace/mode/mysql"
      });
      this.editor.getSession().on("change", () => {
        this.optimization = [];
        this.soarRes = [];
        this.tuningRes = this.$options.data().tuningRes;
        this.newAppForm.sql_content = this.editor.session.getValue();
      });
      if (this.newAppForm.sql_content) {
        this.editor.session.setValue(this.newAppForm.sql_content);
      }
    });
  },
  methods: {
    // 模糊搜索实例
    searchFuzzy(query) {
      const data = {
        instance_name: query,
        tag_code: "can_write"
      };
      this.loading = true;
      instanceFuzzy(data)
        .then(res => {
          this.instanceOptions = res.options || [];
          this.dbOptions = [];
          this.newAppForm.db_name = undefined;
          this.group_name = undefined;
          this.loading = false;
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 获取优化建议、执行计划
    doInquire() {
      this.$refs["elform"].validate(isPass => {
        if (isPass) {
          if (this.toolType === "SQLAdvisor") {
            this.advisor();
          } else if (this.toolType === "SQLTuning") {
            this.tuning();
          } else {
            this.soar();
          }
          this.toolTypeRes = this.toolType;
        }
      });
    },
    advisor() {
      sqladvisor(this.newAppForm)
        .then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          if (res.status === 0) {
            this.optimization = res.data.split(/↵↵|\[Note\]/g);
          } else {
            this.$message.error(res.msg || "出错了");
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    soar() {
      sqlsoar(this.newAppForm)
        .then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          if (res.status === 0) {
            try {
              const dataText = res.data;
              let soarRes = [
                dataText.split("```sql")[0].split("↵"),
                dataText
                  .split("```sql")[1]
                  .split("```")[0]
                  .split("↵")
              ];
              let d = [];
              dataText
                .split("```sql")[1]
                .split("```")[1]
                .replace(/\n/g, "@@@@@")
                .split("@@@@@@@@@@")
                .forEach(val => {
                  if (!val) return;
                  val = val.replace(/\* \*\*/g, "");
                  val = val.replace(/\*\*/g, "");
                  d.push(val);
                });
              soarRes.push(d);
              this.soarRes = soarRes;
            } catch (e) {
              console.error(e);
              this.soarRes = res.data;
            }
          } else {
            this.$message.error(res.msg || res.errmsg || "出错了");
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    tuning() {
      const query = {
        option: ["sys_parm", "sql_plan", "obj_stat", "sql_profile"],
        db_name: this.newAppForm.db_name,
        sql_content: this.newAppForm.sql_content,
        instance_name: this.newAppForm.instance_name
      };
      sqltuning(query)
        .then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          if (res.status === 0) {
            try {
              function rows(list, spl) {
                return list.rows.map(val => {
                  return list.column_list.reduce((itemval, key, idx) => {
                    if (spl) {
                      itemval[key] = val[idx].split(",");
                    } else {
                      itemval[key] = val[idx];
                    }
                    return itemval;
                  }, {});
                });
              }
              let resdata = res.data;

              let sys_parameter = resdata.sys_parameter;
              sys_parameter.rows = rows(sys_parameter);
              resdata.sys_parameter = sys_parameter;

              let optimizer_switch = resdata.optimizer_switch;
              optimizer_switch.rows = rows(optimizer_switch, true);
              resdata.optimizer_switch = optimizer_switch;

              let plan = resdata.plan;
              plan.rows = rows(plan);
              resdata.plan = plan;

              let optimizer_rewrite_sql = resdata.optimizer_rewrite_sql;
              optimizer_rewrite_sql.rows = rows(optimizer_rewrite_sql);
              resdata.optimizer_rewrite_sql = optimizer_rewrite_sql;

              let session_status = resdata.session_status;

              let k = session_status["SESSION_STATUS(DIFFERENT)"];
              k.rows = rows(k);
              session_status.SESSION_STATUS_DIFFERENT = k;

              let m = session_status["PROFILING_DETAIL"];
              m.rows = rows(m);
              session_status["PROFILING_DETAIL"] = m;

              let b = session_status["PROFILING_SUMMARY"];
              b.rows = rows(b);
              session_status["PROFILING_SUMMARY"] = b;

              resdata.session_status = session_status;
              this.tuningRes = resdata;
            } catch (e) {
              console.error(e);
              this.$message.error("出错了");
            }
          } else {
            this.$message.error(res.msg || res.errmsg || "出错了");
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  min-height: 100px;
  .title {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #dcdfe6;
    .text {
      line-height: 30px;
      margin-right: 10px;
    }
  }
  .content {
    padding: 20px;
    .form-content {
      margin-left: 30px;
    }
  }
}
.ul-link {
  list-style: none;
  padding: 0;
  margin: 0;
  color: #606266;
  & > li {
    height: 25px;
  }
  .sql-container {
    height: auto;
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
    border-radius: 3px;
    padding: 10px;
    margin: 20px 0;
    & > div {
      height: 25px;
    }
  }
}

.tool-li {
  padding-left: 20px;
}
.tool-title {
  font-weight: 700;
  padding-left: 0;
}
.tool-title1 {
  margin-top: 20px;
}
.editor {
  height: 390px;
  margin: 0;
  border: 1px solid #e6ebf5;
  border-radius: 3px;
}
.el-collapse-item /deep/ {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow: hidden;
  .el-collapse-item__wrap {
    border-width: 0;
    padding-left: 20px;
    padding-top: 20px;
  }
  .el-collapse-item__header {
    padding-left: 20px;
    border-width: 0;
    color: #fff;
  }
}

.basic-information /deep/ {
  .el-collapse-item__header {
    background-color: #409eff;
  }
}
.system-parameter /deep/ {
  margin-bottom: 0;
  .el-collapse-item__header {
    background-color: #909399;
  }
}
.optimizer-switch /deep/ {
  .el-collapse-item__header {
    background-color: #909399;
  }
}
.sql-plan /deep/ {
  .el-collapse-item__header {
    background-color: #67c23a;
  }
}
.optimizer-rewrite-sql /deep/ {
  .el-collapse-item__header {
    background-color: #67c23a;
  }
}
.object-statistics /deep/ {
  .el-collapse-item__header {
    background-color: #409eff;
  }
}
.status-profiling /deep/ {
  .el-collapse-item__header {
    background-color: #f56c6c;
  }
}
.session-status /deep/ {
  .el-collapse-item__header {
    background-color: #f56c6c;
  }
}
.sql-profiling-detail /deep/ {
  .el-collapse-item__header {
    background-color: #f56c6c;
  }
}
.sql-profiling-summary /deep/ {
  .el-collapse-item__header {
    background-color: #f56c6c;
  }
}
.execute-time /deep/ {
  .el-collapse-item__header {
    background-color: #f56c6c;
  }
}
</style>
<style lang="scss">
@import "~@/styles/ace-scrollbar.css";
</style>
