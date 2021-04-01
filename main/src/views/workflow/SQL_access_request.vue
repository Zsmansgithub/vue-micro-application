<template>
  <div class="app-container">
    <workflow-title
      :name="newAppForm.routeParams && newAppForm.routeParams.name"
      :help_doc_url="help_doc_url"
    />

    <div>
      <el-form
        ref="newAppForm"
        :model="newAppForm"
        :rules="rules"
        label-width="150px"
        class="newAppForm"
        style="width:100%"
      >
        <el-row>
          <el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="访问时间范围" prop="timeRange">
              <range-date
                v-model="newAppForm.timeRange"
                type="date"
                class="form-item"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width: 100%;"
              />
            </el-form-item> </el-col
          ><el-col :span="12" class="col-1400-8 col-1400-offset-2">
            <el-form-item label="限制行数" prop="limit_num">
              <el-select
                v-model="newAppForm.limit_num"
                clearable
                filterable
                allow-create
              >
                <el-option label="100" :value="100"></el-option>
                <el-option label="500" :value="500"></el-option>
                <el-option label="1000" :value="1000"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="col-1400-16 col-1400-offset-2">
            <el-form-item prop="dbs" label="数据库信息">
              <el-table :data="newAppForm.dbs">
                <el-table-column label="数据库" align="center" min-width="10">
                  <template slot-scope="prop">
                    <el-cascader
                      v-model="prop.row.db"
                      :options="dbOptions"
                      clearable
                      :props="{ expandTrigger: 'hover' }"
                      style="width: 100%;"
                    ></el-cascader>
                  </template>
                </el-table-column>
                <el-table-column label="表名" align="center" min-width="10">
                  <template slot-scope="prop">
                    <el-input
                      v-model="prop.row.table"
                      clearable
                      placeholder="输入表名多个表名以,分隔"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="2">
                  <template slot-scope="prop">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      style="padding:2px;"
                      @click="removeDB(prop.$index)"
                    /><el-button
                      type="primary"
                      icon="el-icon-plus"
                      v-if="prop.$index === newAppForm.dbs.length - 1"
                      circle
                      style="padding:2px;"
                      @click="addDB"
                      :disabled="newAppForm.dbs.length > 9"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col
          style="text-align: right"
          :span="24"
          class="col-1400-16 col-1400-offset-2"
        >
          <el-button
            v-if="
              this.newAppForm.routeParams && this.newAppForm.routeParams.uuid
            "
            type="primary"
            @click="submitEditForm(1)"
            :loading="buttondisabled"
            >保存草稿</el-button
          >
          <el-button
            v-else
            type="primary"
            @click="saveDraftsForm"
            :loading="buttondisabled"
            >保存草稿</el-button
          >
          <el-button @click="resetForm('newAppForm')">重置</el-button>
          <el-button
            v-if="
              this.newAppForm.routeParams && this.newAppForm.routeParams.uuid
            "
            type="primary"
            @click="applyDB(true)"
            :loading="buttondisabled"
            >提交草稿</el-button
          >
          <el-button
            v-else
            type="primary"
            @click="applyDB(false)"
            :loading="buttondisabled"
            >立即提交</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import RangeDate from "./components/RangeDate";
import workflowTitle from "./components/Workflow_title";
import {
  addWorkFlow,
  editWorkFlowConfRow,
  saveDraftsWorkFlow
} from "@/api/workflow/app_manage";
import sessionNewAppForm from "@/components/mixins/sessionNewAppForm";
import FormMixins from "./components/mixins/FormMixins";
import { renderDraftsData1, resetForm } from "./components/mixins/renderdata1";
import { getAllDBs, applyforprivileges } from "@/api/archery/sql_workflow";

const dbSef = {
  db: [],
  table: undefined
};
export default {
  mixins: [sessionNewAppForm, FormMixins],
  components: { RangeDate, workflowTitle },
  data() {
    const validateDBs = (rule, value, callback) => {
      if (value instanceof Array) {
        for (const item of value) {
          if (!item.db instanceof Array || !item.db.length) {
            callback(new Error("请选择数据库"));
            break;
          }
          if (!item.table) {
            callback(new Error("请填写表名"));
            break;
          }
          if (/,,{1,}/.test(item.table)) {
            callback(new Error("表名格式不正确"));
            break;
          }
        }
        callback();
      } else {
        callback(new Error("请选择数据库"));
      }
    };
    const validateLimit = (rule, value, callback) => {
      if (/^[1-9]\d*$/.test(value)) {
        callback();
      } else {
        callback(new Error("请填写正确行数"));
      }
    };
    const rules = {
      timeRange: {
        required: true,
        message: "访问时间范围不能为空",
        trigger: "change"
      },
      limit_num: [
        { required: true, message: "请填写行数", trigger: "blur" },
        { validator: validateLimit, trigger: "blur" }
      ],
      dbs: [
        { required: true, message: "请选择数据库", trigger: "blur" },
        { validator: validateDBs, trigger: "blur" }
      ]
    };
    return {
      newAppForm: {
        timeRange: undefined, // 日期
        limit_num: undefined, // 行数
        dbs: [{ ...dbSef }] // 数据库
      },
      rules: Object.freeze(rules),
      help_doc_url: undefined,
      buttondisabled: false,
      dbOptions: [],
      aDetail: {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取所有db数据
      getAllDBs()
        .then(res => {
          if (res) {
            try {
              const { data = [] } = res;
              const instences = Object.keys(data);
              const options = instences.map(val => {
                const children = data[val].map(v => {
                  return {
                    label: v,
                    value: v
                  };
                });
                return {
                  label: val,
                  value: val,
                  children
                };
              });
              this.dbOptions = options;
            } catch (e) {
              console.error(e);
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    renderDraftsData1,
    resetForm,
    // 数据库删除行
    removeDB(idx) {
      if (this.newAppForm.dbs.length > 1) {
        const { dbs } = this.newAppForm;
        dbs.splice(idx, 1);
        this.newAppForm.dbs = dbs;
      } else {
        this.newAppForm.dbs = [{ ...dbSef }];
      }
    },
    // 数据库新增行
    addDB() {
      const { dbs } = this.newAppForm;
      dbs.push({ ...dbSef });
      this.newAppForm.dbs = dbs;
    },
    // 校验填写的数据库数据
    applyDB(type = false) {
      this.$refs["newAppForm"].validate(valid => {
        if (valid) {
          let applyData = this.newAppForm.dbs.reduce((data, val) => {
            data[val.db[0]] = {
              [val.db[1]]: val.table.split(",")
            };
            return data;
          }, {});
          const query = {
            title: "",
            priv_type: "",
            valid_date: "",
            limit_num: "",
            apply_data: JSON.stringify(applyData)
          };
          applyforprivileges(query)
            .then(res => {
              if (res && res.status * 1 === 0) {
                if (type) {
                  this.submitEditForm(0);
                } else {
                  this.submitForm();
                }
              } else {
                this.$message.error(
                  (res && res.msg) || "所填数据库数据校验失败"
                );
              }
            })
            .catch(e => {
              console.error(e);
            });
        }
      });
    },
    // 立即提交
    submitForm() {
      this.$refs["newAppForm"].validate(valid => {
        if (valid) {
          this.buttondisabled = true;
          addWorkFlow(this.newAppForm.routeParams.id, {
            ...this.newAppForm,
            fullPath: this.$route.path
          })
            .then(res => {
              this.notify("提交成功");
              this.routeLeave("/workflow/workflow_list");
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          this.validateFalse();
          return false;
        }
      });
    },
    // 修改草稿、提交草稿
    submitEditForm(status) {
      this.$refs["newAppForm"].validate(valid => {
        if (valid) {
          this.buttondisabled = true;
          editWorkFlowConfRow(
            this.newAppForm.routeParams.uuid,
            { ...this.newAppForm, fullPath: this.$route.path },
            status
          )
            .then(res => {
              this.notify("修改成功");
              this.routeLeave("/workflow/workflow_list");
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          this.validateFalse();
          return false;
        }
      });
    },
    // 新增草稿保存
    saveDraftsForm() {
      this.$refs["newAppForm"].validate(valid => {
        if (valid) {
          this.buttondisabled = true;
          saveDraftsWorkFlow(this.newAppForm.routeParams.id, {
            ...this.newAppForm,
            fullPath: this.$route.fullPath
          })
            .then(response => {
              this.notify("草稿保存成功");
              this.routeLeave("/workflow/workflow_list");
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          this.validateFalse();
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  width: 100%;
}
</style>
