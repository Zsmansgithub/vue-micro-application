<template>
  <div class="app-container">
    <div class="search-form">
      <div class="title">
        <div class="text">SQL查询</div>
        <div class="title-select">
          <el-select
            v-model="queryCom"
            placeholder="常用查询"
            @change="queryComm"
            filterable
          >
            <el-option
              v-for="item in starOptions"
              :key="item.id"
              :label="item.alias"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div>
        <el-form
          :model="newAppForm"
          ref="elform"
          :rules="rules"
          class="form-content"
        >
          <div class="ace-content">
            <el-form-item prop="sql_content">
              <pre
                ref="editor"
                id="editor"
                :style="{ height: editorHeight, width: editorWidth }"
                class="editor"
              ></pre>
            </el-form-item>
          </div>
          <div class="items-content">
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
                @change="describetable"
                :dbOptions="dbOptions"
                style="width: 100%"
              ></DBSel>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="newAppForm.tb_name"
                clearable
                placeholder="请选择表结构"
                @change="statement"
                style="width: 100%"
              >
                <el-option
                  v-for="item in tbOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="limit_num">
              <el-select
                v-model="newAppForm.limit_num"
                clearable
                placeholder="请选择返回行数"
                @change="tableData = []"
                style="width: 100%"
              >
                <el-option-group
                  v-for="group in limitOption"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="btn-group">
                <el-button type="primary" @click="range">美化</el-button>
                <!-- <el-button type="warning" style="margin-left: 10px;" @click="doInquire">执行计划</el-button> -->
                <el-button
                  type="success"
                  style="margin-left: 10px;"
                  @click="doInquire"
                  >SQL查询</el-button
                >
              </div>
            </el-form-item>
            <el-form-item>
              <ul>
                <li>支持注释行，可选择指定语句执行，默认执行第一条;</li>
                <li>
                  查询结果行数限制见权限管理，会选择查询涉及表的最小limit值
                </li>
              </ul>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="srarch-result">
      <div class="title"><div class="text">查询结果</div></div>
      <div class="result-content">
        <el-tabs
          v-model="activeName"
          type="card"
          closable
          @tab-remove="removeResultTab"
        >
          <el-tab-pane label="查询历史" name="all">
            <div class="table-filter">
              <div class="filter-left">
                <div>
                  <el-select
                    v-model="listQuery.star"
                    @change="getList"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in isStarOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-select
                    v-model="listQuery.query_log_id"
                    @change="getList"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="item in starOptions"
                      :key="item.id"
                      :label="item.alias"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div>
                  <el-input
                    v-model="listQuery.search"
                    placeholder="搜索"
                  ></el-input>
                </div>
                <div>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="getList"
                    >搜索</el-button
                  >
                  <el-button icon="el-icon-refresh" @click="reset"
                    >重置</el-button
                  >
                </div>
              </div>
              <div class="filter-right">
                <el-dropdown @command="downResult">
                  <el-button type="primary">
                    下载<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="JSON">JSON</el-dropdown-item>
                    <el-dropdown-item command="SQL">SQL</el-dropdown-item>
                    <el-dropdown-item command="CSV">CSV</el-dropdown-item>
                    <el-dropdown-item command="TXT">TXT</el-dropdown-item>
                    <el-dropdown-item command="XML">XML</el-dropdown-item>
                    <el-dropdown-item command="XLSX"
                      >MS-Excel(OpenXML)</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <div>{{ props.row.sqllog }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="props">
                  <i
                    v-if="props.row.favorite"
                    class="el-icon-star-on"
                    style="color: rgb(247, 186, 42);"
                  ></i>
                  <i
                    v-else
                    class="el-icon-star-off"
                    @click="doFavorite(props.row)"
                  ></i>
                  <el-tooltip effect="dark" content="一键查询">
                    <i
                      class="el-icon-search"
                      style="margin-left: 10px;"
                      @click="clickQuery(props.row)"
                    ></i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="用户" width="100" prop="user_display">
              </el-table-column>
              <el-table-column
                label="实例名"
                min-width="200"
                prop="instance_name"
              >
              </el-table-column>
              <el-table-column
                label="DB/schema名称"
                min-width="200"
                prop="db_name"
              >
              </el-table-column>
              <el-table-column label="查询时间" width="150" prop="create_time">
              </el-table-column>
              <el-table-column label="语句" min-width="600" prop="sqllog">
              </el-table-column>
              <el-table-column label="返回行数" width="80" prop="effect_row">
              </el-table-column>
              <el-table-column label="耗时(秒)" width="80" prop="cost_time">
              </el-table-column>
            </el-table>
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              style="padding-top: 5px;margin-top: 10px;"
              @pagination="getList"
            />
          </el-tab-pane>
          <el-tab-pane
            v-for="item of detailData"
            :label="item.tb_name"
            :name="tabName(item)"
            :key="
              `result_${item.instance_name}_${item.db_name}_${item.tb_name}`
            "
          >
            <el-table :data="activeShowResults" style="width: 100%">
              <el-table-column
                v-for="key of item.column_list"
                :key="`column_${key}`"
                :label="key"
                :prop="key"
              >
              </el-table-column>
            </el-table>
            <pagination
              v-show="activeDetail.total > 0"
              :total="activeDetail.total"
              :page.sync="activeDetail.page"
              :limit.sync="activeDetail.limit"
              style="padding-top: 5px;margin-top: 10px;"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { GroupSel, InstanceSel, DBSel } from "./components/dropcomponents";
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-language_tools.js";
import sqlFormatter from "sql-formatter";

import { saveAs } from "file-saver";
import {
  getQuerylog,
  getSqlquery,
  submitInquire,
  getDescribetable,
  favorite
} from "@/api/archery/Inquire";
import { getSqlRollBackDb } from "@/api/archery/sql_workflow";
import mixins from "./components/mixins";
const [editorHeight, editorWidth] = ["490px", "100%"];

export default {
  components: {
    Pagination,
    GroupSel,
    InstanceSel,
    DBSel
  },
  mixins: [mixins],
  data() {
    return {
      newAppForm: {
        sql_content: null,
        tb_name: null,
        instance_name: null,
        db_name: null,
        limit_num: 100
      },
      group_name: undefined,
      editor: null,
      queryCom: null,
      tbOptions: [], // 表结构
      listQuery: {
        star: null,
        search: null,
        query_log_id: "",
        page: 1,
        limit: 20
      },
      tableData: [
        // {
        //     alias: "",
        //     cost_time: "0.003989", // 耗时
        //     create_time: "2021-01-11 10:37:07", // 查询时间
        //     db_name: "archery", // DB/schema名称（数据库）
        //     effect_row: 100, // 返回行数
        //     favorite: false, // 收藏
        //     id: 66,
        //     instance_name: "orchestrator_cluster", //实例名（实例）
        //     sqllog: "select * from sql_workflow limit 100;", // 语句
        //     user_display: "胡健", // 用户
        // }
      ],
      detailData: [
        // {
        //     allResults: [],
        //     showResults: [],
        //     column_list: [],
        //     rows: [],
        //     page: 1,
        //     limit: 20,
        //     tb_name: null,
        // }
      ],
      activeDetail: {
        allResults: [],
        showResults: [],
        column_list: [],
        rows: [],
        page: 1,
        limit: 2,
        tb_name: null
      },
      showDetailData: [],
      total: 0,
      isStarOption: [
        {
          label: "全部",
          value: null
        },
        {
          label: "已收藏",
          value: true
        },
        {
          label: "未收藏",
          value: false
        }
      ],
      offsetOption: [
        {
          label: "全部",
          value: "全部"
        }
      ],
      limitOption: [
        {
          label: "返回行数:",
          options: [
            {
              label: "100",
              value: 100
            },
            {
              label: "500",
              value: 500
            },
            {
              label: "1000",
              value: 1000
            },
            {
              label: "max(最大行数)",
              value: 0
            }
          ]
        }
      ],
      starOptions: [],
      editorHeight: editorHeight,
      editorWidth: editorWidth,
      rules: {
        sql_content: { required: true, message: "请填写或上传sql" },
        instance_name: [{ required: true, message: "请选择实例名" }],
        db_name: [{ required: true, message: "请选择DB/schema名称" }],
        limit_num: [{ required: true, message: "请选择返回行数" }]
      },
      activeName: "all"
    };
  },
  computed: {
    activeShowResults({ activeDetail }) {
      const { page, limit, allResults } = activeDetail;
      const start = (page - 1) * limit;
      return allResults.slice(start, start + limit);
    }
  },
  watch: {
    activeName(newValue, oldValue) {
      const i = this.detailData.find(item => this.tabName(item) === newValue);
      if (i) {
        this.activeDetail = i;
      }
    }
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
        this.newAppForm.sql_content = this.editor.session.getValue();
      });
      if (this.newAppForm.sql_content) {
        this.editor.session.setValue(this.newAppForm.sql_content);
      }
    });

    this.getList();
    this.getSqlList();
  },
  methods: {
    // 获取表结构
    describetable() {
      const data = {
        instance_name: this.newAppForm.instance_name,
        db_name: this.newAppForm.db_name,
        resource_type: "table",
        query_all: 1
      };
      getSqlRollBackDb(data)
        .then(res => {
          this.tbOptions = [];
          this.tbOptions = res.data;
          this.newAppForm.tb_name = "";
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 获取语句
    statement() {
      const { instance_name, db_name, tb_name } = this.newAppForm;
      const d = this.detailData.find(
        item =>
          item.tb_name === tb_name &&
          item.db_name === db_name &&
          item.instance_name === instance_name
      );
      if (d) {
        this.activeDetail = d;
        this.activeName = `tab_${instance_name}_${db_name}_${tb_name}`;
        return;
      }
      const data = {
        instance_name: instance_name,
        db_name: db_name,
        tb_name: tb_name,
        schema_name: ""
      };
      getDescribetable(data)
        .then(res => {
          const column_list = res.data.column_list.slice(1);
          const args = {
            column_list,
            data: res.data,
            statement: true,
            tabNameStr: {
              instance_name,
              db_name,
              tb_name
            }
          };
          this.formatData(args);
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 转换数据格式
    formatData({ column_list, data, statement, tabNameStr }) {
      const total = data.rows && data.rows.length ? data.rows.length : 0;
      const allResults = total
        ? data.rows.reduce((list, val) => {
            const item = column_list.reduce((obj, key, idx) => {
              obj[key] = statement ? val[idx + 1] : val[idx];
              return obj;
            }, {});
            list.push(item);
            return list;
          }, [])
        : [];
      const resItem = {
        allResults: allResults,
        column_list: column_list,
        page: 1,
        limit: 20,
        total: total,
        db_name: tabNameStr.db_name,
        instance_name: tabNameStr.instance_name,
        tb_name: tabNameStr.tb_name
      };
      const r = Object.assign({}, data, resItem);
      this.activeDetail = r;
      this.activeName = this.tabName(tabNameStr);
      this.detailData.push(r);
    },
    // 常用查询
    queryComm() {
      const query = {
        star: "",
        search: "",
        query_log_id: this.queryCom,
        offset: 0,
        limit: 20
      };
      getQuerylog(query)
        .then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          if (res.rows && res.rows[0]) {
            this.clickQuery(res.rows[0]);
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 一键查询
    clickQuery(item) {
      const limit =
        item.sqllog
          .split("limit")[1]
          .slice(0, -1)
          .trim() * 1;
      const newAppForm = {
        tb_name: "",
        instance_name: item.instance_name,
        db_name: item.db_name,
        limit_num: [100, 500, 1000, 0].includes(limit) ? limit : 100
      };
      this.editor.session.setValue(item.sqllog);
      this.newAppForm = Object.assign({}, this.newAppForm, newAppForm);
      this.grDbOptions();
      this.describetable();
      this.$nextTick(() => {
        this.doInquire();
      });
    },
    // SQL查询、执行计划
    doInquire() {
      this.$refs["elform"].validate(isPass => {
        if (isPass) {
          submitInquire(this.newAppForm)
            .then(res => {
              if (!res || res.status === 1) {
                this.$message.error(res.msg || "出错了");
                return;
              }
              const { instance_name, db_name } = this.newAppForm;
              const column_list = (res.data && res.data.column_list) || [];
              let len = this.detailData.length + 1;
              let tb_name = null;
              while (!tb_name) {
                const name = `执行结果${len}`;
                if (this.detailData.some(item => item.tb_name === name)) {
                  len++;
                } else {
                  tb_name = name;
                }
              }
              const args = {
                column_list,
                data: res.data,
                statement: false,
                tabNameStr: {
                  instance_name,
                  db_name,
                  tb_name
                }
              };
              this.formatData(args);
            })
            .catch(e => {
              console.error(e);
            });
        }
      });
    },
    // 收藏数据
    getSqlList() {
      getSqlquery()
        .then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          this.starOptions = res.data || [];
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 查询历史
    getList() {
      const query = {
        star: this.listQuery.star,
        search: this.listQuery.search,
        query_log_id: this.listQuery.query_log_id,
        offset: this.listQuery.limit * (this.listQuery.page - 1),
        limit: this.listQuery.limit
      };
      getQuerylog(query)
        .then(res => {
          this.total = res.total;
          this.tableData = res.rows;
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 收藏
    doFavorite(row) {
      this.$prompt("", "收藏语句", {
        confirmButtonText: "收藏",
        inputPlaceholder: "请输入语句别名",
        inputErrorMessage: "请输入语句别名",
        inputValidator: val => !!val,
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          const data = {
            query_log_id: row.id,
            star: "true",
            alias: value
          };
          favorite(data)
            .then(res => {
              this.$message.success("收藏成功");
              this.getList();
              this.getSqlList();
            })
            .catch(e => {
              console.error(e);
            });
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 下载
    downResult(type) {
      if (!this.tableData.length) return;
      const head = [
        "操作",
        "用户",
        "实例",
        "数据库",
        "查询时间",
        "语句",
        "返回行数",
        "耗时(秒)"
      ];
      switch (type) {
        case "TXT":
        case "JSON":
          const dataJSON = this.tableData.reduce((list, val) => {
            const i = {
              操作: "",
              用户: val.user_display,
              实例: val.instance_name,
              数据库: val.db_name,
              查询时间: val.create_time,
              语句: val.sqllog,
              返回行数: val.effect_row,
              "耗时(秒)": val.cost_time
            };
            list.push(i);
            return list;
          }, []);
          const json = {
            header: [head],
            data: dataJSON
          };
          const blob = new Blob([JSON.stringify(json)], {
            type: "application/json"
          });
          type === "JSON"
            ? saveAs(blob, "查询历史.json")
            : saveAs(blob, "查询历史.txt");
          break;
        case "XLSX":
          const dataXLSX = this.tableData.reduce((list, val) => {
            const i = [
              "",
              val.user_display,
              val.instance_name,
              val.db_name,
              val.create_time,
              val.sqllog,
              val.effect_row,
              val.cost_time
            ];
            list.push(i);
            return list;
          }, []);
          import("@/vendor/Export2Excel").then(excel => {
            excel.export_json_to_excel({
              header: head,
              data: dataXLSX,
              filename: "查询历史",
              autoWidth: true,
              bookType: "xlsx"
            });
          });
          break;
        case "SQL":
          const dataSQL = this.tableData.reduce((list, val) => {
            const i = `'', '${val.user_display}', '${val.instance_name}', '${val.db_name}', '${val.create_time}', '${val.sqllog}', '${val.effect_row}', '${val.cost_time}'`;
            list += i;
            return list;
          }, "");
          const SQLTXT =
            "INSERT INTO `Table` (`操作`,`用户`,`实例`,`数据库`,`查询时间`,`语句`,`返回行数`,`耗时(秒)`) VALUES (" +
            dataSQL +
            ")";
          const blobSQL = new Blob([SQLTXT], {
            type: "text/plain;charset=utf-8"
          });
          saveAs(blobSQL, "查询历史.sql");
          break;
        case "CSV":
          const dataCSV = this.tableData.reduce((str, val) => {
            const i = `,${val.user_display},${val.instance_name},${val.db_name},${val.create_time},${val.sqllog},${val.effect_row},${val.cost_time}\r`;
            str += i;
            return str;
          }, "");
          const CSVTXT = head.join(",") + "\r" + dataCSV;
          const blobCSV = new Blob([CSVTXT], {
            type: "text/plain;charset=utf-8"
          });
          saveAs(blobCSV, "查询历史.csv");
          break;
        case "XML":
          const contentKey = [
            "user_display",
            "instance_name",
            "db_name",
            "create_time",
            "sqllog",
            "effect_row",
            "cost_time"
          ];
          const headTXT = head.reduce((str, val) => {
            str += `<field>${val}</field>`;
            return str;
          }, "");
          const contentTXT = this.tableData.reduce((str, val, idx) => {
            const i = `<row id="${++idx}"><column-1></column-1>${contentKey.reduce(
              (strc, k, idx) => {
                idx = idx + 2;
                strc += `<column-${idx}>${val[k]}</column-${idx}>`;
                return strc;
              },
              ""
            )}</row>`;
            str += i;
            return str;
          }, "");
          const dataXML = `<?xml version="1.0" encoding="utf-8"?><tabledata><fields>${headTXT}</fields><data>${contentTXT}</data></tabledata>`;
          const blobXML = new Blob([dataXML], {
            type: "text/xml;charset=utf-8"
          });
          saveAs(blobXML, "查询历史.xml");
          break;
      }
    },
    removeResultTab(tabName) {
      if (tabName === "all") return;
      const idx = this.detailData.findIndex(
        item => this.tabName(item) === tabName
      );
      this.detailData.splice(idx, 1);
      if (idx === 0) {
        this.activeName = "all";
      } else {
        const item = this.detailData[idx - 1];
        this.activeDetail = item;
        this.activeName = this.tabName(item);
      }
    },
    tabName(item) {
      return `tab_${item.instance_name}_${item.db_name}_${item.tb_name}`;
    },
    reset() {
      this.listQuery = this.$options.data().listQuery;
      this.$refs["elform"].clearValidate();
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
$aceHeight: 490px;
.title {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
  .text {
    line-height: 30px;
    margin-right: 10px;
  }
}
.search-form {
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  .form-content {
    display: flex;
    padding: 20px;
    .ace-content {
      flex: 1;
      padding-right: 30px;
      min-width: 600px;
      .editor {
        height: $aceHeight;
        margin: 0;
        border: 1px solid #e6ebf5;
        border-radius: 3px;
      }
    }
    .items-content {
      flex: 0 0 300px;
    }
  }
}
.srarch-result {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  .table-filter /deep/ {
    display: flex;
    padding: 10px;
    .filter-left {
      flex: 1;
      display: flex;
      justify-content: start;
      & > div {
        margin-right: 10px;
      }
    }
    .filter-right {
      flex: 0 0 300px;
      text-align: right;
    }
  }
  .result-content {
    padding: 20px;
  }
}
</style>
<style lang="scss">
@import "~@/styles/ace-scrollbar.css";
</style>
