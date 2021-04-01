<template>
  <div class="app-container">
    <div>
      <el-form :inline="true">
        <el-form-item label="开发组">
          <development-sel v-model="listQuery.projectteam_id" />
        </el-form-item>
        <el-form-item label="产品">
          <product v-model="listQuery.product_id" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="listQuery.created_at" value-format="yyyy-MM-dd" type="date"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>

        <el-button class="filter-item" type="primary" @click="getList" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain icon="el-icon-refresh"
                   @click="handleReset">重置
        </el-button>
        <el-button class="filter-item" type="primary" @click="showAdd">新建仓库</el-button>
      </el-form>
    </div>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="仓库编号" prop="id" width="80" align="center" />
      <el-table-column width="120" align="center">
        <template slot="header">
          <div style="text-align: center;">开发组</div>
          <div style="text-align: center;">产品</div>
        </template>
        <template slot-scope="scope">
          <div class="text1">{{scope.row.projectteam || defText}}</div>
          <div class="text2">{{scope.row.productname || defText}}</div>
        </template>
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <div style="text-align: center;">仓库名</div>
          <div style="text-align: center;">仓库地址</div>
        </template>
        <template slot-scope="scope">
          <tip-text :classStr="'textO text1'" :text="scope.row.name || defText" />
          <tip-text :classStr="'textO text2'" :text="scope.row.http_url_to_repo || defText" />
        </template>
      </el-table-column>
      <el-table-column min-width="200">
        <template slot="header">
          <div style="text-align: center;">仓库描述</div>
          <div style="text-align: center;">使用项目</div>
        </template>
        <template slot-scope="scope">
          <tip-text :classStr="'textO text1'" :text="scope.row.description || defText" />
          <tip-text :classStr="'textO text2'" :text="scope.row.projectname instanceof Array && scope.row.projectname.join(',') || defText" />
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot="header">
          <div style="text-align: center;">仓库管理员</div>
          <div style="text-align: center;">仓库状态</div>
        </template>
        <template slot-scope="scope">
          <div class="text1">{{scope.row.admin || defText}}</div>
          <div class="text2">{{scope.row.gitlabstatus || defText}}</div>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center">
        <template slot="header">
          <div style="text-align: center;">创建时间</div>
          <div style="text-align: center;">最后更新时间</div>
        </template>
        <template slot-scope="scope">
          <div class="text2">{{scope.row.created_at || defText}}</div>
          <div class="text1">{{scope.row.updated_at || defText}}</div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot="header">
          <div style="text-align: center;">代码行数</div>
          <div style="text-align: center;">分支</div>
        </template>
        <template slot-scope="scope">
          <div class="text1">{{scope.row.code_num || defText}}</div>
          <el-link :underline="false" type="primary" @click="showBranch(scope.row)">
            <div>{{scope.row.branch_num || defText}}</div>
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
    <el-dialog title="新建仓库" :visible.sync="visible">
      <create-git-project @close="closeCreate" @created="createSuccess"></create-git-project>
    </el-dialog>
    <el-drawer
      :title="gitTitle"
      :visible.sync="drawerVisible"
      size="900px"
    >
      <el-table border :data="drawerData">
        <el-table-column label="分支名称" prop="branchname" min-width="200"></el-table-column>
        <el-table-column label="最后更新时间" prop="updated_at" align="center" width="160">
          <template slot-scope="prop">
            {{prop.row.updated_at | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center" width="160">
          <template slot-scope="prop">
            {{prop.row.created_at | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="分支状态" prop="merged" align="center" width="100"></el-table-column>
        <el-table-column label="创建人" prop="merged" align="center" width="120"></el-table-column>
        <!--            <el-table-column lebel="操作" min-width="100">-->
        <!--              <template slot-scope="scope">-->

        <!--              </template>-->
        <!--            </el-table-column>-->
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
  import sessionListQuery from '@/components/mixins/sessionListQuery';
  import Pagination from "@/components/Pagination";
  import tipText from "@/components/TipText/Tip_Text";
  import CreateGitProject from "@/views/qms/components/CreateGitProject";
  import { developmentSel, product } from './../components';

  import { searchGits, seachbranch } from '@/api/qms'
  export default {
    components: { Pagination, developmentSel, product, tipText, CreateGitProject },
    mixins: [sessionListQuery],
    data() {
      return {
        listQuery: {
          pageNum: 1,
          pageSize: 20,
          projectteam_id: '', // 开发组
          product_id: '',// 产品
          created_at: ''// 创建时间
        },
        total: 0,
        tableData: [],
        loading: false,
        defText: '--',
        visible: false,
        gitTitle: undefined,
        drawerVisible: false,
        drawerData: [],
        newAppform: {}
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 新增弹窗
      showAdd() {
        this.visible = true;
      },
      // 关闭弹窗
      closeCreate() {
        this.visible = false;
      },
      // 创建成功回调
      createSuccess() {
        this.getList()
        this.closeCreate()
      },
      // 查看仓库分支
      showBranch(row) {
        seachbranch({git_id: 120}).then((res) => {
          if(res && res.status * 1 === 1) {
            this.drawerData = res.data || [];
            this.drawerVisible = true;
            this.gitTitle = row.name.toString();
          } else {
            this.$message.error(res.message || '出错了');
          }
        })
          .catch((e) => {
            console.error(e)
          })
      },
      // 获取列表数据
      getList() {
        searchGits(this.listQuery)
          .then((res) => {
            if (res && res.status * 1 === 1) {
              const { data } = res || {}
              this.total = data.count || 0;
              this.tableData = data.results || [];
            } else {
              this.$message.error(res.message || "出错了")
            }
          })
          .catch((e) => {
            console.error(e)
          })
      },
      // 重置
      handleReset() {
        this.listQuery = this.$options.data().listQuery;
        this.getList()
      },
    },
    filters: {
      // 格式化时间
      formatTime(date) {
        if(!date) {
          return '';
        }
        let t = '';
        try {
          const time = new Date(date);
          const {y,m,d,h,i,s} = {
            y: time.getFullYear(),
            m: time.getMonth() + 1,
            d: time.getDate(),
            h: time.getHours(),
            i: time.getMinutes(),
            s: time.getSeconds()
          }
          t = `${y}-${m > 9 ? m : `0${m}`}-${d > 9 ? d : `0${9}`} ${h > 9 ? h:`0${h}`}:${i > 9 ? i:`0${i}`}:${s > 9 ? s:`0${s}`}`
        } catch (e) {
          return t
        }
        return t
      }
    }
  }
</script>

<style lang="scss" scoped>
  .textO {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .text1 {}

  .text2 {
    color: rgb(132, 146, 166);
  }
  /deep/ .el-drawer__header {
    &>span {
      outline: none;
    }
  }
</style>
