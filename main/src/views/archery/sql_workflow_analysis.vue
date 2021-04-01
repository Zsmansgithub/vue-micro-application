<template>
  <div class="wrapper">
    <div>
      <div class="title">分析选项</div>
      <div class="form">
        <div class="upload">
          <div class="fileName" :style="{ 'pointer-events': fileName ? 'auto' : 'none' }">
            <span v-if="fileName">{{ fileName }}</span>
            <span v-else class="placeholder">SQL/MyBatis3 Mapper XML file,且不超过5Mb</span>
          </div>
          <div>
            <el-upload class="upload-demo" action="#" ref="upload" accept=".sql" :http-request="httpRequest"
              :before-upload="beforeUpload" :show-file-list="false">
              <el-button v-if="resultListAll.length" @click.stop="removeAnalyze" plain style="margin-left: 5px">移除
              </el-button>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <div>
          <el-select v-model="group_name" clearable filterable :disabled="!newAppForm.text" placeholder="请选择项目"
            @change="getSelInstances" style="width: 100%">
            <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="newAppForm.instance_name" placeholder="请选择实例" :disabled="!newAppForm.text"
            :loading="loading" clearable remote filterable :remote-method="searchFuzzy" @change="handleDb"
            style="width: 100%">
            <el-option-group v-for="group in instanceOptions" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div>
          <el-select placeholder="请选择数据库" :disabled="!newAppForm.text" clearable filterable
            v-model="newAppForm.db_name">
            <el-option v-for="item in dbOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <el-button type="primary" :disabled="!newAppForm.text" @click="analyze">开始分析</el-button>
        </div>
      </div>
    </div>
    <div class="search-table">
      <div class="search">
        <div class="text-title">sql列表</div>
        <div class="search-content">
          <el-input v-model="searchText" clearable @clear="doSearch" style="width: 120px;" placeholder="搜索"></el-input>
          <el-button @click="doSearch" type="primary">搜索</el-button>
        </div>
      </div>
      <div class="content">
        <el-table :data="resultList" border stripe highlight-current-row>
          <el-table-column label="SQLID" width="120" prop="sql_id"></el-table-column>
          <el-table-column label="SQL内容" prop="sql">
            <template slot-scope="scope">
              <!-- <div>{{scope.row.sql}}</div> -->
              <e_text :text="scope.row.sql" :tip="scope.row.sql" width="100%" height="23px" />
            </template>
          </el-table-column>
          <el-table-column v-if="
              resultList &&
                resultList.length &&
                Object.keys(this.resultList[0]).includes('report')
            " width="80" label="分析报告">
            <template slot-scope="scope">
              <div style="text-align: center;">
                <el-link :underline="false" type="primary" @click="showReport(scope.row.report)">查看</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-show="pages.total" :total="pages.total" :page.sync="pages.page" :limit.sync="pages.limit"
        style="padding-top: 5px;margin-top: 10px;" />
    </div>
  </div>
</template>
<script>
  import Pagination from "@/components/Pagination";
  import e_text from "@/views/itsm/components/system_avail_info/e_text.vue";
  import {
    doGenerate,
    doAnalyze,
    getSqlWorkflow,
    getGroupInstance,
    getSqlRollBackDb,
    instanceFuzzy,
    searchByInstance
  } from "@/api/archery/sql_workflow";
  export default {
    components: { Pagination, e_text },
    data() {
      return {
        fileName: null,
        group_name: undefined,
        groupOptions: [],
        newAppForm: {
          text: "", // 文件text
          instance_name: null, // 实例
          db_name: null // 数据库
        },
        pages: {
          total: 0,
          page: 1,
          limit: 20
        },
        searchText: null,
        resultListAll: [],
        resultListSearchAll: [],
        instanceOptions: [],
        dbOptions: [],
        loading: false
      };
    },
    computed: {
      resultList() {
        try {
          return (
            this.resultListSearchAll instanceof Array &&
            this.resultListSearchAll.slice(
              (this.pages.page - 1) * this.pages.limit,
              this.pages.page * this.pages.limit
            )
          );
        } catch (e) {
          console.error(e);
          return [];
        }
      }
    },
    mounted() {
      // 获取组
      getSqlWorkflow().then(res => {
        this.groupOptions = res.data;
      });
    },
    methods: {
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
            this.newAppForm.instance_name = "";
            this.dbOptions = [];
            this.newAppForm.db_name = undefined;
          })
          .catch(e => {
            console.error(e);
          });
      },
      // 获取数据库
      handleDb() {
        if (!this.newAppForm.instance_name) return;
        getSqlRollBackDb({
          instance_name: this.newAppForm.instance_name,
          resource_type: "database"
        }).then(res => {
          this.dbOptions = [];
          this.newAppForm.db_name = "";
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          this.dbOptions = res.data || [];
        });
        // 选择实例反选项目分组
        searchByInstance({ instance_name: this.newAppForm.instance_name })
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
            this.newAppForm.db_name = undefined;
            this.group_name = undefined;
            this.loading = false;
          })
          .catch(e => {
            console.error(e);
          });
      },
      beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message({
            message: "上传文件大小不能超过 5MB!",
            type: "error"
          });
          return false;
        }
        return isLt5M;
      },
      httpRequest(params) {
        const file = params.file;
        this.fileName = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = e => {
          this.newAppForm.text = e.target.result;
          this.generate();
        };
      },
      removeAnalyze() {
        this.fileName = null;
        this.$refs.upload.clearFiles();
        this.group_name = undefined;
        this.newAppForm = this.$options.data().newAppForm;
        this.resultListAll = [];
        this.resultListSearchAll = [];
      },
      doSearch() {
        const searchText = this.searchText.toString().toLowerCase();
        if (!searchText) {
          this.resultListSearchAll = [...this.resultListAll];
          return;
        }
        function isMarch(item) {
          let isMarch = false;
          for (let val of Object.values(item)) {
            if (
              val
                .toString()
                .toLowerCase()
                .includes(searchText)
            ) {
              isMarch = true;
              break;
            }
          }
          return isMarch;
        }
        this.resultListSearchAll = this.resultListAll.reduce((list, item) => {
          if (isMarch(item)) list.push(item);
          return list;
        }, []);
      },
      // 生成
      generate() {
        doGenerate({ text: this.newAppForm.text }).then(res => {
          this.searchText = null;
          this.resultListAll = res.rows;
          this.resultListSearchAll = res.rows;
          this.pages.total = res.total;
        });
      },
      // 分析
      analyze() {
        doAnalyze(this.newAppForm).then(res => {
          if (!res || res.status === 1) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          this.searchText = null;
          this.resultListAll = res.rows || [];
          this.resultListSearchAll = res.rows || [];
          this.pages.total = res.total || 0;
        });
      },
      // 分析报告
      showReport(report) {
        this.$alert(report, "分析报告", {
          confirmButtonText: "确定"
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '@/styles/borderLightBlue.scss';

  .wrapper {
    padding: 10px 20px;
  }

  .title {
    border-bottom: 1px solid #dcdfe6;
    padding: 10px 0;
  }

  .form {
    padding: 10px 0;
    display: flex;

    &>div {
      margin-right: 16px;
    }

    .upload {
      display: flex;

      .fileName {
        border: 1px solid #dcdfe6;
        border-radius: 3px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        padding: 0 8px;

        .placeholder {
          color: #dcdfe6;
        }
      }
    }
  }

  .search-table {
    @extend .border-light-blue;

    .search {
      display: flex;
      padding-bottom: 10px;

      .text-title {
        flex: 1;
        line-height: 30px;
      }

      .search-content {
        flex: 1;
        text-align: right;
      }
    }
  }
</style>