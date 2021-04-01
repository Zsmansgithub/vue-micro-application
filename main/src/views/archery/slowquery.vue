<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <el-select v-model="group_name" clearable filterable placeholder="请选择项目" @change="getSelInstances"
            style="width: 100%">
            <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.instance_name" placeholder="请选择实例" :loading="loading" clearable remote
            filterable :remote-method="searchFuzzy" @change="handleDb" style="width: 100%">
            <el-option-group v-for="group in instanceOptions" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择数据库" clearable filterable v-model="listQuery.db_name">
            <el-option v-for="item in dbOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.time_range" type="daterange" align="right" unlink-panels
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
            @change="handleFilter" value-forma="yyyy-MM-dd" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.search" clearable @change="handleFilter" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="gotool">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
          @click="handleReset">重置
        </el-button>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="慢日志统计" name="statistics">
        <el-table ref="table" @row-click="opneRow" :data="list" border @expand-change="expandRow" stripe
          highlight-current-row>
          <el-table-column type="expand" align="center" width="60">
            <template slot-scope="props">
              <div style="display: flex;">
                <div class="report-sql">
                  <b>SQL内容：</b>{{ props.row.SQLText }}
                </div>
                <div :ref="`${props.row.SQLId}`" class="report-chart"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="日志统计时间" width="180" prop="CreateTime" />
          <el-table-column label="数据库名" width="180" prop="DBName" />
          <el-table-column label="SQL语句" max-width="200">
            <template slot-scope="scope">
              <el-link :underline="false" @click="goDetail(scope.row.SQLId)" type="primary" class="text-ellipsis">{{
                scope.row.SQLText }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="执行总次数" width="120" prop="MySQLTotalExecutionCounts" />
          <el-table-column label="执行总时长(秒)" width="120" prop="MySQLTotalExecutionTimes" />
          <el-table-column label="平均执行时长(秒)" width="140" prop="QueryTimeAvg" />
          <el-table-column label="扫描总行数" width="120" prop="ParseTotalRowCounts" />
          <el-table-column label="返回总行数" width="120" prop="ReturnTotalRowCounts" />
        </el-table>
        <pagination v-show="queryPage.total > 0" :total="queryPage.total" :page.sync="queryPage.page"
          :limit.sync="queryPage.limit" style="padding-top: 5px;margin-top: 10px;" @pagination="queryList" />
      </el-tab-pane>
      <el-tab-pane label="慢日志明细" name="detail">
        <el-table :data="listDetail" border stripe highlight-current-row>
          <el-table-column type="expand" align="center" width="60">
            <template slot-scope="props">
              <div><b>SQL语句：</b>{{ props.row.SQLText }}</div>
            </template>
          </el-table-column>
          <el-table-column label="执行开始时间" width="180" prop="CreateTime" />
          <el-table-column label="数据库名" width="180" prop="DBName" />
          <el-table-column label="用户名" width="180" prop="HostAddress" />
          <el-table-column label="SQL语句" max-width="200">
            <template slot-scope="scope">
              <el-link :underline="false" @click="gotool" type="primary" class="text-ellipsis">{{ scope.row.SQLText }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="执行总次数" width="120" prop="MySQLTotalExecutionCounts" />
          <el-table-column label="执行时长(95%)" width="120" prop="QueryTimePct95" />
          <el-table-column label="执行总时长(秒)" width="120" prop="MySQLTotalExecutionTimes" />
          <el-table-column label="锁定总时长(秒)" width="120" prop="LockTimes" />
          <el-table-column label="解析总行数" width="120" prop="ParseRowCounts" />
          <el-table-column label="返回总行数" width="120" prop="ReturnTotalRowCounts" />
        </el-table>
        <pagination v-show="queryDetailPage.total > 0" :total="queryDetailPage.total" :page.sync="queryDetailPage.page"
          :limit.sync="queryDetailPage.limit" style="padding-top: 5px;margin-top: 10px;"
          @pagination="queryDetailList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {
    getSqlWorkflow,
    getGroupInstance,
    getSqlRollBackDb,
    instanceFuzzy,
    searchByInstance,
    slowqueryList,
    slowqueryDetailList,
    slowqueryReport
  } from "@/api/archery/sql_workflow";
  import Pagination from "@/components/Pagination";
  export default {
    components: { Pagination },
    data() {
      return {
        listQuery: {
          instance_name: undefined,
          db_name: undefined,
          StartTime: undefined,
          EndTime: undefined,
          time_range: undefined,
          search: undefined
        },
        queryPage: {
          limit: 20,
          page: 1,
          total: 0
        },
        queryDetailPage: {
          limit: 20,
          page: 1,
          total: 0,
          SQLId: undefined
        },
        listLoading: false,
        group_name: undefined,
        groupOptions: [],
        instanceOptions: [],
        dbOptions: [],
        list: [],
        listDetail: [],
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        activeName: "statistics",
        openRows: [],
        loading: false
      };
    },
    mounted() {
      this.listQuery.time_range = [Date.now(), Date.now()];
      // 获取组
      getSqlWorkflow().then(res => {
        this.groupOptions = res.data;
      });
    },
    methods: {
      // 详情跳转
      goDetail(SQLId) {
        this.queryDetailPage.SQLId = SQLId;
        this.queryDetailPage.page = 1;
        this.queryDetailList();
        this.activeName = "detail";
      },
      // 优化建议
      gotool() {
        this.$router.push("optimization_tool");
      },
      // 获取实例名
      getSelInstances() {
        if (!this.group_name) {
          this.instanceOptions = [];
          return;
        }
        const data = {
          group_name: this.group_name,
          tag_code: "can_write"
        };
        // 获取实例名
        getGroupInstance(data)
          .then(res => {
            this.instanceOptions = res.options;
            this.listQuery.instance_name = "";
            this.dbOptions = [];
            this.listQuery.db_name = undefined;
          })
          .catch(e => {
            console.error(e);
          });
      },
      // 获取数据库
      handleDb() {
        if (!this.listQuery.instance_name) return;
        getSqlRollBackDb({
          instance_name: this.listQuery.instance_name,
          resource_type: "database"
        }).then(res => {
          this.dbOptions = [];
          this.listQuery.db_name = "";
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          this.dbOptions = res.data || [];
        });
        // 选择实例反选项目分组
        searchByInstance({ instance_name: this.listQuery.instance_name })
          .then(res => {
            for (const item of res.data) {
              if (item.value) {
                this.group_name = item.value;
                break;
              }
            }
          })
          .catch(e => {
            console.error(e);
          });
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
            this.instanceOptions = res.options || [];
            this.dbOptions = [];
            this.listQuery.db_name = undefined;
            this.group_name = undefined;
            this.loading = false;
          })
          .catch(e => {
            console.error(e);
          });
      },
      getList() {
        this.listLoading = true;
        if (!this.listQuery.instance_name) {
          this.$message.error("请先选择实例");
          return;
        }
        if (this.listQuery.time_range) {
          const StartTime = this.$utils.time_trans
            .timestampToTimeStr(this.listQuery.time_range[0])
            .split(" ")[0];
          const EndTime = this.$utils.time_trans
            .timestampToTimeStr(this.listQuery.time_range[1])
            .split(" ")[0];
          this.listQuery.StartTime = StartTime;
          this.listQuery.EndTime = EndTime;
        }
        this.queryList();
        this.queryDetailList();
      },
      queryList() {
        const query = Object.assign(this.listQuery, this.queryPage);
        slowqueryList(query).then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          this.list = res.rows || [];
          this.queryPage.total = res.total || 0;
          this.listLoading = false;
        });
      },
      queryDetailList() {
        const query = Object.assign(this.listQuery, this.queryDetailPage);
        slowqueryDetailList(query).then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          this.listDetail = res.rows || [];
          this.queryDetailPage.total = res.total || 0;
          this.listLoadingDetail = false;
        });
      },
      handleFilter() {
        this.queryPage.page = 1;
        this.queryDetailPage.page = 1;
        this.getList();
      },
      handleReset() {
        this.listQuery = this.$options.data().listQuery;
        this.queryPage = this.$options.data().queryPage;
        this.queryDetailPage = this.$options.data().queryDetailPage;
        this.getList();
      },
      expandRow(row, expandRow) {
        this.openRows = expandRow;
        if (expandRow.some(item => item.SQLId === row.SQLId))
          this.opneRow(row, "trogger");
      },
      opneRow(row, t) {
        const isOpen = !this.openRows.some(i => {
          return i.SQLId === row.SQLId;
        });
        if (isOpen || t === "trogger") {
          slowqueryReport(row.SQLId)
            .then(res => {
              if (!res || res.status === 1) {
                this.$message.error(res.msg || "出错了");
                return;
              }
              if (res.status === 0) {
                this.$refs[row.SQLId].innerHTML = "";
                const data = res.data.replace(
                  "/static/echarts/echarts.min.js",
                  "https://lib.baomitu.com/echarts/5.0.2/echarts.min.js"
                );

                let iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.height = "100%";
                iframe.style = "border: 0;";
                iframe.src =
                  "data:text/html;charset=utf-8," + window.escape(data);
                this.$refs[row.SQLId].appendChild(iframe);
              } else {
                this.$message.error(res.msg || "出错了");
              }
            })
            .catch(e => {
              console.error(e);
            });
        }
        if (t !== "trogger") this.$refs["table"].toggleRowExpansion(row, isOpen);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '@/styles/borderLightBlue.scss';

  .text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .report-sql {
    flex: 1;
    padding-right: 20px;
  }

  .report-chart {
    @extend .border-light-blue;
    flex: 2;
    width: 100%;
    min-width: 600px;
    min-height: 420px;
  }
</style>