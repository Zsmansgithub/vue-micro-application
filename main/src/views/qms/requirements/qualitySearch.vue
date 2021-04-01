<template>
    <div class="app-container">
        <div>
            <el-form :inline="true">
                <search-form :listQuerySearch.sync='listQuerySearch'>
                    <template v-slot:content>
                        <el-form-item label="部门">
                            <depart defaultValue="noFirst" v-model="listQuery.dep" />
                        </el-form-item>
                        <el-form-item label="开发组">
                            <development-sel v-model="listQuery.devgrp" />
                        </el-form-item>
                        <el-form-item label="应用">
                            <el-input v-model="listQuery.app" />
                        </el-form-item>
                        <el-form-item label="语言">
                            <el-select placeholder="请选择" clearable v-model="listQuery.language">
                                <el-option label="java" value="java"></el-option>
                                <el-option label=".NET" value=".NET"></el-option>
                                <el-option label="html" value="html"></el-option>
                                <el-option label="other" value="other"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <template v-slot:trigger>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="项目">
                                <el-input placeholder="请填写" v-model="listQuery.project" />
                            </el-form-item>
                        </form-item>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="负责人">
                                <el-input placeholder="请填写" v-model="listQuery.owner" />
                            </el-form-item>
                        </form-item>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="应用等级">
                                <el-select v-model="listQuery.level">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="A" value="A"></el-option>
                                    <el-option label="B" value="B"></el-option>
                                    <el-option label="C" value="C"></el-option>
                                    <el-option label="D" value="D"></el-option>
                                    <el-option label="A(影响核心系统应用)" value="A(影响核心系统应用)"></el-option>
                                </el-select>
                            </el-form-item>
                        </form-item>
                        <form-item :listQuerySearch="listQuerySearch">
                            <el-form-item label="状态">
                                <el-select v-model="listQuery.sys">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="运行中" value="运行中"></el-option>
                                    <el-option label="下线" value="下线"></el-option>
                                    <el-option label="审核中" value="审核中"></el-option>
                                </el-select>
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
        <el-table v-loading="listLoading" :data="tableData" border>
            <el-table-column label="应用" prop="id" min-width="200" align="center">
                <template slot-scope="scope">
                    <el-link :underline="false" target="_blank" :href="scope.row.sonarURL" type="primary">
                        <tip-text :classStr="'textO text1'" :text="scope.row.app || defText"></tip-text>
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center">
                <template slot="header">
                    <div style="text-align: center;">构建状态</div>
                    <div style="text-align: center;">质量分<el-tooltip>
                            <div slot="content">
                                <div>A:静态扫描－阻塞：每千行出现1个扣5分，权重5分;</div>
                                <div>B:静态扫描－严重：每千行出现1个扣5分，权重5分;</div>
                                <div>C:API注释得分 = API注释*权重， 权重5分</div>
                                <div>D:单测成功率得分 = 单测*权重 ， 权重5分;</div>
                                <div>E:分支覆盖得分 = 分支覆盖*权重， 权重10分;</div>
                                <div> F:代码重复度得分：权重10分；</div>
                                <div>IF(重复度&lt;=5%,满分），IF(重复度&gt;=10%,0分），Else ( 每增加 1% 扣 20%);</div>
                                <div>G: 安全扫描漏洞： 权重10分; 每千行出现1个critical 扣5分， 每千行出现1个high 扣3分， 千行出现1个meduim 扣2分</div>
                                <div>Z= A + B + C + D + E + F + G</div>
                            </div><i class="el-icon-warning" style="color: #5cb6ff;"></i>
                        </el-tooltip>
                    </div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{scope.row.sonarBuildStatus || defText}}</div>
                    <div class="text2">{{scope.row.QualityScore|| defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="90" align="center">
                <template slot="header">
                    <div>负责人</div>
                    <div>有效行</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.owner || defText}}</div>
                    <div class="text2">{{ scope.row.validateRow || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center">
                <template slot="header">
                    <div>API注释率%</div>
                    <div>重复率%</div>
                </template>
                <template slot-scope="scope">
                    <div class="text0 text1">{{ scope.row.commentRate || defText}}</div>
                    <div class="text0 text2">{{ scope.row.duplications || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="70" align="center">
                <template slot="header">
                    <div style="text-align: center;">阻塞</div>
                    <div style="text-align: center;">严重</div>
                </template>
                <template slot-scope="scope">
                    <tip-text :classStr="'textO text1'" :text="scope.row.block || defText"></tip-text>
                    <tip-text :classStr="'textO text2'" :text="scope.row.critical || defText"></tip-text>
                </template>
            </el-table-column>
            <el-table-column width="90" align="center">
                <template slot="header">
                    <div>主要</div>
                    <div>安全漏洞</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.major || defText}}</div>
                    <el-link :underline="false" @click="showLeaks(scope.row)" type="primary">
                        <div>{{ scope.row.vulnerabilities || defText}}</div>
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center">
                <template slot="header">
                    <div style="text-align: center;">有效漏洞</div>
                    <div style="text-align: center;">UT成功率</div>
                </template>
                <template slot-scope="scope" show-overflow-tooltip>
                    <div class="text1">{{ scope.row.effectiveVulne || defText}}</div>
                    <tip-text :classStr="'textO text2'" :text="scope.row.unitSucRate || defText"></tip-text>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center">
                <template slot="header">
                    <div>UT覆盖率-行</div>
                    <div>UT覆盖率-分支</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.coverage || defText}}</div>
                    <div class="text2">{{ scope.row.branchCoverage || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="140" align="center">
                <template slot="header">
                    <div>接口总数</div>
                    <div>接口自动化覆盖率</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.interfaceCnt || defText}}</div>
                    <div class="text2">{{ scope.row.interfaceAccRate || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center">
                <template slot="header">
                    <div>线上故障</div>
                    <div>Error数量</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.onlineFault || defText}}</div>
                    <div class="text2">{{ scope.row.alarmError || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center">
                <template slot="header">
                    <div>Info数量</div>
                    <div>应用等级</div>
                </template>
                <template slot-scope="scope">
                    <div class="text1">{{ scope.row.alarmInfo || defText}}</div>
                    <div class="text2">{{ scope.row.level || defText}}</div>
                </template>
            </el-table-column>
            <el-table-column width="160" label="构建时间" prop="sonarBuildDate" align="center">
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            style="padding-top: 5px;margin-top: 10px;" @pagination="getList" />
        <el-dialog title="安全漏洞确认" :visible.sync="dialogVisible" width="30%" :before-close="closeLeaks">
            <leaks :row="leakRow" :leaks="leaks" @closeLeaks="closeLeaks" @updated="updated"></leaks>
        </el-dialog>
    </div>
</template>

<script>
    import sessionListQuery from '@/components/mixins/sessionListQuery'
    import Pagination from "@/components/Pagination";
    import SearchForm from '@/components/SearchForm';
    import FormItem from '@/components/SearchForm/FormItem';
    import tipText from "@/components/TipText/Tip_Text";
    import { depart, developmentSel, product, pstatus, searchGits, apptypeSel, applevelSel, envSel } from './../components';
    import { default as download } from './../components/download';
    import leaks from './../components/leaks';

    import { qualityDatas, downQuality, leaksSearch } from '@/api/qms'
    export default {
        components: {
            Pagination,
            depart,
            developmentSel,
            product,
            pstatus,
            searchGits,
            apptypeSel,
            applevelSel,
            envSel,
            tipText,
            leaks,
            SearchForm,
            FormItem
        },
        mixins: [sessionListQuery],
        data() {
            return {
                listQuery: {
                    pageNum: 1,
                    pageSize: 20,
                    dep: '', // 部门
                    devgrp: '', // 开发组
                    app: '', // 应用
                    project: '', // 语言
                    owner: '', // 项目
                    level: '', // 负责人
                    language: '', // 应用等级
                    sys: '' // 状态
                },
                total: 0,
                tableData: [],
                listLoading: false,
                leaks: [],
                dialogVisible: false,
                listQuerySearch: false,
                leakRow: '',
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
            // 漏洞更新成功
            updated() {
                this.getList()
                this.dialogVisible = false;
            },
            // 查看漏洞
            showLeaks(row) {
                this.leakRow = row;
                let params = {
                    appName: row.app
                };
                leaksSearch(params).then((res) => {
                    if (res && res.status * 1 == 0 && res.data.length) {
                        this.leaks = res.data || [];
                        this.dialogVisible = true;
                    } else {
                        this.leaks = [];
                        this.$message.warning('未找到该漏洞的信息');

                    }
                });
            },
            closeLeaks() {
                this.dialogVisible = false;
            },
            // 导出
            exports() {
                // const encode = (code) => {
                //     code = code && encodeURI(code)
                //     return code || ''
                // }
                const listQuery = this.listQuery;
                const query = `dep=${listQuery.dep}&devgrp=${listQuery.devgrp}&app=${listQuery.app}&project=${listQuery.project}&owner=${listQuery.owner}&level=${listQuery.level}&language=${listQuery.language}&sys=${listQuery.sys}`;
                downQuality(query)
                    .then((res) => {
                        download(res)
                    })
                    .catch((e) => {
                        console.error(e)
                    })
            },
            getList() {
                qualityDatas(this.listQuery)
                    .then((res) => {
                        if (res && res.status * 1 === 0) {
                            const { data, total } = res || {}
                            this.total = total || 0;
                            this.tableData = data || [];
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
