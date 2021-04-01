<template>
    <div class="app-container">
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
                        <el-form-item label="项目状态">
                            <pstatus :key="keys[1]" v-model="listQuery.project_status" />
                        </el-form-item>
                    </template>
                    <template v-slot:trigger>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="项目经理">
                                <el-input placeholder="请填写项目经理" v-model="listQuery.project_manager" />
                            </el-form-item>
                        </form-item>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="立项时间">
                                <el-date-picker v-model="listQuery.project_approval_at"
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
                        <el-button class="filter-item" @click="exports" type="primary" icon="el-icon-download">
                            导出Excel
                        </el-button>
                    </template>
                </search-form>
            </el-form>
        </div>
        <el-table v-loading="loading" @row-click="handleRow" :data="tableData" border>
            <el-table-column label="需求编号" prop="project_num" min-width="120" align="center" />
            <el-table-column label="项目名称" prop="project_name" min-width="300" align="center" />
            <el-table-column label="项目状态" min-width="120" align="center">
                <template slot-scope="prop">
                    {{prop.row.project_status && prop.row.project_status.name || defText}}
                </template>
            </el-table-column>
            <el-table-column label="项目经理" prop="project_manager" min-width="120" align="center" />
            <el-table-column label="立项时间" prop="created_at" min-width="160" align="center" />
            <el-table-column label="项目开始时间" prop="project_start_at" min-width="160" align="center" />
            <el-table-column label="项目结束时间" min-width="160" align="center">
                <template slot-scope="prop">
                    {{prop.row.project_end_at || defText}}
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
    </div>
</template>

<script>
    import sessionListQuery from '@/components/mixins/sessionListQuery';
    import Pagination from '@/components/Pagination';
    import SearchForm from '@/components/SearchForm';
    import FormItem from '@/components/SearchForm/FormItem';
    import { depart, projectcategory, pstatus } from './../components';
    import { default as download } from './../components/download';

    import { projectList, downProject } from '@/api/qms'
    export default {
        components: { Pagination, depart, projectcategory, pstatus, SearchForm, FormItem },
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
                    project_status: '', // 项目状态
                    project_manager: '', //	项目经理
                    project_approval_at: '', // 立项时间
                },
                total: 0,
                tableData: [],
                keys: [],
                loading: false,
                listQuerySearch: false,
                defText: '--',
            }
        },
        created() {
            this.keys = [Date.now(), `${Date.now()}1`]
        },
        mounted() {
            if (this.$route.params.appname) {
                this.form.appname = this.$route.params.appname
            }
            this.getList()
        },
        methods: {
            // 需求列表跳转
            handleRow(row) {
                console.log(row)
                this.$router.push({
                    name: 'demand',
                    params: {
                        project: {
                            project_name: row.project_name,
                            project_num: row.project_num
                        }
                    }
                })
            },
            // 导出
            exports() {
                const encode = (code) => {
                    code = code && encodeURI(code)
                    return code || ''
                }
                const listQuery = this.listQuery;
                const query = `project_num=&project_name=${encode(listQuery.project.project_name)}&project_status=${encode(listQuery.project_status)}&project_manager=${encode(listQuery.project_manager)}&project_category=${encode(listQuery.project_category)}&export_select=true`;
                downProject(query)
                    .then((res) => {
                        download(res)
                    })
                    .catch((e) => {
                        console.error(e)
                    })

            },
            // 数据查询
            getList() {
                let listQuery = this.listQuery;
                listQuery.project_num = listQuery.project.project_num;
                projectList(listQuery)
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
                this.keys = [Date.now(), `${Date.now()}1`]
                this.getList()
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

    .text1 {}

    .text2 {
        color: rgb(132, 146, 166);
    }
</style>