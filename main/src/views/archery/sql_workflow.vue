<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <el-select
            v-model="listQuery.navStatus"
            clearable
            @change="handleFilter"
            placeholder="状态"
            style="width: 150px;"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.instance_id"
            clearable
            @change="handleFilter"
            placeholder="实例名"
            style="width: 170px;"
          >
            <el-option
              v-for="item in instanceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.group_id"
            clearable
            @change="handleFilter"
            placeholder="项目名称"
            style="width: 110px;"
          >
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="listQuery.time_range"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="handleFilter"
            value-forma="yyyy-MM-dd"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.search"
            clearable
            @change="handleFilter"
            placeholder="模糊查询"
          ></el-input>
        </el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="handleReset"
          >重置
        </el-button>
        <!-- <el-button class="filter-item" icon="el-icon-plus" type="primary" plain @click="add_dialog">
          SQL提交
        </el-button> -->
      </el-form>
    </div>
    <el-table :data="list" border stripe highlight-current-row>
      <el-table-column label="工单名称" align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="send_sql(scope.row)">{{
            scope.row.workflow_name
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.syntax_type === 0">其他</span>
          <span v-else-if="scope.row.syntax_type === 1">DDL</span>
          <span v-else-if="scope.row.syntax_type === 2">DML</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_display }}</span>
        </template>
      </el-table-column>
      <el-table-column label="星辰审批状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.cur_operator || "--" }}</el-tag>
        </template></el-table-column
      >
      <el-table-column label="工单状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="status[scope.row.status].type">{{
            status[scope.row.status].text
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="备份" width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_backup === true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="发起时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标实例">
        <template slot-scope="scope">
          <span>{{ scope.row.instance__instance_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库">
        <template slot-scope="scope">
          <span>{{ scope.row.db_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组">
        <template slot-scope="scope">
          <span>{{ scope.row.group_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志" width="90">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="handleOpen(scope.row.id)"
            >操作日志</a
          >
        </template>
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
    <el-dialog
      title="操作日志"
      :visible.sync="dialogCreateAppVisible"
      style="text-align: left;"
      width="60%"
    >
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
    </el-dialog>
  </div>
</template>

<script>
import {
  getlist,
  getSqlLog,
  getSqlWorkflowQuery
} from "@/api/archery/sql_workflow";
import Pagination from "@/components/Pagination";
import resize from "@/components/Charts/mixins/resize";
import sessionListQuery from "@/components/mixins/sessionListQuery";
// import {mapGetters} from 'vuex/types'

export default {
  mixins: [resize, sessionListQuery],
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        // limit: params.limit,
        // offset: params.offset,
        navStatus: undefined,
        instance_id: undefined,
        group_id: undefined,
        start_date: undefined,
        end_date: undefined,
        search: undefined
      },
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
      list: null,
      log_list: null,
      total: 0,
      dialog_title: "",
      listLoading: true,
      dialogCreateAppVisible: false,
      dialogEditAppVisible: false,
      dialogAddVisible: false,
      dialogEditVisible: false,
      adminrole: false,
      statusOptions: [],
      instanceOptions: [],
      groupOptions: [],
      status: {
        workflow_finish: {
          type: "success",
          text: "已正常结束"
        },
        workflow_review_pass: {
          type: "success",
          text: "审核通过"
        },
        workflow_abort: {
          type: "danger",
          text: "人工终止流程"
        },
        workflow_manreviewing: {
          type: "",
          text: "等待审核人审核"
        },
        workflow_timingtask: {
          type: "warning",
          text: "定时执行"
        },
        workflow_executing: {
          type: "warning",
          text: "执行中"
        },
        workflow_autoreviewwrong: {
          type: "danger",
          text: "自动审核不通过"
        },
        workflow_exception: {
          type: "danger",
          text: "执行有异常"
        },
        workflow_queuing: {
          type: "",
          text: "排队中"
        }
      },
      confirmOptions: {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "el-button--danger",
        type: "warning"
      }
    };
  },
  created() {
    // this.adminrole = this.roles.includes('domain_admin')
    this.getList();
    getSqlWorkflowQuery().then(res => {
      this.instanceOptions = res.instance;
      this.groupOptions = res.resource_group;
      this.statusOptions = res.status_list;
    });
  },
  computed: {
    // ...mapGetters(['roles', 'name']),
  },
  methods: {
    send_sql(row) {
      this.$router.push({
        name: "sql_workflow_detail",
        query: {
          params: row.id
        }
      });
    },
    handleOpen(id) {
      this.dialogCreateAppVisible = true;
      getSqlLog({ workflow_id: id, workflow_type: 2 }).then(res => {
        this.log_list = res.rows;
      });
    },
    add_dialog() {
      this.$router.push({
        name: "sql_workflow_submit"
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
        // time_range: undefined,
        search: undefined
      };
      this.getList();
    },
    getList() {
      this.listLoading = true;
      if (this.listQuery.time_range) {
        this.listQuery.start_date = this.listQuery.time_range[0].split("T")[0];
        this.listQuery.end_date = this.listQuery.time_range[1].split("T")[0];
      }
      getlist(this.listQuery).then(response => {
        this.list = response.rows;
        this.total = response.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 10);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    }
  }
};
</script>

<style scoped></style>
