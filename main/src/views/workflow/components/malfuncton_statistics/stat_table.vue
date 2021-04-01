<template>

  <div>
    <el-table v-loading="false" :data="table_data" border stripe highlight-current-row
              ref="multipleTable" tooltip-effect="dark" :header-cell-style="headClass">

      <el-table-column label="故障分类" align="center" show-overflow-tooltip width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.subdivision }}</span>
        </template>
      </el-table-column>
      <el-table-column label="故障次数" align="center" show-overflow-tooltip sortable prop="all_count">
        <template slot-scope="scope">
          <span>{{ scope.row.all_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已完成" align="center" show-overflow-tooltip prop="finished_count" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.finished_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未完成" align="center" show-overflow-tooltip prop="unfinished_count" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.unfinished_count }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="sum_duration" sortable :formatter="formatDate">
        <template slot-scope="scope" slot="header">
          总时长
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">未结束、无影响记录不做统计</div>
            <i class="el-icon-question" style="color:dodgerblue"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.sum_duration || 0)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="avg_duration" sortable>
        <template slot-scope="scope" slot="header">
          平均时长
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">未结束、无影响记录不做统计</div>
            <i class="el-icon-question" style="color:dodgerblue"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.avg_duration || 0)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="无影响" align="center" show-overflow-tooltip prop="灾难" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.无影响 || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="轻微" align="center" show-overflow-tooltip prop="轻微" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.轻微 || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一般" align="center" show-overflow-tooltip prop="一般" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.一般 || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="严重" align="center" show-overflow-tooltip prop="严重" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.严重 || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="灾难" align="center" show-overflow-tooltip prop="灾难" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.灾难 || 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="趋势图" align="center">
        <template slot-scope="scope">
          <el-button type="primary" circle @click="clickDetailButtom(scope.row)">
            <svg-icon icon-class="data1" style="width: 16px; height:16px;color:white;"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="line_chart_title" :visible.sync="show_detail_dialog" width="60%" top="30px">
      <line_chart :series="series"></line_chart>
    </el-dialog>
  </div>
</template>


<script>
  import Pagination from '@/components/Pagination'
  import line_chart from "./lineChart"
  import {getSubdivisionDetail} from '@/api/workflow/malfunction_statistics'

  export default {
    components: {Pagination, line_chart},
    props: {
      table_data: {default: []},
      time_range: {default: [new Date().getTime() - 86400000 * 30, new Date().getTime()]},
    },

    data() {
      return {
        selected_rows: [],
        line_chart_title: '',
        total: 0,
        series: [],
        detailFormData: {},
        batchUpdateForm: {},
        show_add_page: false,
        show_edit_page: false,
        show_batch_edit_page: false,
        show_detail_dialog: false,
        is_admin_role: false,
        user_name: '',
        roles: [],
        listQuery: {page: 1, limit: 20},
        active_dict: [{value: 1, label: '启用'}, {value: 2, label: '禁用'}],
        first_level_dict: [{value: '默认', label: '默认'}],
        rules_add: {
          first_level: [{required: true, message: '必填项', trigger: 'blur'}],
          second_level: [{required: true, message: '必填项', trigger: 'blur'}],
          active: [{required: true, message: '必填项', trigger: 'blur'}],
        },
      }
    },

    created() {
      this.user_name = this.$store.getters.name;
      this.roles = this.$store.getters.roles;
      this.is_admin_role = this.roles.includes('malfunction_admin')

    },
    methods: {
      headClass() {
        return 'text-align: center;background:#f5f7fa;'
      },
      formatDate(cellValue) {
        let time_long = cellValue;
        let res;
        if (time_long < 60) {
          res = parseInt(time_long) + '秒'
        } else if (60 < time_long && time_long < 3600) {
          res = parseInt(time_long / 60) + '分' + parseInt(time_long % 60) + '秒'
        } else if (3600 < time_long && time_long < 86400) {
          res = parseInt(time_long / 3600) + '时' + parseInt(time_long % 3600 / 60) + '分'
        } else if (time_long > 86400) {
          let h = parseInt(time_long % 86400)
          res = parseInt(time_long / 86400) + '天' + parseInt(h / 3600) + '时' + parseInt(h % 3600 / 60) + '分'
        }
        return res
      },
      clickDetailButtom(row) {
        this.show_detail_dialog = true
        getSubdivisionDetail({'subdivision': row.subdivision, 'time_range': this.time_range.toString()}).then(response => {
          this.series = response
          this.line_chart_title = row.subdivision
        })
      },
    }
  }
</script>
