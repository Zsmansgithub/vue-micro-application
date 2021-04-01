<template>
    <info-second :goBack="goList">
        <div>
            <card-detail typeCard='success' title="基础信息" icon="detail_info">
                <div>
                    <div class="info">
                        <el-row>
                            <el-col :span="12">
                                <div><b>应用名：</b>{{ listQuery.historyBaseInfo.app_name }}</div>
                            </el-col>
                            <el-col :span="12">
                                <div><b>应用等级：</b>{{ listQuery.historyBaseInfo.applicationlevel }}</div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <div><b>部署服务名：</b>{{ listQuery.historyBaseInfo.deploymentservicename }}</div>
                            </el-col>
                            <el-col :span="12">
                                <div><b>仓库：</b>{{ listQuery.historyBaseInfo.deploymentservicename }}</div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </card-detail>
            <card-detail typeCard='primary' title="其他信息" icon="detail_form">
                <el-table v-loading="loading" :data="tableData" border>
                    <el-table-column label="构建部署时间" prop='created_at' />
                    <el-table-column label="构建编号" prop='report_id' />
                    <el-table-column label="分支" prop='branch' />
                    <el-table-column label="部署环境" prop='env' />
                    <el-table-column label="构建部署状态" prop='status'>
                        <template slot-scope="scope">
                            <el-tag :type="`${scope.row.status === '成功' ? 'success' : 'danger'}`">
                                {{scope.row.status}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="测试" prop='status'>
                        <template slot-scope="scope">
                            <el-link :underline="false" type="primary" @click="showReport">质量报告</el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </card-detail>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum"
                :limit.sync="listQuery.pageSize" style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
        </div>
    </info-second>
</template>
<script>
    import InfoSecond from "@/views/qms/components/InfoSecond";
    import Pagination from "@/components/Pagination";
    import CardDetail from "@/components/CardDetail";
    import sessionListQuery from "@/components/mixins/sessionListQuery";

    import { buildReport } from '@/api/qms'
    export default {
        components: {
            InfoSecond,
            Pagination,
            CardDetail
        },
        mixins: [sessionListQuery],
        data() {
            return {
                listQuery: {
                    pageNum: 1,
                    pageSize: 20,
                    job_name: '',
                    status: '',
                    historyBaseInfo: {},
                    routeParams: ''
                },
                total: 0,
                tableData: [],
                loading: false,
            }
        },
        created() {
            if (this.$route.params.row) {
                this.listQuery.historyBaseInfo = this.$route.params.row;
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            // 返回列表页
            goList() {
                this.$router.push('buildList')
            },
            // 历史数据
            getList() {
                this.listQuery.job_name = this.listQuery.historyBaseInfo.app_name || '';
                this.loading = true;
                const lisquery = {
                    pageNum: this.listQuery.pageNum,
                    pageSize: this.listQuery.pageSize,
                    job_name: this.listQuery.job_name,
                    status: '',
                }
                buildReport(lisquery)
                    .then((res) => {
                        this.loading = false;
                        if (res && res.status * 1 === 1) {
                            this.total = res.data.count || 0;
                            this.tableData = res.data.results || [];
                        } else {
                            this.$mesage.error(res.message || '出错了')
                        }
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            },
            // 质量报告
            showReport() {

            }
        }
    }
</script>
<style lang="scss" scoped>
    .info {
        line-height: 30px;
    }
</style>