<template>
    <div class="app-container">
        <div>
            <el-form :inline="true">
                <search-form :listQuerySearch.sync='listQuerySearch'>
                    <template v-slot:content>
                        <el-form-item label="开发组">
                            <development-sel v-model="listQuery.developmentteam" />
                        </el-form-item>
                        <el-form-item label="产品">
                            <product v-model="listQuery.product" />
                        </el-form-item>
                        <el-form-item label="仓库">
                            <search-gits v-model="listQuery.warehouse" />
                        </el-form-item>
                        <el-form-item label="项目">
                            <pstatus v-model="listQuery.project" />
                        </el-form-item>
                    </template>
                    <template v-slot:trigger>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="应用类型">
                                <apptype-sel v-model="listQuery.apptype" />
                            </el-form-item>
                        </form-item>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="应用等级">
                                <applevel-sel v-model="listQuery.applevel" />
                            </el-form-item>
                        </form-item>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="环境">
                                <env-sel v-model="listQuery.env" />
                            </el-form-item>
                        </form-item>
                    </template>
                    <template v-slot:search>
                        <el-button class="filter-item" type="primary" @click="getList" icon="el-icon-search">搜索
                        </el-button>
                        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain
                            icon="el-icon-refresh" @click="handleReset">重置
                        </el-button>
                    </template>
                </search-form>
            </el-form>
        </div>
        <el-table v-loading="listLoading" :data="tableData" border>
            <el-table-column label="编号" prop="id" width="50" align="center" />
            <el-table-column min-width="120">
                <template slot="header">
                    <div style="text-align: center;">应用名</div>
                    <div style="text-align: center;">部署服务名</div>
                </template>
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="goDetail(scope.row)">
                        <tip-text :classStr="'textO text1'" :text="scope.row.app_name || defText"></tip-text>
                    </el-link>
                    <tip-text :classStr="'textO text2'" :text="scope.row.deploymentservicename || defText"></tip-text>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center">
                <template slot="header">
                    <div>应用说明</div>
                    <div>应用类型</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.app_note || defText}}</div>
                    <div class="text2">{{ scope.row.applicationtype || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center">
                <template slot="header">
                    <div>开发组</div>
                    <div>产品</div>
                </template>
                <template slot-scope="scope">
                    <div class="text0 text1">{{ scope.row.developmentteam || defText}}</div>
                    <div class="text0 text2">{{ scope.row.product || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="80">
                <template slot="header">
                    <div style="text-align: center;">仓库</div>
                    <div style="text-align: center;">关联项目</div>
                </template>
                <template slot-scope="scope">
                    <tip-text :classStr="'textO text1'" :text="scope.row.warehouse || defText"></tip-text>
                    <tip-text :classStr="'textO text2'" :text="scope.row.relateditems || defText"></tip-text>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center">
                <template slot="header">
                    <div>应用等级</div>
                    <div>IP及端口</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.applicationlevel || defText}}</div>
                    <div class="text2">{{ scope.row.ip || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="120">
                <template slot="header">
                    <div style="text-align: center;">健康状态</div>
                    <div style="text-align: center;">pom</div>
                </template>
                <template slot-scope="scope" show-overflow-tooltip>
                    <div class="text1">{{ scope.row.healthstatus || defText}}</div>
                    <tip-text :classStr="'textO text2'" :text="scope.row.pom || defText"></tip-text>
                </template>
            </el-table-column>
            <el-table-column width="90" align="center">
                <template slot="header">
                    <div>构建分支</div>
                    <div>部署环境</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.buildbranch || defText}}</div>
                    <div class="text2">{{ scope.row.deploymentenvironment || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center">
                <template slot="header">
                    <div>构建部署时间</div>
                    <div>构建部署状态</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.builddeploymenttime || defText}}</div>
                    <div class="text2">{{ scope.row.builddeployment || defText}}</div>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
    </div>
</template>

<script>
    import sessionListQuery from '@/components/mixins/sessionListQuery'
    import Pagination from "@/components/Pagination";
    import SearchForm from '@/components/SearchForm';
    import FormItem from '@/components/SearchForm/FormItem';
    import tipText from "@/components/TipText/Tip_Text";
    import { developmentSel, product, pstatus, searchGits, apptypeSel, applevelSel, envSel } from './../components';

    import { bulidMentList } from '@/api/qms'
    export default {
        components: {
            Pagination,
            developmentSel,
            product,
            pstatus,
            searchGits,
            apptypeSel,
            applevelSel,
            envSel,
            tipText,
            SearchForm,
            FormItem
        },
        mixins: [sessionListQuery],
        data() {
            return {
                listQuery: {
                    pageNum: 1,
                    pageSize: 20,
                    developmentteam: '', // 开发组
                    product: '', // 产品
                    warehouse: '', // 仓库
                    project: '', // 项目
                    apptype: '', // 应用类型
                    applevel: '', // 应用等级
                    env: '', // 环境
                    appname: ''
                },
                total: 0,
                tableData: [],
                listLoading: false,
                listQuerySearch: false,
                defText: '--'
            }
        },
        mounted() {
            if (this.$route.params.appname) {
                this.form.appname = this.$route.params.appname
            }
            this.getList()
        },
        methods: {
            goDetail(row) {
                this.$router.push({ name: 'buildHistory', params: { row } })
            },
            getList() {
                bulidMentList(this.listQuery)
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
            handleReset() {
                this.listQuery = this.$options.data().listQuery;
                this.getList()
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

    // .text1 {}

    .text2 {
        color: rgb(132, 146, 166);
    }
</style>