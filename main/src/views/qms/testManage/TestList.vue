<template>
    <div class="app-container">

        <transition name="fade-transform" mode="out-in">
            <div v-show="pages === 'list'">
                <div>
                    <el-form :inline="true">
                        <el-form-item label="项目">
                            <pstatus v-model="listQuery.project_id" />
                        </el-form-item>
                        <el-form-item label="状态">
                            <test-status v-model="listQuery.status" />
                        </el-form-item>

                        <el-button class="filter-item" type="primary" @click="getList" icon="el-icon-search">搜索
                        </el-button>
                        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain
                            icon="el-icon-refresh" @click="handleReset">重置
                        </el-button>
                        <el-button class="filter-item" type="primary" @click="addTest">新增
                        </el-button>
                    </el-form>
                </div>
                <el-table v-loading="listLoading" :data="tableData" border>
                    <el-table-column label="编号" prop="id" width="50" align="center" />
                    <el-table-column label="提测主题" min-width="150" align="center">
                        <template slot-scope="scope">
                            <tip-text :classStr="'textO'" :text="scope.row.demand_test_title || defText"></tip-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="项目" min-width="150" align="center">
                        <template slot-scope="scope">
                            <tip-text :classStr="'textO'" :text="scope.row.project_name || defText"></tip-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="需求" min-width="150" align="center">
                        <template slot-scope="scope">
                            <tip-text :classStr="'textO'" :text="scope.row.demand_desc || defText"></tip-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="提测时间" prop="created_at" width="160" align="center" />
                    <el-table-column label="提测环境" prop="test_env" width="100" align="center" />
                    <el-table-column label="提测人" prop="raise_tester" width="95" align="center" />
                    <el-table-column label="测试人" prop="tester" width="95" align="center" />
                    <el-table-column label="测试状态" prop="status" width="90" align="center" />
                    <el-table-column label="流水线方案" prop="pipeline_scheme" width="120" align="center" />
                    <el-table-column label="最后状态" prop="build_status" width="90" align="center" />
                    <el-table-column label="构建部署时间" prop="build_at" width="160" align="center" />
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-tooltip content="确认提测单">
                                <el-button type="primary" @click="goDetail(scope.row)" size='mini' circle
                                    icon='el-icon-check'>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="构建部署">
                                <el-button type="success" @click="goBale(scope.row.id)" size='mini' circle
                                    icon='el-icon-s-platform'>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
            </div>
        </transition>
        <transition name="fade-transform" mode="out-in">
            <info-second v-show="pages === 'test'" :goBack="closeSecond">
                <create-test @close="closeSecond" />
            </info-second>
        </transition>
        <transition name="fade-transform" mode="out-in">
            <info-second v-show="pages === 'bale'" :goBack="closeSecond">
                <build-and-deploy :testId="testId" @close="closeSecond" />
            </info-second>
        </transition>
    </div>
</template>

<script>
    import sessionListQuery from '@/components/mixins/sessionListQuery';
    import InfoSecond from "@/views/qms/components/InfoSecond";
    import BuildAndDeploy from "@/views/qms/components/BuildAndDeploy";
    import Pagination from "@/components/Pagination";
    import tipText from "@/components/TipText/Tip_Text";
    import { TestStatus, pstatus } from './../components';
    import CreateTest from './../components/CreateTest';

    import { getTestList } from '@/api/qms'
    export default {
        components: { Pagination, TestStatus, pstatus, CreateTest, tipText, InfoSecond, BuildAndDeploy },
        mixins: [sessionListQuery],
        data() {
            return {
                listQuery: {
                    pageNum: 1,
                    pageSize: 20,
                    status: '', // 状态
                    project_id: '', // 项目
                },
                total: 0,
                tableData: [],
                listLoading: false,
                defText: '--',
                pages: 'list',
                testId: ''
            }
        },
        mounted() {
            if (this.$route.params.appname) {
                this.form.appname = this.$route.params.appname
            }
            this.getList()
        },
        methods: {
            // 构建部署
            goBale(id) {
                this.testId = id;
                this.pages = 'bale';
            },
            // 提测单取消
            closeSecond() {
                this.pages = 'list'
            },
            // 新建提测单
            addTest() {
                this.pages = 'test'
            },
            // 详情页跳转
            goDetail(row) {
                this.$router.push({ name: 'testDetail', params: { row } })
            },
            // 列表数据
            getList() {
                getTestList(this.listQuery)
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

    .text1 {}

    .text2 {
        color: rgb(132, 146, 166);
    }
</style>