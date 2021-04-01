<template>
  <div class="app-container">
    <workflow-title :name="newAppForm.routeParams && newAppForm.routeParams.name" :help_doc_url="help_doc_url" />
    <el-col :span="18" :xs="22" :offset="2" class="description-content">
      <div class="description-text" v-show="isRapidly">
        此流程将直接跳过全部审批流程到达DBA执行阶段，DBA将直接执行这些SQL语句，若由此导致任何系统或数据异常，全部责任由发起人承担。
      </div>
      <div class="description-text" v-show="!isRapidly">
        流程审批和执行需要一定时间的，请耐心等待，如需求非常紧急请电话联系相关领导说明情况后再联系DBA执行
      </div>
    </el-col>

    <div class="content">
      <el-form ref="elform" :model="newAppForm" label-width="130px" :rules="rules">
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item prop="workflow_name" label="工单名称" required>
              <el-input v-model="newAppForm.workflow_name" style="width: 100%" placeholder="请输入上线单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="需求链接">
              <el-input v-model="newAppForm.demand_url" style="width: 100%" placeholder="请输入需求链接"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item prop="group_name" label="项目名称" required>
              <el-select v-model="newAppForm.group_name" clearable filterable placeholder="请选择项目"
                @change="getSelInstances(true)" style="width: 100%">
                <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item prop="instance_name" label="实例名" required>
              <template slot="label">
                <span>
                  <el-tooltip class="item" effect="dark" content="通常格式为域名/IP_端口" placement="top-end">
                    <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px" />
                  </el-tooltip>实例名
                </span>
              </template>
              <el-select v-model="newAppForm.instance_name" placeholder="请选择实例" :loading="loading" clearable remote
                filterable :remote-method="searchFuzzy" @change="handleDb(true)" style="width: 100%">
                <el-option-group v-for="group in instanceOptions" :key="group.label" :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item prop="db_name" label="DB/schema名称" required>
              <el-select v-model="newAppForm.db_name" clearable filterable placeholder="请选择DB/schema名称"
                @change="list = []" style="width: 100%">
                <el-option v-for="item in dbOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col-1400-8">
            <el-form-item label="可执行时间" prop="time_range" required>
              <el-date-picker v-model="newAppForm.time_range" type="datetimerange" :picker-options="pickerOptions"
                range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item prop="catogray">
          <div>请选择sql类别<span class="text-color">(暂不支持create [procedure | trigger | event])</span></div>
          <el-radio-group v-model="newAppForm.catogray" class="radio-group">
            <div class="item"><el-radio :label="1">类别1</el-radio><span class="text text-color">(只包含create table)</span></div>
            <div class="item"><el-radio :label="2">类别2</el-radio><span class="text text-color"
            >(包含 truncate\ drop\ alter table [drop | truncate] \update \delete \create index \alter table [add | modify] \insert)</span></div>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item v-if="workflow_auditors_display">
          <div class="workflow">审批流程: {{workflow_auditors_display}}</div>
        </el-form-item> -->
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item prop="remarks" label="研发风险自评" required class="remrks">
              <el-input type="textarea" v-model="newAppForm.remarks" maxlength="200" show-word-limit autosize
                placeholder="请填写风险自评"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item prop="sql_content" required>
              <template slot="label">
                <span>
                  <el-tooltip class="item" effect="dark" content="暂不支持 create [ procedure | trigger | event ]"
                    placement="top-end">
                    <svg-icon class-name="help-svg" icon-class="help" style="width: 18px; height:18px" />
                  </el-tooltip>SQL
                </span>
              </template>
              <pre ref="editor" id="editor" class="editor"></pre>
              <transition name="el-zoom-in-top">
                <div v-show="count.CheckErrorCount" class="error-count el-form-item__error">
                  {{ `${count.CheckErrorCount}个SQL语句存在错误，无法提交` }}
                </div>
              </transition>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item>
              <el-upload class="upload-demo" action="#" accept=".sql" :http-request="httpRequest"
                :before-upload="beforeUpload" :show-file-list="false" style="float: left">
                <div style="text-align: left;">
                  <el-button size="small" type="primary">点击上传SQL</el-button>
                  <el-button v-show="newAppForm.sql_content" @click.stop="removeFile">移除</el-button>
                  <div>只能上传.sql文件，且不超过10Mb</div>
                </div>
              </el-upload>
              <div v-show="fileName" style="float: left;margin-right: 20px;max-width: 300px;overflow: hidden;">
                {{ fileName }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24" class="col-1400-16 col-1400-offset-2">
          <div class="btn-group">
            <el-button type="primary" @click="range">美化</el-button>
            <el-button type="danger" style="margin-left: 10px;" @click="handleReset">SQL检测</el-button>
            <el-button type="primary" v-if="
                this.newAppForm.routeParams && this.newAppForm.routeParams.uuid
              " :key="`sub${isCanSubmit}`" :disabled="isCanSubmit" @click="editDraftsForm(1)"
              :loading="buttondisabled">保存草稿</el-button>
            <el-button type="primary" v-else :key="`sub${isCanSubmit}`" :disabled="isCanSubmit" @click="saveDraftsForm"
              :loading="buttondisabled">保存草稿</el-button>
            <el-button style="margin-left: 10px;" @click="resetForm">重置</el-button>
            <el-button type="primary" :key="`sub1${isCanSubmit}`" v-if="
                this.newAppForm.routeParams && this.newAppForm.routeParams.uuid
              " :disabled="isCanSubmit" @click="sqlSubmit('sub0')" :loading="buttondisabled">{{ isRapidly ? "急速提交草稿" :
              "提交草稿" }}</el-button>
            <el-button type="primary" v-else :key="`sub1${isCanSubmit}`" :disabled="isCanSubmit"
              @click="sqlSubmit('sub1')" :loading="buttondisabled">{{ isRapidly ? "急速提交" : "立即提交" }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="search-table">
      <div class="title">检测结果</div>
      <el-table :data="list" border stripe highlight-current-row>
        <el-table-column label="ID" align="center" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="SQL语句" min-width="400">
          <template slot-scope="scope">
            <span>{{ scope.row.sql }}</span>
          </template>
        </el-table-column>
        <el-table-column label="扫描/影响行数" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.affected_rows }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.errlevel === 0">pass</span>
            <span v-else-if="scope.row.errlevel === 1">warning</span>
            <span v-else-if="scope.row.errlevel === 2">error</span>
          </template>
        </el-table-column>
        <el-table-column label="审核信息" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.errormessage }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {
    getGroupAuditors,
    getGroupInstance,
    getSqlLog,
    getSqlRollBackDb,
    getSqlWorkflow,
    sqlSimplecheck,
    instanceFuzzy,
    searchByInstance,
    sqlAutoreview
  } from "@/api/archery/sql_workflow";
  import {
    addWorkFlow,
    editWorkFlowConfRow,
    getWFLine,
    saveDraftsWorkFlow
  } from "@/api/workflow/app_manage";
  import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
  import workflowTitle from "./components/Workflow_title";
  import ace from "ace-builds";
  import "ace-builds/webpack-resolver";
  import "ace-builds/src-noconflict/ext-language_tools.js";
  import sqlFormatter from "sql-formatter";
  const dateToday = (() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  })();
  const formKeys = [
    "sql_content",
    "workflow_name",
    "demand_url",
    "group_name",
    "instance_name",
    "db_name",
    "run_date_start",
    "run_date_end",
    "time_range",
    "is_backup",
    "remarks"
  ];
  export default {
    components: {
      workflowTitle
    },
    mixins: [sessionNewAppForm],
    data() {
      return {
        newAppForm: {
          steplinestatus: "",
          sql_content: "",
          workflow_name: "",
          demand_url: "",
          group_name: "",
          instance_name: "",
          db_name: "",
          remarks: "",
          run_date_start: "",
          run_date_end: "",
          time_range: '',
          catogray: null,
          is_backup: null,
          routeParams: ""
        },
        isSqlContent: true,
        aDetail: {},
        list: [],
        workflow_auditors_display: "",
        instanceOptions: [],
        groupOptions: [],
        dbOptions: [],
        confirmOptions: {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "el-button--danger",
          type: "warning"
        },
        editor: null,
        rules: {
          instance_name: [{ required: true, message: "请选择实例名" }],
          db_name: [{ required: true, message: "请选择DB/schema名称" }],
          time_range: [{ required: true, message: "请选择可执行时间" }],
          workflow_name: [{ required: true, message: "请输入上线单名称" }],
          group_name: [{ required: true, message: "请选择项目名称" }],
          catogray: [{ required: true, message: "请选择SQL类型" }],
          steplinestatus: [{ required: true, message: "流程类型不能为空" }],
          sql_content: [{ required: true, message: "请填写或上传SQL" }],
          remarks: { required: true, message: "请填写风险自评" }
        },
        fileName: null,
        buttondisabled: false,
        count: {
          CheckErrorCount: null,
          CheckWarningCount: null
        },
        pickerOptions: {
          disabledDate: time => {
            return time < dateToday;
          }
        },
        help_doc_url: "",
        loading: false,
        isRapidly: false
      };
    },
    watch: {
      "newAppForm.sql_content"(val) {
        this.count = this.$options.data().count;
        if (this.isSqlContent) this.editor && this.editor.session.setValue(val);
      },
      "newAppForm.workflow_name"(val) {
        this.newAppForm.app_name = val;
      }
    },
    computed: {
      isSubmit() {
        return !this.list.length;
      },
      isCanSubmit() {
        return !this.list.length;
      }
    },
    created() {
      if (!this.newAppForm.time_range) {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth();
        const d = date.getDate();
        this.newAppForm.time_range = [new Date(y, m, d), new Date(new Date(y, m, d + 3))]
      }
      if (
        !this.newAppForm.routeParams ||
        !this.newAppForm.routeParams.id ||
        !this.newAppForm.routeParams.name
      ) {
        this.$store
          .dispatch("tagsView/delView", this.$route)
          .then(({ visitedViews }) => {
            this.$router.push("/workflow/app_manage");
          });
      }
      this.$route.params.id =
        this.$route.params.id || this.newAppForm.routeParams.id;
      this.$route.params.name =
        this.$route.params.name || this.newAppForm.routeParams.name;
      this.$route.params.uuid =
        this.$route.params.uuid || this.newAppForm.routeParams.uuid;
      this.isRapidly = this.$route.params.name === "急速SQL审核上线";
    },
    mounted() {
      if (this.$route.query) {
        const query = this.$route.query;
        getGroupAuditors({ group_name: query.group, workflow_type: 2 }).then(
          res => {
            this.workflow_auditors_display = res.data.auditors_display;
          }
        );
        if (query.db_name) this.newAppForm.is_backup = query.backup;
        let newAppForm;
        switch (query.type) {
          case "回滚sql":
            newAppForm = {
              sql_content: query.rollback_sql,
              workflow_name: `【回滚工单】原工单id: ${query.workflow_id},工单名称: ${query.workflow_name}`,
              group_name: query.group,
              instance_name: query.instance,
              db_name: query.db_name
            };
            this.newAppForm = Object.assign({}, this.newAppForm, newAppForm);
            getSqlRollBackDb({
              instance_name: query.instance,
              resource_type: "database"
            }).then(res => {
              this.dbOptions = [];
              if (!res || res.status === 1) {
                this.$message.error(res.msg || "出错了");
                return;
              }
              this.dbOptions = res.data;
            });
            getGroupInstance({
              group_name: query.group,
              tag_code: "can_write"
            }).then(res => {
              this.instanceOptions = [];
              this.instanceOptions = res.options;
            });
            break;
          case "上线其他实例":
            newAppForm = {
              workflow_name: query.workflow_name,
              tgroup_name: query.group,
              sql_content: query.sql_content
            };
            this.newAppForm = this.newAppForm = Object.assign(
              {},
              this.newAppForm,
              newAppForm
            );
            getGroupInstance({
              group_name: query.group,
              tag_code: "can_write"
            }).then(res => {
              this.instanceOptions = [];
              this.instanceOptions = res.options;
            });
            break;
          case "查看提交信息":
            newAppForm = {
              sql_content: query.sql_content,
              group_name: query.group,
              workflow_name: query.workflow_name,
              db_name: query.db_name,
              instance_name: query.instance,
              demand_url: query.demand_url
            };
            this.newAppForm = this.newAppForm = Object.assign(
              {},
              this.newAppForm,
              newAppForm
            );
            getGroupInstance({
              group_name: query.group,
              tag_code: "can_write"
            }).then(res => {
              this.instanceOptions = [];
              this.instanceOptions = res.options;
            });
            getSqlRollBackDb({
              instance_name: query.instance,
              resource_type: "database"
            }).then(res => {
              this.dbOptions = [];
              this.dbOptions = res.data;
            });
            break;
          case "重新修改":
            this.newAppForm = Object.keys().reduce((obj, key) => {
              obj[key] = query[key];
              return obj;
            }, {});
            this.getSelInstances();
            this.handleDb();
            break;
          default:
            break;
        }
      }
      // 获取组
      getSqlWorkflow().then(res => {
        // this.instanceOptions = res.instance
        this.groupOptions = res.data;
      });
      this.$nextTick(() => {
        // 获取实例
        if (this.newAppForm.group_name) {
          this.getSelInstances();
        }
        // 获取数据库
        if (this.newAppForm.instance_name) {
          this.handleDb();
        }
      });
      // 获取帮助文档
      getWFLine(this.newAppForm.routeParams.id)
        .then(response => {
          if (response.status === 1) {
            this.$router.push("/404");
          }
          this.help_doc_url = response.help_url;
        })
        .catch(e => {
          console.error(e);
        });
      // },
      // mounted() {
      this.$nextTick(() => {
        this.editor = ace.edit("editor", {
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
          mode: "ace/mode/mysql"
        });
        this.editor.getSession().on("change", () => {
          this.list = [];
          this.isSqlContent = false;
          this.newAppForm.sql_content = this.editor.session.getValue();
        });
        if (this.newAppForm.sql_content) {
          this.editor.session.setValue(this.newAppForm.sql_content);
        }
      });
      this.renderDraftsData();
    },
    methods: {
      renderDraftsData() {
        if (this.$route.params.detailData_edit) {
          this.aDetail = JSON.parse(this.$route.params.detailData_edit.values);
          this.renderDraftsData1();
        }
      },
      renderDraftsData1() {
        const newAppForm = formKeys.reduce((form, key) => {
          form[key] = this.aDetail[key];
          return form;
        }, {});
        this.newAppForm = Object.assign({}, this.newAppForm, newAppForm);
      },
      // 移除文件
      removeFile() {
        this.fileName = null;
        this.newAppForm.sql_content = "";
        this.isSqlContent = true;
      },
      // 获取实例名
      getSelInstances(change) {
        if (!this.newAppForm.group_name) {
          this.instanceOptions = [];
          return;
        }
        const data = {
          group_name: this.newAppForm.group_name,
          tag_code: "can_write"
        };
        // 获取实例名
        getGroupInstance(data)
          .then(res => {
            this.setInstanceOptions(res.options, change);
          })
          .catch(e => {
            console.error(e);
          });
        // 获取流程
        const query = {
          group_name: this.newAppForm.group_name,
          workflow_type: 2
        };
        getGroupAuditors(query).then(res => {
          this.workflow_auditors_display = res.data.auditors_display;
        });
      },
      setInstanceOptions(options, change) {
        this.list = [];
        this.instanceOptions = [];
        this.instanceOptions = options;
        this.dbOptions = [];
        if (change) {
          this.newAppForm.instance_name = "";
          this.newAppForm.db_name = "";
        }
      },
      // 获取数据库
      handleDb(change) {
        if (!this.newAppForm.instance_name) return;
        getSqlRollBackDb({
          instance_name: this.newAppForm.instance_name,
          resource_type: "database"
        }).then(res => {
          this.list = [];
          this.dbOptions = [];
          this.dbOptions = res.data;
          if (change) {
            this.newAppForm.db_name = "";
          }
        });
        // 选择实例反选项目分组
        searchByInstance({ instance_name: this.newAppForm.instance_name })
          .then(res => {
            for (const item of res.data) {
              if (item.value) {
                this.newAppForm = Object.assign({}, this.newAppForm, {
                  group_name: item.value
                });
                break;
              }
            }
          })
          .catch(e => {
            console.error(e);
          });
      },
      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 10;
        if (!isLt5M) {
          this.$message({
            message: "上传文件大小不能超过 10MB!",
            type: "error"
          });
          return false;
        }
        return isLt5M;
      },
      httpRequest(params) {
        const file = params.file;
        this.fileName = file.name;
        this.isSqlContent = true;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = e => {
          this.newAppForm.sql_content = e.target.result;
          this.list = [];
        };
      },
      // sql美化
      range() {
        const select_sqlContent = this.editor.session.getTextRange(
          this.editor.getSelectionRange()
        );
        let sqlContent = select_sqlContent
          ? select_sqlContent
          : this.editor.session.getValue();
        sqlContent = sqlFormatter.format(sqlContent);
        this.editor.setValue(sqlContent);
        this.editor.clearSelection();
      },
      // sql检测
      handleReset() {
        if (!this.validateForm()) return;
        const query = {
          sql_content: this.editor.session.getValue(),
          instance_name: this.newAppForm.instance_name,
          db_name: this.newAppForm.db_name
        };
        sqlSimplecheck(query)
          .then(res => {
            if (!res || res.status === 1) {
              this.$message.error(res.msg || "出错了");
              return;
            }
            this.list = (res.data && res.data.rows) || [];
            const { CheckErrorCount = 0, CheckWarningCount = 0 } = res.data;
            this.count = { CheckErrorCount, CheckWarningCount };
            if (res.status === 0) {
              this.newAppForm.catogray = res.data.catogray;
              this.newAppForm.steplinestatus =
                res.data.catogray * 1 === 1 ? "1" : "";
            } else {
              this.$message.error(res.errMsg);
            }
            if (this.count.CheckErrorCount) {
              const errSql = res.data.rows.find(sql => sql.errlevel === 2).sql;

              this.editor.find(errSql, {
                backwards: false,
                wrap: false,
                caseSensitive: false,
                wholeWord: false,
                regExp: false
              });
              this.editor.findNext();
              this.editor.findPrevious();
              this.$message.error(
                `${this.count.CheckErrorCount}个SQL语句存在错误，无法提交`
              );
            }
          })
          .catch(e => {
            console.error(e);
          });
      },
      // 新增草稿保存
      saveDraftsForm() {
        if (!this.validateForm()) return;
        let newAppForm = { ...this.newAppForm, fullPath: this.$route.fullPath };
        delete newAppForm.routeParams;
        saveDraftsWorkFlow(this.newAppForm.routeParams.id, newAppForm)
          .then(response => {
            this.$notify.success("草稿保存成功");
            this.routeLeave("/workflow/workflow_list");
          })
          .catch(err => {
            console.error(err);
          });
      },
      // 编辑草稿、提交草稿
      editDraftsForm(status) {
        let newAppForm = { ...this.newAppForm, fullPath: this.$route.path };
        delete newAppForm.routeParams;
        editWorkFlowConfRow(this.newAppForm.routeParams.uuid, newAppForm, status)
          .then(res => {
            this.$notify.success("修改成功");
            // 修改完跳转至我的草稿页面
            this.routeLeave("/workflow/workflow_list");
          })
          .catch(e => {
            console.error(e);
          });
      },
      // 新增sql提交(星辰)
      addXCWorkflow(res) {
        let newAppForm = {
          ...this.newAppForm,
          fullPath: this.$route.path,
          workflow_id: res.workflow_id
        };
        delete newAppForm.routeParams;
        addWorkFlow(this.newAppForm.routeParams.id, newAppForm).then(() => {
          this.$notify.success("提交成功");
          this.routeLeave("/workflow/workflow_list");
        });
      },
      // 新增工单
      sqlSubmit(type) {
        if (!this.validateForm()) return;
        let text = "";
        // if (this.isRapidly) {
        //   text += `急速提交将直接跳过全部审批流程到达DBA执行阶段，DBA将直接执行这些SQL语句，若由此导致任何系统或数据异常，全部责任由发起人承担</br>`;
        // }
        text += `提交的SQL经检测仍存在${this.count.CheckWarningCount}个警告信息和${this.count.CheckErrorCount}个错误信息，请按照平台规范仔细检查！`;
        this.$confirm(text, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          customClass: "sql-workflow-submit-message-box",
          type: "warning"
        })
          .then(() => {
            if (type === "sub1") this.addSQLWorkflow();
            if (type === "sub0") this.editDraftsForm(0);
          })
          .catch(() => { });
      },
      // 创建sql工单和星辰工单
      addSQLWorkflow() {
        const data = {
          sql_content: this.editor.session.getValue(),
          workflow_name: this.newAppForm.workflow_name,
          demand_url: this.newAppForm.demand_url,
          group_name: this.newAppForm.group_name,
          instance_name: this.newAppForm.instance_name,
          db_name: this.newAppForm.db_name,
          run_date_start:
            this.newAppForm.time_range && this.newAppForm.time_range[0],
          run_date_end:
            this.newAppForm.time_range && this.newAppForm.time_range[1],
          is_backup: this.newAppForm.is_backup
        };
        sqlAutoreview(data)
          .then(res => {
            if (!res || res.status === 1) {
              this.$message.error(res.msg || "出错了");
              return;
            }
            if (res.status === 0) {
              this.addXCWorkflow(res);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(e => {
            console.error(e);
          });
      },
      routeLeave(fullPath) {
        this.$store
          .dispatch("tagsView/delView", this.$route)
          .then(({ visitedViews }) => {
            this.$router.push(fullPath);
          });
      },
      validateForm() {
        if (this.count.CheckErrorCount) {
          this.$message.error(
            `${this.count.CheckErrorCount}个SQL语句存在错误，无法提交`
          );
          return false;
        }
        let status;
        this.$refs["elform"].validate(res => {
          status = res;
        });
        if (status) {
          function parseTime(t) {
            const date = new Date(t);
            const str = (v) => {
              return v > 9 ? v : `0${v}`
            }
            const y = date.getFullYear(), m = date.getMonth(), d = date.getDate(), h = date.getHours(), m1 = date.getMinutes(), s = date.getSeconds();
            return `${y}-${str(m + 1)}-${str(d)} ${str(h)}:${str(m1)}:${str(s)}`;
          }
          const time_range = this.newAppForm.time_range;
          const t = [parseTime(time_range[0]), parseTime(time_range[1])]
          this.newAppForm.time_range = t;
        }
        return status;
      },
      resetForm() {
        this.newAppForm = this.$options.data().newAppForm;
        this.count = this.$options.data().count;
        this.list = [];
        this.editor.session.setValue("");
        this.fileName = null;
        this.$refs["elform"].clearValidate();
      },
      getHelpDoc() {
        if (this.help_doc_url)
          this.$router.push("/" + this.help_doc_url.split("/")[2]);
      },
      // 模糊搜索实例
      searchFuzzy(query) {
        const data = {
          instance_name: query,
          tag_code: "can_write"
        };
        this.loading = true;
        instanceFuzzy(data)
          .then(res => {
            this.setInstanceOptions(res.options, true);
            this.loading = false;
          })
          .catch(e => {
            console.error(e);
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/borderLightBlue.scss';

  .content {
    .editor {
      height: 300px;
      margin: 0;
      border: 1px solid #e6ebf5;
      border-radius: 3px;
    }
  }

  .filter-container {
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    border: 1px solid #e6ebf5;

    .head-title {
      padding: 18px 20px;
      border-bottom: 1px solid #e6ebf5;
    }
  }

  .workflow {
    padding: 0px 5px;
    background: #409eff;
    color: #fff;
    border-radius: 3px;
    line-height: 30px;
  }

  .radio-group {
    width: 100%;

    .item {
      margin-top: 10px;
      padding-left: 60px;
      position: relative;

      .el-radio {
        position: absolute;
        left: 0;
        top: 0;
        margin-right: 0;
      }

      .text {
        font-size: 14px;
      }
    }
  }

  .btn-group {
    text-align: right;
    position: relative;
    top: -50px;
  }

  .remrks /deep/ {
    .el-input__count {
      line-height: 1;
    }
  }

  .text-color {
    position: relative;
    left: 8px;
    color: #909399;
  }

  .search-table {
    @extend .border-light-blue;
    margin: 0 auto;
    margin-top: -20px;

    .title {
      padding-bottom: 10px;
    }
  }

  .description-content {
    color: #909399;
    position: relative;
    top: -32px;
  }

  .description-text {
    position: relative;
    /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
    /* height: 20px; */
    width: 100%;
    line-height: 1.2rem;
    padding-left: 130px;
    margin-bottom: -20px;
    color: #f56c6c;
  }

  .error-count {
    position: absolute;
    top: auto;
    bottom: -15px;
    left: 0;
  }

  @media only screen and (min-width: 1400px) {
    .search-table {
      width: 80%;
    }
  }
</style>
<style lang="scss">
  @import "~@/styles/ace-scrollbar.css";

  .sql-workflow-submit-message-box {
    width: 600px;
  }
</style>