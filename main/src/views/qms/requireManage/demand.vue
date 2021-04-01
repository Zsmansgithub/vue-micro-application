<template>
    <div class="app-container">
        <transition name="fade-transform" mode="out-in">
            <div v-show="pages === 'list'">
                <div>
                    <el-form :inline="true">
                        <search-form :listQuerySearch.sync='listQuerySearch'>
                            <template v-slot:content>
                                <el-form-item label="部门">
                                    <depart :key="keys[0]" v-model="listQuery.project_category" />
                                </el-form-item>
                                <el-form-item label="项目名称">
                                    <projectcategory v-model="listQuery.project" />
                                </el-form-item>
                                <el-form-item label="需求编号">
                                    <el-input placeholder="请填写" v-model="listQuery.demand_num" />
                                </el-form-item>
                            </template>
                            <template v-slot:trigger>
                                <form-item :listQuerySearch="listQuerySearch">
                                    <el-form-item label="需求描述">
                                        <el-input placeholder="请填写" v-model="listQuery.demand_desc" />
                                    </el-form-item>
                                </form-item>
                                <form-item :listQuerySearch="listQuerySearch">
                                    <el-form-item label="状态">
                                        <pstatus :isDef="true" v-model="listQuery.demand_status" />
                                    </el-form-item>
                                </form-item>
                                <form-item :listQuerySearch="listQuerySearch">
                                    <el-form-item label="优先级">
                                        <demandLevel v-model="listQuery.demand_level" />
                                    </el-form-item>
                                </form-item>
                                <form-item :listQuerySearch="listQuerySearch">
                                    <el-form-item label="发布版本">
                                        <demandVersion v-model="listQuery.demand_version" />
                                    </el-form-item>
                                </form-item>
                                <form-item :listQuerySearch="listQuerySearch">
                                    <el-form-item label="需求创建时间">
                                        <el-date-picker v-model="listQuery.created_at"
                                            value-format="yyyy-MM-dd hh:mm:ss" type="daterange" range-separator="-"
                                            start-placeholder="开始日期" end-placeholder="结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </form-item>
                            </template>
                            <template v-slot:search>
                                <el-button class="filter-item" type="primary" @click="getList" icon="el-icon-search">搜索
                                </el-button>
                                <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain
                                    icon="el-icon-refresh" @click="handleReset">重置
                                </el-button>
                                <el-button class="filter-item" :disabled="!multipleSelection.length" @click="goTest"
                                    type="primary">
                                    批量提测
                                </el-button>
                                <el-button class="filter-item" @click="exports" type="primary" icon="el-icon-download">
                                    导出Excel
                                </el-button>
                            </template>
                        </search-form>
                    </el-form>
                </div>
                <el-table v-loading="loading" :data="tableData" row-key="demand_code" border
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="需求编号" width="150" align="center">
                        <template slot-scope="prop">
                            <el-link :underline="false" target="blank" type="primary"
                                :href="`https://jira.yto.net.cn/browse/${prop.row.demand_code}`">
                                <tip-text :classStr="'textO text1'" :text="prop.row.demand_code || defText"></tip-text>
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="需求概述" prop="demand_desc" show-overflow-tooltip min-width="200"
                        align="center" />
                    <el-table-column label="项目" prop="project_name" show-overflow-tooltip min-width="150"
                        align="center" />
                    <el-table-column label="应用" min-width="150" align="center">
                        <template slot-scope="prop">
                            <tip-text :classStr="'textO'" v-for="item in prop.row.demand_app"
                                :key="`${item.app_name}:${item.branch}`" :text="`${item.app_name}:${item.branch}`">
                            </tip-text>
                            <el-link :underline="false" target="blank" type="primary" @click="showDemandApp(prop.row)">
                                关联应用
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="优先级" width="70" align="center">
                        <template slot-scope="prop">
                            {{prop.row.demand_level && prop.row.demand_level.name || defText}}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="created_at" show-overflow-tooltip width="160" align="center" />
                    <el-table-column label="发布版本" prop="demand_version" width="100" align="center" />
                    <el-table-column label="需求状态" prop="demand_status" width="100" align="center" />
                    <el-table-column label="提测状态" width="100" align="center">
                        <template slot-scope="prop">
                            {{prop.row.test_status && prop.row.test_status.name || defText}}
                        </template>
                    </el-table-column>
                    <el-table-column label="开发人员" width="120" align="center">
                        <template slot-scope="prop">
                            <tip-text :classStr="'textO'" :text="prop.row.developer || defText"></tip-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="测试人员" width="120" align="center">
                        <template slot-scope="prop">
                            <tip-text :classStr="'textO'" :text="prop.row.tester || defText"></tip-text>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
                <AssociateApp :diaData="rowQuery" @save="getList" ref="appForm" />
            </div>
        </transition>
        <transition name="fade-transform" mode="out-in">
            <info-second v-show="pages === 'test'" :goBack="closeTest">
                <create-test @save="save" @close="closeTest" :requireData='multipleSelection' />
            </info-second>
        </transition>
    </div>
</template>

<script>
    import sessionListQuery from '@/components/mixins/sessionListQuery'
    import InfoSecond from "@/views/qms/components/InfoSecond";
    import Pagination from "@/components/Pagination";
    import SearchForm from '@/components/SearchForm';
    import FormItem from '@/components/SearchForm/FormItem';
    import tipText from "@/components/TipText/Tip_Text";
    import { depart, projectcategory, pstatus, demandLevel, demandVersion } from './../components';
    import AssociateApp from './../components/AssociateApp'
    import CreateTest from './../components/CreateTest'
    import { default as download } from './../components/download';

    import { demandSearch, downDexport } from '@/api/qms'
    export default {
        components: {
            InfoSecond,
            Pagination,
            SearchForm,
            FormItem,
            depart,
            projectcategory,
            pstatus,
            demandLevel,
            demandVersion,
            AssociateApp,
            CreateTest,
            tipText
        },
        mixins: [sessionListQuery],
        data() {
            return {
                listQuery: {
                    pageNum: 1,
                    pageSize: 20,
                    project_category: '', // 部门
                    project: {
                        project_num: '', //	项目编号
                        project_name: '', //	项目名称
                    },
                    demand_num: '', // 需求编号
                    demand_desc: '', //	需求描述
                    demand_status: '', // 状态
                    demand_level: '', // 优先级
                    demand_version: '', // 发布版本
                    created_at: '', // 需求创建时间
                },
                total: 0,
                tableData: [],
                keys: [],
                loading: false,
                listQuerySearch: false,
                defText: '--',
                multipleSelection: [],
                rowQuery: {},
                pages: 'list'
            }
        },
        created() {
            this.keys = [Date.now()]
            const project = this.$route.params.project;
            if (project) {
                this.listQuery.project = project
            }
        },
        mounted() {
            if (this.$route.params.appname) {
                this.form.appname = this.$route.params.appname
            }
            this.getList()
        },
        methods: {
            // 取消提测单
            closeTest() {
                this.pages = 'list'
            },
            // 提测单提交回调
            save() {
                this.page = 'list';
            },
            // 批量提测
            goTest() {
                let page = 'test';
                for (const val of this.multipleSelection) {
                    if (!val.demand_app.length) {
                        this.$message.warning(`${val.demand_code}等需求未绑定应用，请绑定后再提测`);
                        page = 'list'
                        break
                    }
                }
                this.pages = page;
            },
            // 导出
            exports() {
                const encode = (code) => {
                    code = code && encodeURI(code)
                    return code || ''
                }
                const listQuery = this.listQuery;
                const query = `project_num=${encode(listQuery.project.project_num)}&project_name=${encode(listQuery.project.project_name)}&demand_desc=${encode(listQuery.demand_desc)}&demand_level=${encode(listQuery.demand_level)}&demand_status=${encode(listQuery.demand_status)}&demand_num=${encode(listQuery.demand_num)}&demand_version=${encode(listQuery.demand_version)}&project_category=${encode(listQuery.project_category)}`;
                downDexport(query)
                    .then((res) => {
                        download(res)
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            },
            // 表格行选中
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 查询数据
            getList() {
                let listQuery = this.listQuery;
                listQuery.project_name = listQuery.project.project_name;
                demandSearch(listQuery)
                    .then((res) => {
                        if (res && res.status * 1 === 0) {
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
                this.keys = [Date.now()]
                this.getList()
            },
            // 关联应用弹窗
            showDemandApp(row) {
                this.rowQuery = this.$utils.index.deepClone(row);
                this.$refs.appForm.show();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .filter-item {
        margin-bottom: 20px;
    }

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
